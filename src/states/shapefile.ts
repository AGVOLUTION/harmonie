import { shape } from "../utils/parse.js";
import { reprojectFeature, groupByFLIK } from "../utils/geometryHelpers.js";
import queryComplete from "../utils/queryComplete.js";
import Field from "../Field.js";
import type { HarmonieQuery, ShapefileMapping } from "../utils/types.js";

export default async function shapefile(query: HarmonieQuery) {
  const incomplete = queryComplete(query, ["shp", "dbf", "prj"]);
  if (incomplete) throw new Error(incomplete);
  if (!query.mapping) query.mapping = {};
  // parse the shape file information
  const geometries = await shape(query.shp, query.dbf, query.encoding);
  // reproject coordinates into web mercator
  geometries.features = geometries.features.map((f) =>
    reprojectFeature(f, query.prj)
  );

  // as we don't know anything about the structure of the shape files,
  // we just make some assumptions based on the following information
  const {
    FieldBlockNumber = "",
    referenceDate = "",
    NameOfField = "",
    NumberOfField = "",
    Area = "",
    PartOfField = "",
    CropSpeciesCode = "",
    Name = "",
  } = query.mapping as ShapefileMapping;

  const getValue = (
    prop: string | ((properties: any) => any) | undefined,
    properties: any
  ) => {
    if (typeof prop === "function") return prop(properties);
    if (typeof prop === "string") return properties[prop];
    return undefined;
  };

  const subplots = geometries.features.map((plot, count) => {
    if (!plot.properties) plot.properties = {};

    return new Field({
      id: `harmonie_${count}_${getValue(FieldBlockNumber, plot.properties)}`,
      referenceDate: getValue(referenceDate, plot.properties),
      NameOfField: getValue(NameOfField, plot.properties),
      NumberOfField: getValue(NumberOfField, plot.properties) || count,
      Area: getValue(Area, plot.properties),
      FieldBlockNumber: getValue(FieldBlockNumber, plot.properties),
      PartOfField: getValue(PartOfField, plot.properties),
      SpatialData: plot,
      Cultivation: {
        PrimaryCrop: {
          CropSpeciesCode: getValue(CropSpeciesCode, plot.properties),
          Name: getValue(Name, plot.properties),
        },
      },
    });
  });

  // finally, group the parts of fields by their FLIK and check whether they are
  // actually seperate parts of fields
  return groupByFLIK(subplots);
}

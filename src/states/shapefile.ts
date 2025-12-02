import { shape } from "../utils/parse.js";
import { reprojectFeature, groupByFLIK } from "../utils/geometryHelpers.js";
import queryComplete from "../utils/queryComplete.js";
import Field from "../Field.js";
import type { HarmonieQuery } from "../utils/types.js";

interface ShapefileMapping {
  FieldBlockNumber?: string;
  referenceDate?: string;
  NameOfField?: string;
  NumberOfField?: string;
  Area?: string;
  PartOfField?: string;
  CropSpeciesCode?: string;
  Name?: string;
}

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

  const subplots = geometries.features.map((plot, count) => {
    if (!plot.properties) plot.properties = {};

    return new Field({
      id: `harmonie_${count}_${plot.properties[FieldBlockNumber]}`,
      referenceDate: plot.properties[referenceDate],
      NameOfField: plot.properties[NameOfField],
      NumberOfField: plot.properties[NumberOfField] || count,
      Area: plot.properties[Area],
      FieldBlockNumber: plot.properties[FieldBlockNumber],
      PartOfField: plot.properties[PartOfField],
      SpatialData: plot,
      Cultivation: {
        PrimaryCrop: {
          CropSpeciesCode: plot.properties[CropSpeciesCode],
          Name: plot.properties[Name],
        },
      },
    });
  });

  // finally, group the parts of fields by their FLIK and check whether they are
  // actually seperate parts of fields
  return groupByFLIK(subplots);
}

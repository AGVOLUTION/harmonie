import { shape } from "../utils/parse.js";
import { reprojectFeature, groupByFLIK } from "../utils/geometryHelpers.js";
import queryComplete from "../utils/queryComplete.js";
import Field from "../Field.js";
import type { HarmonieQuery } from "../utils/types.js";

export default async function sn(query: HarmonieQuery) {
  const incomplete = queryComplete(query, ["shp", "dbf", "prj"]);
  if (incomplete) throw new Error(incomplete);
  // parse the shape file information
  const geometries = await shape(query.shp, query.dbf, query.encoding);
  // reproject coordinates into web mercator
  query.prj = query.prj || "EPSG:25833";
  geometries.features = geometries.features.map((f) =>
    reprojectFeature(f, query.prj)
  );

  const subplots = geometries.features.map(
    (plot, count) =>
      new Field({
        id: `harmonie_${count}_${plot.properties.FB_FLIK}`,
        referenceDate: plot.properties.JAHR,
        NameOfField: plot.properties.FB_BEZEICH,
        NumberOfField: plot.properties.SCHLAG,
        Area: +plot.properties.SC_FLAE,
        FieldBlockNumber: plot.properties.FB_FLIK,
        PartOfField: "",
        SpatialData: plot,
        Cultivation: {
          PrimaryCrop: {
            CropSpeciesCode: plot.properties.SC_HA_CODE,
            Name: "",
          },
        },
      })
  );

  // finally, group the parts of fields by their FLIK and check whether they are
  // actually seperate parts of fields
  return groupByFLIK(subplots);
}

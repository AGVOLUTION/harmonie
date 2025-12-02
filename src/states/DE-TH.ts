import { shape } from "../utils/parse.js";
import { reprojectFeature, groupByFLIK } from "../utils/geometryHelpers.js";
import queryComplete from "../utils/queryComplete.js";
import Field from "../Field.js";
import type { HarmonieQuery } from "../utils/types.js";
import thCropCodeMapping from "../utils/DE-TH-CropCodeMapping.js";

function tsvParseRows(string: string): string[][] {
  return string.split(/\n/g).map((line) => line.split(/\t/));
}

export default async function th(query: HarmonieQuery) {
  const incomplete = queryComplete(query, ["shp", "dbf", "dat"]);
  if (incomplete) throw new Error(incomplete);
  // parse the shape file information
  const geometries = await shape(query.shp, query.dbf);
  // reproject coordinates into web mercator
  geometries.features = geometries.features.map((f) =>
    reprojectFeature(f, query.prj)
  );
  // parse the data file, which is essentially a .tsv file with windows-1252 encoding
  const data = tsvParseRows(query.dat!).map((d) => ({
    NumberOfField: d[1],
    CropSpeciesCode: d[3],
  }));

  // merge the data into the geometries, by checking if BRSCHLAG === NumberOfField
  geometries.features.forEach((f) => {
    const match = data.find((d) => d.NumberOfField === f.properties.BRSCHLAG);
    if (match) {
      f.properties.CropSpeciesCode = match.CropSpeciesCode;
    }
  });

  const subplots = geometries.features.map(
    (plot, count) =>
      new Field({
        id: `harmonie_${count}_${plot.properties.FBI}`,
        referenceDate: undefined, // duh!
        NameOfField: plot.properties.LABEL,
        NumberOfField: plot.properties.BRSCHLAG,
        Area: plot.properties.FL,
        FieldBlockNumber: plot.properties.FBI,
        PartOfField: "",
        SpatialData: plot,
        Cultivation: {
          PrimaryCrop: {
            CropSpeciesCode: plot.properties.CropSpeciesCode, // duh!
            Name: thCropCodeMapping[plot.properties.CropSpeciesCode],
          },
        },
      })
  );

  // finally, group the parts of fields by their FLIK and check whether they are
  // actually seperate parts of fields
  return groupByFLIK(subplots);
}

import { xml, shape } from "../utils/parse.js";
import {
  wktToGeoJSON,
  groupByFLIK,
  reprojectFeature,
} from "../utils/geometryHelpers.js";
import { getSafe } from "../utils/helpers.js";
import queryComplete from "../utils/queryComplete.js";
import Field from "../Field.js";
import type { HarmonieQuery } from "../utils/types.js";

export default async function by(query: HarmonieQuery) {
  const incomplete = queryComplete(query, ["xml"]);
  if (incomplete) throw new Error(incomplete);
  const data = xml(query.xml);

  let applicationYear, fieldBlocks, subplots;
  // try to access the fieldBlocks from the xml
  try {
    applicationYear =
      data.Ergebnis?.Abfrage?.Jahr || data.AbfrageErgebnis.Abfrage.Jahr;
    fieldBlocks =
      data.Ergebnis?.Betriebe?.Betrieb?.Feldstuecke?.Feldstueck ||
      data.AbfrageErgebnis.Betriebe.Betrieb.Feldstuecke.Feldstueck;
    if (!query.shp && !query.dbf) {
      // only consider plots that have a geometry attached
      if (!Array.isArray(fieldBlocks)) fieldBlocks = [fieldBlocks];
      fieldBlocks = fieldBlocks.filter((plot) => plot.Geometrie);
    } else {
      // if a projection was passed, check if it is supported
      const supportedProjs = [
        "EPSG:25832",
        "EPSG:5650",
        "EPSG:31467",
        "EPSG:31462",
        "EPSG:31468",
        "EPSG:25833",
        "EPSG:4647",
      ];
      if (query.projection && !query.prj) {
        if (supportedProjs.indexOf(query.projection) === -1) {
          throw new Error(
            `Projection ${query.projection} is not supported by harmonie. The supported projections are: ${supportedProjs}`
          );
        }
        query.prj = query.projection;
      }
      if (!query.prj) {
        query.prj = "EPSG:25832";
      }
      // parse the shape file information
      subplots = await shape(query.shp, query.dbf, query.encoding);
      // reproject coordinates into web mercator
      subplots.features = subplots.features.map((f) =>
        reprojectFeature(f, query.prj)
      );
    }
  } catch (e) {
    throw new Error(
      "Error in XML data structure. Is this file the correct file from iBALIS Bavaria?",
      { cause: e }
    );
  }

  // if a shape file was passed, use the subplots to create the fieldBlocks
  let plots;
  if (subplots) {
    plots = subplots.features.map((feature, count) => {
      const plot = fieldBlocks.find(
        (p) => p["@_FID"] === feature.properties.FID
      );

      return new Field({
        id: `harmonie_${count}_${plot["@_FID"]}`,
        referenceDate: applicationYear,
        NameOfField: plot.Name || `Unbenannt ${plot.Nummer}`,
        NumberOfField: plot.Nummer,
        Area: feature.properties.Flaeche,
        FieldBlockNumber: plot["@_FID"],
        PartOfField: feature.properties.Schlag,
        SpatialData: feature,
        LandUseRestriction: "",
        Cultivation: {
          PrimaryCrop: {
            // only return the first crop found in the Nutzungen property (in case
            // of multiple crops), as we don't have any spatial information
            // about where the crops are cultivated
            CropSpeciesCode: feature.properties.Nutzung,
            Name: "",
          },
        },
      });
    });
  } else {
    plots = fieldBlocks.map(
      (plot, count) =>
        new Field({
          id: `harmonie_${count}_${plot["@_FID"]}`,
          referenceDate: applicationYear,
          NameOfField: plot.Name || `Unbenannt ${plot.Nummer}`,
          NumberOfField: plot.Nummer,
          Area: plot.Flaeche,
          FieldBlockNumber: plot["@_FID"],
          PartOfField: "",
          SpatialData: wktToGeoJSON(plot.Geometrie),
          LandUseRestriction: "",
          Cultivation: {
            PrimaryCrop: {
              // only return the first crop found in the Nutzungen property (in case
              // of multiple crops), as we don't have any spatial information
              // about where the crops are cultivated
              CropSpeciesCode:
                getSafe(() => plot.Nutzungen.Nutzung.Code) ||
                getSafe(() => plot.Nutzungen.Nutzung[0].Code),
              Name: "",
            },
          },
        })
    );
  }
  // finally, group the parts of fields by their FLIK and check whether they are
  // actually seperate parts of fields
  return groupByFLIK(plots);
}

import { xml, shape } from "../utils/parse.js";
import { reprojectFeature, groupByFLIK } from "../utils/geometryHelpers.js";
import queryComplete from "../utils/queryComplete.js";
import Field from "../Field.js";
import type { HarmonieQuery } from "../utils/types.js";

export default async function ni(query: HarmonieQuery) {
  const incomplete = queryComplete(query, ["shp", "dbf"]);
  if (incomplete) throw new Error(incomplete);
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
  const geometries = await shape(query.shp, query.dbf, query.encoding);
  // reproject coordinates into web mercator
  geometries.features = geometries.features.map((f) =>
    reprojectFeature(f, query.prj)
  );

  if (!query.xml) {
    // if there's no xml file, we assume the geometries are the fields
    const fields = geometries.features.map(
      (feature, count) =>
        new Field({
          id: `harmonie_${count}`,
          referenceDate: "",
          NameOfField: feature.properties.bez,
          NumberOfField: count,
          Area: feature.properties.flaeche_ha,
          FieldBlockNumber: "",
          PartOfField: "",
          SpatialData: feature,
          LandUseRestriction: "",
          Cultivation: {
            PrimaryCrop: {
              CropSpeciesCode: "",
              Name: "",
            },
          },
        })
    );
    return fields;
  } else {
    // parse the individual field information
    const data = xml(query.xml);
    let applicationYear: string, subplotsRawData: any[];
    // try to access the subplots from the xml
    try {
      applicationYear = data["ns2:hauptantrag"]["@_antragsjahr"];
      subplotsRawData = data["ns2:hauptantrag"]["schlag_liste"]["schlag"];
    } catch (e) {
      // this didn't work, now check if it's an "Änderungsantrag"
      if (data["ns2:aenderungsantrag"]) {
        throw new Error("Änderungsanträge werden nicht unterstützt.");
      } else {
        throw new Error(
          "Error in XML data structure. Is this file the correct file from FSV BW?"
        );
      }
    }

    const subplots = subplotsRawData.reduce(
      (plots: Field[], schlag: any, i: number) => {
        // each flik has a list of subplots
        let plotsInSchlag = schlag["teilschlag_liste"]["teilschlag"];
        // if there is only one subplot, it is not in an array
        if (!Array.isArray(plotsInSchlag)) {
          plotsInSchlag = [plotsInSchlag];
        }
        // from the test data, it looks like a schlag can
        // have multiple subplots with the same flik
        plotsInSchlag.forEach((plot: any) => {
          const matchingGeometry = geometries.features.find(
            (f) =>
              f.properties.OBJEKT_ID == plot["@_arkos_objekt_id"] ||
              f.properties.OBJEKT_ID == plot["@_gela_objekt_id"]
          );
          if (!matchingGeometry) {
            throw new Error(
              `No geometry found for flik ${JSON.stringify(plot)}}`
            );
          }

          plots.push(
            new Field({
              id: `harmonie_${plots.length}_${schlag["@_flik"]}`,
              referenceDate: applicationYear,
              NameOfField: schlag["@_bezeichnung"],
              NumberOfField: schlag["@_nr"],
              Area: +plot["@_geometrie_groesse"],
              FieldBlockNumber: schlag["@_flik"],
              PartOfField: plot["@_bezeichnung"],
              SpatialData: matchingGeometry,
              LandUseRestriction: "",
              Cultivation: {
                PrimaryCrop: {
                  CropSpeciesCode: plot["@_oevf"]
                    ? +plot["@_oevf_typ_fach_code"]
                    : +schlag["@_kultur_fach_code"],
                  Name: "",
                },
              },
            })
          );
        });
        return plots;
      },
      []
    );
    // group the subplots by flik
    return groupByFLIK(subplots);
  }
}

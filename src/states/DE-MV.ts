import { xml } from "../utils/parse.js";
import { toGeoJSON, groupByFLIK } from "../utils/geometryHelpers.js";
import queryComplete from "../utils/queryComplete.js";
import Field from "../Field.js";
import type { HarmonieQuery } from "../utils/types.js";

export default async function mv(query: HarmonieQuery) {
  const incomplete = queryComplete(query, ["xml"]);
  if (incomplete) throw new Error(incomplete);
  const data = xml(query.xml);
  // between 2022 and 2025 MV started to use ns namespace instead of fa
  // so we need to check which one is used
  const isNS = data["ns:flaechenantrag"] !== undefined;
  const namespace = isNS ? "ns" : "fa";
  const applicationYear =
    data[`${namespace}:flaechenantrag`][`${namespace}:antragsjahr`];
  const parzellen =
    data[`${namespace}:flaechenantrag`][`${namespace}:gesamtparzellen`][
      `${namespace}:gesamtparzelle`
    ];
  let count = 0;
  const plots = parzellen.reduce((acc, p) => {
    // start off with main area of field
    const hnf =
      p[`${namespace}:teilflaechen`][`${namespace}:hauptnutzungsflaeche`];
    const flik = hnf[`${namespace}:flik`];
    acc.push(
      new Field({
        id: `harmonie_${count}_${flik}`,
        referenceDate: applicationYear,
        NameOfField: flik || "", // Use FLIK as name if available
        NumberOfField: Math.floor(hnf[`${namespace}:teilflaechennummer`]),
        Area: hnf[`${namespace}:groesse`] / 10000,
        FieldBlockNumber: flik,
        PartOfField: 0,
        SpatialData: toGeoJSON(
          hnf[`${namespace}:geometrie`],
          // sometimes a custom projection is used, if not, we default to EPSG:5650
          query.prj ?? query.projection ?? "EPSG:5650"
        ),
        LandUseRestriction: "",
        Cultivation: {
          PrimaryCrop: {
            CropSpeciesCode: hnf[`${namespace}:nutzung`],
            Name: "",
          },
        },
      })
    );
    count++;
    // go on with field (buffer) strips
    const strfFlaechen =
      p[`${namespace}:teilflaechen`][`${namespace}:streifen_flaechen`];
    // return only main area if no field strips are defined
    if (!strfFlaechen) return acc;
    // convert to array structure if only one buffer strip is defined
    if (!Array.isArray(strfFlaechen[`${namespace}:streifen`])) {
      strfFlaechen[`${namespace}:streifen`] = [
        strfFlaechen[`${namespace}:streifen`],
      ];
    }
    strfFlaechen[`${namespace}:streifen`].forEach((stf, j) => {
      count++;
      const stripFlik = stf[`${namespace}:flik`];
      acc.push(
        new Field({
          id: `harmonie_${count}_${stripFlik}`,
          referenceDate: applicationYear,
          NameOfField: stripFlik || "", // Use FLIK as name if available
          NumberOfField: Math.floor(stf[`${namespace}:teilflaechennummer`]),
          Area: stf[`${namespace}:groesse`] / 10000,
          FieldBlockNumber: stripFlik,
          PartOfField: j,
          //@ts-ignore
          SpatialData: toGeoJSON(stf[`${namespace}:geometrie`]),
          LandUseRestriction: "",
          Cultivation: {
            PrimaryCrop: {
              CropSpeciesCode: stf[`${namespace}:nutzung`],
              Name: "",
            },
          },
        })
      );
    });
    return acc;
  }, []);
  // finally, group the parts of fields by their FLIK and check whether they are
  // actually seperate parts of fields
  return groupByFLIK(plots);
}

//@ts-nocheck
import { getSafe } from "./helpers.js";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import proj4 from "proj4";
import { polygon } from "@turf/helpers";
import { rewind } from "@turf/rewind";

// configure proj4 in order to convert GIS coordinates to web mercator
proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs");
const fromETRS89 = new proj4.Proj("EPSG:25832");
const toWGS84 = new proj4.Proj("WGS84");

const alwaysParseAsArrays = [
  "nn.land",
  "nn.land.parzelle",
  "nn.land[*].parzelle",
  "wfs:FeatureCollection.gml:featureMember",
];
const options = {
  ignoreAttributes: true,
  parseTagValue: true,
  trimValues: true,
  parseAttributeValue: true,
  isArray: (name, jpath) => {
    if (alwaysParseAsArrays.indexOf(jpath) !== -1) return true;
  },
};

export function parseXML(xml) {
  if (XMLValidator.validate(xml) !== true)
    throw new Error("Invalid XML structure.");
  const parser = new XMLParser(options);
  const json = parser.parse(xml);

  const basis = {
    applicationYear: getSafe(() => json.nn.antragsjahr),
    farmId: getSafe(() => json.nn.bnrzd),
  };

  if (getSafe(() => json.nn.land)) {
    return json.nn.land.reduce((acc, land) => {
      const landBasis = {
        ...basis,
        state: getSafe(() => land.bezeichnung),
        fieldBlockConstant: getSafe(() => land.feldblockkonstante),
        stateNo: getSafe(() => land.nummer),
      };
      if (getSafe(() => land.parzelle)) {
        return acc.concat(
          land.parzelle.map((field) => {
            return {
              ...landBasis,
              ...field,
            };
          })
        );
      } else {
        return acc;
      }
    }, []);
  } else {
    return new Error("No fields found in XML.");
  }
}

export function parseGML(gml) {
  if (XMLValidator.validate(gml) !== true) {
    throw new Error("Invalid GML structure.");
  }
  const parser = new XMLParser(options);
  const json = parser.parse(gml);
  if (getSafe(() => json["wfs:FeatureCollection"]["gml:featureMember"])) {
    const results = [];
    json["wfs:FeatureCollection"]["gml:featureMember"].forEach((field) => {
      const id = getSafe(() => field["elan:tschlag"]["elan:SCHLAGNR"]);
      const teilschlag = getSafe(() => field["elan:tschlag"]["elan:TEILSCHLAG"]);
      const year = getSafe(() => field["elan:tschlag"]["elan:WIRTSCHAFTSJAHR"]);
      const gmlPolygon = getSafe(
        () => field["elan:tschlag"]["elan:GEO_COORD_"]["gml:Polygon"]
      );

      if (!gmlPolygon) return;

      const processRing = (ring) => {
        let coordinates = getSafe(
          () => ring["gml:LinearRing"]["gml:coordinates"]
        );
        if (!coordinates) return [];

        // split coordinate string into array of strings
        coordinates = coordinates.split(" ");
        // then into array of arrays and transform string values to numbers
        return coordinates
          .map((pair) => {
            return pair.split(",").map((coord) => {
              return Number(coord);
            });
          })
          .filter((pair) => pair.length === 2)
          .map((latlng) => {
            return proj4(fromETRS89, toWGS84, latlng);
          });
      };

      const outerRing = processRing(gmlPolygon["gml:outerBoundaryIs"]);
      if (outerRing.length === 0) return;

      const allRings = [outerRing];

      let innerRings = gmlPolygon["gml:innerBoundaryIs"];
      if (innerRings) {
        if (!Array.isArray(innerRings)) {
          innerRings = [innerRings];
        }
        innerRings.forEach((ring) => {
          const processedRing = processRing(ring);
          if (processedRing.length > 0) {
            allRings.push(processedRing);
          }
        });
      }

      const feature = rewind(
        polygon(allRings, {
          number: id,
          part: teilschlag,
          year,
        })
      );

      return results.push({
        schlag: {
          nummer: id,
        },
        teilschlag,
        geometry: feature,
      });
    });

    return results;
  } else {
    throw new Error("No fields found in GML.");
  }
}

export function join(xml, gml) {
  return xml.map((field) => {
    const geometry = gml.find(
      // eslint-disable-next-line eqeqeq
      (tschlag) =>
        tschlag.schlag.nummer == field.schlag.nummer &&
        tschlag.teilschlag === field.teilschlag
    );
    if (!geometry) return field;
    return {
      ...geometry,
      ...field,
    };
  });
}

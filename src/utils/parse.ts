import { XMLParser } from "fast-xml-parser";
import { read } from "shapefile";
import { join, parseXML, parseGML } from "./parseDataExperts.js";

export function shape(shp, dbf, encoding?: string) {
  return read(shp, dbf, { encoding });
}

export function xml(xml) {
  const parser = new XMLParser({ ignoreAttributes: false });
  return parser.parse(xml, true);
}

export function dataExperts(xml, gml) {
  return join(parseXML(xml), parseGML(gml));
}

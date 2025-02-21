import bb from "./states/DE-BB.js";
import bw from "./states/DE-BW.js";
import by from "./states/DE-BY.js";
import he from "./states/DE-HE.js";
import mv from "./states/DE-MV.js";
import ni from "./states/DE-NI.js";
import nw from "./states/DE-NW.js";
import sl from "./states/DE-SL.js";
import th from "./states/DE-TH.js";
import type { HarmonieQuery } from "./utils/types.js";
export type { HarmonieQuery } from "./utils/types.js";

export default function harmonie(query: HarmonieQuery) {
  const state = query.state;
  if (!state) {
    throw new Error(
      'No property "state" given, required to be in ' +
        'ISO 3166-2 UTF-8 string format (e.g. "DE-NW")'
    );
  }
  switch (state) {
    case "DE-BB":
      return bb(query);
    case "DE-BE":
      return bb(query);
    case "DE-BW":
      return bw(query);
    case "DE-BY":
      return by(query);
    case "DE-HB":
      return ni(query);
    case "DE-HE":
      return he(query);
    case "DE-HH":
      return ni(query);
    case "DE-MV":
      return mv(query);
    case "DE-NI":
      return ni(query);
    case "DE-NW":
      return nw(query);
    case "DE-RP":
      return ni(query);
    case "DE-SH":
      return ni(query);
    case "DE-SL":
      return sl(query);
    case "DE-SN":
      return ni(query);
    case "DE-ST":
      return ni(query);
    case "DE-TH":
      return th(query);
    default:
      throw new Error(
        `No such state as "${state}" according to ISO 3166-2 in Germany."`
      );
  }
}

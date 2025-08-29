import type { HarmonieQuery } from "./utils/types.js";
export type { HarmonieQuery } from "./utils/types.js";

export default async function harmonie(query: HarmonieQuery) {
  const state = query.state;
  if (!state) {
    throw new Error(
      'No property "state" given, required to be in ' +
        'ISO 3166-2 UTF-8 string format (e.g. "DE-NW")'
    );
  }

  const stateHandlers: Record<string, () => Promise<any>> = {
    "DE-BB": () => import("./states/DE-BB.js"),
    "DE-BE": () => import("./states/DE-BB.js"),
    "DE-BW": () => import("./states/DE-BW.js"),
    "DE-BY": () => import("./states/DE-BY.js"),
    "DE-HB": () => import("./states/DE-NI.js"),
    "DE-HE": () => import("./states/DE-HE.js"),
    "DE-HH": () => import("./states/DE-NI.js"),
    "DE-MV": () => import("./states/DE-MV.js"),
    "DE-NI": () => import("./states/DE-NI.js"),
    "DE-NW": () => import("./states/DE-NW.js"),
    "DE-RP": () => import("./states/DE-NI.js"),
    "DE-SH": () => import("./states/DE-NI.js"),
    "DE-SL": () => import("./states/DE-SL.js"),
    "DE-SN": () => import("./states/DE-NI.js"),
    "DE-ST": () => import("./states/DE-NI.js"),
    "DE-TH": () => import("./states/DE-TH.js"),
  };

  const handler = stateHandlers[state];
  if (!handler) {
    throw new Error(
      `No such state as "${state}" according to ISO 3166-2 in Germany."`
    );
  }

  const module = await handler();
  return module.default(query);
}

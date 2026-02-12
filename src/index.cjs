const bb = require("./states/DE-BB.js");
const bw = require("./states/DE-BW.js");
const by = require("./states/DE-BY.js");
const he = require("./states/DE-HE.js");
const mv = require("./states/DE-MV.js");
const ni = require("./states/DE-NI.js");
const nw = require("./states/DE-NW.js");
const sl = require("./states/DE-SL.js");
const th = require("./states/DE-TH.js");

function harmonie(query) {
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

module.exports = harmonie;
module.exports.default = harmonie;

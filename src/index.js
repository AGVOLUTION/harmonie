import bb from './states/DE-BB'
import bw from './states/DE-BW'
import by from './states/DE-BY'
import he from './states/DE-HE'
import nw from './states/DE-NW'
import mv from './states/DE-MV'

export default function harmonie (query) {
  const state = query.state
  if (!state) {
    throw new Error('No property "state" given, required to be in ' +
     'ISO 3166-2 UTF-8 string format (e.g. "DE-NW")')
  }
  switch (state) {
    case 'DE-BB':
      return bb(query)
    case 'DE-BW':
      return bw(query)
    case 'DE-BY':
      return by(query)
    case 'DE-HE':
      return he(query)
    case 'DE-NW':
      return nw(query)
    case 'DE-MV':
      return mv(query)
    default:
      throw new Error(`No such state as "${state}" according to ISO 3166-2 in Germany."`)
  }
}

export interface HarmonieQuery {
  state: string;
  xml?: string;
  gml?: string;
  shp?: ArrayBuffer;
  dbf?: ArrayBuffer;
  prj?: string;
  dat?: string;
  /** Encoding of the shapefile */
  encoding?: string;
  /** Sometimes a projection is passed as a string??? */
  projection?: string;
  /** Mapping for generic shapefile handler */
  mapping?: Record<string, string>;
}

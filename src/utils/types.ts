export interface HarmonieQuery {
  state: string;
  xml?: string;
  shp?: ArrayBuffer;
  dbf?: ArrayBuffer;
  prj?: string;
  /** Encoding of the shapefile */
  encoding?: string;
  /** Sometimes a projection is passed as a string??? */
  projection?: string;
}

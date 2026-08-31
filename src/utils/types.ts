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
  mapping?: ShapefileMapping;
}

type PropertyAccessor = string | ((properties: any) => any);
export interface ShapefileMapping {
  FieldBlockNumber?: PropertyAccessor;
  referenceDate?: PropertyAccessor;
  NameOfField?: PropertyAccessor;
  NumberOfField?: PropertyAccessor;
  Area?: PropertyAccessor;
  PartOfField?: PropertyAccessor;
  CropSpeciesCode?: PropertyAccessor;
  Name?: PropertyAccessor;
}
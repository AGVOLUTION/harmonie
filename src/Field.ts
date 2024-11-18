import { MultiPolygon, Polygon } from "@turf/helpers";
import truncate from "@turf/truncate";

export default class Field {
  id: string;
  referenceDate: number;
  NameOfField: string;
  NumberOfField: number;
  Area: number;
  FieldBlockNumber: string;
  PartOfField: number;
  SpatialData: {
    type: string;
    properties: Record<string, unknown>;
    geometry: Polygon | MultiPolygon;
  };
  LandUseRestriction: string;
  Cultivation: {
    PrimaryCrop: {
      CropSpeciesCode: number;
      Name: string;
    };
  };

  constructor(properties) {
    this.id = properties.id || "String";
    this.referenceDate = properties.referenceDate;
    this.NameOfField =
      properties.NameOfField || `Unbenannt ${properties.NumberOfField}`;
    this.NumberOfField = properties.NumberOfField;
    this.Area = properties.Area;
    this.FieldBlockNumber = properties.FieldBlockNumber;
    this.PartOfField = properties.PartOfField;

    try {
      this.SpatialData = truncate(properties.SpatialData, {
        mutate: true,
        coordinates: 2,
      });
    } catch (e) {
      // in BW geometry ids are replaced with actual geometries later
      this.SpatialData = properties.SpatialData;
    }

    this.LandUseRestriction = properties.LandUseRestriction;
    this.Cultivation = properties.Cultivation;
  }
}

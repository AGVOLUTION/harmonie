interface DE_MV_Properties {
  NUMMER: string;
  ART: string;
  CONSTANT: string;
  FLIK_FLEK: string;
  FLAECHE: number;
  CODE: number;
  CODE_BEZ: string;
  AKTIVIEREN: string;
  OEVF_TYP: string;
  HA_OEVF: string;
  GL_NUTZUNG: string;
  SORTE: string;
  BINDUNGEN: string;
  FFH: number;
  SPA: number;
  OER: string;
}

export default {
  FieldBlockNumber: (props: DE_MV_Properties) => props?.CONSTANT + props?.FLIK_FLEK,
  referenceDate: "",
  NameOfField: "FLIK_FLEK",
  NumberOfField: "NUMMER",
  Area: "FLAECHE",
  PartOfField: "",
  CropSpeciesCode: "CODE",
  Name: "CODE_BEZ",
};
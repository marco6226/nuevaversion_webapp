export interface Hht {
    id: string;
    anio: number;
    mes: string;
    valor: string;
    empresaSelect:string;
}

export interface AreaHht {
    area: string;
    ubicacion:UbicacionHht;
}

export interface UbicacionHht {
    Girardot: ValorHht;
    Funza:ValorHht;
    Madrid:ValorHht;
}

export interface ValorHht {
    Hht: Number;
    Nh:Number;
}

export interface DataPlanta {
    id: number;
    NumPersonasPlanta: number;
    HhtPlanta: number;
  }
  
  export interface DataArea {
    id: number;
    NumPersonasArea: number;
    HhtArea: number;
    ILIArea: number;
    Plantas: DataPlanta[];
  }
  
  export interface DataHht {
    id: number;
    mes: string;
    NumPersonasMes: number;
    HhtMes: number;
    Areas: DataArea[];
  }
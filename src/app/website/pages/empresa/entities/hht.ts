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


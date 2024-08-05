import { Empresa } from "./empresa";
import { Sede } from "./sede";
import { TipoArea } from "./tipo-area";

export class Area{
    id!: string;
    nombre!: string;
    descripcion!: string;
    estructura!: string;
    nivel!: number;
    tipoArea!: TipoArea;
    sede!: Sede;
    areaPadre?: Area;
    areaList!: Area[];
    contacto!: string;  
    numero!: number;  
    nombreTipoArea!: TipoArea["nombre"];
    padreNombre!: string;
  }
  
  export enum Estructura {
    ORGANIZACIONAL = <any>'ORGANIZACIONAL',
    FISICA = <any>"FISICA"
  }
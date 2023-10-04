import { Empresa } from "../../empresa/entities/empresa";
import { AreaMatriz } from "./Area-matriz";
import { Plantas } from "./Plantas";
import { ProcesoMatriz } from "./Proceso-matriz";
import { SubprocesoMatriz } from "./Subproceso-matriz.ts";


export class MatrizPeligros {
  id?: Number | any;
  generalInf?: string;
  peligro?: string;
  controlesexistentes?:string;
  valoracionRiesgoInicial?:string;
  valoracionRiesgoResidual?:string;
  planAccion?:string;
  area?:AreaMatriz;
  proceso?:ProcesoMatriz;
  subProceso?:SubprocesoMatriz;
  plantas?:Plantas;
  empresa?:Empresa;
  fechaCreacion?:Date | null;
  eliminado?: Boolean;
  idEdicion?:Number;
  fkmatrizpeligros?: Number;//padre
}
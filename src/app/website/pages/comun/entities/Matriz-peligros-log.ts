import { Localidades } from "../../ctr/entities/aliados";
import { Empresa } from "../../empresa/entities/empresa";
import { AreaMatriz } from "./Area-matriz";
import { Plantas } from "./Plantas";
import { ProcesoMatriz } from "./Proceso-matriz";
import { SubprocesoMatriz } from "./Subproceso-matriz.ts";


export class MatrizPeligrosLog {
  id?: Number | null;
  idriesgo?: Number;
  accion?:String;
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
  localidad?:Localidades;
  empresa?:Empresa;
  fechaCreacion?:Date | null;
  fechaEdicion?:Date | null;
  eliminado?: Boolean;
  idEdicion?:Number;
  usuario?:string;
  efectividadControles?:string;
  fkmatrizpeligros?: Number;//padre
}
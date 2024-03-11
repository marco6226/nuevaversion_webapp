import { Documento } from "../../ado/entities/documento";
import { Localidades } from "../../ctr/entities/aliados";
import { Empresa } from "../../empresa/entities/empresa";
import { AreaMatriz } from "./Area-matriz";
import { Plantas } from "./Plantas";
import { ProcesoMatriz } from "./Proceso-matriz";
import { SubprocesoMatriz } from "./Subproceso-matriz.ts";


export class MatrizPeligros {
  id?: Number | any;
  generalInf?: string;
  peligro?: string | any;
  controlesexistentes?:string;
  valoracionRiesgoInicial?:string | any;
  valoracionRiesgoResidual?:string | any;
  planAccion?:string | any;
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
  fkmatrizpeligros?: Number;//padre
  efectividadControles?:string;
  documentosList!:Documento[] | null;
}
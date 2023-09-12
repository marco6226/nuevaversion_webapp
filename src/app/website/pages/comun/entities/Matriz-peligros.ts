import { Empresa } from "../../empresa/entities/empresa";
import { AreaMatriz } from "./Area-matriz";
import { Plantas } from "./Plantas";


export class MatrizPeligros {
  id?: Number;
  generalInf?: string;
  peligro?: string;
  controlesexistentes?:string;
  valoracionRiesgoInicial?:string;
  planAccion?:string;
  area?:AreaMatriz;
  plantas?:Plantas;
  empresa?:Empresa;
  fechaCreacion?:Date | null;
  eliminado?: Boolean;
}
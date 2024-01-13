import { Localidades } from "../../ctr/entities/aliados";
import { Empresa } from "../../empresa/entities/empresa";
import { Plantas } from "./Plantas";


export class AreaMatriz {
  id?: string;
  nombre?: string;
  empresaId?: Empresa;
  plantas?:Plantas;
  localidad?:Localidades;
  estado?:string;
  eliminado?:boolean;
}
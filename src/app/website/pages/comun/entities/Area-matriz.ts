import { Empresa } from "../../empresa/entities/empresa";
import { Plantas } from "./Plantas";


export class AreaMatriz {
  id?: string;
  nombre?: string;
  empresaId?: Empresa;
  plantas?:Plantas;
  estado?:string;
}
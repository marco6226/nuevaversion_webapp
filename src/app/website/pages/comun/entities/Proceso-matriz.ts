import { Empresa } from "../../empresa/entities/empresa";
import { AreaMatriz } from "./Area-matriz";


export class ProcesoMatriz {
  id?: string;
  nombre?: string;
  empresa?: Empresa;
  areaMatriz?:AreaMatriz
  estado?:string;
}
import { Area } from "../../empresa/entities/area";
import { Empresa } from "../../empresa/entities/empresa";
import { Plantas } from "./Plantas";


export class MatrizPeligros {
  id?: Number;
  generalInf?: string;
  peligro?: string;
  controlesexistentes?:string;
  area?:Area;
  plantas?:Plantas;
  empresa?:Empresa;
}
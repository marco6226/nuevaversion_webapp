import { Competencia } from "./competencia";
import { Empresa } from "./empresa";

export class Cargo {
    id?: string;
    descripcion?: string;
    nombre?: string;
    empresa?: Empresa;
    ficha?: string;
    competenciasList?: Competencia[];
}

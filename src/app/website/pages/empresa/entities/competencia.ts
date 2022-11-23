import { Empresa } from "./empresa";

export interface Competencia {
    id: string;
    descripcion: string;
    nombre: string;
    competencia: Competencia;
    competenciaList:Competencia[];
    empresa: Empresa;
}

import { Empresa } from "./empresa";

export interface TipoArea {
    id: string;
    nombre: string;
    descripcion: string;
    empresa: Empresa;
}

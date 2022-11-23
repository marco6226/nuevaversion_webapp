import { Ciudad } from "../../comun/entities/ciudad";
import { Empresa } from "./empresa";

export interface Sede {
    id: string;
    direccion: string;
    descripcion: string;
    latitud: number;
    longitud: number;
    nombre: string;
    principal: boolean;
    tipoSede: string;
    empresa: Empresa;
    ciudad: Ciudad;
}

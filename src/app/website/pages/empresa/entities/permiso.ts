import { Perfil } from "./perfil";
import { Recurso } from "./recurso";

export interface Permiso {
    id: string;
    valido: boolean;
    recurso: Recurso;
    perfil: Perfil;
    areas: string;
}

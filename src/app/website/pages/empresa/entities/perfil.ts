import { Permiso } from "./permiso";

export interface Perfil {
    id: string;
    nombre: string;
    descripcion: string;
    permisoList: Permiso[];
}

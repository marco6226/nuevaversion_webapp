import { Campo } from "./campo";

export interface Formulario {
    id: string;
    nombre: string;
    descripcion: string;
    campoList: Campo[];
}

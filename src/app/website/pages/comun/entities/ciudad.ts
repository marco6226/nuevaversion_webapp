import { Departamento } from "./departamento";

export interface Ciudad {
    id: string;
    nombre: string;
    descripcion: string;
    departamento: Departamento;
}

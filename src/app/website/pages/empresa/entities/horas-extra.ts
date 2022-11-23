import { Empleado } from "./empleado";

export interface HorasExtra {
    id: string;
    fecha: Date;
    horas: number;
    empleado: Empleado;
    codigo:number;
}

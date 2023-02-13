import { Area } from "../../empresa/entities/area";
import { ListaInspeccion } from "./lista-inspeccion";

export interface Programacion {
    id: string;
    numeroInspecciones: number;
    numeroRealizadas: number;
    fecha: Date;
    area: Area;
    listaInspeccion: ListaInspeccion;
}

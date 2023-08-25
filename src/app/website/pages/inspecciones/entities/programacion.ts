import { Localidades } from "../../ctr/entities/aliados";
import { Area } from "../../empresa/entities/area";
import { Empresa } from "../../empresa/entities/empresa";
import { ListaInspeccion } from "./lista-inspeccion";

export interface Programacion {
    id: string;
    numeroInspecciones: number;
    numeroRealizadas: number;
    fecha: Date;
    area: Area;
    localidad: Localidades;
    empresaAliada: Empresa;
    empleadoBasic: any;
    listaInspeccion: ListaInspeccion;
}

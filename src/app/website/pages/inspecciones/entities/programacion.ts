import { Serie } from "../../comun/entities/serie";
import { Localidades } from "../../ctr/entities/aliados";
import { Area } from "../../empresa/entities/area";
import { Empresa } from "../../empresa/entities/empresa";
import { ListaInspeccion } from "./lista-inspeccion";

export interface Programacion {
    id: string;
    numeroInspecciones: number;
    numeroRealizadas: number | null;
    fecha: Date;
    area: Area;
    localidad: Localidades;
    empresaAliada: Empresa;
    empleadoBasic: any;
    listaInspeccion: ListaInspeccion;
    localidadSv: any | null;
    areaSv: any | null;
    procesoSv: any  | null;
    // serie: Serie | null;
}

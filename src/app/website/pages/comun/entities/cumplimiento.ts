import { ElementoInspeccion } from "../../inspecciones/entities/elemento-inspeccion";

export interface Cumplimiento {
    id: number | null;
    elementoInspeccion: ElementoInspeccion;
    porcentajeCumplimiento: number | null;
    aplica: boolean;
    inspeccion: number;
}
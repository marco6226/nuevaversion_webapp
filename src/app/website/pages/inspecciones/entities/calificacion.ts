import { Documento } from "../../ado/entities/documento";
import { NivelRiesgo } from "../../core/entities/nivel-riesgo";
import { ElementoInspeccion } from "./elemento-inspeccion";
import { OpcionCalificacion } from "./opcion-calificacion";
import { TipoHallazgo } from "./tipo-hallazgo";

export interface Calificacion {
    id: string;
    recomendacion: string;
    elementoInspeccion: ElementoInspeccion;
    opcionCalificacion: OpcionCalificacion;
    nivelRiesgo: NivelRiesgo;
    documentosList: Documento[];
    tipoHallazgo:TipoHallazgo;
}

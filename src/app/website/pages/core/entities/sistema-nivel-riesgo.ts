import { Consecuencia } from "./consecuencia";
import { NivelRiesgo } from "./nivel-riesgo";
import { Probabilidad } from "./probabilidad";

export interface SistemaNivelRiesgo {
    id: string;
    nombre: string;
    descripcion: string;
    nivelRiesgoList: NivelRiesgo[];
    consecuenciaList: Consecuencia[];
    probabilidadList: Probabilidad[];
}

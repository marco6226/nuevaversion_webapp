import { SistemaNivelRiesgo } from "./sistema-nivel-riesgo";

export interface Consecuencia {
    id: string;
    nombre: string;
    descripcion: string;
    valor: number;
    sistemaNivelRiesgo: SistemaNivelRiesgo;
}

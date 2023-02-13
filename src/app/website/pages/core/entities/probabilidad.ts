import { SistemaNivelRiesgo } from "./sistema-nivel-riesgo";

export interface Probabilidad {
    id: string;
    nombre: string;
    descripcion: string;
    valorMinimo: number;
    valorMaximo: number;
    sistemaNivelRiesgo: SistemaNivelRiesgo;
    color:string;
}

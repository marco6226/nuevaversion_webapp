import { Calificacion } from "./calificacion";
import { TipoHallazgo } from "./tipo-hallazgo";

export interface ElementoInspeccion {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  elementoInspeccionPadre: ElementoInspeccion;
  elementoInspeccionList: ElementoInspeccion[];
  calificable: boolean;
  tipoHallazgoList:TipoHallazgo[];
  criticidad:string;
  numero: number;
  calificacion: Calificacion;
  data2?:any[];
  peso: number | null;
}

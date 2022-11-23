import { Competencia } from "./competencia";
import { EvaluacionDesempeno } from "./evaluacion-desempeno";

export interface CalificacionDesempeno {
    id?: string;
    puntaje?: number;
    competencia?: Competencia;
    evaluacionDesempeno?: EvaluacionDesempeno;
}

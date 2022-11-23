import { CalificacionDesempeno } from "./calificacion-desempeno";
import { Cargo } from "./cargo";
import { Empleado } from "./empleado";
import { Usuario } from "./usuario";

export interface EvaluacionDesempeno {
    id: string;
    fechaElaboracion: Date;
    empleado: Empleado;
    cargo: Cargo;
    usuarioElabora: Usuario;
    calificacionDesempenoList: CalificacionDesempeno[];
    comentario:string;
}

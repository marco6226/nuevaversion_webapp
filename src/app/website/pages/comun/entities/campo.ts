import { Formulario } from "./formulario";
import { RespuestaCampo } from "./respuesta-campo";

export interface Campo {
    id: string;
    nombre: string;
    descripcion: string;
    requerido: string;
    tipo: string;
    opciones: string[];
    formulario: Formulario;
    respuestaCampo: RespuestaCampo;
}

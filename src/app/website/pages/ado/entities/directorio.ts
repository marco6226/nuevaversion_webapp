import { Usuario } from "../../empresa/entities/usuario";
import { Documento } from "./documento";

export interface Directorio {
    id: string;
    nombre: string;
    caseId: number;
    esDocumento: boolean;
    usuario: Usuario;
    directorioList: Directorio[];
    directorioPadre: Directorio;
    documento: Documento;
    tamanio: number;
    fechaCreacion: Date;
    nivelAcceso: string;
}

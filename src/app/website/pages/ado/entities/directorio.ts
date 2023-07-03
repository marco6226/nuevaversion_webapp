import { Usuario } from "../../empresa/entities/usuario";
import { Documento } from "./documento";

export class Directorio {
    id?: string;
    nombre?: string | null;
    caseId?: number;
    esDocumento?: boolean;
    usuario?: Usuario;
    directorioList?: Directorio[];
    directorioPadre?: Directorio | null;
    documento?: Documento;
    tamanio?: number;
    fechaCreacion?: Date;
    nivelAcceso?: string;
    perfilId: any
}

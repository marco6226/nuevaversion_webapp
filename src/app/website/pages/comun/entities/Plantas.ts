import { Usuario } from "../../empresa/entities/usuario";

export class Plantas {
    id?: number;
    nombre?: string;
    id_division?: string;
    pais?: string
    id_empresa?: number;
    tipo?:string;
    idDocConsolidado?: string | null;
    idDocHistorico?: string | null;
    fechaConsolidado?:Date | null;
    fechaHistorico?:Date | null

    fechaConsolidadoStart?:Date | null;
    fechaHistoricoStart?:Date | null

    usuarioConsolidado?: Usuario | null;
    usuarioHistorico?: Usuario | null;
    descargaConsolidado?:boolean;
    descargaHistorico?:boolean
}
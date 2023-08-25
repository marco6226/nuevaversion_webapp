import { Empresa } from "../../empresa/entities/empresa";
import { Usuario } from "../../empresa/entities/usuario";
import { ListaInspeccion } from "../../inspecciones/entities/lista-inspeccion";
import { Programacion } from "../../inspecciones/entities/programacion";

export interface ViewInspeccionesCtr {
    id: string;
    programacion: Programacion;
    fecha: Date;
    listaInspeccion: ListaInspeccion;
    usuarioRegistra: Usuario;
    empresa: Empresa;
    empresaAliada: Empresa;
    empresaAliadaConNit: string;
    tipoInspeccion: string;
    cumplimiento: number;
}
import { RespuestaCampo } from "../../comun/entities/respuesta-campo";
import { Area } from "../../empresa/entities/area";
import { Empleado } from "../../empresa/entities/empleado";
import { Empresa } from "../../empresa/entities/empresa";
import { Usuario } from "../../empresa/entities/usuario";
import { Calificacion } from "./calificacion";
import { ListaInspeccion } from "./lista-inspeccion";
import { Programacion } from "./programacion";

export class ViewInspeccion {
    id!: number;
    fechaRealizada!: Date;
    fechaModificacion!: Date;
    observacion!: string;
    lugar!: string;
    equipo!: string;
    marca!: string;
    modelo!: string;
    serial!: string;
    descripcion!: string;
    empresa!: Empresa;
    calificacionList!: Calificacion[];
    respuestasCampoList!: RespuestaCampo[];
    programacion!: Programacion;
    usuarioRegistra!: Usuario;
    usuarioModifica!: Usuario;  
    // empleado: Empleado;
    listaInspeccion!:ListaInspeccion;
    area!:Area;  
    fechavistohse!: Date;
    empleadohse!: Empleado;
    conceptohse!: string;  
    fechavistoing!: Date;
    empleadoing!: Empleado;
    conceptoing!: string;
    pkUsuarioId!: number;
}

// id: string;
// fechaRealizada: Date;
// fechaModificacion: Date;
// observacion: string;
// lugar: string;
// equipo: string;
// marca: string;
// modelo: string;
// serial: string;
// descripcion: string;
// empresa: Empresa;
// calificacionList: Calificacion[];
// respuestasCampoList: RespuestaCampo[];
// programacion: Programacion;
// usuarioRegistra: Usuario;
// usuarioModifica: Usuario;
// listaInspeccion: ListaInspeccion;
// area: Area;
// fechavistohse: Date;
// empleadohse: Empleado;
// conceptohse: string
// fechavistoing: Date;
// empleadoing: Empleado;
// conceptoing: string;
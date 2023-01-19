import { Empresa } from "./empresa";
import { Perfil } from "./perfil";

export class Usuario {
    id?: string;
    email?: string;
    perfilesId?: string[];
    perfilNombre?: string;
    estado?: string;
    usuarioEmpresaList?: UsuarioEmpresa[];
    avatar?: string;
    icon?: string;
    ultimoLogin?: Date;
    fechaCreacion?: Date;
    fechaModificacion?: Date;
    fechaAceptaTerminos?: Date;
    ipPermitida?: string[];
    numeroMovil?:string;
    mfa?:boolean;
}

export class UsuarioEmpresa {
    perfil?: Perfil;
    empresa?: Empresa;
}
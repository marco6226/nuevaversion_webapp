import { Empresa } from "./empresa";
import { Perfil } from "./perfil";

export class Usuario {
    id?: string | null;
    email?: string;
    perfilesId?: string[];
    perfilNombre?: string;
    estado?: string | null;
    usuarioEmpresaList?: UsuarioEmpresa[];
    avatar?: string;
    icon?: string;
    ultimoLogin?: Date;
    fechaCreacion?: Date;
    fechaModificacion?: Date;
    fechaAceptaTerminos?: Date;
    ipPermitida?: string[];
    numeroMovil?: string | null;
    mfa?: boolean | null;
}

export class UsuarioEmpresa {
    perfil?: Perfil;
    empresa?: Empresa;
}
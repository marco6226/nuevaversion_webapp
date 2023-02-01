
import { Cargo } from './cargo'
import { UsuarioBasic } from './usuario-basic';

export class EmpleadoBasic {
    id!: string;
    numeroIdentificacion!: string;
    primerApellido!: string;
    primerNombre!: string;
    segundoApellido!: string;
    segundoNombre!: string;    
    cargo!: Cargo;    
    usuario!: UsuarioBasic;
    usuarioBasic!: UsuarioBasic;
}

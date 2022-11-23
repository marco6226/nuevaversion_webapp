import { Empleado } from "../../empresa/entities/empleado";
import { Empresa } from "../../empresa/entities/empresa";
import { Permiso } from "../../empresa/entities/permiso";
import { Usuario } from "../../empresa/entities/usuario";

export interface Session {
    token: string;
    recordar: boolean;
    usuario: Usuario;
    empleado: Empleado;
    isLoggedIn: boolean;
    empresa: Empresa;
    permisosList: Permiso[];
    permisosMap: Map<string, boolean>;
    configuracion: Map<string, any>;
}

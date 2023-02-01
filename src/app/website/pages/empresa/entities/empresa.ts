import { Arl } from "../../comun/entities/arl";
import { Ciiu } from "../../comun/entities/ciiu";

export class Empresa {
    id?: string | null;
    nombreComercial?: string;
    razonSocial?: string;
    nit?: string;
    direccion?: string | null;
    telefono?: string | null;
    email?: string;
    web?: string | null;
    numeroSedes?: Number | null;
    arl?: Arl | null;
    ciiu?: Ciiu | null;
    logo?: string | null;
    empresasContratistasList?: Empresa[];
    tipo_persona?: string | null;
    actividades_contratadas?: string;
    localidad?: string;
    division?: string;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
    calificacion?: string;
    estado?: string;
    vigencia?: string;
    activo?: boolean;
    idEmpresaAliada?: number;
    correoAliadoCreador?: string;
    vinculado?: boolean | null; 
}

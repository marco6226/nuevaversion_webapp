import { AnalisisDesviacion } from 'src/app/website/pages/comun/entities/analisis-desviacion'
import { Area } from 'src/app/website/pages/empresa/entities/area'
import { Usuario } from 'src/app/website/pages/empresa/entities/usuario'
import { Empleado } from 'src/app/website/pages/empresa/entities/empleado';

export class Tarea {
    id?: string | null;
    nombre?: string;
    descripcion?: string;
    tipoAccion?: string;
    jerarquia?: string;
    estado?: string;
    fechaProyectada?: Date;
    fechaRealizacion?: Date;
    fechaVerificacion?: Date;
    areaResponsable?: Area | null;
    empResponsable?: Empleado | null;
    observacionesRealizacion?: string;
    observacionesVerificacion?: string;
    usuarioRealiza?: Usuario | null;
    usuarioVerifica?: Usuario | null;
    analisisDesviacionList?: AnalisisDesviacion[];
    modulo?: string | null;
    codigo?: string | null;
    envioCorreo?: boolean;
    // plandeAccion
}

import { Plantas } from "../../comun/entities/Plantas";
import { Usuario } from "../../empresa/entities/usuario";

export interface Aliados {
    nit: string;
    razonSocial: string;
    tipo: string;
    fecha: Date;
    estado: string;
    calificacion: string;
    vigencia: string;    
}

export interface EquipoSST{
    id?: number;
    id_empresa?: number;
    nombre: string;
    documento: string | null;
    correo: string;
    telefono: string;
    division: string;
    localidad: string;
    cargo: string | null;
    licenciaSST: string;
}

export interface ResponsableSST{
    id?: number;
    id_empresa?: number;
    nombre: string;
    correo: string;
    telefono: string;
    licenciaSST: string;
    encargado?: boolean;
}

export interface SST{
    id?: number;
    id_empresa: number;
    responsable: string | null;
    nombre: string;
    correo: string;
    telefono: string;
    licenciasst: string;
    documento: string | null;
    division: string | null;
    localidad: string | null;
    cargo: string | null;
    encargado: boolean;
}

export interface AliadoInformacion{
    id?: number;
    id_empresa: number;
    actividad_contratada: string | null;
    division: string | null;
    localidad: string | null;
    calificacion: string | null;
    colider: string | null;
    documentos: string | null;
    representante_legal: string;
    numero_trabajadores: number;
    numero_trabajadores_asignados: number;
    fecha_vencimiento_arl: Date | null;
    fecha_vencimiento_sst: Date | null;
    fecha_vencimiento_cert_ext: Date | null;
    control_riesgo: string | null;
    email_comercial: string | null;
    telefono_contacto: string | null;
    puntaje_arl: number | null;
    calificacion_aliado: number;
    fecha_calificacion_aliado: Date | null;
    nombre_calificador: string;
    arl: string | null;
    autoriza_subcontratacion: boolean | null;
    istemporal?: boolean | null;
    permitirReportes?: boolean | null;
}

export const _actividadesContratadasList = [
    // { label: '--Seleccione--', value: null },
    {label: 'actividad 1', value: 'actividad1'},
    {label: 'actividad 2', value: 'actividad2'},
    {label: 'actividad 3', value: 'actividad3'},
    {label: 'actividad 4', value: 'actividad4'},
]

export const _divisionList= [
    { label: 'Almacenes Corona', value: 'Almacenes Corona' },
    { label: 'Bathrooms and Kitchen', value: 'Bathrooms and Kitchen' },
    { label: 'Comercial Corona Colombia', value: 'Comercial Corona Colombia' },
    { label: 'Funciones Transversales', value: 'Funciones Transversales' },
    { label: 'Insumos Industriales y Energias', value: 'Insumos Industriales y Energias' },
    { label: 'Mesa Servida', value: 'Mesa Servida' },
    { label: 'Superficies, materiales y pinturas', value: 'Superficies, materiales y pinturas' },
]


export interface ActividadesContratadas{
    id: number;
    empresa_id: number;
    actividad: string;
    actividadesHijo?: ActividadesContratadas[]
    padre_id:number
}

export interface Localidades{
    id: number;
    empresa_id: number;
    localidad: string;
    plantas: Plantas;
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

export interface Subcontratista{
    id?: number | null;
    nit: string
    nombre: string;
    actividades_riesgo: string;
    tipo_persona: string;
    porcentaje_arl: string;
    estado: string;
    carta_autorizacion: string | null;
    id_aliado_creador: number | null;
}
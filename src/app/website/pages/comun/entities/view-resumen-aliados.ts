export interface ViewResumenInpAliados {
    id: string;
    aliado: string;
    programadas: number;
    ejecutadas: number;
    noProgramadas: number;
    calificacionAcumulada: number | null;
    porcentajeAvance: number | null;
    idEmpresaAliada: string;
}
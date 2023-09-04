export interface Serie {
    id: number | null;
    fechaDesde: Date;
    fechaHasta: Date;
    periodicidad: number;
    unidadPeriodo: string;
}
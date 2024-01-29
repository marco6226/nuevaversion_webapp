export interface InformacionComplementaria{
    Peligro: DatoPeligro;
    DescripcionPeligro: DatoPeligro;
    EnventoARL: string;
    ReporteControl: string;
    FechaControl: Date;
    CopiaTrabajador: string;
    FechaCopia: Date;
    Area: string;
    Proceso: string;
    subProceso: string;
}
export interface DatoPeligro{
    id:number;
    nombre:string;
}
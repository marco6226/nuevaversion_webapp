export interface Documento {
    id: string;
    version: number;
    nombre: string;
    proceso: string;
    codigo: string;
    descripcion: string;
    nombresElaborador: string;
    apellidosElaborador: string;
    identificacionElaborador: string;
    nombresVerificador: string;
    apellidosVerificador: string;
    identificacionVerificador: string;
    nombresAprobador: string;
    apellidosAprobador: string;
    identificacionAprobador: string;
    fechaElaboracion: Date | null;
    fechaVerificacion: Date | null;
    fechaAprobacion: Date | null;
    ubicacionFisica: string;
    modulo: string;
    public: boolean;
    extension: any;
}

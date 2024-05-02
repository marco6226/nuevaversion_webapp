
export interface Meta {
    id: number;
    referencia: number; // Id del Area o Planta/Localidad
    anio: number;
    modulo: string;
    empresaId: number;
    pais: string;
    valorMeta: ValorMeta[];
    metas: Meta[];
    metaAnual: number;
}

export interface ValorMeta {
    id: number;
    referencia: string; // La etiqueta de la meta
    value: number;
    idMeta: number;
}

export const Modulos: any = {
    'Accidentalidad': [
        'ILI',
        'Eventos',
        'Dias perdidos',
        'Tasa de frecuencia',
        'Tasa de severidad',
    ],
    // 'Matriz de Peligros': [
    //     'ICR'
    // ],
}
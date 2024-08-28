import { SelectItem } from "primeng/api";

export let modulos: SelectItem[] = [
    { label: 'Inspecciones', value: 'Inspecciones' },
    { label: 'Observaciones', value: 'Observaciones' },
    { label: 'Reporte A/I', value: 'Reporte A/I' },
    { label: 'Inspecciones CC', value: 'Inspecciones CC'}
]

/**
 * Este objeto contiene los módulos y cada modulo tendrá una lista por
 * defecto 'default' de columnas, si se desea crear una lista custom,
 * se debe agregar el código de la empresa y la lista que se desea mostrar
 */
export let columnasPorModulo: any = {
    'Inspecciones':  {
        "22": [
            'module',
            'fecha_reporte',
            'division',
            'areaUb',
            'hash_id',
            'nombre',
            'empResponsable',
            'fecha_proyectada',
            'estado'
        ]
    },
    'Inspecciones SV':  {
        "22": [
            'module',
            'fecha_reporte',
            'division',
            'areaUb',
            'hash_id',
            'nombre',
            'empResponsable',
            'fecha_proyectada',
            'estado'
        ]
    },
    'Observaciones': {
        "22": [
            'module',
            'fecha_reporte',
            'division',
            'areaUb',
            'hash_id',
            'nombre',
            'empResponsable',
            'fecha_proyectada',
            'estado'
        ]
    },
    'Reporte A/I': {
        "22": [
            'module',
            'fecha_reporte',
            'division',
            'areaUb',
            'hash_id',
            'nombre',
            'empResponsable',
            'fecha_proyectada',
            'estado'
        ]
    },
    'Inspecciones CC': {
        '22': [
            'module',
            'fecha_reporte',
            'aliado',
            'division_aliado',
            'localidad',
            'hash_id',
            'nombbre',
            'responsableAliado',
            'fecha_proyectada',
            'estado'
        ]
    },
    'default': {
        'Inspecciones': [
            'module',
            'fecha_reporte',
            'division',
            'area',
            'lista_inspeccion',
            'hash_id',
            'nombre',
            'empResponsable',
            'fecha_proyectada',
            'estado'
        ],
        'values': [
            'module',
            'fecha_reporte',
            'regional',
            'area',
            'hash_id',
            'nombre',
            'empResponsable',
            'fecha_proyectada',
            'estado'
        ]
    }
};
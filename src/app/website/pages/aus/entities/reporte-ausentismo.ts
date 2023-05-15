
import { Cie } from 'src/app/website/pages/comun/entities/cie'
import { Empleado } from 'src/app/website/pages/empresa/entities/empleado'
import { CausaAusentismo } from 'src/app/website/pages/aus/entities/causa-ausentismo'
import { Ciudad } from '../../comun/entities/ciudad';

export class ReporteAusentismo {
    id?: string;
    fechaElaboracion?: Date;
    fechaRadicacion?: Date;
    fechaDesde?: Date;
    fechaHasta?: Date;
    diasAusencia?: number;
    horasAusencia?: number;
    entidadOtorga?: string;
    cie?: Cie;
    ciudad?: Ciudad;
    empleado?: Empleado;
    causaAusentismo?: CausaAusentismo;
}

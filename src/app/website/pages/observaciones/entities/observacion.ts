
import { Tarjeta } from './tarjeta'
import { Implicacion } from './implicacion'
import { Area } from 'src/app/website/pages/empresa/entities/area'
import { CausaRaiz } from 'src/app/website/pages/comun/entities/causa-raiz';
import { Usuario } from 'src/app/website/pages/empresa/entities/usuario';
import { Documento } from 'src/app/website/pages/ado/entities/documento';

export class Observacion {
  id?: string;
  tipoObservacion?: string;
  afecta?: string[];
  descripcion?: string;
  recomendacion?: string;
  personasobservadas?: string;
  personasabordadas?: string;
  nivelRiesgo?: string;
  fechaObservacion?: Date;
  aceptada?: Boolean;
  motivo?: string;
  fechaRespuesta?: Date;
  area?: Area;
  implicacionList?: Implicacion[] | null;
  causaRaizList?: CausaRaiz[] | null;
  causaRaizAprobadaList?: CausaRaiz[];
  tarjeta?: Tarjeta;
  usuarioReporta?:Usuario;
  usuarioRevisa?:Usuario;
  documentoList?:Documento[];
}
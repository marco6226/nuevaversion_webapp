
import { CausaRaiz } from 'src/app/website/pages/comun/entities/causa-raiz'
import { Desviacion } from 'src/app/website/pages/comun/entities/desviacion'
import { CausaInmediata } from 'src/app/website/pages/comun/entities/causa-inmediata';
import { AnalisisCosto } from 'src/app/website/pages/comun/entities/analisis-costo';
import { Documento } from 'src/app/website/pages/ado/entities/documento';
import { CausaAdministrativa } from 'src/app/website/pages/comun/entities/sistema-causa-administrativa';
import { Tarea } from 'src/app/website/pages/comun/entities/tarea';

export class AnalisisDesviacion {
  id?: string;
  analisisCosto?:AnalisisCosto;
  observacion?: string;
  jerarquia?: string;
  fechaElaboracion?: Date;
  tareaId?: string;
  causaRaizList?: CausaRaiz[] | null;
  causaInmediataList?: CausaInmediata[] | null;
  causasAdminList?: CausaAdministrativa[] | null;
  desviacionesList?: Desviacion[];
  documentosList?:Documento[];
  tareaDesviacionList?:Tarea[]; 
  participantes?: string | null;
  tareaAsignada?:  boolean;
  flow_chart?: string;
  factor_causal?: string;
  causa_raiz?: string;
  incapacidades?: string;
  complementaria?: string;
  informe?: string;
  plan_accion?: string;
  miembros_equipo?: string;
}

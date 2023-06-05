
import { CausaRaiz } from 'src/app/website/pages/comun/entities/causa-raiz'
import { Desviacion } from 'src/app/website/pages/comun/entities/desviacion'
import { CausaInmediata } from 'src/app/website/pages/comun/entities/causa-inmediata';
import { AnalisisCosto } from 'src/app/website/pages/comun/entities/analisis-costo';
import { Documento } from 'src/app/website/pages/ado/entities/documento';
import { CausaAdministrativa } from 'src/app/website/pages/comun/entities/sistema-causa-administrativa';
import { Tarea } from 'src/app/website/pages/comun/entities/tarea';

export class AnalisisDesviacion {
  id!: string | null;
  analisisCosto!:AnalisisCosto | null;
  observacion!: string | null;
  jerarquia!: string | null;
  fechaElaboracion!: Date | null;
  tareaId!: string | null;
  causaRaizList!: CausaRaiz[] | null;
  causaInmediataList!: CausaInmediata[] | null;
  causasAdminList!: CausaAdministrativa[] | null;
  desviacionesList!: Desviacion[] | null;
  documentosList!:Documento[] | null;
  tareaDesviacionList!:Tarea[] | null; 
  participantes!: string | null;
  tareaAsignada!:  boolean | null;
  flow_chart!: string | null;
  factor_causal!: string | null;
  causa_raiz!: string | null;
  incapacidades!: string | null;
  complementaria!: string | null;
  informe!: string | null;
  plan_accion!: string | null;
  miembros_equipo!: string | null;
  gestor!: string | null;
  seguimiento!: string | null;
  observacion_causas!: string | null;
}

import { NumericTextBoxAllModule } from "@syncfusion/ej2-angular-inputs";
import { Cie } from "src/app/website/pages/comun/entities/cie";
import { Empleado } from "src/app/website/pages/empresa/entities/empleado";

export interface FactorCausal{
    id: number;
    nombre: string;
    seccion?: seccion[] | null;
    causa_Raiz?: Causa_Raiz[];
}

export interface seccion{
  tipoDesempeno: string;
  desempeno: Desempeno[];
}

export interface Desempeno{
    id: number;
    pregunta: string;
    dq:string;
    // areas: areaInvolucrada[];
    areas?: IdentificacionFC[];
    selected: boolean|null|undefined
  }

export interface areaInvolucrada{
    area: string
  }

/// procedimientos

export interface IdentificacionFC{
    id: number;
    factor: string;
    subProd: SubClasificacion[];
    selectable: boolean | null;
  }
  
export interface SubClasificacion{
  id: number;
  subProd: string;  
  causa: Causa[];
}

export interface Causa{
    id: number;
    ProcedimientoFC: string;
    esCausa: boolean;
  }

export interface Causa_Raiz{
  label: string;
  expanded: boolean;
  type: string;
  data: {name:string};
  children?: Causa_Raiz[]
}

export interface Incapacidad{
  id?:number;
  generoIncapacidad?: string | null;
  cie10?: Cie;
  diagnostico?: string;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
  tipo?: string | null;
  diasAusencia?: number | null;
}

export interface listFactores{
  pregunta?: string;
  nombre?: string;
  metodologia?: string;
  accion?: string;
}

export interface listPlanAccion{
  nombreFC?: string;
  causaRaiz?: planCausaRaiz[] | any;
}

export interface planCausaRaiz{
  // id: number;
  nombreFC2?: string;
  causaRaiz: string;
  especifico: PlanEspecifico;
  razonable?: PlanRazonable;
  medible?: PlanMedible;
  eficaz?: PlanEficaz;
  revisado?: PlanRevisado;
  preguntas?:string;
  
}

export interface PlanEspecifico{
  id:string | null;
  nombreAccionCorrectiva: string | null;
  accionCorrectiva: string | null;
  fechaVencimiento: Date | null;
  responsableEmpresa: Empleado | null;
  responsableExterno: String | null;
  isComplete: boolean | null;
  email:boolean | null;
}

export interface PlanRazonable{
  justificacion?: string | null;
  isComplete: boolean;
}

export interface PlanMedible{
  id:string | null;
  responsableEmpresa: Empleado | null
  responsableExterno: String | null
  fechaVencimiento: Date | null;
  planVerificacion: string | null;
  isComplete: boolean | null;
  email:boolean | null;
}

export interface PlanEficaz{
  id:string | null;
  responsableEmpresa: Empleado | null
  responsableExterno: String | null
  fechaVencimiento: Date | null;
  planValidacion: string | null;
  isComplete: boolean | null;
  email:boolean | null;
}

export interface PlanRevisado{
  revisado: string | null;
  isComplete: boolean;
}

export interface ValorCausas{
  id:number;
  NcausaRaiz:string;
  causaRaiz:string;
  accionCorrectiva:string;
  fechaVencimiento: Date;
  responsableEmpresa?:string | null;
  responsableExterno?:string;
}
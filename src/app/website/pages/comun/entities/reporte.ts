
import { Ciudad } from 'src/app/website/pages/comun/entities/ciudad'
import { Area } from 'src/app/website/pages/empresa/entities/area'
import { Usuario } from 'src/app/website/pages/empresa/entities/usuario'
import { Empresa } from 'src/app/website/pages/empresa/entities/empresa'
import { TestigoReporte } from 'src/app/website/pages/comun/entities/testigo-reporte'
import { Localidades, Subcontratista } from '../../ctr/entities/aliados'

export class Reporte {
  id?: number  | null;
  tipo?: string;
  nombreEps?: string  | null;
  codigoEps?: string  | null;
  nombreAfp?: string  | null;
  codigoAfp?: string  | null;
  nombreArl?: string  | null;
  codigoArl?: string  | null;
  tipoVinculador?: string  | null;
  nombreCiiu?: string | null;
  codigoCiiu?: string | null;
  razonSocial?: string | null;
  identificacionEmpresa?:string | null;
  tipoIdentificacionEmpresa?: string | null;
  direccionEmpresa?: string | null;
  telefonoEmpresa?: string | null;
  telefono2Empresa?: string | null;
  emailEmpleado?:string | null;
  emailEmpresa?: string | null;
  zonaEmpresa?: string | null;
  centrTrabIgualSedePrinc?: boolean | null;
  nombreCentroTrabajo?: string | null;
  codigoCentroTrabajo?: string | null;
  ciiuCentroTrabajo?: string | null;
  codCiiuCentroTrabajo?: string | null;
  nombreCiiuCentroTrabajo?:string | null;
  direccionCentroTrabajo?: string | null;
  telefonoCentroTrabajo?: string | null;
  zonaCentroTrabajo?: string | null;
  tipoVinculacion?: string | null;
  codigoTipoVinculacion?: string | null;
  primerApellidoEmpleado?: string | null;
  segundoApellidoEmpleado?: string | null;
  primerNombreEmpleado?: string | null;
  segundoNombreEmpleado?: string | null;
  tipoIdentificacionEmpleado?: string | null;
  numeroIdentificacionEmpleado?: string | null;
  fechaNacimientoEmpleado?: Date | null;
  generoEmpleado?: string | null;
  direccionEmpleado?: string | null;
  telefonoEmpleado?: string | null;
  telefono2Empleado?: string | null;
  fechaIngresoEmpleado?: Date | null;
  zonaEmpleado?: string | null;
  cargoEmpleado?: string | null;
  ocupacionHabitual?: string | null;
  codigoOcupacionHabitual?: string | null;
  diasLaborHabitual?: number | null;
  mesesLaborHabitual?: number | null;
  salario?: number | null;
  jornadaHabitual?: string | null;
  fechaAccidente?: Date | null;
  horaAccidente?: Date | null;
  numerofurat?: string | null;
  jornadaAccidente?: string | null;
  realizandoLaborHabitual?: boolean | null;
  nombreLaborHabitual?: string | null;
  codigoLaborHabitual?: string | null;
  horaInicioLabor?: Date | null;
  tipoAccidente?: string | null;
  causoMuerte?: boolean | null;
  zonaAccidente?: string | null;
  lugarAccidente?: string | null;
  huboTestigos?: boolean | null;
  descripcion?: string | null;
  sitio?: string | null;
  cualSitio?: string | null;
  tipoLesion?: string | null;
  cualTipoLesion?: string | null;
  parteCuerpo?: string | null;
  agente?: string | null;
  cualAgente?: string | null;
  mecanismo?: string | null;
  cualMecanismo?: string | null;
  ciudadEmpresa?: Ciudad | null;
  ciudadCentroTrabajo?: Ciudad | null;
  ciudadEmpleado?: Ciudad | null;
  ciudadAccidente?: Ciudad | null;
  areaAccidente?: Area | null;
  usuarioReporta?: Usuario | null;
  empresa?: Empresa | null;
  testigoReporteList?: TestigoReporte[] | null;
  severidad?: string | null;
  nombresResponsable?: string | null;
  apellidosResponsable?: string | null;
  tipoIdentificacionResponsable?: string | null;
  numeroIdentificacionResponsable?: string | null;
  cargoResponsable?: string | null;
  fechaReporte?: Date | null;
  temporal?:string | null;
  istemporal?: boolean | null;
  subcontratista?: Subcontratista | null;
  localidad?: Localidades | null;

}
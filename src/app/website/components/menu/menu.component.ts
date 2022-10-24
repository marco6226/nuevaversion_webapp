import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  items!: any[];
  nombreAUC: string="auc";
  nombreSEC: string="sec";
  nombreCOP: string="cop";
  empresaId!: string;

  constructor() { }

  ngOnInit(): void {
    this.items = [
      {
          label: 'Administracion',
          icon: 'settings',
          codigo: 'ADM',
          expanded: false,
          items:
              [
                  { label: 'Perfiles', codigo: 'ADM_GET_PERF', routerLink: ['/app/admin/perfil'], icon: 'lan' },
                  { label: 'Permisos', codigo: 'ADM_GET_PERM_PERF', routerLink: ['/app/admin/permisos'], icon: 'lan' },
                  { label: 'Usuarios', codigo: 'ADM_GET_USR', routerLink: ['/app/admin/usuario'], icon: 'lan' },
              ]
      },
      {
          label: 'Empresa',
          icon: 'lan',
          codigo: 'EMP',
          expanded: false,
          items:
              [
                  { label: 'Información Empresa', codigo: 'EMP_GET_EMPS', routerLink: ['/app/empresa/empresa'], icon: 'lan' },
                  { label: 'Contexto organización', codigo: 'EMP_GET_CTXEMP', routerLink: ['/app/empresa/contextoOrganizacion'], icon: 'lan' },
                  { label: 'Tipos área', codigo: 'EMP_GET_TIPOAREA', routerLink: ['/app/empresa/tipoArea'], icon: 'lan' },
                  { label: 'Organización', codigo: 'EMP_GET_AREA', routerLink: ['/app/empresa/area'], icon: 'lan' },
                  { label: 'Cargos', codigo: 'EMP_GET_CARGO', routerLink: ['/app/empresa/cargo'], icon: 'lan' },
                  { label: 'Talento humano', codigo: 'EMP_GET_EMPL', routerLink: ['/app/empresa/empleado'], icon: 'lan'},
                  { label: 'Evaluación desempeño', codigo: 'EMP_GET_EVALDES', routerLink: ['/app/empresa/evaluacionDesempeno'], icon: 'lan'},
                  { label: 'Cargue datos', codigo: 'EMP_POST_LOADEMP', routerLink: ['/app/empresa/cargueDatos'], icon: 'lan'},
              ]
      },
      {
          label: 'Contratistas',
          icon: 'lan',
          codigo: 'CTR',
          expanded: false,
          items:
              [
                  { label: 'Nuevo Aliado', codigo: 'CTR_ADM', routerLink: '/app/ctr/aliado', icon: 'lan'},
                  { label: 'Listado de Aliados', codigo: 'CTR_ADM', routerLink: '/app/ctr/listadoAliados', icon: 'lan'},
                  { label: 'Administración', codigo: 'CTR_ADM', routerLink: '/app/ctr/actualizarAliado/'+this.empresaId, icon: 'lan'},
              ]
      },
      {
          label: 'Seguimiento Casos medicos', 
          icon: 'lan',
          codigo: 'SCM',
          expanded: false,
          items:
              [
                  { label: 'Creacion de seguimiento caso', codigo: 'SCM_CREATE_CASE', routerLink: '/app/scm/creacion', icon: 'lan'},
                  { label: 'Listado de seguimientos', codigo: 'SCM_LIST_CASE', routerLink: '/app/scm/list', icon: 'lan'},
                  { label: 'Permisos', codigo: 'SCM_PERF_SCM', routerLink: '/app/scm/permisos', icon: 'lan'},

              ]
      },
      {
          label: 'AutoEvaluación',
          icon: 'lan',
          codigo: 'SGE',
          expanded: false,
          items:
              [
                  { label: 'Elaboración SGE', codigo: 'SGE_POST_SGE', routerLink: '/app/sg/sgeForm', icon: 'lan'},
                  { label: 'Sistemas de Gestión', codigo: 'SGE_GET_SGE', routerLink: '/app/sg/sistemasGestion', icon: 'lan'},
                  { label: 'Consulta Evaluacion', codigo: 'SGE_GET_EVAL', routerLink: '/app/sg/consultaEvaluaciones', icon: 'lan'}
              ]
      },
      {
          label: 'IPECR',
          icon: 'lan',
          codigo: 'IPECR',
          expanded: false,
          items:
              [
                  { label: 'Parametrización peligros', codigo: 'IPECR_PARAMPEL', routerLink: '/app/ipr/peligros', icon: 'lan'},
                  { label: 'Elaboración IPECR', codigo: 'IPECR_ELABIPECR', routerLink: '/app/ipr/formularioIpecr', icon: 'lan'},
                  { label: 'Consulta IPECR', codigo: 'IPECR_GET_IPECR', routerLink: '/app/ipr/consultaIpecr', icon: 'lan'},
              ]
      },
      {
          label: 'Inspeccion',
          icon: 'lan',
          codigo: 'INP',
          expanded: false,
          items:
              [
                  { label: 'Listas de Inspección', codigo: 'INP_GET_LISTINP', routerLink: ['/app/inspecciones/listasInspeccion'], icon: 'lan'},
                  { label: 'Elaboración Listas', codigo: 'INP_POST_LISTINP', routerLink: ['/app/inspecciones/elaboracionLista'], icon: 'lan'},
                  { label: 'Programación', codigo: 'INP_GET_PROG', routerLink: ['/app/inspecciones/programacion'], icon: 'lan'},
                  { label: 'Inspecciones Realizadas', codigo: 'INP_GET_INP', routerLink: ['/app/inspecciones/consultaInspecciones'], icon: 'lan'}
              ]
      },
      {
          label: this.nombreAUC,
          icon: 'lan',
          codigo: 'AUC',
          expanded: false,
          items:
              [
                  { label: 'Tarjetas', codigo: 'AUC_POST_TARJ', routerLink: '/app/auc/tarjeta', icon: 'lan'},
                  { label: 'Reportar', codigo: 'AUC_POST_OBS', routerLink: '/app/auc/observaciones', icon: 'lan'},
                  { label: 'Consultar', codigo: 'AUC_GET_OBS', routerLink: '/app/auc/consultaObservaciones', icon: 'lan'}
              ]
      },
      {
          label: 'Reporte A/I',
          icon: 'lan',
          codigo: 'RAI',
          expanded: false,
          items:
              [
                  { label: 'Cargar archivo', codigo: 'RAI_POST_ARCH', routerLink: '/app/rai/cargaArchivo', icon: 'lan'},
                  { label: 'Registrar reporte', codigo: 'RAI_POST_REP', routerLink: '/app/rai/registroReporte', icon: 'lan'},
                  { label: 'Consulta reportes', codigo: 'RAI_GET_REP', routerLink: '/app/rai/consultaReportes', icon: 'lan'}
              ]
      },
      {
          label: 'Ausentismo',
          icon: 'lan',
          codigo: 'AUS',
          expanded: false,
          items:
              [
                  { label: 'Reporte de ausentismo', codigo: 'AUS_POST_REPAUS', routerLink: '/app/aus/reporteAusentismo', icon: 'lan'},
                  { label: 'Consulta de reportes', codigo: 'AUS_GET_REPAUS', routerLink: '/app/aus/consultaAusentismo', icon: 'lan'},
              ]
      },
      {
          label: 'Información Documentada',
          icon: 'lan',
          codigo: 'ADO',
          expanded: false,
          items:
              [
                  { label: 'Gestión documental', codigo: 'ADO_GET_DIR', routerLink: '/app/ado/gestionDocumental', icon: 'lan'},
              ]
      },

      {
          //label: this.nombreSEC,
          label: 'Seguimiento y Control',
          icon: 'lan',
          expanded: false,
          codigo: 'SEC',
          items:
              [
                  { label: 'Investigación', codigo: 'SEC_GET_DESV', routerLink: '/app/sec/desviaciones', icon: 'lan'},
                  { label: 'Tareas asignadas', codigo: 'SEC_GET_TAR', routerLink: '/app/sec/tareasAsignadas', icon: 'lan'},
                  { label: 'Mis tareas', codigo: 'SEC_GET_MYTAR', routerLink: '/app/sec/misTareas', icon: 'lan'},
              ]
      },
      {
          label: 'Indicadores',
          icon: 'lan',
          codigo: 'IND',
          expanded: false,
          items:
              [
                  // { label: 'Elaboracion tableros', codigo: 'IND_POST_TAB', routerLink: '/app/ind/elaboracionTablero', class: 'fa fa-wrench' },
                  { label: 'Consulta tableros', codigo: 'IND_GET_TAB', routerLink: '/app/ind/consultaTablero', icon: 'lan'},
                  { label: 'Ausentismo', codigo: 'IND_GET_AUS', routerLink: '/app/ind/ausentismo', icon: 'lan'},
                  { label: 'Talento humano', codigo: 'IND_GET_EMP', routerLink: '/app/ind/emp', icon: 'lan'},
                  { label: 'Autoevaluacion', codigo: 'IND_GET_SGE', routerLink: '/app/ind/sge', icon: 'lan'},
                  { label: 'Reporte de accidentes', codigo: 'IND_GET_RAI', routerLink: '/app/ind/rai', icon: 'lan'},
                  { label: 'Inspecciones', codigo: 'IND_GET_INP', routerLink: '/app/ind/inp', icon: 'lan'},
              ]
      },
      {
          label: this.nombreCOP,
          icon: 'lan',
          codigo: 'COP',
          expanded: false,
          items:
              [
                  { label: 'Actas', codigo: 'COP_GET_ACT', routerLink: '/app/cop/consultaActas', icon: 'lan'}
              ]
      },
      {
          label: "Ayuda",
          icon: 'help',
          codigo: 'CONF_GET_MANUSR',
          expanded: false,
          items:
              [
                  { label: 'Manuales', codigo: 'CONF_GET_MANUSR', routerLink: '/app/ayuda/manuales', icon: 'lan'}
              ]
      }
    ];
  }

  toogle(item: any){
    console.log(item)
    item.expanded = !item.expanded
  }

  redirect(data: any){
    console.log(data)
  }

}

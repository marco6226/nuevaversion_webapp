import { AfterContentInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from '../../pages/core/services/session.service';
import { EmpresaService } from '../../pages/empresa/services/empresa.service';
import { AliadoInformacion } from '../../pages/ctr/entities/aliados';
import { Empresa } from '../../pages/empresa/entities/empresa';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [SesionService]
})
export class MenuComponent implements OnInit, AfterContentInit {

  @Output() statusMenu = new EventEmitter<boolean>();


  menuToggle: boolean = false;

  items!: any[];
  nombreAUC: string="Observaciones";
  nombreSEC: string="sec";
  nombreCOP: string="Copasst";
  empresa: Empresa | null = null;
  canSaveReportCtr: boolean = false;
  isTemporal: boolean = false;
  permisosAliados: any[] = [];

  constructor(
    private router: Router,
    private sesionService: SesionService,
    private empresaService: EmpresaService
  ) { }

  async ngOnInit() {
    // this.recargarMenu();
  }

  async ngAfterContentInit() {
    // this.recargarMenu();
  }

  getEmpresaId(){
    return this.empresa?.id;
  }

  toogle(item: any){
    // console.log(item)
    item.expanded = !item.expanded
  }

  redirect(data: any){
    // console.log(data)
    this.router.navigate(data.routerLink)

  }

  getEmpresa(): void{
    this.empresa = this.sesionService.getEmpresa();
  }

  getAliadoInformacion = async () => {
    await this.empresaService.getAliadoInformacion(Number(this.empresa?.id))
    .then((res: AliadoInformacion[]) => {
        if(res[0]){
            this.canSaveReportCtr = res[0].permitirReportes ? res[0].permitirReportes : false;
            this.isTemporal = res[0].istemporal ? res[0].istemporal : false;
        }
    }).catch(err => {
        console.error('Error al obtener información del aliado');
    })
  }

    public recargarMenu(): void{
    // this.items = [
    //     {
    //         label: 'Administracion',
    //         // icon: 'settings',
    //         icon: 'bi bi-gear-fill',
    //         codigo: 'ADM',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'Perfiles', codigo: 'ADM_GET_PERF', routerLink: ['/app/admin/perfil'], icon: 'person_add' },
    //                 { label: 'Permisos', codigo: 'ADM_GET_PERM_PERF', routerLink: ['/app/admin/permisos'], icon: 'lock' },
    //                 { label: 'Usuarios', codigo: 'ADM_GET_USR', routerLink: ['/app/admin/usuario'], icon: 'person' },
    //             ]
    //     },
    //     {
    //         label: 'Empresa',
    //         icon: 'bi bi-building',
    //         codigo: 'EMP',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'Información Empresa', codigo: 'EMP_GET_EMPS', routerLink: ['/app/empresa/empresa'], icon: 'domain' },
    //                 { label: 'Contexto organización', codigo: 'EMP_GET_CTXEMP', routerLink: ['/app/empresa/contextoOrganizacion'], icon: 'extension' },
    //                 { label: 'Tipos área', codigo: 'EMP_GET_TIPOAREA', routerLink: ['/app/empresa/tipoArea'], icon: 'web' },
    //                 { label: 'Organización', codigo: 'EMP_GET_AREA', routerLink: ['/app/empresa/area'], icon: 'account_tree' },
    //                 { label: 'Cargos', codigo: 'EMP_GET_CARGO', routerLink: ['/app/empresa/cargo'], icon: 'business_center' },
    //                 { label: 'Talento humano', codigo: 'EMP_GET_EMPL', routerLink: ['/app/empresa/empleado'], icon: 'groups'},
    //                 { label: 'Evaluación desempeño', codigo: 'EMP_GET_EVALDES', routerLink: ['/app/empresa/evaluacionDesempeno'], icon: 'format_list_bulleted'},
    //                 { label: 'Cargue datos', codigo: 'EMP_POST_LOADEMP', routerLink: ['/app/empresa/cargueDatos'], icon: 'publish'},
    //             ]
    //     },
    //     {
    //         label: 'Contratistas',
    //         icon: 'bi bi-person-video2',
    //         codigo: 'CTR',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'Nuevo Aliado', codigo: 'CTR_ADM', routerLink: ['/app/ctr/aliado'], icon: 'person_add'},
    //                 { label: 'Listado de Aliados', codigo: 'CTR_ADM', routerLink: ['/app/ctr/listadoAliados'], icon: 'format_list_bulleted'},
    //                 { label: 'Administración', codigo: 'CTR_ADM', routerLink: [`/app/ctr/actualizarAliado/${this.empresaId}`], icon: 'handshake'},
    //             ]
    //     },
    //     {
    //         label: 'Seguimiento Casos medicos', 
    //         icon: 'bi bi-calendar-plus-fill',
    //         codigo: 'SCM',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'Creacion de seguimiento caso', codigo: 'SCM_CREATE_CASE', routerLink: ['/app/scm/creacion'], icon: 'medical_services'},
    //                 { label: 'Listado de seguimientos', codigo: 'SCM_LIST_CASE', routerLink: ['/app/scm/list'], icon: 'view_list'},
    //                 { label: 'Permisos', codigo: 'SCM_PERF_SCM', routerLink: ['/app/scm/permisos'], icon: 'security'},
  
    //             ]
    //     },
    //     {
    //         label: 'AutoEvaluación',
    //         icon: 'pi pi-sitemap',
    //         codigo: 'SGE',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'Elaboración SGE', codigo: 'SGE_POST_SGE', routerLink: ['/app/sg/sgeForm'], icon: 'lan'},
    //                 { label: 'Sistemas de Gestión', codigo: 'SGE_GET_SGE', routerLink: ['/app/sg/sistemasGestion'], icon: 'lan'},
    //                 { label: 'Consulta Evaluacion', codigo: 'SGE_GET_EVAL', routerLink: ['/app/sg/consultaEvaluaciones'], icon: 'lan'}
    //             ]
    //     },
    //     {
    //         label: 'IPECR',
    //         icon: 'pi pi-sitemap',
    //         codigo: 'IPECR',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'Parametrización peligros', codigo: 'IPECR_PARAMPEL', routerLink: ['/app/ipr/peligros'], icon: 'lan'},
    //                 { label: 'Elaboración IPECR', codigo: 'IPECR_ELABIPECR', routerLink: ['/app/ipr/formularioIpecr'], icon: 'lan'},
    //                 { label: 'Consulta IPECR', codigo: 'IPECR_GET_IPECR', routerLink: ['/app/ipr/consultaIpecr'], icon: 'lan'},
    //             ]
    //     },
    //     {
    //         label: 'Inspeccion',
    //         icon: 'bi bi-card-checklist',
    //         codigo: 'INP',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'Listas de Inspección', codigo: 'INP_GET_LISTINP', routerLink: ['/app/inspecciones/listasInspeccion'], icon: 'lan'},
    //                 { label: 'Elaboración Listas', codigo: 'INP_POST_LISTINP', routerLink: ['/app/inspecciones/elaboracionLista'], icon: 'lan'},
    //                 { label: 'Programación', codigo: 'INP_GET_PROG', routerLink: ['/app/inspecciones/programacion'], icon: 'lan'},
    //                 { label: 'Inspecciones Realizadas', codigo: 'INP_GET_INP', routerLink: ['/app/inspecciones/consultaInspecciones'], icon: 'lan'}
    //             ]
    //     },
    //     {
    //         label: this.nombreAUC,
    //         icon: 'pi pi-sitemap',
    //         codigo: 'AUC',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'Tarjetas', codigo: 'AUC_POST_TARJ', routerLink: ['/app/auc/tarjeta'], icon: 'lan'},
    //                 { label: 'Reportar', codigo: 'AUC_POST_OBS', routerLink: ['/app/auc/observaciones'], icon: 'lan'},
    //                 { label: 'Consultar', codigo: 'AUC_GET_OBS', routerLink: ['/app/auc/consultaObservaciones'], icon: 'lan'}
    //             ]
    //     },
    //     {
    //         label: 'Reporte A/I',
    //         icon: 'bi bi-exclamation-octagon',
    //         codigo: 'RAI',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'Cargar archivo', codigo: 'RAI_POST_ARCH', routerLink: ['/app/rai/cargaArchivo'], icon: 'publish'},
    //                 { label: 'Registrar reporte', codigo: 'RAI_POST_REP', routerLink: ['/app/rai/registroReporte'], icon: 'assignment_add'},
    //                 { label: 'Consulta reportes', codigo: 'RAI_GET_REP', routerLink: ['/app/rai/consultaReportes'], icon: 'format_list_bulleted_add'}
    //             ]
    //     },
    //     {
    //         label: 'Ausentismo',
    //         icon: 'pi pi-sitemap',
    //         codigo: 'AUS',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'Reporte de ausentismo', codigo: 'AUS_POST_REPAUS', routerLink: ['/app/aus/reporteAusentismo'], icon: 'lan'},
    //                 { label: 'Consulta de reportes', codigo: 'AUS_GET_REPAUS', routerLink: ['/app/aus/consultaAusentismo'], icon: 'lan'},
    //             ]
    //     },
    //     {
    //         label: 'Información Documentada',
    //         icon: 'pi pi-sitemap',
    //         codigo: 'ADO',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'Gestión documental', codigo: 'ADO_GET_DIR', routerLink: ['/app/ado/gestionDocumental'], icon: 'lan'},
    //             ]
    //     },
  
    //     {
    //         //label: this.nombreSEC,
    //         label: 'Seguimiento y Control',
    //         icon: 'search',
    //         expanded: false,
    //         codigo: 'SEC',
    //         items:
    //             [
    //                 { label: 'Investigación', codigo: 'SEC_GET_DESV', routerLink: ['/app/sec/desviaciones'], icon: 'warning'},
    //                 { label: 'Tareas asignadas', codigo: 'SEC_GET_TAR', routerLink: ['/app/sec/tareasAsignadas'], icon: 'storage'},
    //                 { label: 'Mis tareas', codigo: 'SEC_GET_MYTAR', routerLink: ['/app/sec/misTareas'], icon: 'notifications'},
    //             ]
    //     },
    //     {
    //         label: 'Indicadores',
    //         icon: 'signal_cellular_alt',
    //         codigo: 'IND',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'HHT', codigo: 'IND_GET_HHT', routerLink: ['/app/ind/horahombrestrabajada'], icon: 'h_mobiledata' },
    //                 { label: 'Consulta tableros', codigo: 'IND_GET_TAB', routerLink: ['/app/ind/consultaTablero'], icon: 'lan'},
    //                 { label: 'Ausentismo', codigo: 'IND_GET_AUS', routerLink: ['/app/ind/ausentismo'], icon: 'lan'},
    //                 { label: 'Talento humano', codigo: 'IND_GET_EMP', routerLink: ['/app/ind/emp'], icon: 'lan'},
    //                 { label: 'Autoevaluacion', codigo: 'IND_GET_SGE', routerLink: ['/app/ind/sge'], icon: 'lan'},
    //                 { label: 'Reporte de accidentes', codigo: 'IND_GET_RAI', routerLink: ['/app/ind/rai'], icon: 'lan'},
    //                 { label: 'Inspecciones', codigo: 'IND_GET_INP', routerLink: ['/app/ind/inp'], icon: 'lan'},
    //                 { label: 'Accidentalidad', codigo: 'IND_GET_ACD', routerLink: ['/app/ind/accidentalidad'], icon: 'add_chart' },
    //                 { label: 'Ind. casos medicos corporativo', codigo: 'IND_GET_SCM', routerLink: ['/app/ind/indcasosmedicos'], icon: 'medical_services' },
    //                 { label: 'Ind. casos medicos gestión', codigo: 'IND_GET_SCMGESTION', routerLink: ['/app/ind/indcasosmedicosgestion'], icon: 'medical_services' },
    //                 { label: 'Ind. caracterización', codigo: 'IND_GET_CAR', routerLink: ['/app/ind/indcaracterizacion'], icon: 'medication' }
    //             ]
    //     },
    //     {
    //         label: this.nombreCOP,
    //         icon: 'pi pi-sitemap',
    //         codigo: 'COP',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'Actas', codigo: 'COP_GET_ACT', routerLink: ['/app/cop/consultaActas'], icon: 'lan'}
    //             ]
    //     },
    //     {
    //         label: "Ayuda",
    //         icon: 'pi pi-question-circle',
    //         codigo: 'CONF_GET_MANUSR',
    //         expanded: false,
    //         items:
    //             [
    //                 { label: 'Manuales', codigo: 'CONF_GET_MANUSR', routerLink: ['/app/ayuda/manuales'], icon: 'lan'}
    //             ]
    //     }
    //   ];
    this.getEmpresa();
    this.getAliadoInformacion();

    if(this.empresa?.idEmpresaAliada){
        if(this.isTemporal){
            this.permisosAliados = this.permisosAliados.concat([
                { label: 'Registrar reporte T', codigo: 'RAI_POST_REPT', routerLink: '/app/rai/registroReporteTemporal', icon: 'bi bi-h-square' },
                { label: 'Consulta reportes T', codigo: 'RAI_GET_REPT', routerLink: '/app/rai/consultaReportestemporal', icon: 'bi bi-list-task' },
                { label: 'HHT', codigo: 'IND_GET_HHTALIADO', routerLink: '/app/ind/horahombrestrabajada', icon: 'bi bi-clock' },
            ]);
        }
        if(this.canSaveReportCtr){
            this.permisosAliados = this.permisosAliados.concat([
                { label: 'Registrar reporte', codigo: 'RAI_POST_REPCTR', routerLink: '/app/rai/registroReporteCtr', icon: 'bi bi-h-square' },
                { label: 'Consulta reportes de Aliados', codigo: 'RAI_GET_REP_ALIADO', routerLink: '/app/rai/consultarReportesAliados', icon: 'bi bi-list-task'}
            ]);
        }
    }else{
        this.permisosAliados = this.permisosAliados.concat([
            { label: 'Registrar reporte T', codigo: 'RAI_POST_REPT', routerLink: '/app/rai/registroReporteTemporal', icon: 'bi bi-h-square' },
            { label: 'Consulta reportes T', codigo: 'RAI_GET_REPT', routerLink: '/app/rai/consultaReportestemporal', icon: 'bi bi-list-task' },
            { label: 'HHT', codigo: 'IND_GET_HHTALIADO', routerLink: '/app/ind/horahombrestrabajada', icon: 'bi bi-clock' },
            { label: 'Registrar reporte', codigo: 'RAI_POST_REPCTR', routerLink: '/app/rai/registroReporteCtr', icon: 'bi bi-h-square' },
            { label: 'Consulta reportes de Aliados', codigo: 'RAI_GET_REP_ALIADO', routerLink: '/app/rai/consultarReportesAliados', icon: 'bi bi-list-task'}
        ]);
    }

    this.items = [
        {
            label: 'Administracion',
            // icon: 'settings',
            icon: 'bi bi-gear-fill',
            codigo: 'ADM',
            expanded: false,
            items:
                [
                    { label: 'Perfiles', codigo: 'ADM_GET_PERF', routerLink: ['/app/admin/perfil'], icon: 'bi bi-person-add' },
                    { label: 'Permisos', codigo: 'ADM_GET_PERM_PERF', routerLink: ['/app/admin/permisos'], icon: 'bi bi-lock' },
                    { label: 'Usuarios', codigo: 'ADM_GET_USR', routerLink: ['/app/admin/usuario'], icon: 'bi bi-person' },
                ]
        },
        {
            label: 'Empresa',
            icon: 'bi bi-building',
            codigo: 'EMP',
            expanded: false,
            items:
                [
                    { label: 'Información Empresa', codigo: 'EMP_GET_EMPS', routerLink: ['/app/empresa/empresa'], icon: 'bi bi-building' },
                    { label: 'Contexto organización', codigo: 'EMP_GET_CTXEMP', routerLink: ['/app/empresa/contextoOrganizacion'], icon: 'bi bi-puzzle' },
                    { label: 'Tipos área', codigo: 'EMP_GET_TIPOAREA', routerLink: ['/app/empresa/tipoArea'], icon: 'bi bi-window-stack' },
                    { label: 'Organización', codigo: 'EMP_GET_AREA', routerLink: ['/app/empresa/area'], icon: 'pi pi-sitemap' },
                    { label: 'Cargos', codigo: 'EMP_GET_CARGO', routerLink: ['/app/empresa/cargo'], icon: 'bi bi-briefcase' },
                    { label: 'Talento humano', codigo: 'EMP_GET_EMPL', routerLink: ['/app/empresa/empleado'], icon: 'bi bi-people'},
                    { label: 'Evaluación desempeño', codigo: 'EMP_GET_EVALDES', routerLink: ['/app/empresa/evaluacionDesempeno'], icon: 'bi bi-list-task'},
                    { label: 'Cargue datos', codigo: 'EMP_POST_LOADEMP', routerLink: ['/app/empresa/cargueDatos'], icon: 'bi bi-database'},
                ]
        },
        {
            label: 'Aliados',
            icon: 'bi bi-person-video2',
            codigo: 'CTR',
            expanded: false,
            items:
                [
                    { label: 'Nuevo Aliado', codigo: 'CTR_ADM', routerLink: ['/app/ctr/aliado'], icon: 'bi bi-person-badge'},
                    { label: 'Listado de Aliados', codigo: 'CTR_ADM', routerLink: ['/app/ctr/listadoAliados'], icon: 'bi bi-card-list'},
                    { label: 'Administración', codigo: 'CTR_ADM', routerLink: [`/app/ctr/actualizarAliado/${this.getEmpresaId()}`], icon: 'bi bi-building-gear'},
                ].concat(this.permisosAliados)
        },
        {
            label: 'Seguimiento Casos medicos', 
            icon: 'bi bi-calendar-plus-fill',
            codigo: 'SCM',
            expanded: false,
            items:
                [
                    { label: 'Creacion de seguimiento caso', codigo: 'SCM_CREATE_CASE', routerLink: ['/app/scm/creacion'], icon: 'bi bi-bag-plus'},
                    { label: 'Listado de seguimientos', codigo: 'SCM_LIST_CASE', routerLink: ['/app/scm/list'], icon: 'bi bi-card-list'},
                    { label: 'Permisos', codigo: 'SCM_PERF_SCM', routerLink: ['/app/scm/permisos'], icon: 'bi bi-lock'},
  
                ]
        },
        {
            label: 'AutoEvaluación',
            icon: 'bi bi-journal-text',
            codigo: 'SGE',
            expanded: false,
            items:
                [
                    { label: 'Elaboración SGE', codigo: 'SGE_POST_SGE', routerLink: ['/app/sg/sgeForm'], icon: 'bi bi-layout-split'},
                    { label: 'Sistemas de Gestión', codigo: 'SGE_GET_SGE', routerLink: ['/app/sg/sistemasGestion'], icon: 'bi bi-grid-3x2-gap'},
                    { label: 'Consulta Evaluacion', codigo: 'SGE_GET_EVAL', routerLink: ['/app/sg/consultaEvaluaciones'], icon: 'bi bi-list-task'}
                ]
        },
        {
            label: 'IPECR',
            icon: 'pi pi-money-bill',
            codigo: 'IPECR',
            expanded: false,
            items:
                [
                    { label: 'Parametrización peligros', codigo: 'IPECR_PARAMPEL', routerLink: ['/app/ipr/peligros'], icon: 'bi bi-gear'},
                    { label: 'Elaboración IPECR', codigo: 'IPECR_ELABIPECR', routerLink: ['/app/ipr/formularioIpecr'], icon: 'bi bi-info-circle'},
                    { label: 'Consulta IPECR', codigo: 'IPECR_GET_IPECR', routerLink: ['/app/ipr/consultaIpecr'], icon: 'bi bi-list-task'},
                ]
        },
        {
            label: 'Inspeccion',
            icon: 'bi bi-card-checklist',
            codigo: 'INP',
            expanded: false,
            items:
                [
                    { label: 'Listas de Inspección', codigo: 'INP_GET_LISTINP', routerLink: ['/app/inspecciones/listasInspeccion'], icon: 'pi pi-list'},
                    { label: 'Elaboración Listas', codigo: 'INP_POST_LISTINP', routerLink: ['/app/inspecciones/elaboracionLista'], icon: 'pi pi-cog'},
                    { label: 'Programación', codigo: 'INP_GET_PROG', routerLink: ['/app/inspecciones/programacion'], icon: 'pi pi-calendar'},
                    { label: 'Inspecciones Realizadas', codigo: 'INP_GET_INP', routerLink: ['/app/inspecciones/consultaInspecciones'], icon: 'pi pi-check-square'}
                ]
        },
        {
            label: this.nombreAUC,
            icon: 'pi pi-eye',
            codigo: 'AUC',
            expanded: false,
            items:
                [
                    { label: 'Tarjetas', codigo: 'AUC_POST_TARJ', routerLink: ['/app/auc/tarjeta'], icon: 'pi pi-sitemap'},
                    { label: 'Reportar', codigo: 'AUC_POST_OBS', routerLink: ['/app/auc/observaciones'], icon: 'pi pi-eye'},
                    { label: 'Consultar', codigo: 'AUC_GET_OBS', routerLink: ['/app/auc/consultaObservaciones'], icon: 'pi pi-list'}
                ]
        },
        {
            label: 'Reporte A/I',
            icon: 'bi bi-exclamation-octagon',
            codigo: 'RAI',
            expanded: false,
            items:
                [
                    { label: 'Cargar archivo', codigo: 'RAI_POST_ARCH', routerLink: ['/app/rai/cargaArchivo'], icon: 'pi pi-upload'},
                    { label: 'Registrar reporte', codigo: 'RAI_POST_REP', routerLink: ['/app/rai/registroReporte'], icon: 'pi pi-pencil'},
                    { label: 'Consulta reportes', codigo: 'RAI_GET_REP', routerLink: ['/app/rai/consultaReportes'], icon: 'pi pi-list'}
                ]
        },
        {
            label: 'Ausentismo',
            icon: 'pi pi-user',
            codigo: 'AUS',
            expanded: false,
            items:
                [
                    { label: 'Reporte de ausentismo', codigo: 'AUS_POST_REPAUS', routerLink: ['/app/aus/reporteAusentismo'], icon: 'pi pi-question-circle'},
                    { label: 'Consulta de reportes', codigo: 'AUS_GET_REPAUS', routerLink: ['/app/aus/consultaAusentismo'], icon: 'pi pi-list'},
                ]
        },
        {
            label: 'Información Documentada',
            icon: 'pi pi-folder',
            codigo: 'ADO',
            expanded: false,
            items:
                [
                    { label: 'Gestión documental', codigo: 'ADO_GET_DIR', routerLink: ['/app/ado/gestionDocumental'], icon: 'pi pi-file'},
                ]
        },
  
        {
            //label: this.nombreSEC,
            label: 'Seguimiento y Control',
            icon: 'pi pi-search',
            expanded: false,
            codigo: 'SEC',
            items:
                [
                    { label: 'Investigación', codigo: 'SEC_GET_DESV', routerLink: ['/app/sec/desviaciones'], icon: 'pi pi-info-circle'},
                    { label: 'Tareas asignadas', codigo: 'SEC_GET_TAR', routerLink: ['/app/sec/tareasAsignadas'], icon: 'pi pi-server'},
                    { label: 'Mis tareas', codigo: 'SEC_GET_MYTAR', routerLink: ['/app/sec/misTareas'], icon: 'pi pi-bell'},
                ]
        },
        {
            label: 'Indicadores',
            icon: 'pi pi-chart-bar',
            codigo: 'IND',
            expanded: false,
            items:
                [
                    { label: 'HHT', codigo: 'IND_GET_HHT', routerLink: ['/app/ind/horahombrestrabajada'], icon: 'pi pi-hourglass' },
                    { label: 'Consulta tableros', codigo: 'IND_GET_TAB', routerLink: ['/app/ind/consultaTablero'], icon: 'pi pi-sitemap'},
                    { label: 'Ausentismo', codigo: 'IND_GET_AUS', routerLink: ['/app/ind/ausentismo'], icon: 'pi pi-sitemap'},
                    { label: 'Talento humano', codigo: 'IND_GET_EMP', routerLink: ['/app/ind/emp'], icon: 'pi pi-sitemap'},
                    { label: 'Autoevaluacion', codigo: 'IND_GET_SGE', routerLink: ['/app/ind/sge'], icon: 'pi pi-sitemap'},
                    { label: 'Reporte de accidentes', codigo: 'IND_GET_RAI', routerLink: ['/app/ind/rai'], icon: 'pi pi-sitemap'},
                    { label: 'Inspecciones', codigo: 'IND_GET_INP', routerLink: ['/app/ind/inp'], icon: 'pi pi-sitemap'},
                    { label: 'Accidentalidad', codigo: 'IND_GET_ACD', routerLink: ['/app/ind/accidentalidad'], icon: 'pi pi-exclamation-triangle' },
                    { label: 'Ind. casos medicos corporativo', codigo: 'IND_GET_SCM', routerLink: ['/app/ind/indcasosmedicos'], icon: 'pi pi-heart' },
                    { label: 'Ind. casos medicos gestión', codigo: 'IND_GET_SCMGESTION', routerLink: ['/app/ind/indcasosmedicosgestion'], icon: 'pi pi-heart' },
                    { label: 'Ind. caracterización', codigo: 'IND_GET_CAR', routerLink: ['/app/ind/indcaracterizacion'], icon: 'pi pi-list' }
                ]
        },
        {
            label: this.nombreCOP,
            icon: 'pi pi-users',
            codigo: 'COP',
            expanded: false,
            items:
                [
                    { label: 'Actas', codigo: 'COP_GET_ACT', routerLink: ['/app/cop/consultaActas'], icon: 'pi pi-book'}
                ]
        },
        {
            label: "Ayuda",
            icon: 'pi pi-question-circle',
            codigo: 'CONF_GET_MANUSR',
            expanded: false,
            items:
                [
                    { label: 'Manuales', codigo: 'CONF_GET_MANUSR', routerLink: ['/app/ayuda/manuales'], icon: 'pi pi-sitemap'}
                ]
        }
    ];
    
    this.permisosAliados = [];
  }

  toogleMenu(){
    this.menuToggle = !this.menuToggle;
    const childLabels = document.querySelectorAll("[id='text-toggle']");
    const arrow = document.getElementById('arrow');
    const container = document.getElementById('container');
    const data = document.querySelectorAll("[id='data']");
 
    

    if(this.menuToggle){

        arrow?.classList.add('bi-caret-left-fill')
        arrow?.classList.remove('bi-caret-right-fill')

        container?.classList.add('container-show')
        container?.classList.remove('container-hide')

        data.forEach(element => {
            element.classList.add('data-show');
            element.classList.remove('data-hide'); 
        });

        setTimeout(() => {
            childLabels.forEach(element => {
                element.classList.add('text-show');
                element.classList.remove('text-hide') 
            });
    
        }, 100);
        
    }
    else{
        childLabels.forEach(element => {
            element.classList.add('text-hide')
            element.classList.remove('text-show') 
        });
        
        setTimeout(() => {
            arrow?.classList.add('bi-caret-right-fill')
            arrow?.classList.remove('bi-caret-left-fill')
            container?.classList.remove('container-show')
            container?.classList.add('container-hide')
            data.forEach(element => {
                element.classList.remove('data-show');
                element.classList.add('data-hide'); 
            });
            
        }, 80);
                
    }
    // const childLabels = document.getElementById('labelChild');
    // this.menuToggle = !this.menuToggle;
    // this.statusMenu.emit(this.menuToggle);
  }

  test(event: any){
    console.log(event)
  }

}

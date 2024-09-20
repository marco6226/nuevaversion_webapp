import { AfterContentInit, Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from '../../pages/core/services/session.service';
import { EmpresaService } from '../../pages/empresa/services/empresa.service';
import { AliadoInformacion } from '../../pages/ctr/entities/aliados';
import { Empresa } from '../../pages/empresa/entities/empresa';
import { HideAndShowMenuService } from '../shared-services/hide-and-show-menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [SesionService],
})
export class MenuComponent implements OnInit, AfterContentInit {
  @Input('statusMenuIn') set sStatusMenu(statusMenu: boolean) {
    if (this.statusMenu)
      setTimeout(() => {
        this.toogleMenu();
      }, 300);
    this.statusMenu = true;
  }
  statusMenu: boolean = false;
  items: any[] = [];
  nombreAUC: string = 'Observaciones';
  nombreSEC: string = 'sec';
  nombreCOP: string = 'Copasst';
  empresa: Empresa | null = null;
  canSaveReportCtr: boolean = false;
  isTemporal: boolean = false;
  permisosAliados: any[] = [];
  version!: string;

  constructor(
    private router: Router,
    private sesionService: SesionService,
    private empresaService: EmpresaService,
    private _hideAndShowMenuService: HideAndShowMenuService
  ) {}

  async ngOnInit() {
    this.version = this.sesionService.getAppVersion();
  }

  async ngAfterContentInit() {}

  getEmpresaId() {
    return this.empresa?.id;
  }

  toogle(item: any) {
    item.expanded = !item.expanded;
  }

  redirect(data: any) {
    this.router.navigate(data.routerLink).then(() => {
      // Realizar el desplazamiento suave
      window.scrollTo({
        top: 0, // La posición vertical a la que deseas desplazar
        behavior: 'smooth', // 'auto' para un desplazamiento inmediato, 'smooth' para un desplazamiento suave
      });
    });
  }

  getEmpresa(): void {
    this.empresa = this.sesionService.getEmpresa();
  }

  getAliadoInformacion = async () => {
    await this.empresaService
      .getAliadoInformacion(Number(this.empresa?.id))
      .then((res: AliadoInformacion[]) => {
        if (res[0]) {
          this.canSaveReportCtr = res[0].permitirReportes
            ? res[0].permitirReportes
            : false;
          this.isTemporal = res[0].istemporal ? res[0].istemporal : false;
        }
      })
      .catch((err) => {
        console.error('Error al obtener información del aliado');
      });
  };

  public recargarMenu(): void {
    this.getEmpresa();
    this.getAliadoInformacion();

    if (this.empresa?.idEmpresaAliada) {
      if (this.isTemporal) {
        this.permisosAliados = this.permisosAliados.concat([
          {
            label: 'Registrar AT Temporal',
            codigo: 'RAI_POST_REPT',
            routerLink: ['/app/rai/registroReporteTemporal'],
            icon: 'bi bi-h-square',
          },
          {
            label: 'Consultar AT Temporal',
            codigo: 'RAI_GET_REPT',
            routerLink: ['/app/rai/consultaReportestemporal'],
            icon: 'bi bi-list-task',
          },
          {
            label: 'HHT Temporal',
            codigo: 'IND_GET_HHTALIADO',
            routerLink: ['/app/ind/horahombrestrabajada'],
            icon: 'bi bi-clock',
          },
        ]);
      }
      if (this.canSaveReportCtr) {
        this.permisosAliados = this.permisosAliados.concat([
          {
            label: 'Registrar AT Aliado',
            codigo: 'RAI_POST_REPCTR',
            routerLink: ['/app/rai/registroReporteCtr'],
            icon: 'bi bi-h-square',
          },
          {
            label: 'Consultar AT Aliado',
            codigo: 'RAI_GET_REP_ALIADO',
            routerLink: ['/app/rai/consultarReportesAliados'],
            icon: 'bi bi-list-task',
          },
        ]);
      }
    } else {
      this.permisosAliados = this.permisosAliados.concat([
        {
          label: 'Registrar AT Temporal',
          codigo: 'RAI_POST_REPT',
          routerLink: ['/app/rai/registroReporteTemporal'],
          icon: 'bi bi-h-square',
        },
        {
          label: 'Consultar AT Temporal',
          codigo: 'RAI_GET_REPT',
          routerLink: ['/app/rai/consultaReportestemporal'],
          icon: 'bi bi-list-task',
        },
        {
          label: 'HHT Temporal',
          codigo: 'IND_GET_HHTALIADO',
          routerLink: ['/app/ind/horahombrestrabajada'],
          icon: 'bi bi-clock',
        },
        {
          label: 'Registrar AT Aliado',
          codigo: 'RAI_POST_REPCTR',
          routerLink: ['/app/rai/registroReporteCtr'],
          icon: 'bi bi-h-square',
        },
        {
          label: 'Consultar AT Aliado',
          codigo: 'RAI_GET_REP_ALIADO',
          routerLink: ['/app/rai/consultarReportesAliados'],
          icon: 'bi bi-list-task',
        },
      ]);
    }

    this.items = [
      {
        label: 'Administracion',
        // icon: 'settings',
        icon: 'bi bi-gear-fill',
        codigo: 'ADM',
        expanded: false,
        items: [
          {
            label: 'Perfiles',
            codigo: 'ADM_GET_PERF',
            routerLink: ['/app/admin/perfil'],
            icon: 'bi bi-person-add',
          },
          {
            label: 'Permisos',
            codigo: 'ADM_GET_PERM_PERF',
            routerLink: ['/app/admin/permisos'],
            icon: 'bi bi-lock',
          },
          {
            label: 'Usuarios',
            codigo: 'ADM_GET_USR',
            routerLink: ['/app/admin/usuario'],
            icon: 'bi bi-person',
          },
        ],
      },
      {
        label: 'Empresa',
        icon: 'bi bi-building',
        codigo: 'EMP',
        expanded: false,
        items: [
          {
            label: 'Información Empresa',
            codigo: 'EMP_GET_EMPS',
            routerLink: ['/app/empresa/empresa'],
            icon: 'bi bi-building',
          },
          {
            label: 'Contexto organización',
            codigo: 'EMP_GET_CTXEMP',
            routerLink: ['/app/empresa/contextoOrganizacion'],
            icon: 'bi bi-puzzle',
          },
          {
            label: 'Tipos área',
            codigo: 'EMP_GET_TIPOAREA',
            routerLink: ['/app/empresa/tipoArea'],
            icon: 'bi bi-window-stack',
          },
          {
            label: 'Organización',
            codigo: 'EMP_GET_AREA',
            routerLink: ['/app/empresa/area'],
            icon: 'pi pi-sitemap',
          },
          {
            label: 'Cargos',
            codigo: 'EMP_GET_CARGO',
            routerLink: ['/app/empresa/cargo'],
            icon: 'bi bi-briefcase',
          },
          {
            label: 'Talento humano',
            codigo: 'EMP_GET_EMPL',
            routerLink: ['/app/empresa/empleado'],
            icon: 'bi bi-people',
          },
          {
            label: 'Evaluación desempeño',
            codigo: 'EMP_GET_EVALDES',
            routerLink: ['/app/empresa/evaluacionDesempeno'],
            icon: 'bi bi-list-task',
          },
          {
            label: 'Cargue datos',
            codigo: 'EMP_POST_LOADEMP',
            routerLink: ['/app/empresa/cargueDatos'],
            icon: 'bi bi-database',
          },
        ],
      },
      {
        label: 'Aliados',
        icon: 'bi bi-person-video2',
        codigo: 'CTR',
        expanded: false,
        items: [
          {
            label: 'Nuevo Aliado',
            codigo: 'CTR_ADM',
            routerLink: ['/app/ctr/aliado'],
            icon: 'bi bi-person-badge',
          },
          {
            label: 'Listado de Aliados',
            codigo: 'CTR_ADM',
            routerLink: ['/app/ctr/listadoAliados'],
            icon: 'bi bi-card-list',
          },
          {
            label: 'Administración',
            codigo: 'CTR_IND',
            routerLink: [`/app/ctr/actualizarAliado/${this.getEmpresaId()}`],
            icon: 'bi bi-building-gear',
          },
        ]
          .concat(this.permisosAliados)
          .concat([
            {
              label: 'Ciclo corto',
              codigo: 'CTR_SUBMENU_CICLOCORTO',
              routerLink: [],
              icon: 'pi pi-check-circle',
            },
          ]),
        items2: [
          {
            padre: 'Ciclo corto',
            label: 'Elaborar lista de Inspección',
            codigo: 'CTR_ELABORAR_LISTA_CC',
            routerLink: ['/app/ctr/elaborarListaCicloCorto'],
            icon: 'pi pi-cog',
          },
          {
            padre: 'Ciclo corto',
            label: 'Listas de Inspección',
            codigo: 'CTR_CONSULTAR_LISTAS_CC',
            routerLink: ['/app/ctr/listasAuditoriaCicloCorto'],
            icon: 'pi pi-list',
          },
          {
            padre: 'Ciclo corto',
            label: 'Calendario ciclo corto',
            codigo: 'CTR_CALENDARIO_INP_CC',
            routerLink: ['/app/ctr/calendario'],
            icon: 'pi pi-calendar',
          },
          {
            padre: 'Ciclo corto',
            label: 'Inspecciones realizadas',
            codigo: 'CTR_CONSULTAR_INP_CC',
            routerLink: ['/app/ctr/auditoriasRealizadas'],
            icon: 'pi pi-check-square',
          },
        ],
      },
      {
        label: 'Seguimiento Casos medicos',
        icon: 'bi bi-calendar-plus-fill',
        codigo: 'SCM',
        expanded: false,
        items: [
          {
            label: 'Creacion de seguimiento caso',
            codigo: 'SCM_CREATE_CASE',
            routerLink: ['/app/scm/creacion'],
            icon: 'bi bi-bag-plus',
          },
          {
            label: 'Listado de seguimientos',
            codigo: 'SCM_LIST_CASE',
            routerLink: ['/app/scm/list'],
            icon: 'bi bi-card-list',
          },
          {
            label: 'Creación salud laboral',
            codigo: 'SCM_GET_MODSL',
            routerLink: ['/app/scm/saludlaboral'],
            icon: 'bi bi-heart-pulse',
          },
          {
            label: 'Listado salud laboral',
            codigo: 'SCM_GET_LCSL',
            routerLink: ['/app/scm/saludlaborallist'],
            icon: 'bi bi-postcard-heart',
          },
          {
            label: 'Listado Documentacion Solicitada',
            codigo: 'SCM_GET_LDS',
            routerLink: ['/app/scm/documentacionsolicitado'],
            icon: 'bi bi-file-earmark-arrow-up-fill',
          },
          {
            label: 'Listado Documentacion Solicitada por mi',
            codigo: 'SCM_GET_LDUS',
            routerLink: ['/app/scm/listdocumentacionsolicitante'],
            icon: 'bi bi-file-earmark-arrow-down-fill',
          },
          {
            label: 'Permisos',
            codigo: 'SCM_PERF_SCM',
            routerLink: ['/app/scm/permisos'],
            icon: 'bi bi-lock',
          },
        ],
      },
      {
        label: 'AutoEvaluación',
        icon: 'bi bi-journal-text',
        codigo: 'SGE',
        expanded: false,
        items: [
          {
            label: 'Elaboración SGE',
            codigo: 'SGE_POST_SGE',
            routerLink: ['/app/sg/sgeForm'],
            icon: 'bi bi-layout-split',
          },
          {
            label: 'Sistemas de Gestión',
            codigo: 'SGE_GET_SGE',
            routerLink: ['/app/sg/sistemasGestion'],
            icon: 'bi bi-grid-3x2-gap',
          },
          {
            label: 'Consulta Evaluacion',
            codigo: 'SGE_GET_EVAL',
            routerLink: ['/app/sg/consultaEvaluaciones'],
            icon: 'bi bi-list-task',
          },
        ],
      },
      {
        label: 'IPECR',
        icon: 'pi pi-exclamation-triangle',
        codigo: 'IPECR',
        expanded: false,
        items: [
          // { label: 'Parametrización peligros', codigo: 'IPECR_PARAMPEL', routerLink: ['/app/ipr/peligros'], icon: 'bi bi-gear'},
          // { label: 'Elaboración IPECR', codigo: 'IPECR_ELABIPECR', routerLink: ['/app/ipr/formularioIpecr'], icon: 'bi bi-info-circle'},
          // { label: 'Consulta IPECR', codigo: 'IPECR_GET_IPECR', routerLink: ['/app/ipr/consultaIpecr'], icon: 'bi bi-list-task'},
          {
            label: 'Registro matriz peligros',
            codigo: 'IPECR_GET_MATRIZPELIGROS',
            routerLink: ['/app/ipr/matrizPeligros'],
            icon: 'bi bi-pencil-square',
          },
          {
            label: 'Matrices peligros',
            codigo: 'IPECR_GET_LISTMPELIGROS',
            routerLink: ['/app/ipr/listadomatrizPeligros'],
            icon: 'pi pi-table',
          },
        ],
      },
      {
        label: 'Inspeccion',
        icon: 'bi bi-card-checklist',
        codigo: 'INP',
        expanded: false,
        items: [
          {
            label: 'Listas de Inspección',
            codigo: 'INP_GET_LISTINP',
            routerLink: ['/app/inspecciones/listasInspeccion'],
            icon: 'pi pi-list',
          },
          {
            label: 'Elaboración Listas',
            codigo: 'INP_POST_LISTINP',
            routerLink: ['/app/inspecciones/elaboracionLista'],
            icon: 'pi pi-cog',
          },
          {
            label: 'Programación',
            codigo: 'INP_GET_PROG',
            routerLink: ['/app/inspecciones/programacion'],
            icon: 'pi pi-calendar',
          },
          {
            label: 'Inspecciones Realizadas',
            codigo: 'INP_GET_INP',
            routerLink: ['/app/inspecciones/consultaInspecciones'],
            icon: 'pi pi-check-square',
          },
        ],
      },
      {
        label: 'Signos vitales',
        icon: 'bi bi-lungs-fill',
        codigo: 'ISV',
        expanded: false,
        items: [
          {
            label: 'Listas de Signos vitales',
            codigo: 'INP_GET_LISTSIGNOS',
            routerLink: ['/app/signos/listaInspeccionSignos'],
            icon: 'pi pi-list',
          },
          {
            label: 'Elaboración Listas Signos Vitales',
            codigo: 'INP_GET_LISTSIGNOS',
            routerLink: ['/app/signos/elaboracionListaSv'],
            icon: 'pi pi-cog',
          },
          {
            label: 'Programación Signos Vitales',
            codigo: 'INP_GET_LISTSIGNOS',
            routerLink: ['/app/signos/programacionSv'],
            icon: 'pi pi-calendar',
          },
          {
            label: 'Signos vitales Realizadas',
            codigo: 'INP_GET_LISTSIGNOS',
            routerLink: ['/app/signos/consultarInspeccionesSv'],
            icon: 'pi pi-check-square',
          },
        ],
      },
      {
        label: this.nombreAUC,
        icon: 'pi pi-eye',
        codigo: 'AUC',
        expanded: false,
        items: [
          {
            label: 'Tarjetas',
            codigo: 'AUC_POST_TARJ',
            routerLink: ['/app/auc/tarjeta'],
            icon: 'pi pi-sitemap',
          },
          {
            label: 'Reportar',
            codigo: 'AUC_POST_OBS',
            routerLink: ['/app/auc/observaciones'],
            icon: 'pi pi-eye',
          },
          {
            label: 'Consultar',
            codigo: 'AUC_GET_OBS',
            routerLink: ['/app/auc/consultaObservaciones'],
            icon: 'pi pi-list',
          },
        ],
      },
      {
        label: 'Reporte A/I',
        icon: 'bi bi-exclamation-octagon',
        codigo: 'RAI',
        expanded: false,
        items: [
          {
            label: 'Cargar archivo',
            codigo: 'RAI_POST_ARCH',
            routerLink: ['/app/rai/cargaArchivo'],
            icon: 'pi pi-upload',
          },
          {
            label: 'Registrar reporte',
            codigo: 'RAI_POST_REP',
            routerLink: ['/app/rai/registroReporte'],
            icon: 'pi pi-pencil',
          },
          {
            label: 'Consulta reportes',
            codigo: 'RAI_GET_REP',
            routerLink: ['/app/rai/consultaReportes'],
            icon: 'pi pi-list',
          },
        ],
      },
      {
        label: 'Ausentismo',
        icon: 'pi pi-user',
        codigo: 'AUS',
        expanded: false,
        items: [
          {
            label: 'Reporte de ausentismo',
            codigo: 'AUS_POST_REPAUS',
            routerLink: ['/app/aus/reporteAusentismo'],
            icon: 'pi pi-question-circle',
          },
          {
            label: 'Consulta de reportes',
            codigo: 'AUS_GET_REPAUS',
            routerLink: ['/app/aus/consultaAusentismo'],
            icon: 'pi pi-list',
          },
        ],
      },
      {
        label: 'Información Documentada',
        icon: 'pi pi-folder',
        codigo: 'ADO',
        expanded: false,
        items: [
          {
            label: 'Gestión documental',
            codigo: 'ADO_GET_DIR',
            routerLink: ['/app/ado/gestionDocumental'],
            icon: 'pi pi-file',
          },
        ],
      },

      {
        //label: this.nombreSEC,
        label: 'Seguimiento y Control',
        icon: 'pi pi-search',
        expanded: false,
        codigo: 'SEC',
        items: [
          {
            label: 'Investigación',
            codigo: 'SEC_GET_DESV',
            routerLink: ['/app/sec/desviaciones'],
            icon: 'pi pi-info-circle',
          },
          {
            label: 'Tareas asignadas',
            codigo: 'SEC_GET_TAR',
            routerLink: ['/app/sec/tareasAsignadas'],
            icon: 'pi pi-server',
          },
          {
            label: 'Mis tareas',
            codigo: 'SEC_GET_MYTAR',
            routerLink: ['/app/sec/misTareas'],
            icon: 'pi pi-bell',
          },
        ],
      },
      {
        label: 'Indicadores',
        icon: 'pi pi-chart-bar',
        codigo: 'IND',
        expanded: false,
        items: [
          {
            label: 'HHT',
            codigo: 'IND_GET_HHT',
            routerLink: ['/app/ind/horahombrestrabajada'],
            icon: 'bi bi-clock',
          },
          {
            label: 'Consulta tableros',
            codigo: 'IND_GET_TAB',
            routerLink: ['/app/ind/consultaTablero'],
            icon: 'pi pi-sitemap',
          },
          {
            label: 'Ausentismo',
            codigo: 'IND_GET_AUS',
            routerLink: ['/app/ind/ausentismo'],
            icon: 'pi pi-sitemap',
          },
          {
            label: 'Talento humano',
            codigo: 'IND_GET_EMP',
            routerLink: ['/app/ind/emp'],
            icon: 'pi pi-sitemap',
          },
          {
            label: 'Autoevaluacion',
            codigo: 'IND_GET_SGE',
            routerLink: ['/app/ind/sge'],
            icon: 'pi pi-sitemap',
          },
          {
            label: 'Reporte de accidentes',
            codigo: 'IND_GET_RAI',
            routerLink: ['/app/ind/rai'],
            icon: 'pi pi-sitemap',
          },
          {
            label: 'Inspecciones',
            codigo: 'IND_GET_INP',
            routerLink: ['/app/ind/inp'],
            icon: 'pi pi-sitemap',
          },
          {
            label: 'Accidentalidad',
            codigo: 'IND_GET_ACD',
            routerLink: ['/app/ind/accidentalidad'],
            icon: 'pi pi-exclamation-triangle',
          },
          {
            label: 'Ind. casos medicos corporativo',
            codigo: 'IND_GET_SCM',
            routerLink: ['/app/ind/indcasosmedicos'],
            icon: 'bi bi-building-check',
          },
          {
            label: 'Ind. casos medicos gestión',
            codigo: 'IND_GET_SCMGESTION',
            routerLink: ['/app/ind/indcasosmedicosgestion'],
            icon: 'bi bi-bounding-box',
          },
          {
            label: 'Ind. caracterización',
            codigo: 'IND_GET_CAR',
            routerLink: ['/app/ind/indcaracterizacion'],
            icon: 'pi pi-list',
          },
          {
            label: 'Ind. matriz peligros',
            codigo: 'ING_GET_MP',
            routerLink: ['/app/ind/indmatrizpeligros'],
            icon: 'pi pi-chart-bar',
          },
          {
            label: 'Metas',
            codigo: 'IND_GET_METAS',
            routerLink: ['/app/ind/metas'],
            icon: 'pi pi-chart-line',
          },
        ],
      },
      {
        label: this.nombreCOP,
        icon: 'pi pi-users',
        codigo: 'COP',
        expanded: false,
        items: [
          {
            label: 'Actas',
            codigo: 'COP_GET_ACT',
            routerLink: ['/app/cop/consultaActas'],
            icon: 'pi pi-book',
          },
        ],
      },
      {
        label: 'Ayuda',
        icon: 'pi pi-question-circle',
        codigo: 'CONF_GET_MANUSR',
        expanded: false,
        items: [
          {
            label: 'Manuales',
            codigo: 'CONF_GET_MANUSR',
            routerLink: ['/app/ayuda/manuales'],
            icon: 'pi pi-sitemap',
          },
        ],
      },
    ];

    this.permisosAliados = [];
  }

  toogleMenu() {
    if (this._hideAndShowMenuService.getMenuToggle()) {
      this._hideAndShowMenuService.showMenu();
      this._hideAndShowMenuService.setMenuToggle(
        !this._hideAndShowMenuService.getMenuToggle()
      );
    } else {
      this._hideAndShowMenuService.hideMenu();
      this._hideAndShowMenuService.setMenuToggle(
        !this._hideAndShowMenuService.getMenuToggle()
      );
    }
  }

  tieneItems2(item: any): boolean {
    return item.items2 ? true : false;
  }

  routerLinkIsValid(routerLink: string[]): boolean {
    return routerLink.length > 0 ? true : false;
  }

  getItems2For(item: any, subItem: any) {
    return item.items2.filter((item2: any) => item2.padre === subItem.label);
  }

  Ipadre: any = 50;
  Ihijo: any = 50;
  Ihijo2: any = 50;
  indexSelect(Ipadre: any, Ihijo: any, Ihijo2: any) {
    this.Ipadre = Ipadre;
    this.Ihijo = Ihijo;
    this.Ihijo2 = Ihijo2;
  }
  test(i: any, j: any, k: any) {
    console.log('aqui');
    console.log(i, j, k);
  }
}

import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PerfilService } from 'src/app/website/pages/admin/services/perfil.service';
import { UsuarioService } from 'src/app/website/pages/admin/services/usuario.service';
import { ViewResumenInpAliados } from 'src/app/website/pages/comun/entities/view-resumen-aliados';
import { Criteria } from 'src/app/website/pages/core/entities/filter';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { ParametroNavegacionService } from 'src/app/website/pages/core/services/parametro-navegacion.service';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { ViewInspeccionCtrService } from 'src/app/website/pages/core/services/view-inspecciones-ctr.service';
import { ViewResumenInpAliadosService } from 'src/app/website/pages/core/services/view-resumen-aliados.service';
import { Empresa } from 'src/app/website/pages/empresa/entities/empresa';
import { EmpresaService } from 'src/app/website/pages/empresa/services/empresa.service';
import { Inspeccion } from 'src/app/website/pages/inspecciones/entities/inspeccion';
import { ListaInspeccion } from 'src/app/website/pages/inspecciones/entities/lista-inspeccion';

@Component({
  selector: 'app-consulta-inspecciones-ctr',
  templateUrl: './consulta-inspecciones-ctr.component.html',
  styleUrls: ['./consulta-inspecciones-ctr.component.scss'],
  providers: [ViewInspeccionCtrService, ViewResumenInpAliadosService,UsuarioService]
})
export class ConsultaInspeccionesCtrComponent implements OnInit,AfterViewInit {

  @ViewChild('dt', { static: false }) table!: Table;

  inspeccionesList: any[] = [];
  inspeccionSelect!: Inspeccion;
  totalRecords!: number;
  loading: boolean = true;
  testing: boolean = false;
  areasPermiso!: string;
  userParray: any;
  listaInspeccion!: ListaInspeccion;
  totalRecordsResumen: number = 0;
  dataResumen: ViewResumenInpAliados[] = [];
  resumenSelected!: ViewResumenInpAliados;
  loadingResumen: boolean = false;
  tableScroll!:any;
  isScrollRigth: boolean = true;
  isScrollLeft: boolean = false;

  fieldsResumen: string[] = [
    'id',
    'aliado',
    'programadas',
    'ejecutadas',
    'noProgramadas',
    'calificacionAcumulada',
    'porcentajeAvance',
    'idEmpresaAliada'
  ];
  aliados: Empresa[] = [];
  sliderRange: number[] = [0, 100];
  sliderRangeProg: number[] = [0, 100];
  sliderRangeEjec: number[] = [0, 100];
  sliderRangeNoProg: number[] = [0, 100];
  sliderRangeCalificacion: number[] = [0, 100];
  sliderRangePorcentajeAv: number[] = [0, 100];

  visibleDlgCorreo: boolean = false;
  formEmail: FormGroup | null = null;

  inpID!:number
  emails:any;

  constructor(
    private paramNav: ParametroNavegacionService,
    private sesionService: SesionService,
    private userService: PerfilService,
    private messageService: MessageService,
    private empresaService: EmpresaService,
    private viewInspeccionCtrService: ViewInspeccionCtrService,
    private viewResumenInpAliadosService: ViewResumenInpAliadosService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ){
    this.formEmail = this.fb.group({
      emails: [[], [Validators.required, Validators.email]]
    })
  }

  ngOnInit() {
    this.testing = true;
    this.areasPermiso = this.sesionService.getPermisosMap()['INP_GET_INP'].areas;
    let areasPermiso = this.areasPermiso.replace('{', '');
    areasPermiso = areasPermiso.replace('}', '');
    let areasPermiso2 = areasPermiso.split(',')

    const filteredArea = areasPermiso2.filter(function (ele, pos) {
      return areasPermiso2.indexOf(ele) == pos;
    })
    this.areasPermiso = '{' + filteredArea.toString() + '}';
  }

  ngAfterViewInit() {
    this.tableWrapper();
    this.addScrollEventListener();
  }

  private tableWrapper() {
    this.tableScroll = this.table.el.nativeElement.querySelector(".p-datatable-wrapper");
  }

  private addScrollEventListener() {
    if (this.tableScroll) {
      this.tableScroll.addEventListener('scroll', this.onManualScroll.bind(this));
    }
  }

  private onManualScroll() {

    if(this.tableScroll.scrollLeft === 0){
      this.isScrollLeft = false;
      this.isScrollRigth = true;
    }else{
      this.isScrollLeft = true;
      this.isScrollRigth = false;
    }

  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const buttons = document.querySelector('.floating-buttons-scroll') as HTMLElement;
    if (buttons) {
      buttons.style.top = `${scrollTop + 50}px`;
    }
  }

  async loadAliados() {
    if(this.aliados.length > 0) return;
    let idEmpresa: string = this.sesionService.getParamEmp();
    if(!idEmpresa || idEmpresa == ''){
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          idEmpresa = this.sesionService.getParamEmp();
          resolve(idEmpresa);
        }, 2000);
      });
    }
    let filterQuery = new FilterQuery();
    filterQuery.sortField = "id";
    filterQuery.sortOrder = 1;
    filterQuery.filterList = [
      {criteria: Criteria.EQUALS, field: 'idEmpresaAliada', value1: idEmpresa},
      {criteria: Criteria.IS_NOT_NULL, field: 'tipoPersona'}
    ]

    await this.empresaService.findByFilter(filterQuery).then(
      (res: any) => {
        // console.log(res);
        this.aliados = Array.from(res.data);
      },
      (reason: any) => {
        console.error('Error al obtener lista de aliados: ', reason);
      }
    );
  }

  async lazyLoadResumen(event: LazyLoadEvent) {
    this.loadingResumen = true;
    let filterQuery: FilterQuery = new FilterQuery();
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    filterQuery.fieldList = this.fieldsResumen;
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;
    let sesionEmpresa = this.sesionService.getEmpresa();
    if(sesionEmpresa == null){
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          sesionEmpresa = this.sesionService.getEmpresa();
          resolve(sesionEmpresa);
        }, 2000);
      })
    }
    if(sesionEmpresa?.idEmpresaAliada !== null) {
      filterQuery.filterList.push(
        {criteria: Criteria.LIKE, field: 'aliado', value1: sesionEmpresa?.nit + '%'}
      )
    } else {
      filterQuery.filterList.push(
        {criteria: Criteria.EQUALS, field: 'idEmpresaAliada', value1: this.sesionService.getParamEmp()}
      );
    }

    this.viewResumenInpAliadosService.findByFilter(filterQuery)
    .then(
      (res: any) => {
        this.totalRecordsResumen = res['count'];
        this.dataResumen = Array.from(res['data']);
      }
    ).catch(
      (err: any) => {
        console.error('Error al consultar resumen de aliados...', err);
      }
    ).finally(
      () => {
        this.loadingResumen = false;
      }
    );
  }

  async lazyLoad(event: LazyLoadEvent) {

    await this.loadAliados().then();
    
    let user: any = JSON.parse(localStorage.getItem('session')!);
    let filterQueryu = new FilterQuery();
    filterQueryu.filterList = [{
      field: 'usuarioEmpresaList.usuario.id',
      criteria: Criteria.EQUALS,
      value1: user.usuario.id,
      value2: null
    }];
    const userP = await this.userService.findByFilter(filterQueryu);
    this.userParray = userP;

    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;
    // filterQuery.fieldList = [
    //   'id', 'programacion_localidad_localidad', 'programacion_fecha', 'fecha', 'listaInspeccion_codigo',
    //   'listaInspeccion_formulario', 'listaInspeccion_listaInspeccionPK_version', 'listaInspeccion_fkPerfilId',
    //   'usuarioRegistra', 'nombreUsuarioRegistra', 'empresaAliada', 'tipoInspeccion', 'empresaAliadaConNit',
    //   'calificacion', 'estado', 'division',]

    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    let sesionEmpresa = this.sesionService.getEmpresa();
    if(sesionEmpresa?.idEmpresaAliada !== null){
      filterQuery.filterList.push({criteria: Criteria.EQUALS, field: 'empresa.id', value1: sesionEmpresa?.idEmpresaAliada?.toString()});
      filterQuery.filterList.push({criteria: Criteria.EQUALS, field: 'empresaAliada.id', value1: sesionEmpresa?.id});
    }else{
      filterQuery.filterList.push({criteria: Criteria.EQUALS, field: 'empresa.id', value1: sesionEmpresa?.id});
    };

    await this.viewInspeccionCtrService.findByFilter(filterQuery).then(
      (resp: any) => {
        this.totalRecords = resp['count'];
        this.inspeccionesList = [];
        // console.log(resp);
        (<any[]>resp['data']).forEach(dto => {
          try {
            let obj = FilterQuery.dtoToObject(dto)
            obj['hash'] = obj.listaInspeccion.listaInspeccionPK.id + '.' + obj.listaInspeccion.listaInspeccionPK.version;
            
            if(sesionEmpresa?.idEmpresaAliada !== null) {
              obj.calificacion = Number(obj.calificacion.toFixed(2));
              this.inspeccionesList.push(obj);
            } else {
              for (const profile of this.userParray.data) {
                let perfilArray = JSON.parse(obj.listaInspeccion.fkPerfilId)
                perfilArray.forEach((perfil: any) => {
                  if (perfil === profile.id) {
                    if (!this.inspeccionesList.find(element => element == obj)) {
                      // console.log(obj);
                      obj.calificacion = Number(obj.calificacion.toFixed(2));
                      this.inspeccionesList.push(obj);
                    }
                  }
                });
              }
            }
          } catch (error) {
            console.log('error:', error);
          }
          // console.log(this.inspeccionesList);
        });
      }
    ).finally(() => {
      this.loading = false;
      this.testing = false;
    });
  }



  redirect(consultar: boolean) {
    if (this.inspeccionSelect == null) {
      this.messageService.add({ severity: 'warn', detail: 'Debe seleccionar una inspección para ' + (consultar ? 'consultar' : 'modificarla') });
    } else {
      this.paramNav.setAccion<string>(+ consultar ? 'GET' : 'PUT');
      this.paramNav.setParametro<Inspeccion>(this.inspeccionSelect);
      this.paramNav.redirect('/app/ctr/elaboracionAuditoriaCicloCorto');
    }
  }

  redirectNoProg(consultar: boolean) {
    // if (this.inspeccionNoProgSelect == null) {
    //   this.messageService.add({ severity: 'warn', detail: 'Debe seleccionar una inspección para ' + (consultar ? 'consultar' : 'modificarla') });
    // } else {
    //   this.paramNav.setAccion<string>(+ consultar ? 'GET' : 'PUT');
    //   this.paramNav.setParametro<Inspeccion>(this.inspeccionNoProgSelect);
    //   this.paramNav.redirect('/app/ctr/elaboracionAuditoriaCicloCorto');
    // }
  }

  navegar() {
    this.paramNav.redirect('/app/ctr/calendario');
  }

  getIdsAliados(): string {
    return this.aliados.map(aliado => {
      return String(aliado.id);
    }).join(',');
  }

  openDlgEmails(inpID: number){
    this.inpID=inpID
    this.emails=[]
    this.formEmail?.reset();
    this.visibleDlgCorreo = true;
  }

  closeDlgEmails(){
    this.formEmail?.reset();
    this.visibleDlgCorreo = false;
  }
  
  async envioEmails(){

    // console.log(this.formEmail)
    // console.log(this.emails, this.inpID)
    try {
      if(this.emails.length>0){
        await this.emails.forEach(async (element:any) => {
          await this.usuarioService.emailAliadoCicloCorto(element, this.inpID.toString());
        });
        this.messageService.add({severity: 'success', summary: 'Correo enviado'});
      }else {
        this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'Debe proporcionar uno o más correos.'});
      }
    } catch (error) {
      console.error('Error:', error);
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ocurrió un error al enviar correo.'});
    }
    // this.usuarioService.emailAliadoCicloCorto('juanbernal@lerprevencion.com', this.inpID.toString());
    // this.formEmail?.reset();
    this.visibleDlgCorreo = false;
  }

  scrollLeft() {
    if (this.tableScroll) {
      this.tableScroll.scrollLeft -= 10000;
      this.isScrollLeft = false;
      this.isScrollRigth = true;
      this.tableScroll.removeEventListener('scroll', this.onManualScroll.bind(this));
      setTimeout(() => {
        this.tableScroll.addEventListener('scroll', this.onManualScroll.bind(this));
      }, 50);
    }
  }
  
  scrollRight() {
    if (this.tableScroll) {
      this.tableScroll.scrollLeft += 10000;
      this.isScrollRigth = false;
      this.isScrollLeft = true;
      this.tableScroll.removeEventListener('scroll', this.onManualScroll.bind(this));
      setTimeout(() => {
        this.tableScroll.addEventListener('scroll', this.onManualScroll.bind(this));
      }, 50);
    }
  }

}

import { FilterQuery } from './../../../core/entities/filter-query';
import { EmpresaService } from './../../../empresa/services/empresa.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AliadoInformacion } from '../../entities/aliados';
import { MessageService } from 'primeng/api';
import { Empresa } from '../../../empresa/entities/empresa';
import { Directorio } from '../../../ado/entities/directorio';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { Criteria, Filter } from '../../../core/entities/filter';
import { SesionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-aliados-actualizar',
  templateUrl: './aliados-actualizar.component.html',
  styleUrls: ['./aliados-actualizar.component.scss'],
  providers: [DirectorioService, UsuarioService, EmpresaService]
})
export class AliadosActualizarComponent implements OnInit, OnDestroy {

  id: number = -1;
  idEmpresaAliada!: number | null;
  empresaId:any;
  aliado: Empresa = {
    id: '',
    nombreComercial: '',
    razonSocial: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    web: '',
    numeroSedes: undefined,
    arl: null,
    ciiu: null,
    logo: '',
    tipo_persona: null,
    empresasContratistasList: [],
    estado:'',
    calificacion:''
  };

  aliadoInformacion: AliadoInformacion = {
    id_empresa: 0,
    actividad_contratada: null,
    division: null,
    localidad: null,
    calificacion: null,
    colider: null,
    documentos: null,
    representante_legal: '',
    numero_trabajadores: 0,
    numero_trabajadores_asignados: 0,
    fecha_vencimiento_arl: null,
    fecha_vencimiento_sst: null,
    fecha_vencimiento_cert_ext: null,
    control_riesgo: null,
    email_comercial: null,
    telefono_contacto: null,
    puntaje_arl: null,
    calificacion_aliado: 0,
    fecha_calificacion_aliado: null,
    nombre_calificador: '',
    arl: null,
    autoriza_subcontratacion: null,
    istemporal: null,
    permitirReportes: null
  }

  documentos: Directorio[] = [];
  onEdit: string = '';
  auxAutorizaSubcontratacion!: boolean | null;
  auxIsTemporal!: boolean;
  impactoV:string='';
  tabIndex:number=0;
  flagPress: boolean=false;
  flagValid:boolean=false;
  flagConsult:boolean=false;
  teamSstIsComplete: boolean = false;

  constructor(
    private rutaActiva: ActivatedRoute,
    private empresaService: EmpresaService,
    private directorioService: DirectorioService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private sessionService: SesionService
  ) {}
  
  async ngOnInit() {
    this.id = this.rutaActiva.snapshot.params['id'];
    this.onEdit = this.rutaActiva.snapshot.params['onEdit'];
    this.flagConsult=this.onEdit=='consultar'?true:false
    this.loadData().then();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('actualizarAliado');
  }

  async loadData(){
    let empresa = this.sessionService.getEmpresa();
    console.log("Empresa empresa: ", empresa);
    this.empresaId = empresa;
    this.idEmpresaAliada = empresa?.idEmpresaAliada ? empresa.idEmpresaAliada : null;
    let filterQuery = new FilterQuery();
    filterQuery.filterList = [];

    let filtro = new Filter();
    filtro.criteria = Criteria.EQUALS;
    filtro.field = 'id';
    filtro.value1 = this.id.toString();

    filterQuery.filterList.push(filtro);
    await this.empresaService.findByFilter(filterQuery).then(
        (resp: any) => {
          resp['data'].forEach((element: any) => {
            this.aliado = element;
          });
        }
    );

    await this.loadInformacionAliado();
  }

  async loadInformacionAliado(){
    this.aliadoInformacion.id_empresa = this.id;
    console.log("this.aliadoInformacion.id_empresa", this.aliadoInformacion.id_empresa);
    await this.empresaService.getAliadoInformacion(this.id).then((ele: AliadoInformacion[])=>{
      if(ele[0] != undefined){
        this.aliadoInformacion = ele[0];
      }      
    });
    this.auxAutorizaSubcontratacion = this.aliadoInformacion.autoriza_subcontratacion;
    this.auxIsTemporal = this.aliadoInformacion.istemporal || false;

    await this.loadDocumentos()

    // await this.saveInformacionAliado();
    if(this.aliadoInformacion.id == null){
      // this.loadInformacionAliado();
      this.messageService.add({ severity:'error', summary: 'Error', detail: 'No se pudo leer información del aliado'});
    }
  }

  async saveInformacionAliado(){
    await this.empresaService.saveAliadoInformacion(this.aliadoInformacion).then((ele)=>{ 
    });
  }

  loadDocumentos(){
    if(this.aliadoInformacion.documentos){
      let docId:any=[]
      let docId2:any=[]
      docId=[...JSON.parse(this.aliadoInformacion.documentos)]
      docId.forEach(async (element: any) => {
        await this.directorioService.buscarDocumentosById(element).then((elem: Directorio[])=>{
          if(elem.length>0){
          this.documentos.push(elem[0]);
          docId2.push(element)}
        }).catch(er=>console.log(er))
        this.aliadoInformacion.documentos = JSON.stringify(docId2);
      });      
    }
    
  }

  async onReciveData(event: string, tipe: string){
    
    switch (tipe) {
      case 'actividades':
        this.aliadoInformacion.actividad_contratada = event        
        break;
        
      case 'division':
        this.aliadoInformacion.division = event     
        break;

      case 'localidad':
        this.aliadoInformacion.localidad = event        
        break;

      case 'calificacion':
        this.aliadoInformacion.calificacion = event        
        break;

      case 'colider':
        this.aliadoInformacion.colider = event        
        break;

      case 'repLegal':
        this.aliadoInformacion.representante_legal = event        
        break;

      case 'numTrabajadores':
        this.aliadoInformacion.numero_trabajadores = Number.parseInt(event);    
        break;

      case 'numTrabajadoresAsig':
        this.aliadoInformacion.numero_trabajadores_asignados = Number.parseInt(event);        
        break;

      case 'control-riesgo':
        this.aliadoInformacion.control_riesgo = JSON.stringify(event);
        break;

      case 'emailComercial':
        this.aliadoInformacion.email_comercial = event;
        break;

      case 'telefonoContacto':
        this.aliadoInformacion.telefono_contacto = event;
        break;

      case 'arl':
        this.aliadoInformacion.arl = event;
        break;
      default:
        break;
    }
  }

  reciveIdDoc(event: string){
    let dataList = []
    if(this.aliadoInformacion.documentos){
      dataList = JSON.parse(this.aliadoInformacion.documentos)
    }
    dataList.push(Number.parseInt(event))
    this.aliadoInformacion.documentos = JSON.stringify(dataList)
  }

  reciveFechaArl(event: Date){
    this.aliadoInformacion.fecha_vencimiento_arl = event;
  }

  reciveFechaSst(event: Date){
    this.aliadoInformacion.fecha_vencimiento_sst = event;
  }

  reciveFechaCertExterna(event: Date){
    this.aliadoInformacion.fecha_vencimiento_cert_ext = event;
  }

  getFecha(docType: string){
    switch(docType){
      case 'arl':
        return this.aliadoInformacion.fecha_vencimiento_arl;
      case 'sst':
        return this.aliadoInformacion.fecha_vencimiento_sst;
      case 'certExt':
        return this.aliadoInformacion.fecha_vencimiento_cert_ext;
      default:
        return
    }
  }

  async onRecivePuntajeArl(data: number){
    this.aliadoInformacion.puntaje_arl = data;
  }

  onReciveCalificacionAliadoData(data: any, selector: string){
    switch (selector) {
      case 'puntaje':
        this.aliadoInformacion.calificacion_aliado = data;
        break;
      case 'fecha':
        this.aliadoInformacion.fecha_calificacion_aliado = data;
        break;
      case 'nombre':
        this.aliadoInformacion.nombre_calificador = data;
        break;
      default:
        break;
    }
  }

  onReciveAutorizaSubcontratacion(data: boolean){
    this.auxAutorizaSubcontratacion = data;
  }

  onReceiveIsTemporal(data: boolean){
    this.auxIsTemporal = data;
  }

  onReceivePermitirRegistroAt(data: boolean){
    this.aliadoInformacion.permitirReportes = data;
  }

  async actualizarAliado(){
    this.mensajesDeValidacion();

    this.aliadoInformacion.autoriza_subcontratacion = this.auxAutorizaSubcontratacion;
    this.aliadoInformacion.istemporal = this.auxIsTemporal;
    this.aliadoInformacion.permitirReportes = this.auxIsTemporal ? false : this.aliadoInformacion.permitirReportes;
    this.saveInformacionAliado();

    this.aliado.fechaActualizacion = new Date();
    
    if(this.idEmpresaAliada && this.aliadoDataIsValid()){
      this.aliado.estado='Actualizado';
    }else if(this.idEmpresaAliada){
      this.aliado.estado='En proceso';
    }

    this.aliado.calificacion=this.impactoV;
    if(this.aliado.division !== null){
      this.aliado.division = JSON.stringify(this.aliado.division)
    }
    await this.empresaService.update(this.aliado).then( () => {
      // this.messageService.add({ severity:'success', summary: 'Guardado', detail: 'Los cambios han sido guardados'});
      if(typeof this.onEdit == 'undefined' && this.aliadoDataIsValid()){
        this.usuarioService.emailAliadoActualizado(this.aliado.correoAliadoCreador!, this.aliado.id!);
        this.messageService.add({key: 'msgActualizarAliado', severity:'success', summary: 'Guardado', detail: 'Los cambios han sido guardados'});
      }
      if(this.onEdit == 'edit' && this.gestorDataIsValid()){
        this.messageService.add({key: 'msgActualizarAliado', severity:'success', summary: 'Guardado', detail: 'Los cambios han sido guardados'});
      }
    });
    this.flagPress=true;
  }

  impactoIn(event: any){
    this.impactoV=event
  }

  flagValidMetodo(e: any){
    this.flagValid=e;
  }

  gestorDataIsValid(): boolean{
    return (
        (this.aliadoInformacion.actividad_contratada != null && this.aliadoInformacion.actividad_contratada != '' && this.actividadContratadaIsValid(this.aliadoInformacion.actividad_contratada))
        && (this.aliadoInformacion.division != null && this.aliadoInformacion.division != '' && JSON.parse(this.aliadoInformacion.division).length > 0) 
        && (this.aliadoInformacion.localidad != null && this.aliadoInformacion.localidad != '' && JSON.parse(this.aliadoInformacion.localidad).length > 0)
        && (this.aliadoInformacion.colider != null && this.aliadoInformacion.colider != '')
        && (this.aliadoInformacion.control_riesgo != null && this.aliadoInformacion.control_riesgo != '' && JSON.parse(this.aliadoInformacion.control_riesgo).length > 0)
        && (
            this.flagValid
            // this.aliadoInformacion.calificacion != null 
            // && this.aliadoInformacion.calificacion != ''
            // && JSON.parse(this.aliadoInformacion.calificacion).length >= 9
           )
        && (this.auxAutorizaSubcontratacion != null)
      );
  }

  aliadoDataIsValid(): boolean{
    return (
      (this.aliadoInformacion.representante_legal != null)
      && (this.aliadoInformacion.numero_trabajadores != null)
      && (this.aliadoInformacion.numero_trabajadores_asignados != null)
      && (this.aliadoInformacion.email_comercial != null)
      && (this.aliadoInformacion.telefono_contacto != null)
      && (this.aliadoInformacion.arl != null)
      && (this.aliadoInformacion.documentos != null && this.validarDocumentos() == 2)
      && (this.aliadoInformacion.fecha_vencimiento_arl != null)
      && (this.aliadoInformacion.fecha_vencimiento_sst != null)
      && (this.aliadoInformacion.puntaje_arl != null)
      && (this.teamSstIsComplete)
    );
  }

  mensajesDeValidacion(){
    if(this.onEdit == 'edit' && !this.gestorDataIsValid()){
      this.messageService.add({key: 'msgActualizarAliado', severity:'error', summary: 'Error', detail: 'La información del aliado no está completa'});
      if(this.aliadoInformacion.actividad_contratada == null || this.aliadoInformacion.actividad_contratada == '' || !this.actividadContratadaIsValid(this.aliadoInformacion.actividad_contratada)){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha seleccionado las actividades contratadas.', life:6000});
      }
      if(this.aliadoInformacion.division == null || this.aliadoInformacion.division == '' || JSON.parse(this.aliadoInformacion.division).length == 0){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha seleccionado la división de negocio.', life:6000});
      }
      if(this.aliadoInformacion.localidad == null || this.aliadoInformacion.localidad == '' || JSON.parse(this.aliadoInformacion.localidad).length == 0){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha seleccionado la localidad o las localidades.', life:6000});
      }
      if(this.aliadoInformacion.colider == null || this.aliadoInformacion.colider == ''){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha seleccionado el gestor del contrato.', life:6000});
      }
      if(this.aliadoInformacion.control_riesgo == null || this.aliadoInformacion.control_riesgo == '' || JSON.parse(this.aliadoInformacion.control_riesgo).length == 0){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha seleccionado las actividades habilitadas.', life:6000});
      }
      if(!this.flagValid){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha completado la clasificación.', life:6000});
      }
      if(this.auxAutorizaSubcontratacion == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe indicar si autoriza la subcontratación en la pestaña de Información.', life:6000});
      }
    }
    
    if(typeof this.onEdit == 'undefined' && !this.aliadoDataIsValid()){
      this.messageService.add({key: 'msgActualizarAliado', severity:'error', summary: 'Error', detail: 'La información no está completa'});
      if(this.aliadoInformacion.representante_legal == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar nombre del representante legal.', life:6000});
      }
      if(this.aliadoInformacion.numero_trabajadores == null || this.aliadoInformacion.numero_trabajadores == 0){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar el número de trabajadores totales del aliado.', life:6000});
      }
      if(this.aliadoInformacion.numero_trabajadores_asignados == null || this.aliadoInformacion.numero_trabajadores_asignados == 0){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar el número de trabajadores del aliado en CORONA.', life:6000});
      }
      if(this.aliadoInformacion.email_comercial == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar el email de comunicaciones.', life:6000});
      }
      if(this.aliadoInformacion.telefono_contacto == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar el teléfono de contacto.', life:6000});
      }
      if(this.aliadoInformacion.arl == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe Seleccionar la ARL del aliado.', life:6000});
      }
      let VALIDACION_DOCUMENTOS_RESULT = this.validarDocumentos();
      if(this.aliadoInformacion.documentos == null || VALIDACION_DOCUMENTOS_RESULT != 2){
        if(VALIDACION_DOCUMENTOS_RESULT == 0){
          this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha guardado el soporte de la licencia SST.', life:6000});
        }else if(VALIDACION_DOCUMENTOS_RESULT == 1){
          this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'No ha guardado el soporte la certificación de ARL.', life:6000});
        }else if(VALIDACION_DOCUMENTOS_RESULT == -1){
          this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe guardar los soportes de los documentos de ARL y SST.', life:6000});
        }
      }
      if(this.aliadoInformacion.fecha_vencimiento_arl == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar la fecha de vencimiento del certificado de ARL', life:6000});
      }
      if(this.aliadoInformacion.fecha_vencimiento_sst == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar la fecha de vencimiento de la licencia SST.', life:6000});
      }
      if(this.aliadoInformacion.puntaje_arl == null){
        this.messageService.add({key: 'msgActualizarAliado', severity:'warn', summary: 'Información faltante', detail: 'Debe ingresar el puntaje de su certificado de ARL.', life:6000});
      }
      if(!this.teamSstIsComplete){
        this.messageService.add({key: 'msgActualizarAliado', severity: 'warn', summary: 'Información faltante', detail: 'Debe completar el equipo SST.', life: 6000})
      }
    }
  }

  actividadContratadaIsValid(data: string): boolean{
    let actividadList = JSON.parse(data);
    if(actividadList.length == 2 && actividadList[1].length == 0){
      return false;
    }
    return true;
  }

  validarDocumentos(): number{
    let contArl = 0, contSst = 0;
    this.documentos.forEach((doc: Directorio) => {
      if(doc.documento!.proceso=='arl') contArl++;
      if(doc.documento!.proceso=='licencia') contSst++;
    });
    /*
    Retornará
    -1 si no hay documentos para arl y sst
    0 si hay documentos para arl pero no para sst
    1 si no hay documento para arl pero si para sst
    2 si hay documentos para arl y sst
    */
    if(contArl == 0 && contSst == 0) return -1;
    if(contArl > 0 && contSst == 0) return 0;
    if(contArl == 0 && contSst > 0) return 1;
    return 2;
  }

  async deleteDocumento(documentos: string){
    this.aliadoInformacion.documentos = documentos;
    await this.saveInformacionAliado();
    this.loadDocumentos();
  }

  onTeamSstChange(event: boolean){
    this.teamSstIsComplete = event;
  }
}

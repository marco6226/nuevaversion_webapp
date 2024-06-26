import { Perfil } from './../../../empresa/entities/perfil';
import { Usuario, UsuarioEmpresa } from './../../../empresa/entities/usuario';
import { AliadoInformacion } from '../../entities/aliados';
import { UsuarioService } from './../../../admin/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { _actividadesContratadasList, _divisionList, ActividadesContratadas, Localidades } from '../../entities/aliados';
import { Empresa } from '../../../empresa/entities/empresa';
import { locale_es } from '../../../rai/entities/reporte-enumeraciones';
import { Documento } from '../../../ado/entities/documento';
import { Modulo } from '../../../core/enums/enumeraciones';
import { Directorio } from '../../../ado/entities/directorio';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { SesionService } from '../../../core/services/session.service';
import { DirectorioService } from '../../../ado/services/directorio.service';

@Component({
  selector: 'app-aliados',
  templateUrl: './aliados.component.html',
  styleUrls: ['./aliados.component.scss'],
  providers: [UsuarioService, DirectorioService, EmpresaService, SesionService]

})
export class AliadosComponent implements OnInit {

  valueEmpresa: Empresa={
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
    empresasContratistasList: [],
    tipo_persona: '',
  };

  @Input('valueEmpresa') 
  set valuesIn (value: Empresa){
    this.valueEmpresa = value
    this.loadActividadesContratadas()
    this.loadLocalidades()
    if (this.valueEmpresa.division) {
      this.valueEmpresa.division = JSON.parse( this.valueEmpresa.division)   
    }
    this.loadDataIn();
  }
  
  @Input() onEdit: string | null= null;
  @Input() flagConsult: boolean=false;
  
  
  @Input('calificacion') calificacion!: number | null;
  
  fecha_calificacion!: Date | null;
  @Input('fechaCalificacion')
  set setFechaCalificacion(fecha: Date){
    if(fecha){
      this.fecha_calificacion = new Date(fecha);
    }
  }
  
  @Input() quienCalifica: string= '';

  @Output() dataCalificacion = new EventEmitter<number>();
  @Output() dataFechaCalificacion = new EventEmitter<Date>();
  @Output() dataQuienCalifica = new EventEmitter<string>();
  @Output() dataAutorizaSubcontratacion =new EventEmitter<boolean>();
  @Output() dataIsTemporal = new EventEmitter<boolean>();
  @Output() onPermitirReporteAt = new EventEmitter<boolean>();
  @Input('autorizaSubcontratacion')
  set setAutorizaSubcontratacion(data: boolean){
    if(data==null) return;
    if(data){
      this.autorizaSubcontratacion = 'Si';
    }else{
      this.autorizaSubcontratacion = 'No';
    }
  }
  istemporal!:string;
  @Input('istemporal')
  set setIstemporal(data: boolean){
    if(data == null) return;
    if(data){
      this.istemporal = 'Si';
    }else{
      this.istemporal = 'No';
    }
  }
  istemporalFlag: boolean = false;
  autorizaRegistroAt!: boolean;
  @Input('permitirReporteAt')
  set setPermitirReporteAt(data: boolean){
    if(data){
      this.autorizaRegistroAt = data;
    }else {
      this.autorizaRegistroAt = false;
    }
  }
  autorizaSubcontratacion!: string;
  autorizaSubcontratacionflag!: boolean;
  isCreate: boolean=true;
  guardando: boolean = false;
  nameAndLastName: string='';
  seleccion!: string;
  onSeleccion!: string;
  isSelected: boolean=false;
  formNatural: FormGroup;
  formJuridica: FormGroup;
  divisionList= _divisionList;
  localeES: any = locale_es;
  actividadesContratadasList: ActividadesContratadas[]=[];
  actividadesContratadasList2: any[] = [];
  localidades: any[]=[];
  documentos!: Documento[];
  modulo: string = Modulo.EMP.value;
  @Input('documentos') directorios: Directorio[] = [];
  @Output() idDoc: any = new EventEmitter<string>();
  documentosList!: any[];
  visibleDlgExcel: boolean = false;
  @Input('analisisId') analisisId: string | null | undefined = this.sesionService.getEmpleado() != null || this.sesionService.getEmpresa()?.idEmpresaAliada == null ?
                                            this.sesionService.getEmpresa()?.id : this.sesionService.getEmpresa()?.idEmpresaAliada?.toString();
  @Output('onDelete') onDelete = new EventEmitter<any>();
  
  constructor(
    private empresaService: EmpresaService,
    private fb: FormBuilder,
    private router: Router,
    private sesionService: SesionService,
    private messageService: MessageService,
    private usuarioService: UsuarioService,
    private directorioService: DirectorioService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private config: PrimeNGConfig
  ) {
    this.onEdit = this.activatedRoute.snapshot.params['onEdit'];
    this.formNatural = fb.group({
      razonSocial:[null, Validators.required],
      tipo_persona:[null],
      identificacion:[null, Validators.required],
      email:[null, Validators.required],
      telefono:[null, Validators.required],
      actividadesContratadas:[null, Validators.required],
      localidad:[null, Validators.required],
      division:[null, Validators.required],
    })
    this.formJuridica = fb.group({
      razonSocial:[null, Validators.required],
      tipo_persona:[null],
      identificacion:[null, Validators.required],
      email:[null, [Validators.required, Validators.email]],
      nombreComercial:[null, Validators.required],
      calificacion_proceso:[null, Validators.required],
      fecha_calificacion:[null, Validators.required],
      quien_califica:[null, Validators.required],
    })
   }
  

  ngOnInit() {
    this.config.setTranslation(this.localeES);
    this.loadActividadesContratadas();
    this.loadLocalidades();
  }
  resetdate(){
    this.fecha_calificacion = null;
    }
  continuar(){
    if(this.seleccion){
      this.onSeleccion = this.seleccion    
      this.isSelected = true;
    }

  }

  async saveAliado(){
    this.formJuridica.value.tipo_persona = this.formNatural.value.tipo_persona = this.seleccion

    let createEmpresa: Empresa;
    this.messageService.add({severity:'info', summary: 'Guardando aliado', detail: 'Espere un momento', life:3000});

    if (this.formNatural.valid) {

      createEmpresa = {
        id: null,
        nombreComercial: this.formNatural.value.razonSocial,
        razonSocial: this.formNatural.value.razonSocial,
        nit: this.formNatural.value.identificacion,
        direccion: null,
        telefono: null,
        email: this.formNatural.value.email,
        web: null,
        numeroSedes: undefined,
        arl: undefined,
        ciiu: undefined,
        logo: null,
        empresasContratistasList: [],
        tipo_persona: this.formNatural.value.tipo_persona,
        actividades_contratadas: JSON.stringify(this.formNatural.value.actividadesContratadas),
        localidad: JSON.stringify(this.formNatural.value.localidad),
        division: JSON.stringify(this.formNatural.value.division),
        estado:'Creado',
        calificacion:'',
        fechaCreacion: new Date(),
        activo: true,
        idEmpresaAliada: Number(await this.sesionService.getEmpresa()!.id),
        correoAliadoCreador: JSON.parse(localStorage.getItem('session')!).usuario.email
      }
      
    } else if (this.formJuridica.valid){
      createEmpresa = {
        id: null,
        nombreComercial: this.formJuridica.value.nombreComercial,
        razonSocial: this.formJuridica.value.razonSocial,
        nit: this.formJuridica.value.identificacion,
        direccion: null,
        telefono: null,
        email: this.formJuridica.value.email,
        web: null,
        numeroSedes: undefined,
        arl: undefined,
        ciiu: undefined,
        logo: null,
        empresasContratistasList: [],
        tipo_persona: this.formJuridica.value.tipo_persona,
        estado:'Creado',
        calificacion:'',
        fechaCreacion: new Date(),
        activo: true,
        idEmpresaAliada: Number(await this.sesionService.getEmpresa()?.id),
        correoAliadoCreador: JSON.parse(localStorage.getItem('session')!).usuario.email
      }
    }
    
    this.guardando = true;
    this.empresaService.createEmpresaAliada(createEmpresa!).then((ele:Empresa)=>{
      
      this.messageService.add({severity:'success', summary: 'Creación Aliado', detail: 'Se agrego un Aliado nuevo, será redirigido a la lista de aliados.', life:6000});
      if (this.formJuridica.valid) {
        
        let ue = new UsuarioEmpresa();
      
        ue.perfil = new Perfil();
        ue.perfil.id = '312';
  
        let user = new Usuario()
        user.id= null,
        user.email= this.formJuridica.value.email,
        user.estado= null,
        user.usuarioEmpresaList= [],
        user.ipPermitida= ['0.0.0.0/0'],
        user.numeroMovil= null,
        user.mfa= null
  
        user.usuarioEmpresaList.push(ue)
        this.usuarioService.createUsuarioAliado(user, ele.id!).then((res: Usuario)=>{
          let docs: string[] = []; 
          this.directorios.forEach(el => {
            docs.push(el.id!);
          });
          let aliadoInformacion: AliadoInformacion ={
            // id: 0,
            id_empresa: Number(ele.id),
            actividad_contratada: null,
            division: null,
            localidad: null,
            calificacion: null,
            colider: null,
            documentos: JSON.stringify(docs),
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
            calificacion_aliado: this.formJuridica.value.calificacion_proceso,
            fecha_calificacion_aliado: this.formJuridica.value.fecha_calificacion,
            nombre_calificador: this.formJuridica.value.quien_califica,
            arl: null,
            autoriza_subcontratacion: this.autorizaSubcontratacionflag,
            istemporal: this.istemporalFlag,
            permitirReportes: this.autorizaRegistroAt ? this.autorizaRegistroAt : false
          }

          this.empresaService.saveAliadoInformacion(aliadoInformacion)
            .then((e: AliadoInformacion) => {            
              this.router.navigate(['/app/ctr/listadoAliados']);
              this.guardando = false;
            });
        });
      }
    }).catch(error=>{
      this.guardando = false;
      this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo crear el Aliado, intente de nuevo'});
      
    })
  }

  loadDataIn(){
    this.onSeleccion = this.valueEmpresa.tipo_persona!;
    this.seleccion = this.valueEmpresa.tipo_persona!;
    this.isCreate = false;
  }

  

  async loadActividadesContratadas(){
    this.actividadesContratadasList = []
    this.actividadesContratadasList2 = []
    await this.empresaService.getActividadesContratadas().then((element: ActividadesContratadas[]) =>{


      element.forEach(elemen => {
        this.actividadesContratadasList.push(elemen)
        this.actividadesContratadasList2.push({label: elemen.actividad, value: elemen.actividad})
    });
   });

    if (this.valueEmpresa.actividades_contratadas) {
      this.valueEmpresa.actividades_contratadas = JSON.parse( this.valueEmpresa.actividades_contratadas)      
    }
    
  }

  async loadLocalidades(){
    await this.empresaService.getLocalidades().then((element: Localidades[]) =>{

      element.forEach(elemen => {
          this.localidades.push({label: elemen.localidad, value: elemen.localidad})
      });
    });

    if (this.valueEmpresa.localidad) {
      this.valueEmpresa.localidad = JSON.parse( this.valueEmpresa.localidad)      
    }
    
  }

  onCalificacion(){
    this.dataCalificacion.emit(this.calificacion!);
  }

  onFechaCalificacion(){
    this.dataFechaCalificacion.emit(this.fecha_calificacion!);
  }

  onQuienCalifica(){
    this.dataQuienCalifica.emit(this.quienCalifica);
  }

  showDialog(){
    this.visibleDlgExcel = true;
  }

  closeDialog(){
    this.visibleDlgExcel = false;
  }

  onUpload(event: Directorio){
    if (this.documentos == null)
      this.documentos = [];
    if(this.directorios == null){
      this.directorios = []
    }

    this.directorios.push(event);
    this.documentos.push(event.documento!);
    this.documentos = this.documentos.slice();
    this.idDoc.emit(event.id)
  }

  descargarDocumento(doc: Documento) {
    let msg = { severity: 'info', summary: 'Descargando documento...', detail: 'Archivo \"' + doc.nombre + "\" en proceso de descarga" };
    this.messageService.add(msg);
    this.directorioService.download(doc.id).then(
      resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp]);
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink")!;
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", doc.nombre);
          dwldLink.click();
          this.messageService.add({ severity: 'success', summary: 'Archivo descargado', detail: 'Se ha descargado correctamente el archivo ' + doc.nombre });
        }
      }
    );
  }

  eliminarDocument(doc: Documento) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.directorioService.eliminarDocumento(doc.id).then(
            data => {
              this.directorios = this.directorios.filter(val => val.id !== doc.id);
              let docIds: string[] = []
              this.directorios.forEach(el => {
                docIds.push(el.id!);
              });
              this.onDelete.emit(JSON.stringify(docIds));
            }
          );
      }
  });
  }
  onAutorizaSubcontratacion(){
    if(this.autorizaSubcontratacion && this.autorizaSubcontratacion == 'Si'){
      this.autorizaSubcontratacionflag=true
      this.dataAutorizaSubcontratacion.emit(true);
    }else{
      this.autorizaSubcontratacionflag=false
      this.dataAutorizaSubcontratacion.emit(false);
    }
  }

  onEsTemporal(){
    if(this.istemporal == 'Si'){
      this.istemporalFlag = true;
      this.dataIsTemporal.emit(true);
    }else{
      this.istemporalFlag = false;
      this.dataIsTemporal.emit(false);
    }
  }

  onAutorizaReporteAt(){
    this.onPermitirReporteAt.emit(this.autorizaRegistroAt);
  }
}


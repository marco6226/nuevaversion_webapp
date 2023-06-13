import { Component, OnInit,Input,LOCALE_ID,Inject} from '@angular/core';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import {anexoSCM} from "src/app/website/pages/core/services/anexoSCM.service"
import { anexo5SCM } from "src/app/website/pages/scm/entities/anexoSCM";
import { Criteria, Filter } from '../../../../core/entities/filter';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { Message } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { CargoService } from 'src/app/website/pages/empresa/services/cargo.service'
import {formatDate} from '@angular/common';
import { EmpresaService } from 'src/app/website/pages/empresa/services/empresa.service';
import { Localidades} from 'src/app/website/pages/ctr/entities/aliados';
import { PrimeNGConfig } from 'primeng/api';
import { locale_es } from "src/app/website/pages/comun/entities/reporte-enumeraciones";
import { firmaservice } from 'src/app/website/pages/core/services/firmas.service';
import{firma} from 'src/app/website/pages/comun/entities/firma'


@Component({
  selector: 'app-remision',
  templateUrl: './remision.component.html',
  styleUrls: ['./remision.component.scss'],
  providers: [EmpresaService]
})
export class RemisionComponent implements OnInit {


  @Input('recomendationList')
  set recomendationListIn(recomendationList :any)
  {
    this.recomendationList=recomendationList
    this.recomendationList.sort(function(a:any,b:any){
      if(a.id < b.id){
        return 1
      }else if(a.id > b.id){
        return -1;
      }
        return 0;
      });
  }
  recomendationList :any=[]
  @Input() anexo?:string
  @Input('empleadoSelect')
  set empleadoSelectIn(empleadoSelect:any){
    this.empleadoSelect=empleadoSelect;
    this.cargo=this.empleadoSelect?.cargo.nombre
  }

  @Input('jefeInmediatoName') jefeInmediatoName?:string;
  
  @Input('idCase') 
  set idCaseIn(idCase:string){
    this.idCase=idCase;
    setTimeout(() => {
      this.cargarAnexo()
    }, 2000);
    
  }
  localeES: any = locale_es;
  empleadoSelect?:any
  idCase?:string

  dateToday: Date=new Date();
  edad?:Number
  idEmpresa?:number;

  modificar:boolean=false;
  selectId?:number=0
  loading: boolean = true;

  editAnexo:boolean=false

  anexolist: any[] = [];
  maxIdAnexo?:number;

  anexo5:any;
  anexo5Select: any;
  anexo5Form?:FormGroup
  dialogAnexo5:boolean=false;
  flagConsultarAnexo5:boolean=true

  anexo1:any;
  anexo1Select: any;
  anexo1Form?:FormGroup
  dialogAnexo1:boolean=false;
  flagConsultarAnexo1:boolean=true

  anexo6Form?:FormGroup

  cargo?:string;

  locadidadList: any[] = [];
  cambioPuesto:number=0
  requiereEntrenamiento:number=0
  Ajustes:number=0
  

  constructor(
    private firmaservice:firmaservice,
    private sesionService: SesionService,
    private anexoSCM: anexoSCM,
    private confirmationService: ConfirmationService,
    private cargoService: CargoService,
    private empresaService: EmpresaService,
    private config: PrimeNGConfig,
    @Inject(LOCALE_ID) private locale: string,
    fb: FormBuilder,
  ) { 
    this.anexo5Form=fb.group({
      'fecha': [null],
      'hora': [null],
      'instituto': [null],
      'nombreApellidos': [null],
      'cedula': [null],
      'edad': [null],
      'tel': [null],
      'proceso': [null],
      'oficio': [null],
      'motivo': [null],
      'complementarios': [null],
      'solicitud': [null]
    })
    this.anexo1Form=fb.group({
      'fecha': [null],
      'division': [null],
      'localidad': [null],
      'nombreApellidos': [null],
      'cedula': [null],
      'area': [null],
      'jefe': [null],
      'cargo': [null],
      'recomendaciones': [null],
      'ajustesIf':[null],
      'ajustes': [null],
      'cambiopuestotrabajo': [null],
      'cambiopuestotrabajoIf': [null],
      'requiereentrenamiento': [null],
      'requiereentrenamientoIf': [null],
      'observaciones': [null],
      'proximoseguimiento': [null],
      'fechainicial': [null],
      'fechafinal': [null],
      'nit': [null]
    })
    this.anexo6Form=fb.group({
      'fecha': [null],
      'nombreApellidos': [null],
      'cedula': [null],
      'ubicacion': [null],
      'cargo': [null],
      'textoseguimiento': [null]
    })
  }

  msgs?: Message[];

  ngOnInit(): void {
    this.config.setTranslation(this.localeES);
    this.idEmpresa=Number(this.sesionService.getEmpresa()?.id!)
    this.loadLocalidades()
  }

//Anexo5

  async cargarAnexo(){
    let filterQuery = new FilterQuery();
    filterQuery.filterList = []
    filterQuery.filterList.push({ criteria: Criteria.EQUALS, field: "pk_case", value1: this.idCase });
    filterQuery.filterList.push({ criteria: Criteria.EQUALS, field: "tipo", value1: this.anexo });
    filterQuery.filterList.push({ criteria: Criteria.EQUALS, field: "eliminado", value1: 'false' });
    await this.anexoSCM.getAnexWithFilter(filterQuery).then((resp:any)=>{
      this.anexolist=resp.data
      this.anexolist.sort(function(a,b){
        if(a.label > b.label){
          return 1
        }else if(a.label < b.label){
          return -1;
        }
          return 0;
        });
        if(this.anexolist.length>0)this.maxIdAnexo=this.anexolist[this.anexolist.length-1].id
        console.log(this.maxIdAnexo)
      // this.anexolist.forEach(element => {
      //   console.log(element)
      // });
    })
    this.loading=false

  }
  
  async imprimirAnexo5() {
    if(this.anexo=='5'){
    let anexo5=JSON.parse(this.anexo5Select.informacion)
    setTimeout(() => {
      let template = document.getElementById('plantillaAnexo5');
      template?.querySelector('#P_empresa_logo')?.setAttribute('src', this.sesionService.getEmpresa()?.logo!);
      template!.querySelector('#P_fecha')!.textContent = formatDate(
        anexo5.fecha,
        "dd/MM/yyyy",
        this.locale
      );
      template!.querySelector('#P_hora')!.textContent = anexo5.hora
      template!.querySelector('#P_instituto')!.textContent = anexo5.instituto
      template!.querySelector('#P_nombreApellidos')!.textContent = anexo5.nombreApellidos
      template!.querySelector('#P_cedula')!.textContent = anexo5.cedula
      template!.querySelector('#P_edad')!.textContent = anexo5.edad
      template!.querySelector('#P_tel')!.textContent = anexo5.tel
      template!.querySelector('#P_proceso')!.textContent = anexo5.proceso
      template!.querySelector('#P_oficio')!.textContent = anexo5.oficio
      template!.querySelector('#P_motivo')!.textContent = anexo5.motivo
      template!.querySelector('#P_complementarios')!.textContent = anexo5.complementarios
      template!.querySelector('#P_solicitud')!.textContent = anexo5.solicitud

      var WinPrint = window.open('', '_blank');

      WinPrint?.document.write('<style>@page{size:letter;margin: 10mm 0mm 10mm 0mm; padding:0mm;}</style>');
      WinPrint?.document.write(template?.innerHTML!);
      
      WinPrint?.document.close();
      WinPrint?.focus();
      WinPrint?.print();
    }, 2000);}
    if(this.anexo=='1'){
      let anexo1=JSON.parse(this.anexo5Select.informacion)
      setTimeout(() => {
        let template = document.getElementById('plantillaAnexo1');
        template?.querySelector('#P_empresa_logo')?.setAttribute('src', this.sesionService.getEmpresa()?.logo!);
        template!.querySelector('#P_fecha')!.textContent = formatDate(
          anexo1.fecha,
          "dd/MM/yyyy",
          this.locale
        );
        template!.querySelector('#P_Division')!.textContent = anexo1.division
        template!.querySelector('#P_localidad')!.textContent = anexo1.localidad
        template!.querySelector('#P_nombreApellidos')!.textContent = anexo1.nombreApellidos
        template!.querySelector('#P_nombreApellidos2')!.textContent = anexo1.nombreApellidos
        template!.querySelector('#P_cedula')!.textContent = anexo1.cedula
        template!.querySelector('#P_area')!.textContent = anexo1.area
        template!.querySelector('#P_cargo')!.textContent = anexo1.cargo
        template!.querySelector('#P_jefeinmediato')!.textContent = anexo1.jefe
        template!.querySelector('#P_colaborador')!.textContent = anexo1.nombreApellidos
        template!.querySelector('#P_recomendaciones')!.textContent = anexo1.recomendaciones
        template!.querySelector('#P_ajustepuesto')!.textContent = anexo1.ajustes
        template!.querySelector('#P_cambiopuesto')!.textContent = anexo1.cambiopuestotrabajo
        template!.querySelector('#P_requerimientoadicional')!.textContent = anexo1.requiereentrenamiento
        template!.querySelector('#P_observaciones')!.textContent = anexo1.observaciones
        template!.querySelector('#P_nit')!.textContent = anexo1.nit
        template!.querySelector('#P_fechaproximoseguimiento')!.textContent = formatDate(
          anexo1.proximoseguimiento,
          "dd/MM/yyyy",
          this.locale
        );
        
        template!.querySelector('#P_fechainicio')!.textContent = formatDate(
          anexo1.fechainicial,
          "dd/MM/yyyy",
          this.locale
        );
        template!.querySelector('#P_fechafin')!.textContent = formatDate(
          anexo1.fechafinal,
          "dd/MM/yyyy",
          this.locale
        );


        var WinPrint = window.open('', '_blank');
  
        WinPrint?.document.write('<style>@page{size:letter;margin: 10mm 0mm 10mm 0mm; padding:0mm;}</style>');
        WinPrint?.document.write(template?.innerHTML!);
        
        WinPrint?.document.close();
        WinPrint?.focus();
        WinPrint?.print();
      }, 2000);}

  }


  async GuardarAnexo(){
    let ax5 = new anexo5SCM();
    ax5.pk_case=Number(this.idCase)
    ax5.eliminado=false
    if(this.anexo=='5')ax5.informacion=JSON.stringify(this.anexo5Form?.value)
    if(this.anexo=='1'){ax5.informacion=JSON.stringify(this.anexo1Form?.value)}
    ax5.tipo=Number(this.anexo)
    ax5.idempresa=this.idEmpresa
    if(!this.editAnexo){

      ax5.fecha_creacion=new Date()
      await this.anexoSCM.create(ax5).then(async (resp:any)=>{
        await this.cargarAnexo()
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Anexo creado', detail: 'Se ha creado correctamente el anexo'+this.anexo });
        console.log(resp)
        let firm= new firma();
        firm.idempresa=this.idEmpresa
        firm.fechacreacion=new Date()
        firm.idrelacionado=resp.id
        this.firmaservice.create(firm).then(resp=>console.log(resp))
      })

    }else{
      ax5.id=this.selectId
      ax5.fecha_creacion=this.anexo5Select.fecha_creacion
      this.anexoSCM.update(ax5).then((resp:any)=>{
        const id = this.anexolist.findIndex((el:any) => el.id == resp.id )
        this.anexolist[id]['informacion'] = resp.informacion
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Anexo actualizado', detail: 'Se ha actualizado correctamente el anexo'+this.anexo })
      })
    }
    this.dialogAnexo5=false
    this.dialogAnexo1=false
  }


  crearAnexo(){
    this.dateToday=new Date();
    if(this.anexo=='5'){
    this.flagConsultarAnexo5=false
    this.editAnexo=false
    this.anexo5Form?.reset()
    this.anexo5Form?.patchValue({
      'proceso':  this.empleadoSelect?.area.nombre,
      'oficio':  this.cargo,
      'fecha': new Date(this.dateToday),
      'hora': this.dateToday.getHours().toString()+ ':' + ((this.dateToday.getMinutes()>9)?this.dateToday.getMinutes().toString():('0'+this.dateToday.getMinutes().toString())),
      'nombreApellidos': (this.empleadoSelect?.primerNombre?this.empleadoSelect?.primerNombre:'')+" "+(this.empleadoSelect?.segundoNombre?this.empleadoSelect?.segundoNombre:'')+" "+(this.empleadoSelect?.primerApellido?this.empleadoSelect?.primerApellido:'')+" "+(this.empleadoSelect?.segundoApellido?this.empleadoSelect?.segundoApellido:''),
      'cedula': this.empleadoSelect?.numeroIdentificacion,
      'edad': this.difAnios(new Date(this.empleadoSelect!.fechaNacimiento),new Date())
    })

    this.dialogAnexo5=true }

    if(this.anexo=='1'){
      if(!this.jefeInmediatoName){
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Falta de información', detail: 'El empleado ' +(this.empleadoSelect?.primerNombre?this.empleadoSelect?.primerNombre:'')+" "+(this.empleadoSelect?.primerApellido?this.empleadoSelect?.primerApellido:'')+
        ' le falta información del jefe inmediato, por favor completarla en la pestaña información general para poder continuar con la creación del anexo'})
        return
      }
      if(this.empleadoSelect?.nit ==null){
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Falta de información', detail: 'El empleado ' +(this.empleadoSelect?.primerNombre?this.empleadoSelect?.primerNombre:'')+" "+(this.empleadoSelect?.primerApellido?this.empleadoSelect?.primerApellido:'')+
        ' le falta información del nit, por favor completarla en el componente talento humano para poder continuar con la creación del anexo'})
        return
      }
        this.flagConsultarAnexo1=false
        this.editAnexo=false
        this.anexo1Form?.reset()
        this.anexo1Form?.patchValue({
          'fecha':  new Date(this.dateToday),
          'division': this.empleadoSelect?.area.padreNombre,
          'nombreApellidos': (this.empleadoSelect?.primerNombre?this.empleadoSelect?.primerNombre:'')+" "+(this.empleadoSelect?.segundoNombre?this.empleadoSelect?.segundoNombre:'')+" "+(this.empleadoSelect?.primerApellido?this.empleadoSelect?.primerApellido:'')+" "+(this.empleadoSelect?.segundoApellido?this.empleadoSelect?.segundoApellido:''),
          'cedula': this.empleadoSelect?.numeroIdentificacion,
          'area': this.empleadoSelect?.area.nombre,
          'jefe': (this.empleadoSelect?.jefeInmediato.primerNombre?this.empleadoSelect?.jefeInmediato.primerNombre:'')+" "+(this.empleadoSelect?.jefeInmediato.segundoNombre?this.empleadoSelect?.jefeInmediato.segundoNombre:'')+" "+(this.empleadoSelect?.jefeInmediato.primerApellido?this.empleadoSelect?.jefeInmediato.primerApellido:'')+" "+(this.empleadoSelect?.jefeInmediato.segundoApellido?this.empleadoSelect?.jefeInmediato.segundoApellido:''),
          'cargo': this.cargo,
          'recomendaciones': this.recomendationList.length>0?this.recomendationList[0].recomendaciones:null,
          'fechainicial': this.recomendationList.length>0?new Date(this.recomendationList[0].fechaInicio):null,
          'fechafinal': this.recomendationList.length>0?new Date(this.recomendationList[0].fechaExpiracion):null,
          'nit' : this.empleadoSelect?.nit
        })
        this.dialogAnexo1=true }
  }


  modificarAnexo5(){
    this.selectId=this.anexo5Select.id
    this.editAnexo=true
    if(this.anexo=='5'){
    this.flagConsultarAnexo5=false
    let anexo5=JSON.parse(this.anexo5Select.informacion)
    this.anexo5Form?.patchValue({
      'fecha': anexo5.fecha,
      'hora':  anexo5.hora,
      'instituto':  anexo5.instituto,
      'nombreApellidos':  anexo5.nombreApellidos,
      'cedula':  anexo5.cedula,
      'edad':  anexo5.edad,
      'tel':  anexo5.tel,
      'proceso':  anexo5.proceso,
      'oficio':  anexo5.oficio,
      'motivo':  anexo5.motivo,
      'complementarios':  anexo5.complementarios,
      'solicitud':  anexo5.solicitud
    })
    this.dialogAnexo5=true}
    if(this.anexo=='1'){
      this.flagConsultarAnexo1=false
      let anexo1=JSON.parse(this.anexo5Select.informacion)
      this.anexo1Form?.patchValue({
        'fecha': anexo1.fecha,
        'division': anexo1.division,
        'localidad': anexo1.localidad,
        'nombreApellidos': anexo1.nombreApellidos,
        'cedula': anexo1.cedula,
        'area': anexo1.area,
        'jefe': anexo1.jefe,
        'cargo': anexo1.cargo,
        'recomendaciones': anexo1.recomendaciones,
        'ajustesIf': anexo1.ajustesIf,
        'ajustes': anexo1.ajustes,
        'cambiopuestotrabajoIf': anexo1.cambiopuestotrabajoIf,
        'cambiopuestotrabajo': anexo1.cambiopuestotrabajo,
        'requiereentrenamientoIf': anexo1.requiereentrenamientoIf,
        'requiereentrenamiento': anexo1.requiereentrenamiento,
        'observaciones': anexo1.observaciones,
        'proximoseguimiento': new Date(anexo1.proximoseguimiento),
        'fechainicial': anexo1.fechainicial,
        'fechafinal': anexo1.fechafinal,
        'nit' : this.empleadoSelect?.nit
      })
      this.dialogAnexo1=true }
  }
  consultarAnexo5(){

    if(this.anexo=='5'){
    this.flagConsultarAnexo5=true
    let anexo5=JSON.parse(this.anexo5Select.informacion)
    this.anexo5Form?.patchValue({
      'fecha': anexo5.fecha,
      'hora':  anexo5.hora,
      'instituto':  anexo5.instituto,
      'nombreApellidos':  anexo5.nombreApellidos,
      'cedula':  anexo5.cedula,
      'edad':  anexo5.edad,
      'tel':  anexo5.tel,
      'proceso':  anexo5.proceso,
      'oficio':  anexo5.oficio,
      'motivo':  anexo5.motivo,
      'complementarios':  anexo5.complementarios,
      'solicitud':  anexo5.solicitud
    })
    this.dialogAnexo5=true}
    if(this.anexo=='1'){
      this.flagConsultarAnexo1=true
      let anexo1=JSON.parse(this.anexo5Select.informacion)
      this.anexo1Form?.patchValue({
        'fecha': anexo1.fecha,
        'division': anexo1.division,
        'localidad': anexo1.localidad,
        'nombreApellidos': anexo1.nombreApellidos,
        'cedula': anexo1.cedula,
        'area': anexo1.area,
        'jefe': anexo1.jefe,
        'cargo': anexo1.cargo,
        'recomendaciones': anexo1.recomendaciones,
        'ajustesIf': anexo1.ajustesIf,
        'ajustes': anexo1.ajustes,
        'cambiopuestotrabajoIf': anexo1.cambiopuestotrabajoIf,
        'cambiopuestotrabajo': anexo1.cambiopuestotrabajo,
        'requiereentrenamientoIf': anexo1.requiereentrenamientoIf,
        'requiereentrenamiento': anexo1.requiereentrenamiento,
        'observaciones': anexo1.observaciones,
        'proximoseguimiento': new Date(anexo1.proximoseguimiento),
        'fechainicial': anexo1.fechainicial,
        'fechafinal': anexo1.fechafinal,
        'nit' : anexo1.nit
      })
      this.dialogAnexo1=true}
  }

  async eliminarAnexo5(){

    this.selectId=this.anexo5Select.id
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar el anexo'+this.anexo+' id '+this.selectId+'?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ax5 = new anexo5SCM();
        ax5.pk_case=Number(this.idCase)
        ax5.eliminado=true
        ax5.informacion=JSON.stringify(this.anexo5Form?.value)
        ax5.tipo=Number(this.anexo)
        ax5.idempresa=this.idEmpresa
        ax5.id=this.selectId
        ax5.fecha_creacion=this.anexo5Select.fecha_creacion
    
        this.anexoSCM.update(ax5).then((resp:any)=>{
          this.anexolist=this.anexolist.filter(resp1=>{
            return resp1.id != resp.id
          })
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Anexo eliminado', detail: 'Se ha eliminado correctamente el anexo'+this.anexo+' id '+this.selectId})
        })
      }
    });
  }

//comun
  difAnios(date:any, otherDate:any):Number{
    var tiempo=Math.abs(otherDate.getTime() - date.getTime())
    var anios = (Math.floor(tiempo / (1000 * 60 * 60 * 24)))/365;
    return Math.floor(anios)
  }

  async loadLocalidades(){
    await this.empresaService.getLocalidades().then((element: Localidades[]) =>{
      element.forEach(elemen => {
        this.locadidadList.push({label: elemen.localidad, value: elemen.localidad})
    });
   });

   this.locadidadList.sort(function(a,b){
    if(a.label > b.label){
      return 1
    }else if(a.label < b.label){
      return -1;
    }
      return 0;
    });
  }
}

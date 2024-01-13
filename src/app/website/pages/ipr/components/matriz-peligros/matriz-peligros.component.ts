import { Component, OnInit} from '@angular/core';
import { PlantasService } from '../../../core/services/Plantas.service';
import { SesionService } from '../../../core/services/session.service';
import { SelectItem, ConfirmationService, MessageService, Message } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoPeligroService } from '../../../core/services/tipo-peligro.service';
import { TipoPeligro } from '../../../comun/entities/tipo-peligro';
import { FilterQuery } from '../../../core/entities/filter-query';
import { PeligroService } from '../../../core/services/peligro.service';
import { Criteria } from '../../../core/entities/filter';
import { Peligro } from '../../../comun/entities/peligro';
import { EfectoService } from '../../../core/services/efecto.service';
import { AreaMatrizService } from '../../../core/services/area-matriz.service';
import { AreaMatriz } from '../../../comun/entities/Area-matriz';
import { ProcesoMatrizService } from '../../../core/services/proceso-matriz.service';
import { SubprocesoMatrizService } from '../../../core/services/subproceso-matriz.service';
import { ProcesoMatriz } from '../../../comun/entities/Proceso-matriz';
import { SubprocesoMatriz } from '../../../comun/entities/Subproceso-matriz.ts';
import { Plantas } from '../../../comun/entities/Plantas';
import { AreaService } from '../../../empresa/services/area.service';
import { division } from '../../../comun/entities/datosGraf4';
import { MatrizPeligrosService } from '../../../core/services/matriz-peligros.service';
import { MatrizPeligros } from '../../../comun/entities/Matriz-peligros';
import { Area } from '../../../empresa/entities/area';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';
import { from } from 'rxjs';
import { MatrizPeligrosLogService } from '../../../core/services/matriz-peligros-log.service';
import { MatrizPeligrosLog } from '../../../comun/entities/Matriz-peligros-log';
import { Modulo } from '../../../core/enums/enumeraciones';
import { Documento } from '../../../ado/entities/documento';
import { Directorio } from '../../../ado/entities/directorio';
import { DirectorioService } from '../../../core/services/directorio.service';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { Localidades } from "../../../ctr/entities/aliados";


interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-matriz-peligros',
  templateUrl: './matriz-peligros.component.html',
  styleUrls: ['./matriz-peligros.component.scss'],
  providers: [DirectorioService]
})

export class MatrizPeligrosComponent implements OnInit {
  
  empresaId:any
  idPlanta:any;
  idArea:any;
  idProceso:any;
  idSubproceso:any;
  planta:SelectItem[] =[]
  formCreacionMatriz?: FormGroup | any;
  formMatrizGeneral?: FormGroup | any;
  formMatrizGeneralSustitucion?: FormGroup | any;
  formMatrizGeneral2?: FormGroup | any;
  formMatrizGeneral2Sustitucion?: FormGroup | any;
  formMatrizPeligros?: FormGroup | any;
  formMatrizPeligrosSustitucion?: FormGroup | any;
  formMatrizRiesgosC?: FormGroup | any;
  formMatrizRiesgosI?: FormGroup | any;
  formMatrizRiesgosIResidual?: FormGroup | any;
  formPlanAccion?: FormGroup | any;
  formEfectividadControles?: FormGroup | any;
  formValoracionRiesgo?: FormGroup | any;

  formMatrizRiesgosI2?: FormGroup | any;
  formMatrizRiesgosIResidual2?: FormGroup | any;
  formMatrizRiesgosC2?: FormGroup | any;

  flagRegistroMatriz:boolean=false
  flagRegistroMatrizTree:boolean=false
  flagRegistroMatrizAcording:boolean=false
  flagButtonMatrizAcording:boolean=true

  listDivision:any=[]

  tipoPeligroItemList?: SelectItem[];
  peligroItemList?: SelectItem[] | any;

  tipoPeligroItemList2?: SelectItem[];
  peligroItemList2?: SelectItem[] | any;

  areaMatrizItemList?: SelectItem[];
  procesoMatrizItemList?: SelectItem[];
  subprocesoMatrizItemList?: SelectItem[];

  areaMatrizItemList2?: SelectItem[];
  procesoMatrizItemList2?: SelectItem[];
  subprocesoMatrizItemList2?: SelectItem[];

  matrizdescripcion?: SelectItem[] | any=[];

  flagRutinaria:number=1;

  sumaExpuestos:number=0;
  sumaP:number=0;
  sumaC:number=0;
  sumaT:number=0;

  ND:any=[{label:'Seleccione',value:null},{label:'10',value:10},{label:'6',value:6},{label:'2',value:2},{label:'0',value:0}]
  NE:any=[{label:'Seleccione',value:null},{label:'4',value:4},{label:'3',value:3},{label:'2',value:2},{label:'1',value:1}]
  NC:any=[{label:'Seleccione',value:null},{label:'100',value:100},{label:'60',value:60},{label:'25',value:25},{label:'10',value:10}]

  valoracionRI1:any=[{ND:null,NE:null,NP:0,I:'',NC:null,NR:0,CN:'',CL:''}];
  valoracionRI2:any=[{CN:'',CL:'',accion:'',color:''}];

  valoracionRI1Residual:any=[{ND:null,NE:null,NP:0,I:'',NC:null,NR:0,CN:'',CL:''}];
  valoracionRI2Residual:any=[{CN:'',CL:'',accion:'',color:''}];

  putArea:boolean=false
  putProceso:boolean=false
  putSubproceso:boolean=false

  putAreaTree:boolean=false
  putProcesoTree:boolean=false
  putSubprocesoTree:boolean=false

  nombreProcesoTree:string=''
  nombreAreaTree:string=''

  imgFlag:boolean=false
  imgName!:string;
  imgNameHeader!:string;

  flagControlIng: boolean=true
  flagControlAdm: boolean=true
  flagEquiposEle: boolean=true

  cols!: Column[];
  filterMode = 'lenient';

  filterModes = [
      { label: 'Lenient', value: 'lenient' },
      { label: 'Strict', value: 'strict' }
  ];
  fieldList:any= [
    'id',
    'nombre',
    'estado'
  ];

  newArea?:string;
  newProceso?:string;
  newSubproceso?:string; 

  activeIndex: number | undefined;

  CRUDarea:string='POST';
  CRUDproceso:string='POST';
  CRUDsubproceso:string='POST';
  CRUDplanAccion:string='POST';

  idMatrizPeligro:any=[]

  estado:string='Sin estado'
  guardadoSustitucion:boolean=false

  modulo?: string;

  constructor(
    private fb: FormBuilder,
    private plantasService: PlantasService,
    private empresaService: EmpresaService,
    private sessionService: SesionService,
    private tipoPeligroService: TipoPeligroService,
    private peligroService: PeligroService,
    private efectoService: EfectoService,
    private areaMatrizService: AreaMatrizService,
    private procesoMatrizService: ProcesoMatrizService,
    private subprocesoMatrizService: SubprocesoMatrizService,
    private confirmationService: ConfirmationService,
    private areaService: AreaService,
    private matrizPeligrosService: MatrizPeligrosService,
    private matrizPeligrosLogService: MatrizPeligrosLogService,
    private directorioService: DirectorioService,
    private paramNav: ParametroNavegacionService,
    private messageService: MessageService,
  ) { 
    this.modulo = Modulo.IPR.value;
    
    this.formCreacionMatriz = this.fb.group({
      planta: [null],
      ubicacion: [null],
    });
    this.formMatrizPeligros = this.fb.group({
      Peligro: [null], //Clasificación
      DescripcionPeligro: [null], //Descripción del peligro
      FuenteGeneradora: [null],
      Efectos: [null]
    });
    this.formMatrizPeligrosSustitucion = this.fb.group({
      Peligro: [null, Validators.required], //Clasificación
      DescripcionPeligro: [null, Validators.required], //Descripción del peligro
      FuenteGeneradora: [null, Validators.required],
      Efectos: [null, Validators.required],
      Descripcion: [null, Validators.required]
    });
    this.formMatrizGeneral = this.fb.group({
      Area: [null], //Clasificación
      Proceso: [null], //Descripción del peligro
      Subproceso: [[]],
      Actividades: [null],
      Rutinaria: [null],
      Propios: [null],
      Temporales: [null],
      Contratistas: [null],
    });
    this.formMatrizGeneralSustitucion = this.fb.group({
      Area: [null], //Clasificación
      Proceso: [null], //Descripción del peligro
      Subproceso: [null],
      Actividades: [null],
      Rutinaria: [null],
      Propios: [null],
      Temporales: [null],
      Contratistas: [null],
    });
    this.formMatrizGeneral2 = this.fb.group({
      Area: [null], //Clasificación
      Proceso: [null], //Descripción del peligro
      Subproceso: [null],
      Actividades: [null],
      Rutinaria: [null],
      Propios: [null],
      Temporales: [null],
      Contratistas: [null],
    });
    this.formMatrizGeneral2Sustitucion = this.fb.group({
      Area: [null], //Clasificación
      Proceso: [null], //Descripción del peligro
      Subproceso: [null],
      Actividades: [null],
      Rutinaria: [null],
      Propios: [null],
      Temporales: [null],
      Contratistas: [null],
    });
    this.formMatrizRiesgosC= this.fb.group({
      Ingenieria: [null], //Clasificación
      Administrativos: [null], //Descripción del peligro
      ElementosPro: [null],
    });
    this.formMatrizRiesgosI= this.fb.group({
      ND: [null], //Clasificación
      NE: [null], //Descripción del peligro
      NP: [null],
      NC: [null],
      NR: [null],
      NRCualitativo: [null],
      accMayor: ['No'],
      realizoValoracion: ['No'],
      planAccion:[null]
    });
    this.formMatrizRiesgosIResidual= this.fb.group({
      ND: [null], //Clasificación
      NE: [null], //Descripción del peligro
      NP: [null],
      NC: [null],
      NR: [null],
      NRCualitativo: [null]
    });

    this.formMatrizRiesgosC2= this.fb.group({
      Ingenieria: [null], //Clasificación
      Administrativos: [null], //Descripción del peligro
      ElementosPro: [null],
    });
    this.formMatrizRiesgosI2= this.fb.group({
      ND: [null], //Clasificación
      NE: [null], //Descripción del peligro
      NP: [null],
      NC: [null],
      NR: [null],
      NRCualitativo: [null]
    });
    this.formMatrizRiesgosIResidual2= this.fb.group({
      ND: [null], //Clasificación
      NE: [null], //Descripción del peligro
      NP: [null],
      NC: [null],
      NR: [null],
      NRCualitativo: [null]
    });

    this.formPlanAccion= this.fb.group({
      fechaCreacion: [null], //Clasificación
      jerarquia: [null], //Descripción del peligro
      descripcion: [null],
      estado: [null],
      barreras:[null]
    });

    this.formControl= this.fb.group({
      fechaCreacion: [null], //Clasificación
      descripcion: [null],
      barrera: [null]
    });
    this.formEfectividadControles= this.fb.group({
      controlEjecutados: [0],
      controlPropuestos: [0],
      cumplimiento: [0],
      ATasociados: [0],
      ELasociados: [0],
      estado:[null]
    });
  }

  async ngOnInit() {
    this.cargarDatos()
  }

  async cargarDatos(){
    await this.getArea()
    this.cols = [
      { field: 'nombre', header: 'Descripción' },
      { field: 'estado', header: 'Estado' },//evaluado - no evaluado
    ];

    this.empresaId= this.sessionService.getEmpresa()!.id
    this.cargarTiposPeligro();
    this.getParams()
  }
  CRUDMatriz:string='PUT';
  flagProcesoSubP:boolean=true
  fechaCreacion!:Date | null;
  flagEliminadoSustituido:boolean=false
  flagConsulta:boolean=false
  async getParams(){
    
    // switch (this.paramNav.getAccion<string>()){
    switch (localStorage.getItem('Accion1')){
      case 'PUT':
        let formCreacionMatriz:any=JSON.parse(localStorage.getItem('formCreacionMatriz')!)
        this.CRUDMatriz='PUT'
        // this.cargarPlanta(this.paramNav.getParametro<FormGroup>().value.ubicacion)
        this.cargarPlantaLocalidad(formCreacionMatriz.value.ubicacion)
        // this.formCreacionMatriz.patchValue({
        //     planta: this.paramNav.getParametro<FormGroup>().value.planta,
        //     ubicacion: this.paramNav.getParametro<FormGroup>().value.ubicacion,
        // })
        this.formCreacionMatriz.patchValue({
          planta: formCreacionMatriz.value.planta,
          ubicacion: formCreacionMatriz.value.ubicacion,
        })
        // this.cargarArea(this.paramNav.getParametro<FormGroup>().value.planta)
        this.cargarArea(formCreacionMatriz.value.planta)

        // this.paramNav.setParametro<any>(null);
        // this.paramNav.setAccion<any>(null);
        localStorage.removeItem('formCreacionMatriz');
        localStorage.removeItem('Accion1');
        break; 
      case 'POST':
        this.postGet()
        break;
      case 'GET':
        this.postGet()
        this.flagConsulta=true
        this.flagEliminadoSustituido=true
        break;    
      default:
        break;
    }
  }
  idMostrar:string=''
  idMatriz:number=0;
  flagidPadre:boolean=false
  async postGet(){
    this.CRUDMatriz='POST'
    let formCreacionMatriz:any=JSON.parse(localStorage.getItem('formCreacionMatriz')!)
    let matrizSelect:any=JSON.parse(localStorage.getItem('matrizSelect')!)
    this.cargarPlantaLocalidad(formCreacionMatriz.value.ubicacion)
    this.formCreacionMatriz.patchValue({
      planta: formCreacionMatriz.value.planta,
      ubicacion: formCreacionMatriz.value.ubicacion,
    })
    this.cargarArea(formCreacionMatriz.value.planta)
    // this.cargarPlanta(this.paramNav.getParametro2<FormGroup>().value.ubicacion)
    // this.formCreacionMatriz.patchValue({
    //     planta: this.paramNav.getParametro2<FormGroup>().value.planta,
    //     ubicacion: this.paramNav.getParametro2<FormGroup>().value.ubicacion,
    // })
    // this.cargarArea(this.paramNav.getParametro2<FormGroup>().value.planta)
    await this.cargarAreainMatriz()
    setTimeout(() => {
      this.flagRegistroMatrizAcording=true;
      this.flagRegistroMatrizTree=true;
      this.activeIndex=-1
    }, 1000);
    // let matrizPeligro:any=this.paramNav.getParametro<any>()[0]
    // let matrizPeligro2:any=this.paramNav.getParametro<any>()
    let matrizPeligro:any=matrizSelect[0]
    let matrizPeligro2:any=matrizSelect

    let idPadre=0
    try {
      idPadre=matrizPeligro.id.split('-')[1]
    } catch (error) {
      console.log(error)
      idPadre=0
    }
    if(idPadre!=0){
      let filterhijo = new FilterQuery();
      // filterhijo.fieldList=["id","idEdicion"];
      filterhijo.filterList = [{ field: 'id', criteria: Criteria.EQUALS, value1: idPadre.toString()}];

      let mPeligros:any
      await this.matrizPeligrosService.getmpRWithFilter(filterhijo).then((resp:any)=>{
        mPeligros=JSON.parse(resp.data[0].peligro)
        //II-Identificación del peligro
        this.formMatrizPeligrosSustitucion.patchValue({
          Peligro: mPeligros?.Peligro,
          DescripcionPeligro: mPeligros?.DescripcionPeligro,
          FuenteGeneradora: mPeligros?.FuenteGeneradora,
          Efectos: mPeligros?.Efectos,
          Descripcion: mPeligros?.Descripcion
        });
        this.SelectPeligro(this.formMatrizPeligrosSustitucion.value.Peligro,'sustituto')
        this.flagidPadre=true
        this.guardadoSustitucion=true
      })
    }

    let area:any=[]
    let proceso:any=[]
    let subproceso:any=[]
    this.fechaCreacion=(matrizPeligro.fechaCreacion)?new Date(matrizPeligro.fechaCreacion):null
    for(const [i,ele] of matrizPeligro2.entries()){
      area.push(ele.generalInf.Area[0])
      proceso.push(ele.generalInf.Proceso[0])
      subproceso.push(ele.generalInf.Subproceso[0])
      this.idMatrizPeligro.push(ele.id)
      this.idMatriz=ele.id
      if(i!=0)this.idMostrar += ', \n'+ele.id +'-'+ ele.area.nombre +'-' + ele.proceso.nombre +'-' + ele.subProceso.nombre
      else this.idMostrar +=ele.id +'-'+ ele.area.nombre +'-' + ele.proceso.nombre +'-' + ele.subProceso.nombre
    }

    let filterMatriz = new FilterQuery();
    filterMatriz.fieldList=["id","idEdicion"];
    filterMatriz.filterList = [{ field: 'idEdicion', criteria: Criteria.EQUALS, value1: matrizPeligro?.idEdicion}];

    let idEdicionLengh:any
    await this.matrizPeligrosService.getmpRWithFilter(filterMatriz).then(async (resp:any)=>{
      idEdicionLengh=resp.data.length
      if(idEdicionLengh==matrizPeligro2.length){
        this.idEdicion=matrizPeligro?.idEdicion;
      }else{
        //Identificar el id
        let filterMatriz = new FilterQuery();
        filterMatriz.sortField = "idEdicion";
        filterMatriz.fieldList=["idEdicion"];
        filterMatriz.filterList = [{ field: 'idEdicion', criteria: Criteria.IS_NOT_NULL}];
        filterMatriz.sortOrder = 1;

        await this.matrizPeligrosService.getmpRWithFilter(filterMatriz).then((resp:any)=>{
          resp.data[0].idEdicion+1
          this.idEdicion=resp.data[0].idEdicion+1
        }).catch(er=>{
          this.idEdicion=1
        })
      }
    }).catch(er=>{console.log(er)})


    //I-Información general
    this.formMatrizGeneral.patchValue({
      Area: area, //Clasificación
      Proceso: proceso, //Descripción del peligro
      Subproceso: subproceso,
      Actividades: matrizPeligro?.generalInf?.Actividades,
      Rutinaria: matrizPeligro?.generalInf?.Rutinaria,
      Propios: matrizPeligro?.generalInf?.Propios,
      Temporales: matrizPeligro?.generalInf?.Temporales,
      Contratistas: matrizPeligro?.generalInf?.Contratistas,
    });
    this.cargarProceso(this.formMatrizGeneral.value.Area)
    this.cargarSubproceso(this.formMatrizGeneral.value.Proceso)
    setTimeout(() => {
      this.flagProcesoSubP=false
      setTimeout(() => {
        this.flagProcesoSubP=true
        this.sumaExpuestosFunc()
      }, 500);
    }, 500); 
    
    //II-Identificación del peligro
    this.formMatrizPeligros.patchValue({
      Peligro: matrizPeligro?.peligro?.Peligro,
      DescripcionPeligro: matrizPeligro?.peligro?.DescripcionPeligro,
      FuenteGeneradora: matrizPeligro?.peligro?.FuenteGeneradora,
      Efectos: matrizPeligro?.peligro?.Efectos
    });
    this.SelectPeligro(this.formMatrizPeligros.value.Peligro,'actual')

    //III-Evaluación del riesgo control existente

    this.formMatrizRiesgosC.patchValue({
      Ingenieria: matrizPeligro?.controlesexistentes?.Ingenieria, //Clasificación
      Administrativos: matrizPeligro?.controlesexistentes?.Administrativos, //Descripción del peligro
      ElementosPro: matrizPeligro?.controlesexistentes?.ElementosPro
    });
    this.controlIngList=(this.formMatrizRiesgosC.value.Ingenieria)?this.formMatrizRiesgosC.value.Ingenieria:[]
    this.controlAdmList=(this.formMatrizRiesgosC.value.Administrativos)?this.formMatrizRiesgosC.value.Administrativos:[]
    this.controlEquList=(this.formMatrizRiesgosC.value.ElementosPro)?this.formMatrizRiesgosC.value.ElementosPro:[]

    this.flagControlIng=(this.controlIngList.length>0)?true:false
    this.flagControlAdm=(this.controlAdmList.length>0)?true:false
    this.flagEquiposEle=(this.controlEquList.length>0)?true:false

    let riesgos:any=['flagControlIng','flagControlAdm','flagEquiposEle']
    for(const ele of riesgos){
      this.visualEvaluacionRiesgo(ele)
    }

    //IV-Valoración del riesgo inicial
    this.formMatrizRiesgosI.patchValue({
      ND: matrizPeligro?.valoracionRiesgoInicial?.ND, //Clasificación
      NE: matrizPeligro?.valoracionRiesgoInicial?.NE, //Descripción del peligro
      NP: matrizPeligro?.valoracionRiesgoInicial?.NP,
      NC: matrizPeligro?.valoracionRiesgoInicial?.NC,
      NR: matrizPeligro?.valoracionRiesgoInicial?.NR,
      NRCualitativo: matrizPeligro?.valoracionRiesgoInicial?.NRCualitativo,
    });
    this.nivelProbabilidad('inicial')
    if(!this.formMatrizRiesgosC.value.Ingenieria && !this.formMatrizRiesgosC.value.Administrativos && !this.formMatrizRiesgosC.value.ElementosPro && !this.formMatrizRiesgosI.valid){
      this.flagControlIng = true
      this.flagControlAdm = true
      this.flagEquiposEle = true
    }

    this.formMatrizRiesgosI.patchValue({
      accMayor:matrizPeligro?.valoracionRiesgoInicial?.accMayor,
      realizoValoracion:matrizPeligro?.valoracionRiesgoInicial?.realizoValoracion,
      planAccion:matrizPeligro?.valoracionRiesgoInicial?.planAccion
    })
    
    //V-Plan de acción
    this.tareasList=matrizPeligro?.planAccion
    this.formEfectividadControles.patchValue({controlPropuestos:this.tareasList.length})
    this.formEfectividadControles.patchValue({cumplimiento:(this.tareasList.length>0)?((this.tareasListEjecutadoPorcentaje.length*100)/(this.tareasList.length)).toFixed(2):0})

    this.tareasListPendiente=this.tareasList.filter((resp:any)=>(resp.estado=='Pendiente' || resp.jerarquia=='Eliminación' || resp.jerarquia=='Sustitución'))
    this.tareasListEjecutado=this.tareasList.filter((resp:any)=>(resp.estado=='Ejecutado' && resp.jerarquia!='Eliminación' && resp.jerarquia!='Sustitución'))
    this.tareasListEjecutadoPorcentaje=this.tareasList.filter((resp:any)=>(resp.estado=='Ejecutado'))
    this.formEfectividadControles.patchValue({controlEjecutados:this.tareasListEjecutadoPorcentaje.length})
    this.formEfectividadControles.patchValue({cumplimiento:(this.tareasList.length>0)?((this.tareasListEjecutadoPorcentaje.length*100)/(this.tareasList.length)).toFixed(2):0})

    if(this.tareasListPendiente.filter((el:any) => el.jerarquia == 'Eliminación' || el.jerarquia == 'Sustitución').length>0)this.flagplanElimsust=true
        else this.flagplanElimsust=false
    
    if(this.tareasList.filter((el:any) => (el.jerarquia=='Sustitución' && el.estado=='Ejecutado')).length>0)this.flagSustitucion=true

    if(this.tareasListPendiente.filter((resp:any)=>((resp.jerarquia=='Eliminación' && resp.estado=='Ejecutado') || (resp.jerarquia=='Sustitución' && resp.estado=='Ejecutado'))).length>0)
      this.flagEliminadoSustituido=true

    if(this.tareasList.filter((resp:any)=>(resp.estado=='Ejecutado' && resp.jerarquia=='Eliminación')).length>0)
    {this.estado='Riesgo eliminado'}
    else if(this.tareasList.filter((resp:any)=>(resp.estado=='Ejecutado' && resp.jerarquia=='Sustitución')).length>0)
    {this.estado='Riesgo sustituido'}
    else if(this.tareasList.length>0)
    {this.estado='Riesgo vigente'}

    //VI-Valoración del riesgo residual
    this.formMatrizRiesgosIResidual.patchValue({
      ND: matrizPeligro?.valoracionRiesgoResidual?.ND, //Clasificación
      NE: matrizPeligro?.valoracionRiesgoResidual?.NE, //Descripción del peligro
      NP: matrizPeligro?.valoracionRiesgoResidual?.NP,
      NC: matrizPeligro?.valoracionRiesgoResidual?.NC,
      NR: matrizPeligro?.valoracionRiesgoResidual?.NR,
      NRCualitativo: matrizPeligro?.valoracionRiesgoResidual?.NRCualitativo,
    });
    this.nivelProbabilidad('residual')

    //Evidencias
    this.documentosList=matrizPeligro.documentosList    

    //borrar elementos en paramNav
    // this.paramNav.setParametro<any>(null);
    // this.paramNav.setAccion<any>(null);
    localStorage.removeItem('formCreacionMatriz');
    localStorage.removeItem('Accion1');
  }

  cargarEvidencias(){
    // dsafsd
    let filterQuery = new FilterQuery();
    // filterQuery.fieldList = this.fields;
    filterQuery.filterList= [{ criteria: Criteria.EQUALS, field: 'usuarioBasic.email', value1: ''}];
    this.directorioService.findByFilter(filterQuery).then((resp:any)=>{console.log(resp)})
  }

  async getArea(){
    let filterAreaQuery = new FilterQuery();
    filterAreaQuery.sortField = "id";
    filterAreaQuery.sortOrder = -1;
    filterAreaQuery.fieldList = ["id","nombre"];
    filterAreaQuery.filterList = [
      { field: 'nivel', criteria: Criteria.EQUALS, value1: '0' },
    ];

    await this.areaService.findByFilter(filterAreaQuery).then((resp:any)=>{
      resp.data.forEach((resp2:any) => {
        this.listDivision.push({label:resp2.nombre,value:resp2.id})
      });
    })
  }
  plantasList: Localidades[] = [];
  // cargarPlanta(eve:any){
  //   let filterPlantaQuery = new FilterQuery();
  //   filterPlantaQuery.sortField = "id";
  //   filterPlantaQuery.sortOrder = -1;
  //   filterPlantaQuery.fieldList = ["id","nombre"];
  //   filterPlantaQuery.filterList = [
  //     { field: 'id_division', criteria: Criteria.EQUALS, value1: eve.toString() },
  //     // { field: 'tipo', criteria: Criteria.EQUALS, value1: 'IPER' },
  //   ];
  //   this.plantasService.getPlantaWithFilter(filterPlantaQuery).then((resp:any)=>{
  //     this.planta=[]
  //     this.plantasList=resp.data
  //     resp.data.forEach((element:any) => {
  //       this.planta.push({label:element.nombre,value:element.id})
  //     });
  //   })
  // }
  async cargarPlantaLocalidad(eve:any){
    let filterPlantaQuery = new FilterQuery();
    filterPlantaQuery.sortField = "id";
    filterPlantaQuery.sortOrder = -1;
    filterPlantaQuery.fieldList = ["id","localidad"];
    filterPlantaQuery.filterList = [
      { field: 'plantas.id_division', criteria: Criteria.EQUALS, value1: eve.toString() },
    ];
    await this.empresaService.getLocalidadesRWithFilter(filterPlantaQuery).then((resp:any)=>{
      this.planta=[]
      this.plantasList=resp.data
      resp.data.forEach((element:any) => {
        this.planta.push({label:element.localidad,value:element.id})
      });
    })
  }

  //--------Cargar matriz------------------//
  async habilitarGuiaProceso(){
    await this.cargarArea(this.formCreacionMatriz.value.planta)
    setTimeout(() => {
      this.flagRegistroMatrizAcording=true
      this.flagRegistroMatrizTree=true
      this.activeIndex=0
    }, 1000);
  }
  //-----------------------Cargar peligros-----------------------------//
  SelectPeligro(a: string, tipo:string){
    if (tipo=='actual') {
      this.cargarPeligro(a)
    } else {
      this.cargarPeligroSustitucion(a)
    }
    
  }

  SelectEfecto(a: string, tipo:string){
    if (tipo=='actual') {
      this.cargarEfectos(a)
    } else {
      this.cargarEfectosSutitucion(a)
    }
  }

  cargarEfectos(ide:any) {
    if(ide != null){
    let filter = new FilterQuery();
    filter.filterList = [{ field: 'peligro.id', criteria: Criteria.EQUALS, value1: ide['id'] }];
    this.efectoService.findByFilter(filter).then(
      (resp:any) => {
        this.formMatrizPeligros.patchValue({
          'Efectos': resp[0].nombre
        })
      }
    );
     }else{
      this.formMatrizPeligros.patchValue({
        'Efectos': ''
      })
     }
  }
  cargarEfectosSutitucion(ide:any) {
    if(ide != null){
    let filter = new FilterQuery();
    filter.filterList = [{ field: 'peligro.id', criteria: Criteria.EQUALS, value1: ide['id'] }];
    this.efectoService.findByFilter(filter).then(
      (resp:any) => {
        this.formMatrizPeligrosSustitucion.patchValue({
          'Efectos': resp[0].nombre
        })
      }
    );
     }else{
      this.formMatrizPeligrosSustitucion.patchValue({
        'Efectos': ''
      })
     }
  }

  async cargarPeligro(idtp:any) {
    if(idtp != null){
      let filter = new FilterQuery();
      filter.filterList = [{ field: 'tipoPeligro.id', criteria: Criteria.EQUALS, value1: idtp['id'] }];
      await this.peligroService.findByFilter(filter).then(
        resp => {
          this.peligroItemList = [{ label: '--Seleccione--', value: null}];
          (<Peligro[]>resp).forEach(
            data => 
              {
                this.peligroItemList?.push({ label: data.nombre, value: {id:data.id,nombre: data.nombre} })
              }
          )
        }
      );
    }else{
      this.peligroItemList = [{ label: '--Seleccione Peligro--', value: [null, null]}];
    }
  }
  
  async cargarPeligroSustitucion(idtp:any) {
    if(idtp != null){
      let filter = new FilterQuery();
      filter.filterList = [{ field: 'tipoPeligro.id', criteria: Criteria.EQUALS, value1: idtp['id'] }];
      await this.peligroService.findByFilter(filter).then(
        resp => {
          this.peligroItemList2 = [{ label: '--Seleccione--', value: null}];
          (<Peligro[]>resp).forEach(
            data => 
              {
                this.peligroItemList2?.push({ label: data.nombre, value: {id:data.id,nombre: data.nombre} })
              }
          )
        }
      );
    }else{
      this.peligroItemList2 = [{ label: '--Seleccione Peligro--', value: [null, null]}];
    }
  }

  cargarTiposPeligro() {
    this.tipoPeligroService.findAll().then(
      (resp : any) => {
        this.tipoPeligroItemList = [{ label: '--Seleccione--', value: null }];
        (<TipoPeligro[]>resp['data']).forEach(
          data => this.tipoPeligroItemList?.push({ label: data.nombre, value: data })
        )   
      }
    );
  }

 //-----------------------Cargar Area - proceso - subproceso-----------------------------//
  funcAreaPut(eve:any){
    if(eve.value==0)this.putArea=true
    else this.putArea=false
  }

  flagContinuar:boolean=false
  async cargarArea(eve:any) {
    this.idPlanta=eve

    this.matrizdescripcion=[]
    // this.areaMatrizItemList = [{ label: '--Seleccione--', value: null }];
    
    let filterArea = new FilterQuery();
    filterArea.fieldList= this.fieldList
    filterArea.filterList = [{ field: 'localidad.id', criteria: Criteria.EQUALS, value1: this.idPlanta},
      { field: 'eliminado', criteria: Criteria.EQUALS, value1: false}];
    await this.areaMatrizService.findByFilter(filterArea).then((resp:any)=>{
      resp['data'].forEach(async (data1:any) => {
        // this.areaMatrizItemList?.push({ label: data1.nombre, value: data1.id})
        
        let filterProceso = new FilterQuery();
        filterProceso.fieldList= this.fieldList
        filterProceso.filterList = [{ field: 'areaMatriz.id', criteria: Criteria.EQUALS, value1:data1.id},
        { field: 'eliminado', criteria: Criteria.EQUALS, value1: false}];
        let procesoMatrizItemList:any=[]
        await this.procesoMatrizService.findByFilter(filterProceso).then((resp:any)=>{
          resp['data'].forEach(async (data2:any) => {
            // this.procesoMatrizItemList?.push({ label: data2.nombre, value: data2.id})
              let filterSubproceso = new FilterQuery();
              filterSubproceso.fieldList= this.fieldList
              filterSubproceso.filterList = [{ field: 'procesoMatriz.id', criteria: Criteria.EQUALS, value1:data2.id},
              { field: 'eliminado', criteria: Criteria.EQUALS, value1: false}];
              let subprocesoMatrizItemList:any=[]
              await this.subprocesoMatrizService.getsubproWithFilter(filterSubproceso).then((resp:any)=>{
                resp['data'].forEach(async (data3:any) => {
                  // this.subprocesoMatrizItemList?.push({ label: data3.nombre, value: data3.id})
                  subprocesoMatrizItemList.push({data:{id:data3.id, nombre:data3.nombre,estado: data3.estado}})
                })
                setTimeout(() => {
                  this.flagContinuar=true
                }, 500);
              })
              procesoMatrizItemList.push({data:{id:data2.id, nombre:data2.nombre,estado: data2.estado},children:subprocesoMatrizItemList})
              

          })
        })
        this.matrizdescripcion!.push({data:{id:data1.id, nombre:data1.nombre,estado: data1.estado},children:procesoMatrizItemList})
      })   
    })
  }

  cargarProceso(idp:any) {
    this.subprocesoMatrizItemList=[]
    if(idp != null ){
      if(idp !=0){
        this.procesoMatrizItemList = [];
        idp.forEach(async (ele:any) => {
          let filter = new FilterQuery();
          filter.filterList = [{ field: 'areaMatriz.id', criteria: Criteria.EQUALS, value1: ele.id },
          { field: 'eliminado', criteria: Criteria.EQUALS, value1: false}];
          await this.procesoMatrizService.findByFilter(filter).then(
            (resp:any) => {
              (<ProcesoMatriz[]>resp.data).forEach(
                data => 
                  {
                      this.procesoMatrizItemList?.push({ label: data.nombre, value: {id:data.id,nombre: data.nombre, idpadre:ele.id} })
                  }
              )
            }
          );
        });
        
        this.putProceso=false
      }else{
        this.putProceso=true
      }
    }else{
        this.procesoMatrizItemList = [{ label: '--Seleccione proceso--', value: [null, null]}];
    }
  }

  cargarProceso2(idp:any) {
    this.subprocesoMatrizItemList2=[]
    if(idp != null ){
      if(idp !=0){
        this.procesoMatrizItemList2 = [];
        [idp].forEach(async (ele:any) => {
          let filter = new FilterQuery();
          filter.filterList = [{ field: 'areaMatriz.id', criteria: Criteria.EQUALS, value1: ele.id },
          { field: 'eliminado', criteria: Criteria.EQUALS, value1: false}];
          await this.procesoMatrizService.findByFilter(filter).then(
            (resp:any) => {
              (<ProcesoMatriz[]>resp.data).forEach(
                data => 
                  {
                      this.procesoMatrizItemList2?.push({ label: data.nombre, value: {id:data.id,nombre: data.nombre, idpadre:ele.id} })
                  }
              )
            }
          );
        });
        
        // this.putProceso=false
      }else{
        // this.putProceso=true
      }
    }else{
        this.procesoMatrizItemList2 = [{ label: '--Seleccione proceso--', value: [null, null]}];
    }
  }

  funcSubprocesoPut(eve:any){
    if(eve.value==0)this.putSubproceso=true
    else this.putSubproceso=false
  }
  cargarSubproceso(idsp:any) {
    if(idsp != null ){
      if(idsp !=0){
        this.subprocesoMatrizItemList = [];
        // this.subprocesoMatrizItemList = [{ label: '--Seleccione--', value: [null, null]}];
        idsp.forEach(async (ele:any) => {
          let filter = new FilterQuery();
          filter.filterList = [{ field: 'procesoMatriz.id', criteria: Criteria.EQUALS, value1: ele.id },
          { field: 'eliminado', criteria: Criteria.EQUALS, value1: false}];
          this.subprocesoMatrizService.getsubproWithFilter(filter).then(
            (resp:any) => {
              (<SubprocesoMatriz[]>resp.data).forEach(
                data => 
                  {
                      this.subprocesoMatrizItemList?.push({ label: data.nombre, value: {id:data.id,nombre: data.nombre, idpadre:ele.id} })
                  }
              )
            }
          );
        });
        this.putProceso=false
      }else{
        this.putProceso=true
      }
    }else{
        this.subprocesoMatrizItemList = [{ label: '--Seleccione Subproceso (cargo/oficio)--', value: [null, null]}];
    }
  }
  cargarSubproceso2(idsp:any) {
    if(idsp != null ){
      if(idsp !=0){
        this.subprocesoMatrizItemList2 = [];
        // this.subprocesoMatrizItemList = [{ label: '--Seleccione--', value: [null, null]}];
        [idsp].forEach(async (ele:any) => {
          let filter = new FilterQuery();
          filter.filterList = [{ field: 'procesoMatriz.id', criteria: Criteria.EQUALS, value1: ele.id },
          { field: 'eliminado', criteria: Criteria.EQUALS, value1: false}];
          this.subprocesoMatrizService.getsubproWithFilter(filter).then(
            (resp:any) => {
              (<SubprocesoMatriz[]>resp.data).forEach(
                data => 
                  {
                      this.subprocesoMatrizItemList2?.push({ label: data.nombre, value: {id:data.id,nombre: data.nombre, idpadre:ele.id} })
                  }
              )
            }
          );
        });
        // this.putProceso=false
      }else{
        // this.putProceso=true
      }
    }else{
        this.subprocesoMatrizItemList2 = [{ label: '--Seleccione Subproceso (cargo/oficio)--', value: [null, null]}];
    }
  }
  //----------------sumaExpuestos-------------//

  sumaExpuestosFunc(){
    this.sumaExpuestos=this.sumaP+this.sumaC+this.sumaT;
  }

  nivelProbabilidad(tipo:string){

    let valoracionRI1_1:any

    switch (tipo) {
      case 'inicial':
        valoracionRI1_1=[...this.valoracionRI1]
        break;
      case 'residual':
        valoracionRI1_1=[...this.valoracionRI1Residual]
        break;
    
      default:
        break;
    }

    valoracionRI1_1[0].NP=valoracionRI1_1[0].ND*valoracionRI1_1[0].NE

    if(4>=valoracionRI1_1[0].NP && valoracionRI1_1[0].NP>=0){
      valoracionRI1_1[0].I='Bajo'
    }else if(8>=valoracionRI1_1[0].NP && valoracionRI1_1[0].NP>=6){
      valoracionRI1_1[0].I='Medio'
    }else if(20>=valoracionRI1_1[0].NP && valoracionRI1_1[0].NP>=10){
      valoracionRI1_1[0].I='Alto'
    }else if(40>=valoracionRI1_1[0].NP && valoracionRI1_1[0].NP>=24){
      valoracionRI1_1[0].I='Muy Alto'
    }

    switch (tipo) {
      case 'inicial':
        this.valoracionRI1=[...valoracionRI1_1]
        break;
      case 'residual':
        this.valoracionRI1Residual=[...valoracionRI1_1]
        break;
    
      default:
        break;
    }
    if(this.formMatrizRiesgosI.valid){this.nivelRiesgo(tipo)}
  }
  falgTable:boolean=true
  flagResidual:boolean=false
  nivelRiesgo(tipo:string){

    let valoracionRI1_1:any
    let valoracionRI2_1:any

    switch (tipo) {
      case 'inicial':
        valoracionRI1_1=[...this.valoracionRI1]
        valoracionRI2_1=[...this.valoracionRI2]
        break;
      case 'residual':
        valoracionRI1_1=[...this.valoracionRI1Residual]
        valoracionRI2_1=[...this.valoracionRI2Residual]
        break;
    
      default:
        break;
    }
    this.flagResidual=false
    valoracionRI1_1[0].NR=valoracionRI1_1[0].NP*valoracionRI1_1[0].NC
    if(20>=valoracionRI1_1[0].NR && valoracionRI1_1[0].NR>=0){
      valoracionRI2_1[0].CN='IV'
      valoracionRI2_1[0].CL='Bajo'  
      valoracionRI2_1[0].color='bajo'
      valoracionRI2_1[0].accion='Mantenga los controles existentes'
      // this.falgTable=false
      if(tipo=='inicial'){
        this.formMatrizRiesgosIResidual.patchValue({
          ND: this.formMatrizRiesgosI.value.ND, //Clasificación
          NE: this.formMatrizRiesgosI.value.NE, //Descripción del peligro
          NP: this.formMatrizRiesgosI.value.NP,
          NC: this.formMatrizRiesgosI.value.NC,
          NR: this.formMatrizRiesgosI.value.NR,
          NRCualitativo: this.formMatrizRiesgosI.value.NRCualitativo
        })
        this.nivelProbabilidad('residual')
        this.flagResidual=true
      }

    }else if(120>=valoracionRI1_1[0].NR && valoracionRI1_1[0].NR>=40){
      valoracionRI2_1[0].CN='III'
      valoracionRI2_1[0].CL='Medio'
      valoracionRI2_1[0].color='medio'
      valoracionRI2_1[0].accion='1. Mantenga los controles existentes \n 2. Identifique mejoras'
      if(tipo=='inicial'){
        // this.formMatrizRiesgosIResidual.reset()
        // this.valoracionRI1Residual=[]
        this.nivelProbabilidad('residual')
      }
    }else if(500>=valoracionRI1_1[0].NR && valoracionRI1_1[0].NR>=150){
      valoracionRI2_1[0].CN='II'
      valoracionRI2_1[0].CL='Alto'
      valoracionRI2_1[0].color='alto'
      valoracionRI2_1[0].accion='1. Intervenga de inmediato \n 2. Implemente controles (existentes o adicionales) \n 3. Identifique desviaciones si existe'
      if(tipo=='inicial'){
        // this.formMatrizRiesgosIResidual.reset()
        // this.valoracionRI1Residual=[]
        this.nivelProbabilidad('residual')
      }
    }else if(valoracionRI1_1[0].NR>=600){
      valoracionRI2_1[0].CN='I'
      valoracionRI2_1[0].CL='Muy Alto'
      valoracionRI2_1[0].color='muyalto'
      valoracionRI2_1[0].accion='1. Suspenda la actividad.\n 2. intervenga de inmediato \n 3.Implemente controles. Intervenir es comunicar la situación a los diferentes responsables y ejecutores de la tarea (requiere reporte y gestión de acto y condiciones) Alto'
      if(tipo=='inicial'){
        // this.formMatrizRiesgosIResidual.reset()
        // this.valoracionRI1Residual=[]
        this.nivelProbabilidad('residual')
      }
    }

    switch (tipo) {
      case 'inicial':
        this.valoracionRI1=[...valoracionRI1_1]
        this.valoracionRI2=[...valoracionRI2_1]
        break;
      case 'residual':
        this.valoracionRI1Residual=[...valoracionRI1_1]
        this.valoracionRI2Residual=[...valoracionRI2_1]
        break;
    
      default:
        break;
    }
  }
  
  imagenFlag(eve:any){
    this.imgName=eve+'.png'
    this.imgFlag=true
    switch (eve) {
      case 'ND':
        this.imgNameHeader='Nivel de deficiencia'
        break;
      case 'NE':
        this.imgNameHeader='Nivel de exposición'
        break;
      case 'NP':
        this.imgNameHeader='Nivel de probabilidad'
        break;
      case 'NC':
        this.imgNameHeader= 'Nivel de consecuencia'
        break;
      case 'NR':
        this.imgNameHeader='Nivel de riesgo'
        break;
  
      default:
        break;
    }
  }
  planAccionRiesgoInicial(){
    if(this.formMatrizRiesgosI.value.realizoValoracion=='No'){
      document.getElementById("planAccionInicial")!.style.display = 'block'
    }else{
      document.getElementById("planAccionInicial")!.style.display = 'none'
      this.formMatrizRiesgosI.patchValue({planAccion:null})
    }
  }

  CRUDAreaTreeFunc(eve:any,CRUD:string){
    this.CRUDarea=CRUD
    switch (CRUD) {
      case 'PUT':
        this.putAreaTree=true
        this.newArea=eve.nombre
        this.idArea=eve.id
        break;
      case 'POST':
        this.putAreaTree=true
        this.newArea=''
        break;
      case 'DELETE':
        this.newArea=eve.nombre
        this.idArea=eve.id
        this.CRUDArea('DELETE')
        break;
      default:
        break;
    }
    
  }

  CRUDProcesoTreeFunc(eve:any,CRUD:string){
    this.CRUDproceso=CRUD
    switch (CRUD) {
      case 'POST':
        this.putProcesoTree=true
        this.nombreAreaTree=eve.nombre
        this.newProceso=''
        this.idArea=eve.id
        break;
      case 'PUT':
        this.putProcesoTree=true
        this.nombreAreaTree=eve.nombre
        this.newProceso=eve.node.data.nombre
        this.idArea=eve.parent.data.id
        this.idProceso=eve.node.data.id
        break;
      case 'DELETE':
        this.idArea=eve.parent.data.id
        this.idProceso=eve.node.data.id
        this.newProceso=eve.node.data.nombre
        this.CRUDProceso('DELETE')
        break;
      default:
        break;
    }
  }

  CRUDSubprocesoTreeFunc(eve:any,CRUD:string){
    this.CRUDsubproceso=CRUD
    switch (CRUD) {
      case 'POST':
        this.putSubprocesoTree=true
        this.idProceso=eve.node.data.id
        this.idArea=eve.parent.data.id
        this.newSubproceso=''
        this.nombreProcesoTree=eve.node.data.nombre
        break;
      case 'PUT':
        this.putSubprocesoTree=true
        this.newSubproceso=eve.node.data.nombre
        this.idSubproceso=eve.node.data.id
        this.idProceso=eve.parent.data.id
        this.idArea=eve.parent.parent.data.id
        break;
      case 'DELETE':
        this.idSubproceso=eve.node.data.id
        this.idProceso=eve.parent.data.id
        this.idArea=eve.parent.parent.data.id
        this.newSubproceso=eve.node.data.nombre
        this.CRUDSubproceso('DELETE')
        break;
      default:
        break;
    }
  }

  async CRUDArea(eve:string){
    let area = new AreaMatriz();
    // let planta =new Plantas();
    let planta: Localidades = {} as Localidades;
    planta.id = this.idPlanta;

    area.localidad= planta;
    area.nombre=this.newArea;
    switch (eve) {
      case 'POST':
        area.estado='No evaluada';
        area.eliminado=false
        await this.areaMatrizService.create(area).then((resp:any)=>{
          this.flagRegistroMatrizTree=false
          this.matrizdescripcion.push({children:[],data:{id:resp.id,nombre:resp.nombre,estado:resp.estado},parent:null})
        })
        break;
      case 'PUT':
        area.id=this.idArea
        area.eliminado=false
        await this.areaMatrizService.update(area).then((resp:any)=>{
          this.flagRegistroMatrizTree=false
          const indexarea = this.matrizdescripcion.findIndex((el:any) => el.data.id == resp.id )
          let children = this.matrizdescripcion[indexarea].children
          this.matrizdescripcion[indexarea]={children:children,data:{id:resp.id,nombre:resp.nombre,estado:resp.estado},parent:null}
        })
        break;
      case 'DELETE':
        this.confirmationService.confirm({
          header: 'Eliminar área',
          message: '¿Está seguro de eliminar el área '+this.newArea+'?',
          key: 'matrizp',
          accept: async () => {
            this.flagRegistroMatrizTree=false
            area.id=this.idArea
            area.eliminado=true
            // await this.areaMatrizService.delete(this.idArea.toString()).then((resp:any)=>{
            await this.areaMatrizService.update(area).then((resp:any)=>{
              this.matrizdescripcion=this.matrizdescripcion.filter((fil:any) => fil.data.id !== resp.id)
              setTimeout(() => {
                this.flagRegistroMatrizTree=true
                this.putAreaTree=false
              }, 500);
            })
          },
          acceptLabel: 'Sí',
          rejectLabel: 'No'
        });
        break;
      
      default:
        break;
    }
    setTimeout(() => {
      this.flagRegistroMatrizTree=true
      this.putAreaTree=false
    }, 500);
  }

  async CRUDProceso(eve:string){
    let proceso = new ProcesoMatriz();
    proceso.nombre=this.newProceso;
    let areaMatriz =new AreaMatriz();
    areaMatriz.id=this.idArea
    proceso.areaMatriz=areaMatriz;
    switch (eve) {
      case 'POST':
        proceso.estado='No evaluada';
        proceso.eliminado=false
        this.procesoMatrizService.create(proceso).then((resp:any)=>{
          this.flagRegistroMatrizTree=false
          let proceso:any={children:[],data:{id:resp.id,nombre:resp.nombre,estado:resp.estado}}
          const indexobj = this.matrizdescripcion.findIndex((el:any) => el.data.id == this.idArea )
          this.matrizdescripcion[indexobj].children.push(proceso)
        })
        break;
      case 'PUT':
        proceso.id=this.idProceso;
        proceso.eliminado=false
        await this.procesoMatrizService.update(proceso).then((resp:any)=>{
          this.flagRegistroMatrizTree=false
          const indexArea = this.matrizdescripcion.findIndex((el:any) => el.data.id == this.idArea )
          const indexProceso = this.matrizdescripcion[indexArea].children.findIndex((el:any) => el.data.id == this.idProceso )
          
          let children = this.matrizdescripcion[indexArea].children[indexProceso].children

          this.matrizdescripcion[indexArea].children[indexProceso]={children:children,data:{id:resp.id,nombre:resp.nombre,estado:resp.estado}}
        })
        break;
      case 'DELETE':
        this.confirmationService.confirm({
          header: 'Eliminar proceso',
          message: '¿Está seguro de eliminar el proceso '+this.newProceso+'?',
          key: 'matrizp',
          accept: async () => {
            this.flagRegistroMatrizTree=false
            proceso.id=this.idProceso;
            proceso.eliminado=true
            // await this.procesoMatrizService.delete(this.idProceso.toString()).then((resp:any)=>{
              await this.procesoMatrizService.update(proceso).then((resp:any)=>{
              const indexArea = this.matrizdescripcion.findIndex((el:any) => el.data.id == this.idArea )
              this.matrizdescripcion[indexArea].children=this.matrizdescripcion[indexArea].children.filter((fil:any) => fil.data.id !== resp.id)
              setTimeout(() => {
                this.flagRegistroMatrizTree=true
                this.putProcesoTree=false
              }, 500);
            })
          },
          acceptLabel: 'Sí',
          rejectLabel: 'No'
        });
        break;
    
      default:
        break;
    }
    setTimeout(() => {
      this.flagRegistroMatrizTree=true
      this.putProcesoTree=false
    }, 500);
  }
  CRUDSubproceso(eve:string){
    let subproceso = new SubprocesoMatriz()
    subproceso.nombre=this.newSubproceso;
    let procesoMatriz =new ProcesoMatriz();
    procesoMatriz.id=this.idProceso;
    subproceso.procesoMatriz=procesoMatriz;

    switch (eve) {
      case 'POST':
        subproceso.estado='No evaluada';
        subproceso.eliminado=false
        this.subprocesoMatrizService.create(subproceso).then((resp:any)=>{
          this.flagRegistroMatrizTree=false
          let subproceso:any={children:[],data:{id:resp.id,nombre:resp.nombre,estado:resp.estado}}
          const indexArea = this.matrizdescripcion.findIndex((el:any) => el.data.id == this.idArea )
          const indexProceso = this.matrizdescripcion[indexArea].children.findIndex((el:any) => el.data.id == this.idProceso )
          this.matrizdescripcion[indexArea].children[indexProceso].children.push(subproceso)
        })
        break;
      case 'PUT':
        subproceso.eliminado=false
        subproceso.id=this.idSubproceso;
        this.subprocesoMatrizService.update(subproceso).then((resp:any)=>{
          this.flagRegistroMatrizTree=false
          const indexArea = this.matrizdescripcion.findIndex((el:any) => el.data.id == this.idArea )
          const indexProceso = this.matrizdescripcion[indexArea].children.findIndex((el:any) => el.data.id == this.idProceso )
          const indexSubproceso = this.matrizdescripcion[indexArea].children[indexProceso].children.findIndex((el:any) => el.data.id == this.idSubproceso )
          
          let children = this.matrizdescripcion[indexArea].children[indexProceso].children[indexSubproceso].children

          this.matrizdescripcion[indexArea].children[indexProceso].children[indexSubproceso]={children:children,data:{id:resp.id,nombre:resp.nombre,estado:resp.estado}}
        })
        break;
      case 'DELETE':
        this.confirmationService.confirm({
          header: 'Eliminar subproceso (cargo/oficio)',
          message: '¿Está seguro de eliminar el proceso '+this.newSubproceso+'?',
          key: 'matrizp',
          accept: async () => {
            this.flagRegistroMatrizTree=false
            subproceso.id=this.idSubproceso;
            subproceso.eliminado=true
            // await this.subprocesoMatrizService.delete(this.idSubproceso.toString()).then((resp:any)=>{
            this.subprocesoMatrizService.update(subproceso).then((resp:any)=>{
              const indexArea = this.matrizdescripcion.findIndex((el:any) => el.data.id == this.idArea )
              const indexProceso = this.matrizdescripcion[indexArea].children.findIndex((el:any) => el.data.id == this.idProceso )
              this.matrizdescripcion[indexArea].children[indexProceso].children=this.matrizdescripcion[indexArea].children[indexProceso].children.filter((fil:any) => fil.data.id !== resp.id)
              setTimeout(() => {
                this.flagRegistroMatrizTree=true
                this.putSubprocesoTree=false
              }, 500);
            })
          },
          acceptLabel: 'Sí',
          rejectLabel: 'No'
        });
        break;
    
      default:
        break;
    }
    setTimeout(() => {
      this.flagRegistroMatrizTree=true
      this.putSubprocesoTree=false
    }, 500);
  }

  //-----------------Crear matriz peligros-----------------//
  crearMatrizPeligros(){
    this.confirmationService.confirm({
      header: 'Creación matriz de peligros',
      message: '¿Está seguro de continuar con la creación de la matriz de peligros?',
      key: 'matrizp',
      accept: async () => {
        await this.cargarAreainMatriz()
      },
      acceptLabel: 'Si',
      rejectLabel: 'No'
    });
  }
  async cargarAreainMatriz(){
    this.flagRegistroMatriz=true
    this.flagButtonMatrizAcording=false
    this.activeIndex=-1

    this.areaMatrizItemList = [];
    let filterArea = new FilterQuery();
    filterArea.fieldList= this.fieldList
    filterArea.filterList = [{ field: 'localidad.id', criteria: Criteria.EQUALS, value1: this.idPlanta},
      { field: 'eliminado', criteria: Criteria.EQUALS, value1: false}];
    await this.areaMatrizService.findByFilter(filterArea).then((resp:any)=>{
      resp['data'].forEach(async (data1:any) => {
        this.areaMatrizItemList?.push({ label: data1.nombre, value: {id:data1.id,nombre:data1.nombre}})
      })
    })
  }
//---------------------------------------Evaluación de riesgo--------------------------------------//
  visualEvaluacionRiesgo(key:string){
    switch (key) {
      case 'flagControlIng':
        if(this.flagControlIng){
          document.getElementById("flagControlIng")!.style.display = "block";
        }else{
          document.getElementById("flagControlIng")!.style.display = "none";
        }
      break;
      case 'flagControlAdm':
        if(this.flagControlAdm){
          document.getElementById("flagControlAdm")!.style.display = "block";
        }else{
          document.getElementById("flagControlAdm")!.style.display = "none";
        }
        break;
      case 'flagEquiposEle':
        if(this.flagEquiposEle){
          document.getElementById("flagEquiposEle")!.style.display = "block";
        }else{
          document.getElementById("flagEquiposEle")!.style.display = "none";
        }
        break;
      default:
        break;
    }

  }

  controlIng:any=[]
  controlIngList:any=[]

  controlAdm:any=[]
  controlAdmList:any=[]

  controlEqu:any=[]
  controlEquList:any=[]
  
  controlFlag:boolean=false

  formControl?: FormGroup | any;
  CRUDcontrol:string='POST';
  tipoControl:string=''

  jerarquiaExistente:string=''
  controlFunc(CRUD:string ,tipo:string){
    this.tipoControl=tipo
    this.CRUDcontrol=CRUD
    switch (CRUD) {
      case 'PUT':
        if(this.tipoControl=='ing'){
        this.formControl.patchValue({
          'id': this.controlIng.id,
          'fechaCreacion': this.controlIng.fechaCreacion,
          'descripcion': this.controlIng.descripcion,
          'barrera': this.controlIng.barrera
        })}

        if(this.tipoControl=='adm')
        this.formControl.patchValue({
          'id': this.controlAdm.id,
          'fechaCreacion': this.controlAdm.fechaCreacion,
          'descripcion': this.controlAdm.descripcion,
          'barrera': this.controlAdm.barrera
        })

        if(this.tipoControl=='equ')
        this.formControl.patchValue({
          'id': this.controlEqu.id,
          'fechaCreacion': this.controlEqu.fechaCreacion,
          'descripcion': this.controlEqu.descripcion,
          'barrera': this.controlEqu.barrera
        })
        this.controlFlag=true
        break;
      case 'POST':
        this.formControl.reset()
        if(this.tipoControl=='ing')this.jerarquiaExistente='Control de ingeniería'
        if(this.tipoControl=='adm')this.jerarquiaExistente='Control de administración'
        if(this.tipoControl=='equ')this.jerarquiaExistente='Equipos y elementos de protección personal'
        this.controlFlag=true
        break;
      case 'DELETE':
        this.confirmationService.confirm({
          header: 'Eliminar control existente',
          message: '¿Está seguro de eliminar el control de ingenieria existente?',
          key: 'matrizp',
          accept: async () => {
            if(this.tipoControl=='ing'){
              const index = this.controlIngList.findIndex((el:any) => el.id == this.controlIng.id)
              this.controlIngList.splice(index, 1);}
            if(this.tipoControl=='adm'){
              const index = this.controlAdmList.findIndex((el:any) => el.id == this.controlAdm.id)
              this.controlAdmList.splice(index, 1);}
            if(this.tipoControl=='equ'){
              const index = this.controlEquList.findIndex((el:any) => el.id == this.controlEqu.id)
              this.controlEquList.splice(index, 1);}
          },
          acceptLabel: 'Sí',
          rejectLabel: 'No'
        });
        break;
    
      default:
        break;
    }
  }
  contIDIng:number=1;
  contIDAdm:number=1;
  contIDEqui:number=1;
  controlCRUD(CRUD:string){
    switch (CRUD) {
      case 'POST':
        this.formControl.patchValue({
          fechaCreacion: new Date().toLocaleDateString('es-CO')
        })
        if(this.tipoControl=='ing'){
          this.controlIngList.push({id:this.contIDIng,fechaCreacion:this.formControl.value.fechaCreacion,descripcion:this.formControl.value.descripcion,barrera:this.formControl.value.barrera})
          this.contIDIng++}
        if(this.tipoControl=='adm'){
          this.controlAdmList.push({id:this.contIDAdm,fechaCreacion:this.formControl.value.fechaCreacion,descripcion:this.formControl.value.descripcion,barrera:this.formControl.value.barrera})
          this.contIDAdm++}
        if(this.tipoControl=='equ'){
          this.controlEquList.push({id:this.contIDEqui,fechaCreacion:this.formControl.value.fechaCreacion,descripcion:this.formControl.value.descripcion,barrera:this.formControl.value.barrera})
          this.contIDEqui++}

        this.controlFlag=false
        break;
      case 'PUT':
        if(this.tipoControl=='ing'){
          const indexPlanAccion = this.controlIngList.findIndex((el:any) => el.id == this.controlIng.id)
          this.controlIngList[indexPlanAccion]={id:this.controlIng.id,fechaCreacion:this.formControl.value.fechaCreacion,descripcion:this.formControl.value.descripcion,barrera:this.formControl.value.barrera}}
        if(this.tipoControl=='adm'){
          const indexPlanAccion = this.controlAdmList.findIndex((el:any) => el.id == this.controlIng.id)
          this.controlAdmList[indexPlanAccion]={id:this.controlIng.id,fechaCreacion:this.formControl.value.fechaCreacion,descripcion:this.formControl.value.descripcion,barrera:this.formControl.value.barrera}}
        if(this.tipoControl=='equ'){
          const indexPlanAccion = this.controlEquList.findIndex((el:any) => el.id == this.controlIng.id)
          this.controlEquList[indexPlanAccion]={id:this.controlIng.id,fechaCreacion:this.formControl.value.fechaCreacion,descripcion:this.formControl.value.descripcion,barrera:this.formControl.value.barrera}}
        this.controlFlag=false
        break;    
      default:
        break;
    }
    this.formControl.reset()
  }



  //-----------------------------------Plan Acción----------------------///
  tareasList:any=[]
  tareasListEjecutado:any=[]
  tareasListPendiente:any=[]
  tareasListEjecutadoPorcentaje:any=[]

  tarea:any
  flagPlanAccion:boolean=false
  jControl:any=[{label:'Seleccione',value:null},{label:'Eliminación',value:'Eliminación'},{label:'Sustitución',value:'Sustitución'},{label:'Control de ingeniería',value:'Control de ingeniería'},{label:'Controles administrativos',value:'Controles administrativos'},{label:'Elementos de protección personal',value:'Elementos de protección personal'}]
  estadosPlanAccion:any=[{label:'Seleccione',value:null},{label:'Pendiente',value:'Pendiente'},{label:'Ejecutado',value:'Ejecutado'}]
  planAccion(CRUD:string){
    this.CRUDplanAccion=CRUD
    switch (CRUD) {
      case 'PUT':
        this.formPlanAccion.patchValue({
          'id': this.tarea.id,
          'fechaCreacion': this.tarea.fechaCreacion,
          'jerarquia': this.tarea.jerarquia,
          'descripcion': this.tarea.descripcion,
          'estado': this.tarea.estado,
          'barreras': this.tarea.barreras
        })
        this.flagPlanAccion=true
        break;
      case 'POST':
        this.formPlanAccion.reset()
        this.flagPlanAccion=true
        break;
      case 'DELETE':
        this.confirmationService.confirm({
          header: 'Eliminar plan de acción',
          message: '¿Está seguro de eliminar el plan de acción de la jerarquía de control '+this.tarea.jerarquia +'de ?',
          key: 'matrizp',
          accept: async () => {
            const index = this.tareasListPendiente.findIndex((el:any) => el.id == this.tarea.id)
            this.tareasListPendiente.splice(index, 1);
          },
          acceptLabel: 'Sí',
          rejectLabel: 'No'
        });
        break;
    
      default:
        break;
    }
  }
  cont:number=1;
  flagplanElimsust:boolean=false
  planAccionCRUD(CRUD:string){
    switch (CRUD) {
      case 'POST':
        this.formPlanAccion.patchValue({
          fechaCreacion: new Date().toLocaleDateString('es-CO')
        })
        this.tareasListPendiente.push({id:this.cont,fechaCreacion:this.formPlanAccion.value.fechaCreacion,jerarquia:this.formPlanAccion.value.jerarquia,descripcion:this.formPlanAccion.value.descripcion,estado:this.formPlanAccion.value.estado,barreras:this.formPlanAccion.value.barreras})
        this.cont++

        if(this.tareasListPendiente.filter((el:any) => el.jerarquia == 'Eliminación' || el.jerarquia == 'Sustitución').length>0)this.flagplanElimsust=true
        else this.flagplanElimsust=false

        this.flagPlanAccion=false
        break;
      case 'PUT':
        const indexPlanAccion = this.tareasListPendiente.findIndex((el:any) => el.id == this.tarea.id)
        this.tareasListPendiente[indexPlanAccion]={id:this.tarea.id,fechaCreacion:this.formPlanAccion.value.fechaCreacion,jerarquia:this.formPlanAccion.value.jerarquia,descripcion:this.formPlanAccion.value.descripcion,estado:this.formPlanAccion.value.estado,barreras:this.formPlanAccion.value.barreras}
        if(this.formPlanAccion.value.estado=='Sustitución' || this.formPlanAccion.value.estado=='Eliminación')this.flagplanElimsust=true
        
        if(this.tareasListPendiente.filter((el:any) => el.jerarquia == 'Eliminación' || el.jerarquia == 'Sustitución').length>0)this.flagplanElimsust=true
        else this.flagplanElimsust=false

        this.flagPlanAccion=false
        break;    
      default:
        break;
    }
    this.formPlanAccion.reset()
  }

  //--------guardar---------//
  idEdicion:any
  idEdicion2:any
  flagSustitucion:boolean=false
  async guardarMatriz(CRUD:string){
    //guardado matriz peligros
    let planta=this.plantasList.find(ele=>ele.id==this.idPlanta)
    let area= new AreaMatriz()
    let proceso= new ProcesoMatriz()
    let subproceso= new SubprocesoMatriz()
    let matrizPeligros= new MatrizPeligros()
    this.formMatrizRiesgosC.patchValue({
      Ingenieria:this.controlIngList,
      Administrativos:this.controlAdmList,
      ElementosPro:this.controlEquList
    })
    if(!this.flagControlIng)this.formMatrizRiesgosC.patchValue({Ingenieria:null})
    if(!this.flagControlAdm)this.formMatrizRiesgosC.patchValue({Administrativos:null})
    if(!this.flagEquiposEle)this.formMatrizRiesgosC.patchValue({ElementosPro:null})

    matrizPeligros.controlesexistentes=JSON.stringify(this.formMatrizRiesgosC.value);
    matrizPeligros.peligro=JSON.stringify(this.formMatrizPeligros.value);
    matrizPeligros.localidad=planta;
    // if(this.valoracionRI1[0].NP){
      // console.log(this.valoracionRI1[0].NP)
      this.formMatrizRiesgosI.patchValue({
        NP:this.valoracionRI1[0].NP
      })
    // }
    // if(this.valoracionRI1[0].NR){
      this.formMatrizRiesgosI.patchValue({
        NR:this.valoracionRI1[0].NR,
        NRCualitativo:this.valoracionRI2[0].CL
      })
    // }

    // if(this.valoracionRI1Residual[0].NP){
      this.formMatrizRiesgosIResidual.patchValue({
        NP:(this.formMatrizRiesgosIResidual.value.ND || this.formMatrizRiesgosIResidual.value.NE)?this.valoracionRI1Residual[0].NP:null
      })
    // }
    // if(this.valoracionRI1Residual[0].NR){
      this.formMatrizRiesgosIResidual.patchValue({
        NR:(this.formMatrizRiesgosIResidual.value.ND || this.formMatrizRiesgosIResidual.value.NE)?this.valoracionRI1Residual[0].NR:null,
        NRCualitativo:(this.formMatrizRiesgosIResidual.value.ND || this.formMatrizRiesgosIResidual.value.NE)?this.valoracionRI2Residual[0].CL:null
      })
    // }
    matrizPeligros.valoracionRiesgoInicial=JSON.stringify(this.formMatrizRiesgosI.value);
    // if(this.formMatrizRiesgosIResidual.value.ND || this.formMatrizRiesgosIResidual.value.NE)
    // this.formMatrizRiesgosIResidual.patchValue({
    //   NP: null,
    //   NR: null
    // });
    matrizPeligros.valoracionRiesgoResidual=JSON.stringify(this.formMatrizRiesgosIResidual.value);
    this.tareasList=this.tareasListPendiente.concat(this.tareasListEjecutado)
    this.formEfectividadControles.patchValue({controlPropuestos:this.tareasList.length})
    this.formEfectividadControles.patchValue({cumplimiento:(this.tareasList.length>0)?((this.tareasListEjecutadoPorcentaje.length*100)/(this.tareasList.length)).toFixed(2):0})

    this.tareasListPendiente=this.tareasList.filter((resp:any)=>(resp.estado=='Pendiente' || resp.jerarquia=='Eliminación' || resp.jerarquia=='Sustitución'))
    this.tareasListEjecutado=this.tareasList.filter((resp:any)=>(resp.estado=='Ejecutado' && resp.jerarquia!='Eliminación' && resp.jerarquia!='Sustitución'))
    this.tareasListEjecutadoPorcentaje=this.tareasList.filter((resp:any)=>(resp.estado=='Ejecutado'))
    this.formEfectividadControles.patchValue({controlEjecutados:this.tareasListEjecutadoPorcentaje.length})
    this.formEfectividadControles.patchValue({cumplimiento:(this.tareasList.length>0)?((this.tareasListEjecutadoPorcentaje.length*100)/(this.tareasList.length)).toFixed(2):0})

    if(this.tareasListPendiente.filter((el:any) => el.jerarquia == 'Eliminación' || el.jerarquia == 'Sustitución').length>0)this.flagplanElimsust=true
        else this.flagplanElimsust=false
    
    if(this.tareasListPendiente.filter((resp:any)=>((resp.jerarquia=='Eliminación' && resp.estado=='Ejecutado') || (resp.jerarquia=='Sustitución' && resp.estado=='Ejecutado'))).length>0)
      this.flagEliminadoSustituido=true

    if(this.tareasList.filter((resp:any)=>(resp.estado=='Ejecutado' && resp.jerarquia=='Eliminación')).length>0)
    {this.estado='Riesgo eliminado'}
    else if(this.tareasList.filter((resp:any)=>(resp.estado=='Ejecutado' && resp.jerarquia=='Sustitución')).length>0)
    {this.estado='Riesgo sustituido'}
    else if(this.tareasList.length>0)
    {this.estado='Riesgo vigente'}

    matrizPeligros.planAccion=JSON.stringify(this.tareasList);
    matrizPeligros.eliminado=false

    this.formMatrizGeneral2.patchValue({
      Actividades: this.formMatrizGeneral.value.Actividades,
      Rutinaria: this.formMatrizGeneral.value.Rutinaria,
      Propios: this.formMatrizGeneral.value.Propios,
      Temporales: this.formMatrizGeneral.value.Temporales,
      Contratistas: this.formMatrizGeneral.value.Contratistas,
    });

    switch (this.CRUDMatriz) {
      case 'PUT':
        matrizPeligros.fechaCreacion=new Date()
        matrizPeligros.fechaEdicion=new Date()
        //Identificar el id
        let filterMatriz = new FilterQuery();
        filterMatriz.sortField = "idEdicion";
        filterMatriz.fieldList=["idEdicion"];
        filterMatriz.filterList = [{ field: 'idEdicion', criteria: Criteria.IS_NOT_NULL}];
        filterMatriz.sortOrder = 1;

        await this.matrizPeligrosService.getmpRWithFilter(filterMatriz).then((resp:any)=>{
          resp.data[0].idEdicion+1
          this.idEdicion=resp.data[0].idEdicion+1
        }).catch(er=>{
          this.idEdicion=1
        })

        matrizPeligros.idEdicion=this.idEdicion

        //Separar por subproceso el guardado
        let i=0
        this.idMostrar=''
        this.flagRegistroMatrizTree=false
        this.formMatrizGeneral.value.Subproceso.forEach(async (ele1:any) => {
          let findProceso= this.formMatrizGeneral.value.Proceso.find((ele2:any)=>ele2.id==ele1.idpadre)
          let findArea= this.formMatrizGeneral.value.Area.find((ele3:any)=>ele3.id==findProceso.idpadre)

          area.id=findArea.id
          matrizPeligros.area=area

          proceso.id=findProceso.id
          matrizPeligros.proceso=proceso

          subproceso.id=ele1.id
          matrizPeligros.subProceso=subproceso

          this.formMatrizGeneral2.patchValue({
            Area: [findArea], //Clasificación
            Proceso: [findProceso], //Descripción del peligro
            Subproceso: [ele1],
          });

          matrizPeligros.generalInf=JSON.stringify(this.formMatrizGeneral2.value);
          this.formEfectividadControles.patchValue({estado:this.estado})
          matrizPeligros.efectividadControles=JSON.stringify(this.formEfectividadControles.value)
          let matrizPeligrosLog = new MatrizPeligrosLog()
          matrizPeligrosLog = {...matrizPeligros}
          matrizPeligrosLog.accion='Creado'
          matrizPeligrosLog.fechaEdicion=new Date()
          this.idMatrizPeligro=[]

          await this.matrizPeligrosService.create(matrizPeligros).then((resp:any)=>{
            
            const indexarea = this.matrizdescripcion.findIndex((el:any) => el.data.id == findArea.id )
            const indexproceso = this.matrizdescripcion[indexarea].children.findIndex((el:any) => el.data.id == findProceso.id )
            const indexsubproceso = this.matrizdescripcion[indexarea].children[indexproceso].children.findIndex((el:any) => el.data.id == ele1.id )

            this.matrizdescripcion[indexarea].children[indexproceso].children[indexsubproceso].data.estado='Evaluado'
            this.estadoProcesoArea('Proceso',indexarea,indexproceso);
            this.estadoProcesoArea('Area',indexarea,0);

            this.messageService.add({key: 'mpeligros', severity: 'success', detail: 'Peligro guardado', summary: 'Guardado', life: 6000});
            matrizPeligrosLog.idriesgo=resp.id
            this.idMatrizPeligro.push(resp.id)
            this.idMatriz=resp.id

            if(i!=0)this.idMostrar += ', \n'+resp.id  +'-'+ findArea.nombre +'-' + findProceso.nombre +'-' + ele1.nombre
            else this.idMostrar =resp.id +'-'+ findArea.nombre +'-' + findProceso.nombre +'-' + ele1.nombre

            this.matrizPeligrosLogService.create(matrizPeligrosLog)
            this.CRUDMatriz='POST'
            i +=1
          }).catch(er=>console.log(er))

        })
        this.flagRegistroMatrizTree=true
        
        break;
      case 'POST':
        let filterMatriz2 = new FilterQuery();
        filterMatriz2.sortField = "idEdicion";
        filterMatriz2.fieldList=["idEdicion"];
        filterMatriz2.filterList = [{ field: 'idEdicion', criteria: Criteria.IS_NOT_NULL}];
        filterMatriz2.sortOrder = 1;
        
        await this.matrizPeligrosService.getmpRWithFilter(filterMatriz2).then((resp:any)=>{
          resp.data[0].idEdicion+1
          this.idEdicion2=resp.data[0].idEdicion+1
        }).catch(er=>{
          this.idEdicion2=1
        })

        matrizPeligros.fechaCreacion=(this.fechaCreacion)?this.fechaCreacion:new Date();
        matrizPeligros.fechaEdicion=new Date()
        matrizPeligros.idEdicion=this.idEdicion
        this.formEfectividadControles.patchValue({estado:this.estado})
        matrizPeligros.efectividadControles=JSON.stringify(this.formEfectividadControles.value)
        //Separar por subproceso el guardado
        let idMostrar=""
        for(const [i,ele1] of this.formMatrizGeneral.value.Subproceso.entries()){

          try {
            matrizPeligros.id=this.idMatrizPeligro[i].split('-')[0]
          } catch (error) {
            matrizPeligros.id=this.idMatrizPeligro[i]
          }
        // this.formMatrizGeneral.value.Subproceso.forEach((ele1:any) => {
          let findProceso= this.formMatrizGeneral.value.Proceso.find((ele2:any)=>ele2.id==ele1.idpadre)
          let findArea= this.formMatrizGeneral.value.Area.find((ele3:any)=>ele3.id==findProceso.idpadre)

          area.id=findArea.id
          matrizPeligros.area=area

          proceso.id=findProceso.id
          matrizPeligros.proceso=proceso

          subproceso.id=ele1.id
          matrizPeligros.subProceso=subproceso

          this.formMatrizGeneral2.patchValue({
            Area: [findArea], //Clasificación
            Proceso: [findProceso], //Descripción del peligro
            Subproceso: [ele1],
          });

          matrizPeligros.generalInf=JSON.stringify(this.formMatrizGeneral2.value);

          let matrizPeligrosLog:any = new MatrizPeligrosLog()
          matrizPeligrosLog = {...matrizPeligros}
          // matrizPeligrosLog = matrizPeligros.map((mp:any) => ({ ...mp }));
          matrizPeligrosLog.accion='Actualizado'
          matrizPeligrosLog.fechaEdicion=new Date()
          try {
            matrizPeligrosLog.idriesgo=this.idMatrizPeligro[i].split('-')[0]
          } catch (error) {
            matrizPeligrosLog.idriesgo=this.idMatrizPeligro[i]
          }
          // console.log(this.idMatrizPeligro[i])
          // matrizPeligrosLog.idriesgo=this.idMatrizPeligro[i]
          matrizPeligrosLog.id=null

          
          if(!this.flagSustitucion){
            await this.matrizPeligrosService.update(matrizPeligros).then(resp=>{
              this.messageService.add({key: 'mpeligros', severity: 'success', detail: 'Peligro modificado', summary: 'Modificado', life: 6000});
              this.matrizPeligrosLogService.create(matrizPeligrosLog)
            }).catch(er=>console.log(er))
          }else{

            let matrizPeligros2= new MatrizPeligros()
            matrizPeligros2.eliminado=false
            matrizPeligros2.generalInf=JSON.stringify(this.formMatrizGeneral2.value);
            matrizPeligros2.peligro=JSON.stringify(this.formMatrizPeligrosSustitucion.value);
            matrizPeligros2.plantas=planta;
            matrizPeligros2.area=area
            matrizPeligros2.proceso=proceso
            matrizPeligros2.subProceso=subproceso
            matrizPeligros2.fechaCreacion=new Date();
            matrizPeligros2.idEdicion=this.idEdicion2

            matrizPeligros2.valoracionRiesgoInicial=JSON.stringify(this.formMatrizRiesgosI2.value);
            matrizPeligros2.valoracionRiesgoResidual=JSON.stringify(this.formMatrizRiesgosIResidual2.value);
            matrizPeligros2.controlesexistentes==JSON.stringify(this.formMatrizRiesgosC2.value);
            matrizPeligros2.planAccion='[]'
            this.formEfectividadControles.patchValue({estado:this.estado})
            matrizPeligros2.efectividadControles=JSON.stringify(this.formEfectividadControles.value)


            let matrizPeligrosLog2 = new MatrizPeligrosLog()
            matrizPeligrosLog2 = {...matrizPeligros2}
            matrizPeligrosLog2.accion='Creado'
            matrizPeligrosLog2.fechaEdicion=new Date()
            matrizPeligrosLog2.id=null

            await this.matrizPeligrosService.create(matrizPeligros2).then(async (resp:any)=>{
              this.messageService.add({key: 'mpeligros', severity: 'success', detail: 'Peligro guardado', summary: 'Guardado', life: 6000});
              this.idMatriz=resp.id
              matrizPeligros.fkmatrizpeligros=resp.id
              matrizPeligrosLog2.idriesgo=resp.id
              if(i!=0)idMostrar += ', \n'+matrizPeligros.id +'-'+ matrizPeligros.fkmatrizpeligros +'-' + findArea.nombre +'-' + findProceso.nombre +'-'+ ele1.nombre
              else idMostrar +=matrizPeligros.id +'-'+ matrizPeligros.fkmatrizpeligros +'-' + findArea.nombre +'-' + findProceso.nombre +'-'+ ele1.nombre
              await this.matrizPeligrosService.update(matrizPeligros)
              // await this.matrizPeligrosLogService.create(matrizPeligrosLog)
              // .catch(er=>console.log(er))
              await this.matrizPeligrosLogService.create(matrizPeligrosLog2)
              .catch(er=>console.log(er))
              this.guardadoSustitucion=true
            }).catch(er=>console.log(er))   
            this.idMostrar =idMostrar      
          }

        }
        // )

        break;
    
      default:
        break;
    }
    if(this.tareasList.filter((el:any) => (el.jerarquia=='Sustitución' && el.estado=='Ejecutado')).length>0)this.flagSustitucion=true

  }
  estadoProcesoArea(variable:string, indexArea:number,indexProceso:number){
// fds
    switch (variable) {
      case 'Proceso':
        let listsubProceso = this.matrizdescripcion[indexArea].children[indexProceso].children.filter((resp:any)=> resp.data.estado == 'No evaluada')
        if(listsubProceso.length==0)this.matrizdescripcion[indexArea].children[indexProceso].data.estado='Evaluado'
        break;
      case 'Area':
        let listProceso = this.matrizdescripcion[indexArea].children.filter((resp:any)=> resp.data.estado == 'No evaluada')
        if(listProceso.length==0)this.matrizdescripcion[indexArea].data.estado='Evaluado'
        break;
      default:
        break;
    }
  }
  async identificarIdGrupo(){
        //Identificar el id
        let filterMatriz = new FilterQuery();
        filterMatriz.sortField = "idEdicion";
        filterMatriz.fieldList=["idEdicion"];
        filterMatriz.filterList = [{ field: 'idEdicion', criteria: Criteria.IS_NOT_NULL}];
        filterMatriz.sortOrder = 1;

        await this.matrizPeligrosService.getmpRWithFilter(filterMatriz).then((resp:any)=>{
          resp.data[0].idEdicion+1
          return resp.data[0].idEdicion+1
        }).catch(er=>{
          return 1
        })
  }

  visibleDlgFoto1:boolean=false
  visibleDlgFoto2:boolean=false
  visibleDlgFoto3:boolean=false

  documentosList?: Documento[] | null;
  onUpload(event: Directorio) {
    if (this.documentosList == null)
      this.documentosList = [];
    this.documentosList.push(event.documento!);
    this.documentosList = this.documentosList.slice();
  }

  descargarDocumento(doc: Documento) {
    this.messageService.add({key: 'mpeligros', severity: 'success', detail: 'Archivo \"' + doc.nombre + "\" en proceso de descarga", summary: 'Descargando documento...', life: 6000});

    this.directorioService.download(doc.id).then(
      resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp]);
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink?.setAttribute("href", url);
          dwldLink?.setAttribute("download", doc.nombre);
          dwldLink?.click();
          this.messageService.add({key: 'mpeligros', severity: 'success', detail: 'Se ha descargado correctamente el archivo'+ doc.nombre, summary: 'Archivo descargado', life: 6000});
        }
      }
    );
  }

  actualizarDesc(doc: Documento) {
    this.directorioService.actualizarDocumento(doc).then(
      data => {
        this.messageService.add({key: 'mpeligros', severity: 'success', detail: 'Se ha actualizado correctamente el archivo'+ doc.nombre, summary: 'Archivo actualizado', life: 6000});
      }
    );
  }

  eliminarDocument(doc: Documento) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      key: 'matrizp',
      accept: () => {
          // this.onUpdate.emit(doc);
          this.directorioService.eliminarDocumento(doc.id).then(
            data => {
              this.documentosList = this.documentosList?.filter(val => val.id !== doc.id);
            }
          );
      }
  });
  }
  permisoFlagELASOCIADOS: boolean=false
  TienePermiso(e:boolean){
    this.permisoFlagELASOCIADOS=e
}
}

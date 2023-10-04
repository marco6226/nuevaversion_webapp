import { Component, OnInit} from '@angular/core';
import { PlantasService } from '../../../core/services/Plantas.service';
import { SesionService } from '../../../core/services/session.service';
import { SelectItem, ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
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

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-matriz-peligros',
  templateUrl: './matriz-peligros.component.html',
  styleUrls: ['./matriz-peligros.component.scss']
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
  formMatrizRiesgosC?: FormGroup | any;
  formMatrizRiesgosI?: FormGroup | any;
  formMatrizRiesgosIResidual?: FormGroup | any;
  formPlanAccion?: FormGroup | any;

  flagRegistroMatriz:boolean=false
  flagRegistroMatrizTree:boolean=false
  flagRegistroMatrizAcording:boolean=false
  flagButtonMatrizAcording:boolean=true

  listDivision:any=[]

  tipoPeligroItemList?: SelectItem[];
  peligroItemList?: SelectItem[];

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

  constructor(
    private fb: FormBuilder,
    private plantasService: PlantasService,
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
    private paramNav: ParametroNavegacionService,
    private messageService: MessageService,
  ) { 
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
    this.formMatrizGeneral = this.fb.group({
      Area: [null], //Clasificación
      Proceso: [null], //Descripción del peligro
      Subproceso: [null],
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
      NRCualitativo: [null]
    });
    this.formMatrizRiesgosIResidual= this.fb.group({
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
      estado: [null]
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
    switch (this.paramNav.getAccion<string>()){
      case 'PUT':
        this.CRUDMatriz='PUT'
        this.cargarPlanta(this.paramNav.getParametro<FormGroup>().value.ubicacion)
        this.formCreacionMatriz.patchValue({
            planta: this.paramNav.getParametro<FormGroup>().value.planta,
            ubicacion: this.paramNav.getParametro<FormGroup>().value.ubicacion,
        })
        this.cargarArea(this.paramNav.getParametro<FormGroup>().value.planta)
        this.paramNav.setParametro<any>(null);
        this.paramNav.setAccion<any>(null);
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
  
  async postGet(){
    this.CRUDMatriz='POST'
    this.cargarPlanta(this.paramNav.getParametro2<FormGroup>().value.ubicacion)
    this.formCreacionMatriz.patchValue({
        planta: this.paramNav.getParametro2<FormGroup>().value.planta,
        ubicacion: this.paramNav.getParametro2<FormGroup>().value.ubicacion,
    })
    this.cargarArea(this.paramNav.getParametro2<FormGroup>().value.planta)
    await this.cargarAreainMatriz()
    setTimeout(() => {
      this.flagRegistroMatrizAcording=true;
      this.flagRegistroMatrizTree=true;
      this.activeIndex=-1
    }, 1000);
    let matrizPeligro:any=this.paramNav.getParametro<any>()[0]
    let matrizPeligro2:any=this.paramNav.getParametro<any>()

    let idPadre=0
    try {
      idPadre=matrizPeligro.id.split('-')[1]
    } catch (error) {
      console.log(error)
      idPadre=0
    }

    if(idPadre!=0){
      console.log('entre')
      let filterhijo = new FilterQuery();
      // filterhijo.fieldList=["id","idEdicion"];
      filterhijo.filterList = [{ field: 'id', criteria: Criteria.EQUALS, value1: idPadre.toString()}];

      await this.matrizPeligrosService.getmpRWithFilter(filterhijo).then((resp:any)=>{
        let genIf=JSON.parse(resp.data[0].generalInf)
        this.cargarProceso2(genIf.Area)
        this.cargarSubproceso2(genIf.Proceso)
        this.formMatrizGeneralSustitucion.patchValue({
          Area:genIf.Area,
          Proceso:genIf.Proceso,
          Subproceso:genIf.Subproceso
        })
      })
    }

    let area:any=[]
    let proceso:any=[]
    let subproceso:any=[]

    this.fechaCreacion=(matrizPeligro.fechaCreacion)?new Date(matrizPeligro.fechaCreacion):null

    for(const ele of matrizPeligro2){
      area.push(ele.generalInf.Area[0])
      proceso.push(ele.generalInf.Proceso[0])
      subproceso.push(ele.generalInf.Subproceso[0])
      this.idMatrizPeligro.push(ele.id)
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
      Efectos: matrizPeligro?.peligro?.Efectos,
    });
    this.SelectPeligro(this.formMatrizPeligros.value.Peligro)

    //III-Evaluación del riesgo control existente
    this.formMatrizRiesgosC.patchValue({
      Ingenieria: matrizPeligro?.controlesexistentes?.Ingenieria, //Clasificación
      Administrativos: matrizPeligro?.controlesexistentes?.Administrativos, //Descripción del peligro
      ElementosPro: matrizPeligro?.controlesexistentes?.ElementosPro,
    });
    this.flagControlIng=(this.formMatrizRiesgosC.value.Ingenieria)?true:false
    this.flagControlAdm=(this.formMatrizRiesgosC.value.Administrativos)?true:false
    this.flagEquiposEle=(this.formMatrizRiesgosC.value.ElementosPro)?true:false

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
    
    //V-Plan de acción
    this.tareasList=matrizPeligro?.planAccion
    this.tareasListPendiente=this.tareasList.filter((resp:any)=>(resp.estado=='Pendiente' || resp.jerarquia=='Eliminación' || resp.jerarquia=='Sustitución'))
    this.tareasListEjecutado=this.tareasList.filter((resp:any)=>(resp.estado=='Ejecutado' && resp.jerarquia!='Eliminación' && resp.jerarquia!='Sustitución'))
    this.tareasListEjecutadoPorcentaje=this.tareasList.filter((resp:any)=>(resp.estado=='Ejecutado'))
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

    //borrar elementos en paramNav
    this.paramNav.setParametro<any>(null);
    this.paramNav.setAccion<any>(null);
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
  plantasList: Plantas[] = [];
  cargarPlanta(eve:any){
    let filterPlantaQuery = new FilterQuery();
    filterPlantaQuery.sortField = "id";
    filterPlantaQuery.sortOrder = -1;
    filterPlantaQuery.fieldList = ["id","nombre"];
    filterPlantaQuery.filterList = [
      { field: 'id_division', criteria: Criteria.EQUALS, value1: eve.toString() },
      { field: 'tipo', criteria: Criteria.EQUALS, value1: 'IPER' },
    ];
    this.plantasService.getPlantaWithFilter(filterPlantaQuery).then((resp:any)=>{
      this.planta=[]
      this.plantasList=resp.data
      resp.data.forEach((element:any) => {
        this.planta.push({label:element.nombre,value:element.id})
      });
      
    })
  }
  //-----------------------Cargar peligros-----------------------------//
  SelectPeligro(a: string){
    this.cargarPeligro(a)
  }

  SelectEfecto(a: string){
    this.cargarEfectos(a)
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

  cargarPeligro(idtp:any) {
    if(idtp != null){
    let filter = new FilterQuery();
    filter.filterList = [{ field: 'tipoPeligro.id', criteria: Criteria.EQUALS, value1: idtp['id'] }];
    this.peligroService.findByFilter(filter).then(
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
    filterArea.filterList = [{ field: 'plantas.id', criteria: Criteria.EQUALS, value1: this.idPlanta},
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
    console.log(idp)
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
    console.log(idp)
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
    console.log(idsp)
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
    this.nivelRiesgo(tipo)
  }
  falgTable:boolean=true
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

    valoracionRI1_1[0].NR=valoracionRI1_1[0].NP*valoracionRI1_1[0].NC
    if(20>=valoracionRI1_1[0].NR && valoracionRI1_1[0].NR>=0){
      valoracionRI2_1[0].CN='I'
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
      }

    }else if(120>=valoracionRI1_1[0].NR && valoracionRI1_1[0].NR>=40){
      valoracionRI2_1[0].CN='II'
      valoracionRI2_1[0].CL='Medio'
      valoracionRI2_1[0].color='medio'
      valoracionRI2_1[0].accion='1. Mantenga los controles existentes \n 2. Identifique mejoras'
    }else if(500>=valoracionRI1_1[0].NR && valoracionRI1_1[0].NR>=150){
      valoracionRI2_1[0].CN='III'
      valoracionRI2_1[0].CL='Alto'
      valoracionRI2_1[0].color='alto'
      valoracionRI2_1[0].accion='1. Intervenga de inmediato \n 2. Implemente controles (existentes o adicionales) \n 3. Identifique desviaciones si existe'
    }else if(valoracionRI1_1[0].NR>=600){
      valoracionRI2_1[0].CN='IV'
      valoracionRI2_1[0].CL='Muy Alto'
      valoracionRI2_1[0].color='muyalto'
      valoracionRI2_1[0].accion='1. Suspenda la actividad.\n 2. intervenga de inmediato \n 3.Implemente controles. Intervenir es comunicar la situación a los diferentes responsables y ejecutores de la tarea (requiere reporte y gestión de acto y condiciones) Alto'
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
    let planta =new Plantas();
    planta.id=this.idPlanta
    area.plantas= planta;
    area.nombre=this.newArea;
    area.estado='No evaluada';

    switch (eve) {
      case 'POST':
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
    proceso.estado='No evaluada';
    switch (eve) {
      case 'POST':
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
    subproceso.estado='No evaluada';

    switch (eve) {
      case 'POST':
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
    filterArea.filterList = [{ field: 'plantas.id', criteria: Criteria.EQUALS, value1: this.idPlanta},
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
          'estado': this.tarea.estado
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
        this.tareasListPendiente.push({id:this.cont,fechaCreacion:this.formPlanAccion.value.fechaCreacion,jerarquia:this.formPlanAccion.value.jerarquia,descripcion:this.formPlanAccion.value.descripcion,estado:this.formPlanAccion.value.estado})
        this.cont++

        if(this.tareasListPendiente.filter((el:any) => el.jerarquia == 'Eliminación' || el.jerarquia == 'Sustitución').length>0)this.flagplanElimsust=true
        else this.flagplanElimsust=false

        this.flagPlanAccion=false
        break;
      case 'PUT':
        const indexPlanAccion = this.tareasListPendiente.findIndex((el:any) => el.id == this.tarea.id)
        this.tareasListPendiente[indexPlanAccion]={id:this.tarea.id,fechaCreacion:this.formPlanAccion.value.fechaCreacion,jerarquia:this.formPlanAccion.value.jerarquia,descripcion:this.formPlanAccion.value.descripcion,estado:this.formPlanAccion.value.estado}
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
  flagSustitucion:boolean=false
  async guardarMatriz(CRUD:string){
    //guardado matriz peligros
    let planta=this.plantasList.find(ele=>ele.id==this.idPlanta)
    let area= new AreaMatriz()
    let proceso= new ProcesoMatriz()
    let subproceso= new SubprocesoMatriz()
    let matrizPeligros= new MatrizPeligros()

    if(!this.flagControlIng)this.formMatrizRiesgosC.patchValue({Ingenieria:null})
    if(!this.flagControlAdm)this.formMatrizRiesgosC.patchValue({Administrativos:null})
    if(!this.flagEquiposEle)this.formMatrizRiesgosC.patchValue({ElementosPro:null})

    matrizPeligros.controlesexistentes=JSON.stringify(this.formMatrizRiesgosC.value);
    matrizPeligros.peligro=JSON.stringify(this.formMatrizPeligros.value);
    matrizPeligros.plantas=planta;

    if(this.valoracionRI1[0].NP){
      this.formMatrizRiesgosI.patchValue({
        NP:this.valoracionRI1[0].NP
      })
    }
    if(this.valoracionRI1[0].NR){
      this.formMatrizRiesgosI.patchValue({
        NR:this.valoracionRI1[0].NR,
        NRCualitativo:this.valoracionRI2[0].CL
      })
    }

    if(this.valoracionRI1Residual[0].NP){
      this.formMatrizRiesgosIResidual.patchValue({
        NP:this.valoracionRI1Residual[0].NP
      })
    }
    if(this.valoracionRI1Residual[0].NR){
      this.formMatrizRiesgosIResidual.patchValue({
        NR:this.valoracionRI1Residual[0].NR,
        NRCualitativo:this.valoracionRI2Residual[0].CL
      })
    }
    matrizPeligros.valoracionRiesgoInicial=JSON.stringify(this.formMatrizRiesgosI.value);
    matrizPeligros.valoracionRiesgoResidual=JSON.stringify(this.formMatrizRiesgosIResidual.value);
    this.tareasList=this.tareasListPendiente.concat(this.tareasListEjecutado)
    this.tareasListPendiente=this.tareasList.filter((resp:any)=>(resp.estado=='Pendiente' || resp.jerarquia=='Eliminación' || resp.jerarquia=='Sustitución'))
    this.tareasListEjecutado=this.tareasList.filter((resp:any)=>(resp.estado=='Ejecutado' && resp.jerarquia!='Eliminación' && resp.jerarquia!='Sustitución'))
    this.tareasListEjecutadoPorcentaje=this.tareasList.filter((resp:any)=>(resp.estado=='Ejecutado'))
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

        // this.idEdicion=await this.identificarIdGrupo()
        matrizPeligros.idEdicion=this.idEdicion

        //Separar por subproceso el guardado
        this.formMatrizGeneral.value.Subproceso.forEach((ele1:any) => {
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
          let matrizPeligrosLog = new MatrizPeligrosLog()
          matrizPeligrosLog = {...matrizPeligros}
          matrizPeligrosLog.accion='Creado'
          matrizPeligrosLog.fechaEdicion=new Date()
          this.idMatrizPeligro=[]
          this.matrizPeligrosService.create(matrizPeligros).then((resp:any)=>{
            console.log(resp)
            this.messageService.add({key: 'mpeligros', severity: 'success', detail: 'Peligro guardado', summary: 'Guardado', life: 6000});
            matrizPeligrosLog.idriesgo=resp.id
            this.idMatrizPeligro.push(resp.id)
            this.matrizPeligrosLogService.create(matrizPeligrosLog)
            this.CRUDMatriz='POST'
          }).catch(er=>console.log(er))

        })
        
        break;
      case 'POST':
        matrizPeligros.fechaCreacion=this.fechaCreacion;
        matrizPeligros.idEdicion=this.idEdicion
        //Separar por subproceso el guardado
        for(const [i,ele1] of this.formMatrizGeneral.value.Subproceso.entries()){
          matrizPeligros.id=this.idMatrizPeligro[i]
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

          let matrizPeligrosLog = new MatrizPeligrosLog()
          matrizPeligrosLog = {...matrizPeligros}
          matrizPeligrosLog.accion='Actualizado'
          matrizPeligrosLog.fechaEdicion=new Date()
          matrizPeligrosLog.idriesgo=this.idMatrizPeligro[i]
          matrizPeligrosLog.id=null

          if(!this.flagSustitucion){
            this.matrizPeligrosService.update(matrizPeligros).then(resp=>{
              this.messageService.add({key: 'mpeligros', severity: 'success', detail: 'Peligro modificado', summary: 'Modificado', life: 6000});
              this.matrizPeligrosLogService.create(matrizPeligrosLog)
            }).catch(er=>console.log(er))
          }else{
            let matrizPeligros2= new MatrizPeligros()
            matrizPeligros2.generalInf=JSON.stringify(this.formMatrizGeneralSustitucion.value);
            
            let area2= new AreaMatriz()
            let proceso2= new ProcesoMatriz()
            let subproceso2= new SubprocesoMatriz()

            area2.id=this.formMatrizGeneralSustitucion.value.Area.id
            matrizPeligros2.area=area2

            proceso2.id=this.formMatrizGeneralSustitucion.value.Proceso.id
            matrizPeligros2.proceso=proceso2

            subproceso2.id=this.formMatrizGeneralSustitucion.value.Subproceso.id
            matrizPeligros2.subProceso=subproceso2

            matrizPeligros2.eliminado=false

            await this.matrizPeligrosService.create(matrizPeligros2).then((resp:any)=>{
              console.log(resp)
              matrizPeligros.fkmatrizpeligros=resp.id
              this.messageService.add({key: 'mpeligros', severity: 'success', detail: 'Peligro guardado', summary: 'Guardado', life: 6000});
              
              let matrizPeligrosLog2 = new MatrizPeligrosLog()
              matrizPeligrosLog2 = {...matrizPeligros2}
              matrizPeligrosLog2.accion='Creado'
              matrizPeligrosLog2.fechaCreacion=new Date()
              matrizPeligrosLog2.fechaEdicion=new Date()
              matrizPeligrosLog2.idriesgo=resp.id
              matrizPeligrosLog2.id=null

              this.matrizPeligrosLogService.create(matrizPeligrosLog)
              this.matrizPeligrosService.update(matrizPeligros).then(resp=>{
                this.messageService.add({key: 'mpeligros', severity: 'success', detail: 'Peligro modificado', summary: 'Modificado', life: 6000});
                this.matrizPeligrosLogService.create(matrizPeligrosLog)
              }).catch(er=>console.log(er))

            }).catch(er=>console.log(er))
            
          }

        }
        // )
        
        break;
    
      default:
        break;
    }
  }
  test(){
    console.log(this.formMatrizGeneralSustitucion)
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

}

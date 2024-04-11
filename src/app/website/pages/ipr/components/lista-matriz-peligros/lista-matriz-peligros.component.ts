import { Component,OnInit } from '@angular/core';
import { MatrizPeligrosService } from '../../../core/services/matriz-peligros.service';
import { MatrizPeligros } from '../../../comun/entities/Matriz-peligros';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Message, MessageService, SelectItem } from 'primeng/api';
import { PlantasService } from '../../../core/services/Plantas.service';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Criteria } from '../../../core/entities/filter';
import { AreaService } from '../../../empresa/services/area.service';
import { AreaMatrizService } from '../../../core/services/area-matriz.service';
import { Router } from '@angular/router';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';
import { MatrizPeligrosLogService } from '../../../core/services/matriz-peligros-log.service';
import { MatrizPeligrosLog } from '../../../comun/entities/Matriz-peligros-log';
import * as XLSX from 'xlsx';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { Plantas } from '../../../comun/entities/Plantas';
import { DatePipe } from '@angular/common';
// import * as XLSXStyle from "xlsx-style";
import { Usuario } from '../../../empresa/entities/usuario';
import { ViewMatrizPeligrosService } from '../../../core/services/view-matriz-peligros.service';
import { ViewMatrizPeligrosLogService } from '../../../core/services/view-matriz-peligros-log.service';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { Localidades } from '../../../ctr/entities/aliados';
import { startOfDay } from 'date-fns';


interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-lista-matriz-peligros',
  templateUrl: './lista-matriz-peligros.component.html',
  styleUrls: ['./lista-matriz-peligros.component.scss'],
  providers: [ DatePipe ]
})
export class ListaMatrizPeligrosComponent  implements OnInit {

  docList:any[]=[{label:null}]

  matrizPList: MatrizPeligros[] = [];
  matrizPListT: MatrizPeligros[] = [];
  matrizSelect!: MatrizPeligros;

  matricesSelect!: MatrizPeligros[];

  formCreacionMatriz!:FormGroup;

  listDivision:any=[]
  planta:SelectItem[] =[]
  area:SelectItem[] =[]
  areaMatrizItemList?: SelectItem[];

  matrizPList2:any;
  peligroSelect:any[]=[]

  historicoList:any

  flagtreeTable:boolean=false

  activeTab: number = 0;

  rangeDatesExcelHistorico: any;
  flagExcelHistorico:boolean=false
  flagHistoric:boolean=false

  tipoDescripcion:any=
    {generalInf:"Información general - Descripción: ",
    peligro:"Identificación del peligro: ",
    controlesexistentes:"Evaluación del riesgo controles existentes: ",
    area:"Información general - Descripción: ",
    proceso:"Información general - Descripción: ",
    subProceso:"Información general - Descripción: ",
    plantas:"Información general - Descripción: ",
    valoracionRiesgoInicial:"Valoración del riesgo inicial: ",
    planAccion:"Control de riesgo - Plan de acción: "}
  

  constructor( 
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private matrizPeligrosService: MatrizPeligrosService,
    private viewmatrizPeligrosService: ViewMatrizPeligrosService,
    private viewmatrizPeligrosLogService: ViewMatrizPeligrosLogService,
    private plantasService: PlantasService,
    private areaService: AreaService,
    private areaMatrizService: AreaMatrizService,
    private paramNav: ParametroNavegacionService,
    private matrizPeligrosLogService: MatrizPeligrosLogService,
    private directorioService: DirectorioService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private router: Router
  ) { 
    this.formCreacionMatriz = this.fb.group({
      planta: [null],
      ubicacion: [null],
      area: [null]
    });
  }

  async ngOnInit() {
    this.cargarDatos()
  }
  cols!: Column[];
  filterMode = 'lenient';

  cols2!: Column[];

  cargarDatos(){
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'fechaCreacion', header: 'Fecha de creación' },
      { field: 'area', header: 'Área' },
      { field: 'proceso', header: 'Proceso' },
      { field: 'subProceso', header: 'Subproceso' },
      { field: 'peligro', header: 'Peligro' },
      { field: 'descripcionPeligro', header: 'Descripción de peligros' },
      { field: 'NRCualitativo', header: 'Nivel de riesgo Inicial (Cualitativo)' },
      { field: 'NRCualitativoR', header: 'Nivel de riesgo Residual (Cualitativo)' },
      { field: 'estadoPlanAccion', header: 'Plan de acción' },
    ];
    this.cols2 = [
      { field: 'id', header: 'Id' },
      { field: 'fechaActualizacion', header: 'Fecha actualización' },
      { field: 'usuario', header: 'Usuario' },
      { field: 'evento', header: 'Evento/variable' },
      { field: 'descripcion', header: 'Descripción' },
    ];
    this.getArea()
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
  //     resp.data.forEach((element:any) => {
  //       this.planta.push({label:element.nombre,value:element.id})
  //     });
      
  //   }).catch(er=>console.log(er))
  // }

  async cargarPlantaLocalidad(eve:any){
    let filterPlantaQuery = new FilterQuery();
    filterPlantaQuery.sortField = "id";
    filterPlantaQuery.sortOrder = -1;
    filterPlantaQuery.fieldList = ["id","localidad"];
    filterPlantaQuery.filterList = [
      { field: 'plantas.area.id', criteria: Criteria.EQUALS, value1: eve.toString() },
    ];
    await this.empresaService.getLocalidadesRWithFilter(filterPlantaQuery).then((resp:any)=>{
      this.planta=[]
      resp.data.forEach((element:any) => {
        this.planta.push({label:element.localidad,value:element.id})
      });
    }).catch(er=>console.log(er))
  }

  flagPlantaSelect:boolean=false
  fechaConsolidado:Date | null=null
  fechaHistorico:Date | null=null

  fechaConsolidadoStart:Date | null=null
  fechaHistoricoStart:Date | null=null

  usuarioConsolidado!:string | null;
  usuarioHistorico!:string | null;
  flagBottonPUTGET : boolean =true;
  async cargarArea(eve:any) {
    let filterMatriz = new FilterQuery();
    filterMatriz.fieldList = [
      'id',
    ];
    filterMatriz.filterList = [{ field: 'idplantas', criteria: Criteria.EQUALS, value1: this.formCreacionMatriz.value.planta}];
    filterMatriz.filterList.push({ field: 'planAccion', criteria: Criteria.NOT_EQUALS, value1: "[]"});
    filterMatriz.count =true
    this.viewmatrizPeligrosService.getmpRWithFilter(filterMatriz).then((resp:any)=>{
      if(resp.count>0)this.flagBottonPUTGET=false
      else this.flagBottonPUTGET=true
    }).catch(er=>console.log(er))

    let filterArea = new FilterQuery();
    filterArea.sortField = "id";
    filterArea.sortOrder = -1;
    filterArea.fieldList= ['id','nombre']
    filterArea.filterList = [{ field: 'localidad.id', criteria: Criteria.EQUALS, value1: eve},
                            { field: 'eliminado', criteria: Criteria.EQUALS, value1: false}];

    await this.areaMatrizService.findByFilter(filterArea).then((resp:any)=>{
      this.area=[]
      this.areaMatrizItemList=[]
      resp.data.forEach((element:any) => {
        this.areaMatrizItemList?.push({ label: element.nombre, value: {id:element.id,nombre:element.nombre}})
        // this.area.push({label:element.nombre,value:{id:element.id,nombre:element.nombre}})
      });
    })
    let filterPlantaQuery = new FilterQuery();
    filterPlantaQuery.fieldList = ["id","idDocConsolidado","idDocHistorico","fechaConsolidado","fechaHistorico","usuarioConsolidado_email","usuarioHistorico_email","fechaConsolidadoStart","fechaHistoricoStart"];
    filterPlantaQuery.filterList = [{ field: 'id', criteria: Criteria.EQUALS, value1: eve }];
    let localidades:any[]=[];
    // this.plantasService.getPlantaWithFilter(filterPlantaQuery).then((resp:any)=>{
    this.empresaService.getLocalidadesRWithFilter(filterPlantaQuery).then((resp:any)=>{

      localidades = (<any[]>resp.data).map(matriz => matriz);
      localidades.map(resp=>resp.fechaConsolidado=resp.fechaConsolidado?new Date(resp.fechaConsolidado!):null)
      localidades.map(resp=>resp.fechaHistorico=resp.fechaHistorico?new Date(resp.fechaHistorico!):null)
      localidades.map(resp=>resp.fechaConsolidadoStart=resp.fechaConsolidadoStart?new Date(resp.fechaConsolidadoStart!):null)
      localidades.map(resp=>resp.fechaHistoricoStart=resp.fechaHistoricoStart?new Date(resp.fechaHistoricoStart!):null)
      this.usuarioConsolidado=localidades[0].usuarioConsolidado_email
      this.usuarioHistorico=localidades[0].usuarioHistorico_email
      this.fechaConsolidado =localidades[0].fechaConsolidado!
      this.fechaHistorico=localidades[0].fechaHistorico!
      this.fechaConsolidadoStart =localidades[0].fechaConsolidadoStart!
      this.fechaHistoricoStart=localidades[0].fechaHistoricoStart!

      if(resp.data[0].idDocConsolidado){
        this.docIdConsolidado=resp.data[0].idDocConsolidado
        this.flagDConsolidado=true
        this.estadoConsolidado='Documento listo'
      }else if(resp.data[0].idDocConsolidado==0){
        this.estadoConsolidado='En procceso...'
      }else{
        this.estadoConsolidado='Sin estado'
      }

      if(resp.data[0].idDocHistorico){
        this.docIdHistorico=resp.data[0].idDocHistorico
        this.flagDHistorico=true
        this.estadoHistorico='Documento listo'
      }else if(resp.data[0].idDocHistorico==0){
        this.estadoHistorico='En procceso...'
      }else{
        this.estadoHistorico='Sin estado'
      }
      
    }).catch(er=>console.log(er))
    this.flagPlantaSelect=true
  }

  lastFecha:Date | any;
  lastFecha2:Date | any;

  estadoConsolidado:string='Sin estado'
  estadoHistorico:string='Sin estado'
  GPI:number=0;
  GPF:number=0;
  ICR:number=0;
  flagICR:boolean=false
  async cargarRegistrosMatriz(){
    this.flagICR=false
    this.GPI=0;
    this.GPF=0;
    this.ICR=0;
    this.activeTab=2;
    setTimeout(() => {
      this.activeTab=0;
    }, 500);
    this.flagtreeTable=false
    let filterMatriz = new FilterQuery();
    filterMatriz.sortField = "id";
    filterMatriz.sortOrder = -1;
    this.matrizPList=[]
    this.matrizPListT=[]
    for (const ele of this.formCreacionMatriz.value.area) {
      filterMatriz.filterList = [{ field: 'area.id', criteria: Criteria.EQUALS, value1: ele.id}];
      filterMatriz.filterList.push({ field: 'eliminado', criteria: Criteria.EQUALS, value1: 'false'});
      filterMatriz.filterList.push({ field: 'empresa.id', criteria: Criteria.EQUALS, value1: '22'});

      let matrizPList:MatrizPeligros[]=[];
      let matrizPList2:any[]=[];
      await this.matrizPeligrosService.getmpRWithFilter(filterMatriz).then((resp:any)=>{
        matrizPList = (<MatrizPeligros[]>resp.data).map(matriz => matriz);
        matrizPList.map(resp=>resp.fechaCreacion=resp.fechaCreacion?startOfDay(new Date(resp.fechaCreacion!)):null)
        // matrizPList.map(resp=>resp.fechaCreacion=resp.fechaCreacion?new Date(resp.fechaCreacion!):null)

        matrizPList.map(resp=>resp.fechaEdicion=resp.fechaEdicion?startOfDay(new Date(resp.fechaEdicion!)):null)
        matrizPList.map(resp=>resp.controlesexistentes=JSON.parse(resp.controlesexistentes!))
        matrizPList.map(resp=>resp.generalInf=JSON.parse(resp.generalInf!))
        matrizPList.map(resp=>resp.peligro=JSON.parse(resp.peligro!))
        matrizPList.map(resp=>resp.planAccion=JSON.parse(resp.planAccion!))
        // matrizPList.map(resp=>resp.planAccion=(JSON.parse(resp.planAccion!).length>0)?'Con plan de Acción':'Sin plan de acción')
        matrizPList.map(resp=>resp.valoracionRiesgoInicial=JSON.parse(resp.valoracionRiesgoInicial!))
        matrizPList.map(resp=>resp.valoracionRiesgoResidual=JSON.parse(resp.valoracionRiesgoResidual!))
        matrizPList.map(resp=>resp.id=(resp.fkmatrizpeligros)?resp.id+'-'+resp.fkmatrizpeligros:resp.id)
        matrizPList.map(resp=>resp.efectividadControles=JSON.parse(resp.efectividadControles!))
        matrizPList2=new Array(matrizPList)
        for(const [i,v] of matrizPList.entries()){
          let valor:any=v
          let estado='Sin estado'
          if(valor.planAccion.length>0){
            estado='Riesgo vigente'
            for(const paccion of valor.planAccion){
              if(paccion.jerarquia=='Sustitución' && paccion.estado=='Ejecutado')estado='Riesgo sustituido'
              if(paccion.jerarquia=='Eliminación' && paccion.estado=='Ejecutado')estado='Riesgo eliminado'
            }
          }
          
          matrizPList2[0][i].estadoPlanAccion=(valor.planAccion.length>0)?'Con plan de Acción':'Sin plan de acción'
          matrizPList2[0][i].estado=estado
        }
      }).catch(er=>console.log(er))

      if(matrizPList2[0].length>0)this.matrizPList=this.matrizPList.concat(matrizPList2[0]);
    }

    let filterMatriz2 = new FilterQuery();
    filterMatriz2.sortField = "id";
    filterMatriz2.sortOrder = -1;
    this.matrizPList2=[]
    let idEdicion:any=[]
    // this.matrizPList.forEach(async (ele:any) => {
    for(const ele of this.matrizPList){
      this.flagtreeTable=false
      let findEdicion=idEdicion.find((fnd:any)=>fnd==ele.idEdicion)
      if(!findEdicion){
        idEdicion.push(ele.idEdicion)
        filterMatriz2.filterList = [{ field: 'idEdicion', criteria: Criteria.EQUALS, value1: ele.idEdicion?.toString()}];
        filterMatriz2.filterList.push({ field: 'eliminado', criteria: Criteria.EQUALS, value1: 'false'});
        filterMatriz2.filterList.push({ field: 'empresa.id', criteria: Criteria.EQUALS, value1: '22'});
        let matrizPList:MatrizPeligros[]=[];
        let matrizPList2:any[]=[]
        let matrizPList_:any[]=[];
        await this.matrizPeligrosService.getmpRWithFilter(filterMatriz2).then((resp:any)=>{
          matrizPList = (<MatrizPeligros[]>resp.data).map(matriz => matriz);
          matrizPList.map(resp=>resp.fechaCreacion=resp.fechaCreacion?new Date(resp.fechaCreacion!):null)
          matrizPList.map(resp=>resp.controlesexistentes=JSON.parse(resp.controlesexistentes!))
          matrizPList.map(resp=>resp.generalInf=JSON.parse(resp.generalInf!))
          matrizPList.map(resp=>resp.peligro=JSON.parse(resp.peligro!))
          matrizPList.map(resp=>resp.planAccion=JSON.parse(resp.planAccion!))
          matrizPList.map(resp=>resp.valoracionRiesgoInicial=JSON.parse(resp.valoracionRiesgoInicial!))
          matrizPList.map(resp=>resp.valoracionRiesgoResidual=JSON.parse(resp.valoracionRiesgoResidual!))

          for(let element of matrizPList){
        
          // matrizPList.forEach((element:any) => {
            let estado='Sin estado'
            if(element.planAccion.length>0){
              estado='Riesgo vigente'
              for(const paccion of element.planAccion){
                if(paccion.jerarquia=='Sustitución' && paccion.estado=='Ejecutado')estado='Riesgo sustituido'
                if(paccion.jerarquia=='Eliminación' && paccion.estado=='Ejecutado')estado='Riesgo eliminado'
              }
            }

            matrizPList2.push({
              id:element.id,
              fechaCreacion:element.fechaCreacion,
              area:element?.area?.nombre,
              proceso:element?.proceso?.nombre,
              subProceso:element?.subProceso?.nombre,
              peligro:element?.peligro?.Peligro?.nombre,
              descripcionPeligro:element?.peligro?.DescripcionPeligro?.nombre,
              NRCualitativo:element?.valoracionRiesgoInicial?.NRCualitativo,
              NRCualitativoR:element?.valoracionRiesgoResidual?.NRCualitativo,
              planAccion:element?.planAccion,
              estadoPlanAccion:(element?.planAccion.length>0)?'Con plan de Acción':'Sin plan de acción',
              estado:estado
            })
          }
          // )

          if(matrizPList.length>0)this.matrizPListT=this.matrizPListT.concat(matrizPList);

        }).catch(er=>console.log(er))
        
        let padre=matrizPList2[0]
        matrizPList2.shift();
        for(const ele of matrizPList2){
        // matrizPList2.forEach(ele=>{
          matrizPList_.push({data:ele})
        }
        this.matrizPList2.push({data:padre,children:matrizPList_})
      }else{
        // this.matrizPList2.push({data:ele,children:[]})
      }
      this.flagtreeTable=true
    }
    let cont=0
    this.lastFecha=null
    this.lastFecha2=null
    const uniqueArray = Array.from(new Set(this.matrizPList));

    this.matrizPList=[...uniqueArray]
    this.matrizPList.forEach((ele:any) => {
      if(ele.fechaEdicion)this.lastFecha2=new Date(ele.fechaEdicion)
      
      if(this.lastFecha2)
        if(this.lastFecha == null){
          this.lastFecha= new Date(this.lastFecha2);
        }else if(this.lastFecha < this.lastFecha2){
          this.lastFecha= new Date(this.lastFecha2);
        }
      let eliminado:any = ele.planAccion.find((ele2:any)=>ele2.estado=='Ejecutado' && ele2.jerarquia=='Eliminación')
      this.GPI+=ele.valoracionRiesgoInicial.NR
      this.GPF+=(eliminado)?0:(ele.valoracionRiesgoResidual.NR)?ele.valoracionRiesgoResidual.NR:ele.valoracionRiesgoInicial.NR
    });

    this.ICR=((this.GPI-this.GPF)/this.GPI)*100
    this.flagICR=true

  }

  CRUDMatriz(CRUD:string,tipo:string){
    let formCreacionMatrizLocal:any=null
    switch (CRUD) {
      case 'PUT':
        // this.paramNav.setParametro<FormGroup>(this.formCreacionMatriz);
        // this.paramNav.setAccion<string>('PUT');
        formCreacionMatrizLocal=Object.assign({} , {value:this.formCreacionMatriz.value})

        localStorage.setItem('formCreacionMatriz', JSON.stringify(formCreacionMatrizLocal));
        localStorage.setItem('Accion1', 'PUT');
        this.router.navigate(['/app/ipr/matrizPeligros'])
      break;
      case 'POST':
        if(tipo=='ALONE'){
          // this.paramNav.setParametro<MatrizPeligros[]>([this.matrizSelect])
          localStorage.setItem('matrizSelect', JSON.stringify([this.matrizSelect]));

        }else{
          // this.paramNav.setParametro<MatrizPeligros[]>(this.matricesSelect)
          localStorage.setItem('matrizSelect', JSON.stringify(this.matricesSelect));

        }
        formCreacionMatrizLocal=Object.assign({} , {value:this.formCreacionMatriz.value})
        localStorage.setItem('formCreacionMatriz', JSON.stringify(formCreacionMatrizLocal));
        localStorage.setItem('Accion1', 'POST');
        // this.paramNav.setAccion<string>('POST');
        // this.paramNav.setParametro2<FormGroup>(this.formCreacionMatriz);

        this.router.navigate(['/app/ipr/matrizPeligros'])
      break;
      case 'GET':
          if(tipo=='ALONE'){
            // this.paramNav.setParametro<MatrizPeligros[]>([this.matrizSelect])
            localStorage.setItem('matrizSelect', JSON.stringify([this.matrizSelect]));
          }else{
            // this.paramNav.setParametro<MatrizPeligros[]>(this.matricesSelect)
            localStorage.setItem('matrizSelect', JSON.stringify(this.matricesSelect));
          }
          // this.paramNav.setAccion<string>('GET');
          // this.paramNav.setParametro2<FormGroup>(this.formCreacionMatriz);
          formCreacionMatrizLocal=Object.assign({} , {value:this.formCreacionMatriz.value})
          localStorage.setItem('formCreacionMatriz', JSON.stringify(formCreacionMatrizLocal));
          localStorage.setItem('Accion1', 'GET');
  
          this.router.navigate(['/app/ipr/matrizPeligros'])
        break;
    
      default:
        break;
    }

  }

  matricSelect(){
    this.matricesSelect=[]
    for(const ele of this.peligroSelect){
      let mp:any
      mp=this.matrizPListT.find(resp=>resp.id==ele.id)
      this.matricesSelect.push(mp)
    }
  }


  ///------------------Historico------------//
  matrizPList3:MatrizPeligrosLog[]=[]
  matrizPList3Select!:MatrizPeligrosLog
  async historicoCargar(){
    this.flagHistoric=true
    let idpadre
    try {
      idpadre=this.matrizSelect?.id!.toString().split('-')[0]
    } catch (error) {
      idpadre=this.matrizSelect?.id!.toString()
    }

    let filterHistorico = new FilterQuery();
    filterHistorico.sortField = "id";
    filterHistorico.sortOrder = -1;
    filterHistorico.filterList = [{ field: 'idriesgo', criteria: Criteria.EQUALS, value1: idpadre}];
    
    let matrizPList:any[]=[];
    await this.matrizPeligrosLogService.getmpRWithFilter(filterHistorico).then((resp:any)=>{
      // this.matrizPList3 = (<MatrizPeligrosLog[]>resp.data).map(matriz => matriz);
      matrizPList = (<MatrizPeligrosLog[]>resp.data).map(matriz => matriz);
      matrizPList.map(resp=>resp.fechaCreacion=resp.fechaCreacion?startOfDay(new Date(resp.fechaCreacion!)):null)
      matrizPList.map(resp=>resp.fechaEdicion=resp.fechaEdicion?startOfDay(new Date(resp.fechaEdicion!)):null)
      matrizPList.map(resp=>resp.controlesexistentes=JSON.parse(resp.controlesexistentes!))
      matrizPList.map(resp=>resp.generalInf=JSON.parse(resp.generalInf!))
      matrizPList.map(resp=>resp.peligro=JSON.parse(resp.peligro!))
      matrizPList.map(resp=>resp.planAccion=JSON.parse(resp.planAccion!))
      matrizPList.map(resp=>resp.valoracionRiesgoInicial=JSON.parse(resp.valoracionRiesgoInicial!))
      matrizPList.map(resp=>resp.valoracionRiesgoResidual=JSON.parse(resp.valoracionRiesgoResidual!))
      matrizPList.map(resp=>resp.efectividadControles=JSON.parse(resp.efectividadControles!))

      this.matrizPList3=[...matrizPList]
      this.historicoList=[]

      for(const [i,ele] of matrizPList.entries()){
        if(i==0){this.historicoList.push(ele)
        }else{
          if(ele.valoracionRiesgoInicial?.NRCualitativo != matrizPList[i-1].valoracionRiesgoInicial?.NRCualitativo || ele.valoracionRiesgoResidual?.NRCualitativo != matrizPList[i-1].valoracionRiesgoResidual?.NRCualitativo)this.historicoList.push(ele)
        }        
      }
      setTimeout(() => {
        this.activeTab=1
      }, 500);
    })
  }


  diferencias:any = {};
  firstFlag:boolean=true;
  encontrarDiferencias(objeto1:any, objeto2:any) {

    let diferencias = {};
    if(typeof objeto1 =='object'){
      const clavesObjeto1 = Object.keys(objeto1);
      for (const clave of clavesObjeto1) {
        
        if (objeto1[clave] !== objeto2[clave]) {
          diferencias=this.diferenciaObject(diferencias,objeto1[clave],objeto2[clave],clave,this.tipoDescripcion[clave])
        }
      }
      return diferencias;
    }else{
      return null
    }
  }

  diferenciaObject(diferencias:any,objeto1:any, objeto2:any, value:any,ubicacion:string){
    if(objeto1 !==objeto2){
      let valueOut:any=['id','Area','Proceso','Subproceso','Efectos','eliminado','estado','plantas','planAccion','proceso','subProceso','accion','idriesgo','idEdicion','accion','fechaEdicion']
      if(objeto2 && !valueOut.includes(value) ){
        if(typeof objeto2=='object'){
          const clavesObjeto1 = Object.keys(objeto2);
          for (const clave of clavesObjeto1){
            if(!valueOut.includes(clave)){
              if(typeof objeto2[clave] =='object' ){
                diferencias=this.diferenciaObject(diferencias,objeto1[clave],objeto2[clave],clave,ubicacion)
              }else {
                if(objeto2[clave]){
                  let clave2:string=(clave!='nombre')?clave:value;
                  if(!objeto1){
                    diferencias[ubicacion+clave2] = objeto2[clave]
                  }else if(objeto1){
                    if(!objeto1[clave]){
                      diferencias[ubicacion+clave2] = objeto2[clave]
                    }
                    else if(objeto1[clave] !== objeto2[clave]){
                      diferencias[ubicacion+clave2] = objeto2[clave]
                    }
                  }
                  
                }
              }
            }
          }
          return diferencias;
        }else if(objeto1 !== objeto2){
          diferencias[value] = objeto2
          return diferencias;
        }
      }else{
        return diferencias
      }
    }else{
      return diferencias
    }
  }

  diferenciaCreacion(objeto1:any){
    let diferencias = {};
    if(typeof objeto1 =='object'){
      const clavesObjeto1 = Object.keys(objeto1);
      console.log(clavesObjeto1)
      for (const clave of clavesObjeto1){
        diferencias=this.diferenciaObjetCreacion(diferencias,objeto1[clave],clave,null,this.tipoDescripcion[clave])
      }
      return diferencias
    }else{
      return null
    }
  }
  diferenciaObjetCreacion(diferencias:any,objeto1:any,value:any,value0:any=null,ubicacion:string){
    let valueOut:any=['id','Area','Proceso','Subproceso','Efectos','eliminado','estado','plantas','planAccion','proceso','subProceso','accion','idriesgo','idEdicion','accion','fechaEdicion']
    if(objeto1 && !valueOut.includes(value)){
      if(typeof objeto1 =='object'){
        const clavesObjeto1 = Object.keys(objeto1);
        for (const clave of clavesObjeto1){
          diferencias=this.diferenciaObjetCreacion(diferencias,objeto1[clave],clave,value,ubicacion)
        }
      }else{
        let clave2:string=(value!='nombre')?value:value0;
        diferencias[ubicacion+clave2] = objeto1
      }
      return diferencias
    }else{
      return diferencias
    }
  }


  ///-----------------------Excel historioco --------------------------////
  habilitarindSCM(){
    if(this.rangeDatesExcelHistorico[0] && this.rangeDatesExcelHistorico[1]){this.flagExcelHistorico=false}
    else{this.flagExcelHistorico=true}
}
  onResetDate(){
    this.flagExcelHistorico=true
  }

  docIdConsolidado:string='null'
  docIdHistorico:string='null'
  flagGConsolidado:boolean=false
  flagDConsolidado:boolean=false
  async exportexcelConsolidado(): Promise<void> 
    {      
      let filterMatriz = new FilterQuery();
      // filterMatriz.sortField = "area.nombre";
      // filterMatriz.filterList = [{ field: 'plantas.id', criteria: Criteria.EQUALS, value1: this.formCreacionMatriz.value.planta}];
      filterMatriz.filterList = [{ field: 'idplantas', criteria: Criteria.EQUALS, value1: this.formCreacionMatriz.value.planta}];
      filterMatriz.filterList.push({ field: 'planAccion', criteria: Criteria.NOT_EQUALS, value1: "[]"});

      filterMatriz.sortOrder = -1;
      this.flagGConsolidado=true
      this.flagDConsolidado=false

      let usuario = new Usuario()
      usuario.id=JSON.parse(localStorage.getItem('session')!).usuario.id
      // let planta = new Plantas()
      // planta.idDocConsolidado="0"
      // planta.usuarioConsolidado=usuario
      // planta.descargaConsolidado=false
      // planta.idDocHistorico='null'
      // planta.id=this.formCreacionMatriz.value.planta
      // planta.fechaConsolidadoStart=new Date()
      // planta.fechaConsolidado=null
      
      // let planta = new Localidades()
      let planta: Localidades = {} as Localidades;

      planta.idDocConsolidado="0"
      planta.usuarioConsolidado=usuario
      planta.descargaConsolidado=false
      planta.idDocHistorico='null'
      planta.id=this.formCreacionMatriz.value.planta
      planta.fechaConsolidadoStart=new Date()
      planta.fechaConsolidado=null

      this.fechaConsolidadoStart=new Date()
      this.fechaConsolidado=null
      this.estadoConsolidado='En procceso...'
      await this.empresaService.putLocalidad(planta)

      // await this.plantasService.update(planta)
      
      // this.matrizPeligrosService.getmpExcelConsolidado(filterMatriz).then((resp:any)=>{
      this.viewmatrizPeligrosService.getmpExcelConsolidado(filterMatriz).then((resp:any)=>{

        this.docIdConsolidado=resp.data2.id
        this.fechaConsolidado=new Date()
        this.flagDConsolidado=true
        this.usuarioConsolidado=JSON.parse(localStorage.getItem('session')!).usuario.email
        this.estadoConsolidado='Documento listo'
      })
      .finally(()=>{
        this.flagGConsolidado=false
      })
      
    }

    async descargarexcelConsolidado(): Promise<void> 
    {
      if(this.docIdConsolidado != 'null'){
      
      let findPlanta:any= this.planta.find((ele3:any)=>ele3.value==this.formCreacionMatriz.value.planta)
      this.directorioService.download(this.docIdConsolidado).then(
        async resp => {
          if (resp != null) {
            var blob = new Blob([<any>resp]);
            let url = URL.createObjectURL(blob);
            let dwldLink = document.getElementById("dwldLink");
            dwldLink?.setAttribute("href", url);
            dwldLink?.setAttribute("download", 'Consolidado-'+findPlanta.label+'-'+this.datePipe.transform(new Date(this.fechaConsolidado!), 'dd/MM/yyyy HH:mm')?.toString()+'.xlsx');
            dwldLink?.click();
          }
          let usuario = new Usuario()
          usuario.id=JSON.parse(localStorage.getItem('session')!).usuario.id
          // let planta = new Plantas()
          let planta: Localidades = {} as Localidades;

          planta.idDocConsolidado=this.docIdConsolidado
          planta.usuarioConsolidado=usuario
          planta.descargaConsolidado=true
          planta.idDocHistorico='null'
          planta.id=this.formCreacionMatriz.value.planta
          planta.fechaConsolidadoStart=new Date(this.fechaConsolidadoStart!)
          planta.fechaConsolidado=new Date(this.fechaConsolidado!)
          // await this.plantasService.update(planta)
          await this.empresaService.putLocalidad(planta)

          // this.matrizPeligrosService.descargarExcelConsolidado()
          this.viewmatrizPeligrosService.descargarExcelConsolidado()
          this.messageService.add({key: 'mnsgMatrizPeligros', severity:'success', summary: 'Archivo descargado', detail: 'Se ha descargado correctamente el archivo'});
        }
      )}
    }

    flagGHistorico:boolean=false
    flagDHistorico:boolean=false
    async exportexcelHistorico(): Promise<void> 
      {     
        let filterMatriz = new FilterQuery();
        // filterMatriz.sortField = "idRiesgo";
        filterMatriz.filterList = [{ field: 'idplantas', criteria: Criteria.EQUALS, value1: this.formCreacionMatriz.value.planta}];
        // filterMatriz.filterList = [{ field: 'plantas.id', criteria: Criteria.EQUALS, value1: this.formCreacionMatriz.value.planta}];
        filterMatriz.filterList.push({ field: 'planAccion', criteria: Criteria.NOT_EQUALS, value1: "[]"});
  
        filterMatriz.sortOrder = -1;
        this.flagGHistorico=true
        this.flagDHistorico=false

        let usuario = new Usuario()
        usuario.id=JSON.parse(localStorage.getItem('session')!).usuario.id
        // let planta = new Plantas()
        let planta: Localidades = {} as Localidades;

        planta.idDocHistorico="0"
        planta.usuarioHistorico=usuario
        planta.descargaHistorico=false
        planta.idDocConsolidado='null'
        planta.id=this.formCreacionMatriz.value.planta
        planta.fechaHistoricoStart=new Date()
        planta.fechaHistorico=null
        this.fechaHistoricoStart=new Date()
        this.fechaHistorico=null
        this.estadoHistorico='En procceso...'
        // await this.plantasService.update(planta)
        await this.empresaService.putLocalidad(planta)

        
        this.viewmatrizPeligrosLogService.getmpExcelHistorico(filterMatriz).then((resp:any)=>{
        // this.matrizPeligrosLogService.getmpExcelHistorico(filterMatriz).then((resp:any)=>{
          this.docIdHistorico=resp.data2.id
          this.fechaHistorico=new Date()
          this.flagDHistorico=true
          this.usuarioHistorico=JSON.parse(localStorage.getItem('session')!).usuario.email
          this.estadoHistorico='Documento listo'
        }).finally(()=>{
          this.flagGHistorico=false
        })
        
      }
  
      async descargarexcelHistorico(): Promise<void> 
      {
        if(this.docIdHistorico != 'null'){
        let findPlanta:any= this.planta.find((ele3:any)=>ele3.value==this.formCreacionMatriz.value.planta)
        this.directorioService.download(this.docIdHistorico).then(
          async resp => {
            if (resp != null) {
              var blob = new Blob([<any>resp]);
              let url = URL.createObjectURL(blob);
              let dwldLink = document.getElementById("dwldLink");
              dwldLink?.setAttribute("href", url);
              dwldLink?.setAttribute("download", 'Historico-'+findPlanta.label+'-'+this.datePipe.transform(new Date(this.fechaHistorico!), 'dd/MM/yyyy HH:mm')+'.xlsx');
              dwldLink?.click();
            }

            let usuario = new Usuario()
            usuario.id=JSON.parse(localStorage.getItem('session')!).usuario.id
            // let planta = new Plantas()
            let planta: Localidades = {} as Localidades;

            planta.idDocHistorico=this.docIdHistorico
            planta.usuarioHistorico=usuario
            planta.descargaHistorico=true
            planta.idDocConsolidado='null'
            planta.id=this.formCreacionMatriz.value.planta
            planta.fechaHistoricoStart=new Date(this.fechaHistoricoStart!)
            planta.fechaHistorico=new Date(this.fechaHistorico!)
            // await this.plantasService.update(planta)
            await this.empresaService.putLocalidad(planta)

            // this.matrizPeligrosLogService.descargarExcelHistorico()
            this.viewmatrizPeligrosLogService.descargarExcelHistorico()
            this.messageService.add({key: 'mnsgMatrizPeligros', severity:'success', summary: 'Archivo descargado', detail: 'Se ha descargado correctamente el archivo'});

          }
        )}
      }
      // test(){
      // console.log(this.matrizPList)}

      test(e:any){
        console.log('aquí')
        console.log(e)
        console.log(this.matrizPList)
      }
}

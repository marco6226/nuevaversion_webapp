import { Component,OnInit } from '@angular/core';
import { MatrizPeligrosService } from '../../../core/services/matriz-peligros.service';
import { MatrizPeligros } from '../../../comun/entities/Matriz-peligros';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
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

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-lista-matriz-peligros',
  templateUrl: './lista-matriz-peligros.component.html',
  styleUrls: ['./lista-matriz-peligros.component.scss']
})
export class ListaMatrizPeligrosComponent  implements OnInit {
  
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

  visibleDlgExcelHistorico:boolean=false
  rangeDatesExcelHistorico: any;
  flagExcelHistorico:boolean=false

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
    private matrizPeligrosService: MatrizPeligrosService,
    private plantasService: PlantasService,
    private areaService: AreaService,
    private areaMatrizService: AreaMatrizService,
    private paramNav: ParametroNavegacionService,
    private matrizPeligrosLogService: MatrizPeligrosLogService,
    private router: Router,
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
      { field: 'NRCualitativo', header: 'Nivel de riesgo Inicial(Cualitativo)' },
      { field: 'NRCualitativoR', header: 'Nivel de riesgo Residual(Cualitativo)' },
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
      resp.data.forEach((element:any) => {
        this.planta.push({label:element.nombre,value:element.id})
      });
      
    })
  }

  async cargarArea(eve:any) {
    let filterArea = new FilterQuery();
    filterArea.sortField = "id";
    filterArea.sortOrder = -1;
    filterArea.fieldList= ['id','nombre']
    filterArea.filterList = [{ field: 'plantas.id', criteria: Criteria.EQUALS, value1: eve}];
    await this.areaMatrizService.findByFilter(filterArea).then((resp:any)=>{
      this.area=[]
      this.areaMatrizItemList=[]
      resp.data.forEach((element:any) => {
        this.areaMatrizItemList?.push({ label: element.nombre, value: {id:element.id,nombre:element.nombre}})
        // this.area.push({label:element.nombre,value:{id:element.id,nombre:element.nombre}})
      });
    })
  }
  lastFecha:Date | any;
  async cargarRegistrosMatriz(){
    this.flagtreeTable=false
    let filterMatriz = new FilterQuery();
    filterMatriz.sortField = "id";
    filterMatriz.sortOrder = -1;
    this.matrizPList=[]
    this.matrizPListT=[]
    for (const ele of this.formCreacionMatriz.value.area) {
      filterMatriz.filterList = [{ field: 'area.id', criteria: Criteria.EQUALS, value1: ele.id}];
      let matrizPList:MatrizPeligros[]=[];
      let matrizPList2:any[]=[];
      await this.matrizPeligrosService.getmpRWithFilter(filterMatriz).then((resp:any)=>{
        matrizPList = (<MatrizPeligros[]>resp.data).map(matriz => matriz);
        matrizPList.map(resp=>resp.fechaCreacion=resp.fechaCreacion?new Date(resp.fechaCreacion!):null)
        matrizPList.map(resp=>resp.controlesexistentes=JSON.parse(resp.controlesexistentes!))
        matrizPList.map(resp=>resp.generalInf=JSON.parse(resp.generalInf!))
        matrizPList.map(resp=>resp.peligro=JSON.parse(resp.peligro!))
        matrizPList.map(resp=>resp.planAccion=JSON.parse(resp.planAccion!))
        // matrizPList.map(resp=>resp.planAccion=(JSON.parse(resp.planAccion!).length>0)?'Con plan de Acción':'Sin plan de acción')
        matrizPList.map(resp=>resp.valoracionRiesgoInicial=JSON.parse(resp.valoracionRiesgoInicial!))
        matrizPList.map(resp=>resp.valoracionRiesgoResidual=JSON.parse(resp.valoracionRiesgoResidual!))
        matrizPList.map(resp=>resp.id=(resp.fkmatrizpeligros)?resp.id+'-'+resp.fkmatrizpeligros:resp.id)
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

          // for(let element of matrizPList){
        
          matrizPList.forEach((element:any) => {

            element.planAccion
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
              estadoPlanAccion:(element?.planAccion>0)?'Con plan de Acción':'Sin plan de acción',
              estado:(element?.planAccion>0)?'Con plan de Acción':'Sin plan de acción'
            })
          })

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
    console.log(this.matrizPList)
    let cont=0
    this.lastFecha=null
    this.matrizPList.forEach((ele:any) => {
      if(cont==0){
        if(ele.fechaCreacion)this.lastFecha=new Date(ele.fechaCreacion)
      }else{
        if(ele.fechaCreacion){
          if(ele.fechaCreacion>this.matrizPList[cont-1])this.lastFecha=new Date(ele.fechaCreacion)
        }
      }
      cont ++;
    });
      

  }

  CRUDMatriz(CRUD:string,tipo:string){

    switch (CRUD) {
      case 'PUT':
        this.paramNav.setParametro<FormGroup>(this.formCreacionMatriz);
        this.paramNav.setAccion<string>('PUT');
        this.router.navigate(['/app/ipr/matrizPeligros'])
      break;
      case 'POST':
        if(tipo=='ALONE'){
          this.paramNav.setParametro<MatrizPeligros[]>([this.matrizSelect])
        }else{
          this.paramNav.setParametro<MatrizPeligros[]>(this.matricesSelect)
        }
        this.paramNav.setAccion<string>('POST');
        this.paramNav.setParametro2<FormGroup>(this.formCreacionMatriz);

        this.router.navigate(['/app/ipr/matrizPeligros'])
      break;
      case 'GET':
          if(tipo=='ALONE'){
            this.paramNav.setParametro<MatrizPeligros[]>([this.matrizSelect])
          }else{
            this.paramNav.setParametro<MatrizPeligros[]>(this.matricesSelect)
          }
          this.paramNav.setAccion<string>('GET');
          this.paramNav.setParametro2<FormGroup>(this.formCreacionMatriz);
  
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
    let filterHistorico = new FilterQuery();
    filterHistorico.sortField = "id";
    filterHistorico.sortOrder = -1;
    filterHistorico.filterList = [{ field: 'idriesgo', criteria: Criteria.EQUALS, value1: this.matrizSelect?.id!.toString()}];
    let matrizPList:any[]=[];
    await this.matrizPeligrosLogService.getmpRWithFilter(filterHistorico).then((resp:any)=>{
      // this.matrizPList3 = (<MatrizPeligrosLog[]>resp.data).map(matriz => matriz);
      matrizPList = (<MatrizPeligrosLog[]>resp.data).map(matriz => matriz);
      matrizPList.map(resp=>resp.fechaCreacion=resp.fechaCreacion?new Date(resp.fechaCreacion!):null)
      matrizPList.map(resp=>resp.fechaEdicion=resp.fechaEdicion?new Date(resp.fechaEdicion!):null)
      matrizPList.map(resp=>resp.controlesexistentes=JSON.parse(resp.controlesexistentes!))
      matrizPList.map(resp=>resp.generalInf=JSON.parse(resp.generalInf!))
      matrizPList.map(resp=>resp.peligro=JSON.parse(resp.peligro!))
      matrizPList.map(resp=>resp.planAccion=JSON.parse(resp.planAccion!))
      matrizPList.map(resp=>resp.valoracionRiesgoInicial=JSON.parse(resp.valoracionRiesgoInicial!))
      matrizPList.map(resp=>resp.valoracionRiesgoResidual=JSON.parse(resp.valoracionRiesgoResidual!))

      this.matrizPList3=[...matrizPList]
      this.historicoList=[]

      for(const [i,ele] of matrizPList.entries()){
        if(i==0){this.historicoList.push(ele)
        }else{
          if(ele.valoracionRiesgoInicial?.NRCualitativo != matrizPList[i-1].valoracionRiesgoInicial?.NRCualitativo || ele.valoracionRiesgoResidual?.NRCualitativo != matrizPList[i-1].valoracionRiesgoResidual?.NRCualitativo)this.historicoList.push(ele)
        }        
      }
      this.activeTab=1
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

  async exportexcelHistoricoPrueba(): Promise<void> {

    const filaDestino = 5; // Por ejemplo, fila 2
    const columnaDestino = 3; // Por ejemplo, columna C

    await this.datosExcel()

    const readyToExport = this.excel;

    const destinoFilePath = '../../../../../../assets/excelbase/HistoricoExcel-corona.xlsx';
    const workBook = XLSX.readFile(destinoFilePath);
    const workSheet = XLSX.utils.json_to_sheet(readyToExport);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'Excel historicos'); // add the worksheet to the book
 
    XLSX.writeFile(workBook, 'Excel historicos.xlsx'); // initiate a file download in browser
     
    this.cerrarDlgExcelHistorico();

  }

  async exportexcelHistorico(): Promise<void> 
    {
        await this.datosExcel()

        const readyToExport = this.excel;
 
       const workBook = XLSX.utils.book_new(); // create a new blank book
 
       const workSheet = XLSX.utils.json_to_sheet(readyToExport);
 
       XLSX.utils.book_append_sheet(workBook, workSheet, 'Excel historicos'); // add the worksheet to the book
 
       XLSX.writeFile(workBook, 'Excel historicos.xlsx'); // initiate a file download in browser
        
       this.cerrarDlgExcelHistorico();
    }

    cerrarDlgExcelHistorico(){
      this.visibleDlgExcelHistorico = false;
    }

    excel:any=[]
    async datosExcel(): Promise<void>{
      // let dataExcel:any

      // let filterQuery = new FilterQuery();
      // filterQuery.sortField = "id";
      // filterQuery.sortOrder = 1;

      // filterQuery.filterList = [
      //   {criteria: Criteria.EQUALS, field: "idriesgo", value1: empresaId}
      // ];    
      // try {
      //     let res: any = await this.matrizPeligrosLogService.getmpRWithFilter(filterQuery)
      //     dataExcel = res.data;

      // } catch (error) {
      //     console.error(error)
      // }

      this.excel=[...this.matrizPList3]
      console.log(this.excel)
      // this.excel.map((resp1:any)=>{return resp1.fechaCreacion=new Date(resp1.fechaCreacion)})
  }
}

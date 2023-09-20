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
      { field: 'NRCualitativo', header: 'Nivel de riesgo (Cualitativo)' },
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
        matrizPList2=new Array(matrizPList)
        for(const [i,v] of matrizPList.entries()){
          let valor:any=v
          matrizPList2[0][i].estadoPlanAccion=(valor.planAccion.length>0)?'Con plan de Acción':'Sin plan de acción'
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

          // for(let element of matrizPList){
          matrizPList.forEach((element:any) => {
            matrizPList2.push({
              id:element.id,
              fechaCreacion:element.fechaCreacion,
              area:element?.area?.nombre,
              proceso:element?.proceso?.nombre,
              subProceso:element?.subProceso?.nombre,
              peligro:element?.peligro?.Peligro?.nombre,
              descripcionPeligro:element?.peligro?.DescripcionPeligro?.nombre,
              NRCualitativo:element?.valoracionRiesgoInicial?.NRCualitativo,
              planAccion:element?.planAccion,
              estadoPlanAccion:(element?.planAccion>0)?'Con plan de Acción':'Sin plan de acción'
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
  async historicoCargar(){
    let filterHistorico = new FilterQuery();
    filterHistorico.sortField = "id";
    filterHistorico.sortOrder = -1;
    filterHistorico.filterList = [{ field: 'idriesgo', criteria: Criteria.EQUALS, value1: this.matrizSelect?.id!.toString()}];
    let matrizPList:MatrizPeligrosLog[]=[];
    await this.matrizPeligrosLogService.getmpRWithFilter(filterHistorico).then((resp:any)=>{
      matrizPList = (<MatrizPeligrosLog[]>resp.data).map(matriz => matriz);
      matrizPList.map(resp=>resp.fechaCreacion=resp.fechaCreacion?new Date(resp.fechaCreacion!):null)
      matrizPList.map(resp=>resp.controlesexistentes=JSON.parse(resp.controlesexistentes!))
      matrizPList.map(resp=>resp.generalInf=JSON.parse(resp.generalInf!))
      matrizPList.map(resp=>resp.peligro=JSON.parse(resp.peligro!))
      matrizPList.map(resp=>resp.planAccion=JSON.parse(resp.planAccion!))
      matrizPList.map(resp=>resp.valoracionRiesgoInicial=JSON.parse(resp.valoracionRiesgoInicial!))
      console.log(matrizPList)
      this.historicoList=[]
      for(const [i,ele] of matrizPList.entries()){
        if(i>0){
          const diferencias = this.encontrarDiferencias(matrizPList[i-1], ele);
          console.log("Diferencias"+i, diferencias);
          // console.log("Diferencias en array2:", diferencias[1]);
        }else{
          let objeto1 = new MatrizPeligrosLog()
          objeto1.id=undefined
          objeto1.idriesgo=undefined
          objeto1.accion=undefined
          objeto1.generalInf=undefined
          objeto1.peligro=undefined
          objeto1.controlesexistentes=undefined
          objeto1.valoracionRiesgoInicial=undefined
          objeto1.planAccion=undefined
          objeto1.area=undefined
          objeto1.proceso=undefined
          objeto1.subProceso=undefined
          objeto1.plantas=undefined
          objeto1.empresa=undefined
          objeto1.fechaCreacion=undefined
          objeto1.fechaEdicion=undefined
          objeto1.eliminado=undefined
          objeto1.idEdicion=undefined
          objeto1.usuario=undefined
          const diferencias = this.encontrarDiferencias(objeto1, ele);
          console.log("Diferencias"+i, diferencias);
        }
      }
    })
  }
  encontrarDiferencias(objeto1:any, objeto2:any) {
    const clavesObjeto1 = Object.keys(objeto1);
    const clavesObjeto2 = Object.keys(objeto2);
  
    const diferencias:any = {};

    for (const clave of clavesObjeto1) {
      if (!clavesObjeto2.includes(clave)) {
       
      } else if (objeto1[clave] !== objeto2[clave]) {

        if(typeof objeto1[clave] =='object' ){
          const clavesObjeto3 = Object.keys(objeto1[clave]);
     
          for (const clave2 of clavesObjeto3){
            if (objeto1[clave][clave2] !== objeto2[clave][clave2]) {
              diferencias[clave2] = objeto2[clave][clave2]
            }
          }
        }else{
          diferencias[clave] = objeto2[clave];
        }
      }
    }
  
    return diferencias;
  }
}

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

@Component({
  selector: 'app-lista-matriz-peligros',
  templateUrl: './lista-matriz-peligros.component.html',
  styleUrls: ['./lista-matriz-peligros.component.scss']
})
export class ListaMatrizPeligrosComponent  implements OnInit {
  matrizPList: MatrizPeligros[] = [];
  matrizSelect!: MatrizPeligros;

  formCreacionMatriz!:FormGroup;

  listDivision:any=[]
  planta:SelectItem[] =[]
  area:SelectItem[] =[]
  areaMatrizItemList?: SelectItem[];

  constructor( 
    private fb: FormBuilder,
    private matrizPeligrosService: MatrizPeligrosService,
    private plantasService: PlantasService,
    private areaService: AreaService,
    private areaMatrizService: AreaMatrizService,
    private paramNav: ParametroNavegacionService,
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

  cargarDatos(){
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
    

    let filterMatriz = new FilterQuery();
    filterMatriz.sortField = "id";
    filterMatriz.sortOrder = -1;
    this.matrizPList=[]
    this.formCreacionMatriz.value.area.forEach(async (ele:any) => {
      filterMatriz.filterList = [{ field: 'area.id', criteria: Criteria.EQUALS, value1: ele.id}];
    
      let matrizPList:MatrizPeligros[]=[];
      await this.matrizPeligrosService.getmpRWithFilter( filterMatriz).then((resp:any)=>{
        matrizPList = (<MatrizPeligros[]>resp.data).map(matriz => matriz);
        matrizPList.map(resp=>resp.fechaCreacion=resp.fechaCreacion?new Date(resp.fechaCreacion!):null)
        matrizPList.map(resp=>resp.controlesexistentes=JSON.parse(resp.controlesexistentes!))
        matrizPList.map(resp=>resp.generalInf=JSON.parse(resp.generalInf!))
        matrizPList.map(resp=>resp.peligro=JSON.parse(resp.peligro!))
        matrizPList.map(resp=>resp.planAccion=JSON.parse(resp.planAccion!))
        matrizPList.map(resp=>resp.valoracionRiesgoInicial=JSON.parse(resp.valoracionRiesgoInicial!))
      }).catch(er=>console.log(er))
      if(matrizPList.length>0)this.matrizPList=this.matrizPList.concat(matrizPList);
      console.log(matrizPList)
    });

    
  }

  CRUDMatriz(CRUD:string){

    switch (CRUD) {
      case 'PUT':
        this.paramNav.setParametro<FormGroup>(this.formCreacionMatriz);
        this.paramNav.setAccion<string>('PUT');
        this.router.navigate(['/app/ipr/matrizPeligros'])
      break;
        case 'POST':
          this.paramNav.setParametro<MatrizPeligros>(this.matrizSelect);
          this.paramNav.setAccion<string>('POST');
          this.router.navigate(['/app/ipr/matrizPeligros'])
        break;
      case 'DELETE':
        
        break;
    
      default:
        break;
    }

  }

  test(){
    console.log(this.formCreacionMatriz.value.area)
  }

}

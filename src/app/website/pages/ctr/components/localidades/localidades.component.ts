import { Localidades, _actividadesContratadasList, _divisionList } from './../../entities/aliados';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { SelectItem } from 'primeng/api';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { FilterQuery } from '../../../core/entities/filter-query';
import { AreaService } from '../../../empresa/services/area.service';
import { Criteria } from '../../../core/entities/filter';

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.scss'],
  providers: [EmpresaService]
})
export class LocalidadesComponent implements OnInit {

  visibleDlg: boolean =false;
  visibleDlgLocalidades: boolean =false;
  @Input('selectDivision') 
  set actividadesIn(actividades: string){
    if(actividades != null){
      this.selectActividad = JSON.parse(actividades)
      this.agregarActividad()
    }
  }
  @Input('selectLocalidad') 
  set localidadesIn(localidades: string){
    // this.loadLocalidades()
    if(localidades != null){
      this.selectLocalidades = JSON.parse(localidades)
      this.agregarLocalidad()
    }
  }
  @Output() data =new EventEmitter();
  @Output() dataLocalidad = new EventEmitter<string>();
  @Input() empresaId: any;
  divisionList= _divisionList;
  selectActividad: string[] = [];
  selectLocalidades: string[] = [];
  actividadesList: string[] = [];
  locadidadList: any[] = [];
  locadidadesList: string[] = [];
  edit: string | null = null;
  @Input() flagConsult: boolean=false;
  filtroLocalidades: string | null = null;
  selectAllLocalidades: SelectItem = {
    label: 'Seleccionar todo',
    value: {id: 0, localidad: '', empresa_id: 0} as Localidades
  }
  selectedAllLocalidades: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private empresaService: EmpresaService,
    private _areaService:AreaService
  ) { }

  ngOnInit(): void {
    this.edit = this.activatedRoute.snapshot.params['onEdit'];

    //this.loadDiv();
    this.getArea(this.empresaId.id);
    //this.loadLocalidades()
    this.loadingTemplateLocalities(this.empresaId.id)
  }
  
  agregarActividad(){
    this.actividadesList = this.selectActividad;
    this.cerrarDialogo();
    // this.data.emit(JSON.stringify(this.actividadesList));

  }

  abrirDialogo(param: string | null = null){
    if (param) {
      this.selectActividad = []
    }
    this.visibleDlg = true;
  }

  cerrarDialogo(){
    this.visibleDlg = false;
  }

  onAddLocalidad(){
    this.dataLocalidad.emit(JSON.stringify(this.locadidadesList))
    
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

  SortArray(x: any, y: any){
    if (x.LastName < y.LastName) {return -1;}
    if (x.LastName > y.LastName) {return 1;}
    return 0;
  }

  abrirDialogoLocalidades(param: string | null = null){
    if (param) {
      this.selectLocalidades = []
    }
    this.visibleDlgLocalidades = true;
  }

  agregarLocalidad(){
    this.locadidadesList = this.selectLocalidades;
    //this.onAddLocalidad()
    this.cerrarLocalidad()
    
  }

  cerrarLocalidad(){
    this.visibleDlgLocalidades = false;
  }

  filtrarLocalidad(localidad: any){
    if (this.filtroLocalidades === null || this.filtroLocalidades === '') {
      return true;
    } else {
      return  localidad.label.toLowerCase().includes(this.filtroLocalidades.toLowerCase());
    }
  }

  onSelectAllLocalidades(event: CheckboxChangeEvent){
    if(event.checked.length > 0){
      this.selectLocalidades = this.locadidadList.map((localidad) => {
        return localidad.label;
      });
    }else{
      this.selectLocalidades = [];
    }
  }

  onSelectLocalidad(event: CheckboxChangeEvent){
    if(event.checked.length === this.locadidadList.length) {
      this.selectedAllLocalidades = [this.selectAllLocalidades.value];
    } else {
      this.selectedAllLocalidades = [];
    }
  }

  async getArea(empresId:number) {
    let filterAreaQuery = new FilterQuery();
    filterAreaQuery.sortField = "id";
    filterAreaQuery.sortOrder = -1;
    filterAreaQuery.fieldList = ["id", "nombre"];
    if(empresId === 508){
      filterAreaQuery.filterList = [
        { field: 'nivel', criteria: Criteria.EQUALS, value1: '0' },
        { field: 'tipoArea.id', criteria: Criteria.EQUALS, value1: '88' }
      ];
    }else{
      filterAreaQuery.filterList = [
        { field: 'nivel', criteria: Criteria.EQUALS, value1: '0' },
        { field: 'tipoArea.id', criteria: Criteria.EQUALS, value1: '59' }
      ];
    }



    try{
      const resp: any =  await this._areaService.findByFilter(filterAreaQuery);
      const divisionList = resp.data.map((element:any)=>({ label: element.nombre, value: element.id}));
      this.listDivision = divisionList
    }catch (error) {  
      console.error("Error al cargar las divisiones:", error);
    }

  }

  listDivision: any = []

  async loadingTemplateLocalities(empresId:number) {
    let filterPlantaQuery = new FilterQuery();
    filterPlantaQuery.sortField = "id";
    filterPlantaQuery.sortOrder = -1;
    filterPlantaQuery.fieldList = ["id", "localidad"];
    filterPlantaQuery.filterList = [
      { field: 'empresa_id', criteria: Criteria.EQUALS, value1: empresId.toString() },
    ];
  
    try {
      const resp: any = await this.empresaService.getLocalidadesRWithFilter(filterPlantaQuery);
      const localidadesList = resp.data.map((element: any) => ({ label: element.localidad, value: element.id }));
  
      this.localidadesList = localidadesList;
      console.log("me trajo localidadesList: ",localidadesList);
    } catch (error) {
      console.error("Error al cargar las localidades:", error);
    }
  }

  localidadesList: any[] = [];
}

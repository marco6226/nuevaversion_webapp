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
  localidadesList: any[] = [];
  listDivision: string[] = []
  listDivisionN: any[] = []
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
    private areaService:AreaService
  ) { }

  ngOnInit(): void {
    this.edit = this.activatedRoute.snapshot.params['onEdit'];
    this.getArea(this.empresaId.id);
    this.loadingTemplateLocalities(this.empresaId.id, null)
  }
  
  async agregarActividad(){

    this.localidadesList=[];
    this.listDivisionN = [];

    await this.loadIdDivision(this.empresaId.id, this.selectActividad);
    this.loadingTemplateLocalities(this.empresaId.id, this.listDivisionN);

    this.actividadesList = this.selectActividad;
    this.cerrarDialogo();
    this.data.emit(JSON.stringify(this.actividadesList));

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
    this.dataLocalidad.emit(JSON.stringify(this.locadidadesList))
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
      this.selectLocalidades = this.localidadesList.map((localidad) => {
        return localidad.label;
      });
    }else{
      this.selectLocalidades = [];
    }
  }

  onSelectLocalidad(event: CheckboxChangeEvent){
    if(event.checked.length === this.locadidadesList.length) {
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
      const resp: any =  await this.areaService.findByFilter(filterAreaQuery);
      const divisionList = resp.data.map((element:any)=>({ label: element.nombre, value: element.id}));
      this.listDivision = divisionList
    }catch (error) {  
      console.error("Error al cargar las divisiones:", error);
    }

  }

  async loadIdDivision(empresId:number, Divisiones:string[] |null) {
    if (Divisiones && Divisiones.length > 0) {
      try {
        for (let divisionName of Divisiones) {
          let filterDivision = new FilterQuery();
          filterDivision.sortField = "id";
          filterDivision.sortOrder = -1;
          filterDivision.fieldList = ["id", "nombre"];
            if(empresId === 508){
              filterDivision.filterList = [
                { field: 'nivel', criteria: Criteria.EQUALS, value1: '0' },
                { field: 'tipoArea.id', criteria: Criteria.EQUALS, value1: '88' },
                { field: 'nombre', criteria: Criteria.EQUALS, value1: divisionName}
              ];
            }else{
              filterDivision.filterList = [
                { field: 'nivel', criteria: Criteria.EQUALS, value1: '0' },
                { field: 'tipoArea.id', criteria: Criteria.EQUALS, value1: '59' },
                { field: 'nombre', criteria: Criteria.EQUALS, value1: divisionName }
              ];
            }
            try {
              const res: any = await this.areaService.findByFilter(filterDivision);
              const areas: { id: string; nombre: string }[] = res['data']; 
              if (areas.length > 0) {
                const id = areas[0].id;
                this.listDivisionN = this.listDivisionN.concat(id);
              } 
          } catch (error) {
              console.error('Error al obtener las áreas:', error);
          }
        }
        this.listDivisionN = this.listDivisionN;
      } catch (error) {
        console.error("Error al cargar las areas:", error);
      }
    } else{
      this.listDivisionN = [];
    }
  }
  
  async loadingTemplateLocalities(empresId:number, idDivisiones:any[] |null) { 
    if (idDivisiones && idDivisiones.length > 0) {
      try {
        this.localidadesList = []
        for (let divisionId of idDivisiones) {
          let filterPlantaQuery = new FilterQuery();
          filterPlantaQuery.sortField = "id";
          filterPlantaQuery.sortOrder = -1;
          filterPlantaQuery.fieldList = ["id", "localidad"];
          filterPlantaQuery.filterList = [
            { field: 'empresa_id', criteria: Criteria.EQUALS, value1: empresId.toString() },
            { field: 'plantas.area.id', criteria: Criteria.EQUALS, value1: divisionId.toString() }
          ];
  
          const resp: any = await this.empresaService.getLocalidadesRWithFilter(filterPlantaQuery);
          const divisionesLocalidades = resp.data.map((element: any) => ({ label: element.localidad, value: element.id }));
          this.localidadesList = this.localidadesList.concat(divisionesLocalidades);
        }
  
        this.localidadesList = this.localidadesList.filter((value, index, self) =>
          index === self.findIndex((t) => t.value === value.value)
        );
      } catch (error) {
        console.error("Error al cargar las localidades:", error);
      }
    } else {
      this.localidadesList = []
    }
  }

}

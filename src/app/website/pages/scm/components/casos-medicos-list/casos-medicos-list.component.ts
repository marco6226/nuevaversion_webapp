import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { locale_es } from '../../../rai/entities/reporte-enumeraciones';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Criteria, Filter, SortOrder } from '../../../core/entities/filter';
import { CasosMedicosService } from '../../../core/services/casos-medicos.service';
import { Router } from '@angular/router';
import { CargoService } from '../../../empresa/services/cargo.service';
import { SesionService } from '../../../core/services/session.service';
import { ViewscmInformeService } from '../../../core/services/view-informescm.service';
import { Cargo } from '../../../empresa/entities/cargo';
import { ProcesoMatrizService } from '../../../core/services/proceso-matriz.service';
import { CargoActualService } from '../../../empresa/services/cargoActual.service';
import { Empresa } from '../../../empresa/entities/empresa';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { AreaMatrizService } from '../../../core/services/area-matriz.service';
import { AreaService } from '../../../empresa/services/area.service';
import { _divisionList } from '../../../ctr/entities/aliados';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-casos-medicos-list',
  templateUrl: './casos-medicos-list.component.html',
  styleUrls: ['./casos-medicos-list.component.scss'],
  providers: [CasosMedicosService, CargoService, SesionService, MessageService]
})
export class CasosMedicosListComponent implements OnInit {
  localeES: any = locale_es;
  loading: boolean = false;
  testing: boolean = false;
  caseSelect: any;
  casosList: any;
  saludLaboralSelect: any;
  totalRecords!: number;
  cargoList: SelectItem[] = [];
   mapData = new Map<any, String>();
  empresa: Empresa | null | undefined;
  flagSaludLaboralRegistro: boolean = false
  casosListFilter: any;
  cargoActualList!: SelectItem[];
  divisionActualList!: SelectItem[];
  idEmpresa!: string | null;
  fields: string[] = [
    'idSl',
    'usuarioCreador',
    'usuarioAsignado',
    'fechaCreacion',
    'fechaEdicion',
    'cargoOriginal',
    'cargoActual',
    'divisionOrigen',
    'divisionActual',
    'localidadOrigen',
    'localidadActual',
    'areaOrigen',
    'areaActual',
    'procesoOrigen',
    'procesoActual',
    'pkUser',
    'nombreCompletoSL',
    'documentos',
    'fechaRecepcionDocs',
    'fechaCierreCaso',
    'documentosEmpresa',
    'documentosMinisterio',
    'epsDictamen',
    'fechaDictamenArl',
    'arlDictamen',
    'documentosArl',
    'fechaDictamenJr',
    'jrDictamen',
    'documentosJr',
    'fechaDictamenJn',
      'documentosJn'
  ];
  consultar: boolean = false;
  async ngOnInit() {
    this.testing = true;
    this.getAreaById();
    this.getLocalidad();
    
    await this.getCargoActual();
    this.config.setTranslation(this.localeES);
    let cargofiltQuery = new FilterQuery();
    cargofiltQuery.sortOrder = SortOrder.ASC;
    cargofiltQuery.sortField = "nombre";
    cargofiltQuery.fieldList = ["id", "nombre"];
    this.cargoService.findByFilter(cargofiltQuery).then((resp: any) => {
      this.cargoList = [];
      this.cargoList.push({ label: '--Seleccione--', value: null });
      (<Cargo[]>resp['data']).forEach((cargo) => {
        this.cargoList.push({ label: cargo.nombre, value: cargo.id });

      });
    });
    this.idEmpresa = this.sesionService.getEmpresa()?.id!;
    setTimeout(() => {
      this.consultar = (localStorage.getItem('slShowCase') === 'true') ? true : false;
      console.log('LACONSULTA', this.consultar);
    }, 2000);
    

  }

  constructor(
    private scmService: CasosMedicosService,
    private cargoService: CargoService,
    private router: Router,
    private sesionService: SesionService,
    private messageService: MessageService,
    private viewscmInformeService: ViewscmInformeService,
    private config: PrimeNGConfig,
    private procesoMatrizService: ProcesoMatrizService,
    private route: Router,
    private cargoActualService: CargoActualService,
    private empresaService: EmpresaService,
    private areaMatrizService: AreaMatrizService,
    private areaService: AreaService,
  ) {


  }
  customFilter(event: any, field: string, dt: Table) {
    const value = event.target.value.toLowerCase();
    dt.filterGlobal(value, 'contains');
  }

  onFilter(event: any) {
    this.casosListFilter = event.filteredValue
  }
  filtrosExcel: any;
  async lazyLoad(event: any) {
    this.testing = false; 
    this.filtrosExcel = event;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;

    let filterEliminado = new Filter();
    filterEliminado.criteria = Criteria.EQUALS;
    //filterEliminado.field = 'eliminado';
    //filterEliminado.value1 = 'false';

    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    filterQuery.filterList.push(filterEliminado);

    try {
      let res: any = await this.scmService.findWithFilterSL(filterQuery);
      this.casosList = res?.data?.map((dto: any) => {
        return FilterQuery.dtoToObject(dto);
      });
      console.log("res",res);
      this.totalRecords = res.count;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  procesoList: any
  procesoListActual: any
  async cargarProceso(eve: any, tipo: string) {
    let filterProceso = new FilterQuery();
    filterProceso.fieldList = [
      'id',
      'nombre'
    ];
    filterProceso.filterList = [{ field: 'areaMatriz.id', criteria: Criteria.EQUALS, value1: eve },
    { field: 'eliminado', criteria: Criteria.EQUALS, value1: false }];
    let procesoList: any = []
    await this.procesoMatrizService.findByFilter().then(async (resp: any) => {
      resp.data.forEach((element: any) => {
        procesoList.push({ label: element.nombre, id: element.id })
      });
    })
    if (tipo == 'Origen') this.procesoList = [...procesoList]
    else this.procesoListActual = [...procesoList]
  }
  openCaseConsultar() {
    localStorage.setItem('scmShowCase', 'true');
    this.route.navigate(['/app/scm/saludlaboral/', this.caseSelect.idSl])
    localStorage.setItem('saludL', JSON.stringify(this.caseSelect));
  }


  openCase() {
    
    console.log('case select', this.caseSelect.idSl);
    localStorage.setItem('scmShowCase', 'false');
    this.flagSaludLaboralRegistro = true;
    localStorage.setItem('slShowCase', 'true');
    localStorage.setItem('saludL', JSON.stringify(this.caseSelect));
    this.route.navigate(['/app/scm/saludlaboral/', this.caseSelect.idSl])
    console.log(this.caseSelect);
    console.log('case select', this.caseSelect.idSl);


  }
  idToCargo(id: number) {
    if (!this.cargoActualList) {
      return null; // O algún valor por defecto
    }
  
    return this.cargoActualList.find(value => value.value === id)?.label || null;
  }
  
  async getCargoActual() {
    let cargoActualfiltQuery = new FilterQuery();
    cargoActualfiltQuery.sortOrder = SortOrder.ASC;
    cargoActualfiltQuery.sortField = "nombre";
    cargoActualfiltQuery.fieldList = ["id", "nombre"];
    cargoActualfiltQuery.filterList = [];
    cargoActualfiltQuery.filterList.push({ field: 'empresa.id', criteria: Criteria.EQUALS, value1: this.empresa?.id?.toString() });

    try {
      const resp: any = await this.cargoActualService.getcargoRWithFilter(cargoActualfiltQuery);
      this.cargoActualList = resp.data.map((ele: any) => {
        return { label: ele.nombre, value: ele.id };
      });
    } catch (error) {
      console.error("Error fetching cargos:", error);
    }
  }
  
  areaList: any[] = []
  areaListActual: any[] = []
  async cargarArea(eve: any, tipo: string) {
    console.log(eve);

    let filterArea = new FilterQuery();
    filterArea.sortField = "id";
    filterArea.sortOrder = -1;
    filterArea.fieldList = [
      'id',
      'nombre'
    ];
    filterArea.filterList = [
      { field: 'localidad.id', criteria: Criteria.EQUALS, value1: eve },
      { field: 'eliminado', criteria: Criteria.EQUALS, value1: false }
    ];

    let areaList: any = [];
    await this.areaMatrizService.findByFilter(filterArea).then(async (resp: any) => {
      resp.data.forEach((element: any) => {
        areaList.push({ 'name': element.nombre, 'id': element.id }); // Solo agregar el nombre del área
      });
    });

    if (tipo === 'Origen') {
      this.areaList = [...areaList];
      console.log(areaList)
    } else {
      this.areaListActual = [...areaList];
      console.log(this.areaListActual)
    }
  }
  localidadesList: any = [];
  localidadesListActual: any = [];
  async cargarPlantaLocalidad(eve: any, tipo: string) {
    this.mapData = new Map<any, String>();
    console.log("cargarPlantaLocalidad - Evento:", eve, "Tipo:", tipo);
    let filterPlantaQuery = new FilterQuery();
    filterPlantaQuery.sortField = "id";
    filterPlantaQuery.sortOrder = -1;
    filterPlantaQuery.fieldList = ["id", "localidad"];
    filterPlantaQuery.filterList = [
      { field: 'plantas.area.id', criteria: Criteria.EQUALS, value1: eve.toString() },
    ];

    await this.empresaService.getLocalidadesRWithFilter(filterPlantaQuery).then(async(resp: any) => {
      const localidadesList = resp.data.map((element: any) => ({ label: element.localidad, value: element.id }));
      this.mapData.set(localidadesList, this.caseSelect)
      console.log(this.mapData);
      
      if (tipo === 'Origen') {
        this.localidadesList = localidadesList;
      } else {
        this.localidadesListActual = localidadesList;
      }
    }).catch(error => {
      console.error("Error al cargar las localidades:", error);
    });
  }
  idToDivision(division: number): string {
    const foundDivision = this.divisionActual.find(value => value['id'] == division);
    return foundDivision ? foundDivision['nombre'] : 'No encontrado';
}

  
divisionActual: any[]=[]
  getAreaById(): void {
    this.areaService.findByIdSL().then(
      data => {
        let pivot:any=data;
        this.divisionActual = pivot;
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }

  localidadAct: any[]=[]
  getLocalidad(): void {
    this.empresaService.findByIdSLocalidad().then(
      data => {
        let pivot:any=data;
        this.localidadAct = pivot;
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }
  idToLocalidad(division: number): string {
    const foundLocalidad = this.localidadAct.find(value => value['id'] == division);
    return foundLocalidad ? foundLocalidad['localidad'] : 'No encontrado';
}



  


  
}

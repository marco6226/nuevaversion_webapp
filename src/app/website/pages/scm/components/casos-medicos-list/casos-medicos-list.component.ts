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
  isDivisionesLoading:boolean = true;
  isLocalidadesLoading:boolean = true;
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
      'documentosJn',
      'empresaId',
      'eliminado',
      'statusCaso'
  ];
  
  consultar: boolean = false;
  async ngOnInit() {
    this.testing = true;
    this.isDivisionesLoading = true;
    this.isLocalidadesLoading = true;
    this.getAreaById();
    this.getLocalidad();
    this.loadEstadoOptions();
    this.loadDivisonesOpt();
    this.localidadesOpts();
    
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
    private areasService: AreaService
  ) {


  }
  customFilter(event: any, field: string, dt: Table) {
    const value = event.target.value.toLowerCase();
    dt.filterGlobal(value, 'contains');
  }

  onFilter(event: any,) {
    this.casosListFilter = event.filteredValue
  }
  applyDivisionFilter(filterValue: string) {
    this.lazyLoad(null, filterValue);
  }
  applyLocalidadFilter(filterValue: string) {
    this.lazyLoad(null,null, filterValue);
  }
  applyCargoFilter(filterValue: string) {
    this.lazyLoad(null,null,null, filterValue);
}
 
  
  filtrosExcel: any;
  divisionNamesMap: { [id: string]: string } = {};
  localidadNamesMap: { [id: string]: string } = {};
  cargosNamesMap: { [id: string]: string } = {};

  async lazyLoad(event: any, divisionFilter?: any, localidadFilter?: any, cargoFilter?:any) {
    const idemp = JSON.parse(localStorage.getItem('session') || '{}');

    const emp = idemp.empresa.id;
    this.testing = false; 
    this.filtrosExcel = event;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event?.sortField;
    filterQuery.sortOrder = event?.sortOrder;
    filterQuery.offset = event?.first;
    filterQuery.rows = event?.rows;
    filterQuery.count = true;

    let filterEliminado = new Filter();
    filterEliminado.criteria = Criteria.EQUALS;
    filterEliminado.field = 'eliminado';
    filterEliminado.value1 = 'false';
    let filterEmp = new Filter();
    filterEmp.criteria = Criteria.EQUALS;
    filterEmp.field = 'empresaId';
    filterEmp.value1 = emp;
    

    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event?.filters);
    filterQuery.filterList.push(filterEliminado, filterEmp);

    try {
      let res: any = await this.scmService.findWithFilterSL(filterQuery);
      this.casosList = res?.data?.map((dto: any) => {
        return FilterQuery.dtoToObject(dto);
      });
      for (let item of this.casosList) {
        const divisionId = item.divisionActual;
        const localidadId = item.localidadActual;
        const cargoId = item.cargoActual


        if (divisionId && !this.divisionNamesMap[divisionId]) {
          const divisionName = await this.getDivision(divisionId);
          if (divisionName) {
              this.divisionNamesMap[divisionId] = divisionName;
            }
        }
        if (localidadId && !this.localidadNamesMap[localidadId]) {
          const localidadName = await this.getLocalidades(localidadId);
          console.log(localidadName);
          if (localidadName) {
              this.localidadNamesMap[localidadId] = localidadName;
            }
        }
        if (cargoId && !this.cargosNamesMap[cargoId]) {
          const cargoName = await this.getCargosActuales(cargoId); // Aquí pasamos cargoId
          if (cargoName) { // Solo si cargoName no es null
            this.cargosNamesMap[cargoId] = cargoName; // Usamos cargoId para el mapa
          }
        }
        
      
        
       
      }
      if (divisionFilter) {
        this.casosList = this.casosList.filter((item: { divisionActual: any; }) => {
            const divisionId = item.divisionActual;
            const divisionName = this.divisionNamesMap[divisionId];
            return divisionName ? divisionName.toLowerCase().includes(divisionFilter.toLowerCase()) : false;
        });
      }
      if (localidadFilter) {
        this.casosList = this.casosList.filter((item: { localidadActual: any; }) => {
            const localidadId = item.localidadActual;
            const localidadName = this.localidadNamesMap[localidadId];
            return localidadName ? localidadName.toLowerCase().includes(localidadFilter.toLowerCase()) : false;
        });
      }
      if (cargoFilter) {
        this.casosList = this.casosList.filter((item: { cargoActual: any; }) => {
            const cargoId = item.cargoActual;
            const cargoName = this.cargosNamesMap[cargoId];
            return cargoName ? cargoName.toLowerCase().includes(cargoFilter.toLowerCase()) : false;
        });
      }
      
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
    
    localStorage.setItem('scmShowCase', 'false');
    this.flagSaludLaboralRegistro = true;
    localStorage.setItem('slShowCase', 'true');
    localStorage.setItem('saludL', JSON.stringify(this.caseSelect));
    this.route.navigate(['/app/scm/saludlaboral/', this.caseSelect.idSl])



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
  async getCargosActuales(id: string): Promise<string | null> {
    let filterQuery = new FilterQuery();
    filterQuery.sortField = 'nombre';
    filterQuery.fieldList = ['id', 'nombre'];
    filterQuery.filterList = [
        { criteria: Criteria.EQUALS, field: 'id', value1: id }
    ];
  
    try {
      const res: any = await this.cargoActualService.getcargoRWithFilter(filterQuery);
      const cargos: { id: string; nombre: string }[] = res['data'];
      
      if (cargos.length > 0) {
        const nombre = cargos[0].nombre;
        return nombre;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los cargos:', error);
      return null;
    }
  }
  estadoOptions: { label: string, value: number | string }[] = [];
  async loadEstadoOptions() {
    try {
      let filterQuery = new FilterQuery();
      filterQuery.sortField = 'nombre'; // Ajustar según la necesidad
      filterQuery.fieldList = ['id', 'nombre']; // Ajustar según la estructura de los datos
      const res: any = await this.cargoActualService.getcargoRWithFilter(filterQuery);
      const cargos: { id: string; nombre: string }[] = res['data'];
      
      // Mapeamos los datos obtenidos para el p-dropdown
      this.estadoOptions = cargos.map(cargo => ({
        label: cargo.nombre,  // Ajustar según los datos
        value: cargo.id       // Ajustar según los datos
      }));
      
      // Agregar opción por defecto 'Seleccione'
      this.estadoOptions.unshift({ label: 'Seleccione', value: '' }); // O puedes usar 'none' o 0
    } catch (error) {
      console.error('Error al cargar opciones de estado:', error);
    }
  }

  divisionOpt: { label: string, value: number | string }[] = [];
  async loadDivisonesOpt() {  
    try {
      let filterQuery = new FilterQuery();
      filterQuery.sortField = 'nombre'; // Ajustar según la necesidad
      filterQuery.fieldList = ['id', 'nombre'];
      filterQuery.filterList = [
        { field: 'nivel', criteria: Criteria.EQUALS, value1: '0' },
      ];
       // Ajustar según la estructura de los datos
      const res: any = await this.areasService.findByFilter(filterQuery);
      const cargos: { id: string; nombre: string }[] = res['data'];
      
      // Mapeamos los datos obtenidos para el p-dropdown
      this.divisionOpt = cargos.map(cargo => ({
        label: cargo.nombre,  // Ajustar según los datos
        value: cargo.id       // Ajustar según los datos
      }));
      
      // Agregar opción por defecto 'Seleccione'
      this.divisionOpt.unshift({ label: 'Seleccione', value: '' }); 
     // O puedes usar 'none' o 0
    } catch (error) {
      console.error('Error al cargar opciones de estado:', error);
    }
  }
  
  async getDivision(id: string): Promise<string | null> {
    let filterQuery = new FilterQuery();
    filterQuery.sortField = 'nombre';
    filterQuery.fieldList = ['id', 'nombre'];
    filterQuery.filterList = [
        { criteria: Criteria.EQUALS, field: 'id', value1: id }
    ];
  
    try {
        const res: any = await this.areasService.findByFilter(filterQuery);
        const areas: { id: string; nombre: string }[] = res['data']; 
        if (areas.length > 0) {
            const nombre = areas[0].nombre;
            return nombre;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al obtener las áreas:', error);
        return null; 
    }
  }

  idToCargo(id: number) {
    return this.cargoActualList.find(value => {
      return value.value == id
    })?.label
  }
  
  areaList: any[] = []
  areaListActual: any[] = []
  async cargarArea(eve: any, tipo: string) {

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
    } else {
      this.areaListActual = [...areaList];
    }
  }
  localidadesList: any = [];
  localidadesListActual: any = [];
  async cargarPlantaLocalidad(eve: any, tipo: string) {
    this.mapData = new Map<any, String>();
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
deleteCasoSL(iddt: string | number, body: any): void {
  this.scmService.delelteCasoSL(iddt, body).then(
    response => {
      this.messageService.add({
        key: 'msgScm',
        severity: 'success',
        summary: 'Caso Retirado',
        detail: 'El caso ha sido eliminado.'
    });
    this.lazyLoad(event);
    },
    error => {
      console.error('Error al enviar datos:', error);
    }
  );
}

  
divisionActual: any[]=[]
  getAreaById(): void {
    this.areasService.findByIdSL().then(
      data => {
        let pivot:any=data;
        this.divisionActual = pivot;
        this.isDivisionesLoading = false
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
        this.isLocalidadesLoading = false;
      }, 
      error => {
        console.error('There was an error!', error);
      }
    );
  }
  async getLocalidades(id: string): Promise<string | null> {
    console.log(id);
    
    let filterQuery = new FilterQuery();
    filterQuery.sortField = 'localidad';
    filterQuery.fieldList = ['id', 'localidad'];
    filterQuery.filterList = [
        { criteria: Criteria.EQUALS, field: 'id', value1: id }
    ];
  
    try {
        const res: any = await this.empresaService.getLocalidadesRWithFilter(filterQuery);
        const localidad: { id: string; localidad: string }[] = res['data']; 
        if (localidad.length > 0) {
            const nombre = localidad[0].localidad;
            return nombre;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al obtener la localidad:', error);
        return null; 
    }
  }
  localidadesOpt: { label: string, value: number | string }[] = [];
  async localidadesOpts() {  
    try {
      let filterQuery = new FilterQuery();
      filterQuery.sortField = 'localidad';
    filterQuery.fieldList = ['id', 'localidad'];
       // Ajustar según la estructura de los datos
      const res: any = await this.empresaService.getLocalidadesRWithFilter(filterQuery);
      const cargos: { id: string; localidad: string }[] = res['data'];
      
      // Mapeamos los datos obtenidos para el p-dropdown
      this.localidadesOpt = cargos.map(cargo => ({
        label: cargo.localidad,  // Ajustar según los datos
        value: cargo.id       // Ajustar según los datos
      }));
      
      // Agregar opción por defecto 'Seleccione'
      this.localidadesOpt.unshift({ label: 'Seleccione', value: '' }); // O puedes usar 'none' o 0
    } catch (error) {
      console.error('Error al cargar opciones de estado:', error);
    }
  }
  idToLocalidad(division: number): string {
    const foundLocalidad = this.localidadAct.find(value => value['id'] == division);
    return foundLocalidad ? foundLocalidad['localidad'] : 'No encontrado';
}



  


  
}

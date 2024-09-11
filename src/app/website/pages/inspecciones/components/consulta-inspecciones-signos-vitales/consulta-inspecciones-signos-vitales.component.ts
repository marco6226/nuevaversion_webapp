import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { PerfilService } from '../../../admin/services/perfil.service';
import { Criteria } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';
import { SesionService } from '../../../core/services/session.service';
import { Inspeccion } from '../../entities/inspeccion';
import { ListaInspeccion } from '../../entities/lista-inspeccion';
import { InspeccionService } from '../../services/inspeccion.service';
import { ListaInspeccionService } from '../../services/lista-inspeccion.service';
import { ViewListaInspeccionService } from '../../services/viewlista-inspeccion.service';
import { ViewInspeccionService } from '../../services/view-inspeccion.service';
import { AreaService } from '../../../empresa/services/area.service';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { AreaMatrizService } from '../../../core/services/area-matriz.service';
import { ProcesoMatrizService } from '../../../core/services/proceso-matriz.service';
@Component({
  selector: 'app-consulta-inspecciones-signos-vitales',
  templateUrl: './consulta-inspecciones-signos-vitales.component.html',
  styleUrl: './consulta-inspecciones-signos-vitales.component.scss'
})
export class ConsultaInspeccionesSignosVitalesComponent implements OnInit {

  inspeccionesList!: any[];
  inspeccionSelect!: Inspeccion;
  totalRecords!: number;
  loading: boolean = false;
  testing!: boolean;
  fields: string[] = [
    'id',
    'programacion_fecha',
    'fechaRealizada',
    'usuarioRegistra_email',
    'programacion_listaInspeccion_nombre',
    'programacion_area',
    'programacion_localidadSv',
    'programacion_areaSv',
    'programacion_procesoSv',
    'fechaModificacion',
    'usuarioModifica_email',
    'listaInspeccion',
  ];
  areasPermiso!: string;
  userParray: any;
  listaInspeccion!: ListaInspeccion;
  inspeccionNoProgList!: any[];
  inspeccionNoProgSelect!: Inspeccion;
  totalRecordsNoProg!: number;
  loadingNoProg: boolean = false;
  fieldsNoProg: string[] = [
    'id',
    'fechaRealizada',
    'usuarioRegistra_email',
    'listaInspeccion_nombre',
    'area_id',
    'area_nombre',
    'fechaModificacion',
    'usuarioModifica_email',
    'listaInspeccion',
  ];

  divisionNamesMap: { [id: string]: string } = {};
  localidadNamesMap: { [id: string]: string } = {};
  areaNamesMap: { [id: string]: string } = {};
  procesoNamesMap: { [id: string]: string } = {};

  constructor(
    private paramNav: ParametroNavegacionService,
    private inspeccionService: InspeccionService,
    private sesionService: SesionService,
    private userService: PerfilService,
    private messageService: MessageService,
    private viewInspeccionService: ViewInspeccionService,
    private areasService: AreaService,
    private empresaService: EmpresaService,
    private areaMatrizService: AreaMatrizService,
    private procesoMatrizService: ProcesoMatrizService,
  ) { }

  ngOnInit(): void {
    this.testing = true;
    this.areasPermiso = this.sesionService.getPermisosMap()['INP_GET_INP'].areas;
    let areasPermiso = this.areasPermiso.replace('{', '');
    areasPermiso = areasPermiso.replace('}', '');
    let areasPermiso2 = areasPermiso.split(',')

    const filteredArea = areasPermiso2.filter(function (ele, pos) {
      return areasPermiso2.indexOf(ele) == pos;
    })
    this.areasPermiso = '{' + filteredArea.toString() + '}';
  }

  async lazyLoadNoProg(event: any) {
    let user: any = JSON.parse(localStorage.getItem('session')!);
    let filterQuery = new FilterQuery();

    filterQuery.filterList = [{
      field: 'usuarioEmpresaList.usuario.id',
      criteria: Criteria.EQUALS,
      value1: user.usuario.id,
      value2: null
    }];
    const userP = await this.userService.findByFilter(filterQuery);
    this.userParray = userP;
    this.loadingNoProg = true;

    filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;

    filterQuery.fieldList = this.fieldsNoProg;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    filterQuery.filterList.push({ criteria: Criteria.IS_NULL, field: 'programacion' });
    filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: 'area.id', value1: this.areasPermiso });

    filterQuery.filterList.push({criteria: Criteria.EQUALS, field: 'pkUsuarioId', value1: user.usuario.id.toString()});
    filterQuery.filterList.push({criteria: Criteria.EQUALS, field: 'empresa.id', value1: user.empresa.id.toString()});
    filterQuery.filterList.push({ criteria: Criteria.EQUALS, field: 'listaInspeccion.tipoLista', value1: 'Signos Vitales' });


    var x: any[] = [];

    this.userParray.data.forEach((element: any) => {
      x.push(element.id)
    });

    var y: string = "[" + x + "]";
    let z: string = "{" + x + "}"

    //    filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: 'listaInspeccion.fkPerfilId', value1: z });

    await this.viewInspeccionService.getFilterInspeccionToPerfilToUsuario(filterQuery).then((resp:any)=>{
      this.totalRecordsNoProg = resp['count'];

        this.inspeccionNoProgList = [];
        if((<any[]>resp['data']).length > 0)
        (<any[]>resp['data']).forEach(dto => {
          let obj = FilterQuery.dtoToObject(dto)
          obj['hash'] = obj.listaInspeccion.listaInspeccionPK.id + '.' + obj.listaInspeccion.listaInspeccionPK.version;
          this.inspeccionNoProgList.push(obj);
        });
  }).catch(er=>console.log(er))
  this.loadingNoProg = false;

    // this.inspeccionService.findByFilter(filterQuery).then(
    //   (resp: any) => {
    //     this.totalRecordsNoProg = resp['count'];

    //     this.loadingNoProg = false;
    //     this.inspeccionNoProgList = [];
    //     (<any[]>resp['data']).forEach(dto => {
    //       let obj = FilterQuery.dtoToObject(dto)
    //       obj['hash'] = obj.listaInspeccion.listaInspeccionPK.id + '.' + obj.listaInspeccion.listaInspeccionPK.version;
    //       try {
    //         for (const profile of this.userParray.data) {

    //           let perfilArray = JSON.parse(obj.listaInspeccion.fkPerfilId)

    //           perfilArray.forEach((perfil: any) => {
    //             if (perfil === profile.id) {
    //               if (!this.inspeccionNoProgList.find(element => element == obj)) {
    //                 this.inspeccionNoProgList.push(obj);
    //               }
    //             }
    //           });
    //         }

    //       } catch (error) {

    //       }
    //     });
    //   }
    // );
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
  
  async getLocalidad(id: string): Promise<string | null> {
    
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
  
  async getArea(id: string): Promise<string | null>{
      
    let filterArea = new FilterQuery();
    filterArea.sortField = 'nombre';
    filterArea.fieldList = [
      'id',
      'nombre'
    ];
    filterArea.filterList = [
      { field: 'id', criteria: Criteria.EQUALS, value1: id }
    ];
  
    try {
      const res: any = await this.areaMatrizService.findByFilter(filterArea);
      const areaList: { id: string; nombre: string }[] = res['data']; 
      if (areaList.length > 0) {
          const nombre = areaList[0].nombre;
          return nombre;
      } else {
          return null;
      }
    } catch (error) {
      console.error('Error al obtener el área:', error);
      return null; 
    }
  }
  
  async getProceso(id:string): Promise<string | null> {
  
    let filterProceso = new FilterQuery();
    filterProceso.sortField = "nombre";
    filterProceso.fieldList = ['id', 'nombre'];
    filterProceso.filterList = [{ field: 'id', criteria: Criteria.EQUALS, value1: id }];
  
    try{
      const res: any = await this.procesoMatrizService.findByFilter(filterProceso);
      const procesoList: {id:string; nombre:string}[] = res['data'];
  
      if(procesoList.length > 0){
        const nombre = procesoList[0].nombre
        return nombre
      }else{
        return null
      }
    }catch(error){
      console.log('Error al cargar el proceso', error);
      return null
    }
  }

  async lazyLoad(event: LazyLoadEvent | null, divisionFilter?: any, localidadFilter?: any, areaFilter?:any, procesoFilter?:any) {
    let user: any = JSON.parse(localStorage.getItem('session')!);
    let filterQueryu = new FilterQuery();
    filterQueryu.filterList = [{
      field: 'usuarioEmpresaList.usuario.id',
      criteria: Criteria.EQUALS,
      value1: user.usuario.id,
      value2: null
    }];
    const userP = await this.userService.findByFilter(filterQueryu);
    this.userParray = userP;
  
    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event?.sortField;
    filterQuery.sortOrder = event?.sortOrder;
    filterQuery.offset = event?.first;
    filterQuery.rows = event?.rows;
    filterQuery.count = true;
    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event?.filters);
    filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "programacion.area.id", value1: this.areasPermiso });
    
    // Agrega los filtros adicionales
    filterQuery.filterList.push({ criteria: Criteria.EQUALS, field: 'pkUsuarioId', value1: user.usuario.id.toString() });
    filterQuery.filterList.push({ criteria: Criteria.EQUALS, field: 'empresa.id', value1: user.empresa.id.toString() });
  
    // Filtrar por tipoLista dentro de listaInspeccion
    filterQuery.filterList.push({ criteria: Criteria.EQUALS, field: 'listaInspeccion.tipoLista', value1: 'Signos Vitales' });
  
    await this.viewInspeccionService.getFilterInspeccionToPerfilToUsuario(filterQuery).then(async (resp: any) => {
      this.totalRecords = resp['count'];
      this.loading = false;
      this.inspeccionesList = [];

      if ((<any[]>resp['data']).length > 0) {
        (<any[]>resp['data']).forEach(dto => {
          let obj = FilterQuery.dtoToObject(dto);
          obj['hash'] = obj.listaInspeccion.listaInspeccionPK.id + '.' + obj.listaInspeccion.listaInspeccionPK.version;
          this.inspeccionesList.push(obj);
        });
      }

      for (let item of this.inspeccionesList) {
        const divisionId = item.listaInspeccion.divisionSv;
        const localidadId = item.listaInspeccion.localidadSv;
        const areaId = item.listaInspeccion.areaSv;
        const procesoId = item.listaInspeccion.procesoSv;

        if (divisionId && !this.divisionNamesMap[divisionId]) {
          const divisionName = await this.getDivision(divisionId);
          if (divisionName) {
              this.divisionNamesMap[divisionId] = divisionName;
            }
        }

        if (localidadId && !this.localidadNamesMap[localidadId]) {
          const localidadName = await this.getLocalidad(localidadId);
          if (localidadName) {
              this.localidadNamesMap[localidadId] = localidadName;
            }
        }

        if (areaId && !this.areaNamesMap[areaId]) {
          const areaName = await this.getArea(areaId);
          if (areaName) {
              this.areaNamesMap[areaId] = areaName;
            }
        }

        if (procesoId && !this.procesoNamesMap[procesoId]) {
          const procesoName = await this.getProceso(procesoId);
          if (procesoName) {
              this.procesoNamesMap[procesoId] = procesoName;
            }
        }

        if (divisionFilter) {
          this.inspeccionesList = this.inspeccionesList.filter(item => {
              const divisionId = item.listaInspeccion.divisionSv;
              const divisionName = this.divisionNamesMap[divisionId];
              return divisionName ? divisionName.toLowerCase().includes(divisionFilter.toLowerCase()) : false;
          });
        }


        if (localidadFilter) {
          this.inspeccionesList = this.inspeccionesList.filter(item => {
              const localidadId = item.listaInspeccion.localidadSv;
              const localidadName = this.localidadNamesMap[localidadId];
              return localidadName ? localidadName.toLowerCase().includes(localidadFilter.toLowerCase()) : false;
          });
        }

        if (areaFilter) {
          this.inspeccionesList = this.inspeccionesList.filter(item => {
              const areaId = item.listaInspeccion.areaSv;
              const areaName = this.areaNamesMap[areaId];
              return areaName ? areaName.toLowerCase().includes(areaFilter.toLowerCase()) : false;
          });
        }

        if (procesoFilter) {
          this.inspeccionesList = this.inspeccionesList.filter(item => {
              const procesoId = item.listaInspeccion.procesoSv;
              const procesoName = this.procesoNamesMap[procesoId];
              return procesoName ? procesoName.toLowerCase().includes(procesoFilter.toLowerCase()) : false;
          });
        }
      }
    }).catch(er => console.log(er)).finally(() => {
      this.loading = false;
      this.testing = false;
    });
  }

  applyDivisionFilter(filterValue: string) {
    this.lazyLoad(null, filterValue);
  }

  applyLocalidadFilter(filterValue: string) {
    this.lazyLoad(null,null, filterValue);
  }

  applyAreaFilter(filterValue: string) {
    this.lazyLoad(null,null, null,filterValue);
  }

  applyProcesoFilter(filterValue: string) {
    this.lazyLoad(null,null, null, null, filterValue);
  }
  



  redirect(consultar: boolean) {
    if (this.inspeccionSelect == null) {
      this.messageService.add({ severity: 'warn', detail: 'Debe seleccionar una inspección para ' + (consultar ? 'consultar' : 'modificarla') });
    } else {
      this.paramNav.setAccion<string>(+ consultar ? 'GET' : 'PUT');
      this.paramNav.setParametro<Inspeccion>(this.inspeccionSelect);
      this.paramNav.redirect('/app/signos/elaboracionInspeccionesSv');
    }
  }

  redirectNoProg(consultar: boolean) {
    if (this.inspeccionNoProgSelect == null) {
      this.messageService.add({ severity: 'warn', detail: 'Debe seleccionar una inspección para ' + (consultar ? 'consultar' : 'modificarla') });
    } else {
      this.paramNav.setAccion<string>(+ consultar ? 'GET' : 'PUT');
      this.paramNav.setParametro<Inspeccion>(this.inspeccionNoProgSelect);
      this.paramNav.redirect('/app/signos/elaboracionInspeccionesSv');
    }
  }

  navegar() {
    this.paramNav.redirect('/app/inspecciones/programacion');
  }


}

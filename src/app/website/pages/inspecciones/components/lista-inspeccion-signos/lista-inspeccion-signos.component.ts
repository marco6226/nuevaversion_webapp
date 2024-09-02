import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnotationTypes } from '@syncfusion/ej2/drawings';
import { ConfirmationService } from 'primeng/api';
import { PerfilService } from '../../../admin/services/perfil.service';
import { Criteria } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';
import { ListaInspeccion } from '../../entities/lista-inspeccion';
import { InspeccionService } from '../../services/inspeccion.service';
import { ListaInspeccionService } from '../../services/lista-inspeccion.service';
import { locale_es, tipo_identificacion, tipo_vinculacion } from 'src/app/website/pages/rai/entities/reporte-enumeraciones';
import { PrimeNGConfig } from 'primeng/api';
import { ViewListaInspeccionService } from '../../services/viewlista-inspeccion.service';
import * as xlsx from 'xlsx';
import { AreaService } from '../../../empresa/services/area.service';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { AreaMatrizService } from '../../../core/services/area-matriz.service';
import { ProcesoMatrizService } from '../../../core/services/proceso-matriz.service';

@Component({
  selector: 'app-lista-inspeccion-signos',
  templateUrl: './lista-inspeccion-signos.component.html',
  styleUrl: './lista-inspeccion-signos.component.scss'
})
export class ListaInspeccionSignosComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;
  localeES: any = locale_es;
  listaInspeccionList!: ListaInspeccion[];
  listaInpSelect!: ListaInspeccion;
  loading!: boolean;
  totalRecords!: number;
  fields: string[] = [
    'listaInspeccionPK_id',
    'listaInspeccionPK_version',
    'codigo',
    'nombre',
    'tipoLista',
    'descripcion',
    'divisionSv',
    'localidadSv',
    'areaSv',
    'procesoSv',
    'estado',
    'fkPerfilId'
  ];
  
  visibleDlg!: boolean;
  desde!: Date;
  hasta!: Date;
  downloading!: boolean;
  divisionNamesMap: { [id: string]: string } = {};
  localidadNamesMap: { [id: string]: string } = {};
  areaNamesMap: { [id: string]: string } = {};
  procesoNamesMap: { [id: string]: string } = {};

  constructor(
    private listaInspeccionService: ListaInspeccionService,
    private viewListaInspeccionService: ViewListaInspeccionService,
    private userService: PerfilService,
    private paramNav: ParametroNavegacionService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private inspeccionService: InspeccionService,
    private config: PrimeNGConfig,
    private areasService: AreaService,
    private empresaService: EmpresaService,
    private areaMatrizService: AreaMatrizService,
    private procesoMatrizService: ProcesoMatrizService,
  ) { }

  ngOnInit(): void{
    this.config.setTranslation(this.localeES);
    this.loading = true;
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

  async lazyLoad(event?: any, divisionFilter?: any, localidadFilter?: any, areaFilter?:any, procesoFilter?:any) {
    let user:any = JSON.parse(localStorage.getItem('session')!);
    let filterQuery = new FilterQuery();

    filterQuery.filterList = [{
      field: 'usuarioEmpresaList.usuario.id',
      criteria: Criteria.EQUALS,
      value1: user.usuario.id,
      value2: null
    }];
    const userP = await this.userService.findByFilter(filterQuery);
    let userParray:any = userP;    

    this.loading = true;

    filterQuery.sortField = event?.sortField;
    filterQuery.sortOrder = event?.sortOrder;
    filterQuery.offset = event?.first;
    filterQuery.rows = event?.rows;
    
    filterQuery.count = true;
    filterQuery.fieldList = this.fields;
    
    filterQuery.filterList = FilterQuery.filtersToArray(event?.filters);
    filterQuery.filterList.push({criteria: Criteria.NOT_EQUALS, field: 'tipoLista', value1: 'Ciclo corto'});

    // await this.listaInspeccionService.findByFilter(filterQuery).then(
    //   (resp: any) => {
    //     console.log(resp)
    //     this.totalRecords = resp['count'];
    //     this.loading = false;
    //     this.listaInspeccionList = [];
    //     (<any[]>resp['data']).forEach(dto => {
    //       let obj = FilterQuery.dtoToObject(dto)
    //       obj['hash'] = obj.listaInspeccionPK.id + '.' + obj.listaInspeccionPK.version;
    //        for (const profile of userParray.data) {

    //         let perfilArray = JSON.parse(obj.fkPerfilId)

    //         if(perfilArray)
    //         perfilArray.forEach((perfil: any) => {
    //           if (perfil===profile.id) {
    //             if(!this.listaInspeccionList.find(element=>element==obj)){
    //               this.listaInspeccionList.push(obj);
    //             }              
    //         }
    //         });
    //       }
    //     });
    //   }
    // );

    filterQuery.filterList.push({criteria: Criteria.EQUALS, field: 'pkUsuarioId', value1: user.usuario.id.toString()});
    filterQuery.filterList.push({criteria: Criteria.EQUALS, field: 'empresa.id', value1: user.empresa.id.toString()});
    filterQuery.filterList.push({criteria: Criteria.EQUALS, field: 'tipoLista', value1: 'Signos Vitales'});
    await this.viewListaInspeccionService.getFilterListInspeccionToPerfilToUsuario(filterQuery).then(async (resp:any)=>{
        this.totalRecords = resp['count'];
        this.loading = false;
        this.listaInspeccionList = [];
  
        if((<any[]>resp['data']).length > 0)
          (<any[]>resp['data']).forEach(dto => {
            let obj = FilterQuery.dtoToObject(dto)
            obj['hash'] = obj.listaInspeccionPK.id + '.' + obj.listaInspeccionPK.version;
            this.listaInspeccionList.push(obj);       
          });

        for (let item of this.listaInspeccionList) {
          const divisionId = item.divisionSv;
          const localidadId = item.localidadSv;
          const areaId = item.areaSv;
          const procesoId = item.procesoSv;

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
            this.listaInspeccionList = this.listaInspeccionList.filter(item => {
                const divisionId = item.divisionSv;
                const divisionName = this.divisionNamesMap[divisionId];
                return divisionName ? divisionName.toLowerCase().includes(divisionFilter.toLowerCase()) : false;
            });
          }


          if (localidadFilter) {
            this.listaInspeccionList = this.listaInspeccionList.filter(item => {
                const localidadId = item.localidadSv;
                const localidadName = this.localidadNamesMap[localidadId];
                return localidadName ? localidadName.toLowerCase().includes(localidadFilter.toLowerCase()) : false;
            });
          }

          if (areaFilter) {
            this.listaInspeccionList = this.listaInspeccionList.filter(item => {
                const areaId = item.areaSv;
                const areaName = this.areaNamesMap[areaId];
                return areaName ? areaName.toLowerCase().includes(areaFilter.toLowerCase()) : false;
            });
          }

          if (procesoFilter) {
            this.listaInspeccionList = this.listaInspeccionList.filter(item => {
                const procesoId = item.procesoSv;
                const procesoName = this.procesoNamesMap[procesoId];
                return procesoName ? procesoName.toLowerCase().includes(procesoFilter.toLowerCase()) : false;
            });
          }
        }
    }).catch(er=>console.log(er))
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


  modificar() {
    this.paramNav.setParametro<ListaInspeccion>(this.listaInpSelect);
    this.paramNav.setAccion<string>('PUT');
    this.router.navigate(
      ['/app/signos/elaboracionListaSv']
    );
  }


  consultar() {
    this.paramNav.setParametro<ListaInspeccion>(this.listaInpSelect);
    this.paramNav.setAccion<string>('GET');
    this.router.navigate(
      ['/app/signos/elaboracionListaSv']
    );
  }

  eliminar() {
    this.confirmationService.confirm({
      header: 'Confirmar acción',
      message: 'La lista de inspección ' + this.listaInpSelect.nombre + ' será eliminada, no podrá deshacer esta acción, ¿Desea continuar?',
      accept: () =>
        this.listaInspeccionService.eliminarLista(this.listaInpSelect.listaInspeccionPK)
        .then((res: any) => {
          // this.lazyLoad({} as any);
          const url = this.router.url; 
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`/${url}`]);
          });
        }).catch((err: any) => {
          console.log('Error al aliminar lista de inspección', err);
        })
    });
  }

  navegar() {
    this.paramNav.redirect('/app/inspecciones/elaboracionLista');
  }

  abrirDlg() {
    this.visibleDlg = true;
  }
  descargarInspecciones() {
    this.downloading = true;
    this.inspeccionService.consultarConsolidado(this.desde, this.hasta, this.listaInpSelect.listaInspeccionPK.id, this.listaInpSelect.listaInspeccionPK.version)
      .then(resp => {
        if (resp instanceof Blob) {
          var reader = new FileReader();
          reader.onload = () => {
            var csvString = reader.result as string;
            
            
            var xlsxBlob = this.convertCsvToXlsx(csvString);
            var url = URL.createObjectURL(xlsxBlob);
            var dwldLink = document.createElement("a");
            dwldLink.setAttribute("href", url);
            dwldLink.setAttribute("download", "Consolidado inspecciones_" + new Date().getTime() + ".xlsx");
            dwldLink.click();
            URL.revokeObjectURL(url);
            this.downloading = false;
          };
          reader.readAsText(resp);
        } else {
          console.error("La respuesta no es un Blob");
          this.downloading = false;
        }
      })
      .catch(err => {
        console.error(err);
        this.downloading = false;
      });
  }


  convertCsvToXlsx(csvString: string): Blob {
    // Parse CSV string to workbook
    var workbook = xlsx.read(csvString, { type: 'string' });
  
    // Write workbook to XLSX buffer
    var xlsxBuffer = xlsx.write(workbook, { type: 'array', bookType: 'xlsx' });
  
    // Crear Blob a partir del buffer XLSX
    var blob = new Blob([new Uint8Array(xlsxBuffer)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8' });
  
    return blob;
  }
  
  
  
}

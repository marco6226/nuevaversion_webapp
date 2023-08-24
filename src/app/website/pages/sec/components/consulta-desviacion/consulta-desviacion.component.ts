import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DesviacionService } from 'src/app/website/pages/core/services/desviacion.service';
import { Desviacion } from 'src/app/website/pages/comun/entities/desviacion';
import { Message } from 'primeng/api';
import { ParametroNavegacionService } from 'src/app/website/pages/core/services/parametro-navegacion.service';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { Criteria } from 'src/app/website/pages/core/entities/filter';
import * as XLSX from 'xlsx'; 
import { locale_es, tipo_identificacion, tipo_vinculacion } from 'src/app/website/pages/rai/entities/reporte-enumeraciones';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-consulta-desviacion',
  templateUrl: './consulta-desviacion.component.html',
  styleUrls: ['./consulta-desviacion.component.scss']
})
export class ConsultaDesviacionComponent implements OnInit {
  localeES: any = locale_es;
  desviacionesList?: Desviacion[];
  desviacionesListOnFilter?: Desviacion[];
  desviacionesListSelect?: Desviacion[];
  opcionesModulos = [
    { label: '', value: null }, 
    { label: 'Inspecciones', value: 'Inspecciones' },
    { label: 'Observaciones', value: 'Observaciones' },
    { label: 'Reporte A/I', value: 'Reporte A/I' },
  ];

  empresaCriticidadPermiso: number=11;
  empresaId?: number;
  opcionesCritididad=[
    { label: '', value: null},
    { label: 'Bajo', value: 'Bajo'},
    { label: 'Medio', value: 'Medio'},
    { label: 'Alto', value: 'Alto'},
  ]
  fileName= 'ListaDesviaciones.xlsx';

  loading: boolean = true;
  totalRecords?: number;
  fields: string[] = [
    'modulo',
    'hashId',
    'area_nombre',
    'concepto',
    'fechaReporte',
    'aspectoCausante',
    'analisisId',
    'criticidad',
    'nombre'
  ];
  areasPermiso?: string;
  getDatosDesv?: Desviacion[];

  visibleDlg?: boolean;
  desde?: Date;
  hasta?: Date;
  downloading?: boolean;
  constructor(
    private sesionService: SesionService,
    private desviacionService: DesviacionService,
    private paramNav: ParametroNavegacionService,
    private router: Router,
    private config: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.config.setTranslation(this.localeES);
    this.areasPermiso = this.sesionService.getPermisosMap()['SEC_GET_DESV'].areas;
    let areasPermiso =this.areasPermiso?.replace('{','');
    areasPermiso =areasPermiso?.replace('}','');
    let areasPermiso2=areasPermiso?.split(',')

    const filteredArea = areasPermiso2?.filter(function(ele , pos){
      return areasPermiso2?.indexOf(ele) == pos;
    }) 
    this.areasPermiso='{'+filteredArea?.toString()+'}';
  }

  async exportexcel(event: any): Promise<void> 
  {
     /* table id is passed over here */
     let element = document.getElementById('excel-table'); 
     element?.getElementsByClassName
     
    // let datos = await this.cargarDatosExcel(event);
    this.loading = false;
     const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.desviacionesListOnFilter!);

    //  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');

     /* save to file */
     XLSX.writeFile(wb, this.fileName);
    
  }

  cargarDatosExcel(event : any){
    let getDatosDesv: Desviacion[];

    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;   
    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "area.id", value1: this.areasPermiso });
    this.desviacionService.findByFilter(filterQuery).then(
      (resp : any) => {
        getDatosDesv = resp['data'];
      }
    )

    return getDatosDesv!;
  }

  async lazyLoad(event: any) {
    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    // filterQuery.rows = event.rows;
    filterQuery.count = true;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "area.id", value1: this.areasPermiso });
    filterQuery.filterList.push({ criteria: Criteria.IS_NULL, field: "emptemporal" });

    await this.desviacionService.findByFilter(filterQuery).then(
      (resp:any) => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.desviacionesList = resp['data'];
        if(this.desviacionesList)
        this.empresaId = this.desviacionesList[0].empresaId
      }
    ).catch(err => this.loading = false);

    let filterQuery2 = new FilterQuery();
    filterQuery2.sortField = event.sortField;
    filterQuery2.sortOrder = event.sortOrder;
    filterQuery2.offset = event.first;
    filterQuery2.count = true;
    filterQuery2.filterList = FilterQuery.filtersToArray(event.filters);
    filterQuery2.filterList.push({ criteria: Criteria.CONTAINS, field: "area.id", value1: this.areasPermiso });

    await this.desviacionService.findByFilter(filterQuery2).then(
      (resp:any) => {
        
        this.getDatosDesv = resp['data'];
      }
    ).catch(err => this.loading = false);
  }

  consultarAnalisis(desviacion: Desviacion) {
    this.paramNav.setParametro<Desviacion>(desviacion);
    this.paramNav.setAccion<string>('GET');

    localStorage.setItem('Desviacion', JSON.stringify(desviacion));
    localStorage.setItem('Accion', 'GET');
    window.open('/app/sec/analisisDesviacion')
    // this.router.navigate(
    //   ['/app/sec/analisisDesviacion']
    // );
  }

  modificarAnalisis(desviacion: Desviacion) {
    this.paramNav.setParametro<Desviacion>(desviacion);
    this.paramNav.setAccion<string>('PUT');
    
    localStorage.setItem('Desviacion', JSON.stringify(desviacion));
    localStorage.setItem('Accion', 'PUT');
    window.open('/app/sec/analisisDesviacion')
    // this.router.navigate(
    //   ['/app/sec/analisisDesviacion']
    // );
  }

  descargarInvs() {
    this.downloading = true;
    this.desviacionService.consultarConsolidado(this.desde!, this.hasta!)
      .then((resp: any) => {
        if (resp != null) {
          var blob = new Blob([<any>resp], { type: 'text/csv;charset=utf-8;' });
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink!.setAttribute("href", url);
          dwldLink!.setAttribute("download", "Consolidado investigaciones_" + new Date().getTime() + ".csv");
          dwldLink!.click();
          this.downloading = false;
        }
      })
      .catch((err:any) => {
        this.downloading = false;
      });
  }

  analizarDesviacion() {
    this.paramNav.setParametro<Desviacion[]>(this.desviacionesListSelect!);
    this.paramNav.setAccion<string>('POST');
    localStorage.setItem('Desviacion', JSON.stringify(this.desviacionesListSelect));
    localStorage.setItem('Accion', 'POST');
    this.router.navigate(
      ['/app/sec/analisisDesviacion']
    );
  }

  onFilter(event:any){
    this.desviacionesListOnFilter=event.filteredValue
}
}

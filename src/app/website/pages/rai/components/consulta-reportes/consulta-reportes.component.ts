import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';

import { Reporte } from 'src/app/website/pages/comun/entities/reporte'
import { ReporteService } from 'src/app/website/pages/core/services/reporte.service'
import { ParametroNavegacionService } from 'src/app/website/pages/core/services/parametro-navegacion.service';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query'
import { ConsuModReporteService } from 'src/app/website/pages/core/services/consu-mod-reporte.service'

import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { Criteria } from "src/app/website/pages/core/entities/filter";
import { Table } from 'primeng/table';

@Component({
  selector: 'app-consulta-reportes',
  templateUrl: './consulta-reportes.component.html',
  styleUrls: ['./consulta-reportes.component.scss']
})
export class ConsultaReportesComponent implements OnInit, AfterViewInit {

  @ViewChild('dt', { static: false }) table!: Table;
  idEmpresa?: string | null;
  reporteSelect?: Reporte;
  reportesList?: Reporte[];
  loading: boolean=true;
  testing!: boolean;
  totalRecords?: number;
  tableScroll!:any;
  isScrollRigth: boolean = true;
  isScrollLeft: boolean = false;

  fields: string[] = [
    
    'fechaReporte',
    'fechaAccidente',
    'id',
    'primerNombreEmpleado',
    'primerApellidoEmpleado',
    'numeroIdentificacionEmpleado',
    'tipo',
    'numerofurat',
    'temporal',
    'areaAccidente'
  ];
  sortedTable?:string;
  RegistratR:boolean=false;

  constructor(
    private reporteService: ReporteService,
    private paramNav: ParametroNavegacionService,
    private ConsuModReporteService: ConsuModReporteService,
    private sesionService: SesionService,
  ) { }

  async ngOnInit() {
    this.testing = true;
    this.idEmpresa = await this.sesionService.getEmpresa()?.id;
    this.sortedTable=(this.idEmpresa=='22')?"fechaAccidente":"fechaReporte";
  }

  ngAfterViewInit() {
    this.tableWrapper();
    this.addScrollEventListener();
  }

  private tableWrapper() {
    this.tableScroll = this.table.el.nativeElement.querySelector(".p-datatable-wrapper");
  }

  private addScrollEventListener() {
    if (this.tableScroll) {
      this.tableScroll.addEventListener('scroll', this.onManualScroll.bind(this));
    }
  }

  private onManualScroll() {

    if(this.tableScroll.scrollLeft === 0){
      this.isScrollLeft = false;
      this.isScrollRigth = true;
    }else{
      this.isScrollLeft = true;
      this.isScrollRigth = false;
    }

  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const buttons = document.querySelector('.floating-buttons-scroll') as HTMLElement;
    if (buttons) {
      buttons.style.top = `${scrollTop + 50}px`;
    }
  }

  lazyLoad(event: any) {
    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true; 
    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    filterQuery.filterList.push({ criteria: Criteria.IS_NULL, field: "temporal" });
    this.reporteService.findByFilter(filterQuery).then(
      (resp: any) => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.testing = false;
        this.reportesList = [];
        (<any[]>resp['data']).forEach(dto => {
          this.reportesList?.push(FilterQuery.dtoToObject(dto));
        });
      }
    );
  }
  consultarDetalle() {
    this.paramNav.setAccion<string>('GET');
    this.paramNav.setParametro<Reporte>(this.reporteSelect!);
    this.paramNav.redirect('app/rai/registroReporte');
    this.RegistratR=true;
    this.ConsuModReporteService.setflagR(true);
  }
  modificar() {
    this.paramNav.setAccion<string>('PUT');
    this.paramNav.setParametro<Reporte>(this.reporteSelect!);
    this.paramNav.redirect('app/rai/registroReporte');
    this.ConsuModReporteService.setflagR(true);
  }
  navegar() {
    this.paramNav.redirect('app/rai/registroReporte');
  }
  scrollLeft() {
    if (this.tableScroll) {
      this.tableScroll.scrollLeft -= 10000;
      this.isScrollLeft = false;
      this.isScrollRigth = true;
      this.tableScroll.removeEventListener('scroll', this.onManualScroll.bind(this));
      setTimeout(() => {
        this.tableScroll.addEventListener('scroll', this.onManualScroll.bind(this));
      }, 50);
    }
  }
  
  scrollRight() {
    if (this.tableScroll) {
      this.tableScroll.scrollLeft += 10000;
      this.isScrollRigth = false;
      this.isScrollLeft = true;
      this.tableScroll.removeEventListener('scroll', this.onManualScroll.bind(this));
      setTimeout(() => {
        this.tableScroll.addEventListener('scroll', this.onManualScroll.bind(this));
      }, 50);
    }
  }
}

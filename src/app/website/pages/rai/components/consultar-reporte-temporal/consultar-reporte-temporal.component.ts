import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Reporte } from '../../../comun/entities/reporte';
import { Criteria } from "../../../core/entities/filter";
import { FilterQuery } from '../../../core/entities/filter-query';
import { ConsuModReporteService } from '../../../core/services/consu-mod-reporte.service';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';
import { ReporteService } from '../../../core/services/reporte.service';
import { SesionService } from '../../../core/services/session.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-consultar-reporte-temporal',
  templateUrl: './consultar-reporte-temporal.component.html',
  styleUrls: ['./consultar-reporte-temporal.component.scss']
})
export class ConsultarReporteTemporalComponent implements OnInit, AfterViewInit {

  @ViewChild('dt', { static: false }) table!: Table;

  idEmpresa: string | null = this.sesionService.getEmpresa()?.id!;
  reporteSelect!: Reporte;
  reportesList!: Reporte[];
  loading: boolean=true;
  totalRecords!: number;
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
    'empresa',
    'areaAccidente',
    'istemporal'
  ];
  sortedTable:string="fechaAccidente";
  constructor(
    private reporteService: ReporteService,
    private paramNav: ParametroNavegacionService,
    private ConsuModReporteService: ConsuModReporteService,
    private sesionService: SesionService,
  ) { }

  async ngOnInit() {
    // this.idEmpresa = await this.sesionService.getEmpresa().id;
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
      buttons.style.top = `${scrollTop + 60}px`;
    }
  }

  lazyLoad(event: any) {
    console.log(event)
    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true; 
    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    filterQuery.filterList.push({ criteria: Criteria.IS_NOT_NULL, field: "temporal"});
    filterQuery.filterList.push({ criteria: Criteria.EQUALS, field: 'istemporal', value1: 'true'});

    if(this.idEmpresa=='22' || this.idEmpresa == '508'){

    this.reporteService.getRepWithFilter(filterQuery).then((resp: any) => {
      console.log(resp)
      this.totalRecords = resp['count'];
      this.loading = false;
      this.reportesList = [];
      (<any[]>resp['data']).forEach(dto => {
        this.reportesList.push(FilterQuery.dtoToObject(dto));
      });
    }).catch(er=>console.log(er))
  }


    if(this.idEmpresa!='22' && this.idEmpresa !='508')
    this.reporteService.findByFilter(filterQuery).then(
      (resp: any) => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.reportesList = [];
        (<any[]>resp['data']).forEach(dto => {
          this.reportesList.push(FilterQuery.dtoToObject(dto));
        });
      }
    );
  }
  RegistratR:boolean=false;
  consultarDetalle() {
    this.paramNav.setAccion<string>('GET');
    this.paramNav.setParametro<Reporte>(this.reporteSelect);
    this.paramNav.redirect('app/rai/registroReporteTemporal');
    this.RegistratR=true;
    this.ConsuModReporteService.setflagR(true);
  }

  modificar() {
    this.paramNav.setAccion<string>('PUT');
    this.paramNav.setParametro<Reporte>(this.reporteSelect);
    this.paramNav.redirect('app/rai/registroReporteTemporal');
    this.ConsuModReporteService.setflagR(true);
  }

  navegar() {
    this.paramNav.redirect('app/rai/registroReporteTemporal');
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

import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DesviacionAliados } from '../../../comun/entities/desviacion-aliados';
import { Incapacidad } from '../../../comun/entities/factor-causal';
import { Criteria } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { DesviacionAliadosService } from '../../../core/services/desviacion-aliados.service';
import { SesionService } from '../../../core/services/session.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-consulta-reportes-aliado',
  templateUrl: './consulta-reportes-aliado.component.html',
  styleUrls: ['./consulta-reportes-aliado.component.scss'],
  providers: [DesviacionAliadosService]
})
export class ConsultaReportesAliadoComponent implements OnInit,AfterViewInit {

  @ViewChild('dt', { static: false }) table!: Table;

  idEmpresa: string | null = (this.sesionService.getEmpresa()?.id) ?? null;
  reporteSelect: ReporteAux | null = null;
  reportesList: ReporteAux[] = [];
  desviacionAliados: DesviacionAliados[] = [];
  loading: boolean = true;
  totalRecords: number | null = null;
  sortedTable: string = 'id';
  areasPermiso: string | null = null;
  reporte_analisis_desviacion: {hashId: string, analisisId: number, empresaId: number}[] = [];
  tableScroll!:any;
  isScrollRigth: boolean = true;
  isScrollLeft: boolean = false;

  constructor(
    private sesionService: SesionService,
    private router: Router,
    private desviacionAliadosService: DesviacionAliadosService
  ) { }

  ngOnInit() {
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

  lazyLoad(event: any){

    if(this.idEmpresa=='22'){
      this.loading = true;
      let filterQuery = new FilterQuery();
      filterQuery.sortField = event.sortField;
      filterQuery.sortOrder = event.sortOrder;
      filterQuery.offset = event.first;
      filterQuery.rows = event.rows;
      filterQuery.count = true;
      filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
      filterQuery.filterList = filterQuery.filterList.concat([
        {criteria: Criteria.EQUALS, field: 'empresaId', value1: this.idEmpresa}
      ]);
      this.desviacionAliadosService.getRepWithFilter(filterQuery).then((res: any) =>{
        this.totalRecords = res['count'];
        this.desviacionAliados = res['data'];
        this.loadDesviaciones();
        this.loading = false;
      }).finally(() => this.loading = false);
    }else if(this.idEmpresa!='22'){
      this.loading = true;
      let filterQuery = new FilterQuery();
      filterQuery.sortField = event.sortField;
      filterQuery.sortOrder = event.sortOrder;
      filterQuery.offset = event.first;
      filterQuery.rows = event.rows;
      filterQuery.count = true;
      filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
      filterQuery.filterList = filterQuery.filterList.concat([
        { criteria: Criteria.EQUALS, field: 'aliadoId', value1: this.idEmpresa}
      ]);
      this.desviacionAliadosService.getRepWithFilter(filterQuery).then((res: any) => {
        this.totalRecords = res['count'];
        this.desviacionAliados = res['data'];
        this.loadDesviaciones();
        this.loading = false;
      }).finally(() => this.loading = false);
    }
  }

  loadDesviaciones(){
    this.reportesList = <ReporteAux[]>this.desviacionAliados.map(item => {
      let gestor: string = item.gestor !== null ? JSON.parse(item.gestor).primerNombre + ' ' + JSON.parse(item.gestor).primerApellido : '';
      let planAccion: number = item.planAccion !== null ? JSON.parse(item.planAccion).porcentajeAvance ?? 0 : 0;
      let seguimiento: string = item.seguimiento !== null ? JSON.parse(item.seguimiento).estado : 'Sin gestión';
      let incapacidades: number | string = item.incapacidades !== null ? this.getDiasPerdidos(JSON.parse(item.incapacidades)) : 'Sin registros';
      return {
        id: item.id,
        razonSocial: item.razonSocial,
        idEmpleado: item.idEmpleado,
        fechaAt: item.fechaReporte,
        division: item.area.padreNombre,
        ubicacion: item.area.nombre,
        localidad: item.localidad?.localidad,
        seguimiento: seguimiento,
        totalDiasPerdidos: incapacidades,
        gestor: gestor,
        porcentajeAvance: planAccion
      }
    })
  }

  getDiasPerdidos(incapacidades: Incapacidad[]): number{
    return incapacidades.reduce((count, incapacidad) => {
      return count + (incapacidad.diasAusencia ?? 0);
    }, 0);
  }

  editarReporte(){
    this.router.navigate(['/app/rai/actualizarReporteCtr/'+this.reporteSelect?.id]);
  }

  consultarReporte(){
    sessionStorage.setItem('reporteCtr', 'true');
    this.router.navigate(['/app/rai/consultarReporteCtr/'+this.reporteSelect?.id]);
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

class ReporteAux {
  id!: number;
  razonSocial!: string;
  idEmpleado!: string;
  fechaAt!: Date;
  division!: string;
  ubicacion!: string;
  localidad!: string;
  seguimiento!: string;
  totalDiasPerdidos!: number;
  gestor!: string;
  porcentajeAvance!: number;
}

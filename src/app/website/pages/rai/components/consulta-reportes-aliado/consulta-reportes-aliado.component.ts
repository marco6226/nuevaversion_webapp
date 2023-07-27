import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DesviacionAliados } from '../../../comun/entities/desviacion-aliados';
import { Incapacidad } from '../../../comun/entities/factor-causal';
import { Criteria } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { DesviacionAliadosService } from '../../../core/services/desviacion-aliados.service';
import { SesionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-consulta-reportes-aliado',
  templateUrl: './consulta-reportes-aliado.component.html',
  styleUrls: ['./consulta-reportes-aliado.component.scss'],
  providers: [DesviacionAliadosService]
})
export class ConsultaReportesAliadoComponent implements OnInit {

  idEmpresa: string | null = (this.sesionService.getEmpresa()?.id) ?? null;
  reporteSelect: ReporteAux | null = null;
  reportesList: ReporteAux[] = [];
  desviacionAliados: DesviacionAliados[] = [];
  loading: boolean = true;
  totalRecords: number | null = null;
  sortedTable: string = 'id';
  areasPermiso: string | null = null;
  reporte_analisis_desviacion: {hashId: string, analisisId: number, empresaId: number}[] = [];

  constructor(
    private sesionService: SesionService,
    private router: Router,
    private desviacionAliadosService: DesviacionAliadosService
  ) { }

  ngOnInit() {
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
      let gestor = JSON.parse(item.gestor);
      let planAccion = JSON.parse(item.planAccion);
      return {
        id: item.id,
        razonSocial: item.razonSocial,
        idEmpleado: item.idEmpleado,
        fechaAt: item.fechaReporte,
        division: item.area.padreNombre,
        ubicacion: item.area.nombre,
        seguimiento: item.seguimiento ? (JSON.parse(item.seguimiento)) ? (JSON.parse(item.seguimiento)).estado : 'Sin gestión' : 'Sin gestión',
        totalDiasPerdidos: this.getDiasPerdidos(JSON.parse(item.incapacidades)),
        gestor: (gestor ? gestor.primerNombre : '') + ' ' + (gestor ? gestor.primerApellido : ''),
        porcentajeAvance: planAccion ? planAccion.porcentajeAvance : 0
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

}

class ReporteAux {
  id!: number;
  razonSocial!: string;
  idEmpleado!: string;
  fechaAt!: Date;
  division!: string;
  ubicacion!: string;
  seguimiento!: string;
  totalDiasPerdidos!: number;
  gestor!: string;
  porcentajeAvance!: number;
}

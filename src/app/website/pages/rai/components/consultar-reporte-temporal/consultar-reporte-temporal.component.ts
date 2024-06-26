import { Component, OnInit } from '@angular/core';
import { Reporte } from '../../../comun/entities/reporte';
import { Criteria } from "../../../core/entities/filter";
import { FilterQuery } from '../../../core/entities/filter-query';
import { ConsuModReporteService } from '../../../core/services/consu-mod-reporte.service';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';
import { ReporteService } from '../../../core/services/reporte.service';
import { SesionService } from '../../../core/services/session.service';
@Component({
  selector: 'app-consultar-reporte-temporal',
  templateUrl: './consultar-reporte-temporal.component.html',
  styleUrls: ['./consultar-reporte-temporal.component.scss']
})
export class ConsultarReporteTemporalComponent implements OnInit {


  idEmpresa: string | null = this.sesionService.getEmpresa()?.id!;
  reporteSelect!: Reporte;
  reportesList!: Reporte[];
  loading: boolean=true;
  totalRecords!: number;
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

    if(this.idEmpresa=='22'){

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


    if(this.idEmpresa!='22')
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

}

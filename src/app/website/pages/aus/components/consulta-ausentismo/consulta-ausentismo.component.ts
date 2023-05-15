
import { Component, OnInit } from '@angular/core';
import { ReporteAusentismo } from 'src/app/website/pages/aus/entities/reporte-ausentismo'
import { ReporteAusentismoService } from 'src/app/website/pages/core/services/reporte-ausentismo.service'
import { ParametroNavegacionService } from 'src/app/website/pages/core/services/parametro-navegacion.service';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query'

@Component({
  selector: 'app-consulta-ausentismo',
  templateUrl: './consulta-ausentismo.component.html',
  styleUrls: ['./consulta-ausentismo.component.scss'],
  providers: [ReporteAusentismoService]
})
export class ConsultaAusentismoComponent implements OnInit {
  reporteAusentismoList?: ReporteAusentismo[];
  reporteAusentismo?: ReporteAusentismo;
  loading?: boolean;
  totalRecords?: number;
  fields: string[] = [
    'id',
    'fechaElaboracion',
    'empleado',
    'causaAusentismo_nombre',
    'fechaDesde',
    'fechaHasta',
    'diasAusencia'
  ];

  constructor(
    private reporteAusentismoService: ReporteAusentismoService,
    private paramNavService: ParametroNavegacionService,
  ) { }

  ngOnInit() {
    this.loading = true;
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

    this.reporteAusentismoService.findByFilter(filterQuery).then(
      (resp:any) => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.reporteAusentismoList = [];
        (<any[]>resp['data']).forEach(dto => {
          this.reporteAusentismoList!.push(FilterQuery.dtoToObject(dto));
        });
      }
    );
  }

  redireccionar(isUpdate: boolean) {
    this.paramNavService.setAccion<string>(isUpdate ? 'PUT' : 'GET');
    this.paramNavService.setParametro<ReporteAusentismo>(this.reporteAusentismo!);
    this.paramNavService.redirect('app/aus/reporteAusentismo');
  }

  navegar() {
    this.paramNavService.redirect('app/aus/reporteAusentismo');
  }

}

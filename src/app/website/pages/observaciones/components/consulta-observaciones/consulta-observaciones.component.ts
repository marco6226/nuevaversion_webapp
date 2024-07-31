import { Component, OnInit } from '@angular/core';

import { Observacion } from 'src/app/website/pages/observaciones/entities/observacion'
import { ObservacionService } from 'src/app/website/pages/core/services/observacion.service';
import { SesionService } from 'src/app/website/pages/core/services/session.service'
import { ParametroNavegacionService } from 'src/app/website/pages/core/services/parametro-navegacion.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Area } from 'src/app/website/pages/empresa/entities/area';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { Filter, Criteria } from 'src/app/website/pages/core/entities/filter';

@Component({
  selector: 'app-consulta-observaciones',
  templateUrl: './consulta-observaciones.component.html',
  styleUrls: ['./consulta-observaciones.component.scss']
})
export class ConsultaObservacionesComponent implements OnInit {

  observacionesList?: Observacion[];
  observacionSelect?: Observacion;
  loading?: boolean;
  testing!: boolean;
  totalRecords?: number;
  idEmpresa?: string | null;
  observacion?: Observacion;
  area?: Area;
  fields: string[] = [
    'id',
    'fechaObservacion',
    'tipoObservacion',
    'descripcion',
    'nivelRiesgo_nombre',
    'personasobservadas',
    'personasabordadas',
    'aceptada',
    'area',
    'area_id',
    'area_nombre'
  ];
  areasPermiso?: string;

  constructor(
    private observacionService: ObservacionService,
    private sesionService: SesionService,
    private router: Router,
    private paramNav: ParametroNavegacionService,
  ) { }

  ngOnInit() {
    this.testing = true;
    this.loading = true;
    this.idEmpresa = this.sesionService.getEmpresa()!.id;
    this.areasPermiso = this.sesionService.getPermisosMap()['AUC_GET_OBS'].areas;
    let areasPermiso =this.areasPermiso!.replace('{','');
    areasPermiso =areasPermiso.replace('}','');
    let areasPermiso2=areasPermiso.split(',')

    const filteredArea = areasPermiso2.filter(function(ele , pos){
      return areasPermiso2.indexOf(ele) == pos;
    }) 
    this.areasPermiso='{'+filteredArea.toString()+'}';
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
    filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: 'area.id', value1: this.areasPermiso });

    this.observacionService.findByFilter(filterQuery).then(
      (resp:any) => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.testing = false;
        this.observacionesList = [];
        (<any[]>resp['data']).forEach(dto => {
          this.observacionesList!.push(FilterQuery.dtoToObject(dto));
        });
      }
    );
  }

  navToConsultar() {
    this.paramNav.setAccion('GET');
    this.paramNav.setParametro<Observacion>(this.observacionSelect!);
    this.router.navigate(['app/auc/gestionObservaciones'])
  }

  navToGestionar() {
    this.paramNav.setAccion('PUT');
    this.paramNav.setParametro<Observacion>(this.observacionSelect!);
    this.router.navigate(['app/auc/gestionObservaciones'])
  }

  navegar() {
    this.paramNav.redirect('app/auc/observaciones');
  }

}

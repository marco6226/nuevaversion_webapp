import { Component, OnInit } from '@angular/core';
import { DesviacionService } from 'src/app/website/pages/core/services/desviacion.service';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { FileUtils } from 'src/app/website/pages/comun/entities/file-utils';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { Criteria } from 'src/app/website/pages/core/entities/filter';

@Component({
  selector: 's-consultaDesviacionInspeccion',
  templateUrl: './consulta-desviacion-inspeccion.component.html',
  styleUrls: ['./consulta-desviacion-inspeccion.component.scss']
})
export class ConsultaDesviacionInspeccionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

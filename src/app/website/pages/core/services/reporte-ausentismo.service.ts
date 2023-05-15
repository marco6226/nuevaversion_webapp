import { Injectable } from '@angular/core';
import { ReporteAusentismo } from 'src/app/website/pages/aus/entities/reporte-ausentismo'
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'

@Injectable({
  providedIn: 'root'
})
export class ReporteAusentismoService extends CRUDService<ReporteAusentismo>{

  getClassName() {
    return "ReporteAusentismoService";
  }

}

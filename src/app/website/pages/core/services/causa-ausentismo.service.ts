import { Injectable } from '@angular/core';
import { CausaAusentismo } from 'src/app/website/pages/aus/entities/causa-ausentismo'
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'

@Injectable({
  providedIn: 'root'
})
export class CausaAusentismoService extends CRUDService<CausaAusentismo>{

  getClassName() {
    return "CausaAusentismoService";
  }

}

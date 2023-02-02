import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { TipoPeligro } from 'src/app/website/pages/comun/entities/tipo-peligro'

@Injectable({
  providedIn: 'root'
})
export class TipoPeligroService extends CRUDService<TipoPeligro>{

  getClassName(): string {
    return "TipoPeligroService";
  }

}

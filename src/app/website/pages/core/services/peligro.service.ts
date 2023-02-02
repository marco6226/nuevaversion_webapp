import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { Peligro } from 'src/app/website/pages/comun/entities/peligro'

@Injectable({
  providedIn: 'root'
})
export class PeligroService extends CRUDService<Peligro>{

  getClassName(): string {
    return "PeligroService";
  }

}

import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { Efecto } from 'src/app/website/pages/comun/entities/efecto'

@Injectable({
  providedIn: 'root'
})
export class EfectoService extends CRUDService<Efecto>{

  getClassName(): string {
    return "EfectoService";
  }

}

import { Injectable } from '@angular/core';
import { Cargo } from 'src/app/website/pages/empresa/entities/cargo'
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'

@Injectable({
    providedIn: 'root'
})
export class CargoService extends CRUDService<Cargo>{


  getClassName(): string {
    return "CargoService";
  }
}

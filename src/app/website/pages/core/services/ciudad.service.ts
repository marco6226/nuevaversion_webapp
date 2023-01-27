import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { Ciudad } from 'src/app/website/pages/comun/entities/ciudad';

@Injectable({
    providedIn: 'root'
  })
export class CiudadService extends CRUDService<Ciudad>{

  getClassName() {
    return "CiudadService";
  }

}
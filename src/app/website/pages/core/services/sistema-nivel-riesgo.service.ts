import { Injectable } from '@angular/core';
import { SistemaNivelRiesgo } from '../entities/sistema-nivel-riesgo';
import { CRUDService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class SistemaNivelRiesgoService extends CRUDService<SistemaNivelRiesgo>{

  findDefault() {
    return super.find("default");
  }

  getClassName() {
    return 'SistemaNivelRiesgoService';
  }
}

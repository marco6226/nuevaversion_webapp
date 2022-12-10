import { Injectable } from '@angular/core';
import { CRUDService } from '../../core/services/crud.service';
import { ConfiguracionGeneral } from '../entities/configuracion-general';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionGeneralService extends CRUDService<ConfiguracionGeneral>{

  obtenerPorEmpresa() {
    return new Promise((resolve, reject) => {
        this.httpInt.get(this.end_point + 'empresa')
            .subscribe(
                res => resolve(res),
                err => {
                    this.manageError(err);
                    reject(err);
                }
            )
    });
  }

  getClassName() {
      return 'ConfiguracionGeneralService';
  }
}

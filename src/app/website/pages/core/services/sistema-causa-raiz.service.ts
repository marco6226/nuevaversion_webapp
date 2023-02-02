import { Injectable } from '@angular/core';
import { HttpInt } from 'src/app/httpInt'
import { endPoints } from 'src/environments/environment'

import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { SistemaCausaRaiz } from 'src/app/website/pages/comun/entities/sistema-causa-raiz'

@Injectable({
  providedIn: 'root'
})
export class SistemaCausaRaizService extends CRUDService<SistemaCausaRaiz>{

  findDefault() {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "seleccionado/")
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => this.manageError(err)
        )
    });
  }

  getClassName(): string {
    return "SistemaCausaRaizService";
  }

}

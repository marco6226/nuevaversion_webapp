import { Injectable } from '@angular/core';
import { HttpInt } from 'src/app/httpInt'

import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { SistemaCausaInmediata } from 'src/app/website/pages/comun/entities/sistema-causa-inmediata'

@Injectable({
  providedIn: 'root'
})
export class SistemaCausaInmediataService extends CRUDService<SistemaCausaInmediata>{

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

  findDefault2(idEmpresa: number){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + "seleccionado2/" + idEmpresa)
      .subscribe(
        res => {
          resolve(res);
        },
        err => {
          this.manageError(err);
          reject(err);
        }
      )
    })
  }

  getClassName(): string {
    return "SistemaCausaInmediataService";
  }

}

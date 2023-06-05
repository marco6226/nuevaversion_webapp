import { Injectable } from '@angular/core';
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

  findDefault2(idEmpresa: number){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + `seleccionado2/${idEmpresa}`)
      .subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      )
    });
  }

  getClassName(): string {
    return "SistemaCausaRaizService";
  }

}

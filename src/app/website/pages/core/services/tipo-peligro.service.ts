import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { TipoPeligro } from 'src/app/website/pages/comun/entities/tipo-peligro'
import { endPoints } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoPeligroService extends CRUDService<TipoPeligro>{

  getClassName(): string {
    return "TipoPeligroService";
  }

  getForEmpresa(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.TipoPeligroService}empresaId`)
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

}

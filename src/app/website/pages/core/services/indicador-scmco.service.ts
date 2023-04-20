import { Injectable } from '@angular/core';
import { Vwscmco } from 'src/app/website/pages/comun/entities/vwscmco';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { endPoints } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ViewscmcoService extends CRUDService<Vwscmco>{

  findByEmpresaId(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.ViewscmcoService}empresaId`)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => {
            this.manageError(err);
            reject(err);
         }
        )
    });
  }

  getClassName(): string {
    return "ViewscmcoService";
  }
}
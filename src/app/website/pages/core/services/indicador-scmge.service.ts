import { Injectable } from '@angular/core';
import { Vwscmge } from 'src/app/website/pages/comun/entities/vwscmge';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { endPoints } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ViewscmgeService extends CRUDService<Vwscmge>{

  findByEmpresaId(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.ViewscmgeService}empresaId`)
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
    return "ViewscmgeService";
  }
}
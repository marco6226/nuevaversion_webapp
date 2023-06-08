import { Injectable } from '@angular/core';
import { viewscm } from 'src/app/website/pages/comun/entities/viewscm'
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { endPoints } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewscmInformeService extends CRUDService<viewscm>{

  findByEmpresaId(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.ViewscmInformeService}empresaId`)
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
    return "ViewscmInformeService";
  }
}
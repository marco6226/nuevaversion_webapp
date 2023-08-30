import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { endPoints } from 'src/environments/environment';
import { ProcesoMatriz } from '../../comun/entities/Proceso-matriz';

@Injectable({
  providedIn: 'root'
})
export class ProcesoMatrizService extends CRUDService<ProcesoMatriz>{

  getClassName(): string {
    return "ProcesoMatrizService";
  }

  getForEmpresa(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.ProcesoMatrizService}empresaId`)
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

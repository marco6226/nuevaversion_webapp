import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { endPoints } from 'src/environments/environment';
import { AreaMatriz } from '../../comun/entities/Area-matriz';

@Injectable({
  providedIn: 'root'
})
export class AreaMatrizService extends CRUDService<AreaMatriz>{

  getClassName(): string {
    return "AreaMatrizService";
  }

  getForEmpresa(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.AreaMatrizService}empresaId`)
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

  getAreaMByLocalidad(localidadId: string): Promise<AreaMatriz[]>{
    return new Promise((resolve, reject) => {
      this.httpInt.get(endPoints.AreaMatrizService + "getAreaM/"+ localidadId)
      .subscribe(
        (res: any) => {
          resolve(res);
        },
        err => {
          this.manageError(err);
          reject(err);
        }
      );
    });
  }

}

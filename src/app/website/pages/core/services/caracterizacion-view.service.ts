import { Injectable } from '@angular/core';
import { Carview } from 'src/app/website/pages/comun/entities/caracterizacion';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { endPoints } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})
export class CaracterizacionViewService extends CRUDService<Carview>{

    findAllCAR(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.CaracterizacionViewService}all`)
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
    return "CaracterizacionViewService";
  }
}
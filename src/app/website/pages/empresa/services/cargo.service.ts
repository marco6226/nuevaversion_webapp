import { Injectable } from '@angular/core';
import { Cargo } from 'src/app/website/pages/empresa/entities/cargo'
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { endPoints } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CargoService extends CRUDService<Cargo>{

  findByEmpresa(){
    return new Promise((resolve, reject) =>{
      this.httpInt.get(`${endPoints.cargo}empresa`)
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
    return "CargoService";
  }
}

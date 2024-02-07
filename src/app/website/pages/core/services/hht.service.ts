import { Injectable } from '@angular/core';
import { map, retryWhen } from 'rxjs';
import { Hht, HhtIli } from 'src/app/website/pages/comun/entities/hht'
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'

@Injectable({
  providedIn: 'root'
})
export class HhtService extends CRUDService<Hht>{

  findByAnio(anio: number) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "anio/" + anio)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  
  createHht(hht: Hht[]) {
    let body = JSON.stringify(hht);
    return new Promise((resolve, reject) => {
      this.httpInt.post(this.end_point, body)
      .subscribe(
        res => resolve(res),
        err => {
          this.manageError(err);
          reject(err);
        }
      );
    });
  }

  updateHht(hht: Hht[]){
    let body = JSON.stringify(hht);
    return new Promise((resolve, reject) => {
      this.httpInt.put(this.end_point, body)
      .subscribe(
        res => resolve(res),
        err => {
          this.manageError(err);
          reject(err);
        }
      );
    });
  }

  getClassName(): string {
    return "HhtService";
  }
}

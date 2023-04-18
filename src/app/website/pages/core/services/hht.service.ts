import { Injectable } from '@angular/core';
import { Hht } from 'src/app/website/pages/comun/entities/hht'
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

  getClassName(): string {
    return "HhtService";
  }
}

import { Injectable } from '@angular/core';
import { CRUDService } from '../../core/services/crud.service';
import { Hht } from '../entities/hht';

@Injectable()
export class HhtService extends CRUDService<Hht>{

  findByAnio(anio: number) {
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + "anio/" + anio)
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
    return "HhtService";
  }
}

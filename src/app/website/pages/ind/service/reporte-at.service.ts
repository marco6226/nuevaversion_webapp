import { Injectable } from '@angular/core';
import { endPoints } from 'src/environments/environment';
import { CRUDService } from '../../core/services/crud.service';
import { ReporteATView } from '../entities/ReporteATView';

@Injectable()
export class ReporteAtService extends CRUDService<ReporteATView>{
  
  findAllRAT() {
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.ReporteAtService}all`)
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

  getAllAt(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.ReporteAtService}listaAt`)
      .subscribe(
        res => {
          resolve(res);
        },
        err => {
          this.manageError(err);
          reject(err);
        }
      );
    });
  }

  getClassName(): string {
    return "ReporteAtService";
  }
}

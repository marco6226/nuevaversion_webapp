import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { TipoPeligro } from 'src/app/website/pages/comun/entities/tipo-peligro'
import { endPoints } from 'src/environments/environment';
import { MatrizPeligrosLog } from '../../comun/entities/Matriz-peligros-log';
import { FilterQuery } from '../entities/filter-query';

@Injectable({
  providedIn: 'root'
})
export class MatrizPeligrosLogService extends CRUDService<MatrizPeligrosLog>{

  getClassName(): string {
    return "MatrizPeligrosLogService";
  }

  getForEmpresa(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.MatrizPeligrosService}empresaId`)
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

  getmpRWithFilter(filterQuery?: FilterQuery){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'mpRegistroFilter/?' + this.buildUrlParams(filterQuery!))
      .subscribe(
        res => {
          resolve(res);
        },
        err => {
          this.manageError(err);
          reject(err);
        }
      )
    });
  }
}

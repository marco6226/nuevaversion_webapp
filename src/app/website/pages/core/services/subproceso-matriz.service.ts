import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { endPoints } from 'src/environments/environment';
import { SubprocesoMatriz } from '../../comun/entities/Subproceso-matriz.ts';
import { FilterQuery } from '../entities/filter-query.js';


@Injectable({
  providedIn: 'root'
})
export class SubprocesoMatrizService extends CRUDService<SubprocesoMatriz>{

  getClassName(): string {
    return "SubprocesoMatrizService";
  }

  getForEmpresa(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.SubprocesoMatrizService}empresaId`)
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

  getsubproWithFilter(filterQuery?: FilterQuery){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'subfilterFilter/?' + this.buildUrlParams(filterQuery!))
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

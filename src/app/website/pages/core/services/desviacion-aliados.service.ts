import { Injectable } from '@angular/core';
import { DesviacionAliados } from '../../comun/entities/desviacion-aliados';
import { FilterQuery } from '../entities/filter-query';
import { CRUDService } from './crud.service';

@Injectable()
export class DesviacionAliadosService extends CRUDService<DesviacionAliados>{
  
  getClassName(): string {
    return "DesviacionAliadosService";
  }

  getRepWithFilter(filterQuery: FilterQuery){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'reportesAliados/?' + this.buildUrlParams(filterQuery))
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

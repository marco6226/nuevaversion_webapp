import { Injectable } from '@angular/core';
import { endPoints } from 'src/environments/environment'

import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { Desviacion } from 'src/app/website/pages/comun/entities/desviacion'
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class DesviacionService extends CRUDService<Desviacion>{
  
  consultarConsolidado(desde: Date, hasta: Date): any {
    let params = "?invDesde=" + encodeURIComponent(desde.toUTCString()) + "&invHasta=" + encodeURIComponent(hasta.toUTCString());
    return new Promise((resolve, reject) => {
      let options: any = {
        responseType: 'blob',
        headers: new HttpHeaders()
          .set('Param-Emp', this.httpInt.getSesionService().getParamEmp())
          .set('app-version', this.httpInt.getSesionService().getAppVersion())
          .set('Authorization', this.httpInt.getSesionService().getBearerAuthToken())
      };
      this.httpInt.http.get(this.end_point + "consinv/" + params, options)
        .subscribe(
          res => resolve(res),
          err => {
            reject(err);
            this.manageBlobError(err)
          }
        )
    });
  }

  findInpByFilter(filterQuery?: FilterQuery) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + 'inspecciones/?' + this.buildUrlParams(filterQuery!))
        .subscribe(
          res => {
            resolve(res);
          }
          ,
          err => this.manageError(err)
        )
    });
  }

  getDesviacionTemporal(idDesviacion: number | null | undefined){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${this.end_point}desviacionId/${idDesviacion}`)
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
    return "DesviacionService";
  }

}

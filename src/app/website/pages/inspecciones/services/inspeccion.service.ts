import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CRUDService } from '../../core/services/crud.service';
import { Inspeccion } from '../entities/inspeccion';

@Injectable({
  providedIn: 'root'
})
export class InspeccionService extends CRUDService<Inspeccion>{
 
  getClassName(): string {
    return "InspeccionService";
  }

  consultarConsolidado(desde: Date, hasta: Date, listaId: string, listaVersion: number) {
    let params = "?desde=" + encodeURIComponent(desde.toUTCString()) + "&hasta=" + encodeURIComponent(hasta.toUTCString()) + "&listaId=" + listaId + "&listaVersion=" + listaVersion;
    return new Promise((resolve, reject) => {
      let options: any = {
        responseType: 'blob',
        headers: new HttpHeaders()
          .set('Param-Emp', this.httpInt.getSesionService().getParamEmp())
          .set('app-version', this.httpInt.getSesionService().getAppVersion())
          .set('Authorization', this.httpInt.getSesionService().getBearerAuthToken())
      };
      this.httpInt.http.get(this.end_point + "consolidado/" + params, options)
        .subscribe(
          (res: any) => resolve(res),
          (err: any) => {
            reject(err);
            this.manageBlobError(err)
          }
        )
    });
  }

  saveInspeccionAliado(inspeccion: Inspeccion) {
    return new Promise((resolve, reject) => {
      this.httpInt.post(this.end_point + 'inspeccionAliado', inspeccion)
      .subscribe(
        (res: any) => resolve(res),
        (err: any) => {
          this.manageError(err);
          reject(err);
        }
      )
    });
  }

  updateInspeccionAliado(inspeccion: Inspeccion) {
    return new Promise((resolve, reject) => {
      this.httpInt.put(this.end_point + 'inspeccionAliado', inspeccion)
      .subscribe(
        (res: any) => resolve(res),
        (err: any) => {
          this.manageError(err);
          reject(err);
        }
      )
    });
  }
  
}

import { Injectable } from '@angular/core';

import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { Reporte } from 'src/app/website/pages/comun/entities/reporte'
import { map} from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class ReporteService extends CRUDService<Reporte>{

  cargarArchivo(fileToUpload: File, tipoReporte: string) {
    let formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('tipoReporte', tipoReporte);

    return new Promise((resolve, reject) => {
      this.httpInt.postFile(this.end_point + 'cargarArchivo/', formData)
        .subscribe(
          res => resolve(res),
          err => {
            reject(err);
            this.manageError(err);
          }
        )
        map((res: any) => res) 
    });
  }

  inicializarReporte(empleadoId : any) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "inicializarReporte/" + empleadoId)
        .subscribe(
          res => {
            resolve(res);
          }
          ,
          err => this.manageError(err)
        )
        map((res: any) => res) 
    });
  }

  getClassName(): string {
    return "ReporteService";
  }

}

import { Injectable } from '@angular/core';
import { HttpInt } from 'src/app/httpInt';
import { endPoints } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnumeracionesService {

  constructor(private httpInt: HttpInt) { }

  findTipoIdentificacion() {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.com_tipoIdentificacion)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => console.log(err)
        )
    });
  }

  findTipoVinculacion() {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.com_tipoVinculacion)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => console.log(err)
        )
    });
  }


  findTipoSede() {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.com_tipoSede)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => console.log(err)
        )
    });
  }

}

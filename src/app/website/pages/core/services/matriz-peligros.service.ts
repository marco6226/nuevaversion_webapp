import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { TipoPeligro } from 'src/app/website/pages/comun/entities/tipo-peligro'
import { endPoints } from 'src/environments/environment';
import { MatrizPeligros } from '../../comun/entities/Matriz-peligros';

@Injectable({
  providedIn: 'root'
})
export class MatrizPeligrosService extends CRUDService<MatrizPeligros>{

  getClassName(): string {
    return "MatrizPeligrosService";
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

}

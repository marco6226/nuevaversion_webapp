import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { TipoPeligro } from 'src/app/website/pages/comun/entities/tipo-peligro'
import { endPoints } from 'src/environments/environment';
import { viewHHtMetas } from '../../comun/entities/ViewHHtMetas';
import { FilterQuery } from '../entities/filter-query';
import { MessageService } from 'primeng/api';
import { MensajeUsuarioService } from '../../comun/services/mensaje-usuario.service';
import { HttpInt } from 'src/app/httpInt';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewHHtMetasService extends CRUDService<viewHHtMetas>{

  getClassName(): string {
    return "ViewHHtMetasService";
  }


  getWithFilter(filterQuery?: FilterQuery){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'Filter/?' + this.buildUrlParams(filterQuery!))
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

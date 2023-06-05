import { Injectable } from '@angular/core';
import { endPoints } from 'src/environments/environment'
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import{anexo5SCM} from 'src/app/website/pages/scm/entities/anexoSCM'
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';


@Injectable({
    providedIn: 'root'
  })
export class anexoSCM extends CRUDService<anexo5SCM>{

    getAnexWithFilter(filterQuery?: FilterQuery){
        return new Promise((resolve, reject) => {
          this.httpInt.get(this.end_point + 'anexosFilter/?' + this.buildUrlParams(filterQuery!))
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

    
    getClassName(): string {
        return "anexoSCM";
      }
}
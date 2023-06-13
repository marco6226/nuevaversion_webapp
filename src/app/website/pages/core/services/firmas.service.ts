import { Injectable } from '@angular/core';
import { endPoints } from 'src/environments/environment'
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import{firma} from 'src/app/website/pages/comun/entities/firma'
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';


@Injectable({
    providedIn: 'root'
  })
export class firmaservice extends CRUDService<firma>{

    // getAnexWithFilter(filterQuery?: FilterQuery){
    //     return new Promise((resolve, reject) => {
    //       this.httpInt.get(this.end_point + 'firmaFilter/?' + this.buildUrlParams(filterQuery!))
    //       .subscribe(
    //         res => {
    //           resolve(res);
    //         },
    //         err => {
    //           this.manageError(err);
    //           reject(err);
    //         }
    //       )
    //     });
    //   }
    // public getSegByTareaID(id:any) {
    //   return this.httpInt.get(`${endPoints.firmaservice}/${id}`).toPromise();
    // }

    findById(id: string) {
      return new Promise(resolve => {
        this.httpInt.get(endPoints.firmaservice + id)
          .subscribe(
            res => {
              resolve(res);
            }
            ,
            err => this.manageError(err)
          )
      });
    }
    
    getClassName(): string {
        return "firmaservice";
      }
}
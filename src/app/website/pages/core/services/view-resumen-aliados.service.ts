import { Injectable } from '@angular/core';
import { ViewResumenInpAliados } from '../../comun/entities/view-resumen-aliados';
import { FilterQuery } from '../entities/filter-query';
import { CRUDService } from './crud.service';

@Injectable()
export class ViewResumenInpAliadosService extends CRUDService<ViewResumenInpAliados>{
    
    getClassName(): string {
        return 'ViewResumenAliadosService';
    }

    // override findByFilter(filterQuery: FilterQuery): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this.httpInt.get(this.end_point + this.buildUrlParams(filterQuery))
    //         .subscribe(
    //             res => {
    //                 resolve(res);
    //             },
    //             err => {
    //                 this.manageError(err);
    //                 reject(err);
    //             }
    //         )
    //     })
    // }
}
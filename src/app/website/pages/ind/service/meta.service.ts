import { Injectable } from '@angular/core';
import { CRUDService } from '../../core/services/crud.service';
import { Meta } from '../entities/meta';

@Injectable({
  providedIn: 'root'
})
export class MetaService extends CRUDService<Meta> {

  createMetas(metas: Meta[]) {
    return new Promise((resolve, reject) => {
      this.httpInt.post(this.end_point, metas)
      .subscribe(
        (res:any) => {
          resolve(res);
        },
        (err: any) => {
          this.manageError(err);
          reject(err);
        }
      )
    });
  }

  updateMetas(metas: Meta[]) {
    return new Promise((resolve, reject) => {
      this.httpInt.put(this.end_point, metas)
      .subscribe(
        (res:any) => {
          resolve(res);
        },
        (err: any) => {
          this.manageError(err);
          reject(err);
        }
      )
    });
  }

  getClassName() {
    return 'metaService';
  }

}

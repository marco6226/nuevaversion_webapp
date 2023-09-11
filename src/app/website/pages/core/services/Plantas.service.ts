import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { Plantas } from 'src/app/website/pages/comun/entities/Plantas';
import { FilterQuery } from '../entities/filter-query';

@Injectable({
  providedIn: 'root'
})
export class PlantasService extends CRUDService<Plantas>{

  getClassName(): string {
    return 'Plantas';
  }

  getPlantasByEmpresaId(empresaId: number): Promise<Plantas[]>{
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point+`${empresaId}`).subscribe(
        (res: Plantas[] | any) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getPlantaWithFilter(filterQuery?: FilterQuery){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'plantaFilter/?' + this.buildUrlParams(filterQuery!))
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

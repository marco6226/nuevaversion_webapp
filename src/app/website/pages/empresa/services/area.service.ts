import { Injectable } from '@angular/core';
import { endPoints } from 'src/environments/environment';
import { CRUDService } from '../../core/services/crud.service';
import { Area } from '../entities/area';

@Injectable({
  providedIn: 'root'
})
export class AreaService extends CRUDService<Area>{
  getClassName() {
    return "AreaService";
  }
  
  findByAreapadre(areaPadreId: string) {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.area + "areaPadre/" + areaPadreId)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => err
        )
    });
  }

 
}

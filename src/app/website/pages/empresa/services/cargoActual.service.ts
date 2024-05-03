import { Injectable } from '@angular/core';
import { Cargo } from 'src/app/website/pages/empresa/entities/cargo'
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { endPoints } from 'src/environments/environment';
import { CargoActual } from '../entities/cargo-actual';
import { FilterQuery } from '../../core/entities/filter-query';

@Injectable({
    providedIn: 'root'
})
export class CargoActualService extends CRUDService<CargoActual>{

  findByEmpresa(){
    return new Promise((resolve, reject) =>{
      this.httpInt.get(`${this.end_point}empresa`)
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

  getcargoRWithFilter(filterQuery?: FilterQuery){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'cargoFilter/?' + this.buildUrlParams(filterQuery!))
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

  crearCargoActual(entity: CargoActual): Promise<CargoActual>{
    let body = JSON.stringify(entity);
    return new Promise((resolve, reject) => {
        this.httpInt
            .post(this.end_point, body)
            .subscribe(
                (res) => {
                    resolve(res);
                },
                (err) => {
                    reject(err);
                    this.manageError(err);
                }
            );
    });
  }

  getClassName(): string {
    return "CargoActualService";
  }
}

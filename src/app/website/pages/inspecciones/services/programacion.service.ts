import { Injectable } from '@angular/core';
import { FilterQuery } from '../../core/entities/filter-query';
import { CRUDService } from '../../core/services/crud.service';
import { Programacion } from '../entities/programacion';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService extends CRUDService<Programacion>{

  getClassName(): string {
    return "ProgramacionService";
  }

  createAuditoria(programacion: Programacion) {
    return new Promise((resolve, reject) => {
      this.httpInt.post(this.end_point+ 'auditoria', programacion)
      .subscribe(
        (res: any) => {
          resolve(res);
        },
        (err: any) => {
          this.manageError(err);
          reject(err);
        }
      )
    });
  }

  updateAuditoria(programacion: Programacion){
    return new Promise((resolve, reject) => {
      this.httpInt.put(this.end_point+'auditoria', programacion)
      .subscribe(
        (res: any) => {
          resolve(res);
        },
        (error: any) => {
          this.manageError(error);
          reject(error);
        }
      )
    });
  }

  findAuditoriasWithFilter(filterQuery: FilterQuery){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point+'auditoria?' + this.buildUrlParams(filterQuery))
      .subscribe(
        (res: any) => resolve(res),
        (err: any) => {
          this.manageError(err);
          reject(err);
        }
      )
    })
  }
  
}

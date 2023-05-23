import { Injectable } from '@angular/core';
import { HttpInt } from 'src/app/httpInt'
import { endPoints } from 'src/environments/environment'

import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { AnalisisDesviacion } from 'src/app/website/pages/comun/entities/analisis-desviacion'

@Injectable({
    providedIn: 'root'
  })
export class AnalisisDesviacionService extends CRUDService<AnalisisDesviacion>{
  
  getAnalisisTemporal(idAnalisis: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${this.end_point}idanalisis/${idAnalisis}`)
      .subscribe(
        res => {
          resolve(res);
        },
        err => {
          this.manageError(err);
          reject(err);
        }
      );
    });
  }

  findByTarea(tareaId: string) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + 'tarea/' + tareaId)
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
    return "AnalisisDesviacionService";
  }

  sendGestoresEmail(idReporte: number, aliadoID: number, analisisID: number, esNuevo: boolean){
    let body = {
      aliadoID: aliadoID,
      analisisID: analisisID,
      esNuevo: esNuevo
    }

    return new Promise((resolve, reject) => {
      this.httpInt.post(`${this.end_point}emailGestores/${idReporte}`, body)
      .subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      )
    });
  }

  updateSeguimiento(idAnalisisDesviacion: number, seguimiento: string, observaciones: string){
    let body = {
      seguimiento: seguimiento,
      observaciones: observaciones
    }
    return new Promise((resolve, reject) => {
      this.httpInt.post(`${this.end_point}updateSeguimiento/${idAnalisisDesviacion}`, body)
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

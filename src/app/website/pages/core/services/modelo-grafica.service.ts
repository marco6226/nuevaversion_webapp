import { Injectable } from '@angular/core';

import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { ModeloGrafica } from 'src/app/website/pages/comun/entities/modelo-grafica'

@Injectable({
  providedIn: 'root'
})
export class ModeloGraficaService extends CRUDService<ModeloGrafica>{

  findRai<T>(tipo :any, rangos:any, empresaId:any) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorRai/" + tipo + "/" + rangos + "/" + (empresaId == null ? 0 : empresaId))
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => this.manageError(err)
        )
    });
  }

  findInp<T>(areaId:any, rangos:any, empresaId:any) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + areaId + "/" + rangos + "/" + (empresaId == null ? 0 : empresaId))
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => this.manageError(err)
        )
    });
  }

  findInpN<T>(areasId:any, desde:any, hasta:any) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "cumplimientoinp/" + areasId + "/" + desde + "/"+ hasta)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  findInptotal<T>(areasId:any, desde:any, hasta:any) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "cumplimientoinptotal/" + areasId + "/" + desde + "/"+ hasta)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  findAttotal<T>(areasId:any, desde:any, hasta:any) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "cumplimientoattotal/" + areasId + "/" + desde + "/"+ hasta)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  findAuctotal<T>(areasId:any, desde:any, hasta:any) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "cumplimientoauctotal/" + areasId + "/" + desde + "/"+ hasta)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  
  findInpCobertura<T>(areasId:any, desde:any, hasta:any) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "cobertura/" + areasId + "/" + desde + "/"+ hasta)
        .subscribe(
        res2 => {
          resolve(res2);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  findInpEfectividad<T>(areasId:any, desde:any, hasta:any) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "efectividad/" + areasId + "/" + desde + "/"+ hasta)
        .subscribe(
        res2 => {
          resolve(res2);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  findTipoAt<T>(areasId:any, desde:any, hasta:any) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "tipo/" + areasId + "/" + desde + "/"+ hasta)
        .subscribe(
        res2 => {
          resolve(res2);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  findInpEfectividadAt<T>(areasId:any, desde:any, hasta:any) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "efectividadat/" + areasId + "/" + desde + "/"+ hasta)
        .subscribe(
        res2 => {
          resolve(res2);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  findInpCoberturaAt<T>(areasId:any, desde:any, hasta:any) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "coberturaat/" + areasId + "/" + desde + "/"+ hasta)
        .subscribe(
        res2 => {
          resolve(res2);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  findInpEficaciaAuc<T>(areasId:any, desde:any, hasta:any) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "eficaciaauc/" + areasId + "/" + desde + "/"+ hasta)
        .subscribe(
        res2 => {
          resolve(res2);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  getClassName() {
    return "ModeloGrafica";
  }

}

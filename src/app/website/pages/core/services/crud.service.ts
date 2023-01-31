import { Injectable } from '@angular/core';
import { map, Observable, retryWhen } from 'rxjs';
import { HttpInt } from 'src/app/httpInt';
import { endPoints } from 'src/environments/environment';
import { MensajeUsuario } from '../../comun/entities/mensaje-usuario';
import { MensajeUsuarioService } from '../../comun/services/mensaje-usuario.service';
import { FilterQuery } from '../entities/filter-query';

@Injectable({
  providedIn: 'root'
})
export abstract class CRUDService<T> {

  end_point: string = endPoints[this.getClassName()];

  constructor(
    public httpInt: HttpInt,
    public mensajeUsuarioService: MensajeUsuarioService
  ) { }

  protected retryFunction = (error: any) => {
    return error
      .flatMap((error: any) => {
        return Observable.arguments.throw(error);
      })
      .take(5)
      .concat(
        Observable.arguments.throw({
          error: "Sorry, there was an error (after 5 retries)",
        })
      );
  };

  protected retryFunction2 = (error: any) => {
    return error
      .flatMap((error: any) => {
        return Observable.arguments.throw(error);
      })
      .take(5)
      .concat(
        Observable.arguments.throw({
          error: "Sorry, there was an error (after 5 retries)",
        })
      );
  };

  abstract getClassName(): string | any | null | undefined;

  public buildUrlParams(filterQuery: FilterQuery): string {
    let urlParam = "";
    if (filterQuery == null) {
      return urlParam;
    }
    if (filterQuery.offset != null) {
      urlParam += "offset=" + filterQuery.offset + "&";
    }
    if (filterQuery.groupBy != null) {
      urlParam += "groupBy=" + filterQuery.groupBy + "&";
    }
    if (filterQuery.rows != null) {
      urlParam += "rows=" + filterQuery.rows + "&";
    }
    if (filterQuery.count != null) {
      urlParam += "count=" + filterQuery.count + "&";
    }
    if (filterQuery.sortField != null) {
      urlParam += "sortField=" + filterQuery.sortField + "&";
    }
    if (filterQuery.sortOrder != null) {
      urlParam += "sortOrder=" + filterQuery.sortOrder + "&";
    }
    if (filterQuery.filterList != null) {
      urlParam +=
        "filterList=" +
        encodeURIComponent(JSON.stringify(filterQuery.filterList)) +
        "&";
    }
    if (filterQuery.fieldList != null) {
      let fieldParam = "fieldList=";
      filterQuery.fieldList.forEach((field) => {
        fieldParam += field + ",";
      });
      fieldParam.slice(0, fieldParam.length - 1);
      urlParam += fieldParam;
    }
    if (urlParam[urlParam.length - 1] === "&") {
      urlParam = urlParam.slice(0, urlParam.length - 1);
    }
    return urlParam;
  }

  findByFilter(filterQuery: FilterQuery) {
    return new Promise((resolve, reject) => {

      this.httpInt
        .get(this.end_point + "?" + this.buildUrlParams(filterQuery))
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            this.manageError(err);
            reject(err);
          }
        );
        retryWhen(this.retryFunction)
        
    });
  }

  find(id: string) {
    return new Promise((resolve) => {
      this.httpInt
        .get(this.end_point + id)
        .subscribe(
          (res: unknown) => {
            resolve(res);
          },
          (err: any) => this.manageError(err)
        );
        retryWhen(this.retryFunction)
        map((res: any) => res)        
    });
  }

  findAll<T>() {
    return new Promise((resolve) => {
      this.httpInt
        .get(this.end_point).subscribe(
          (res: unknown) => {
            resolve(res);
          },
          (err: any) => this.manageError(err)
        ),
        retryWhen(this.retryFunction),
        map((res: any) => res)

    });
  }

  create(entity: T) {
    let body = JSON.stringify(entity);
    return new Promise((resolve, reject) => {
      this.httpInt
        .post(this.end_point, body)
        .subscribe(
          (res: unknown) => {
            resolve(res);
          },
          (err: any) => {
            reject(err);
            this.manageError(err);
          }
        );
        retryWhen(this.retryFunction)
        map((res: any) => res)        
    });
  }

  update(entity: T, params?: string) {
    let body = JSON.stringify(entity);
    return new Promise((resolve, reject) => {
      this.httpInt
        .put(
          this.end_point + (params == null ? "" : "?".concat(params)),
          body
        )
        .subscribe(
          (res: unknown) => {
            resolve(res);
          },
          (err: any) => {
            reject(err);
            this.manageError(err);
          }
        );
        retryWhen(this.retryFunction)
        map((res: any) => res)        
    });
  }

  updateAle(entity: T, params?: string, route?: string) {
    let body = JSON.stringify(entity);
    return new Promise((resolve, reject) => {
      this.httpInt
        .post(
          this.end_point +
          route +
          "/" +
          (params == null ? "" : "?".concat(params)),
          body
        )
        .subscribe(
          (res: unknown) => {
            resolve(res);
          },
          (err: any) => {
            reject(err);
            this.manageError(err);
          }
        );
        retryWhen(this.retryFunction)
        map((res: any) => res)
        
    });
  }

  delete(id: string) {
    return new Promise((resolve, reject) => {
      let end_point = this.httpInt
        .delete(this.end_point + id)
        .subscribe(
          (res: unknown) => {
            resolve(res);
          },
          (err: any) => {
            reject(err);
            this.manageError(err);
          }
        );
        retryWhen(this.retryFunction)
        map((res: any) => res)
        
    });
  }

  manageError(errResp: any) {
    //console.log("managing error...");
    let msg: MensajeUsuario;
    try {
      msg = <MensajeUsuario>errResp.error;
    } catch (error) {
      msg = {
        tipoMensaje: "error",
        mensaje: "Error Inesperado",
        detalle: errResp,
      };
    }
    this.mensajeUsuarioService.showMessage({
      mensaje: msg.mensaje,
      detalle: msg.detalle,
      tipoMensaje: msg.tipoMensaje,
    });
  }

  manageBlobError(err: any) {
    let usrMsgService = this.mensajeUsuarioService;

    var reader = new FileReader();
    reader.onload = function () {
      let msg: MensajeUsuario;
      try {
        msg = <MensajeUsuario>JSON.parse(<string>reader.result);
      } catch (error) {
        msg = {
          tipoMensaje: "error",
          mensaje: "Error Inesperado",
          detalle: <string>reader.result,
        };
      }
      usrMsgService.showMessage({
        mensaje: msg.mensaje,
        detalle: msg.detalle,
        tipoMensaje: msg.tipoMensaje,
      });
    };
    reader.readAsText(err.error);
  }
}


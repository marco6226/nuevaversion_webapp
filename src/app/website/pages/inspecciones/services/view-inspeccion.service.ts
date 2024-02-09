import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInt } from 'src/app/httpInt';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { MensajeUsuarioService } from '../../comun/services/mensaje-usuario.service';
import { SesionService } from '../../core/services/session.service';
import { FilterQuery } from '../../core/entities/filter-query';
import { ViewInspeccion } from '../entities/view-inspeccion';

@Injectable({
  providedIn: 'root'
})
export class ViewInspeccionService extends CRUDService<ViewInspeccion>{

  override httpInt: any;
  headers!: any;

  constructor(
    httpInt: HttpInt,
    mensajeUsuarioService: MensajeUsuarioService,
    private http: HttpClient,
    public sesionService: SesionService,
  ) { 
    super(httpInt, mensajeUsuarioService)
  }

  getClassName(): string {
    return "ViewInspeccionService";
  }

  
  getFilterInspeccionToPerfilToUsuario(filterQuery?: FilterQuery){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'viewInpFilter/?' + this.buildUrlParams(filterQuery!))
      .subscribe(
        (res:any) => {
          resolve(res);
        },
        (err:any) => {
          this.manageError(err);
          reject(err);
        }
      )
    })
  }

}

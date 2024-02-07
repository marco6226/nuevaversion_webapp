import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInt } from 'src/app/httpInt';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { MensajeUsuarioService } from '../../comun/services/mensaje-usuario.service';
import { SesionService } from '../../core/services/session.service';
import { ViewListaInspeccion } from '../entities/view-lista-inspeccion';
import { FilterQuery } from '../../core/entities/filter-query';

@Injectable({
  providedIn: 'root'
})
export class ViewListaInspeccionService extends CRUDService<ViewListaInspeccion>{

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
    return "ViewListaInspeccionService";
  }

  
  getFilterListInspeccionToPerfilToUsuario(filterQuery?: FilterQuery){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'viewListInpFilter/?' + this.buildUrlParams(filterQuery!))
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

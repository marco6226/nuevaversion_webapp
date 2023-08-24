import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInt } from 'src/app/httpInt';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { MensajeUsuarioService } from '../../comun/services/mensaje-usuario.service';
import { SesionService } from '../../core/services/session.service';
import { ListaInspeccion } from '../entities/lista-inspeccion';
import { ListaInspeccionPK } from '../entities/lista-inspeccion-pk';

@Injectable({
  providedIn: 'root'
})
export class ListaInspeccionService extends CRUDService<ListaInspeccion>{

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
    return "ListaInspeccionService";
  }

  public getInspeccionImagen(lista_id: any, version_id: any) {
    return this.http.get(`${this.end_point}images/${lista_id}/${version_id}`, this.getRequestHeaders(this.headers)).toPromise();
  }
  
  getRequestHeaders(headers?: HttpHeaders): any {
    if (headers == null)
        headers = new HttpHeaders().set('Content-Type', 'application/json');

    headers = headers
        .set('Param-Emp', this.sesionService.getParamEmp())
        .set('app-version', this.sesionService.getAppVersion())
        .set('Authorization', this.sesionService.getBearerAuthToken());
    return { 'headers': headers };
  }
  
  eliminarLista(listaInspeccionPK: ListaInspeccionPK){
    return new Promise((resolve, reject) => {
      this.http.delete(this.end_point + '?id=' + listaInspeccionPK.id + '&version=' + listaInspeccionPK.version, this.getRequestHeaders(this.headers))
      .subscribe(
        (res: any) => resolve(res),
        (err: any) => {
          this.manageError(err);
          reject(err);
        }
      );
    })
  }
}

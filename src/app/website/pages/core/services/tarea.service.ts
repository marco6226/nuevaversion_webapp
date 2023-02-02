import { Injectable } from '@angular/core';
import { HttpInt } from 'src/app/httpInt'
import { endPoints } from 'src/environments/environment'
import { FilterQuery } from "src/app/website/pages/core/entities/filter-query";
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { Tarea } from 'src/app/website/pages/comun/entities/tarea'
import { MensajeUsuarioService } from 'src/app/website/pages/comun/services/mensaje-usuario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SesionService } from 'src/app/website/pages/core/services/session.service';

@Injectable({
    providedIn: 'root'
  })
export class TareaService extends CRUDService<Tarea>{

    headers : any;;

    constructor(
        httpInt: HttpInt,
        mensajeUsuarioService: MensajeUsuarioService,
        private http: HttpClient,
        public sesionService: SesionService,
    ) {
        super(httpInt, mensajeUsuarioService);
    }

    reportarCumplimiento(tarea: Tarea) {
        let body = JSON.stringify(tarea);
        return new Promise(resolve => {
            this.httpInt.put(this.end_point + "reportarCumplimiento", body)
                .subscribe(
                    (res:any) => {
                        resolve(res);
                    }
                    ,
                    (err:any) => this.manageError(err)
                )
        });
    }

    reportarVerificacion(tarea: Tarea) {
        let body = JSON.stringify(tarea);
        return new Promise(resolve => {
            this.httpInt.put(this.end_point + "reportarVerificacion", body)
                .subscribe(
                    (res:any) => {
                        resolve(res);
                    }
                    ,
                    (err:any) => this.manageError(err)
                )
        });
    }

    findByUsuario(usuarioId: string) {
        return new Promise(resolve => {
            this.httpInt.get(this.end_point + 'usuario/' + usuarioId)
                .subscribe(
                    (res:any) => {
                        resolve(res);
                    }
                    ,
                    (err:any) => this.manageError(err)
                )
        });
    }

    public findByDetailId(tareaId: string) {
        return this.http.get(`${this.end_point}detail/${tareaId}`, this.getRequestHeaders(this.headers)).toPromise();
    }


    findByDetails<T>(areas : any) {
        return new Promise(resolve => {
          this.httpInt.get(this.end_point + "detalle/" + areas)
            .subscribe(
            (res:any) => {
              resolve(res);
            }
            ,
            (err:any) => this.manageError(err)
            )
        });
      }
    public findByDetailsByEmpleado(id : any) {
        return this.http.get(this.end_point+'details/'+id, this.getRequestHeaders(this.headers)).toPromise();
    }

    findByAnalisis(analisisId: string) {
        return new Promise(resolve => {
            this.httpInt.get(this.end_point + 'analisis/' + analisisId)
                .subscribe(
                    (res:any) => {
                        resolve(res);
                    }
                    ,
                    (err:any) => this.manageError(err)
                )
        });
    }

    public getTareaEvidences(id : any) {
        return this.http.get(`${this.end_point}images/${id}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    public getTareaEvidencesModulos(id : any, modulo : any) {
        return this.http.get(`${this.end_point}images/${id}/${modulo}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getClassName(): string {
        return "TareaService";
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

}

import { Injectable } from '@angular/core';

// import { Usuario } from 'app/modulos/empresa/entities/usuario'
// import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../empresa/entities/usuario';
import { CRUDService } from '../../core/services/crud.service';

@Injectable()
export class UsuarioService extends CRUDService<Usuario>{
  
  
  aceptarTerminos(acepta: boolean): any {
    return new Promise(resolve => {
      this.httpInt.put(this.end_point + 'terminos/' + acepta, null)
        .subscribe(
          res => {
            resolve(res);
          }
          ,
          err => this.manageError(err)
        )
    });
  }

  createUsuarioAliado(entity: Usuario, aliadoId: string): Promise<Usuario>{
    let body = JSON.stringify(entity);
    return new Promise((resolve, reject) => {
        this.httpInt
            .post(this.end_point + 'aliado/' +aliadoId, body)
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

  sendMailAliadoActualizar(entity: string, aliadoId: string) {
    let body = entity;
    // let body = JSON.stringify(entity);
    return new Promise((resolve, reject) => {
        this.httpInt
            .put(this.end_point + 'aliadoActualizar/' +aliadoId, body)
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

  emailAliadoActualizado(entity: string, aliadoId: string) {
    let body = entity;
    // let body = JSON.stringify(entity);
    return new Promise((resolve, reject) => {
        this.httpInt
            .put(this.end_point + 'emailAliadoActualizado/' +aliadoId, body)
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

  emailAliadoCicloCorto(entity: string, inspeccionId: string) {
    let body = entity;
    return new Promise((resolve, reject) => {
        this.httpInt
            .put(this.end_point + 'emailAliadoCicloCorto/'+inspeccionId, body)
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

  consultarHistoriaLogin(){
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + 'historiaLogin/')
        .subscribe(
          res => {
            resolve(res);
          }
          ,
          err => this.manageError(err)
        )
    });
  }


  cambiarPasswd(newPasswd: string, newPasswdConfirm: string, oldPasswd: string) {
    let body = { 'passwdAnterior': oldPasswd, 'passwdNuevo': newPasswd, 'passwdNuevoConfirm': newPasswdConfirm };
    return new Promise(resolve => {
      this.httpInt.put(this.end_point + 'cambiarPasswd', JSON.stringify(body))
        .subscribe(
          res => {
            resolve(res);
          }
          ,
          err => this.manageError(err)
        )
    });
  }

  /**
   * Modifica los datos de usuario por parte del mismo usuario.
   * No es permitido que un usuario modifique datos de otro a través
   * éste servicio
   * @param entity 
   */
  edit(entity: Usuario) {
    let body = JSON.stringify(entity);
    return new Promise(resolve => {
      this.httpInt.put(this.end_point + 'update', body)
        .subscribe(
          res => {
            resolve(res);
          }
          ,
          err => this.manageError(err)
        )
    });
  }

  consultarConsolidado(): any {
    
    return new Promise((resolve, reject) => {
      let options: any = {
        responseType: 'blob',
        headers: new HttpHeaders()
          .set('Param-Emp', this.httpInt.getSesionService().getParamEmp())
          .set('app-version', this.httpInt.getSesionService().getAppVersion())
          .set('Authorization', this.httpInt.getSesionService().getBearerAuthToken())
      };
      this.httpInt.http.get(this.end_point + "consusuarios/", options)
        .subscribe(
          res => resolve(res),
          err => {
            reject(err);
            this.manageBlobError(err)
          }
        )
    });
  }


  getClassName(): string {
    return "UsuarioService";
  }
}

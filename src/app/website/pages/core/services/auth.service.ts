import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as CryptoJS from "crypto-js";
import { HttpInt } from 'src/app/httpInt';
import { endPoints } from 'src/environments/environment';
import { SesionService } from './session.service';
import { ElementoInspeccion } from '../../inspecciones/entities/elemento-inspeccion';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginSubject = new Subject<any>();
  authEndPoint = endPoints.auth;

  redirectUrl: string = "/app/home";

  constructor(
    public httpInt: HttpInt,
    public sesionService: SesionService,
  ) { }

  getLoginObservable(): Observable<boolean> {
    return this.loginSubject.asObservable();
  }

  checkisLoginExist(login: string, passwd: string) {
    let body = login + ":" + this.createHash(passwd);
    return this.httpInt
        .post(
            this.authEndPoint +
                "activetokens" +
                "?r=" +
                false +
                (false != null ? "&pin=" + false : ""),
            body
        );
  }

  createHash(value: string) {
    try {
        return CryptoJS.SHA256(value);
    } catch (e) {
        //console.log(e);
        return "";
    }
  }

  login(login: string, passwd: string, recordar: boolean = true, pin: string|null=null) {
    let body = login + ":" + this.createHash(passwd);
    return new Promise((resolve, reject) => {
        this.httpInt
            .post(
                this.authEndPoint +
                    "?r=" +
                    recordar +
                    (pin != null ? "&pin=" + pin : ""),
                body
            )
            .subscribe(
                (res: unknown) => {
                    this.setSession(res, recordar);
                    resolve(res);
                },
                (err: any) => reject(err)
            );
    });
  }

  setSession(res: any, recordar?: boolean) {
    this.sesionService.setLoggedIn(true);
    this.sesionService.setUsuario(res["usuario"]);
    this.sesionService.setAuthToken(res["Authorization"]);
    if (recordar != null && recordar == true && res["refresh"] != null) {
        this.sesionService.setRefreshToken(res["refresh"]);
    }
  }

  async logout() {
    let refresh = await this.sesionService.getRefreshToken();
    let auth = await this.sesionService.getAuthToken();
    return new Promise((resolve, reject) => {
        this.httpInt
            .post(this.authEndPoint + "logout", {
                refresh: refresh,
                Authorization: auth,
            })
            .subscribe(
                (res) => {
                    this.sesionService.setLoggedIn(false);
                    resolve(res);
                },
                (err) => reject(err)
            );
    });
  }
  sendNotification(email: string, tarea:any) {
    let body = tarea;
    let endpoint = this.authEndPoint + "enviarCorreo/" + email;
    return new Promise((resolve, reject) => {
        this.httpInt
            .post(endpoint, body)
            .subscribe(
                (res) => resolve(res),
                (err) => reject(err)
            );
    });
}
callmsng() {
  let endpoint = this.authEndPoint + "enviarCorreoSemanal";
  return new Promise((resolve, reject) => {
      this.httpInt.get(endpoint)
          .subscribe(
              (res) => resolve(res),
              (err) => reject(err)
          );
  });
}

sendNotificationhallazgosCriticos(id: string | number, nocumplecriticos: ElementoInspeccion[],numeroeconomico: string,ubicacion: string) {
  let body = nocumplecriticos;
  let endPoint = this.authEndPoint + 'enviarHallazgosCriticos/' + id + '/' + numeroeconomico  + '/' + ubicacion;
  return new Promise((resolve) => {
      this.httpInt
          .post(endPoint , body)
          // .map((res) => res)
          .subscribe(
              (res) => {
                  resolve(res);
              },
             // (err) => this.manageError(err)
          );
  });
}
}

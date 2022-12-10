import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as CryptoJS from "crypto-js";
import { HttpInt } from 'src/app/httpInt';
import { endPoints } from 'src/environments/environment';
import { SesionService } from './session.service';

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
}

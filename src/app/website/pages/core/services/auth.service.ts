import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as CryptoJS from "crypto-js";
import { HttpInt } from 'src/app/httpInt';
import { endPoints } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginSubject = new Subject<any>();
  authEndPoint = endPoints.auth;

  redirectUrl: string = "/app/home";

  constructor(
    public httpInt: HttpInt,
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
}

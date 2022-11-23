import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { Empresa } from '../../empresa/entities/empresa';
import { Session } from '../entities/session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private session?: Session;

  constructor() { }

  getAppVersion(): any {
    return "1.0.237";
  }

  public getEmpresa(): Empresa | null {
    if (this.session == null) {
        this.session = <Session>JSON.parse(localStorage.getItem(config.session_id)!);
        if (this.session == null) return null;
    }
    return this.session.empresa;
  }
}

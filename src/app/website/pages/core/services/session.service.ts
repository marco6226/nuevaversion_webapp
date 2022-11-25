import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/config';
import { Empleado } from '../../empresa/entities/empleado';
import { Empresa } from '../../empresa/entities/empresa';
import { Usuario } from '../../empresa/entities/usuario';
import { Session } from '../entities/session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private session!: Session;

  constructor(
    private router: Router,
  ) { }

  getAppVersion(): any {
    return "1.0.237";
  }

  public getUsuario(): Usuario | null{
    if (this.session == null) {
        this.session = <Session>JSON.parse(localStorage.getItem(config.session_id)!);
        if (this.session == null) return null;
    }
    return this.session.usuario;
  }
  
  public setUsuario(usuario: Usuario) {
    this.session.usuario = usuario;
    localStorage.setItem(config.session_id, JSON.stringify(this.session));
  }

  public getEmpleado(): Empleado | null{
    if (this.session == null) {
        this.session = <Session>JSON.parse(localStorage.getItem(config.session_id)!);
        if (this.session == null) return null;
    }
    return this.session.empleado;
  }

  public setEmpleado(empleado: Empleado) {
      this.session.empleado = empleado;
      localStorage.setItem(config.session_id, JSON.stringify(this.session));
  }

  public getEmpresa(): Empresa | null {
    if (this.session == null) {
        this.session = <Session>JSON.parse(localStorage.getItem(config.session_id)!);
        if (this.session == null) return null;
    }
    return this.session.empresa;
  }

  public async setEmpresa(empresa: Empresa) {
    this.session.empresa = empresa;
    await localStorage.setItem(config.session_id, JSON.stringify(this.session));
  }

  public getParamEmp(): string {
    let empParam = this.getEmpresa();
    return empParam == null ? '' : '' + empParam.id;
  }

  public getBearerAuthToken(): string {
    let token = this.getAuthToken();
    return token == null ? '' : 'Bearer ' + token;
  }

  public getAuthToken(): string {
    return localStorage.getItem(config.token_id)!;
  }
}

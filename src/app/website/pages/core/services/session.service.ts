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
export class SesionService {
  [x: string]: any;

  private session!: Session;

  constructor(
    private router: Router,
  ) { }

  getAppVersion(): any {
    return "1.0.253";
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

  public setLoggedIn(isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.session = this.session == null ? {} as Session : this.session;
            this.session.isLoggedIn = true;
            localStorage.setItem(config.session_id, JSON.stringify(this.session));
        } else {
            this.session = {} as Session;
            localStorage.removeItem(config.session_id);
            localStorage.removeItem('refresh');
            localStorage.removeItem(config.token_id);

        }
    }

  public setAuthToken(token: string) {
    localStorage.setItem(config.token_id, token);
  }

  public setRefreshToken(refreshToken: string) {
    localStorage.setItem('refresh', refreshToken);
  }

  public setConfiguracionMap(configMap: any) {
    this.session.configuracion = configMap;
    localStorage.setItem(config.session_id, JSON.stringify(this.session));
  }

  public setPermisosMap(permisosMapa: any) {
    this.session.permisosMap = permisosMapa;
    localStorage.setItem(config.session_id, JSON.stringify(this.session));
  }

  public getPermisosMap(): any {
    if (this.session == null) {
        this.session = <Session>JSON.parse(localStorage.getItem(config.session_id)!);
        if (this.session == null) return null;
    }
    return this.session.permisosMap;
  }

  public getRefreshToken(): string {
    return localStorage.getItem('refresh')!;
  }
  public getToken(): string | null{
    if (this.session == null) {
        this.session = <Session>JSON.parse(localStorage.getItem(config.session_id)!);
        if (this.session == null) return null;
    }
    return this.session.token;
}

public getConfigParam(codigo: string) {
  let map = this.getConfiguracionMap();
  if (map == null || this.getConfiguracionMap()[codigo] == null) {
      switch (codigo) {
          case 'APROB_INVEST_OBSERV': return 'true';
          case 'FORM_PART_INVST': return 'true';
          case 'FORM_COSTOS_INVST': return 'true';
          case 'NOMB_MOD_INP': return 'Inspecciones';
          case 'NOMB_MOD_AUC': return 'Observaciones';
          case 'NOMB_MOD_COP': return 'COPASST';
          case 'NOMB_MOD_SEC': return 'Seguimiento y control';
          case 'NOMB_MOD_IND': return 'Indicadores';
          case 'NUM_MAX_FOTO_INP': return '3';
      }
      return null;
  } else {
      return this.getConfiguracionMap()[codigo].valor;
  }

}

public isLoggedIn(): boolean{
  try {
    if(this.session === null || this.session === undefined || localStorage.getItem(config.session_id) === null){
      this.session = <Session>JSON.parse(localStorage.getItem(config.session_id) ?? 'null');
      if(this.session === null) return false;
    }
    return this.session.isLoggedIn;
  } catch (error) {
    return false;
  }
}

public getConfiguracionMap(): any {
  if (this.session == null) {
      this.session = <Session>JSON.parse(localStorage.getItem(config.session_id)!);
      if (this.session == null) return null;
  }
  return this.session.configuracion;
}

}

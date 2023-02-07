import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInt } from 'src/app/httpInt';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { MensajeUsuarioService } from '../../comun/services/mensaje-usuario.service';
import { SesionService } from '../../core/services/session.service';
import { ListaInspeccion } from '../entities/lista-inspeccion';

@Injectable({
  providedIn: 'root'
})
export class ListaInspeccionService extends CRUDService<ListaInspeccion>{

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

  
}

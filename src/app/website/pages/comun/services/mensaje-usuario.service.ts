import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MensajeUsuario } from '../entities/mensaje-usuario';

@Injectable({
  providedIn: 'root'
})
export class MensajeUsuarioService {

  private subject = new Subject<MensajeUsuario>();

  constructor() { }

  showMessage(message: MensajeUsuario) {
    this.subject.next(message);
  }

  getMessage(): Observable<MensajeUsuario> {
    return this.subject.asObservable();
  }
}

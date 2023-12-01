import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MensajeUsuario } from '../entities/mensaje-usuario';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MensajeUsuarioService {

  private subject = new Subject<MensajeUsuario>();

  constructor(private messageService: MessageService) { }

  showMessage(message: MensajeUsuario) {
    this.subject.next(message);
  }

  showMessageToast(message: MensajeUsuario) {

     this.messageService.add({key: 'appToast',
     severity: message.tipoMensaje, 
     detail: message.detalle, 
     summary: message.mensaje, 
     life: 6000
    //  sticky: true
    });

  }

  getMessage(): Observable<MensajeUsuario> {
    return this.subject.asObservable();
  }
}

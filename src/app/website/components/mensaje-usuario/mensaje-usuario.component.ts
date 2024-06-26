import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MensajeUsuarioService } from 'src/app/website/pages/comun/services/mensaje-usuario.service';
import { MensajeUsuario } from 'src/app/website/pages/comun/entities/mensaje-usuario';
import { Message } from 'primeng/api';

@Component({
  selector: 's-mensaje-usuario',
  templateUrl: './mensaje-usuario.component.html',
  styleUrls: ['./mensaje-usuario.component.scss']
})
export class MensajeUsuarioComponent implements OnDestroy {


  subscription: Subscription;
  visible?: boolean;
  message?: MensajeUsuario
  msgs?: Message[];
  backingClass?: string;

  constructor(private mensajeUsuarioService: MensajeUsuarioService) {
    this.subscription = this.mensajeUsuarioService.getMessage().subscribe(message => {
      this.msgs = [];
      this.msgs.push({ summary: message.mensaje, detail: message.detalle, severity: message.tipoMensaje });
      this.backingClass = "visible";
    });
  }

  hide() {
    this.backingClass = "invisible";
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}

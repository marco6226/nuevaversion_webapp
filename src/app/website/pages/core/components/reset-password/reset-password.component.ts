import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  IsVisible: boolean = false;
  formLogin: FormGroup;
  visibleLnkResetPasswd = true;
 
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ){
    this.formLogin = fb.group({
      'correo': [null, Validators.required],
    });
  }

  async reset(value: any){
    // debugger
    this.messageService.add({ severity: 'info', detail: 'Ha solicitado restaurar su contraseña, por favor espere ', summary: 'Solicitando...', key: 'appToast', life: 5000 });
    
    let email = value.correo;
        if (email == null || email == '') {
            this.messageService.add({ severity: 'warn', summary: 'Correo electrónico requerido', detail: 'Debe especificar el correo electrónico de la cuenta de usuario', key: 'appToast', life: 5000 });
            return;
        }
        this.visibleLnkResetPasswd = false;
        this.authService.resetPasswd(email).then(
            (resp: any) => {
                this.messageService.add({ severity: resp['tipoMensaje'], detail: resp['detalle'], summary: resp['mensaje'], key: 'appToast', life: 5000});
                this.IsVisible = true;
                this.router.navigate(['login']); 
                this.IsVisible = false;
            }
        ).catch((err: any) => {
          console.log(typeof err, err);
          if(err.status === 0){
            this.messageService.add({ severity: 'error', detail: 'No se pudo establecer conexión con el servidor', summary: 'Error de conexión', key: 'appToast', life: 5000});
            this.visibleLnkResetPasswd = true;
          } else {
            this.messageService.add({ severity: err.error['tipoMensaje'], detail: err.error['detalle'], summary: err.error['mensaje'], key: 'appToast', life: 5000 });
            this.visibleLnkResetPasswd = true;
          }
        });
  }

}

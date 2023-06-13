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
    console.log(value)
    this.messageService.add({ severity: 'info', detail: 'Ha solicitado restaurar su contraseña, por favor espere ', summary: 'Solicitando...' });
    
    let email = value.correo;
        if (email == null || email == '') {
            this.messageService.add({ severity: 'warn', summary: 'Correo electrónico requerido', detail: 'Debe especificar el correo electrónico de la cuenta de usuario' });
            return;
        }
        this.visibleLnkResetPasswd = false;
        await this.authService.resetPasswd(email).then(
            (resp: any) => {
                this.messageService.add({ severity: resp['tipoMensaje'], detail: resp['detalle'], summary: resp['mensaje'] });
                this.IsVisible = true
                setTimeout(() => {
                  this.router.navigate(['login']); 
                  this.IsVisible = false

                }, 1200);
            }
        ).catch((err: any) => {
            this.messageService.add({ severity: err.error['tipoMensaje'], detail: err.error['detalle'], summary: err.error['mensaje'] });
            this.visibleLnkResetPasswd = true;
        });
  }

}

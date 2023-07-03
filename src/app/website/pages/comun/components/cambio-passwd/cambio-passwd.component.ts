import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { CambioPasswdService } from '../../services/cambio-passwd.service';
import { PasswordValidator } from '../../validators/password-validator';

@Component({
  selector: 'app-cambio-passwd',
  templateUrl: './cambio-passwd.component.html',
  styleUrls: ['./cambio-passwd.component.scss'],
  providers: [UsuarioService]
})
export class CambioPasswdComponent implements OnInit {

  form!: FormGroup;
  visible: boolean = true;
  subscription!: Subscription;
  password: any;
  passwordNew: any;
  passwordConfirm: any;
  show = false;
  showNew = false;
  showConfirm = false;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private usuarioService: UsuarioService,
    private cambioPasswdService: CambioPasswdService
  ) {
    debugger
    this.subscription = this.cambioPasswdService.getObservable().subscribe(visible => this.visible = visible);
    

    this.form = fb.group({
      'oldPasswd': [null, Validators.required],
      'newPasswd': [null, [Validators.required, PasswordValidator.validatePassword]],
      'newPasswdConfirm': [null, Validators.required]
    });
   }

  async ngOnInit(): Promise<void> {
    
    this.subscription = await this.cambioPasswdService.getObservable().subscribe(visible => this.visible = visible);

    this.password = 'password';
    this.passwordNew = 'password';
    this.passwordConfirm = 'password';
  }

  onSubmit(value: any) {
    this.usuarioService.cambiarPasswd(value.newPasswd, value.newPasswdConfirm, value.oldPasswd).then(
      resp => {
        this.form.reset();
        this.visible = false;
      }
    );
  }

  mostrar() {
		if (this.password === 'password') {
		  this.password = 'text';
		  this.show = true;
		} else {
		  this.password = 'password';	
		  this.show = false;
		}
	  }

    mostrarNueva() {
      if (this.passwordNew === 'password') {
        this.passwordNew = 'text';
        this.showNew = true;
      } else {
        this.passwordNew = 'password';	
        this.showNew = false;
      }
      }

      mostrarConfirm() {
        if (this.passwordConfirm === 'password') {
          this.passwordConfirm = 'text';
          this.showConfirm = true;
        } else {
          this.passwordConfirm = 'password';	
          this.showConfirm = false;
        }
        }

}

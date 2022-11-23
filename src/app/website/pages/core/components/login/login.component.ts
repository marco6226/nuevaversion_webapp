import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  typePassword = 'password';
  isPassword: boolean = true;
  version!:string;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sesionService: SessionService,
    private authService: AuthService,
  ) { 
    this.formLogin = fb.group({
      'correo': [null, Validators.required],
      'password': [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.version = this.sesionService.getAppVersion();

    // if (this.sesionService.getEmpresa() != null && this.sesionService.getUsuario() != null) {
      this.router.navigate([this.authService.redirectUrl]);
    // } else {
    //     let countDown = Number(localStorage.getItem('countDown'));
    //     if (countDown != null && countDown > 0) {
    //         this.contadorFallas = 5;
    //         this.iniciarContador(countDown);
    //     }
    // }

  }

  tooglePsw(){
    this.isPassword = !this.isPassword;
    if (this.isPassword) {
      this.typePassword = 'password';
    } else {
      this.typePassword = 'text';      
    }
  }

  login(){    
    // this.route.navigate(['app/home']);   
  }

}

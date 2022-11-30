import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  @Input() visible: boolean = true;

  subscription: Subscription;

  formLogin: FormGroup;
  typePassword = 'password';
  isPassword: boolean = true;
  version!:string;
  contadorFallas = 0;
  relojText!: string;
  msgs: Message[] = [];
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sesionService: SessionService,
    private authService: AuthService,
  ) { 
    this.subscription = this.authService.getLoginObservable().subscribe(visible => this.setVisible(visible));
    this.formLogin = fb.group({
      'correo': [null, Validators.required],
      'password': [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.version = this.sesionService.getAppVersion();

    if (this.sesionService.getEmpresa() != null && this.sesionService.getUsuario() != null) {
      this.router.navigate([this.authService.redirectUrl]);
    } 
    else {
        let countDown = Number(localStorage.getItem('countDown'));
        if (countDown != null && countDown > 0) {
            this.contadorFallas = 5;
            this.iniciarContador(countDown);
        }
    }

  }

  tooglePsw(){
    this.isPassword = !this.isPassword;
    if (this.isPassword) {
      this.typePassword = 'password';
    } else {
      this.typePassword = 'text';      
    }
  }

  async validate(value: any) {
    let res: any;
    try {
      await this.authService.checkisLoginExist(value.username, value.passwd);
      res = await this.authService.checkisLoginExist(value.username, value.passwd);


        if (res.exit == "true") {
            if (confirm('Se perderan los cambios no guardados de sus otras sesiones')) {
                // Save it!
                this.login(value);
            }
        } else {
            this.login(value);
        }
    } catch (error: any) {
        if (error.status === 400) res = { exit: "false" }
    }
  }

  async login(value: any){    
    // this.route.navigate(['app/home']);   
    console.log(value);
    debugger
    var xc= await this.authService.login(value.correo, value.password, value.recordar, value.pin);
    console.log(xc);
    
  }

  iniciarContador(countDown: number) {
    localStorage.setItem('countDown', '' + countDown);
    let interval = window.setInterval(() => {
        let now = new Date().getTime();
        let distance = countDown - now;
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        this.relojText = minutes + "m " + seconds + "s ";
        if (distance < 0) {
            clearInterval(interval);
            this.contadorFallas = 0;
            localStorage.removeItem('countDown');
        }
    }, 1000);
  }

  setVisible(visible: boolean) {
    this.msgs = [];
    this.msgs.push({ severity: 'warn', detail: "Se cerro su sesion inicie de nuevo por favor" });

    this.visible = visible;
  }
 
}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SesionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  @Input() visible: boolean = true;

  subscription: Subscription;
  IsVisible: boolean = false;
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
    private sesionService: SesionService,
    private authService: AuthService,
    private messageService: MessageService,
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
    console.log(value);
    this.IsVisible = true;
    try {
      await this.authService.login(value.correo, value.password, value.recordar, value.pin).then(res =>{
        debugger
        let aceptaTerm = this.authService.sesionService.getUsuario()!.fechaAceptaTerminos != null;
        if (aceptaTerm) {
          this.router.navigate(['app/home']); 
          this.IsVisible = false;   
        } else {
          //mostrar acepTerm
        }
      });      
    } catch (error) {      
      console.log(error);
      this.IsVisible = false;      
    }
    
    
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
    this.messageService.add({severity:'warn', summary: 'pro', detail: 'Se cerro su sesion inicie de nuevo por favor'});
    this.visible = visible;
  }
 
}

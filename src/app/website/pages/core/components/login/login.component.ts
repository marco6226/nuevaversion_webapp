import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { MensajeUsuario } from '../../../comun/entities/mensaje-usuario';
import { AuthGuardService } from '../../services/auth-guard.service';
import { AuthService } from '../../services/auth.service';
import { SesionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthGuardService]
})
export class LoginComponent implements OnInit, AfterViewInit {
  
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
  intentosMax = 5;
  visiblePinForm = false;
  flag:boolean=true
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sesionService: SesionService,
    private authService: AuthService,
    private messageService: MessageService,
    private authGuardService: AuthGuardService
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
    
    setTimeout(() => {
      this.correo=this.formLogin.value['correo']
      this.flag=false
      setTimeout(() => {
        this.flag=true
      }, 100);
    }, 500);
  }

  correo: string = '';

  ngAfterViewInit(): void {
    if(localStorage.getItem('url')) this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'Debe iniciar sesión para acceder a esta ruta.', life: 5000});
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
    this.IsVisible = true;
    try {

      await this.authService.login(value.correo, value.password, value.recordar, value.pin).then(res =>{
        
        let aceptaTerm = this.authService.sesionService.getUsuario()!.fechaAceptaTerminos != null;
        if (aceptaTerm) {
          this.authService.onLogin(res);
          let url: string | null = localStorage.getItem('url');
          this.router.navigate([url ?? 'app/home']);
          localStorage.removeItem('url');
          this.IsVisible = false;   
        } else {
          let url = this.authGuardService.Geturl();
          this.router.navigate([aceptaTerm ? url : '/app/terminos']);
          this.authGuardService.Seturl('/app/home');
        }
      });      
    } catch (err: any) {      
      this.IsVisible = false;      
      this.msgs = [];
            if (err['name'] != null && err['name'] == 'TimeoutError') {
                this.messageService.add({severity:'warn', summary: 'CONEXIÓN DEFICIENTE', detail: 'La conexión está tardando mucho tiempo en responder, la solicitud ha sido cancelada. Por favor intente mas tarde.'});
                return;
            }
            let msg: MensajeUsuario = err.error;
            switch (err.status) {
                case 403:
                    this.messageService.add({severity:'error', summary: 'CREDENCIALES INCORRECTAS', detail: 'El usuario o contraseña especificada no son correctas'});
                    break;
                case 401:                        
                    if (msg.codigo == 2_007) {
                        this.visiblePinForm = true;
                    }
                    if (msg.codigo == 2_009) {
                        this.contadorFallas = this.intentosMax;
                    }
                    this.messageService.add({ severity: msg.tipoMensaje, summary: msg.mensaje, detail: msg.detalle });
                    break;
                case 400:
                    this.messageService.add({ severity: msg.tipoMensaje, summary: msg.mensaje, detail: msg.detalle });
                    break;
                default:
                    this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Se ha generado un error no esperado' });
                    break;
            }
            this.contadorFallas += 1;
            if (this.contadorFallas >= this.intentosMax) {
                this.iniciarContador(new Date().getTime() + (2 * 60 * 1000));
            }
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

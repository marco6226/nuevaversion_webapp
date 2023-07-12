import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from 'src/app/website/pages/core/services/auth.service';
import { Router } from '@angular/router';
import { CambioPasswdService } from 'src/app/website/pages/comun/services/cambio-passwd.service';
import { MensajeUsuario } from 'src/app/website/pages/comun/entities/mensaje-usuario';
import { SesionService } from 'src/app/website/pages/core/services/session.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  inflightAuthRequest!: Observable<HttpEvent<any>>;

  constructor(
        public sesionService: SesionService,
        private router: Router,
        private authService: AuthService,
        public cambioPasswdService: CambioPasswdService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // debugger
    return next.handle(request).pipe(
      // tap({
      //   next: () => null,
      //   error: async (err: HttpErrorResponse) => {
      //     let tokenError: any[] = [

      //     ] 
      //     if ([401].includes(err.status) && err.error.codigo !== 2_001){
      //       await this.authService.logout();
      //       this.router.navigate(['/login']); 
      //     } else {
      //       this.getObservable(err.error, err, request, next);
      //     }
      //   }
      // })
      catchError(error => {
        let msg: MensajeUsuario;
        if(request.params !== null && request.responseType === 'blob'){
          // Si el tipo de respuesta es blob, se retorna un obsevable directamente
          return new Observable<HttpEvent<any>>(observer => {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                msg = JSON.parse(<string>reader.result);
              } catch (error) {
                msg = {tipoMensaje: 'error', mensaje: 'Error inesperado', detalle: <string>reader.result};
              }
              observer.next();
              observer.complete();
            };
            reader.readAsText(error.error);
          }).pipe( // Se reemplaza switchMap por pipe para encadenar los operadores de forma más legible  
            switchMap(resp => this.getObservable(msg, error, request, next))
          )
        } else {
          msg = error.error;
          return this.getObservable(msg, error, request, next);
        }
      })
    )
  }

  getObservable(msg: MensajeUsuario, error: any, req: HttpRequest<any>, next: { handle: (arg0: HttpRequest<any>) => any; }): Observable<HttpEvent<any>> {
    switch (msg.codigo) {
        case 1_001:
            this.authService.logout();               
                
                setTimeout(() => {
                    this.router.navigate(['login']);
                }, 1000);
           
            if (!this.inflightAuthRequest) {
                this.inflightAuthRequest = this.authService.refreshToken();
                if (!this.inflightAuthRequest) {
                    return throwError(error);
                }
            }
            return <Observable<HttpEvent<any>>>this.inflightAuthRequest.pipe(
                switchMap(res => {
                    // unset inflight request
                    // this.inflightAuthRequest = null;

                    // clone the original request
                    let paramEmp = req.headers.get('param-emp') != null ? '' + req.headers.get('param-emp') : '';
                    let headers = new HttpHeaders({
                        'authorization': this.sesionService.getBearerAuthToken(),
                        'param-emp': paramEmp,
                        // 'content-type': req.headers.get('content-type'),
                        'app-version': this.sesionService.getAppVersion()
                    });
                    let authReqRepeat = req.clone({ headers });
                    return next.handle(authReqRepeat);
                })
            );
        case 2_001:
            // this.mensajeUsuarioService.showMessage({
            //     mensaje: 'Contraseña expirada',
            //     detalle: 'Su contraseña ha expirado, por favor realice el cambio',
            //     tipoMensaje: 'warn'
            // });
            this.cambioPasswdService.setVisible(true);
            return <Observable<HttpEvent<any>>>this.cambioPasswdService.getSubmitObservable().pipe(
                switchMap(res => {
                    // clone the original request
                    const authReqRepeat = req.clone();
                    return next.handle(authReqRepeat);
                })
            );
        default:
            return throwError(error);
    }
  }
}

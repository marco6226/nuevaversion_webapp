import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, ObservableInput, tap } from 'rxjs';
import { AuthService } from 'src/app/website/pages/core/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // debugger
    return next
    .handle(request)
    .pipe(
      tap({
        next: () => null,
        error: (err: HttpErrorResponse) =>{
          // debugger
          console.log(err.status)
          if ([401, 403].includes(err.status)){
            this.authService.logout();
            this.router.navigate(['/login']); 
          }
        }
      })
    )
    // .pipe(catchError((err: Response) => {
    //   if ([401, 403].includes(err.status)) {
    //       // auto logout if 401 or 403 response returned from api
    //       this.authService.logout();
    //   }
    // }))
  }
}
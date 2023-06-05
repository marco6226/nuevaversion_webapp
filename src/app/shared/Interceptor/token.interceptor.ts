import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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
        error: async (err: HttpErrorResponse) =>{
          if ([401].includes(err.status)){
            await this.authService.logout();
            this.router.navigate(['/login']); 
          }
        }
      })
    )
  }
}

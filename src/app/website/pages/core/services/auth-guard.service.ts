import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { SesionService } from './session.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    datourl= '/app/home';

    constructor(private authService: AuthService, private router: Router, private activateRoute: ActivatedRoute, private sessionService: SesionService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        if (this.sessionService) return true;
        localStorage.setItem('url', url);
        this.authService.redirectUrl = url;
        this.datourl = url
        this.router.navigate(['/login']);
        return false;
    }

    
    Geturl (){        
        return this.datourl;
    }

    Seturl(url: string){        
        this.datourl = url;
    }

}

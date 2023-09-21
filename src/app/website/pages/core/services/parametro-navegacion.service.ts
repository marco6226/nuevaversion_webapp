import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
export class ParametroNavegacionService {

    constructor(
        private router: Router
    ) {

    }

    public accion: any;
    public parametro: any;

    public accion2: any;
    public parametro2: any;

    setParametro<T>(param: T) {
        this.parametro = param;
    }

    getParametro<T>(): T {
        return this.parametro;
    }

    setParametro2<T>(param: T) {
        this.parametro2 = param;
    }

    getParametro2<T>(): T {
        return this.parametro2;
    }

    setAccion<T>(param: T) {
        this.accion = param;
    }

    getAccion<T>(): T {
        return this.accion;
    }

    setAccion2<T>(param: T) {
        this.accion2 = param;
    }

    getAccion2<T>(): T {
        return this.accion2;
    }

    redirect(url: string) {
        this.router.navigate(
            [url]
        );
    }

    reset() {
        this.accion = null;
        this.parametro = null;
    }
}
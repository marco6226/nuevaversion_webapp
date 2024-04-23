import { Injectable } from '@angular/core';
import { HttpInt } from 'src/app/httpInt'
import { endPoints } from 'src/environments/environment'
import { MensajeUsuario } from '../../comun/entities/mensaje-usuario';
import { MensajeUsuarioService } from 'src/app/website/pages/comun/services/mensaje-usuario.service'
// import { deprecate } from 'util';
import { map, Observable, retryWhen } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class ComunService {

    constructor(
        private httpInt: HttpInt,
        private mensajeUsuarioService: MensajeUsuarioService
    ) { }

    findAllArl() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_arl)
                .subscribe(
                    (res: unknown) => {
                        resolve(res);
                    }
                    ,
                    (err: any) => this.manageError(err)
                )
                map((res: any) => res)
        });
    }

    findAllAfp() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_afp)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
                map(res => res)
        });
    }

    findAllEps() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_eps)
                .subscribe(
                    (res: unknown) => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
                map(res => res)
        });
    }

    findAllJuntas() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_JuntaRegional)
                .subscribe(
                    (res: unknown) => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
                map(res => res)
        });
    }

    

    findAllPrepagadas() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_prepagadas)
                .subscribe(
                    (res: unknown) => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
                map(res => res)
        });
    }


    findAllProvSalud() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_provsalud)
                .subscribe(
                    (res: unknown) => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
                map(res => res)
        });
    }

    findAllCcf() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_ccf)
                .subscribe(
                    (res: unknown) => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
                map(res => res)
        });
    }

    findAllCiiu() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_ciiu)
                .subscribe(
                    (res: unknown) => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
                map(res => res)
        });
    }

    findAllPais() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_pais)
                .subscribe(
                    (res: unknown) => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
                map(res => res)
        });
    }

    findDepartamentoByPais(paisId: string) {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_departamento + "pais/" + paisId)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
                map(res => res)
        });
    }

    /**
    * @deprecated Obsoleto en favor de implementación en servicio esclusivo para la entidad ciudad
    */
    findCiudadByDepartamento(departamentoId: string) {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.CiudadService + "departamento/" + departamentoId)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
                map(res => res)
        });
    }

    /**
    * @deprecated Obsoleto en favor de implementación en servicio esclusivo para la entidad ciudad
    */
    findCiudadById(ciudadId: string) {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.CiudadService + ciudadId)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
                map(res => res)
        });
    }

    /**
    * @deprecated Obsoleto en favor de implementación en servicio esclusivo para la entidad ciudad
    */
    findAllCiudad() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.CiudadService)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
                map(res => res)
        });
    }

    buscarCie(parametro: string) {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_cie + "buscar/" + parametro)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
                map(res => res)
        });
    }

    manageError(err: any) {
        let msg: MensajeUsuario;
        try {
            msg = <MensajeUsuario>err;
        } catch (error) {
            msg = { tipoMensaje: 'error', mensaje: 'Error Inesperado', detalle: err };
        }
        this.mensajeUsuarioService.showMessage({
            mensaje: msg.mensaje,
            detalle: msg.detalle,
            tipoMensaje: msg.tipoMensaje
        });
    }

}

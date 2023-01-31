import { Injectable } from '@angular/core';
import { HttpInt } from 'src/app/httpInt';
import { endPoints } from 'src/environments/environment';
// import { HttpInt } from 'app/httpInt'
// import { endPoints } from 'environments/environment'
import { MensajeUsuario } from '../entities/mensaje-usuario';
import { MensajeUsuarioService } from './mensaje-usuario.service';
// import { MensajeUsuarioService } from 'app/modulos/comun/services/mensaje-usuario.service'
// import { deprecate } from 'util';

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
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
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
        });
    }

    findAllEps() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_eps)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
        });
    }

    findAllPrepagadas() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_prepagadas)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
        });
    }


    findAllProvSalud() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_provsalud)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
        });
    }

    findAllCcf() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_ccf)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
        });
    }

    findAllCiiu() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_ciiu)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
        });
    }

    findAllPais() {
        return new Promise(resolve => {
            this.httpInt.get(endPoints.com_pais)
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
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
        });
    }

    manageError(err: any) {
        //console.log(err);
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

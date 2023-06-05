import { Injectable } from "@angular/core";
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { Observacion } from "src/app/website/pages/observaciones/entities/observacion";
import { AuthService } from 'src/app/website/pages/core/services/auth.service';

@Injectable({
    providedIn: 'root'
  })
export class ObservacionService extends CRUDService<Observacion> {

    private authService?: AuthService;
    msgs = [];

    aceptarObservacion(observacion: Observacion) {
        let body = JSON.stringify(observacion);
        return new Promise((resolve) => {
            this.httpInt
                .put(this.end_point + "aceptar", body)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    denegarObservacion(observacion: Observacion) {

        let body = JSON.stringify(observacion);
        return new Promise((resolve) => {
            this.httpInt
                .put(this.end_point + "denegar", body)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        }).then((param) => {});
    }

    getClassName(): string {
        return "ObservacionService";
    }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { endPoints } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class SeguimientosService {

    headers?:any;

    constructor(
        private http: HttpClient,
        public sesionService: SesionService,) { }

    public getSegByTareaID(id:any) {
        return this.http.get(`${endPoints.tareaService}follow/${id}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    public createSeg(seg:any) {
        return this.http.post(`${endPoints.tareaService}follow`, seg, this.getRequestHeaders(this.headers)).toPromise();
    }

    public getEvidences(id:any, type:any) {
        return this.http.get(`${endPoints.tareaService}follow/download/${id}/${type}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    public closeTarea(tarea:any) {
        return this.http.put(`${endPoints.tareaService}tarea/close`, tarea, this.getRequestHeaders(this.headers)).toPromise();
    }

    getRequestHeaders(headers?: HttpHeaders): any {
        if (headers == null)
            headers = new HttpHeaders().set('Content-Type', 'application/json');

        //if (this.sesionService.getToken() != null)
        //headers = headers.set('Authorization', this.sesionService.getToken());

        headers = headers
            .set('Param-Emp', this.sesionService.getParamEmp())
            .set('app-version', this.sesionService.getAppVersion())
            .set('Authorization', this.sesionService.getBearerAuthToken());
        return { 'headers': headers };
    }
}

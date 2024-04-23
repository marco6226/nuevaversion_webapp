import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInt } from 'src/app/httpInt';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { endPoints } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class SeguimientosService {

    headers?:any;

    constructor(
        private http: HttpClient,
        public httpInt: HttpInt,
        public sesionService: SesionService,) { }

    public getSegByTareaID(id:any) {

        let key = CryptoJS.SHA256(this.httpInt.getSesionService().getBearerAuthToken()).toString(CryptoJS.enc.Hex).substring(0, 32);
        
        let encryptedId = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(id), CryptoJS.enc.Hex.parse(key), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          }).toString();
        
        let endPoint = `${endPoints.tareaService}follow/`;
        return new Promise(async (resolve) => {
            let options: any = {
                responseType: 'blob',
                headers: new HttpHeaders()
                    .set('Param-Emp', this.httpInt.getSesionService().getParamEmp())
                    .set('app-version', this.httpInt.getSesionService().getAppVersion())
                    .set('Authorization', this.httpInt.getSesionService().getBearerAuthToken()),
                withCredentials: true,
                
            };
            

            let formData: FormData = new FormData();
            formData.append('data', encryptedId);
            

            await this.httpInt.http
                .post(endPoint, formData, options)
                .subscribe(
                    (res) => {
                        resolve(res);
                    }
                );
        });

        // return this.http.get(`${endPoints.tareaService}follow/${id}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    public createSeg(seg:any) {
        return this.http.post(`${endPoints.tareaService}follow`, seg, this.getRequestHeaders(this.headers)).toPromise();
    }

    public getEvidences(id:any, type:any) {
        return this.http.get(`${endPoints.tareaService}follow/download/${id}/${type}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    public closeTarea(tarea:any) {

        let key = CryptoJS.SHA256(this.httpInt.getSesionService().getBearerAuthToken()).toString(CryptoJS.enc.Hex).substring(0, 32);
        
        let encryptedId = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(tarea), CryptoJS.enc.Hex.parse(key), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          }).toString();
        
        let endPoint = `${endPoints.tareaService}tarea/close`;
        
        return new Promise(async (resolve) => {
            let options: any = {
                responseType: 'blob',
                headers: new HttpHeaders()
                    .set('Param-Emp', this.httpInt.getSesionService().getParamEmp())
                    .set('app-version', this.httpInt.getSesionService().getAppVersion())
                    .set('Authorization', this.httpInt.getSesionService().getBearerAuthToken()),
                withCredentials: true,
                
            };
            

            let formData: FormData = new FormData();
            formData.append('data', encryptedId);

            return await this.httpInt.http
                .put(endPoint, formData, options)
                .subscribe(
                    (res) => {
                        resolve(res);
                    }
                );
        });


        // return this.http.put(`${endPoints.tareaService}tarea/close`, tarea, this.getRequestHeaders(this.headers)).toPromise();
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


import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SesionService } from './website/pages/core/services/session.service';

@Injectable()
export class HttpInt {

    constructor(
        public http: HttpClient,
        private sesionService: SesionService
    ){}

    get(url: string, headers?: HttpHeaders): Observable<Object> {
        console.log(this.getRequestHeaders(headers));
        
        return this.http.get(url, this.getRequestHeaders(headers));
    }

    post(url: string, body: any, headers?: HttpHeaders): Observable<Object> {
        return this.http.post(url, body, this.getRequestHeaders(headers));
    }

    postFile(url: string, body: any, headers?: HttpHeaders): Observable<Object> {
        headers = new HttpHeaders();
        return this.http.post(url, body, this.getRequestHeaders(headers));
    }

    put(url: string, body: any, headers?: HttpHeaders): Observable<Object> {
        return this.http.put(url, body, this.getRequestHeaders(headers));
    }

    delete(url: string, headers?: HttpHeaders): Observable<Object> {
        return this.http.delete(url, this.getRequestHeaders(headers));
    }

    getRequestHeaders(headers?: HttpHeaders): any {
        if (headers == null)
            headers = new HttpHeaders().set('Content-Type', 'application/json');

        headers = headers
            .set('Param-Emp', this.sesionService.getParamEmp())
            .set('app-version', this.sesionService.getAppVersion())
            .set('Authorization', this.sesionService.getBearerAuthToken());
        return { 'headers': headers };
    }

    getSesionService() {
        return this.sesionService;
    }   
}

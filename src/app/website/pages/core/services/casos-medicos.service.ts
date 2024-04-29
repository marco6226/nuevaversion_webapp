import { Reintegro, ReintegroCreate } from '../../scm/entities/reintegro.interface';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SesionService } from './session.service';
import { endPoints } from 'src/environments/environment';
import { FilterQuery } from '../entities/filter-query';

@Injectable({
    providedIn: "root"
})
export class CasosMedicosService {

    headers: any;
    constructor(private http: HttpClient, private sesionService: SesionService) {}

    create(casoMedico: any) {
        return this.http.post(`${endPoints.scm}`, casoMedico, this.getRequestHeaders(this.headers)).toPromise();
    }

    edit(casoMedico: any) {
        return this.http.put(`${endPoints.scm}`, casoMedico, this.getRequestHeaders(this.headers)).toPromise();
    }

    getCase(id: string | number) {
        return this.http.get(`${endPoints.scm}case/${id}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getCaseList(document: string | number): any {
        return this.http.get<any[]>(`${endPoints.scm}validate/${document}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getAll() {
        return this.http.get(`${endPoints.scm}all`, this.getRequestHeaders(this.headers)).toPromise();
    }


    ausentismos(documento: string | number): any {
        return this.http.get<[]>(`${endPoints.scm}scmausentismo/${documento}`, this.getRequestHeaders(this.headers)).toPromise();

    }

    changeEstadoById(id: number){
        return new Promise((resolve, reject) => {
            this.http.put(`${endPoints.scm}cambiarEstado/${id}`, null, this.getRequestHeaders(this.headers))
            .subscribe(
                res => {
                    resolve(res);
                },
                err => {
                    reject(err);
                }
            )
        });
    }

    //Recomendations APis
    getRecomendations(documento: string | number): any {
        return this.http.get<[]>(`${endPoints.scm}recomendation/${documento}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    createRecomendation(recomendation: any) {
        return this.http.post(`${endPoints.scm}recomendation`, recomendation, this.getRequestHeaders(this.headers)).toPromise();
    }

    updateRecomendation(recomendation: any) {
        return this.http.put(`${endPoints.scm}recomendation`, recomendation, this.getRequestHeaders(this.headers)).toPromise();
    }

    deleteRecomendation(id: string | number) {
        return this.http.put(`${endPoints.scm}recomendation/${id}`, {}, this.getRequestHeaders(this.headers)).toPromise();
    }

    //DiagnosticoApi
    deleteDiagnosticos(id: string | number) {
        return this.http.put(`${endPoints.scm}diagnosticos/${id}`, {}, this.getRequestHeaders(this.headers)).toPromise();
    }

    getDiagnosticos(documento: string | number): any {
        return this.http.get<[]>(`${endPoints.scm}diagnosticos/${documento}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    createDiagnosticos(diagnosticos: any) {
        return this.http.post(`${endPoints.scm}diagnosticos`, diagnosticos, this.getRequestHeaders(this.headers)).toPromise();
    }

    updateDiagnosticos(diagnosticos: any) {
        return this.http.put(`${endPoints.scm}diagnosticos`, diagnosticos, this.getRequestHeaders(this.headers)).toPromise();
    }

    getLogs(documento: string | number): any {
        return this.http.get<[]>(`${endPoints.scm}logs/${documento}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getSistemasAFectados(): any {
        return this.http.get<[]>(`${endPoints.scm}sistemaafectado/`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getSvelist(): any {
        return this.http.get<[]>(`${endPoints.scm}svelist/`, this.getRequestHeaders(this.headers)).toPromise();
    }

    createSeguimiento(seg: any) {
        return this.http.post(`${endPoints.scm}seguimiento/`, seg, this.getRequestHeaders(this.headers)).toPromise();

    }
    
    createSeguimientogenerico(seg: any) {
        return this.http.post(`${endPoints.scm}seguimiento/`, seg, this.getRequestHeaders(this.headers)).toPromise();
    }

    updateSeguimiento(seguimientoCase: any) {
        return this.http.put(`${endPoints.scm}seguimiento/`, seguimientoCase, this.getRequestHeaders(this.headers)).toPromise();
    }

    updateSeguimientogenerico(seguimientoCase: any) {
        return this.http.put(`${endPoints.scm}seguimiento/`, seguimientoCase, this.getRequestHeaders(this.headers)).toPromise();
    }

    deleteSeguimiento(id: string | number) {
        return this.http.put(`${endPoints.scm}seguimiento/${id}`, {}, this.getRequestHeaders(this.headers)).toPromise();
    }

    getSeguimientos(documento: string | number): any {
        return this.http.get<any[]>(`${endPoints.scm}seguimiento/${documento}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getSeguimientosgenerico(documento: any): any {
        return this.http.get<any[]>(`${endPoints.scm}seguimiento/generico/${documento}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    /// Tratamientos
    createTratamiento(seg: any) {
        return this.http.post(`${endPoints.scm}tratamiento/`, seg, this.getRequestHeaders(this.headers)).toPromise();

    }

    updateTratamiento(seguimientoCase: any) {
        return this.http.put(`${endPoints.scm}tratamiento/`, seguimientoCase, this.getRequestHeaders(this.headers)).toPromise();

    }

    getTratamientos(documento: string | number): any {
        return this.http.get<any[]>(`${endPoints.scm}tratamiento/${documento}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    //PCL

    createPcl(pcl: any, diags:any[]): any {
        return this.http.post<[]>(`${endPoints.scm}pcl/`, {pcl, diags}, this.getRequestHeaders(this.headers)).toPromise();
    }

    getListPcl(pkcase: string | number): any {
        return this.http.get<[]>(`${endPoints.scm}pcl/${pkcase}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    // listPclAllDiags(pkcase: string | number): any {
    //     return this.http.get<any[]>(`${endPoints.scm}pclAllDiags/${pkcase}`, this.getRequestHeaders(this.headers)).toPromise();
    // }

    listPclAllDiags(pkcase: string | number, pclid: string | number): any {
         return this.http.get<any[]>(`${endPoints.scm}pclAllDiags/${pkcase}/${pclid}`, this.getRequestHeaders(this.headers)).toPromise();
    }

  

    updatePcl(Pcl: any) {
        return this.http.put(`${endPoints.scm}pcl/`, Pcl, this.getRequestHeaders(this.headers)).toPromise();
    }

    deletePcl(pcl: any) {
        return this.http.put(`${endPoints.scm}pcl/delete`, pcl, this.getRequestHeaders(this.headers)).toPromise();
    }

    //reintegro
    createReintegro(reintegro: ReintegroCreate){
        return this.http.post<[Reintegro]>(`${endPoints.scm}reintegro/`, reintegro, this.getRequestHeaders(this.headers)).toPromise();
    }

    getReintegroByCaseId(idCaso: string):any{
        return this.http.get<Reintegro>(`${endPoints.scm}reintegro/${idCaso}`, this.getRequestHeaders(this.headers))
    }

    getReintegroByCaseId2(idCaso: string):any{
        return this.http.get(`${endPoints.scm}reintegro/${idCaso}`, this.getRequestHeaders(this.headers))
    }

    editReintegro(reintegro: Reintegro){
        return this.http.put<[Reintegro]>(`${endPoints.scm}reintegro/`, reintegro, this.getRequestHeaders(this.headers))
    }
    // finish reintegro

    findByFilter(filterQuery: FilterQuery | null = null) {
        return this.http.get(`${endPoints.scm}` + '?' + this.buildUrlParams(filterQuery), this.getRequestHeaders(this.headers)).toPromise();


    }
    //aon
    getTokenAon() {
        return this.http.get<[]>(`${endPoints.scm}aon/`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getRegistersAon(token: string, cc?: string | number, fechai?: any, fechafi?: any,) {
        return this.http.get<[]>(`${endPoints.scm}aon/registers/${token}/${cc}/${fechai}/${fechafi}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    public buildUrlParams(filterQuery: FilterQuery | null): string {
        let urlParam = '';
        if (filterQuery == null) {
            return urlParam;
        }
        if (filterQuery.offset != null) {
            urlParam += 'offset=' + filterQuery.offset + '&';
        }
        if (filterQuery.groupBy != null) {
            urlParam += 'groupBy=' + filterQuery.groupBy + '&';
        }
        if (filterQuery.rows != null) {
            urlParam += 'rows=' + filterQuery.rows + '&';
        }
        if (filterQuery.count != null) {
            urlParam += 'count=' + filterQuery.count + '&';
        }
        if (filterQuery.sortField != null) {
            urlParam += 'sortField=' + filterQuery.sortField + '&';
        }
        if (filterQuery.sortOrder != null) {
            urlParam += 'sortOrder=' + filterQuery.sortOrder + '&';
        }
        if (filterQuery.filterList != null) {
            urlParam += 'filterList=' + encodeURIComponent(JSON.stringify(filterQuery.filterList)) + '&';
        }
        if (filterQuery.fieldList != null) {
            let fieldParam = 'fieldList=';
            filterQuery.fieldList.forEach(field => {
                fieldParam += field + ',';
            });
            fieldParam.slice(0, fieldParam.length - 1);
            urlParam += fieldParam;
        }
        if (urlParam[urlParam.length - 1] === '&') {
            urlParam = urlParam.slice(0, urlParam.length - 1);
        }
        return urlParam;
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
}

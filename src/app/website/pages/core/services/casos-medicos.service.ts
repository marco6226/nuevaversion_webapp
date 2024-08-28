import { Reintegro, ReintegroCreate } from '../../scm/entities/reintegro.interface';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SesionService } from './session.service';
import { endPoints } from 'src/environments/environment';
import { FilterQuery } from '../entities/filter-query';
import { Observable, from } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class CasosMedicosService {

    headers: any;
    constructor(private http: HttpClient, private sesionService: SesionService) { }

    create(casoMedico: any) {
        return this.http.post(`${endPoints.scm}`, casoMedico, this.getRequestHeaders(this.headers)).toPromise();
    }

    createDT(datosUsuario: any) {
        console.log('Datos a enviar en POST:', datosUsuario);
        return this.http.post(`${endPoints.scm}createDT`, datosUsuario, this.getRequestHeaders(this.headers)).toPromise();
    }

    createMail(data: any) {
        console.log('Datos a enviar en POST esto crea el mail:', data);
        return this.http.post(`${endPoints.scm}createMail`, data, this.getRequestHeaders(this.headers)).toPromise();
    }

    edit(casoMedico: any) {
        return this.http.put(`${endPoints.scm}`, casoMedico, this.getRequestHeaders(this.headers)).toPromise();
    }

    getCase(id: string | number) {
        return this.http.get(`${endPoints.scm}case/${id}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    getCaseSL(idSl: string | number) {
        return this.http.get(`${endPoints.scm}caseSL/${idSl}`, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    findAllByIdMail(mail:  number) {
        return this.http.get(`${endPoints.scm}mailsRecept/${mail}`, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    findAllByIdMailUserOnlyUser(mail:  number) {
        console.log("que esta trayendo para el nuevo", mail);
        
        return this.http.get(`${endPoints.scm}mailsReceptByUser/${mail}`, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    findAllByIdMailUserOnlySolicitado(mail:  String) {
        console.log("que esta trayendo para el nuevo", mail);
        
        return this.http.get(`${endPoints.scm}mailsReceptBySolicitado/${mail}`, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    findAllByIdMailUser(mail:  number, pkUser: number) {
        console.log("datos usuario", mail, pkUser);
        
        return this.http.get(`${endPoints.scm}mailsRecept/${mail}/${pkUser}`, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    putCaseSL(iddt: string | number, body: any) {
        console.log('Datos a enviar en PUT:', body);
        return this.http.put(`${endPoints.scm}caseESL/${iddt}`, body, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    putUserDataSL(pkUser: string | number, body: any) {
        console.log('Datos a enviar en PUT del usuario:', body);
        return this.http.put(`${endPoints.scm}userUpdate/${pkUser}`, body, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    putStateApr(iddt: string | number, body: any) {
        console.log('Datos a enviar en PUT edit:', body);
        return this.http.put(`${endPoints.scm}stateAprobed/${iddt}`, body, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }

    putCaseMail(id: string | number, body: any) {
        console.log('Datos a enviar en PUT para mails:', body);
        return this.http.put(`${endPoints.scm}email/${id}`, body, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    putCaseMailSolicitante(id: string | number, body: any) {
        console.log('Datos a enviar en PUT para soliictante:', body);
        return this.http.put(`${endPoints.scm}emailSolicitante/${id}`, body, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    putCaseMaildocsEnviados(id: string | number, body: any) {
        console.log('Datos a enviar en PUT para docs respondidos:', body);
        return this.http.put(`${endPoints.scm}emailEnviado/${id}`, body, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    putCaseDOcs(id: string | number, body: any) {
        console.log('Datos a enviar en PUT para docs:', body);
        return this.http.put(`${endPoints.scm}documents/${id}`, body, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    putCaseDatosTrabajadorDocs(id: string | number, body: any) {
        console.log('Datos a enviar en PUT para docs:', body);
        return this.http.put(`${endPoints.scm}documentsDT/${id}`, body, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    putCaseDatosTrabajadorEmp(id: string | number, body: any) {
        console.log('Datos a enviar en PUT para docs emp:', body);
        return this.http.put(`${endPoints.scm}documentsEmp/${id}`, body, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    putCaseDatosTrabajadorJn(id: string | number, body: any) {
        console.log('Datos a enviar en PUT para docs emp:', body);
        return this.http.put(`${endPoints.scm}documentsJn/${id}`, body, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    putCaseDatosTrabajadorArl(id: string | number, body: any) {
        console.log('Datos a enviar en PUT para docs emp:', body);
        return this.http.put(`${endPoints.scm}documentsArl/${id}`, body, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    putCaseDatosTrabajadorJr(id: string | number, body: any) {
        console.log('Datos a enviar en PUT para docs emp:', body);
        return this.http.put(`${endPoints.scm}documentsJr/${id}`, body, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    putCaseDatosTrabajadorMin(id: string | number, body: any) {
        console.log('Datos a enviar en PUT para docs min:', body);
        return this.http.put(`${endPoints.scm}documentsMin/${id}`, body, this.getRequestHeaders(this.headers)).toPromise();
        // Convertir promesa a observable
    }
    updateMailSaludLaboral(docId: number, documentoId: String): Promise<any> {
        const body = { documentos: documentoId };
        return this.putCaseDOcs(docId, body);
      }
      updateDatosTrabajadorDocs(docId: number, documentoId: String): Promise<any> {
        const body = { documentos: documentoId };
        return this.putCaseDatosTrabajadorDocs(docId, body);
      }
      updateDatosTrabajadorEmp(docId: number, documentoId: String): Promise<any> {
        const body = { documentosEmpresa: documentoId };
        return this.putCaseDatosTrabajadorEmp(docId, body);
      }
      updateDatosTrabajadorJn(docId: number, documentoId: String): Promise<any> {
        const body = { documentosJn: documentoId };
        return this.putCaseDatosTrabajadorJn(docId, body);
      }
      updateDatosTrabajadorArl(docId: number, documentoId: String): Promise<any> {
        const body = { documentosArl: documentoId };
        return this.putCaseDatosTrabajadorArl(docId, body);
      }
      updateDatosTrabajadorJr(docId: number, documentoId: String): Promise<any> {
        const body = { documentosJr: documentoId };
        return this.putCaseDatosTrabajadorJr(docId, body);
      }
      updateDatosTrabajadorMin(docId: number, documentoId: String): Promise<any> {
        const body = { documentosMinisterio: documentoId };
        return this.putCaseDatosTrabajadorMin(docId, body);
      }
    getCaseList(document: string | number): any {
        console.log("document", document);
        return this.http.get<any[]>(`${endPoints.scm}validate/${document}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getCaseListSL(document: string | number): any {
        return this.http.get<any[]>(`${endPoints.scm}validateSalud/${document}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getAll() {
        return this.http.get(`${endPoints.scm}all`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getpartesCuerpo() {
        return this.http.get(`${endPoints.scm}partesCuerpo`, this.getRequestHeaders(this.headers)).toPromise();
    }

    ausentismos(documento: string | number): any {
        return this.http.get<[]>(`${endPoints.scm}scmausentismo/${documento}`, this.getRequestHeaders(this.headers)).toPromise();

    }

    changeEstadoById(id: number) {
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
    changeEstadoSL(id: number) {
        return new Promise((resolve, reject) => {
            this.http.put(`${endPoints.scm}cambiarEstadoSL/${id}`, null, this.getRequestHeaders(this.headers))
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

    getDiagnosticosSl(documento: string | number) {
        return this.http.get<[]>(`${endPoints.scm}diagnosticosSl/${documento}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    findAllByIdDiagPartes(documento: string | number) {
        return this.http.get<[]>(`${endPoints.scm}partDiag/${documento}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    createDiagnosticos(diagnosticos: any) {
        console.log('que ptas esta llegando',diagnosticos)
        return this.http.post(`${endPoints.scm}diagnosticos`, diagnosticos, this.getRequestHeaders(this.headers)).toPromise();
    }
    createDiagnosticosSL(diagnosticosSl: any) {
        console.log('que ptas esta llegando diag2',diagnosticosSl)
        return this.http.post(`${endPoints.scm}diagnosticosSl`, diagnosticosSl, this.getRequestHeaders(this.headers)).toPromise();
    }
    deleteIdDiagPartes(diag: string | number, part: string | number): any {
        return this.http.delete<any[]>(`${endPoints.scm}deletePartDiag/${diag}/${part}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    deleteIdDocs(id: string | number, docID: string | number): any {
        console.log("que se esta enviando en eliminar", id, docID);
        
        return this.http.delete<any[]>(`${endPoints.scm}deleteDocument/${id}/${docID}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    deleteIdDocsCaseDT(id: string | number, docID: string | number): any {
        console.log("que se esta enviando en eliminar", id, docID);
        
        return this.http.delete<any[]>(`${endPoints.scm}deleteDocumentDT/${id}/${docID}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    deleteIdDocsEmp(id: string | number, docID: string | number): any {
        console.log("que se esta enviando en eliminar", id, docID);
        
        return this.http.delete<any[]>(`${endPoints.scm}deleteDocumentEmp/${id}/${docID}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    deleteIdDocsArl(id: string | number, docID: string | number): any {
        console.log("que se esta enviando en eliminar", id, docID);
        
        return this.http.delete<any[]>(`${endPoints.scm}deleteDocumentArl/${id}/${docID}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    deleteIdDocsJr(id: string | number, docID: string | number): any {
        console.log("que se esta enviando en eliminar", id, docID);
        
        return this.http.delete<any[]>(`${endPoints.scm}deleteDocumentJr/${id}/${docID}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    deleteIdDocsJn(id: string | number, docID: string | number): any {
        console.log("que se esta enviando en eliminar", id, docID);
        
        return this.http.delete<any[]>(`${endPoints.scm}deleteDocumentJn/${id}/${docID}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    deleteIdDocsMin(id: string | number, docID: string | number): any {
        console.log("que se esta enviando en eliminar", id, docID);
        
        return this.http.delete<any[]>(`${endPoints.scm}deleteDocumentMin/${id}/${docID}`, this.getRequestHeaders(this.headers)).toPromise();
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

    createPcl(pcl: any, diags: any[]): any {
        console.log('que se esta enviando', pcl);
        
        return this.http.post<[]>(`${endPoints.scm}pcl/`, { pcl, diags }, this.getRequestHeaders(this.headers)).toPromise();
    }

    getListPcl(pkcase: string | number): any {
        return this.http.get<[]>(`${endPoints.scm}pcl/${pkcase}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    getAreaById(id: string | number): any {
        return this.http.get<[]>(`${endPoints.scm}findSL/${id}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    

    listPclSL(pkcase: string | number): any {
        console.log("entro a la que si es", pkcase);
        
        return this.http.get<[]>(`${endPoints.scm}pclSalud/${pkcase}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    // listPclAllDiags(pkcase: string | number): any {
    //     return this.http.get<any[]>(`${endPoints.scm}pclAllDiags/${pkcase}`, this.getRequestHeaders(this.headers)).toPromise();
    // }

    listPclAllDiags(pkcase: string | number, pclid: string | number): any {
        return this.http.get<any[]>(`${endPoints.scm}pclAllDiags/${pkcase}/${pclid}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    enviarCorreos(emails: string[]) {
        console.log("que se esta enviando en el post correos: ",emails );
        
        return this.http.get<any[]>(`${endPoints.scm}sendmail/${emails}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    enviarCorreosRechazo(emails: string[]) {
        console.log("que se esta enviando en el post correos pa rechazo: ",emails );
        
        return this.http.get<any[]>(`${endPoints.scm}sendmailReject/${emails}`, this.getRequestHeaders(this.headers)).toPromise();
    }
    //     enviarCorreos(emails: string[]) {
    //     const params = new HttpParams().set('emails', emails.join(','));
    //     return this.http.get<any[]>(`${endPoints.scm}sendmail`, { params, headers: this.getRequestHeaders(this.headers) }).toPromise();
    // }


    sendCorreos(emails: string[]) {
        const params = new HttpParams().set('emails', emails.join(','));
        return this.http.get<any[]>(`${endPoints.scm}sendmail`, { params, headers: this.getRequestHeaders(this.headers) }).toPromise();
    }




    updatePcl(Pcl: any) {
        return this.http.put(`${endPoints.scm}pcl/`, Pcl, this.getRequestHeaders(this.headers)).toPromise();
    }

    deletePcl(pcl: any) {
        return this.http.put(`${endPoints.scm}pcl/delete`, pcl, this.getRequestHeaders(this.headers)).toPromise();
    }

    //reintegro
    createReintegro(reintegro: ReintegroCreate) {
        return this.http.post<[Reintegro]>(`${endPoints.scm}reintegro/`, reintegro, this.getRequestHeaders(this.headers)).toPromise();
    }

    getReintegroByCaseId(idCaso: string): any {
        return this.http.get<Reintegro>(`${endPoints.scm}reintegro/${idCaso}`, this.getRequestHeaders(this.headers))
    }

    getReintegroByCaseId2(idCaso: string): any {
        return this.http.get(`${endPoints.scm}reintegro/${idCaso}`, this.getRequestHeaders(this.headers))
    }

    editReintegro(reintegro: Reintegro) {
        return this.http.put<[Reintegro]>(`${endPoints.scm}reintegro/`, reintegro, this.getRequestHeaders(this.headers))
    }
    // finish reintegro

    findByFilter(filterQuery: FilterQuery | null = null) {
        return this.http.get(`${endPoints.scm}` + '?' + this.buildUrlParams(filterQuery), this.getRequestHeaders(this.headers)).toPromise();


    }
    findWithFilterSL(filterQuery: FilterQuery | null = null) {
        console.log("filtro para vainas locas:" ,filterQuery);
        
        return this.http.get(`${endPoints.scm}salud/` + '?' + this.buildUrlParams(filterQuery), this.getRequestHeaders(this.headers)).toPromise();
    }
    findWithFilterMail(filterQuery: FilterQuery | null = null) {
        console.log("filtro para vainas locas:" ,filterQuery);
        
        return this.http.get(`${endPoints.scm}saludMail/` + '?' + this.buildUrlParams(filterQuery), this.getRequestHeaders(this.headers)).toPromise();
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

    saveAnnexDocumentMediumTracking(formData: any){
        this.http.post("http://localhost:8080/sigess/api/upload/document", formData).subscribe(response => {
            console.log('File uploaded successfully Gama');
        });
    }
}

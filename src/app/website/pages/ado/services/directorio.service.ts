import { Injectable } from '@angular/core';

// import { endPoints } from 'environments/environment'


;
// import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service';
// import { Directorio } from 'app/modulos/ado/entities/directorio';
// import { Documento } from 'app/modulos/ado/entities/documento';
// import { RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { FilterQuery } from '../../core/entities/filter-query';
import { CRUDService } from '../../core/services/crud.service';
import { Directorio } from '../entities/directorio';
import { endPoints } from 'src/environments/environment';
import { Documento } from '../entities/documento';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class DirectorioService extends CRUDService<Directorio> {

    uploadEndPoint: string = endPoints[this.getClassName()] + "upload";

    upload(fileToUpload: File, directorioPadreId: string | null, modulo: string, modParam: string, caseId: string | null) {

        let endPoint = modulo == 'cop' ? this.end_point + 'cop/upload' : this.end_point + 'upload';

        let formData: FormData = new FormData();

        if (fileToUpload != null)
            formData.append('file', fileToUpload, fileToUpload.name);
        if (modulo != null)
            formData.append("mod", modulo);
        if (modParam != null)
            formData.append("modParam", modParam);
        if (directorioPadreId != null)
            formData.append("dpId", directorioPadreId);
        if (caseId != null)
            formData.append("caseId", caseId);

        return new Promise((resolve) => {
            this.httpInt
                .postFile(endPoint, formData)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }


    uploadv2(fileToUpload: File, modulo: any) {

        let endPoint = modulo == 'cop' ? this.end_point + 'cop/upload' : this.end_point + 'uploadv2';

        let formData: FormData = new FormData();

        if (fileToUpload != null)
            formData.append('file', fileToUpload, fileToUpload.name);
        if (modulo != null)
            formData.append("mod", modulo);

        return new Promise((resolve) => {
            this.httpInt
                .postFile(endPoint, formData)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    uploadv3(documentoId: string, paramId: string, modulo: string) {

        let endPoint = this.end_point + 'uploadv3';

        let formData: FormData = new FormData();

        formData.append('documentoId', documentoId);
        formData.append('paramId', paramId);
        formData.append('modulo', modulo);

        return new Promise((resolve) => {
            this.httpInt
                .postFile(endPoint, formData)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    uploadv4(documentoId: string, listaId: string, version: string) {
        let endPoint = this.end_point + 'uploadv4';

        let formData: FormData = new FormData();

        formData.append('documentoId', documentoId);
        formData.append('listaId', listaId);
        formData.append('version', version);

        return new Promise((resolve) => {
            this.httpInt
                .postFile(endPoint, formData)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    uploadv5(fileToUpload: any, directorioPadreId: string | null, modulo: string, modParam: string, caseId: string | null, nivelAcceso: string, perfilId: string | null) {
        let endPoint = modulo == 'cop' ? this.end_point + 'cop/upload' : this.end_point + 'upload';

        let formData: FormData = new FormData();

        if (fileToUpload != null) formData.append('file', fileToUpload, fileToUpload.name);
        if (fileToUpload != null) formData.append('descripcion',fileToUpload.descripcion);
        if (modulo != null) formData.append('mod', modulo);
        if (modParam != null) formData.append('modParam', modParam);
        if (directorioPadreId != null) formData.append('dpId', directorioPadreId);
        if (caseId != null) formData.append('caseId', caseId);
        if (nivelAcceso != null) formData.append('nivelAcceso', nivelAcceso);
        if (perfilId != null)formData.append('perfilId', perfilId);

        return new Promise((resolve) => {
            this.httpInt
                .postFile(endPoint, formData)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    uploadv6(fileToUpload: any, directorioPadreId: string, modulo: string, modParam: string, caseId: string, tipoEvidencia: string, nivelAcceso: string, fkPerfilId: string) {
        let endPoint = modulo == 'cop' ? this.end_point + 'cop/upload' : this.end_point + 'uploadEvidencias';

        let formData: FormData = new FormData();

        if (fileToUpload != null) formData.append('file', fileToUpload, fileToUpload.name);
        if (fileToUpload != null) formData.append('descripcion',fileToUpload.descripcion);
        if (modulo != null) formData.append('mod', modulo);
        if (modParam != null) formData.append('modParam', modParam);
        if (directorioPadreId != null) formData.append('dpId', directorioPadreId);
        if (caseId != null) formData.append('caseId', caseId);
        if (tipoEvidencia != null) formData.append('tipoEvidencias', tipoEvidencia);
        if (nivelAcceso != null) formData.append('nivelAcceso', nivelAcceso);
        if (fkPerfilId != null) formData.append('fkPerfilId', fkPerfilId);


        return new Promise((resolve) => {
            this.httpInt
                .postFile(endPoint, formData)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    UpdateActaulizarVersion(documentoId: string, listaId: string, version: string) {
        let endPoint = this.end_point + 'update';

        let formData: FormData = new FormData();

        formData.append('documentoId', documentoId);
        formData.append('listaId', listaId);
        formData.append('version', version);

        return new Promise((resolve) => {
            this.httpInt
                .postFile(endPoint, formData)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    Update(documentoId: string, listaId: string, version: string) {
        let endPoint = this.end_point + 'updateV2';

        let formData: FormData = new FormData();

        formData.append('documentoId', documentoId);
        formData.append('listaId', listaId);
        formData.append('version', version);

        return new Promise((resolve) => {
            this.httpInt
                .postFile(endPoint, formData)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    UpdateV2(documentoId: string, listaId: string, version: string, nivelAcceso: string) {
        let endPoint = this.end_point + 'updateV2';

        let formData: FormData = new FormData();

        formData.append('documentoId', documentoId);
        formData.append('listaId', listaId);
        formData.append('version', version);
        formData.append('nivelAcceso', nivelAcceso);

        return new Promise((resolve) => {
            this.httpInt
                .postFile(endPoint, formData)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    override findByFilter(filterQuery?: FilterQuery, modulo?: string) {
        let endPoint = modulo == null ? this.end_point + '?' : this.end_point + modulo + '?';
        return new Promise((resolve) => {
            this.httpInt
                .get(endPoint + this.buildUrlParams(filterQuery!))
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    override delete(id: string, modulo?: string) {

        console.log('eliminarDocumento');
        
        let key = CryptoJS.SHA256(this.httpInt.getSesionService().getBearerAuthToken()).toString(CryptoJS.enc.Hex).substring(0, 32);
        
        let encryptedId = CryptoJS.AES.encrypt(id, key).toString();
          

        
        
        let endPoint = modulo == null ? this.end_point : this.end_point + modulo + '/';
        // return new Promise((resolve) => {
        //     let options: any = {
        //         // responseType: 'blob',
        //         headers: new HttpHeaders()
        //             .set('Param-Emp', this.httpInt.getSesionService().getParamEmp())
        //             .set('app-version', this.httpInt.getSesionService().getAppVersion())
        //             .set('Authorization', this.httpInt.getSesionService().getBearerAuthToken()),
        //         withCredentials: true,
                
        //     };
        //     console.log(options);
            

        //     let end_point = this.httpInt
        //         // .delete(endPoint + id)
        //         .delete(endPoint + 'documento/' + encryptedId)
        //         .subscribe(
        //             (res) => {
        //                 resolve(res);
        //             },
        //             (err) => this.manageError(err)
        //         );
        // });

        return new Promise(async (resolve) => {
            let options: any = {
                // responseType: 'blob',
                headers: new HttpHeaders()
                    .set('Param-Emp', this.httpInt.getSesionService().getParamEmp())
                    .set('app-version', this.httpInt.getSesionService().getAppVersion())
                    .set('Authorization', this.httpInt.getSesionService().getBearerAuthToken()),
                withCredentials: true,
                
            };
            

            let formData: FormData = new FormData();
            formData.append('data', encryptedId);
            

            await this.httpInt.http
                .post(endPoint + 'documento/', formData, options)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageBlobError(err)
                );
        });
    }

    actualizarDirectorio(entity: Directorio) {
        let body = JSON.stringify(entity);
        return new Promise((resolve) => {
            this.httpInt
                .put(this.end_point, body)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    actualizarDocumento(entity: Documento) {
        let body = JSON.stringify(entity);
        return new Promise((resolve) => {
            this.httpInt
                .put(this.end_point + 'documento', body)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    eliminarDocumento(id: string) {   
        let key = CryptoJS.SHA256(this.httpInt.getSesionService().getBearerAuthToken()).toString(CryptoJS.enc.Hex).substring(0, 32);
        
        let encryptedId = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(id), CryptoJS.enc.Hex.parse(key), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString();

        

        let endPoint = this.end_point + 'documento/';

        return new Promise(async (resolve) => {
            let options: any = {
                // responseType: 'blob',
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
                    },
                    (err) => this.manageBlobError(err)
                );
        });
    }

    buscarDocumentos(parametro: string) {
        return new Promise((resolve) => {
            this.httpInt
                .get(this.end_point + 'buscarDocumentos/' + parametro)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    buscarDocumentosById(parametro: string): Promise<Directorio[]> {
        return new Promise((resolve, reject) => {
            this.httpInt
                .get(this.end_point + 'buscarDocumentosById/' + parametro)
                .subscribe(
                    (res: any) => {
                        resolve(res);
                    },
                    (err) => {
                        this.manageError(err);
                        reject(err);
                    }
                );
        });
    }


    findByUsuario() {
        return new Promise((resolve) => {
            this.httpInt
                .get(this.end_point + 'usuario/')
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }
   

    download(directorioId: string, modulo?: string) {
                
        let key = CryptoJS.SHA256(this.httpInt.getSesionService().getBearerAuthToken()).toString(CryptoJS.enc.Hex).substring(0, 32);
        
        let encryptedId = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(directorioId), CryptoJS.enc.Hex.parse(key), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          }).toString();
        
        let endPoint = modulo == null ? this.end_point + 'download/' : this.end_point + modulo + '/download/';
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
                    },
                    (err) => this.manageBlobError(err)
                );
        });
    }

    prepareUploadRequest(xhr: any) {
        xhr.setRequestHeader('Param-Emp', this.httpInt.getSesionService().getEmpresa() == null ? null : this.httpInt.getSesionService().getEmpresa()?.id);
        xhr.setRequestHeader('Authorization', this.httpInt.getSesionService().getBearerAuthToken() == null ? null : this.httpInt.getSesionService().getBearerAuthToken());
    }

    getClassName(): string {
        return "DirectorioService";
    }

}

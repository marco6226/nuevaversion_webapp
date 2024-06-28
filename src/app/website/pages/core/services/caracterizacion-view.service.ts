import { Injectable } from '@angular/core';
import { Carview } from 'src/app/website/pages/comun/entities/caracterizacion';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { endPoints } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: "root"
})
export class CaracterizacionViewService extends CRUDService<Carview> {

  findAllCAR() {
    return new Promise((resolve, reject) => {
      let key = CryptoJS.SHA256(this.httpInt.getSesionService().getBearerAuthToken()).toString(CryptoJS.enc.Hex).substring(0, 32);
      
      this.httpInt.get(`${endPoints.CaracterizacionViewService}all`)
        .subscribe(
          (res: any) => {
            let decryptedBytes = CryptoJS.AES.decrypt(res, CryptoJS.enc.Hex.parse(key), {
              mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7

            });

            let decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

            resolve(decryptedText);
          }
          ,
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  getClassName(): string {
    return "CaracterizacionViewService";
  }
}
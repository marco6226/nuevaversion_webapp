import { Injectable } from '@angular/core';
import { Carview } from 'src/app/website/pages/comun/entities/caracterizacion';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service';
import { endPoints, environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CaracterizacionViewService extends CRUDService<Carview> {
  async findAllCAR() {
    //debugger;

    // new Promise((resolve, ) => {
    //   this.httpInt.http.get(`${endPoints.CaracterizacionViewService}all`, { responseType: 'text' }).subscribe((y:any) => {
    //     console.log(y);
    //     resolve = y;
    //   });
    // });

    return new Promise((resolve, reject) => {
      
      let secureKey = environment.secureKey;

      // let key = CryptoJS.SHA256(this.httpInt.getSesionService().getBearerAuthToken()).toString(CryptoJS.enc.Hex).substring(0, 32);

      let key = CryptoJS.SHA256(secureKey)
        .toString(CryptoJS.enc.Hex)
        .substring(0, 32);

      this.httpInt.http
        .get(`${endPoints.CaracterizacionViewService}all`, {
          responseType: 'text',
        })
        .forEach(
          (res: any) => {
            let decryptedBytes = CryptoJS.AES.decrypt(
              res,
              CryptoJS.enc.Hex.parse(key),
              {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
              }
            );

            let decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
            console.log(decryptedText);

            const jsonArray = JSON.parse(decryptedText);

            const carviews: Carview[] = jsonArray.map((jsonObj: any) => {
              const carview = new Carview();
              Object.assign(carview, jsonObj);

              return carview;
            });
            // resolve(decryptedText);
          }
          // err => {
          //   this.manageError(err);
          //   reject(err);
          // }
        );
    });
  }

  findAllCAR2() {
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.CaracterizacionViewService}all2`).subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          this.manageError(err);
          reject(err);
        }
      );
    });
  }

  getClassName(): string {
    return 'CaracterizacionViewService';
  }
}

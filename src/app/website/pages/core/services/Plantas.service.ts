import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { Plantas } from 'src/app/website/pages/comun/entities/Plantas';

@Injectable({
  providedIn: 'root'
})
export class PlantasService extends CRUDService<Plantas>{

  getClassName(): string {
    return 'Plantas';
  }

  getPlantasByEmpresaId(empresaId: number): Promise<Plantas[]>{
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point+`${empresaId}`).subscribe(
        (res: Plantas[] | any) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

}

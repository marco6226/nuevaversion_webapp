import { Injectable } from '@angular/core';
import { Cumplimiento } from '../../comun/entities/cumplimiento';
import { CRUDService } from './crud.service';

@Injectable()
export class CumplimientoService extends CRUDService<Cumplimiento>{

    getClassName(): string {
        return 'cumplimientoService';
    }

    saveCumplimiento(cumplimientoList: Cumplimiento[]){
        return new Promise((resolve, reject) => {
            this.httpInt.post(this.end_point, cumplimientoList)
            .subscribe(
                (res) => {
                    resolve(res);
                },
                (err) => {
                    this.manageError(err);
                    reject(err);
                }
            )
        });
    }

    updateCumplimiento(cumplimientoList: Cumplimiento[]){
        return new Promise((resolve, reject) => {
            this.httpInt.put(this.end_point, cumplimientoList)
            .subscribe(
                (res) => {
                    resolve(res);
                },
                (err) => {
                    this.manageError(err);
                    reject(err);
                }
            )
        });
    }
    
}
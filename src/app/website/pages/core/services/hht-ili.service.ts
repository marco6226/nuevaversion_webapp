import { Injectable } from "@angular/core";
import { HhtIli } from "../../comun/entities/hht";
import { CRUDService } from "./crud.service";

@Injectable({
    providedIn: 'root'
})
export class HhtIliService extends CRUDService<HhtIli> {

    createHhtIli(hhtIliList: HhtIli[]){
        let body = JSON.stringify(hhtIliList);
        return new Promise((resolve, reject) => {
            this.httpInt.post(this.end_point, body).subscribe(
                res => resolve(res),
                err => {
                    this.manageError(err);
                    reject(err);
                }
            );
        })
    }

    updateHhtIli(hhtIliList: HhtIli[]){
        let body = JSON.stringify(hhtIliList);
        return new Promise((resolve, reject) => {
            this.httpInt.put(this.end_point, body).subscribe(
                res => resolve(res),
                err => {
                    this.manageError(err);
                    reject(err);
                }
            );
        });
    }

    getClassName() {
        return 'HhtIliService';
    }
}
import { Injectable } from '@angular/core';
import { Serie } from '../../comun/entities/serie';
import { CRUDService } from './crud.service';

@Injectable({providedIn: 'root'})
export class SerieService extends CRUDService<Serie> {
    getClassName() {
        return 'SerieService';
    }

    async getSerieById(id: number) {
        return new Promise((resolve, reject) => {
            const manageError = this.manageError.bind(this);
            this.httpInt.get(this.end_point + id)
            .subscribe({
                next(data) {
                    resolve(data);
                },
                error(err) {
                    manageError(err);
                    reject(err);
                },
            })
        });
    }
}
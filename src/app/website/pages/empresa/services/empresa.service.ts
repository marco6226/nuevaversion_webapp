import { Injectable } from '@angular/core';
import { endPoints } from 'src/environments/environment';
import { CRUDService } from '../../core/services/crud.service';
import { Empresa } from '../entities/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService extends CRUDService<Empresa>{

  findByUsuario(usuarioId: string | null | undefined) {
    return new Promise(resolve => {
        this.httpInt.get(endPoints.EmpresaService + "usuario/" + usuarioId)
            // .map(res => res)
            .subscribe(
                res => {
                    resolve(res);
                }
                ,
                err => this.manageError(err)
            )
    });
  }

  getClassName(): string {
      return "EmpresaService";
  }
}

import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { SistemaCausaAdministrativa } from 'src/app/website/pages/comun/entities/sistema-causa-administrativa'

@Injectable()
export class SistemaCausaAdministrativaService extends CRUDService<SistemaCausaAdministrativa>{

  findDefault() {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "seleccionado/")
        .subscribe(
          res => resolve(res),
          err => this.manageError(err)
        )
    });
  }

  getClassName(): string {
    return "SistemaCausaAdministrativaService";
  }

}

import { Injectable } from '@angular/core';
import { CRUDService } from '../../core/services/crud.service';
import { Perfil } from '../../empresa/entities/perfil';

@Injectable({
  providedIn: 'root'
})
export class PerfilService extends CRUDService<Perfil>{
  getClassName() {
    return "PerfilService";
  }

}

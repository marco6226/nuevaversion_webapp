import { Injectable } from '@angular/core';
import { CRUDService } from '../../core/services/crud.service';
import { TipoHallazgo } from '../entities/tipo-hallazgo';

@Injectable({
  providedIn: 'root'
})
export class TipoHallazgoService extends CRUDService<TipoHallazgo>{

  getClassName(): string {
    return "TipoHallazgoService";
  }
}

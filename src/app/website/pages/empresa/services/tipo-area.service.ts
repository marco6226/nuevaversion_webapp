import { Injectable } from '@angular/core';
import { HttpInt } from 'src/app/httpInt'
import { endPoints } from 'src/environments/environment'
import { CRUDService } from '../../core/services/crud.service';
import { TipoArea } from '../entities/tipo-area'

@Injectable({
    providedIn: 'root'
  })
export class TipoAreaService extends CRUDService<TipoArea> {

  getClassName() : string{
    return "TipoAreaService";
  }

}

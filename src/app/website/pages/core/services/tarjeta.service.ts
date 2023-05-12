import { Injectable } from '@angular/core';
import { HttpInt } from "src/app/httpInt";
import { endPoints } from 'src/environments/environment'

import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { Tarjeta } from 'src/app/website/pages/observaciones/entities/tarjeta'

@Injectable({
  providedIn: 'root'
})
export class TarjetaService extends CRUDService<Tarjeta>{
  
  getClassName(): string {
    return "TarjetaService";
  }


}

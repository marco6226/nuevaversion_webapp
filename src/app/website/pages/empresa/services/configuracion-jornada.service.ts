import { Injectable } from '@angular/core';
import { CRUDService } from '../../core/services/crud.service';
import { ConfiguracionJornada } from '../../empresa/entities/configuracion-jornada';
@Injectable({
  providedIn: 'root'
})
export class ConfiguracionJornadaService extends CRUDService<ConfiguracionJornada>{

  getClassName(): string {
    return "ConfiguracionJornadaService";
  }
}

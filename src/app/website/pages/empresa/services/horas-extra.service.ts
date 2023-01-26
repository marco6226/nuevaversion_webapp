import { Injectable } from '@angular/core';
import { HorasExtra } from '../entities/horas-extra';
import { CRUDService } from '../../core/services/crud.service';

@Injectable()
export class HorasExtraService extends CRUDService<HorasExtra>{

  getClassName(): string {
    return "HorasExtraService";
  }
}

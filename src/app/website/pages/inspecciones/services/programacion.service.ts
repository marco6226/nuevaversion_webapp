import { Injectable } from '@angular/core';
import { CRUDService } from '../../core/services/crud.service';
import { Programacion } from '../entities/programacion';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService extends CRUDService<Programacion>{

  getClassName(): string {
    return "ProgramacionService";
  }
  
}

import { Injectable } from '@angular/core';
import { Competencia } from 'src/app/website/pages/empresa/entities/competencia'
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'

@Injectable({
    providedIn: 'root'
})
export class CompetenciaService extends CRUDService<Competencia>{

  getClassName(): string {
    return "CompetenciaService";
  }
}

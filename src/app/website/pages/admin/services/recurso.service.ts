import { CRUDService } from '../../core/services/crud.service';
import { Recurso } from '../../empresa/entities/recurso';

export class RecursoService extends CRUDService<Recurso> {
  getClassName(): string {
    return "RecursoService";
  }
}

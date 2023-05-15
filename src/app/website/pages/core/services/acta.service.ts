import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { Directorio } from '../../ado/entities/directorio';
import { Acta } from 'src/app/website/pages/cop/entities/acta';
import { DirectorioService } from '../../ado/services/directorio.service';
import { HttpInt } from 'src/app/httpInt'
import { MensajeUsuarioService } from '../../comun/services/mensaje-usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ActaService extends CRUDService<Acta> {
  
  constructor(
    public dirService: DirectorioService,
    public override httpInt: HttpInt,
    public override mensajeUsuarioService: MensajeUsuarioService
  ) {
    super(httpInt, mensajeUsuarioService);
  }

  getClassName(): string {
    return "ActaService";
  }

}

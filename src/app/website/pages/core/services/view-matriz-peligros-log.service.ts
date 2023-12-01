import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/website/pages/core/services/crud.service'
import { TipoPeligro } from 'src/app/website/pages/comun/entities/tipo-peligro'
import { endPoints } from 'src/environments/environment';
import { ViewMatrizPeligrosLog } from '../../comun/entities/View-matriz-peligros-log';
import { FilterQuery } from '../entities/filter-query';
import { MessageService } from 'primeng/api';
import { MensajeUsuarioService } from '../../comun/services/mensaje-usuario.service';
import { HttpInt } from 'src/app/httpInt';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewMatrizPeligrosLogService extends CRUDService<ViewMatrizPeligrosLog>{

  private notificarComponente = new Subject<any>();

  notificarEvento() {
    this.notificarComponente.next(null); // Notificar el evento
  }

  obtenerNotificadorEvento() {
    return this.notificarComponente.asObservable();
  }

  getClassName(): string {
    return "ViewMatrizPeligrosLogService";
  }

  getmpRWithFilter(filterQuery?: FilterQuery){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'vmpRegistroFilter/?' + this.buildUrlParams(filterQuery!))
      .subscribe(
        res => {
          resolve(res);
        },
        err => {
          this.manageError(err);
          reject(err);
        }
      )
    });
  }

  getmpExcelHistorico(filterQuery?: FilterQuery){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'vmpExcelHistorico/?' + this.buildUrlParams(filterQuery!))
      .subscribe(
        res => {
          resolve(res);
          this.mensajeUsuarioService.showMessageToast({
            mensaje: 'Notificación',
            detalle: 'El historico de la matriz de peligros ya esta disponible para su descarga',
            tipoMensaje: 'success'
          });
          this.notificarEvento()
        },
        err => {
          this.manageError(err);
          reject(err);
        }
      )
    })
  }
  descargarExcelHistorico(){
    this.notificarEvento()
  }
}

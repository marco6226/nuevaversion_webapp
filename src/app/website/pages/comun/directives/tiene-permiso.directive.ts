import { Directive, Input,Output,EventEmitter, TemplateRef, ViewContainerRef } from '@angular/core';
import { SesionService } from '../../core/services/session.service';

@Directive({
  selector: '[sTienePermiso]',
  providers: [SesionService],
})
export class TienePermisoDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private sesionService: SesionService
  ) { }

  @Output() public flagTienePermiso: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() set sTienePermiso(codigo: string) {
    if(this.sesionService.getPermisosMap() == null){
      return;
    }
    let permiso = this.sesionService.getPermisosMap()[codigo];    
    if (permiso != null && permiso.valido == true) {
      this.flagTienePermiso.emit(true)
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.flagTienePermiso.emit(false)
      this.viewContainer.clear();
    }

  }
}

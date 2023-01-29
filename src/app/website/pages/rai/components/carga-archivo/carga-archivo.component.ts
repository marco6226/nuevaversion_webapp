import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReporteService } from 'src/app/website/pages/core/services/reporte.service';
import { Message } from 'primeng/api';

import { DiagramComponent} from '@syncfusion/ej2-angular-diagrams';

import { Diagram, UndoRedo} from '@syncfusion/ej2-diagrams';

  Diagram.Inject(UndoRedo);


export type NestedData = {
  nested: any
}

@Component({
  selector: 'app-carga-archivo',
  templateUrl: './carga-archivo.component.html',
  styleUrls: ['./carga-archivo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CargaArchivoComponent implements OnInit {
  @ViewChild('diagram',{static: false})
  public diagram?: DiagramComponent;

 
  file?: File;
  tipoReporte?: string;
  cargando?: boolean;
  msgs?: Message[];
  idEmpresa?: string;

  constructor(
    public repService: ReporteService,
    private sesionService: SesionService
  ) { }

  ngOnInit(): void {
    this.idEmpresa = this.sesionService.getEmpresa()?.id;
  }
onFileSelect(files: FileList) {
    this.cargando = true;
    this.file = files[0];
    this.repService.cargarArchivo(this.file, this.tipoReporte!)
      .then((resp:any) => {
        this.cargando = false;
        this.msgs = [{
          severity: 'success',
          summary: 'Carga de reportes realizada',
          detail: 'El archivo de reportes ha sido cargado correctamente'
        }];
        this.file=undefined
      })
      .catch(err => {
        this.cargando = false;
        this.file = undefined
      });
  }
}

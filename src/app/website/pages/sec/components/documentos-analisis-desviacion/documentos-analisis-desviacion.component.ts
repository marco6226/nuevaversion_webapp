import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Modulo } from 'src/app/website/pages/comun/entities/enumeraciones';
import { AnalisisDesviacion } from 'src/app/website/pages/comun/entities/analisis-desviacion';
import { Documento } from '../../../ado/entities/documento';
import { Directorio } from '../../../ado/entities/directorio';
import { DirectorioService } from 'src/app/website/pages/core/services/directorio.service'
import { Util } from 'src/app/website/pages/comun/entities/util';
import { DomSanitizer } from '@angular/platform-browser';
import { Message } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 's-documentosAnalisisDesviacion',
  templateUrl: './documentos-analisis-desviacion.component.html',
  styleUrls: ['./documentos-analisis-desviacion.component.scss'],
  providers: [DirectorioService]
})
export class DocumentosAnalisisDesviacionComponent implements OnInit {

  @Input('analisisId') analisisId?: string;
  documentos?: Documento[];
  @Input('documentos') 
  set documentosIn(documentos: Documento[]){
    this.documentos = documentos.filter((element:Documento)=> element.proceso == null)
  }
  @Output('onUpdate') onUpdate = new EventEmitter<Documento>();
  @Input('readOnly') readOnly?: boolean;
  documentosList?: any[];
  visibleDlg?: boolean;
  modulo = Modulo.SEC.value;
  msgs?: Message[];

  constructor(
    private domSanitizer: DomSanitizer,
    private directorioService: DirectorioService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
  }

  showDialog() {
    this.visibleDlg = true;
  }

  descargarDocumento(doc: Documento) {
    let msg = { severity: 'info', summary: 'Descargando documento...', detail: 'Archivo \"' + doc.nombre + "\" en proceso de descarga" };
    this.msgs = [];
    this.msgs.push(msg);
    this.directorioService.download(doc.id).then(
      resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp]);
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink?.setAttribute("href", url);
          dwldLink?.setAttribute("download", doc.nombre);
          dwldLink?.click();
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Archivo descargado', detail: 'Se ha descargado correctamente el archivo ' + doc.nombre });
        }
      }
    );
  }

  actualizarDesc(doc: Documento) {
    this.directorioService.actualizarDocumento(doc).then(
      data => {
        this.onUpdate.emit(doc);
      }
    );
  }

  eliminarDocument(doc: Documento) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.onUpdate.emit(doc);
          this.directorioService.eliminarDocumento(doc.id).then(
            data => {
              this.documentos = this.documentos?.filter(val => val.id !== doc.id);
            }
          );
      }
  });
  }

  onUpload(event: Directorio) {
    if (this.documentos == null)
      this.documentos = [];
    this.documentos.push(event.documento);
    this.adicionarAGaleria(event.documento);
    this.documentos = this.documentos.slice();
  }

  adicionarAGaleria(doc: Documento) {
  }
}

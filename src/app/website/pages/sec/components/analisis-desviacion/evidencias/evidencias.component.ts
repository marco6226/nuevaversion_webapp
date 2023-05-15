import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Modulo } from '../../../../core/enums/enumeraciones';
import { Documento } from '../../../../ado/entities/documento';
import { Directorio } from '../../../../ado/entities/directorio';
import { DirectorioService } from 'src/app/website/pages/ado/services/directorio.service'
import { Util } from 'src/app/website/pages/comun/entities/util';
import { DomSanitizer } from '@angular/platform-browser';
import { Message } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-evidencias',
  templateUrl: './evidencias.component.html',
  styleUrls: ['./evidencias.component.scss']
})
export class EvidenciasComponent implements OnInit {
  @Input('analisisId') analisisId?: string;
  @Input('tipoEvidencias') tipoEvidencias?: string;

  @Input('documentos') documentos?: Documento[];
  @Output('onUpdate') onUpdate = new EventEmitter<Documento>();
  @Input('readOnly') readOnly?: boolean;

  documentosList?: any[];
  documentosListFoto: any[]=[];
  documentosListDocumental: any[]=[];
  documentosListPoliticas: any[]=[];
  documentosListProcedimientos: any[]=[];
  documentosListMultimedia: any[]=[];

  visibleDlgFoto?: boolean;
  visibleDlgDocumento?: boolean;
  visibleDlgPoliticas?: boolean;
  visibleDlgProcedimientos?: boolean;
  visibleDlgMultimedia?: boolean;
  
  modulo = Modulo.SEC.value;
  msgs?: Message[];
  constructor(
    private directorioService: DirectorioService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
  }
  showDialog(tipo: string) {
    console.log("hola");
    
    switch (tipo) {
      case 'foto':
        this.visibleDlgFoto = true
        break;
      case 'documento':
        this.visibleDlgDocumento = true
        break;
      case 'politicas':
        this.visibleDlgPoliticas = true
        break;
      case 'procedimientos':
        this.visibleDlgProcedimientos = true
        break;
      case 'multimedia':
        this.visibleDlgMultimedia = true
        break;
    
      default:
        break;
    }
  }
  onUpload(event: Directorio) {
    if (this.documentos == null)
      this.documentos = [];
    this.documentos.push(event.documento!);
    this.documentos = this.documentos.slice();
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
    console.log(doc)
    console.log(this.documentos)
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.onUpdate.emit(doc);
          this.directorioService.eliminarDocumento(doc.id).then(
            data => {
              this.documentos = this.documentos?.filter(val => val.id !== doc.id);
              console.log(this.documentos)
            }
          );
      }
  });
  }
}

import { Modulo } from './../../../core/enums/enumeraciones';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Documento } from '../../../ado/entities/documento';
import { Directorio } from '../../../ado/entities/directorio';
import { locale_es } from '../../../rai/entities/reporte-enumeraciones';
import { DirectorioService } from '../../../ado/services/directorio.service';

@Component({
  selector: 'app-cargue-documentos',
  templateUrl: './cargue-documentos.component.html',
  styleUrls: ['./cargue-documentos.component.scss'],
  providers: [DirectorioService]
})
export class CargueDocumentosComponent implements OnInit {

  @Input('analisisId') analisisId!: number;
  documentos!: Documento[];
  @Input() puntajeARL:number =0;
  @Input() flagConsult: boolean=false;
  @Input('documentos') directorios: Directorio[]=[];
  @Output() idDoc = new EventEmitter<string>();
  @Output() fechaVencimientoArlEvent = new EventEmitter<Date>();
  @Output() fechaVencimientoSstEvent = new EventEmitter<Date>();
  @Output() fechaVencimientoCertExternaEvent = new EventEmitter<Date>();
  @Output() dataPuntajeArl = new EventEmitter<number>();
  msgs!: Message[];
  @Output('onUpdate') onUpdate = new EventEmitter<Documento>();
  @Output('onDelete') onDelete = new EventEmitter<any>();
  visibleDlgCertificadoARL: boolean = false;
  visibleDlgLicenciaSST: boolean = false;
  visibleDlgCertiExterna: boolean = false;
  modulo: String = Modulo.EMP.value;
  documentosList!: any[];
  fechaActual = new Date();
  yearRange: string = "1900:" + this.fechaActual.getFullYear();
  localeES: any = locale_es;
  @Input('fechaVencimientoArl')
  set fechaVencimientoArlIn(fechaVencimientoArl: number){
    if(fechaVencimientoArl){
      this.fecha_vencimiento_arl = new Date(fechaVencimientoArl);
    }
  }
  @Input('fechaVencimientoSst')
  set fechaVencimientoSstIn(fechaVencimientoSst: number){
    if (fechaVencimientoSst) {
      this.fecha_vencimiento_sst = new Date(fechaVencimientoSst);
    }
  }
  @Input('fechaVencimientoCertExterna')
  set fechaVencimientoCertExternaIn(fechaVencimientoCertExterna: number){
    if (fechaVencimientoCertExterna) {
      this.fecha_vencimiento_cert_ext = new Date(fechaVencimientoCertExterna);
    }
  }
  
  fecha_vencimiento_arl!: Date;
  fecha_vencimiento_sst!: Date;
  fecha_vencimiento_cert_ext!: Date;
  onEdit: string = '';

  es = {
    firstDayOfWeek: 1,
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    dayNamesShort: ["Dom", "Lun", "Mar", "Miér", "Juev", "Vier", "Sáb"],
    dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    today: 'Hoy',
    clear: 'Limpiar'
  };

  constructor(
    private directorioService: DirectorioService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.onEdit = this.activatedRoute.snapshot.params['onEdit'];
  }

  showDialog(tipo: string) {    
    switch (tipo) {
      case 'arl':
        this.visibleDlgCertificadoARL = true
        break;
      case 'licencia':
        this.visibleDlgLicenciaSST = true
        break;
      case 'certificacionExterna':
        this.visibleDlgCertiExterna = true;
        break;
      default:
        break;
    }
  }

  onUpload(event: Directorio) {
    if (this.documentos == null)
      this.documentos = [];
    if(this.directorios == null){
      this.directorios = []
    }
    this.directorios.push(event)
    this.documentos.push(event.documento!);
    this.documentos = this.documentos.slice();
    this.idDoc.emit(event.id)
    
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

  onSelectArl(value: Date){
    let fecha_vencimiento_arl = value;
    this.fechaVencimientoArlEvent.emit(fecha_vencimiento_arl);
  }

  onSelectSst(value: Date){
    let fecha_vencimiento_sst = value;
    this.fechaVencimientoSstEvent.emit(fecha_vencimiento_sst);
  }

  onSelectCertExt(value: Date){
    let fecha_vencimiento_cert_ext = value;
    this.fechaVencimientoCertExternaEvent.emit(fecha_vencimiento_cert_ext);
  }

  onPuntajeARL(){
    this.dataPuntajeArl.emit(this.puntajeARL);
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
              this.directorios = this.directorios.filter(val => val.id !== doc.id);
              let docIds: string[] = []
              this.directorios.forEach(el => {
                docIds.push(el.id!);
              });
              this.onDelete.emit(JSON.stringify(docIds));
            }
          );
      }
  });
  }
 

}

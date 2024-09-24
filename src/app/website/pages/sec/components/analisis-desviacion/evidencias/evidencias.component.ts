import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Modulo } from '../../../../core/enums/enumeraciones';
import { Documento } from '../../../../ado/entities/documento';
import { Directorio } from '../../../../ado/entities/directorio';
import { DirectorioService } from 'src/app/website/pages/ado/services/directorio.service'
import { Util } from 'src/app/website/pages/comun/entities/util';
import { DomSanitizer } from '@angular/platform-browser';
import { Message, MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { CasosMedicosService } from 'src/app/website/pages/core/services/casos-medicos.service';

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
  @Input('idSl') idSl?: string | number;
  @Input() saludLaboralFlag: boolean = false;
  documentosList?: any[];
  documentosListFoto: any[] = [];
  documentosListDocumental: any[] = [];
  documentosListPoliticas: any[] = [];
  documentosListProcedimientos: any[] = [];
  documentosListMultimedia: any[] = [];

  visibleDlgFoto?: boolean;
  visibleDlgDocumento?: boolean;
  visibleDlgPoliticas?: boolean;
  visibleDlgProcedimientos?: boolean;
  visibleDlgMultimedia?: boolean;

  modulo = Modulo.SEC.value;
  saludL = JSON.parse(localStorage.getItem('saludL') || '{}');
  usuarioId = JSON.parse(localStorage.getItem('session') || '{}');
  pkuser = this.usuarioId.usuario.id;
  msgs?: Message[];
  constructor(
    private directorioService: DirectorioService,
    private confirmationService: ConfirmationService,
    private route: Router,
    private messageService: MessageService,
    private scmService: CasosMedicosService,



  ) { }

  ngOnInit(): void {
    console.log(this.idSl, 'uwu');   
    
  }
  showDialog(tipo: string) {

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

  redirectCase() {
    setTimeout(() => {
      // Redirige al caso después de 3 segundos
      this.route.navigate(['/app/scm/saludlaboral/' + this.idSl]);
  
      // Verifica si los datos ya están en localStorage
      let storedCase = localStorage.getItem('saludL');
      localStorage.setItem('scmShowCase', 'true');
      localStorage.setItem('slShowCase', 'true');
      const id = Number(this.idSl);
  
      // Si id no es un número válido, evitamos ejecutar la función
      // if (!isNaN(id)) {
      //   this.loadMailData(id);
      //   this.loadMailDataUser(id, this.pkuser);
      // } else {
      //   console.error('El valor de idSl no es válido:', this.idSl);
      // }  

      
      if (storedCase && JSON.parse(storedCase).idSl === this.idSl) {
        // Si los datos del caso ya están en el localStorage, solo los usamos
        console.log("Datos del caso obtenidos de localStorage", JSON.parse(storedCase));
      } else {
        // Si los datos no están en el localStorage, hacemos una petición para obtenerlos
        if (this.idSl !== undefined && this.idSl !== null) {
          this.scmService.getCaseSL(this.idSl).then((caseData) => {
            // Almacenar los datos del caso en localStorage
            localStorage.setItem('saludL', JSON.stringify(caseData));
            window.location.reload();
            console.log("Datos del caso actualizados y almacenados en localStorage", caseData);
          });
        } else {
          console.error("El ID del caso no es válido");
        }
        
      }
      
  
    }, 3000);  
    // Mensaje de confirmación
    this.msgs = [];
    this.messageService.add({
      key: 'formSL',
      severity: "success",
      summary: "Caso encontrado",
      detail: `Caso asociado numero ${this.idSl} revisar la documentación`,
      
    });
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
}

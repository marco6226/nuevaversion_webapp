import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Directorio } from 'src/app/website/pages/ado/entities/directorio';
import { Documento } from 'src/app/website/pages/ado/entities/documento';
import { DirectorioService } from 'src/app/website/pages/ado/services/directorio.service';
import { Modulo } from 'src/app/website/pages/core/enums/enumeraciones';
import { CasosMedicosService } from 'src/app/website/pages/core/services/casos-medicos.service';

@Component({
  selector: 'app-cargue-documentos-send-documentacion',
  templateUrl: './cargue-documentos-send-documentacion.component.html',
  styleUrl: './cargue-documentos-send-documentacion.component.scss'
})
export class CargueDocumentosSendDocumentacionComponent implements OnInit{

  documentacionSubirSelect: any
  selectedDocIDDT: number = 0;
  flagDocDT: boolean = false;
  documentoSendDocs: any[] = [];
  msgs!: Message[];




  saludL = JSON.parse(localStorage.getItem('saludL') || '{}');
  usuarioId = JSON.parse(localStorage.getItem('session') || '{}');
  pkuser = this.usuarioId.usuario.id;
  pkuser2 = this.usuarioId.usuario.id;
  pkuserSalud = this.usuarioId.usuario.id;
  pkuserPsico = this.usuarioId.usuario.id;
  fechaCreacion2 = this.saludL.fechaCreacion;
  idSl = this.saludL.idSl;

  documentosDT!: Documento[];

  modulo: string = Modulo.SSL.value;

  //@Input('documentos') directoriosSendocs: Directorio[] = [];
  @Input() directoriosSendocs: Directorio[] = [];

  documentosSendDocs!: Documento[];

  saludLaboralSelect: any
  documentoId: any[] = [];

  consultar2: boolean = false;





  ngOnInit(): void {
    this.consultar2 = (localStorage.getItem('scmShowCase') === 'true') ? true : false;

  }

  constructor(
    private scmService: CasosMedicosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private directorioService: DirectorioService,


  ){



  }

  openUploadDialogCaseDT(docId: number, documentsID: any) {
    this.selectedDocIDDT = docId;
    this.flagDocDT = true;
    if (documentsID) {
      this.documentoSendDocs = documentsID.split(",");
    } else {
      this.documentoSendDocs = [];
    }
  }

  async updateCaseDT(docId: number, documentoId: string) {
    try {
      await this.scmService.updateDatosTrabajadorDocs(docId, documentoId);
    } catch (error) {
      console.error('Error actualizando mail salud laboral', error);
    }
  }

  async onUploadCaseDT(event: Directorio) {

    if (this.documentosSendDocs == null) {
      this.documentosSendDocs = [];
    }
    if (this.directoriosSendocs == null) {
      this.directoriosSendocs = [];
    }

    try {
      this.directoriosSendocs.push(event);
      this.documentosSendDocs.push(event.documento!);
      let ids: string[] = [];

      if (this.saludLaboralSelect && this.saludLaboralSelect.documentosSendDocs) {
        ids = this.saludLaboralSelect.documentosSendDocs.split(',');
      }

      this.documentoId.push(event.documento!.id);
      ids.push(this.documentoId.toString())
      // this.documentacionListUser[index].documentos = this.documentoId;


      // Llamada para actualizar la tabla mail_saludlaboral
      //await this.updateCaseDT(this.idSl, this.documentoId.toString());
      await this.updateCaseDT(this.idSl, this.directoriosSendocs.map(value => value.id).join(','));


      // Mostrar mensaje de éxito
      this.messageService.add({
        // this.msgs.push({
        key: 'formScmSL',
        severity: "success",
        summary: "Documentacion",
        detail: `Documentacion Adjuntada`,
      });

    } catch (error) {
      console.error(error);

      // Mostrar mensaje de error
      this.messageService.add({
        // this.msgs.push({
        key: 'formScmSL',
        severity: "warn",
        summary: "Documentacion Fallida",
        detail: `Documentacion no Adjuntada revisa`,
      });
    }
  }

  documentacionList: any;
  deleteDocumentDT(diagId: string | number, docId: string | number) {
    this.scmService.deleteIdDocsCaseDT(diagId, docId)
      .then((response: any) => {
        // Actualizar la lista de documentos o manejar la respuesta
        this.documentacionList = this.documentacionList.filter((doc: { id: string | number; }) => doc.id !== docId);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Documento eliminado correctamente' });
      })
      .catch((error: any) => {
        // Manejar errores
      });
  }
  eliminarDocumentCaseDT(doc: Documento) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDocumentDT(this.idSl, doc.id),
          this.directorioService.eliminarDocumento(doc.id).then(
            data => {
              this.directoriosSendocs = this.directoriosSendocs.filter(val => val.id !== doc.id);
              let docIds: string[] = [];

              this.directoriosSendocs.forEach(el => {
                docIds.push(el.id!);
              });
              this.messageService.add({
                // this.msgs.push({
                key: 'formScmSL',
                severity: "success",
                summary: "Documentacion Retirada",
                detail: `El documento ha sido retirado`,
              });
            }

          ).catch(err => {
            if (err.status !== 404) {
              // Si el error no es 404, maneja otros posibles errores.
              this.messageService.add({
                // this.msgs.push({
                key: 'formScmSL',
                severity: "warn",
                summary: "Documentacion Fallida",
                detail: `No se pudo eliminar el documento`,
              });
            }

            // Si el error es 404, o cualquier otro caso, sigue eliminando el documento localmente
            this.directoriosSendocs = this.directoriosSendocs.filter(val => val.id !== doc.id);
            let docIds: string[] = [];

            this.directoriosSendocs.forEach(el => {
              docIds.push(el.id!);
            });
            console.log("que trae dosid", docIds);
          });
      }
    });
  }
  stateDownload: boolean = false;

  descargarDocumento(doc: Documento) {
    this.stateDownload = true; // Deshabilitar el botón al iniciar la descarga
    this.messageService.add({
      key: 'download',
      severity: 'info',
      summary: 'Descargando archivo',
      detail: 'Por favor, espera mientras se descarga el archivo...'
    });
  
    this.directorioService.download(doc.id).then(
      resp => {
        if (resp != null) {
          const blob = new Blob([<any>resp]);
          const url = URL.createObjectURL(blob);
          const dwldLink = document.getElementById("dwldLink")!;
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", doc.nombre);
          dwldLink.click();
  
          // Mensaje de éxito
          this.messageService.add({
            key: 'download',
            severity: 'success',
            summary: 'Descarga completa',
            detail: 'El archivo se ha descargado exitosamente.'
          });
        } else {
          // Mensaje de fallo si la respuesta es nula
          this.messageService.add({
            key: 'download',
            severity: 'error',
            summary: 'Error de descarga',
            detail: 'No se pudo descargar el archivo. Por favor, inténtalo de nuevo.'
          });
        }
      }
    ).catch(err => {
      // Mensaje de fallo en caso de error
      this.messageService.add({
        key: 'download',
        severity: 'error',
        summary: 'Error de descarga',
        detail: 'Ocurrió un error al intentar descargar el archivo. Inténtalo más tarde.'
      });
    }).finally(() => {
    });
  }

}

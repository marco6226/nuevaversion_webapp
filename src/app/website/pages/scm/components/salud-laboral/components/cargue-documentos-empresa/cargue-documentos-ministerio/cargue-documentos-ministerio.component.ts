import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Directorio } from 'src/app/website/pages/ado/entities/directorio';
import { Documento } from 'src/app/website/pages/ado/entities/documento';
import { DirectorioService } from 'src/app/website/pages/ado/services/directorio.service';
import { Modulo } from 'src/app/website/pages/core/enums/enumeraciones';
import { CasosMedicosService } from 'src/app/website/pages/core/services/casos-medicos.service';

@Component({
  selector: 'app-cargue-documentos-ministerio',
  templateUrl: './cargue-documentos-ministerio.component.html',
  styleUrl: './cargue-documentos-ministerio.component.scss'
})
export class CargueDocumentosMinisterioComponent implements OnInit{

  msgs!: Message[];
  documentacionSubirSelect: any
  selectedDocMin: number = 0;
  documentoMin: any[] = [];
  flagDocMin: boolean = false;
  documentosMin!: Documento[];
  modulo: string = Modulo.SSL.value;
  saludLaboralSelect: any
  


  //@Input('documentos') directoriosMin: Directorio[] = [];
  @Input() directoriosMin: Directorio[] = [];


  documentacionListUser: any;
  documentoId: any[] = [];







  saludL = JSON.parse(localStorage.getItem('saludL') || '{}');
  usuarioId = JSON.parse(localStorage.getItem('session') || '{}');
  idSl = this.saludL.idSl;

  ngOnInit(): void {
      
  }

  constructor(
    private scmService: CasosMedicosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private directorioService: DirectorioService,




  ){
    
  }

  openUploadDialogCaseMinisterio(docId: number, documentsID: any) {
    this.selectedDocMin = docId;
    this.flagDocMin = true;
    if (documentsID) {
      this.documentoMin = documentsID.split(",");
    } else {
      this.documentoMin = [];
    }
  }
  async onUploadCaseMin(event: Directorio) {

    if (this.documentosMin == null) {
      this.documentoMin = [];
    }
    if (this.directoriosMin == null) {
      this.directoriosMin = [];
    }

    try {
      this.directoriosMin.push(event);
      this.documentoMin.push(event.documento!);
      let ids: string[] = [];

      if (this.saludLaboralSelect && this.saludLaboralSelect.documentosMin) {
        ids = this.saludLaboralSelect.documentosMin.split(',');
      }

      this.documentoId.push(event.documento!.id);
      ids.push(this.documentoId.toString())
      // this.documentacionListUser[index].documentos = this.documentoId;


      // Llamada para actualizar la tabla mail_saludlaboral
      //await this.updateCaseDT(this.idSl, this.documentoId.toString());
      await this.updateCaseMin(this.idSl, this.directoriosMin.map(value => value.id).join(','));


      // Mostrar mensaje de éxito
      this.messageService.add({
        // this.msgs.push({
        key: 'formScmSL',
        severity: "success",
        summary: "Usuario actualizado",
        detail: `Documentacion Adjuntada`,
      });

    } catch (error) {
      console.error(error);

      // Mostrar mensaje de error
      this.messageService.add({
        // this.msgs.push({
        key: 'formScmSL',
        severity: "warn",
        summary: "Usuario actualizado",
        detail: `Documentacion no Adjuntada revisa`,
      });
    }
  }
  async updateCaseMin(docId: number, documentoId: string) {
    try {
      await this.scmService.updateDatosTrabajadorMin(docId, documentoId);
    } catch (error) {
      console.error('Error actualizando mail salud laboral', error);
    }
  }

  documentacionList: any;
  deleteDocumentDT(diagId: string | number, docId: string | number) {
    this.scmService.deleteIdDocsMin(diagId, docId)
      .then((response: any) => {
        // Actualizar la lista de documentos o manejar la respuesta
        this.documentacionList = this.documentacionList.filter((doc: { id: string | number; }) => doc.id !== docId);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Documento eliminado correctamente' });
      })
      .catch((error: any) => {
        // Manejar errores
      });
  }
  eliminarDocumentMin(doc: Documento) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDocumentDT(this.idSl, doc.id),
          this.directorioService.eliminarDocumento(doc.id).then(
            data => {
              this.directoriosMin = this.directoriosMin.filter(val => val.id !== doc.id);
              let docIds: string[] = [];

              this.directoriosMin.forEach(el => {
                docIds.push(el.id!);
              });
              this.messageService.add({
                // this.msgs.push({
                key: 'formScmSL',
                severity: "success",
                summary: "Usuario actualizado",
                detail: `Documento Retirado`,
              });
            }

          ).catch(err => {
            if (err.status !== 404) {
              // Si el error no es 404, maneja otros posibles errores.
              this.messageService.add({
                // this.msgs.push({
                key: 'formScmSL',
                severity: "warn",
                summary: "Usuario actualizado",
                detail: `No se pudo eliminar el documento`,
              });
            }

            // Si el error es 404, o cualquier otro caso, sigue eliminando el documento localmente
            this.directoriosMin = this.directoriosMin.filter(val => val.id !== doc.id);
            let docIds: string[] = [];

            this.directoriosMin.forEach(el => {
              docIds.push(el.id!);
            });
            console.log("que trae dosid", docIds);
          });
      }
    });
  }

}
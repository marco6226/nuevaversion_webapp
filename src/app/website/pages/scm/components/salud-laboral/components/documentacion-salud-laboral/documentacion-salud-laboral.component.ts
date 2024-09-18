import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PrimeNGConfig, SelectItem, MessageService, Message, ConfirmationService } from 'primeng/api';
import { Directorio } from 'src/app/website/pages/ado/entities/directorio';
import { Documento } from 'src/app/website/pages/ado/entities/documento';
import { DirectorioService } from 'src/app/website/pages/ado/services/directorio.service';
import { Modulo } from 'src/app/website/pages/core/enums/enumeraciones';
import { CasosMedicosService } from 'src/app/website/pages/core/services/casos-medicos.service';
import { Criteria, Filter } from 'src/app/website/pages/core/entities/filter';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { SesionService } from 'src/app/website/pages/core/services/session.service';

@Component({
  selector: 'app-documentacion-salud-laboral',
  templateUrl: './documentacion-salud-laboral.component.html',
  styleUrl: './documentacion-salud-laboral.component.scss'
})
export class DocumentacionSaludLaboralComponent implements OnInit{
    ngOnInit(): void {
        this.pkUser = 13318;
        this.loadMailData(this.pkuser);
        setTimeout(() => {
          this.consultar = (localStorage.getItem('slShowCase') === 'true') ? true : false;
          this.saludLaboralSelect = JSON.parse(localStorage.getItem('saludL')!)
        }, 2000);
        
    }
    consultar: boolean = false;
    saludLaboralSelect: any
    documentacionListUser: any;
    documentacionSelectUser: any;
    pkUser: number | null = null;
    documentacionList: any;
    selectedDocId: number = 0;
    flagDoc: boolean = false
    totalRecords!: number;
    loading: boolean = false;
    @Input('documentos') directorios: Directorio[] = [];
    documentos!: Documento[];
    documentoId: any[] = [];
    formulario: FormGroup;
    dialogRechazoFlag: boolean = false
    modulo: string = Modulo.SSL.value;
    motivoRechazo: string = '';



    saludL = JSON.parse(localStorage.getItem('saludL') || '{}');
    usuarioId = JSON.parse(localStorage.getItem('session') || '{}');
    pkuser = this.usuarioId.usuario.id;
    idSl = this.saludL.idSl;
    fields: string[] = [
      'id',
      'fechaEnvio',
      'fechaLimite',
      'docSolicitado',
      'usuarioSolicitante',
      'usuarioSolicitado',
      'estadoCorreo',
      'fechaSolicitud',
      'pkCase',
      'soliictanteNombres',
      'solicitanteCedula',
      'pkUser',
      'asignacionTarea',
      'solicitadoNombres',
      'solicitadoCedula',
      'solicitadoNombresMail',
      'razonRechazoSolicitado',
      'documentos',
      'razonRechazoSolicitante',
      'correoEnviado',
      'empresaId',
      'eliminado'

    ];
    

    constructor(
        private route: ActivatedRoute,
        private scmService: CasosMedicosService,
        private cd: ChangeDetectorRef,
        private casoMedico: CasosMedicosService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private directorioService: DirectorioService,
        private renderer: Renderer2,
        private sessionService: SesionService,
        private el: ElementRef,
        fb: FormBuilder,
        
    ){
        this.formulario = fb.group({
            usuarioSolicitado: new FormControl('', Validators.required),
            fechaLimite: new FormControl('', Validators.required),
            pkUser: new FormControl(''),
            estadoCorreo: new FormControl(1),
            docSolicitado: new FormControl(),
            soliictanteNombres: new FormControl(),
            asignacionTarea: new FormControl(),
            razonRechazoSolicitado: new FormControl(''),
            razonRechazoSolicitante: new FormControl(''),

          });

    }
    async loadMailData(param: number) {
        try {
          const data = await this.scmService.findAllByIdMailUserOnlyUser(param);
          this.documentacionListUser = data; // Asigna los datos a documentacionListUser
          this.cd.detectChanges();
          this.loadDocumentos();
        } catch (error) {
        }
      }
      testing: boolean = false;

      async lazyLoad(event: any) {
        const idemp = JSON.parse(localStorage.getItem('session') || '{}');
        const emp = idemp.empresa.id;
        this.testing = false; 
        let usuario = await this.sessionService.getUsuario();
        
        let filterQuery = new FilterQuery();
        filterQuery.sortField = event.sortField;
        filterQuery.sortOrder = event.sortOrder;
        filterQuery.offset = event.first;
        filterQuery.rows = event.rows;
        filterQuery.count = true;
        let filterUser = new Filter();
        filterUser.criteria = Criteria.EQUALS;
        filterUser.field = 'usuarioSolicitado';
        filterUser.value1 = usuario?.email;
        let filterEmp = new Filter();
        filterEmp.criteria = Criteria.EQUALS;
        filterEmp.field = 'empresaId';
        filterEmp.value1 = emp;
        let filterElim = new Filter();
        filterElim.criteria = Criteria.EQUALS;
        filterElim.field = 'eliminado';
        filterElim.value1 = 'false';

    
    
        filterQuery.fieldList = this.fields;
        filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
        filterQuery.filterList.push(filterUser, filterEmp, filterElim);
    
        try {
          let res: any = await this.scmService.findWithFilterMail(filterQuery);
          this.documentacionListUser = res?.data?.map((dto: any) => {
            return FilterQuery.dtoToObject(dto);
          });
          this.totalRecords = res.count;

    
        } catch (error) {
        }
      }
      casosListFilter: any;
      onFilter(event: any) {
        this.casosListFilter = event.filteredValue
      }
      isFechaLimiteProxima(fechaLimite: string): boolean {
        const fechaLimiteDate = new Date(fechaLimite);
        const dosDiasEnMS = 2 * 24 * 60 * 60 * 1000; // Dos días en milisegundos
        const dosDiasAntes = new Date().getTime() + dosDiasEnMS; // Fecha actual más dos días
        return fechaLimiteDate.getTime() < dosDiasAntes;
      }
      convertirEstadoCorreoUser(estado: number): string {
        switch (estado) {
          case 1:
            return 'Pendiente';
          case 2:
            return 'Rechazado';
          case 3:
            return 'Enviado';
          case 4:
            return 'Aprobado';
          case 5:
            return 'Eliminado';
          default:
            return 'Desconocido';
        }
      }
      

      
   
      getSelectedId() {
        if (this.documentacionSelectUser) {
          const selectedId = this.documentacionSelectUser.id;
          return selectedId;
        } else {
          return null;
        }
      }
      openUploadDialog(docId: number, documentsID: any) {
        this.selectedDocId = docId;
        this.flagDoc = true;
        if (documentsID) {
          this.documentoId = documentsID.split(",");
        } else {
          this.documentoId = [];
        }
    
    
      }
      // async onUpload(event: Directorio) {
      //   if (this.documentos == null) {
      //     this.documentos = [];
      //   }
      //   if (this.directorios == null) {
      //     this.directorios = [];
      //   }
    
      //   this.directorios.push(event);
    
    
      //   this.documentos.push(event.documento!);
      //   let index = this.documentacionListUser.findIndex((c: any) => this.selectedDocId == c.id);
      //   console.log("INDEXXXXX", index);
    
      //   this.documentoId.push(event.documento!.id);
      //   this.documentacionListUser[index].documentos = this.documentoId;
    
    
      //   console.log('el directorio', this.directorios);
    
      //   // Llamada para actualizar la tabla mail_saludlaboral
      //   await this.updateMailSaludLaboral(this.selectedDocId, this.documentoId.toString());
      //   this.putmaildocsEnviados();
      //   //this.loadMailData(this.idSl);
    
      // }
      async onUpload(event: Directorio) {
        if (this.documentacionSelectUser.estadoCorreo === 2) {
          
            this.messageService.add({
                severity: 'warn',
                summary: 'Acción no permitida',
                detail: 'No se puede adjuntar un documento a un caso rechazado.'
            });
            this.dialogRechazoFlag = false;
            return; // Salir de la función sin hacer nada más
        }
        if (this.documentacionSelectUser.estadoCorreo === 4) {
          
            this.messageService.add({
                severity: 'warn',
                summary: 'Acción no permitida',
                detail: 'No se puede adjuntar un documento a un caso aprobado.'
            });
            this.dialogRechazoFlag = false;
            return; // Salir de la función sin hacer nada más
        }
        if (this.documentos == null) {
          this.documentos = [];
        }
        if (this.directorios == null) {
          this.directorios = [];
        }
    
        try {
          this.directorios.push(event);
          this.documentos.push(event.documento!);
          let index = this.documentacionListUser.findIndex((c: any) => this.selectedDocId == c.id);
    
          this.documentoId.push(event.documento!.id);
          this.documentacionListUser[index].documentos = this.documentoId;
    
    
          // Llamada para actualizar la tabla mail_saludlaboral
          await this.updateMailSaludLaboral(this.selectedDocId, this.documentoId.toString());
          this.putmaildocsEnviados();
          setTimeout(() => {
            this.lazyLoad(event);
          }, 2000);
          this.documentacionSelectUser= [];
    
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
      
      async updateMailSaludLaboral(docId: number, documentoId: String) {
        try {
          await this.scmService.updateMailSaludLaboral(docId, documentoId);
        } catch (error) {
        }
      }
      putmaildocsEnviados() {

        const body = this.formulario.value;
        const selectedIdSoli = this.selectedDocId;
        //fecha: new Date()
    
        if (selectedIdSoli) {
          this.casoMedico.putCaseMaildocsEnviados(selectedIdSoli, body).then((response) => {
            if (response) {
              this.dialogRechazoFlag = false;
            } else {
            }
          }).catch((error) => {
          });
        } else {
        }
      }
      
      putmail() {
        if (this.documentacionSelectUser.estadoCorreo === 3) {
          
            this.messageService.add({
                severity: 'warn',
                summary: 'Acción no permitida',
                detail: 'No se puede rechazar un documento que ya ha sido enviado.'
            });
            this.dialogRechazoFlag = false;
            return; // Salir de la función sin hacer nada más
        }
        if (this.documentacionSelectUser.estadoCorreo === 2) {
          
            this.messageService.add({
                severity: 'warn',
                summary: 'Acción no permitida',
                detail: 'No se puede rechazar un documento que ya ha sido rechazado.'
            });
            this.dialogRechazoFlag = false;
            return; // Salir de la función sin hacer nada más
        }
        if (this.documentacionSelectUser.estadoCorreo === 4) {
          
            this.messageService.add({
                severity: 'warn',
                summary: 'Acción no permitida',
                detail: 'No se puede rechazar un documento de un caso aprobado.'
            });
            this.dialogRechazoFlag = false;
            return; // Salir de la función sin hacer nada más
        }
        if (!this.motivoRechazo.trim()) {
          console.error("El motivo de rechazo no puede estar vacío");
          return;
        }
    
        // Actualizar el campo de rechazo en el formulario
        this.formulario.get('razonRechazoSolicitado')?.setValue(this.motivoRechazo);
    
        const body = this.formulario.value;
        const selectedId = this.documentacionSelectUser?.id;
    
        if (selectedId) {
          this.casoMedico.putCaseMail(selectedId, body).then((response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Rechazo',
                detail: 'Se rechazo el documento correctamente.'
            });              this.dialogRechazoFlag = false;
              this.lazyLoad(event);
              this.documentacionSelectUser = [];
              //this.loadMailData(this.pkuser)
            } else {
              console.error("Error en la actualización");
            }
          }).catch((error) => {
            console.error("Error en la actualización", error);
          });
        } else {
          console.error("No hay un caso seleccionado");
        }
      }
      eliminarDocument(doc: Documento) {
        // Verifica si el estado del caso es 'Aprobado' (estadoCorreo === 4)
        if (this.documentacionSelectUser.estadoCorreo === 4) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Acción no permitida',
                detail: 'No se puede eliminar un documento de un caso aprobado.'
            });
            return; // Salir de la función sin hacer nada más
        }
    
    
        if (!doc || !doc.id) {
            console.error('El documento no tiene un ID válido:', doc);
            return;
        }
    
        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteDocument(this.documentacionSelectUser.id, doc.id);
                this.directorioService.eliminarDocumento(doc.id).then(
                    data => {
                        // Filtrar solo si val tiene un id válido
                        this.directorios = this.directorios.filter(val => val.id && val?.id! !== doc?.id!);
                        let docIds: string[] = [];
    
                        this.directorios.forEach(el => {
                            if (el.id) {
                                docIds.push(el.id!);
                            }
                        });
                        this.messageService.add({
                severity: 'success',
                summary: 'Documento Eliminado',
                detail: 'El documento ha sido retirado.'
            });
            this.lazyLoad(doc);
            this.documentacionSelectUser= [];
                       
                    }
                ).catch(err => {
                    if (err.status !== 404) {
                        console.error('Error al eliminar el documento:', err);
                    }
    
                    // Elimina el documento localmente en caso de error
                    // this.directorios = this.directorios.filter(val => val.id && val.id !== doc.id);
                    // let docIds: string[] = [];
    
                    // this.directorios.forEach(el => {
                    //     if (el.id) {
                    //         docIds.push(el.id);
                    //     }
                    // });
                    // console.log("que trae docIds", docIds);
                });
            }
        });
    }
    
    
      deleteDocument(diagId: string | number, docId: string | number) {
        
        this.scmService.deleteIdDocs(diagId, docId)
          .then((response: any) => {
            // Actualizar la lista de documentos o manejar la respuesta
            this.documentacionList = this.documentacionList.filter((doc: { id: string | number; }) => doc.id !== docId);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Documento eliminado correctamente' });
          })
          .catch((error: any) => {
            // Manejar errores
            //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el documento' });
          });
      }
      loadDocumentos() {
        if (this.documentacionListUser) {
          (this.documentacionListUser).forEach(async (element: any) => {
            if (element.documentos) {
              let docum = element.documentos.split(",");
              docum.forEach((algo: string) => {
                this.directorioService.buscarDocumentosById(algo).then((elem: Directorio[]) => {
                  this.directorios.push(elem[0]);
                })
              });
    
            }
    
          });
        }
    
      }
      
}






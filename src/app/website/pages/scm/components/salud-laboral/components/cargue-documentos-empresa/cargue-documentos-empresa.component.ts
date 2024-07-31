import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService, SelectItem } from 'primeng/api';
import { Directorio } from 'src/app/website/pages/ado/entities/directorio';
import { Documento } from 'src/app/website/pages/ado/entities/documento';
import { DirectorioService } from 'src/app/website/pages/ado/services/directorio.service';
import { ComunService } from 'src/app/website/pages/comun/services/comun.service';
import { Modulo } from 'src/app/website/pages/core/enums/enumeraciones';
import { CasosMedicosService } from 'src/app/website/pages/core/services/casos-medicos.service';
//import { ComunService } from 'src/app/website/pages/core/services/comun.service';
import { Empleado } from 'src/app/website/pages/empresa/entities/empleado';

@Component({
  selector: 'app-cargue-documentos-empresa',
  templateUrl: './cargue-documentos-empresa.component.html',
  styleUrl: './cargue-documentos-empresa.component.scss'
})
export class CargueDocumentosEmpresaComponent implements OnInit {
  msgs!: Message[];
  visibleDlgCertificadoARL: boolean = false;
  flagDocEmp: boolean = false;
  flagDocArl: boolean = false;
  flagDocJr: boolean = false;
  flagDocJn: boolean = false;
  selectedDocEmp: number = 0;
  selectedDocArl: number = 0;
  selectedDocJr: number = 0;
  selectedDocJn: number = 0;
  modulo: string = Modulo.SSL.value;
  documentos!: Documento[];
  documentosArl!: Documento[];
  saludLaboralSelect: any
  documentoId: any[] = [];
  selectedDocId: number = 0;
  fechaActual: Date = new Date();
  yearRange: string = "1900:" + this.fechaActual.getFullYear();
  documentosEmp!: Documento[];
  documentosJr!: Documento[];
  documentosJn!: Documento[];
  documentacionSubirSelect: any
  //empleadoForm: FormGroup;
  empleadoSelect?: Empleado | null;
  jrDocs: SelectItem[] = [];
  ePSDocs: SelectItem[] = [];
  arlDocs: SelectItem[] = [];
  jnDocs: SelectItem[] = [];


  saludL = JSON.parse(localStorage.getItem('saludL') || '{}');
  usuarioId = JSON.parse(localStorage.getItem('session') || '{}');
  idSl = this.saludL.idSl;
  @Input() directorios: Directorio[] = [];
  @Input() directoriosArl: Directorio[] = [];
  @Input() directoriosJr: Directorio[] = [];
  @Input() directoriosJn: Directorio[] = [];
  @Output() deleteDoc = new EventEmitter<any>();
  @Input() empleadoForm: FormGroup;

  async ngOnInit() {

    this.loadData();

  }
  constructor(
    private scmService: CasosMedicosService,
    private messageService: MessageService,
    private directorioService: DirectorioService,
    private cdr: ChangeDetectorRef,
    private comunService: ComunService,
    private confirmationService: ConfirmationService,


    fb: FormBuilder,
  ) {
    this.empleadoForm = fb.group({
      'id': [null],
      'primerNombre': [null, Validators.required],
      'segundoNombre': null,
      'primerApellido': [null, Validators.required],
      'segundoApellido': null,
      'codigo': [null],
      'direccion': [null],
      'fechaIngreso': [null, Validators.required],
      'fechaNacimiento': [null],
      'genero': [null],
      'numeroIdentificacion': [null, Validators.required],
      'telefono1': [null],
      'telefono2': [null],
      'afp': [null],
      'emergencyContact': [null],
      "corporativePhone": [null],
      'phoneEmergencyContact': [null],
      'emailEmergencyContact': [null],
      'ccf': [null],
      'ciudad': [null],
      'eps': [null],
      'arl': [null],
      'tipoIdentificacion': [null, Validators.required],
      'tipoVinculacion': [null],
      'zonaResidencia': [null],
      'area': [null, Validators.required],
      'localidad': [null],
      'cargoId': [null, Validators.required],
      'perfilesId': [null, Validators.required],
      'email': [{ value: "", disabled: true }, Validators.required],
      direccionGerencia: [null],
      regional: [null],
      businessPartner: [null],
      jefeInmediato: [null],
      correoPersonal: [null],
      ciudadGerencia: [null],
      division: [null],
      //seccion 2
      usuarioCreador: [null],
      usuarioAsignado: [null],
      fecha_creacion: [null],
      fecha_edicion: [null],
      cargoOriginal: [null],
      cargoActual: [null],
      divisionOrigen: [null],
      divisionActual: [null],
      localidadOrigen: [null],
      localidadActual: [null],
      areaOrigen: [null],
      areaActual: [null],
      procesoOrigen: [null],
      procesoActual: [null],
      pkUser: [this.empleadoSelect?.id],
      nombreCompletoSL: [null],
      fechaRecepcionDocs: [null],
      entidadEmiteCalificacion: [null],
      otroDetalle: [null],
      detalleCalificacion: [null],
      fechaMaximaEnvDocs: [null],
      fechaCierreCaso: [null],
      fechaNotificacionEmp: [null],
      fechaNotificacionMin: [null],
      epsDictamen: [null],
      fechaDictamenArl: [''],
      arlDictamen: [''],
      documentosArl: [''],
      fechaDictamenJr: [''],
      jrDictamen: [''],
      documentosJr: [''],
      fechaDictamenJn: [''],
      documentosJn: [''],
    });

  }
  updateDocDate(doc: any) {
    console.log('Datos enviados:', doc);

    // Convertir la fecha a un timestamp antes de enviarla
    if (doc.fechaCreacion instanceof Date) {
        doc.fechaCreacion = doc.fechaCreacion.toISOString();
    }

    console.log('Fecha formateada:', doc.fechaCreacion);

    this.directorioService.actualizarDirectorio(doc).then(
        response => {
            console.log('Actualización exitosa:', response);

            // Forzar la actualización del componente de calendario
            this.resetFechaCreacion(doc);
        },
        error => {
            console.error('Error en la actualización:', error);
        }
    );
}

// Método para forzar la actualización del componente de calendario
resetFechaCreacion(doc: any) {
    if (doc.fechaCreacion) {
        const tempDate = new Date(doc.fechaCreacion); // Convertir a instancia de Date
        doc.fechaCreacion = null; // Desasignar la fecha
        this.cdr.detectChanges(); // Forzar la detección de cambios
        doc.fechaCreacion = tempDate; // Reasignar la fecha
        this.cdr.detectChanges(); // Forzar la detección de cambios nuevamente
    }
}



  documentoEmp: any[] = [];
  async onUploadCaseEmp(event: Directorio) {
    if (this.documentos == null) {
      this.documentos = [];
    }
    if (this.directorios == null) {
      this.directorios = [];
    }

    try {
      this.directorios.push(event);
      this.documentos.push(event.documento!);
      console.log(this.saludLaboralSelect);

      let ids: string[] = [];

      // Verificar si saludLaboralSelect y documentosEmpresa están definidos y no están vacíos
      if (this.saludLaboralSelect && this.saludLaboralSelect.documentosEmpresa) {
        ids = this.saludLaboralSelect.documentosEmpresa.split(',');
      }

      let index = ids.findIndex((c: any) => this.selectedDocId == c.id);
      console.log("INDEXXXXXemp", index);

      this.documentoId.push(event.documento!.id);
      ids.push(this.documentoId.toString());

      console.log('el directorio', this.directorios.map(value => value.id).join(','));

      // Llamada para actualizar la tabla mail_saludlaboral
      await this.updateCaseEmp(this.idSl, this.directorios.map(value => value.id).join(','));

      // Mostrar mensaje de éxito
      this.messageService.add({
        key: 'formScmSL',
        severity: "success",
        summary: "Usuario actualizado",
        detail: `Documentacion Adjuntada SM`,
      });
    } catch (error) {
      console.error(error);

      // Mostrar mensaje de error
      this.messageService.add({
        key: 'formScmSL',
        severity: "warn",
        summary: "Usuario actualizado",
        detail: `Documentacion no Adjuntada revisa`,
      });
    }
  }
  documentoArl: any[] = [];
  async onUploadCaseArl(event: Directorio) {
    if (this.documentosArl == null) {
      this.documentosArl = [];
    }
    if (this.directoriosArl == null) {
      this.directoriosArl = [];
    }

    try {

      this.directoriosArl.push(event);
      console.log(this.directoriosArl);

      this.documentosArl.push(event.documento!);
      console.log(this.saludLaboralSelect);

      let ids: string[] = [];

      // Verificar si saludLaboralSelect y documentosEmpresa están definidos y no están vacíos
      if (this.saludLaboralSelect && this.saludLaboralSelect.documentosArl) {
        ids = this.saludLaboralSelect.documentosArl.split(',');
      }

      let index = ids.findIndex((c: any) => this.selectedDocId == c.id);
      console.log("INDEXXXXXemp", index);

      this.documentoId.push(event.documento!.id);
      ids.push(this.documentoId.toString());

      console.log('el directorio', this.directoriosArl.map(value => value.id).join(','));

      // Llamada para actualizar la tabla mail_saludlaboral
      await this.updateCaseArl(this.idSl, this.directoriosArl.map(value => value.id).join(','));
      console.log("que tare esto", this.directoriosArl.map(value => value.id));


      // Mostrar mensaje de éxito
      this.messageService.add({
        key: 'formScmSL',
        severity: "success",
        summary: "Usuario actualizado",
        detail: `Documentacion Adjuntada SM`,
      });
    } catch (error) {
      console.error(error);

      // Mostrar mensaje de error
      this.messageService.add({
        key: 'formScmSL',
        severity: "warn",
        summary: "Usuario actualizado",
        detail: `Documentacion no Adjuntada revisa`,
      });
    }
  }

  // documentoArl: any[] = [];
  // async onUploadCaseArl(event: Directorio) {
  //   if (this.documentosArl == null) {
  //     this.documentosArl = [];
  //   }
  //   if (this.directoriosArl == null) {
  //     this.directoriosArl = [];
  //   }

  //   try {
  //     this.directoriosArl.push(event);
  //     this.documentosArl.push(event.documento!);
  //     console.log(this.saludLaboralSelect);

  //     let ids: string[] = [];

  //     // Verificar si saludLaboralSelect y documentosEmpresa están definidos y no están vacíos
  //     if (this.saludLaboralSelect && this.saludLaboralSelect.documentosArl) {
  //       ids = this.saludLaboralSelect.documentosArl.split(',');
  //     }

  //     let index = ids.findIndex((c: any) => this.selectedDocId == c.id);
  //     console.log("INDEXXXXXemp", index);

  //     this.documentoId.push(event.documento!.id);
  //     ids.push(this.documentoId.toString());

  //     console.log('el directorio', this.directoriosArl);

  //     // Llamada para actualizar la tabla mail_saludlaboral
  //     await this.updateCaseArl(this.idSl, this.directorios.map(value => value.id).join(','));

  //     // Mostrar mensaje de éxito
  //     this.messageService.add({
  //       key: 'formScmSL',
  //       severity: "success",
  //       summary: "Usuario actualizado",
  //       detail: `Documentacion Adjuntada`,
  //     });
  //   } catch (error) {
  //     console.error(error);

  //     // Mostrar mensaje de error
  //     this.messageService.add({
  //       key: 'formScmSL',
  //       severity: "warn",
  //       summary: "Usuario actualizado",
  //       detail: `Documentacion no Adjuntada revisa`,
  //     });
  //   }
  // }
  documentoJr: any[] = [];
  async onUploadCaseJr(event: Directorio) {
    if (this.documentosJr == null) {
      this.documentosJr = [];
    }
    if (this.directoriosJr == null) {
      this.directoriosJr = [];
    }

    try {
      this.directoriosJr.push(event);
      this.documentosJr.push(event.documento!);
      console.log(this.saludLaboralSelect);

      let ids: string[] = [];

      // Verificar si saludLaboralSelect y documentosEmpresa están definidos y no están vacíos
      if (this.saludLaboralSelect && this.saludLaboralSelect.documentosJr) {
        ids = this.saludLaboralSelect.documentosJr.split(',');
      }

      let index = ids.findIndex((c: any) => this.selectedDocId == c.id);
      console.log("INDEXXXXXemp", index);

      this.documentoId.push(event.documento!.id);
      ids.push(this.documentoId.toString());

      console.log('el directorio', this.directoriosJr.map(value => value.id).join(','));

      // Llamada para actualizar la tabla mail_saludlaboral
      await this.updateCaseJr(this.idSl, this.directoriosJr.map(value => value.id).join(','));
      console.log("que tare esto", this.directoriosJr.map(value => value.id));

      // Mostrar mensaje de éxito
      this.messageService.add({
        key: 'formScmSL',
        severity: "success",
        summary: "Usuario actualizado",
        detail: `Documentacion Adjuntada`,
      });
    } catch (error) {
      console.error(error);

      // Mostrar mensaje de error
      this.messageService.add({
        key: 'formScmSL',
        severity: "warn",
        summary: "Usuario actualizado",
        detail: `Documentacion no Adjuntada revisa`,
      });
    }
  }
  documentoJn: any[] = [];
  async onUploadCaseJn(event: Directorio) {
    if (this.documentosJn == null) {
      this.documentosJn = [];
    }
    if (this.directoriosJn == null) {
      this.directoriosJn = [];
    }

    try {
      this.directoriosJn.push(event);
      this.documentosJn.push(event.documento!);
      console.log(this.saludLaboralSelect);

      let ids: string[] = [];

      // Verificar si saludLaboralSelect y documentosEmpresa están definidos y no están vacíos
      if (this.saludLaboralSelect && this.saludLaboralSelect.documentosJn) {
        ids = this.saludLaboralSelect.documentosJn.split(',');
      }

      let index = ids.findIndex((c: any) => this.selectedDocId == c.id);
      console.log("INDEXXXXXemp", index);

      this.documentoId.push(event.documento!.id);
      ids.push(this.documentoId.toString());

      console.log('el directorio', this.directoriosJn.map(value => value.id).join(','));

      // Llamada para actualizar la tabla mail_saludlaboral
      await this.updateCaseJn(this.idSl, this.directoriosJn.map(value => value.id).join(','));
      console.log("que tare esto", this.directoriosJn.map(value => value.id));

      // Mostrar mensaje de éxito
      this.messageService.add({
        key: 'formScmSL',
        severity: "success",
        summary: "Usuario actualizado",
        detail: `Documentacion Adjuntada`,
      });
    } catch (error) {
      console.error(error);

      // Mostrar mensaje de error
      this.messageService.add({
        key: 'formScmSL',
        severity: "warn",
        summary: "Usuario actualizado",
        detail: `Documentacion no Adjuntada revisa`,
      });
    }
  }
  async updateCaseEmp(docId: number, documentoId: string) {
    try {
      await this.scmService.updateDatosTrabajadorEmp(docId, documentoId);
      console.log('Mail salud laboral actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando mail salud laboral', error);
    }
  }
  async updateCaseJn(docId: number, documentoId: string) {
    try {
      await this.scmService.updateDatosTrabajadorJn(docId, documentoId);
      console.log('Mail salud laboral actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando mail salud laboral', error);
    }
  }
  async updateCaseArl(docId: number, documentoId: string) {
    try {
      await this.scmService.updateDatosTrabajadorArl(docId, documentoId);
      console.log('Mail salud laboral actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando mail salud laboral', error);
    }
  }
  async updateCaseJr(docId: number, documentoId: string) {
    try {
      await this.scmService.updateDatosTrabajadorJr(docId, documentoId);
      console.log('Mail salud laboral actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando mail salud laboral', error);
    }
  }
  async loadData() {
    const data: any = await this.scmService.getCaseSL(this.idSl!.toString());
    if (data['fechaNotificacionEmp'] != null && data['fechaNotificacionEmp'] != undefined) {
      const formattedDate = new Date(data['fechaNotificacionEmp']);
      this.empleadoForm.controls['fechaNotificacionEmp'].setValue(formattedDate);
    } else {
      this.empleadoForm.controls['fechaNotificacionEmp'].setValue(null);
    }
    if (data['fechaDictamenArl'] != null && data['fechaDictamenArl'] != undefined) {
      const formattedDate = new Date(data['fechaDictamenArl']);
      this.empleadoForm.controls['fechaDictamenArl'].setValue(formattedDate);
    } else {
      this.empleadoForm.controls['fechaDictamenArl'].setValue(null);
    }
    if (data['fechaDictamenJr'] != null && data['fechaDictamenJr'] != undefined) {
      const formattedDate = new Date(data['fechaDictamenJr']);
      this.empleadoForm.controls['fechaDictamenJr'].setValue(formattedDate);
    } else {
      this.empleadoForm.controls['fechaDictamenJr'].setValue(null);
    }
    if (data['fechaDictamenJn'] != null && data['fechaDictamenJn'] != undefined) {
      const formattedDate = new Date(data['fechaDictamenJn']);
      this.empleadoForm.controls['fechaDictamenJn'].setValue(formattedDate);
    } else {
      this.empleadoForm.controls['fechaDictamenJn'].setValue(null);
    }
    console.log(this.ePSDocs, data['epsDictamen']);
    console.log('shi sheñol', this.ePSDocs.find(value => {


      return value.value == data['epsDictamen']
    }));




    this.comunService.findAllEps().then(
      (res: any) => {
        this.ePSDocs = res.map((item: any) => ({
          label: item.nombre, // Ajusta esto según la estructura de tus datos
          value: item.id // Ajusta esto según la estructura de tus datos
        }));
        this.empleadoForm.controls['epsDictamen'].setValue(this.ePSDocs.find(value => value.value.toString() == data['epsDictamen'].toString()));
      },
      err => {
        console.error('Error loading detalles:', err);
        this.ePSDocs = [];
      }
    );
    this.comunService.findAllArl().then(
      (res: any) => {
        this.arlDocs = res.map((item: any) => ({
          label: item.nombre, // Ajusta esto según la estructura de tus datos
          value: item.id // Ajusta esto según la estructura de tus datos
        }));
        this.empleadoForm.controls['arlDictamen'].setValue(this.arlDocs.find(value => value.value.toString() == data['arlDictamen'].toString()));
      },
      err => {
        console.error('Error loading detalles:', err);
        this.arlDocs = [];
      }
    );
    await this.comunService.findAllJuntas().then(
      (res: any) => {
        this.jrDocs = res.map((item: any) => ({
          label: item.nombre, // Ajusta esto según la estructura de tus datos
          value: item.id // Ajusta esto según la estructura de tus datos
        }));
        console.log(res, "res");
        this.empleadoForm.controls['jrDictamen'].setValue(this.jrDocs.find(value => value.value.toString() == data['jrDictamen'].toString()));


      },
      err => {
        console.error('Error loading detalles:', err);
        this.jrDocs = [];
      }
    );

  }

  openUploadDialogCaseEmpresa(docId: number, documentsID: any) {
    this.selectedDocEmp = docId;
    this.flagDocEmp = true;
    if (documentsID) {
      this.documentoEmp = documentsID.split(",");
    } else {
      this.documentoEmp = [];
    }
    console.log("openUploadDialogCaseDT", docId, documentsID);
  }
  openUploadDialogCaseArl(docId: number, documentsID: any) {
    this.selectedDocArl = docId;
    this.flagDocArl = true;
    if (documentsID) {
      this.documentoArl = documentsID.split(",");
    } else {
      this.documentoArl = [];
    }
    console.log("openUploadDialogCaseDT", docId, documentsID);
  }
  openUploadDialogCaseJR(docId: number, documentsID: any) {
    this.selectedDocJr = docId;
    this.flagDocJr = true;
    if (documentsID) {
      this.documentoJr = documentsID.split(",");
    } else {
      this.documentoJr = [];
    }
    console.log("openUploadDialogCaseDT", docId, documentsID);
  }
  openUploadDialogCaseJN(docId: number, documentsID: any) {
    this.selectedDocJn = docId;
    this.flagDocJn = true;
    if (documentsID) {
      this.documentosJn = documentsID.split(",");
    } else {
      this.documentosJn = [];
    }
    console.log("openUploadDialogCaseDT", docId, documentsID);
  }
  eliminarDocumentEmp(doc: any) {
    this.deleteDoc.emit(doc);
  }

  eliminarDocumentJr(doc: any) {
    this.deleteDoc.emit(doc);
  }

  eliminarDocumentJn(doc: any) {
    this.deleteDoc.emit(doc);
  }

  prepareFormData(formValue: any) {
    const processedFormValue = { ...formValue };

    Object.keys(processedFormValue).forEach(key => {
      if (Array.isArray(processedFormValue[key]) && processedFormValue[key].length === 1 && (processedFormValue[key][0] === null || processedFormValue[key][0] === '')) {
        processedFormValue[key] = null;
      }
    });

    return processedFormValue;
  }
  descargarDocumento(doc: Documento) {
    let msg = { severity: 'info', summary: 'Descargando documento...', detail: 'Archivo \"' + doc.nombre + "\" en proceso de descarga" };
    this.messageService.add(msg);
    this.directorioService.download(doc.id).then(
      resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp]);
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink")!;
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", doc.nombre);
          dwldLink.click();
          this.messageService.add({ severity: 'success', summary: 'Archivo descargado', detail: 'Se ha descargado correctamente el archivo ' + doc.nombre });
        }
      }
    );
  }
  documentacionList: any;
  deleteDocumentArl(diagId: string | number, docId: string | number) {
    this.scmService.deleteIdDocsArl(diagId, docId)
      .then((response: any) => {
        // Actualizar la lista de documentos o manejar la respuesta
        this.documentacionList = this.documentacionList.filter((doc: { id: string | number; }) => doc.id !== docId);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Documento eliminado correctamente' });
      })
      .catch((error: any) => {
        // Manejar errores
      });
  }
  eliminarDocumentArl(doc: Documento) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDocumentArl(this.idSl, doc.id),
          this.directorioService.eliminarDocumento(doc.id).then(
            data => {
              this.directoriosArl = this.directoriosArl.filter(val => val.id !== doc.id);
              let docIds: string[] = [];

              this.directoriosArl.forEach(el => {
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
            this.directoriosArl = this.directoriosArl.filter(val => val.id !== doc.id);
            let docIds: string[] = [];

            this.directoriosArl.forEach(el => {
              docIds.push(el.id!);
            });
            console.log("que trae dosid", docIds);
          });
      }
    });
  }



}

import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Directorio } from 'src/app/website/pages/ado/entities/directorio';
import { Documento } from 'src/app/website/pages/ado/entities/documento';
import { DirectorioService } from 'src/app/website/pages/ado/services/directorio.service';
import { Criteria, Filter } from 'src/app/website/pages/core/entities/filter';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { CasosMedicosService } from 'src/app/website/pages/core/services/casos-medicos.service';

@Component({
  selector: 'app-list-documentacion-solicitante',
  templateUrl: './list-documentacion-solicitante.component.html',
  styleUrl: './list-documentacion-solicitante.component.scss'
})
export class ListDocumentacionSolicitanteComponent implements OnInit {

  documentacionList: any;
  documentacionSelectSolicitado: any;
  formulario: FormGroup;
  documentos!: Documento[];
  @Input('documentos') directorios: Directorio[] = [];
  dialogRechazoFlagSolicitante: boolean = false;
  motivoRechazoSolicitante: string = '';
  fechaLimite: Date = new Date();
  dialogRechazoFlag: boolean = false;
  loading: boolean = false;
  totalRecords!: number;
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

  usuarioId = JSON.parse(localStorage.getItem('session') || '{}');
  pkuser = this.usuarioId.usuario.email;

  ngOnInit(): void {
    this.loadMailData(this.pkuser);
  }
  testing: boolean = false;
  async lazyLoad(event: any) {
    const idemp = JSON.parse(localStorage.getItem('session') || '{}');

    const emp = idemp.empresa.id;
    this.testing = false; 
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;
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
    filterQuery.filterList.push(filterEmp, filterElim);

    try {
      let res: any = await this.scmService.findWithFilterMail(filterQuery);
      this.documentacionList = res?.data?.map((dto: any) => {
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

  constructor(
    private route: ActivatedRoute,
    private scmService: CasosMedicosService,
    private cd: ChangeDetectorRef,
    private casoMedico: CasosMedicosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private directorioService: DirectorioService,
    fb: FormBuilder
  ) {
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

  async loadMailData(param: String) {
    try {
      const data = await this.scmService.findAllByIdMailUserOnlySolicitado(param);
      this.documentacionList = data; // Asigna los datos a documentacionListUser
      this.loadDocumentos();
    } catch (error) {
    }
  }

  async loadDocumentos() {
    this.directorios = []; // Limpia el array antes de agregar nuevos documentos
    if (this.documentacionList) {
      const promises: Promise<void>[] = [];
      
      (this.documentacionList).forEach((element: any) => {
        if (element.documentos) {
          let docum = element.documentos.split(",");
          docum.forEach((algo: string) => {
            const promise = this.directorioService.buscarDocumentosById(algo).then((elem: Directorio[]) => {
              this.directorios.push(elem[0]);
              this.cd.detectChanges(); // Forzar la detección de cambios aquí
            });
            promises.push(promise);
           
          });
        }
      });
      
      // Esperar a que todas las promesas se resuelvan y añadir un retraso
      await Promise.all(promises);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Añadir un retraso de 2 segundos
      this.cd.detectChanges(); // Forzar la detección de cambios después de que todas las promesas se resuelvan
    }
  }
  

  convertirEstadoCorreoUser(estado: number): string {
    switch (estado) {
      case 1:
        return 'En proceso';
      case 2:
        return 'Rechazado';
      case 3:
        return 'Recibido';
      case 4:
        return 'Aprobado';
      case 5:
        return 'Eliminado';
      default:
        return 'Desconocido';
    }
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

  onEditState(iddt: string | number, body: any): void {
    if (this.documentacionSelectSolicitado.estadoCorreo === 4) {
      
        this.messageService.add({
            severity: 'warn',
            summary: 'Acción no permitida',
            detail: 'El documento ya se encuentra aprobado.'
        });
        this.dialogRechazoFlag = false;
        return; // Salir de la función sin hacer nada más
    }
    if (this.documentacionSelectSolicitado.estadoCorreo != 3) {
      
        this.messageService.add({
            severity: 'warn',
            summary: 'Acción no permitida',
            detail: 'El documento no puede ser aprobado hasta ser recibido.'
        });
        this.dialogRechazoFlag = false;
        return; // Salir de la función sin hacer nada más
    }
    this.scmService.putStateApr(iddt, body).then(
      response => {
        this.messageService.add({
          severity: 'success',
          summary: 'Documento Aprobado',
          detail: 'El documento ha sido aprobado.'
      });
        this.loadMailData(this.pkuser);
        this.documentacionSelectSolicitado = [];
      },
      error => {
        console.error('Error al enviar datos:', error);
      }
    );
  }

  putmailSoliictante() {
    if (this.documentacionSelectSolicitado.estadoCorreo === 4) {
      
        this.messageService.add({
            severity: 'warn',
            summary: 'Acción no permitida',
            detail: 'No se puede rechazar un documento ya aprobado.'
        });
        this.dialogRechazoFlagSolicitante = false;
        return; // Salir de la función sin hacer nada más
    }
    if (this.documentacionSelectSolicitado.estadoCorreo === 1) {
      
        this.messageService.add({
            severity: 'warn',
            summary: 'Acción no permitida',
            detail: 'No se puede rechazar un que esta en proceso.'
        });
        this.dialogRechazoFlagSolicitante = false;
        return; // Salir de la función sin hacer nada más
    }
    if (!this.motivoRechazoSolicitante.trim()) {
      console.error("El motivo de rechazo no puede estar vacío");
      return;
    }

    if (!this.fechaLimite) {
      console.error("La fecha límite no puede estar vacía");
      return;
    }

    // Actualizar el campo de rechazo y la fecha límite en el formulario
    this.formulario.get('razonRechazoSolicitante')?.setValue(this.motivoRechazoSolicitante);
    this.formulario.get('fechaLimite')?.setValue(this.fechaLimite);

    const body = this.formulario.value;
    const selectedIdSoli = this.documentacionSelectSolicitado?.id;

    if (selectedIdSoli) {
      this.casoMedico.putCaseMailSolicitante(selectedIdSoli, body).then((response) => {
        if (response) {
          this.messageService.add({
            severity: 'success',
            summary: 'Rechazado',
            detail: 'El documento ha sido rechazado.'
        });
        this.formulario.get('razonRechazoSolicitante')?.reset();
              this.motivoRechazoSolicitante = '';
          this.dialogRechazoFlagSolicitante = false;
          this.loadMailData(this.pkuser);
          this.documentacionSelectSolicitado = [];
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
}

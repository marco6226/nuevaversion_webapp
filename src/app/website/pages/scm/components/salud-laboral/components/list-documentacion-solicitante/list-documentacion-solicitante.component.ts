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
  ];

  usuarioId = JSON.parse(localStorage.getItem('session') || '{}');
  pkuser = this.usuarioId.usuario.email;

  ngOnInit(): void {
    this.loadMailData(this.pkuser);
    console.log(this.pkuser);
  }
  testing: boolean = false;
  async lazyLoad(event: any) {
    this.testing = false; 
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;


    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

    try {
      let res: any = await this.scmService.findWithFilterMail(filterQuery);
      this.documentacionList = res?.data?.map((dto: any) => {
        return FilterQuery.dtoToObject(dto);
      });
      console.log("res",res);
      this.totalRecords = res.count;
      console.log("Total records:", this.totalRecords);
      console.log("Documentación List:", this.documentacionList);

    } catch (error) {
      console.error("Error fetching data:", error);
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
      console.log("Datos cargados:", data);
      this.loadDocumentos();
    } catch (error) {
      console.error('Error loading mail data', error);
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
            console.log("que llega en el promise:",element);
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
    this.scmService.putStateApr(iddt, body).then(
      response => {
        console.log('Respuesta del servidor:', response);
        this.loadMailData(this.pkuser);
      },
      error => {
        console.error('Error al enviar datos:', error);
      }
    );
  }

  putmailSoliictante() {
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
          console.log("Actualización exitosa");
          this.dialogRechazoFlag = false;
          this.loadMailData(this.pkuser);
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

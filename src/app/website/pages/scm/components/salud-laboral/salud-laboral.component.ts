import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { EmpleadoService } from '../../../empresa/services/empleado.service';
import { Empleado } from '../../../empresa/entities/empleado';
import * as moment from "moment";
import { Empresa } from '../../../empresa/entities/empresa';
import { FilterQuery } from "../../../core/entities/filter-query";
import { Criteria, Filter, SortOrder } from "../../../core/entities/filter";
import { SesionService } from '../../../core/services/session.service';
import { PerfilService } from '../../../admin/services/perfil.service';
import { PrimeNGConfig, SelectItem, MessageService, Message, ConfirmationService } from 'primeng/api';
import { locale_es, tipo_identificacion } from '../../../comun/entities/reporte-enumeraciones';
import { Perfil } from '../../../empresa/entities/perfil';
import { ComunService } from '../../../comun/services/comun.service';
import { CargoService } from '../../../empresa/services/cargo.service';
import { Eps } from '../../../comun/entities/eps';
import { Afp } from '../../../comun/entities/afp';
import { Arl } from '../../../comun/entities/arl';
import { Proveedor } from '../../../comun/entities/proveedor';
import { Cargo } from '../../../empresa/entities/cargo';
import { epsorarl } from '../../entities/eps-or-arl';
import { Prepagadas } from '../../../comun/entities/prepagadas';
import { ConfirmService } from '../../../core/services/confirm.service';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { AreaService } from '../../../empresa/services/area.service';
import { AreaMatrizService } from '../../../core/services/area-matriz.service';
import { ProcesoMatrizService } from '../../../core/services/proceso-matriz.service';
import { CargoActual } from '../../../empresa/entities/cargo-actual';
import { CargoActualService } from '../../../empresa/services/cargoActual.service';
import { Usuario, UsuarioEmpresa } from '../../../empresa/entities/usuario';
import { CasosMedicosService } from '../../../core/services/casos-medicos.service';
import { MessageModule } from 'primeng/message';
import { Tree } from 'primeng/tree';
import { area } from 'd3-shape';
import { ActivatedRoute, Router } from '@angular/router';
import { Directorio } from '../../../ado/entities/directorio';
import { Documento } from '../../../ado/entities/documento';
import { Modulo } from '../../../core/enums/enumeraciones';
import { DirectorioService } from 'src/app/website/pages/ado/services/directorio.service';
import { JuntaRegional } from '../../../comun/entities/juntaregional';
import { Area } from '../../../empresa/entities/area';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { em } from '@fullcalendar/core/internal-common';
import { DatePipe } from '@angular/common';





@Component({
  selector: 'app-salud-laboral',
  templateUrl: './salud-laboral.component.html',
  styleUrl: './salud-laboral.component.scss',
  providers: [EmpleadoService, SesionService, PerfilService, CargoService, ComunService, MessageService, ConfirmService]
})
export class SaludLaboralComponent implements OnInit {
  consultar2: boolean = false;
  consultar: boolean = false;
  documentos!: Documento[];
  documentosDT!: Documento[];
  @Input('documentos') directorios: Directorio[] = [];
  documentosList!: any[];

  @Input() isUpdate!: boolean;
  @Input() show!: boolean;
  loading: boolean = false;
  @Input('caseSelect') caseSelect?: any;
  fechaLimite: Date = new Date();

  msgs?: Message[];
  itemInPCL: boolean = false;
  listaPCL: any;
  casosListFilter: any;


  empleadoForm: FormGroup;

  empleadosList!: Empleado[];
  empleadoListSegu!: Empleado[];
  empleadoListSalud!: Empleado[];
  empeladoListPsicosocial!: Empleado[];

  modulo: string = Modulo.SSL.value;


  value: any;
  empleadoSelect?: Empleado | null;
  totalRecords!: number;

  doc: String[] | undefined;
  docSalud: String[] | undefined;
  docSaludLaboral: String[] | undefined;
  docPsicosocial: String[] | undefined;

  selectedDoc: String | undefined;
  selectedDocSalud: String | undefined;
  selectedDocSaludLaboral: String | undefined;
  selectedDocPsicosocial: String | undefined;

  empresaForm?: FormGroup;
  empresaSelect2!: empresaNit;
  loaded!: boolean;
  selectedDocId: number = 0;
  selectedDocIDDT: number = 0;

  documentacionCase: any;
  documentacionSelectCase: any;

  nameAndLastName = "";
  antiguedad: any;

  docSolicitado: string = "";
  docSolicitadoSeg: string = "";

  camposIncompletos: boolean = false;

  documentacionSelectUser: any;
  getSelectedId() {
    if (this.documentacionSelectUser) {
      const selectedId = this.documentacionSelectUser.id;
      console.log('ID seleccionado:', selectedId);
      return selectedId;
    } else {
      console.log('No hay elementos seleccionados.');
      return null;
    }
  }
  documentacionSelectSolicitado: any;
  getSelectedSoli() {
    if (this.documentacionSelectSolicitado) {
      const selectedIdSoli = this.documentacionSelectSolicitado.id;
      console.log('ID seleccionado:', selectedIdSoli);
      return selectedIdSoli;
    } else {
      console.log('No hay elementos seleccionados.');
      return null;
    }
  }


  modalConfirmacionVisible: boolean = false;
  fields: string[] = [
    'idSl',
    'usuarioCreador',
    'usuarioAsignado',
    'fechaCreacion',
    'fechaEdicion',
    'cargoOriginal',
    'cargoActual',
    'divisionOrigen',
    'divisionActual',
    'localidadOrigen',
    'localidadActual',
    'areaOrigen',
    'areaActual',
    'procesoOrigen',
    'procesoActual',
    'pkUser',
    'nombreCompletoSL',
    'documentos',
    'fechaRecepcionDocs',
    'fechaCierreCaso'
  ];

  rangoAntiguedad = [
    { label: "Entre 1 y 5 años", range: "1,2,3,4,5" },
    { label: "Entre 6 y 10 años", range: "6,7,8,9,10" },
    { label: "Entre 11 y 15 años", range: "11,12,13,14,15" },
    { label: "Entre 16 y 20 años", range: "16,17,18,19,20" },
    { label: "Mayor a 20", range: "21,22,23,24,25,26,27,28,29" },
  ]

  edad: any;
  arl: any;
  range: any;
  departamento: any;
  empresa: Empresa | null;

  businessNames = "";
  bussinessParner: FormGroup;
  jefeNames = " ";
  jefeInmediato: FormGroup;
  jefeInmediatoName0?: string;
  jefeInmediatoName?: string;
  nombreSesion?: string
  nombreSesionSeg?: string
  cedula?: string
  localeES: any = locale_es;
  mailSaludLaboral: FormGroup;

  colsActionList!: any[];
  epsList!: SelectItem[];
  arlList!: SelectItem[];
  afpList!: SelectItem[];
  prepagadasList!: SelectItem[];
  provsaludList!: SelectItem[];
  sveOptionList: SelectItem[] = [];
  cargoList!: SelectItem[];
  cargoActualList!: SelectItem[];
  JuntaRegionalList!: SelectItem[];
  perfilList: SelectItem[] = [];


  empleado!: Empleado;
  correos: any[] = [];

  formulario: FormGroup;
  motivoRechazo: string = '';
  motivoRechazoSolicitante: string = '';

  iddtCase?: String;





  entity: epsorarl = { EPS: [], ARL: [], AFP: [], Medicina_Prepagada: [], Proveedor_de_salud: [], Junta_Regional: [] };
  emitPclentity: SelectItem[] = [
    { label: "--Seleccione--", value: null },
    { label: "EPS", value: "EPS" },
    { label: "ARL", value: "ARL" },
    { label: "AFP", value: "AFP" },
    { label: "Junta Regional", value: "Junta_Regional" },
    { label: "Junta Nacional", value: "Junta Nacional" },
    { label: "Otros", value: "otros" }
  ]
  detalleOptions: SelectItem[] = [];
  action: boolean = false;
  pclOptionList: SelectItem[] = [
    { label: "--Seleccione--", value: null },
    { label: "En Calificación", value: "1" },
    { label: "En Firme", value: "2" },
    { label: "En Apelación", value: "0" }
  ]
  tipoIdentificacionList: SelectItem[];
  fechaActual: Date = new Date();
  yearRange: string = "1900:" + this.fechaActual.getFullYear();
  division: string | null = null;

  saludLaboralList: any[] = [];
  saludlaboralCHANGETest: any[] = [];
  saludLaboralSelect: any

  documentacionList: any;
  documentacionListUser: any;
  documentacionSubirSelect: any

  documentacionListCase: any;

  empresaList2: empresaNit[] = [
    { label: "--Seleccione--", empresa: null, nit: null },
    { label: "Agromil S.A.S", empresa: "Agromil S.A.S", nit: "830511745" },
    { label: "Almacenes Corona", empresa: "Almacenes Corona", nit: "860500480-8" },
    { label: "Compañía Colombiana de Ceramica S.A.S", empresa: "Compañía Colombiana de Ceramica S.A.S", nit: "860002536-5" },
    { label: "Corlanc S.A.S", empresa: "Corlanc S.A.S", nit: "900481586-1" },
    { label: "Corona Industrial", empresa: "Corona Industrial", nit: "900696296-4" },
    { label: "Despachadora internacional de Colombia S.A.S", empresa: "Despachadora internacional de Colombia S.A.S", nit: "860068121-6" },
    { label: "Electroporcelana Gamma", empresa: "Electroporcelana Gamma", nit: "890900121-4" },
    { label: "Locería Colombiana S.A.S", empresa: "Locería Colombiana S.A.S", nit: "890900085-7" },
    { label: "Minerales Industriales S.A", empresa: "Minerales Industriales S.A", nit: "890917398-1" },
    { label: "Nexentia S.A.S", empresa: "Nexentia S.A.S", nit: "900596618-3" },
    { label: "Suministros de Colombia S.A.S", empresa: "Suministros de Colombia S.A.S", nit: "890900120-7" },
    { label: "Organización corona", empresa: "Organización corona", nit: "860002688-6" }
  ]

  diagnosticoList: any[] = [];
  diagSelect: any;

  trazabilidadList: any[] = [{
    id: 1,
    accion: 'Responsable',
    fecha: new Date(),
    observacion: 'marcoacero@lerprevencion.com',
    usuario: 'harrysongil@lerprevencion.com',
  },
  {
    id: 2,
    accion: 'Rechazado',
    fecha: new Date(),
    observacion: 'No corresponde a esta área',
    usuario: 'marcoacero@lerprevencion.com',
  },
  {
    id: 3,
    accion: 'Responsable',
    fecha: new Date(),
    observacion: 'juanbernal@lerprevencion.com',
    usuario: 'harrysongil@lerprevencion.com',
  },
  {
    id: 4,
    accion: 'Subido',
    fecha: new Date(),
    observacion: 'Documento adjuntado',
    usuario: 'juanbernal@lerprevencion.com',
  }
  ];
  trazabilidadSelect: any;

  flag1: boolean = true
  flag2: boolean = true
  flag3: boolean = true
  flag4: boolean = true
  flag5: boolean = true
  flag6: boolean = true
  flag7: boolean = true
  flag8: boolean = true
  flag9: boolean = true
  flag10: boolean = true
  flag11: boolean = true
  flag12: boolean = true
  flag13: boolean = true
  flag14: boolean = true
  flag15: boolean = true
  flag16: boolean = true

  usuarioSolicitado: string = ''
  usuarioSolicitadoSeg: string = '';
  iduarioSolicitadoSalud: string = '';
  usuarioSolicitadoPsicosocial: string = '';


  primerApellidoSeg: string | undefined;
  primerNombreSeg: string | undefined;


  nombreCompletoSeg: string | undefined;
  nombreCompletoSalud: string | undefined;
  nombreCompletoSaludLaboral: string | undefined;
  nombreCompletoPsicosocial: string | undefined;


  userSoliCedula: String | undefined;
  pkUser: number = 0;
  pkUserSeg: number = 0;
  responsable2: string = ''
  responsable3: string = ''
  responsable4: string = ''
  responsable5: string = ''
  responsable6: string = ''
  responsable7: string = ''
  responsable8: string = ''
  responsable9: string = ''
  responsable10: string = ''
  responsable11: string = ''
  responsable12: string = ''
  responsable13: string = ''
  responsable14: string = ''
  responsable15: string = ''
  responsable16: string = ''

  dialogRechazoFlag: boolean = false
  dialogRechazoFlagSolicitante: boolean = false
  dialogTrazabilidadFlag: boolean = false
  flagDoc: boolean = false
  flagDocDT: boolean = false;
  flagDialogCargoActual: boolean = false
  cargoActual: string = ''


  iddt?: number


  async chargueValue() {



    let primerNombre = (this.sesionService.getEmpleado()) ? (this.sesionService.getEmpleado()!.primerNombre ? this.sesionService.getEmpleado()!.primerNombre : '') : ''
    let segundoNombre = (this.sesionService.getEmpleado()) ? (this.sesionService.getEmpleado()!.segundoNombre ? this.sesionService.getEmpleado()!.segundoNombre : '') : ''
    let primerApellido = (this.sesionService.getEmpleado()) ? (this.sesionService.getEmpleado()!.primerApellido ? this.sesionService.getEmpleado()!.primerApellido : '') : ''
    let segundoApellido = (this.sesionService.getEmpleado()) ? (this.sesionService.getEmpleado()!.segundoApellido ? this.sesionService.getEmpleado()!.segundoApellido : '') : ''
    let cedula = (this.sesionService.getEmpleado()) ? (this.sesionService.getEmpleado()!.numeroIdentificacion ? this.sesionService.getEmpleado()!.numeroIdentificacion : '') : ''
    this.cedula = cedula;
    this.nombreSesion = primerNombre + ' ' + segundoNombre + ' ' + primerApellido + ' ' + segundoApellido
    this.nombreSesionSeg = primerNombre + ' ' + segundoNombre + ' ' + primerApellido + ' ' + segundoApellido

    this.config.setTranslation(this.localeES);
    this.colsActionList = [
      { field: 'status', header: 'Estado' },
      { field: 'recomendaciones', header: 'Nombre de la recomendacion' },
      { field: 'fechaExpiracion', header: 'Fecha Finalizacion' }
    ];


    await this.comunService.findAllAfp().then((data) => {
      this.afpList = [];
      this.afpList.push({ label: "--Seleccione--", value: null });
      (<Afp[]>data).forEach((afp) => {
        this.afpList.push({ label: afp.nombre, value: afp.id });
      });
      this.entity.AFP = this.afpList;

    });

    await this.comunService.findAllEps().then((data) => {
      this.epsList = [];
      this.epsList.push({ label: "--Seleccione--", value: null });
      (<Eps[]>data).forEach((eps) => {
        this.epsList.push({ label: eps.nombre, value: eps.id });

      });
      this.entity.EPS = this.epsList;
    });

    await this.comunService.findAllArl().then((data) => {
      this.arlList = [];
      this.arlList.push({ label: "--Seleccione--", value: null });
      (<Arl[]>data).forEach((arl) => {
        this.arlList.push({ label: arl.nombre, value: arl.id });
      });
      this.entity.ARL = this.arlList;
    });

    await this.comunService.findAllPrepagadas().then((data) => {
      this.prepagadasList = [];
      this.prepagadasList.push({ label: "--Seleccione--", value: null });
      (<Prepagadas[]>data).forEach((prepagadas) => {
        this.prepagadasList.push({ label: prepagadas.nombre, value: prepagadas.id });
      });
      this.entity.Medicina_Prepagada = this.prepagadasList;
    });

    await this.comunService.findAllProvSalud().then((data) => {
      this.provsaludList = [];
      this.provsaludList.push({ label: "--Seleccione--", value: null });
      (<Proveedor[]>data).forEach((prov) => {
        this.provsaludList.push({ label: prov.nombre, value: prov.id });
      });
      this.entity.Proveedor_de_salud = this.provsaludList;
    });



    await this.perfilService.findAll().then((resp: any) => {
      (<Perfil[]>resp["data"]).forEach((perfil) => {
        this.perfilList.push({ label: perfil.nombre, value: perfil.id });
      });
      if (this.isUpdate === true || this.show === true)
        setTimeout(() => {
          this.buildPerfilesIdList();
        }, 500);
    });
   try {
    await this.getArea()
   } catch (error) {
      console.log('error area');
      
   }
   try {
    await this.getCargoActual()
   } catch (error) {
    console.log(error,'error cargo');
    
   }
   
    this.router.params.subscribe(async params => {
      this.iddt = params ? params['iddt'] : undefined;
      if (this.iddt) {
        this.chargueEditForm();

        await this.scmService.getDiagnosticosSl(this.iddt!).then(value2 => {
          console.log('fredy aqui es', value2);
          const reposunte: any = value2;
          this.diagnosticoList = reposunte;
          console.log("cuantos diags hay", this.diagnosticoList);

        })


      }
    });
    setTimeout(() => {
      this.consultar = (localStorage.getItem('slShowCase') === 'true') ? true : false;
      this.saludLaboralSelect = JSON.parse(localStorage.getItem('saludL')!)
      console.log('LACONSULTA', this.saludLaboralSelect);
    }, 2000);

  }
  ghAdmonPersonal: any[] = []
  tipoSalud = "Gestión Humana";
  addEmailSendghAdmon() {

    const saludL = JSON.parse(localStorage.getItem('saludL') || '{}');
    const idSl = saludL.idSl;
    let docs: string[] = [];

    const formData = {

      ...this.formulario.value,
      pkCase: idSl,
      usuarioSolicitado: this.usuarioSolicitado,
      docSolicitado: this.selectedDoc,
      soliictanteNombres: this.nombreSesion,
      solicitanteCedula: this.cedula,
      pkUser: this.pkUser,
      asignacionTarea: this.tipoSalud,
      solicitadoNombresMail: this.nombreCompletoSalud,
      solicitadoNombres: this.saludLaboralSelect.nombreCompletoSL,
      solicitadoCedula: this.saludLaboralSelect.usuarioAsignado,
      documentos: JSON.stringify(docs),
    }
    console.log(formData);
    console.log("id", this.pkUser, "case", this.idSl);


    this.ghAdmonPersonal.push(formData)
    this.resetFormGH();

  }
  removeEmail(index: number) {
    this.ghAdmonPersonal.splice(index, 1);
  }
  removeEmailSeg(index: number) {
    this.seguridad.splice(index, 1);
  }
  removeEmailSaludL(index: number) {
    this.saludLaboralMail.splice(index, 1);
  }
  removeEmailPsico(index: number) {
    this.psicosocial.splice(index, 1);
  }
  resetFormGH() {
    this.usuarioSolicitado = "";
    this.formulario.reset();
  }
  resetFormSeg() {
    this.usuarioSolicitadoSeg = "";
    this.formulario.reset();
  }
  resetFormSaludL() {
    this.iduarioSolicitadoSalud = "";
    this.formulario.reset();
  }
  resetFormPsico() {
    this.usuarioSolicitadoPsicosocial = "";
    this.formulario.reset();
  }
  seguridad: any[] = []
  tipoSeg = "seguridad";
  addEmailSeguridad() {
    const saludL = JSON.parse(localStorage.getItem('saludL') || '{}');
    const pkUserCase = saludL.pkUser;
    const idSl = saludL.idSl;
    const formData = {
      ...this.formulario.value,
      pkCase: idSl,
      usuarioSolicitado: this.usuarioSolicitadoSeg,
      docSolicitado: this.selectedDocSalud,
      soliictanteNombres: this.nombreSesion,
      solicitanteCedula: this.cedula,
      pkUser: this.pkuser2,
      asignacionTarea: this.tipoSeg,

      solicitadoNombresMail: this.nombreCompletoSeg,
      solicitadoNombres: this.saludLaboralSelect.nombreCompletoSL,
      solicitadoCedula: this.saludLaboralSelect.usuarioAsignado,
    }

    console.log('formData:', formData);

    if (!formData.docSolicitado) {
      console.error('El documento no está seleccionado correctamente');
      return;
    }

    this.seguridad.push(formData);
    this.resetFormSeg();
    console.log('seguridad:', this.seguridad);
  }
  saludLaboralMail: any[] = []
  tipoSalLab = "Salud";
  addEmailSalud() {
    const saludL = JSON.parse(localStorage.getItem('saludL') || '{}');
    const idSl = saludL.idSl;
    const formData = {
      ...this.formulario.value,
      pkCase: idSl,
      usuarioSolicitado: this.iduarioSolicitadoSalud,
      docSolicitado: this.selectedDocSaludLaboral,
      soliictanteNombres: this.nombreSesion,
      solicitanteCedula: this.cedula,
      pkUser: this.pkuserSalud,
      asignacionTarea: this.tipoSalLab,

      solicitadoNombresMail: this.nombreCompletoSaludLaboral,
      solicitadoNombres: this.saludLaboralSelect.nombreCompletoSL,
      solicitadoCedula: this.saludLaboralSelect.usuarioAsignado,
    }

    console.log('formData:', formData);

    if (!formData.docSolicitado) {
      console.error('El documento no está seleccionado correctamente');
      return;
    }

    this.saludLaboralMail.push(formData);
    this.resetFormSaludL();
    console.log('salud:', this.saludLaboralMail);
  }
  psicosocial: any[] = []
  tipoPiscosocial = "Psicosocial";
  addEmailPsicosocial() {
    const saludL = JSON.parse(localStorage.getItem('saludL') || '{}');
    const idSl = saludL.idSl;
    const formData = {
      ...this.formulario.value,
      pkCase: idSl,
      usuarioSolicitado: this.usuarioSolicitadoPsicosocial,
      docSolicitado: this.selectedDocPsicosocial,
      soliictanteNombres: this.nombreSesion,
      solicitanteCedula: this.cedula,
      pkUser: this.pkuserPsico,
      asignacionTarea: this.tipoPiscosocial,

      solicitadoNombresMail: this.nombreCompletoPsicosocial,
      solicitadoNombres: this.saludLaboralSelect.nombreCompletoSL,
      solicitadoCedula: this.saludLaboralSelect.usuarioAsignado,
    }

    console.log('formData:', formData);
    this.resetFormPsico();

    if (!formData.docSolicitado) {
      console.error('El documento no está seleccionado correctamente');
      return;
    }

    this.psicosocial.push(formData);
    console.log('salud:', this.saludLaboralMail);
  }

  saludL = JSON.parse(localStorage.getItem('saludL') || '{}');
  usuarioId = JSON.parse(localStorage.getItem('session') || '{}');
  pkuser = this.usuarioId.usuario.id;
  pkuser2 = this.usuarioId.usuario.id;
  pkuserSalud = this.usuarioId.usuario.id;
  pkuserPsico = this.usuarioId.usuario.id;
  idSl = this.saludL.idSl;

  async ngOnInit() {
    this.updateButtonState();
    console.log("data de user", this.usuarioId, this.pkuser);

    this.chargueValue();
    this.consultar2 = (localStorage.getItem('scmShowCase') === 'true') ? true : false;

    console.log("esto me trae salud", this.idSl);

    this.doc = [
      'Certificado de cargos y labores desempeñados con sus respectivas fechas de inicio y finalización'
      , 'Certificado de afiliación al sistema de seguridad social (AFP-ARL)',
      'Copia del contrato(s) de trabajo'
    ];
    this.docSalud = [
      'AROS (Actividades de riesgo por oficio) de los oficios desempeñados por el trabajador en referencia desde su vinculación a la empresa',
      'Matriz de peligros y riesgos:',
      'Mediciones ambientales de ruido material particulado, químicos, etc',
      'Reportes de accidentes laborales que el trabajador haya tenido o reportado',
      'Listado de entrega y uso de elementos de protección auditiva y sus fichas técnicas'

    ]

    this.docSaludLaboral = [
      'Informe del ESTUDIO DE PUESTO DE TRABAJO del oficio y/o oficios desempeñados por el trabajador en referencia realizado por parte de un profesional experto Fisioterapeuta y/o Médico(a). (anexar video si lo tienen)',
      'Descripción del puesto de trabajo del cargo en el que se desempeñaba cuando iniciaron los síntomas (área en la que labora, cómo es la estación de trabajo, actividades que realiza, tiempo de la jornada por actividad, exposición a factores de riesgo (higienico), ha sido reubicado, etc.).',
      'Reportes de enfermedades laborales que el trabajador haya tenido o reportado:',
      'Información si hay otros trabajadores que realizan la misma labor y hayan tenido notificación de estudio o diagnóstico de enfermedades similares a las estudiadas en el caso de la referencia',
      'FUREL',
      'Historia Clínica Ocupacional (exámenes de ingreso, egreso y periódicos)',
    ]

    this.docPsicosocial = [
      'Resultado de bateria personal y general',
      'Plan de intervención'
    ]
    this.loadMailData(this.idSl);
    this.loadMailDataUser(this.idSl, this.pkuser);

  }
  onFilter(event: any) {
    this.casosListFilter = event.filteredValue
  }

  async chargueEditForm() {
    try {
      this.flagSaludLaboralRegistro = true;
      const data: any = await this.scmService.getCaseSL(this.iddt!.toString());

      await this.buscarEmpleado({ query: data['usuarioAsignado'] })
      const empleado = this.empleadosList[0];
      console.log("cargo act", JSON.stringify(data));
      if (typeof empleado === 'object' && empleado !== null) {
        let empresaNitpivot: empresaNit = { empresa: empleado['empresa'], nit: empleado['nit'], label: empleado['empresa'] }
        this.empresaForm?.controls['empresa'].setValue(empresaNitpivot);

        let cedula = this.empleadoForm.controls['numeroIdentificacion'].setValue(empleado['numeroIdentificacion'])
        this.empleadoForm.controls['area'].setValue(empleado['area'])

        this.empleadoForm.controls['cargoId'].setValue(empleado['cargo'])
        this.empleadoForm.controls['perfilesId'].setValue(empleado['id'])
        this.empleadoForm.controls['tipoIdentificacion'].setValue(empleado['tipoIdentificacion']?.id)
        this.empleadoForm.controls['primerNombre'].setValue(empleado['primerNombre'])
        this.empleadoForm.controls['segundoNombre'].setValue(empleado['segundoNombre'])
        this.empleadoForm.controls['primerApellido'].setValue(empleado['primerApellido'])
        this.empleadoForm.controls['segundoApellido'].setValue(empleado['segundoApellido'])
        //this.empleadoForm.controls['division'].setValue(empleado['division'])
        //this.empleadoForm.controls['division'].setValue(parseInt(data['divisionOrigen']));
        this.nameAndLastName = empleado['primerNombre'] + ' ' + empleado['primerApellido']
        this.empleadoForm.controls['genero'].setValue(empleado['genero']);
        this.empleadoForm.controls['fechaNacimiento'].setValue(new Date(empleado['fechaNacimiento']));
        this.empleadoForm.controls['fechaIngreso'].setValue(new Date(empleado['fechaIngreso']));
        this.empleadoForm.controls['corporativePhone'].setValue(empleado['corporativePhone']);
        this.empleadoForm.controls['direccion'].setValue(empleado['direccion']);
        this.empleadoForm.controls['zonaResidencia'].setValue(empleado['zonaResidencia']);
        this.empleadoForm.controls['telefono1'].setValue(empleado['telefono1']);
        this.empleadoForm.controls['telefono2'].setValue(empleado['telefono2']);
        this.empleadoForm.controls['correoPersonal'].setValue(empleado['correoPersonal']);
        this.empleadoForm.controls['eps'].setValue(empleado['eps']['id']);
        this.empleadoForm.controls['afp'].setValue(empleado['afp']['id']);
        this.arl = this.empresa?.arl == null ? null : this.empresa.arl.nombre;
        this.empleadoForm.controls['emailEmergencyContact'].setValue(empleado['emailEmergencyContact']);
        this.empleadoForm.controls['phoneEmergencyContact'].setValue(empleado['phoneEmergencyContact']);
        this.empleadoForm.controls['emergencyContact'].setValue(empleado['emergencyContact']);

        console.log("aca va el jefe");

        const jefeInmediato = empleado['jefeInmediato'] ?? {};
        const jefe = empleado['usuario'];
        console.log(jefeInmediato);

        this.jefeInmediato.controls['numeroIdentificacion'].setValue(jefeInmediato['numeroIdentificacion'] ?? 'SIN INFORMACIÓN');
        this.jefeNames = jefeInmediato['primerNombre'] + ' ' + jefeInmediato['primerApellido'] ?? 'sin informacion';
        //this.jefeInmediato.controls['cargoId'].setValue(jefeInmediato['cargo']['id'])
        this.jefeInmediato.controls['corporativePhone'].setValue(jefeInmediato['corporativePhone'] ?? 'SIN INFORMACION')
        this.empleadoForm.controls['email'].setValue(jefe['email']);
        await this.onEntidadChange({ value: data['entidadEmiteCalificacion'] })
        console.log(this.detalleOptions.find(eleemnt => { return eleemnt.value == data['detalleCalificacion'] }), 'dettallecalificacion');

        this.empleadoForm.controls['entidadEmiteCalificacion'].setValue(data['entidadEmiteCalificacion']);
        var a =this.detalleOptions.find(eleemnt => { return eleemnt.value == data['detalleCalificacion'] })
        console.log(a?.value, "a");
        
        this.empleadoForm.controls['detalleCalificacion'].setValue(a?.value);
        console.log("calif",this.empleadoForm.controls['detalleCalificacion'].setValue(a?.value));
        this.empleadoForm.controls['otroDetalle'].setValue(data['otroDetalle']);
        


        console.log(this.empleadoForm.controls['detalleCalificacion']);
        

        if (data['fechaCierreCaso'] != null && data['fechaCierreCaso'] != undefined) {
          const formattedDate = new Date(data['fechaCierreCaso']);
          this.empleadoForm.controls['fechaCierreCaso'].setValue(formattedDate);
        } else {
          this.empleadoForm.controls['fechaCierreCaso'].setValue(null);
        }
        console.log("fecha cierre", this.empleadoForm.controls['fechaCierreCaso']);

        if (data['fechaRecepcionDocs'] != null && data['fechaRecepcionDocs'] != undefined) {
          const formattedDate = new Date(data['fechaRecepcionDocs']);
          this.empleadoForm.controls['fechaRecepcionDocs'].setValue(formattedDate);
        } else {
          this.empleadoForm.controls['fechaRecepcionDocs'].setValue(null);
        }
        console.log("fecha recept", this.empleadoForm.controls['fechaRecepcionDocs']);

        if (data['fechaMaximaEnvDocs'] != null && data['fechaMaximaEnvDocs'] != undefined) {
          const formattedDate = new Date(data['fechaMaximaEnvDocs']);
          this.empleadoForm.controls['fechaMaximaEnvDocs'].setValue(formattedDate);
        } else {
          this.empleadoForm.controls['fechaMaximaEnvDocs'].setValue(null);
        }
        console.log("fecha max", this.empleadoForm.controls['fechaMaximaEnvDocs']);




        //console.log("empresa que me trae;:",this.empleadoForm.controls['empresa'].setValue(empleado['empresa']));


        const usuario = empleado['usuario'];
        this.empleadoForm.controls['email'].setValue(usuario['email']);


        let fecha = moment(empleado.fechaIngreso);
        let fechaNacimiento = moment(empleado.fechaNacimiento);
        let antigueMoment = fecha.diff(moment.now(), "years") * -1;
        this.edad = `${fechaNacimiento.diff(moment.now(), "year") * -1} Años`;

        this.antiguedad = ` ${antigueMoment} Años`;
        if (antigueMoment === 0) {
          this.range = 'Menor a 1 año'
        }
        for (let j = 0; j < this.rangoAntiguedad.length; j++) {
          let subArray = this.rangoAntiguedad[j].range.split(',')
          let a = subArray.find(range => range === antigueMoment.toString())

          if (a) {
            this.range = this.rangoAntiguedad[j].label;
          }
        }



      }

      if (typeof data === 'object' && data !== null) {
        this.empleadoForm.controls['cargoOriginal'].setValue(parseInt(data['cargoOriginal']));
        this.empleadoForm.controls['cargoActual'].setValue(parseInt(data['cargoActual']));
        this.empleadoForm.controls['divisionOrigen'].setValue(parseInt(data['divisionOrigen']));
        this.empleadoForm.controls['divisionActual'].setValue(parseInt(data['divisionActual']));
        this.empleadoForm.controls['localidadOrigen'].setValue(parseInt(data['localidadOrigen']));
        this.empleadoForm.controls['localidadActual'].setValue(parseInt(data['localidadActual']));
        this.empleadoForm.controls['procesoOrigen'].setValue(parseInt(data['procesoOrigen']));
        this.empleadoForm.controls['procesoActual'].setValue(parseInt(data['procesoActual']));

        // Llamar a cargarPlantaLocalidad para actualizar las localidades
        await this.cargarPlantaLocalidad(this.empleadoForm.controls['divisionOrigen'].value, 'Origen');
        await this.cargarPlantaLocalidad(this.empleadoForm.controls['divisionActual'].value, 'Actual');
        await this.cargarArea(this.empleadoForm.controls['localidadOrigen'].value, 'Origen')
        this.empleadoForm.controls['areaOrigen'].setValue(this.areaList.find(value => value.id == parseInt(data['areaOrigen'])));
        await this.cargarArea(this.empleadoForm.controls['localidadActual'].value, 'Actual')
        this.empleadoForm.controls['areaActual'].setValue(this.areaListActual.find(value => value.id == parseInt(data['areaActual'])));
        await this.cargarProceso(this.empleadoForm.controls['areaOrigen'].value, 'Origen')
        this.empleadoForm.controls['procesoOrigen'].setValue(this.procesoList.find(value => value.id == parseInt(data['procesoOrigen'])));
        await this.cargarProceso(this.empleadoForm.controls['areaActual'].value, 'Actual')
        this.empleadoForm.controls['procesoActual'].setValue(this.procesoList.find(value => value.id == parseInt(data['procesoActual'])));




      } setTimeout(() => {
        this.consultar = (localStorage.getItem('slShowCase') === 'true') ? true : false;
        this.saludLaboralSelect = JSON.parse(localStorage.getItem('saludL')!)
        console.log('LACONSULTA', this.saludLaboralSelect);
        this.loadDocumentosCaseDT();
      }, 2000);


    } catch (error) {
      console.error('Error al obtener los datos del trabajador', error);
    }


  }

  abrirModalConfirmacion() {
    this.modalConfirmacionVisible = true;
  }
  enviarFormulario() {
    if (this.formulario.valid) {
      // Aquí puedes abrir el modal de confirmación si deseas hacerlo antes de enviar los datos al backend
      this.modalConfirmacionVisible = true;
    }

  }
  constructor(
    private empleadoService: EmpleadoService,
    private empresaService: EmpresaService,
    private sesionService: SesionService,
    private perfilService: PerfilService,
    private comunService: ComunService,
    private cargoService: CargoService,
    private cargoActualService: CargoActualService,
    private config: PrimeNGConfig,
    private areaService: AreaService,
    private areaMatrizService: AreaMatrizService,
    private procesoMatrizService: ProcesoMatrizService,
    private messageService: MessageService,
    private confirmService: ConfirmService,
    private usuarioService: UsuarioService,
    private casoMedico: CasosMedicosService,
    private router: ActivatedRoute,
    private scmService: CasosMedicosService,
    private route: Router,
    private cd: ChangeDetectorRef,
    private directorioService: DirectorioService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,

    fb: FormBuilder,
  ) {
    this.empresa = this.sesionService.getEmpresa();
    let defaultItem = <SelectItem[]>[{ label: "--seleccione--", value: null }];
    this.tipoIdentificacionList = defaultItem.concat(<SelectItem[]>tipo_identificacion);
    this.fechaActual.setFullYear(this.fechaActual.getFullYear() + 1);

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
    });



    this.empresaForm = fb.group({
      empresa: [null, Validators.required],
      nit: [null, Validators.required],
    });
    this.mailSaludLaboral = fb.group({
      responsable1: [null, Validators.required],
      fechaLimite1: [null, Validators.required],
      pkUser: [null]
      // Agrega los demás campos según sea necesario
    });
    this.bussinessParner = fb.group({
      id: ["", Validators.required],
      numeroIdentificacion: ["", Validators.required],
      primerNombre: [{ value: "", disabled: true }, Validators.required],
      segundoNombre: { value: "", disabled: true },
      email: { value: "", disabled: true },
      corporativePhone: [{ value: "", disabled: true }],
      cargoId: [{ value: "", disabled: true }, Validators.required],
      direccionGerencia: [{ value: " ", disabled: true }]

    });
    this.jefeInmediato = fb.group({
      id: ["", Validators.required],
      numeroIdentificacion: ["", Validators.required],
      primerNombre: [null],
      segundoNombre: [null],
      primerApellido: [null],
      segundoApellido: [null],
      email: { value: "", disabled: true },
      corporativePhone: [{ value: "", disabled: true }],
      cargoId: [{ value: "", disabled: true }, Validators.required],
      direccionGerencia: [{ value: "", disabled: true }]

    });

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
    console.log("iddt", this.iddt);

  }
  listDivision: any = []
  async getArea() {
    let filterAreaQuery = new FilterQuery();
    filterAreaQuery.sortField = "id";
    filterAreaQuery.sortOrder = -1;
    filterAreaQuery.fieldList = ["id", "nombre"];
    filterAreaQuery.filterList = [
      { field: 'nivel', criteria: Criteria.EQUALS, value1: '0' },
    ];

    await this.areaService.findByFilter(filterAreaQuery).then((resp: any) => {
      resp.data.forEach((resp2: any) => {
        this.listDivision.push({ label: resp2.nombre, value: resp2.id })
      });
    })
    await this.comunService.findAllJuntas().then((data) => {
      this.JuntaRegionalList = [];
      this.JuntaRegionalList.push({ label: "--Seleccione--", value: null });
      (<JuntaRegional[]>data).forEach((JuntaRegional) => {
        this.JuntaRegionalList.push({ label: JuntaRegional.nombre, value: JuntaRegional.id });


      });
      console.log(this.JuntaRegionalList)
      this.entity.Junta_Regional = this.JuntaRegionalList;
    });
  }


  localidadesList: any = [];
  localidadesListActual: any = [];
  async cargarPlantaLocalidad(eve: any, tipo: string) {
    console.log("cargarPlantaLocalidad - Evento:", eve, "Tipo:", tipo);
    let filterPlantaQuery = new FilterQuery();
    filterPlantaQuery.sortField = "id";
    filterPlantaQuery.sortOrder = -1;
    filterPlantaQuery.fieldList = ["id", "localidad"];
    filterPlantaQuery.filterList = [
      { field: 'plantas.area.id', criteria: Criteria.EQUALS, value1: eve.toString() },
    ];

    await this.empresaService.getLocalidadesRWithFilter(filterPlantaQuery).then((resp: any) => {
      const localidadesList = resp.data.map((element: any) => ({ label: element.localidad, value: element.id }));
      if (tipo === 'Origen') {
        this.localidadesList = localidadesList;
      } else {
        this.localidadesListActual = localidadesList;
      }
    }).catch(error => {
      console.error("Error al cargar las localidades:", error);
    });
  }

  areaList: any[] = []
  areaListActual: any[] = []
  async cargarArea(eve: any, tipo: string) {
    console.log(eve);

    let filterArea = new FilterQuery();
    filterArea.sortField = "id";
    filterArea.sortOrder = -1;
    filterArea.fieldList = [
      'id',
      'nombre'
    ];
    filterArea.filterList = [
      { field: 'localidad.id', criteria: Criteria.EQUALS, value1: eve },
      { field: 'eliminado', criteria: Criteria.EQUALS, value1: false }
    ];

    let areaList: any = [];
    await this.areaMatrizService.findByFilter(filterArea).then(async (resp: any) => {
      resp.data.forEach((element: any) => {
        areaList.push({ 'name': element.nombre, 'id': element.id }); // Solo agregar el nombre del área
      });
    });

    if (tipo === 'Origen') {
      this.areaList = [...areaList];
      console.log(areaList)
    } else {
      this.areaListActual = [...areaList];
      console.log(this.areaListActual)
    }
  }


  procesoList: any[] = []
  procesoListActual: any[] = []
  async cargarProceso(eve: any, tipo: string) {
    let filterProceso = new FilterQuery();
    filterProceso.fieldList = [
      'id',
      'nombre'
    ];
    filterProceso.filterList = [{ field: 'areaMatriz.id', criteria: Criteria.EQUALS, value1: eve },
    { field: 'eliminado', criteria: Criteria.EQUALS, value1: false }];
    let procesoList: any = []
    await this.procesoMatrizService.findByFilter().then(async (resp: any) => {
      resp.data.forEach((element: any) => {
        procesoList.push({ label: element.nombre, id: element.id })
      });
    })
    if (tipo == 'Origen') this.procesoList = [...procesoList]
    else this.procesoListActual = [...procesoList]
  }

  async buscarEmpleado(event: any) {
    await this.empleadoService
      .buscar(event.query)
      .then((data) => (this.empleadosList = <Empleado[]>data));
  }
  async buscarEmpleado2(event: any) {
    await this.empleadoService
      .buscar(event.query)
      .then((data) => (this.empleadoListSegu = <Empleado[]>data));
  }
  async buscarEmpleadoSalud(event: any) {
    await this.empleadoService
      .buscar(event.query)
      .then((data) => (this.empleadoListSalud = <Empleado[]>data));
  }
  async buscarEmpleadoPsicosocial(event: any) {
    await this.empleadoService
      .buscar(event.query)
      .then((data) => (this.empeladoListPsicosocial = <Empleado[]>data));
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
  isButtonDisabled: boolean = true;
  updateButtonState(): void {
    if (this.documentacionSelectSolicitado && this.documentacionSelectSolicitado.estado === 3) {
      this.isButtonDisabled = false;
    } else {
      this.isButtonDisabled = true;
    }
  }

  convertirEstadoCorreo(estado: number): string {
    switch (estado) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'Rechazado';
      case 3:
        return 'enviado';
      case 4:
        return 'Aprobado';
      default:
        return 'Desconocido';
    }
  }

  async onSelection(event: any) {
    this.value = event;
    this.empleadoSelect = null;
    let emp = <Empleado>this.value;
    this.saludlaboralCHANGETest = await this.scmService.getCaseListSL(emp.id!);
    console.log("vaina loca list aca", this.saludLaboralList);

    this.empleadoSelect = emp;
    this.empresaForm!.reset()
    if (this.empleadoSelect) {
      this.empresaForm!.value.nit = this.empleadoSelect.nit
      this.empresaForm!.value.empresa = { label: this.empleadoSelect.empresa, empresa: this.empleadoSelect.empresa, nit: this.empleadoSelect.nit }
      this.empresaSelect2 = this.empresaForm!.value.empresa
    }
    this.loaded = true;
    this.nameAndLastName = (this.empleadoSelect.primerApellido || "") + " " + (this.empleadoSelect.segundoApellido || "") + " " + (this.empleadoSelect.primerNombre || "") + " " + (this.empleadoSelect.segundoNombre || " ");
    let fecha = moment(this.empleadoSelect.fechaIngreso);
    let fechaNacimiento = moment(this.empleadoSelect.fechaNacimiento);
    let antigueMoment = fecha.diff(moment.now(), "years") * -1;

    this.antiguedad = ` ${antigueMoment} Años`;
    if (antigueMoment === 0) {
      this.range = 'Menor a 1 año'
    }

    for (let j = 0; j < this.rangoAntiguedad.length; j++) {
      let subArray = this.rangoAntiguedad[j].range.split(',')
      let a = subArray.find(range => range === antigueMoment.toString())

      if (a) {
        this.range = this.rangoAntiguedad[j].label;
      }
    }

    this.edad = `${fechaNacimiento.diff(moment.now(), "year") * -1} Años`;
    this.arl = this.empresa?.arl == null ? null : this.empresa.arl.nombre;

    this.departamento = this.empleadoSelect.area.id;

    if (this.empleadoSelect.businessPartner) {
      this.onSelectionBP(this.empleadoSelect.businessPartner)
    }

    if (this.empleadoSelect.jefeInmediato) {
      this.onSelectionJefeInmediato(this.empleadoSelect.jefeInmediato);
      this.jefeInmediatoName = this.jefeInmediatoName0
    }

    await this.usuarioPermisos()
    this.empleadoForm.patchValue({
      'id': this.empleadoSelect.id,
      'primerNombre': this.empleadoSelect.primerNombre,
      'segundoNombre': this.empleadoSelect.segundoNombre,
      'primerApellido': this.empleadoSelect.primerApellido,
      'segundoApellido': this.empleadoSelect.segundoApellido,
      'codigo': this.empleadoSelect.codigo,
      'direccion': this.empleadoSelect.direccion,
      'fechaIngreso': this.empleadoSelect.fechaIngreso == null ? null : new Date(this.empleadoSelect.fechaIngreso),
      'fechaNacimiento': this.empleadoSelect.fechaNacimiento == null ? null : new Date(this.empleadoSelect.fechaNacimiento),
      'genero': this.empleadoSelect.genero,
      'numeroIdentificacion': this.empleadoSelect.numeroIdentificacion,
      'telefono1': this.empleadoSelect.telefono1,
      'telefono2': this.empleadoSelect.telefono2,
      'afp': this.empleadoSelect.afp == null ? null : this.empleadoSelect.afp.id,
      'ciudad': this.empleadoSelect.ciudad,
      'eps': this.empleadoSelect.eps == null ? null : this.empleadoSelect.eps.id,
      'tipoIdentificacion': this.empleadoSelect.tipoIdentificacion == null ? null : this.empleadoSelect.tipoIdentificacion.id,
      'tipoVinculacion': this.empleadoSelect.tipoVinculacion,
      'zonaResidencia': this.empleadoSelect.zonaResidencia,
      'area': this.empleadoSelect.area,
      'cargoId': this.empleadoSelect.cargo.id,
      'perfilesId': this.usuarioP,
      "corporativePhone": this.empleadoSelect.corporativePhone,
      "emergencyContact": this.empleadoSelect.emergencyContact,
      "phoneEmergencyContact": this.empleadoSelect.phoneEmergencyContact,
      "emailEmergencyContact": this.empleadoSelect.emailEmergencyContact,
      direccionGerencia: this.empleadoSelect.direccionGerencia,
      regional: this.empleadoSelect.regional,
      correoPersonal: this.empleadoSelect.correoPersonal,
      ciudadGerencia: this.empleadoSelect.ciudadGerencia,
      // division: this.empleadoSelect.area['padreNombre'],
      division: this.empleadoSelect.area.areaPadre?.nombre,
      'email': [this.empleadoSelect.usuario.email],
      'cargoActualEntity': this.empleadoSelect.cargo.nombre,

      'divisionOrigen': [''],
      'usuarioCreador': [null],
      'usuarioAsignado': this.empleadoSelect.numeroIdentificacion,
      'fecha_creacion': [null],
      'fecha_edicion': [null],
      'cargoOriginal': [''],
      'cargoActual': [''],
      'divisionActual': [''],
      'localidadOrigen': [''],
      'localidadActual': [''],
      'areaOrigen': [''],
      'areaActual': [''],
      'procesoOrigen': [''],
      'procesoActual': [''],
      'pkCase': [null],
      'nombreCompletoSL': [this.empleadoSelect.primerNombre],
      'fechaRecepcionDocs': [''],
      'entidadEmiteCalificacion': [''],
      'otroDetalle': [''],
      'detalleCalificacion': [''],
      'fechaMaximaEnvDocs': [''],
      'fechaCierreCaso': [''],
    });
    const dataToSend = {
      'iddt': null,
      'divisionOrigen': [''],
      'usuarioCreador': null,
      'usuarioAsignado': this.empleadoSelect.numeroIdentificacion,
      'fecha_creacion': [null],
      'fecha_edicion': [null],
      'cargoOriginal': [null],
      'cargoActual': [null],
      'divisionActual': [''],
      'localidadOrigen': [''],
      'localidadActual': [''],
      'areaOrigen': [''],
      'areaActual': [''],
      'procesoOrigen': [''],
      'procesoActual': [''],
      'pkUser': [this.empleadoSelect.id],
      'nombreCompletoSL': [''],
      'fechaRecepcionDocs': [''],
      'entidadEmiteCalificacion': [''],
      'otroDetalle': [''],
      'detalleCalificacion': [null],
      'fechaMaximaEnvDocs': [''],
      'fechaCierreCaso': ['']
    };
    const cleanDataToSend = this.prepareFormData(dataToSend);
    this.empleadoForm.patchValue(cleanDataToSend);





    setTimeout(() => {
      this.empleadoForm.patchValue({
        'ciudad': this.empleadoSelect!.ciudad,
      })
    }, 2000);



    this.empresaForm?.patchValue({
      'nit': this.empleadoSelect.nit,
      'empresa': { label: this.empleadoSelect.empresa, empresa: this.empleadoSelect.empresa, nit: this.empleadoSelect.nit }
    });

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

  envioExitoso = false;

  onSubmit() {
    console.log('Formulario antes de validación:', this.empleadoForm.controls);

    if (this.empleadoForm.valid) {
      let body = { ...this.empleadoForm.value };

      // Aquí asegúrate de no hacer modificaciones que puedan afectar a entidadEmiteCalificacion
      console.log('Valor de entidadEmiteCalificacion antes de enviar:', body.entidadEmiteCalificacion);

      // Actualizar los campos según sea necesario
      body.procesoActual = body.procesoActual?.id || body.procesoActual;
      body.procesoOrigen = body.procesoOrigen?.id || body.procesoOrigen;
      body.areaActual = body.areaActual?.id || body.areaActual;
      body.areaOrigen = body.areaOrigen?.id || body.areaOrigen;
      body.nombreCompletoSL = `${body.primerApellido} ${body.segundoApellido} ${body.primerNombre} ${body.segundoNombre}`;

      if (Array.isArray(body.pkUser)) {
        body.pkUser = body.pkUser[0];
      }

      // Limpia el formulario según sea necesario
      body = this.prepareFormData(body);

      console.log('Cuerpo a enviar antes de enviar:', body);

      // Decide si actualizar o crear basado en la presencia de this.iddt
      (this.iddt !== undefined ? this.casoMedico.putCaseSL(this.iddt, body) : this.casoMedico.createDT(body))
        .then((response) => {
          if (response) {
            this.showSuccessToast();
            console.log('Empleado enviado correctamente', response);
          }
        })
        .catch((error) => {
          console.error('Error al enviar el empleado:', error);
          this.msgs = [];
          this.messageService.add({
            key: 'formScmSL',
            severity: "error",
            summary: "Error al enviar empleado",
            detail: `Empleado con identificación ${this.empleadoForm.value.numeroIdentificacion} no fue creado`,
          });
        });
    } else {
      this.msgs = [];
      this.messageService.add({
        key: 'formScmSL',
        severity: "error",
        summary: "Usuario no creado",
        detail: `Empleado con identificación ${this.empleadoForm.value.numeroIdentificacion} no fue creado, formulario inválido`,
      });
    }
  }







  solicitando: boolean = false;

  async submitEmp() {
    const saludL = JSON.parse(localStorage.getItem('saludL') || '{}');

    const pkUserCase = saludL.pkUser;
    let empresa = this.empresaForm?.value.empresa;
    let nit = this.empresaForm?.value.nit;

    if (this.empleadoForm.valid) {
      // Crear un objeto solo con la fecha de nacimiento
      let body = {
        fechaNacimiento: this.empleadoForm.value.fechaNacimiento,
        genero: this.empleadoForm.value.genero,
        fechaIngreso: this.empleadoForm.value.fechaIngreso,
        telefono1: this.empleadoForm.value.telefono1,
        telefono2: this.empleadoForm.value.telefono2,
        corporativePhone: this.empleadoForm.value.corporativePhone,
        ciudad: this.empleadoForm.value.ciudad,
        direccion: this.empleadoForm.value.direccion,
        zonaResidencia: this.empleadoForm.value.zonaResidencia,
        correoPersonal: this.empleadoForm.value.correoPersonal,
        eps: this.empleadoForm.value.eps,
        afp: this.empleadoForm.value.afp,
        emergencyContact: this.empleadoForm.value.emergencyContact,
        phoneEmergencyContact: this.empleadoForm.value.phoneEmergencyContact,
        emailEmergencyContact: this.empleadoForm.value.emailEmergencyContact,
        jefeInmediato: this.empleadoForm.value.jefeInmediato,
        empresa: this.empresaForm?.value.empresa.label, // Asegúrate de que empresa sea un String
        nit: this.empresaForm?.value.empresa.nit




      };

      if (this.empleadoForm.value.eps != null) {
        body.eps = { id: this.empleadoForm.value.eps };
      }
      if (this.empleadoForm.value.afp != null) {
        body.afp = { id: this.empleadoForm.value.afp };
      }
      console.log("empresa", this.empresaForm?.value.empresa.label);

      try {
        const response = await this.casoMedico.putUserDataSL(pkUserCase, body);
        if (response) {
          this.showSuccessToast();
          console.log('Fecha de nacimiento actualizada correctamente', response);
        } else {
          console.log("Algo salió mal");
        }
      } catch (error) {
        console.log("Error en submitEmp", error);
      }
    }
  }




  onEditState(iddt: string | number, body: any): void {
    this.scmService.putStateApr(iddt, body).then(
      response => {
        this.messageService.add({
          key: 'formScmSL',
          severity: "success",
          summary: "Documento aprobado",
          detail: `El documento paso a estado aprobado`,
        });
        this.loadMailData(this.idSl);
      },
      error => {
        console.error('Error al enviar datos:', error);
      }
    );
  }

  putmail() {
    if (!this.motivoRechazo.trim()) {
      this.messageService.add({
        // this.msgs.push({
        key: 'formScmSL',
        severity: "warn",
        summary: "Datos incorrectos",
        detail: `El motivo no puede estar vacio`,
      });
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
            // this.msgs.push({
            key: 'formScmSL',
            severity: "success",
            summary: "Usuario actualizado",
            detail: `Rechazo enviado correctamente`,
          });
          this.dialogRechazoFlag = false;
          this.loadMailDataUser(this.idSl, this.pkuser);
          this.loadMailData(this.idSl)
        } else {
          this.messageService.add({
            // this.msgs.push({
            key: 'formScmSL',
            severity: "warn",
            summary: "Usuario actualizado",
            detail: `Rechazo no enviado correctamente`,
          });
        }
      }).catch((error) => {
        console.error("Error en la actualización", error);
      });
    } else {
      console.error("No hay un caso seleccionado");
    }
  }
  putmailSoliictante() {
    if (!this.motivoRechazoSolicitante.trim()) {
      this.messageService.add({
        // this.msgs.push({
        key: 'formScmSL',
        severity: "warn",
        summary: "Informacion Incorrecta",
        detail: `El campo de rechazo no puede estar vacio`,
      });
      return;
    }

    if (!this.fechaLimite) {
      this.messageService.add({
        // this.msgs.push({
        key: 'formScmSL',
        severity: "warn",
        summary: "Informacion incorrecta",
        detail: `La fecha limite no puede estar vacia`,
      });
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
            // this.msgs.push({
            key: 'formScmSL',
            severity: "success",
            summary: "Rechazo enviado",
            detail: `Rechazo enviado correctamente`,
          });
          this.dialogRechazoFlagSolicitante = false;
          this.loadMailDataUser(this.idSl, this.pkuser);
          this.loadMailData(this.idSl)
        } else {
          this.messageService.add({
            // this.msgs.push({
            key: 'formScmSL',
            severity: "warn",
            summary: "Rechazo no enviado",
            detail: `Rechazo no enviado correctamente`,
          });
        }
      }).catch((error) => {
        console.error("Error en la actualización", error);
      });
    } else {
      console.error("No hay un caso seleccionado");
    }
  }
  putmaildocsEnviados() {

    const body = this.formulario.value;
    const selectedIdSoli = this.selectedDocId;
    //fecha: new Date()

    if (selectedIdSoli) {
      this.casoMedico.putCaseMaildocsEnviados(selectedIdSoli, body).then((response) => {
        if (response) {
          console.log("Actualización exitosa");
          this.dialogRechazoFlag = false;
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



  async loadMailData(param: number) {
    if (param == null || param === undefined) {
      console.error('Invalid parameter for loadMailData:', param);
      return;
    }

    try {
      const data = await this.scmService.findAllByIdMail(param);
      this.documentacionList = data; // Asigna los datos a documentacionList
      console.log("que me trae esto ?", data);
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error loading mail data', error);
    }
  }

  async loadMailDataUser(param: number, user: number) {
    if (param == null || param === undefined || user == null || user === undefined) {
      console.error('Invalid parameters for loadMailDataUser:', param, user);
      return;
    }

    try {
      const data = await this.scmService.findAllByIdMailUser(param, user);
      this.documentacionListUser = data;
      this.loadDocumentos(); // Asigna los datos a documentacionList
      console.log("que me trae esto ?", data);
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error loading mail data', error);
    }
  }

  documentoId: any[] = [];

  async onUpload(event: Directorio) {
    console.log("esta entrando en elue no es por alguna extraña razon");

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
      console.log("INDEXXXXX", index);

      this.documentoId.push(event.documento!.id);
      this.documentacionListUser[index].documentos = this.documentoId;

      console.log('el directorio', this.directorios);

      // Llamada para actualizar la tabla mail_saludlaboral
      await this.updateMailSaludLaboral(this.selectedDocId, this.documentoId.toString());
      this.putmaildocsEnviados();
      this.loadMailData(this.idSl);

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

  documentotoIDT: any[] = [];
  async onUploadCaseDT(event: Directorio) {

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
      console.log("INDEXXXXX", index);

      this.documentoId.push(event.documento!.id);
      // this.documentacionListUser[index].documentos = this.documentoId;

      console.log('el directorio', this.directorios);

      // Llamada para actualizar la tabla mail_saludlaboral
      await this.updateCaseDT(this.idSl, this.documentoId.toString());

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

      console.log('Mail salud laboral actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando mail salud laboral', error);
    }
  }

  async updateCaseDT(docId: number, documentoId: string) {
    try {
      await this.scmService.updateDatosTrabajadorDocs(docId, documentoId);
      console.log('Mail salud laboral actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando mail salud laboral', error);
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
    console.log("openUploadDIalof", docId, documentsID);


  }

  openUploadDialogCaseDT(docId: number, documentsID: any) {
    this.selectedDocIDDT = docId;
    this.flagDocDT = true;
    if (documentsID) {
      this.documentotoIDT = documentsID.split(",");
    } else {
      this.documentotoIDT = [];
    }
    console.log("openUploadDialogCaseDT", docId, documentsID);
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

  eliminarDocument(doc: Documento) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDocument(this.documentacionSelectUser.id, doc.id),
          this.directorioService.eliminarDocumento(doc.id).then(
            data => {
              this.directorios = this.directorios.filter(val => val.id !== doc.id);
              let docIds: string[] = [];

              this.directorios.forEach(el => {
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
            this.directorios = this.directorios.filter(val => val.id !== doc.id);
            let docIds: string[] = [];

            this.directorios.forEach(el => {
              docIds.push(el.id!);
            });
            console.log("que trae dosid", docIds);
          });
      }
    });
  }
  eliminarDocumentCaseDT(doc: Documento) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDocumentCaseDT(this.idSl, doc.id),
          this.directorioService.eliminarDocumento(doc.id).then(
            data => {
              this.directorios = this.directorios.filter(val => val.id !== doc.id);
              let docIds: string[] = [];

              this.directorios.forEach(el => {
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
            this.directorios = this.directorios.filter(val => val.id !== doc.id);
            let docIds: string[] = [];

            this.directorios.forEach(el => {
              docIds.push(el.id!);
            });
            console.log("que trae dosid", docIds);
          });
      }
    });
  }
  // isDateExceeded(fechaLimiteTimestamp: number): boolean {
  //   const fechaLimite = new Date(fechaLimiteTimestamp);
  //   const año =fechaLimite.getFullYear;
  //   const today = new Date();
  //   console.log("lkimit", fechaLimite, today);
  //   return fechaLimite > today;
  // }



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


  loadDocumentosCaseDT() {
    if (this.saludLaboralSelect && this.saludLaboralSelect.documentos) {
      console.log("doclistuser", this.saludLaboralSelect);


      let docum = this.saludLaboralSelect.documentos.split(",");
      console.log("vardocum", docum);

      docum.forEach((algo: string) => {
        this.directorioService.buscarDocumentosById(algo).then((elem: Directorio[]) => {
          console.log("algo", algo);

          this.directorios.push(elem[0]);
        })
      });

    }

  }
  showSuccessToast() {
    // this.envioExitoso = true;
    // setTimeout(() => {
    //   this.envioExitoso = false;
    // }, 3000); //
    this.msgs = []
    this.messageService.add({
      // this.msgs.push({
      key: 'formScmSL',
      severity: "success",
      summary: "Usuario actualizado",
      detail: `Empleado con  identificación  ${this.empleadoForm.value.numeroIdentificacion} fue actualizado`,
    });
  }





  onSelectionBP(event: any) {
    let empleado = <Empleado>event;
    this.businessNames = (empleado.primerApellido || "") + " " + (empleado.segundoApellido || "") + " " + (empleado.primerNombre || "") + " " + (empleado.segundoNombre || " ");
    this.empleadoForm.patchValue({ businessPartner: empleado.id })
    this.bussinessParner.patchValue({
      id: empleado.id,
      primerNombre: empleado.primerNombre,
      primerApellido: empleado.primerApellido,
      numeroIdentificacion: empleado.numeroIdentificacion,
      corporativePhone: empleado.corporativePhone,
      area: empleado.area,
      correoPersonal: empleado.correoPersonal,
      cargoId: empleado.cargo.id,
      direccionGerencia: empleado.direccionGerencia,
      email: [empleado.usuario.email],
    });
  }

  onSelectionJefeInmediato(event: any) {
    let empleado = <Empleado>event;
    this.jefeNames = (empleado.primerApellido || "") + " " + (empleado.segundoApellido || "") + " " + (empleado.primerNombre || "") + " " + (empleado.segundoNombre || " ");
    this.empleadoForm.patchValue({ jefeInmediato: empleado.id })
    this.jefeInmediato.patchValue({
      id: empleado.id,
      primerNombre: empleado.primerNombre,
      segundoNombre: empleado.segundoNombre,
      primerApellido: empleado.primerNombre,
      segundoApellido: empleado.segundoApellido,
      numeroIdentificacion: empleado.numeroIdentificacion,
      corporativePhone: empleado.corporativePhone,
      area: empleado.area,
      direccionGerencia: empleado.direccionGerencia,
      correoPersonal: empleado.correoPersonal,
      cargoId: empleado.cargo.id,
      email: [empleado.usuario.email],
    });
    this.jefeInmediatoName0 = (empleado.primerNombre || "") + " " + (empleado.segundoNombre || "") + " " + (empleado.primerApellido || "") + " " + (empleado.segundoApellido || " ")
  }
  usuarioP: any;
  async usuarioPermisos() {
    this.usuarioP = [];
    let filterQuery = new FilterQuery();
    filterQuery.filterList = [
      {
        field: "usuarioEmpresaList.usuario.id",
        criteria: Criteria.EQUALS,
        value1: this.empleadoSelect?.usuario.id,
      },
    ];
    await this.perfilService.findByFilter(filterQuery).then((resp: any) => {
      resp["data"].forEach((ident: any) => {
        this.usuarioP.push(ident.id);
      });
    });
  }
  async buildPerfilesIdList() {

    let filterQuery = new FilterQuery();
    filterQuery.filterList = [
      {
        field: "usuarioEmpresaList.usuario.id",
        criteria: Criteria.EQUALS,
        value1: this.empleadoSelect?.usuario.id,
        value2: null,
      },
    ];
    this.perfilService.update;
    await this.perfilService.findByFilter(filterQuery).then((resp: any) => {
      let perfilesId: any = [];
      resp["data"].forEach((ident: any) => perfilesId.push(ident.id));
      this.empleadoForm.patchValue({ perfilesId: perfilesId });
    });
  }
  areaChange(event: any) {
    this.division = event;
    this.empleadoForm.patchValue({ division: this.division })
  }

  // async listadoLocalidades(event:any){
  //   let filterLocalidad = new FilterQuery();
  //   filterLocalidad.fieldList = [
  //       'id',
  //       'localidad'
  //   ];
  //   filterLocalidad.filterList = [{ field: 'plantas.area.padreNombre', criteria: Criteria.EQUALS, value1: event}];
  //   this.localidadesList=[]
  //   await this.empresaService.getLocalidadesRWithFilter(filterLocalidad).then((ele:any)=>{
  //       for(let loc of ele.data){
  //         this.localidadesList.push({label:loc.localidad,value:loc.id})
  //     }
  //   }).catch((er:any)=>console.error(er))
  // }

  flagSaludLaboralRegistro: boolean = false
  modalDianostico = false;
  modifyDiag: boolean = false;




  createCaso() {
    this.flagSaludLaboralRegistro = true
  }

  showModalDiagnostico() {
    this.modalDianostico = true;
    this.modifyDiag = true;
  }

  showModalDiagnosticoConsulta() {
    this.modalDianostico = true;
    this.modifyDiag = true;
  }

  async deleteUpdateDiagnostigo() {
    let body = this.diagSelect;
    body['eliminado'] = true
    await this.scmService.updateDiagnosticos(body);
    this.chargueValue()
  }

  async onCloseModalDianostico() {
    this.modalDianostico = false;
    this.diagSelect = null;
    this.chargueValue()
  }
  recibirPCL(event: any) {
    this.listaPCL = event
  }
  validarPCL() {
    this.itemInPCL = false;
    this.listaPCL.forEach((item: any) => {
      if (item.diagnostic.label == this.diagSelect.diagnostico) {
        this.itemInPCL = true;
      }
    });
  }
  async deleteDiagnostico(id: any) {
    try {
      this.msgs = []
      await this.validarPCL()
      if (!this.itemInPCL) {
        if (await this.confirmService.confirmDiagnostico()) {
          let resp = await this.scmService.deleteDiagnosticos(id);
          if (resp) {
            this.messageService.add({
              // this.msgs.push({
              key: 'formScmSL',
              severity: "error",
              summary: "Diagnostico",
              detail: `Su Diagnostico fue eliminado`,
            });
            this.onCloseModalDianostico();
          }
        }
        else {
          // this.msgs.push({
          this.messageService.add({
            key: 'formScmSL',
            severity: "info",
            summary: "Cancelado",
            detail: "usted cancelo la eliminación"
          });
        }
      }
      else {
        // this.msgs.push({
        this.messageService.add({
          key: 'formScmSL',
          severity: "info",
          summary: "Cancelado",
          detail: "El diagnostico contiene PCL asociada"
        });
      }
    } catch (error) {
      console.error(error);
    }
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el documento' });
      });
  }
  deleteDocumentCaseDT(diagId: string | number, docId: string | number) {
    this.scmService.deleteIdDocsCaseDT(diagId, docId)
      .then((response: any) => {
        // Actualizar la lista de documentos o manejar la respuesta
        this.documentacionList = this.documentacionList.filter((doc: { id: string | number; }) => doc.id !== docId);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Documento eliminado correctamente' });
      })
      .catch((error: any) => {
        // Manejar errores
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el documento' });
      });
  }
  closeModalDiagnostico() {
    this.modalDianostico = false;
    this.diagSelect = null;
    this.modifyDiag = false;
    this.chargueValue()
  }
  tipoResponsable: any[] = [
    { label: 'GH Admon personal', value: 0 },
    { label: 'Seguridad', value: 1 },
    { label: 'Salud', value: 2 },
  ];

  selectResponsable: any = []
  flagUpload1: boolean = false
  flagUpload2: boolean = false
  flagUpload3: boolean = false
  flagUpload4: boolean = false
  flagUpload5: boolean = false
  flagUpload6: boolean = false
  flagUpload7: boolean = false
  flagUpload8: boolean = false
  flagUpload9: boolean = false
  flagUpload10: boolean = false
  flagUpload11: boolean = false
  flagUpload12: boolean = false
  flagUpload13: boolean = false
  flagUpload14: boolean = false
  flagUpload15: boolean = false
  flagUpload16: boolean = false

  selectResonsableSelected(eve: any, key: string, item: any) {
    item.usuarioSolicitado = eve.usuario.email;
    item.pkUser = eve.usuario.id
    console.log("usuario ID que esta aca", eve.usuario.id);

  }
  selectResonsableSelectedSeg(eve: any, key: string, item: any) {
    item.usuarioSolicitadoSeg = eve.usuario.email;
    item.pkuser2 = eve.usuario.id;
    console.log("algo seleccionado aca", item.usuarioSolicitadoSeg);

  }
  selectResonsableSelectedSalud(eve: any, key: string, item: any) {
    item.iduarioSolicitadoSalud = eve.usuario.email;
    item.pkuserSalud = eve.usuario.id;
    console.log("algo seleccionado aca", item.usuarioSolicitadoSeg);

  }
  selectResonsableSelectedPsicosocial(eve: any, key: string, item: any) {
    item.usuarioSolicitadoPsicosocial = eve.usuario.email;
    item.pkuserPsico = eve.usuario.id;

  }

  selectResonsable(eve: any, key: string) {
    switch (key) {
      case 'res1':
        this.usuarioSolicitado = eve.usuario.email
        this.pkUser = eve.usuario.id
        this.nombreCompletoSalud = `${eve.primerApellido} ${eve.segundoApellido} ${eve.primerNombre} ${eve.segundoNombre}`;
        console.log(this.usuarioSolicitado);
        console.log(this.pkUser)

        break;
      case 'res2':
        this.usuarioSolicitadoSeg = eve.usuario.email
        this.pkuser2 = eve.usuario.id;
        this.nombreCompletoSeg = `${eve.primerApellido} ${eve.segundoApellido} ${eve.primerNombre} ${eve.segundoNombre}`;
        this.userSoliCedula = eve.numeroIdentificacion
        console.log("user 2", this.usuarioSolicitadoSeg, this.nombreCompletoSeg)
        break;
      case 'res3':
        this.iduarioSolicitadoSalud = eve.usuario.email
        this.pkuserSalud = eve.usuario.id;
        this.nombreCompletoSaludLaboral = `${eve.primerApellido} ${eve.segundoApellido} ${eve.primerNombre} ${eve.segundoNombre}`;
        this.userSoliCedula = eve.numeroIdentificacion
        break;
      case 'res4':
        this.usuarioSolicitadoPsicosocial = eve.usuario.email
        this.pkuserPsico = eve.usuario.id;
        this.nombreCompletoPsicosocial = `${eve.primerApellido} ${eve.segundoApellido} ${eve.primerNombre} ${eve.segundoNombre}`;
        this.userSoliCedula = eve.numeroIdentificacion
        break;


      default:
        break;
    }
    const correo = eve.usuario.email;
    this.correos.push(correo);

  }


  async enviarCorreosAlBackend() {
    try {
      // Llama al servicio para enviar los correos
      await this.casoMedico.enviarCorreos(this.correos);
      if (this.correos && this.correos.length > 0) {
        this.messageService.add({
          key: 'salud',
          severity: "success",
          summary: "Mensaje del sistema",
          detail: "Correos enviados correctamente"
        });
        console.log('se mando bien esa mierda ?')
      } else {
        console.warn('No se enviaron correos porque la lista de correos está vacía');
      }
    } catch (error: any) {
      console.error('Error al enviar correos:', error);
      window.alert('Correos enviados correctamente a los usuarios: ' + this.correos);
    }
  }





  crearCargoActual() {
    let cargo = new CargoActual()
    cargo.nombre = this.selectedItem.toUpperCase();
    this.cargoActualService.create(cargo).then((resp: any) => {
      this.getCargoActual()
    }).catch(er => console.log(er))
    this.flagDialogCargoActual = false
    this.selectedItem = ''
  }

  async getCargoActual() {
    let cargoActualfiltQuery = new FilterQuery();
    cargoActualfiltQuery.sortOrder = SortOrder.ASC;
    cargoActualfiltQuery.sortField = "nombre";
    cargoActualfiltQuery.fieldList = ["id", "nombre"];
    cargoActualfiltQuery.filterList = []
    cargoActualfiltQuery.filterList.push({ field: 'empresa.id', criteria: Criteria.EQUALS, value1: this.empresa?.id?.toString() });
    await this.cargoActualService.getcargoRWithFilter(cargoActualfiltQuery).then((resp: any) => {
      this.cargoActualList = []
      resp.data.forEach((ele: any) => {
        this.cargoActualList.push({ label: ele.nombre, value: ele.id })
      });
    })
  }
  async lazyLoad(event: any) {
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;
    let filterEliminado = new Filter();
    filterEliminado.criteria = Criteria.EQUALS;
    //filterEliminado.field = 'eliminado';
    //filterEliminado.value1 = 'false';

    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    filterQuery.filterList.push(filterEliminado);
    try {
      let res: any = await this.scmService.findWithFilterSL(filterQuery);
      this.saludLaboralList = [];
      this.saludlaboralCHANGETest = [];
      res?.data?.forEach((dto: any) => {
        this.saludLaboralList.push(FilterQuery.dtoToObject(dto));
        console.log('saludlaborallist', this.saludlaboralCHANGETest);

      });
      console.log(res)
      this.totalRecords = res.count;

    } catch (error) {

    }
  }
  openCase() {



    console.log('case select', this.saludLaboralSelect.idSl);
    localStorage.setItem('scmShowCase', 'false');
    this.flagSaludLaboralRegistro = true;
    localStorage.setItem('slShowCase', 'true');
    localStorage.setItem('saludL', JSON.stringify(this.saludLaboralSelect));
    this.route.navigate(['/app/scm/saludlaboral/', this.saludLaboralSelect.idSl])
    console.log(this.caseSelect);
    console.log('case select', this.saludLaboralSelect.idSl);


  }
  // ngOnDestroy(): void {
  //   localStorage.removeItem('saludL');
  //   localStorage.removeItem('slShowCase')
  // }

  openCaseConsultar() {

    localStorage.setItem('scmShowCase', 'true');
    this.route.navigate(['/app/scm/saludlaboral/', this.saludLaboralSelect.idSl])
  }
  suggestions: string[] = [];


  selectedItem: string = '';
  filteredSuggestions: string[] = [];



  onSelect(item: string) {
    this.selectedItem = item;

    this.filteredSuggestions = [];
  }
  async onSubmiSLt() {
    await this.ghAdmonPersonal.forEach(async value => {
      await this.scmService.createMail(value).then(
        response => {
          this.modalConfirmacionVisible = false
          this.msgs = []
          this.messageService.add({
            // this.msgs.push({
            key: 'formScmSL',
            severity: "success",
            summary: "Correo Enviado",
            detail: `El correo electronico fue enviado`,
          });
          this.loadMailData(this.idSl);
        },
        error => {
          this.msgs = []
          this.messageService.add({
            // this.msgs.push({
            key: 'formScmSL',
            severity: "warn",
            summary: "Correo no Enviado",
            detail: `El correo electronico no fue enviado, verifica la información`,
          });
        }
      );
    })


  }
  isFechaLimiteProxima(fechaLimite: string): boolean {
    const fechaLimiteDate = new Date(fechaLimite);
    const dosDiasEnMS = 2 * 24 * 60 * 60 * 1000; // Dos días en milisegundos
    const dosDiasAntes = new Date().getTime() + dosDiasEnMS; // Fecha actual más dos días
    return fechaLimiteDate.getTime() < dosDiasAntes;
  }

  async onSubmiSLtSeg() {
    for(const value  of this.seguridad){
      await this.scmService.createMail(value).then(
        response => {
          this.modalConfirmacionVisible = false
          this.msgs = []
          this.messageService.add({
            // this.msgs.push({
            key: 'formScmSL',
            severity: "success",
            summary: "Correo Enviado",
            detail: `El correo electronico fue enviado`,
          });
          this.loadMailData(this.idSl);
        },
        error => {
          this.msgs = []
          this.messageService.add({
            // this.msgs.push({
            key: 'formScmSL',
            severity: "warn",
            summary: "Correo no Enviado",
            detail: `El correo electronico fue no enviado, verifica la información`,
          });
        }
      );
    };

  };
  async onSubmiSLl() {
    await this.saludLaboralMail.forEach(async value => {
      await this.scmService.createMail(value).then(
        response => {
          this.modalConfirmacionVisible = false
          this.msgs = []
          this.messageService.add({
            // this.msgs.push({
            key: 'formScmSL',
            severity: "success",
            summary: "Correo Enviado",
            detail: `El correo electronico fue enviado`,
          });
        },
        error => {
          this.msgs = []
          this.messageService.add({
            // this.msgs.push({
            key: 'formScmSL',
            severity: "warn",
            summary: "Correo no Enviado",
            detail: `El correo electronico fue no enviado, verifica la información`,
          });
        }
      );
    })
  }
  async onSubmitPsico() {
    await this.psicosocial.forEach(async value => {
      await this.scmService.createMail(value).then(
        response => {
          this.modalConfirmacionVisible = false
          this.msgs = []
          this.messageService.add({
            // this.msgs.push({
            key: 'formScmSL',
            severity: "success",
            summary: "Correo Enviado",
            detail: `El correo electronico fue enviado`,
          });
        },
        error => {
          this.msgs = []
          this.messageService.add({
            // this.msgs.push({
            key: 'formScmSL',
            severity: "warn",
            summary: "Correo no Enviado",
            detail: `El correo electronico fue no enviado, verifica la información`,
          });
        }
      );
    })
  }




  onInput(value: string) {
    let cargoActualfiltQuery2 = new FilterQuery();
    cargoActualfiltQuery2.sortOrder = SortOrder.ASC;
    cargoActualfiltQuery2.sortField = "nombre";
    cargoActualfiltQuery2.fieldList = ["id", "nombre"];
    cargoActualfiltQuery2.filterList = []
    cargoActualfiltQuery2.filterList.push({ field: 'empresa.id', criteria: Criteria.EQUALS, value1: this.empresa?.id?.toString() });
    this.cargoActualService.getcargoRWithFilter(cargoActualfiltQuery2).then((resp: any) => {
      this.suggestions = []
      resp.data.forEach((ele: any) => {
        this.suggestions.push(ele.nombre)
      });
    })
    this.selectedItem = value;
    this.filteredSuggestions = this.suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );
  }
  isDetalleEnabled: boolean = false;
  selectedEntidad: string | null = null;
  async onEntidadChange(event: any) {
    this.selectedEntidad = event.value;
    if (this.selectedEntidad) {
      if (this.selectedEntidad === 'otros') {
        this.isDetalleEnabled = false; // Desactivar el dropdown de detalles
      } else {
        this.isDetalleEnabled = true;
        await this.loadDetalles(this.selectedEntidad);
      }
    } else {
      this.isDetalleEnabled = false;
      this.detalleOptions = [];
    }
  }
  async loadDetalles(entidad: string) {
    let endpoint: string;

    switch (entidad) {
      case 'EPS':
        await this.comunService.findAllEps().then(
          (res: any) => {
            this.detalleOptions = res.map((item: any) => ({
              label: item.nombre, // Ajusta esto según la estructura de tus datos
              value: item.id // Ajusta esto según la estructura de tus datos
            }));
          },
          err => {
            console.error('Error loading detalles:', err);
            this.detalleOptions = [];
          }
        );
        break;
      case 'ARL':
        await this.comunService.findAllArl().then(
          (res: any) => {
            this.detalleOptions = res.map((item: any) => ({
              label: item.nombre, // Ajusta esto según la estructura de tus datos
              value: item.id // Ajusta esto según la estructura de tus datos
            }));
          },
          err => {
            console.error('Error loading detalles:', err);
            this.detalleOptions = [];
          }
        );
        break;
      case 'AFP':
        await this.comunService.findAllAfp().then(
          (res: any) => {
            this.detalleOptions = res.map((item: any) => ({
              label: item.nombre, // Ajusta esto según la estructura de tus datos
              value: item.id // Ajusta esto según la estructura de tus datos
            }));
          },
          err => {
            console.error('Error loading detalles:', err);
            this.detalleOptions = [];
          }
        );
        break;
      case 'Junta_Regional':
        await this.comunService.findAllJuntas().then(
          (res: any) => {
            this.detalleOptions = res.map((item: any) => ({
              label: item.nombre, // Ajusta esto según la estructura de tus datos
              value: item.id // Ajusta esto según la estructura de tus datos
            }));
          },
          err => {
            console.error('Error loading detalles:', err);
            this.detalleOptions = [];
          }
        );
        break;
      case 'Junta_Nacional':
        this.detalleOptions = [];
        this.isDetalleEnabled = false; // Aquí desactivamos el campo de detalle
        break;
      default:
        this.detalleOptions = [];
        this.isDetalleEnabled = false;
    }


  }
}

interface empresaNit {
  label: string;
  empresa: string | null;
  nit: string | null;
}
interface DocSolicitado {
  name: string;
  code: string;
}




import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import * as moment from 'moment';
import { Message, MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { PerfilService } from 'src/app/website/pages/admin/services/perfil.service';
import { Afp } from 'src/app/website/pages/comun/entities/afp';
import { Arl } from 'src/app/website/pages/comun/entities/arl';
import { Eps } from 'src/app/website/pages/comun/entities/eps';
import { JuntaRegional } from 'src/app/website/pages/comun/entities/juntaregional';
import { Prepagadas } from 'src/app/website/pages/comun/entities/prepagadas';
import { Proveedor } from 'src/app/website/pages/comun/entities/proveedor';
import { locale_es, tipo_identificacion } from 'src/app/website/pages/comun/entities/reporte-enumeraciones';
import { ComunService } from 'src/app/website/pages/comun/services/comun.service';
import { Criteria, Filter, SortOrder } from 'src/app/website/pages/core/entities/filter';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { AreaMatrizService } from 'src/app/website/pages/core/services/area-matriz.service';
import { CasosMedicosService } from 'src/app/website/pages/core/services/casos-medicos.service';
import { ProcesoMatrizService } from 'src/app/website/pages/core/services/proceso-matriz.service';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { CargoActual } from 'src/app/website/pages/empresa/entities/cargo-actual';
import { Empleado } from 'src/app/website/pages/empresa/entities/empleado';
import { Empresa } from 'src/app/website/pages/empresa/entities/empresa';
import { Perfil } from 'src/app/website/pages/empresa/entities/perfil';
import { AreaService } from 'src/app/website/pages/empresa/services/area.service';
import { CargoActualService } from 'src/app/website/pages/empresa/services/cargoActual.service';
import { EmpleadoService } from 'src/app/website/pages/empresa/services/empleado.service';
import { EmpresaService } from 'src/app/website/pages/empresa/services/empresa.service';
import { epsorarl } from 'src/app/website/pages/scm/entities/eps-or-arl';

@Component({
  selector: 'app-datos-trabajador-involucrado',
  templateUrl: './datos-trabajador-involucrado.component.html',
  styleUrl: './datos-trabajador-involucrado.component.scss'
})
export class DatosTrabajadorInvolucradoComponent implements OnInit {

  empleadoForm: FormGroup;
  empresaForm?: FormGroup;
  empleadoSelect?: Empleado | null;
  empleado!: Empleado;
  empresa: Empresa | null;
  tipoIdentificacionList: SelectItem[];
  cargoActual: string = ''

  nameAndLastName = "";
  selectedItem: string = '';
  status: any;
  @Output() updateFilterTotable = new EventEmitter<string>();
  @Output() researchFilter=new EventEmitter<string>();
  onfocusChange(){
    this.researchFilter.emit();
  }
  cargoActualList!: SelectItem[];
  listDivision: any = []
  epsList!: SelectItem[];
  afpList!: SelectItem[];
  arlList!: SelectItem[];
  arl: any;
  iddt?: number
  fechaCreacion: Date | undefined;
  consultar2: boolean = false;
  msgs?: Message[];
  empleadosList!: Empleado[];
  jefeInmediatoName?: string;
  caseStatus: SelectItem[] = [
    { label: "Abierto", value: "false" },
    { label: "Cerrado", value: "true" },
  ];

  flagDialogCargoActual: boolean = false
  saludL = JSON.parse(localStorage.getItem('saludL') || '{}');
  fechaCreacion2 = this.saludL.fechaCreacion;


  fechaActual: Date = new Date();
  yearRange: string = "1900:" + this.fechaActual.getFullYear();

  antiguedad: any;
  range: any;
  edad: any;

  entity: epsorarl = { EPS: [], ARL: [], AFP: [], Medicina_Prepagada: [], Proveedor_de_salud: [], Junta_Regional: [] };

  rangoAntiguedad = [
    { label: "Entre 1 y 5 años", range: "1,2,3,4,5" },
    { label: "Entre 6 y 10 años", range: "6,7,8,9,10" },
    { label: "Entre 11 y 15 años", range: "11,12,13,14,15" },
    { label: "Entre 16 y 20 años", range: "16,17,18,19,20" },
    { label: "Mayor a 20", range: "21,22,23,24,25,26,27,28,29" },
  ]

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


  async ngOnInit() {
    this.consultar2 = (localStorage.getItem('scmShowCase') === 'true') ? true : false;
    console.log("estatus", this.status);
    this.chargueValue();
    await this.comunService.findAllEps().then((data) => {
      this.epsList = [];
      this.epsList.push({ label: "--Seleccione--", value: null });
      (<Eps[]>data).forEach((eps) => {
        this.epsList.push({ label: eps.nombre, value: eps.id });

      });
      this.entity.EPS = this.epsList;
    });

    await this.comunService.findAllAfp().then((data) => {
      this.afpList = [];
      this.afpList.push({ label: "--Seleccione--", value: null });
      (<Afp[]>data).forEach((afp) => {
        this.afpList.push({ label: afp.nombre, value: afp.id });
      });
      this.entity.AFP = this.afpList;

    });

  }
  constructor(
    fb: FormBuilder,
    private cargoActualService: CargoActualService,
    private sesionService: SesionService,
    private areaService: AreaService,
    private route: Router,
    private empresaService: EmpresaService,
    private areaMatrizService: AreaMatrizService,
    private procesoMatrizService: ProcesoMatrizService,
    private casoMedico: CasosMedicosService,
    private comunService: ComunService,
    private messageService: MessageService,
    private empleadoService: EmpleadoService,
    private scmService: CasosMedicosService,
    private perfilService: PerfilService,
    private config: PrimeNGConfig,
    private router: ActivatedRoute,
  ) {
    this.empresa = this.sesionService.getEmpresa();
    let defaultItem = <SelectItem[]>[{ label: "--seleccione--", value: null }];
    this.tipoIdentificacionList = defaultItem.concat(<SelectItem[]>tipo_identificacion);
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
      statusCaso: [null],
      epsDictamen: [null]
    });

    this.status = this.caseStatus.find(sta => sta.value == this.empleadoForm.get("statusCaso")?.value)?.label



    this.empresaForm = fb.group({
      empresa: [null, Validators.required],
      nit: [null, Validators.required],
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
  value: any;
  saludlaboralCHANGETest: any[] = [];
  empresaSelect2!: empresaNit;
  loaded!: boolean;
  departamento: any;
  async onSelection(event: any) {
    this.value = event;
    this.empleadoSelect = null;
    let emp = <Empleado>this.value;
    this.saludlaboralCHANGETest = await this.scmService.getCaseListSL(emp.id!);
   
    this.empleadoSelect = emp;
    this.empresaForm!.reset()
    if (this.empleadoSelect) {
      this.updateFilterTotable.emit( this.empleadoSelect.numeroIdentificacion);
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
      'statusCaso': [''],
      'epsDictamen': ['']
    });
    setTimeout(() => {
      this.empleadoForm.patchValue({
        'ciudad': this.empleadoSelect!.ciudad,
      })
    }, 2000);

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
      'fechaCierreCaso': [''],
      'statusCaso': [''],
      'epsDictamen': [''],
    };
    const cleanDataToSend = this.prepareFormData(dataToSend);
    this.empleadoForm.patchValue(cleanDataToSend);










    this.empresaForm?.patchValue({
      'nit': this.empleadoSelect.nit,
      'empresa': { label: this.empleadoSelect.empresa, empresa: this.empleadoSelect.empresa, nit: this.empleadoSelect.nit }
    });


  }
  async buscarEmpleado(event: any) {
    await this.empleadoService
      .buscar(event.query)
      .then((data) => (this.empleadosList = <Empleado[]>data));
  }

  suggestions: string[] = [];
  filteredSuggestions: string[] = [];

  onInput(value: string) {
    // Lógica para filtrar sugerencias
    let cargoActualfiltQuery2 = new FilterQuery();
    cargoActualfiltQuery2.sortOrder = SortOrder.ASC;
    cargoActualfiltQuery2.sortField = "nombre";
    cargoActualfiltQuery2.fieldList = ["id", "nombre"];
    cargoActualfiltQuery2.filterList = [];
    cargoActualfiltQuery2.filterList.push({ field: 'empresa.id', criteria: Criteria.EQUALS, value1: this.empresa?.id?.toString() });

    this.cargoActualService.getcargoRWithFilter(cargoActualfiltQuery2).then((resp: any) => {
      this.suggestions = resp.data.map((ele: any) => ele.nombre);
      this.filteredSuggestions = this.suggestions
        .filter(suggestion => suggestion.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);
    });

    this.selectedItem = value;
  }

  closeDialog() {
    this.flagDialogCargoActual = false;
    this.selectedItem = '';
    this.suggestions = [];
    this.filteredSuggestions = [];
  }


  onSelect(item: string) {
    this.selectedItem = item;

    this.filteredSuggestions = [];
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
  jefeNames = " ";
  jefeInmediato: FormGroup;
  jefeInmediatoName0?: string;
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
  businessNames = "";
  bussinessParner: FormGroup;
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
  crearCargoActual() {
    let cargo = new CargoActual()
    cargo.nombre = this.selectedItem.toUpperCase();
    this.cargoActualService.create(cargo).then((resp: any) => {
      this.getCargoActual()
    }).catch(er => console.log(er))
    this.flagDialogCargoActual = false
    this.selectedItem = ''
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
    try {
      console.log("cargarProceso - Evento:", eve, "Tipo:", tipo);

      // Verifica que eve tenga el ID correcto
      const areaId = eve?.id;
      console.log("ID del área:", areaId);

      let filterProceso = new FilterQuery();
      filterProceso.fieldList = ['id', 'nombre'];
      filterProceso.filterList = [
        { field: 'areaMatriz.id', criteria: Criteria.EQUALS, value1: areaId },
        { field: 'eliminado', criteria: Criteria.EQUALS, value1: false }
      ];

      console.log("Consulta de procesos con filtro:", filterProceso);

      let procesoList: any = [];
      await this.procesoMatrizService.findByFilter(filterProceso).then((resp: any) => {
        console.log("Respuesta de procesos:", resp);
        procesoList = resp.data.map((element: any) => ({ label: element.nombre, id: element.id }));
      }).catch(error => {
        console.error("Error al cargar los procesos:", error);
        throw error;
      });

      if (tipo === 'Origen') {
        this.procesoList = [...procesoList];
      } else {
        this.procesoListActual = [...procesoList];
      }
    } catch (error) {
      console.error("Error en cargarProceso:", error);
    }
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

  onSubmitSL() {
    console.log('Formulario antes de validación:', this.empleadoForm.controls);

    // Excluir cargoId del formulario
    const { cargoId, ...formValues } = this.empleadoForm.value;

    if (this.empleadoForm.valid) {
      let body = { ...formValues };  // Utiliza los valores excluyendo cargoId

      // Continuar con el procesamiento de los campos
      body.procesoActual = body.procesoActual?.id || body.procesoActual;
      body.procesoOrigen = body.procesoOrigen?.id || body.procesoOrigen;
      body.areaActual = body.areaActual?.id || body.areaActual;
      body.areaOrigen = body.areaOrigen?.id || body.areaOrigen;
      body.nombreCompletoSL =
        `${body.primerApellido ? body.primerApellido : ''} ` +
        `${body.segundoApellido ? body.segundoApellido : ''} ` +
        `${body.primerNombre ? body.primerNombre : ''} ` +
        `${body.segundoNombre ? body.segundoNombre : ''}`.trim();


      if (Array.isArray(body.pkUser)) {
        body.pkUser = body.pkUser[0];
      }

      body = this.prepareFormData(body);

      console.log('Cuerpo a enviar antes de enviar:', body);
      console.log('Valor de iddt:', this.iddt);

      // Verificar si es una creación o actualización
      if (this.iddt === undefined) {
        console.log('Creando nuevo caso');
        this.casoMedico.createDT(body)
          .then((response) => {
            if (response) {
              this.showSuccessToast();
              console.log('Empleado creado correctamente 2', response);
              setTimeout(() => {
                this.route.navigate(['/app/scm/saludlaborallist'])

              }, 3000);
              this.msgs = [];
              this.messageService.add({
                key: 'formScmSL',
                severity: "warn",
                summary: "Caso creado",
                detail: `Caso creado con numero ${response} revisar el listado`,

              });
            }
          })
          .catch((error) => {
            console.error('Error al crear el empleado:', error);
            this.msgs = [];
            this.messageService.add({
              key: 'formScmSL',
              severity: "error",
              summary: "Error al crear empleado",
              detail: `Empleado con identificación ${this.empleadoForm.value.numeroIdentificacion} no fue creado`,

            });
          });
      } else {
        console.log('Actualizando caso');
        this.casoMedico.putCaseSL(this.iddt, body)
          .then((response) => {
            if (response) {
              this.msgs = []
              this.messageService.add({
                key: 'formScmSL',
                severity: "success",
                summary: "Usuario actualizado",
                detail: `Empleado con identificación ${this.empleadoForm.value.numeroIdentificacion} fue actualizado con el caso ${response}`,
              });
              console.log('Empleado actualizado correctamente', response);
            }
          })
          .catch((error) => {
            console.error('Error al actualizar el empleado:', error);
            this.msgs = [];
            this.messageService.add({
              key: 'formScmSL',
              severity: "error",
              summary: "Error al actualizar empleado",
              detail: `Empleado con identificación ${this.empleadoForm.value.numeroIdentificacion} no fue actualizado`,
            });
          });
      }
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




  nombreSesion?: string
  nombreSesionSeg?: string
  cedula?: string
  localeES: any = locale_es;
  colsActionList!: any[];
  prepagadasList!: SelectItem[];
  provsaludList!: SelectItem[];
  perfilList: SelectItem[] = [];
  @Input() isUpdate!: boolean;
  @Input() show!: boolean;
  diagnosticoList: any[] = [];
  consultar: boolean = false;
  saludLaboralSelect: any;
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
      console.log(error, 'error cargo');

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
  flagSaludLaboralRegistro: boolean = false
  async chargueEditForm() {
    try {
      this.flagSaludLaboralRegistro = true;
      const data: any = await this.scmService.getCaseSL(this.iddt!.toString());

      await this.buscarEmpleado({ query: data['usuarioAsignado'] });
      const empleado = this.empleadosList[0];
      if (empleado && typeof empleado === 'object') {
        this.setEmpleadoFormValues(empleado);
        this.setFechaValues(data);

        const jefeInmediato = empleado['jefeInmediato'] ?? {};
        this.setJefeInmediatoValues(jefeInmediato, empleado['usuario']);

        this.setEmpleadoEdadYAntiguedad(empleado);

        if (data) {
          await this.setDataRelatedValues(data);
        }

        // Asegurarse de establecer cargoOriginal y cargoActual
        if (data['cargoOriginal'] != null) {
          this.empleadoForm.controls['cargoOriginal'].setValue(parseInt(data['cargoOriginal']));
        } else {
          this.empleadoForm.controls['cargoOriginal'].setValue(null);
        }

        if (data['cargoActual'] != null) {
          this.empleadoForm.controls['cargoActual'].setValue(parseInt(data['cargoActual']));
        } else {
          this.empleadoForm.controls['cargoActual'].setValue(null);
        }

        setTimeout(() => {
          this.consultar = localStorage.getItem('slShowCase') === 'true';
          this.saludLaboralSelect = JSON.parse(localStorage.getItem('saludL')!);
          console.log('LACONSULTA', this.saludLaboralSelect);
        }, 2000);
      }
    } catch (error) {
      console.error('Error al obtener los datos del trabajador', error);
    }
  }

  async setEmpleadoFormValues(empleado: any) {



    const empleadoFields = [
      'numeroIdentificacion', 'area', 'cargoId', 'perfilesId', 'tipoIdentificacion',
      'primerNombre', 'segundoNombre', 'primerApellido', 'segundoApellido',
      'genero', 'fechaNacimiento', 'fechaIngreso', 'corporativePhone', 'direccion',
      'zonaResidencia', 'telefono1', 'telefono2', 'correoPersonal', 'emailEmergencyContact',
      'phoneEmergencyContact', 'emergencyContact', 'ciudad', 'email',
    ];

    empleadoFields.forEach(field => {
      this.empleadoForm.controls[field].setValue(empleado[field]);
    });

    this.empleadoForm.controls['eps'].setValue(empleado['eps']['id']);
    this.empleadoForm.controls['afp'].setValue(empleado['afp']['id']);
    this.arl = this.empresa?.arl == null ? null : this.empresa.arl.nombre;
    this.empleadoForm.controls['tipoIdentificacion'].setValue(empleado['tipoIdentificacion']?.id)
    this.nameAndLastName = `${empleado['primerNombre']} ${empleado['primerApellido']}`;
    this.empleadoForm.controls['fechaNacimiento'].setValue(new Date(empleado['fechaNacimiento']));
    this.empleadoForm.controls['fechaIngreso'].setValue(new Date(empleado['fechaIngreso']));
    this.empleadoForm.controls['cargoId'].setValue(empleado['cargo'])
    this.empleadoForm.controls['perfilesId'].setValue(empleado['id'])


    let empresaNitpivot: empresaNit = {
      empresa: empleado['empresa'],
      nit: empleado['nit'],
      label: empleado['empresa']
    };
    const empresaSeleccionada = this.empresaList2.find(e => e.label === empresaNitpivot.label);
    console.log(empresaSeleccionada);

    if (empresaSeleccionada) {
      this.empresaForm?.controls['empresa'].setValue(empresaSeleccionada);
      this.empresaForm?.controls['nit'].setValue(empresaNitpivot.nit);
      console.log("aaaaaa", empresaSeleccionada.empresa, empresaSeleccionada.label);


    } else {
      // Manejar el caso cuando la empresa no se encuentra en la lista
      console.error('Empresa no encontrada en la lista');
    }


  }


  setFechaValues(data: any) {
    const fechaFields = ['fechaCierreCaso', 'fechaRecepcionDocs', 'fechaMaximaEnvDocs'];

    fechaFields.forEach(field => {
      const formattedDate = data[field] ? new Date(data[field]) : null;
      this.empleadoForm.controls[field].setValue(formattedDate);
    });
  }

  setJefeInmediatoValues(jefeInmediato: any, usuario: any) {
    console.log("que entra aca", jefeInmediato);

    this.jefeInmediato.controls['numeroIdentificacion'].setValue(jefeInmediato['numeroIdentificacion'] ?? 'SIN INFORMACIÓN');
    this.jefeNames = `${jefeInmediato['primerNombre']} ${jefeInmediato['primerApellido']}` ?? 'sin informacion';
    this.jefeInmediato.controls['corporativePhone'].setValue(jefeInmediato['corporativePhone'] ?? 'SIN INFORMACION');
    if (jefeInmediato && jefeInmediato.usuario) {
      console.log(this.jefeInmediato.controls['email']);

      this.jefeInmediato.controls['email'].setValue(jefeInmediato.usuario.email);
    } else {
      console.error("El control 'email' no existe en el formulario jefeInmediato");
    }



  }

  setEmpleadoEdadYAntiguedad(empleado: any) {
    const fechaIngreso = moment(empleado.fechaIngreso);
    const fechaNacimiento = moment(empleado.fechaNacimiento);
    const antiguedad = fechaIngreso.diff(moment.now(), "years") * -1;
    this.edad = `${fechaNacimiento.diff(moment.now(), "year") * -1} Años`;
    this.antiguedad = `${antiguedad} Años`;

    this.range = antiguedad === 0 ? 'Menor a 1 año' : this.getAntiguedadRange(antiguedad);
  }

  getAntiguedadRange(antiguedad: number): string {
    for (let rango of this.rangoAntiguedad) {
      if (rango.range.split(',').includes(antiguedad.toString())) {
        return rango.label;
      }
    }
    return '';
  }

  async setDataRelatedValues(data: any) {
    const origenActualFields = ['divisionOrigen', 'divisionActual', 'localidadOrigen', 'localidadActual', 'procesoOrigen', 'procesoActual'];

    // Establecer valores iniciales del formulario
    origenActualFields.forEach(field => {
      this.empleadoForm.controls[field].setValue(parseInt(data[field]));
    });

    // Cargar datos necesarios
    await Promise.all([
      this.cargarPlantaLocalidad(this.empleadoForm.controls['divisionOrigen'].value, 'Origen'),
      this.cargarPlantaLocalidad(this.empleadoForm.controls['divisionActual'].value, 'Actual'),
      this.cargarArea(this.empleadoForm.controls['localidadOrigen'].value, 'Origen'),
      this.cargarArea(this.empleadoForm.controls['localidadActual'].value, 'Actual')
    ]);

    // Establecer valores para áreas
    const areaOrigen = this.areaList.find(value => value.id === parseInt(data['areaOrigen']));
    const areaActual = this.areaListActual.find(value => value.id === parseInt(data['areaActual']));

    this.empleadoForm.controls['areaOrigen'].setValue(areaOrigen);
    this.empleadoForm.controls['areaActual'].setValue(areaActual);

    // Esperar a que se carguen los procesos
    await Promise.all([
      this.cargarProceso(areaOrigen?.id, 'Origen'),
      this.cargarProceso(areaActual?.id, 'Actual')


    ]);
    // Establecer valores para procesos
    this.empleadoForm.controls['procesoOrigen'].setValue(this.procesoList.find(value => value.id === parseInt(data['procesoOrigen'])));
    this.empleadoForm.controls['procesoActual'].setValue(this.procesoListActual.find(value => value.id === parseInt(data['procesoActual'])));
  }





  isDetalleEnabled: boolean = false;
  selectedEntidad: string | null = null;


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
  JuntaRegionalList!: SelectItem[];
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
    'documentosEmpresa',
    'documentosMinisterio',
    'fechaRecepcionDocs',
    'fechaCierreCaso',
    'statusCaso',
    'epsDictamen'
  ];
  saludLaboralList: any[] = [];
  totalRecords!: number;
  @Input('caseSelect') caseSelect?: any;
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
        console.log('saludlaborallist2', this.saludlaboralCHANGETest);

      });
      console.log(res)
      this.totalRecords = res.count;

    } catch (error) {

    }
  }
  openCase() {
    // Obtener el valor de statusCaso desde localStorage
    const statusCaso = localStorage.getItem('statusCaso') === 'true';
    console.log("status", statusCaso);


    if (statusCaso) {
      // Si statusCaso es true, abrir el caso en modo consulta
      this.openCaseConsultar();
    } else {
      // Si no, abrir el caso normalmente
      console.log('case select', this.saludLaboralSelect.idSl);
      localStorage.setItem('scmShowCase', 'false');
      this.flagSaludLaboralRegistro = true;
      localStorage.setItem('slShowCase', 'true');
      localStorage.setItem('saludL', JSON.stringify(this.saludLaboralSelect));
      this.route.navigate(['/app/scm/saludlaboral/', this.saludLaboralSelect.idSl]);
      console.log(this.caseSelect);
      console.log('case select', this.saludLaboralSelect.idSl);
    }
  }

  openCaseConsultar() {
    localStorage.setItem('scmShowCase', 'true');
    this.route.navigate(['/app/scm/saludlaboral/', this.saludLaboralSelect.idSl]);
  }

  cambiarEstado(iddt: number): void {
    this.scmService.changeEstadoSL(iddt).then(
      response => {
        this.messageService.add({
          key: 'formScmSL',
          severity: "success",
          summary: "Documento aprobado",
          detail: `El caso ha sido cerrado correctamente`,
        });
      },
      error => {
        console.error('Error al enviar datos:', error);
      }
    );
  }



}
interface empresaNit {
  label: string;
  empresa: string | null;
  nit: string | null;
}


import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild, OnDestroy,LOCALE_ID,Inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService, SelectItem } from "primeng/api";
import * as moment from "moment";
import { epsorarl } from "../../entities/eps-or-arl";
import { ConfirmationService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { DirectorioService } from "../../../ado/services/directorio.service";
import { EmpresaService } from "../../../empresa/services/empresa.service";
import { Empresa } from "../../../empresa/entities/empresa";
import { Empleado } from "../../../empresa/entities/empleado";
import { locale_es, tipo_identificacion } from "../../../comun/entities/reporte-enumeraciones";
import { EmpleadoService } from "../../../empresa/services/empleado.service";
import { SesionService } from "../../../core/services/session.service";
import { ComunService } from "../../../comun/services/comun.service";
import { CargoService } from "../../../empresa/services/cargo.service";
import { UsuarioService } from "../../../admin/services/usuario.service";
import { CasosMedicosService } from "../../../core/services/casos-medicos.service";
import { PerfilService } from "../../../admin/services/perfil.service";
import { ConfirmService } from "../../../core/services/confirm.service";
import { Afp } from "../../../comun/entities/afp";
import { Eps } from "../../../comun/entities/eps";
import { Arl } from "../../../comun/entities/arl";
import { Prepagadas } from "../../../comun/entities/prepagadas";
import { Proveedor } from "../../../comun/entities/proveedor";
import { FilterQuery } from "../../../core/entities/filter-query";
import { Criteria, SortOrder } from "../../../core/entities/filter";
import { Cargo } from "../../../empresa/entities/cargo";
import { Perfil } from "../../../empresa/entities/perfil";
import { Area } from "../../../empresa/entities/area";
import { Usuario, UsuarioEmpresa } from "../../../empresa/entities/usuario";
import { PrimeNGConfig } from 'primeng/api';
import {formatDate} from '@angular/common';
import { firmaservice } from 'src/app/website/pages/core/services/firmas.service';
import { endPoints } from 'src/environments/environment';
import{firma} from 'src/app/website/pages/comun/entities/firma';
import { Message } from 'primeng/api';
import { EmpleadoBasic } from "../../../empresa/entities/empleado-basic";

export interface TreeNode {
    data?: any;
    children?: TreeNode[];
    leaf?: boolean;
    expanded?: boolean;
}

@Component({
    selector: "app-formulario-scm",
    templateUrl: "./formulario-scm.component.html",
    styleUrls: ["./formulario-scm.component.scss"],
    providers: [DirectorioService, EmpresaService, EmpleadoService, SesionService, MessageService,
        ComunService, CargoService, UsuarioService, CasosMedicosService, PerfilService, ConfirmService, ConfirmationService]
})
export class FormularioScmComponent implements OnInit, OnDestroy {
    @ViewChild('general', {static:false}) generalPanel!:ElementRef;
    @ViewChild('medico', {static:false}) medicoPanel!:ElementRef;

    tabIndex:any
    msgs?: Message[];
    listaPCL: any;
    itemInPCL: boolean = false;
    empresasList!: Empresa[];
    styleMap: { [key: string]: string } = {};
    value: any;
    recoClick: boolean = false;
    edad: any;
    incapacidades: any = [];
    imagenesList: any = [];
    imgMap: any = {};
    casoSeleccionado: any;
    createCase: any;
    casosList: any[] = [];
    colsActionList!: any[];
    numMaxImg = 3;
    loadingImg = false;
    modalRecomendatios = false;
    modalSeguimientos = false;
    modalDianostico = false;
    casoMedicoForm: FormGroup;
    bussinessParner: FormGroup;
    jefeInmediato: FormGroup;
    jefeInmediatoName?:string;
    jefeInmediatoName0?:string;
    cedula: string = "";
    cargoDescripcion!: string;
    actualizar!: boolean;
    adicionar!: boolean;
    empleado!: Empleado;
    empresa: Empresa | null;
    tipoTratamientos: SelectItem[] = [
        { label: "--Seleccione--", value: null },
        { value: 0, label: "Otros" },
        { value: 1, label: "Terapias" },
        { value: 2, label: "Quirúrgico" },
        { value: 3, label: "Paraclínicos" },
        { value: 4, label: "Medicamentos" }
    ];
    recomendationList: TreeNode[]=[];
    seguimientosList!: TreeNode[];
    logsList: any = []
    seguimientosgenericoList?: TreeNode[];
    empleadosList!: Empleado[];
    empleadosList2!: EmpleadoBasic[];
    diagnosticoList: any[] = [];
    modifyDiag: boolean = false;
    idUltimoSeguimiento?:any;
    seguimientos: any[] = [];
    tratamientos: any[] = [];
    products2: any[] = [];
    statuses!: SelectItem[];
    emitPclentity: SelectItem[] = [
        { label: "--Seleccione--", value: null },
        { label: "EPS", value: "EPS" },
        { label: "ARL", value: "ARL" },
        { label: "AFP", value: "AFP" },
        { label: "Junta Regional", value: "Junta Regional" },
        { label: "Junta Nacional", value: "Junta Nacional" }
    ]
    conceptoRehabilitacion: SelectItem[] = [
        { label: "--Seleccione--", value: null },
        { label: "Favorable", value: "1" },
        { label: "Desfavorable", value: "2" },
        { label: "No Aplica", value: "3" },
    ]
    entityConceptoRehabilitacion: Array<SelectItem[]> = [
        [
            { label: "--Seleccione--", value: null },
            { label: "EPS", value: "EPS" },
            { label: "ARL", value: "EPS" },
        ],
        [
            { label: "--Seleccione--", value: null },
            { label: "EPS", value: "EPS" },
            { label: "ARL", value: "ARL" },
        ],
        [
            { label: "--Seleccione--", value: null },
            { label: "EPS", value: "EPS" },
            { label: "ARL", value: "ARL" },
        ],
        [
            { label: "No Aplica", value: "No Aplica" },

        ],
    ]
    professionalAreaList = [
        { label: "--Seleccione--", value: null },
        { label: "Enfermeros", value: "Enfermeros" },
        { label: "Farmacéuticos", value: "Farmacéuticos" },
        { label: "Fisioterapeutas", value: "Fisioterapeutas" },
        { label: "Logopedas", value: "Logopedas" },
        { label: "Obstetricia", value: "Obstetricia" },
        { label: "Médicos", value: "Médicos" },
        { label: "Nutricionistas", value: "Nutricionistas" },
        { label: "Odontólogos", value: "Odontólogos" },
        { label: "Ópticos y optometristas", value: "Ópticos y optometristas" },
        { label: "Podólogos", value: "Podólogos" },
        { label: "Psicólogos", value: "Psicólogos" },
        { label: "Terapia ocupacional", value: "Terapia ocupacional" }
    ]
    empresaSelect2!: empresaNit;
    empresaList2: empresaNit[] = [
        { label: "--Seleccione--", empresa: null, nit: null },
        { label: "Agromil S.A.S", empresa: "Agromil S.A.S", nit:"830511745" },
        { label: "Almacenes Corona", empresa: "Almacenes Corona", nit:"860500480-8" },
        { label: "Compañía Colombiana de Ceramica S.A.S", empresa: "Compañía Colombiana de Ceramica S.A.S",nit:"860002536-5" },
        { label: "Corlanc S.A.S", empresa: "Corlanc S.A.S",nit:"900481586-1" },
        { label: "Corona Industrial", empresa: "Corona Industrial",nit:"900696296-4" },
        { label: "Despachadora internacional de Colombia S.A.S", empresa: "Despachadora internacional de Colombia S.A.S",nit:"860068121-6" },
        { label: "Electroporcelana Gamma", empresa: "Electroporcelana Gamma",nit:"890900121-4" },
        { label: "Locería Colombiana S.A.S", empresa: "Locería Colombiana S.A.S",nit:"890900085-7" },
        { label: "Minerales Industriales S.A", empresa: "Minerales Industriales S.A",nit:"890917398-1" },
        { label: "Nexentia S.A.S", empresa: "Nexentia S.A.S",nit:"900596618-3" },
        { label: "Suministros de Colombia S.A.S", empresa: "Suministros de Colombia S.A.S",nit:"890900120-7" },
        { label: "Organización corona", empresa: "Organización corona",nit:"860002688-6" }
	]
    // @Input() empleadoSelect!: Empleado | null;

    empleadoSelect?: Empleado | null;
    // @Input('empleadoSelect') 
    // set empleadoSelectInput(empleadoInput: Empleado){
    //     this.empresaForm!.reset()
    //     if(empleadoInput){
    //         this.empleadoSelect = empleadoInput
    //         this.empresaForm!.value.nit = this.empleadoSelect.nit
    //         this.empresaSelect2 = this.empresaForm!.value.empresa = {nit:this.empleadoSelect.nit, label:this.empleadoSelect.empresa, empresa:this.empleadoSelect.empresa}
    //     }
    // }
    empresaForm?: FormGroup;
    @Output() onEmpleadoUpdate = new EventEmitter();
    @Output() onCancel = new EventEmitter();
    @Input('caseSelect')caseSelect?: any;
    @Input() isUpdate!: boolean;
    @Input() show!: boolean;
    @Input() consultar: boolean = false;
    consultar2: boolean = false;
    @Input("disabled") disabled: boolean = false;
    @Input() editable!: boolean;
    @ViewChild("autocomplete", { static: true }) autoC!: ElementRef;
    rangoAntiguedad = [
        { label: "Entre 1 y 5 años", range: "1,2,3,4,5" },
        { label: "Entre 6 y 10 años", range: "6,7,8,9,10" },
        { label: "Entre 11 y 15 años", range: "11,12,13,14,15" },
        { label: "Entre 16 y 20 años", range: "16,17,18,19,20" },
        { label: "Mayor a 20", range: "21,22,23,24,25,26,27,28,29" },
    ]
    division: string | null = null;
    empleadoForm: FormGroup;
    empresaId: any = this.sesionService.getEmpresa()?.id;
    fechaActual: Date = new Date();
    logSelected: any;
    status: any;
    fechaCierre: any;
    recoSelect: any;
    diagSelect: any;
    seguiSelect: any;
    seguigenericoSelect: any;
    seguimientosgenerico: any[] = [];
    modalSeguimientosgenerico: boolean = false;
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    tipoIdentificacionList: SelectItem[];
    tipoVinculacionList: SelectItem[];
    epsList!: SelectItem[];
    arlList!: SelectItem[];
    afpList!: SelectItem[];
    prepagadasList!: SelectItem[];
    provsaludList!: SelectItem[];
    sveOptionList: SelectItem[] = [];
    cargoList!: SelectItem[];
    casocreado: boolean = false;
    caseStatus: SelectItem[] = [
        { label: "Abierto", value: "1" },
        { label: "Cerrado", value: "0" },
    ];
    perfilList: SelectItem[] = [];
    loaded!: boolean;
    antiguedad: any;
    arl: any;
    range: any;
    jefeNames = " ";
    businessNames = "";
    nameAndLastName = "";
    solicitando: boolean = false;
    departamento: any;
    entity: epsorarl = { EPS: [], ARL: [], AFP: [], Medicina_Prepagada: [], Proveedor_de_salud: [] };
    anexo6Form?:FormGroup
    nombreSesion?:string
    seguimientoid:number=6795;
    tipoOptionList: SelectItem[] = [
        { label: "--Seleccione--", value: null },
        { label: "Medico", value: "Medico" },
        { label: "Juridico", value: "Juridico" },
        { label: "Otros", value: "Otros" },

    ]
    prioridadOptionList: SelectItem[] = [
        { label: "--Seleccione--", value: null },
        { label: "Alta", value: "Alta" },
        { label: "Media", value: "Media" },
        { label: "Baja", value: "Baja" },

    ]
    caseOptionList: SelectItem[] = [
        { label: "--Seleccione--", value: null },
        { label: "Si", value: "1" },
        { label: "No", value: "0" },
        { label: "En Seguimiento", value: "2" },
        { label: "No Aplica", value: "3" },

    ]
    IntervencionOptionList: SelectItem[] = [
        { label: "--Seleccione--", value: null },
        { label: "Si", value: "1" },
        { label: "No", value: "0" },
    ]
    caseMotivoOptionListt: Array<SelectItem[]> = [
        [
            { label: "Fallecimiento", value: "Fallecimiento" },
            { label: "Reintegro", value: "Reintegro" },
            { label: "Pensíon", value: "Pensíon" },
            { label: "Desvinculacion", value: "Desvinculacion" },
        ],
        [
            { label: "Critico", value: "Critico" },
            { label: "Seguimiento", value: "Seguimiento" },
            { label: "Pre - Mesa", value: "Pre - Mesa" },
            { label: "Cerrado", value: "Cerrado" },

        ],
    ]
    pclOptionList: SelectItem[] = [
        { label: "--Seleccione--", value: null },
        { label: "En Calificación", value: "1" },
        { label: "En Firme", value: "2" },
        { label: "En Apelación", value: "0" }
    ]
    entityOptionList: SelectItem[] = [

        { label: "EPS", value: "EPS" },
        { label: "ARL", value: "ARL" },
        { label: "Medicina prepagada", value: "Medicina_prepagada" },
        { label: "Proveedor de salud", value: "Proveedor_de_salud" }
    ]
    pclCalificacionList: SelectItem[] = [
        { label: "--Seleccione--", value: null },
        { label: "En Proceso", value: "1" },
        { label: "En Firme", value: "2" },
        { label: "En Apelación", value: "0" }
    ]
    idCase?:string;
    flagGuardado:boolean=false
    fields: string[] = [
        'id',
        'primerNombre',
        'primerApellido',
        'numeroIdentificacion', 
        'usuarioBasic'
      ];
    constructor(
        private empleadoService: EmpleadoService,
        fb: FormBuilder,
        private sesionService: SesionService,
        private comunService: ComunService,
        private cargoService: CargoService,
        private usuarioService: UsuarioService,
        private scmService: CasosMedicosService,
        private perfilService: PerfilService,
        private confirmService: ConfirmService,
        private route: ActivatedRoute,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private config: PrimeNGConfig,
        private firmaservice:firmaservice,
        @Inject(LOCALE_ID) private locale: string,
    ) {

        this.empresa = this.sesionService.getEmpresa();
        let defaultItem = <SelectItem[]>[{ label: "--seleccione--", value: null }];
        this.tipoIdentificacionList = defaultItem.concat(<SelectItem[]>tipo_identificacion);
        this.tipoVinculacionList = defaultItem.concat(<SelectItem[]>tipo_identificacion);

        //Instaciacion de datos de form
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
        });

        this.casoMedicoForm = fb.group({
            id: [null],
            documento: [null, Validators.required],
            codigoCie10: [null, /*Validators.required*/],
            razon: [{ value: null, disabled: this.disabled }, /*Validators.required*/],
            names: [null, /*Validators.required*/],
            observaciones: [null, /*Validators.required*/],
            statusCaso: ["1", /*Validators.required*/],
            requiereIntervencion: [null, /*Validators.required*/],
            professionalArea: [null, /*Validators.required*/],
            porcentajePcl: [null, /*Validators.required*/],
            pcl: [null, /*Validators.required*/],
            region: [null],
            ciudad: [null],
            entidadEmitida: [null],
            entidadEmitidaTwo: [null],
            cargo: [null],
            descripcionCompletaCaso: [null, /*Validators.required*/],
            eliminado: [false, /*Validators.required*/],
            fechaCalificacion: [null, /*Validators.required*/],
            sve: [null, /*Validators.required*/],
            pkUser: [null, Validators.required],
            diagnostico: [null, /*Validators.required*/],
            origen: [null, /*Validators.required*/],
            fechaConceptRehabilitacion: [null, /*Validators.required*/],
            fechaConceptRehabilitacionTwo: [null, /*Validators.required*/],
            emisionPclFecha: [null, /*Validators.required*/],
            entidadEmiteConcepto: [null, /*Validators.required*/],
            entidadEmiteConceptoTwo: [null, /*Validators.required*/],
            justification: [null, /*Validators.required*/],
            statusDeCalificacion: [null, /*Validators.required*/],
            casoMedicoLaboral: [null, /*Validators.required*/],
            fechaFinal: [null, /*Validators.required*/], sistemaAfectado: [null, /*Validators.required*/],
            fechaCreacion: [null],
            entidadEmiteCalificacion: [null, /*Validators.required*/],
            pclEmitEntidad: [null, /*Validators.required*/],
            conceptRehabilitacion: [null, /*Validators.required*/],
            conceptRehabilitacionTwo: [null, /*Validators.required*/],
            tipoCaso: [null, /*Validators.required*/],
            prioridadCaso: [null, /*Validators.required*/],
            descripcionCargo: [null]
        });
        this.anexo6Form=fb.group({
            'fecha': [null],
            'nombreApellidos': [null],
            'cedula': [null],
            'ubicacion': [null],
            'cargo': [null],
            'textoseguimiento': [null]
          })
          this.empresaForm = fb.group({            
            empresa:[null, Validators.required],
            nit:[null, Validators.required],
        });

        this.status = this.caseStatus.find(sta => sta.value == this.casoMedicoForm.get("statusCaso")?.value)?.label
        this.seguimientoid=endPoints.seguimientoid
    }

    ngOnDestroy(): void {
        localStorage.removeItem('scmShowCase');
    }

    get pkUse() {
        return this.casoMedicoForm.get("pkUser") as FormControl
    }

    get disableRazon() {
        if (this.casoMedicoForm.value.casoMedicoLaboral === 2 || this.casoMedicoForm.value.casoMedicoLaboral === 3) {
            return true;
        }
        return false;
    }

    async ngOnInit() {
        let primerNombre=(this.sesionService.getEmpleado())?(this.sesionService.getEmpleado()!.primerNombre?this.sesionService.getEmpleado()!.primerNombre:''):''
        let segundoNombre=(this.sesionService.getEmpleado())?(this.sesionService.getEmpleado()!.segundoNombre?this.sesionService.getEmpleado()!.segundoNombre:''):''
        let primerApellido=(this.sesionService.getEmpleado())?(this.sesionService.getEmpleado()!.primerApellido?this.sesionService.getEmpleado()!.primerApellido:''):''
        let segundoApellido=(this.sesionService.getEmpleado())?(this.sesionService.getEmpleado()!.segundoApellido?this.sesionService.getEmpleado()!.segundoApellido:''):''
        this.nombreSesion=primerNombre+' '+segundoNombre+' '+primerApellido+' '+segundoApellido

        this.config.setTranslation(this.localeES);
        this.colsActionList = [
            { field: 'status', header: 'Estado' },
            { field: 'recomendaciones', header: 'Nombre de la recomendacion' },
            { field: 'fechaExpiracion', header: 'Fecha Finalizacion' }
        ];

        this.consultar = (localStorage.getItem('scmShowCase') === 'true') ? true : false;
        this.consultar2 = (localStorage.getItem('scmShowCase') === 'true') ? true : false;

        try {
            let res: any = await this.scmService.getSvelist();
            this.sveOptionList.push({ label: "--Seleccione--", value: null });
            res.forEach((sve: any) => {
                this.sveOptionList.push({ label: sve.nombre, value: sve.id.toString() });
            });
            this.idCase=this.route.snapshot.params["id"];
            this.caseSelect = await this.scmService.getCase(this.route.snapshot.params["id"]);
            this.onLoadInit();
            this.modifyCase();
        } catch (e) {
        }


        if (this.consultar) {
            this.onLoadInit();
            this.modifyCase();
            this.empleadoForm.disable();
            this.bussinessParner.disable();
            this.casoMedicoForm.disable();
            this.empleadoForm.disable();

        }

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

        let cargofiltQuery = new FilterQuery();
        cargofiltQuery.sortOrder = SortOrder.ASC;
        cargofiltQuery.sortField = "nombre";
        cargofiltQuery.fieldList = ["id", "nombre"];
        this.cargoService.findByFilter(cargofiltQuery).then((resp: any) => {
            this.cargoList = [];
            this.cargoList.push({ label: '--Seleccione--', value: null });
            (<Cargo[]>resp['data']).forEach((cargo) => {
                this.cargoList.push({ label: cargo.nombre, value: cargo.id });
            });
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

        this.obligatoriedadSVE()

    }

    areaChange(event: any) {
        this.division = event;
        this.empleadoForm.patchValue({ division: this.division })
    }

    async perfilPermisos() {
        await this.perfilService.findAll().then((resp: any) => {
            (<Perfil[]>resp["data"]).forEach((perfil) => {
                this.perfilList.push({ label: perfil.nombre, value: perfil.id });
            });
            if (this.isUpdate === true || this.show === true)
                setTimeout(() => {
                    this.buildPerfilesIdList();
                }, 500);
        });
    }

    onClick() {
        console.info(this.sesionService.getPermisosMap())
        console.info(this.sesionService.getPermisosMap()["SCM_DEL_CASE_DIAG"])
    }

    async aonRegisters() {
        try {
            let token: any = await this.scmService.getTokenAon();
            let fechafinal = new Date().toISOString().slice(0, 10);
            let res: any = await this.scmService.getRegistersAon(token.message.Authorization, this.empleadoSelect?.numeroIdentificacion, "2010-01-01", fechafinal);
            this.incapacidades = res.message.data;

            this.incapacidades = this.incapacidades.sort((a:any, b:any) => {
                if (a.finicio > b.finicio) {
                    return -1;
                }
                if (a.finicio < b.finicio) {
                    return 1;
                }
                return 0;
            });
        } catch (error) {
            console.error('Error: aonRegisters => ', error);
        }
    }

    closeForm() {
        this.caseSelect = null;
        this.empleadoSelect = null;
    }

    async onSubmit() {
        this.flagGuardado=true
        this.msgs=[]
        if (!this.casoMedicoForm.valid) {
            this.messageService.add({
            // this.msgs.push({
                key: 'formScm',
                severity: "error",
                summary: "Por favor revise todos los campos obligatorios",
            });
            this.flagGuardado=false
            return this.markFormGroupTouched(this.casoMedicoForm);
        }

        try {
            let region = this.empleadoForm.get("area")?.value.nombre;
            if (region === 'SELECCIONE UBICACION') {
                this.messageService.add({
                // this.msgs.push({
                    key: 'formScm',
                    severity: 'error',
                    detail: 'Debe actualizar la ubicación del trabajador involucrado en la pestaña Información General',
                    life: 6000,
                });
                this.flagGuardado=false
                return;
            }
            let ciudad = this.empleadoForm.get("ciudad")?.value.nombre;
        } catch (e) {
            this.messageService.add({
            // this.msgs.push({
                key: 'formScm',
                severity: "error",
                detail: 'Por favor revise los campos ciudad de residencia en la pestaña información general.',
                life: 6000,
            });
            this.flagGuardado=false
            return this.markFormGroupTouched(this.empleadoForm);
        }

        this.casoMedicoForm.patchValue({
            region: this.empleadoForm.get("area")?.value.nombre || "",
            ciudad: this.empleadoForm.get("ciudad")?.value.nombre || "",
            names: ``,
            cargo: this.empleadoForm.value.cargoId,
            eliminado: false,
            fechaFinal: this.casoMedicoForm.controls["fechaFinal"].value == null ? null : this.casoMedicoForm.controls["fechaFinal"].value,

            pkUser: this.empleadoForm.get("id")?.value || null,
            codigoCie10: this.casoMedicoForm.value.id || null,
            empresaId: this.sesionService.getEmpresa()?.id,
        });



        let status: any;
        if (this.casocreado == true) {
            this.createCase = false;
        }

        if (this.createCase) {
            this.casoMedicoForm.patchValue({ fechaCreacion: Date.now() });

            status = await this.scmService.create(this.casoMedicoForm.value);
        } else {

            this.casoMedicoForm.patchValue({ id: this.caseSelect.id });
            status = await this.scmService.edit(this.casoMedicoForm.value);
        }
        this.msgs=[]
        if (this.adicionar) {
            this.messageService.add({
            // this.msgs.push({
                key: 'formScm',
                severity: "success",
                summary: "Mensaje del sistema",
                detail: `El caso médico fue creado exitosamente, su numero de caso es ${status}`,
            });
            this.actualizar = true;
            this.adicionar = false;

            this.idCase = status
            this.caseSelect = await this.scmService.getCase(status);
            this.caseSelect.id = status;
            this.casocreado = true;
        }


        else if (this.actualizar) {
            this.messageService.add({
            // this.msgs.push({
                key: 'formScm',
                severity: 'success',
                summary: 'Mensaje del sistema',
                detail: `Se ha actualizado correctamente el caso medico ${status}`


            });
            this.createCase = false;
        }
        this.flagGuardado=false
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

    // Component methods
    buscarEmpleado(event: any) {
        this.empleadoService
            .buscar(event.query)
            .then((data) => (this.empleadosList = <Empleado[]>data));
    }
    
    async buscarEmpleado2(event: any) {

        let filterQuery = new FilterQuery();
        filterQuery.sortField = event.sortField;
        filterQuery.sortOrder = event.sortOrder;
        filterQuery.offset = event.first;
        filterQuery.rows = event.rows;
        filterQuery.count = true;
    
        filterQuery.fieldList = this.fields;
        filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    
        for (let i = 1; i < this.fields.length; i++) {
          filterQuery.filterList.pop();
          if(this.fields[i] != 'usuarioBasic'){
            filterQuery.filterList.push({ criteria: Criteria.LIKE, field: this.fields[i], value1: '%'+event.query+'%'});
          }else{
            filterQuery.filterList.push({ criteria: Criteria.LIKE, field: 'usuarioBasic.email', value1: '%'+event.query+'%'});
          }
    
          let terminarBusqueda = false;
          await this.empleadoService.findByFilter(filterQuery).then(
            (data: any) => {
              let datos: EmpleadoBasic[] = data.data;
              if(datos.length > 0){
                this.empleadosList2 = datos;
                terminarBusqueda = true;
              }
            }
          );
          if(terminarBusqueda) break;
        }
    
    }

    async onSelection(event: any) {
        this.value = event;
        this.empleadoSelect = null;
        this.casoMedicoForm.reset();
        let emp = <Empleado>this.value;
        this.casosList = await this.scmService.getCaseList(emp.id!);
        this.empleadoSelect = emp;
        console.log(this.empleadoSelect)
        this.empresaForm!.reset()
        if(this.empleadoSelect){
            this.empresaForm!.value.nit = this.empleadoSelect.nit
            this.empresaForm!.value.empresa = {label:this.empleadoSelect.empresa, empresa:this.empleadoSelect.empresa, nit:this.empleadoSelect.nit}
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

            if(a) {
                this.range = this.rangoAntiguedad[j].label;
            }
        }

        this.edad = `${fechaNacimiento.diff(moment.now(), "year") * -1} Años`;
        this.arl = this.empresa?.arl == null ? null : this.empresa.arl.nombre;
        this.casoMedicoForm.patchValue({
            documento: this.empleadoSelect.numeroIdentificacion,
        });
        this.casoMedicoForm.patchValue({ pkUser: this.empleadoSelect.id })
        this.departamento = this.empleadoSelect.area.id;

        if (this.empleadoSelect.businessPartner) {
            this.onSelectionBP(this.empleadoSelect.businessPartner)
        }

        if (this.empleadoSelect.jefeInmediato) {
            this.onSelectionJefeInmediato(this.empleadoSelect.jefeInmediato);
            this.jefeInmediatoName=this.jefeInmediatoName0
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
        });
        setTimeout(() => {
            this.empleadoForm.patchValue({
                'ciudad': this.empleadoSelect!.ciudad,
            })
        }, 2000);

        this.empresaForm?.patchValue({
            'nit':this.empleadoSelect.nit,
            'empresa':{label:this.empleadoSelect.empresa, empresa:this.empleadoSelect.empresa, nit:this.empleadoSelect.nit}
        });
    }


    async submitEmp() {
        // await this.usuarioPermisos();
        let empleado = new Empleado();

        empleado.id = this.empleadoForm.value.id;
        empleado.primerNombre = this.empleadoForm.value.primerNombre;
        empleado.segundoNombre = this.empleadoForm.value.segundoNombre;
        empleado.primerApellido = this.empleadoForm.value.primerApellido;
        empleado.segundoApellido = this.empleadoForm.value.segundoApellido;
        empleado.codigo = this.empleadoForm.value.codigo;
        empleado.direccion = this.empleadoForm.value.direccion;
        empleado.fechaIngreso = this.empleadoForm.value.fechaIngreso;
        empleado.emergencyContact = this.empleadoForm.value.emergencyContact;
        empleado.corporativePhone = this.empleadoForm.value.corporativePhone;
        empleado.phoneEmergencyContact = this.empleadoForm.value.phoneEmergencyContact;
        empleado.emailEmergencyContact = this.empleadoForm.value.emailEmergencyContact;
        empleado.fechaNacimiento = this.empleadoForm.value.fechaNacimiento;
        empleado.genero = this.empleadoForm.value.genero;
        empleado.numeroIdentificacion = this.empleadoForm.value.numeroIdentificacion;
        empleado.telefono1 = this.empleadoForm.value.telefono1;
        empleado.telefono2 = this.empleadoForm.value.telefono2;
        empleado.ciudad = this.empleadoForm.value.ciudad == null ? null : this.empleadoForm.value.ciudad.id;
        if (this.empleadoForm.value.afp != null) {
            empleado.afp = new Afp();
            empleado.afp.id = this.empleadoForm.value.afp;
        }
        if (this.empleadoForm.value.eps != null) {
            empleado.eps = new Eps();
            empleado.eps.id = this.empleadoForm.value.eps;
        }
        empleado.tipoIdentificacion = this.empleadoForm.value.tipoIdentificacion;
        empleado.tipoVinculacion = this.empleadoForm.value.tipoVinculacion;
        empleado.zonaResidencia = this.empleadoForm.value.zonaResidencia;
        empleado.area = new Area();
        empleado.cargo = new Cargo();
        empleado.usuario = new Usuario();
        empleado.area.id = this.empleadoForm.value.area.id;
        if (this.empleadoForm.value.area.nombre === 'SELECCIONE UBICACION') {
            this.msgs=[]
            this.messageService.add({
            // this.msgs.push({
                key: 'formScm',
                severity: 'error',
                detail: 'Debe seleccionar la ubicación del trabajador involucrado.',
                life: 6000
            })
            return
        }
        empleado.cargo.id = this.empleadoForm.value.cargoId;
        empleado.usuario.email = this.empleadoForm.value.email;
        empleado.ciudadGerencia = this.empleadoForm.value.ciudadGerencia;
        empleado.regional = this.empleadoForm.value.regional,
            empleado.correoPersonal = this.empleadoForm.value.correoPersonal;
        empleado.direccionGerencia = this.empleadoForm.value.correoPersonal;
        empleado.businessPartner = this.empleadoForm.value.businessPartner;
        empleado.jefeInmediato = this.empleadoForm.value.jefeInmediato;

        empleado.usuario.usuarioEmpresaList = [];
        this.empleadoForm.value.perfilesId.forEach((perfilId: any) => {
            let ue = new UsuarioEmpresa();
            ue.perfil = new Perfil();
            ue.perfil.id = perfilId;
            empleado.usuario.usuarioEmpresaList?.push(ue);
        });
        this.solicitando = true;
        empleado.usuario.id = this.empleadoSelect?.usuario.id;
        empleado.usuario.ipPermitida = this.empleadoSelect?.usuario.ipPermitida
        empleado.empresa = this.empresaForm!.value.empresa == null ? null : this.empresaForm!.value.empresa.label;
        empleado.nit = this.empresaForm!.value.empresa == null ? 0 : this.empresaForm!.value.empresa.nit;

        this.usuarioService.update(empleado.usuario)
            .then(resp => {
                this.solicitando = false;
            })
            .catch(err => {
                this.solicitando = false;
            });

        this.empleadoService.update(empleado)
            .then(async data => {
                this.jefeInmediatoName=this.jefeInmediatoName0
                this.empleadoSelect!.jefeInmediato = this.jefeInmediato.value
                this.msgs=[]
                this.messageService.add({
                // this.msgs.push({
                    key: 'formScm',
                    severity: "success",
                    summary: "Usuario actualizado",
                    detail: `Empleado con  identificación  ${empleado.numeroIdentificacion} fue actualizado`,
                });
                this.solicitando = false;
                // if(){window.location.reload()}
            })
            .catch(err => {
                this.solicitando = false;
            });
    }

    showModalDiagnostico() {
        this.modalDianostico = true;
        this.modifyDiag = true;
    }

    closeModalDiagnostico() {
        this.modalDianostico = false;
        this.diagSelect = null;
        this.modifyDiag = false;
    }


    async onCloseModalrecomendation() {
        if(this.sesionService.getPermisosMap()["SCM_LIST_CASE_RECO"])this.recomendationList = await this.scmService.getRecomendations(this.caseSelect.id);
        this.modalRecomendatios = false;
        this.recoSelect = null;
        if(this.sesionService.getPermisosMap()["SCM_GET_CASE_LOG"]) this.logsList = await this.scmService.getLogs(this.caseSelect.id);
    }

    async onCloseModalseguimiento() {
        if(this.sesionService.getPermisosMap()["SCM_GET_CASE_SEG"])this.seguimientosList = await this.scmService.getSeguimientos(this.caseSelect.id);
        if(this.sesionService.getPermisosMap()["SCM_GET_CASE_SEG"])this.seguimientos = await this.scmService.getSeguimientos(this.caseSelect.id);
        if(this.seguimientos.length>0)this.idUltimoSeguimiento=this.seguimientos[0].id

        this.modalSeguimientos = false;
        this.seguiSelect = null;
        if(this.sesionService.getPermisosMap()["SCM_GET_CASE_LOG"]) this.logsList = await this.scmService.getLogs(this.caseSelect.id);
    }
    
    async onCloseModalseguimientogenerico() {       
        if(this.sesionService.getPermisosMap()["SCM_GET_CASE_SEG_GENERICO"])this.seguimientosgenericoList = await this.scmService.getSeguimientosgenerico(this.caseSelect.id);
        if(this.sesionService.getPermisosMap()["SCM_GET_CASE_SEG_GENERICO"])this.seguimientosgenerico = await this.scmService.getSeguimientosgenerico(this.caseSelect.id); 

        this.modalSeguimientosgenerico = false;
        this.seguigenericoSelect = null;
        if(this.sesionService.getPermisosMap()["SCM_GET_CASE_LOG"]) this.logsList = await this.scmService.getLogs(this.caseSelect.id);
    }

    async copiarLinkSeguimiento(idSeguimiento:number, usuario:string){
        let filterQuery = new FilterQuery();
        filterQuery.filterList = []
        filterQuery.filterList.push({ criteria: Criteria.EQUALS, field: "idrelacionado", value1: idSeguimiento.toString() });
        let firm:any
        let firmaExiste
        await this.firmaservice.getfirmWithFilter(filterQuery).then(async (ele:any)=>{
            let datosFirma=ele['data']
            datosFirma.sort(function(a:any,b:any){
                if(a.id > b.id){
                  return 1
                }else if(a.id < b.id){
                  return -1;
                }
                  return 0;
                });
            if(usuario=='aprueba')firm=datosFirma[0]
            if(usuario=='medico')firm=datosFirma[1]
            firmaExiste=firm.firma
            let fir = new firma()
            fir.id =firm.id
            fir.firma=firm.firma
            fir.idempresa=firm.idempresa
            fir.fechacreacion=firm.fechacreacion
            fir.idrelacionado=firm.idrelacionado
            fir.email=firm.email
            fir.idusuario=firm.idusuario
            fir.terminoscondiciones=firm.terminoscondiciones
            fir.fechaterminos= firm.fechaterminos
            fir.nombre=firm.nombre
      
            if(new Date(new Date(firm.fechacreacion)!.getTime() + (1000 * 60 * 60 * 24)) < new Date()){
              if(firm.fecharenovacion){
                if(new Date(new Date(firm.fecharenovacion)!.getTime() + (1000 * 60 * 60 * 24)) < new Date()){
                  fir.fecharenovacion=new Date()
                  await this.firmaservice.update(fir)
                }
              }else{
                fir.fecharenovacion=new Date()
                await this.firmaservice.update(fir)
              }
            }
        })
        if(firmaExiste){
            this.msgs = [];
            this.messageService.add({
            // this.msgs.push({ 
                key: 'formScm',
                severity: 'info', summary: 'Link firmado', detail: 'Este link ya se encuentra con una firma registrada' });
          }
        navigator.clipboard.writeText(endPoints.firma+btoa(firm.id))
    }

    async onCloseModalDianostico() {
        if(this.sesionService.getPermisosMap()["SCM_GET_CASE_DIAG"])this.diagnosticoList = await this.scmService.getDiagnosticos(this.caseSelect.id);
        this.modalDianostico = false;
        this.diagSelect = null;
        if(this.sesionService.getPermisosMap()["SCM_GET_CASE_LOG"]) this.logsList = await this.scmService.getLogs(this.caseSelect.id);
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
    
    /** MÉTODOS JORNADA */
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
        console.log(this.jefeInmediato)
        this.jefeInmediatoName0=(empleado.primerNombre || "") + " " + (empleado.segundoNombre || "") + " " + (empleado.primerApellido || "") + " " + (empleado.segundoApellido || " ")
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();
            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    async modifyCase() {
        this.consultar = false;
        this.actualizar = true;
        this.caseSelect = this.casoSeleccionado || this.caseSelect;
        let { fechaCalificacion, emisionPclFecha, fechaConceptRehabilitacion, fechaConceptRehabilitacionTwo, fechaFinal, ...caseFiltered } = this.caseSelect
        this.casoMedicoForm.patchValue(caseFiltered);
        this.casoMedicoForm.patchValue({
            fechaConceptRehabilitacion: fechaConceptRehabilitacion == null ? null : new Date(fechaConceptRehabilitacion),
            fechaConceptRehabilitacionTwo: fechaConceptRehabilitacionTwo == null ? null : new Date(fechaConceptRehabilitacionTwo),
            fechaCalificacion: fechaCalificacion == null ? null : new Date(fechaCalificacion),
            emisionPclFecha: emisionPclFecha == null ? null : new Date(emisionPclFecha),
            fechaFinal: fechaFinal == null ? null : new Date(fechaFinal)
        });

        try {
            if(this.sesionService.getPermisosMap()["SCM_LIST_CASE_RECO"])this.recomendationList = await this.scmService.getRecomendations(this.caseSelect.id);
            if(this.sesionService.getPermisosMap()["SCM_GET_CASE_SEG"])this.seguimientosList = await this.scmService.getSeguimientos(this.caseSelect.id);
            this.cargoDescripcion = this.caseSelect.descripcionCargo;
            if(this.sesionService.getPermisosMap()["SCM_GET_CASE_DIAG"])this.diagnosticoList = await this.scmService.getDiagnosticos(this.caseSelect.id);
            this.fechaSeg()
            if(this.sesionService.getPermisosMap()["SCM_GET_CASE_TRAT"])this.tratamientos = await this.scmService.getTratamientos(this.caseSelect.id)
            this.empresaId = this.sesionService.getEmpresa()?.id;
            this.aonRegisters();
            this.status = (this.casoMedicoForm.get("statusCaso")?.value !== null) ? this.caseStatus.find(sta => sta.value == this.casoMedicoForm.get("statusCaso")?.value)?.label : 'N/A'
            if(this.sesionService.getPermisosMap()["SCM_GET_CASE_LOG"]) this.logsList = await this.scmService.getLogs(this.caseSelect.id);
        } catch (error) {
            console.error(error);
        }
    }

    async readCase() {
        this.consultar = true;
        this.caseSelect = this.casoSeleccionado || this.caseSelect;
        let { fechaCalificacion, emisionPclFecha, fechaConceptRehabilitacion, ...caseFiltered } = this.caseSelect
        this.casoMedicoForm.patchValue(caseFiltered);
        
        this.casoMedicoForm.patchValue({
            fechaConceptRehabilitacion: fechaConceptRehabilitacion == null ? null : new Date(fechaConceptRehabilitacion),
            fechaCalificacion: fechaCalificacion == null ? null : new Date(fechaCalificacion),
            emisionPclFecha: emisionPclFecha == null ? null : new Date(emisionPclFecha)
        });

        try {
            if(this.sesionService.getPermisosMap()["SCM_LIST_CASE_RECO"])this.recomendationList = await this.scmService.getRecomendations(this.caseSelect.id);
            if(this.sesionService.getPermisosMap()["SCM_GET_CASE_SEG"])this.seguimientosList = await this.scmService.getSeguimientos(this.caseSelect.id);
            this.cargoDescripcion = this.caseSelect.descripcionCargo;
            if(this.sesionService.getPermisosMap()["SCM_GET_CASE_DIAG"])this.diagnosticoList = await this.scmService.getDiagnosticos(this.caseSelect.id);
            this.fechaSeg()
            this.aonRegisters();
            if(this.sesionService.getPermisosMap()["SCM_GET_CASE_LOG"]) this.logsList = await this.scmService.getLogs(this.caseSelect.id);
        } catch (error) {
            console.error(error);
        }
        this.empleadoForm.disable();
        this.casoMedicoForm.disable();
    }


    async onLoadInit() {
        this.onSelection(this.caseSelect.pkUser);
    }

    createCaso() {
        this.adicionar = true;
        this.createCase = true;
    }

    async confirm(product: any, index: any) {
        if (await this.confirmService.confirm()){
            this.msgs=[]
            this.messageService.add({
            // this.msgs.push({
                key: 'formScm',
                severity: "info",
                summary: "Confirmado",
                detail: "El tratamiento ha sido eliminado" });
            this.onRowDelete(product, index);
        }else {
            this.msgs=[]
            this.messageService.add({
            // this.msgs.push({
                key: 'formScm',
                severity: "info",
                summary: "Cancelado",
                detail: "usted cancelo la eliminación"
            });
        }
    }

    onRowDelete(product: any, index: any) {
        product.eliminado = true;
        this.tratamientos.slice(index, 1);
        this.onRowEditSave(product, "tratamiento");
    }

    async onRowCloneInit(pseg: any, type?: any) {
        let { id, tarea, responsable, resultado, responsableExterno, ...product } = pseg;
        try {
            let firm= new firma();
            firm.idempresa=this.empresaId
            firm.fechacreacion=new Date()
            let resp:any = await this.scmService.createSeguimiento(product);
            console.log(resp)
            firm.idrelacionado=resp.id
            await this.firmaservice.create(firm)
            await this.firmaservice.create(firm)

            this.msgs=[]
            // this.msgs.push({
            this.messageService.add({
                key: 'formScm',
                severity: "success",
                summary: "Información",
                detail: `Se ha clonado exitosamente`,
            });
            this.fechaSeg();
        } catch (error) {
            console.error(error);
        }
    }

    async onRowEditSave(product: any, type?: any) {
        if (product.responsable) {
            product.responsable = product.responsable.id;
        }

        try {
            this.msgs=[]
            if (type == "tratamiento") {
                let resp = await this.scmService.updateTratamiento(product);
                this.messageService.add({
                // this.msgs.push({
                    key: 'formScm',
                    severity: "success",
                    summary: "Información",
                    detail: `Su numero de Tratamiento es ${product.id}`,
                });
                return this.fechaTrat()
            }
            let resp = await this.scmService.updateSeguimiento(product);
            this.messageService.add({
            // this.msgs.push({
                key: 'formScm',
                severity: "success",
                summary: "Seguimiento",
                detail: `Su numero de seguimiento es ${product.id}`,
            });
            this.fechaSeg();
        } catch (error) {
            console.error(error);
        }
    }

    async deleteDiagnostico(id: any) {
        try {
            this.msgs=[]
            await this.validarPCL()
            if (!this.itemInPCL) {
                if (await this.confirmService.confirmDiagnostico()) {
                    let resp = await this.scmService.deleteDiagnosticos(id);
                    if (resp) {
                        this.messageService.add({
                        // this.msgs.push({
                            key: 'formScm',
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
                        key: 'formScm',
                        severity: "info",
                        summary: "Cancelado",
                        detail: "usted cancelo la eliminación"
                    });
                }
            }
            else {
                // this.msgs.push({
                this.messageService.add({
                    key: 'formScm',
                    severity: "info",
                    summary: "Cancelado",
                    detail: "El diagnostico contiene PCL asociada"
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async deleteRecomendation(id: any) {
        try {
            this.msgs=[]
            if (await this.confirmService.confirmRecomendacion()) {
                let resp = await this.scmService.deleteRecomendation(id);
                if (resp) {
                    this.messageService.add({
                    // this.msgs.push({
                        key: 'formScm',
                        severity: "error",
                        summary: "Mensaje del sistema",
                        detail: `Su recomendación se eliminó exitosamente`,
                    });
                    this.onCloseModalrecomendation();
                }
            }
            else {
                // this.msgs.push({
                this.messageService.add({
                    key: 'formScm',
                    severity: "info",
                    summary: "Cancelado",
                    detail: "usted cancelo la eliminación"
                });
            }

        } catch (error) {
            console.error(error);
        }
    }

    async deleteSeguimiento(id: any) {
        try {
            this.msgs=[]
            if (await this.confirmService.confirmSeguimiento()) {
                let resp = await this.scmService.deleteSeguimiento(id);
                if (resp) {
                    this.messageService.add({
                    // this.msgs.push({
                        key: 'formScm',
                        severity: "error",
                        summary: "Mensaje del sistema",
                        detail: `Su seguimiento se eliminó exitosamente`,
                    });
                    this.fechaSeg()
                }
            }
            else {
                this.messageService.add({
                // this.msgs.push({
                    key: 'formScm',
                    severity: "info",
                    summary: "Cancelado",
                    detail: "usted cancelo la eliminación"
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async deleteSeguimientogenerico(id: number) {
        this.msgs=[]
        try {
            if (await this.confirmService.confirmSeguimiento()) {
                let resp = await this.scmService.deleteSeguimiento(id);
                if (resp) {
                    this.messageService.add({
                    // this.msgs.push({
                        key: 'formScm',
                        severity: "error",
                        summary: "Mensaje del sistema",
                        detail: `Su seguimiento se eliminó exitosamente`,
                    });
                    this.fechaSeg()
                }
            }
            else {
                this.messageService.add({
                // this.msgs.push({ 
                    key: 'formScm',
                    severity: "info", summary: "Cancelado", detail: "usted cancelo la eliminación" });
            }
        } catch (error) {
        }
    }
    
    async anexo6seguimiento(seguimiento:any){

        let ele:any
        let filterQuery = new FilterQuery();
        filterQuery.filterList = []
        filterQuery.filterList.push({ criteria: Criteria.EQUALS, field: "idrelacionado", value1: seguimiento.id.toString() });
        await this.firmaservice.getfirmWithFilter(filterQuery).then((elem:any)=>{      
        ele=elem['data']
        })
        ele.sort(function(a:any,b:any){
            if(a.id > b.id){
              return 1
            }else if(a.id < b.id){
              return -1;
            }
              return 0;
            });
        let template = document.getElementById('plantillaAnexo6');
        
        template?.querySelector('#P_empresa_logo')?.setAttribute('src', this.sesionService.getEmpresa()?.logo!);
        template?.querySelector('#P_firma_aprueba')?.setAttribute('src', '../../../../../assets/png/imgwhite.png');
        if(ele.length>0)if(ele[0].firma)template?.querySelector('#P_firma_aprueba')?.setAttribute('src', ele[0].firma);
        template?.querySelector('#P_firma_medico')?.setAttribute('src', '../../../../../assets/png/imgwhite.png');
        if(ele.length>0)if(ele[1].firma)template?.querySelector('#P_firma_medico')?.setAttribute('src', ele[1].firma);
        template!.querySelector('#P_fechaseguiminto')!.textContent = formatDate(
        seguimiento.fechaSeg,
        "dd/MM/yyyy",
        this.locale
        );
        if(ele.length>0)template!.querySelector('#P_nombre_aprueba')!.textContent = ele[0].nombre
        if(ele.length>0)template!.querySelector('#P_nombre_medico')!.textContent = ele[1].nombre

        if(ele.length>0)template!.querySelector('#P_cedula_aprueba')!.textContent = ele[0].cedula
        if(ele.length>0)template!.querySelector('#P_cedula_medico')!.textContent = ele[1].cedula
        setTimeout(() => {
            template!.querySelector('#P_nombreApellidos')!.textContent = (this.empleadoSelect?.primerNombre?this.empleadoSelect?.primerNombre:'')+" "+(this.empleadoSelect?.segundoNombre?this.empleadoSelect?.segundoNombre:'')+" "+(this.empleadoSelect?.primerApellido?this.empleadoSelect?.primerApellido:'')+" "+(this.empleadoSelect?.segundoApellido?this.empleadoSelect?.segundoApellido:'')
            template!.querySelector('#P_cedula')!.textContent = this.empleadoSelect?.numeroIdentificacion!
            template!.querySelector('#P_ubicacion')!.textContent = this.empleadoSelect?.area.nombre!
            template!.querySelector('#P_cargo')!.textContent = this.empleadoSelect?.cargo.nombre!

            template!.querySelector('#P_textseguimiento')!.textContent = seguimiento.seguimiento
            template!.querySelector('#P_usuariosesion')!.textContent = this.nombreSesion!
            

            var WinPrint = window.open('', '_blank'); 

            WinPrint?.document.write('<style>@page{size:letter;margin: 10mm 0mm 10mm 0mm; padding:0mm;}</style>');
            WinPrint?.document.write(template?.innerHTML!);
        
            WinPrint?.document.close();
            WinPrint?.focus();
            WinPrint?.print();
        }, 2000);
        

    }

    async nuevoSeguimiento() {
        try {
            let seg = { pkCase: this.caseSelect.id }
            let resp = await this.scmService.createSeguimiento(seg);
            this.seguimientos.push(resp)
            this.seguimientos.sort(function(a:any,b:any){
                if(a.id < b.id){
                  return 1
                }else if(a.id > b.id){
                  return -1;
                }
                  return 0;
                });
                if(this.seguimientos.length>0)this.idUltimoSeguimiento=this.seguimientos[0].id

        } catch (error) {
            console.error(error);
        }
    }

    async nuevoSeguimientoGenerico(){
        try {
            let seg = { pkCase: this.caseSelect.id }
            let resp = await this.scmService.createSeguimientogenerico(seg);

            this.seguimientosgenerico.push(resp)
        } catch (error) {
        }
    }

    async nuevoTratamiento() {
        try {
            let seg = { pkCase: this.caseSelect.id }
            let resp = await this.scmService.createTratamiento(seg);
            if (resp) {
                this.tratamientos.push(resp);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async fechaSeg() {
        if(this.sesionService.getPermisosMap()["SCM_GET_CASE_SEG"])this.seguimientos = await this.scmService.getSeguimientos(this.caseSelect.id);
        if(this.seguimientos.length>0)this.idUltimoSeguimiento=this.seguimientos[0].id
        this.seguimientos.map((seg, idx) => {
            if (seg.fechaSeg) {
                this.seguimientos[idx].fechaSeg = moment(seg.fechaSeg).toDate()
            }
            if (seg.proxfechaSeg) {
                this.seguimientos[idx].proxfechaSeg = moment(seg.proxfechaSeg).toDate()
            }
        });

        if(this.sesionService.getPermisosMap()["SCM_GET_CASE_SEG_GENERICO"])this.seguimientosgenerico = await this.scmService.getSeguimientosgenerico(this.caseSelect.id);
        this.seguimientosgenerico.map((seg, idx) => {
            if (seg.fechaSeg) {
                this.seguimientosgenerico[idx].fechaSeg = moment(seg.fechaSeg).toDate()
            }
        })
    }

    async fechaTrat() {
        if(this.sesionService.getPermisosMap()["SCM_GET_CASE_TRAT"])this.tratamientos = await this.scmService.getTratamientos(this.caseSelect.id);
        this.tratamientos.map((trat, idx) => {
            if (trat.fecha) {
                this.tratamientos[idx].fecha = moment(trat.fecha).toDate()
            }
        })
    }

    openModalRecomendantions() {
        this.recoSelect = false;
        this.modalRecomendatios = true;
    }

    openModalSeguimientos() {
        this.seguiSelect = false;
        this.modalSeguimientos = true;
    }

    openModalSeguimientosgenerico() {
        this.seguigenericoSelect = false;
        this.modalSeguimientosgenerico = true;
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

    cambiarEstado(event?: any) {
        this.msgs=[]
        if (event && event == 'cerrar') {
            if ((this.casoMedicoForm.controls["fechaFinal"].value != null && this.casoMedicoForm.controls["fechaFinal"].value != '')
                && (this.casoMedicoForm.controls["observaciones"].value != null && this.casoMedicoForm.controls["observaciones"].value != '')) {
                this.confirmationService.confirm({
                    header: 'Confirmar acción',
                    message: '¿Está seguro de cambiar el estado del caso?',
                    accept: () => {
                        this.scmService.edit(this.casoMedicoForm.value).then(() => {
                            this.scmService.changeEstadoById(this.caseSelect.id)
                                .then(res => {
                                    this.msgs=[]
                                    this.messageService.add({
                                    // this.msgs.push({
                                        key: 'formScm',
                                        severity: "success",
                                        summary: "Guardado",
                                        detail: `El estado del caso se ha actualizado exitosamente.`,
                                        life: 3000
                                    });
                                    setTimeout(() => {
                                        this.router.navigate(["/app/scm/list"]);
                                    }, 3000);
                                })
                                .catch(err => {
                                    this.msgs=[]
                                    // this.msgs.push({
                                    this.messageService.add({
                                        key: 'formScm',
                                        severity: "error",
                                        summary: "Error",
                                        detail: "Error al cambiar estado del caso.",
                                    });
                                });
                        });
                    }
                });
            } else {
                // this.msgs.push({
                this.messageService.add({
                    key: 'formScm',
                    severity: "error",
                    summary: "Error",
                    detail: "Debe completar la información: Fecha de cierre y Observaciones del cierre"
                });
            }
        } else {
            this.confirmationService.confirm({
                header: 'Confirmar acción',
                message: '¿Está seguro de cambiar el estado del caso?',
                accept: () => {
                    this.scmService.changeEstadoById(this.caseSelect.id)
                        .then(res => {
                            this.msgs=[]
                            this.messageService.add({
                            // this.msgs.push({
                                key: 'formScm',
                                severity: "success",
                                summary: "Guardado",
                                detail: `El estado del caso se ha actualizado exitosamente.`,
                                life: 3000
                            });
                            setTimeout(() => {
                                this.router.navigate(["/app/scm/list"]);
                            }, 3000);
                        })
                        .catch(err => {
                            this.msgs=[]
                            // this.msgs.push({
                            this.messageService.add({
                                key: 'formScm',
                                severity: "error",
                                summary: "Error",
                                detail: "Error al cambiar estado del caso.",
                            });
                        });
                }
            });
        }

    }

    permisoFechaCierre(): boolean {
        let tienePermiso = this.sesionService.getPermisosMap()['SCM_PUT_CAMBIAR_FECHAFIN'];
        if (tienePermiso != null && tienePermiso.valido == true) {
            return true;
        }
        return false;
    }
    test(eve:any){
        console.log(eve.index)
    }

    flagObligatorioSVE:boolean=false
    obligatoriedadSVE(){
        if(this.casoMedicoForm.value.requiereIntervencion)
        if(this.casoMedicoForm.value.requiereIntervencion==1){
            document.getElementById("SVE")!.style.display = 'block'
            this.flagObligatorioSVE=true
        }else{
            document.getElementById("SVE")!.style.display = 'none'
            this.casoMedicoForm.patchValue({sve:null})

            this.flagObligatorioSVE=false
        }
    }
}
interface empresaNit{
    label: string;
    empresa: string | null;
    nit: string | null;
   }
     
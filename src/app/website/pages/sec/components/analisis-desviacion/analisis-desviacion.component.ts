import { Causa_Raiz, FactorCausal, Incapacidad, listFactores, listPlanAccion } from 'src/app/website/pages/comun/entities/factor-causal';
import { InformacionComplementaria } from 'src/app/website/pages/comun/entities/informacion_complementaria';
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Reporte } from 'src/app/website/pages/comun/entities/reporte';

import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { ParametroNavegacionService } from "src/app/website/pages/core/services/parametro-navegacion.service";
import { AnalisisDesviacionService } from "src/app/website/pages/core/services/analisis-desviacion.service";
import { TareaService } from "src/app/website/pages/core/services/tarea.service";
import { TipoPeligroService } from "src/app/website/pages/core/services/tipo-peligro.service";
import { PeligroService } from "src/app/website/pages/core/services/peligro.service";

import { SistemaCausaInmediataService } from "src/app/website/pages/core/services/sistema-causa-inmediata.service";
import { SistemaCausaRaizService } from "src/app/website/pages/core/services/sistema-causa-raiz.service";
import { SistemaCausaRaiz } from "src/app/website/pages/comun/entities/sistema-causa-raiz";
import { CausaRaiz } from "src/app/website/pages/comun/entities/causa-raiz";
import { AnalisisDesviacion } from "src/app/website/pages/comun/entities/analisis-desviacion";

import { TipoPeligro } from "src/app/website/pages/comun/entities/tipo-peligro";
import { Peligro } from "src/app/website/pages/comun/entities/peligro";
import { Diagrama, InformeJson } from "src/app/website/pages/comun/entities/informeFinal"

import { Desviacion } from "src/app/website/pages/comun/entities/desviacion";
import { MessageService, TreeNode } from "primeng/api";
import { Message } from "primeng/api";
import { SistemaCausaInmediata } from "src/app/website/pages/comun/entities/sistema-causa-inmediata";
import { CausaInmediata } from "src/app/website/pages/comun/entities/causa-inmediata";
import { AnalisisCosto } from "src/app/website/pages/comun/entities/analisis-costo";
import { Documento } from "src/app/website/pages/ado/entities/documento";
import {
    SistemaCausaAdministrativa,
    CausaAdministrativa,
} from "src/app/website/pages/comun/entities/sistema-causa-administrativa";
import { SistemaCausaAdministrativaService } from "src/app/website/pages/core/services/sistema-causa-administrativa.service";
import { Tarea } from "src/app/website/pages/comun/entities/tarea";
import { FilterQuery } from "src/app/website/pages/core/entities/filter-query";
import { Criteria } from "src/app/website/pages/core/entities/filter";
import { AuthService } from "src/app/website/pages/core/services/auth.service";
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { SelectItem, ConfirmationService } from 'primeng/api'
import { MiembroEquipo } from 'src/app/website/pages/comun/entities/miembro-equipo';
import {
    locale_es,
    tipo_identificacion,
    tipo_vinculacion,
} from "src/app/website/pages/comun/entities/reporte-enumeraciones";
import { FlowChartComponent } from './flow-chart/flow-chart.component'
import {
    FileFormats, DiagramComponent, Diagram, PrintAndExport, IExportOptions, BasicShapeModel, NodeModel, UndoRedo, ConnectorModel, PointPortModel, Node, FlowShapeModel, MarginModel, PaletteModel,
    SymbolInfo, DiagramContextMenu, GridlinesModel, SnapSettingsModel, ShapeStyleModel, TextStyleModel, BpmnShape, HtmlModel, IDragEnterEventArgs, SnapConstraints
} from '@syncfusion/ej2-angular-diagrams';
import { FlowchartService } from 'src/app/website/pages/core/services/flowchart.service'
import { Usuario } from 'src/app/website/pages/empresa/entities/usuario'
import { EmpresaService } from 'src/app/website/pages/empresa/services/empresa.service'
import { PrimeNGConfig } from 'primeng/api';

Diagram.Inject(UndoRedo, DiagramContextMenu, PrintAndExport);
@Component({
    selector: 'app-analisis-desviacion',
    templateUrl: './analisis-desviacion.component.html',
    styleUrls: ['./analisis-desviacion.component.scss'],
    providers: [

        TipoPeligroService, PeligroService,
        SistemaCausaInmediataService,
        SistemaCausaAdministrativaService,
        FlowChartComponent,
        MessageService
    ],
})
export class AnalisisDesviacionComponent implements OnInit {
    @Input("miembros") documento?: Documento;
    // @Input() severidad: string;
    @Input("collapsed") collapsed?: boolean;
    @Input("value") value?: AnalisisDesviacion;

    diagram?: DiagramComponent;

    // ImgDF:string;
    formtp?: FormGroup;
    formp?: FormGroup;
    analisisPeligros: FormGroup;
    tareasList?: Tarea[] | null;
    // tareasList2: Tarea[];
    flowChart: any;
    flowChartSave?: string;
    form2?: Peligro;
    guardando: boolean = true;
    listaEvidence?: any
    listPlanAccion: listPlanAccion[] = []
    listPlanAccion2: listPlanAccion[] = []
    causaAdminList: TreeNode[] = [];
    causaAdminListSelect: TreeNode[] = [];
    causaAdminAnalisisList?: CausaAdministrativa[];

    incapacidadesList?: Incapacidad[];

    causaRaizList: TreeNode[] = [];
    causaRaizListSelect: TreeNode[] = [];
    causaRaizAnalisisList?: CausaRaiz[];

    causaInmediataList: TreeNode[] = [];
    causaInmediataListSelect: TreeNode[] = [];
    causaInmediataAnalisisList?: CausaInmediata[];
    reporteSelect?: Reporte[];

    desviacionesList?: Desviacion[] | null;
    severidad?: string;
    severidadFlag?: boolean;
    analisisCosto: AnalisisCosto = new AnalisisCosto();
    participantes?: any[];
    documentos?: Documento[] | null;
    observacion?: string | null;
    jerarquia?: string | null;
    informacion_complementaria?: string;
    analisisId?: string | null;
    Peligro1?: string;
    tPeligro1?: string;
    msgs: Message[] = [];
    consultar: boolean = false;
    modificar: boolean = false;
    adicionar: boolean = false;
    visibleLnkResetPasswd = true;
    idEmpresa?: string | null;
    idUsuario?: string;
    datasFC?: string
    date1?: Date;
    date2?: Date;
    flag?: Boolean
    display: boolean = false;
    nitEmpresa?: string | null;
    nombreEmpresa?: string;

    empresaName?: string;
    empresaNit?: string;
    empresaDescipcion?: string;
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;

    dataListFactor: listFactores[] = [];

    dataFlow?: AnalisisDesviacion;
    tarea?: Tarea
    factorCusal: FactorCausal[] = []
    informacionComplementaria?: InformacionComplementaria;
    informeJson?: InformeJson;
    diagrama?: Diagrama;
    Evidencias?: string | any[];
    img = new Image();
    img2 = new Image();
    imgString?: string;
    contFotografia: number = 0;
    contDocumental: number = 0;
    contPoliticas: number = 0;
    contProcedimientos: number = 0;
    contMultimedias: number = 0;
    disabled: boolean = true;
    tabIndex?: number;
    imgCompress?: string;

    flagModificar: boolean = false;

    usuario?: Usuario;

    tipoPeligroItemList?: SelectItem[];
    peligroItemList?: SelectItem[];
    InformeJson?: InformeJson[];
    displayInforme: boolean = false;
    fields: string[] = [
        'id',
        'nombre',
        'fk_tipo_peligro'
    ];
    ARLfirme = [
        { label: "--Seleccione--", value: null },
        { label: "Objetado", value: "Objetado" },
        { label: "En firme", value: "En firme" },
    ]
    Peligro = [
        { label: "--Seleccione--", value: null },
    ]
    miembros: MiembroEquipo[] = []
    selectedProducts?: any;
    imgIN?: string;
    infoIn: FormGroup;

    tabIndex0?: number;
    cont: number = 0;
    a?: string;
    buttonPrint: boolean = false;
    tempData: listFactores[] = [];
    validators: boolean = true;

    esAliado: boolean = false;

    constructor(
        private sistCausAdminService: SistemaCausaAdministrativaService,
        private analisisDesviacionService: AnalisisDesviacionService,
        private tareaService: TareaService,
        private tipoPeligroService: TipoPeligroService,
        private peligroService: PeligroService,
        private sistemaCausaInmdService: SistemaCausaInmediataService,
        private sistemaCausaRaizService: SistemaCausaRaizService,
        private paramNav: ParametroNavegacionService,
        private authService: AuthService,
        private sesionService: SesionService,
        private comp: FlowChartComponent,
        private FlowchartService: FlowchartService,
        private empresaService: EmpresaService,
        private config: PrimeNGConfig,
        fb: FormBuilder,
    ) {
        this.analisisPeligros = fb.group({
            Peligro: [null, /*Validators.required*/],
            DescripcionPeligro: [null, /*Validators.required*/],
            EnventoARL: [null, /*Validators.required*/],
            ReporteControl: [null, /*Validators.required*/],
            FechaControl: [null, /*Validators.required*/],
            CopiaTrabajador: [null, /*Validators.required*/],
            FechaCopia: [null, /*Validators.required*/],
        });
        this.infoIn = fb.group({
            AnexoF: [null, /*Validators.required*/],
            AnexoO: [null, /*Validators.required*/],
            RepresentanteLegal: [null, /*Validators.required*/],
            RepresentanteInvestigacion: [null, /*Validators.required*/],
            CcLegal: [null, /*Validators.required*/],
            CcInvestigacion: [null, /*Validators.required*/],
            Cargo: [null, /*Validators.required*/],
            Licencia: [null, /*Validators.required*/],
            Expedida: [null, /*Validators.required*/],
            FechaEnvio: [null, /*Validators.required*/],
            FechaI: [null, /*Validators.required*/],
            Diagrama: [null, /*Validators.required*/],
        });
    }

    async ngOnInit() {
        this.config.setTranslation(this.localeES);
        this.guardando = false;
        this.disabled = true;
        this.nitEmpresa = this.sesionService.getEmpresa()!.nit;
        this.nombreEmpresa = this.sesionService.getEmpresa()!.nombreComercial;
        this.idEmpresa = this.sesionService.getEmpresa()!.id;
        this.esAliado = this.sesionService.getEmpresa()?.idEmpresaAliada ? true : false;
        // console.log(localStorage.getItem('Accion'))
        if (this.value == null) {
            // switch (this.paramNav.getAccion<string>()) {
            switch (localStorage.getItem('Accion')) {
                case "GET":
                    this.consultar = true;
                    this.paramNav.setParametro<Desviacion>(JSON.parse(localStorage.getItem('Desviacion')!));
                    await this.consultarAnalisis(
                        // JSON.parse(localStorage.getItem('Desviacion')!).analisisId
                        this.paramNav.getParametro<Desviacion>().analisisId!
                    );
                    break;
                case "POST":
                    this.sistCausAdminService
                        .findDefault()
                        .then(
                            // (resp: SistemaCausaAdministrativa) => {
                            (resp: any) => {
                                this.causaAdminList = this.buildTreeNode(
                                    resp?.causaAdminList,
                                    null,
                                    "causaAdminList"
                                );
                            });
                    this.sistemaCausaInmdService
                        .findDefault()
                        // .then((data: SistemaCausaInmediata) => {
                        .then((data: any) => {
                            this.causaInmediataList = this.buildTreeNode(
                                data.causaInmediataList,
                                null,
                                "causaInmediataList"
                            );
                        });
                    this.sistemaCausaRaizService
                        .findDefault()
                        .then(async (data: any) => {
                            // .then(async (data: SistemaCausaRaiz) => {
                            this.causaRaizList = this.buildTreeNode(
                                data.causaRaizList,
                                null,
                                "causaRaizList"
                            );
                            this.paramNav.setParametro<Desviacion>(JSON.parse(localStorage.getItem('Desviacion')!));
                            this.desviacionesList =
                                await this.paramNav.getParametro<Desviacion[]>();
                                // console.log(this.desviacionesList);
                            // await JSON.parse(localStorage.getItem('Desviacion')!)
                            this.adicionar = true;
                        });
                    break;
                case "PUT":
                    this.modificar = true;
                    this.paramNav.setParametro<Desviacion>(JSON.parse(localStorage.getItem('Desviacion')!));
                    await this.consultarAnalisis(
                        this.paramNav.getParametro<Desviacion>().analisisId!
                        // JSON.parse(localStorage.getItem('Desviacion')!).analisisId

                    );

                    break;
            }
        } else {
            this.consultar = true;
            await this.consultarAnalisis(this.value.id!);
        }
        this.cargarTiposPeligro();
        this.diagram = this.FlowchartService.getDiagram();
        this.tarea = {
            id: '',
            nombre: 'hola',
            descripcion: '',
            tipoAccion: '',
            jerarquia: '',
            estado: '',
            fechaProyectada: undefined,
            fechaRealizacion: undefined,
            fechaVerificacion: undefined,
            areaResponsable: null,
            empResponsable: null,
            observacionesRealizacion: '',
            observacionesVerificacion: '',
            usuarioRealiza: null,
            usuarioVerifica: null,
            analisisDesviacionList: [],
            modulo: '',
            codigo: '',
            envioCorreo: false
        }
        setTimeout(() => {
            if (this.desviacionesList)
                this.severidad = this.desviacionesList[0].severidad;
            this.severidadFlag = (this.severidad == 'Grave' || this.severidad == 'Mortal') ? true : false;
            this.disabled = false;
        }, 3000);
        this.usuario = await this.sesionService.getUsuario()!;
        this.idUsuario = this.usuario?.id!
        console.log(this.desviacionesList);
        setTimeout(() => {
            localStorage.removeItem('Desviacion')
            localStorage.removeItem('Accion')
        }, 5000);
    }

    async consultarAnalisis(analisisId: string) {
        setTimeout(() => {}, 5000);
        let fq = new FilterQuery();
        fq.filterList = [
            { criteria: Criteria.EQUALS, field: "id", value1: analisisId },
        ];
        await this.analisisDesviacionService.find(analisisId).then(async (resp: any) => {
            console.log(resp['data']);
            let analisis = <AnalisisDesviacion>resp;
            this.Evidencias = resp.documentosList;
            this.dataFlow = resp;
            this.flowChart = resp.flow_chart;
            this.flowChartSave = resp.flow_chart;
            this.factorCusal = JSON.parse(resp.factor_causal);
            this.informacionComplementaria = JSON.parse(resp.complementaria);
            if (JSON.parse(resp.plan_accion) != null) {
                this.listPlanAccion = await JSON.parse(resp.plan_accion);
                this.habilitarInforme();
            }

            if (JSON.parse(resp.miembros_equipo) != null) {
                this.miembros = JSON.parse(resp.miembros_equipo);
            }
            this.informeJson = JSON.parse(resp.informe);
            this.habilitarInforme()
            if (this.informacionComplementaria != null) {
                this.analisisPeligros.patchValue({
                    'Peligro': this.informacionComplementaria.Peligro,
                    'DescripcionPeligro': this.informacionComplementaria.DescripcionPeligro,
                    'EnventoARL': this.informacionComplementaria.EnventoARL,
                    'ReporteControl': this.informacionComplementaria.ReporteControl,
                    'FechaControl': this.informacionComplementaria.FechaControl == null ? null : new Date(this.informacionComplementaria.FechaControl),
                    'CopiaTrabajador': this.informacionComplementaria.CopiaTrabajador,
                    'FechaCopia': this.informacionComplementaria.FechaCopia == null ? null : new Date(this.informacionComplementaria.FechaCopia)
                });
                this.cargarPeligro(this.analisisPeligros.value['Peligro'])
            }
            if (this.informeJson != null) {
                this.infoIn.patchValue({
                    'AnexoF': this.informeJson.AnexoF,
                    'AnexoO': this.informeJson.AnexoO,
                    'RepresentanteLegal': this.informeJson.RepresentanteLegal,
                    'RepresentanteInvestigacion': this.informeJson.RepresentanteInvestigacion,
                    'CcLegal': this.informeJson.CcLegal,
                    'CcInvestigacion': this.informeJson.CcInvestigacion,
                    'Cargo': this.informeJson.Cargo,
                    'Licencia': this.informeJson.Licencia,
                    'Expedida': this.informeJson.Expedida == null ? null : new Date(this.informeJson.Expedida),
                    'FechaEnvio': this.informeJson.FechaEnvio == null ? null : new Date(this.informeJson.FechaEnvio),
                    'FechaI': this.informeJson.FechaI == null ? null : new Date(this.informeJson.FechaI),
                    'Diagrama': this.informeJson.Diagrama,
                });
                this.guardando = false;
            }
            this.setListDataFactor();

            this.incapacidadesList = JSON.parse(resp.incapacidades)
            this.desviacionesList = analisis.desviacionesList;
            if (this.desviacionesList)
                this.severidad = this.desviacionesList[0].severidad;
            this.severidadFlag = (this.severidad == 'Grave' || this.severidad == 'Mortal') ? true : false;
            this.observacion = analisis.observacion;
            this.analisisId = analisis.id;
            this.analisisCosto =
                analisis.analisisCosto == null
                    ? new AnalisisCosto()
                    : analisis.analisisCosto;
            this.causaRaizAnalisisList = analisis?.causaRaizList!;
            this.causaAdminAnalisisList = analisis?.causasAdminList!;
            this.participantes = JSON.parse(analisis.participantes!);
            this.documentos = analisis.documentosList;
            this.causaInmediataAnalisisList = analisis.causaInmediataList!;
            this.tareasList = analisis.tareaDesviacionList;
            this.jerarquia = analisis.jerarquia;
            this.sistCausAdminService
                .findDefault()
                .then(
                    // (resp: SistemaCausaAdministrativa) =>
                    (resp: any) =>
                    (this.causaAdminList = this.buildTreeNode(
                        resp.causaAdminList,
                        null,
                        "causaAdminList",
                        this.causaAdminAnalisisList,
                        this.causaAdminListSelect
                    ))
                );
            this.sistemaCausaRaizService
                .findDefault()
                .then(
                    // (scr: SistemaCausaRaiz) =>
                    (scr: any) =>
                    (this.causaRaizList = this.buildTreeNode(
                        scr.causaRaizList,
                        null,
                        "causaRaizList",
                        this.causaRaizAnalisisList,
                        this.causaRaizListSelect
                    ))
                );
            this.sistemaCausaInmdService
                .findDefault()
                .then(
                    // (scr: SistemaCausaInmediata) =>
                    (scr: any) =>
                    (this.causaInmediataList = this.buildTreeNode(
                        scr.causaInmediataList,
                        null,
                        "causaInmediataList",
                        this.causaInmediataAnalisisList,
                        this.causaInmediataListSelect
                    ))
                );
            this.habilitarInforme()
        });
        this.tareaList3()
        this.disabled = false;

    }
    buildTreeNode(
        list: any[],
        parentNode: any,
        listField: string,
        causasList?: any[],
        causasSelectList?: any[]
    ): any {
        let treeNodeList: TreeNode[] = [];
        list?.forEach((ci) => {
            let node: any = {
                id: ci.id,
                label: ci.nombre,
                selectable: !this.consultar,
                parent: parentNode,
            };
            if (ci[listField] == null || ci[listField].length == 0) {
                node.children = null;
            } else {
                node.children = this.buildTreeNode(
                    ci[listField],
                    node,
                    listField,
                    causasList,
                    causasSelectList
                );
            }
            if (causasList != null) {
                this.adicionarSelect(node, causasList, causasSelectList!);
            }
            treeNodeList.push(node);
        });
        return treeNodeList;
    }
    cargarTiposPeligro() {
        this.tipoPeligroService.findAll().then(
            (resp: any) => {
                this.tipoPeligroItemList = [{ label: '--Seleccione--', value: null }];
                (<TipoPeligro[]>resp['data']).forEach(
                    data => this.tipoPeligroItemList?.push({ label: data.nombre, value: data })
                )
            }
        );
    }
    habilitarInforme() {
        let validador = true
        if (this.listPlanAccion.length > 0) {
            this.listPlanAccion.forEach((element: any) => {

                let nombre: string[] = [];
                let causas: string[] = [];
                let preguntas: string[] = [];
                let id: number;

                element.causaRaiz.forEach((causa: any) => {

                    if (causa.revisado.isComplete) {

                        nombre = causa.nombreFC2.split('**')
                        causas = causa.causaRaiz.split('**')
                        preguntas = causa.preguntas.split('**')

                        for (let index = 0; index < nombre.length; index++) {

                            let dataFactor: any = []
                            dataFactor = this.dataListFactor.find(ele => {
                                return ele.nombre == nombre[index] && ele.metodologia == causas[index] && ele.pregunta == preguntas[index]
                            })
                            if (dataFactor) {
                                dataFactor.accion = 'Con Plan de Accion'
                            }
                        }
                    }
                    else {
                        validador = false
                    }
                });

            });
        } else {
            validador = false
        }

        if (this.dataListFactor) {
            this.dataListFactor.forEach(element => {
                if (element.accion == "Sin Plan de Accion") {
                    validador = false
                }
            });
        }

        this.displayInforme = validador;
    }
    cargarPeligro(idtp: any) {
        if (idtp != null) {
            let filter = new FilterQuery();
            filter.filterList = [{ field: 'tipoPeligro.id', criteria: Criteria.EQUALS, value1: idtp['id'] }];
            this.peligroService.findByFilter(filter).then(
                resp => {
                    this.peligroItemList = [{ label: '--Seleccione--', value: [null, null] }];
                    (<Peligro[]>resp).forEach(
                        data => {
                            this.peligroItemList?.push({ label: data.nombre, value: { id: data.id, nombre: data.nombre } })
                        }
                    )
                }
            );
        } else {
            this.peligroItemList = [{ label: '--Seleccione Peligro--', value: [null, null] }];
        }
    }
    setListDataFactor() {
        this.tempData = []
        this.dataListFactor = []
        try {
            this.tempData = []
            this.factorCusal.forEach((data: any) => {
                data.seccion.forEach((data1: any) => {
                    data1.desempeno.forEach((data2: any) => {
                        if (data2.selected) {
                            data2.areas.forEach((data3: any) => {
                                data3.subProd.forEach((data4: any) => {
                                    data4.causa.forEach((element: any) => {

                                        if (element.esCausa) {
                                            if (!this.dataListFactor.find(ele => {
                                                return ele.pregunta == data2.pregunta && ele.metodologia == element.ProcedimientoFC && ele.nombre == data.nombre
                                            })) {
                                                this.tempData.push({ nombre: data.nombre, pregunta: data2.pregunta, metodologia: element.ProcedimientoFC, accion: 'Sin Plan de Accion' })
                                            } else {
                                                this.dataListFactor.forEach(ele => {
                                                    if (ele.pregunta == data2.pregunta && ele.metodologia == element.ProcedimientoFC && ele.nombre == data.nombre) {
                                                        this.tempData.push(ele)
                                                    }
                                                })
                                            }
                                        }
                                    });
                                });
                            });
                        }
                    });
                });
                data.causa_Raiz.forEach((data1: any) => {
                    this.selectCausaRaiz(data.nombre, data1.label, data1)
                });

            });
            this.dataListFactor = this.tempData;
        } catch (error) {

        }
        this.habilitarInforme()
        // }, 1);

    }
    async tareaList3() {
        this.disabled = true;
        this.listPlanAccion.forEach((element: any) => {
            element.causaRaiz.forEach(async (element2: any) => {
                let x;
                let y;
                let z;
                if (this.tareasList!.length > 0) {
                    x = await this.tareasList?.find((data: any) => {
                        return ((data.nombre == element2.especifico.nombreAccionCorrectiva) && new Date(data.fechaProyectada).toDateString() == new Date(element2.especifico.fechaVencimiento).toDateString() && (data.descripcion == element2.especifico.accionCorrectiva) && (data.empResponsable.primerNombre == element2.especifico.responsableEmpresa.primerNombre) && (data.empResponsable.id == element2.especifico.responsableEmpresa.id));
                    })
                    if (x != undefined) {
                        element2.especifico.id = x.id;
                    }
                    y = await this.tareasList?.find((data: any) => {
                        return (data.nombre == element2.medible.planVerificacion && new Date(data.fechaProyectada).toDateString() == new Date(element2.medible.fechaVencimiento).toDateString() && (data.empResponsable.primerNombre == element2.medible.responsableEmpresa.primerNombre) && (data.empResponsable.id == element2.medible.responsableEmpresa.id));
                    })
                    if (y != undefined) {
                        element2.medible.id = y.id;
                    }
                    z = await this.tareasList?.find((data: any) => {
                        return (data.nombre == element2.eficaz.planValidacion && new Date(data.fechaProyectada).toDateString() == new Date(element2.eficaz.fechaVencimiento).toDateString() && (data.empResponsable.primerNombre == element2.eficaz.responsableEmpresa.primerNombre) && (data.empResponsable.id == element2.eficaz.responsableEmpresa.id));
                    })
                    if (z != undefined) {
                        element2.eficaz.id = z.id;
                    }
                }
            });
        });
        this.disabled = false;
    }
    adicionarSelect(node: any, list: any[], listselec: any[]) {
        if (list == null) {
            return;
        }
        for (let i = 0; i < list.length; i++) {
            let itemAnalisis = list[i];
            if (itemAnalisis.id === node.id) {
                this.expandParent(node);
                listselec.push(node);
                return;
            }
        }
    }
    selectCausaRaiz(nombre: any, pregunta: any, datos: any) {

        if (datos.data.name == 'Si') {
            if (!this.dataListFactor.find(ele => { return ele.pregunta == pregunta && ele.metodologia == datos.label })) {
                this.tempData.push({ nombre: nombre, pregunta: pregunta, metodologia: datos.label, accion: 'Sin Plan de Accion' })
            } else {
                this.dataListFactor.forEach(ele => {
                    if (ele.pregunta == pregunta && ele.metodologia == datos.label) {
                        this.tempData.push(ele)
                    }
                })
            }
        } else if (datos.children) {
            datos.children.forEach((element: any) => {
                this.selectCausaRaiz(nombre, pregunta, element)
            });
        }
    }
    expandParent(node: any) {
        if (node.parent != null) {
            this.expandParent(node.parent);
        }
        node.expanded = true;
    }

    removeDesv(desviacion: Desviacion) {
        if (this.desviacionesList?.length == 1) {
            this.msgs = [];
            this.msgs.push({
                severity: "warn",
                detail: "El análisis realizado debe contener al menos una desviación",
            });
            return;
        }
        let auxList = this.desviacionesList;
        this.desviacionesList = [];

        if (auxList)
            for (let i = 0; i < auxList.length; i++) {
                if (auxList[i].hashId != desviacion.hashId) {
                    this.desviacionesList.push(auxList[i]);
                }
            }
    }
    indexTab(event: any) {
        this.tabIndex0 = event.index;
    }
    SelectPeligro(a: string) {
        this.cargarPeligro(a)
    }
    confirmarActualizacion(event: Documento) {

        // this.Evidencias= this.Evidencias.filter(val => val.id !== event.id);
        this.msgs = [];
        this.msgs.push({
            severity: "success",
            summary: "Descripción actualizada",
            detail: "Se ha actualizado la descripción del documento",
        });
    }
    getListIncapacidades(event: any) {
        this.incapacidadesList = event;
    }
    guardadModificar(event: any) {
        this.disabled = event;
    }
    setFactorCausal(event: FactorCausal[]) {

        if (!this.factorCusal) {
            this.factorCusal = [];

        }
        event.forEach(element => {
            let x = this.factorCusal.find((x) => x.id == element.id)

            if (x != undefined) {
                if (element.id === x.id) {
                    x.nombre = element.nombre;
                }
            } else {
                this.factorCusal.push(element);
            }

        });
        this.setListDataFactor();

    }
    dataDiagram(event: any) {
        this.flowChartSave = event;

    }
    getValidator(event: any) {
        this.validators = event;
    }
    async changeTab() {
        this.cont = 0;
        await this.dataListFactor.forEach(factor => {
            this.cont = (factor.accion == 'Sin Plan de Accion') ? this.cont = this.cont + 1 : this.cont;
        })
        if (this.cont > 0) {
            this.msgs = [];
            if (this.cont == 1) {
                this.msgs.push({
                    severity: "warn",
                    detail: "Queda (" + this.cont + ") listado de causa sin plan de acción",
                });
            } else {
                this.msgs.push({
                    severity: "warn",
                    detail: "Quedan (" + this.cont + ") listados de causa sin plan de acción",
                });
            }
        }

        setTimeout(() => {
            this.tabIndex = this.tabIndex0! + 1;
        }, 500);
    }
    eliminarPlandeAccion(event: any) {
        let eliminar = event;

        if (this.listPlanAccion[eliminar[1]]?.causaRaiz?.length == 0) {
            this.listPlanAccion = this.listPlanAccion.filter((item) => item !== eliminar[0]);
        }
        this.setListDataFactor();
    }

    async imprimir() {
        this.buttonPrint = true;
        setTimeout(async () => {
            this.nitEmpresa = this.sesionService.getEmpresa()?.nit;
            this.nombreEmpresa = this.sesionService.getEmpresa()?.nombreComercial;
            this.idEmpresa = this.sesionService.getEmpresa()?.id;

            await this.evidencias();

            this.img.src = await (this.infoIn.value['Diagrama'] == undefined) ? 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAfSURBVDhPY/wPBAwkACYoTTQY1UAMGNVADKC1BgYGAF6OBBwFRhtVAAAAAElFTkSuQmCC' : this.infoIn.value['Diagrama'];

            setTimeout(async () => {
                let porcentaje = 75;
                let pixelX = await Math.ceil(this.img.width * Math.sqrt(porcentaje / 100));
                let pixelY = await Math.ceil(this.img.height * Math.sqrt(porcentaje / 100));
                await this.compressImage(this.img.src, pixelX, pixelY).then((compressed: any) => {
                    this.img.src = compressed.toString();
                })

                let print = document.getElementById('print');
                let template = document.getElementById('plantilla');
                template?.querySelector('#P_empresa_logo')?.setAttribute('src', this.sesionService.getEmpresa()?.logo!);
                setTimeout(() => {
                    var WinPrint = window.open('', '_blank');

                    WinPrint?.document.write('<style id="print">@page{size:auto;margin: 10mm 0mm 10mm 0mm; padding:0mm;size: landscape}</style>');
                    WinPrint?.document.write(template?.innerHTML!);


                    let tamy = 600;
                    let h = (Math.ceil(this.img.height / tamy) == 0) ? 1 : Math.ceil(this.img.height / tamy);
                    let tamx = 1000;
                    let w = (Math.ceil(this.img.width / tamx) == 0) ? 1 : Math.ceil(this.img.width / tamx);


                    // let img = this.infoIn.value['Diagrama']

                    for (let i = 0; i < h; i++) {
                        for (let j = 0; j < w; j++) {
                            WinPrint?.document.write('<div style="size: auto;  margin: 0mm; padding:0mm" align="center"><h2>Imagen:', (i + 1).toString(), '-', (j + 1).toString(), '</h2><img height="150%" width="100%" style="display:block; border-collapse: collapse; object-fit: none; object-position: ', (j * (-tamx)).toString(), 'px ', (i * (-tamy)).toString(), 'px;"  src=', this.img.src, '></div>');
                            WinPrint?.document.write('<p style="page-break-after: always"></p>');
                        }
                    }
                    WinPrint?.document.close();
                    WinPrint?.focus();
                    WinPrint?.print();
                    this.buttonPrint = false;
                }, 500);
            }, 2000);
        }, 500);
    }
    async evidencias() {
        let fq = new FilterQuery();
        fq.filterList = [
            { criteria: Criteria.EQUALS, field: "id", value1: this.paramNav.getParametro<Desviacion>().analisisId },
            // { criteria: Criteria.EQUALS, field: "id", value1: JSON.parse(localStorage.getItem('Desviacion')!).analisisId },
        ];
        await this.analisisDesviacionService.findByFilter(fq).then((resp: any) => {
            let analisis = <AnalisisDesviacion>resp["data"][0];
            this.Evidencias = resp['data'][0].documentosList;
        });
        setTimeout(() => {
            this.contFotografia = 0;
            this.contDocumental = 0;
            this.contPoliticas = 0;
            this.contProcedimientos = 0;
            this.contMultimedias = 0;

            if (this.Evidencias)
                for (let i = 0; i < this.Evidencias?.length!; i++) {
                    let value = this.Evidencias[i].proceso;
                    switch (value) {
                        case 'fotografica':
                            this.contFotografia++;
                            break;
                        case 'documental':
                            this.contDocumental++;
                            break;
                        case 'politica':
                            this.contPoliticas++;
                            break;
                        case 'procedimientos':
                            this.contProcedimientos++;
                            break;
                        case 'multimedia':
                            this.contMultimedias++;
                            break;
                        default:
                            break;
                    }
                }
        }, 300);
    }
    compressImage(src: any, newX: any, newY: any) {
        return new Promise((res, rej) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                const elem = document.createElement('canvas');
                elem.width = newX;
                elem.height = newY;
                const ctx = elem.getContext('2d');
                ctx?.drawImage(img, 0, 0, newX, newY);
                const data = ctx?.canvas.toDataURL();
                res(data);
            }
            img.onerror = error => rej(error);
        })
    }
    removeParti(index: number) {
        this.participantes?.splice(index, 1);
    }
    adicionarParticipante() {
        if (this.participantes == null) this.participantes = [];
        this.participantes.push({});
    }

    onEvent(event: any) {
        console.log(event);
        this.tareasList = event.data;
    }
    
    guardarAnalisis() {
        this.guardando = true;

        if (this.validarData()) {
            this.informacionComplementaria = this.analisisPeligros.value;
            this.informeJson = this.infoIn.value;
            this.diagram = this.FlowchartService.getDiagram();
            let printOptions: IExportOptions = {};
            printOptions.mode = 'Data';
            printOptions.region = 'PageSettings';
            if (this.diagram) {
                this.imgIN = this.diagram.exportDiagram(printOptions).toString();
                if (this.imgIN != undefined) {
                    if (this.informeJson)
                        this.informeJson.Diagrama = this.imgIN;
                }
            }
            let ad = new AnalisisDesviacion();
            ad.causaRaizList = this.buildList(this.causaRaizListSelect);
            ad.causaInmediataList = this.buildList(this.causaInmediataListSelect);
            ad.causasAdminList = this.buildList(this.causaAdminListSelect);
            ad.desviacionesList = this.desviacionesList ?? null;
            ad.analisisCosto = this.analisisCosto;
            ad.observacion = this.observacion ?? null;
            ad.participantes = JSON.stringify(this.participantes);
            ad.flow_chart = this.flowChartSave ?? null;
            ad.factor_causal = JSON.stringify(this.factorCusal);
            this.setListDataFactor();
            ad.incapacidades = JSON.stringify(this.incapacidadesList);
            ad.plan_accion = JSON.stringify(this.listPlanAccion);
            ad.miembros_equipo = JSON.stringify(this.miembros);
            ad.tareaDesviacionList = this.tareasList ?? null;
            if (ad.tareaDesviacionList && this.desviacionesList) {
                for (let i = 0; i < ad.tareaDesviacionList.length; i++) {
                    ad.tareaDesviacionList[i].modulo = this.desviacionesList[0].modulo;
                    ad.tareaDesviacionList[i].codigo = this.desviacionesList[0].hashId;
                }
            }

            ad.jerarquia = ad.jerarquia;
            ad.complementaria = JSON.stringify(this.informacionComplementaria);
            ad.informe = JSON.stringify(this.informeJson);
            if(!this.esAliado) {
                this.analisisDesviacionService.create(ad).then((data) => {
                    let analisisDesviacion = <AnalisisDesviacion>data;
                    this.manageResponse(analisisDesviacion);
                    //this.idUsuario=analisisDesviacion
                    this.analisisId = analisisDesviacion.id;
                    this.documentos = [];
                    this.modificar = true;
                    this.adicionar = false;
                }).finally(() => {
                    this.guardando = false;
                });
            } else {
                this.analisisDesviacionService.createAnalisisAliado(ad).then((data) => {
                    let analisisDesviacion = <AnalisisDesviacion>data;
                    this.manageResponse(analisisDesviacion);
                    this.analisisId = analisisDesviacion.id;
                    this.documentos = [];
                    this.modificar = true;
                    this.adicionar = false;
                }).finally(() => {
                    this.guardando = false;
                });
            }
        } else {
            this.guardando = false
            this.msgs = [];
            //   this.msgs.push({
            //       severity: "error",
            //       detail: "Si el accidente es grave o mortal, se debe enviar reporte a  entes de control o si selecciona el campo sí se debe diligenciar la fecha de envío a entes de control.",
            //   });

            this.msgs.push({
                severity: "error",
                detail: "Debe diligenciar información complementaria para guardar.",
            });
        }
        window.scrollTo(0, 0);
    }

    async modificarAnalisis() {
        this.guardando = true;
        this.disabled = true;
        // this.flagModificar=true;

        if (this.validarData()) {
            if (this.idEmpresa == '22'&& this.desviacionesList && this.desviacionesList[0].modulo !== 'Inspecciones CC') { await this.tareaList2(); }
            this.buttonPrint = true;
            this.informacionComplementaria = this.analisisPeligros.value;
            this.informeJson = this.infoIn.value;
            // this.informeJson.Diagrama=this.imgIN;
            setTimeout(async () => {
                // console.log(this.tareasList);
                
                this.diagram = await this.FlowchartService.getDiagram();
                console.log(this.diagram)
                let printOptions: IExportOptions = {};
                printOptions.mode = 'Data';
                printOptions.region = 'PageSettings';
                if (this.diagram) {
                    console.log(this.diagram.exportDiagram(printOptions).toString())
                    this.imgIN = this.diagram.exportDiagram(printOptions).toString()
                    
                    if (this.imgIN != undefined && this.informeJson) {
                        this.informeJson.Diagrama = this.imgIN;
                    }
                }
                let ad = new AnalisisDesviacion();
                ad.id = this.analisisId ?? null;
                ad.causaRaizList = this.buildList(this.causaRaizListSelect);
                ad.causaInmediataList = this.buildList(this.causaInmediataListSelect);
                ad.causasAdminList = this.buildList(this.causaAdminListSelect);
                ad.desviacionesList = this.desviacionesList ?? null;
                ad.analisisCosto = this.analisisCosto;
                ad.observacion = this.observacion ?? null;
                ad.factor_causal = JSON.stringify(this.factorCusal);
                ad.incapacidades = JSON.stringify(this.incapacidadesList);
                ad.plan_accion = JSON.stringify(this.listPlanAccion);
                this.setListDataFactor();
                // ad.flow_chart = JSON.stringify(this.flowChartSave);
                ad.flow_chart = this.flowChartSave ?? null;
                ad.participantes = JSON.stringify(this.participantes);
                ad.tareaDesviacionList = this.tareasList ? Array.from(this.tareasList) : null;

                ad.jerarquia = this.jerarquia ?? null;
                ad.complementaria = JSON.stringify(this.informacionComplementaria);
                ad.informe = JSON.stringify(this.informeJson);

                ad.miembros_equipo = JSON.stringify(this.miembros);
                if (ad.tareaDesviacionList && this.desviacionesList) {
                    for (let i = 0; i < ad.tareaDesviacionList.length; i++) {
                        ad.tareaDesviacionList[i].modulo = this.desviacionesList[0].modulo;
                        ad.tareaDesviacionList[i].codigo = this.desviacionesList[0].hashId;
                    }

                }

                if(!this.esAliado){
                    this.analisisDesviacionService.update(ad).then((data) => {
                        this.manageResponse(<AnalisisDesviacion>data);
                        this.modificar = true;
                        this.adicionar = false;
                        this.disabled = false;
                    }).then(async () => {
                        this.buttonPrint = false;
                        let fq = new FilterQuery();
                        fq.filterList = [
                            { criteria: Criteria.EQUALS, field: "id", value1: this.analisisId },
                        ];
                        await this.analisisDesviacionService.findByFilter(fq).then((resp: any) => {
                            let analisis = <AnalisisDesviacion>resp["data"][0];
                            this.tareasList = analisis.tareaDesviacionList;
                        })
                        this.tareaList3();
                    }).finally(() => {
                        this.guardando = false;
                    });
                } else {
                    this.analisisDesviacionService.updateAnalisisAliado(ad).then((data) => {
                        this.manageResponse(<AnalisisDesviacion>data);
                        this.modificar = true;
                        this.adicionar = false;
                        this.disabled = false;
                    }).then(async () => {
                        this.buttonPrint = false;
                        let fq = new FilterQuery();
                        fq.filterList = [
                            { criteria: Criteria.EQUALS, field: "id", value1: this.analisisId },
                        ];
                        await this.analisisDesviacionService.findByFilter(fq).then((resp: any) => {
                            let analisis = <AnalisisDesviacion>resp["data"][0];
                            this.tareasList = analisis.tareaDesviacionList;
                        })
                        this.tareaList3();
                    }).finally(() => {
                        this.guardando = false;
                    });
                }
                // }, 1000);
                // setTimeout(async () => {
                //     this.buttonPrint = false;
                //     let fq = new FilterQuery();
                //     fq.filterList = [
                //         { criteria: Criteria.EQUALS, field: "id", value1: this.analisisId },
                //     ];
                //     await this.analisisDesviacionService.findByFilter(fq).then((resp: any) => {
                //         let analisis = <AnalisisDesviacion>resp["data"][0];
                //         this.tareasList = analisis.tareaDesviacionList;
                //     })
                //     this.tareaList3();
                // }, 1000);

            }, 3000);
            this.flagBotonModificar()
        } else {
            this.guardando = false
            this.msgs = [];
            //   this.msgs.push({
            //       severity: "error",
            //       detail: "Si el accidente es grave o mortal, se debe enviar reporte a  entes de control o si selecciona el campo sí se debe diligenciar la fecha de envío a entes de control.",
            //   });

            this.msgs.push({
                severity: "error",
                detail: "Debe diligenciar información complementaria para guardar.",
            });
        }
        window.scrollTo(0, 0);
    }

    validarData(): boolean {

        let flagIncapacidades: boolean = false
        if (this.incapacidadesList) {
            if (this.incapacidadesList.length > 0) {
                flagIncapacidades = true
            }
        }

        let flagTareas: boolean = false;
        if(this.tareasList && this.tareasList.length > 0) flagTareas = true;

        return (!this.analisisPeligros.invalid && flagIncapacidades && flagTareas)
        || (this.desviacionesList && this.desviacionesList[0].modulo === 'Inspecciones CC' && this.tareasList && this.tareasList.length > 0)
        || (Number(this.idEmpresa) == 22 && !this.analisisPeligros.invalid && flagIncapacidades)
        || (Number(this.idEmpresa) == 8 && flagTareas);
    }

    buildList(list: any[]): any[] | null {
        if (list == null) {
            return null;
        }
        let crList: any[] = [];
        list.forEach((imp) => {
            let crEntity = { id: imp.id, nombre: imp.label };
            crList.push(crEntity);
        });
        return crList;
    }
    manageResponse(ad: AnalisisDesviacion) {
        this.msgs = [];
        if (ad.tareaDesviacionList && this.desviacionesList) {
            for (let i = 0; i < ad.tareaDesviacionList.length; i++) {
                ad.tareaDesviacionList[i].modulo = this.desviacionesList[0].modulo;
                ad.tareaDesviacionList[i].codigo = this.desviacionesList[0].hashId;
                if (ad.tareaDesviacionList[i].empResponsable != null) {
                    let email =
                        ad?.tareaDesviacionList[i]?.empResponsable?.usuarioBasic?.email;
                    if (email == null || email == "") {
                        this.msgs = [];
                        this.msgs.push({
                            severity: "warn",
                            summary: "Correo electrónico requerido",
                            detail: "Debe especificar el correo electrónico de la cuenta de usuario",
                        });
                        return;
                    }
                    this.authService
                        .sendNotification(email, ad.tareaDesviacionList[i])
                        .then((resp: any) => {
                            if (resp["mensaje"] != "Enviado") {
                                this.msgs = [];
                                this.msgs.push({
                                    severity: resp["tipoMensaje"],
                                    detail: resp["detalle"],
                                    summary: resp["mensaje"],
                                });
                                this.visibleLnkResetPasswd = true;
                            }
                        })
                        .catch((err: any) => {
                            this.msgs = [];
                            this.msgs.push({
                                severity: err.error["tipoMensaje"],
                                detail: err.error["detalle"],
                                summary: err.error["mensaje"],
                            });
                            this.visibleLnkResetPasswd = true;
                        });
                } else if(this.desviacionesList[0].modulo != 'Inspecciones CC') {
                    this.msgs = [];
                    this.msgs.push({
                        severity: "warn",
                        summary: "empleado requerido",
                        detail: "Debe especificar un usuario responsable de la tarea",
                    });
                }
            }
            this.msgs.push({
                severity: "success",
                summary:
                    "Investigación de desviación " +
                    (this.modificar ? "actualizada" : "registrada"),
                detail:
                    "Se ha " +
                    (this.modificar ? "actualizado" : "generado") +
                    " correctamente la investigación",
            });
            this.guardando = false;
        }
    }
    async tareaList2() {

        let fq = new FilterQuery();
        fq.filterList = [
            { criteria: Criteria.EQUALS, field: "id", value1: this.analisisId },
        ];
        await this.analisisDesviacionService.findByFilter(fq).then((resp: any) => {
            let analisis = <AnalisisDesviacion>resp["data"][0];
            this.tareasList = analisis.tareaDesviacionList;
        })

        this.listPlanAccion.forEach((element: any) => {
            element.causaRaiz.forEach(async (element2: any) => {
                let x;
                let y;
                let z;
                if (this.tareasList)
                    if (this.tareasList.length > 0) {
                        x = await this.tareasList.find((data: any) => {
                            return ((data.nombre == element2.especifico.nombreAccionCorrectiva) && new Date(data.fechaProyectada).toDateString() == new Date(element2.especifico.fechaVencimiento).toDateString() && (data.descripcion == element2.especifico.accionCorrectiva) && (data.empResponsable.primerNombre == element2.especifico.responsableEmpresa.primerNombre) && (data.empResponsable.id == element2.especifico.responsableEmpresa.id));
                        })
                        y = await this.tareasList.find((data: any) => {
                            return (data.nombre == element2.medible.planVerificacion && new Date(data.fechaProyectada).toDateString() == new Date(element2.medible.fechaVencimiento).toDateString() && (data.empResponsable.primerNombre == element2.medible.responsableEmpresa.primerNombre) && (data.empResponsable.id == element2.medible.responsableEmpresa.id));
                        })
                        z = await this.tareasList.find((data: any) => {
                            return (data.nombre == element2.eficaz.planValidacion && new Date(data.fechaProyectada).toDateString() == new Date(element2.eficaz.fechaVencimiento).toDateString() && (data.empResponsable.primerNombre == element2.eficaz.responsableEmpresa.primerNombre) && (data.empResponsable.id == element2.eficaz.responsableEmpresa.id));
                        })
                    } else {
                        x = undefined
                        y = undefined
                        z = undefined
                    }
                for (let index = 0; index < 3; index++) {
                    if (index == 0 && element2.especifico.isComplete && x == undefined && element2.especifico.id == null) {
                        let tarea: Tarea = {
                            id: null,
                            nombre: element2.especifico.nombreAccionCorrectiva,
                            descripcion: element2.especifico.accionCorrectiva,
                            tipoAccion: '',
                            jerarquia: '',
                            estado: 'NUEVO',
                            fechaProyectada: new Date(element2.especifico.fechaVencimiento),
                            fechaRealizacion: undefined,
                            fechaVerificacion: undefined,
                            areaResponsable: null,
                            empResponsable: element2.especifico.responsableEmpresa,
                            observacionesRealizacion: '',
                            observacionesVerificacion: '',
                            usuarioRealiza: null,
                            usuarioVerifica: null,
                            analisisDesviacionList: [],
                            modulo: '',
                            codigo: '',
                            envioCorreo: false,
                        };
                        this.tareasList?.push(tarea)
                    } else if (index == 1 && element2.medible.isComplete && y == undefined && element2.medible.id == null) {
                        let tarea: Tarea = {
                            id: null,
                            nombre: element2.medible.planVerificacion,
                            descripcion: '',
                            tipoAccion: '',
                            jerarquia: '',
                            estado: 'NUEVO',
                            fechaProyectada: new Date(element2.medible.fechaVencimiento),
                            fechaRealizacion: undefined,
                            fechaVerificacion: undefined,
                            areaResponsable: null,
                            empResponsable: element2.medible.responsableEmpresa,
                            observacionesRealizacion: '',
                            observacionesVerificacion: '',
                            usuarioRealiza: null,
                            usuarioVerifica: null,
                            analisisDesviacionList: [],
                            modulo: '',
                            codigo: '',
                            envioCorreo: false,
                        };
                        this.tareasList?.push(tarea)
                    } else if (index == 2 && element2.eficaz.isComplete && z == undefined && element2.eficaz.id == null) {
                        let tarea: Tarea = {
                            id: null,
                            nombre: element2.eficaz.planValidacion,
                            descripcion: '',
                            tipoAccion: '',
                            jerarquia: '',
                            estado: 'NUEVO',
                            fechaProyectada: new Date(element2.eficaz.fechaVencimiento),
                            fechaRealizacion: undefined,
                            fechaVerificacion: undefined,
                            areaResponsable: null,
                            empResponsable: element2.eficaz.responsableEmpresa,
                            observacionesRealizacion: '',
                            observacionesVerificacion: '',
                            usuarioRealiza: null,
                            usuarioVerifica: null,
                            analisisDesviacionList: [],
                            modulo: '',
                            codigo: '',
                            envioCorreo: false,
                        };
                        this.tareasList?.push(tarea)
                    }
                }
                if (this.tareasList)
                    if (this.tareasList.length > 0) {
                        this.tareasList.forEach((element3: any) => {
                            if (element3.id != null) {
                                if ((element3.id === element2.especifico.id) && (element3.nombre != element2.especifico.nombreAccionCorrectiva || element3.descripcion != element2.especifico.accionCorrectiva || new Date(element3.fechaProyectada).toDateString() != new Date(element2.especifico.fechaVencimiento).toDateString() || (element3.empResponsable.primerNombre != element2.especifico.responsableEmpresa.primerNombre) || (element3.empResponsable.id != element2.especifico.responsableEmpresa.id))) {
                                    element3.nombre = element2.especifico.nombreAccionCorrectiva
                                    element3.descripcion = element2.especifico.accionCorrectiva
                                    element3.fechaProyectada = new Date(element2.especifico.fechaVencimiento)
                                    element3.empResponsable = element2.especifico.responsableEmpresa
                                    element3.envioCorreo = false
                                }
                                if ((element3.id === element2.medible.id) && (element3.nombre != element2.medible.planVerificacion || new Date(element3.fechaProyectada).toDateString() != new Date(element2.medible.fechaVencimiento).toDateString() || (element3.empResponsable.primerNombre != element2.medible.responsableEmpresa.primerNombre) || (element3.empResponsable.id != element2.medible.responsableEmpresa.id))) {
                                    element3.nombre = element2.medible.planVerificacion
                                    element3.fechaProyectada = new Date(element2.medible.fechaVencimiento)
                                    element3.empResponsable = element2.medible.responsableEmpresa
                                    element3.envioCorreo = false
                                }
                                if ((element3.id === element2.eficaz.id) && (element3.nombre != element2.eficaz.planValidacion || new Date(element3.fechaProyectada).toDateString() != new Date(element2.eficaz.fechaVencimiento).toDateString() || (element3.empResponsable.primerNombre != element2.eficaz.responsableEmpresa.primerNombre) || (element3.empResponsable.id != element2.eficaz.responsableEmpresa.id))) {
                                    element3.nombre = element2.eficaz.planValidacion
                                    element3.fechaProyectada = new Date(element2.eficaz.fechaVencimiento)
                                    element3.empResponsable = element2.eficaz.responsableEmpresa
                                    element3.envioCorreo = false
                                }
                            }
                        });
                    }
            });
        });
    }
    flagBotonModificar() {
        setTimeout(() => {
            this.disabled = false;
        }, 60000);
    }
    testmsng() {
        this.authService.callmsng()
    }
}

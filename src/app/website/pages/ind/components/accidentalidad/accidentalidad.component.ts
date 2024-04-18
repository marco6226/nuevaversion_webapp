import { Component, OnInit, AfterViewInit, OnDestroy} from "@angular/core";
import { FilterQuery } from "../../../core/entities/filter-query";
import { DatePipe } from '@angular/common';
import { ReporteAtService } from "../../service/reporte-at.service";
import { SesionService } from "../../../core/services/session.service";
import { HhtService } from "../../../empresa/services/hht.service";
import { locale_es } from "../../../comun/entities/reporte-enumeraciones";
import { Area } from "../../../empresa/entities/area";
import { AreaService } from "../../../empresa/services/area.service";
import { Criteria, SortOrder } from "../../../core/entities/filter";
import { DataHht } from "../../../empresa/entities/hht";
import {Hht} from "../../../comun/entities/hht"
import { PrimeNGConfig } from 'primeng/api';
import { Switch } from '@syncfusion/ej2/buttons';
import { PlantasService } from "../../../core/services/Plantas.service";
import { Plantas } from "../../../comun/entities/Plantas";
import { ViewHHtMetasService } from "../../../core/services/viewhhtmetas.service";
import { viewHHtMetas } from "../../../comun/entities/ViewHHtMetas";
import { ComunEntity } from '../../../comun/entities/comun-entity';

class division {
  name!: string;
  acumulado!: number;
  meta!: number;
  eventos!: number;
  diasPerdidos!: number;
  frecuencia!: number;
  severidad!: number;
}

@Component({
  selector: "s-accidentalidad",
  templateUrl: "./accidentalidad.component.html",
  styleUrls: ["./accidentalidad.component.scss"],
  providers: [HhtService, SesionService, ReporteAtService,ViewHHtMetasService],
})

export class AccidentalidadComponent implements OnInit, AfterViewInit, OnDestroy {
  
  ili:number=0;
  metaIli:number=0;
  metaPais:number=0;
  metaDivision:number=0;

  colorIli?:string;
  categoriesCombo: any=[];
  seriesCombo: any=[];
  selectedAnioIli_1: number = new Date().getFullYear();
  selectedAnioIli_1_2: number = new Date().getFullYear();

  dataIli_1?: {
    labels: any;
    datasets: any[];
    options: any;
  }

  dataIli_1_2?: {
    labels: any;
    datasets: any[];
    options: any;
  }
  optionsIli_1: any = {
    title: {
      display: true,
      text: 'ILI por planta'
    }
  }

  optionsIli_1_2: any = {
    title: {
      display: true,
      text: 'ILI por planta'
    }
  }

  dataIli_2?: {
    labels: any;
    datasets: any[];
    options: any;
  };

  dataIli_2_2?: {
    labels: any;
    datasets: any[];
    options: any;
  };

  optionsIli_2: any = {
    title: {
      display: true,
      text: 'ILI por mes'
    }
  };
  optionsIli_2_2: any = {
    title: {
      display: true,
      text: 'ILI por mes'
    }
  };
  selectedAnioIli_2: number = new Date().getFullYear();
  selectedAnioIli_2_2: number = new Date().getFullYear();

  multi?: any[];
  localeES = locale_es;
  desde?: Date | null;
  hasta?: Date;
  NoEventos?:number;
  diasPerdidos?:number;
  incapacidades?:any;
  areasPermiso?: string;
  filtroFechaAt: Date[] | null | undefined = [];
  filtroFechaDiasPerdidos: Date[] = [];
  pipe = new DatePipe('en-US');
  todayWithPipe = null;
  areaList: Area[] = [];
  divisiones= new Array();
  divisiones2= new Array();
  divisiones4= new Array();
  divisionS=null;
  divisiones5=[
    {name:'Enero',code:0},
    {name:'Febrero',code:1},
    {name:'Marzo',code:2},
    {name:'Abril',code:3},
    {name:'Mayo',code:4},
    {name:'Junio',code:5},
    {name:'Julio',code:6},
    {name:'Agosto',code:7},
    {name:'Septiembre',code:8},
    {name:'Octubre',code:9},
    {name:'Noviembre',code:10},
    {name:'Diciembre',code:11},
    {name:'Corona total',code:12}
  ]
  fieldsR: string[] = [
    'id'
  ];
  fieldsAD: string[] = [
    'incapacidades',
    'fechaElaboracion'
  ];
  fieldsD: string[] = [
    'analisisId'
  ];
  fieldR: string[] = [
    'id'
  ];

  view: any[] = [1200, 400];
  view2: any[] = [850, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  // options
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Divisiones';
  xAxisLabel2 = 'Eventos AT/Días perdidos';
  xAxisLabel3 = 'Meses';
  showYAxisLabel = true;
  yAxisLabel = 'Días perdidos';
  yAxisLabel2 = 'Divisiones';
  yAxisLabel3 = 'Tasa frecuencia/Tasa Severidad (%)';
  legendTitle: string = 'Years';
  colorScheme = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };
  colorScheme2 = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };
  colorScheme3 = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };
  colorScheme4 = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };
  title: string = 'Accidentalidad';
  data?: [];
  meses: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  Meses= [
    {label:'Enero',value:'Enero'},
    {label:'Febrero',value:'Febrero'},
    {label:'Marzo',value:'Marzo'},
    {label:'Abril',value:'Abril'},
    {label:'Mayo',value:'Mayo'},
    {label:'Junio',value:'Junio'},
    {label:'Julio',value:'Julio'},
    {label:'Agosto',value:'Agosto'},
    {label:'Septiembre',value:'Septiembre'},
    {label:'Octubre',value:'Octubre'},
    {label:'Noviembre',value:'Noviembre'},
    {label:'Diciembre',value:'Diciembre'}
  ];

  MesesValue= [
    {label:'Enero',value:0},
    {label:'Febrero',value:1},
    {label:'Marzo',value:2},
    {label:'Abril',value:3},
    {label:'Mayo',value:4},
    {label:'Junio',value:5},
    {label:'Julio',value:6},
    {label:'Agosto',value:7},
    {label:'Septiembre',value:8},
    {label:'Octubre',value:9},
    {label:'Noviembre',value:10},
    {label:'Diciembre',value:11}
  ];

  paisesListtotal: Array<any> = [
    {label: 'Colombia', value: 'Colombia'},
    {label: 'Costa Rica', value: 'Costa Rica'},
    {label: 'EEUU', value: 'EEUU'},
    {label: 'Guatemala', value: 'Guatemala'},
    {label: 'Honduras', value: 'Honduras'},
    {label: 'Mexico', value: 'Mexico'},
    {label: 'Nicaragua', value: 'Nicaragua'},
    {label: 'Corona Total', value: 'Corona Total'}
  ];
  paisesList: Array<any> = [
    {label: 'Colombia', value: 'Colombia'},
    {label: 'Costa Rica', value: 'Costa Rica'},
    {label: 'EEUU', value: 'EEUU'},
    {label: 'Guatemala', value: 'Guatemala'},
    {label: 'Honduras', value: 'Honduras'},
    {label: 'Mexico', value: 'Mexico'},
    {label: 'Nicaragua', value: 'Nicaragua'}
  ];
  selectPais1:any
  selectPais2:any
  selectPais3:any
  selectPais4:any
  selectPais5:any
  selectPais6:any
  selectPais7:any
  selectPais8:any
  selectPais9:any
  selectPais10:any
  selectPais11:any

  selectPais12:any
  selectPais13:any


  selectPais4_2:any
  selectPais5_2:any
  selectPais6_2:any
  selectPais7_2:any
  selectPais8_2:any
  selectPais9_2:any
  selectPais10_2:any
  selectPais11_2:any

  selectPais12_2:any
  selectPais13_2:any


  plantasList:any=[]
  plantasList1:any=[]
  plantasList2:any=[]
  plantasList3:any=[]
  plantasList4:any=[]
  plantasList5:any=[]
  plantasList6:any=[]
  plantasList7:any=[]
  plantasList8:any=[]
  plantasList9:any=[]
  plantasList10:any=[]
  plantasList11:any=[]

  plantasList12:any=[]
  plantasList13:any=[]


  plantasList4_2:any=[]
  plantasList5_2:any=[]
  plantasList6_2:any=[]
  plantasList7_2:any=[]
  plantasList8_2:any=[]
  plantasList9_2:any=[]  
  plantasList10_2:any=[]
  plantasList11_2:any=[]

  plantasList12_2:any=[]
  plantasList13_2:any=[]



  PlantaSelect1:any=null
  PlantaSelect2:any=null
  PlantaSelect3:any=null
  PlantaSelect4:any=null
  PlantaSelect5:any=null
  PlantaSelect6:any=null
  PlantaSelect7:any=null
  PlantaSelect8:any=null
  PlantaSelect9:any=null
  PlantaSelect10:any=null
  PlantaSelect11:any=null

  PlantaSelect12:any=null
  PlantaSelect13:any=null

  PlantaSelect4_2:any=null
  PlantaSelect5_2:any=null
  PlantaSelect6_2:any=null
  PlantaSelect7_2:any=null
  PlantaSelect8_2:any=null
  PlantaSelect9_2:any=null
  PlantaSelect10_2:any=null
  PlantaSelect11_2:any=null

  PlantaSelect12_2:any=null
  PlantaSelect13_2:any=null


  divisionList:any=[]
  divisionList1:any=[]
  divisionList2:any=[]
  divisionList3:any=[]
  divisionList4:any=[]
  divisionList5:any=[]
  divisionList6:any=[]
  divisionList7:any=[]
  divisionList8:any=[]
  divisionList9:any=[]
  divisionList10:any=[]
  divisionList11:any=[]

  divisionList12:any=[]
  divisionList13:any=[]


  divisionList4_2:any=[]
  divisionList5_2:any=[]
  divisionList6_2:any=[]
  divisionList7_2:any=[]
  divisionList8_2:any=[]
  divisionList9_2:any=[]
  divisionList10_2:any=[]
  divisionList11_2:any=[]

  divisionList12_2:any=[]
  divisionList13_2:any=[]



  selectedDivisionResumen?: any | null = null;
  selectedDivisionResumen1?: any | null = null;
  selectedDivisionResumen2?: any | null = null;
  selectedDivisionResumen3?: any | null = null;
  selectedDivisionResumen4?: any | null = null;
  selectedDivisionResumen5?: any | null = null;
  selectedDivisionResumen6?: any | null = null;
  selectedDivisionResumen7?: any | null = null;
  selectedDivisionResumen8?: any | null = null;
  selectedDivisionResumen9?: any | null = null;
  selectedDivisionResumen10?: any | null = null;
  selectedDivisionResumen11?: any | null = null;

  selectedDivisionResumen12?: any | null = null;
  selectedDivisionResumen13?: any | null = null;

  selectedDivisionResumen4_2?: any | null = null;
  selectedDivisionResumen5_2?: any | null = null;
  selectedDivisionResumen6_2?: any | null = null;
  selectedDivisionResumen7_2?: any | null = null;
  selectedDivisionResumen8_2?: any | null = null;
  selectedDivisionResumen9_2?: any | null = null;
  selectedDivisionResumen10_2?: any | null = null;
  selectedDivisionResumen11_2?: any | null = null;
  
  selectedDivisionResumen12_2?: any | null = null;
  selectedDivisionResumen13_2?: any | null = null;

  selectDivisiones1: any[] = [];
  selectIndicarores1: any[] = [];
  selectIndicarores1_2: any[] = [];

  selectDivisiones2: any[] = [];
  selectDivisionesILI1: any[] = [];
  selectDivisionesILI1_2: any[] = [];

  selectDivisionesILI2?: string;
  selectDivisionesILI2_2?: string;

  selectIndicarores2: any[] = [];
  selectIndicarores2_2: any[] = [];

  selectMeses1: any[] = [];
  selectMeses2: any[] = [];
  selectMesesILI2: any[] = [];
  selectedMesesTasa1: any[] = [];
  selectedMesesTasa1_2: any[] = [];
  selectMeses1_2: any[] = [];
  selectMeses2_2: any[] = [];
  selectMesesILI2_2: any[] = [];


  selectEventos1: any[] = [];
  selectEventos2: any[] = [];
  selectEventos10: any[] = [];
  selectEventos11: any[] = [];
  selectEventos10_2: any[] = [];
  selectEventos11_2: any[] = [];

  selectEventos12: any[] = [];
  selectEventos13: any[] = [];
  selectEventos12_2: any[] = [];
  selectEventos13_2: any[] = [];


  selectEventos1_2: any[] = [];
  selectEventos2_2: any[] = [];

  mesesILI2: string[] = [];
  Indicadores: any[] = [{label: 'Tasa de Frecuencia', value: 0}, {label: 'Tasa de Severidad', value: 1}, {label: 'Proporción AT mortal', value: 2}];
  Eventos: any[] = [{label: 'Número total de AT', value: 0}, {label: 'Número de AT con días perdidos', value: 4}, {label: 'Numero de días perdidos', value: 1}, {label: 'Numero de AT mortales', value: 2}, {label: 'Numero de AT con cero días', value: 3}];
  grafMetas: any[] = [{label: 'Número de AT con días perdidos', value: 0}, {label: 'Meta de AT', value: 1}, {label: 'Número de días perdidos', value: 2}, {label: 'Meta de días perdidos', value: 2}];
  grafMetas2: any[] = [{label: 'Tasa de Frecuencia', value: 0}, {label: 'Meta de TF', value: 1}, {label: 'Tasa de Severidad', value: 2}, {label: 'Meta de TS', value: 2}];

  dataEventos1?: any[];
  evento1Desde: Date | null = null;
  evento1Hasta: Date | null = null;
  evento1Desde_2: Date | null = null;
  evento1Hasta_2: Date | null = null;

  randomEv2?: any[];
  tasaFrecuencia1?: any[];
  tasaFrecuencia2?: any[];
  tasaFrecuencia1_2?: any[];
  tasaFrecuencia2_2?: any[];
  
  tasaDesde: Date = new Date();
  tasaHasta: Date = new Date();
  tasaDesde_2: Date = new Date();
  tasaHasta_2: Date = new Date();
  tasasNotFound: boolean = false;
  tasasNotFound2: boolean = false;
  tasasNotFound_2: boolean = false;
  tasasNotFound_2_2: boolean = false;

  tasasNotFoundMeta: boolean = false;
  tasasNotFoundMeta_2: boolean = false;


  tasasNotFound2_2: boolean = false;
  filtroAnioTasa_1: number = new Date().getFullYear();
  filtroAnioTasa_1_2: number = new Date().getFullYear();

  divisionesCorona: string[] = ['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas','Corona total'];
  divisionesCoronaConId: any[] = [];
  divisionesCoronaIli1: string[] = [];
  divisionesCoronaIli1_2: string[] = [];

  filtroAnioTasa_2: number = new Date().getFullYear();
  filtroAnioTasa_2_2: number = new Date().getFullYear();


  filtroDivisionesTasa_2?: string;
  filtroDivisionEventos2: any[] = [];
  filtroDivisionEventos2_2: any[] = [];

  filtroMesesIli_1: any[] = []; 
  filtroMesesIli_1_2: any[] = []; 

  dataEventos2: any[] = [];
  filtroAnioEventos2: number = new Date().getFullYear();
  filtroAnioEventos2_2: number = new Date().getFullYear();

  filtroEventos1?: string;
  filtroEventos2?: string;
  filtroEventos2meses?: string;
  filtroEventos1_2?: string;
  filtroEventos2_2?: string;
  filtroEventos2_2meses?: string;
  

  randomILI?: any[];
  randomILI2?: any[];
  randomILI2_2?: any[];
  randomILI3?: any[];
  randomILI3_2?: any[];
  randomEv1Dona?: any[];
  randomEv2Dona?: any[];
  randomEv3Dona?: any[];
  randomEv1Donadb?: any[];
  randomEv2Donadb?: any[];
  randomEv3Donadb?: any[];
  flagdiv1:boolean=false;
  flagdiv2:boolean=false;
  flagevent2:boolean=false;
  flagILI2:boolean=false;
  flagILI2_2:boolean=false;
  flagILI3:boolean=false;
  flagILI3_2:boolean=false;
  hastaEv2: Date=new Date(Date.now());
  hastaIn1: Date=new Date(Date.now());
  hastaIn2: Date=new Date(Date.now());
  hastaILI1: Date=new Date(Date.now());
  hastaILI2: Date=new Date(Date.now());
  hastaILI3: Date=new Date(Date.now());
  hastaILI1_2: Date=new Date(Date.now());
  hastaILI2_2: Date=new Date(Date.now());
  hastaILI3_2: Date=new Date(Date.now());
  desdeEv2?: Date;
  desdeIn1?: Date;
  desdeIn2?: Date;
  desdeILI1?: Date;
  desdeILI2?: Date;
  desdeILI3?: Date;
  desdeILI1_2?: Date;
  desdeILI2_2?: Date;
  desdeILI3_2?: Date;
  divisiones3?: any[];
  reporteTabla?:any
  reporteTabla2?:any
  totalDiasPerdidosDv?: any[];
  totalEventosDv?: any[];
  totalEventosDv2?: any[];
  totalDiasEventos?: any[];
  random?: any[];
  flag:boolean=false
  flag1:boolean=false
  flagdiv:boolean=false
  flagevent:boolean=false
  flagtasa1:boolean=false
  flagtasa2:boolean=false
  flagtasaILI:boolean=false
  yearRange = new Array();
  añoPrimero:number=2015;
  dateValue= new Date();
  añoActual:number=this.dateValue.getFullYear();
  anioActualResumen: number = new Date().getFullYear();
  fechaInicioResumen?: Date | null | undefined;
  fechaFinalResumen?: Date;
  yearRangeNumber= Array.from({length: this.añoActual - this.añoPrimero+1}, (f, g) => g + this.añoPrimero);

  filterMemoryTasas_1?:string;
  filterMemoryTasas_2?:String;

  filterMemoryTasas_1_2?:string;
  filterMemoryTasas_2_2?:String;

  radioGra0:number=0
  radioGra1:number=0
  radioGra2:number=0
  radioGra3:number=0
  
  radioGra2_2:number=0
  radioGra3_2:number=0

  empresaId:any  = this.sessionService.getEmpresa()?.id;

  fields=[
    'id',
    'nombre',
    'area_id',
    'area_nombre',
    'pais',
    'tipo',
  ]

  fieldsLoc=[
    'id',
    'localidad',
    'plantas_id',
    'plantas_nombre',
    'plantas_area_id',
    'plantas_area_nombre',
    'plantas_pais',
  ]

  fieldHht=[
    'id',
    'anio',
    'mes',
    'valor',
    'empresaSelect',
    'planta_id',
    'planta_nombre',
    'planta_area_id',
    'planta_area_nombre',
    'planta_pais',
    'numeroPersonas',
    'hht'
  ]

  constructor(
    private reporteAtService: ReporteAtService, 
    private areaService: AreaService,
    private hhtService: HhtService,
    private plantasService: PlantasService,
    private sessionService: SesionService,
    private viewHHtMetasService: ViewHHtMetasService,
    private config: PrimeNGConfig
    ) {}
    
    
  ngAfterViewInit(){
    this.cargarEventosAt().then(() => {
      this.tasaDesde.setMonth(new Date().getMonth()-1);
      this.tasaDesde.setDate(1);
      this.tasaHasta.setDate(1);

      this.loadResumen();
      this.getEventosAt();
      this.selectRangoEventosAt(this.filtroFechaAt![0],'desde' )
      this.getDiasPerdidosAt();
      this.selectRangoDiasPerdidosAt(this.filtroFechaDiasPerdidos[0],'desde' )
      // this.getTasas_1();
      // this.getTasas_1_2();
      // this.getTasas_2();
      // this.getTasas_2_2();
      // this.getEventos_1();
      // this.getEventos_1_2();
      // this.getEventos_2();
      // this.getEventos_2_2();
      // this.getIli_1();
      // this.getIli_1_2();
      // this.getIli_2();
      // this.getIli_2_2();
    }).catch((e) => {
      console.error('error: ', e);
    });
  }

  ngOnDestroy(): void {
    localStorage.removeItem('reporteAtList');
    localStorage.removeItem('diasPerdidosAtList');
    localStorage.removeItem('reportesAt');
    localStorage.removeItem('tasaFrecuencia1');
    localStorage.removeItem('tasaFrecuencia2');
    localStorage.removeItem('dataEventos1');
    localStorage.removeItem('dataEventos2');
    localStorage.removeItem('dataIli_1');
    localStorage.removeItem('dataIli_2');
    localStorage.removeItem('tasaFrecuencia1_2');
    localStorage.removeItem('tasaFrecuencia2_2');
    localStorage.removeItem('dataEventos1_2');
    localStorage.removeItem('dataEventos2_2');
    localStorage.removeItem('dataIli_1_2');
    localStorage.removeItem('dataIli_2_2');
    localStorage.removeItem('dataMeta1');
    localStorage.removeItem('dataMeta_2');
    localStorage.removeItem('dataMeta1_2');
    localStorage.removeItem('dataMeta_2_2');
    localStorage.removeItem('dataMeta_1meses');
    localStorage.removeItem('dataMeta_1meses_2');
  }

  async ngOnInit() {

    this.config.setTranslation(this.localeES);
    localStorage.removeItem('reporteAtList');
    localStorage.removeItem('diasPerdidosAtList');
    localStorage.removeItem('reportesAt');
    localStorage.removeItem('tasaFrecuencia1');
    localStorage.removeItem('tasaFrecuencia2');
    localStorage.removeItem('dataEventos1');
    localStorage.removeItem('dataEventos2');
    localStorage.removeItem('dataIli_1');
    localStorage.removeItem('dataIli_2');
    localStorage.removeItem('tasaFrecuencia1_2');
    localStorage.removeItem('tasaFrecuencia2_2');
    localStorage.removeItem('dataEventos1_2');
    localStorage.removeItem('dataEventos2_2');
    localStorage.removeItem('dataIli_1_2');
    localStorage.removeItem('dataIli_2_2');
    localStorage.removeItem('dataMeta1');
    localStorage.removeItem('dataMeta_2');
    localStorage.removeItem('dataMeta1_2');
    localStorage.removeItem('dataMeta_2_2');
    localStorage.removeItem('dataMeta_1meses');
    localStorage.removeItem('dataMeta_1meses_2');



    if(this.ili<=this.metaIli){
    this.colorIli="card l-bg-green-dark"}
    else {this.colorIli="card l-bg-red-dark"}

    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }

    this.hasta = new Date(Date.now());
    this.desde = null;
    this.fechaInicioResumen = new Date(new Date().getFullYear(), 0, 1);
    this.fechaFinalResumen = new Date();

    this.getData().then();
  }

  async getData(){
    await this.getDivision()
    this.filtroFechaAt![0]=this.fechaInicioResumen!
    this.filtroFechaAt![1]=(this.fechaFinalResumen)!
    this.filtroFechaDiasPerdidos[0]=this.fechaInicioResumen!
    this.filtroFechaDiasPerdidos[1]=(this.fechaFinalResumen)!
    let areafiltQuery = new FilterQuery();
      areafiltQuery.sortOrder = SortOrder.ASC;
      areafiltQuery.sortField = "nombre";
      areafiltQuery.fieldList = ["nombre", "id"];
      areafiltQuery.filterList = [
        { criteria: Criteria.EQUALS, field: "nivel", value1: "0" },
    ];
    this.divisiones=[]
    this.divisiones2=[]
    this.divisiones4=[]
    // this.divisiones.push({label:'Total',value:'Total'})
    await this.areaService.findByFilter(areafiltQuery)
    .then(
      (resp:any) => {
        this.areaList = <Area[]>resp['data'];
        let cont=0
        this.areaList.forEach(element => {
          this.divisionesCoronaConId.push({nombre: element.nombre, id: element.id});
          this.divisiones.push({label:element['nombre'],value:element['nombre']})
          this.divisiones2.push({label:element['nombre'],value:element['nombre']})
          this.divisiones4.push({name:element['nombre'],code:cont})
          cont+=1
        });
        this.divisiones4.push({name:'Corona total',code:cont})
        this.divisiones2.push({label:'Corona total',value:'Corona total'})
      }
    );
      this.reporteTabla=[]
      this.reporteTabla2=[]
      this.totalDiasPerdidosDv=[]
      this.totalEventosDv=[]
      this.totalEventosDv2=[]
      this.totalDiasEventos=[]
      await this.reporteAtService.findAllRAT()
      .then(res => {
        this.reporteTabla=res
        
        this.areaList.forEach(element => {
          let cont: number = 0;
          let diasPerdidos: number=0

          this.reporteTabla.forEach((element2:any) =>{
            if(element['nombre']==element2['padreNombre']){
              cont+=1;
              if(element2['incapacidades'] != null && element2['incapacidades'] != 'null'){
                diasPerdidos+=JSON.parse(element2['incapacidades']).length
              }
            }
          })
          this.totalDiasPerdidosDv!.push({name:element['nombre'],value:diasPerdidos})
          this.totalEventosDv!.push({name:element['nombre'],value:cont})
          this.reporteTabla2.push({nombre:element['nombre'],eventos:cont,dias_Perdidos:diasPerdidos})
          this.totalDiasEventos!.push({name:element['nombre'],series:[{name:'Eventos AT',value:cont},{name:'Días perdidos',value:diasPerdidos}]})
        });
      });
      this.totalEventosDv2=this.totalEventosDv
      this.data = this.reporteTabla2;
  }

  async loadResumen(){
    let filterQueryCoronameta = new FilterQuery();
    let filterQueryCorona = new FilterQuery();
    let filterQueryTemp = new FilterQuery();
    let empresaId = this.sessionService.getEmpresa()?.id?.toString();
    let hhtEmpresa: Hht[] = [];
    let hhtTemp: Hht[] = [];
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).map((at:any) => at);
    
    filterQueryCoronameta.sortOrder = SortOrder.ASC;
    filterQueryCoronameta.sortField = "id";
    filterQueryCoronameta.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.anioActualResumen.toString()},
      {criteria: Criteria.EQUALS, field: "empresaId", value1: empresaId}
    ];

    if(this.selectPais1)filterQueryCoronameta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais1.toString()})
    if(this.selectedDivisionResumen1)filterQueryCoronameta.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen1.toString()})
    if(this.PlantaSelect1)filterQueryCoronameta.filterList.push({criteria: Criteria.EQUALS, field: "nombrePlanta", value1: this.PlantaSelect1.toString()})

    filterQueryCorona.sortOrder = SortOrder.ASC;
    filterQueryCorona.sortField = "id";
    filterQueryCorona.fieldList=this.fieldHht;
    filterQueryCorona.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.anioActualResumen.toString()},
      {criteria: Criteria.EQUALS, field: "empresa.id", value1: empresaId},
      {criteria: Criteria.EQUALS, field: "empresaSelect", value1: empresaId}
    ];
    if(this.selectPais1)if(this.selectPais1 != 'Corona Total')filterQueryCorona.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais1.toString()})
    if(this.selectedDivisionResumen1)filterQueryCorona.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen1).id.toString()})
    if(this.PlantaSelect1)filterQueryCorona.filterList.push({criteria: Criteria.EQUALS, field: "planta.nombre", value1: this.PlantaSelect1.toString()})

    filterQueryTemp.sortOrder = SortOrder.ASC;
    filterQueryTemp.sortField = "id";
    filterQueryTemp.fieldList=this.fieldHht;
    filterQueryTemp.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.anioActualResumen.toString()},
      {criteria: Criteria.EQUALS, field: "empresa.id", value1: empresaId},
      {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: empresaId}
    ];
    if(this.selectPais1)if(this.selectPais1 != 'Corona Total')filterQueryTemp.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais1.toString()})
    if(this.selectedDivisionResumen1)filterQueryTemp.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen1).id.toString()})
    if(this.PlantaSelect1)filterQueryTemp.filterList.push({criteria: Criteria.EQUALS, field: "planta.nombre", value1: this.PlantaSelect1.toString()})
    
    if(this.fechaInicioResumen){
      this.fechaInicioResumen.setFullYear(this.anioActualResumen);
    }

    if(this.fechaFinalResumen){
      this.fechaFinalResumen.setFullYear(this.anioActualResumen);
      this.fechaFinalResumen = new Date(this.fechaFinalResumen.getFullYear(), this.fechaFinalResumen.getMonth()+1, 0);
    }

//nuevo
  if(this.selectPais1)if(this.selectPais1!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais1);
  if(this.selectedDivisionResumen1)reportesAt = reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen1);
  if(this.PlantaSelect1)reportesAt = reportesAt.filter(at => at.nombrePlanta == this.PlantaSelect1);
//fin nuevo

    reportesAt = reportesAt.filter(at => new Date(at.fechaReporte).getFullYear() == this.anioActualResumen);

    reportesAt = reportesAt.filter(at => {
        return new Date(at['fechaReporte']) >= this.fechaInicioResumen! && new Date(at['fechaReporte']) < this.fechaFinalResumen!;
    });

    if(this.selectedDivisionResumen && this.selectedDivisionResumen !== 'Total') reportesAt = reportesAt.filter(at => at.padreNombre === this.selectedDivisionResumen);

    this.NoEventos = reportesAt.length;

    this.diasPerdidos = 0;
    reportesAt.forEach(at => {
      if(at['incapacidades']!=null && at['incapacidades']!='null'){
        this.diasPerdidos = this.diasPerdidos + JSON.parse(at['incapacidades'])
        .reduce((count:any, incapacidad:any) => {
          return count + incapacidad.diasAusencia;
        }, 0);
      }
    });

    await this.viewHHtMetasService.getWithFilter(filterQueryCoronameta).then(async (res: any) => {
      if(res.data.length > 0){
        let hhtmeta = Array.from(res.data);
        if(this.selectPais1 && !this.selectedDivisionResumen1){
          let hhtEmpresaFind:any= hhtmeta.find((ele:any)=>ele.pais==this.selectPais1)
          this.metaIli = hhtEmpresaFind.iliAnual;
        }else if(this.selectedDivisionResumen1 && !this.PlantaSelect1){
          let hhtEmpresaFind:any= hhtmeta.find((ele:any)=>ele.nombreDivision==this.selectedDivisionResumen1)
          this.metaIli = hhtEmpresaFind.iliDivision;
          this.metaPais=hhtEmpresaFind.iliAnual
        }else if(this.PlantaSelect1){
          let hhtEmpresaFind:any= hhtmeta.find((ele:any)=>ele.nombrePlanta==this.PlantaSelect1)
          this.metaIli = hhtEmpresaFind.iliPlanta;
          this.metaDivision=hhtEmpresaFind.iliDivision
          this.metaPais=hhtEmpresaFind.iliAnual
        }else{
          this.metaIli=0
        }

      }else{
        console.error('No se obtuvieron registros hht de la empresa.');
        this.metaIli=0
      }
    }).catch(err => {
      console.error('Error al obtener hht de la empresa');
    });

    await this.hhtService.findByFilter(filterQueryCorona).then(async (res: any) => {
      if(res.data.length > 0){
        hhtEmpresa = Array.from(res.data);
      }else{
        console.error('No se obtuvieron registros hht de la empresa.');
      }
    }).catch(err => {
      console.error('Error al obtener hht de la empresa');
    });
    
 

    await this.hhtService.findByFilter(filterQueryTemp)
    .then(async (res: any) => {
      if(res.data.length > 0){
        hhtTemp = Array.from(res.data);
      }else{
        console.error('No se obtuvieron registros hht de las temporales');
      }
    }).catch(err => {
      console.error('Error al obtener hht de las temporales');
    });

    let accidentesConDiasPerdidos = 0;
    // if(this.selectedDivisionResumen1 !== 'Total'){
      // accidentesConDiasPerdidos = reportesAt.map(ele=>ele)
      // .filter(at => 
      //   at.incapacidades !== null && at.incapacidades!== 'null').filter(at => {
      //     let diasTotales = (<Array<any>>JSON.parse(at.incapacidades))
      //     .reduce((count, incapacidad) => {
      //       return count + incapacidad.diasAusencia;
      //     }, 0);
      //     return diasTotales > 0 ? true : false;
      //   }).length;
    // }else{
      accidentesConDiasPerdidos = reportesAt.map(ele=>ele)
      .filter(at => at.incapacidades !== null && at.incapacidades !== 'null').filter(at => {
        let diasTotales = (<Array<any>>JSON.parse(at.incapacidades))
        .reduce((count, incapacidad) => {
          return count + incapacidad.diasAusencia;
        }, 0);
        return diasTotales > 0 ? true : false;
      }).length;
    // }

    let totalDiasSeveridad = 0;
    // if(this.selectedDivisionResumen1 !== 'Total'){
    //   totalDiasSeveridad = reportesAt
    //   .filter(at => at.padreNombre === this.selectedDivisionResumen1 && at.incapacidades !== null
    //     && at.incapacidades !== 'null')
    //     .reduce((count, at) => {
    //       return count + JSON.parse(at.incapacidades).reduce((count2:any, incapacidad:any) => {
    //         return count2 + incapacidad.diasAusencia;
    //       }, 0);
    //     }, 0);
    // }else{
      totalDiasSeveridad = reportesAt
      .filter(at => at.incapacidades !== null && at.incapacidades !== 'null')
      .reduce((count, at) => {
        return count + JSON.parse(at.incapacidades).reduce((count2:any, incapacidad:any) => {
          return count2 + incapacidad.diasAusencia;
        }, 0);
      }, 0);
    // }


    let totalHhtEmpresa = 0;
    let mesInicio = this.fechaInicioResumen!.getMonth();
    let mesFinal = this.fechaFinalResumen!.getMonth();
    // revisar metodo y descomentarear
    totalHhtEmpresa = this.calcularTotalHht(hhtEmpresa, mesInicio, mesFinal,this.selectPais1,this.selectedDivisionResumen1,this.PlantaSelect1);
    let totalHHtTemporales = 0;
    // revisar metodo y descomentarear
    totalHHtTemporales = this.calcularTotalHht(hhtTemp, mesInicio, mesFinal, this.selectPais1,this.selectedDivisionResumen1,this.PlantaSelect1);

    let IF = (accidentesConDiasPerdidos / (totalHhtEmpresa + totalHHtTemporales)) * 240000;
    let IS = (totalDiasSeveridad / (totalHhtEmpresa + totalHHtTemporales)) * 240000;
    let ILI = (IF * IS) / 1000;
    this.ili = Number(ILI.toFixed(6));

    if(this.ili<=this.metaIli){
      this.colorIli="card l-bg-green-dark"}
      else {this.colorIli="card l-bg-red-dark"}

  }

  calcularTotalHht(hht: Hht[], mesInicio: number, mesFinal: number, selectPais:string, selectedDivisionResumen:string, PlantaSelect:string ): number{

    if(selectPais)if(selectPais != 'Corona Total')hht=hht.filter((eve:any)=>eve.planta_pais==selectPais)
    if(selectedDivisionResumen)hht=hht.filter((eve:any)=>eve.planta_area_id==this.divisionesCoronaConId.find((div:any) => div.nombre === selectedDivisionResumen).id)
    if(PlantaSelect)hht=hht.filter((eve:any)=>eve.planta_nombre==PlantaSelect)


    let totalHht = 0;
    if(mesInicio === mesFinal){
      hht.forEach((item) => {
        if(item.mes === this.meses[mesInicio]){
          totalHht += (item.hht)?item.hht:0
        }
      });
    }else{
      hht.forEach(item => {
        let mesIndex = this.meses.findIndex(mes => item.mes === mes);
        if(mesIndex >= mesInicio && mesIndex <= mesFinal){
          totalHht += (item.hht)?item.hht:0
        }
      });
    }
    return Number(totalHht);
  }
  

  async cargarEventosAt(): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.reporteAtService.getAllAt().then((reportesAt: any[]) => {
        localStorage.setItem('reportesAt', JSON.stringify(reportesAt.map(at => at)));
        resolve(true);
      }).catch((err) => {
        console.error(err);
        reject(false);
      });
    });
  }

  //Eventos At
  reiniciarVariableFechaEventosAt(filter?: string){
    this.filtroFechaAt![0]=new Date(new Date().getFullYear(), 0, 1)
    this.filtroFechaAt![1]=new Date()
    this.getEventosAt(filter)
    this.selectRangoEventosAt(this.filtroFechaAt![1], 'hasta')
  } 

  getEventosAt(filter?: string){
    if(this.divisionList2.length>0){
    // this.filtroFechaAt = [];
    let divisiones: string[] = [];
    let randomEv1Dona: any[] = [];
    let auxRandomEv1Dona:any = [];
    let padreNombreList:any = [];
    let reporteAt = JSON.parse(localStorage.getItem('reportesAt')!).map((at:any) => at);
    reporteAt.forEach((at: any) => {
      padreNombreList.push(at.padreNombre);
    });
    padreNombreList.forEach((item: string) => {
      if(!divisiones.includes(item)){
        divisiones.push(item);
      }
    });
    divisiones=this.divisionList2.map((div:any)=>div.label)
    divisiones.sort();
    try {
      switch(filter){
        case 'temp':
          let eventosAttemp:any = [];
          divisiones.forEach(
            division => {
              let data = {name: division, value: 0};
              auxRandomEv1Dona= auxRandomEv1Dona.concat(reporteAt.filter((at:any) => at.padreNombre === division && at.temporal));
              data.value = reporteAt.filter((at:any) => at.padreNombre === division && at.temporal).length;
              eventosAttemp.push(data);
            }
          );
          randomEv1Dona.push(...eventosAttemp);
          Object.assign(this, {randomEv1Dona});
          break;
        case 'dir':
          let eventosAtdir:any = [];
          divisiones.forEach(
            division => {
              let data = {name: division, value: 0};
              auxRandomEv1Dona= auxRandomEv1Dona.concat(reporteAt.filter((at:any) => at.padreNombre === division && !at.temporal));
              data.value = reporteAt.filter((at:any) => at.padreNombre === division && at.temporal == null).length;
              eventosAtdir.push(data);
            }
          );
          randomEv1Dona.push(...eventosAtdir);
          Object.assign(this, {randomEv1Dona});
          break;
        default:
          throw 'error';
      }
    }catch(err){
      let eventosAt:any = [];
      divisiones.forEach(
        division => {
          let data = {name: division, value: 0};
          auxRandomEv1Dona= auxRandomEv1Dona.concat(reporteAt.filter((at:any) => at.padreNombre === division));
          data.value = reporteAt.filter((at:any) => at.padreNombre === division).length;
          eventosAt.push(data);
        }
      );
      randomEv1Dona.push(...eventosAt);
      Object.assign(this, {randomEv1Dona});
    }
    localStorage.setItem('reporteAtList', JSON.stringify(auxRandomEv1Dona.map((at:any) => at)));}
  }

  selectRangoEventosAt(event: Date | any, filter: string){
    if(this.divisionList2.length>0){
    if(typeof this.filtroFechaAt === "undefined") this.filtroFechaAt = [];

    if(filter === 'desde'){
      this.filtroFechaAt![0] = event;
    }else if(filter === 'hasta'){
      this.filtroFechaAt![1] = event;
    }
    
    if(this.filtroFechaAt![0] && this.filtroFechaAt![1]){
      let dataEv1Dona: any[] = JSON.parse(localStorage.getItem('reporteAtList')!);
      let listaDivisiones: any[] = dataEv1Dona.map(at => at.padreNombre);
      let divisiones: any[] = listaDivisiones.filter((item, index) => {
        return listaDivisiones.indexOf(item) === index;
      });
      divisiones=this.divisionList2.map((div:any)=>div.label)

      let dateFinal: Date = new Date(new Date(this.filtroFechaAt![1]).setMonth(new Date(this.filtroFechaAt![1]).getMonth()+1));
      dataEv1Dona = dataEv1Dona.filter(at => at.fechaReporte >= this.filtroFechaAt![0] && at.fechaReporte < dateFinal);

      //nuevo
        let reportesAtCopyDiv: any[]=[]
        if(this.selectPais2)if(this.selectPais2!='Corona Total')dataEv1Dona = dataEv1Dona.filter(at => at.pais == this.selectPais2);
        if(this.selectedDivisionResumen2)dataEv1Dona= dataEv1Dona.filter(at => at.padreNombre == this.selectedDivisionResumen2);
        if(this.PlantaSelect2)if(this.PlantaSelect2.length>0){
          reportesAtCopyDiv=[]
          this.PlantaSelect2.forEach((element:any) => {
            reportesAtCopyDiv=reportesAtCopyDiv.concat(dataEv1Dona.filter(at => at.nombrePlanta == element));
          });
          dataEv1Dona=[...reportesAtCopyDiv]
        }
      //fin nuevo

      let randomEv1Dona: any[] = [];
      
      divisiones.forEach(division => {
        let data = {name: division, value: 0};
        data.value = dataEv1Dona.filter(at => at.padreNombre === division).length;
        randomEv1Dona.push(data);
      });
      Object.assign(this, {randomEv1Dona});
    }}
  }

  //Dias perdidos
  reiniciarVariableFechaDiasPerdidos(filter?: string){
    this.filtroFechaDiasPerdidos[0]=new Date(new Date().getFullYear(), 0, 1)
    this.filtroFechaDiasPerdidos[1]=new Date()
    this.getDiasPerdidosAt(filter)
    this.selectRangoDiasPerdidosAt(this.filtroFechaDiasPerdidos[1], 'hasta')
  }

  getDiasPerdidosAt(filter?: string){
    //this.filtroFechaDiasPerdidos = [];
    // this.filtroFechaAt = [];
    if(this.divisionList3.length>0){let divisiones: string[] = [];
    let randomEv1Donadb:any = [];
    let auxRandomEv1Donadb:any = [];
    let listaDivisionesDp:any;
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!);
    listaDivisionesDp = reportesAt.map(atDp => atDp.padreNombre);
    divisiones = listaDivisionesDp.filter((item:any, index:any) => {
      return listaDivisionesDp.indexOf(item) === index; 
    }).sort();

    divisiones=this.divisionList3.map((div:any)=>div.label)
    divisiones.sort();

    try {
      switch(filter){
        case 'temp':
          divisiones.forEach(division => {
            let data = {name: division, value: 0};
            auxRandomEv1Donadb = auxRandomEv1Donadb.concat(reportesAt.filter(at => at.padreNombre === division && at.incapacidades !== null 
                                                            && at.incapacidades !== 'null' && at.temporal));
            data.value = reportesAt.filter(at => at.padreNombre === division && at.incapacidades !== null 
                                                && at.incapacidades !== 'null' && at.temporal)
                                  .reduce((count, itemActual) => {
                                    return count + JSON.parse(itemActual.incapacidades).reduce((count2:any, dataIncapacidad:any) => {
                                      return count2 + dataIncapacidad.diasAusencia;
                                    }, 0);
                                  }, 0);
            randomEv1Donadb.push(data);
          });
          Object.assign(this, {randomEv1Donadb});
          break;
        case 'dir':
          divisiones.forEach(division => {
            let data = {name: division, value: 0};
            auxRandomEv1Donadb = auxRandomEv1Donadb.concat(reportesAt.filter(at => at.padreNombre === division && at.incapacidades !== null 
                                                                                  && at.incapacidades !== 'null' && !at.temporal));
            data.value = reportesAt
                          .filter(at => at.padreNombre === division 
                                          && at.incapacidades !== null 
                                          && at.incapacidades !== 'null' && !at.temporal)
                          .reduce((cont, itemActual) => {
                            return cont + JSON.parse(itemActual.incapacidades).reduce((cont2:any, dataIncapacidad:any) => {
                              return cont2 + dataIncapacidad.diasAusencia;
                            }, 0);
                          }, 0);
            randomEv1Donadb.push(data);
          });
          Object.assign(this, {randomEv1Donadb});
          break;
        default:
          throw 'error';
        }
    }catch (error) {
      divisiones.forEach(division => {
        let data = {name: division, value: 0};
        auxRandomEv1Donadb = auxRandomEv1Donadb.concat(reportesAt.filter(at => at.padreNombre === division && at.incapacidades !== null 
                                                                              && at.incapacidades !== 'null'));
        data.value = reportesAt
                      .filter(at => at.padreNombre === division && at.incapacidades !== null && at.incapacidades !== 'null')
                      .reduce((count, itemActual) => {
                        return count + JSON.parse(itemActual.incapacidades).reduce((count2:any, dataIncapacidad:any) => {
                          return count2 + dataIncapacidad.diasAusencia;
                        }, 0);
                      }, 0);
        randomEv1Donadb.push(data);
      });
      Object.assign(this, {randomEv1Donadb});
    }
    localStorage.setItem('diasPerdidosAtList', JSON.stringify(auxRandomEv1Donadb.map((at:any) => at)));}
  }

  selectRangoDiasPerdidosAt(event: Date | any, filter: string){
    if(this.divisionList3.length>0){if(typeof this.filtroFechaDiasPerdidos === "undefined") this.filtroFechaDiasPerdidos = [];

    if(filter === 'desde'){
      this.filtroFechaDiasPerdidos[0] = new Date(event);
    }else if(filter === 'hasta'){
      this.filtroFechaDiasPerdidos[1] = new Date(event);
    }
    
    if(this.filtroFechaDiasPerdidos[0] && this.filtroFechaDiasPerdidos[1]){
      let dataDiasPerdidosAtList: any[] = JSON.parse(localStorage.getItem('diasPerdidosAtList')!);
      let listaDivisiones: any[] = dataDiasPerdidosAtList.map(at => at.padreNombre);
      let divisiones: any[] = listaDivisiones.filter((item, index) => {
        return listaDivisiones.indexOf(item) === index;
      });

      divisiones=this.divisionList3.map((div:any)=>div.label)
      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais3)if(this.selectPais3!='Corona Total')dataDiasPerdidosAtList = dataDiasPerdidosAtList.filter(at => at.pais == this.selectPais3);
      if(this.selectedDivisionResumen3)dataDiasPerdidosAtList= dataDiasPerdidosAtList.filter(at => at.padreNombre == this.selectedDivisionResumen3);
      if(this.PlantaSelect3)if(this.PlantaSelect3.length>0){
        reportesAtCopyDiv=[]
        this.PlantaSelect3.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(dataDiasPerdidosAtList.filter(at => at.nombrePlanta == element));
        });
        dataDiasPerdidosAtList=[...reportesAtCopyDiv]
      }
      //fin nuevo
      let dateFinal: Date = new Date(new Date(this.filtroFechaDiasPerdidos[1]).setMonth(new Date(this.filtroFechaDiasPerdidos[1]).getMonth()+1));
      dataDiasPerdidosAtList = dataDiasPerdidosAtList.filter(at => at.fechaReporte >= this.filtroFechaDiasPerdidos[0] && at.fechaReporte < dateFinal);
      let randomEv1Donadb: any[] = [];
      divisiones.forEach(division => {
        let data = {name: division, value: 0};
        data.value = dataDiasPerdidosAtList.filter(at => at.padreNombre === division && at.incapacidades != null && at.incapacidades != 'null')
                                            .reduce((count, item) => {
                                              return count + JSON.parse(item.incapacidades).reduce((count2:any, dataIncapacidad:any) => {
                                                return count2 + dataIncapacidad.diasAusencia;
                                              }, 0)
                                            }, 0);
        randomEv1Donadb.push(data);
      });
      Object.assign(this, {randomEv1Donadb});
    }}
  }

  // Primera grafica tasas
  async getTasas_1(filter?: string){
    let flagCoronaTotal:boolean=false
    if(this.selectPais4){
      if(this.selectPais4=='Corona Total')flagCoronaTotal=true
      else flagCoronaTotal=false
    }else flagCoronaTotal=false

    if(this.plantasList4 || flagCoronaTotal)
    if(this.plantasList4.length>0 || (flagCoronaTotal && this.divisionList4.length>0)){
      let tasaFrecuencia1: any[] = [];
      let filterQuery = new FilterQuery();

      if(!this.tasaDesde && !this.tasaHasta) return;
      
      // Obtener At y filtrarlos si se han seleccionado meses
      let reportesAt: any[] = [];
      if (this.selectedMesesTasa1.length > 0) {
        reportesAt = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => {
          let fechaReporte = new Date(at.fechaReporte);
          if(fechaReporte.getFullYear() === this.filtroAnioTasa_1
            && this.selectedMesesTasa1.includes(this.Meses[fechaReporte.getMonth()].value)){
              return at;
          }
          return false;
        });
      } else {
        reportesAt = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.filtroAnioTasa_1);
      }

      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais4)if(this.selectPais4!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais4);
      if(!flagCoronaTotal)if(this.selectedDivisionResumen4)reportesAt= reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen4);
      if(flagCoronaTotal)if(this.selectedDivisionResumen4)if(this.selectedDivisionResumen4.length>0){
        reportesAtCopyDiv=[]
        this.selectedDivisionResumen4.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.padreNombre == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      if(this.PlantaSelect4)if(this.PlantaSelect4.length>0){
        reportesAtCopyDiv=[]
        this.PlantaSelect4.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element.nombre));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      //fin nuevo
      // let listaDivisiones: any[] = reportesAt.map(at => at.padreNombre);
      // let divisiones: any[] = listaDivisiones.filter((item, index) => {
      //   return listaDivisiones.indexOf(item) === index;
      // }).sort();
      if(filter!='filtro')this.filterMemoryTasas_1=filter

      try{
        switch (filter) {
          case 'dir':
            reportesAt = reportesAt.filter(at => at.temporal === null);
            throw 'dir';
          case 'temp':
            reportesAt = reportesAt.filter(at => at.temporal);
            throw 'temp';
          default:
            throw 'err';
        }
      }catch (e){
        // if(this.tasaDesde && this.tasaHasta){
        //   reportesAt = reportesAt.filter(at => at.fechaReporte > this.tasaDesde && at.fechaReporte < this.tasaHasta);
        // }
        filterQuery.sortOrder = SortOrder.ASC;
        filterQuery.sortField = "id";
        filterQuery.fieldList=this.fieldHht;
        filterQuery.filterList = [
          {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_1.toString()},
          {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
        ];
        if(this.selectPais4)if(this.selectPais4 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais4.toString()})
        if(this.selectedDivisionResumen4)if(!flagCoronaTotal)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen4).id.toString()})
        // if(this.PlantaSelect4)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.nombre", value1: this.PlantaSelect4.toString()})
        
        await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {
          let hhtTemp: Array<any>;
          let filterQuery2 = new FilterQuery();
          filterQuery2.sortField = "id";
          filterQuery2.fieldList=this.fieldHht;
          filterQuery2.filterList = [
            {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_1.toString()},
            {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
            {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
          ];
          if(this.selectPais4)if(this.selectPais4 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais4.toString()})
          if(this.selectedDivisionResumen4)if(!flagCoronaTotal)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen4).id.toString()})

          await this.hhtService.findByFilter(filterQuery2)
          .then((res2: any) => {
            hhtTemp = Array.from(res2.data);

          }).catch((err: any) => {
            console.error('Error al leer hht de temporales', err);
          });

          if(res.data.length > 0 || hhtTemp!) {
            let trabajadoresTotalesMes=0
            let totalTrabajadoresTempMes=0
            let totalDiasPerdidos=0
            let AtMortalesTotal=0
            let variableGraf=(flagCoronaTotal?this.divisionesCoronaConId:this.plantasList4)
            variableGraf.forEach((plantas:any) => {
            // this.plantasList4.forEach((plantas:any) => {
            // this.divisionesCoronaConId.forEach(division => {

              let plantaL=(flagCoronaTotal)?plantas:plantas.value
              let trabajadoresTotales = 0;
              let mesesFiltrados = 0;
              let data:any = {
                name: plantaL.nombre,
                series: []
              };             
              
              res.data.forEach((eleHHt:any) => {
                // let data: DataHht = <DataHht>JSON.parse(elem.valor).Data;
                // console.log(data)
                let trabajadoresPorPlanta = 0;
                if(this.selectedMesesTasa1.length > 0){  
                  if(this.selectedMesesTasa1.includes(eleHHt.mes)){
                      if (plantaL.id === eleHHt[flagCoronaTotal?'planta_area_id':'planta_id']) {
                        trabajadoresPorPlanta += eleHHt.numeroPersonas? eleHHt.numeroPersonas : 0;
                      }
                    trabajadoresTotales += trabajadoresPorPlanta;
                    mesesFiltrados++;
                  }
                }else{
                  if (plantaL.id === eleHHt[flagCoronaTotal?'planta_area_id':'planta_id']) {
                    trabajadoresPorPlanta += eleHHt.numeroPersonas? eleHHt.numeroPersonas : 0;
                    // trabajadoresTotales += eleHHt.numeroPersonas? eleHHt.numeroPersonas : 0

                  }
                  trabajadoresTotales += trabajadoresPorPlanta;
                }
              });          
              trabajadoresTotalesMes += trabajadoresTotales

              if(mesesFiltrados > 0) trabajadoresTotales = trabajadoresTotales / mesesFiltrados;

              let totalTrabajadoresTemp = 0;
              let trabajadoresPorMes:any = [];
              this.meses.forEach((mes, index) => {
                let totalTrabajadoresMes = 0;
                if(this.selectedMesesTasa1.length > 0){
                  if(this.selectedMesesTasa1.includes(mes)){
                    hhtTemp.forEach((hht:any, indexHHT) => {
                      if(mes === hht.mes){
                        if (plantaL.id === hht[flagCoronaTotal?'planta_area_id':'planta_id']) {
                          let totalTrabajadores = hht.numeroPersonas? hht.numeroPersonas! : 0;
                          totalTrabajadoresMes += totalTrabajadores;
                        }
                      }
                    });
                  }
                }else{
                  hhtTemp.forEach((hht, indexHHT) => {
                      if (plantaL.id === hht[flagCoronaTotal?'planta_area_id':'planta_id']) {
                        let totalTrabajadores = hht.numeroPersonas? hht.numeroPersonas! : 0;
                        totalTrabajadoresMes += totalTrabajadores!;
                      }
                  });
                }
                trabajadoresPorMes.push(totalTrabajadoresMes);
              });
              if(this.selectedMesesTasa1.length > 0){
                let totalTrabajadoresTemp = trabajadoresPorMes.reduce((count:any, trabajadores:any) => {
                  return count + trabajadores;
                }, 0);
                totalTrabajadoresTempMes+=totalTrabajadoresTemp;
                totalTrabajadoresTemp=totalTrabajadoresTemp / this.selectedMesesTasa1.length
              }else{
                let totalTrabajadoresTemp = trabajadoresPorMes.reduce((count:any, trabajadores:any) => {
                  return count + trabajadores;
                }, 0);
                totalTrabajadoresTempMes+=totalTrabajadoresTemp;
                totalTrabajadoresTemp=totalTrabajadoresTemp /((this.filtroAnioTasa_1==new Date().getFullYear())?new Date().getMonth()+1:12)
              }
              let totalAt = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === plantaL.nombre).length;
              let diasPerdidos = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === plantaL.nombre && at.incapacidades !== null 
                                                          && at.incapacidades !== 'null')
                                            .reduce((count, item) => {
                                              return count + JSON.parse(item.incapacidades).reduce((count2:any, incapacidad:any) => {
                                                return count2 + incapacidad.diasAusencia;
                                              }, 0);
                                            }, 0);
              totalDiasPerdidos +=diasPerdidos;
              let AtMortales = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === plantaL.nombre && at.causoMuerte === true).length;
              AtMortalesTotal+=AtMortales

              let TF = isNaN(Number((totalAt * 100)/((trabajadoresTotales+totalTrabajadoresTemp)))) ? 0.0 : Number(Number((totalAt * 100)/(trabajadoresTotales+totalTrabajadoresTemp)).toFixed(6));
              let TS = isNaN(Number((diasPerdidos * 100)/(trabajadoresTotales+totalTrabajadoresTemp))) ? 0.0 : Number(Number((diasPerdidos * 100)/(trabajadoresTotales+totalTrabajadoresTemp)).toFixed(6));
              let PAT = isNaN(Number((AtMortales * 100)/totalAt)) ? 0.0 : Number(Number((AtMortales * 100)/totalAt).toFixed(6));
              data.series.push({
                name: 'Tasa de Frecuencia',
                value: TF === Infinity ? 0 : TF
              });
              data.series.push({
                name: 'Tasa de Severidad',
                value: TS === Infinity ? 0 : TS
              });
              data.series.push({
                name: 'Proporción AT mortal',
                value: PAT === Infinity ? 0 : PAT
              });
              
              tasaFrecuencia1.push(data);
            });

            // Corona total
            let mesesYear=(this.filtroAnioTasa_1==new Date().getFullYear())?new Date().getMonth()+1:12;
            let numMesesSelect=(this.selectedMesesTasa1.length>0?this.selectedMesesTasa1.length:mesesYear)
            let totalesTrabajadores=trabajadoresTotalesMes+totalTrabajadoresTempMes

            switch (e) {
              case 'dir':
                totalesTrabajadores=trabajadoresTotalesMes
                break;
              case 'temp':
                totalesTrabajadores=totalTrabajadoresTempMes
                break;
              default:
                break;
            }

            let dataTotal:any = {
              name: (flagCoronaTotal)?'Corona Total':this.selectedDivisionResumen4,
              series: []
            };
            
            dataTotal.series.push({
              name: 'Tasa de Frecuencia',
              value: totalesTrabajadores>0?Number((reportesAt.length*100*numMesesSelect)/totalesTrabajadores):0
            });
            dataTotal.series.push({
              name: 'Tasa de Severidad',
              value: totalesTrabajadores>0?Number((totalDiasPerdidos*100*numMesesSelect)/totalesTrabajadores):0
            });
            dataTotal.series.push({
              name: 'Proporción AT mortal',
              value: reportesAt.length>0?((AtMortalesTotal*100)/reportesAt.length):0
            });
            
            tasaFrecuencia1.push(dataTotal);
            // Fin Corona total
            Object.assign(this, {tasaFrecuencia1});
            localStorage.setItem('tasaFrecuencia1', JSON.stringify(tasaFrecuencia1.map(item => item)));
            this.filtroTasas1_1();
            this.tasasNotFound = false;
          }else{
            this.tasasNotFound = true;

          };
        });
      }
    }
    
  }

  filtroTasas1_1() {
    let flagCoronaTotal:boolean=false
    if(this.selectPais4){
      if(this.selectPais4=='Corona Total')flagCoronaTotal=true
      else flagCoronaTotal=false
    }else flagCoronaTotal=false

    let tasaFrecuencia1: any[] = JSON.parse(localStorage.getItem('tasaFrecuencia1')!);

    if(flagCoronaTotal)
    if(this.selectedDivisionResumen4)
      if(this.selectedDivisionResumen4.length > 0){
        tasaFrecuencia1 = tasaFrecuencia1.filter(data => this.selectedDivisionResumen4.includes(data.name));
      }

    if(!flagCoronaTotal)
    if(this.PlantaSelect4)
    if(this.PlantaSelect4.length > 0){
      let plantas = this.PlantaSelect4.map((div:any) => div.nombre)
      tasaFrecuencia1 = tasaFrecuencia1.filter(data => plantas.includes(data.name));
    }

    if(this.selectIndicarores1)
    if(this.selectIndicarores1.length > 0){
      let indicadores = this.selectIndicarores1.map(indicador => indicador.label);
      tasaFrecuencia1.forEach(tf1 => {
        tf1.series = tf1.series.filter((dataSeries:any) => indicadores.includes(dataSeries.name));
      });
    }
    Object.assign(this, {tasaFrecuencia1});
  }

  // Comparativo primera grafica tasas

  async getTasas_1_2(filter?: string){
    let flagCoronaTotal:boolean=false
    if(this.selectPais4_2){
      if(this.selectPais4_2=='Corona Total')flagCoronaTotal=true
      else flagCoronaTotal=false
    }else flagCoronaTotal=false

    if(this.plantasList4_2 || flagCoronaTotal)
    if(this.plantasList4_2.length>0 || (flagCoronaTotal && this.divisionList4_2.length>0)){
      let tasaFrecuencia1_2: any[] = [];
      let filterQuery = new FilterQuery();

      if(!this.tasaDesde_2 && !this.tasaHasta_2) return;
      
      // Obtener At y filtrarlos si se han seleccionado meses
      let reportesAt: any[] = [];
      if (this.selectedMesesTasa1_2.length > 0) {
        reportesAt = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => {
          let fechaReporte = new Date(at.fechaReporte);
          if(fechaReporte.getFullYear() === this.filtroAnioTasa_1_2
            && this.selectedMesesTasa1_2.includes(this.Meses[fechaReporte.getMonth()].value)){
              return at;
          }
          return false;
        });
      } else {
        reportesAt = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.filtroAnioTasa_1_2);
      }

      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais4_2)if(this.selectPais4_2!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais4_2);
      if(!flagCoronaTotal)if(this.selectedDivisionResumen4_2)reportesAt= reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen4_2);
      if(flagCoronaTotal)if(this.selectedDivisionResumen4_2)if(this.selectedDivisionResumen4_2.length>0){
        reportesAtCopyDiv=[]
        this.selectedDivisionResumen4_2.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.padreNombre == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }      
      if(this.PlantaSelect4_2)if(this.PlantaSelect4_2.length>0){
        reportesAtCopyDiv=[]
        this.PlantaSelect4_2.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      //fin nuevo

      if(filter!='filtro')this.filterMemoryTasas_1_2=filter

      try{
        switch (filter) {
          case 'dir':
            reportesAt = reportesAt.filter(at => at.temporal === null);
            throw 'dir';
          case 'temp':
            reportesAt = reportesAt.filter(at => at.temporal);
            throw 'temp';
          default:
            throw 'err';
        }
      }catch (e){

        filterQuery.sortOrder = SortOrder.ASC;
        filterQuery.sortField = "id";
        filterQuery.fieldList=this.fieldHht;
        filterQuery.filterList = [
          {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_1_2.toString()},
          {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
        ];
        if(this.selectPais4_2)if(this.selectPais4_2 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais4_2.toString()})
        if(this.selectedDivisionResumen4_2)if(!flagCoronaTotal)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen4_2).id.toString()})
        
        await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {
          let hhtTemp: Array<any>;
          let filterQuery2 = new FilterQuery();
          filterQuery2.sortField = "id";
          filterQuery2.fieldList=this.fieldHht;
          filterQuery2.filterList = [
            {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_1_2.toString()},
            {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
            {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
          ];
          if(this.selectPais4_2)if(this.selectPais4_2 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais4_2.toString()})
          if(this.selectedDivisionResumen4_2)if(!flagCoronaTotal)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen4_2).id.toString()})
          await this.hhtService.findByFilter(filterQuery2)
          .then((res2: any) => {
            hhtTemp = Array.from(res2.data);

          }).catch((err: any) => {
            console.error('Error al leer hht de temporales', err);
          });

          if(res.data.length > 0 || hhtTemp!) {
            let trabajadoresTotalesMes=0
            let totalTrabajadoresTempMes=0
            let totalDiasPerdidos=0
            let AtMortalesTotal=0
            let variableGraf=(flagCoronaTotal?this.divisionesCoronaConId:this.plantasList4_2)
            variableGraf.forEach((plantas:any) => {
              let plantaL=(flagCoronaTotal)?plantas:plantas.value
              let trabajadoresTotales = 0;
              let mesesFiltrados = 0;
              let data:any = {
                name: plantaL.nombre,
                series: []
              };
             
              
              res.data.forEach((eleHHt:any) => {
                let trabajadoresPorPlanta = 0;
                if(this.selectedMesesTasa1_2.length > 0){  
                  if(this.selectedMesesTasa1_2.includes(eleHHt.mes)){
                    // elem.forEach((eleHHt:Hht) => {
                      if (plantaL.id === eleHHt[flagCoronaTotal?'planta_area_id':'planta_id']) {
                        trabajadoresPorPlanta += eleHHt.numeroPersonas? eleHHt.numeroPersonas : 0;

                      }
                    trabajadoresTotales += trabajadoresPorPlanta;

                    mesesFiltrados++;
                  }
                }else{
                    if (plantaL.id === eleHHt[flagCoronaTotal?'planta_area_id':'planta_id']) {
                      trabajadoresPorPlanta += eleHHt.numeroPersonas? eleHHt.numeroPersonas : 0;
                    }

                  trabajadoresTotales += trabajadoresPorPlanta;
                }
              });          
              trabajadoresTotalesMes += trabajadoresTotales

              if(mesesFiltrados > 0) trabajadoresTotales = trabajadoresTotales / mesesFiltrados;

              let totalTrabajadoresTemp = 0;
              let trabajadoresPorMes:any = [];
              this.meses.forEach((mes, index) => {
                let totalTrabajadoresMes = 0;
                if(this.selectedMesesTasa1_2.length > 0){
                  if(this.selectedMesesTasa1_2.includes(mes)){
                    hhtTemp.forEach((hht:any, indexHHT) => {
                      if(mes === hht.mes){
                        if (plantaL.id === hht[flagCoronaTotal?'planta_area_id':'planta_id']) {
                          let totalTrabajadores = hht.numeroPersonas? hht.numeroPersonas! : 0;
                          totalTrabajadoresMes += totalTrabajadores;

                        }
                      }
                    });
                  }
                }else{
                  hhtTemp.forEach((hht, indexHHT) => {
                      if (plantaL.id === hht[flagCoronaTotal?'planta_area_id':'planta_id']) {
                        let totalTrabajadores = hht.numeroPersonas? hht.numeroPersonas! : 0;
                        totalTrabajadoresMes += totalTrabajadores!;
                      }
                  });
                }
                trabajadoresPorMes.push(totalTrabajadoresMes);
              });
              if(this.selectedMesesTasa1_2.length > 0){
                let totalTrabajadoresTemp = trabajadoresPorMes.reduce((count:any, trabajadores:any) => {
                  return count + trabajadores;
                }, 0);
                totalTrabajadoresTempMes+=totalTrabajadoresTemp;
                totalTrabajadoresTemp=totalTrabajadoresTemp / this.selectedMesesTasa1_2.length
              }else{
                let totalTrabajadoresTemp = trabajadoresPorMes.reduce((count:any, trabajadores:any) => {
                  return count + trabajadores;
                }, 0);
                totalTrabajadoresTempMes+=totalTrabajadoresTemp;
                totalTrabajadoresTemp=totalTrabajadoresTemp /((this.filtroAnioTasa_1_2==new Date().getFullYear())?new Date().getMonth()+1:12)
              }          

              let totalAt = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === plantaL.nombre).length;

              let diasPerdidos = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === plantaL.nombre && at.incapacidades !== null 
                                                          && at.incapacidades !== 'null')
                                            .reduce((count, item) => {
                                              return count + JSON.parse(item.incapacidades).reduce((count2:any, incapacidad:any) => {
                                                return count2 + incapacidad.diasAusencia;
                                              }, 0);
                                            }, 0);
              totalDiasPerdidos +=diasPerdidos;
              let AtMortales = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === plantaL.nombre && at.causoMuerte === true).length;
              AtMortalesTotal+=AtMortales


              let TF = isNaN(Number((totalAt * 100)/((trabajadoresTotales+totalTrabajadoresTemp)))) ? 0.0 : Number(Number((totalAt * 100)/(trabajadoresTotales+totalTrabajadoresTemp)).toFixed(6));
              let TS = isNaN(Number((diasPerdidos * 100)/(trabajadoresTotales+totalTrabajadoresTemp))) ? 0.0 : Number(Number((diasPerdidos * 100)/(trabajadoresTotales+totalTrabajadoresTemp)).toFixed(6));
              let PAT = isNaN(Number((AtMortales * 100)/totalAt)) ? 0.0 : Number(Number((AtMortales * 100)/totalAt).toFixed(6));
              data.series.push({
                name: 'Tasa de Frecuencia',
                value: TF === Infinity ? 0 : TF
              });
              data.series.push({
                name: 'Tasa de Severidad',
                value: TS === Infinity ? 0 : TS
              });
              data.series.push({
                name: 'Proporción AT mortal',
                value: PAT === Infinity ? 0 : PAT
              });
              
              tasaFrecuencia1_2.push(data);
            });
            // Corona total
            let mesesYear=(this.filtroAnioTasa_1_2==new Date().getFullYear())?new Date().getMonth()+1:12;
            let numMesesSelect=(this.selectedMesesTasa1_2.length>0?this.selectedMesesTasa1_2.length:mesesYear)
            let totalesTrabajadores=trabajadoresTotalesMes+totalTrabajadoresTempMes

            switch (e) {
              case 'dir':
                totalesTrabajadores=trabajadoresTotalesMes
                break;
              case 'temp':
                totalesTrabajadores=totalTrabajadoresTempMes
                break;
              default:
                break;
            }

            let dataTotal:any = {
              name:(flagCoronaTotal)?'Corona Total':this.selectedDivisionResumen4_2,
              series: []
            };
            
            dataTotal.series.push({
              name: 'Tasa de Frecuencia',
              value: totalesTrabajadores>0?Number((reportesAt.length*100*numMesesSelect)/totalesTrabajadores):0
            });
            dataTotal.series.push({
              name: 'Tasa de Severidad',
              value: totalesTrabajadores>0?Number((totalDiasPerdidos*100*numMesesSelect)/totalesTrabajadores):0
            });
            dataTotal.series.push({
              name: 'Proporción AT mortal',
              value: reportesAt.length>0?((AtMortalesTotal*100)/reportesAt.length):0
            });
            
            tasaFrecuencia1_2.push(dataTotal);
            // Fin Corona total
            Object.assign(this, {tasaFrecuencia1_2});
            localStorage.setItem('tasaFrecuencia1_2', JSON.stringify(tasaFrecuencia1_2.map(item => item)));
            this.filtroTasas1_1_2();

            this.tasasNotFound_2 = false;
          }else{
            this.tasasNotFound_2 = true;

          };
        });
      }
    }
    
  }

  filtroTasas1_1_2() {
    let flagCoronaTotal:boolean=false
    if(this.selectPais4_2){
      if(this.selectPais4_2=='Corona Total')flagCoronaTotal=true
      else flagCoronaTotal=false
    }else flagCoronaTotal=false

    let tasaFrecuencia1_2: any[] = JSON.parse(localStorage.getItem('tasaFrecuencia1_2')!);

    if(flagCoronaTotal)
      if(this.selectedDivisionResumen4_2)
        if(this.selectedDivisionResumen4_2.length > 0){
          tasaFrecuencia1_2 = tasaFrecuencia1_2.filter(data => this.selectedDivisionResumen4_2.includes(data.name));
        }
  
  if(!flagCoronaTotal)
    if(this.PlantaSelect4_2)
      if(this.PlantaSelect4_2.length > 0){
        let plantas = this.PlantaSelect4_2.map((div:any) => div.nombre)
        tasaFrecuencia1_2 = tasaFrecuencia1_2.filter(data => plantas.includes(data.name));
      }

    // if(this.PlantaSelect4_2)
    // if(this.PlantaSelect4_2.length > 0){
    //   let plantas = this.PlantaSelect4_2.map((div:any) => div.nombre)
    //   tasaFrecuencia1_2 = tasaFrecuencia1_2.filter(data => plantas.includes(data.name));
    // }
    if(this.selectIndicarores1_2)
    if(this.selectIndicarores1_2.length > 0){
      let indicadores = this.selectIndicarores1_2.map(indicador => indicador.label);
      tasaFrecuencia1_2.forEach(tf1 => {
        tf1.series = tf1.series.filter((dataSeries:any) => indicadores.includes(dataSeries.name));
      });
    }
    Object.assign(this, {tasaFrecuencia1_2});
  }
// Grafica tasa2
  async getTasas_2(filter?: string){
    let tasaFrecuencia2: any[] = [];
    let filterQuery = new FilterQuery();

    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.filtroAnioTasa_2);

    //nuevo
    let reportesAtCopyDiv: any[]=[]
    if(this.selectPais5)if(this.selectPais5!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais5);
    if(this.selectedDivisionResumen5)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen5);
    if(this.PlantaSelect5)if(this.PlantaSelect5.length>0){
      reportesAtCopyDiv=[]
      this.PlantaSelect5.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
      });
      reportesAt=[...reportesAtCopyDiv]
    }
  //fin nuevo

    if(filter!='filtro')this.filterMemoryTasas_2=filter

    try {
      switch (this.filterMemoryTasas_2) {
        case 'dir':
          reportesAt = reportesAt.filter(at => at.temporal === null);
          throw 'dir';
        case 'temp':
          reportesAt = reportesAt.filter(at => at.temporal);
          throw 'temp';
        default:
          throw 'err';
      }
    } catch (error) {

      filterQuery.sortOrder = SortOrder.ASC;
      filterQuery.sortField = "id";
      filterQuery.fieldList=this.fieldHht;
      filterQuery.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais5)if(this.selectPais5 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais5.toString()})
      if(this.selectedDivisionResumen5)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen5).id.toString()})

        await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {

        let hhtTemp: Array<any>;
        let filterQuery2 = new FilterQuery();
        filterQuery2.sortField = "id";
        filterQuery2.fieldList=this.fieldHht;
        filterQuery2.filterList = [
          {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_2.toString()},
          {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
          {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
        ];
        if(this.selectPais5)if(this.selectPais5 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais5.toString()})
        if(this.selectedDivisionResumen5)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen5).id.toString()})

        await this.hhtService.findByFilter(filterQuery2)
        .then((res2: any) => {
          hhtTemp = Array.from(res2.data);
        }).catch((err: any) => {
          console.error('Error al leer hht de temporales', err);
        });

        if(res.data.length > 0 || hhtTemp!){
          this.Meses.forEach((mes, index) => {

            let trabajadoresTotales2 = 0;
            let totalAt = 0;
            let diasPerdidos = 0;
            let atMortales = 0;
            let data:any = {
              name: mes.label,
              series: []
            };

            res.data.forEach((elem:any) => {
              let trabajadoresPorArea = 0;
              
              if(this.PlantaSelect5){
                if(this.PlantaSelect5.length>0){
                  this.PlantaSelect5.forEach((pl:any) => {
                    if(elem.mes === mes.label){
                      if(pl==elem.planta_nombre)trabajadoresPorArea += elem.numeroPersonas ? elem.numeroPersonas:0
                    }
                });
                trabajadoresTotales2 += trabajadoresPorArea;}
                else {
                  if(elem.mes === mes.label){
                    trabajadoresPorArea += elem.numeroPersonas ? elem.numeroPersonas:0
                  }
                  trabajadoresTotales2 += trabajadoresPorArea;
                }
              } else {
                if(elem.mes === mes.label){
                  trabajadoresPorArea += elem.numeroPersonas ? elem.numeroPersonas:0
                }
                trabajadoresTotales2 += trabajadoresPorArea;
              }
            });
            let totalTrabajadoresTemp = 0;
            hhtTemp.forEach((hht, index) => {
 
              let trabajadoresTemPorArea = 0;

              if(this.PlantaSelect5){
                if(this.PlantaSelect5.length>0){
                  this.PlantaSelect5.forEach((pl:any) => {
                    if(hht.mes === mes.label){
                      if(pl==hht.planta_nombre)trabajadoresTemPorArea += hht.numeroPersonas ? hht.numeroPersonas:0

                    }
                  });
                  totalTrabajadoresTemp += trabajadoresTemPorArea;
                }else {
                  if(hht.mes == mes.label){
                    totalTrabajadoresTemp += hht.numeroPersonas ? hht.numeroPersonas : 0;
                  }
                }
              } else {
                if(hht.mes == mes.label){
                  totalTrabajadoresTemp += hht.numeroPersonas ? hht.numeroPersonas : 0;
                }
              }
            });

            totalAt = reportesAt.filter(at => index === new Date(at.fechaReporte).getMonth()).length;
            
            diasPerdidos = reportesAt.filter(at => index === new Date(at.fechaReporte).getMonth() && at.incapacidades !== null && at.incapacidades !== 'null')
                                                  .reduce((count, item) => {
                                                    return count + JSON.parse(item.incapacidades).reduce((count2:any, incapacidad:any) => {
                                                      return count2 + incapacidad.diasAusencia;
                                                    }, 0);
                                                  }, 0);
            
                                                  atMortales = reportesAt.filter(at => index === new Date(at.fechaReporte).getMonth() && at.causoMuerte === true).length;

            let tasaFrecuencia = Number(Number((totalAt * 100)/(trabajadoresTotales2+totalTrabajadoresTemp)).toFixed(6));
            data.series.push({
              name: 'Tasa de Frecuencia',
              value: isNaN(tasaFrecuencia) || tasaFrecuencia === Infinity ? 0.0 : tasaFrecuencia
            });
            let tasaSeveridad = Number(Number((diasPerdidos * 100)/(trabajadoresTotales2+totalTrabajadoresTemp)).toFixed(6));
            data.series.push({
              name: 'Tasa de Severidad',
              value: isNaN(tasaSeveridad) || tasaSeveridad === Infinity ? 0.0 : tasaSeveridad
            });
            let proporcionAtMortal = Number(Number((atMortales * 100)/totalAt).toFixed(6));
            data.series.push({
              name: 'Proporción AT mortal',
              value: isNaN(proporcionAtMortal) || proporcionAtMortal === Infinity ? 0.0 : proporcionAtMortal 
            });
            
            tasaFrecuencia2.push(data);
          });
          
          localStorage.setItem('tasaFrecuencia2', JSON.stringify(tasaFrecuencia2));
          Object.assign(this, {tasaFrecuencia2});
          this.filtroTasas_2();
          this.tasasNotFound2 = false;
        }else{
          this.tasasNotFound2 = true;
        }
      });
    }
  }

  filtroTasas_2(){

    let tasaFrecuencia2 = JSON.parse(localStorage.getItem('tasaFrecuencia2')!);
    if(this.selectMeses1.length > 0){
      tasaFrecuencia2 = tasaFrecuencia2.filter((tasaXMes:any) => this.selectMeses1.includes(tasaXMes.name));
    }

    if(this.selectIndicarores2.length > 0){
      let indicadores = this.selectIndicarores2.map(el => el.label);
      tasaFrecuencia2 = tasaFrecuencia2.map((tasaXMes:any) => {
        return {
          name: tasaXMes.name,
          series: tasaXMes.series.filter((el:any) => indicadores.includes(el.name))
        }
      })
    }

    Object.assign(this, {tasaFrecuencia2});
  }
// Grafica tasa2 Comparativo
  async getTasas_2_2(filter?: string){
  let tasaFrecuencia2_2: any[] = [];
  let filterQuery = new FilterQuery();

  let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.filtroAnioTasa_2_2);

  //nuevo
  let reportesAtCopyDiv: any[]=[]
  if(this.selectPais5_2)if(this.selectPais5_2!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais5_2);
  if(this.selectedDivisionResumen5_2)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen5_2);
  if(this.PlantaSelect5_2)if(this.PlantaSelect5_2.length>0){
    reportesAtCopyDiv=[]
    this.PlantaSelect5_2.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
    });
    reportesAt=[...reportesAtCopyDiv]
  }
//fin nuevo

  if(filter!='filtro')this.filterMemoryTasas_2_2=filter

  try {
    switch (this.filterMemoryTasas_2_2) {
      case 'dir':
        reportesAt = reportesAt.filter(at => at.temporal === null);
        throw 'dir';
      case 'temp':
        reportesAt = reportesAt.filter(at => at.temporal);
        throw 'temp';
      default:
        throw 'err';
    }
  } catch (error) {
    
    // if(this.filtroDivisionesTasa_2 && this.filtroDivisionesTasa_2 !== 'Corona total') reportesAt = reportesAt
    // .filter(at => this.filtroDivisionesTasa_2 === at.padreNombre);

    filterQuery.sortOrder = SortOrder.ASC;
    filterQuery.sortField = "id";
    filterQuery.fieldList=this.fieldHht;
    filterQuery.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_2_2.toString()},
      {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
    ];
    if(this.selectPais5_2)if(this.selectPais5_2 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais5_2.toString()})
    if(this.selectedDivisionResumen5_2)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen5_2).id.toString()})
    // if(this.PlantaSelect5)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.nombre", value1: this.PlantaSelect5.toString()})
    await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {

      let hhtTemp: Array<any>;
      let filterQuery2 = new FilterQuery();
      filterQuery2.sortField = "id";
      filterQuery2.fieldList=this.fieldHht;
      filterQuery2.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_2_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
        {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais5_2)if(this.selectPais5_2 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais5_2.toString()})
      if(this.selectedDivisionResumen5_2)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen5_2).id.toString()})
      // if(this.PlantaSelect5)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.nombre", value1: this.PlantaSelect5.toString()})
      await this.hhtService.findByFilter(filterQuery2)
      .then((res2: any) => {
        hhtTemp = Array.from(res2.data);
      }).catch((err: any) => {
        console.error('Error al leer hht de temporales', err);
      });

      if(res.data.length > 0 || hhtTemp!){
        this.Meses.forEach((mes, index) => {

          let trabajadoresTotales2 = 0;
          let totalAt = 0;
          let diasPerdidos = 0;
          let atMortales = 0;
          let data:any = {
            name: mes.label,
            series: []
          };

          res.data.forEach((elem:any) => {
            // let data: DataHht = <DataHht>JSON.parse(elem.valor).Data;
            let trabajadoresPorArea = 0;
            
            // if(this.filtroDivisionesTasa_2 && this.filtroDivisionesTasa_2 !== 'Corona total'){
            if(this.PlantaSelect5_2){
              if(this.PlantaSelect5_2.length>0){
                this.PlantaSelect5_2.forEach((pl:any) => {
                  if(elem.mes === mes.label){
                    if(pl==elem.planta_nombre)trabajadoresPorArea += elem.numeroPersonas ? elem.numeroPersonas:0

                    // data.Areas!.forEach((dataArea, indexArea) => {
                    //   let div = this.divisionesCoronaConId.find(div => div.id == dataArea.id);
                    //   if (div.nombre === this.filtroDivisionesTasa_2) {
                    //     trabajadoresPorArea += dataArea.NumPersonasArea!;
                    //   }
                    // });
                  }
              });
              
              trabajadoresTotales2 += trabajadoresPorArea;
              }else {
                if(elem.mes === mes.label){
                  trabajadoresPorArea += elem.numeroPersonas ? elem.numeroPersonas:0
                  // data.Areas!.forEach(area => {
                  //   trabajadoresPorArea += area.NumPersonasArea != null ? area.NumPersonasArea : 0;
                  // });
                }
                trabajadoresTotales2 += trabajadoresPorArea;
              }
            } else {
              if(elem.mes === mes.label){
                trabajadoresPorArea += elem.numeroPersonas ? elem.numeroPersonas:0
                // data.Areas!.forEach(area => {
                //   trabajadoresPorArea += area.NumPersonasArea != null ? area.NumPersonasArea : 0;
                // });
              }
              trabajadoresTotales2 += trabajadoresPorArea;
            }
          });
          let totalTrabajadoresTemp = 0;
          hhtTemp.forEach((hht, index) => {
            // let data: DataHht = <DataHht>JSON.parse(hht.valor!).Data;//revisar

            let trabajadoresTemPorArea = 0;

            // if(this.filtroDivisionesTasa_2 && this.filtroDivisionesTasa_2 !== 'Corona total'){
            if(this.PlantaSelect5_2){
              if(this.PlantaSelect5_2.length>0){
              this.PlantaSelect5_2.forEach((pl:any) => {
                if(hht.mes === mes.label){
                  if(pl==hht.planta_nombre)totalTrabajadoresTemp += hht.numeroPersonas ? hht.numeroPersonas:0

                  // data.Areas!.forEach((dataArea, indexArea) => {
                  //   let div = this.divisionesCoronaConId.find(div => div.id == dataArea.id);
                  //   if (div.nombre === this.filtroDivisionesTasa_2) {
                  //     trabajadoresPorArea += dataArea.NumPersonasArea!;
                  //   }
                  // });
                }
              });
              // data.Areas!.forEach((dataArea, index) => {
              //   let div = this.divisionesCoronaConId.find(div => div.id == dataArea.id);
              //   if(div.nombre === this.filtroDivisionesTasa_2){
              //     trabajadoresTemPorArea += dataArea.NumPersonasArea!;
              //   }
              // });
              totalTrabajadoresTemp += trabajadoresTemPorArea;}
              else {
                if(hht.mes == mes.label){
                  totalTrabajadoresTemp += hht.numeroPersonas ? hht.numeroPersonas : 0;
                }
              }
            } else {
              if(hht.mes == mes.label){
                totalTrabajadoresTemp += hht.numeroPersonas ? hht.numeroPersonas : 0;
              }
            }
          });

          totalAt = reportesAt.filter(at => index === new Date(at.fechaReporte).getMonth()).length;
          
          diasPerdidos = reportesAt.filter(at => index === new Date(at.fechaReporte).getMonth() && at.incapacidades !== null && at.incapacidades !== 'null')
                                                .reduce((count, item) => {
                                                  return count + JSON.parse(item.incapacidades).reduce((count2:any, incapacidad:any) => {
                                                    return count2 + incapacidad.diasAusencia;
                                                  }, 0);
                                                }, 0);
          
                                                atMortales = reportesAt.filter(at => index === new Date(at.fechaReporte).getMonth() && at.causoMuerte === true).length;

          let tasaFrecuencia = Number(Number((totalAt * 100)/(trabajadoresTotales2+totalTrabajadoresTemp)).toFixed(6));
          data.series.push({
            name: 'Tasa de Frecuencia',
            value: isNaN(tasaFrecuencia) || tasaFrecuencia === Infinity ? 0.0 : tasaFrecuencia
          });
          let tasaSeveridad = Number(Number((diasPerdidos * 100)/(trabajadoresTotales2+totalTrabajadoresTemp)).toFixed(6));
          data.series.push({
            name: 'Tasa de Severidad',
            value: isNaN(tasaSeveridad) || tasaSeveridad === Infinity ? 0.0 : tasaSeveridad
          });
          let proporcionAtMortal = Number(Number((atMortales * 100)/totalAt).toFixed(6));
          data.series.push({
            name: 'Proporción AT mortal',
            value: isNaN(proporcionAtMortal) || proporcionAtMortal === Infinity ? 0.0 : proporcionAtMortal 
          });
          
          tasaFrecuencia2_2.push(data);
        });
        
        localStorage.setItem('tasaFrecuencia2_2', JSON.stringify(tasaFrecuencia2_2));
        Object.assign(this, {tasaFrecuencia2_2});
        this.filtroTasas_2();
        this.tasasNotFound2_2 = false;
      }else{
        this.tasasNotFound2_2 = true;
      }
    });
  }
}

filtroTasas_2_2(){

  let tasaFrecuencia2_2 = JSON.parse(localStorage.getItem('tasaFrecuencia2_2')!);
  if(this.selectMeses1_2.length > 0){
    tasaFrecuencia2_2 = tasaFrecuencia2_2.filter((tasaXMes:any) => this.selectMeses1_2.includes(tasaXMes.name));
  }

  if(this.selectIndicarores2_2.length > 0){
    let indicadores = this.selectIndicarores2_2.map(el => el.label);
    tasaFrecuencia2_2 = tasaFrecuencia2_2.map((tasaXMes:any) => {
      return {
        name: tasaXMes.name,
        series: tasaXMes.series.filter((el:any) => indicadores.includes(el.name))
      }
    })
  }

  Object.assign(this, {tasaFrecuencia2_2});
}


// GRAFICA 1 EVEN

  getEventos_1(){
    let flagCoronaTotal:boolean=false
    if(this.selectPais6){
      if(this.selectPais6=='Corona Total')flagCoronaTotal=true
      else flagCoronaTotal=false
    }else flagCoronaTotal=false

    if(this.plantasList6.length>0 || flagCoronaTotal){
      let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!);
      let dataEventos1: any[] = [];
      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais6)if(this.selectPais6!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais6);
      if(!flagCoronaTotal)if(this.selectedDivisionResumen6)if(!flagCoronaTotal)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen6);
      if(flagCoronaTotal)if(this.selectedDivisionResumen6)if(this.selectedDivisionResumen6.length>0){
        reportesAtCopyDiv=[]
        this.selectedDivisionResumen6.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.padreNombre == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      if(this.PlantaSelect6)if(this.PlantaSelect6.length>0){
        reportesAtCopyDiv=[]
        this.PlantaSelect6.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      //fin nuevo


      
      let listaDivisiones = (flagCoronaTotal)?reportesAt.map(at => at.padreNombre).filter(at => at != null):reportesAt.map(at => at.nombrePlanta).filter(at => at != null);
      

      let divisiones = listaDivisiones.filter((div, index) => {
        return listaDivisiones.indexOf(div) === index;
      }).sort();


      try{
        switch (this.filtroEventos1) {
          case 'dir':
            reportesAt = reportesAt.filter(at => at.temporal === null);
            throw 'dir';
          case 'temp':
            reportesAt = reportesAt.filter(at => at.temporal !== null);
            throw 'temp';
          default:
            throw 'err';
        }
      }catch(err){
        if(this.evento1Desde && this.evento1Hasta) {
          let dateFinal: Date = new Date(new Date(this.evento1Hasta).setMonth(new Date(this.evento1Hasta).getMonth()+1));
          reportesAt = reportesAt.filter(at => at.fechaReporte >= this.evento1Desde! && at.fechaReporte < dateFinal);
        };
        
        let numAtTotal = 0;
        let numATConDiasPerdidosTotal = 0;
        let diasPerdidosTotal = 0;
        let atMortalesTotales = 0;
        let atCeroDiasTotales = 0;

        divisiones.forEach((division: any) => {
          let data:any = {
            name: division,
            series: []
          }

          let numeroAt: number = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division).length;
          let diasPerdidos: number = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta']===division && at.incapacidades!==null && at.incapacidades!=='null')
                                        .reduce((count, incapacidades) => {
                                          return count + JSON.parse(incapacidades.incapacidades).reduce((count2:any, incapacidad:any) => {
                                            return count2 + incapacidad.diasAusencia;
                                          }, 0);
                                        }, 0);
          let atMortales: number = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division && at.causoMuerte == true).length;
          let atCeroDias: number = reportesAt.filter(at => {
            if(at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division && (at.incapacidades === null || at.incapacidades === 'null')){
              return true;
            }else if(at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division){
              let contDiasPerdidos = (<Array<any>>JSON.parse(at.incapacidades))
              .reduce((count, incapacidad) => {
                return count + incapacidad.diasAusencia;
              }, 0);
              return contDiasPerdidos > 0 ? false : true;
            }
            return false;
          }).length;
          let numATConDiasPerdidos = numeroAt - atCeroDias;

          numAtTotal += numeroAt;
          diasPerdidosTotal += diasPerdidos;
          atMortalesTotales += atMortales;
          atCeroDiasTotales += atCeroDias;
          numATConDiasPerdidosTotal += numATConDiasPerdidos;

          data.series.push({
            name: this.Eventos[0].label,
            value: numeroAt
          });
          data.series.push({
            name: this.Eventos[1].label,
            value: numATConDiasPerdidos
          })
          data.series.push({
            name: this.Eventos[2].label,
            value: diasPerdidos
          });
          data.series.push({
            name: this.Eventos[3].label,
            value: atMortales
          });
          data.series.push({
            name: this.Eventos[4].label,
            value: atCeroDias
          });

          dataEventos1.push(data);
        });
        
        let dataTotal:any = {
          name: (flagCoronaTotal)?'Corona Total':this.selectedDivisionResumen6,
          series: []
        }

        dataTotal.series.push({
          name: this.Eventos[0].label,
          value: numAtTotal
        });
        dataTotal.series.push({
          name: this.Eventos[1].label,
          value: numATConDiasPerdidosTotal
        });
        dataTotal.series.push({
          name: this.Eventos[2].label,
          value: diasPerdidosTotal
        });
        dataTotal.series.push({
          name: this.Eventos[3].label,
          value: atMortalesTotales
        });
        dataTotal.series.push({
          name: this.Eventos[4].label,
          value: atCeroDiasTotales
        });

        dataEventos1.push(dataTotal);

        Object.assign(this, {dataEventos1});
        localStorage.setItem('dataEventos1', JSON.stringify(dataEventos1.map(data => data)));
        this.filtroEventos_1();
      }
    }
  }

  filtroEventos_1(){
    let flagCoronaTotal:boolean=false
    if(this.selectPais6){
      if(this.selectPais6=='Corona Total')flagCoronaTotal=true
      else flagCoronaTotal=false
    }else flagCoronaTotal=false

    let dataEventos1: any[] = JSON.parse(localStorage.getItem('dataEventos1')!);

    if(flagCoronaTotal)
    if(this.selectedDivisionResumen6)
    if(this.selectedDivisionResumen6.length > 0){
      let plantas = this.selectedDivisionResumen6.map((div:any) => div)

      dataEventos1 = dataEventos1.filter(data => plantas.includes(data.name));
    }

    if(!flagCoronaTotal)
    if(this.PlantaSelect6)
    if(this.PlantaSelect6.length > 0){
      let plantas = this.PlantaSelect6.map((div:any) => div)
      dataEventos1 = dataEventos1.filter(data => plantas.includes(data.name));
    }
    if(this.selectEventos1)
    if(this.selectEventos1.length > 0){
      let eventos = this.selectEventos1.map(ev => ev.label);
      dataEventos1 = dataEventos1.map(data => {
        return {
          name: data.name,
          series: data.series.filter((item:any) => eventos.includes(item.name))
        }
      });
    }

    Object.assign(this, {dataEventos1});
  }

  // COMPARATIVO GRAFICA 1 EVEN

  getEventos_1_2(){
    let flagCoronaTotal:boolean=false
    if(this.selectPais6_2){
      if(this.selectPais6_2=='Corona Total')flagCoronaTotal=true
      else flagCoronaTotal=false
    }else flagCoronaTotal=false

    if(this.plantasList6_2.length>0 || flagCoronaTotal){
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!);
    let dataEventos1_2: any[] = [];
    //nuevo
    let reportesAtCopyDiv: any[]=[]
    if(this.selectPais6_2)if(this.selectPais6_2!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais6_2);
    if(!flagCoronaTotal)if(this.selectedDivisionResumen6_2)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen6_2);
    if(flagCoronaTotal)if(this.selectedDivisionResumen6_2)if(this.selectedDivisionResumen6_2.length>0){
      reportesAtCopyDiv=[]
      this.selectedDivisionResumen6_2.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.padreNombre == element));
      });
      reportesAt=[...reportesAtCopyDiv]
    }
    if(this.PlantaSelect6_2)if(this.PlantaSelect6_2.length>0){
      reportesAtCopyDiv=[]
      this.PlantaSelect6_2.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
      });
      reportesAt=[...reportesAtCopyDiv]
    }
    //fin nuevo
    // let listaDivisiones = reportesAt.map(at => at.padreNombre);
    // let listaDivisiones = reportesAt.map(at => at.nombrePlanta);
    let listaDivisiones = (flagCoronaTotal)?reportesAt.map(at => at.padreNombre).filter(at => at != null):reportesAt.map(at => at.nombrePlanta).filter(at => at != null);

    // let listaDivisiones = reportesAt.map(at => at.nombrePlanta).filter(at => at != null);
    

    // let listaPlantas = reportesAt.map(at => at.nombrePlanta);


    let divisiones = listaDivisiones.filter((div, index) => {
      return listaDivisiones.indexOf(div) === index;
    }).sort();


    try{
      switch (this.filtroEventos1_2) {
        case 'dir':
          reportesAt = reportesAt.filter(at => at.temporal === null);
          throw 'dir';
        case 'temp':
          reportesAt = reportesAt.filter(at => at.temporal !== null);
          throw 'temp';
        default:
          throw 'err';
      }
    }catch(err){
      if(this.evento1Desde_2 && this.evento1Hasta_2) {
        let dateFinal: Date = new Date(new Date(this.evento1Hasta_2).setMonth(new Date(this.evento1Hasta_2).getMonth()+1));
        reportesAt = reportesAt.filter(at => at.fechaReporte >= this.evento1Desde_2! && at.fechaReporte < dateFinal);
      };
      
      let numAtTotal = 0;
      let numATConDiasPerdidosTotal = 0;
      let diasPerdidosTotal = 0;
      let atMortalesTotales = 0;
      let atCeroDiasTotales = 0;

      divisiones.forEach((division: any) => {
        let data:any = {
          name: division,
          series: []
        }

        let numeroAt: number = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division).length;
        let diasPerdidos: number = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta']===division && at.incapacidades!==null && at.incapacidades!=='null')
                                      .reduce((count, incapacidades) => {
                                        return count + JSON.parse(incapacidades.incapacidades).reduce((count2:any, incapacidad:any) => {
                                          return count2 + incapacidad.diasAusencia;
                                        }, 0);
                                      }, 0);
        let atMortales: number = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division && at.causoMuerte == true).length;
        let atCeroDias: number = reportesAt.filter(at => {
          if(at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division && (at.incapacidades === null || at.incapacidades === 'null')){
            return true;
          }else if(at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division){
            let contDiasPerdidos = (<Array<any>>JSON.parse(at.incapacidades))
            .reduce((count, incapacidad) => {
              return count + incapacidad.diasAusencia;
            }, 0);
            return contDiasPerdidos > 0 ? false : true;
          }
          return false;
        }).length;
        let numATConDiasPerdidos = numeroAt - atCeroDias;

        numAtTotal += numeroAt;
        diasPerdidosTotal += diasPerdidos;
        atMortalesTotales += atMortales;
        atCeroDiasTotales += atCeroDias;
        numATConDiasPerdidosTotal += numATConDiasPerdidos;

        data.series.push({
          name: this.Eventos[0].label,
          value: numeroAt
        });
        data.series.push({
          name: this.Eventos[1].label,
          value: numATConDiasPerdidos
        })
        data.series.push({
          name: this.Eventos[2].label,
          value: diasPerdidos
        });
        data.series.push({
          name: this.Eventos[3].label,
          value: atMortales
        });
        data.series.push({
          name: this.Eventos[4].label,
          value: atCeroDias
        });

        dataEventos1_2.push(data);
      });
      
      let dataTotal:any = {
        name: (flagCoronaTotal)?'Corona Total':this.selectedDivisionResumen6_2,
        series: []
      }

      dataTotal.series.push({
        name: this.Eventos[0].label,
        value: numAtTotal
      });
      dataTotal.series.push({
        name: this.Eventos[1].label,
        value: numATConDiasPerdidosTotal
      });
      dataTotal.series.push({
        name: this.Eventos[2].label,
        value: diasPerdidosTotal
      });
      dataTotal.series.push({
        name: this.Eventos[3].label,
        value: atMortalesTotales
      });
      dataTotal.series.push({
        name: this.Eventos[4].label,
        value: atCeroDiasTotales
      });

      dataEventos1_2.push(dataTotal);

      Object.assign(this, {dataEventos1_2});
      localStorage.setItem('dataEventos1_2', JSON.stringify(dataEventos1_2.map(data => data)));
      this.filtroEventos_1();
    }}
  }

  filtroEventos_1_2(){
    let flagCoronaTotal:boolean=false
    if(this.selectPais6_2){
      if(this.selectPais6_2=='Corona Total')flagCoronaTotal=true
      else flagCoronaTotal=false
    }else flagCoronaTotal=false

    let dataEventos1_2: any[] = JSON.parse(localStorage.getItem('dataEventos1_2')!);
    
    if(flagCoronaTotal)
      if(this.selectedDivisionResumen6_2)
        if(this.selectedDivisionResumen6_2.length > 0){
          let plantas = this.selectedDivisionResumen6_2.map((div:any) => div)
    
          dataEventos1_2 = dataEventos1_2.filter(data => plantas.includes(data.name));
        }
  
    if(!flagCoronaTotal)
      if(this.PlantaSelect6_2)
        if(this.PlantaSelect6_2.length > 0){
          let plantas = this.PlantaSelect6_2.map((div:any) => div)
          dataEventos1_2 = dataEventos1_2.filter(data => plantas.includes(data.name));
        }

    if(this.selectEventos1_2)
    if(this.selectEventos1_2.length > 0){
      let eventos = this.selectEventos1_2.map(ev => ev.label);
      dataEventos1_2 = dataEventos1_2.map(data => {
        return {
          name: data.name,
          series: data.series.filter((item:any) => eventos.includes(item.name))
        }
      });
    }

    Object.assign(this, {dataEventos1_2});
  }


  // GRAFICA EVENT 2
  getEventos_2(){
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.filtroAnioEventos2);
    let dataEventos2: any[] = [];
    //nuevo
    let reportesAtCopyDiv: any[]=[]
    if(this.selectPais7)if(this.selectPais7!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais7);
    if(this.selectedDivisionResumen7)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen7);
    if(this.PlantaSelect7)if(this.PlantaSelect7.length>0){
      reportesAtCopyDiv=[]
      this.PlantaSelect7.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
      });
      reportesAt=[...reportesAtCopyDiv]
    }
    //fin nuevo
    try{
      switch(this.filtroEventos2){
        case 'temp':
          reportesAt = reportesAt.filter(at => at.temporal !== null);
          throw 'temp';
        case 'dir':
          reportesAt = reportesAt.filter(at => at.temporal === null);
          throw 'dir';
        default: 
          throw 'err';
      }
    }catch(e){
      if(this.filtroDivisionEventos2.length > 0) reportesAt = reportesAt.filter(at => this.filtroDivisionEventos2.includes(at.padreNombre));
      this.Meses.forEach((mes, index) => {
        // if(this.Meses.length === index + 1) return;
        let data:any = {
          name: mes.label,
          series: []
        };

        let numeroAt = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index).length;
        let diasPerdidos = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index
                                                &&  at.incapacidades !== null && at.incapacidades !== 'null')
                                      .reduce((count, at) => {
                                        return count + JSON.parse(at.incapacidades).reduce((count2:any, incapacidad:any) => {
                                          return count2 + incapacidad.diasAusencia;
                                        }, 0);
                                      }, 0);
        let atMortales = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index && at.causoMuerte).length;
        let atCeroDias = reportesAt.filter(at => {
          if(new Date(at.fechaReporte).getMonth() === index && (at.incapacidades === null || at.incapacidades === 'null')){
            return true;
          }else if(new Date(at.fechaReporte).getMonth() === index){
            let contDiasPerdidos = (<Array<any>>JSON.parse(at.incapacidades))
            .reduce((count, incapacidad) => {
              return count + incapacidad.diasAusencia;
            }, 0);
            return contDiasPerdidos > 0 ? false : true;
          }
          return false;
        }).length;
        let numATConDiasPerdidos = numeroAt - atCeroDias;
        
        data.series.push({
          name: this.Eventos[0].label,
          value: numeroAt
        });
        data.series.push({
          name: this.Eventos[1].label,
          value: numATConDiasPerdidos
        });
        data.series.push({
          name: this.Eventos[2].label,
          value: diasPerdidos
        });
        data.series.push({
          name: this.Eventos[3].label,
          value: atMortales
        });
        data.series.push({
          name: this.Eventos[4].label,
          value: atCeroDias
        });
        
        dataEventos2.push(data);
      });
      Object.assign(this, {dataEventos2});
      localStorage.setItem('dataEventos2', JSON.stringify(dataEventos2.map(data => data)));
      this.filtroEventos_2();
    }
  }

  filtroEventos_2(){
    let dataEventos2: any[] = JSON.parse(localStorage.getItem('dataEventos2')!);
    
    if(this.selectMeses2)
    if(this.selectMeses2.length > 0){
      dataEventos2 = dataEventos2.filter(data => this.selectMeses2.includes(data.name));
    }

    if(this.selectEventos2)
    if(this.selectEventos2.length > 0){
      let eventos = this.selectEventos2.map(ev => ev.label);
      dataEventos2 = dataEventos2.map(data => {
        return {
          name: data.name,
          series: data.series.filter((el:any) => eventos.includes(el.name))
        }
      })
    }

    Object.assign(this, {dataEventos2});
  }

// GRAFICA EVENT 2 COMPARATIVO
    getEventos_2_2(){
      let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.filtroAnioEventos2_2);
      let dataEventos2_2: any[] = [];
      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais7_2)if(this.selectPais7_2!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais7_2);
      if(this.selectedDivisionResumen7_2)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen7_2);
      if(this.PlantaSelect7_2)if(this.PlantaSelect7_2.length>0){
        reportesAtCopyDiv=[]
        this.PlantaSelect7_2.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      //fin nuevo
      try{
        switch(this.filtroEventos2_2){
          case 'temp':
            reportesAt = reportesAt.filter(at => at.temporal !== null);
            throw 'temp';
          case 'dir':
            reportesAt = reportesAt.filter(at => at.temporal === null);
            throw 'dir';
          default: 
            throw 'err';
        }

        
      }catch(e){
        if(this.filtroDivisionEventos2_2.length > 0) reportesAt = reportesAt.filter(at => this.filtroDivisionEventos2_2.includes(at.padreNombre));
        this.Meses.forEach((mes, index) => {
          // if(this.Meses.length === index + 1) return;
          let data:any = {
            name: mes.label,
            series: []
          };
  
          let numeroAt = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index).length;
          let diasPerdidos = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index
                                                  &&  at.incapacidades !== null && at.incapacidades !== 'null')
                                        .reduce((count, at) => {
                                          return count + JSON.parse(at.incapacidades).reduce((count2:any, incapacidad:any) => {
                                            return count2 + incapacidad.diasAusencia;
                                          }, 0);
                                        }, 0);
          let atMortales = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index && at.causoMuerte).length;
          let atCeroDias = reportesAt.filter(at => {
            if(new Date(at.fechaReporte).getMonth() === index && (at.incapacidades === null || at.incapacidades === 'null')){
              return true;
            }else if(new Date(at.fechaReporte).getMonth() === index){
              let contDiasPerdidos = (<Array<any>>JSON.parse(at.incapacidades))
              .reduce((count, incapacidad) => {
                return count + incapacidad.diasAusencia;
              }, 0);
              return contDiasPerdidos > 0 ? false : true;
            }
            return false;
          }).length;
          let numATConDiasPerdidos = numeroAt - atCeroDias;
          
          data.series.push({
            name: this.Eventos[0].label,
            value: numeroAt
          });
          data.series.push({
            name: this.Eventos[1].label,
            value: numATConDiasPerdidos
          });
          data.series.push({
            name: this.Eventos[2].label,
            value: diasPerdidos
          });
          data.series.push({
            name: this.Eventos[3].label,
            value: atMortales
          });
          data.series.push({
            name: this.Eventos[4].label,
            value: atCeroDias
          });
          
          dataEventos2_2.push(data);
        });
        Object.assign(this, {dataEventos2_2});
        localStorage.setItem('dataEventos2_2', JSON.stringify(dataEventos2_2.map(data => data)));
        this.filtroEventos_2_2();
      }
    }
  
    filtroEventos_2_2(){
      let dataEventos2_2: any[] = JSON.parse(localStorage.getItem('dataEventos2_2')!);

      if(this.selectMeses2_2)
      if(this.selectMeses2_2.length > 0){
        dataEventos2_2 = dataEventos2_2.filter(data => this.selectMeses2_2.includes(data.name));
      }
  
      if(this.selectEventos2_2)
      if(this.selectEventos2_2.length > 0){
        let eventos = this.selectEventos2_2.map(ev => ev.label);
        dataEventos2_2 = dataEventos2_2.map(data => {
          return {
            name: data.name,
            series: data.series.filter((el:any) => eventos.includes(el.name))
          }
        })
      }
  
      Object.assign(this, {dataEventos2_2});
    }
  
  // GRAFICA ILI 1
  selectGetIli1(){
    if(this.flagIli1DivPla)this.getIli_1Total()
    else this.getIli_1()
  }
  selectFilterIli1(){
    if(this.flagIli1DivPla) this.filtroIli_1Total()
    else this.filtroIli_1()
  }
  async getIli_1(){
    console.log('a')
    this.divisionesCoronaIli1 = this.plantasList8.map((div:any) => {
      return  div.label;
    });
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.selectedAnioIli_1);

    //nuevo
    let reportesAtCopyDiv: any[]=[]
    if(this.selectPais8)if(this.selectPais8!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais8);
    if(this.selectedDivisionResumen8)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen8);
    if(this.PlantaSelect8)if(this.PlantaSelect8.length>0){
      reportesAtCopyDiv=[]
      this.PlantaSelect8.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
      });
      reportesAt=[...reportesAtCopyDiv]
    }
    //fin nuevo

    this.divisionesCoronaIli1.push(this.selectedDivisionResumen8)
    let dataIli_1: {
      labels: any;
      datasets: any[];
      options?: any;
    } = {
      labels: this.divisionesCoronaIli1,
      datasets: [
        {
          label: 'Meta',
          backgroundColor: 'rgb(67, 67, 72)',
          fill: false,
          tension: 0.4,
          borderWidth: 2,
          borderColor: 'rgb(67, 67, 72)',
          data: [],
          type: 'line'
        },
        {
          label: 'ILI',
          backgroundColor: 'rgb(0, 176, 240,0.5)',
          borderColor: 'rgb(0, 176, 240)',
          borderWidth: 1,
          data: []
        }
      ]
    };

    let filterQuery = new FilterQuery();
    filterQuery.sortOrder = SortOrder.ASC;
    filterQuery.sortField = "id";
    filterQuery.fieldList=this.fieldHht;
    filterQuery.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_1.toString()},
      {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
    ];

    if(this.selectPais8)if(this.selectPais8 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais8.toString()})
    if(this.selectedDivisionResumen8)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen8})

await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {
      if(this.filtroMesesIli_1.length > 0) reportesAt = reportesAt.filter(at => this.filtroMesesIli_1.includes(this.meses[new Date(at.fechaReporte).getMonth()]));

      let accidentesConDiasPerdidosTotal = 0;
      let hhtTotalEmpresa = 0;
      let hhtTotalTemp = 0;
      let diasSeveridadTotalEmp = 0;

      let listaHhtTemp: any[];
      let filterQuery2 = new FilterQuery();
      filterQuery2.sortOrder = SortOrder.ASC;
      filterQuery2.sortField = "id";
      filterQuery2.fieldList=this.fieldHht;
      filterQuery2.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_1.toString()},
        {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
        {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais8)if(this.selectPais8 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais8.toString()})
      if(this.selectedDivisionResumen8)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen8})

      await this.hhtService.findByFilter(filterQuery2)
      .then((resTemp: any) => {
        listaHhtTemp = Array.from(resTemp.data);
      }).catch(err => {
        console.error('Error al obtener hht temporales', err);
      });
      let filterQueryMeta = new FilterQuery();
      filterQueryMeta.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_1.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais8)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais8.toString()})
      let meta:any
      await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
        meta=metas.data
      })
      let divisionesList=this.divisionesCoronaIli1.map(ele=>ele)
      divisionesList.pop()
      divisionesList.forEach((planta:any, index:any) => {

        let metaCorona = 0;
        
        let accidentesConDiasPerdidos = reportesAt
        .filter(at => at.nombrePlanta === planta && at.incapacidades !== null 
          && at.incapacidades !== 'null').filter(at => {
            let diasTotales = (<Array<any>>JSON.parse(at.incapacidades))
            .reduce((count, incapacidad) => {
              return count + incapacidad.diasAusencia;
            }, 0);
            return diasTotales > 0 ? true : false;
          }).length;
        let hhtCorona = 0;
        res.data.forEach((elem:any) => {
          // let dataHHT: DataHht = <DataHht>JSON.parse(elem.valor).Data;
          if(this.filtroMesesIli_1.length > 0){
            if(this.filtroMesesIli_1.includes(elem.mes)){

              if(elem.planta_nombre == planta){
                let meta1:viewHHtMetas=meta.find((met:any)=> met.nombrePlanta==planta)
                metaCorona = Number(meta1.iliPlanta ? meta1.iliPlanta : 0);
                hhtCorona += Number(elem.hht? elem.hht : 0);
              }
            }
          }else {
            if(elem.planta_nombre == planta){
              let meta1:viewHHtMetas=meta.find((met:any)=> met.nombrePlanta==planta)
              metaCorona = Number(meta1.iliPlanta ? meta1.iliPlanta : 0);
              hhtCorona += Number(elem.hht? elem.hht : 0);
            }
          }
        });

        let hhtTemp = 0;
        listaHhtTemp.forEach((hht, index) => {
          // let data: DataHht = <DataHht>JSON.parse(hht.valor!).Data;
          if(this.filtroMesesIli_1.length > 0){
            if(this.filtroMesesIli_1.includes(hht.mes)){
              if(hht.planta_nombre == planta){
                let meta1:viewHHtMetas=meta.find((met:any)=> met.nombrePlanta==planta)
                metaCorona = Number(meta1.iliPlanta ? meta1.iliPlanta : 0);
                hhtCorona += Number(hht.hht? hht.hht : 0);
              }
            }
          }else{
            if(hht.planta_nombre == planta){
              // hht.iliAnual
              let meta1:viewHHtMetas=meta.find((met:any)=> met.nombrePlanta==planta)
              metaCorona = Number(meta1.iliPlanta ? meta1.iliPlanta : 0);
              hhtCorona += Number(hht.hht? hht.hht : 0);
            }
          }
        });
        let totalDiasSeveridad = reportesAt.filter(at => at.nombrePlanta === planta && at.incapacidades !== 'null' && at.incapacidades !== null)
                                          .reduce((count, at) => {
                                            return count + JSON.parse(at.incapacidades).reduce((count2:any, incapacidades:any) => {
                                              return count2 + incapacidades.diasAusencia;
                                            }, 0);
                                          }, 0);

        let IF = (accidentesConDiasPerdidos/(hhtCorona + hhtTemp)) * 240000;
        let IS = (totalDiasSeveridad/(hhtCorona + hhtTemp)) * 240000;
        let ILI = (IF*IS)/1000;
        
        accidentesConDiasPerdidosTotal += accidentesConDiasPerdidos;
        hhtTotalEmpresa += hhtCorona;
        hhtTotalTemp += hhtTemp;
        diasSeveridadTotalEmp += totalDiasSeveridad;
        
        dataIli_1.datasets[1].data.push(isNaN(ILI) ? 0.00 : ILI === Infinity ? 0.00 : Number(ILI.toFixed(6)));
        dataIli_1.datasets[0].data.push(metaCorona);

      });

      let IF = (accidentesConDiasPerdidosTotal / (hhtTotalEmpresa + hhtTotalTemp)) * 240000;
      let IS = (diasSeveridadTotalEmp / (hhtTotalEmpresa + hhtTotalTemp)) * 240000;
      let ILI = (IF * IS)/1000;

      dataIli_1.datasets[1].data.push(isNaN(ILI) ? 0.00 : ILI === Infinity ? 0.00 : Number(ILI.toFixed(6)));
      
      // let metaTotal = 0;
      // if(res.data[0]){
        
      //   metaTotal = res.data[0].iliAnual ? res.data[0].iliAnual : 0;
      // }

      // let metaTotal1:any = meta.find((met:any)=> met.nombreDivision==this.selectedDivisionResumen8)


      let metaTotal :number=0
      if(meta){
        if(meta.length>0)metaTotal = meta.find((met:any)=> met.nombreDivision==this.selectedDivisionResumen8).iliAnual ? meta.find((met:any)=> met.nombreDivision==this.selectedDivisionResumen8).iliAnual : 0;
      }

      dataIli_1.datasets[0].data.push(metaTotal);

      localStorage.setItem('dataIli_1', JSON.stringify(dataIli_1));
      Object.assign(this, {dataIli_1});
      this.filtroIli_1();
    });
  }

  filtroIli_1(){
    let dataIli_1: any = JSON.parse(localStorage.getItem('dataIli_1')!);

    let plantasCoronaIli1 = this.plantasList8.map((div:any) => {return div.label});

    if(this.PlantaSelect8)
    if(this.PlantaSelect8.length > 0){
      let PlantaSelect = this.PlantaSelect8.map((div:any) => div);
      plantasCoronaIli1 = plantasCoronaIli1.filter((div:any) => PlantaSelect.includes(div));
      dataIli_1.labels = plantasCoronaIli1;
      dataIli_1.datasets[1].data = dataIli_1.datasets[1].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaIli1[index]));
      dataIli_1.datasets[0].data = dataIli_1.datasets[0].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaIli1[index]));
    }

    Object.assign(this, {dataIli_1});
  }

  async getIli_1Total(){
    console.log('b')

    this.divisionesCoronaIli1 = this.divisionesCorona.map(div => {
      return  div;
    });
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.selectedAnioIli_1);
    
    //nuevo
    let reportesAtCopyDiv: any[]=[]
    if(this.selectPais8)if(this.selectPais8!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais8);
    // if(this.selectedDivisionResumen8)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen8);
    if(this.selectedDivisionResumen8)if(this.selectedDivisionResumen8.length>0){
      reportesAtCopyDiv=[]
      this.selectedDivisionResumen8.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.padreNombre == element));
      });
      reportesAt=[...reportesAtCopyDiv]
    }
    if(this.PlantaSelect8)if(this.PlantaSelect8.length>0){
      reportesAtCopyDiv=[]
      this.PlantaSelect8.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
      });
      reportesAt=[...reportesAtCopyDiv]
    }
    //fin nuevo
    
    let dataIli_1: {
      labels: any;
      datasets: any[];
      options?: any;
    } = {
      labels: this.divisionesCoronaIli1,
      datasets: [
        {
          label: 'Meta',
          backgroundColor: 'rgb(67, 67, 72)',
          fill: false,
          borderColor: 'rgb(67, 67, 72)',
          data: [],
          type: 'line'
        },
        {
          label: 'ILI',
          backgroundColor: 'rgb(124, 181, 255)',
          borderColor: 'rgb(124, 181, 255)',
          data: [],
        }
      ]
    };

    let filterQuery = new FilterQuery();
    filterQuery.sortOrder = SortOrder.ASC;
    filterQuery.sortField = "id";
    filterQuery.fieldList=this.fieldHht;
    filterQuery.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_1.toString()},
      {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
    ];

    if(this.selectPais8)if(this.selectPais8 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais8.toString()})
    // if(this.selectedDivisionResumen8)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen8})

    await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {
      if(this.filtroMesesIli_1.length > 0) reportesAt = reportesAt.filter(at => this.filtroMesesIli_1.includes(this.meses[new Date(at.fechaReporte).getMonth()]));

      let accidentesConDiasPerdidosTotal = 0;
      let hhtTotalEmpresa = 0;
      let hhtTotalTemp = 0;
      let diasSeveridadTotalEmp = 0;

      let listaHhtTemp: any[];
      let filterQuery2 = new FilterQuery();
      filterQuery2.sortOrder = SortOrder.ASC;
      filterQuery2.sortField = "id";
      filterQuery2.fieldList=this.fieldHht;
      filterQuery2.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_1.toString()},
        {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
        {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais8)if(this.selectPais8 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais8.toString()})
      // if(this.selectedDivisionResumen8)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen8})

          
      await this.hhtService.findByFilter(filterQuery2)
      .then((resTemp: any) => {
        listaHhtTemp = Array.from(resTemp.data);
      }).catch(err => {
        console.error('Error al obtener hht temporales', err);
      });

      let filterQueryMeta = new FilterQuery();
      filterQueryMeta.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_1.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais8)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais8.toString()})
      let meta:any
      await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
        meta=metas.data
      })

      this.divisionesCoronaConId.forEach((division, index) => {
        if(division.nombre=='TEST')return

        let metaCorona = 0;
        
        let accidentesConDiasPerdidos = reportesAt
        .filter(at => at.padreNombre === division.nombre && at.incapacidades !== null 
          && at.incapacidades !== 'null').filter(at => {
            let diasTotales = (<Array<any>>JSON.parse(at.incapacidades))
            .reduce((count, incapacidad) => {
              return count + incapacidad.diasAusencia;
            }, 0);
            return diasTotales > 0 ? true : false;
          }).length;
        let hhtCorona = 0;

        res.data.forEach((elem:any) => {
          if(this.filtroMesesIli_1.length > 0){
            if(this.filtroMesesIli_1.includes(elem.mes)){

              if(elem.planta_area_nombre == division.nombre){
                let meta1:viewHHtMetas=meta.find((met:any)=> met.nombreDivision==division.nombre)
                metaCorona = Number(meta1.iliDivision ? meta1.iliDivision : 0);
                hhtCorona += Number(elem.hht? elem.hht : 0);
              }
            }
          }else {
            if(elem.planta_area_nombre == division.nombre){
              let meta1:viewHHtMetas=meta.find((met:any)=> met.nombreDivision==division.nombre)
              metaCorona = Number(meta1.iliDivision ? meta1.iliDivision : 0);
              hhtCorona += Number(elem.hht? elem.hht : 0);
            }
          }
        });
        let hhtTemp = 0;
        listaHhtTemp.forEach((hht, index) => {
          if(this.filtroMesesIli_1.length > 0){
            if(this.filtroMesesIli_1.includes(hht.mes)){
              if(hht.planta_area_nombre == division.nombre){
                let meta1:viewHHtMetas=meta.find((met:any)=> met.nombreDivision==division.nombre)
                metaCorona = Number(meta1.iliDivision ? meta1.iliDivision : 0);
                hhtCorona += Number(hht.hht? hht.hht : 0);
              }
            }
          }else{
            if(hht.planta_area_nombre == division.nombre){
              let meta1:viewHHtMetas=meta.find((met:any)=> met.nombreDivision==division.nombre)
              metaCorona = Number(meta1.iliDivision ? meta1.iliDivision : 0);
              hhtCorona += Number(hht.hht? hht.hht : 0);
            }
          }
        });

        let totalDiasSeveridad = reportesAt.filter(at => at.padreNombre === division.nombre && at.incapacidades !== 'null' && at.incapacidades !== null)
                                          .reduce((count, at) => {
                                            return count + JSON.parse(at.incapacidades).reduce((count2:any, incapacidades:any) => {
                                              return count2 + incapacidades.diasAusencia;
                                            }, 0);
                                          }, 0);

        let IF = (accidentesConDiasPerdidos/(hhtCorona + hhtTemp)) * 240000;
        let IS = (totalDiasSeveridad/(hhtCorona + hhtTemp)) * 240000;
        let ILI = (IF*IS)/1000;
        
        accidentesConDiasPerdidosTotal += accidentesConDiasPerdidos;
        hhtTotalEmpresa += hhtCorona;
        hhtTotalTemp += hhtTemp;
        diasSeveridadTotalEmp += totalDiasSeveridad;
        
        dataIli_1.datasets[1].data.push(isNaN(ILI) ? 0.00 : ILI === Infinity ? 0.00 : Number(ILI.toFixed(6)));
        dataIli_1.datasets[0].data.push(metaCorona);
      });

      let IF = (accidentesConDiasPerdidosTotal / (hhtTotalEmpresa + hhtTotalTemp)) * 240000;
      let IS = (diasSeveridadTotalEmp / (hhtTotalEmpresa + hhtTotalTemp)) * 240000;
      let ILI = (IF * IS)/1000;

      dataIli_1.datasets[1].data.push(isNaN(ILI) ? 0.00 : ILI === Infinity ? 0.00 : Number(ILI.toFixed(6)));
      
      let metaTotal:Number = 0;
      if(meta){
        if(meta.length>0)metaTotal = meta[0].iliAnual ? meta[0].iliAnual : 0;
      }

      dataIli_1.datasets[0].data.push(metaTotal);
      localStorage.setItem('dataIli_1', JSON.stringify(dataIli_1));
      Object.assign(this, {dataIli_1});
      this.filtroIli_1Total();
    });
  }

  filtroIli_1Total(){
    
    let dataIli_1: any = JSON.parse(localStorage.getItem('dataIli_1')!);
    let divisionesCoronaIli1 = this.divisionesCorona.map(div => div);

    if(this.selectedDivisionResumen8)
    if(this.selectedDivisionResumen8.length>0){
      // let selectedDivisiones = this.selectedDivisionResumen8
      divisionesCoronaIli1 = divisionesCoronaIli1.filter(div => this.selectedDivisionResumen8.includes(div));
      dataIli_1.labels = divisionesCoronaIli1;
      dataIli_1.datasets[1].data = dataIli_1.datasets[1].data.filter((data:any, index:any) => this.selectedDivisionResumen8.includes(this.divisionesCorona[index]));
      dataIli_1.datasets[0].data = dataIli_1.datasets[0].data.filter((data:any, index:any) => this.selectedDivisionResumen8.includes(this.divisionesCorona[index]));
    }
    // Object.assign(this, {divisionesCoronaIli1});
    Object.assign(this, {dataIli_1});
  }

  // GRAFICA ILI 1 COMPARATIVO
  selectGetIli1_2(){
    if(this.flagIli1DivPla_2)this.getIli_1Total_2()
    else this.getIli_1_2()
  }
  selectFilterIli1_2(){
    if(this.flagIli1DivPla_2) this.filtroIli_1Total_2()
    else this.filtroIli_1_2()
  }
  async getIli_1_2(){
    console.log('c')

    this.divisionesCoronaIli1_2 = this.plantasList8_2.map((div:any) => {
      return  div.label;
    });
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.selectedAnioIli_1_2);

    //nuevo
    let reportesAtCopyDiv: any[]=[]
    if(this.selectPais8_2)if(this.selectPais8_2!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais8_2);
    if(this.selectedDivisionResumen8_2)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen8_2);
    if(this.PlantaSelect8_2)if(this.PlantaSelect8_2.length>0){
      reportesAtCopyDiv=[]
      this.PlantaSelect8_2.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
      });
      reportesAt=[...reportesAtCopyDiv]
    }
    //fin nuevo

    this.divisionesCoronaIli1_2.push(this.selectedDivisionResumen8_2)
    let dataIli_1_2: {
      labels: any;
      datasets: any[];
      options?: any;
    } = {
      labels: this.divisionesCoronaIli1_2,
      datasets: [
        {
          label: 'Meta',
          backgroundColor: 'rgb(67, 67, 72)',
          fill: false,
          tension: 0.4,
          borderWidth: 2,
          borderColor: 'rgb(67, 67, 72)',
          data: [],
          type: 'line'
        },
        {
          label: 'ILI',
          backgroundColor: 'rgb(0, 176, 240,0.5)',
          borderColor: 'rgb(0, 176, 240)',
          borderWidth: 1,
          data: []
        }
      ]
    };

    let filterQuery = new FilterQuery();
    filterQuery.sortOrder = SortOrder.ASC;
    filterQuery.sortField = "id";
    filterQuery.fieldList=this.fieldHht;
    filterQuery.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_1_2.toString()},
      {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
    ];

    if(this.selectPais8_2)if(this.selectPais8_2 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais8_2.toString()})
    if(this.selectedDivisionResumen8_2)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen8_2})

    await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {
      if(this.filtroMesesIli_1_2.length > 0) reportesAt = reportesAt.filter(at => this.filtroMesesIli_1_2.includes(this.meses[new Date(at.fechaReporte).getMonth()]));

      let accidentesConDiasPerdidosTotal = 0;
      let hhtTotalEmpresa = 0;
      let hhtTotalTemp = 0;
      let diasSeveridadTotalEmp = 0;

      let listaHhtTemp: any[];
      let filterQuery2 = new FilterQuery();
      filterQuery2.sortOrder = SortOrder.ASC;
      filterQuery2.sortField = "id";
      filterQuery2.fieldList=this.fieldHht;
      filterQuery2.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_1_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
        {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais8_2)if(this.selectPais8_2 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais8_2.toString()})
      if(this.selectedDivisionResumen8_2)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen8_2})

      await this.hhtService.findByFilter(filterQuery2)
      .then((resTemp: any) => {
        listaHhtTemp = Array.from(resTemp.data);
      }).catch(err => {
        console.error('Error al obtener hht temporales', err);
      });

      let filterQueryMeta = new FilterQuery();
      filterQueryMeta.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_1_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais8_2)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais8_2.toString()})
      let meta:any
      await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
        meta=metas.data
      })
      let divisionList:any=this.divisionesCoronaIli1_2.map(ele=>ele)
      divisionList.pop()
      divisionList.forEach((planta:any, index:any) => {

        let metaCorona = 0;
        
        let accidentesConDiasPerdidos = reportesAt
        .filter(at => at.nombrePlanta === planta && at.incapacidades !== null 
          && at.incapacidades !== 'null').filter(at => {
            let diasTotales = (<Array<any>>JSON.parse(at.incapacidades))
            .reduce((count, incapacidad) => {
              return count + incapacidad.diasAusencia;
            }, 0);
            return diasTotales > 0 ? true : false;
          }).length;
        let hhtCorona = 0;
        // let mesesFiltrados: number = 0;
        res.data.forEach((elem:any) => {
          // let dataHHT: DataHht = <DataHht>JSON.parse(elem.valor).Data;
          if(this.filtroMesesIli_1_2.length > 0){
            if(this.filtroMesesIli_1_2.includes(elem.mes)){
              if(elem.planta_nombre == planta){
                let meta1:viewHHtMetas=meta.find((met:any)=> met.nombrePlanta==planta)
                metaCorona = Number(meta1.iliPlanta ? meta1.iliPlanta : 0);
                hhtCorona += Number(elem.hht? elem.hht : 0);
              }
            }
          }else {
            if(elem.planta_nombre == planta){
              let meta1:viewHHtMetas=meta.find((met:any)=> met.nombrePlanta==planta)
              metaCorona = Number(meta1.iliPlanta ? meta1.iliPlanta : 0);
              hhtCorona += Number(elem.hht? elem.hht : 0);
            }
          }
        });

        let hhtTemp = 0;
        listaHhtTemp.forEach((hht, index) => {
          // let data: DataHht = <DataHht>JSON.parse(hht.valor!).Data;
          if(this.filtroMesesIli_1_2.length > 0){
            if(this.filtroMesesIli_1_2.includes(hht.mes)){

              if(hht.planta_nombre == planta){
                let meta1:viewHHtMetas=meta.find((met:any)=> met.nombrePlanta==planta)
                metaCorona = Number(meta1.iliPlanta ? meta1.iliPlanta : 0);
                hhtCorona += Number(hht.hht? hht.hht : 0);
              }
            }
          }else{

            if(hht.planta_nombre == planta){
              // hht.iliAnual
              let meta1:viewHHtMetas=meta.find((met:any)=> met.nombrePlanta==planta)
              metaCorona = Number(meta1.iliPlanta ? meta1.iliPlanta : 0);
              hhtCorona += Number(hht.hht? hht.hht : 0);
            }
          }
        });
        let totalDiasSeveridad = reportesAt.filter(at => at.nombrePlanta === planta && at.incapacidades !== 'null' && at.incapacidades !== null)
                                          .reduce((count, at) => {
                                            return count + JSON.parse(at.incapacidades).reduce((count2:any, incapacidades:any) => {
                                              return count2 + incapacidades.diasAusencia;
                                            }, 0);
                                          }, 0);

        let IF = (accidentesConDiasPerdidos/(hhtCorona + hhtTemp)) * 240000;
        let IS = (totalDiasSeveridad/(hhtCorona + hhtTemp)) * 240000;
        let ILI = (IF*IS)/1000;
        
        accidentesConDiasPerdidosTotal += accidentesConDiasPerdidos;
        hhtTotalEmpresa += hhtCorona;
        hhtTotalTemp += hhtTemp;
        diasSeveridadTotalEmp += totalDiasSeveridad;
        
        dataIli_1_2.datasets[1].data.push(isNaN(ILI) ? 0.00 : ILI === Infinity ? 0.00 : Number(ILI.toFixed(6)));
        dataIli_1_2.datasets[0].data.push(metaCorona);
      });

      let IF = (accidentesConDiasPerdidosTotal / (hhtTotalEmpresa + hhtTotalTemp)) * 240000;
      let IS = (diasSeveridadTotalEmp / (hhtTotalEmpresa + hhtTotalTemp)) * 240000;
      let ILI = (IF * IS)/1000;

      dataIli_1_2.datasets[1].data.push(isNaN(ILI) ? 0.00 : ILI === Infinity ? 0.00 : Number(ILI.toFixed(6)));
      
      let metaTotal :number=0
      if(meta){
        if(meta.length>0)metaTotal = meta.find((met:any)=> met.nombreDivision==this.selectedDivisionResumen8_2).iliAnual ? meta.find((met:any)=> met.nombreDivision==this.selectedDivisionResumen8_2).iliAnual : 0;
      }

      dataIli_1_2.datasets[0].data.push(metaTotal);

      localStorage.setItem('dataIli_1_2', JSON.stringify(dataIli_1_2));
      Object.assign(this, {dataIli_1_2});
      this.filtroIli_1_2();
    });
  }

  filtroIli_1_2(){
    let dataIli_1_2: any = JSON.parse(localStorage.getItem('dataIli_1_2')!);

    let plantasCoronaIli1 = this.plantasList8_2.map((div:any) => div.label);
    if(this.PlantaSelect8_2)
    if(this.PlantaSelect8_2.length > 0){
      let PlantaSelect = this.PlantaSelect8_2.map((div:any) => div);
      plantasCoronaIli1 = plantasCoronaIli1.filter((div:any) => PlantaSelect.includes(div));
      dataIli_1_2.labels = plantasCoronaIli1;
      dataIli_1_2.datasets[1].data = dataIli_1_2.datasets[1].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaIli1[index]));
      dataIli_1_2.datasets[0].data = dataIli_1_2.datasets[0].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaIli1[index]));
    }
    // Object.assign(this, {divisionesCoronaIli1});
    Object.assign(this, {dataIli_1_2});
  }

  async getIli_1Total_2(){
    console.log('d')

    this.divisionesCoronaIli1_2 = this.divisionesCorona.map(div => {
      return  div;
    });
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.selectedAnioIli_1_2);
    
    //nuevo
    let reportesAtCopyDiv: any[]=[]
    if(this.selectPais8_2)if(this.selectPais8_2!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais8_2);
    // if(this.selectedDivisionResumen8)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen8);
    if(this.selectedDivisionResumen8_2)if(this.selectedDivisionResumen8_2.length>0){
      reportesAtCopyDiv=[]
      this.selectedDivisionResumen8_2.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.padreNombre == element));
      });
      reportesAt=[...reportesAtCopyDiv]
    }
    if(this.PlantaSelect8_2)if(this.PlantaSelect8_2.length>0){
      reportesAtCopyDiv=[]
      this.PlantaSelect8_2.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
      });
      reportesAt=[...reportesAtCopyDiv]
    }
    //fin nuevo
    
    let dataIli_1_2: {
      labels: any;
      datasets: any[];
      options?: any;
    } = {
      labels: this.divisionesCoronaIli1_2,
      datasets: [
        {
          label: 'Meta',
          backgroundColor: 'rgb(67, 67, 72)',
          fill: false,
          borderColor: 'rgb(67, 67, 72)',
          data: [],
          type: 'line'
        },
        {
          label: 'ILI',
          backgroundColor: 'rgb(124, 181, 255)',
          borderColor: 'rgb(124, 181, 255)',
          data: [],
        }
      ]
    };

    let filterQuery = new FilterQuery();
    filterQuery.sortOrder = SortOrder.ASC;
    filterQuery.sortField = "id";
    filterQuery.fieldList=this.fieldHht;
    filterQuery.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_1_2.toString()},
      {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
    ];

    if(this.selectPais8_2)if(this.selectPais8_2 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais8_2.toString()})
    // if(this.selectedDivisionResumen8)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen8})

    await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {
      if(this.filtroMesesIli_1_2.length > 0) reportesAt = reportesAt.filter(at => this.filtroMesesIli_1_2.includes(this.meses[new Date(at.fechaReporte).getMonth()]));

      let accidentesConDiasPerdidosTotal = 0;
      let hhtTotalEmpresa = 0;
      let hhtTotalTemp = 0;
      let diasSeveridadTotalEmp = 0;

      let listaHhtTemp: any[];
      let filterQuery2 = new FilterQuery();
      filterQuery2.sortOrder = SortOrder.ASC;
      filterQuery2.sortField = "id";
      filterQuery2.fieldList=this.fieldHht;
      filterQuery2.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_1_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
        {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais8_2)if(this.selectPais8_2 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais8_2.toString()})

          
      await this.hhtService.findByFilter(filterQuery2)
      .then((resTemp: any) => {
        listaHhtTemp = Array.from(resTemp.data);
      }).catch(err => {
        console.error('Error al obtener hht temporales', err);
      });

      let filterQueryMeta = new FilterQuery();
      filterQueryMeta.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_1_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais8_2)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais8_2.toString()})
      let meta:any
      await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
        meta=metas.data
      })

      this.divisionesCoronaConId.forEach((division, index) => {
        if(division.nombre=='TEST')return

        let metaCorona = 0;
        
        let accidentesConDiasPerdidos = reportesAt
        .filter(at => at.padreNombre === division.nombre && at.incapacidades !== null 
          && at.incapacidades !== 'null').filter(at => {
            let diasTotales = (<Array<any>>JSON.parse(at.incapacidades))
            .reduce((count, incapacidad) => {
              return count + incapacidad.diasAusencia;
            }, 0);
            return diasTotales > 0 ? true : false;
          }).length;
        let hhtCorona = 0;

        res.data.forEach((elem:any) => {
          if(this.filtroMesesIli_1_2.length > 0){
            if(this.filtroMesesIli_1_2.includes(elem.mes)){

              if(elem.planta_area_nombre == division.nombre){
                let meta1:viewHHtMetas=meta.find((met:any)=> met.nombreDivision==division.nombre)
                metaCorona = Number(meta1.iliDivision ? meta1.iliDivision : 0);
                hhtCorona += Number(elem.hht? elem.hht : 0);
              }
            }
          }else {
            if(elem.planta_area_nombre == division.nombre){
              let meta1:viewHHtMetas=meta.find((met:any)=> met.nombreDivision==division.nombre)
              metaCorona = Number(meta1.iliDivision ? meta1.iliDivision : 0);
              hhtCorona += Number(elem.hht? elem.hht : 0);
            }
          }
        });
        let hhtTemp = 0;
        listaHhtTemp.forEach((hht, index) => {
          if(this.filtroMesesIli_1_2.length > 0){
            if(this.filtroMesesIli_1_2.includes(hht.mes)){
              if(hht.planta_area_nombre == division.nombre){
                let meta1:viewHHtMetas=meta.find((met:any)=> met.nombreDivision==division.nombre)
                metaCorona = Number(meta1.iliDivision ? meta1.iliDivision : 0);
                hhtCorona += Number(hht.hht? hht.hht : 0);
              }
            }
          }else{
            if(hht.planta_area_nombre == division.nombre){
              let meta1:viewHHtMetas=meta.find((met:any)=> met.nombreDivision==division.nombre)
              metaCorona = Number(meta1.iliDivision ? meta1.iliDivision : 0);
              hhtCorona += Number(hht.hht? hht.hht : 0);
            }
          }
        });

        let totalDiasSeveridad = reportesAt.filter(at => at.padreNombre === division.nombre && at.incapacidades !== 'null' && at.incapacidades !== null)
                                          .reduce((count, at) => {
                                            return count + JSON.parse(at.incapacidades).reduce((count2:any, incapacidades:any) => {
                                              return count2 + incapacidades.diasAusencia;
                                            }, 0);
                                          }, 0);

        let IF = (accidentesConDiasPerdidos/(hhtCorona + hhtTemp)) * 240000;
        let IS = (totalDiasSeveridad/(hhtCorona + hhtTemp)) * 240000;
        let ILI = (IF*IS)/1000;
        
        accidentesConDiasPerdidosTotal += accidentesConDiasPerdidos;
        hhtTotalEmpresa += hhtCorona;
        hhtTotalTemp += hhtTemp;
        diasSeveridadTotalEmp += totalDiasSeveridad;
        
        dataIli_1_2.datasets[1].data.push(isNaN(ILI) ? 0.00 : ILI === Infinity ? 0.00 : Number(ILI.toFixed(6)));
        dataIli_1_2.datasets[0].data.push(metaCorona);
      });

      let IF = (accidentesConDiasPerdidosTotal / (hhtTotalEmpresa + hhtTotalTemp)) * 240000;
      let IS = (diasSeveridadTotalEmp / (hhtTotalEmpresa + hhtTotalTemp)) * 240000;
      let ILI = (IF * IS)/1000;

      dataIli_1_2.datasets[1].data.push(isNaN(ILI) ? 0.00 : ILI === Infinity ? 0.00 : Number(ILI.toFixed(6)));
      
      let metaTotal:Number = 0;
      if(meta){
        if(meta.length>0)metaTotal = meta[0].iliAnual ? meta[0].iliAnual : 0;
      }

      dataIli_1_2.datasets[0].data.push(metaTotal);

      localStorage.setItem('dataIli_1_2', JSON.stringify(dataIli_1_2));
      Object.assign(this, {dataIli_1_2});
      this.filtroIli_1Total();
    });
  }

  filtroIli_1Total_2(){
    
    let dataIli_1_2: any = JSON.parse(localStorage.getItem('dataIli_1_2')!);
    let divisionesCoronaIli1 = this.divisionesCorona.map(div => div);

    if(this.selectedDivisionResumen8_2)
    if(this.selectedDivisionResumen8_2.length>0){
      // let selectedDivisiones = this.selectedDivisionResumen8
      divisionesCoronaIli1 = divisionesCoronaIli1.filter(div => this.selectedDivisionResumen8_2.includes(div));
      dataIli_1_2.labels = divisionesCoronaIli1;
      dataIli_1_2.datasets[1].data = dataIli_1_2.datasets[1].data.filter((data:any, index:any) => this.selectedDivisionResumen8_2.includes(this.divisionesCorona[index]));
      dataIli_1_2.datasets[0].data = dataIli_1_2.datasets[0].data.filter((data:any, index:any) => this.selectedDivisionResumen8_2.includes(this.divisionesCorona[index]));
    }
    // Object.assign(this, {divisionesCoronaIli1});
    Object.assign(this, {dataIli_1_2});
  }

  // GRAFICA ILI 2
  async getIli_2(event?: any){
    // this.selectDivisionesILI2 = event;
    
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.selectedAnioIli_2);

    //nuevo
    let reportesAtCopyDiv: any[]=[]
    if(this.selectPais9)if(this.selectPais9!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais9);
    if(this.selectedDivisionResumen9)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen9);
    if(this.PlantaSelect9)reportesAt=reportesAt.filter(at => at.nombrePlanta == this.PlantaSelect9);
    //fin nuevo

    let dataIli_2: {
      labels: any;
      datasets: any[];
      options?: any;
    } = {
      labels: this.meses,
      datasets: [
        {
          label: 'Meta',
          type: 'line',
          fill: false,
          tension: 0.4,
          borderWidth: 2,
          data: [],
          backgroundColor: 'rgb(67, 67, 72)',
          borderColor: 'rgb(57, 57, 72)'
        },
        {
          label: 'ILI',
          data: [],
          backgroundColor: 'rgb(0, 176, 240,0.5)',
          borderColor: 'rgb(0, 176, 240)',
          borderWidth: 1
        }
      ]
    }

    let filterQuery = new FilterQuery();
    filterQuery.sortOrder = SortOrder.ASC;
    filterQuery.sortField = "id";
    filterQuery.fieldList=this.fieldHht;
    filterQuery.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_2.toString()},
      {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
    ];
    if(this.selectPais9)if(this.selectPais9 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais9.toString()})
    if(this.selectedDivisionResumen9)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen9})

    await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {
      // if(this.selectDivisionesILI2 && this.selectDivisionesILI2 !== 'Corona total'){
      //   reportesAt = reportesAt.filter(at => this.selectDivisionesILI2 === at.padreNombre);
      // }

      let listaHhtTemp: any[];
      let filterQuery2 = new FilterQuery();
      filterQuery2.sortOrder = SortOrder.ASC;
      filterQuery2.sortField = "id";
      filterQuery2.fieldList=this.fieldHht;
      filterQuery2.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
        {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais9)if(this.selectPais9 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais9.toString()})
      if(this.selectedDivisionResumen9)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen9})

      await this.hhtService.findByFilter(filterQuery2)
      .then((resTemp: any) => {
        listaHhtTemp = Array.from(resTemp.data);
      }).catch(err => {
        console.error('Error al obtener hht temporales', err);
      });
      let filterQueryMeta = new FilterQuery();
      filterQueryMeta.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais9)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais9.toString()})
      if(this.selectedDivisionResumen9)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen9.toString()})
      let meta:any
      await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
        meta=metas.data
      })
      this.meses.forEach((mes, index) => {
        let metaCorona = 0;

        let accidentesConDiasPerdidos = reportesAt
        .filter(at => new Date(at.fechaReporte).getMonth() === index && at.incapacidades !== null 
        && at.incapacidades !== 'null'  ).filter(at => {
          let diasTotales = (<Array<any>>JSON.parse(at.incapacidades))
          .reduce((count, incapacidad) => {
            return count + incapacidad.diasAusencia;
          }, 0);
          return diasTotales > 0 ? true : false;
        }).length;
        
        let hhtCorona = 0;
        res.data.forEach((elem:any) => {
          // let dataHHT: DataHht = <DataHht>JSON.parse(elem.valor).Data;
          // if(this.selectDivisionesILI2 && this.selectDivisionesILI2 !== 'Corona total'){
          if(this.PlantaSelect9){
            if(mes == elem.mes){
              // dataHHT.Areas!.forEach(area => {
              //   let areaActual = this.divisionesCoronaConId.find(ar => ar.id == area.id).nombre;
              //   if(this.selectDivisionesILI2 === areaActual){
              //     metaCorona = Number(area.ILIArea ? area.ILIArea : 0);
              //     hhtCorona += area.HhtArea ? area.HhtArea : 0;
              //   }
              // });
              if(this.PlantaSelect9 === elem.planta_nombre){
                let meta1:viewHHtMetas=meta.find((met:any)=> met.nombrePlanta==this.PlantaSelect9)
                metaCorona = Number(meta1.iliPlanta ? meta1.iliPlanta : 0);
                hhtCorona += Number(elem.hht ? elem.hht : 0);
              }
            }
          }else {
            metaCorona = Number(meta[0].iliAnual ? meta[0].iliAnual : 0);
            if(mes == elem.mes){
              // dataHHT.Areas!.forEach(area => {
              //   hhtCorona += area.HhtArea !== null ? area.HhtArea! : 0;
              // });
              hhtCorona += Number(elem.hht ? elem.hht : 0);

            }
          }
        });

        let hhtTemp = 0;
        listaHhtTemp.forEach((hht, index) => {
          // let data: DataHht = <DataHht>JSON.parse(hht.valor!).Data;
          // if(this.selectDivisionesILI2 && this.selectDivisionesILI2 !== 'Corona total'){
          if(this.PlantaSelect9){

            if(mes == hht.mes){
              if(this.PlantaSelect9 === hht.planta_nombre){
                hhtTemp += Number(hht.hht ? hht.hht : 0);
              }
              // data.Areas!.forEach(area => {
              //   let areaActual = this.divisionesCoronaConId.find(ar => ar.id == area.id).nombre;
              //   if(this.selectDivisionesILI2 === areaActual){
              //     hhtTemp += area.HhtArea ? area.HhtArea : 0;
              //   }
              // });
            }
          }else {
            if(mes == hht.mes){
              // data.Areas!.forEach(area => {
              //   hhtTemp += area.HhtArea ? area.HhtArea : 0;
              // });
              hhtTemp += Number(hht.hht ? hht.hht : 0);
            }
          }
        });

        let totalDiasSeveridad = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index 
                                                        && at.incapacidades !== null && at.incapacidades !== 'null')
                                            .reduce((count, at) => {
                                              return count + JSON.parse(at.incapacidades).reduce((count2:any, incapacidad:any) => {
                                                return count2 + incapacidad.diasAusencia;
                                              }, 0);
                                            }, 0);


        let IF = (accidentesConDiasPerdidos / (hhtCorona + hhtTemp)) * 240000;
        let IS = (totalDiasSeveridad / (hhtCorona + hhtTemp)) * 240000;
        let ILI = (IF*IS)/1000;
        
        let ILIAux = (isNaN(ILI) ? 0.0 : ILI === Infinity ? 0.0 : Number(ILI.toFixed(6)));
        dataIli_2.datasets[1].data.push(ILIAux);
        dataIli_2.datasets[0].data.push(metaCorona);
      });

      localStorage.setItem('dataIli_2', JSON.stringify(dataIli_2));
      Object.assign(this, {dataIli_2});
      this.filtroIli_2();
    });
  }

  filtroIli_2(){
    let dataIli_2 = JSON.parse(localStorage.getItem('dataIli_2')!);
    if(this.selectMesesILI2.length > 0){
      // mesesILI2 = this.meses.filter(mes => this.selectMesesILI2.includes(mes));
      dataIli_2.labels = this.meses.filter(mes => this.selectMesesILI2.includes(mes));
      dataIli_2.datasets[1].data = dataIli_2.datasets[1].data.filter((data:any, index:any) => this.selectMesesILI2.includes(this.meses[index]));
      dataIli_2.datasets[0].data = dataIli_2.datasets[0].data.filter((data:any, index:any) => this.selectMesesILI2.includes(this.meses[index]));
    }

    Object.assign(this, {dataIli_2});
  }

  // GRAFICA ILI 2 COMPARATIVO
  async getIli_2_2(event?: any){
    // this.selectDivisionesILI2_2 = event;
    
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.selectedAnioIli_2_2);

    //nuevo
    let reportesAtCopyDiv: any[]=[]
    if(this.selectPais9_2)if(this.selectPais9_2!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais9_2);
    if(this.selectedDivisionResumen9_2)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen9_2);
    if(this.PlantaSelect9_2)reportesAt=reportesAt.filter(at => at.nombrePlanta == this.PlantaSelect9_2);
    //fin nuevo
    let dataIli_2_2: {
      labels: any;
      datasets: any[];
      options?: any;
    } = {
      labels: this.meses,
      datasets: [
        {
          label: 'Meta',
          type: 'line',
          fill: false,
          tension: 0.4,
          borderWidth: 2,
          data: [],
          backgroundColor: 'rgb(67, 67, 72)',
          borderColor: 'rgb(57, 57, 72)'
        },
        {
          label: 'ILI',
          data: [],
          backgroundColor: 'rgb(0, 176, 240,0.5)',
          borderColor: 'rgb(0, 176, 240)',
          borderWidth: 1
        }
      ]
    }

    let filterQuery = new FilterQuery();
    filterQuery.sortOrder = SortOrder.ASC;
    filterQuery.sortField = "id";
    filterQuery.fieldList=this.fieldHht;
    filterQuery.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_2_2.toString()},
      {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
    ];
    if(this.selectPais9_2)if(this.selectPais9_2 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais9_2.toString()})
    if(this.selectedDivisionResumen9_2)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen9_2})

    await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {
      // if(this.selectDivisionesILI2_2 && this.selectDivisionesILI2_2 !== 'Corona total'){
      //   reportesAt = reportesAt.filter(at => this.selectDivisionesILI2_2 === at.padreNombre);
      // }

      let listaHhtTemp: any[];
      let filterQuery2 = new FilterQuery();
      filterQuery2.sortOrder = SortOrder.ASC;
      filterQuery2.sortField = "id";
      filterQuery2.fieldList=this.fieldHht;
      filterQuery2.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_2_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
        {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais9_2)if(this.selectPais9_2 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais9_2.toString()})
      if(this.selectedDivisionResumen9_2)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen9_2})

      await this.hhtService.findByFilter(filterQuery2)
      .then((resTemp: any) => {
        listaHhtTemp = Array.from(resTemp.data);
      }).catch(err => {
        console.error('Error al obtener hht temporales', err);
      });
      let filterQueryMeta = new FilterQuery();
      filterQueryMeta.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioIli_2_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais9_2)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais9_2.toString()})
      if(this.selectedDivisionResumen9_2)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen9_2.toString()})

      let meta:any
      await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
        meta=metas.data
      })
      this.meses.forEach(async (mes, index) => {
        let metaCorona = 0;

        let accidentesConDiasPerdidos = reportesAt
        .filter(at => new Date(at.fechaReporte).getMonth() === index && at.incapacidades !== null 
        && at.incapacidades !== 'null'  ).filter(at => {
          let diasTotales = (<Array<any>>JSON.parse(at.incapacidades))
          .reduce((count, incapacidad) => {
            return count + incapacidad.diasAusencia;
          }, 0);
          return diasTotales > 0 ? true : false;
        }).length;
        
        let hhtCorona = 0;

        
        res.data.forEach((elem:any) => {
          // let dataHHT: DataHht = <DataHht>JSON.parse(elem.valor).Data;
          // if(this.selectDivisionesILI2 && this.selectDivisionesILI2 !== 'Corona total'){
          if(this.PlantaSelect9_2){
            if(mes == elem.mes){
              // dataHHT.Areas!.forEach(area => {
              //   let areaActual = this.divisionesCoronaConId.find(ar => ar.id == area.id).nombre;
              //   if(this.selectDivisionesILI2 === areaActual){
              //     metaCorona = Number(area.ILIArea ? area.ILIArea : 0);
              //     hhtCorona += area.HhtArea ? area.HhtArea : 0;
              //   }
              // });
              if(this.PlantaSelect9_2 === elem.planta_nombre){
                let meta1:viewHHtMetas=meta.find((met:any)=> met.nombrePlanta==this.PlantaSelect9_2)
                metaCorona = Number(meta1.iliPlanta ? meta1.iliPlanta : 0);
                hhtCorona += Number(elem.hht ? elem.hht : 0);
              }
            }
          }else {
            metaCorona = Number(meta[0].iliAnual ? meta[0].iliAnual : 0);
            if(mes == elem.mes){
              // dataHHT.Areas!.forEach(area => {
              //   hhtCorona += area.HhtArea !== null ? area.HhtArea! : 0;
              // });
              hhtCorona += Number(elem.hht ? elem.hht : 0);

            }
          }
        });

        let hhtTemp = 0;
        listaHhtTemp.forEach((hht, index) => {
          // let data: DataHht = <DataHht>JSON.parse(hht.valor!).Data;
          // if(this.selectDivisionesILI2 && this.selectDivisionesILI2 !== 'Corona total'){
          if(this.PlantaSelect9_2){

            if(mes == hht.mes){
              if(this.PlantaSelect9_2 === hht.planta_nombre){
                hhtTemp += Number(hht.hht ? hht.hht : 0);
              }
              // data.Areas!.forEach(area => {
              //   let areaActual = this.divisionesCoronaConId.find(ar => ar.id == area.id).nombre;
              //   if(this.selectDivisionesILI2 === areaActual){
              //     hhtTemp += area.HhtArea ? area.HhtArea : 0;
              //   }
              // });
            }
          }else {
            if(mes == hht.mes){
              // data.Areas!.forEach(area => {
              //   hhtTemp += area.HhtArea ? area.HhtArea : 0;
              // });
              hhtTemp += Number(hht.hht ? hht.hht : 0);
            }
          }
        });

        let totalDiasSeveridad = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === index 
                                                        && at.incapacidades !== null && at.incapacidades !== 'null')
                                            .reduce((count, at) => {
                                              return count + JSON.parse(at.incapacidades).reduce((count2:any, incapacidad:any) => {
                                                return count2 + incapacidad.diasAusencia;
                                              }, 0);
                                            }, 0);
        
        let IF = (accidentesConDiasPerdidos / (hhtCorona + hhtTemp)) * 240000;
        let IS = (totalDiasSeveridad / (hhtCorona + hhtTemp)) * 240000;
        let ILI = (IF*IS)/1000;
        
        let ILIAux = (isNaN(ILI) ? 0.0 : ILI === Infinity ? 0.0 : Number(ILI.toFixed(6)));
        dataIli_2_2.datasets[1].data.push(ILIAux);
        dataIli_2_2.datasets[0].data.push(metaCorona);
      });

      localStorage.setItem('dataIli_2_2', JSON.stringify(dataIli_2_2));
      Object.assign(this, {dataIli_2_2});
      this.filtroIli_2();
    });
  }

  filtroIli_2_2(){
    let dataIli_2_2 = JSON.parse(localStorage.getItem('dataIli_2_2')!);
    if(this.selectMesesILI2_2.length > 0){
      // mesesILI2 = this.meses.filter(mes => this.selectMesesILI2.includes(mes));
      dataIli_2_2.labels = this.meses.filter(mes => this.selectMesesILI2_2.includes(mes));
      dataIli_2_2.datasets[1].data = dataIli_2_2.datasets[1].data.filter((data:any, index:any) => this.selectMesesILI2_2.includes(this.meses[index]));
      dataIli_2_2.datasets[0].data = dataIli_2_2.datasets[0].data.filter((data:any, index:any) => this.selectMesesILI2_2.includes(this.meses[index]));
    }

    Object.assign(this, {dataIli_2_2});
  }

  // Septimo grafico

  filtroMeta1?:string;
  tipoFiltroMeta1:number=0

  selectedAnioMeta_1: number = new Date().getFullYear();
  filtroMesesMeta_1: any[] = []; 

  selectedAnioMeta_2: number = new Date().getFullYear();
  filtroMesesMeta_2: any[] = []; 

  dataMeta_1?: {
    labels: any;
    datasets: any[];
    options: any;
  }
  optionsMeta_1: any = {
    title: {
      display: true,
      text: 'Meta por planta'
    }
  }

  dataMeta_2?: {
    labels: any;
    datasets: any[];
    options: any;
  }
  optionsMeta_2: any = {
    title: {
      display: true,
      text: 'Meta por planta'
    }
  }

  async getMeta_1Eve(){
    let flagCoronaTotal:boolean=false
    if(this.selectPais10){
      if(this.selectPais10=='Corona Total')flagCoronaTotal=true
      else flagCoronaTotal=false
    }else flagCoronaTotal=false
    // let grafMetas = this.grafMetas.map((div:any) => {
    //   return  div.label;
    // });

    if(this.plantasList10.length>0 || flagCoronaTotal){
      let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.selectedAnioMeta_1);

      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais10)if(this.selectPais10!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais10);
      if(!flagCoronaTotal)if(this.selectedDivisionResumen10)if(this.selectPais10!='Corona Total')reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen10);
      if(flagCoronaTotal)if(this.selectedDivisionResumen10)if(this.selectedDivisionResumen10.length>0){
        reportesAtCopyDiv=[]
        this.selectedDivisionResumen10.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.padreNombre == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      if(this.PlantaSelect10)if(this.PlantaSelect10.length>0){
        reportesAtCopyDiv=[]
        this.PlantaSelect10.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      //fin nuevo

      


      // let listaDivisiones = reportesAt.map(at => at.padreNombre);
      // let listaDivisiones = reportesAt.map(at => at.nombrePlanta);
      let listaPlantas = (flagCoronaTotal)?reportesAt.map(at => at.padreNombre).filter(at => at != null):reportesAt.map(at => at.nombrePlanta).filter(at => at != null);
      
  
      // let listaPlantas = reportesAt.map(at => at.nombrePlanta);
  
  
      let plantas = listaPlantas.filter((div, index) => {
        return listaPlantas.indexOf(div) === index;
      }).sort();
      plantas.push((flagCoronaTotal)?'Corona total':this.selectedDivisionResumen10)

      let dataMeta_1: {
        labels: any;
        datasets: any[];
        options?: any;
      } = {
        labels: plantas,
        datasets: [
          {
            label: 'Número de AT con días perdidos',
            backgroundColor: 'rgba(0, 176, 240, 0.5)',
            borderColor: 'rgb(0, 176, 240)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta de AT',
            backgroundColor: 'rgb(10, 53, 255)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(10, 53, 255)',
            data: [],
            type: 'line'
          },
          {
            label: 'Número de días perdidos',
            backgroundColor: 'rgba(259, 69, 18, 0.5)',
            borderColor: 'rgb(259, 69, 18)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta de días perdidos',
            backgroundColor: 'rgb(67, 67, 72)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(67, 67, 72)',
            data: [],
            type: 'line'
          }
        ]
      };


      let filterQueryMeta = new FilterQuery();
      filterQueryMeta.sortOrder = SortOrder.ASC;
      filterQueryMeta.sortField = "id";
      filterQueryMeta.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioMeta_1.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()}
      ];

      if(this.selectPais10)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais10.toString()})
      if(this.selectedDivisionResumen10)if(this.selectPais10!='Corona Total')filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen10})
      
      let meta:any
      await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
        meta=metas.data
      })

      let filterQueryTotal = new FilterQuery();
      filterQueryTotal.sortOrder = SortOrder.ASC;
      filterQueryTotal.sortField = "id";
      filterQueryTotal.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioMeta_1.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()},
        {criteria: Criteria.EQUALS, field: "pais", value1: 'Corona Total'}
      ];

      // if(this.selectedDivisionResumen10)filterQueryTotal.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen10})

      let metaTotal:any
      await this.viewHHtMetasService.getWithFilter(filterQueryTotal).then((metas:any)=>{
        metaTotal=metas.data
      })

      try{
        switch (this.filtroMeta1) {
          case 'dir':
            reportesAt = reportesAt.filter(at => at.temporal === null);
            throw 'dir';
          case 'temp':
            reportesAt = reportesAt.filter(at => at.temporal !== null);
            throw 'temp';
          default:
            throw 'err';
        }
      }catch(err){

          if(this.filtroMesesMeta_1.length > 0) reportesAt = reportesAt.filter(at => this.filtroMesesMeta_1.includes(this.meses[new Date(at.fechaReporte).getMonth()]));
          // let dateFinal: Date = new Date(new Date(this.evento1Hasta).setMonth(new Date(this.evento1Hasta).getMonth()+1));
          // reportesAt = reportesAt.filter(at => at.fechaReporte >= this.evento1Desde! && at.fechaReporte < dateFinal);

        
        // let numAtTotal = 0;
        let numATConDiasPerdidosTotal = 0;
        let diasPerdidosTotal = 0;
        // let atMortalesTotales = 0;
        // let atCeroDiasTotales = 0;
        let dataNumATConDiasPerdidosTotal:any=[]
        let dataDiasPerdidosTotal:any=[]
        let dataMetaNumATConDiasPerdidosTotal:any=[]
        let dataMetaDiasPerdidosTotal:any=[]

        let plantas1=plantas.map(ele=>ele)
        plantas1.pop()
        let meta1:any
        plantas1.forEach((division: any) => {

        meta1=(flagCoronaTotal)?metaTotal.find((met:any)=> met.nombreDivision==division):meta.find((met:any)=> met.nombrePlanta==division)
        // let meta1:any=metaTotal.find((met:any)=> met.nombreDivision==this.selectedDivisionResumen10)


          // let data:any = {
          //   name: division,
          //   series: []
          // }
          // let data:any=[]
  
          let numeroAt: number = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division).length;
          let diasPerdidos: number = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta']===division && at.incapacidades!==null && at.incapacidades!=='null')
                                        .reduce((count, incapacidades) => {
                                          return count + JSON.parse(incapacidades.incapacidades).reduce((count2:any, incapacidad:any) => {
                                            return count2 + incapacidad.diasAusencia;
                                          }, 0);
                                        }, 0);
          // let atMortales: number = reportesAt.filter(at => at.nombrePlanta === division && at.causoMuerte == true).length;
          let atCeroDias: number = reportesAt.filter(at => {
            if(at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division && (at.incapacidades === null || at.incapacidades === 'null')){
              return true;
            }else if(at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division){
              let contDiasPerdidos = (<Array<any>>JSON.parse(at.incapacidades))
              .reduce((count, incapacidad) => {
                return count + incapacidad.diasAusencia;
              }, 0);
              return contDiasPerdidos > 0 ? false : true;
            }
            return false;
          }).length;
          let numATConDiasPerdidos = numeroAt - atCeroDias;
  
          // numAtTotal += numeroAt;
          diasPerdidosTotal += diasPerdidos;
          // atMortalesTotales += atMortales;
          // atCeroDiasTotales += atCeroDias;
          numATConDiasPerdidosTotal += numATConDiasPerdidos;
  
          // data.series.push({
          //   name: this.grafMetas[1].label,
          //   value: numATConDiasPerdidos
          // })
          // data.series.push({
          //   name: this.grafMetas[2].label,
          //   value: diasPerdidos
          // });

  
          // dataEventos1.push(data);
          dataNumATConDiasPerdidosTotal.push(numATConDiasPerdidos)
          dataDiasPerdidosTotal.push(diasPerdidos)
          dataMetaNumATConDiasPerdidosTotal.push((meta1)?((meta1[(flagCoronaTotal)?'eveDivision':'evePlanta'])?meta1[(flagCoronaTotal)?'eveDivision':'evePlanta']:0):0)
          dataMetaDiasPerdidosTotal.push((meta1)?((meta1[(flagCoronaTotal)?'diasPerdidosDivision':'diasPerdidosPlanta'])?meta1[(flagCoronaTotal)?'diasPerdidosDivision':'diasPerdidosPlanta']:0):0)

        });

        // let meta1:any=metaTotal.find((met:any)=> met.nombreDivision==this.selectedDivisionResumen10)

        dataNumATConDiasPerdidosTotal.push(numATConDiasPerdidosTotal)
        dataDiasPerdidosTotal.push(diasPerdidosTotal)
        dataMetaNumATConDiasPerdidosTotal.push((meta1)?((meta1[(flagCoronaTotal)?'eveAnual':'eveDivision'])?meta1[(flagCoronaTotal)?'eveAnual':'eveDivision']:0):0)
        dataMetaDiasPerdidosTotal.push((meta1)?((meta1[(flagCoronaTotal)?'dperdidosAnual':'diasPerdidosDivision'])?meta1[(flagCoronaTotal)?'dperdidosAnual':'diasPerdidosDivision']:0):0)


        dataMeta_1.datasets[0].data=dataNumATConDiasPerdidosTotal
        dataMeta_1.datasets[1].data=dataMetaNumATConDiasPerdidosTotal
        dataMeta_1.datasets[2].data=dataDiasPerdidosTotal
        dataMeta_1.datasets[3].data=dataMetaDiasPerdidosTotal

        Object.assign(this, {dataMeta_1});
        localStorage.setItem('dataMeta1', JSON.stringify(dataMeta_1));
        this.filtroMeta_1();
      }}

  }

  filtroMeta_1(){
    let dataMeta_1: any = JSON.parse(localStorage.getItem('dataMeta1')!);

    if(this.selectPais10=='Corona Total')
      if(this.selectedDivisionResumen10)
        if(this.selectedDivisionResumen10.length > 0){
          let plantasCoronaMeta10 = this.divisionList10.map((div:any) => div.label);

          let PlantaSelect = this.selectedDivisionResumen10.map((div:any) => div).sort();

          dataMeta_1.labels = PlantaSelect;

          dataMeta_1.datasets[3].data = dataMeta_1.datasets[3].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
          dataMeta_1.datasets[2].data = dataMeta_1.datasets[2].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
          dataMeta_1.datasets[1].data = dataMeta_1.datasets[1].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
          dataMeta_1.datasets[0].data = dataMeta_1.datasets[0].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
         
        }

    if(this.selectPais10!='Corona Total')
      if(this.PlantaSelect10)
        if(this.PlantaSelect10.length > 0){
          let plantasCoronaMeta10 = this.plantasList10.map((div:any) => div.label);

          let PlantaSelect = this.PlantaSelect10.map((div:any) => div).sort();

          dataMeta_1.labels = PlantaSelect;
          dataMeta_1.datasets[3].data = dataMeta_1.datasets[3].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
          dataMeta_1.datasets[2].data = dataMeta_1.datasets[2].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
          dataMeta_1.datasets[1].data = dataMeta_1.datasets[1].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
          dataMeta_1.datasets[0].data = dataMeta_1.datasets[0].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
    }

    let filtrosListCoronaMeta10 = this.grafMetas.map((div:any) => div.label);
    if(this.selectEventos10)
    if(this.selectEventos10.length > 0){
      let selectEventos10:any=this.order(this.selectEventos10)
      let filtroCoronaMeta10 = selectEventos10.map((div:any) => div.label);

      dataMeta_1.datasets = dataMeta_1.datasets.filter((data:any, index:any) => filtroCoronaMeta10.includes(filtrosListCoronaMeta10[index]));
    }

    Object.assign(this, {dataMeta_1});
  }

  // Septimo grafico comparativo

  filtroMeta1_2?:string;
  tipoFiltroMeta1_2:number=0

  selectedAnioMeta_1_2: number = new Date().getFullYear();
  filtroMesesMeta_1_2: any[] = []; 

  selectedAnioMeta_2_2: number = new Date().getFullYear();
  filtroMesesMeta_2_2: any[] = []; 

  dataMeta_1_2?: {
    labels: any;
    datasets: any[];
    options: any;
  }
  optionsMeta_1_2: any = {
    title: {
      display: true,
      text: 'Meta por planta'
    }
  }

  dataMeta_2_2?: {
    labels: any;
    datasets: any[];
    options: any;
  }
  optionsMeta_2_2: any = {
    title: {
      display: true,
      text: 'Meta por planta'
    }
  }

  async getMeta_1Eve_2(){
    let flagCoronaTotal:boolean=false
    if(this.selectPais10_2){
      if(this.selectPais10_2=='Corona Total')flagCoronaTotal=true
      else flagCoronaTotal=false
    }else flagCoronaTotal=false

    if(this.plantasList10_2.length>0 || flagCoronaTotal){
      let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.selectedAnioMeta_1_2);

      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais10_2)if(this.selectPais10_2!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais10_2);
      if(!flagCoronaTotal)if(this.selectedDivisionResumen10_2)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen10_2);
      if(flagCoronaTotal)if(this.selectedDivisionResumen10_2)if(this.selectedDivisionResumen10_2.length>0){
        reportesAtCopyDiv=[]
        this.selectedDivisionResumen10_2.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.padreNombre == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      if(this.PlantaSelect10_2)if(this.PlantaSelect10_2.length>0){
        reportesAtCopyDiv=[]
        this.PlantaSelect10_2.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      //fin nuevo

      

      let listaPlantas = (flagCoronaTotal)?reportesAt.map(at => at.padreNombre).filter(at => at != null):reportesAt.map(at => at.nombrePlanta).filter(at => at != null);
  
  
      let plantas = listaPlantas.filter((div, index) => {
        return listaPlantas.indexOf(div) === index;
      }).sort();
      plantas.push((flagCoronaTotal)?'Corona total':this.selectedDivisionResumen10_2)


      let dataMeta_1_2: {
        labels: any;
        datasets: any[];
        options?: any;
      } = {
        labels: plantas,
        datasets: [
          {
            label: 'Número de AT con días perdidos',
            backgroundColor: 'rgba(0, 176, 240, 0.5)',
            borderColor: 'rgb(0, 176, 240)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta de AT',
            backgroundColor: 'rgb(10, 53, 255)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(10, 53, 255)',
            data: [],
            type: 'line'
          },
          {
            label: 'Número de días perdidos',
            backgroundColor: 'rgba(259, 69, 18, 0.5)',
            borderColor: 'rgb(259, 69, 18)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta de días perdidos',
            backgroundColor: 'rgb(67, 67, 72)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(67, 67, 72)',
            data: [],
            type: 'line'
          }
        ]
      };

      let filterQueryMeta = new FilterQuery();
      filterQueryMeta.sortOrder = SortOrder.ASC;
      filterQueryMeta.sortField = "id";
      filterQueryMeta.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioMeta_1_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()}
      ];

      if(this.selectPais10_2)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais10_2.toString()})
      if(this.selectedDivisionResumen10_2)if(this.selectPais10_2!='Corona Total')filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen10_2})
      
      let meta:any
      await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
        meta=metas.data
      })

      let filterQueryTotal = new FilterQuery();
      filterQueryTotal.sortOrder = SortOrder.ASC;
      filterQueryTotal.sortField = "id";
      filterQueryTotal.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioMeta_1_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()},
        {criteria: Criteria.EQUALS, field: "pais", value1: 'Corona Total'}
      ];

      // if(this.selectedDivisionResumen10)filterQueryTotal.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen10})

      let metaTotal:any
      await this.viewHHtMetasService.getWithFilter(filterQueryTotal).then((metas:any)=>{
        metaTotal=metas.data
      })

      try{
        switch (this.filtroMeta1_2) {
          case 'dir':
            reportesAt = reportesAt.filter(at => at.temporal === null);
            throw 'dir';
          case 'temp':
            reportesAt = reportesAt.filter(at => at.temporal !== null);
            throw 'temp';
          default:
            throw 'err';
        }
      }catch(err){

        if(this.filtroMesesMeta_1_2.length > 0) reportesAt = reportesAt.filter(at => this.filtroMesesMeta_1_2.includes(this.meses[new Date(at.fechaReporte).getMonth()]));

        let numATConDiasPerdidosTotal = 0;
        let diasPerdidosTotal = 0;
        let dataNumATConDiasPerdidosTotal:any=[]
        let dataDiasPerdidosTotal:any=[]
        let dataMetaNumATConDiasPerdidosTotal:any=[]
        let dataMetaDiasPerdidosTotal:any=[]


        let plantas1=plantas.map(ele=>ele)
        plantas1.pop()
        let meta1:any
        plantas1.forEach((division: any) => {
          meta1=(flagCoronaTotal)?metaTotal.find((met:any)=> met.nombreDivision==division):meta.find((met:any)=> met.nombrePlanta==division)

          let numeroAt: number = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division).length;
          let diasPerdidos: number = reportesAt.filter(at => at[flagCoronaTotal?'padreNombre':'nombrePlanta']===division && at.incapacidades!==null && at.incapacidades!=='null')
                                        .reduce((count, incapacidades) => {
                                          return count + JSON.parse(incapacidades.incapacidades).reduce((count2:any, incapacidad:any) => {
                                            return count2 + incapacidad.diasAusencia;
                                          }, 0);
                                        }, 0);
          let atCeroDias: number = reportesAt.filter(at => {
            if(at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division && (at.incapacidades === null || at.incapacidades === 'null')){
              return true;
            }else if(at[flagCoronaTotal?'padreNombre':'nombrePlanta'] === division){
              let contDiasPerdidos = (<Array<any>>JSON.parse(at.incapacidades))
              .reduce((count, incapacidad) => {
                return count + incapacidad.diasAusencia;
              }, 0);
              return contDiasPerdidos > 0 ? false : true;
            }
            return false;
          }).length;
          let numATConDiasPerdidos = numeroAt - atCeroDias;
  
          diasPerdidosTotal += diasPerdidos;
          numATConDiasPerdidosTotal += numATConDiasPerdidos;
  
          dataNumATConDiasPerdidosTotal.push(numATConDiasPerdidos)
          dataDiasPerdidosTotal.push(diasPerdidos)
          dataMetaNumATConDiasPerdidosTotal.push((meta1)?((meta1[(flagCoronaTotal)?'eveDivision':'evePlanta'])?meta1[(flagCoronaTotal)?'eveDivision':'evePlanta']:0):0)
          dataMetaDiasPerdidosTotal.push((meta1)?((meta1[(flagCoronaTotal)?'diasPerdidosDivision':'diasPerdidosPlanta'])?meta1[(flagCoronaTotal)?'diasPerdidosDivision':'diasPerdidosPlanta']:0):0)

        });

        dataNumATConDiasPerdidosTotal.push(numATConDiasPerdidosTotal)
        dataDiasPerdidosTotal.push(diasPerdidosTotal)
        dataMetaNumATConDiasPerdidosTotal.push((meta1)?((meta1[(flagCoronaTotal)?'eveAnual':'eveDivision'])?meta1[(flagCoronaTotal)?'eveAnual':'eveDivision']:0):0)
        dataMetaDiasPerdidosTotal.push((meta1)?((meta1[(flagCoronaTotal)?'dperdidosAnual':'diasPerdidosDivision'])?meta1[(flagCoronaTotal)?'dperdidosAnual':'diasPerdidosDivision']:0):0)


        dataMeta_1_2.datasets[0].data=dataNumATConDiasPerdidosTotal
        dataMeta_1_2.datasets[1].data=dataMetaNumATConDiasPerdidosTotal
        dataMeta_1_2.datasets[2].data=dataDiasPerdidosTotal
        dataMeta_1_2.datasets[3].data=dataMetaDiasPerdidosTotal


        Object.assign(this, {dataMeta_1_2});
        localStorage.setItem('dataMeta1_2', JSON.stringify(dataMeta_1_2));
        this.filtroMeta_1_2();
      }}

  }

  filtroMeta_1_2(){
    let dataMeta_1_2: any = JSON.parse(localStorage.getItem('dataMeta1_2')!);

    if(this.selectPais10_2=='Corona Total')
      if(this.selectedDivisionResumen10_2)
        if(this.selectedDivisionResumen10_2.length > 0){
          let plantasCoronaMeta10 = this.divisionList10_2.map((div:any) => div.label);

          let PlantaSelect = this.selectedDivisionResumen10_2.map((div:any) => div).sort();
          dataMeta_1_2.labels = PlantaSelect;

          dataMeta_1_2.datasets[3].data = dataMeta_1_2.datasets[3].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
          dataMeta_1_2.datasets[2].data = dataMeta_1_2.datasets[2].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
          dataMeta_1_2.datasets[1].data = dataMeta_1_2.datasets[1].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
          dataMeta_1_2.datasets[0].data = dataMeta_1_2.datasets[0].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
        }

    if(this.selectPais10_2!='Corona Total')
      if(this.PlantaSelect10_2)
        if(this.PlantaSelect10_2.length > 0){
          let plantasCoronaMeta10 = this.plantasList10_2.map((div:any) => div.label);

          let PlantaSelect = this.PlantaSelect10_2.map((div:any) => div).sort();

          dataMeta_1_2.labels = PlantaSelect;
          dataMeta_1_2.datasets[3].data = dataMeta_1_2.datasets[3].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
          dataMeta_1_2.datasets[2].data = dataMeta_1_2.datasets[2].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
          dataMeta_1_2.datasets[1].data = dataMeta_1_2.datasets[1].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
          dataMeta_1_2.datasets[0].data = dataMeta_1_2.datasets[0].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta10[index]));
    }

    let filtrosListCoronaMeta10 = this.grafMetas.map((div:any) => div.label);
    if(this.selectEventos10_2)
    if(this.selectEventos10_2.length > 0){
      let selectEventos10:any=this.order(this.selectEventos10_2)
      let filtroCoronaMeta10 = selectEventos10.map((div:any) => div.label);

      dataMeta_1_2.datasets = dataMeta_1_2.datasets.filter((data:any, index:any) => filtroCoronaMeta10.includes(filtrosListCoronaMeta10[index]));
    }

    Object.assign(this, {dataMeta_1_2});
  }


filtroMeta1meses?:string;
tipoFiltroMeta1meses:number=0

selectedAnioMeta_1meses: number = new Date().getFullYear();
filtroMesesMeta_1meses: any[] = []; 
filtroDivisionEventos2meses: any[] = [];


selectedAnioMeta_2meses: number = new Date().getFullYear();
filtroMesesMeta_2meses: any[] = []; 


dataMeta_1meses?: {
  labels: any;
  datasets: any[];
  options: any;
}
optionsMeta_1meses: any = {
  title: {
    display: true,
    text: 'Meta por planta'
  }
}

dataMeta_2meses?: {
  labels: any;
  datasets: any[];
  options: any;
}
optionsMeta_2meses: any = {
  title: {
    display: true,
    text: 'Meta por planta'
  }
}
// meta
  // Septimo.5 grafco eventos meses
  async getEventosMeta_2(){
    if(this.selectedDivisionResumen12){
      let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.selectedAnioMeta_1meses);
      // let dataEventos2: any[] = [];
      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais12)if(this.selectPais12!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais12);
      if(this.selectedDivisionResumen12)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen12);
      if(this.PlantaSelect12)if(this.PlantaSelect12.length>0){
        reportesAtCopyDiv=[]
        this.PlantaSelect12.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      //fin nuevo

      let meses:any[]=[]
      if(this.filtroMesesMeta_1meses.length>0) meses = this.MesesValue.filter(data => this.filtroMesesMeta_1meses.includes(data.label));
      else meses=this.MesesValue.map(ele=>ele)

      let dataMeta_1meses: {
        labels: any;
        datasets: any[];
        options?: any;
      } = {
        labels: meses.map(mes=>mes.label),
        datasets: [
          {
            label: 'Número de AT con días perdidos',
            backgroundColor: 'rgba(0, 176, 240, 0.5)',
            borderColor: 'rgb(0, 176, 240)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta de AT',
            backgroundColor: 'rgb(10, 53, 255)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(10, 53, 255)',
            data: [],
            type: 'line'
          },
          {
            label: 'Número de días perdidos',
            backgroundColor: 'rgba(259, 69, 18, 0.5)',
            borderColor: 'rgb(259, 69, 18)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta de días perdidos',
            backgroundColor: 'rgb(67, 67, 72)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(67, 67, 72)',
            data: [],
            type: 'line'
          }
        ]
      };

      try{
        switch(this.filtroMeta1meses){
          case 'temp':
            reportesAt = reportesAt.filter(at => at.temporal !== null);
            throw 'temp';
          case 'dir':
            reportesAt = reportesAt.filter(at => at.temporal === null);
            throw 'dir';
          default: 
            throw 'err';
        }
      }catch(e){
        let dataNumATConDiasPerdidosTotal:any=[]
        let dataDiasPerdidosTotal:any=[]
        let dataMetaNumATConDiasPerdidosTotal:any=[]
        let dataMetaDiasPerdidosTotal:any=[]

        let filterQueryMeta = new FilterQuery();
        filterQueryMeta.sortOrder = SortOrder.ASC;
        filterQueryMeta.sortField = "id";
        filterQueryMeta.filterList = [
          {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioMeta_1meses.toString()},
          {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()}
        ];

        if(this.selectPais12)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais12.toString()})
        if(this.selectedDivisionResumen12)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen12})
        
        let meta:any
        await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
          meta=metas.data
        })
        let meta1:any=meta.find((met:any)=> met.nombreDivision==this.selectedDivisionResumen12)

        
        meses.forEach((mes, index) => {

          let numeroAt = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === mes.value).length;
          let diasPerdidos = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === mes.value
                                                  &&  at.incapacidades !== null && at.incapacidades !== 'null')
                                        .reduce((count, at) => {
                                          return count + JSON.parse(at.incapacidades).reduce((count2:any, incapacidad:any) => {
                                            return count2 + incapacidad.diasAusencia;
                                          }, 0);
                                        }, 0);
          let atMortales = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === mes.value && at.causoMuerte).length;
          let atCeroDias = reportesAt.filter(at => {
            if(new Date(at.fechaReporte).getMonth() === mes.value && (at.incapacidades === null || at.incapacidades === 'null')){
              return true;
            }else if(new Date(at.fechaReporte).getMonth() === mes.value){
              let contDiasPerdidos = (<Array<any>>JSON.parse(at.incapacidades))
              .reduce((count, incapacidad) => {
                return count + incapacidad.diasAusencia;
              }, 0);
              return contDiasPerdidos > 0 ? false : true;
            }
            return false;
          }).length;
          let numATConDiasPerdidos = numeroAt - atCeroDias;

          dataNumATConDiasPerdidosTotal.push(numATConDiasPerdidos)
          dataDiasPerdidosTotal.push(diasPerdidos)
          dataMetaNumATConDiasPerdidosTotal.push((meta1)?((meta1.eveDivision)?meta1.eveDivision:0):0)
          dataMetaDiasPerdidosTotal.push((meta1)?((meta1.diasPerdidosDivision)?meta1.diasPerdidosDivision:0):0)
        });

        dataMeta_1meses.datasets[0].data=dataNumATConDiasPerdidosTotal
        dataMeta_1meses.datasets[1].data=dataMetaNumATConDiasPerdidosTotal
        dataMeta_1meses.datasets[2].data=dataDiasPerdidosTotal
        dataMeta_1meses.datasets[3].data=dataMetaDiasPerdidosTotal

        Object.assign(this, {dataMeta_1meses});
        localStorage.setItem('dataMeta_1meses', JSON.stringify(dataMeta_1meses));
        this.filtroEventosMeta_2();
      }
    }
  }

  filtroEventosMeta_2(){
    let dataMeta_1meses: any = JSON.parse(localStorage.getItem('dataMeta_1meses')!);

    let filtrosListCoronaMeta12 = this.grafMetas.map((div:any) => div.label);
    if(this.selectEventos12)
    if(this.selectEventos12.length > 0){
      let selectEventos12:any=this.order(this.selectEventos12)
      let filtroCoronaMeta12 = selectEventos12.map((div:any) => div.label);

      dataMeta_1meses.datasets = dataMeta_1meses.datasets.filter((data:any, index:any) => filtroCoronaMeta12.includes(filtrosListCoronaMeta12[index]));
    }

    Object.assign(this, {dataMeta_1meses});
  }

  
  filtroMeta1meses_2?:string;
  tipoFiltroMeta1meses_2:number=0

  selectedAnioMeta_1meses_2: number = new Date().getFullYear();
  filtroMesesMeta_1meses_2: any[] = []; 
  filtroDivisionEventos2meses_2: any[] = [];


  selectedAnioMeta_2meses_2: number = new Date().getFullYear();
  filtroMesesMeta_2meses_2: any[] = []; 


  dataMeta_1meses_2?: {
    labels: any;
    datasets: any[];
    options: any;
  }
  optionsMeta_1meses_2: any = {
    title: {
      display: true,
      text: 'Meta por planta'
    }
  }

  dataMeta_2meses_2?: {
    labels: any;
    datasets: any[];
    options: any;
  }
  optionsMeta_2meses_2: any = {
    title: {
      display: true,
      text: 'Meta por planta'
    }
  }
  // meta
  // Comparativo Septimo.5 grafco eventos meses
  async getEventosMeta_2_2(){
    if(this.selectedDivisionResumen12_2){
      let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.selectedAnioMeta_1meses_2);
      // let dataEventos2: any[] = [];
      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais12_2)if(this.selectPais12_2!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais12_2);
      if(this.selectedDivisionResumen12_2)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen12_2);
      if(this.PlantaSelect12_2)if(this.PlantaSelect12_2.length>0){
        reportesAtCopyDiv=[]
        this.PlantaSelect12_2.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      //fin nuevo

      let meses:any[]=[]
      if(this.filtroMesesMeta_1meses_2.length>0) meses = this.MesesValue.filter(data => this.filtroMesesMeta_1meses_2.includes(data.label));
      else meses=this.MesesValue.map(ele=>ele)

      let dataMeta_1meses_2: {
        labels: any;
        datasets: any[];
        options?: any;
      } = {
        labels: meses.map(mes=>mes.label),
        datasets: [
          {
            label: 'Número de AT con días perdidos',
            backgroundColor: 'rgba(0, 176, 240, 0.5)',
            borderColor: 'rgb(0, 176, 240)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta de AT',
            backgroundColor: 'rgb(10, 53, 255)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(10, 53, 255)',
            data: [],
            type: 'line'
          },
          {
            label: 'Número de días perdidos',
            backgroundColor: 'rgba(259, 69, 18, 0.5)',
            borderColor: 'rgb(259, 69, 18)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta de días perdidos',
            backgroundColor: 'rgb(67, 67, 72)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(67, 67, 72)',
            data: [],
            type: 'line'
          }
        ]
      };

      try{
        switch(this.filtroMeta1meses_2){
          case 'temp':
            reportesAt = reportesAt.filter(at => at.temporal !== null);
            throw 'temp';
          case 'dir':
            reportesAt = reportesAt.filter(at => at.temporal === null);
            throw 'dir';
          default: 
            throw 'err';
        }
      }catch(e){
        let dataNumATConDiasPerdidosTotal:any=[]
        let dataDiasPerdidosTotal:any=[]
        let dataMetaNumATConDiasPerdidosTotal:any=[]
        let dataMetaDiasPerdidosTotal:any=[]

        let filterQueryMeta = new FilterQuery();
        filterQueryMeta.sortOrder = SortOrder.ASC;
        filterQueryMeta.sortField = "id";
        filterQueryMeta.filterList = [
          {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioMeta_1meses_2.toString()},
          {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()}
        ];

        if(this.selectPais12_2)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais12_2.toString()})
        if(this.selectedDivisionResumen12_2)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen12_2})
        
        let meta:any
        await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
          meta=metas.data
        })
        let meta1:any=meta.find((met:any)=> met.nombreDivision==this.selectedDivisionResumen12_2)

        meses.forEach((mes, index) => {
          // if(this.Meses.length === index + 1) return;
          // let data:any = {
          //   name: mes.label,
          //   series: []
          // };

          let numeroAt = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === mes.value).length;
          let diasPerdidos = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === mes.value
                                                  &&  at.incapacidades !== null && at.incapacidades !== 'null')
                                        .reduce((count, at) => {
                                          return count + JSON.parse(at.incapacidades).reduce((count2:any, incapacidad:any) => {
                                            return count2 + incapacidad.diasAusencia;
                                          }, 0);
                                        }, 0);
          let atMortales = reportesAt.filter(at => new Date(at.fechaReporte).getMonth() === mes.value && at.causoMuerte).length;
          let atCeroDias = reportesAt.filter(at => {
            if(new Date(at.fechaReporte).getMonth() === mes.value && (at.incapacidades === null || at.incapacidades === 'null')){
              return true;
            }else if(new Date(at.fechaReporte).getMonth() === mes.value){
              let contDiasPerdidos = (<Array<any>>JSON.parse(at.incapacidades))
              .reduce((count, incapacidad) => {
                return count + incapacidad.diasAusencia;
              }, 0);
              return contDiasPerdidos > 0 ? false : true;
            }
            return false;
          }).length;
          let numATConDiasPerdidos = numeroAt - atCeroDias;

          dataNumATConDiasPerdidosTotal.push(numATConDiasPerdidos)
          dataDiasPerdidosTotal.push(diasPerdidos)
          dataMetaNumATConDiasPerdidosTotal.push((meta1)?((meta1.eveDivision)?meta1.eveDivision:0):0)
          dataMetaDiasPerdidosTotal.push((meta1)?((meta1.diasPerdidosDivision)?meta1.diasPerdidosDivision:0):0)
        });

        dataMeta_1meses_2.datasets[0].data=dataNumATConDiasPerdidosTotal
        dataMeta_1meses_2.datasets[1].data=dataMetaNumATConDiasPerdidosTotal
        dataMeta_1meses_2.datasets[2].data=dataDiasPerdidosTotal
        dataMeta_1meses_2.datasets[3].data=dataMetaDiasPerdidosTotal

        Object.assign(this, {dataMeta_1meses_2});
        localStorage.setItem('dataMeta_1meses_2', JSON.stringify(dataMeta_1meses_2));
        this.filtroEventosMeta_2();
      }
    }
  }

  filtroEventosMeta_2_2(){
    let dataMeta_1meses_2: any = JSON.parse(localStorage.getItem('dataMeta_1meses_2')!);

    let filtrosListCoronaMeta12_2 = this.grafMetas.map((div:any) => div.label);
    if(this.selectEventos12_2)
    if(this.selectEventos12_2.length > 0){
      let selectEventos12_2:any=this.order(this.selectEventos12_2)
      let filtroCoronaMeta12_2 = selectEventos12_2.map((div:any) => div.label);

      dataMeta_1meses_2.datasets = dataMeta_1meses_2.datasets.filter((data:any, index:any) => filtroCoronaMeta12_2.includes(filtrosListCoronaMeta12_2[index]));
    }

    Object.assign(this, {dataMeta_1meses_2});
  }

  //Octava grafica
  async getMeta_1Tasas(filter?: string){

    let flagCoronaTotal:boolean=false
    if(this.selectPais11){
      if(this.selectPais11=='Corona Total')flagCoronaTotal=true
      else flagCoronaTotal=false
    }else flagCoronaTotal=false

    if(this.plantasList11 || flagCoronaTotal)
    if(this.plantasList11.length>0 || flagCoronaTotal){
      let filterQuery = new FilterQuery();

      let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.selectedAnioMeta_2);

      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais11)if(this.selectPais11!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais11);
      if(!flagCoronaTotal)if(this.selectedDivisionResumen11)if(this.selectPais11!='Corona Total')reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen11);
      if(flagCoronaTotal)if(this.selectedDivisionResumen11)if(this.selectedDivisionResumen11.length>0){
        reportesAtCopyDiv=[]
        this.selectedDivisionResumen11.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.padreNombre == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      if(!flagCoronaTotal)if(this.PlantaSelect11)if(this.PlantaSelect11.length>0){
        reportesAtCopyDiv=[]
        this.PlantaSelect11.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      //fin nuevo

      // let listaPlantas = reportesAt.map(at => at.nombrePlanta).filter(at => at != null);  
      let listaPlantas = (flagCoronaTotal)?reportesAt.map(at => at.padreNombre).filter(at => at != null):reportesAt.map(at => at.nombrePlanta).filter(at => at != null);

      let plantas = listaPlantas.filter((div, index) => {
        return listaPlantas.indexOf(div) === index;
      }).sort();
      plantas.push((flagCoronaTotal)?'Corona total':this.selectedDivisionResumen11)


      let dataMeta_2: {
        labels: any;
        datasets: any[];
        options?: any;
      } = {
        labels: plantas,
        datasets: [
          {
            label: 'Tasa de Frecuencia',
            backgroundColor: 'rgb(0, 176, 240,0.5)',
            borderColor: 'rgb(0, 176, 240)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta de TF',
            backgroundColor: 'rgb(10, 53, 255)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(10, 53, 255)',
            data: [],
            type: 'line'
          },
          {
            label: 'Tasa de Severidad',
            backgroundColor: 'rgb(259, 69, 18,0.5)',
            borderColor: 'rgb(259, 69, 18)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta de TS',
            backgroundColor: 'rgb(67, 67, 72)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(67, 67, 72)',
            data: [],
            type: 'line'
          }
        ]
      };
      let filterQueryMeta = new FilterQuery();
      filterQueryMeta.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioMeta_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais11)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais11.toString()})
      if(this.selectedDivisionResumen11)if(this.selectPais11 != 'Corona Total')filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen11})

      let meta:any
      await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
        meta=metas.data
      })

      let filterQueryTotal = new FilterQuery();
      filterQueryTotal.sortOrder = SortOrder.ASC;
      filterQueryTotal.sortField = "id";
      filterQueryTotal.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioMeta_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()},
        {criteria: Criteria.EQUALS, field: "pais", value1: 'Corona Total'}
      ];

      let metaTotal:any
      await this.viewHHtMetasService.getWithFilter(filterQueryTotal).then((metas:any)=>{
        metaTotal=metas.data
      })

      try{
        switch (filter) {
          case 'dir':
            reportesAt = reportesAt.filter(at => at.temporal === null);
            throw 'dir';
          case 'temp':
            reportesAt = reportesAt.filter(at => at.temporal);
            throw 'temp';
          default:
            throw 'err';
        }
      }catch (e){

        filterQuery.sortOrder = SortOrder.ASC;
        filterQuery.sortField = "id";
        filterQuery.fieldList=this.fieldHht;
        filterQuery.filterList = [
          {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioMeta_2.toString()},
          {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
        ];
        if(this.selectPais11)if(this.selectPais11 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais11.toString()})
        if(this.selectedDivisionResumen11)if(this.selectPais11 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen11).id.toString()})
        // if(this.PlantaSelect4)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.nombre", value1: this.PlantaSelect4.toString()})
        
        await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {
          let hhtTemp: Array<any>;
          let filterQuery2 = new FilterQuery();
          filterQuery2.sortField = "id";
          filterQuery2.fieldList=this.fieldHht;
          filterQuery2.filterList = [
            {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_2.toString()},
            {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
            {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
          ];
          if(this.selectPais11)if(this.selectPais11 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais11.toString()})
          if(this.selectedDivisionResumen11)if(this.selectPais11 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen11).id.toString()})

          await this.hhtService.findByFilter(filterQuery2)
          .then((res2: any) => {
            hhtTemp = Array.from(res2.data);

          }).catch((err: any) => {
            console.error('Error al leer hht de temporales', err);
          });

          if(res.data.length > 0 || hhtTemp!) {
            let trabajadoresTotalesMes=0
            let totalTrabajadoresTempMes=0
            let totalDiasPerdidos=0
            let AtMortalesTotal=0
            let planta = (flagCoronaTotal)?this.divisionList11.filter((item:any) => plantas.includes(item.label)):this.plantasList11.filter((item:any) => plantas.includes(item.label));

            // let plantasList11: any = this.plantasList11.filter((item:any) => plantas.includes(item.label));
            let dataTS:any=[]
            let dataTF:any=[]
            let dataMetaTS:any=[]
            let dataMetaTF:any=[]
            let meta1:any
            planta.forEach((plantas:any) => {

              let plantaL=plantas.value
              meta1=(flagCoronaTotal)?metaTotal.find((met:any)=> met.nombreDivision==plantaL):meta.find((met:any)=> met.nombrePlanta==plantaL)


              let trabajadoresTotales = 0;
              let mesesFiltrados = 0;

              res.data.forEach((eleHHt:any) => {
                let trabajadoresPorPlanta = 0;
                if(this.filtroMesesMeta_2.length > 0){  
                  if(this.filtroMesesMeta_2.includes(eleHHt.mes)){
                      if (plantaL === eleHHt[(flagCoronaTotal)?'planta_area_nombre':'planta_nombre']) {
                        trabajadoresPorPlanta += eleHHt.numeroPersonas? eleHHt.numeroPersonas : 0;
                      }
                    trabajadoresTotales += trabajadoresPorPlanta;
                    mesesFiltrados++;
                  }
                }else{
                    if (plantaL === eleHHt[(flagCoronaTotal)?'planta_area_nombre':'planta_nombre']) {
                      trabajadoresPorPlanta += eleHHt.numeroPersonas? eleHHt.numeroPersonas : 0;
                    }
                  trabajadoresTotales += trabajadoresPorPlanta;
                }
              });          
              trabajadoresTotalesMes += trabajadoresTotales

              if(mesesFiltrados > 0) trabajadoresTotales = trabajadoresTotales / mesesFiltrados;

              let totalTrabajadoresTemp = 0;
              let trabajadoresPorMes:any = [];
              this.meses.forEach((mes, index) => {
                let totalTrabajadoresMes = 0;
                if(this.filtroMesesMeta_2.length > 0){
                  if(this.filtroMesesMeta_2.includes(mes)){
                    hhtTemp.forEach((hht:any, indexHHT) => {
                      if(mes === hht.mes){
                        if (plantaL === hht[(flagCoronaTotal)?'planta_area_nombre':'planta_nombre']) {
                          let totalTrabajadores = hht.numeroPersonas? hht.numeroPersonas! : 0;
                          totalTrabajadoresMes += totalTrabajadores;

                        }
                      }
                    });
                  }
                }else{
                  hhtTemp.forEach((hht, indexHHT) => {

                      if (plantaL === hht[(flagCoronaTotal)?'planta_area_nombre':'planta_nombre']) {
                        let totalTrabajadores = hht.numeroPersonas? hht.numeroPersonas! : 0;
                        totalTrabajadoresMes += totalTrabajadores!;
                      }
                    // }
                  });
                }
                trabajadoresPorMes.push(totalTrabajadoresMes);
              });
              if(this.filtroMesesMeta_2.length > 0){
                let totalTrabajadoresTemp = trabajadoresPorMes.reduce((count:any, trabajadores:any) => {
                  return count + trabajadores;
                }, 0);
                totalTrabajadoresTempMes+=totalTrabajadoresTemp;
                totalTrabajadoresTemp=totalTrabajadoresTemp / this.filtroMesesMeta_2.length
              }else{
                let totalTrabajadoresTemp = trabajadoresPorMes.reduce((count:any, trabajadores:any) => {
                  return count + trabajadores;
                }, 0);
                totalTrabajadoresTempMes+=totalTrabajadoresTemp;
                totalTrabajadoresTemp=totalTrabajadoresTemp /((this.filtroAnioTasa_1==new Date().getFullYear())?new Date().getMonth()+1:12)
              }          

              let totalAt = reportesAt.filter(at => at[(flagCoronaTotal)?'padreNombre':'nombrePlanta'] === plantaL).length;

              let diasPerdidos = reportesAt.filter(at => at[(flagCoronaTotal)?'padreNombre':'nombrePlanta'] === plantaL && at.incapacidades !== null 
                                                          && at.incapacidades !== 'null')
                                            .reduce((count, item) => {
                                              return count + JSON.parse(item.incapacidades).reduce((count2:any, incapacidad:any) => {
                                                return count2 + incapacidad.diasAusencia;
                                              }, 0);
                                            }, 0);
              totalDiasPerdidos +=diasPerdidos;
              let AtMortales = reportesAt.filter(at => at[(flagCoronaTotal)?'padreNombre':'nombrePlanta'] === plantaL && at.causoMuerte === true).length;
              AtMortalesTotal+=AtMortales


              let TF = isNaN(Number((totalAt * 100)/((trabajadoresTotales+totalTrabajadoresTemp)))) ? 0.0 : Number(Number((totalAt * 100)/(trabajadoresTotales+totalTrabajadoresTemp)).toFixed(6));
              let TS = isNaN(Number((diasPerdidos * 100)/(trabajadoresTotales+totalTrabajadoresTemp))) ? 0.0 : Number(Number((diasPerdidos * 100)/(trabajadoresTotales+totalTrabajadoresTemp)).toFixed(6));
              // let PAT = isNaN(Number((AtMortales * 100)/totalAt)) ? 0.0 : Number(Number((AtMortales * 100)/totalAt).toFixed(6));
              // data.series.push({
              //   name: 'Tasa de Frecuencia',
              //   value: TF === Infinity ? 0 : TF
              // });
              // data.series.push({
              //   name: 'Tasa de Severidad',
              //   value: TS === Infinity ? 0 : TS
              // });
              
              dataTF.push(TF === Infinity ? 0 : TF)
              dataTS.push(TS === Infinity ? 0 : TS)
              dataMetaTF.push((meta1)?((meta1[(flagCoronaTotal)?'tfDivision':'tfPlanta'])?meta1[(flagCoronaTotal)?'tfDivision':'tfPlanta']:0):0)
              dataMetaTS.push((meta1)?((meta1[(flagCoronaTotal)?'tsDivision':'tsPlanta'])?meta1[(flagCoronaTotal)?'tsDivision':'tsPlanta']:0):0)

              // tasaFrecuencia1.push(data);

            });
            

            // Corona total
            let mesesYear=(this.filtroAnioTasa_2==new Date().getFullYear())?new Date().getMonth()+1:12;
            let numMesesSelect=(this.filtroMesesMeta_2.length>0?this.filtroMesesMeta_2.length:mesesYear)
            let totalesTrabajadores=trabajadoresTotalesMes+totalTrabajadoresTempMes

            switch (e) {
              case 'dir':
                totalesTrabajadores=trabajadoresTotalesMes
                break;
              case 'temp':
                totalesTrabajadores=totalTrabajadoresTempMes
                break;
              default:
                break;
            }

            dataTF.push(totalesTrabajadores>0?Number((reportesAt.length*100*numMesesSelect)/totalesTrabajadores):0)
            dataTS.push(totalesTrabajadores>0?Number((totalDiasPerdidos*100*numMesesSelect)/totalesTrabajadores):0)
            dataMetaTF.push((meta1)?((meta1[(flagCoronaTotal)?'tfAnual':'tfDivision'])?meta1[(flagCoronaTotal)?'tfAnual':'tfDivision']:0):0)
            dataMetaTS.push((meta1)?((meta1[(flagCoronaTotal)?'tsAnual':'tsDivision'])?meta1[(flagCoronaTotal)?'tsAnual':'tsDivision']:0):0)
            // dataMetaTF.push(0)
            // dataMetaTS.push(0)

            dataMeta_2.datasets[1].data=dataMetaTF
            dataMeta_2.datasets[3].data=dataMetaTS
            dataMeta_2.datasets[0].data=dataTF
            dataMeta_2.datasets[2].data=dataTS


            // Fin Corona total
            Object.assign(this, {dataMeta_2});
            localStorage.setItem('dataMeta_2', JSON.stringify(dataMeta_2));
            this.filtroMeta_2()
            this.tasasNotFoundMeta = false;
          }else{
            this.tasasNotFoundMeta = true;

          };
        });
      }
    }

  }
  filtroMeta_2(){
    let dataMeta_2: any = JSON.parse(localStorage.getItem('dataMeta_2')!);

    if(this.selectPais11!='Corona Total')
      if(this.PlantaSelect11)
        if(this.PlantaSelect11.length > 0){
          let plantasCoronaMeta11 = this.plantasList11.map((div:any) => div.label);

          let PlantaSelect = this.PlantaSelect11.map((div:any) => div).sort();

          dataMeta_2.labels = PlantaSelect;
          dataMeta_2.datasets[3].data = dataMeta_2.datasets[3].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
          dataMeta_2.datasets[2].data = dataMeta_2.datasets[2].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
          dataMeta_2.datasets[1].data = dataMeta_2.datasets[1].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
          dataMeta_2.datasets[0].data = dataMeta_2.datasets[0].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
        }

    if(this.selectPais11=='Corona Total')
      if(this.selectedDivisionResumen11)
        if(this.selectedDivisionResumen11.length > 0){
          let plantasCoronaMeta11 = this.divisionList11.map((div:any) => div.label);
  
          // let PlantaSelect:any=[]
          // PlantaSelect.push(this.selectedDivisionResumen11)
          let PlantaSelect = this.selectedDivisionResumen11.map((div:any) => div).sort();


          dataMeta_2.labels = PlantaSelect;
          dataMeta_2.datasets[3].data = dataMeta_2.datasets[3].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
          dataMeta_2.datasets[2].data = dataMeta_2.datasets[2].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
          dataMeta_2.datasets[1].data = dataMeta_2.datasets[1].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
          dataMeta_2.datasets[0].data = dataMeta_2.datasets[0].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
        }

    let filtrosListCoronaMeta11 = this.grafMetas2.map((div:any) => div.label);
    if(this.selectEventos11)
    if(this.selectEventos11.length > 0){
      let selectEventos11:any=this.order(this.selectEventos11)
      let filtroCoronaMeta11 = selectEventos11.map((div:any) => div.label);

      dataMeta_2.datasets = dataMeta_2.datasets.filter((data:any, index:any) => filtroCoronaMeta11.includes(filtrosListCoronaMeta11[index]));
    }
    Object.assign(this, {dataMeta_2});
  }
  //Octava grafica comprativo
  async getMeta_1Tasas_2(filter?: string){
    let flagCoronaTotal:boolean=false
    if(this.selectPais11_2){
      if(this.selectPais11_2=='Corona Total')flagCoronaTotal=true
      else flagCoronaTotal=false
    }else flagCoronaTotal=false

    if(this.plantasList11_2 || flagCoronaTotal)
    if(this.plantasList11_2.length>0  || flagCoronaTotal){
      let filterQuery = new FilterQuery();

      let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.selectedAnioMeta_2_2);

      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais11_2)if(this.selectPais11_2!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais11_2);
      if(!flagCoronaTotal)if(this.selectedDivisionResumen11_2)if(this.selectPais11_2!='Corona Total')reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen11_2);
      if(flagCoronaTotal)if(this.selectedDivisionResumen11_2)if(this.selectedDivisionResumen11_2.length>0){
        reportesAtCopyDiv=[]
        this.selectedDivisionResumen11_2.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.padreNombre == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      if(this.PlantaSelect11_2)if(this.PlantaSelect11_2.length>0){
        reportesAtCopyDiv=[]
        this.PlantaSelect11_2.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
      //fin nuevo
      let listaPlantas = (flagCoronaTotal)?reportesAt.map(at => at.padreNombre).filter(at => at != null):reportesAt.map(at => at.nombrePlanta).filter(at => at != null);

      // let listaPlantas = reportesAt.map(at => at.nombrePlanta).filter(at => at != null);  
      let plantas = listaPlantas.filter((div, index) => {
        return listaPlantas.indexOf(div) === index;
      }).sort();
      plantas.push((flagCoronaTotal)?'Corona total':this.selectedDivisionResumen11_2)


      let dataMeta_2_2: {
        labels: any;
        datasets: any[];
        options?: any;
      } = {
        labels: plantas,
        datasets: [
          {
            label: 'Tasa de Frecuencia',
            backgroundColor: 'rgb(0, 176, 240,0.5)',
            borderColor: 'rgb(0, 176, 240)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta de TF',
            backgroundColor: 'rgb(10, 53, 255)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(10, 53, 255)',
            data: [],
            type: 'line'
          },
          {
            label: 'Tasa de Severidad',
            backgroundColor: 'rgb(259, 69, 18,0.5)',
            borderColor: 'rgb(259, 69, 18)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta de TS',
            backgroundColor: 'rgb(67, 67, 72)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(67, 67, 72)',
            data: [],
            type: 'line'
          }
        ]
      };
      let filterQueryMeta = new FilterQuery();
      filterQueryMeta.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioMeta_2_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()}
      ];
      if(this.selectPais11_2)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais11_2.toString()})
      if(this.selectedDivisionResumen11_2)if(this.selectPais11_2 != 'Corona Total')filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen11_2})

      let meta:any
      await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
        meta=metas.data
      })

      let filterQueryTotal = new FilterQuery();
      filterQueryTotal.sortOrder = SortOrder.ASC;
      filterQueryTotal.sortField = "id";
      filterQueryTotal.filterList = [
        {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioMeta_2_2.toString()},
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()},
        {criteria: Criteria.EQUALS, field: "pais", value1: 'Corona Total'}
      ];

      let metaTotal:any
      await this.viewHHtMetasService.getWithFilter(filterQueryTotal).then((metas:any)=>{
        metaTotal=metas.data
      })

      try{
        switch (filter) {
          case 'dir':
            reportesAt = reportesAt.filter(at => at.temporal === null);
            throw 'dir';
          case 'temp':
            reportesAt = reportesAt.filter(at => at.temporal);
            throw 'temp';
          default:
            throw 'err';
        }
      }catch (e){

        filterQuery.sortOrder = SortOrder.ASC;
        filterQuery.sortField = "id";
        filterQuery.fieldList=this.fieldHht;
        filterQuery.filterList = [
          {criteria: Criteria.EQUALS, field: "anio", value1: this.selectedAnioMeta_2_2.toString()},
          {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
        ];
        if(this.selectPais11_2)if(this.selectPais11_2 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais11_2.toString()})
        if(this.selectedDivisionResumen11_2)if(this.selectPais11_2 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen11_2).id.toString()})
        
        await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {
          let hhtTemp: Array<any>;
          let filterQuery2 = new FilterQuery();
          filterQuery2.sortField = "id";
          filterQuery2.fieldList=this.fieldHht;
          filterQuery2.filterList = [
            {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_2_2.toString()},
            {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
            {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
          ];
          if(this.selectPais11_2)if(this.selectPais11_2 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais11_2.toString()})
          if(this.selectedDivisionResumen11_2)if(this.selectPais11_2 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen11_2).id.toString()})

          await this.hhtService.findByFilter(filterQuery2)
          .then((res2: any) => {
            hhtTemp = Array.from(res2.data);

          }).catch((err: any) => {
            console.error('Error al leer hht de temporales', err);
          });

          if(res.data.length > 0 || hhtTemp!) {
            let trabajadoresTotalesMes=0
            let totalTrabajadoresTempMes=0
            let totalDiasPerdidos=0
            let AtMortalesTotal=0
            // let plantasList11: any = this.plantasList11_2.filter((item:any) => plantas.includes(item.label));
            let planta = (flagCoronaTotal)?this.divisionList11_2.filter((item:any) => plantas.includes(item.label)):this.plantasList11_2.filter((item:any) => plantas.includes(item.label));

            let dataTS:any=[]
            let dataTF:any=[]
            let dataMetaTS:any=[]
            let dataMetaTF:any=[]
            let meta1:any
            planta.forEach((plantas:any) => {

              let plantaL=plantas.value
              meta1=(flagCoronaTotal)?metaTotal.find((met:any)=> met.nombreDivision==plantaL):meta.find((met:any)=> met.nombrePlanta==plantaL)


              let trabajadoresTotales = 0;
              let mesesFiltrados = 0;
 
              res.data.forEach((eleHHt:any) => {
                let trabajadoresPorPlanta = 0;
                if(this.filtroMesesMeta_2_2.length > 0){  
                  if(this.filtroMesesMeta_2_2.includes(eleHHt.mes)){
                      if (plantaL === eleHHt[(flagCoronaTotal)?'planta_area_nombre':'planta_nombre']) {
                        trabajadoresPorPlanta += eleHHt.numeroPersonas? eleHHt.numeroPersonas : 0;

                      }
                    trabajadoresTotales += trabajadoresPorPlanta;
                    mesesFiltrados++;
                  }
                }else{
                    if (plantaL === eleHHt[(flagCoronaTotal)?'planta_area_nombre':'planta_nombre']) {
                      trabajadoresPorPlanta += eleHHt.numeroPersonas? eleHHt.numeroPersonas : 0;
                    }
                  trabajadoresTotales += trabajadoresPorPlanta;
                }
              });          
              trabajadoresTotalesMes += trabajadoresTotales

              if(mesesFiltrados > 0) trabajadoresTotales = trabajadoresTotales / mesesFiltrados;

              let totalTrabajadoresTemp = 0;
              let trabajadoresPorMes:any = [];
              this.meses.forEach((mes, index) => {
                let totalTrabajadoresMes = 0;
                if(this.filtroMesesMeta_2_2.length > 0){
                  if(this.filtroMesesMeta_2_2.includes(mes)){
                    hhtTemp.forEach((hht:any, indexHHT) => {
                      if(mes === hht.mes){
                        if (plantaL === hht[(flagCoronaTotal)?'planta_area_nombre':'planta_nombre']) {
                          let totalTrabajadores = hht.numeroPersonas? hht.numeroPersonas! : 0;
                          totalTrabajadoresMes += totalTrabajadores;

                        }
                      }
                    });
                  }
                }else{
                  hhtTemp.forEach((hht, indexHHT) => {

                      if (plantaL === hht[(flagCoronaTotal)?'planta_area_nombre':'planta_nombre']) {
                        let totalTrabajadores = hht.numeroPersonas? hht.numeroPersonas! : 0;
                        totalTrabajadoresMes += totalTrabajadores!;
                      }
                    // }
                  });
                }
                trabajadoresPorMes.push(totalTrabajadoresMes);
              });
              if(this.filtroMesesMeta_2_2.length > 0){
                let totalTrabajadoresTemp = trabajadoresPorMes.reduce((count:any, trabajadores:any) => {
                  return count + trabajadores;
                }, 0);
                totalTrabajadoresTempMes+=totalTrabajadoresTemp;
                totalTrabajadoresTemp=totalTrabajadoresTemp / this.filtroMesesMeta_2_2.length
              }else{
                let totalTrabajadoresTemp = trabajadoresPorMes.reduce((count:any, trabajadores:any) => {
                  return count + trabajadores;
                }, 0);
                totalTrabajadoresTempMes+=totalTrabajadoresTemp;
                totalTrabajadoresTemp=totalTrabajadoresTemp /((this.filtroAnioTasa_1_2==new Date().getFullYear())?new Date().getMonth()+1:12)
              }          

              let totalAt = reportesAt.filter(at => at[(flagCoronaTotal)?'padreNombre':'nombrePlanta'] === plantaL).length;

              let diasPerdidos = reportesAt.filter(at => at[(flagCoronaTotal)?'padreNombre':'nombrePlanta'] === plantaL && at.incapacidades !== null 
                                                          && at.incapacidades !== 'null')
                                            .reduce((count, item) => {
                                              return count + JSON.parse(item.incapacidades).reduce((count2:any, incapacidad:any) => {
                                                return count2 + incapacidad.diasAusencia;
                                              }, 0);
                                            }, 0);
              totalDiasPerdidos +=diasPerdidos;
              let AtMortales = reportesAt.filter(at => at[(flagCoronaTotal)?'padreNombre':'nombrePlanta'] === plantaL && at.causoMuerte === true).length;
              AtMortalesTotal+=AtMortales


              let TF = isNaN(Number((totalAt * 100)/((trabajadoresTotales+totalTrabajadoresTemp)))) ? 0.0 : Number(Number((totalAt * 100)/(trabajadoresTotales+totalTrabajadoresTemp)).toFixed(6));
              let TS = isNaN(Number((diasPerdidos * 100)/(trabajadoresTotales+totalTrabajadoresTemp))) ? 0.0 : Number(Number((diasPerdidos * 100)/(trabajadoresTotales+totalTrabajadoresTemp)).toFixed(6));
              // let PAT = isNaN(Number((AtMortales * 100)/totalAt)) ? 0.0 : Number(Number((AtMortales * 100)/totalAt).toFixed(6));
              // data.series.push({
              //   name: 'Tasa de Frecuencia',
              //   value: TF === Infinity ? 0 : TF
              // });
              // data.series.push({
              //   name: 'Tasa de Severidad',
              //   value: TS === Infinity ? 0 : TS
              // });
              
              dataTF.push(TF === Infinity ? 0 : TF)
              dataTS.push(TS === Infinity ? 0 : TS)
              dataMetaTF.push((meta1)?((meta1[(flagCoronaTotal)?'tfDivision':'tfPlanta'])?meta1[(flagCoronaTotal)?'tfDivision':'tfPlanta']:0):0)
              dataMetaTS.push((meta1)?((meta1[(flagCoronaTotal)?'tsDivision':'tsPlanta'])?meta1[(flagCoronaTotal)?'tsDivision':'tsPlanta']:0):0)

              // tasaFrecuencia1.push(data);

            });

            // Corona total
            let mesesYear=(this.filtroAnioTasa_2_2==new Date().getFullYear())?new Date().getMonth()+1:12;
            let numMesesSelect=(this.filtroMesesMeta_2_2.length>0?this.filtroMesesMeta_2_2.length:mesesYear)
            let totalesTrabajadores=trabajadoresTotalesMes+totalTrabajadoresTempMes

            switch (e) {
              case 'dir':
                totalesTrabajadores=trabajadoresTotalesMes
                break;
              case 'temp':
                totalesTrabajadores=totalTrabajadoresTempMes
                break;
              default:
                break;
            }

            // let meta1:any=metaTotal.find((met:any)=> met.nombreDivision==this.selectedDivisionResumen11_2)

            dataTF.push(totalesTrabajadores>0?Number((reportesAt.length*100*numMesesSelect)/totalesTrabajadores):0)
            dataTS.push(totalesTrabajadores>0?Number((totalDiasPerdidos*100*numMesesSelect)/totalesTrabajadores):0)
            dataMetaTF.push((meta1)?((meta1[(flagCoronaTotal)?'tfAnual':'tfDivision'])?meta1[(flagCoronaTotal)?'tfAnual':'tfDivision']:0):0)
            dataMetaTS.push((meta1)?((meta1[(flagCoronaTotal)?'tsAnual':'tsDivision'])?meta1[(flagCoronaTotal)?'tsAnual':'tsDivision']:0):0)
   

            dataMeta_2_2.datasets[1].data=dataMetaTF
            dataMeta_2_2.datasets[3].data=dataMetaTS
            dataMeta_2_2.datasets[0].data=dataTF
            dataMeta_2_2.datasets[2].data=dataTS

            // // Corona total
            // let mesesYear=(this.filtroAnioTasa_1==new Date().getFullYear())?new Date().getMonth()+1:12;
            // let numMesesSelect=(this.selectedMesesTasa1.length>0?this.selectedMesesTasa1.length:mesesYear)
            // let totalesTrabajadores=trabajadoresTotalesMes+totalTrabajadoresTempMes

            // switch (e) {
            //   case 'dir':
            //     totalesTrabajadores=trabajadoresTotalesMes
            //     break;
            //   case 'temp':
            //     totalesTrabajadores=totalTrabajadoresTempMes
            //     break;
            //   default:
            //     break;
            // }

            // let dataTotal:any = {
            //   name: 'Corona total',
            //   series: []
            // };
            
            // dataTotal.series.push({
            //   name: 'Tasa de Frecuencia',
            //   value: totalesTrabajadores>0?Number((reportesAt.length*100*numMesesSelect)/totalesTrabajadores):0
            // });
            // dataTotal.series.push({
            //   name: 'Tasa de Severidad',
            //   value: totalesTrabajadores>0?Number((totalDiasPerdidos*100*numMesesSelect)/totalesTrabajadores):0
            // });

            
            // tasaFrecuencia1.push(dataTotal);

            // Fin Corona total
            Object.assign(this, {dataMeta_2_2});
            localStorage.setItem('dataMeta_2_2', JSON.stringify(dataMeta_2_2));
            // this.filtroTasas1_1();
            this.filtroMeta_2_2()
            this.tasasNotFoundMeta_2 = false;
          }else{
            this.tasasNotFoundMeta_2 = true;

          };
        });
      }
    }

  }
  filtroMeta_2_2(){
    let dataMeta_2_2: any = JSON.parse(localStorage.getItem('dataMeta_2_2')!);

    // let plantasCoronaMeta11 = this.plantasList11_2.map((div:any) => div.label);
    // if(this.PlantaSelect11_2)
    // if(this.PlantaSelect11_2.length > 0){
    //   let PlantaSelect = this.PlantaSelect11_2.map((div:any) => div.nombre).sort();

    //   dataMeta_2_2.labels = PlantaSelect;
    //   dataMeta_2_2.datasets[3].data = dataMeta_2_2.datasets[3].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
    //   dataMeta_2_2.datasets[2].data = dataMeta_2_2.datasets[2].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
    //   dataMeta_2_2.datasets[1].data = dataMeta_2_2.datasets[1].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
    //   dataMeta_2_2.datasets[0].data = dataMeta_2_2.datasets[0].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
    // }
    if(this.selectPais11_2!='Corona Total')
      if(this.PlantaSelect11_2)
        if(this.PlantaSelect11_2.length > 0){
          let plantasCoronaMeta11 = this.plantasList11_2.map((div:any) => div.label);

          let PlantaSelect = this.PlantaSelect11_2.map((div:any) => div).sort();

          dataMeta_2_2.labels = PlantaSelect;
          dataMeta_2_2.datasets[3].data = dataMeta_2_2.datasets[3].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
          dataMeta_2_2.datasets[2].data = dataMeta_2_2.datasets[2].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
          dataMeta_2_2.datasets[1].data = dataMeta_2_2.datasets[1].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
          dataMeta_2_2.datasets[0].data = dataMeta_2_2.datasets[0].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
        }

    if(this.selectPais11_2=='Corona Total')
      if(this.selectedDivisionResumen11_2)
        if(this.selectedDivisionResumen11_2.length > 0){
          let plantasCoronaMeta11 = this.divisionList11_2.map((div:any) => div.label);
  
          // let PlantaSelect:any=[]
          // PlantaSelect.push(this.selectedDivisionResumen11)
          let PlantaSelect = this.selectedDivisionResumen11_2.map((div:any) => div).sort();


          dataMeta_2_2.labels = PlantaSelect;
          dataMeta_2_2.datasets[3].data = dataMeta_2_2.datasets[3].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
          dataMeta_2_2.datasets[2].data = dataMeta_2_2.datasets[2].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
          dataMeta_2_2.datasets[1].data = dataMeta_2_2.datasets[1].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
          dataMeta_2_2.datasets[0].data = dataMeta_2_2.datasets[0].data.filter((data:any, index:any) => PlantaSelect.includes(plantasCoronaMeta11[index]));
        }

    let filtrosListCoronaMeta11 = this.grafMetas2.map((div:any) => div.label);
    if(this.selectEventos11_2)
    if(this.selectEventos11_2.length > 0){
      let selectEventos11:any=this.order(this.selectEventos11_2)
      let filtroCoronaMeta11 = selectEventos11.map((div:any) => div.label);

      dataMeta_2_2.datasets = dataMeta_2_2.datasets.filter((data:any, index:any) => filtroCoronaMeta11.includes(filtrosListCoronaMeta11[index]));
    }
    // Object.assign(this, {divisionesCoronaIli1});
    Object.assign(this, {dataMeta_2_2});
  }



  // octava.5 grafica
  filtroMeta2meses?:string;
  tipoFiltroMeta2meses:number=0
  filtroAnioTasa_2meses: number = new Date().getFullYear();
  filterMemoryTasas_2meses?:String;



  async getTasas_2Meses(filter?: string){
    if(this.selectedDivisionResumen13){

      let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.filtroAnioTasa_2meses);

      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais13)if(this.selectPais13!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais13);
      if(this.selectedDivisionResumen13)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen13);
      if(this.PlantaSelect13)if(this.PlantaSelect13.length>0){
        reportesAtCopyDiv=[]
        this.PlantaSelect13.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element.nombre));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
    //fin nuevo

      if(filter!='filtro')this.filterMemoryTasas_2meses=filter

      try {
        switch (this.filterMemoryTasas_2meses) {
          case 'dir':
            reportesAt = reportesAt.filter(at => at.temporal === null);
            throw 'dir';
          case 'temp':
            reportesAt = reportesAt.filter(at => at.temporal);
            throw 'temp';
          default:
            throw 'err';
        }
      } catch (error) {
        
        // if(this.filtroDivisionesTasa_2 && this.filtroDivisionesTasa_2 !== 'Corona total') reportesAt = reportesAt
        // .filter(at => this.filtroDivisionesTasa_2 === at.padreNombre);

        let filterQuery = new FilterQuery();

        filterQuery.sortOrder = SortOrder.ASC;
        filterQuery.sortField = "id";
        filterQuery.fieldList=this.fieldHht;
        filterQuery.filterList = [
          {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_2meses.toString()},
          {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
        ];
        if(this.selectPais13)if(this.selectPais13 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais13.toString()})
        if(this.selectedDivisionResumen13)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen13})
        // if(this.PlantaSelect5)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.nombre", value1: this.PlantaSelect5.toString()})
        await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {

          let hhtTemp: Array<any>;
          let filterQuery2 = new FilterQuery();
          filterQuery2.sortField = "id";
          filterQuery2.fieldList=this.fieldHht;
          filterQuery2.filterList = [
            {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_2meses.toString()},
            {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
            {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
          ];
          if(this.selectPais13)if(this.selectPais13 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais13.toString()})
          if(this.selectedDivisionResumen13)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen13})
          // if(this.PlantaSelect5)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.nombre", value1: this.PlantaSelect5.toString()})
          await this.hhtService.findByFilter(filterQuery2)
          .then((res2: any) => {
            hhtTemp = Array.from(res2.data);
          }).catch((err: any) => {
            console.error('Error al leer hht de temporales', err);
          });

          let meses:any[]=[]
          if(this.filtroMesesMeta_2meses.length>0) meses = this.MesesValue.filter(data => this.filtroMesesMeta_2meses.includes(data.label));
          else meses=this.MesesValue.map(ele=>ele)

          let dataMeta_2meses: {
            labels: any;
            datasets: any[];
            options?: any;
          } = {
            labels: meses.map(mes=>mes.label),
            datasets: [
              {
                label: 'Tasa de Frecuencia',
                backgroundColor: 'rgb(0, 176, 240,0.5)',
                borderColor: 'rgb(0, 176, 240)',
                borderWidth: 1,
                data: [],
                type: 'bar'
              },
              {
                label: 'Meta de TF',
                backgroundColor: 'rgb(10, 53, 255)',
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                borderColor: 'rgb(10, 53, 255)',
                data: [],
                type: 'line'
              },
              {
                label: 'Tasa de Severidad',
                backgroundColor: 'rgb(259, 69, 18,0.5)',
                borderColor: 'rgb(259, 69, 18)',
                borderWidth: 1,
                data: [],
                type: 'bar'
              },
              {
                label: 'Meta de TS',
                backgroundColor: 'rgb(67, 67, 72)',
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                borderColor: 'rgb(67, 67, 72)',
                data: [],
                type: 'line'
              }
            ]
          };

          let dataTS:any=[]
          let dataTF:any=[]
          let dataMetaTS:any=[]
          let dataMetaTF:any=[]

          if(res.data.length > 0 || hhtTemp!){
            let filterQueryMeta = new FilterQuery();
            filterQueryMeta.sortOrder = SortOrder.ASC;
            filterQueryMeta.sortField = "id";
            filterQueryMeta.filterList = [
              {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_2meses.toString()},
              {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()},
            ];
            if(this.selectPais13)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais13})
            if(this.selectedDivisionResumen13)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen13})

            let meta:any
            await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
              meta=metas.data
            })

            let meta1:any=meta.find((met:any)=> met.nombreDivision==this.selectedDivisionResumen13)
            meses.forEach((mes, index) => {

              let trabajadoresTotales2 = 0;
              let totalAt = 0;
              let diasPerdidos = 0;
              let atMortales = 0;
              // let data:any = {
              //   name: mes.label,
              //   series: []
              // };

              res.data.forEach((elem:any) => {
                // let data: DataHht = <DataHht>JSON.parse(elem.valor!).Data;
                let trabajadoresPorArea = 0;
                
                if(this.PlantaSelect13){
                  if(this.PlantaSelect13.length>0){
                    this.PlantaSelect13.forEach((pl:any) => {
                      if(elem.mes === mes.label){
                        if(pl.nombre==elem.planta_nombre)trabajadoresPorArea += elem.numeroPersonas ? elem.numeroPersonas:0

    
                      }
                  });
                  trabajadoresTotales2 += trabajadoresPorArea;}
                  else {
                    if(elem.mes === mes.label){
                      trabajadoresPorArea += elem.numeroPersonas ? elem.numeroPersonas:0
    
                    }
                    trabajadoresTotales2 += trabajadoresPorArea;
                  }
                } else {
                  if(elem.mes === mes.label){
                    trabajadoresPorArea += elem.numeroPersonas ? elem.numeroPersonas:0

                  }
                  trabajadoresTotales2 += trabajadoresPorArea;
                }
              });
              let totalTrabajadoresTemp = 0;
              hhtTemp.forEach((hht, index) => {
                let trabajadoresTemPorArea = 0;

                if(this.PlantaSelect13){
                  if(this.PlantaSelect13.length>0){
                  this.PlantaSelect13.forEach((pl:any) => {
                    if(hht.mes === mes.label){
                      if(pl.nombre==hht.planta_nombre)trabajadoresTemPorArea += hht.numeroPersonas ? hht.numeroPersonas:0
                    }
                  });
  
                  totalTrabajadoresTemp += trabajadoresTemPorArea;}else {
                    if(hht.mes == mes.label){
                      totalTrabajadoresTemp += hht.numeroPersonas ? hht.numeroPersonas : 0;
                    }
                  }
                } else {
                  if(hht.mes == mes.label){
                    totalTrabajadoresTemp += hht.numeroPersonas ? hht.numeroPersonas : 0;
                  }
                }
              });

              totalAt = reportesAt.filter(at => mes.value === new Date(at.fechaReporte).getMonth()).length;
              
              diasPerdidos = reportesAt.filter(at => mes.value === new Date(at.fechaReporte).getMonth() && at.incapacidades !== null && at.incapacidades !== 'null')
                                                    .reduce((count, item) => {
                                                      return count + JSON.parse(item.incapacidades).reduce((count2:any, incapacidad:any) => {
                                                        return count2 + incapacidad.diasAusencia;
                                                      }, 0);
                                                    }, 0);
              
                                                    atMortales = reportesAt.filter(at => mes.value === new Date(at.fechaReporte).getMonth() && at.causoMuerte === true).length;

              let tasaFrecuencia = Number(Number((totalAt * 100)/(trabajadoresTotales2+totalTrabajadoresTemp)).toFixed(6));
              let tasaSeveridad = Number(Number((diasPerdidos * 100)/(trabajadoresTotales2+totalTrabajadoresTemp)).toFixed(6));

              dataTF.push(tasaFrecuencia === Infinity ? 0 : tasaFrecuencia)
              dataTS.push(tasaFrecuencia === Infinity ? 0 : tasaSeveridad)
              dataMetaTF.push((meta1)?((meta1.tfDivision)?meta1.tfDivision:0):0)
              dataMetaTS.push((meta1)?((meta1.tsDivision)?meta1.tsDivision:0):0)
            });

            dataMeta_2meses.datasets[1].data=dataMetaTF
            dataMeta_2meses.datasets[3].data=dataMetaTS
            dataMeta_2meses.datasets[0].data=dataTF
            dataMeta_2meses.datasets[2].data=dataTS
            
            localStorage.setItem('dataMeta_2meses', JSON.stringify(dataMeta_2meses));
            Object.assign(this, {dataMeta_2meses});
            // this.filtroTasas_2meses();
            this.tasasNotFound2 = false;
          }else{
            this.tasasNotFound2 = true;
          }
        });
      }
    }
  }

  filtroTasas_2meses(){
    let dataMeta_2meses: any = JSON.parse(localStorage.getItem('dataMeta_2meses')!);
    let filtrosListCoronaMeta13 = this.grafMetas2.map((div:any) => div.label);
    if(this.selectEventos13)
    if(this.selectEventos13.length > 0){
      let selectEventos13:any=this.order(this.selectEventos13)
      let filtroCoronaMeta13 = selectEventos13.map((div:any) => div.label);

      dataMeta_2meses.datasets = dataMeta_2meses.datasets.filter((data:any, index:any) => filtroCoronaMeta13.includes(filtrosListCoronaMeta13[index]));
    }
    Object.assign(this, {dataMeta_2meses});
  }

  
  // Comparativo octava.5 grafica
  filtroMeta2meses_2?:string;
  tipoFiltroMeta2meses_2:number=0
  filtroAnioTasa_2meses_2: number = new Date().getFullYear();
  filterMemoryTasas_2meses_2?:String;



  async getTasas_2Meses_2(filter?: string){
    if(this.selectedDivisionResumen13_2){

      let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).filter((at:any) => new Date(at.fechaReporte).getFullYear() === this.filtroAnioTasa_2meses_2);

      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais13_2)if(this.selectPais13_2!='Corona Total')reportesAt = reportesAt.filter(at => at.pais == this.selectPais13_2);
      if(this.selectedDivisionResumen13_2)reportesAt=reportesAt.filter(at => at.padreNombre == this.selectedDivisionResumen13_2);
      if(this.PlantaSelect13_2)if(this.PlantaSelect13_2.length>0){
        reportesAtCopyDiv=[]
        this.PlantaSelect13_2.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(reportesAt.filter(at => at.nombrePlanta == element.nombre));
        });
        reportesAt=[...reportesAtCopyDiv]
      }
    //fin nuevo

      if(filter!='filtro')this.filterMemoryTasas_2meses_2=filter

      try {
        switch (this.filterMemoryTasas_2meses_2) {
          case 'dir':
            reportesAt = reportesAt.filter(at => at.temporal === null);
            throw 'dir';
          case 'temp':
            reportesAt = reportesAt.filter(at => at.temporal);
            throw 'temp';
          default:
            throw 'err';
        }
      } catch (error) {
        
        // if(this.filtroDivisionesTasa_2 && this.filtroDivisionesTasa_2 !== 'Corona total') reportesAt = reportesAt
        // .filter(at => this.filtroDivisionesTasa_2 === at.padreNombre);

        let filterQuery = new FilterQuery();

        filterQuery.sortOrder = SortOrder.ASC;
        filterQuery.sortField = "id";
        filterQuery.fieldList=this.fieldHht;
        filterQuery.filterList = [
          {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_2meses_2.toString()},
          {criteria: Criteria.EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
        ];
        if(this.selectPais13_2)if(this.selectPais13_2 != 'Corona Total')filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais13_2.toString()})
        if(this.selectedDivisionResumen13_2)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen13_2})
        // if(this.PlantaSelect5)filterQuery.filterList.push({criteria: Criteria.EQUALS, field: "planta.nombre", value1: this.PlantaSelect5.toString()})
        await this.hhtService.findByFilter(filterQuery).then(async (res: any) => {

          let hhtTemp: Array<any>;
          let filterQuery2 = new FilterQuery();
          filterQuery2.sortField = "id";
          filterQuery2.fieldList=this.fieldHht;
          filterQuery2.filterList = [
            {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_2meses_2.toString()},
            {criteria: Criteria.EQUALS, field: "empresa.id", value1: this.sessionService.getParamEmp()},
            {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: this.sessionService.getParamEmp()}
          ];
          if(this.selectPais13_2)if(this.selectPais13_2 != 'Corona Total')filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais13_2.toString()})
          if(this.selectedDivisionResumen13_2)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.nombre", value1: this.selectedDivisionResumen13_2})
          // if(this.PlantaSelect5)filterQuery2.filterList.push({criteria: Criteria.EQUALS, field: "planta.nombre", value1: this.PlantaSelect5.toString()})
          await this.hhtService.findByFilter(filterQuery2)
          .then((res2: any) => {
            hhtTemp = Array.from(res2.data);
          }).catch((err: any) => {
            console.error('Error al leer hht de temporales', err);
          });

          let meses:any[]=[]
          if(this.filtroMesesMeta_2meses_2.length>0) meses = this.MesesValue.filter(data => this.filtroMesesMeta_2meses_2.includes(data.label));
          else meses=this.MesesValue.map(ele=>ele)

          let dataMeta_2meses_2: {
            labels: any;
            datasets: any[];
            options?: any;
          } = {
            labels: meses.map(mes=>mes.label),
            datasets: [
              {
                label: 'Tasa de Frecuencia',
                backgroundColor: 'rgb(0, 176, 240,0.5)',
                borderColor: 'rgb(0, 176, 240)',
                borderWidth: 1,
                data: [],
                type: 'bar'
              },
              {
                label: 'Meta de TF',
                backgroundColor: 'rgb(10, 53, 255)',
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                borderColor: 'rgb(10, 53, 255)',
                data: [],
                type: 'line'
              },
              {
                label: 'Tasa de Severidad',
                backgroundColor: 'rgb(259, 69, 18,0.5)',
                borderColor: 'rgb(259, 69, 18)',
                borderWidth: 1,
                data: [],
                type: 'bar'
              },
              {
                label: 'Meta de TS',
                backgroundColor: 'rgb(67, 67, 72)',
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                borderColor: 'rgb(67, 67, 72)',
                data: [],
                type: 'line'
              }
            ]
          };

          let dataTS:any=[]
          let dataTF:any=[]
          let dataMetaTS:any=[]
          let dataMetaTF:any=[]

          if(res.data.length > 0 || hhtTemp!){
            let filterQueryMeta = new FilterQuery();
            filterQueryMeta.sortOrder = SortOrder.ASC;
            filterQueryMeta.sortField = "id";
            filterQueryMeta.filterList = [
              {criteria: Criteria.EQUALS, field: "anio", value1: this.filtroAnioTasa_2meses_2.toString()},
              {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()},
            ];
            if(this.selectPais13_2)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais13_2})
            if(this.selectedDivisionResumen13_2)filterQueryMeta.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen13_2})

            let meta:any
            await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
              meta=metas.data
            })

            let meta1:any=meta.find((met:any)=> met.nombreDivision==this.selectedDivisionResumen13_2)
            meses.forEach((mes, index) => {

              let trabajadoresTotales2 = 0;
              let totalAt = 0;
              let diasPerdidos = 0;
              let atMortales = 0;
              // let data:any = {
              //   name: mes.label,
              //   series: []
              // };

              res.data.forEach((elem:any) => {
                // let data: DataHht = <DataHht>JSON.parse(elem.valor!).Data;
                let trabajadoresPorArea = 0;
                
                if(this.PlantaSelect13_2){
                  if(this.PlantaSelect13_2.length>0){
                    this.PlantaSelect13_2.forEach((pl:any) => {
                      if(elem.mes === mes.label){
                        if(pl.nombre==elem.planta_nombre)
                        trabajadoresPorArea += elem.numeroPersonas ? elem.numeroPersonas:0
                      }
                  });
                  trabajadoresTotales2 += trabajadoresPorArea;}
                  else {
                    if(elem.mes === mes.label){
                      trabajadoresPorArea += elem.numeroPersonas ? elem.numeroPersonas:0
    
                    }
                    trabajadoresTotales2 += trabajadoresPorArea;
                  }
                } else {
                  if(elem.mes === mes.label){
                    trabajadoresPorArea += elem.numeroPersonas ? elem.numeroPersonas:0

                  }
                  trabajadoresTotales2 += trabajadoresPorArea;
                }
              });
              let totalTrabajadoresTemp = 0;
              hhtTemp.forEach((hht, index) => {
                let trabajadoresTemPorArea = 0;

                if(this.PlantaSelect13_2){
                  if(this.PlantaSelect13_2.length>0){
                  this.PlantaSelect13_2.forEach((pl:any) => {
                    if(hht.mes === mes.label){
                      if(pl.nombre==hht.planta_nombre)trabajadoresTemPorArea += hht.numeroPersonas ? hht.numeroPersonas:0
                    }
                  });
  
                  totalTrabajadoresTemp += trabajadoresTemPorArea;}else {
                    if(hht.mes == mes.label){
                      totalTrabajadoresTemp += hht.numeroPersonas ? hht.numeroPersonas : 0;
                    }
                  }
                } else {
                  if(hht.mes == mes.label){
                    totalTrabajadoresTemp += hht.numeroPersonas ? hht.numeroPersonas : 0;
                  }
                }
              });

              totalAt = reportesAt.filter(at => mes.value === new Date(at.fechaReporte).getMonth()).length;
              
              diasPerdidos = reportesAt.filter(at => mes.value === new Date(at.fechaReporte).getMonth() && at.incapacidades !== null && at.incapacidades !== 'null')
                                                    .reduce((count, item) => {
                                                      return count + JSON.parse(item.incapacidades).reduce((count2:any, incapacidad:any) => {
                                                        return count2 + incapacidad.diasAusencia;
                                                      }, 0);
                                                    }, 0);
              
                                                    atMortales = reportesAt.filter(at => mes.value === new Date(at.fechaReporte).getMonth() && at.causoMuerte === true).length;

              let tasaFrecuencia = Number(Number((totalAt * 100)/(trabajadoresTotales2+totalTrabajadoresTemp)).toFixed(6));
              let tasaSeveridad = Number(Number((diasPerdidos * 100)/(trabajadoresTotales2+totalTrabajadoresTemp)).toFixed(6));

              dataTF.push(tasaFrecuencia === Infinity ? 0 : tasaFrecuencia)
              dataTS.push(tasaFrecuencia === Infinity ? 0 : tasaSeveridad)
              dataMetaTF.push((meta1)?((meta1.tfDivision)?meta1.tfDivision:0):0)
              dataMetaTS.push((meta1)?((meta1.tsDivision)?meta1.tsDivision:0):0)
            });

            dataMeta_2meses_2.datasets[1].data=dataMetaTF
            dataMeta_2meses_2.datasets[3].data=dataMetaTS
            dataMeta_2meses_2.datasets[0].data=dataTF
            dataMeta_2meses_2.datasets[2].data=dataTS
            
            localStorage.setItem('dataMeta_2meses_2', JSON.stringify(dataMeta_2meses_2));
            Object.assign(this, {dataMeta_2meses_2});
            // this.filtroTasas_2meses();
            this.tasasNotFound2 = false;
          }else{
            this.tasasNotFound2 = true;
          }
        });
      }
    }
  }

  filtroTasas_2meses_2(){
    let dataMeta_2meses_2: any = JSON.parse(localStorage.getItem('dataMeta_2meses_2')!);
    let filtrosListCoronaMeta13_2 = this.grafMetas2.map((div:any) => div.label);
    if(this.selectEventos13_2)
    if(this.selectEventos13_2.length > 0){
      let selectEventos13_2:any=this.order(this.selectEventos13_2)
      let filtroCoronaMeta13_2 = selectEventos13_2.map((div:any) => div.label);

      dataMeta_2meses_2.datasets = dataMeta_2meses_2.datasets.filter((data:any, index:any) => filtroCoronaMeta13_2.includes(filtrosListCoronaMeta13_2[index]));
    }
    Object.assign(this, {dataMeta_2meses_2});
  }

  // Comun

  order(ele:any){
    ele.sort(function (a:any, b:any) {
      if (a.value > b.value) {
        return 1;
      }
      if (a.value < b.value) {
        return -1;
      }
      return 0;
    });
    return ele
  }

  contTotal(datos:any){
    let name:any=[]
    let datosGrafica_total:any=[]
    let total=new Map()
    datos.forEach((resp:any)=>{
      resp.series.forEach((resp2:any)=>{
        if(total.has(resp2.name)){total.set(resp2.name,total.get(resp2.name)+resp2.value)}
        else{total.set(resp2.name,resp2.value)
          name.push(resp2.name)}
      })
    })
    name.forEach((resp:any)=>{
      datosGrafica_total.push({name:resp,value:total.get(resp)})
    })
    
    datos.push({name:'Corona total',series:datosGrafica_total})
  
    return datos
  }

  flagTortaTotalEve:boolean=false
  flagTortaTotalDias:boolean=false

  flagIli1DivPla:boolean=false
  flagIli1DivPla_2:boolean=false
  async funcSelectPais(pais:any,filter:any){ 

    switch (filter) {
      case 'resumen':
        this.selectedDivisionResumen1=null
        this.PlantaSelect1=null
        this.plantasList1=[]
        if(pais)this.divisionList1=await this.getPlantas(pais.value)
        break;
      case 'totalEventos':
        this.selectedDivisionResumen2=null
        this.PlantaSelect2=null
        this.plantasList2=[]
        this.flagTortaTotalEve=false
        if(pais)this.divisionList2=await this.getPlantas(pais.value)
        this.getEventosAt();
        this.selectRangoEventosAt(this.filtroFechaAt![0],'desde' )
        this.flagTortaTotalEve=true
        break;
      case 'totalDias':
        this.selectedDivisionResumen3=null
        this.PlantaSelect3=null
        this.plantasList3=[]
        this.flagTortaTotalDias=false
        if(pais)this.divisionList3=await this.getPlantas(pais.value)
        this.getDiasPerdidosAt();
        this.selectRangoDiasPerdidosAt(this.filtroFechaDiasPerdidos[0],'desde' )
        this.flagTortaTotalDias=true
        break;
      case 'tasa1':
        this.selectedDivisionResumen4=null
        this.PlantaSelect4=null
        this.plantasList4=[]
        if(pais)this.divisionList4=await this.getPlantas(pais.value)
        this.getTasas_1('filtro')
        break;
      case 'tasa1_2':
        this.selectedDivisionResumen4_2=null
        this.PlantaSelect4_2=null
        this.plantasList4_2=[]
        if(pais)this.divisionList4_2=await this.getPlantas(pais.value)
        this.getTasas_1_2('filtro')
        break;
      case 'tasa2':
        this.selectedDivisionResumen5=null
        this.PlantaSelect5=null
        this.plantasList5=[]
        if(pais)this.divisionList5=await this.getPlantas(pais.value)
        this.getTasas_2('filtro')
        break;
      case 'tasa2_2':
        this.selectedDivisionResumen5_2=null
        this.PlantaSelect5_2=null
        this.plantasList5_2=[]
        if(pais)this.divisionList5_2=await this.getPlantas(pais.value)
        this.getTasas_2_2('filtro')
        break;
      case 'event1':
        this.selectedDivisionResumen6=null
        this.PlantaSelect6=null
        this.plantasList6=[]
        if(pais)this.divisionList6=await this.getPlantas(pais.value)
        if(this.selectPais6 == 'Corona Total')this.getEventos_1()
        break;
      case 'event1_2':
        this.selectedDivisionResumen6_2=null
        this.PlantaSelect6_2=null
        this.plantasList6_2=[]
        if(pais)this.divisionList6_2=await this.getPlantas(pais.value)
        if(this.selectPais6_2 == 'Corona Total')this.getEventos_1_2()
        break;
      case 'event2':
        this.selectedDivisionResumen7=null
        this.PlantaSelect7=null
        this.plantasList7=[]
        if(pais)this.divisionList7=await this.getPlantas(pais.value)
        break;
      case 'event2_2':
        this.selectedDivisionResumen7_2=null
        this.PlantaSelect7_2=null
        this.plantasList7_2=[]
        if(pais)this.divisionList7_2=await this.getPlantas(pais.value)
        break;
      case 'ili1':
        this.selectedDivisionResumen8=null
        this.PlantaSelect8=null
        this.plantasList8=[]
        if(pais)this.divisionList8=await this.getPlantas(pais.value)
        else{
          this.flagIli1DivPla=true
          this.getIli_1Total()
        }

        if(pais)
        if(pais.value =='Corona Total'){
          this.flagIli1DivPla=true
          this.getIli_1Total()
        }else this.flagIli1DivPla=false
        break;
      case 'ili1_2':
        this.selectedDivisionResumen8_2=null
        this.PlantaSelect8_2=null
        this.plantasList8_2=[]
        if(pais)this.divisionList8_2=await this.getPlantas(pais.value)
        else{
          this.flagIli1DivPla_2=true
          this.getIli_1Total_2()
        }

        if(pais)
        if(pais.value =='Corona Total'){
          this.flagIli1DivPla_2=true
          this.getIli_1Total_2()
        }else this.flagIli1DivPla_2=false
        break;
      case 'ili2':
        this.selectedDivisionResumen9=null
        this.PlantaSelect9=null
        this.plantasList9=[]
        if(pais)this.divisionList9=await this.getPlantas(pais.value)
        break;
      case 'ili2_2':
        this.selectedDivisionResumen9_2=null
        this.PlantaSelect9_2=null
        this.plantasList9_2=[]
        if(pais)this.divisionList9_2=await this.getPlantas(pais.value)
        break;
      case 'meta1':
        this.selectedDivisionResumen10=null
        this.PlantaSelect10=null
        this.plantasList10=[]
        if(pais)this.divisionList10=await this.getPlantas(pais.value)
        if(this.selectPais10 == 'Corona Total')this.getMeta_1Eve()
        break;
      case 'meta1_2':
        this.selectedDivisionResumen10_2=null
        this.PlantaSelect10_2=null
        this.plantasList10_2=[]
        if(pais)this.divisionList10_2=await this.getPlantas(pais.value)
        if(this.selectPais10_2 == 'Corona Total')this.getMeta_1Eve_2()

        break;
      case 'meta1meses':
        this.selectedDivisionResumen12=null
        this.PlantaSelect12=null
        this.plantasList12=[]
        if(pais)this.divisionList12=await this.getPlantas(pais.value)
        break;
      case 'meta1_2meses':
        this.selectedDivisionResumen12_2=null
        this.PlantaSelect12_2=null
        this.plantasList12_2=[]
        if(pais)this.divisionList12_2=await this.getPlantas(pais.value)
        break;
      case 'meta2':
        this.selectedDivisionResumen11=null
        this.PlantaSelect11=null
        this.plantasList11=[]
        if(pais)this.divisionList11=await this.getPlantas(pais.value)
        if(this.selectPais11 == 'Corona Total')this.getMeta_1Tasas()
        break;
      case 'meta2_2':
        this.selectedDivisionResumen11_2=null
        this.PlantaSelect11_2=null
        this.plantasList11_2=[]
        if(pais)this.divisionList11_2=await this.getPlantas(pais.value)
        if(this.selectPais11_2 == 'Corona Total')this.getMeta_1Tasas_2()
        break;
      case 'meta2meses':
        this.selectedDivisionResumen13=null
        this.PlantaSelect13=null
        this.plantasList13=[]
        if(pais)this.divisionList13=await this.getPlantas(pais.value)
        break;
      case 'meta2_2meses':
        this.selectedDivisionResumen13_2=null
        this.PlantaSelect13_2=null
        this.plantasList13_2=[]
        if(pais)this.divisionList13_2=await this.getPlantas(pais.value)
        break;
      default:
        break;
    }
  }
  async getDivision(){
    let areafiltQuery = new FilterQuery();
    areafiltQuery.sortOrder = SortOrder.ASC;
    areafiltQuery.sortField = "nombre";
    areafiltQuery.fieldList = ["id", "nombre","nivel"];
    areafiltQuery.filterList = [
      { criteria: Criteria.EQUALS, field: "nivel", value1: "0" },
    ];
    this.divisionList =[]
    this.areaService.findByFilter(areafiltQuery).then(
      (resp:any) => {
        (<Area[]>resp['data']).forEach((ele:any)=>{
          this.divisionList.push({nombre:ele['nombre'],id:ele['id']})
        })        
      }
    ).catch((resp:any)=>{return this.divisionList})
    ;
  }

  
  async getPlantas(pais:string | null) {
    if(pais){
      let filterPlantaQuery = new FilterQuery();
      filterPlantaQuery.sortField = "id";
      filterPlantaQuery.sortOrder = -1;
      filterPlantaQuery.fieldList = this.fields;
      filterPlantaQuery.filterList = [
        { field: 'id_empresa', criteria: Criteria.EQUALS, value1: this.empresaId.toString() }]
      if(pais !='Corona Total')filterPlantaQuery.filterList.push({ field: 'pais', criteria: Criteria.EQUALS, value1: pais })
      
      let divisionListOut:any=[]
      return new Promise(async (resolve, reject) => {
        await this.plantasService.getPlantaWithFilter(filterPlantaQuery)
        .then((res:any) => {
          this.plantasList = (<Plantas[]>res.data).map(planta => planta);
          for(const ele of this.divisionList){
            if(this.getPlantasByArea(ele.id,res.data))divisionListOut.push({label:ele['nombre'],value:ele['nombre']})
          };
          resolve(divisionListOut);       
        }).catch(err => {
          resolve([]);
        });
      })}
    else{return []}
  }
  getPlantasByArea(id: any,plantasList:any): Plantas[] | null{
    if(!plantasList){
      return null;
    }
    let plantas = plantasList.filter((pl:any) => pl.area_id == id);
    return plantas.length > 0 ? plantas: null;
  }

  funcSelectDivision(div:any,filter:any){

    if(div.value){
      this.PlantaSelect1=null
      let dv:any
      let plantasList:any
      // if(filter!='resumen'){
        dv = this.divisionList.filter((dv1:any) => dv1.nombre == div.value);
        plantasList=this.plantasList.filter((pl1:any) => pl1.area_id == dv[0].id);
      // }
      // else{
      //   if(div.value.length>0){
      //     plantasList=[]
      //     div.value.forEach((element:any) => {
      //       dv=(this.divisionList.filter((dv1:any) => dv1.nombre == element));
      //       plantasList=plantasList.concat(this.plantasList.filter((pl1:any) => pl1.id_division == dv[0].id));
      //     });
      //   }else{
      //     dv=null
      //     plantasList=null
      //   }
      // }

      switch (filter) {
        case 'resumen':
          this.PlantaSelect1=null
          this.plantasList1=[]
          if(plantasList)
          for(const pl of plantasList){
            this.plantasList1.push({label:pl.nombre,value:pl.nombre})
          }
          break;
        case 'totalEventos':
          this.PlantaSelect2=null
          this.plantasList2=[]
          for(const pl of plantasList){
            this.plantasList2.push({label:pl.nombre,value:pl.nombre})
          }
          break;
        case 'totalDias':
          this.PlantaSelect3=null
            this.plantasList3=[]
            for(const pl of plantasList){
              this.plantasList3.push({label:pl.nombre,value:pl.nombre})
            }
            break;
        case 'tasa1':
          this.PlantaSelect4=null
          this.plantasList4=[]
          for(const pl of plantasList){
            this.plantasList4.push({label:pl.nombre,value:{nombre:pl.nombre,id:pl.id}})
          }
          this.getTasas_1('filtro')
          break;
        case 'tasa1_2':
          this.PlantaSelect4_2=null
          this.plantasList4_2=[]
          for(const pl of plantasList){
            this.plantasList4_2.push({label:pl.nombre,value:{nombre:pl.nombre,id:pl.id}})
          }
          this.getTasas_1_2('filtro')
          break;
        case 'tasa2':
          this.PlantaSelect5=null
          this.plantasList5=[]
          for(const pl of plantasList){
            this.plantasList5.push({label:pl.nombre,value:pl.nombre})
          }
          this.getTasas_2('filtro')
          break;
        case 'tasa2_2':
          this.PlantaSelect5_2=null
          this.plantasList5_2=[]
          for(const pl of plantasList){
            this.plantasList5_2.push({label:pl.nombre,value:pl.nombre})
          }
          this.getTasas_2_2('filtro')
          break;
        case 'event1':
          this.PlantaSelect6=null
          this.plantasList6=[]
          for(const pl of plantasList){
            this.plantasList6.push({label:pl.nombre,value:pl.nombre})
          }
          this.getEventos_1()
          break;
        case 'event1_2':
          this.PlantaSelect6_2=null
          this.plantasList6_2=[]
          for(const pl of plantasList){
            this.plantasList6_2.push({label:pl.nombre,value:pl.nombre})
          }
          this.getEventos_1_2()
          break;
        case 'event2':
          this.PlantaSelect7=null
          this.plantasList7=[]
          for(const pl of plantasList){
            this.plantasList7.push({label:pl.nombre,value:pl.nombre})
          }
          break;
        case 'event2_2':
          this.PlantaSelect7_2=null
          this.plantasList7_2=[]
          for(const pl of plantasList){
            this.plantasList7_2.push({label:pl.nombre,value:pl.nombre})
          }
          break;
        case 'ili1':
          this.PlantaSelect8=null
          this.plantasList8=[]
          for(const pl of plantasList){
            this.plantasList8.push({label:pl.nombre,value:pl.nombre})
          }
          this.selectGetIli1()
          break;
        case 'ili1_2':
          this.PlantaSelect8_2=null
          this.plantasList8_2=[]
          for(const pl of plantasList){
            this.plantasList8_2.push({label:pl.nombre,value:pl.nombre})
          }
          this.selectGetIli1_2()
          break;
        case 'ili2':
          this.PlantaSelect9=null
          this.plantasList9=[]
          for(const pl of plantasList){
            this.plantasList9.push({label:pl.nombre,value:pl.nombre})
          }
          this.getIli_2()
          break;
        case 'ili2_2':
          this.PlantaSelect9_2=null
          this.plantasList9_2=[]
          for(const pl of plantasList){
            this.plantasList9_2.push({label:pl.nombre,value:pl.nombre})
          }
          this.getIli_2_2()
          break;
        case 'meta1':
          this.PlantaSelect10=null
          this.plantasList10=[]
          for(const pl of plantasList){
            this.plantasList10.push({label:pl.nombre,value:pl.nombre})
          }
          this.getMeta_1Eve()
          break;
        case 'meta1_2':
          this.PlantaSelect10_2=null
          this.plantasList10_2=[]
          for(const pl of plantasList){
            this.plantasList10_2.push({label:pl.nombre,value:pl.nombre})
          }
          this.getMeta_1Eve_2()
          break;

        case 'meta1meses':
          this.PlantaSelect12=null
          this.plantasList12=[]
          for(const pl of plantasList){
            this.plantasList12.push({label:pl.nombre,value:pl.nombre})
          }
          this.getEventosMeta_2()
          break;
        case 'meta1_2meses':
          this.PlantaSelect12_2=null
          this.plantasList12_2=[]
          for(const pl of plantasList){
            this.plantasList12_2.push({label:pl.nombre,value:pl.nombre})
          }
          this.getEventosMeta_2_2()
          break;
        case 'meta2':
          this.PlantaSelect11=null
          this.plantasList11=[]
          for(const pl of plantasList){
            // this.plantasList11.push({label:pl.nombre,value:{nombre:pl.nombre,id:pl.id}})
            this.plantasList11.push({label:pl.nombre,value:pl.nombre})
          }
          this.getMeta_1Tasas('filtro')
          break;
        case 'meta2_2':
          this.PlantaSelect11_2=null
          this.plantasList11_2=[]
          for(const pl of plantasList){
            // this.plantasList11_2.push({label:pl.nombre,value:{nombre:pl.nombre,id:pl.id}})
            this.plantasList11_2.push({label:pl.nombre,value:pl.nombre})
          }
          this.getMeta_1Tasas_2('filtro')
          break;
        case 'meta2meses':
          this.PlantaSelect13=null
          this.plantasList13=[]
          for(const pl of plantasList){
            this.plantasList13.push({label:pl.nombre,value:{nombre:pl.nombre,id:pl.id}})
          }
          this.getTasas_2Meses('filtro')
          break;
        case 'meta2_2meses':
          this.PlantaSelect13_2=null
          this.plantasList13_2=[]
          for(const pl of plantasList){
            this.plantasList13_2.push({label:pl.nombre,value:{nombre:pl.nombre,id:pl.id}})
          }
          this.getTasas_2Meses_2('filtro')
          break;
        default:
          break;
      }
    }else this.funcSelectPais(null,filter)
  }
  
  estaAbiertoGraf1:boolean = false;
  estaAbiertoGraf1_2:boolean = false;
  estaAbiertoGraf2:boolean = false;
  estaAbiertoGraf2_2:boolean = false;
  estaAbiertoGraf3:boolean = false;
  estaAbiertoGraf3_2:boolean = false;
  estaAbiertoGraf4:boolean = false;
  estaAbiertoGraf4_2:boolean = false;
  estaAbiertoGraf5:boolean = false;
  estaAbiertoGraf5_2:boolean = false;
  estaAbiertoGraf6:boolean = false;
  estaAbiertoGraf6_2:boolean = false;
  estaAbiertoGraf7:boolean = false;
  estaAbiertoGraf7_2:boolean = false;
  estaAbiertoGraf8:boolean = false;
  estaAbiertoGraf8_2:boolean = false;
  estaAbiertoGraf9:boolean = false;
  estaAbiertoGraf9_2:boolean = false;
  estaAbiertoGraf10:boolean = false;
  estaAbiertoGraf10_2:boolean = false;

  // togglePanel() {
  //   this.estaAbierto = !this.estaAbierto;
  // }
  togglePanel(graf:any) {
    switch (graf) {
      case 'graf1':
        this.estaAbiertoGraf1 = !this.estaAbiertoGraf1;
        break;
      case 'graf2':
        this.estaAbiertoGraf2 = !this.estaAbiertoGraf2;
        break;
      case 'graf3':
        this.estaAbiertoGraf3 = !this.estaAbiertoGraf3;
        break;
      case 'graf4':
        this.estaAbiertoGraf4 = !this.estaAbiertoGraf4;
        break;
      case 'graf5':
        this.estaAbiertoGraf5 = !this.estaAbiertoGraf5;
        break;
      case 'graf6':
        this.estaAbiertoGraf6 = !this.estaAbiertoGraf6;
        break;
      case 'graf7':
        this.estaAbiertoGraf7 = !this.estaAbiertoGraf7;
        break;
      case 'graf8':
        this.estaAbiertoGraf8 = !this.estaAbiertoGraf8;
        break;
      case 'graf9':
        this.estaAbiertoGraf9 = !this.estaAbiertoGraf9;
        break;
      case 'graf10':
        this.estaAbiertoGraf10 = !this.estaAbiertoGraf10;
        break;
    
      default:
        break;
    }
  }
  // togglePanel2() {
  //   this.estaAbierto2 = !this.estaAbierto2;
  // }
  togglePanel2(graf:any) {
    switch (graf) {
      case 'graf1':
        this.estaAbiertoGraf1_2 = !this.estaAbiertoGraf1_2;
        break;
      case 'graf2':
        this.estaAbiertoGraf2_2 = !this.estaAbiertoGraf2_2;
        break;
      case 'graf3':
        this.estaAbiertoGraf3_2 = !this.estaAbiertoGraf3_2;
        break;
      case 'graf4':
        this.estaAbiertoGraf4_2 = !this.estaAbiertoGraf4_2;
        break;
      case 'graf5':
        this.estaAbiertoGraf5_2 = !this.estaAbiertoGraf5_2;
        break;
      case 'graf6':
        this.estaAbiertoGraf6_2 = !this.estaAbiertoGraf6_2;
        break;
      case 'graf7':
        this.estaAbiertoGraf7_2 = !this.estaAbiertoGraf7_2;
        break;
      case 'graf8':
        this.estaAbiertoGraf8_2 = !this.estaAbiertoGraf8_2;
        break;
      case 'graf9':
        this.estaAbiertoGraf9_2 = !this.estaAbiertoGraf9_2;
        break;
      case 'graf10':
        this.estaAbiertoGraf10_2 = !this.estaAbiertoGraf10_2;
        break;
    
      default:
        break;
    }
  }

  toggleComparativo(graf:string) {
    switch (graf) {
      case 'graf1':
        this.flagComparativoEve1 = !this.flagComparativoEve1;
        break;
      case 'graf2':
        this.flagComparativoEve2 = !this.flagComparativoEve2;
        break;
      case 'graf3':
        this.flagComparativoEve3 = !this.flagComparativoEve3;
        break;
      case 'graf4':
        this.flagComparativoEve4 = !this.flagComparativoEve4
        break;
      case 'graf5':
        this.flagComparativoEve5 = !this.flagComparativoEve5
        break;
      case 'graf6':
        this.flagComparativoEve6 = !this.flagComparativoEve6
        break;
      case 'graf7':
        this.flagComparativoEve7 = !this.flagComparativoEve7
        break;
      case 'graf8':
        this.flagComparativoEve8 = !this.flagComparativoEve8
        break;
      case 'graf9':
        this.flagComparativoEve9 = !this.flagComparativoEve9
        break;
      case 'graf10':
        this.flagComparativoEve10 = !this.flagComparativoEve10
        break;
    
      default:
        break;
    }
  }

  flagComparativoEve1:boolean=false
  flagComparativoEve2:boolean=false
  flagComparativoEve3:boolean=false
  flagComparativoEve4:boolean=false
  flagComparativoEve5:boolean=false
  flagComparativoEve6:boolean=false
  flagComparativoEve7:boolean=false
  flagComparativoEve8:boolean=false
  flagComparativoEve9:boolean=false
  flagComparativoEve10:boolean=false

}

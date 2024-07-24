import { Component, OnInit } from '@angular/core';
import { FilterQuery } from "../../../core/entities/filter-query";
import { SortOrder } from "src/app/website/pages/core/entities/filter";
import { Filter, Criteria } from 'src/app/website/pages/core/entities/filter';
import { DatePipe } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
//import { NgxChartsModule } from 'ngx-charts-8';
import {CaracterizacionViewService} from "src/app/website/pages/core/services/caracterizacion-view.service"
import{datos, division,tipoAccidenteCont,tipo_lesionCont,parte_cuerpoCont,agenteCont,mecanismoCont,sitioCont} from 'src/app/website/pages/comun/entities/datosGraf4' 
import { SelectItem } from 'primeng/api'
import { PrimeNGConfig } from 'primeng/api';

import {
  tipo_vinculacion,
  jornada_trabajo,
  tipo_identificacion,
  tipo_identificacion_empresa,
  sitio,
  tipo_lesion,
  parte_cuerpo,
  agente,
  mecanismo,
  lugar,
  tipoAccidente,
  locale_es,
  severidad,
} from 'src/app/website/pages/comun/entities/reporte-enumeraciones';
import { TipoPeligroService } from "src/app/website/pages/core/services/tipo-peligro.service";
import { PeligroService } from "src/app/website/pages/core/services/peligro.service";
import { TipoPeligro } from "src/app/website/pages/comun/entities/tipo-peligro";
import { Peligro } from "src/app/website/pages/comun/entities/peligro";
import { CargoService } from 'src/app/website/pages/empresa/services/cargo.service';
import { Cargo } from 'src/app/website/pages/empresa/entities/cargo';
import { PlantasService } from '../../../core/services/Plantas.service';
import { SesionService } from '../../../core/services/session.service';
import { Plantas } from '../../../comun/entities/Plantas';
import { AreaService } from '../../../empresa/services/area.service';
import { Area } from '../../../empresa/entities/area';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { Localidades } from '../../../ctr/entities/aliados';
import { parse } from 'flatted';
@Component({
  selector: 'app-ind-caracterizacion',
  templateUrl: './ind-caracterizacion.component.html',
  styleUrls: ['./ind-caracterizacion.component.scss']
})
export class IndCaracterizacionComponent implements OnInit {

  CaracterizacionView:any;

  ContLeve:number=0
  ContGrave:number=0
  ContSevero:number=0;
  ContMortal:number=0;

  ContTipoATMes:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  ContSitioATMes:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  ContAgenteMes:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  ContMecanismoMes:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  ContParteCuerpoMes:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]
  ContTipoLesionMes:number[]=[0,0,0,0,0,0,0,0,0,0,0,0]

  ContTipoATDiv:number[]=[0,0,0,0,0,0,0]
  ContSitioATDiv:number[]=[0,0,0,0,0,0,0]
  ContAgenteDiv:number[]=[0,0,0,0,0,0,0]
  ContMecanismoDiv:number[]=[0,0,0,0,0,0,0]
  ContParteCuerpoDiv:number[]=[0,0,0,0,0,0,0]
  ContTipoLesionDiv:number[]=[0,0,0,0,0,0,0]

  ContTipoATDivMap=new Map()
  ContSitioATDivMap=new Map()
  ContAgenteDivMap=new Map()
  ContMecanismoDivMap=new Map()
  ContParteCuerpoDivMap=new Map()
  ContTipoLesionDivMap=new Map()


  NombreGra1=['Sexo','Lugar','Jornada'];
  NombreGra2=['Edad','Antigüedad','Hora accidente'];

  divisiones1=['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas'];
  filtroEventos: any[] = [[{label: 'Sexo masculino', value: 'Sexo masculino'}, {label: 'Sexo femenino', value: 'Sexo femenino'}],[{label: 'Lugar fuera', value: 'Lugar fuera'},{label: 'Lugar adentro', value: 'Lugar adentro'}],[{label: 'Jornada normal', value: 'Jornada normal'},{label: 'Jornada extra', value: 'Jornada extra'}]];
  filtroEventos2: any[] = [[{name: '18 a 25 años', code: '18 a 25 años'}, {name: '26 a 35 años', code: '26 a 35 años'}, {name: '36 a 45 años', code: '36 a 45 años'}, {name: '46 a 59 años', code: '46 a 59 años'}, {name: '60 años en adelante', code: '60 años en adelante'}],
    [{name: '0 a 1 años', code: '0 a 1 años'},{name: '2 a 5 años', code: '2 a 5 años'}, {name: '6 a 10 años', code: '6 a 10 años'}, {name: '11 a 20 años', code: '11 a 20 años'}, {name: '21 a 30 años', code: '21 a 30 años'}, {name: '31 años en adelante', code: '31 años en adelante'}],
    [{name: '00:00 a 03:59', code: '00:00 a 03:59'},{name: '04:00 a 07:59', code: '04:00 a 07:59'}, {name: '08:00 a 11:59', code: '08:00 a 11:59'}, {name: '12:00 a 15:59', code: '12:00 a 15:59'}, {name: '16:00 a 19:59', code: '16:00 a 19:59'},{name: '20:00 a 23:59', code: '20:00 a 23:59'}]];
  filtroEventos4?:any[]
  filtroEventos4_2?:any[]

  rangoFechaEdad=['18 a 25 años','26 a 35 años','36 a 45 años','46 a 59 años','60 años en adelante']
  rangoFechaAntiguedad=['0 a 1 años','2 a 5 años','6 a 10 años','11 a 20 años','21 a 30 años','31 años en adelante']
  rangoHoraAccidente=['00:00 a 03:59','04:00 a 07:59','08:00 a 11:59','12:00 a 15:59','16:00 a 19:59','20:00 a 23:59']

  filtroGraf5:any[]=[{label:'Tipo accidente',value:0},
  {label:'Lugar accidente',value:1},
  {label:'Agente',value:2},
  {label:'Mecanismo',value:3},
  {label:'Parte cuerpo',value:4},
  {label:'Tipo lesion',value:5}]

  divisiones2= new Array();
  divisiones3= new Array();
  divisiones4= new Array();
  divisiones5= new Array();
  rangoFechaEdad2= new Array();
  rangoFechaAntiguedad2= new Array();
  rangoHoraAccidente2= new Array();

  flagevent1:boolean=false;
  flagevent1_2:boolean=false;

  flagevent2:boolean=false;
  flagevent2_2:boolean=false;

  flagevent3:boolean=false;
  flagevent3_2:boolean=false;

  flagevent4:boolean=false;
  flagevent4_2:boolean=false;

  flagevent5:boolean=false;
  flagevent5_2:boolean=false;

  flagevent6:boolean=false;
  flagevent6_2:boolean=false;

  localeES = locale_es;
  colorScheme = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };

  datosGrafica1:any=[];
  datosGrafica2:any=[];
  datosGrafica3:any=[];
  datosGrafica4:any=[];
  datosGrafica5:any=[];
  datosGrafica6:any=[];

  datosGrafica1_2:any=[];
  datosGrafica2_2:any=[];
  datosGrafica3_2:any=[];
  datosGrafica4_2:any=[];
  datosGrafica5_2:any=[];
  datosGrafica6_2:any=[];

  datosGrafica1_total:any=[];
  datosGrafica2_total:any=[];
  datosGrafica3_total:any=[];
  datosGrafica4_total:any=[];
  datosGrafica5_total:any=[];
  datosGrafica6_total:any=[];

  datosGrafica1_total_2:any=[];
  datosGrafica2_total_2:any=[];
  datosGrafica3_total_2:any=[];
  datosGrafica4_total_2:any=[];
  datosGrafica5_total_2:any=[];
  datosGrafica6_total_2:any=[];

  datosGrafica3Top:any=[];
  datosGrafica4Top:any=[];
  datosGrafica5Top:any=[];
  datosGrafica6Top:any=[];

  datosGrafica3Top_2:any=[];
  datosGrafica4Top_2:any=[];
  datosGrafica5Top_2:any=[];
  datosGrafica6Top_2:any=[];

  radioGra0:number=0
  radioGra0_1:number=0
  radioGra0_2:number=0
  radioGra0_1_2:number=0

  radioGra1:number=0
  radioGra1_1:number=0
  radioGra1_2:number=0
  radioGra1_1_2:number=0

  radioGra2:number=0
  radioGra2_1:number=0
  radioGra2_2:number=0
  radioGra2_1_2:number=0

  radioGra3:number=0
  radioGra3_1:number=0
  radioGra3_2:number=0
  radioGra3_1_2:number=0

  radioGra4:number=0
  radioGra4_1:number=0
  radioGra4_2:number=0
  radioGra4_1_2:number=0

  radioGra5:number=0
  radioGra5_1:number=0
  radioGra5_2:number=0
  radioGra5_1_2:number=0

  radioGra6:number=0
  radioGra6_1:number=0
  radioGra6_2:number=0
  radioGra6_1_2:number=0

  selectEv1: any[] = [];
  selectDiv1: any[] = [];
  selectArea: any[] = [];

  selectEv1_2: any[] = [];
  selectDiv1_2: any[] = [];
  selectArea_2: any[] = [];

  selectDiv2: any[] = [];
  selectEv2: any[] = [];
  selectYear2: any =2023;
  selectMonth2: any[] = [];

  selectDiv2_2: any[] = [];
  selectEv2_2: any[] = [];
  selectYear2_2: any =2023;
  selectMonth2_2: any[] = [];

  selectDiv3: any[] = [];
  selectEv3: any[] = [];
  selectYear3: any =2023;
  selectMonth3: any[] = [];

  selectDiv3_2: any[] = [];
  selectEv3_2: any[] = [];
  selectYear3_2: any =2023;
  selectMonth3_2: any[] = [];

  selectDiv4: any[] = [];
  selectEv4: any[] = [];
  selectYear4: any =2023;
  selectMonth4: any[] = [];

  selectDiv4_2: any[] = [];
  selectEv4_2: any[] = [];
  selectYear4_2: any =2023;
  selectMonth4_2: any[] = [];

  selectDiv5: any[] = [];
  selectEv5: any[] = [];
  selectYear5: any =2023;
  selectMonth5: any[] = [];

  selectDiv5_2: any[] = [];
  selectEv5_2: any[] = [];
  selectYear5_2: any =2023;
  selectMonth5_2: any[] = [];

  selectDiv6: any[] = [];
  selectPel6Flag: boolean=false;
  selectEv6: any[] = [];
  selectTipoPeligro6: any = [];
  selectYear6: any =2023;
  selectMonth6: any[] = [];

  selectDiv6_2: any[] = [];
  selectPel6Flag_2: boolean=false;
  selectEv6_2: any[] = [];
  selectTipoPeligro6_2: any = [];
  selectYear6_2: any =2023;
  selectMonth6_2: any[] = [];


  Meses= [
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
  ];
  yearRange = new Array();
  añoPrimero:number=2015;
  dateValue= new Date();
  añoActual:number=this.dateValue.getFullYear();
  yearRangeNumber= Array.from({length: this.añoActual - this.añoPrimero+1}, (f, g) => g + this.añoPrimero);

  labelFilterGra2:string='Seleccione rango edad'
  labelFilterGra2_2:string='Seleccione rango edad'

  tipoaccidenteList: SelectItem[];
  sitioaccidenteList: SelectItem[];
  agenteList: SelectItem[];
  mecanismoList: SelectItem[];
  partecuerpoList: SelectItem[];
  tipolesionList: SelectItem[];

  cargoList?: SelectItem[];

  cargoList_2?: SelectItem[];

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

  constructor(
    private caracterizacionViewService: CaracterizacionViewService,
    private tipoPeligroService: TipoPeligroService,
    private peligroService: PeligroService,
    private cargoService: CargoService,
    private plantasService: PlantasService,
    private empresaService: EmpresaService,
    private sessionService: SesionService,
    private areaService: AreaService,
    private config: PrimeNGConfig
  ) {
    this.tipolesionList = <SelectItem[]>tipo_lesion;
    this.partecuerpoList = <SelectItem[]>parte_cuerpo;
    this.agenteList = <SelectItem[]>agente;
    this.mecanismoList = <SelectItem[]>mecanismo;
    this.sitioaccidenteList = <SelectItem[]>sitio;
    this.tipoaccidenteList = <SelectItem[]>tipoAccidente;
    

  }

  async ngOnInit(): Promise<void> {
    this.getDivision()
    console.log(this.divisionList)
    this.config.setTranslation(this.localeES);
    this.cargarTiposPeligro();
    let cargofiltQuery = new FilterQuery();
    cargofiltQuery.sortOrder = SortOrder.ASC;
    cargofiltQuery.sortField = "nombre";
    cargofiltQuery.fieldList = ["id", "nombre"];
    this.cargoService.findByFilter(cargofiltQuery).then((resp:any) => {
      this.cargoList = [];
      (<Cargo[]>resp['data']).forEach((cargo) => {
          this.cargoList?.push({ label: cargo.nombre, value: cargo.id });
      });
    });

    let cont=0
    this.divisiones1.forEach(div => {
      this.divisiones2.push({label:div,value:div})
      this.divisiones3.push({name:div,code:cont})
      this.divisiones4.push({name:div,code:cont})
      this.divisiones5.push({label:div,value:div})
      cont=cont+1;
    });
    this.divisiones2.push({label:'Corona total',value:'Corona total'})
    this.divisiones3.push({name:'Corona total',code:cont})

    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }
    await this.caracterizacionViewService.findAllCAR2().then(async (resp)=>{
      this.CaracterizacionView=resp
      this.CaracterizacionView.map((res1:any)=>{
        res1.hora=Number(res1.hora.substr(0,2))
        res1.fechaaccidente=new Date(res1.fechaaccidente)
        res1.fechanacimientoempleado=new Date(res1.fechanacimientoempleado)
        res1.fechaingresoempleado=new Date(res1.fechaingresoempleado)
      });

      this.CardsClasificacion();
      this.DatosGrafica1();
      this.DatosGrafica2();
      this.DatosGrafica3();
      this.DatosGrafica4();
      this.DatosGrafica5();

      this.DatosGrafica1_2();
      this.DatosGrafica2_2();
      this.DatosGrafica3_2();
      this.DatosGrafica4_2();
      this.DatosGrafica5_2();
    })
    
  }
  CaracterizacionView1:any
  CaracterizacionView1_2:any

  CaracterizacionView2:any
  CaracterizacionView2_2:any

  CaracterizacionView3:any
  CaracterizacionView3_2:any

  CaracterizacionView4:any
  CaracterizacionView4_2:any

  CaracterizacionView5:any
  CaracterizacionView5_2:any

  CaracterizacionView6:any
  CaracterizacionView6_2:any

  CaracterizacionView7:any
  CaracterizacionView7_2:any


  date1?: Date;
  date2?: Date;
  date3?: Date;
  date4?: Date;
  date5?: Date;
  date6?: Date;
  date7?: Date;
  date8?: Date;
  date9?: Date;
  date10?: Date;
  date11?: Date;
  date12?: Date;

  date1_2?: Date;
  date2_2?: Date;
  date3_2?: Date;
  date4_2?: Date;
  date5_2?: Date;
  date6_2?: Date;
  date7_2?: Date;
  date8_2?: Date;
  date9_2?: Date;
  date10_2?: Date;
  date11_2?: Date;
  date12_2?: Date;

  
  CardsClasificacion(){

    this.CaracterizacionView1=this.CaracterizacionView

    if(this.date1 && !this.date2)
      this.CaracterizacionView1=this.CaracterizacionView.filter((resp:any)=>{
      return resp.fechaaccidente>=new Date(this.date1!)
      })

    if(!this.date1 && this.date2){
      let date2:Date=new Date(new Date(this.date2).setMonth(new Date(this.date2).getMonth()+1))
      this.CaracterizacionView1=this.CaracterizacionView.filter((resp:any)=>{
        return resp.fechaaccidente< date2;
        })
      }

    if(this.date1 && this.date2){
      let date2:Date=new Date(new Date(this.date2).setMonth(new Date(this.date2).getMonth()+1))
      this.CaracterizacionView1=this.CaracterizacionView.filter((resp:any)=>{
        return resp.fechaaccidente<date2 && resp.fechaaccidente>=new Date(this.date1!)
        })}
    

    //nuevo
    let reportesAtCopyDiv: any[]=[]
    if(this.selectPais1)if(this.selectPais1!='Corona Total')this.CaracterizacionView1 = this.CaracterizacionView1.filter((at:any) => at.pais == this.selectPais1);
    if(this.selectedDivisionResumen1)if(this.selectedDivisionResumen1.length>0){
      reportesAtCopyDiv=[]
      this.selectedDivisionResumen1.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView1.filter((at:any) => at.padrenombre == element));
      })
      this.CaracterizacionView1=[...reportesAtCopyDiv]
    }
    if(this.LocalidadSelect1)if(this.LocalidadSelect1.length>0){
      reportesAtCopyDiv=[]
      this.LocalidadSelect1.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView1.filter((at:any) => at.nombreLocalidad == element));
      });
      this.CaracterizacionView1=[...reportesAtCopyDiv]
    }
    //fin nuevo

    this.ContLeve=0
    this.ContGrave=0
    this.ContSevero=0;
    this.ContMortal=0;

    this.CaracterizacionView1.forEach((element:any) => {
      if(this.radioGra0==0){
        if(this.selectArea.length==0 || this.selectArea.toString()=='Corona total')this.ContCardsClasificacion(element);
        if(this.selectArea==element.padrenombre  && this.selectArea.toString()!='Corona total')this.ContCardsClasificacion(element);
      }
      if(this.radioGra0==1 && element.emptemporal!=null){
        if(this.selectArea.length==0 || this.selectArea.toString()=='Corona total')this.ContCardsClasificacion(element);
        if(this.selectArea==element.padrenombre  && this.selectArea.toString()!='Corona total')this.ContCardsClasificacion(element);
      }
      if(this.radioGra0==2 && element.emptemporal==null){
        if(this.selectArea.length==0 || this.selectArea.toString()=='Corona total')this.ContCardsClasificacion(element);
        if(this.selectArea==element.padrenombre  && this.selectArea.toString()!='Corona total')this.ContCardsClasificacion(element);
      }
    });
  }

  ContCardsClasificacion(element:any){
    switch (element.severidad) {
      case 'Leve':
        this.ContLeve=this.ContLeve+1;
        break;
      case 'Grave':
        this.ContGrave=this.ContGrave+1;
        break;
      case 'Severo':
        this.ContSevero=this.ContSevero+1;
        break;
      case 'Mortal':
        this.ContMortal=this.ContMortal+1;
        break;
      default:
        break;
    }

  }


  ////////////Primera grafica//////////
  DatosGrafica1(){
      let flagCoronaTotal:boolean=false
      if(this.selectPais2){
        if(this.selectPais2=='Corona Total')flagCoronaTotal=true
        else flagCoronaTotal=false
      }else flagCoronaTotal=false

      this.flagevent1=false

      this.CaracterizacionView2=this.CaracterizacionView.map((e:any)=>e)

      if(this.date3 && !this.date4)
        this.CaracterizacionView2=this.CaracterizacionView.filter((resp:any)=>{
        return resp.fechaaccidente>=new Date(this.date3!)
        })
  
      if(!this.date3 && this.date4){
        let date4:Date=new Date(new Date(this.date4).setMonth(new Date(this.date4).getMonth()+1))
        this.CaracterizacionView2=this.CaracterizacionView.filter((resp:any)=>{
          return resp.fechaaccidente< date4;
          })
        }
  
      if(this.date3 && this.date4){
        let date4:Date=new Date(new Date(this.date4).setMonth(new Date(this.date4).getMonth()+1))
        this.CaracterizacionView2=this.CaracterizacionView.filter((resp:any)=>{
          return resp.fechaaccidente<date4 && resp.fechaaccidente>=new Date(this.date3!)
          })}

      //nuevo
      let reportesAtCopyDiv: any[]=[]
      if(this.selectPais2)if(this.selectPais2!='Corona Total')this.CaracterizacionView2 = this.CaracterizacionView2.filter((at:any) => at.pais == this.selectPais2);
      if(!flagCoronaTotal)if(this.selectedDivisionResumen2)this.CaracterizacionView2= this.CaracterizacionView2.filter((at:any) => at.padrenombre == this.selectedDivisionResumen2);
      if(flagCoronaTotal)if(this.selectedDivisionResumen2)if(this.selectedDivisionResumen2.length>0){
        reportesAtCopyDiv=[]
        this.selectedDivisionResumen2.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView2.filter((at:any) => at.padrenombre == element));
        });
        this.CaracterizacionView2=[...reportesAtCopyDiv]
      }
      if(this.LocalidadSelect2)if(this.LocalidadSelect2.length>0){
        reportesAtCopyDiv=[]
        this.LocalidadSelect2.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView2.filter((at:any) => at.nombreLocalidad == element));
        });
        this.CaracterizacionView2=[...reportesAtCopyDiv]
      }
      //fin nuevo

      this.contGenero=[]
      this.ContLugar=[]
      this.ContJornada=[]

      this.CaracterizacionView2.forEach((element:any) => {
        if(this.radioGra1==0)this.ContDatosGraf1(element)
        if(this.radioGra1==1 && element.emptemporal!=null)this.ContDatosGraf1(element)
        if(this.radioGra1==2 && element.emptemporal==null)this.ContDatosGraf1(element)
      });

      this.primeraGrafica();
      let total:string=(flagCoronaTotal)?'Corona Total':this.selectedDivisionResumen2
      if((this.selectPais2=='Corona Total' && (!this.selectedDivisionResumen2 || this.selectedDivisionResumen2.length==0))|| (this.selectPais2!='Corona Total' && (!this.LocalidadSelect2 || this.LocalidadSelect2.length==0)))
        this.datosGrafica1=this.contTotal(this.datosGrafica1,total)

  }

  contGenero:any[]=[]
  ContLugar:any[]=[]
  ContJornada:any[]=[]
  ContDatosGraf1(element:any){

    let nombreLocalidad = (this.selectPais2=='Corona Total')?element.padrenombre:element.nombreLocalidad

    let generoempleado = element.generoempleado
    if(generoempleado)
    if(generoempleado=='M')generoempleado='Sexo masculino'
    else if(generoempleado=='F')generoempleado='Sexo femenino'

    let lugaraccidente = element.lugaraccidente
    if(lugaraccidente)
    if(lugaraccidente=='FUERA_EMPRESA')lugaraccidente='Lugar fuera'
    else if(lugaraccidente=='DENTRO_EMPRESA')lugaraccidente='Lugar adentro'

    let jornadaaccidente = element.jornadaaccidente
    if(jornadaaccidente)
    if(jornadaaccidente=='NORMAL')jornadaaccidente='Jornada normal'
    else if(jornadaaccidente=='EXTRA')jornadaaccidente='Jornada extra'

    if(nombreLocalidad && generoempleado){
      if (this.contGenero.hasOwnProperty(nombreLocalidad)) {
        if (this.contGenero[nombreLocalidad].hasOwnProperty(generoempleado)) {
          this.contGenero[nombreLocalidad][generoempleado] += 1;
        } else {
          this.contGenero[nombreLocalidad][generoempleado] = 1;
        }
      } else {
        this.contGenero[nombreLocalidad] = {};
        this.contGenero[nombreLocalidad][generoempleado] = 1;
      }
    }

    if(nombreLocalidad && lugaraccidente){
      if (this.ContLugar.hasOwnProperty(nombreLocalidad)) {
        if (this.ContLugar[nombreLocalidad].hasOwnProperty(lugaraccidente)) {
          this.ContLugar[nombreLocalidad][lugaraccidente] += 1;
        } else {
          this.ContLugar[nombreLocalidad][lugaraccidente] = 1;
        }
      } else {
        this.ContLugar[nombreLocalidad] = {};
        this.ContLugar[nombreLocalidad][lugaraccidente] = 1;
      }
    }

    if(nombreLocalidad && jornadaaccidente){
      if (this.ContJornada.hasOwnProperty(nombreLocalidad)) {
        if (this.ContJornada[nombreLocalidad].hasOwnProperty(jornadaaccidente)) {
          this.ContJornada[nombreLocalidad][jornadaaccidente] += 1;
        } else {
          this.ContJornada[nombreLocalidad][jornadaaccidente] = 1;
        }
      } else {
        this.ContJornada[nombreLocalidad] = {};
        this.ContJornada[nombreLocalidad][jornadaaccidente] = 1;
      }
    }
  }

  primeraGrafica(){
    this.flagevent1=false
    this.datosGrafica1=[]

    if(this.radioGra1_1==0){
      let List:any=(this.selectPais2=='Corona Total')?this.divisionList2:this.localidadesList2

      this.datosGrafica1=[]

      let datoGrafica:any=[]
      List.forEach((element:any) => {
        if(this.contGenero.hasOwnProperty(element.label)){
          if(Object.keys(this.contGenero[element.label]).length>0){
            let datoSeries:any=[]
            Object.keys(this.contGenero[element.label]).forEach((clave:any) => {
              datoSeries.push({name:clave,value:this.contGenero[element.label][clave]})
            });   
            datoSeries=this.order(datoSeries)
            datoGrafica.push({name:element.label,series:datoSeries})   
          }
        }
      });
      this.datosGrafica1=datoGrafica.map((e:any)=>e)
    }

    if(this.radioGra1_1==1){
      let List:any=(this.selectPais2=='Corona Total')?this.divisionList2:this.localidadesList2
      this.datosGrafica1=[]

      let datoGrafica:any=[]
      List.forEach((element:any) => {
        if(this.ContLugar.hasOwnProperty(element.label)){
          if(Object.keys(this.ContLugar[element.label]).length>0){
            let datoSeries:any=[]
            Object.keys(this.ContLugar[element.label]).forEach((clave:any) => {
              datoSeries.push({name:clave,value:this.ContLugar[element.label][clave]})
            });   
            datoSeries=this.order(datoSeries)
            datoGrafica.push({name:element.label,series:datoSeries})   
          }
        }
      });
      this.datosGrafica1=datoGrafica.map((e:any)=>e)
    }

    if(this.radioGra1_1==2){
      let List:any=(this.selectPais2=='Corona Total')?this.divisionList2:this.localidadesList2


      this.datosGrafica1=[]

      let datoGrafica:any=[]
      List.forEach((element:any) => {
        if(this.ContJornada.hasOwnProperty(element.label)){
          if(Object.keys(this.ContJornada[element.label]).length>0){
            let datoSeries:any=[]
            Object.keys(this.ContJornada[element.label]).forEach((clave:any) => {
              datoSeries.push({name:clave,value:this.ContJornada[element.label][clave]})
            });   
            datoSeries=this.order(datoSeries)
            datoGrafica.push({name:element.label,series:datoSeries})   
          }
        }
      });
      this.datosGrafica1=datoGrafica.map((e:any)=>e)
    }

    this.flagevent1=true
  }

  filtroGraEve1(){
    this.DatosGrafica1()
    this.flagevent1=false
    let datosGrafica1:any=[]
    if(this.selectDiv1.length>0){
      this.selectDiv1.forEach(resp1=>{
        let x=this.datosGrafica1.filter((resp:any)=>{
          return resp.name ==resp1.label
        })
        datosGrafica1.push(x[0])
      }
      )
      this.datosGrafica1=datosGrafica1
    }
    
    if(this.selectEv1.length>0){
      datosGrafica1=[]
      this.datosGrafica1.forEach((element:any) => {
        let randomEv1CopySeries:any=[]
  
        if(this.selectEv1.length>0){
          this.selectEv1.forEach(element2 => {
            let x = element['series'].filter((word:any) => {
              return word['name']==element2['label']
            });
            if(x[0])
            randomEv1CopySeries.push(x[0])
          });
        }else{
          randomEv1CopySeries=element['series']
        }
        if(randomEv1CopySeries[0])
        datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
      });
      this.datosGrafica1=datosGrafica1
    }
    
    this.flagevent1=true
  }

  resetSelect(){
    this.selectEv1=[]
    this.selectDiv1=[]
    this.primeraGrafica()
    let total:string=(this.selectPais2=='Corona Total')?'Corona Total':this.selectedDivisionResumen2
    if((this.selectPais2=='Corona Total' && (!this.selectedDivisionResumen2 || this.selectedDivisionResumen2.length==0))|| (this.selectPais2!='Corona Total' && (!this.LocalidadSelect2 || this.LocalidadSelect2.length==0)))
      this.datosGrafica1=this.contTotal(this.datosGrafica1,total)

  }
    ////////////Primera grafica Comparativa//////////

    DatosGrafica1_2(){
      let flagCoronaTotal:boolean=false
      if(this.selectPais2_2){
        if(this.selectPais2_2=='Corona Total')flagCoronaTotal=true
        else flagCoronaTotal=false
      }else flagCoronaTotal=false

      this.flagevent1_2=false

      this.CaracterizacionView2_2=this.CaracterizacionView.map((e:any)=>e)

      if(this.date3_2 && !this.date4_2)
        this.CaracterizacionView2_2=this.CaracterizacionView.filter((resp:any)=>{
        return resp.fechaaccidente>=new Date(this.date3_2!)
        })
  
      if(!this.date3_2 && this.date4_2){
        let date4:Date=new Date(new Date(this.date4_2).setMonth(new Date(this.date4_2).getMonth()+1))
        // date4=new Date(new Date(date4).setDate(new Date(date4).getDate()-1))
        this.CaracterizacionView2_2=this.CaracterizacionView.filter((resp:any)=>{
          return resp.fechaaccidente< date4;
          })
        }
  
      if(this.date3_2 && this.date4_2){
        let date4:Date=new Date(new Date(this.date4_2).setMonth(new Date(this.date4_2).getMonth()+1))
        this.CaracterizacionView2_2=this.CaracterizacionView.filter((resp:any)=>{
          return resp.fechaaccidente<date4 && resp.fechaaccidente>=new Date(this.date3_2!)
          })}

      //nuevo
      let reportesAtCopyDiv: any[]=[]
      
      if(this.selectPais2_2)if(this.selectPais2_2!='Corona Total')this.CaracterizacionView2_2 = this.CaracterizacionView2_2.filter((at:any) => at.pais == this.selectPais2_2);
      if(!flagCoronaTotal)if(this.selectedDivisionResumen2_2)this.CaracterizacionView2_2= this.CaracterizacionView2_2.filter((at:any) => at.padrenombre == this.selectedDivisionResumen2_2);
      if(flagCoronaTotal)if(this.selectedDivisionResumen2_2)if(this.selectedDivisionResumen2_2.length>0){
        reportesAtCopyDiv=[]
        this.selectedDivisionResumen2_2.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView2_2.filter((at:any) => at.padrenombre == element));
        });
        this.CaracterizacionView2_2=[...reportesAtCopyDiv]
      }
      if(this.LocalidadSelect2_2)if(this.LocalidadSelect2_2.length>0){
        reportesAtCopyDiv=[]
        this.LocalidadSelect2_2.forEach((element:any) => {
          reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView2_2.filter((at:any) => at.nombreLocalidad == element));
        });
        this.CaracterizacionView2_2=[...reportesAtCopyDiv]
      }
      //fin nuevo

      this.contGenero_2=[]
      this.ContLugar_2=[]
      this.ContJornada_2=[]

      this.CaracterizacionView2_2.forEach((element:any) => {
        if(this.radioGra1_2==0)this.ContDatosGraf1_2(element)
        if(this.radioGra1_2==1 && element.emptemporal!=null)this.ContDatosGraf1_2(element)
        if(this.radioGra1_2==2 && element.emptemporal==null)this.ContDatosGraf1_2(element)
      });

      this.primeraGrafica_2();
      let total:string=(this.selectPais2_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen2_2
      if((this.selectPais2_2=='Corona Total' && (!this.selectedDivisionResumen2_2 || this.selectedDivisionResumen2_2.length==0))|| (this.selectPais2_2!='Corona Total' && (!this.LocalidadSelect2_2 || this.LocalidadSelect2_2.length==0)))
      this.datosGrafica1_2=this.contTotal(this.datosGrafica1_2,total)

  }

  contGenero_2:any[]=[]
  ContLugar_2:any[]=[]
  ContJornada_2:any[]=[]
  ContDatosGraf1_2(element:any){

    let nombreLocalidad = (this.selectPais2_2=='Corona Total')?element.padrenombre:element.nombreLocalidad

    // let nombreLocalidad = element.nombreLocalidad

    let generoempleado = element.generoempleado
    if(generoempleado)
    if(generoempleado=='M')generoempleado='Sexo masculino'
    else if(generoempleado=='F')generoempleado='Sexo femenino'

    let lugaraccidente = element.lugaraccidente
    if(lugaraccidente)
    if(lugaraccidente=='FUERA_EMPRESA')lugaraccidente='Lugar fuera'
    else if(lugaraccidente=='DENTRO_EMPRESA')lugaraccidente='Lugar adentro'

    let jornadaaccidente = element.jornadaaccidente
    if(jornadaaccidente)
    if(jornadaaccidente=='NORMAL')jornadaaccidente='Jornada normal'
    else if(jornadaaccidente=='EXTRA')jornadaaccidente='Jornada extra'

    if(nombreLocalidad && generoempleado){
      if (this.contGenero_2.hasOwnProperty(nombreLocalidad)) {
        if (this.contGenero_2[nombreLocalidad].hasOwnProperty(generoempleado)) {
          this.contGenero_2[nombreLocalidad][generoempleado] += 1;
        } else {
          this.contGenero_2[nombreLocalidad][generoempleado] = 1;
        }
      } else {
        this.contGenero_2[nombreLocalidad] = {};
        this.contGenero_2[nombreLocalidad][generoempleado] = 1;
      }
    }

    if(nombreLocalidad && lugaraccidente){
      if (this.ContLugar_2.hasOwnProperty(nombreLocalidad)) {
        if (this.ContLugar_2[nombreLocalidad].hasOwnProperty(lugaraccidente)) {
          this.ContLugar_2[nombreLocalidad][lugaraccidente] += 1;
        } else {
          this.ContLugar_2[nombreLocalidad][lugaraccidente] = 1;
        }
      } else {
        this.ContLugar_2[nombreLocalidad] = {};
        this.ContLugar_2[nombreLocalidad][lugaraccidente] = 1;
      }
    }

    if(nombreLocalidad && jornadaaccidente){
      if (this.ContJornada_2.hasOwnProperty(nombreLocalidad)) {
        if (this.ContJornada_2[nombreLocalidad].hasOwnProperty(jornadaaccidente)) {
          this.ContJornada_2[nombreLocalidad][jornadaaccidente] += 1;
        } else {
          this.ContJornada_2[nombreLocalidad][jornadaaccidente] = 1;
        }
      } else {
        this.ContJornada_2[nombreLocalidad] = {};
        this.ContJornada_2[nombreLocalidad][jornadaaccidente] = 1;
      }
    }

  }

  primeraGrafica_2(){
    this.flagevent1_2=false
    this.datosGrafica1_2=[]

    if(this.radioGra1_1_2==0){
      let List:any=(this.selectPais2_2=='Corona Total')?this.divisionList2_2:this.localidadesList2_2

      this.datosGrafica1_2=[]

      let datoGrafica:any=[]
      List.forEach((element:any) => {
        if(this.contGenero_2.hasOwnProperty(element.label)){
          if(Object.keys(this.contGenero_2[element.label]).length>0){
            let datoSeries:any=[]
            Object.keys(this.contGenero_2[element.label]).forEach((clave:any) => {
              datoSeries.push({name:clave,value:this.contGenero_2[element.label][clave]})
            });   
            datoSeries=this.order(datoSeries)
            datoGrafica.push({name:element.label,series:datoSeries})   
          }
        }
      });
      this.datosGrafica1_2=datoGrafica.map((e:any)=>e)
    }

    if(this.radioGra1_1_2==1){
      let List:any=(this.selectPais2_2=='Corona Total')?this.divisionList2_2:this.localidadesList2_2

      this.datosGrafica1_2=[]

      let datoGrafica:any=[]
      List.forEach((element:any) => {
        if(this.ContLugar_2.hasOwnProperty(element.label)){
          if(Object.keys(this.ContLugar_2[element.label]).length>0){
            let datoSeries:any=[]
            Object.keys(this.ContLugar_2[element.label]).forEach((clave:any) => {
              datoSeries.push({name:clave,value:this.ContLugar_2[element.label][clave]})
            });   
            datoSeries=this.order(datoSeries)
            datoGrafica.push({name:element.label,series:datoSeries})   
          }
        }
      });
      this.datosGrafica1_2=datoGrafica.map((e:any)=>e)
    }

    if(this.radioGra1_1_2==2){
      let List:any=(this.selectPais2_2=='Corona Total')?this.divisionList2_2:this.localidadesList2_2

      this.datosGrafica1_2=[]

      let datoGrafica:any=[]
      List.forEach((element:any) => {
        if(this.ContJornada_2.hasOwnProperty(element.label)){
          if(Object.keys(this.ContJornada_2[element.label]).length>0){
            let datoSeries:any=[]
            Object.keys(this.ContJornada_2[element.label]).forEach((clave:any) => {
              datoSeries.push({name:clave,value:this.ContJornada_2[element.label][clave]})
            });   
            datoSeries=this.order(datoSeries)
            datoGrafica.push({name:element.label,series:datoSeries})   
          }
        }
      });
      this.datosGrafica1_2=datoGrafica.map((e:any)=>e)

    }

    this.flagevent1_2=true
  }

  filtroGraEve1_2(){
    this.DatosGrafica1_2()
    this.flagevent1_2=false
    let datosGrafica1:any=[]
    if(this.selectDiv1_2.length>0){
      this.selectDiv1_2.forEach(resp1=>{
        let x=this.datosGrafica1_2.filter((resp:any)=>{
          return resp.name ==resp1.label
        })
        datosGrafica1.push(x[0])
      }
      )
      this.datosGrafica1_2=datosGrafica1
    }
    
    if(this.selectEv1_2.length>0){
      datosGrafica1=[]
      this.datosGrafica1_2.forEach((element:any) => {
        let randomEv1CopySeries:any=[]
  
        if(this.selectEv1_2.length>0){
          this.selectEv1_2.forEach(element2 => {
            let x = element['series'].filter((word:any) => {
              return word['name']==element2['label']
            });
            if(x[0])
            randomEv1CopySeries.push(x[0])
          });
        }else{
          randomEv1CopySeries=element['series']
        }
        if(randomEv1CopySeries[0])
        datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
      });
      this.datosGrafica1_2=datosGrafica1
    }
    
    this.flagevent1_2=true
  }

  resetSelect_2(){
    this.selectEv1_2=[]
    this.selectDiv1_2=[]
    this.primeraGrafica_2()
    let total:string=(this.selectPais2_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen2_2
    if((this.selectPais2_2=='Corona Total' && (!this.selectedDivisionResumen2_2 || this.selectedDivisionResumen2_2.length==0))|| (this.selectPais2_2!='Corona Total' && (!this.LocalidadSelect2_2 || this.LocalidadSelect2_2.length==0)))
    this.datosGrafica1_2=this.contTotal(this.datosGrafica1_2,total)
  }

  
////////////////////Segunda Grafica//////////////////

filtroGraEve2(){
  this.segundaGrafica()
  let total:string=(this.selectPais3=='Corona Total')?'Corona Total':this.selectedDivisionResumen3
  if((this.selectPais3=='Corona Total' && (!this.selectedDivisionResumen3 || this.selectedDivisionResumen3.length==0))|| (this.selectPais3!='Corona Total' && (!this.LocalidadSelect3 || this.LocalidadSelect3.length==0)))
  this.datosGrafica2=this.contTotal(this.datosGrafica2,total)

  this.flagevent2=false
  let datosGrafica1:any=[]
  if(this.selectDiv2.length>0){
    this.selectDiv2.forEach(resp1=>{
      let x=this.datosGrafica2.filter((resp:any)=>{
        return resp.name ==resp1.label
      })
      if(x[0])
      datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica2=datosGrafica1
  }

  if(this.selectEv2.length>0){
    datosGrafica1=[]
    this.datosGrafica2.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv2.length>0){
        this.selectEv2.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['name']
          });
          if(x[0])
          randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica2=datosGrafica1
  }

  this.flagevent2=true
}

resetVarGraf2(){
  this.ContFechaNacimiento=[]
  this.ContFechaIngreso=[]
  this.ContHoraAccidente=[]

}
  DatosGrafica2(){
    let flagCoronaTotal:boolean=false
      if(this.selectPais3){
        if(this.selectPais3=='Corona Total')flagCoronaTotal=true
        else flagCoronaTotal=false
      }else flagCoronaTotal=false

    this.CaracterizacionView3=this.CaracterizacionView.map((e:any)=>e)

    if(this.date5 && !this.date6)
      this.CaracterizacionView3=this.CaracterizacionView3.filter((resp:any)=>{
      return resp.fechaaccidente>=new Date(this.date5!)
      })

    if(!this.date5 && this.date6){
      let date6:Date=new Date(new Date(this.date6).setMonth(new Date(this.date6).getMonth()+1))
      this.CaracterizacionView3=this.CaracterizacionView3.filter((resp:any)=>{
        return resp.fechaaccidente< date6;
        })
      }

    if(this.date5 && this.date6){
      let date6:Date=new Date(new Date(this.date6).setMonth(new Date(this.date6).getMonth()+1))
      this.CaracterizacionView3=this.CaracterizacionView3.filter((resp:any)=>{
        return resp.fechaaccidente<date6 && resp.fechaaccidente>=new Date(this.date5!)
        })}

    if(this.selectYear2){
      this.CaracterizacionView3=this.CaracterizacionView3.filter((resp:any)=>{
        return new Date(resp.fechaaccidente).getFullYear()==this.selectYear2
        })
    }

    if(this.selectMonth2.length>0){
      let CaracterizacionView3=[]
      let CaracterizacionView3_1:any=[]
      this.selectMonth2.forEach(ele=>{
        CaracterizacionView3=this.CaracterizacionView3.filter((resp:any)=>{
          return new Date(resp.fechaaccidente).getMonth()==ele.code
        })
        CaracterizacionView3.forEach((resp2:any)=>{
          CaracterizacionView3_1.push(resp2)
        })
      })
      this.CaracterizacionView3=CaracterizacionView3_1
    }

    //nuevo
    let reportesAtCopyDiv: any[]=[]
    if(this.selectPais3)if(this.selectPais3!='Corona Total')this.CaracterizacionView3 = this.CaracterizacionView3.filter((at:any) => at.pais == this.selectPais3);
    if(!flagCoronaTotal)if(this.selectedDivisionResumen3)this.CaracterizacionView3= this.CaracterizacionView3.filter((at:any) => at.padrenombre == this.selectedDivisionResumen3);
    if(flagCoronaTotal)if(this.selectedDivisionResumen3)if(this.selectedDivisionResumen3.length>0){
      reportesAtCopyDiv=[]
      this.selectedDivisionResumen3.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView3.filter((at:any) => at.padrenombre == element));
      });
      this.CaracterizacionView3=[...reportesAtCopyDiv]
    }
    if(this.LocalidadSelect3)if(this.LocalidadSelect3.length>0){
      reportesAtCopyDiv=[]
      this.LocalidadSelect3.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView3.filter((at:any) => at.nombreLocalidad == element));
      });
      this.CaracterizacionView3=[...reportesAtCopyDiv]
    }
    //fin nuevo

    this.resetVarGraf2()

    this.CaracterizacionView3.forEach((element:any) => {
      if(this.radioGra2==0)this.ContDatosGraf2(element)
      if(this.radioGra2==1 && element.emptemporal!=null)this.ContDatosGraf2(element)
      if(this.radioGra2==2 && element.emptemporal==null)this.ContDatosGraf2(element)
    });
    // this.segundaGrafica()
    
    this.filtroGraEve2()
  }
  ContDatosGraf2(element:any){
    let anios=this.difAnios(element.fechanacimientoempleado, new Date())
    this.fechaNacimiento(anios,element)

    let antiguedad=this.difAnios(element.fechaingresoempleado, new Date())
    this.fechaAntiguedad(antiguedad,element)

    this.horaAccidente(element.hora,element)
  }

  ContFechaNacimiento:any[]=[]

  fechaNacimiento(element:any,element2:any){

    let nombreLocalidad = (this.selectPais3=='Corona Total')?element2.padrenombre:element2.nombreLocalidad

    let rangoEdadNacimiento = ''
    if(nombreLocalidad && element){
      if(element>=18 && element<=25){
        rangoEdadNacimiento='18 a 25 años'
      }else if(element>=26 && element<=35){
        rangoEdadNacimiento='26 a 35 años'
      }else if(element>=36 && element<=45){
        rangoEdadNacimiento='36 a 45 años'
      }else if(element>=46 && element<=59){
        rangoEdadNacimiento='46 a 59 años'
      }else if(element>=60){
        rangoEdadNacimiento='60 años en adelante'
      }
      if (this.ContFechaNacimiento.hasOwnProperty(nombreLocalidad)) {
        if (this.ContFechaNacimiento[nombreLocalidad].hasOwnProperty(rangoEdadNacimiento)) {
          this.ContFechaNacimiento[nombreLocalidad][rangoEdadNacimiento] += 1;
        } else {
          this.ContFechaNacimiento[nombreLocalidad][rangoEdadNacimiento] = 1;
        }
      } else {
        this.ContFechaNacimiento[nombreLocalidad] = {};
        this.ContFechaNacimiento[nombreLocalidad][rangoEdadNacimiento] = 1;
      }
    }

  }

  ContFechaIngreso:any[]=[]

  fechaAntiguedad(element:any,element2:any){

    // let nombreLocalidad = element2.nombreLocalidad
    let nombreLocalidad = (this.selectPais3=='Corona Total')?element2.padrenombre:element2.nombreLocalidad

    let rangoAntiguedad = ''

    if(nombreLocalidad && element){
      if(element>=0 && element<=1){
        rangoAntiguedad='0 a 1 años'
      }else if(element>=2 && element<=5){
        rangoAntiguedad='2 a 5 años'
      }else if(element>=6 && element<=10){
        rangoAntiguedad='6 a 10 años'
      }else if(element>=11 && element<=20){
        rangoAntiguedad='11 a 20 años'
      }else if(element>=21 && element<=30){
        rangoAntiguedad='21 a 30 años'
      }else if(element>=31){
        rangoAntiguedad='31 años en adelante'
      }
      if (this.ContFechaIngreso.hasOwnProperty(nombreLocalidad)) {
        if (this.ContFechaIngreso[nombreLocalidad].hasOwnProperty(rangoAntiguedad)) {
          this.ContFechaIngreso[nombreLocalidad][rangoAntiguedad] += 1;
        } else {
          this.ContFechaIngreso[nombreLocalidad][rangoAntiguedad] = 1;
        }
      } else {
        this.ContFechaIngreso[nombreLocalidad] = {};
        this.ContFechaIngreso[nombreLocalidad][rangoAntiguedad] = 1;
      }
    }
  }

  ContHoraAccidente:any[]=[]

  horaAccidente(element:any,element2:any){
    // let nombreLocalidad = element2.nombreLocalidad
    let nombreLocalidad = (this.selectPais3=='Corona Total')?element2.padrenombre:element2.nombreLocalidad

    let rangoAccidente = ''

    if(nombreLocalidad && element){
      if(element>=0 && element<=4){
        rangoAccidente='00:00 a 03:59'
      }else if(element>=4 && element<8){
        rangoAccidente='04:00 a 07:59'
      }else if(element>=8 && element<12){
        rangoAccidente='08:00 a 11:59'
      }else if(element>=12 && element<16){
        rangoAccidente='12:00 a 15:59'
      }else if(element>=16 && element<20){
        rangoAccidente='16:00 a 19:59'
      }else if(element>=20){
        rangoAccidente='20:00 a 23:59'
      }

      if (this.ContHoraAccidente.hasOwnProperty(nombreLocalidad)) {
        if (this.ContHoraAccidente[nombreLocalidad].hasOwnProperty(rangoAccidente)) {
          this.ContHoraAccidente[nombreLocalidad][rangoAccidente] += 1;
        } else {
          this.ContHoraAccidente[nombreLocalidad][rangoAccidente] = 1;
        }
      } else {
        this.ContHoraAccidente[nombreLocalidad] = {};
        this.ContHoraAccidente[nombreLocalidad][rangoAccidente] = 1;
      }
    }
  }

  segundaGrafica(){
    this.flagevent2=false
    this.datosGrafica2=[]
    let datos:any=[]

    if(this.radioGra2_1==0){
      
      let datoGrafica:any=[]
      let list=(this.selectPais3=='Corona Total')?this.divisionList3:this.localidadesList3
      list.forEach((element:any) => {
        if(this.ContFechaNacimiento.hasOwnProperty(element.label)){
          if(Object.keys(this.ContFechaNacimiento[element.label]).length>0){
            let datoSeries:any=[]
            Object.keys(this.ContFechaNacimiento[element.label]).forEach((clave:any) => {
              datoSeries.push({name:clave,value:this.ContFechaNacimiento[element.label][clave]})
            });   
            datoSeries=this.order(datoSeries)
            datoGrafica.push({name:element.label,series:datoSeries})   
          }
        }
      });
      this.datosGrafica2=datoGrafica.map((e:any)=>e)
    }
    
    if(this.radioGra2_1==1){
      let datoGrafica:any=[]
      let list=(this.selectPais3=='Corona Total')?this.divisionList3:this.localidadesList3
      list.forEach((element:any) => {
        if(this.ContFechaIngreso.hasOwnProperty(element.label)){
          if(Object.keys(this.ContFechaIngreso[element.label]).length>0){
            let datoSeries:any=[]
            Object.keys(this.ContFechaIngreso[element.label]).forEach((clave:any) => {
              datoSeries.push({name:clave,value:this.ContFechaIngreso[element.label][clave]})
            });   
            datoSeries=this.order(datoSeries)
            datoGrafica.push({name:element.label,series:datoSeries})   
          }
        }
      });
      this.datosGrafica2=datoGrafica.map((e:any)=>e)
    }

    if(this.radioGra2_1==2){
      let datoGrafica:any=[]
      let list=(this.selectPais3=='Corona Total')?this.divisionList3:this.localidadesList3

      list.forEach((element:any) => {
        if(this.ContHoraAccidente.hasOwnProperty(element.label)){
          if(Object.keys(this.ContHoraAccidente[element.label]).length>0){
            let datoSeries:any=[]
            Object.keys(this.ContHoraAccidente[element.label]).forEach((clave:any) => {
              datoSeries.push({name:clave,value:this.ContHoraAccidente[element.label][clave]})
            });   
            datoSeries=this.order(datoSeries)
            datoGrafica.push({name:element.label,series:datoSeries})   
          }
        }
      });
      this.datosGrafica2=datoGrafica.map((e:any)=>e)
    }

    this.flagevent2=true
  }

  resetSelect2(){
    this.selectEv2=[]
    this.selectDiv2=[]
    if(this.radioGra2_1==0){this.labelFilterGra2='Seleccione rango edad'}
    if(this.radioGra2_1==1){this.labelFilterGra2='Seleccione rango antigüedad'}
    if(this.radioGra2_1==2){this.labelFilterGra2='Seleccione rango hora'}
    this.DatosGrafica2()
  }

  ////////////////////Segunda Grafica comparativa//////////////////
filtroGraEve2_2(){
  this.segundaGrafica_2()
  let total:string=(this.selectPais3_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen3_2
  if((this.selectPais3_2=='Corona Total' && (!this.selectedDivisionResumen3_2 || this.selectedDivisionResumen3_2.length==0))|| (this.selectPais3_2!='Corona Total' && (!this.LocalidadSelect3_2 || this.LocalidadSelect3_2.length==0)))
  this.datosGrafica2_2=this.contTotal(this.datosGrafica2_2,total)

  this.flagevent2_2=false
  let datosGrafica1:any=[]
  if(this.selectDiv2_2.length>0){
    this.selectDiv2_2.forEach(resp1=>{
      let x=this.datosGrafica2_2.filter((resp:any)=>{
        return resp.name ==resp1.label
      })
      if(x[0])
      datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica2_2=datosGrafica1
  }

  if(this.selectEv2_2.length>0){
    datosGrafica1=[]
    this.datosGrafica2_2.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv2_2.length>0){
        this.selectEv2_2.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['name']
          });
          if(x[0])
          randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica2_2=datosGrafica1
  }

  this.flagevent2_2=true
}

resetVarGraf2_2(){

  this.ContFechaNacimiento_2=[]
  this.ContFechaIngreso_2=[]
  this.ContHoraAccidente_2=[]

}
  DatosGrafica2_2(){
    let flagCoronaTotal:boolean=false
      if(this.selectPais3_2){
        if(this.selectPais3_2=='Corona Total')flagCoronaTotal=true
        else flagCoronaTotal=false
      }else flagCoronaTotal=false

    this.CaracterizacionView3_2=this.CaracterizacionView.map((e:any)=>e)

    if(this.date5_2 && !this.date6_2)
      this.CaracterizacionView3_2=this.CaracterizacionView3.filter((resp:any)=>{
      return resp.fechaaccidente>=new Date(this.date5_2!)
      })

    if(!this.date5_2 && this.date6_2){
      let date6:Date=new Date(new Date(this.date6_2).setMonth(new Date(this.date6_2).getMonth()+1))
      this.CaracterizacionView3_2=this.CaracterizacionView3_2.filter((resp:any)=>{
        return resp.fechaaccidente< date6;
        })
      }

    if(this.date5_2 && this.date6_2){
      let date6:Date=new Date(new Date(this.date6_2).setMonth(new Date(this.date6_2).getMonth()+1))
      this.CaracterizacionView3_2=this.CaracterizacionView3_2.filter((resp:any)=>{
        return resp.fechaaccidente<date6 && resp.fechaaccidente>=new Date(this.date5_2!)
        })}

    if(this.selectYear2_2){
      this.CaracterizacionView3_2=this.CaracterizacionView3_2.filter((resp:any)=>{
        return new Date(resp.fechaaccidente).getFullYear()==this.selectYear2_2
        })
    }

    if(this.selectMonth2_2.length>0){
      let CaracterizacionView3=[]
      let CaracterizacionView3_1:any=[]
      this.selectMonth2_2.forEach(ele=>{
        CaracterizacionView3=this.CaracterizacionView3_2.filter((resp:any)=>{
          return new Date(resp.fechaaccidente).getMonth()==ele.code
        })
        CaracterizacionView3.forEach((resp2:any)=>{
          CaracterizacionView3_1.push(resp2)
        })
      })
      this.CaracterizacionView3_2=CaracterizacionView3_1
    }

    //nuevo
    let reportesAtCopyDiv: any[]=[]
    if(this.selectPais3_2)if(this.selectPais3_2!='Corona Total')this.CaracterizacionView3_2 = this.CaracterizacionView3_2.filter((at:any) => at.pais == this.selectPais3_2);
    if(!flagCoronaTotal)if(this.selectedDivisionResumen3_2)this.CaracterizacionView3_2 = this.CaracterizacionView3_2.filter((at:any) => at.padrenombre == this.selectedDivisionResumen3_2);
    if(flagCoronaTotal)if(this.selectedDivisionResumen3_2)if(this.selectedDivisionResumen3_2.length>0){
      reportesAtCopyDiv=[]
      this.selectedDivisionResumen3_2.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView3_2.filter((at:any) => at.padrenombre == element));
      });
      this.CaracterizacionView3_2=[...reportesAtCopyDiv]
    }
    if(this.LocalidadSelect3_2)if(this.LocalidadSelect3_2.length>0){
      reportesAtCopyDiv=[]
      this.LocalidadSelect3_2.forEach((element:any) => {
        reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView3_2.filter((at:any) => at.nombreLocalidad == element));
      });
      this.CaracterizacionView3_2=[...reportesAtCopyDiv]
    }
    //fin nuevo

    this.resetVarGraf2_2()

    this.CaracterizacionView3_2.forEach((element:any) => {
      if(this.radioGra2_2==0)this.ContDatosGraf2_2(element)
      if(this.radioGra2_2==1 && element.emptemporal!=null)this.ContDatosGraf2_2(element)
      if(this.radioGra2_2==2 && element.emptemporal==null)this.ContDatosGraf2_2(element)
    });
    // this.segundaGrafica()
    
    this.filtroGraEve2_2()
  }
  ContDatosGraf2_2(element:any){
    let anios=this.difAnios(element.fechanacimientoempleado, new Date())
    this.fechaNacimiento_2(anios,element)

    let antiguedad=this.difAnios(element.fechaingresoempleado, new Date())
    this.fechaAntiguedad_2(antiguedad,element)

    this.horaAccidente_2(element.hora,element)
  }

  ContFechaNacimiento_2:any[]=[]

  fechaNacimiento_2(element:any,element2:any){
    let nombreLocalidad = (this.selectPais3_2=='Corona Total')?element2.padrenombre:element2.nombreLocalidad
    // let nombreLocalidad = element2.nombreLocalidad
    let rangoEdadNacimiento = ''
    if(nombreLocalidad && element){
      if(element>=18 && element<=25){
        rangoEdadNacimiento='18 a 25 años'
      }else if(element>=26 && element<=35){
        rangoEdadNacimiento='26 a 35 años'
      }else if(element>=36 && element<=45){
        rangoEdadNacimiento='36 a 45 años'
      }else if(element>=46 && element<=59){
        rangoEdadNacimiento='46 a 59 años'
      }else if(element>=60){
        rangoEdadNacimiento='60 años en adelante'
      }
      if (this.ContFechaNacimiento_2.hasOwnProperty(nombreLocalidad)) {
        if (this.ContFechaNacimiento_2[nombreLocalidad].hasOwnProperty(rangoEdadNacimiento)) {
          this.ContFechaNacimiento_2[nombreLocalidad][rangoEdadNacimiento] += 1;
        } else {
          this.ContFechaNacimiento_2[nombreLocalidad][rangoEdadNacimiento] = 1;
        }
      } else {
        this.ContFechaNacimiento_2[nombreLocalidad] = {};
        this.ContFechaNacimiento_2[nombreLocalidad][rangoEdadNacimiento] = 1;
      }
    }
  }

  ContFechaIngreso_2:any[]=[]

  fechaAntiguedad_2(element:any,element2:any){
    let nombreLocalidad = (this.selectPais3_2=='Corona Total')?element2.padrenombre:element2.nombreLocalidad
    // let nombreLocalidad = element2.nombreLocalidad
    let rangoAntiguedad = ''

    if(nombreLocalidad && element){
      if(element>=0 && element<=1){
        rangoAntiguedad='0 a 1 años'
      }else if(element>=2 && element<=5){
        rangoAntiguedad='2 a 5 años'
      }else if(element>=6 && element<=10){
        rangoAntiguedad='6 a 10 años'
      }else if(element>=11 && element<=20){
        rangoAntiguedad='11 a 20 años'
      }else if(element>=21 && element<=30){
        rangoAntiguedad='21 a 30 años'
      }else if(element>=31){
        rangoAntiguedad='31 años en adelante'
      }
      if (this.ContFechaIngreso_2.hasOwnProperty(nombreLocalidad)) {
        if (this.ContFechaIngreso_2[nombreLocalidad].hasOwnProperty(rangoAntiguedad)) {
          this.ContFechaIngreso_2[nombreLocalidad][rangoAntiguedad] += 1;
        } else {
          this.ContFechaIngreso_2[nombreLocalidad][rangoAntiguedad] = 1;
        }
      } else {
        this.ContFechaIngreso_2[nombreLocalidad] = {};
        this.ContFechaIngreso_2[nombreLocalidad][rangoAntiguedad] = 1;
      }
    }
  }

  ContHoraAccidente_2:any[]=[]

  horaAccidente_2(element:any,element2:any){
    let nombreLocalidad = (this.selectPais3_2=='Corona Total')?element2.padrenombre:element2.nombreLocalidad
    // let nombreLocalidad = element2.nombreLocalidad
    let rangoAccidente = ''

    if(nombreLocalidad && element){
      if(element>=0 && element<=4){
        rangoAccidente='00:00 a 03:59'
      }else if(element>=4 && element<8){
        rangoAccidente='04:00 a 07:59'
      }else if(element>=8 && element<12){
        rangoAccidente='08:00 a 11:59'
      }else if(element>=12 && element<16){
        rangoAccidente='12:00 a 15:59'
      }else if(element>=16 && element<20){
        rangoAccidente='16:00 a 19:59'
      }else if(element>=20){
        rangoAccidente='20:00 a 23:59'
      }

      if (this.ContHoraAccidente_2.hasOwnProperty(nombreLocalidad)) {
        if (this.ContHoraAccidente_2[nombreLocalidad].hasOwnProperty(rangoAccidente)) {
          this.ContHoraAccidente_2[nombreLocalidad][rangoAccidente] += 1;
        } else {
          this.ContHoraAccidente_2[nombreLocalidad][rangoAccidente] = 1;
        }
      } else {
        this.ContHoraAccidente_2[nombreLocalidad] = {};
        this.ContHoraAccidente_2[nombreLocalidad][rangoAccidente] = 1;
      }
    }
  }

  
  segundaGrafica_2(){
    this.flagevent2_2=false
    this.datosGrafica2_2=[]
    let datos:any=[]

    if(this.radioGra2_1_2==0){
      
      let datoGrafica:any=[]
      let list=(this.selectPais3_2=='Corona Total')?this.divisionList3_2:this.localidadesList3_2
      list.forEach((element:any) => {
        if(this.ContFechaNacimiento_2.hasOwnProperty(element.label)){
          if(Object.keys(this.ContFechaNacimiento_2[element.label]).length>0){
            let datoSeries:any=[]
            Object.keys(this.ContFechaNacimiento_2[element.label]).forEach((clave:any) => {
              datoSeries.push({name:clave,value:this.ContFechaNacimiento_2[element.label][clave]})
            });   
            datoSeries=this.order(datoSeries)
            datoGrafica.push({name:element.label,series:datoSeries})   
          }
        }
      });
      this.datosGrafica2_2=datoGrafica.map((e:any)=>e)
    }
    
    if(this.radioGra2_1_2==1){
      let datoGrafica:any=[]
      let list=(this.selectPais3_2=='Corona Total')?this.divisionList3_2:this.localidadesList3_2
      list.forEach((element:any) => {
        if(this.ContFechaIngreso_2.hasOwnProperty(element.label)){
          if(Object.keys(this.ContFechaIngreso_2[element.label]).length>0){
            let datoSeries:any=[]
            Object.keys(this.ContFechaIngreso_2[element.label]).forEach((clave:any) => {
              datoSeries.push({name:clave,value:this.ContFechaIngreso_2[element.label][clave]})
            });   
            datoSeries=this.order(datoSeries)
            datoGrafica.push({name:element.label,series:datoSeries})   
          }
        }
      });
      this.datosGrafica2_2=datoGrafica.map((e:any)=>e)
    }

    if(this.radioGra2_1_2==2){
      let datoGrafica:any=[]
      let list=(this.selectPais3_2=='Corona Total')?this.divisionList3_2:this.localidadesList3_2
      list.forEach((element:any) => {
        if(this.ContHoraAccidente_2.hasOwnProperty(element.label)){
          if(Object.keys(this.ContHoraAccidente_2[element.label]).length>0){
            let datoSeries:any=[]
            Object.keys(this.ContHoraAccidente_2[element.label]).forEach((clave:any) => {
              datoSeries.push({name:clave,value:this.ContHoraAccidente_2[element.label][clave]})
            });   
            datoSeries=this.order(datoSeries)
            datoGrafica.push({name:element.label,series:datoSeries})   
          }
        }
      });
      this.datosGrafica2_2=datoGrafica.map((e:any)=>e)
    }

    this.flagevent2_2=true
  }

  resetSelect2_2(){
    this.selectEv2_2=[]
    this.selectDiv2_2=[]
    if(this.radioGra2_1_2==0){this.labelFilterGra2_2='Seleccione rango edad'}
    if(this.radioGra2_1_2==1){this.labelFilterGra2_2='Seleccione rango antigüedad'}
    if(this.radioGra2_1_2==2){this.labelFilterGra2_2='Seleccione rango hora'}
    this.DatosGrafica2_2()
  }

///////////////Tercera Grafica/////////////////////
filtroGraEve3(){
  this.flagevent3=false
  this.terceraGrafica()
  let datosGrafica1:any=[]

  if(this.selectEv3.length==0 && this.selectDiv3.length>0){
    let total:string=(this.selectPais4=='Corona Total')?'Corona Total':this.selectedDivisionResumen4
    if((this.selectPais4=='Corona Total' && (!this.selectedDivisionResumen4 || this.selectedDivisionResumen4.length==0))|| (this.selectPais4!='Corona Total' && (!this.LocalidadSelect4 || this.LocalidadSelect4.length==0)))
    this.datosGrafica3=this.contTotal(this.datosGrafica3,total)
    this.datosGrafica3=this.organizarDatosMayorMenor(this.datosGrafica3)
    this.datosGrafica3Top=this.top(this.datosGrafica3,5)

    if(this.selectDiv3.length>0){
      this.selectDiv3.forEach(resp1=>{
        let x=this.datosGrafica3Top.filter((resp:any)=>{
          return resp.name ==resp1.name
        })
        if(x[0])
        datosGrafica1.push(x[0])
      })
      this.datosGrafica3Top=datosGrafica1
    }
  }

  if(this.selectDiv3.length>0 && this.selectEv3.length>0){
    let total:string=(this.selectPais4=='Corona Total')?'Corona Total':this.selectedDivisionResumen4
    if((this.selectPais4=='Corona Total' && (!this.selectedDivisionResumen4 || this.selectedDivisionResumen4.length==0))|| (this.selectPais4!='Corona Total' && (!this.LocalidadSelect4 || this.LocalidadSelect4.length==0)))
    this.datosGrafica3=this.contTotal(this.datosGrafica3,total)
    this.selectDiv3.forEach(resp1=>{
      let x=this.datosGrafica3.filter((resp:any)=>{
        return resp.name ==resp1.name
      })
      if(x[0])
      datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica3Top=datosGrafica1

    datosGrafica1=[]
    this.datosGrafica3Top.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv3.length>0){
        this.selectEv3.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['label']
          });
          if(x[0]){randomEv1CopySeries.push(x[0])}
          else{randomEv1CopySeries.push({name:element2['label'],value:0})}
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica3Top=datosGrafica1
  }

  if(this.selectEv3.length>0 && this.selectDiv3.length==0){
    datosGrafica1=[]
    let total:string=(this.selectPais4=='Corona Total')?'Corona Total':this.selectedDivisionResumen4
    if((this.selectPais4=='Corona Total' && (!this.selectedDivisionResumen4 || this.selectedDivisionResumen4.length==0))|| (this.selectPais4!='Corona Total' && (!this.LocalidadSelect4 || this.LocalidadSelect4.length==0)))
    this.datosGrafica3=this.contTotal(this.datosGrafica3,total)
    this.datosGrafica3.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv3.length>0){
        this.selectEv3.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['label']
          });
          if(x[0]){randomEv1CopySeries.push(x[0])}
          else{randomEv1CopySeries.push({name:element2['label'],value:0})}
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica3Top=datosGrafica1
  }

  if(this.selectEv3.length==0 && this.selectDiv3.length==0){
    let total:string=(this.selectPais4=='Corona Total')?'Corona Total':this.selectedDivisionResumen4
    if((this.selectPais4=='Corona Total' && (!this.selectedDivisionResumen4 || this.selectedDivisionResumen4.length==0))|| (this.selectPais4!='Corona Total' && (!this.LocalidadSelect4 || this.LocalidadSelect4.length==0)))
    this.datosGrafica3=this.contTotal(this.datosGrafica3,total)
    this.datosGrafica3=this.organizarDatosMayorMenor(this.datosGrafica3)
    this.datosGrafica3Top=this.top(this.datosGrafica3,5)
  }

  this.flagevent3=true
}

resetVariables3_2(){
  this.selectDiv3= [];
  this.selectEv3= [];
  this.DatosGrafica3();
}
resetVariables(){
  this.cargosLocalidades=[]
}

DatosGrafica3(){
  let flagCoronaTotal:boolean=false
      if(this.selectPais4){
        if(this.selectPais4=='Corona Total')flagCoronaTotal=true
        else flagCoronaTotal=false
      }else flagCoronaTotal=false

  this.CaracterizacionView4=this.CaracterizacionView.map((e:any)=>e)

    if(this.date7 && !this.date8)
      this.CaracterizacionView4=this.CaracterizacionView.filter((resp:any)=>{
      return resp.fechaaccidente>=new Date(this.date7!)
      })

    if(!this.date7 && this.date8){
      let date8:Date=new Date(new Date(this.date8).setMonth(new Date(this.date8).getMonth()+1))
      this.CaracterizacionView4=this.CaracterizacionView.filter((resp:any)=>{
        return resp.fechaaccidente< date8;
        })
      }

    if(this.date7 && this.date8){
      let date8:Date=new Date(new Date(this.date8).setMonth(new Date(this.date8).getMonth()+1))
      this.CaracterizacionView4=this.CaracterizacionView.filter((resp:any)=>{
        return resp.fechaaccidente<date8 && resp.fechaaccidente>=new Date(this.date7!)
        })}

    if(this.selectYear3){
      this.CaracterizacionView4=this.CaracterizacionView4.filter((resp:any)=>{
        return new Date(resp.fechaaccidente).getFullYear()==this.selectYear3
        })
    }

    if(this.selectMonth3.length>0){
      let CaracterizacionView4:any=[]
      let CaracterizacionView4_1:any=[]
      this.selectMonth3.forEach(ele=>{
        CaracterizacionView4=this.CaracterizacionView4.filter((resp:any)=>{
          return new Date(resp.fechaaccidente).getMonth()==ele.code
        })
        CaracterizacionView4.forEach((resp2:any)=>{
          CaracterizacionView4_1.push(resp2)
        })
      })
      this.CaracterizacionView4=CaracterizacionView4_1
    }

  //nuevo
  let reportesAtCopyDiv: any[]=[]
  if(this.selectPais4)if(this.selectPais4!='Corona Total')this.CaracterizacionView4 = this.CaracterizacionView4.filter((at:any) => at.pais == this.selectPais4);
  if(!flagCoronaTotal)if(this.selectedDivisionResumen4)this.CaracterizacionView4= this.CaracterizacionView4.filter((at:any) => at.padrenombre == this.selectedDivisionResumen4);
  if(flagCoronaTotal)if(this.selectedDivisionResumen4)if(this.selectedDivisionResumen4.length>0){
    reportesAtCopyDiv=[]
    this.selectedDivisionResumen4.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView4.filter((at:any) => at.padrenombre == element));
    });
    this.CaracterizacionView4=[...reportesAtCopyDiv]
  }
  if(this.LocalidadSelect4)if(this.LocalidadSelect4.length>0){
    reportesAtCopyDiv=[]
    this.LocalidadSelect4.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView4.filter((at:any) => at.nombreLocalidad == element.nombre));
    });
    this.CaracterizacionView4=[...reportesAtCopyDiv]
  }
  //fin nuevo
  this.resetVariables()

  this.CaracterizacionView4.forEach((element:any) => {
    if(this.radioGra3==0)this.ContDatosGraf3(element)
    if(this.radioGra3==1 && element.emptemporal!=null)this.ContDatosGraf3(element)
    if(this.radioGra3==2 && element.emptemporal==null)this.ContDatosGraf3(element)
  });
  this.terceraGrafica()
  let total:string=(this.selectPais4=='Corona Total')?'Corona Total':this.selectedDivisionResumen4
  if((this.selectPais4=='Corona Total' && (!this.selectedDivisionResumen4 || this.selectedDivisionResumen4.length==0))|| (this.selectPais4!='Corona Total' && (!this.LocalidadSelect4 || this.LocalidadSelect4.length==0)))
  this.datosGrafica3=this.contTotal(this.datosGrafica3,total)
  this.datosGrafica3=this.organizarDatosMayorMenor(this.datosGrafica3)
  this.datosGrafica3Top=this.top(this.datosGrafica3,5)

  this.filtroGraEve3()
}

  ContDatosGraf3(element:any){
  let nombreLocalidad = (this.selectPais4=='Corona Total')?element.padrenombre:element.nombreLocalidad

  // let nombreLocalidad = element.nombreLocalidad
  let cargoLocalidad = element.cargoempleado

  if(nombreLocalidad && cargoLocalidad){
    if (this.cargosLocalidades.hasOwnProperty(nombreLocalidad)) {
      if (this.cargosLocalidades[nombreLocalidad].hasOwnProperty(cargoLocalidad)) {
        this.cargosLocalidades[nombreLocalidad][cargoLocalidad] += 1;
      } else {
        this.cargosLocalidades[nombreLocalidad][cargoLocalidad] = 1;
      }
    } else {
      this.cargosLocalidades[nombreLocalidad] = {};
      this.cargosLocalidades[nombreLocalidad][cargoLocalidad] = 1;
    }
  }
}
cargosLocalidades:any[]=[]

terceraGrafica(){
  this.flagevent3=false

  this.datosGrafica3=[]

  let datoGrafica:any=[]
  let list = (this.selectPais4=='Corona Total')?this.divisionList4:this.localidadesList4
  list.forEach((element:any) => {
    if(this.cargosLocalidades.hasOwnProperty(element.label)){
      if(Object.keys(this.cargosLocalidades[element.label]).length>0){
        let datoSeries:any=[]
        Object.keys(this.cargosLocalidades[element.label]).forEach((clave:any) => {
          datoSeries.push({name:clave,value:this.cargosLocalidades[element.label][clave]})
        });   
        datoSeries=this.order(datoSeries)
        datoGrafica.push({name:element.label,series:datoSeries})   
      }
    }
  });
  this.datosGrafica3=datoGrafica.map((e:any)=>e)
  
  this.flagevent3=true
}

resetSelect3(){
  this.selectEv3=[]
}

///////////////Tercera Grafica comparativa/////////////////////
filtroGraEve3_2(){
  this.flagevent3_2=false
  this.terceraGrafica_2()
  let datosGrafica1:any=[]

  if(this.selectEv3_2.length==0 && this.selectDiv3_2.length>0){
    let total:string=(this.selectPais4_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen4_2
    if((this.selectPais4_2=='Corona Total' && (!this.selectedDivisionResumen4_2 || this.selectedDivisionResumen4_2.length==0))|| (this.selectPais4_2!='Corona Total' && (!this.LocalidadSelect4_2 || this.LocalidadSelect4_2.length==0)))
    this.datosGrafica3_2=this.contTotal(this.datosGrafica3_2,total)
    this.datosGrafica3_2=this.organizarDatosMayorMenor(this.datosGrafica3_2)
    this.datosGrafica3Top_2=this.top(this.datosGrafica3_2,5)

    if(this.selectDiv3_2.length>0){
      this.selectDiv3_2.forEach(resp1=>{
        let x=this.datosGrafica3Top_2.filter((resp:any)=>{
          return resp.name ==resp1.name
        })
        if(x[0])
        datosGrafica1.push(x[0])
      })
      this.datosGrafica3Top_2=datosGrafica1
    }
  }

  if(this.selectDiv3_2.length>0 && this.selectEv3_2.length>0){
    let total:string=(this.selectPais4_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen4_2
    if((this.selectPais4_2=='Corona Total' && (!this.selectedDivisionResumen4_2 || this.selectedDivisionResumen4_2.length==0))|| (this.selectPais4_2!='Corona Total' && (!this.LocalidadSelect4_2 || this.LocalidadSelect4_2.length==0)))
    this.datosGrafica3_2=this.contTotal(this.datosGrafica3_2,total)
    this.selectDiv3_2.forEach(resp1=>{
      let x=this.datosGrafica3_2.filter((resp:any)=>{
        return resp.name ==resp1.name
      })
      if(x[0])
      datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica3Top_2=datosGrafica1

    datosGrafica1=[]
    this.datosGrafica3Top_2.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv3_2.length>0){
        this.selectEv3_2.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['label']
          });
          if(x[0]){randomEv1CopySeries.push(x[0])}
          else{randomEv1CopySeries.push({name:element2['label'],value:0})}
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica3Top_2=datosGrafica1
  }

  if(this.selectEv3_2.length>0 && this.selectDiv3_2.length==0){
    datosGrafica1=[]
    let total:string=(this.selectPais4_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen4_2
    if((this.selectPais4_2=='Corona Total' && (!this.selectedDivisionResumen4_2 || this.selectedDivisionResumen4_2.length==0))|| (this.selectPais4_2!='Corona Total' && (!this.LocalidadSelect4_2 || this.LocalidadSelect4_2.length==0)))
    this.datosGrafica3_2=this.contTotal(this.datosGrafica3_2,total)
    this.datosGrafica3_2.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv3_2.length>0){
        this.selectEv3_2.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['label']
          });
          if(x[0]){randomEv1CopySeries.push(x[0])}
          else{randomEv1CopySeries.push({name:element2['label'],value:0})}
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica3Top_2=datosGrafica1
  }

  if(this.selectEv3_2.length==0 && this.selectDiv3_2.length==0){
    let total:string=(this.selectPais4_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen4_2
    if((this.selectPais4_2=='Corona Total' && (!this.selectedDivisionResumen4_2 || this.selectedDivisionResumen4_2.length==0))|| (this.selectPais4_2!='Corona Total' && (!this.LocalidadSelect4_2 || this.LocalidadSelect4_2.length==0)))
    this.datosGrafica3_2=this.contTotal(this.datosGrafica3_2,total)
    this.datosGrafica3_2=this.organizarDatosMayorMenor(this.datosGrafica3_2)
    this.datosGrafica3Top_2=this.top(this.datosGrafica3_2,5)
  }

  this.flagevent3_2=true
}

resetVariables3_2_2(){
  this.selectDiv3_2= [];
  this.selectEv3_2= [];
  this.DatosGrafica3_2();
}
resetVariables_2(){
  this.cargosLocalidades_2=[]
}
  
DatosGrafica3_2(){
  let flagCoronaTotal:boolean=false
      if(this.selectPais4_2){
        if(this.selectPais4_2=='Corona Total')flagCoronaTotal=true
        else flagCoronaTotal=false
      }else flagCoronaTotal=false

  this.CaracterizacionView4_2=this.CaracterizacionView.map((e:any)=>e)

    if(this.date7_2 && !this.date8_2)
      this.CaracterizacionView4_2=this.CaracterizacionView.filter((resp:any)=>{
      return resp.fechaaccidente>=new Date(this.date7_2!)
      })

    if(!this.date7_2 && this.date8_2){
      let date8:Date=new Date(new Date(this.date8_2).setMonth(new Date(this.date8_2).getMonth()+1))
      this.CaracterizacionView4_2=this.CaracterizacionView.filter((resp:any)=>{
        return resp.fechaaccidente< date8;
        })
      }

    if(this.date7_2 && this.date8_2){
      let date8:Date=new Date(new Date(this.date8_2).setMonth(new Date(this.date8_2).getMonth()+1))
      this.CaracterizacionView4_2=this.CaracterizacionView.filter((resp:any)=>{
        return resp.fechaaccidente<date8 && resp.fechaaccidente>=new Date(this.date7_2!)
        })}

    if(this.selectYear3_2){
      this.CaracterizacionView4_2=this.CaracterizacionView4_2.filter((resp:any)=>{
        return new Date(resp.fechaaccidente).getFullYear()==this.selectYear3_2
        })
    }

    if(this.selectMonth3_2.length>0){
      let CaracterizacionView4:any=[]
      let CaracterizacionView4_1:any=[]
      this.selectMonth3_2.forEach(ele=>{
        CaracterizacionView4=this.CaracterizacionView4_2.filter((resp:any)=>{
          return new Date(resp.fechaaccidente).getMonth()==ele.code
        })
        CaracterizacionView4.forEach((resp2:any)=>{
          CaracterizacionView4_1.push(resp2)
        })
      })
      this.CaracterizacionView4_2=CaracterizacionView4_1
    }

  //nuevo
  let reportesAtCopyDiv: any[]=[]
  if(this.selectPais4_2)if(this.selectPais4_2!='Corona Total')this.CaracterizacionView4_2 = this.CaracterizacionView4_2.filter((at:any) => at.pais == this.selectPais4_2);
  if(!flagCoronaTotal)if(this.selectedDivisionResumen4_2)this.CaracterizacionView4_2= this.CaracterizacionView4_2.filter((at:any) => at.padrenombre == this.selectedDivisionResumen4_2);
  if(flagCoronaTotal)if(this.selectedDivisionResumen4_2)if(this.selectedDivisionResumen4_2.length>0){
    reportesAtCopyDiv=[]
    this.selectedDivisionResumen4_2.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView4_2.filter((at:any) => at.padrenombre == element));
    });
    this.CaracterizacionView4_2=[...reportesAtCopyDiv]
  }
  if(this.LocalidadSelect4_2)if(this.LocalidadSelect4_2.length>0){
    reportesAtCopyDiv=[]
    this.LocalidadSelect4_2.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView4_2.filter((at:any) => at.nombreLocalidad == element.nombre));
    });
    this.CaracterizacionView4_2=[...reportesAtCopyDiv]
  }
  //fin nuevo

  this.resetVariables_2()

  this.CaracterizacionView4_2.forEach((element:any) => {
    if(this.radioGra3_2==0)this.ContDatosGraf3_2(element)
    if(this.radioGra3_2==1 && element.emptemporal!=null)this.ContDatosGraf3_2(element)
    if(this.radioGra3_2==2 && element.emptemporal==null)this.ContDatosGraf3_2(element)
  });
  this.terceraGrafica_2()
  let total:string=(this.selectPais4_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen4_2
  if((this.selectPais4_2=='Corona Total' && (!this.selectedDivisionResumen4_2 || this.selectedDivisionResumen4_2.length==0))|| (this.selectPais4_2!='Corona Total' && (!this.LocalidadSelect4_2 || this.LocalidadSelect4_2.length==0)))
  this.datosGrafica3_2=this.contTotal(this.datosGrafica3_2,total)
  this.datosGrafica3_2=this.organizarDatosMayorMenor(this.datosGrafica3_2)
  this.datosGrafica3Top_2=this.top(this.datosGrafica3_2,5)

  this.filtroGraEve3_2()
}

  ContDatosGraf3_2(element:any){  
  let nombreLocalidad = (this.selectPais4_2=='Corona Total')?element.padrenombre:element.nombreLocalidad

  // let nombreLocalidad = element.nombreLocalidad
  let cargoLocalidad = element.cargoempleado

  if(nombreLocalidad && cargoLocalidad){
    if (this.cargosLocalidades_2.hasOwnProperty(nombreLocalidad)) {
      if (this.cargosLocalidades_2[nombreLocalidad].hasOwnProperty(cargoLocalidad)) {
        this.cargosLocalidades_2[nombreLocalidad][cargoLocalidad] += 1;
      } else {
        this.cargosLocalidades_2[nombreLocalidad][cargoLocalidad] = 1;
      }
    } else {
      this.cargosLocalidades_2[nombreLocalidad] = {};
      this.cargosLocalidades_2[nombreLocalidad][cargoLocalidad] = 1;
    }
  }
}
cargosLocalidades_2:any[]=[]

terceraGrafica_2(){
  this.flagevent3_2=false

  this.datosGrafica3_2=[]

  let datoGrafica:any=[]
  let list = (this.selectPais4_2=='Corona Total')?this.divisionList4_2:this.localidadesList4_2
  list.forEach((element:any) => {
    if(this.cargosLocalidades_2.hasOwnProperty(element.label)){
      if(Object.keys(this.cargosLocalidades_2[element.label]).length>0){
        let datoSeries:any=[]
        Object.keys(this.cargosLocalidades_2[element.label]).forEach((clave:any) => {
          datoSeries.push({name:clave,value:this.cargosLocalidades_2[element.label][clave]})
        });   
        datoSeries=this.order(datoSeries)
        datoGrafica.push({name:element.label,series:datoSeries})   
      }
    }
  });
  this.datosGrafica3_2=datoGrafica.map((e:any)=>e)
  
  this.flagevent3_2=true
}

resetSelect3_2(){
  this.selectEv3_2=[]
}

//////////////////////cuarta grafica///////////////////

filtroGraEve4(){
  this.flagevent4=false
  this.graf4top5()
  let datosGrafica1:any=[]

  if(this.selectEv4.length==0 && this.selectDiv4.length>0){
    // this.datosGrafica4=this.contTotal(this.datosGrafica4)
    let total:string=(this.selectPais5=='Corona Total')?'Corona Total':this.selectedDivisionResumen5
    if((this.selectPais5=='Corona Total' && (!this.selectedDivisionResumen5 || this.selectedDivisionResumen5.length==0))|| (this.selectPais5!='Corona Total' && (!this.LocalidadSelect5 || this.LocalidadSelect5.length==0)))
    this.datosGrafica4=this.contTotal(this.datosGrafica4,total)
    this.datosGrafica4=this.organizarDatosMayorMenor(this.datosGrafica4)
    this.datosGrafica4Top=this.top(this.datosGrafica4,5)

    if(this.selectDiv4.length>0){
      this.selectDiv4.forEach(resp1=>{
        let x=this.datosGrafica4Top.filter((resp:any)=>{
          return resp.name ==resp1.name
        })
        if(x[0])datosGrafica1.push(x[0])
      })
      this.datosGrafica4Top=datosGrafica1
    }
  }

  if(this.selectDiv4.length>0 && this.selectEv4.length>0){
    let total:string=(this.selectPais5=='Corona Total')?'Corona Total':this.selectedDivisionResumen5
    if((this.selectPais5=='Corona Total' && (!this.selectedDivisionResumen5 || this.selectedDivisionResumen5.length==0))|| (this.selectPais5!='Corona Total' && (!this.LocalidadSelect5 || this.LocalidadSelect5.length==0)))
    this.datosGrafica4=this.contTotal(this.datosGrafica4,total)
    this.selectDiv4.forEach(resp1=>{
      let x=this.datosGrafica4.filter((resp:any)=>{
        return resp.name ==resp1.name
      })
      if(x[0])datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica4Top=datosGrafica1

    datosGrafica1=[]
    this.datosGrafica4Top.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv4.length>0){
        this.selectEv4.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['value']
          });
          if(x[0]){randomEv1CopySeries.push(x[0])}
          else{randomEv1CopySeries.push({name:element2['value'],value:0})}
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica4Top=datosGrafica1
  }

  if(this.selectEv4.length>0 && this.selectDiv4.length==0){
    let total:string=(this.selectPais5=='Corona Total')?'Corona Total':this.selectedDivisionResumen5
    if((this.selectPais5=='Corona Total' && (!this.selectedDivisionResumen5 || this.selectedDivisionResumen5.length==0))|| (this.selectPais5!='Corona Total' && (!this.LocalidadSelect5 || this.LocalidadSelect5.length==0)))
    this.datosGrafica4=this.contTotal(this.datosGrafica4,total)
    datosGrafica1=[]
    this.datosGrafica4.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv4.length>0){
        this.selectEv4.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['value']
          });
          if(x[0]){randomEv1CopySeries.push(x[0])}
          else{randomEv1CopySeries.push({name:element2['value'],value:0})}
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries)datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    
    this.datosGrafica4Top=datosGrafica1
  }

  if(this.selectEv4.length==0 && this.selectDiv4.length==0){
    let total:string=(this.selectPais5=='Corona Total')?'Corona Total':this.selectedDivisionResumen5
    if((this.selectPais5=='Corona Total' && (!this.selectedDivisionResumen5 || this.selectedDivisionResumen5.length==0))|| (this.selectPais5!='Corona Total' && (!this.LocalidadSelect5 || this.LocalidadSelect5.length==0)))
    this.datosGrafica4=this.contTotal(this.datosGrafica4,total)
    this.datosGrafica4=this.organizarDatosMayorMenor(this.datosGrafica4)
    this.datosGrafica4Top=this.top(this.datosGrafica4,5)
  }

  this.flagevent4=true
}

DatosGrafica4(){
  let flagCoronaTotal:boolean=false
      if(this.selectPais5){
        if(this.selectPais5=='Corona Total')flagCoronaTotal=true
        else flagCoronaTotal=false
      }else flagCoronaTotal=false

  this.CaracterizacionView5=this.CaracterizacionView.map((e:any)=>e)

  this.reinciarVariable()

  if(this.selectYear4){
    this.CaracterizacionView5=this.CaracterizacionView5.filter((resp:any)=>{
      return new Date(resp.fechaaccidente).getFullYear()==this.selectYear4
      })
  }

  if(this.selectMonth4.length>0){
    let CaracterizacionView5:any=[]
    let CaracterizacionView5_1:any=[]
    this.selectMonth4.forEach(ele=>{
      CaracterizacionView5=this.CaracterizacionView5.filter((resp:any)=>{
        return new Date(resp.fechaaccidente).getMonth()==ele.code
      })
      CaracterizacionView5.forEach((resp2:any)=>{
        CaracterizacionView5_1.push(resp2)
      })
    })
    this.CaracterizacionView5=CaracterizacionView5_1
  }
  //nuevo
  let reportesAtCopyDiv: any[]=[]
  if(this.selectPais5)if(this.selectPais5!='Corona Total')this.CaracterizacionView5 = this.CaracterizacionView5.filter((at:any) => at.pais == this.selectPais5);
  if(!flagCoronaTotal)if(this.selectedDivisionResumen5)this.CaracterizacionView5= this.CaracterizacionView5.filter((at:any) => at.padrenombre == this.selectedDivisionResumen5);
  if(flagCoronaTotal)if(this.selectedDivisionResumen5)if(this.selectedDivisionResumen5.length>0){
    reportesAtCopyDiv=[]
    this.selectedDivisionResumen5.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView5.filter((at:any) => at.padrenombre == element));
    });
    this.CaracterizacionView5=[...reportesAtCopyDiv]
  }
  if(this.LocalidadSelect5)if(this.LocalidadSelect5.length>0){
    reportesAtCopyDiv=[]
    this.LocalidadSelect5.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView5.filter((at:any) => at.nombreLocalidad == element));
    });
    this.CaracterizacionView5=[...reportesAtCopyDiv]
  }
  //fin nuevo

  this.CaracterizacionView5.forEach((element:any) => {
    if(this.radioGra4==0)this.ContDatosGraf4(element)
    if(this.radioGra4==1 && element.emptemporal!=null)this.ContDatosGraf4(element)
    if(this.radioGra4==2 && element.emptemporal==null)this.ContDatosGraf4(element)
  });

  this.graf4top5()
  let total:string=(this.selectPais5=='Corona Total')?'Corona Total':this.selectedDivisionResumen5
  if((this.selectPais5=='Corona Total' && (!this.selectedDivisionResumen5 || this.selectedDivisionResumen5.length==0))|| (this.selectPais5!='Corona Total' && (!this.LocalidadSelect5 || this.LocalidadSelect5.length==0)))
  this.datosGrafica4=this.contTotal(this.datosGrafica4,total)
  this.datosGrafica4=this.organizarDatosMayorMenor(this.datosGrafica4)

  this.datosGrafica4Top=this.top(this.datosGrafica4,5)
}

tipoAccidente=[]
lugarAccidente=[]
agente=[]
mecanismo=[]
parteCuerpo=[]
tipoLesion=[]
labelGraf4:string="Tipo de accidente"

graf4top5(){

  this.flagevent4=false
  this.datosGrafica4=[]

  if(this.radioGra4_1==0){
    this.labelGraf4="Tipo de accidente"
    this.filtroEventos4=this.tipoaccidenteList
    this.datosGrafica4=[]

    let datoGrafica:any=[]
    let list = (this.selectPais5=='Corona Total')?this.divisionList5:this.localidadesList5

    list.forEach((element:any) => {
      if(this.grafTipoAccLocalidades.hasOwnProperty(element.label)){
        if(Object.keys(this.grafTipoAccLocalidades[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.grafTipoAccLocalidades[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.grafTipoAccLocalidades[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica4=datoGrafica.map((e:any)=>e)
  }

  if(this.radioGra4_1==1){
    this.labelGraf4="Lugar del accidente"
    this.filtroEventos4=this.sitioaccidenteList
    this.datosGrafica4=[]

    let datoGrafica:any=[]
    let list = (this.selectPais5=='Corona Total')?this.divisionList5:this.localidadesList5

    list.forEach((element:any) => {
      if(this.grafLugarAccLocalidades.hasOwnProperty(element.label)){
        if(Object.keys(this.grafLugarAccLocalidades[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.grafLugarAccLocalidades[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.grafLugarAccLocalidades[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica4=datoGrafica.map((e:any)=>e)
  }

  if(this.radioGra4_1==2){
    this.labelGraf4="Agente"
    this.filtroEventos4=this.agenteList
    this.datosGrafica4=[]

    let datoGrafica:any=[]
    let list = (this.selectPais5=='Corona Total')?this.divisionList5:this.localidadesList5

    list.forEach((element:any) => {
      if(this.grafAgenteLocalidades.hasOwnProperty(element.label)){
        if(Object.keys(this.grafAgenteLocalidades[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.grafAgenteLocalidades[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.grafAgenteLocalidades[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica4=datoGrafica.map((e:any)=>e)
  }

  if(this.radioGra4_1==3){
    this.labelGraf4="Mecanismo"
    this.filtroEventos4=this.mecanismoList
    this.datosGrafica4=[]

    let datoGrafica:any=[]
    let list = (this.selectPais5=='Corona Total')?this.divisionList5:this.localidadesList5
    list.forEach((element:any) => {
      if(this.grafMecanismoAccLocalidades.hasOwnProperty(element.label)){
        if(Object.keys(this.grafMecanismoAccLocalidades[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.grafMecanismoAccLocalidades[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.grafMecanismoAccLocalidades[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica4=datoGrafica.map((e:any)=>e)
  }

  if(this.radioGra4_1==4){
    this.labelGraf4="Parte del cuerpo"
    this.filtroEventos4=this.partecuerpoList
    this.datosGrafica4=[]

    let datoGrafica:any=[]

    let list = (this.selectPais5=='Corona Total')?this.divisionList5:this.localidadesList5
    list.forEach((element:any) => {
      if(this.grafParteCuerpLocalidades.hasOwnProperty(element.label)){
        if(Object.keys(this.grafParteCuerpLocalidades[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.grafParteCuerpLocalidades[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.grafParteCuerpLocalidades[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica4=datoGrafica.map((e:any)=>e)
  }

  if(this.radioGra4_1==5){
    this.labelGraf4="Tipo de lesión"
    this.filtroEventos4=this.tipolesionList
    this.datosGrafica4=[]

    let datoGrafica:any=[]

    let list = (this.selectPais5=='Corona Total')?this.divisionList5:this.localidadesList5
    list.forEach((element:any) => {
      if(this.grafTipoLesLocalidades.hasOwnProperty(element.label)){
        if(Object.keys(this.grafTipoLesLocalidades[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.grafTipoLesLocalidades[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.grafTipoLesLocalidades[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica4=datoGrafica.map((e:any)=>e)
  }
  
  this.flagevent4=true
  
}


grafTipoAccLocalidades:any[]=[]
grafLugarAccLocalidades:any[]=[]
grafAgenteLocalidades:any[]=[]
grafMecanismoAccLocalidades:any[]=[]
grafParteCuerpLocalidades:any[]=[]
grafTipoLesLocalidades:any[]=[]

ContDatosGraf4(element:any){
  let nombreLocalidad = (this.selectPais5=='Corona Total')?element.padrenombre:element.nombreLocalidad

  // let nombreLocalidad = element.nombreLocalidad

  let tipoAccLocalidad = element.tipoaccidente
  let lugarAccLocalidad = element.sitio
  let agenteLocalidad = element.agente
  let mecanismoAccLocalidad = element.mecanismo
  let parteCuerpLocalidad = element.partecuerpo
  let tipoLesLocalidad = element.tipolesion

  if(nombreLocalidad && tipoAccLocalidad){
    if (this.grafTipoAccLocalidades.hasOwnProperty(nombreLocalidad)) {
      if (this.grafTipoAccLocalidades[nombreLocalidad].hasOwnProperty(tipoAccLocalidad)) {
        this.grafTipoAccLocalidades[nombreLocalidad][tipoAccLocalidad] += 1;
      } else {
        this.grafTipoAccLocalidades[nombreLocalidad][tipoAccLocalidad] = 1;
      }
    } else {
      this.grafTipoAccLocalidades[nombreLocalidad] = {};
      this.grafTipoAccLocalidades[nombreLocalidad][tipoAccLocalidad] = 1;
    }
  }

  if(nombreLocalidad && lugarAccLocalidad){
    if (this.grafLugarAccLocalidades.hasOwnProperty(nombreLocalidad)) {
      if (this.grafLugarAccLocalidades[nombreLocalidad].hasOwnProperty(lugarAccLocalidad)) {
        this.grafLugarAccLocalidades[nombreLocalidad][lugarAccLocalidad] += 1;
      } else {
        this.grafLugarAccLocalidades[nombreLocalidad][lugarAccLocalidad] = 1;
      }
    } else {
      this.grafLugarAccLocalidades[nombreLocalidad] = {};
      this.grafLugarAccLocalidades[nombreLocalidad][lugarAccLocalidad] = 1;
    }
  }

  if(nombreLocalidad && agenteLocalidad){
    if (this.grafAgenteLocalidades.hasOwnProperty(nombreLocalidad)) {
      if (this.grafAgenteLocalidades[nombreLocalidad].hasOwnProperty(agenteLocalidad)) {
        this.grafAgenteLocalidades[nombreLocalidad][agenteLocalidad] += 1;
      } else {
        this.grafAgenteLocalidades[nombreLocalidad][agenteLocalidad] = 1;
      }
    } else {
      this.grafAgenteLocalidades[nombreLocalidad] = {};
      this.grafAgenteLocalidades[nombreLocalidad][agenteLocalidad] = 1;
    }
  }

  if(nombreLocalidad && mecanismoAccLocalidad){
    if (this.grafMecanismoAccLocalidades.hasOwnProperty(nombreLocalidad)) {
      if (this.grafMecanismoAccLocalidades[nombreLocalidad].hasOwnProperty(mecanismoAccLocalidad)) {
        this.grafMecanismoAccLocalidades[nombreLocalidad][mecanismoAccLocalidad] += 1;
      } else {
        this.grafMecanismoAccLocalidades[nombreLocalidad][mecanismoAccLocalidad] = 1;
      }
    } else {
      this.grafMecanismoAccLocalidades[nombreLocalidad] = {};
      this.grafMecanismoAccLocalidades[nombreLocalidad][mecanismoAccLocalidad] = 1;
    }
  }

  if(nombreLocalidad && parteCuerpLocalidad){
    if (this.grafParteCuerpLocalidades.hasOwnProperty(nombreLocalidad)) {
      if (this.grafParteCuerpLocalidades[nombreLocalidad].hasOwnProperty(parteCuerpLocalidad)) {
        this.grafParteCuerpLocalidades[nombreLocalidad][parteCuerpLocalidad] += 1;
      } else {
        this.grafParteCuerpLocalidades[nombreLocalidad][parteCuerpLocalidad] = 1;
      }
    } else {
      this.grafParteCuerpLocalidades[nombreLocalidad] = {};
      this.grafParteCuerpLocalidades[nombreLocalidad][parteCuerpLocalidad] = 1;
    }
  }

  if(nombreLocalidad && tipoLesLocalidad){
    if (this.grafTipoLesLocalidades.hasOwnProperty(nombreLocalidad)) {
      if (this.grafTipoLesLocalidades[nombreLocalidad].hasOwnProperty(tipoLesLocalidad)) {
        this.grafTipoLesLocalidades[nombreLocalidad][tipoLesLocalidad] += 1;
      } else {
        this.grafTipoLesLocalidades[nombreLocalidad][tipoLesLocalidad] = 1;
      }
    } else {
      this.grafTipoLesLocalidades[nombreLocalidad] = {};
      this.grafTipoLesLocalidades[nombreLocalidad][tipoLesLocalidad] = 1;
    }
  }
}
reinciarVariable4_1(){
  this.selectEv4=[]
  this.selectDiv4=[]

  this.DatosGrafica4()
}
reinciarVariable(){
  this.grafTipoAccLocalidades=[]
  this.grafLugarAccLocalidades=[]
  this.grafAgenteLocalidades=[]
  this.grafMecanismoAccLocalidades=[]
  this.grafParteCuerpLocalidades=[]
  this.grafTipoLesLocalidades=[]
}


//////////////////////cuarta grafica comparativa///////////////////

filtroGraEve4_2(){
  this.flagevent4_2=false
  this.graf4top5_2()
  let datosGrafica1:any=[]

  if(this.selectEv4_2.length==0 && this.selectDiv4_2.length>0){
    let total:string=(this.selectPais5_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen5_2
    if((this.selectPais5_2=='Corona Total' && (!this.selectedDivisionResumen5_2 || this.selectedDivisionResumen5_2.length==0))|| (this.selectPais5_2!='Corona Total' && (!this.LocalidadSelect5_2 || this.LocalidadSelect5_2.length==0)))
    this.datosGrafica4_2=this.contTotal(this.datosGrafica4_2,total)
    this.datosGrafica4_2=this.organizarDatosMayorMenor(this.datosGrafica4_2)
    this.datosGrafica4Top_2=this.top(this.datosGrafica4_2,5)

    if(this.selectDiv4_2.length>0){
      this.selectDiv4_2.forEach(resp1=>{
        let x=this.datosGrafica4Top_2.filter((resp:any)=>{
          return resp.name ==resp1.name
        })
        if(x[0])datosGrafica1.push(x[0])
      })
      this.datosGrafica4Top_2=datosGrafica1
    }
  }

  if(this.selectDiv4_2.length>0 && this.selectEv4_2.length>0){
    let total:string=(this.selectPais5_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen5_2
    if((this.selectPais5_2=='Corona Total' && (!this.selectedDivisionResumen5_2 || this.selectedDivisionResumen5_2.length==0))|| (this.selectPais5_2!='Corona Total' && (!this.LocalidadSelect5_2 || this.LocalidadSelect5_2.length==0)))
    this.datosGrafica4_2=this.contTotal(this.datosGrafica4_2,total)
    this.selectDiv4_2.forEach(resp1=>{
      let x=this.datosGrafica4_2.filter((resp:any)=>{
        return resp.name ==resp1.name
      })
      if(x[0])datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica4Top_2=datosGrafica1

    datosGrafica1=[]
    this.datosGrafica4Top_2.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv4_2.length>0){
        this.selectEv4_2.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['value']
          });
          if(x[0]){randomEv1CopySeries.push(x[0])}
          else{randomEv1CopySeries.push({name:element2['value'],value:0})}
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica4Top_2=datosGrafica1
  }

  if(this.selectEv4_2.length>0 && this.selectDiv4_2.length==0){
    let total:string=(this.selectPais5_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen5_2
    if((this.selectPais5_2=='Corona Total' && (!this.selectedDivisionResumen5_2 || this.selectedDivisionResumen5_2.length==0))|| (this.selectPais5_2!='Corona Total' && (!this.LocalidadSelect5_2 || this.LocalidadSelect5_2.length==0)))
    this.datosGrafica4_2=this.contTotal(this.datosGrafica4_2,total)
    datosGrafica1=[]
    this.datosGrafica4_2.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv4_2.length>0){
        this.selectEv4_2.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['value']
          });
          if(x[0]){randomEv1CopySeries.push(x[0])}
          else{randomEv1CopySeries.push({name:element2['value'],value:0})}
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries)datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    
    this.datosGrafica4Top_2=datosGrafica1
  }

  if(this.selectEv4_2.length==0 && this.selectDiv4_2.length==0){
    let total:string=(this.selectPais5_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen5_2
    if((this.selectPais5_2=='Corona Total' && (!this.selectedDivisionResumen5_2 || this.selectedDivisionResumen5_2.length==0))|| (this.selectPais5_2!='Corona Total' && (!this.LocalidadSelect5_2 || this.LocalidadSelect5_2.length==0)))
    this.datosGrafica4_2=this.contTotal(this.datosGrafica4_2,total)
    this.datosGrafica4_2=this.organizarDatosMayorMenor(this.datosGrafica4_2)
    this.datosGrafica4Top_2=this.top(this.datosGrafica4_2,5)
  }

  this.flagevent4_2=true
}

DatosGrafica4_2(){
  let flagCoronaTotal:boolean=false
      if(this.selectPais5_2){
        if(this.selectPais5_2=='Corona Total')flagCoronaTotal=true
        else flagCoronaTotal=false
      }else flagCoronaTotal=false

  this.CaracterizacionView5_2=this.CaracterizacionView.map((e:any)=>e)

  this.reinciarVariable_2()

  if(this.selectYear4_2){
    this.CaracterizacionView5_2=this.CaracterizacionView5_2.filter((resp:any)=>{
      return new Date(resp.fechaaccidente).getFullYear()==this.selectYear4_2
      })
  }

  if(this.selectMonth4_2.length>0){
    let CaracterizacionView5:any=[]
    let CaracterizacionView5_1:any=[]
    this.selectMonth4_2.forEach(ele=>{
      CaracterizacionView5=this.CaracterizacionView5_2.filter((resp:any)=>{
        return new Date(resp.fechaaccidente).getMonth()==ele.code
      })
      CaracterizacionView5.forEach((resp2:any)=>{
        CaracterizacionView5_1.push(resp2)
      })
    })
    this.CaracterizacionView5_2=CaracterizacionView5_1
  }
  //nuevo
  let reportesAtCopyDiv: any[]=[]
  if(this.selectPais5_2)if(this.selectPais5_2!='Corona Total')this.CaracterizacionView5_2 = this.CaracterizacionView5_2.filter((at:any) => at.pais == this.selectPais5_2);
  if(!flagCoronaTotal)if(this.selectedDivisionResumen5_2)this.CaracterizacionView5_2= this.CaracterizacionView5_2.filter((at:any) => at.padrenombre == this.selectedDivisionResumen5_2);
  if(flagCoronaTotal)if(this.selectedDivisionResumen5_2)if(this.selectedDivisionResumen5_2.length>0){
    reportesAtCopyDiv=[]
    this.selectedDivisionResumen5_2.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView5_2.filter((at:any) => at.padrenombre == element));
    });
    this.CaracterizacionView5_2=[...reportesAtCopyDiv]
  }
  if(this.LocalidadSelect5_2)if(this.LocalidadSelect5_2.length>0){
    reportesAtCopyDiv=[]
    this.LocalidadSelect5_2.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView5_2.filter((at:any) => at.nombreLocalidad == element));
    });
    this.CaracterizacionView5_2=[...reportesAtCopyDiv]
  }
  //fin nuevo

  this.CaracterizacionView5_2.forEach((element:any) => {
    if(this.radioGra4_2==0)this.ContDatosGraf4_2(element)
    if(this.radioGra4_2==1 && element.emptemporal!=null)this.ContDatosGraf4_2(element)
    if(this.radioGra4_2==2 && element.emptemporal==null)this.ContDatosGraf4_2(element)
  });

  this.graf4top5_2()
  let total:string=(this.selectPais5_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen5_2
  if((this.selectPais5_2=='Corona Total' && (!this.selectedDivisionResumen5_2 || this.selectedDivisionResumen5_2.length==0))|| (this.selectPais5_2!='Corona Total' && (!this.LocalidadSelect5_2 || this.LocalidadSelect5_2.length==0)))
  this.datosGrafica4_2=this.contTotal(this.datosGrafica4_2,total)
  this.datosGrafica4_2=this.organizarDatosMayorMenor(this.datosGrafica4_2)

  this.datosGrafica4Top_2=this.top(this.datosGrafica4_2,5)
}

tipoAccidente_2=[]
lugarAccidente_2=[]
agente_2=[]
mecanismo_2=[]
parteCuerpo_2=[]
tipoLesion_2=[]
labelGraf4_2:string="Tipo de accidente"

graf4top5_2(){

  this.flagevent4_2=false

  this.datosGrafica4_2=[]

  if(this.radioGra4_1_2==0){
    this.labelGraf4_2="Tipo de accidente"
    
    this.filtroEventos4_2=this.tipoaccidenteList

    this.datosGrafica4_2=[]

    let datoGrafica:any=[]
    let list = (this.selectPais5_2=='Corona Total')?this.divisionList5_2:this.localidadesList5_2

    list.forEach((element:any) => {
      if(this.grafTipoAccLocalidades_2.hasOwnProperty(element.label)){
        if(Object.keys(this.grafTipoAccLocalidades_2[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.grafTipoAccLocalidades_2[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.grafTipoAccLocalidades_2[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica4_2=datoGrafica.map((e:any)=>e)
  }

  if(this.radioGra4_1_2==1){
    this.labelGraf4_2="Lugar del accidente"
    this.filtroEventos4_2=this.sitioaccidenteList


    this.datosGrafica4_2=[]

    let datoGrafica:any=[]
    let list = (this.selectPais5_2=='Corona Total')?this.divisionList5_2:this.localidadesList5_2

    list.forEach((element:any) => {
      if(this.grafLugarAccLocalidades_2.hasOwnProperty(element.label)){
        if(Object.keys(this.grafLugarAccLocalidades_2[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.grafLugarAccLocalidades_2[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.grafLugarAccLocalidades_2[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica4_2=datoGrafica.map((e:any)=>e)
  }

  if(this.radioGra4_1_2==2){
    this.labelGraf4_2="Agente"
    this.filtroEventos4_2=this.agenteList

    this.datosGrafica4_2=[]

    let datoGrafica:any=[]
    let list = (this.selectPais5_2=='Corona Total')?this.divisionList5_2:this.localidadesList5_2

    list.forEach((element:any) => {
      if(this.grafAgenteLocalidades_2.hasOwnProperty(element.label)){
        if(Object.keys(this.grafAgenteLocalidades_2[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.grafAgenteLocalidades_2[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.grafAgenteLocalidades_2[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica4_2=datoGrafica.map((e:any)=>e)
  }

  if(this.radioGra4_1_2==3){
    this.labelGraf4_2="Mecanismo"
    this.filtroEventos4_2=this.mecanismoList

    this.datosGrafica4_2=[]

    let datoGrafica:any=[]
    let list = (this.selectPais5_2=='Corona Total')?this.divisionList5_2:this.localidadesList5_2

    list.forEach((element:any) => {
      if(this.grafMecanismoAccLocalidades_2.hasOwnProperty(element.label)){
        if(Object.keys(this.grafMecanismoAccLocalidades_2[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.grafMecanismoAccLocalidades_2[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.grafMecanismoAccLocalidades_2[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica4_2=datoGrafica.map((e:any)=>e)
  }

  if(this.radioGra4_1_2==4){
    this.labelGraf4_2="Parte del cuerpo"
    this.filtroEventos4_2=this.partecuerpoList

    this.datosGrafica4_2=[]

    let datoGrafica:any=[]
    let list = (this.selectPais5_2=='Corona Total')?this.divisionList5_2:this.localidadesList5_2

    list.forEach((element:any) => {
      if(this.grafParteCuerpLocalidades_2.hasOwnProperty(element.label)){
        if(Object.keys(this.grafParteCuerpLocalidades_2[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.grafParteCuerpLocalidades_2[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.grafParteCuerpLocalidades_2[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica4_2=datoGrafica.map((e:any)=>e)
  }

  if(this.radioGra4_1_2==5){
    this.labelGraf4_2="Tipo de lesión"
    this.filtroEventos4_2=this.tipolesionList

    this.datosGrafica4_2=[]

    let datoGrafica:any=[]
    let list = (this.selectPais5_2=='Corona Total')?this.divisionList5_2:this.localidadesList5_2

    list.forEach((element:any) => {
      if(this.grafTipoLesLocalidades_2.hasOwnProperty(element.label)){
        if(Object.keys(this.grafTipoLesLocalidades_2[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.grafTipoLesLocalidades_2[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.grafTipoLesLocalidades_2[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica4_2=datoGrafica.map((e:any)=>e)
  }
  
  this.flagevent4_2=true
  
}


grafTipoAccLocalidades_2:any[]=[]
grafLugarAccLocalidades_2:any[]=[]
grafAgenteLocalidades_2:any[]=[]
grafMecanismoAccLocalidades_2:any[]=[]
grafParteCuerpLocalidades_2:any[]=[]
grafTipoLesLocalidades_2:any[]=[]

ContDatosGraf4_2(element:any){

  // let nombreLocalidad = element.nombreLocalidad
  let nombreLocalidad = (this.selectPais5_2=='Corona Total')?element.padrenombre:element.nombreLocalidad

  let tipoAccLocalidad = element.tipoaccidente
  let lugarAccLocalidad = element.sitio
  let agenteLocalidad = element.agente
  let mecanismoAccLocalidad = element.mecanismo
  let parteCuerpLocalidad = element.partecuerpo
  let tipoLesLocalidad = element.tipolesion

  if(nombreLocalidad && tipoAccLocalidad){
    if (this.grafTipoAccLocalidades_2.hasOwnProperty(nombreLocalidad)) {
      if (this.grafTipoAccLocalidades_2[nombreLocalidad].hasOwnProperty(tipoAccLocalidad)) {
        this.grafTipoAccLocalidades_2[nombreLocalidad][tipoAccLocalidad] += 1;
      } else {
        this.grafTipoAccLocalidades_2[nombreLocalidad][tipoAccLocalidad] = 1;
      }
    } else {
      this.grafTipoAccLocalidades_2[nombreLocalidad] = {};
      this.grafTipoAccLocalidades_2[nombreLocalidad][tipoAccLocalidad] = 1;
    }
  }

  if(nombreLocalidad && lugarAccLocalidad){
    if (this.grafLugarAccLocalidades_2.hasOwnProperty(nombreLocalidad)) {
      if (this.grafLugarAccLocalidades_2[nombreLocalidad].hasOwnProperty(lugarAccLocalidad)) {
        this.grafLugarAccLocalidades_2[nombreLocalidad][lugarAccLocalidad] += 1;
      } else {
        this.grafLugarAccLocalidades_2[nombreLocalidad][lugarAccLocalidad] = 1;
      }
    } else {
      this.grafLugarAccLocalidades_2[nombreLocalidad] = {};
      this.grafLugarAccLocalidades_2[nombreLocalidad][lugarAccLocalidad] = 1;
    }
  }

  if(nombreLocalidad && agenteLocalidad){
    if (this.grafAgenteLocalidades_2.hasOwnProperty(nombreLocalidad)) {
      if (this.grafAgenteLocalidades_2[nombreLocalidad].hasOwnProperty(agenteLocalidad)) {
        this.grafAgenteLocalidades_2[nombreLocalidad][agenteLocalidad] += 1;
      } else {
        this.grafAgenteLocalidades_2[nombreLocalidad][agenteLocalidad] = 1;
      }
    } else {
      this.grafAgenteLocalidades_2[nombreLocalidad] = {};
      this.grafAgenteLocalidades_2[nombreLocalidad][agenteLocalidad] = 1;
    }
  }

  if(nombreLocalidad && mecanismoAccLocalidad){
    if (this.grafMecanismoAccLocalidades_2.hasOwnProperty(nombreLocalidad)) {
      if (this.grafMecanismoAccLocalidades_2[nombreLocalidad].hasOwnProperty(mecanismoAccLocalidad)) {
        this.grafMecanismoAccLocalidades_2[nombreLocalidad][mecanismoAccLocalidad] += 1;
      } else {
        this.grafMecanismoAccLocalidades_2[nombreLocalidad][mecanismoAccLocalidad] = 1;
      }
    } else {
      this.grafMecanismoAccLocalidades_2[nombreLocalidad] = {};
      this.grafMecanismoAccLocalidades_2[nombreLocalidad][mecanismoAccLocalidad] = 1;
    }
  }

  if(nombreLocalidad && parteCuerpLocalidad){
    if (this.grafParteCuerpLocalidades_2.hasOwnProperty(nombreLocalidad)) {
      if (this.grafParteCuerpLocalidades_2[nombreLocalidad].hasOwnProperty(parteCuerpLocalidad)) {
        this.grafParteCuerpLocalidades_2[nombreLocalidad][parteCuerpLocalidad] += 1;
      } else {
        this.grafParteCuerpLocalidades_2[nombreLocalidad][parteCuerpLocalidad] = 1;
      }
    } else {
      this.grafParteCuerpLocalidades_2[nombreLocalidad] = {};
      this.grafParteCuerpLocalidades_2[nombreLocalidad][parteCuerpLocalidad] = 1;
    }
  }

  if(nombreLocalidad && tipoLesLocalidad){
    if (this.grafTipoLesLocalidades_2.hasOwnProperty(nombreLocalidad)) {
      if (this.grafTipoLesLocalidades_2[nombreLocalidad].hasOwnProperty(tipoLesLocalidad)) {
        this.grafTipoLesLocalidades_2[nombreLocalidad][tipoLesLocalidad] += 1;
      } else {
        this.grafTipoLesLocalidades_2[nombreLocalidad][tipoLesLocalidad] = 1;
      }
    } else {
      this.grafTipoLesLocalidades_2[nombreLocalidad] = {};
      this.grafTipoLesLocalidades_2[nombreLocalidad][tipoLesLocalidad] = 1;
    }
  }
}
reinciarVariable4_1_2(){
  this.selectEv4_2=[]
  this.selectDiv4_2=[]

  this.DatosGrafica4_2()
}
reinciarVariable_2(){
  this.grafTipoAccLocalidades_2=[]
  this.grafLugarAccLocalidades_2=[]
  this.grafAgenteLocalidades_2=[]
  this.grafMecanismoAccLocalidades_2=[]
  this.grafParteCuerpLocalidades_2=[]
  this.grafTipoLesLocalidades_2=[]

}


//////////quinta grafica///////////////////

filtroGraEve5(){
  this.DatosGrafica5()
  this.flagevent5=false
  let datosGrafica1:any=[]

  if(this.selectDiv5.length==0 && this.selectEv5.length==0){
    this.datosGrafica5Top=this.top(this.datosGrafica5,5)
  }

  if(this.selectDiv5.length>0 && this.selectEv5.length==0){
    this.selectDiv5.forEach(resp1=>{
      let x=this.datosGrafica5.filter((resp:any)=>{
        return resp.name ==resp1.label
      })
      if(x[0])datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica5Top=datosGrafica1
  }

  if(this.selectDiv5.length==0 && this.selectEv5.length>0){
    datosGrafica1=[]
    this.datosGrafica5.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv5.length>0){
        this.selectEv5.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['label']
          });
          if(x[0])randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica5Top=datosGrafica1
  }
  
  if(this.selectDiv5.length>0 && this.selectEv5.length>0){
    this.selectDiv5.forEach(resp1=>{
      let x=this.datosGrafica5.filter((resp:any)=>{
        return resp.name ==resp1.label
      })
      if(x[0])datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica5Top=datosGrafica1

    datosGrafica1=[]
    this.datosGrafica5Top.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv5.length>0){
        this.selectEv5.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['label']
          });
          if(x[0])randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica5Top=datosGrafica1
  }

  this.flagevent5=true

}
resetvariable5_1(){
  this.selectDiv5=[]
  this.selectEv5=[]
  this.DatosGrafica5()
}
resetvariables5(){
  this.contGrafTipoPeligros=[]

}
DatosGrafica5(){
  let flagCoronaTotal:boolean=false
      if(this.selectPais6){
        if(this.selectPais6=='Corona Total')flagCoronaTotal=true
        else flagCoronaTotal=false
      }else flagCoronaTotal=false

  this.resetvariables5()
  this.CaracterizacionView6=this.CaracterizacionView.map((e:any)=>e)

  if(this.date9 && !this.date10)
  this.CaracterizacionView6=this.CaracterizacionView.filter((resp:any)=>{
  return resp.fechaaccidente>=new Date(this.date9!)
  })

if(!this.date9 && this.date10){
  let date10:Date=new Date(new Date(this.date10).setMonth(new Date(this.date10).getMonth()+1))
  this.CaracterizacionView6=this.CaracterizacionView.filter((resp:any)=>{
    return resp.fechaaccidente< date10;
    })
  }

if(this.date9 && this.date10){
  let date10:Date=new Date(new Date(this.date10).setMonth(new Date(this.date10).getMonth()+1))
  this.CaracterizacionView6=this.CaracterizacionView.filter((resp:any)=>{
    return resp.fechaaccidente<date10 && resp.fechaaccidente>=new Date(this.date9!)
    })}

    //nuevo
  let reportesAtCopyDiv: any[]=[]
  if(this.selectPais6)if(this.selectPais6!='Corona Total')this.CaracterizacionView6 = this.CaracterizacionView6.filter((at:any) => at.pais == this.selectPais6);
  if(!flagCoronaTotal)if(this.selectedDivisionResumen6)this.CaracterizacionView6= this.CaracterizacionView6.filter((at:any) => at.padrenombre == this.selectedDivisionResumen6);
  if(flagCoronaTotal)if(this.selectedDivisionResumen6)if(this.selectedDivisionResumen6.length>0){
    reportesAtCopyDiv=[]
    this.selectedDivisionResumen6.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView6.filter((at:any) => at.padrenombre == element));
    });
    this.CaracterizacionView6=[...reportesAtCopyDiv]
  }
  if(this.LocalidadSelect6)if(this.LocalidadSelect6.length>0){
    reportesAtCopyDiv=[]
    this.LocalidadSelect6.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView6.filter((at:any) => at.nombreLocalidad == element));
    });
    this.CaracterizacionView6=[...reportesAtCopyDiv]
  }
  //fin nuevo

  this.CaracterizacionView6.forEach((element:any) => {
    if(this.radioGra5==0)this.ContDatosGraf5(element)
    if(this.radioGra5==1 && element.emptemporal!=null)this.ContDatosGraf5(element)
    if(this.radioGra5==2 && element.emptemporal==null)this.ContDatosGraf5(element)
  });
  this.quintaGrafica()
  let total:string=(this.selectPais6=='Corona Total')?'Corona Total':this.selectedDivisionResumen6
  if((this.selectPais6=='Corona Total' && (!this.selectedDivisionResumen6 || this.selectedDivisionResumen6.length==0))|| (this.selectPais6!='Corona Total' && (!this.LocalidadSelect6 || this.LocalidadSelect6.length==0)))
  this.datosGrafica5=this.contTotal(this.datosGrafica5,total)
  this.datosGrafica5=this.organizarDatosMayorMenor(this.datosGrafica5)
  this.datosGrafica5Top=this.top(this.datosGrafica5,5)
}

contGrafTipoPeligros:any[]=[]
ContDatosGraf5(element:any){
  
  let peligro=JSON.parse(element.peligro);

  let nombreLocalidad = (this.selectPais6=='Corona Total')?element.padrenombre:element.nombreLocalidad
  // let nombreLocalidad = element.nombreLocalidad

  if(nombreLocalidad && peligro){
    if (this.contGrafTipoPeligros.hasOwnProperty(nombreLocalidad)) {
      if (this.contGrafTipoPeligros[nombreLocalidad].hasOwnProperty(peligro.nombre)) {
        this.contGrafTipoPeligros[nombreLocalidad][peligro.nombre] += 1;
      } else {
        this.contGrafTipoPeligros[nombreLocalidad][peligro.nombre] = 1;
      }
    } else {
      this.contGrafTipoPeligros[nombreLocalidad] = {};
      this.contGrafTipoPeligros[nombreLocalidad][peligro.nombre] = 1;
    }
  }

}

quintaGrafica(){
  this.flagevent5=false

  this.datosGrafica5=[]

  let datoGrafica:any=[]

  let list = (this.selectPais6=='Corona Total')?this.divisionList6:this.localidadesList6
  list.forEach((element:any) => {
    if(this.contGrafTipoPeligros.hasOwnProperty(element.label)){
      if(Object.keys(this.contGrafTipoPeligros[element.label]).length>0){
        let datoSeries:any=[]
        Object.keys(this.contGrafTipoPeligros[element.label]).forEach((clave:any) => {
          datoSeries.push({name:clave,value:this.contGrafTipoPeligros[element.label][clave]})
        });   
        datoSeries=this.order(datoSeries)
        datoGrafica.push({name:element.label,series:datoSeries})   
      }
    }
  });
  this.datosGrafica5=datoGrafica.map((e:any)=>e)

  this.flagevent5=true
}

//////////quinta grafica comparativa///////////////////

filtroGraEve5_2(){
  this.DatosGrafica5_2()
  this.flagevent5_2=false
  let datosGrafica1:any=[]

  if(this.selectDiv5_2.length==0 && this.selectEv5_2.length==0){
    this.datosGrafica5Top_2=this.top(this.datosGrafica5_2,5)
  }

  if(this.selectDiv5_2.length>0 && this.selectEv5_2.length==0){
    this.selectDiv5_2.forEach(resp1=>{
      let x=this.datosGrafica5_2.filter((resp:any)=>{
        return resp.name ==resp1.label
      })
      if(x[0])datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica5Top_2=datosGrafica1
  }

  if(this.selectDiv5_2.length==0 && this.selectEv5_2.length>0){
    datosGrafica1=[]
    this.datosGrafica5_2.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv5_2.length>0){
        this.selectEv5_2.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['label']
          });
          if(x[0])randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica5Top_2=datosGrafica1
  }
  
  if(this.selectDiv5_2.length>0 && this.selectEv5_2.length>0){
    this.selectDiv5_2.forEach(resp1=>{
      let x=this.datosGrafica5_2.filter((resp:any)=>{
        return resp.name ==resp1.label
      })
      if(x[0])datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica5Top_2=datosGrafica1

    datosGrafica1=[]
    this.datosGrafica5Top_2.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv5_2.length>0){
        this.selectEv5_2.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['label']
          });
          if(x[0])randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica5Top_2=datosGrafica1
  }

  this.flagevent5_2=true

}
resetvariable5_1_2(){
  this.selectDiv5_2=[]
  this.selectEv5_2=[]
  this.DatosGrafica5_2()
}
resetvariables5_2(){
  this.contGrafTipoPeligros_2=[]
}
DatosGrafica5_2(){
  let flagCoronaTotal:boolean=false
      if(this.selectPais6_2){
        if(this.selectPais6_2=='Corona Total')flagCoronaTotal=true
        else flagCoronaTotal=false
      }else flagCoronaTotal=false

  this.resetvariables5_2()
  this.CaracterizacionView6_2=this.CaracterizacionView.map((e:any)=>e)

  if(this.date9_2 && !this.date10_2)
  this.CaracterizacionView6_2=this.CaracterizacionView.filter((resp:any)=>{
  return resp.fechaaccidente>=new Date(this.date9_2!)
  })

if(!this.date9_2 && this.date10_2){
  let date10:Date=new Date(new Date(this.date10_2).setMonth(new Date(this.date10_2).getMonth()+1))
  this.CaracterizacionView6_2=this.CaracterizacionView.filter((resp:any)=>{
    return resp.fechaaccidente< date10;
    })
  }

if(this.date9_2 && this.date10_2){
  let date10:Date=new Date(new Date(this.date10_2).setMonth(new Date(this.date10_2).getMonth()+1))
  this.CaracterizacionView6_2=this.CaracterizacionView.filter((resp:any)=>{
    return resp.fechaaccidente<date10 && resp.fechaaccidente>=new Date(this.date9_2!)
    })}
  //nuevo
  let reportesAtCopyDiv: any[]=[]
  if(this.selectPais6_2)if(this.selectPais6_2!='Corona Total')this.CaracterizacionView6_2 = this.CaracterizacionView6_2.filter((at:any) => at.pais == this.selectPais6_2);
  if(!flagCoronaTotal)if(this.selectedDivisionResumen6_2)this.CaracterizacionView6_2= this.CaracterizacionView6_2.filter((at:any) => at.padrenombre == this.selectedDivisionResumen6_2);
  if(flagCoronaTotal)if(this.selectedDivisionResumen6_2)if(this.selectedDivisionResumen6_2.length>0){
    reportesAtCopyDiv=[]
    this.selectedDivisionResumen6_2.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView6_2.filter((at:any) => at.padrenombre == element));
    });
    this.CaracterizacionView6_2=[...reportesAtCopyDiv]
  }
  if(this.LocalidadSelect6_2)if(this.LocalidadSelect6_2.length>0){
    reportesAtCopyDiv=[]
    this.LocalidadSelect6_2.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView6_2.filter((at:any) => at.nombreLocalidad == element));
    });
    this.CaracterizacionView6_2=[...reportesAtCopyDiv]
  }
  //fin nuevo
  this.CaracterizacionView6_2.forEach((element:any) => {
    if(this.radioGra5_2==0)this.ContDatosGraf5_2(element)
    if(this.radioGra5_2==1 && element.emptemporal!=null)this.ContDatosGraf5_2(element)
    if(this.radioGra5_2==2 && element.emptemporal==null)this.ContDatosGraf5_2(element)
  });
  this.quintaGrafica_2()
  let total:string=(this.selectPais6_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen6_2
  if((this.selectPais6_2=='Corona Total' && (!this.selectedDivisionResumen6_2 || this.selectedDivisionResumen6_2.length==0))|| (this.selectPais6_2!='Corona Total' && (!this.LocalidadSelect6_2 || this.LocalidadSelect6_2.length==0)))
  this.datosGrafica5_2=this.contTotal(this.datosGrafica5_2,total)
  this.datosGrafica5_2=this.organizarDatosMayorMenor(this.datosGrafica5_2)
  this.datosGrafica5Top_2=this.top(this.datosGrafica5_2,5)
}

contGrafTipoPeligros_2:any[]=[]
ContDatosGraf5_2(element:any){
  
  let peligro=JSON.parse(element.peligro);

  // let nombreLocalidad = element.nombreLocalidad

  let nombreLocalidad = (this.selectPais6_2=='Corona Total')?element.padrenombre:element.nombreLocalidad


  if(nombreLocalidad && peligro){
    if (this.contGrafTipoPeligros_2.hasOwnProperty(nombreLocalidad)) {
      if (this.contGrafTipoPeligros_2[nombreLocalidad].hasOwnProperty(peligro.nombre)) {
        this.contGrafTipoPeligros_2[nombreLocalidad][peligro.nombre] += 1;
      } else {
        this.contGrafTipoPeligros_2[nombreLocalidad][peligro.nombre] = 1;
      }
    } else {
      this.contGrafTipoPeligros_2[nombreLocalidad] = {};
      this.contGrafTipoPeligros_2[nombreLocalidad][peligro.nombre] = 1;
    }
  }

}

quintaGrafica_2(){
  this.flagevent5_2=false

  this.datosGrafica5_2=[]

  let datoGrafica:any=[]

  let list = (this.selectPais6_2=='Corona Total')?this.divisionList6_2:this.localidadesList6_2

  list.forEach((element:any) => {
    if(this.contGrafTipoPeligros_2.hasOwnProperty(element.label)){
      if(Object.keys(this.contGrafTipoPeligros_2[element.label]).length>0){
        let datoSeries:any=[]
        Object.keys(this.contGrafTipoPeligros_2[element.label]).forEach((clave:any) => {
          datoSeries.push({name:clave,value:this.contGrafTipoPeligros_2[element.label][clave]})
        });   
        datoSeries=this.order(datoSeries)
        datoGrafica.push({name:element.label,series:datoSeries})   
      }
    }
  });
  this.datosGrafica5_2=datoGrafica.map((e:any)=>e)

  this.flagevent5_2=true
}



///////////////sexta grafica/////////////
graf6_1:any=[]
graf6_2:any=[]
graf6_3:any=[]
graf6_4:any=[]
graf6_5:any=[]
graf6_6:any=[]
graf6_7:any=[]

filtroGraEve6(){
  this.DatosGrafica6()
  this.flagevent6=false
  let datosGrafica1:any=[]

  if(this.selectDiv6.length==0 && this.selectEv6.length==0){
    // if(this.selectPais7!='Corona Total')this.datosGrafica6=this.contTotal(this.datosGrafica6)
    this.datosGrafica6Top=this.top(this.datosGrafica6,5)
  }

  if(this.selectDiv6.length>0 && this.selectEv6.length==0){
    this.selectDiv6.forEach(resp1=>{
      let x=this.datosGrafica6.filter((resp:any)=>{
        return resp.name ==resp1.name
      })
      datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica6Top=datosGrafica1
  }

  if(this.selectDiv6.length==0 && this.selectEv6.length>0){
    datosGrafica1=[]
    this.datosGrafica6.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv6.length>0){
        this.selectEv6.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['label']
          });
          if(x[0])randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica6Top=datosGrafica1
  }
  
  if(this.selectDiv6.length>0 && this.selectEv6.length>0){
    this.selectDiv6.forEach(resp1=>{
      let x=this.datosGrafica6.filter((resp:any)=>{
        return resp.name ==resp1.name
      })
      if(x[0])datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica6Top=datosGrafica1

    datosGrafica1=[]
    this.datosGrafica6Top.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv6.length>0){
        this.selectEv6.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['label']
          });
          if(x[0])randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica6Top=datosGrafica1
  }

  this.flagevent6=true

}
resetTipoPeligros6(){
  this.selectTipoPeligro6=[];
  this.resetVar6();
}
resetVar6(){
  this.contGrafPeligros=[]
  this.selectPel6Flag=false
  this.selectEv6=[]
  this.selectDiv6=[]
  this.DatosGrafica6()
}
DatosGrafica6(){
  let flagCoronaTotal:boolean=false
  if(this.selectPais7){
    if(this.selectPais7=='Corona Total')flagCoronaTotal=true
    else flagCoronaTotal=false
  }else flagCoronaTotal=false

  this.flagevent6=false
  this.graf6_1=[]
  this.graf6_2=[]
  this.graf6_3=[]
  this.graf6_4=[]
  this.graf6_5=[]
  this.graf6_6=[]
  this.graf6_7=[]

  this.CaracterizacionView7=this.CaracterizacionView.map((e:any)=>e)

  if(this.selectYear6){
    this.CaracterizacionView7=this.CaracterizacionView7.filter((resp:any)=>{
      return new Date(resp.fechaaccidente).getFullYear()==this.selectYear6
      })
  }

  if(this.selectMonth6.length>0){
    let CaracterizacionView7:any=[]
    let CaracterizacionView7_1:any=[]
    this.selectMonth6.forEach(ele=>{
      CaracterizacionView7=this.CaracterizacionView7.filter((resp:any)=>{
        return new Date(resp.fechaaccidente).getMonth()==ele.code
      })
      CaracterizacionView7.forEach((resp2:any)=>{
        CaracterizacionView7_1.push(resp2)
      })
    })
    this.CaracterizacionView7=CaracterizacionView7_1
  }

   //nuevo
   let reportesAtCopyDiv: any[]=[]
   if(this.selectPais7)if(this.selectPais7!='Corona Total')this.CaracterizacionView7 = this.CaracterizacionView7.filter((at:any) => at.pais == this.selectPais7);
   if(!flagCoronaTotal)if(this.selectedDivisionResumen7)this.CaracterizacionView7= this.CaracterizacionView7.filter((at:any) => at.padrenombre == this.selectedDivisionResumen7);
   if(flagCoronaTotal)if(this.selectedDivisionResumen7)if(this.selectedDivisionResumen7.length>0){
    reportesAtCopyDiv=[]
    this.selectedDivisionResumen7.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView7.filter((at:any) => at.padrenombre == element));
    });
    this.CaracterizacionView7=[...reportesAtCopyDiv]
  }
   if(this.LocalidadSelect7)if(this.LocalidadSelect7.length>0){
     reportesAtCopyDiv=[]
     this.LocalidadSelect7.forEach((element:any) => {
       reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView7.filter((at:any) => at.nombreLocalidad == element));
     });
     this.CaracterizacionView7=[...reportesAtCopyDiv]
   }
   //fin nuevo
   if(this.selectTipoPeligro6.hasOwnProperty('nombre')){
    if(this.selectTipoPeligro6.nombre){
      this.CaracterizacionView7 = this.CaracterizacionView7.filter((at:any) => at.peligro !=null).filter((at:any) => JSON.parse(at.peligro).nombre == this.selectTipoPeligro6.nombre);
    }
   }
   
  this.peligroItemList2.forEach((ele:any) => {
    this.graf6_1.push({name:ele.label,value:0})
    this.graf6_2.push({name:ele.label,value:0})
    this.graf6_3.push({name:ele.label,value:0})
    this.graf6_4.push({name:ele.label,value:0})
    this.graf6_5.push({name:ele.label,value:0})
    this.graf6_6.push({name:ele.label,value:0})
    this.graf6_7.push({name:ele.label,value:0})
  });
  this.contGrafPeligros=[]
  this.CaracterizacionView7.forEach((element:any) => {
    if(this.radioGra6==0)this.ContDatosGraf6(element)
    if(this.radioGra6==1 && element.emptemporal!=null)this.ContDatosGraf6(element)
    if(this.radioGra6==2 && element.emptemporal==null)this.ContDatosGraf6(element)
  });

  this.sextaGrafica()
  let total:string=(this.selectPais7=='Corona Total')?'Corona Total':this.selectedDivisionResumen7
  if((this.selectPais7=='Corona Total' && (!this.selectedDivisionResumen7 || this.selectedDivisionResumen7.length==0))|| (this.selectPais7!='Corona Total' && (!this.LocalidadSelect7 || this.LocalidadSelect7.length==0)))
  this.datosGrafica6=this.contTotal(this.datosGrafica6,total)
  this.datosGrafica6=this.organizarDatosMayorMenor(this.datosGrafica6)

  this.datosGrafica6Top=this.top(this.datosGrafica6,5)
  this.flagevent6=true
}
contGrafPeligros:any[]=[]
  ContDatosGraf6(element:any){
    let descripcionpeligro=JSON.parse(element.descripcionpeligro)
    if(descripcionpeligro)descripcionpeligro=descripcionpeligro.nombre

    let nombreLocalidad = (this.selectPais7=='Corona Total')?element.padrenombre:element.nombreLocalidad

    // let nombreLocalidad = element.nombreLocalidad

    if(nombreLocalidad && descripcionpeligro){
      if (this.contGrafPeligros.hasOwnProperty(nombreLocalidad)) {
        if (this.contGrafPeligros[nombreLocalidad].hasOwnProperty(descripcionpeligro)) {
          this.contGrafPeligros[nombreLocalidad][descripcionpeligro] += 1;
        } else {
          this.contGrafPeligros[nombreLocalidad][descripcionpeligro] = 1;
        }
      } else {
        this.contGrafPeligros[nombreLocalidad] = {};
        this.contGrafPeligros[nombreLocalidad][descripcionpeligro] = 1;
      }
    }
  }

  sextaGrafica(){
    this.datosGrafica6=[]

    let datoGrafica:any=[]

    let list = (this.selectPais7=='Corona Total')?this.divisionList7:this.localidadesList7

    list.forEach((element:any) => {
      if(this.contGrafPeligros.hasOwnProperty(element.label)){
        if(Object.keys(this.contGrafPeligros[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.contGrafPeligros[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.contGrafPeligros[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica6=datoGrafica.map((e:any)=>e)  
  }
 

 ///////////////sexta grafica comparativa/////////////
graf6_1_2:any=[]
graf6_2_2:any=[]
graf6_3_2:any=[]
graf6_4_2:any=[]
graf6_5_2:any=[]
graf6_6_2:any=[]
graf6_7_2:any=[]

filtroGraEve6_2(){
  this.DatosGrafica6_2()
  this.flagevent6_2=false
  let datosGrafica1:any=[]

  if(this.selectDiv6_2.length==0 && this.selectEv6_2.length==0){
    this.datosGrafica6Top_2=this.top(this.datosGrafica6_2,5)
  }

  if(this.selectDiv6_2.length>0 && this.selectEv6_2.length==0){
    this.selectDiv6_2.forEach(resp1=>{
      let x=this.datosGrafica6_2.filter((resp:any)=>{
        return resp.name ==resp1.name
      })
      datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica6Top_2=datosGrafica1
  }

  if(this.selectDiv6_2.length==0 && this.selectEv6_2.length>0){
    datosGrafica1=[]
    this.datosGrafica6_2.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv6_2.length>0){
        this.selectEv6_2.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['label']
          });
          if(x[0])randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica6Top_2=datosGrafica1
  }
  
  if(this.selectDiv6_2.length>0 && this.selectEv6_2.length>0){
    this.selectDiv6_2.forEach(resp1=>{
      let x=this.datosGrafica6_2.filter((resp:any)=>{
        return resp.name ==resp1.name
      })
      if(x[0])datosGrafica1.push(x[0])
    }
    )
    this.datosGrafica6Top_2=datosGrafica1

    datosGrafica1=[]
    this.datosGrafica6Top_2.forEach((element:any) => {
      let randomEv1CopySeries=[]

      if(this.selectEv6_2.length>0){
        this.selectEv6_2.forEach(element2 => {
          let x = element['series'].filter((word:any) => {
            return word['name']==element2['label']
          });
          if(x[0])randomEv1CopySeries.push(x[0])
        });
      }else{
        randomEv1CopySeries=element['series']
      }
      if(randomEv1CopySeries[0])
      datosGrafica1.push({name:element['name'],series:randomEv1CopySeries})
    });
    this.datosGrafica6Top_2=datosGrafica1
  }

  this.flagevent6_2=true

}
resetTipoPeligros6_2(){
  this.selectTipoPeligro6_2=[];
  this.resetVar6_2();
}
resetVar6_2(){
  this.contGrafPeligros_2=[]
  this.selectPel6Flag_2=false
  this.selectEv6_2=[]
  this.selectDiv6_2=[]
  this.DatosGrafica6_2()
}
DatosGrafica6_2(){
  let flagCoronaTotal:boolean=false
  if(this.selectPais7_2){
    if(this.selectPais7_2=='Corona Total')flagCoronaTotal=true
    else flagCoronaTotal=false
  }else flagCoronaTotal=false

  this.flagevent6_2=false
  this.graf6_1_2=[]
  this.graf6_2_2=[]
  this.graf6_3_2=[]
  this.graf6_4_2=[]
  this.graf6_5_2=[]
  this.graf6_6_2=[]
  this.graf6_7_2=[]

  this.CaracterizacionView7_2=this.CaracterizacionView.map((e:any)=>e)

  if(this.selectYear6){
    this.CaracterizacionView7_2=this.CaracterizacionView7_2.filter((resp:any)=>{
      return new Date(resp.fechaaccidente).getFullYear()==this.selectYear6_2
      })
  }

  if(this.selectMonth6_2.length>0){
    let CaracterizacionView7:any=[]
    let CaracterizacionView7_1:any=[]
    this.selectMonth6_2.forEach(ele=>{
      CaracterizacionView7=this.CaracterizacionView7_2.filter((resp:any)=>{
        return new Date(resp.fechaaccidente).getMonth()==ele.code
      })
      CaracterizacionView7.forEach((resp2:any)=>{
        CaracterizacionView7_1.push(resp2)
      })
    })
    this.CaracterizacionView7_2=CaracterizacionView7_1
  }

   //nuevo
   let reportesAtCopyDiv: any[]=[]
   if(this.selectPais7_2)if(this.selectPais7_2!='Corona Total')this.CaracterizacionView7_2 = this.CaracterizacionView7_2.filter((at:any) => at.pais == this.selectPais7_2);
   if(!flagCoronaTotal)if(this.selectedDivisionResumen7_2)this.CaracterizacionView7_2= this.CaracterizacionView7_2.filter((at:any) => at.padrenombre == this.selectedDivisionResumen7_2);
   if(flagCoronaTotal)if(this.selectedDivisionResumen7_2)if(this.selectedDivisionResumen7_2.length>0){
    reportesAtCopyDiv=[]
    this.selectedDivisionResumen7_2.forEach((element:any) => {
      reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView7_2.filter((at:any) => at.padrenombre == element));
    });
    this.CaracterizacionView7_2=[...reportesAtCopyDiv]
  }
   if(this.LocalidadSelect7_2)if(this.LocalidadSelect7_2.length>0){
     reportesAtCopyDiv=[]
     this.LocalidadSelect7_2.forEach((element:any) => {
       reportesAtCopyDiv=reportesAtCopyDiv.concat(this.CaracterizacionView7_2.filter((at:any) => at.nombreLocalidad == element));
     });
     this.CaracterizacionView7_2=[...reportesAtCopyDiv]
   }
   //fin nuevo
   
   if(this.selectTipoPeligro6_2.hasOwnProperty('nombre')){
    if(this.selectTipoPeligro6_2.nombre){
      this.CaracterizacionView7_2 = this.CaracterizacionView7_2.filter((at:any) => at.peligro !=null).filter((at:any) => JSON.parse(at.peligro).nombre == this.selectTipoPeligro6_2.nombre);
    }
   }
   
  this.peligroItemList2_2.forEach((ele:any) => {
    this.graf6_1_2.push({name:ele.label,value:0})
    this.graf6_2_2.push({name:ele.label,value:0})
    this.graf6_3_2.push({name:ele.label,value:0})
    this.graf6_4_2.push({name:ele.label,value:0})
    this.graf6_5_2.push({name:ele.label,value:0})
    this.graf6_6_2.push({name:ele.label,value:0})
    this.graf6_7_2.push({name:ele.label,value:0})
  });
  this.contGrafPeligros_2=[]
  this.CaracterizacionView7_2.forEach((element:any) => {
    if(this.radioGra6_2==0)this.ContDatosGraf6_2(element)
    if(this.radioGra6_2==1 && element.emptemporal!=null)this.ContDatosGraf6_2(element)
    if(this.radioGra6_2==2 && element.emptemporal==null)this.ContDatosGraf6_2(element)
  });

  this.sextaGrafica_2()
  let total:string=(this.selectPais7_2=='Corona Total')?'Corona Total':this.selectedDivisionResumen7_2
  if((this.selectPais7_2=='Corona Total' && (!this.selectedDivisionResumen7_2 || this.selectedDivisionResumen7_2.length==0))|| (this.selectPais7_2!='Corona Total' && (!this.LocalidadSelect7_2 || this.LocalidadSelect7_2.length==0)))
  this.datosGrafica6_2=this.contTotal(this.datosGrafica6_2,total)
  this.datosGrafica6_2=this.organizarDatosMayorMenor(this.datosGrafica6_2)

  this.datosGrafica6Top_2=this.top(this.datosGrafica6_2,5)
  this.flagevent6_2=true
}
contGrafPeligros_2:any[]=[]
  ContDatosGraf6_2(element:any){
    let descripcionpeligro=JSON.parse(element.descripcionpeligro)
    if(descripcionpeligro)descripcionpeligro=descripcionpeligro.nombre

    // let nombreLocalidad = element.nombreLocalidad
    let nombreLocalidad = (this.selectPais7_2=='Corona Total')?element.padrenombre:element.nombreLocalidad


    if(nombreLocalidad && descripcionpeligro){
      if (this.contGrafPeligros_2.hasOwnProperty(nombreLocalidad)) {
        if (this.contGrafPeligros_2[nombreLocalidad].hasOwnProperty(descripcionpeligro)) {
          this.contGrafPeligros_2[nombreLocalidad][descripcionpeligro] += 1;
        } else {
          this.contGrafPeligros_2[nombreLocalidad][descripcionpeligro] = 1;
        }
      } else {
        this.contGrafPeligros_2[nombreLocalidad] = {};
        this.contGrafPeligros_2[nombreLocalidad][descripcionpeligro] = 1;
      }
    }
    

  }
  sextaGrafica_2(){

    this.datosGrafica6_2=[]

    let datoGrafica:any=[]
    let list = (this.selectPais7_2=='Corona Total')?this.divisionList7_2:this.localidadesList7_2

    list.forEach((element:any) => {
      if(this.contGrafPeligros_2.hasOwnProperty(element.label)){
        if(Object.keys(this.contGrafPeligros_2[element.label]).length>0){
          let datoSeries:any=[]
          Object.keys(this.contGrafPeligros_2[element.label]).forEach((clave:any) => {
            datoSeries.push({name:clave,value:this.contGrafPeligros_2[element.label][clave]})
          });   
          datoSeries=this.order(datoSeries)
          datoGrafica.push({name:element.label,series:datoSeries})   
        }
      }
    });
    this.datosGrafica6_2=datoGrafica.map((e:any)=>e)

  }
  /////Comun/////
  difAnios(date:any, otherDate:any):Number{
    var tiempo=otherDate.getTime() - date.getTime()
    var anios = (Math.floor(tiempo / (1000 * 60 * 60 * 24)))/365;
    return Math.floor(anios)
  }

  ordenarMap(map:any,ordermap:any){
    let maporder:any=[]
    ordermap.forEach((element:any) => {
      maporder.push({name:element,value:map.get(element)})
    });
    maporder.sort(function (a:any, b:any) {
      if (a.value < b.value) {
        return 1;
      }
      if (a.value > b.value) {
        return -1;
      }
      return 0;
    });
    return maporder
  }
  
  order(ele:any){
    ele.sort(function (a:any, b:any) {
      if (a.value < b.value) {
        return 1;
      }
      if (a.value > b.value) {
        return -1;
      }
      return 0;
    });
    return ele
  }
  tipoPeligroItemList?: SelectItem[];
  peligroItemList?: SelectItem[];
  peligroItemList_2?: SelectItem[];

  peligroItemList2: any=[];
  peligroItemList2_2: any=[];

  peligro:any=[]
  tipoPeligroItemList2:any=[]

  cargarTiposPeligro() {
    this.peligro=[]
    this.tipoPeligroItemList2=[]
    this.tipoPeligroService.findAll().then(
      (resp:any) => {
        this.tipoPeligroItemList = [];
        (<TipoPeligro[]>resp['data']).forEach(
          data =>{ 
            this.tipoPeligroItemList!.push({ label: data.nombre, value: data })
            this.tipoPeligroItemList2.push({ label: data.nombre, value: data })
            this.peligro.push(data.nombre)
          }
        )   
      }
    );
  }
  cargarPeligro(idtp:any) {
    this.peligroItemList2=[]

    if(idtp != null){
    let filter = new FilterQuery();
    filter.filterList = [{ field: 'tipoPeligro.id', criteria: Criteria.EQUALS, value1: idtp['id'] }];
    this.peligroService.findByFilter(filter).then(
      resp => {
        this.peligroItemList = [];
        (<Peligro[]>resp).forEach(
          data => 
            {
                this.peligroItemList!.push({ label: data.nombre, value: {id:data.id,nombre: data.nombre} })
                this.peligroItemList2.push({ label: data.nombre, value: data.nombre })
            }
        )
        this.DatosGrafica6()
      }
    );
     }else{
        this.peligroItemList = [{ label: '--Seleccione Peligro--', value: [null, null]}];
     }
  }

  cargarPeligro_2(idtp:any) {
    this.peligroItemList2_2=[]

    if(idtp != null){
    let filter = new FilterQuery();
    filter.filterList = [{ field: 'tipoPeligro.id', criteria: Criteria.EQUALS, value1: idtp['id'] }];
    this.peligroService.findByFilter(filter).then(
      resp => {
        this.peligroItemList_2 = [];
        (<Peligro[]>resp).forEach(
          data => 
            {
                this.peligroItemList_2!.push({ label: data.nombre, value: {id:data.id,nombre: data.nombre} })
                this.peligroItemList2_2.push({ label: data.nombre, value: data.nombre })
            }
        )
        this.DatosGrafica6_2()
      }
    );
     }else{
        this.peligroItemList_2 = [{ label: '--Seleccione Peligro--', value: [null, null]}];
     }
  }

  SelectPeligro(a: string){
    this.resetVar6()
    this.selectPel6Flag=true
    this.cargarPeligro(a)
  }
  SelectPeligro_2(a: string){
    this.resetVar6_2()
    this.selectPel6Flag_2=true
    this.cargarPeligro_2(a)
  }

  top(dato:any, limit:any) {
    let dato2:any=[] 
    dato.forEach((ele:any) =>{
      let cont=0
      let serie:any=[]
      ele.series.forEach((ele2:any)=>{
        if(ele.series.length>=limit){
          if(cont<limit){
            serie.push({name:ele2.name , value:ele2.value} ) 
          }
        }else{
          serie.push({name:ele2.name , value:ele2.value})
        }
        cont++
      }) 
      dato2.push({name:ele.name ,series:serie} )
    })
    return dato2
  }

  contTotal(datos:any,div:string){
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
    
    datos.push({name:div,series:datosGrafica_total})
  
    return datos
  }

  organizarDatosMayorMenor(dato:any){
    let datosReturn:any=[]
    dato.forEach((resp:any)=>{
      let datos=Array.from(resp['series'])
      datos=this.order(datos)
      datosReturn.push({name:resp['name'],series:datos})
    })
    return datosReturn
  }
  paisesList: Array<any> = [
    {label: 'Colombia', value: 'Colombia'},
    {label: 'Costa Rica', value: 'Costa Rica'},
    {label: 'EEUU', value: 'EEUU'},
    {label: 'Guatemala', value: 'Guatemala'},
    {label: 'Honduras', value: 'Honduras'},
    {label: 'Mexico', value: 'Mexico'},
    {label: 'Nicaragua', value: 'Nicaragua'},
    {label: 'Corona Total', value: 'Corona Total'}
  ];

  selectPais1:any
  selectPais2:any
  selectPais3:any
  selectPais4:any
  selectPais5:any
  selectPais6:any
  selectPais7:any

  selectPais1_2:any
  selectPais2_2:any
  selectPais3_2:any
  selectPais4_2:any
  selectPais5_2:any
  selectPais6_2:any
  selectPais7_2:any

  localidadesList:any=[]
  localidadesList1:any=[]
  localidadesList2:any=[]
  localidadesList3:any=[]
  localidadesList4:any=[]
  localidadesList5:any=[]
  localidadesList6:any=[]
  localidadesList7:any=[]

  localidadesList_2:any=[]
  localidadesList1_2:any=[]
  localidadesList2_2:any=[]
  localidadesList3_2:any=[]
  localidadesList4_2:any=[]
  localidadesList5_2:any=[]
  localidadesList6_2:any=[]
  localidadesList7_2:any=[]

  LocalidadSelect1:any=[]
  LocalidadSelect2:any=[]
  LocalidadSelect3:any=[]
  LocalidadSelect4:any=[]
  LocalidadSelect5:any=[]
  LocalidadSelect6:any=[]
  LocalidadSelect7:any=[]

  LocalidadSelect1_2:any=[]
  LocalidadSelect2_2:any=[]
  LocalidadSelect3_2:any=[]
  LocalidadSelect4_2:any=[]
  LocalidadSelect5_2:any=[]
  LocalidadSelect6_2:any=[]
  LocalidadSelect7_2:any=[]

  divisionList:any=[]
  divisionList1:any=[]
  divisionList2:any=[]
  divisionList3:any=[]
  divisionList4:any=[]
  divisionList5:any=[]
  divisionList6:any=[]
  divisionList7:any=[]

  divisionList_2:any=[]
  divisionList1_2:any=[]
  divisionList2_2:any=[]
  divisionList3_2:any=[]
  divisionList4_2:any=[]
  divisionList5_2:any=[]
  divisionList6_2:any=[]
  divisionList7_2:any=[]

  selectedDivisionResumen?: any | null = null;
  selectedDivisionResumen1?: any | null = null;
  selectedDivisionResumen2?: any | null = null;
  selectedDivisionResumen3?: any | null = null;
  selectedDivisionResumen4?: any | null = null;
  selectedDivisionResumen5?: any | null = null;
  selectedDivisionResumen6?: any | null = null;
  selectedDivisionResumen7?: any | null = null;

  selectedDivisionResumen_2?: any | null = null;
  selectedDivisionResumen1_2?: any | null = null;
  selectedDivisionResumen2_2?: any | null = null;
  selectedDivisionResumen3_2?: any | null = null;
  selectedDivisionResumen4_2?: any | null = null;
  selectedDivisionResumen5_2?: any | null = null;
  selectedDivisionResumen6_2?: any | null = null;
  selectedDivisionResumen7_2?: any | null = null;

  empresaId:any  = this.sessionService.getEmpresa()?.id;

  async funcSelectPais(pais:any,filter:any){
    switch (filter) {
      case 'graf1':
        this.localidadesList1=[]
        this.LocalidadSelect1=[]
        this.selectedDivisionResumen1=null
        this.divisionList1=await this.getLocalidades(pais.value)
        this.CardsClasificacion()
        break;
      case 'graf2':
        this.localidadesList2=[]
        this.LocalidadSelect2=[]
        this.selectedDivisionResumen2=null
        this.divisionList2=await this.getLocalidades(pais.value)
        this.DatosGrafica1()
        break;
      case 'graf2_2':
        this.localidadesList2_2=[]
        this.LocalidadSelect2_2=[]
        this.selectedDivisionResumen2_2=null
        this.divisionList2_2=await this.getLocalidades(pais.value)
        this.DatosGrafica1_2()
        break;
      case 'graf3':
        this.localidadesList3=[]
        this.LocalidadSelect3=[]
        this.selectedDivisionResumen3=null
        this.divisionList3=await this.getLocalidades(pais.value)
        this.DatosGrafica2()
        break;
      case 'graf3_2':
        this.localidadesList3_2=[]
        this.LocalidadSelect3_2=[]
        this.selectedDivisionResumen3_2=null
        this.divisionList3_2=await this.getLocalidades(pais.value)
        this.DatosGrafica2_2()
        break;
      case 'graf4':
        this.localidadesList4=[]
        this.LocalidadSelect4=[]
        this.selectedDivisionResumen4=null
        this.divisionList4=await this.getLocalidades(pais.value)
        this.DatosGrafica3()
        break;
      case 'graf4_2':
        this.localidadesList4_2=[]
        this.LocalidadSelect4_2=[]
        this.selectedDivisionResumen4_2=null
        this.divisionList4_2=await this.getLocalidades(pais.value)
        this.DatosGrafica3_2()
        break;
      case 'graf5':
        this.localidadesList5=[]
        this.LocalidadSelect5=[]
        this.selectedDivisionResumen5=null
        this.divisionList5=await this.getLocalidades(pais.value)
        this.DatosGrafica4()
        break;
      case 'graf5_2':
        this.localidadesList5_2=[]
        this.LocalidadSelect5_2=[]
        this.selectedDivisionResumen5_2=null
        this.divisionList5_2=await this.getLocalidades(pais.value)
        this.DatosGrafica4_2()
        break;
      case 'graf6':
        this.localidadesList6=[]
        this.LocalidadSelect6=[]
        this.selectedDivisionResumen6=null
        this.divisionList6=await this.getLocalidades(pais.value)
        this.filtroGraEve5()
        break;
      case 'graf6_2':
        this.localidadesList6_2=[]
        this.LocalidadSelect6_2=[]
        this.selectedDivisionResumen6_2=null
        this.divisionList6_2=await this.getLocalidades(pais.value)
        this.filtroGraEve5_2()
        break;
      case 'graf7':
        this.localidadesList7=[]
        this.LocalidadSelect7=[]
        this.selectedDivisionResumen7=null
        this.divisionList7=await this.getLocalidades(pais.value)
        this.DatosGrafica6()
        break;
      case 'graf7_2':
        this.localidadesList7_2=[]
        this.LocalidadSelect7_2=[]
        this.selectedDivisionResumen7_2=null
        this.divisionList7_2=await this.getLocalidades(pais.value)
        this.DatosGrafica6_2()
        break;
      default:
        break;
    }
  }
  async getLocalidades(pais:string | null){
    if(pais){
      let filterLocalidadQuery = new FilterQuery();
      filterLocalidadQuery.sortField = "id";
      filterLocalidadQuery.sortOrder = -1;
      filterLocalidadQuery.fieldList=this.fieldsLoc;

      filterLocalidadQuery.filterList = [
        { field: 'plantas.id_empresa', criteria: Criteria.EQUALS, value1: this.empresaId.toString() }]
      if(pais !='Corona Total')filterLocalidadQuery.filterList.push({ field: 'plantas.pais', criteria: Criteria.EQUALS, value1: pais })
      
      let divisionListOut:any=[]
      return new Promise(async (resolve, reject) => {
        await this.empresaService.getLocalidadesRWithFilter(filterLocalidadQuery)
        .then((res:any) => {
          this.localidadesList = (<Localidades[]>res.data).map(localidad => localidad);
          for(const ele of this.divisionList){
            if(this.getLocalidadesByArea(ele.id,res.data))divisionListOut.push({label:ele['nombre'],value:ele['nombre']})
          };
          resolve(divisionListOut);       
        }).catch(err => {
          resolve([]);
        });
      })}
    else{return []}
  }

  getLocalidadesByArea(id: any,localidadesList:any): Plantas[] | null{
    if(!localidadesList){
      return null;
    }
    let localidades = localidadesList.filter((loc:any) => loc.plantas_area_id == id);
    return localidades.length > 0 ? localidades: null;
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
  funcSelectDivision(div:any,filter:any){
    let dv:any
    let localidadesList:any
    if(filter!='graf1'){
      dv = this.divisionList.filter((dv1:any) => dv1.nombre == div.value);
      localidadesList=this.localidadesList.filter((loc:any) => loc.plantas_area_id == dv[0].id);
    }
    else{
      if(div.value.length>0){
        localidadesList=[]
        div.value.forEach((element:any) => {
          dv=(this.divisionList.filter((dv1:any) => dv1.nombre == element));
          localidadesList=localidadesList.concat(this.localidadesList.filter((loc:any) => loc.plantas_area_id == dv[0].id));
        });
      }else{
        dv=null
        localidadesList=null
      }
    }

    switch (filter) {
      case 'graf1':
        this.localidadesList1=[]
        this.LocalidadSelect1=[]
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList1.push({label:loc.localidad,value:loc.localidad})
        }
        this.CardsClasificacion()
        break;
      case 'graf2':
        this.localidadesList2=[]
        this.LocalidadSelect2=[]
        for(const loc of localidadesList){
          this.localidadesList2.push({label:loc.localidad,value:loc.localidad})
        }
        this.DatosGrafica1()
        break;
      case 'graf2_2':
        this.localidadesList2_2=[]
        this.LocalidadSelect2_2=[]
        for(const loc of localidadesList){
          this.localidadesList2_2.push({label:loc.localidad,value:loc.localidad})
        }
        this.DatosGrafica1_2()
        break;
      case 'graf3':
          this.localidadesList3=[]
          this.LocalidadSelect3=[]
          for(const loc of localidadesList){
            this.localidadesList3.push({label:loc.localidad,value:loc.localidad})
          }
          this.DatosGrafica2()
          break;
      case 'graf3_2':
        this.localidadesList3_2=[]
        this.LocalidadSelect3_2=[]
        for(const loc of localidadesList){
          this.localidadesList3_2.push({label:loc.localidad,value:loc.localidad})
        }
        this.DatosGrafica2_2()
        break;
      case 'graf4':
        this.localidadesList4=[]
        this.LocalidadSelect4=[]
        for(const loc of localidadesList){
          this.localidadesList4.push({label:loc.localidad,value:{nombre:loc.localidad,id:loc.id}})
        }
        this.DatosGrafica3()
        break;
      case 'graf4_2':
        this.localidadesList4_2=[]
        this.LocalidadSelect4_2=[]
        for(const loc of localidadesList){
          this.localidadesList4_2.push({label:loc.localidad,value:{nombre:loc.localidad,id:loc.id}})
        }
        this.DatosGrafica3_2()
        break;
      case 'graf5':
        this.localidadesList5=[]
        this.LocalidadSelect5=[]
        for(const loc of localidadesList){
          this.localidadesList5.push({label:loc.localidad,value:loc.localidad})
        }
        this.DatosGrafica4()
        break;
      case 'graf5_2':
        this.localidadesList5_2=[]
        this.LocalidadSelect5_2=[]
        for(const loc of localidadesList){
          this.localidadesList5_2.push({label:loc.localidad,value:loc.localidad})
        }
        this.DatosGrafica4_2()
        break;
      case 'graf6':
        this.localidadesList6=[]
        this.LocalidadSelect6=[]
        for(const loc of localidadesList){
          this.localidadesList6.push({label:loc.localidad,value:loc.localidad})
        }
        this.filtroGraEve5()
        break;
      case 'graf6_2':
        this.localidadesList6_2=[]
        this.LocalidadSelect6_2=[]
        for(const loc of localidadesList){
          this.localidadesList6_2.push({label:loc.localidad,value:loc.localidad})
        }
        this.filtroGraEve5_2()
        break;
      case 'graf7':
        this.localidadesList7=[]
        this.LocalidadSelect7=[]
        for(const loc of localidadesList){
          this.localidadesList7.push({label:loc.localidad,value:loc.localidad})
        }
        this.DatosGrafica6()
        break;
      case 'graf7_2':
        this.localidadesList7_2=[]
        this.LocalidadSelect7_2=[]
        for(const loc of localidadesList){
          this.localidadesList7_2.push({label:loc.localidad,value:loc.localidad})
        }
        this.DatosGrafica6_2()
        break;
      default:
        break;
    }
  }


  // comparativo

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

  flagComparativoEve1:boolean=false
  flagComparativoEve2:boolean=false
  flagComparativoEve3:boolean=false
  flagComparativoEve4:boolean=false
  flagComparativoEve5:boolean=false
  flagComparativoEve6:boolean=false


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
    
      default:
        break;
    }
  }

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
        this.flagComparativoEve4 = !this.flagComparativoEve4;
        break;
      case 'graf5':
        this.flagComparativoEve5= !this.flagComparativoEve5;
        break;
      case 'graf6':
        this.flagComparativoEve6 = !this.flagComparativoEve6;
        break;
    
      default:
        break;
    }
  }

  
}

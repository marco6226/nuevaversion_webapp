import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Plantas } from '../../../comun/entities/Plantas';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Criteria, SortOrder } from '../../../core/entities/filter';
import { SesionService } from '../../../core/services/session.service';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { Localidades } from '../../../ctr/entities/aliados';
import { AreaService } from '../../../empresa/services/area.service';
import { Area } from '../../../empresa/entities/area';
import { TipoPeligroService } from '../../../core/services/tipo-peligro.service';
import { TipoPeligro } from '../../../comun/entities/tipo-peligro';
import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { locale_es } from '../../../comun/entities/reporte-enumeraciones';
import { ViewMatrizPeligrosService } from '../../../core/services/view-matriz-peligros.service';
import { AreaMatrizService } from '../../../core/services/area-matriz.service';
import { PeligroService } from '../../../core/services/peligro.service';
import { Peligro } from '../../../comun/entities/peligro';
import { ViewHHtMetasService } from '../../../core/services/viewhhtmetas.service';
import { division } from '../../../comun/entities/datosGraf4';

@Component({
  selector: 'app-ind-matriz-peligros',
  templateUrl: './ind-matriz-peligros.component.html',
  styleUrl: './ind-matriz-peligros.component.scss'
})
export class IndMatrizPeligrosComponent implements OnInit,OnDestroy{
  // @HostBinding('style.--r1esumen1') r1esumen1 = 20;
  // @HostBinding('style.--r1esumen2') r1esumen2 = 30;
  // @HostBinding('style.--r1esumen3') r1esumen3 = 40;
  // @HostBinding('style.--r1esumen4') r1esumen4 = 50;
  
  colorScheme = {
    domain: ['#00B0F0', '#FC4512', '#FFC000', '#002060','#FCB8FC', '#5B9BD5','#70AD47']
  };
  colorScheme2:any ={
    domain: ['#ED1C24', '#FF7F27', '#FFF200', '#22B14C']
  };
  colorScheme3:any ={
    domain: ['#ED1C24', '#FF7F27', '#FFF200', '#22B14C']
  };
 
  colorSchemeFunc (eve:any,graf:any){
    let color:any=[
      {name:'Muy Alto', value:'#ED1C24'},
      {name:'Alto', value:'#FF7F27'},
      {name:'Medio', value:'#FFF200'},
      {name:'Bajo', value:'#22B14C'}
    ];
    let color2:any={}
    let domain:any=[]
    if(eve && eve.length>0){
      for(const c of color){
        if(eve.find((c1:any)=>c1==c.name))domain.push(c.value)
      }
      color2={
        domain: domain
      };
    }
    else {
      color2={
        domain: ['#ED1C24', '#FF7F27', '#FFF200', '#22B14C']
      };
    }
    switch(graf){
      case 'graf4':
        this.colorScheme2={...color2}
        break;
      case 'graf5':
        this.colorScheme3={...color2}
        break;
      default:
        break;
    }
  }
  
  dataEventos1:any[]=[]
  dataEventos1Porcentaje:any[]=[]
  dataEventos2:any[]=[]
  dataEventos3:any[]=[]
  dataEventos4:any[]=[]
  dataEventos5:any[]=[]
  dataEventos6:any[]=[]
  dataEventos7:any[]=[]
  dataEventos8:any[]=[]
  dataEventos8Porcentaje:any[]=[]
  dataEventos9:any[]=[]
  dataEventos9Porcentaje:any[]=[]
  dataEventos10:any[]=[]
  dataEventos11:any[]=[]
  dataEventos12:any[]=[]
  dataEventos13:any[]=[]
  dataEventos14:any[]=[]
  dataEventos15:any[]=[]
  dataEventos16:any[]=[]
  dataEventos17:any[]=[]
  dataEventos18:any[]=[]
  dataEventos19:any[]=[]
  dataEventos20:any[]=[]
  dataEventos21:any[]=[]
  dataEventos22:any[]=[]
  dataEventos23?: {
    labels: any;
    datasets: any[];
    options: any;
  }
  dataOpciones23: any = {
    title: {
      display: true,
      text: 'Meta'
    }
  }
  dataEventos24?: {
    labels: any;
    datasets: any[];
    options: any;
  }
  dataOpciones24: any = {
    title: {
      display: true,
      text: 'Meta p'
    }
  }
  dataEventos25?: {
    labels: any;
    datasets: any[];
    options: any;
  }
  dataOpciones25: any = {
    title: {
      display: true,
      text: 'Meta por planta'
    }
  }

  filtro1: any[] = [{label: 'Numero AT', value: 'Numero AT'},{label: 'Numero EL', value: 'Numero EL'}];
  filtro1Porcentaje: any[] = [{label: 'Porcentaje AT', value: 'Porcentaje AT'},{label: 'Porcentaje EL', value: 'Porcentaje EL'}];
  filtro2: any[] = [{label: 'Numero AT', value: 'Numero AT'},{label: 'Numero EL', value: 'Numero EL'}];
  filtro2Porcentaje: any[] = [{label: 'Porcentaje AT', value: 'Porcentaje AT'},{label: 'Porcentaje EL', value: 'Porcentaje EL'}];
  filtro4: any[] = [{label: 'Sin eliminados y sustituidos', value: 0}, {label: 'Eliminados y sustituidos', value: 1}];
  filtro5: any[] = [{label: 'Nuevos peligros', value: 'Nuevos peligros'},{label: 'Sustituidos', value: 'Sustituidos'}, {label: 'Eliminados', value: 'Eliminados'}];
  filtro6: any[] = [{label: 'Pendiente', value: 'Pendiente'}, {label: 'Ejecutado', value: 'Ejecutado'}];
  filtro6Jerarquia: any[] = [{label: 'Sustitucion', value: 0}, {label: 'Eliminación', value: 1}];
  filtro7: any[] = [{label: 'Propios', value: 'Propios'}, {label: 'Temporales', value: 'Temporales'}, {label: 'Contratistas', value: 'Contratistas'}, {label: 'Total', value: 'Total'}];
  filtro13: any[] = [{label: 'Control administrativo', value: 'Control administrativo'}, {label: 'Control Ingenieria', value: 'Control Ingenieria'}, {label: 'EPP', value: 'EPP'}];
  filtro15: any[] = [{label: 'Sí', value: 'Sí'}, {label: 'No', value: 'No'}];
  filtro16: any[] = [{label: 'GPI', value: 'GPI'}, {label: 'GPF', value: 'GPF'}];
  filtro17: any[] = [{label: 'ICR', value: 'ICR'}, {label: 'Meta ICR', value: 'Meta ICR'}];
  
  peligroList:any=[]
  selectePeligro1:any
  selectePeligro2:any
  selectePeligro3:any
  selectePeligro4:any
  selectePeligro5:any
  selectePeligro6:any
  selectePeligro7:any
  selectePeligro8:any
  selectePeligro9:any
  selectePeligro10:any
  selectePeligro11:any
  selectePeligro12:any
  selecteTipoPeligro12:any
  selectePeligro13:any
  selecteTipoPeligro13:any
  selectePeligro14:any
  selectePeligro15:any
  selectePeligro16:any
  selectePeligro17:any
  selectePeligro18:any
  selectePeligro19:any
  selectePeligro20:any
  selectePeligro21:any
  selectePeligro22:any
  selectePeligro23:any
  selectePeligro24:any
  selectePeligro25:any

  selectFiltro1: any=[]
  selectFiltro1p: any=[]
  selectFiltro2: any=[]
  selectFiltro2p: any=[]
  selectFiltro2Segundo: any=[]
  selectFiltro3: any=[]
  selectFiltro3p: any=[]
  selectFiltro4: any=0
  selectFiltro4Segundo: any=[]
  selectFiltro5: any=0
  selectFiltro5Segundo: any=[]
  selectFiltro6: any=[]
  selectFiltro7: any=[]
  selectFiltro8: any=[]
  selectFiltro8Segundo: any=0
  selectFiltro9: any=[]
  selectFiltro9Segundo: any=0
  selectFiltro10: any=[]
  selectFiltro11: any=[]
  selectFiltro12: any=[]
  selectFiltro13: any=[]
  selectFiltro14: any=[]
  selectFiltro15: any=[]
  selectFiltro16: any=[]
  selectFiltro17: any=[]
  selectFiltro18: any=[]
  selectFiltro19: any=[]
  selectFiltro20: any=[]
  selectFiltro21: any=[]
  selectFiltro22: any=[]
  selectFiltro23: any=[]
  selectFiltro24: any=[]
  selectFiltro25: any=[]

  selectAnio1: number = new Date().getFullYear();
  selectAnio2: number = new Date().getFullYear();
  selectAnio3: number = new Date().getFullYear();
  selectAnio4: number = new Date().getFullYear();
  selectAnio5: number = new Date().getFullYear();
  selectAnio6: number = new Date().getFullYear();
  selectAnio7: number = new Date().getFullYear();
  selectAnio8: number = new Date().getFullYear();
  selectAnio9: number = new Date().getFullYear();
  selectAnio10: number = new Date().getFullYear();
  selectAnio11: number = new Date().getFullYear();
  selectAnio12: number = new Date().getFullYear();
  selectAnio13: number = new Date().getFullYear();
  selectAnio14: number = new Date().getFullYear();
  selectAnio15: number = new Date().getFullYear();
  selectAnio16: number = new Date().getFullYear();
  selectAnio17: number = new Date().getFullYear();
  selectAnio18: number = new Date().getFullYear();
  selectAnio19: number = new Date().getFullYear();
  selectAnio20: number = new Date().getFullYear();
  selectAnio22: number = new Date().getFullYear();
  selectAnio23: number = new Date().getFullYear();
  selectAnio24: number = new Date().getFullYear();
  selectAnio25: number = new Date().getFullYear();

  selectMes1: any[] = [];
  selectMes2: any[] = [];
  selectMes3: any[] = [];
  selectMes4: any[] = [];
  selectMes5: any[] = [];
  selectMes6: any[] = [];
  selectMes7: any[] = [];
  selectMes8: any[] = [];
  selectMes9: any[] = [];
  selectMes10: any[] = [];
  selectMes11: any[] = [];
  selectMes12: any[] = [];
  selectMes13: any[] = [];
  selectMes14: any[] = [];
  selectMes15: any[] = [];
  selectMes16: any[] = [];
  selectMes17: any[] = [];
  selectMes18: any[] = [];
  selectMes19: any[] = [];
  selectMes20: any[] = [];
  selectMes22: any[] = [];
  selectMes23: any[] = [];
  selectMes24: any[] = [];
  selectMes25: any[] = [];

  radio1Gra1:number=0
  radio2Gra1:number=0
  radio3Gra1:number=0
  radioGra2:number=0
  radioGra3:number=0
  radioGra4:number=0
  radioGra5:number=0
  radioGra6:number=0
  radioGra7:number=0
  radioGra8:number=0
  radioGra9:number=0
  radioGra10:number=0
  radioGra11:number=0
  radioGra12:number=0
  radioGra13:number=0
  radioGra14:number=0

  desde1Graf1?:Date
  desde2Graf1?:Date

  desde1Graf2?:Date
  desde1Graf6?:Date
  desde1Graf8?:Date
  desde1Graf10?:Date
  desde1Graf12?:Date
  desde1Graf14?:Date
  desde1Graf15?:Date
  desde1Graf17?:Date
  desde1Graf18?:Date
  desde1Graf20?:Date
  desde1Graf21?:Date
  desde1Graf23?:Date
  desde1Graf24?:Date
  
  hasta1Graf1?:Date
  hasta2Graf1?:Date

  hasta1Graf2?:Date
  hasta1Graf6?:Date
  hasta1Graf8?:Date
  hasta1Graf10?:Date
  hasta1Graf12?:Date
  hasta1Graf14?:Date
  hasta1Graf15?:Date
  hasta1Graf17?:Date
  hasta1Graf18?:Date
  hasta1Graf20?:Date
  hasta1Graf21?:Date
  hasta1Graf23?:Date
  hasta1Graf24?:Date
  // desde:Date=null
  
  añoPrimero:number=2015;
  yearRange = new Array();
  dateValue= new Date();
  añoActual:number=this.dateValue.getFullYear();
  yearRangeNumber= Array.from({length: this.añoActual - this.añoPrimero+1}, (f, g) => g + this.añoPrimero);

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
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


  nivelRiesgo:any=[
    {label:'Muy Alto',value:'Muy Alto'},
    {label:'Alto',value:'Alto'},
    {label:'Medio',value:'Medio'},
    {label:'Bajo',value:'Bajo'}
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
  selectPais14:any
  selectPais15:any
  selectPais16:any
  selectPais17:any
  selectPais18:any
  selectPais19:any
  selectPais20:any
  selectPais21:any
  selectPais22:any
  selectPais23:any
  selectPais24:any
  selectPais25:any

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
  divisionList14:any=[]
  divisionList15:any=[]
  divisionList16:any=[]
  divisionList17:any=[]
  divisionList18:any=[]
  divisionList19:any=[]
  divisionList20:any=[]
  divisionList21:any=[]
  divisionList22:any=[]
  divisionList23:any=[]
  divisionList24:any=[]
  divisionList25:any=[]
  
  selecteDivision1:any
  selecteDivision2:any
  selecteDivision3:any
  selecteDivision4:any
  selecteDivision5:any
  selecteDivision6:any
  selecteDivision7:any
  selecteDivision8:any
  selecteDivision9:any
  selecteDivision10:any
  selecteDivision11:any
  selecteDivision12:any
  selecteDivision13:any
  selecteDivision14:any
  selecteDivision15:any
  selecteDivision16:any
  selecteDivision17:any
  selecteDivision18:any
  selecteDivision19:any
  selecteDivision20:any
  selecteDivision21:any
  selecteDivision22:any
  selecteDivision23:any
  selecteDivision24:any
  selecteDivision25:any
  
  localidadesList:any[]=[]
  localidadesList1:any[]=[]
  localidadesList2:any[]=[]
  localidadesList3:any[]=[]
  localidadesList4:any[]=[]
  localidadesList5:any[]=[]
  localidadesList6:any[]=[]
  localidadesList7:any[]=[]
  localidadesList8:any[]=[]
  localidadesList9:any[]=[]
  localidadesList10:any[]=[]
  localidadesList11:any[]=[]
  localidadesList12:any[]=[]
  localidadesList13:any[]=[]
  localidadesList14:any[]=[]
  localidadesList15:any[]=[]
  localidadesList16:any[]=[]
  localidadesList17:any[]=[]
  localidadesList18:any[]=[]
  localidadesList19:any[]=[]
  localidadesList20:any[]=[]
  localidadesList21:any[]=[]
  localidadesList22:any[]=[]
  localidadesList23:any[]=[]
  localidadesList24:any[]=[]
  localidadesList25:any[]=[]

  selecteLocalidad1:any
  selecteLocalidad2:any
  selecteLocalidad3:any
  selecteLocalidad4:any
  selecteLocalidad5:any
  selecteLocalidad6:any
  selecteLocalidad7:any
  selecteLocalidad8:any
  selecteLocalidad9:any
  selecteLocalidad10:any
  selecteLocalidad11:any
  selecteLocalidad12:any
  selecteLocalidad13:any
  selecteLocalidad14:any
  selecteLocalidad15:any
  selecteLocalidad16:any
  selecteLocalidad17:any
  selecteLocalidad18:any
  selecteLocalidad19:any
  selecteLocalidad20:any
  selecteLocalidad21:any
  selecteLocalidad22:any
  selecteLocalidad23:any
  selecteLocalidad24:any
  selecteLocalidad25:any

  areasList1:any
  areasList2:any
  areasList3:any
  areasList4:any
  areasList5:any
  areasList6:any
  areasList7:any
  areasList8:any
  areasList9:any
  areasList10:any
  areasList11:any
  areasList12:any
  areasList13:any
  areasList14:any
  areasList15:any
  areasList16:any
  areasList17:any
  areasList18:any
  areasList19:any
  areasList20:any
  areasList21:any
  areasList22:any
  areasList23:any
  areasList24:any
  areasList25:any

  selecteArea1:any
  selecteArea2:any
  selecteArea3:any
  selecteArea4:any
  selecteArea5:any
  selecteArea6:any
  selecteArea7:any
  selecteArea8:any
  selecteArea9:any
  selecteArea10:any
  selecteArea11:any
  selecteArea12:any
  selecteArea13:any
  selecteArea14:any
  selecteArea15:any
  selecteArea16:any
  selecteArea17:any
  selecteArea18:any
  selecteArea19:any
  selecteArea20:any
  selecteArea21:any
  selecteArea22:any
  selecteArea23:any
  selecteArea24:any
  selecteArea25:any

  localeES = locale_es;

  constructor(
    private sessionService: SesionService,
    private empresaService: EmpresaService,
    private areaService: AreaService,
    private tipoPeligroService: TipoPeligroService,
    private peligroService: PeligroService,
    private viewMatrizPeligrosService: ViewMatrizPeligrosService,
    private areaMatrizService: AreaMatrizService,
    private viewHHtMetasService: ViewHHtMetasService,
    private config: PrimeNGConfig
  ) {
 

  }
  async ngOnInit(): Promise<void> {
    this.config.setTranslation(this.localeES);
    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }
    this.getData()
  }
  ngOnDestroy(): void {
    // localStorage.removeItem('dataMp');
  }

  async getData(){
    await this.getDivision()
    await this.getAreaTotal()
    await this.cargarTiposPeligro();
    await this.datosMP();
    this.tableroRiesgoIncial()
    this.tableroRiesgofinal()
  }
  
  async datosMP(){
    let dataMP:any
    let filterMatriz = new FilterQuery();
    filterMatriz.sortField = "id";
    filterMatriz.sortOrder = -1;

    await this.viewMatrizPeligrosService.getmpRWithFilter(filterMatriz).then((resp:any)=>{
      dataMP=resp.data
      localStorage.setItem('dataMP', JSON.stringify(dataMP))
    })

    let filterQueryMeta = new FilterQuery();
      filterQueryMeta.filterList = [
        {criteria: Criteria.EQUALS, field: "empresaId", value1: this.sessionService.getParamEmp()},
        {criteria: Criteria.EQUALS, field: "modulo", value1: 'Matriz de Peligros'}
      ];
      
      let meta:any
      await this.viewHHtMetasService.getWithFilter(filterQueryMeta).then((metas:any)=>{
        meta=metas.data
        localStorage.setItem('metaMP', JSON.stringify(meta))
      })

  }

  peligro:any=[]
  tipoPeligroItemList?: any[];


  async cargarTiposPeligro() {
    this.peligro=[]
    await this.tipoPeligroService.findAll().then(
      (resp:any) => {
        this.tipoPeligroItemList = [];
        (<TipoPeligro[]>resp['data']).forEach(
          data =>{ 
            this.tipoPeligroItemList!.push({ label: data.nombre, value: data })
            this.peligro.push(data.nombre)
          }
        )   
      }
    );
  }
  peligroItemList12?: SelectItem[] | any;
  peligroItemList13?: SelectItem[] | any;


  async SelectPeligro(idtp: any,tipo:any){
    if(idtp != null){
      let filter = new FilterQuery();
      filter.filterList = [{ field: 'tipoPeligro.id', criteria: Criteria.EQUALS, value1: idtp['id'] }];
      await this.peligroService.findByFilter(filter).then(
        resp => {
          if(tipo=='tipo')this.peligroItemList12 = [];
          if(tipo=='mes')this.peligroItemList13 = [];
          (<Peligro[]>resp).forEach(
            data => 
              {
                if(tipo=='tipo')this.peligroItemList12?.push({ label: data.nombre, value: data.nombre })
                if(tipo=='mes')this.peligroItemList13?.push({ label: data.nombre, value: data.nombre })
              }
          )
        }
      );
    }else{
      if(tipo=='tipo')this.peligroItemList12 = [{ label: '--Seleccione Peligro--', value: [null, null]}];
      if(tipo=='mes')this.peligroItemList13 = [{ label: '--Seleccione Peligro--', value: [null, null]}];
    }  
    if(tipo=='tipo')this.grafData12()
    if(tipo=='mes')this.grafData13()
  }

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

  empresaId:any  = this.sessionService.getEmpresa()?.id;

  async funcSelectPais(pais:any,filter:any){
    switch (filter) {
      case 'graf1':
        this.localidadesList1=[]
        this.selecteLocalidad1=null
        this.selecteDivision1=null
        this.divisionList1=await this.getDivisiones(pais.value)
        this.grafData1()
        break;
      case 'graf2':
        this.localidadesList2=[]
        this.selecteLocalidad2=null
        this.selecteDivision2=null
        this.divisionList2=await this.getDivisiones(pais.value)
        this.grafData2()
        break;
      case 'graf3':
        this.localidadesList3=[]
        this.selecteLocalidad3=null
        this.selecteDivision3=null
        this.divisionList3=await this.getDivisiones(pais.value)
        this.grafData3()
        break;
      case 'graf4':
        this.localidadesList4=[]
        this.selecteLocalidad4=null
        this.selecteDivision4=null
        this.divisionList4=await this.getDivisiones(pais.value)
        this.grafData4()
        break;
      case 'graf5':
        this.localidadesList5=[]
        this.selecteLocalidad5=null
        this.selecteDivision5=null
        this.divisionList5=await this.getDivisiones(pais.value)
        this.grafData5()
        break;
      case 'graf6':
        this.localidadesList6=[]
        this.selecteLocalidad6=null
        this.selecteDivision6=null
        this.divisionList6=await this.getDivisiones(pais.value)
        this.grafData6()
        break;
      case 'graf7':
        this.localidadesList7=[]
        this.selecteLocalidad7=null
        this.selecteDivision7=null
        this.divisionList7=await this.getDivisiones(pais.value)
        this.grafData7()
        break;
      case 'graf8':
        this.localidadesList8=[]
        this.selecteLocalidad8=null
        this.selecteDivision8=null
        this.divisionList8=await this.getDivisiones(pais.value)
        this.grafData8()
        break;
      case 'graf9':
        this.localidadesList9=[]
        this.selecteLocalidad9=null
        this.selecteDivision9=null
        this.divisionList9=await this.getDivisiones(pais.value)
        this.grafData9()
        break;
      case 'graf10':
        this.localidadesList10=[]
        this.selecteLocalidad10=null
        this.selecteDivision10=null
        this.divisionList10=await this.getDivisiones(pais.value)
        this.grafData10()
        break;
      case 'graf11':
        this.localidadesList11=[]
        this.selecteLocalidad11=null
        this.selecteDivision11=null
        this.divisionList11=await this.getDivisiones(pais.value)
        this.grafData11()
        break;
      case 'graf12':
        this.localidadesList12=[]
        this.selecteLocalidad12=null
        this.selecteDivision12=null
        this.divisionList12=await this.getDivisiones(pais.value)
        this.grafData12()
        break;
      case 'graf13':
        this.localidadesList13=[]
        this.selecteLocalidad13=null
        this.selecteDivision13=null
        this.divisionList13=await this.getDivisiones(pais.value)
        this.grafData13()
        break;
      case 'graf14':
        this.localidadesList14=[]
        this.selecteLocalidad14=null
        this.selecteDivision14=null
        this.divisionList14=await this.getDivisiones(pais.value)
        this.grafData14()
        break;
      case 'graf15':
        this.localidadesList15=[]
        this.selecteLocalidad15=null
        this.selecteDivision15=null
        this.divisionList15=await this.getDivisiones(pais.value)
        this.grafData15()
        break;
      case 'graf16':
        this.localidadesList16=[]
        this.selecteLocalidad16=null
        this.selecteDivision16=null
        this.divisionList16=await this.getDivisiones(pais.value)
        this.grafData16()
        break;
      case 'graf17':
        this.localidadesList17=[]
        this.selecteLocalidad17=null
        this.selecteDivision17=null
        this.divisionList17=await this.getDivisiones(pais.value)
        this.grafData17()
        break;
      case 'graf18':
        this.localidadesList18=[]
        this.selecteLocalidad18=null
        this.selecteDivision18=null
        this.divisionList18=await this.getDivisiones(pais.value)
        this.grafData18()
        break;
      case 'graf19':
        this.localidadesList19=[]
        this.selecteLocalidad19=null
        this.selecteDivision19=null
        this.divisionList19=await this.getDivisiones(pais.value)
        this.grafData19()
        break;

      case 'graf20':
        this.localidadesList20=[]
        this.selecteLocalidad20=null
        this.selecteDivision20=null
        this.divisionList20=await this.getDivisiones(pais.value)
        this.grafData20()
        break;
      case 'graf21':
        this.localidadesList21=[]
        this.selecteLocalidad21=null
        this.selecteDivision21=null
        this.divisionList21=await this.getDivisiones(pais.value)
        this.grafData21()
        break;
      case 'graf22':
        this.localidadesList22=[]
        this.selecteLocalidad22=null
        this.selecteDivision22=null
        this.divisionList22=await this.getDivisiones(pais.value)
        this.grafData22()
        break;
      case 'graf23':
        this.localidadesList23=[]
        this.selecteLocalidad23=null
        this.selecteDivision23=null
        this.divisionList23=await this.getDivisiones(pais.value)
        this.grafData23()
        break;
      case 'graf24':
        this.localidadesList24=[]
        this.selecteLocalidad24=null
        this.selecteDivision24=null
        this.divisionList24=await this.getDivisiones(pais.value)
        this.grafData24()
        break;
      case 'graf25':
        this.localidadesList25=[]
        this.selecteLocalidad25=null
        this.selecteDivision25=null
        this.divisionList25=await this.getDivisiones(pais.value)
        this.grafData25()
        break;
      default:
        break;
    }
  }

  async getDivisiones(pais:string | null){
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
          divisionListOut.push({label:'Total',value:'Total'})
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
    if(div.value !='Total')dv = this.divisionList.filter((dv1:any) => dv1.nombre == div.value);

    if(div.value !='Total')localidadesList=this.localidadesList.filter((loc:any) => loc.plantas_area_id == dv[0].id);
    else localidadesList=[...this.localidadesList]


    switch (filter) {
      case 'graf1':
        this.localidadesList1=[]
        this.selecteLocalidad1=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList1.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData1()
        break;
      case 'graf2':
        this.localidadesList2=[]
        this.selecteLocalidad2=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList2.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData2()
        break;
      case 'graf3':
        this.localidadesList3=[]
        this.selecteLocalidad3=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList3.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData3()
        break;
      case 'graf4':
        this.localidadesList4=[]
        this.selecteLocalidad4=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList4.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData4()
        break;
      case 'graf5':
        this.localidadesList5=[]
        this.selecteLocalidad5=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList5.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData5()
        break;
      case 'graf6':
        this.localidadesList6=[]
        this.selecteLocalidad6=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList6.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData6()
        break;
      case 'graf7':
        this.localidadesList7=[]
        this.selecteLocalidad7=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList7.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData7()
        break;
      case 'graf8':
        this.localidadesList8=[]
        this.selecteLocalidad8=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList8.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData8()
        break;
      case 'graf9':
        this.localidadesList9=[]
        this.selecteLocalidad9=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList9.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData9()
        break;
      case 'graf10':
        this.localidadesList10=[]
        this.selecteLocalidad10=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList10.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData10()
        break;
      case 'graf11':
        this.localidadesList11=[]
        this.selecteLocalidad11=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList11.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData11()
        break;
      case 'graf12':
        this.localidadesList12=[]
        this.selecteLocalidad12=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList12.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData12()
        break;
      case 'graf13':
        this.localidadesList13=[]
        this.selecteLocalidad13=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList13.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData13()
        break;
      case 'graf14':
        this.localidadesList14=[]
        this.selecteLocalidad14=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList14.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData14()
        break;
      case 'graf15':
        this.localidadesList15=[]
        this.selecteLocalidad15=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList15.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData15()
        break;
      case 'graf16':
        this.localidadesList16=[]
        this.selecteLocalidad16=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList16.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData16()
        break;
      case 'graf17':
        this.localidadesList17=[]
        this.selecteLocalidad17=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList17.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData17()
        break;
      case 'graf18':
        this.localidadesList18=[]
        this.selecteLocalidad18=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList18.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData18()
        break;
      case 'graf19':
        this.localidadesList19=[]
        this.selecteLocalidad19=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList19.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData19()
        break;
      case 'graf20':
        this.localidadesList20=[]
        this.selecteLocalidad20=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList20.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData20()
        break;
      case 'graf21':
        this.localidadesList21=[]
        this.selecteLocalidad21=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList21.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData21()
        break;
      case 'graf22':
        this.localidadesList22=[]
        this.selecteLocalidad22=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList22.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData22()
        break;
      case 'graf23':
        this.localidadesList23=[]
        this.selecteLocalidad23=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList23.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData23()
        break;
      case 'graf24':
        this.localidadesList24=[]
        this.selecteLocalidad24=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList24.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData24()
        break;
      case 'graf25':
        this.localidadesList25=[]
        this.selecteLocalidad25=null
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList25.push({label:loc.localidad,value:loc.localidad})
        }
        this.grafData25()
        break;
      default:
        break;
    }
  }

  async funcSelectLocalidad(loc:any,filter:any){

    switch (filter) {
      case 'graf1':
        this.areasList1=await this.getArea(loc.value)
        this.grafData1()
        break;
      case 'graf2':
        this.areasList2=await this.getArea(loc.value)
        this.grafData2()
        break;
      case 'graf3':
        this.areasList3=await this.getArea(loc.value)
        this.grafData3()
        break;
      case 'graf4':
        this.areasList4=await this.getArea(loc.value)
        this.grafData4()
        break;
      case 'graf5':
        this.areasList5=await this.getArea(loc.value)
        this.grafData5()
        break;
      case 'graf6':
        this.areasList6=await this.getArea(loc.value)
        this.grafData6()
        break;
      case 'graf7':
        this.areasList7=await this.getArea(loc.value)
        this.grafData7()
        break;
      case 'graf8':
        this.areasList8=await this.getArea(loc.value)
        this.grafData8()
        break;
      case 'graf9':
        this.areasList9=await this.getArea(loc.value)
        this.grafData9()
        break;
      case 'graf10':
        this.areasList10=await this.getArea(loc.value)
        this.grafData10()
        break;
      case 'graf11':
        this.areasList11=await this.getArea(loc.value)
        this.grafData11()
        break;
      case 'graf12':
        this.areasList12=await this.getArea(loc.value)
        this.grafData12()
        break;
      case 'graf13':
        this.areasList13=await this.getArea(loc.value)
        this.grafData13()
        break;
      case 'graf14':
        this.areasList14=await this.getArea(loc.value)
        this.grafData14()
        break;
      case 'graf15':
        this.areasList15=await this.getArea(loc.value)
        this.grafData15()
        break;
      case 'graf16':
        this.areasList16=await this.getArea(loc.value)
        this.grafData16()
        break;
      case 'graf17':
        this.areasList17=await this.getArea(loc.value)
        this.grafData17()
        break;
      case 'graf18':
        this.areasList18=await this.getArea(loc.value)
        this.grafData18()
        break;
      case 'graf19':
        this.areasList19=await this.getArea(loc.value)
        this.grafData19()
        break;
      case 'graf20':
        this.areasList20=await this.getArea(loc.value)
        this.grafData20()
        break;
      case 'graf21':
        this.areasList21=await this.getArea(loc.value)
        this.grafData21()
        break;
      case 'graf22':
        this.areasList22=await this.getArea(loc.value)
        this.grafData22()
        break;
      case 'graf23':
        this.areasList23=await this.getArea(loc.value)
        this.grafData23()
        break;
      case 'graf24':
        this.areasList24=await this.getArea(loc.value)
        this.grafData24()
        break;
      case 'graf25':
        this.areasList25=await this.getArea(loc.value)
        this.grafData25()
        break;
      default:
        break;
    }
  }

  areasList:any
  async getAreaTotal(){
    let filterArea = new FilterQuery();
    filterArea.sortField = "id";
    filterArea.sortOrder = -1;
    filterArea.fieldList= ['id','nombre','localidad_plantas_id','localidad_plantas_nombre']
    filterArea.filterList = [{ field: 'eliminado', criteria: Criteria.EQUALS, value1: 'false'}];

    await this.areaMatrizService.findByFilter(filterArea).then((resp:any)=>{
        this.areasList=[...resp.data]
      })
  }


  async getArea(eve:any){
    let filterArea = new FilterQuery();
    filterArea.sortField = "id";
    filterArea.sortOrder = -1;
    filterArea.fieldList= ['id','nombre']
    filterArea.filterList = [{ field: 'localidad.localidad', criteria: Criteria.EQUALS, value1: eve},
                            { field: 'eliminado', criteria: Criteria.EQUALS, value1: false}];

    let areaMatrizItemList:any=[]
    return new Promise(async (resolve, reject) => {
      await this.areaMatrizService.findByFilter(filterArea).then((resp:any)=>{
    
        resp.data.forEach((element:any) => {
          areaMatrizItemList.push({ label: element.nombre, value: element.nombre})
        });
        resolve(areaMatrizItemList)
      }).catch(err => {
        resolve([]);
      });
    })
  }
  flagResumen:boolean=false

  resumenInicial:any
  resumenInicialText:any
  tableroRiesgoIncial(){
    this.flagResumen=false

    this.resumenInicial=[]
    this.resumenInicialText=[]
    let dataRiesgoInicial: any[] = JSON.parse(localStorage.getItem('dataMP')!);
    dataRiesgoInicial= dataRiesgoInicial.filter(at => at.division != null  && at.division != "");
    dataRiesgoInicial= dataRiesgoInicial.filter(at => at.cualitativoInicial != null  && at.cualitativoInicial != "");
    let divisionList = this.divisionList.map((resp:any)=>resp.nombre)

    divisionList = divisionList.filter((resp:any)=>resp != 'TEST')

    for(const div of divisionList){
      let data=[]
      let dataT=[]

      let dataRiesgoInicialTotal=dataRiesgoInicial.filter(mp => mp.division === div)
      let total: number = dataRiesgoInicialTotal.length

      let muyAlto: number = dataRiesgoInicialTotal.filter(mp => mp.cualitativoInicial === 'Muy Alto').length
      data.push((Number(muyAlto/total)*100).toFixed(1))
      dataT.push((Number(muyAlto/total)*100).toFixed(1))
      let alto: number = dataRiesgoInicialTotal.filter(mp => mp.cualitativoInicial === 'Alto').length
      data.push(((Number(muyAlto/total)+Number(alto/total))*100).toFixed(1))
      dataT.push(((Number(alto/total))*100).toFixed(1))
      let medio: number = dataRiesgoInicialTotal.filter(mp => mp.cualitativoInicial === 'Medio').length
      data.push(((Number(muyAlto/total)+Number(alto/total)+Number(medio/total))*100).toFixed(1))
      dataT.push(((Number(medio/total))*100).toFixed(1))
      let bajo: number = dataRiesgoInicialTotal.filter(mp => mp.cualitativoInicial === 'Bajo').length
      data.push(((Number(bajo/total))*100).toFixed(1))
      dataT.push(((Number(bajo/total))*100).toFixed(1))

      this.resumenInicial[div]=data
      this.resumenInicialText[div]=dataT
    }    

    let data=[]
    let dataT=[]

    let total: number = dataRiesgoInicial.length
    let muyAlto: number = dataRiesgoInicial.filter(mp => mp.cualitativoInicial === 'Muy Alto').length
    data.push((Number(muyAlto/total)*100).toFixed(1))
    dataT.push((Number(muyAlto/total)*100).toFixed(1))
    let alto: number = dataRiesgoInicial.filter(mp => mp.cualitativoInicial === 'Alto').length
    data.push(((Number(muyAlto/total)+Number(alto/total))*100).toFixed(1))
    dataT.push(((Number(alto/total))*100).toFixed(1))
    let medio: number = dataRiesgoInicial.filter(mp => mp.cualitativoInicial === 'Medio').length
    data.push(((Number(muyAlto/total)+Number(alto/total)+Number(medio/total))*100).toFixed(1))
    dataT.push(((Number(medio/total))*100).toFixed(1))
    let bajo: number = dataRiesgoInicial.filter(mp => mp.cualitativoInicial === 'Bajo').length
    data.push(((Number(bajo/total))*100).toFixed(1))
    dataT.push(((Number(bajo/total))*100).toFixed(1))

    this.resumenInicial['Corona Total']=data
    this.resumenInicialText['Corona Total']=dataT

    this.flagResumen=true
  }

  resumenResidual:any
  resumenResidualText:any
  tableroRiesgofinal(){
    this.flagResumen=false

    this.resumenResidual=[]
    this.resumenResidualText=[]
    let dataRiesgoFinal: any[] = JSON.parse(localStorage.getItem('dataMP')!);
    dataRiesgoFinal= dataRiesgoFinal.filter(at => at.division != null && at.division != "");
    dataRiesgoFinal= dataRiesgoFinal.filter(at => at.cualitativoResidual != null && at.cualitativoResidual != "");
    let divisionList = this.divisionList.map((resp:any)=>resp.nombre)

    divisionList = divisionList.filter((resp:any)=>resp != 'TEST')

    for(const div of divisionList){
      let data=[]
      let dataT=[]

      let dataRiesgoFinalTotal=dataRiesgoFinal.filter(mp => mp.division === div)
      let total: number = dataRiesgoFinalTotal.length
      let muyAlto: number = dataRiesgoFinalTotal.filter(mp => mp.cualitativoResidual === 'Muy Alto').length
      data.push((Number(muyAlto/total)*100).toFixed(1))
      dataT.push((Number(muyAlto/total)*100).toFixed(1))
      let alto: number = dataRiesgoFinalTotal.filter(mp => mp.cualitativoResidual === 'Alto').length
      data.push(((Number(muyAlto/total)+Number(alto/total))*100).toFixed(1))
      dataT.push(((Number(alto/total))*100).toFixed(1))
      let medio: number = dataRiesgoFinalTotal.filter(mp => mp.cualitativoResidual === 'Medio').length
      data.push(((Number(muyAlto/total)+Number(alto/total)+Number(medio/total))*100).toFixed(1))
      dataT.push(((Number(medio/total))*100).toFixed(1))
      let bajo: number = dataRiesgoFinalTotal.filter(mp => mp.cualitativoResidual === 'Bajo').length
      data.push(((Number(bajo/total))*100).toFixed(1))
      dataT.push(((Number(bajo/total))*100).toFixed(1))

      this.resumenResidual[div]=data
      this.resumenResidualText[div]=dataT
    } 
    let data=[]
    let dataT=[]

    let total: number = dataRiesgoFinal.length
    let muyAlto: number = dataRiesgoFinal.filter(mp => mp.cualitativoResidual === 'Muy Alto').length
    data.push((Number(muyAlto/total)*100).toFixed(1))
    dataT.push((Number(muyAlto/total)*100).toFixed(1))
    let alto: number = dataRiesgoFinal.filter(mp => mp.cualitativoResidual === 'Alto').length
    data.push(((Number(alto/total))*100).toFixed(1))
    dataT.push(((Number(muyAlto/total)+Number(alto/total))*100).toFixed(1))
    let medio: number = dataRiesgoFinal.filter(mp => mp.cualitativoResidual === 'Medio').length
    data.push(((Number(muyAlto/total)+Number(alto/total)+Number(medio/total))*100).toFixed(1))
    dataT.push(((Number(medio/total))*100).toFixed(1))
    let bajo: number = dataRiesgoFinal.filter(mp => mp.cualitativoResidual === 'Bajo').length
    data.push(((Number(bajo/total))*100).toFixed(1))
    dataT.push(((Number(bajo/total))*100).toFixed(1))

    this.resumenResidual['Corona Total']=data
    this.resumenResidualText['Corona Total']=dataT

    this.flagResumen=true
  }

  order(data:any){
    let dataT:any[]=[]
    let dataF:any[]=[]
    for(const c of data){
      let data2: {
        name: any,
        value: any
      }={name:'',
        value:0
      }
      data2.name=c.name;
      data2.value=c.series.reduce((count:any, s:any) => {
        return (count + ((s.value)?s.value:0));
      }, 0);
      dataT.push(data2)
    }
    dataT.sort(function (a:any, b:any) {
      if (a.value > b.value) {
        return -1;
      }
      if (a.value < b.value) {
        return 1;
      }
      return 0;
    });
    for(const d of dataT){
      if(data.find((f:any)=>{return f.name==d.name}))dataF.push(data.find((f:any)=>{return f.name==d.name}))
    }
    return dataF
  }

  topSeries(dato:any, limit:any) {
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
  top(dato:any, limit:any) {
    let cont=0
    let dato2:any=[]
    dato.forEach((ele:any) =>{
      if(dato.length>=limit){
        if(cont<limit){
          dato2.push(ele) 
        }
      }else{
        dato2.push(ele) 
      }
      cont++
    })
    return dato2
  }
  //Resumen Grafico
  grafResumen(){
    let dataAnalisisRiesgoR: any[] = JSON.parse(localStorage.getItem('dataMP')!);
  }
  // Grafica Analisis riesgo 1
  grafData1(){

    let flagZero:boolean=false
    if(this.selectPais1 == 'Corona Total' || this.selecteDivision1 == 'Total' || this.selecteLocalidad1){
      let dataAnalisisRiesgo1: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos1: any[] = [];

      let ejeY:any
      let variableText:any
      if(this.selectPais1 == 'Corona Total'){
        ejeY=[...this.divisionList1] 
        variableText='division'
      }
      if(this.selecteDivision1 == 'Total'){
        ejeY=[...this.localidadesList1]
        variableText='planta'
      }
      if(this.selecteLocalidad1){
        ejeY=[...this.areasList1]
        variableText='area'
      }

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo1 = dataAnalisisRiesgo1.filter(at => at.fechaEdicion != null);
      dataAnalisisRiesgo1= dataAnalisisRiesgo1.filter(at => at.estado != 'Riesgo eliminado' && at.estado != 'Riesgo sustituido')
      if(this.desde1Graf1)dataAnalisisRiesgo1 = dataAnalisisRiesgo1.filter(at => new Date(at.fechaEdicion) >= new Date(this.desde1Graf1!));
      if(this.hasta1Graf1)dataAnalisisRiesgo1 = dataAnalisisRiesgo1.filter(at => new Date(at.fechaEdicion) <= new Date(this.hasta1Graf1!));
      if(this.selectPais1)if(this.selectPais1!='Corona Total')dataAnalisisRiesgo1 = dataAnalisisRiesgo1.filter(at => at.pais == this.selectPais1);
      if(this.selectePeligro1)if(this.selectePeligro1.length>0){
        dataMPCopyDiv=[]
        this.selectePeligro1.forEach((element:any) => {
          dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo1.filter(at => at.peligro == element.nombre));
        });
        dataAnalisisRiesgo1=[...dataMPCopyDiv]
      }

      let numeroAtTotal:number=0
      let numeroElTotal:number=0
      for(const y of ejeY){
        let data:any = {
          name: y.label,
          series: []
        }
        let numeroAt: number = dataAnalisisRiesgo1.filter(mp => mp[variableText] === y.label)
                                      .reduce((count:number, at:any) => {
                                        return count + ((at.atAsociados)?Number(at.atAsociados):0.0);
                                    }, 0);
        let numeroEl: number = dataAnalisisRiesgo1.filter(mp => mp[variableText]===y.label)
                                      .reduce((count, el) => {
                                          return count + ((el.elAsociados)?Number(el.elAsociados):0);
                                      }, 0);

        numeroAtTotal +=numeroAt
        numeroElTotal +=numeroEl

        if(numeroAt==0 && numeroEl==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro1[0].label,
            value: numeroAt
          });
          data.series.push({
            name: this.filtro1[1].label,
            value: numeroEl
          })
          dataEventos1.push(data);
        }
      }
      dataEventos1=this.order(dataEventos1)
      dataEventos1=this.top(dataEventos1,10)

      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro1[0].label,
        value: numeroAtTotal
      });
      data.series.push({
        name: this.filtro1[1].label,
        value: numeroElTotal
      })

      dataEventos1.push(data);
  
      this.porcentajeGraf1(dataEventos1,numeroAtTotal,numeroElTotal)
      Object.assign(this, {dataEventos1});
      localStorage.setItem('dataEventos1', JSON.stringify(dataEventos1));
      this.filtroGraf1()
    }
  }
  porcentajeGraf1(dataGraf:any,numAtTotal:number,numElTotal:number){
    let dataEventos1Porcentaje: any[] = [];

    for(const d of dataGraf){
      let data:any = {
        name: d.name,
        series: []
      }

      data.series.push({
        name: this.filtro1Porcentaje[0].label,
        value: ((d.series[0].value*100)/((numAtTotal)?numAtTotal:1)).toFixed(1)
      });
      data.series.push({
        name: this.filtro1Porcentaje[1].label,
        value: ((d.series[1].value*100)/((numElTotal)?numElTotal:1)).toFixed(1)
      })

      dataEventos1Porcentaje.push(data)
    }
    dataEventos1Porcentaje.pop()
    Object.assign(this, {dataEventos1Porcentaje});
    localStorage.setItem('dataEventos1Porcentaje', JSON.stringify(dataEventos1Porcentaje));
  }
  filtroGraf1(){

    let dataEventos1: any[] = (this.radio1Gra1==0)?JSON.parse(localStorage.getItem('dataEventos1')!):JSON.parse(localStorage.getItem('dataEventos1Porcentaje')!);
    let dataEventos1Porcentaje: any[] =[]

    if(this.selectPais1 == 'Corona Total' && this.selecteDivision1 != 'Total'){
      if(this.selecteDivision1 && this.selecteDivision1.length > 0){
        dataEventos1 = dataEventos1.filter(data => this.selecteDivision1.includes(data.name));
      }
    }else if(this.selecteDivision1 == 'Total')
      if(this.selecteLocalidad1 && this.selecteLocalidad1.length > 0){
        dataEventos1 = dataEventos1.filter(data => this.selecteLocalidad1.includes(data.name));
      }

    if(this.selectPais1 != 'Corona Total' && this.selecteDivision1 != 'Total')
      if(this.selecteArea1 && this.selecteArea1.length > 0){
        dataEventos1 = dataEventos1.filter(data => this.selecteArea1.includes(data.name));
      }

    if(this.radio1Gra1==0)
      if(this.selectFiltro1 && this.selectFiltro1.length > 0){
        dataEventos1.forEach(de1 => {
          de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro1.includes(dataSeries.name));
        });
      }

    if(this.radio1Gra1==1){
      if(this.selectFiltro1p && this.selectFiltro1p.length > 0){
        dataEventos1.forEach(de1 => {
          de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro1p.includes(dataSeries.name));
        });
      }
      dataEventos1Porcentaje = dataEventos1.map(ele=>ele)
    }
    if(this.radio1Gra1==0)Object.assign(this, {dataEventos1}); 
    if(this.radio1Gra1==1)Object.assign(this, {dataEventos1Porcentaje}); 
  }
  // Grafica Analisis riesgo 2
  grafData2(){
    let flagZero:boolean=false
    // if(this.selectPais2 == 'Corona Total' || this.selecteDivision2 == 'Total' || this.selecteLocalidad2){
    if(this.selectPais2){
      let dataAnalisisRiesgo2: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos2: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo2 = dataAnalisisRiesgo2.filter(at => at.fechaEdicion != null);
      dataAnalisisRiesgo2= dataAnalisisRiesgo2.filter(at => at.estado != 'Riesgo eliminado' && at.estado != 'Riesgo sustituido')

      if(this.desde2Graf1)dataAnalisisRiesgo2 = dataAnalisisRiesgo2.filter(at => new Date(at.fechaEdicion) >= new Date(this.desde2Graf1!));
      if(this.hasta2Graf1)dataAnalisisRiesgo2 = dataAnalisisRiesgo2.filter(at => new Date(at.fechaEdicion) <= new Date(this.hasta2Graf1!));
      if(this.selectePeligro2)if(this.selectePeligro2.length>0){
        dataMPCopyDiv=[]
        this.selectePeligro2.forEach((element:any) => {
          dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo2.filter(at => at.peligro == element.nombre));
        });
        dataAnalisisRiesgo2=[...dataMPCopyDiv]
      }
      //nuevo
        // let dataMPCopyDiv: any[]=[]
        dataAnalisisRiesgo2= dataAnalisisRiesgo2.filter(at => at.pais != null);
        dataAnalisisRiesgo2= dataAnalisisRiesgo2.filter(at => at.division != null);
        dataAnalisisRiesgo2= dataAnalisisRiesgo2.filter(at => at.planta != null);
        dataAnalisisRiesgo2= dataAnalisisRiesgo2.filter(at => at.area != null);
        if(this.selectPais2)if(this.selectPais2!='Corona Total')dataAnalisisRiesgo2 = dataAnalisisRiesgo2.filter(at => at.pais == this.selectPais2);
        if(this.selecteDivision2)dataAnalisisRiesgo2= dataAnalisisRiesgo2.filter(at => at.division == this.selecteDivision2);
        if(this.selecteLocalidad2)dataAnalisisRiesgo2= dataAnalisisRiesgo2.filter(at => at.planta == this.selecteLocalidad2);
        if(this.selecteArea2)if(this.selecteArea2.length>0){
          dataMPCopyDiv=[]
          this.selecteArea2.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo2.filter(at => at.area == element));
          });
          dataAnalisisRiesgo2=[...dataMPCopyDiv]
        }
      //fin nuevo
      let numeroAtTotal:number=0
      let numeroElTotal:number=0
      if(this.tipoPeligroItemList)
      for(const tipoPeligro of this.tipoPeligroItemList){
        let data:any = {
          name: tipoPeligro.label,
          series: []
        }

        let numeroAt: number = dataAnalisisRiesgo2.filter(mp => mp.peligro === tipoPeligro.label)
                                      .reduce((count:number, at:any) => {
                                        return count + ((at.atAsociados)?Number(at.atAsociados):0.0);
                                    }, 0);
        let numeroEl: number = dataAnalisisRiesgo2.filter(mp => mp.peligro===tipoPeligro.label)
                                      .reduce((count, el) => {
                                          return count + ((el.elAsociados)?Number(el.elAsociados):0);
                                      }, 0);
        
        numeroAtTotal +=numeroAt
        numeroElTotal +=numeroEl

        if(numeroAt==0 && numeroEl==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro2[0].label,
            value: numeroAt
          });
          data.series.push({
            name: this.filtro2[1].label,
            value: numeroEl
          })
          dataEventos2.push(data);
        }
      }

      dataEventos2=this.order(dataEventos2)
      dataEventos2=this.top(dataEventos2,10)

      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro2[0].label,
        value: numeroAtTotal
      });
      data.series.push({
        name: this.filtro2[1].label,
        value: numeroElTotal
      })

      dataEventos2.push(data);
      this.porcentajeGraf2(dataEventos2,numeroAtTotal,numeroElTotal)
      Object.assign(this, {dataEventos2});
      localStorage.setItem('dataEventos2', JSON.stringify(dataEventos2));
    }
  }

  porcentajeGraf2(dataGraf:any,numAtTotal:number,numElTotal:number){
    let dataEventos2Porcentaje: any[] = [];

    for(const d of dataGraf){
      let data:any = {
        name: d.name,
        series: []
      }

      data.series.push({
        name: this.filtro2Porcentaje[0].label,
        value: ((d.series[0].value*100)/((numAtTotal)?numAtTotal:1)).toFixed(1)
      });
      data.series.push({
        name: this.filtro2Porcentaje[1].label,
        value: ((d.series[1].value*100)/((numElTotal)?numElTotal:1)).toFixed(1)
      })

      dataEventos2Porcentaje.push(data)
    }
    dataEventos2Porcentaje.pop()
    Object.assign(this, {dataEventos2Porcentaje});
    localStorage.setItem('dataEventos2Porcentaje', JSON.stringify(dataEventos2Porcentaje));
    this.filtroGraf1()
  }

  filtroGraf2(){
    let dataEventos2: any[] = (this.radio2Gra1==0)?JSON.parse(localStorage.getItem('dataEventos2')!):JSON.parse(localStorage.getItem('dataEventos2Porcentaje')!);
    let dataEventos2Porcentaje: any[] =[]

    if(this.selectePeligro2 && this.selectePeligro2.length > 0){
      let selectePeligro2=this.selectePeligro2.map((ele:any)=>ele.nombre)
      dataEventos2 = dataEventos2.filter(data => selectePeligro2.includes(data.name));
    }

    if(this.radio2Gra1==0)
      if(this.selectFiltro2 && this.selectFiltro2.length > 0){
        dataEventos2.forEach(de1 => {
          de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro2.includes(dataSeries.name));
        });
      }

    if(this.radio2Gra1==1){
      if(this.selectFiltro2p && this.selectFiltro2p.length > 0){
        dataEventos2.forEach(de1 => {
          de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro2p.includes(dataSeries.name));
        });
      }
      dataEventos2Porcentaje = dataEventos2.map(ele=>ele)
    }

    if(this.radio2Gra1==0)Object.assign(this, {dataEventos2}); 
    if(this.radio2Gra1==1)Object.assign(this, {dataEventos2Porcentaje}); 
  }
  // Grafica Analisis riesgo 3
  grafData3(){
    let flagZero:boolean=false
    if(this.selectPais3){
      let dataAnalisisRiesgo3: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos3: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo3 = dataAnalisisRiesgo3.filter(at => at.fechaEdicion != null);

      dataAnalisisRiesgo3 = dataAnalisisRiesgo3.filter(at => new Date(at.fechaEdicion).getFullYear() == this.selectAnio3);

      dataAnalisisRiesgo3= dataAnalisisRiesgo3.filter(at => at.estado != 'Riesgo eliminado' && at.estado != 'Riesgo sustituido')
      if(this.selectePeligro3)if(this.selectePeligro3.length>0){
        dataMPCopyDiv=[]
        this.selectePeligro3.forEach((element:any) => {
          dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo3.filter(at => at.peligro == element.nombre));
        });
        dataAnalisisRiesgo3=[...dataMPCopyDiv]
      }
      //nuevo
        dataAnalisisRiesgo3= dataAnalisisRiesgo3.filter(at => at.pais != null);
        dataAnalisisRiesgo3= dataAnalisisRiesgo3.filter(at => at.division != null);
        dataAnalisisRiesgo3= dataAnalisisRiesgo3.filter(at => at.planta != null);
        dataAnalisisRiesgo3= dataAnalisisRiesgo3.filter(at => at.area != null);
        if(this.selectPais3)if(this.selectPais3!='Corona Total')dataAnalisisRiesgo3 = dataAnalisisRiesgo3.filter(at => at.pais == this.selectPais3);
        if(this.selecteDivision3)dataAnalisisRiesgo3= dataAnalisisRiesgo3.filter(at => at.division == this.selecteDivision3);
        if(this.selecteLocalidad3)dataAnalisisRiesgo3= dataAnalisisRiesgo3.filter(at => at.planta == this.selecteLocalidad3);
        if(this.selecteArea3)if(this.selecteArea3.length>0){
          dataMPCopyDiv=[]
          this.selecteArea3.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo3.filter(at => at.area == element));
          });
          dataAnalisisRiesgo3=[...dataMPCopyDiv]
        }
      //fin nuevo
      let numeroAtTotal:number=0
      let numeroElTotal:number=0

      for(const mes of this.meses){
        let data:any = {
          name: mes,
          series: []
        }

        let numeroAt: number = dataAnalisisRiesgo3.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes)
                                      .reduce((count:number, at:any) => {
                                        return count + ((at.atAsociados)?Number(at.atAsociados):0.0);
                                    }, 0);
        let numeroEl: number = dataAnalisisRiesgo3.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()]===mes)
                                      .reduce((count, el) => {
                                          return count + ((el.elAsociados)?Number(el.elAsociados):0);
                                      }, 0);
        
        numeroAtTotal +=numeroAt
        numeroElTotal +=numeroEl

        if(numeroAt==0 && numeroEl==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro2[0].label,
            value: numeroAt
          });
          data.series.push({
            name: this.filtro2[1].label,
            value: numeroEl
          })
          dataEventos3.push(data);
        }
      }

      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro2[0].label,
        value: numeroAtTotal
      });
      data.series.push({
        name: this.filtro2[1].label,
        value: numeroElTotal
      })

      dataEventos3.push(data);
      this.porcentajeGraf3(dataEventos3,numeroAtTotal,numeroElTotal)
      Object.assign(this, {dataEventos3});
      localStorage.setItem('dataEventos3', JSON.stringify(dataEventos3));
      this.filtroGraf3()
    }
  }

  porcentajeGraf3(dataGraf:any,numAtTotal:number,numElTotal:number){
    let dataEventos3Porcentaje: any[] = [];

    for(const d of dataGraf){
      let data:any = {
        name: d.name,
        series: []
      }

      data.series.push({
        name: this.filtro2Porcentaje[0].label,
        value: ((d.series[0].value*100)/((numAtTotal)?numAtTotal:1)).toFixed(1)
      });
      data.series.push({
        name: this.filtro2Porcentaje[1].label,
        value: ((d.series[1].value*100)/((numElTotal)?numElTotal:1)).toFixed(1)
      })

      dataEventos3Porcentaje.push(data)
    }
    dataEventos3Porcentaje.pop()
    Object.assign(this, {dataEventos3Porcentaje});
    localStorage.setItem('dataEventos3Porcentaje', JSON.stringify(dataEventos3Porcentaje));
  }
  filtroGraf3(){
    // let dataEventos3: any[] = JSON.parse(localStorage.getItem('dataEventos3')!);
    let dataEventos3: any[] = (this.radio3Gra1==0)?JSON.parse(localStorage.getItem('dataEventos3')!):JSON.parse(localStorage.getItem('dataEventos3Porcentaje')!);
    
    let dataEventos3Porcentaje: any[] =[]

    if(this.selectMes3 && this.selectMes3.length > 0){
      dataEventos3 = dataEventos3.filter(data => this.selectMes3.includes(data.name));
    }

    if(this.radio3Gra1==0)
      if(this.selectFiltro3 && this.selectFiltro3.length > 0){
        dataEventos3.forEach(de1 => {
          de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro3.includes(dataSeries.name));
        });
      }

      
      
    if(this.radio3Gra1==1){
      if(this.selectFiltro3p && this.selectFiltro3p.length > 0){
        dataEventos3.forEach(de1 => {
          de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro3p.includes(dataSeries.name));
        });
      }
      dataEventos3Porcentaje = dataEventos3.map(ele=>ele)
    }

    if(this.radio3Gra1==0)Object.assign(this, {dataEventos3}); 
    if(this.radio3Gra1==1)Object.assign(this, {dataEventos3Porcentaje}); 
  }
//Grafico 4
  grafData4(){
    let flagZero:boolean=false

    if(this.selectPais4){
      let dataAnalisisRiesgo4: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos4: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo4 = dataAnalisisRiesgo4.filter(at => at.fechaEdicion != null);

      if(this.desde1Graf2)dataAnalisisRiesgo4 = dataAnalisisRiesgo4.filter(at => new Date(at.fechaEdicion) >= new Date(this.desde1Graf2!));
      if(this.hasta1Graf2)dataAnalisisRiesgo4 = dataAnalisisRiesgo4.filter(at => new Date(at.fechaEdicion) <= new Date(this.hasta1Graf2!));

      //nuevo
        dataAnalisisRiesgo4= dataAnalisisRiesgo4.filter(at => at.pais != null);
        dataAnalisisRiesgo4= dataAnalisisRiesgo4.filter(at => at.division != null);
        dataAnalisisRiesgo4= dataAnalisisRiesgo4.filter(at => at.planta != null);
        dataAnalisisRiesgo4= dataAnalisisRiesgo4.filter(at => at.area != null);
        if(this.selectPais4)if(this.selectPais4!='Corona Total')dataAnalisisRiesgo4 = dataAnalisisRiesgo4.filter(at => at.pais == this.selectPais4);
        if(this.selecteDivision4)dataAnalisisRiesgo4= dataAnalisisRiesgo4.filter(at => at.division == this.selecteDivision4);
        if(this.selecteLocalidad4)dataAnalisisRiesgo4= dataAnalisisRiesgo4.filter(at => at.planta == this.selecteLocalidad4);
        if(this.selecteArea4)if(this.selecteArea4.length>0){
          dataMPCopyDiv=[]
          this.selecteArea4.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo4.filter(at => at.area == element));
          });
          dataAnalisisRiesgo4=[...dataMPCopyDiv]
        }
      //fin nuevo
      let muyAltoTotal:number=0
      let altoTotal:number=0
      let medioTotal:number=0
      let bajoTotal:number=0

      let riesgo:string=(this.radioGra4==0)?'cualitativoInicial':'cualitativoResidual'
        
      if(this.radioGra4==0)dataAnalisisRiesgo4= dataAnalisisRiesgo4.filter(at => at.cualitativoInicial != null);
      if(this.radioGra4==1)dataAnalisisRiesgo4= dataAnalisisRiesgo4.filter(at => at.cualitativoResidual != null);

      if(this.selectFiltro4==0)dataAnalisisRiesgo4= dataAnalisisRiesgo4.filter(at => at.estado != 'Riesgo eliminado' && at.estado != 'Riesgo sustituido');
      if(this.selectFiltro4==1)dataAnalisisRiesgo4= dataAnalisisRiesgo4.filter(at => at.estado === 'Riesgo eliminado' || at.estado === 'Riesgo sustituido');


      if(this.tipoPeligroItemList)
      for(const tipoPeligro of this.tipoPeligroItemList){

        let data:any = {
          name: tipoPeligro.label,
          series: []
        }

        let muyAlto: number = dataAnalisisRiesgo4.filter(mp => mp.peligro === tipoPeligro.label && mp[riesgo]=='Muy Alto').length                        
        let alto: number = dataAnalisisRiesgo4.filter(mp => mp.peligro===tipoPeligro.label && mp[riesgo]=='Alto').length                      
        let medio: number = dataAnalisisRiesgo4.filter(mp => mp.peligro === tipoPeligro.label && mp[riesgo]=='Medio').length              
        let bajo: number = dataAnalisisRiesgo4.filter(mp => mp.peligro===tipoPeligro.label && mp[riesgo]=='Bajo').length
                                      
        
        muyAltoTotal +=muyAlto
        altoTotal +=alto
        medioTotal +=medio
        bajoTotal +=bajo

        if(muyAlto==0 && alto==0 && medio==0 && bajo==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.nivelRiesgo[0].label,
            value: muyAlto
          });
          data.series.push({
            name: this.nivelRiesgo[1].label,
            value: alto
          })
          data.series.push({
            name: this.nivelRiesgo[2].label,
            value: medio
          });
          data.series.push({
            name: this.nivelRiesgo[3].label,
            value: bajo
          })
          dataEventos4.push(data);
        }
      }

      dataEventos4=this.order(dataEventos4)
      dataEventos4=this.top(dataEventos4,10)

      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.nivelRiesgo[0].label,
        value: muyAltoTotal
      });
      data.series.push({
        name: this.nivelRiesgo[1].label,
        value: altoTotal
      })
      data.series.push({
        name: this.nivelRiesgo[2].label,
        value: medioTotal
      });
      data.series.push({
        name: this.nivelRiesgo[3].label,
        value: bajoTotal
      })

      dataEventos4.push(data);
      Object.assign(this, {dataEventos4});
      localStorage.setItem('dataEventos4', JSON.stringify(dataEventos4));
      this.filtroGraf4()
    }
  }
  filtroGraf4(){
    let dataEventos4: any[] = JSON.parse(localStorage.getItem('dataEventos4')!)

    if(this.selectePeligro4 && this.selectePeligro4.length > 0){
      let selectePeligro4=this.selectePeligro4.map((ele:any)=>ele.nombre)
      dataEventos4 = dataEventos4.filter(data => selectePeligro4.includes(data.name));
    }

    if(this.selectFiltro4Segundo && this.selectFiltro4Segundo.length > 0){
      dataEventos4.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro4Segundo.includes(dataSeries.name));
      });
    }
    this.colorSchemeFunc(this.selectFiltro4Segundo,'graf4')
    Object.assign(this, {dataEventos4}); 
  }

  grafData5(){
    let flagZero:boolean=false

    if(this.selectPais5){
      let dataAnalisisRiesgo5: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos5: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo5 = dataAnalisisRiesgo5.filter(at => at.fechaEdicion != null);

      //nuevo
        dataAnalisisRiesgo5= dataAnalisisRiesgo5.filter(at => at.pais != null);
        dataAnalisisRiesgo5= dataAnalisisRiesgo5.filter(at => at.division != null);
        dataAnalisisRiesgo5= dataAnalisisRiesgo5.filter(at => at.planta != null);
        dataAnalisisRiesgo5= dataAnalisisRiesgo5.filter(at => at.area != null);
        dataAnalisisRiesgo5 = dataAnalisisRiesgo5.filter(at => new Date(at.fechaEdicion).getFullYear() == this.selectAnio5);
        if(this.selectPais5)if(this.selectPais5!='Corona Total')dataAnalisisRiesgo5 = dataAnalisisRiesgo5.filter(at => at.pais == this.selectPais5);
        if(this.selecteDivision5)dataAnalisisRiesgo5= dataAnalisisRiesgo5.filter(at => at.division == this.selecteDivision5);
        if(this.selecteLocalidad5)dataAnalisisRiesgo5= dataAnalisisRiesgo5.filter(at => at.planta == this.selecteLocalidad5);
        if(this.selectePeligro5)if(this.selectePeligro5.length>0){
          dataMPCopyDiv=[]
          this.selectePeligro5.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo5.filter(at => at.peligro == element.nombre));
          });
          dataAnalisisRiesgo5=[...dataMPCopyDiv]
        }
        if(this.selecteArea5)if(this.selecteArea5.length>0){
          dataMPCopyDiv=[]
          this.selecteArea5.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo5.filter(at => at.area == element));
          });
          dataAnalisisRiesgo5=[...dataMPCopyDiv]
        }
      //fin nuevo
      let muyAltoTotal:number=0
      let altoTotal:number=0
      let medioTotal:number=0
      let bajoTotal:number=0

      let riesgo:string=(this.radioGra5==0)?'cualitativoInicial':'cualitativoResidual'
        
      if(this.radioGra5==0)dataAnalisisRiesgo5= dataAnalisisRiesgo5.filter(at => at.cualitativoInicial != null);
      if(this.radioGra5==1)dataAnalisisRiesgo5= dataAnalisisRiesgo5.filter(at => at.cualitativoResidual != null);

      if(this.selectFiltro5==0)dataAnalisisRiesgo5= dataAnalisisRiesgo5.filter(at => at.estado != 'Riesgo eliminado' && at.estado != 'Riesgo sustituido');
      if(this.selectFiltro5==1)dataAnalisisRiesgo5= dataAnalisisRiesgo5.filter(at => at.estado === 'Riesgo eliminado' || at.estado === 'Riesgo sustituido');


      if(this.tipoPeligroItemList)
      for(const mes of this.meses){

        let data:any = {
          name: mes,
          series: []
        }

        let muyAlto: number = dataAnalisisRiesgo5.filter(mp =>this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp[riesgo]=='Muy Alto').length                        
        let alto: number = dataAnalisisRiesgo5.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp[riesgo]=='Alto').length                      
        let medio: number = dataAnalisisRiesgo5.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp[riesgo]=='Medio').length              
        let bajo: number = dataAnalisisRiesgo5.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp[riesgo]=='Bajo').length
                                      
        
        muyAltoTotal +=muyAlto
        altoTotal +=alto
        medioTotal +=medio
        bajoTotal +=bajo

        if(muyAlto==0 && alto==0 && medio==0 && bajo==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.nivelRiesgo[0].label,
            value: muyAlto
          });
          data.series.push({
            name: this.nivelRiesgo[1].label,
            value: alto
          })
          data.series.push({
            name: this.nivelRiesgo[2].label,
            value: medio
          });
          data.series.push({
            name: this.nivelRiesgo[3].label,
            value: bajo
          })
          dataEventos5.push(data);
        }
      }

      // dataEventos5=this.order(dataEventos5)
      // dataEventos5=this.top(dataEventos5,10)

      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.nivelRiesgo[0].label,
        value: muyAltoTotal
      });
      data.series.push({
        name: this.nivelRiesgo[1].label,
        value: altoTotal
      })
      data.series.push({
        name: this.nivelRiesgo[2].label,
        value: medioTotal
      });
      data.series.push({
        name: this.nivelRiesgo[3].label,
        value: bajoTotal
      })

      dataEventos5.push(data);
      Object.assign(this, {dataEventos5});
      localStorage.setItem('dataEventos5', JSON.stringify(dataEventos5));
      this.filtroGraf5()
    }
  }
  filtroGraf5(){
    let dataEventos5: any[] = JSON.parse(localStorage.getItem('dataEventos5')!)

    if(this.selectMes5 && this.selectMes5.length > 0){
      dataEventos5 = dataEventos5.filter(data => this.selectMes5.includes(data.name));
    }

    if(this.selectFiltro5Segundo && this.selectFiltro5Segundo.length > 0){
      dataEventos5.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro5Segundo.includes(dataSeries.name));
      });
    }
    this.colorSchemeFunc(this.selectFiltro5Segundo,'graf5')

    Object.assign(this, {dataEventos5}); 
  }

  grafData6(){
    let flagZero:boolean=false

    if(this.selectPais6){
      let dataAnalisisRiesgo6: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos6: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo6 = dataAnalisisRiesgo6.filter(at => at.fechaEdicion != null);

      if(this.desde1Graf6)dataAnalisisRiesgo6 = dataAnalisisRiesgo6.filter(at => new Date(at.fechaEdicion) >= new Date(this.desde1Graf6!));
      if(this.hasta1Graf6)dataAnalisisRiesgo6 = dataAnalisisRiesgo6.filter(at => new Date(at.fechaEdicion) <= new Date(this.hasta1Graf6!));

      //nuevo
        dataAnalisisRiesgo6= dataAnalisisRiesgo6.filter(at => at.pais != null);
        dataAnalisisRiesgo6= dataAnalisisRiesgo6.filter(at => at.division != null);
        dataAnalisisRiesgo6= dataAnalisisRiesgo6.filter(at => at.planta != null);
        dataAnalisisRiesgo6= dataAnalisisRiesgo6.filter(at => at.area != null);
        if(this.selectPais6)if(this.selectPais6!='Corona Total')dataAnalisisRiesgo6 = dataAnalisisRiesgo6.filter(at => at.pais == this.selectPais6);
        if(this.selecteDivision6)dataAnalisisRiesgo6= dataAnalisisRiesgo6.filter(at => at.division == this.selecteDivision6);
        if(this.selecteLocalidad6)dataAnalisisRiesgo6= dataAnalisisRiesgo6.filter(at => at.planta == this.selecteLocalidad6);
        if(this.selecteArea6)if(this.selecteArea6.length>0){
          dataMPCopyDiv=[]
          this.selecteArea6.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo6.filter(at => at.area == element));
          });
          dataAnalisisRiesgo6=[...dataMPCopyDiv]
        }
      //fin nuevo
      let nuevosPeligrosTotal:number=0
      let sustituidosTotal:number=0
      let eliminadosTotal:number=0
      

      if(this.tipoPeligroItemList)
      for(const tipoPeligro of this.tipoPeligroItemList){

        let data:any = {
          name: tipoPeligro.label,
          series: []
        }
        // Ejecutado
        // Pendiente
        // let pendiente: number = 0
        let nuevosPeligros: number = dataAnalisisRiesgo6.filter(mp => mp.peligro === tipoPeligro.label && mp.estado!='Riesgo sustituido' && mp.estado!='Riesgo eliminado').length   
        let sustituidos: number = dataAnalisisRiesgo6.filter(mp => mp.peligro === tipoPeligro.label && mp.estado=='Riesgo sustituido').length   
        let eliminados: number = dataAnalisisRiesgo6.filter(mp => mp.peligro === tipoPeligro.label && mp.estado=='Riesgo eliminado').length   
                
                                      
        
        nuevosPeligrosTotal +=nuevosPeligros
        sustituidosTotal +=sustituidos
        eliminadosTotal +=eliminados

        if(nuevosPeligros==0 && sustituidos==0 && eliminados==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro5[0].value,
            value: nuevosPeligros
          });
          data.series.push({
            name: this.filtro5[1].value,
            value: sustituidos
          })
          data.series.push({
            name: this.filtro5[2].value,
            value: eliminados
          })
          dataEventos6.push(data);
        }
      }


      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro5[0].value,
        value: nuevosPeligrosTotal
      });
      data.series.push({
        name: this.filtro5[1].value,
        value: sustituidosTotal
      })
      data.series.push({
        name: this.filtro5[2].value,
        value: eliminadosTotal
      })

      dataEventos6.push(data);

      Object.assign(this, {dataEventos6});
      localStorage.setItem('dataEventos6', JSON.stringify(dataEventos6));
      this.filtroGraf6()
    }
  }
  filtroGraf6(){
    let dataEventos6: any[] = JSON.parse(localStorage.getItem('dataEventos6')!)

    if(this.selectePeligro6 && this.selectePeligro6.length > 0){
      let selectePeligro6=this.selectePeligro6.map((ele:any)=>ele.nombre)
      dataEventos6 = dataEventos6.filter(data => selectePeligro6.includes(data.name));
    }

    if(this.selectFiltro6 && this.selectFiltro6.length > 0){
      dataEventos6.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro6.includes(dataSeries.name));
      });
    }
    Object.assign(this, {dataEventos6}); 
  }
  grafData7(){
    let flagZero:boolean=false

    if(this.selectPais7){
      let dataAnalisisRiesgo7: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos7: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo7 = dataAnalisisRiesgo7.filter(at => at.fechaEdicion != null);


      //nuevo
        dataAnalisisRiesgo7= dataAnalisisRiesgo7.filter(at => at.pais != null);
        dataAnalisisRiesgo7= dataAnalisisRiesgo7.filter(at => at.division != null);
        dataAnalisisRiesgo7= dataAnalisisRiesgo7.filter(at => at.planta != null);
        dataAnalisisRiesgo7= dataAnalisisRiesgo7.filter(at => at.area != null);
        dataAnalisisRiesgo7 = dataAnalisisRiesgo7.filter(at => new Date(at.fechaEdicion).getFullYear() == this.selectAnio7);
        if(this.selectPais7)if(this.selectPais6!='Corona Total')dataAnalisisRiesgo7 = dataAnalisisRiesgo7.filter(at => at.pais == this.selectPais7);
        if(this.selecteDivision7)dataAnalisisRiesgo7= dataAnalisisRiesgo7.filter(at => at.division == this.selecteDivision7);
        if(this.selecteLocalidad7)dataAnalisisRiesgo7= dataAnalisisRiesgo7.filter(at => at.planta == this.selecteLocalidad7);
        if(this.selectePeligro7)if(this.selectePeligro7.length>0){
          dataMPCopyDiv=[]
          this.selectePeligro7.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo7.filter(at => at.peligro == element.nombre));
          });
          dataAnalisisRiesgo7=[...dataMPCopyDiv]
        }
        if(this.selecteArea7)if(this.selecteArea7.length>0){
          dataMPCopyDiv=[]
          this.selecteArea7.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo7.filter(at => at.area == element));
          });
          dataAnalisisRiesgo7=[...dataMPCopyDiv]
        }
      //fin nuevo
      let nuevosPeligrosTotal:number=0
      let sustituidosTotal:number=0
      let eliminadosTotal:number=0
      

      if(this.tipoPeligroItemList)
        for(const mes of this.meses){


        let data:any = {
          name: mes,
          series: []
        }
        // Ejecutado
        // Pendiente
        // let pendiente: number = 0
        let nuevosPeligros: number = dataAnalisisRiesgo7.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp.estado!='Riesgo sustituido' && mp.estado!='Riesgo eliminado').length   
        let sustituidos: number = dataAnalisisRiesgo7.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp.estado=='Riesgo sustituido').length   
        let eliminados: number = dataAnalisisRiesgo7.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp.estado=='Riesgo eliminado').length   
                
                                      
        
        nuevosPeligrosTotal +=nuevosPeligros
        sustituidosTotal +=sustituidos
        eliminadosTotal +=eliminados

        if(nuevosPeligros==0 && sustituidos==0 && eliminados==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro5[0].value,
            value: nuevosPeligros
          });
          data.series.push({
            name: this.filtro5[1].value,
            value: sustituidos
          })
          data.series.push({
            name: this.filtro5[2].value,
            value: eliminados
          })
          dataEventos7.push(data);
        }
      }


      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro5[0].value,
        value: nuevosPeligrosTotal
      });
      data.series.push({
        name: this.filtro5[1].value,
        value: sustituidosTotal
      })
      data.series.push({
        name: this.filtro5[2].value,
        value: eliminadosTotal
      })

      dataEventos7.push(data);

      Object.assign(this, {dataEventos7});
      localStorage.setItem('dataEventos7', JSON.stringify(dataEventos7));
      this.filtroGraf7()
    }
  }
  filtroGraf7(){
    let dataEventos7: any[] = JSON.parse(localStorage.getItem('dataEventos7')!)

    if(this.selectMes7 && this.selectMes7.length > 0){
      dataEventos7 = dataEventos7.filter(data => this.selectMes7.includes(data.name));
    }

    if(this.selectFiltro7 && this.selectFiltro7.length > 0){
      dataEventos7.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro7.includes(dataSeries.name));
      });
    }

    Object.assign(this, {dataEventos7}); 
  }

  grafData8(){
    let flagZero:boolean=false

    if(this.selectPais8){
      let dataAnalisisRiesgo8: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos8: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo8 = dataAnalisisRiesgo8.filter(at => at.fechaEdicion != null);

      if(this.desde1Graf8)dataAnalisisRiesgo8 = dataAnalisisRiesgo8.filter(at => new Date(at.fechaEdicion) >= new Date(this.desde1Graf8!));
      if(this.hasta1Graf8)dataAnalisisRiesgo8 = dataAnalisisRiesgo8.filter(at => new Date(at.fechaEdicion) <= new Date(this.hasta1Graf8!));

      //nuevo
        dataAnalisisRiesgo8= dataAnalisisRiesgo8.filter(at => at.pais != null);
        dataAnalisisRiesgo8= dataAnalisisRiesgo8.filter(at => at.division != null);
        dataAnalisisRiesgo8= dataAnalisisRiesgo8.filter(at => at.planta != null);
        dataAnalisisRiesgo8= dataAnalisisRiesgo8.filter(at => at.area != null);
        if(this.selectPais8)if(this.selectPais8!='Corona Total')dataAnalisisRiesgo8 = dataAnalisisRiesgo8.filter(at => at.pais == this.selectPais8);
        if(this.selecteDivision8)dataAnalisisRiesgo8= dataAnalisisRiesgo8.filter(at => at.division == this.selecteDivision8);
        if(this.selecteLocalidad8)dataAnalisisRiesgo8= dataAnalisisRiesgo8.filter(at => at.planta == this.selecteLocalidad8);
        if(this.selecteArea8)if(this.selecteArea8.length>0){
          dataMPCopyDiv=[]
          this.selecteArea8.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo8.filter(at => at.area == element));
          });
          dataAnalisisRiesgo8=[...dataMPCopyDiv]
        }
      //fin nuevo
      let pendienteTotal:number=0
      let ejecutadoTotal:number=0

      // let jerarquia=''
      // if(this.selectFiltro8Segundo==0)jerarquia='Sustitución'
      // if(this.selectFiltro8Segundo==1)jerarquia='Eliminación'
      if(this.selectFiltro8Segundo==0)dataAnalisisRiesgo8= dataAnalisisRiesgo8.filter(at => at.estado != 'Riesgo eliminado' && at.estado != 'Riesgo sustituido');
      if(this.selectFiltro8Segundo==1)dataAnalisisRiesgo8= dataAnalisisRiesgo8.filter(at => at.estado === 'Riesgo eliminado' || at.estado === 'Riesgo sustituido');
      
      


      if(this.tipoPeligroItemList)
      for(const tipoPeligro of this.tipoPeligroItemList){

        let data:any = {
          name: tipoPeligro.label,
          series: []
        }
        // Ejecutado
        // Pendiente
        let pendiente: number = 0
        dataAnalisisRiesgo8.filter(mp => mp.peligro === tipoPeligro.label).forEach(mp=>{
          let planAccion = (<Array<any>>JSON.parse(mp.planAccion))
          .reduce((count, planA) => {
            return (count + ((planA.estado)?((planA.estado=='Pendiente')?1:0):0));
          }, 0);
          pendiente += planAccion
        })                       
        // let ejecutado: number = dataAnalisisRiesgo8.filter(mp => mp.peligro===tipoPeligro.label && mp[riesgo]=='Alto').length   
        let ejecutado: number = 0
        dataAnalisisRiesgo8.filter(mp => mp.peligro === tipoPeligro.label).forEach(mp=>{
          let planAccion = (<Array<any>>JSON.parse(mp.planAccion))
          .reduce((count, planA) => {
            return (count + ((planA.estado)?((planA.estado=='Ejecutado')?1:0):0));
          }, 0);
          ejecutado += planAccion
        })                   
                                      
        
        pendienteTotal +=pendiente
        ejecutadoTotal +=ejecutado

        if(pendiente==0 && ejecutado==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: 'Pendiente',
            value: pendiente
          });
          data.series.push({
            name: 'Ejecutado',
            value: ejecutado
          })
          dataEventos8.push(data);
        }
      }

      // dataEventos8=this.order(dataEventos8)
      // dataEventos8=this.top(dataEventos8,10)

      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: 'Pendiente',
        value: pendienteTotal
      });
      data.series.push({
        name: 'Ejecutado',
        value: ejecutadoTotal
      })

      dataEventos8.push(data);
      this.porcentajeGraf8(dataEventos8,pendienteTotal,ejecutadoTotal)

      Object.assign(this, {dataEventos8});
      localStorage.setItem('dataEventos8', JSON.stringify(dataEventos8));
      this.filtroGraf8()
    }
  }
  porcentajeGraf8(dataGraf:any,numAtTotal:number,numElTotal:number){
    let dataEventos8Porcentaje: any[] = [];

    for(const d of dataGraf){
      let data:any = {
        name: d.name,
        series: []
      }

      data.series.push({
        name: 'Pendiente',
        value: ((d.series[0].value*100)/((numAtTotal)?numAtTotal:1)).toFixed(1)
      });
      data.series.push({
        name: 'Ejecutado',
        value: ((d.series[1].value*100)/((numElTotal)?numElTotal:1)).toFixed(1)
      })

      dataEventos8Porcentaje.push(data)
    }
    dataEventos8Porcentaje.pop()
    Object.assign(this, {dataEventos8Porcentaje});
    localStorage.setItem('dataEventos8Porcentaje', JSON.stringify(dataEventos8Porcentaje));
  }
  filtroGraf8(){
    let dataEventos8: any[] = (this.radioGra8==0)?JSON.parse(localStorage.getItem('dataEventos8')!):JSON.parse(localStorage.getItem('dataEventos8Porcentaje')!);
    let dataEventos8Porcentaje: any[] =[]

    if(this.selectePeligro8 && this.selectePeligro8.length > 0){
      let selectePeligro8=this.selectePeligro8.map((ele:any)=>ele.nombre)
      dataEventos8 = dataEventos8.filter(data => selectePeligro8.includes(data.name));
    }

    if(this.selectFiltro8 && this.selectFiltro8.length > 0){
      dataEventos8.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro8.includes(dataSeries.name));
      });
    }

    if(this.radioGra8==1)dataEventos8Porcentaje = dataEventos8.map(ele=>ele)

    if(this.radioGra8==0)Object.assign(this, {dataEventos8}); 
    if(this.radioGra8==1)Object.assign(this, {dataEventos8Porcentaje}); 
  }
  grafData9(){
    let flagZero:boolean=false

    if(this.selectPais9){
      let dataAnalisisRiesgo9: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos9: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo9 = dataAnalisisRiesgo9.filter(at => at.fechaEdicion != null);
      dataAnalisisRiesgo9 = dataAnalisisRiesgo9.filter(at => new Date(at.fechaEdicion).getFullYear() == this.selectAnio9);


      //nuevo
      dataAnalisisRiesgo9= dataAnalisisRiesgo9.filter(at => at.pais != null);
      dataAnalisisRiesgo9= dataAnalisisRiesgo9.filter(at => at.division != null);
      dataAnalisisRiesgo9= dataAnalisisRiesgo9.filter(at => at.planta != null);
      dataAnalisisRiesgo9= dataAnalisisRiesgo9.filter(at => at.area != null);
        if(this.selectPais9)if(this.selectPais9!='Corona Total')dataAnalisisRiesgo9 = dataAnalisisRiesgo9.filter(at => at.pais == this.selectPais9);
        if(this.selecteDivision9)dataAnalisisRiesgo9= dataAnalisisRiesgo9.filter(at => at.division == this.selecteDivision9);
        if(this.selecteLocalidad9)dataAnalisisRiesgo9= dataAnalisisRiesgo9.filter(at => at.planta == this.selecteLocalidad9);
        if(this.selecteArea9)if(this.selecteArea9.length>0){
          dataMPCopyDiv=[]
          this.selecteArea9.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo9.filter(at => at.area == element));
          });
          dataAnalisisRiesgo9=[...dataMPCopyDiv]
        }
      //fin nuevo
      let pendienteTotal:number=0
      let ejecutadoTotal:number=0

      // let jerarquia=''
      // if(this.selectFiltro9Segundo==0)jerarquia='Sustitución'
      // if(this.selectFiltro9Segundo==1)jerarquia='Eliminación'
      if(this.selectFiltro9Segundo==0)dataAnalisisRiesgo9= dataAnalisisRiesgo9.filter(at => at.estado != 'Riesgo eliminado' && at.estado != 'Riesgo sustituido');
      if(this.selectFiltro9Segundo==1)dataAnalisisRiesgo9= dataAnalisisRiesgo9.filter(at => at.estado === 'Riesgo eliminado' || at.estado === 'Riesgo sustituido');

      


    if(this.tipoPeligroItemList)
      for(const mes of this.meses){


        let data:any = {
          name: mes,
          series: []
        }
        // Ejecutado
        // Pendiente
        let pendiente: number = 0
        dataAnalisisRiesgo9.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes).forEach(mp=>{
          let planAccion = (<Array<any>>JSON.parse(mp.planAccion))
          .reduce((count, planA) => {
            return (count + ((planA.estado)?((planA.estado=='Pendiente')?1:0):0));
          }, 0);
          pendiente += planAccion
        })                       
        // let ejecutado: number = dataAnalisisRiesgo8.filter(mp => mp.peligro===tipoPeligro.label && mp[riesgo]=='Alto').length   
        let ejecutado: number = 0
        dataAnalisisRiesgo9.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes).forEach(mp=>{
          let planAccion = (<Array<any>>JSON.parse(mp.planAccion))
          .reduce((count, planA) => {
            return (count + ((planA.estado)?((planA.estado=='Ejecutado')?1:0):0));
          }, 0);
          ejecutado += planAccion
        })                   
                                      
        
        pendienteTotal +=pendiente
        ejecutadoTotal +=ejecutado

        if(pendiente==0 && ejecutado==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: 'Pendiente',
            value: pendiente
          });
          data.series.push({
            name: 'Ejecutado',
            value: ejecutado
          })
          dataEventos9.push(data);
        }
      }

      // dataEventos8=this.order(dataEventos8)
      // dataEventos8=this.top(dataEventos8,10)

      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: 'Pendiente',
        value: pendienteTotal
      });
      data.series.push({
        name: 'Ejecutado',
        value: ejecutadoTotal
      })

      dataEventos9.push(data);
      this.porcentajeGraf9(dataEventos9,pendienteTotal,ejecutadoTotal)
      Object.assign(this, {dataEventos9});
      localStorage.setItem('dataEventos9', JSON.stringify(dataEventos9));
      this.filtroGraf9()
    }
  }
  porcentajeGraf9(dataGraf:any,numAtTotal:number,numElTotal:number){
    let dataEventos9Porcentaje: any[] = [];

    for(const d of dataGraf){
      let data:any = {
        name: d.name,
        series: []
      }

      data.series.push({
        name: 'Pendiente',
        value: ((d.series[0].value*100)/((numAtTotal)?numAtTotal:1)).toFixed(1)
      });
      data.series.push({
        name: 'Ejecutado',
        value: ((d.series[1].value*100)/((numElTotal)?numElTotal:1)).toFixed(1)
      })

      dataEventos9Porcentaje.push(data)
    }
    dataEventos9Porcentaje.pop()
    Object.assign(this, {dataEventos9Porcentaje});
    localStorage.setItem('dataEventos9Porcentaje', JSON.stringify(dataEventos9Porcentaje));
  }
  filtroGraf9(){
    let dataEventos9: any[] = (this.radioGra9==0)?JSON.parse(localStorage.getItem('dataEventos9')!):JSON.parse(localStorage.getItem('dataEventos9Porcentaje')!);
    let dataEventos9Porcentaje: any[] =[]


    if(this.selectMes9 && this.selectMes9.length > 0){
      dataEventos9 = dataEventos9.filter(data => this.selectMes9.includes(data.name));
    }

    if(this.selectFiltro9 && this.selectFiltro9.length > 0){
      dataEventos9.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro9.includes(dataSeries.name));
      });
    }

    if(this.radioGra9==1)dataEventos9Porcentaje = dataEventos9.map(ele=>ele)

    if(this.radioGra9==0)Object.assign(this, {dataEventos9}); 
    if(this.radioGra9==1)Object.assign(this, {dataEventos9Porcentaje}); 

  }
  grafData10(){
    let flagZero:boolean=false

    if(this.selectPais10){
      let dataAnalisisRiesgo10: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos10: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo10 = dataAnalisisRiesgo10.filter(at => at.fechaEdicion != null);

      if(this.desde1Graf10)dataAnalisisRiesgo10 = dataAnalisisRiesgo10.filter(at => new Date(at.fechaEdicion) >= new Date(this.desde1Graf10!));
      if(this.hasta1Graf10)dataAnalisisRiesgo10 = dataAnalisisRiesgo10.filter(at => new Date(at.fechaEdicion) <= new Date(this.hasta1Graf10!));

      if(this.radioGra10==1)dataAnalisisRiesgo10= dataAnalisisRiesgo10.filter(at => at.rutinaria !=null && at.rutinaria == 'Sí');
      if(this.radioGra10==2)dataAnalisisRiesgo10= dataAnalisisRiesgo10.filter(at => at.rutinaria !=null && at.rutinaria == 'No');

      //nuevo
        dataAnalisisRiesgo10= dataAnalisisRiesgo10.filter(at => at.pais != null);
        dataAnalisisRiesgo10= dataAnalisisRiesgo10.filter(at => at.division != null);
        dataAnalisisRiesgo10= dataAnalisisRiesgo10.filter(at => at.planta != null);
        dataAnalisisRiesgo10= dataAnalisisRiesgo10.filter(at => at.area != null);
        if(this.selectPais10)if(this.selectPais10!='Corona Total')dataAnalisisRiesgo10 = dataAnalisisRiesgo10.filter(at => at.pais == this.selectPais10);
        if(this.selecteDivision10)dataAnalisisRiesgo10= dataAnalisisRiesgo10.filter(at => at.division == this.selecteDivision10);
        if(this.selecteLocalidad10)dataAnalisisRiesgo10= dataAnalisisRiesgo10.filter(at => at.planta == this.selecteLocalidad10);
        if(this.selecteArea10)if(this.selecteArea10.length>0){
          dataMPCopyDiv=[]
          this.selecteArea10.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo10.filter(at => at.area == element));
          });
          dataAnalisisRiesgo10=[...dataMPCopyDiv]
        }
      //fin nuevo
      let propiosTotal:number=0
      let temporalesTotal:number=0
      let contratistasTotal:number=0
      let totalTotal:number=0
      

      if(this.tipoPeligroItemList)
      for(const tipoPeligro of this.tipoPeligroItemList){

        let data:any = {
          name: tipoPeligro.label,
          series: []
        }
        // Ejecutado
        // Pendiente
        // let pendiente: number = 0
        let propios: number = dataAnalisisRiesgo10.filter(mp => mp.peligro === tipoPeligro.label).reduce((count, prop) => {
          return (count + Number(prop.propios));
        }, 0);

        let temporales: number = dataAnalisisRiesgo10.filter(mp => mp.peligro === tipoPeligro.label).reduce((count, prop) => {
          return (count + Number(prop.temporales));
        }, 0);

        let contratistas: number = dataAnalisisRiesgo10.filter(mp => mp.peligro === tipoPeligro.label).reduce((count, prop) => {
          return (count + Number(prop.contratistas));
        }, 0);

        let total: number = dataAnalisisRiesgo10.filter(mp => mp.peligro === tipoPeligro.label).reduce((count, prop) => {
          return (count + Number(prop.total));
        }, 0);
                
                                      
        
        propiosTotal +=propios
        temporalesTotal +=temporales
        contratistasTotal +=contratistas
        totalTotal +=total

        if(propios==0 && temporales==0 && contratistas==0 && total==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro7[0].value,
            value: propios
          });
          data.series.push({
            name: this.filtro7[1].value,
            value: temporales
          })
          data.series.push({
            name: this.filtro7[2].value,
            value: contratistas
          })
          data.series.push({
            name: this.filtro7[3].value,
            value: total
          })
          dataEventos10.push(data);
        }
      }


      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro7[0].value,
        value: propiosTotal
      });
      data.series.push({
        name: this.filtro7[1].value,
        value: temporalesTotal
      })
      data.series.push({
        name: this.filtro7[2].value,
        value: contratistasTotal
      })
      data.series.push({
        name: this.filtro7[3].value,
        value: totalTotal
      })

      dataEventos10.push(data);

      Object.assign(this, {dataEventos10});
      localStorage.setItem('dataEventos10', JSON.stringify(dataEventos10));
      this.filtroGraf10()
    }
  }
  filtroGraf10(){
    let dataEventos10: any[] = JSON.parse(localStorage.getItem('dataEventos10')!)

    if(this.selectePeligro10 && this.selectePeligro10.length > 0){
      let selectePeligro10=this.selectePeligro10.map((ele:any)=>ele.nombre)
      dataEventos10 = dataEventos10.filter(data => selectePeligro10.includes(data.name));
    }

    if(this.selectFiltro10 && this.selectFiltro10.length > 0){
      dataEventos10.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro10.includes(dataSeries.name));
      });
    }
    Object.assign(this, {dataEventos10}); 
  }
  grafData11(){
    let flagZero:boolean=false

    if(this.selectPais11){
      let dataAnalisisRiesgo11: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos11: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo11 = dataAnalisisRiesgo11.filter(at => at.fechaEdicion != null);

      if(this.radioGra11==1)dataAnalisisRiesgo11= dataAnalisisRiesgo11.filter(at => at.rutinaria !=null && at.rutinaria == 'Sí');
      if(this.radioGra11==2)dataAnalisisRiesgo11= dataAnalisisRiesgo11.filter(at => at.rutinaria !=null && at.rutinaria == 'No');

      //nuevo
        dataAnalisisRiesgo11= dataAnalisisRiesgo11.filter(at => at.pais != null);
        dataAnalisisRiesgo11= dataAnalisisRiesgo11.filter(at => at.division != null);
        dataAnalisisRiesgo11= dataAnalisisRiesgo11.filter(at => at.planta != null);
        dataAnalisisRiesgo11= dataAnalisisRiesgo11.filter(at => at.area != null);
        dataAnalisisRiesgo11 = dataAnalisisRiesgo11.filter(at => new Date(at.fechaEdicion).getFullYear() == this.selectAnio11);
        if(this.selectPais11)if(this.selectPais11!='Corona Total')dataAnalisisRiesgo11 = dataAnalisisRiesgo11.filter(at => at.pais == this.selectPais11);
        if(this.selecteDivision11)dataAnalisisRiesgo11= dataAnalisisRiesgo11.filter(at => at.division == this.selecteDivision11);
        if(this.selecteLocalidad11)dataAnalisisRiesgo11= dataAnalisisRiesgo11.filter(at => at.planta == this.selecteLocalidad11);
        if(this.selectePeligro11)if(this.selectePeligro11.length>0){
          dataMPCopyDiv=[]
          this.selectePeligro11.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo11.filter(at => at.peligro == element.nombre));
          });
          dataAnalisisRiesgo11=[...dataMPCopyDiv]
        }
        if(this.selecteArea11)if(this.selecteArea11.length>0){
          dataMPCopyDiv=[]
          this.selecteArea11.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo11.filter(at => at.area == element));
          });
          dataAnalisisRiesgo11=[...dataMPCopyDiv]
        }
      //fin nuevo
      let propiosTotal:number=0
      let temporalesTotal:number=0
      let contratistasTotal:number=0
      let totalTotal:number=0
      

      if(this.tipoPeligroItemList)
      for(const mes of this.meses){

        let data:any = {
          name: mes,
          series: []
        }
        // Ejecutado
        // Pendiente
        // let pendiente: number = 0
        let propios: number = dataAnalisisRiesgo11.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes).reduce((count, prop) => {
          return (count + Number(prop.propios));
        }, 0);

        let temporales: number = dataAnalisisRiesgo11.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes).reduce((count, prop) => {
          return (count + Number(prop.temporales));
        }, 0);

        let contratistas: number = dataAnalisisRiesgo11.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes).reduce((count, prop) => {
          return (count + Number(prop.contratistas));
        }, 0);

        let total: number = dataAnalisisRiesgo11.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes).reduce((count, prop) => {
          return (count + Number(prop.total));
        }, 0);
                
                                      
        
        propiosTotal +=propios
        temporalesTotal +=temporales
        contratistasTotal +=contratistas
        totalTotal +=total

        if(propios==0 && temporales==0 && contratistas==0 && total==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro7[0].value,
            value: propios
          });
          data.series.push({
            name: this.filtro7[1].value,
            value: temporales
          })
          data.series.push({
            name: this.filtro7[2].value,
            value: contratistas
          })
          data.series.push({
            name: this.filtro7[3].value,
            value: total
          })
          dataEventos11.push(data);
        }
      }


      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro7[0].value,
        value: propiosTotal
      });
      data.series.push({
        name: this.filtro7[1].value,
        value: temporalesTotal
      })
      data.series.push({
        name: this.filtro7[2].value,
        value: contratistasTotal
      })
      data.series.push({
        name: this.filtro7[3].value,
        value: totalTotal
      })

      dataEventos11.push(data);

      Object.assign(this, {dataEventos11});
      localStorage.setItem('dataEventos11', JSON.stringify(dataEventos11));
      this.filtroGraf11()
    }
  }
  filtroGraf11(){
    let dataEventos11: any[] = JSON.parse(localStorage.getItem('dataEventos11')!)

    if(this.selectMes11 && this.selectMes11.length > 0){
      dataEventos11 = dataEventos11.filter(data => this.selectMes11.includes(data.name));
    }

    if(this.selectFiltro11 && this.selectFiltro11.length > 0){
      dataEventos11.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro11.includes(dataSeries.name));
      });
    }

    Object.assign(this, {dataEventos11}); 
  }

  grafData12(){
    let flagZero:boolean=false

    if(this.selectPais12 && this.selectePeligro12){
      let dataAnalisisRiesgo12: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos12: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo12 = dataAnalisisRiesgo12.filter(at => at.fechaEdicion != null);

      if(this.desde1Graf12)dataAnalisisRiesgo12 = dataAnalisisRiesgo12.filter(at => new Date(at.fechaEdicion) >= new Date(this.desde1Graf12!));
      if(this.hasta1Graf12)dataAnalisisRiesgo12 = dataAnalisisRiesgo12.filter(at => new Date(at.fechaEdicion) <= new Date(this.hasta1Graf12!));

      if(this.radioGra12==1)dataAnalisisRiesgo12= dataAnalisisRiesgo12.filter(at => at.rutinaria !=null && at.rutinaria == 'Sí');
      if(this.radioGra12==2)dataAnalisisRiesgo12= dataAnalisisRiesgo12.filter(at => at.rutinaria !=null && at.rutinaria == 'No');

      //nuevo
        dataAnalisisRiesgo12= dataAnalisisRiesgo12.filter(at => at.pais != null);
        dataAnalisisRiesgo12= dataAnalisisRiesgo12.filter(at => at.division != null);
        dataAnalisisRiesgo12= dataAnalisisRiesgo12.filter(at => at.planta != null);
        dataAnalisisRiesgo12= dataAnalisisRiesgo12.filter(at => at.area != null);
        if(this.selectPais12)if(this.selectPais12!='Corona Total')dataAnalisisRiesgo12 = dataAnalisisRiesgo12.filter(at => at.pais == this.selectPais12);
        if(this.selecteDivision12)dataAnalisisRiesgo12= dataAnalisisRiesgo12.filter(at => at.division == this.selecteDivision12);
        if(this.selecteLocalidad12)dataAnalisisRiesgo12= dataAnalisisRiesgo12.filter(at => at.planta == this.selecteLocalidad12);
        if(this.selecteArea12)if(this.selecteArea12.length>0){
          dataMPCopyDiv=[]
          this.selecteArea12.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo12.filter(at => at.area == element));
          });
          dataAnalisisRiesgo12=[...dataMPCopyDiv]
        }
      //fin nuevo
      let propiosTotal:number=0
      let temporalesTotal:number=0
      let contratistasTotal:number=0
      let totalTotal:number=0
      

      if(this.tipoPeligroItemList)
      for(const Peligro of this.peligroItemList12){

        let data:any = {
          name: Peligro.label,
          series: []
        }

        let propios: number = dataAnalisisRiesgo12.filter(mp => mp.descripcionPeligro === Peligro.label).reduce((count, prop) => {
          return (count + Number(prop.propios));
        }, 0);

        let temporales: number = dataAnalisisRiesgo12.filter(mp => mp.descripcionPeligro === Peligro.label).reduce((count, prop) => {
          return (count + Number(prop.temporales));
        }, 0);

        let contratistas: number = dataAnalisisRiesgo12.filter(mp => mp.descripcionPeligro === Peligro.label).reduce((count, prop) => {
          return (count + Number(prop.contratistas));
        }, 0);

        let total: number = dataAnalisisRiesgo12.filter(mp => mp.descripcionPeligro === Peligro.label).reduce((count, prop) => {
          return (count + Number(prop.total));
        }, 0);
                
        propiosTotal +=propios
        temporalesTotal +=temporales
        contratistasTotal +=contratistas
        totalTotal +=total

        if(propios==0 && temporales==0 && contratistas==0 && total==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro7[0].value,
            value: propios
          });
          data.series.push({
            name: this.filtro7[1].value,
            value: temporales
          })
          data.series.push({
            name: this.filtro7[2].value,
            value: contratistas
          })
          data.series.push({
            name: this.filtro7[3].value,
            value: total
          })
          dataEventos12.push(data);
        }
      }

      dataEventos12=this.order(dataEventos12)
      dataEventos12=this.top(dataEventos12,10)

      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro7[0].value,
        value: propiosTotal
      });
      data.series.push({
        name: this.filtro7[1].value,
        value: temporalesTotal
      })
      data.series.push({
        name: this.filtro7[2].value,
        value: contratistasTotal
      })
      data.series.push({
        name: this.filtro7[3].value,
        value: totalTotal
      })

      dataEventos12.push(data);

      Object.assign(this, {dataEventos12});
      localStorage.setItem('dataEventos12', JSON.stringify(dataEventos12));
      this.filtroGraf12()
    }
  }
  filtroGraf12(){
    let dataEventos12: any[] = JSON.parse(localStorage.getItem('dataEventos12')!)

    if(this.selecteTipoPeligro12 && this.selecteTipoPeligro12.length > 0){
      dataEventos12 = dataEventos12.filter(data => this.selecteTipoPeligro12.includes(data.name));
    }

    if(this.selectFiltro12 && this.selectFiltro12.length > 0){
      dataEventos12.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro12.includes(dataSeries.name));
      });
    }
    Object.assign(this, {dataEventos12}); 
  }

  grafData13(){
    let flagZero:boolean=false

    if(this.selectPais13 && this.selectePeligro13){
      let dataAnalisisRiesgo13: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos13: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo13 = dataAnalisisRiesgo13.filter(at => at.fechaEdicion != null);

      if(this.radioGra13==1)dataAnalisisRiesgo13= dataAnalisisRiesgo13.filter(at => at.rutinaria !=null && at.rutinaria == 'Sí');
      if(this.radioGra13==2)dataAnalisisRiesgo13= dataAnalisisRiesgo13.filter(at => at.rutinaria !=null && at.rutinaria == 'No');

      //nuevo
        dataAnalisisRiesgo13= dataAnalisisRiesgo13.filter(at => at.pais != null);
        dataAnalisisRiesgo13= dataAnalisisRiesgo13.filter(at => at.division != null);
        dataAnalisisRiesgo13= dataAnalisisRiesgo13.filter(at => at.planta != null);
        dataAnalisisRiesgo13= dataAnalisisRiesgo13.filter(at => at.area != null);
        dataAnalisisRiesgo13 = dataAnalisisRiesgo13.filter(at => new Date(at.fechaEdicion).getFullYear() == this.selectAnio13);
        if(this.selectPais13)if(this.selectPais12!='Corona Total')dataAnalisisRiesgo13 = dataAnalisisRiesgo13.filter(at => at.pais == this.selectPais13);
        if(this.selecteDivision13)dataAnalisisRiesgo13= dataAnalisisRiesgo13.filter(at => at.division == this.selecteDivision13);
        if(this.selecteLocalidad13)dataAnalisisRiesgo13= dataAnalisisRiesgo13.filter(at => at.planta == this.selecteLocalidad13);
        if(this.selecteArea13)if(this.selecteArea13.length>0){
          dataMPCopyDiv=[]
          this.selecteArea13.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo13.filter(at => at.area == element));
          });
          dataAnalisisRiesgo13=[...dataMPCopyDiv]
        }
        if(this.selecteTipoPeligro13)if(this.selecteTipoPeligro13.length>0){
          dataMPCopyDiv=[]
          this.selecteTipoPeligro13.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo13.filter(at => at.descripcionPeligro == element));
          });
          dataAnalisisRiesgo13=[...dataMPCopyDiv]
        }
      //fin nuevo
      let propiosTotal:number=0
      let temporalesTotal:number=0
      let contratistasTotal:number=0
      let totalTotal:number=0
      

      if(this.tipoPeligroItemList)
      for(const mes of this.meses){

        let data:any = {
          name: mes,
          series: []
        }

        let propios: number = dataAnalisisRiesgo13.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes).reduce((count, prop) => {
          return (count + Number(prop.propios));
        }, 0);

        let temporales: number = dataAnalisisRiesgo13.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes).reduce((count, prop) => {
          return (count + Number(prop.temporales));
        }, 0);

        let contratistas: number = dataAnalisisRiesgo13.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes).reduce((count, prop) => {
          return (count + Number(prop.contratistas));
        }, 0);

        let total: number = dataAnalisisRiesgo13.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes).reduce((count, prop) => {
          return (count + Number(prop.total));
        }, 0);
                
        propiosTotal +=propios
        temporalesTotal +=temporales
        contratistasTotal +=contratistas
        totalTotal +=total

        if(propios==0 && temporales==0 && contratistas==0 && total==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro7[0].value,
            value: propios
          });
          data.series.push({
            name: this.filtro7[1].value,
            value: temporales
          })
          data.series.push({
            name: this.filtro7[2].value,
            value: contratistas
          })
          data.series.push({
            name: this.filtro7[3].value,
            value: total
          })
          dataEventos13.push(data);
        }
      }
      dataEventos13=this.order(dataEventos13)
      dataEventos13=this.top(dataEventos13,10)
      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro7[0].value,
        value: propiosTotal
      });
      data.series.push({
        name: this.filtro7[1].value,
        value: temporalesTotal
      })
      data.series.push({
        name: this.filtro7[2].value,
        value: contratistasTotal
      })
      data.series.push({
        name: this.filtro7[3].value,
        value: totalTotal
      })

      dataEventos13.push(data);

      Object.assign(this, {dataEventos13});
      localStorage.setItem('dataEventos13', JSON.stringify(dataEventos13));
      this.filtroGraf13()
    }
  }
  filtroGraf13(){
    let dataEventos13: any[] = JSON.parse(localStorage.getItem('dataEventos13')!)

    if(this.selectMes13 && this.selectMes13.length > 0){
      dataEventos13 = dataEventos13.filter(data => this.selectMes13.includes(data.name));
    }

    if(this.selectFiltro13 && this.selectFiltro13.length > 0){
      dataEventos13.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro13.includes(dataSeries.name));
      });
    }

    Object.assign(this, {dataEventos13}); 
  }
  grafData14(){
    let flagZero:boolean=false

    if(this.selectPais14 == 'Corona Total' || this.selecteDivision14 == 'Total' || this.selecteLocalidad14){
      let dataAnalisisRiesgo14: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos14: any[] = [];

      let ejeY:any
      let variableText:any
      if(this.selectPais14 == 'Corona Total'){
        ejeY=[...this.divisionList14] 
        variableText='division'
      }
      if(this.selecteDivision14 == 'Total'){
        ejeY=[...this.localidadesList14]
        variableText='planta'
      }
      if(this.selecteLocalidad14){
        ejeY=[...this.areasList14]
        variableText='area'
      }

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo14 = dataAnalisisRiesgo14.filter(at => at.fechaEdicion != null);

      if(this.desde1Graf14)dataAnalisisRiesgo14 = dataAnalisisRiesgo14.filter(at => new Date(at.fechaEdicion) >= new Date(this.desde1Graf14!));
      if(this.hasta1Graf14)dataAnalisisRiesgo14 = dataAnalisisRiesgo14.filter(at => new Date(at.fechaEdicion) <= new Date(this.hasta1Graf14!));

      //nuevo
        dataAnalisisRiesgo14= dataAnalisisRiesgo14.filter(at => at.pais != null);
        dataAnalisisRiesgo14= dataAnalisisRiesgo14.filter(at => at.division != null);
        dataAnalisisRiesgo14= dataAnalisisRiesgo14.filter(at => at.planta != null);
        dataAnalisisRiesgo14= dataAnalisisRiesgo14.filter(at => at.area != null);
        if(this.selectPais14)if(this.selectPais14!='Corona Total')dataAnalisisRiesgo14= dataAnalisisRiesgo14.filter(at => at.pais == this.selectPais14);
        if(this.selectePeligro14)if(this.selectePeligro14.length>0){
          dataMPCopyDiv=[]
          this.selectePeligro14.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo14.filter(at => at.peligro == element.nombre));
          });
          dataAnalisisRiesgo14=[...dataMPCopyDiv]
        }
      //fin nuevo
      let controlAdmTotal:number=0
      let controlIngTotal:number=0
      let controlEPPTotal:number=0      

      for(const y of ejeY){

        let data:any = {
          name: y.label,
          series: []
        }

        let controlAdm: number = dataAnalisisRiesgo14.filter(mp => mp[variableText] === y.label && mp.administrativos !=null).reduce((count, adm) => {
          return (count + JSON.parse(adm.administrativos).length);
        }, 0);

        dataAnalisisRiesgo14.filter(mp => mp[variableText] === y.label).forEach(mp=>{
          let planAccion = (<Array<any>>JSON.parse(mp.planAccion))
          if(planAccion && planAccion.length>0)controlAdm+= planAccion.filter(p => (p.jerarquia === 'Controles administrativos' && p.estado=='Ejecutado')).length
        }) 

        let controlIng: number = dataAnalisisRiesgo14.filter(mp => mp[variableText] === y.label && mp.ingenieria !=null).reduce((count, adm) => {
          return (count + JSON.parse(adm.ingenieria).length);
        }, 0);

        dataAnalisisRiesgo14.filter(mp => mp[variableText] === y.label).forEach(mp=>{
          let planAccion = (<Array<any>>JSON.parse(mp.planAccion))
          if(planAccion && planAccion.length>0)controlIng+= planAccion.filter(p => (p.jerarquia === 'Control de ingeniería' && p.estado=='Ejecutado')).length
        }) 

        let controlEPP: number = dataAnalisisRiesgo14.filter(mp => mp[variableText] === y.label && mp.elementospro !=null).reduce((count, adm) => {
          return (count + JSON.parse(adm.elementospro).length);
        }, 0);

        dataAnalisisRiesgo14.filter(mp => mp[variableText] === y.label).forEach(mp=>{
          let planAccion = (<Array<any>>JSON.parse(mp.planAccion))
          if(planAccion && planAccion.length>0)controlEPP+= planAccion.filter(p => (p.jerarquia === 'Elementos de protección personal' && p.estado=='Ejecutado')).length
        }) 

        controlAdmTotal+=controlAdm
        controlIngTotal+=controlIng
        controlEPPTotal+=controlEPP
        

        if(controlAdm==0 && controlIng==0 && controlEPP==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro13[0].value,
            value: controlAdm
          });
          data.series.push({
            name: this.filtro13[1].value,
            value: controlIng
          })
          data.series.push({
            name: this.filtro13[2].value,
            value: controlEPP
          })
          dataEventos14.push(data);
        }
      }


      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro13[0].value,
        value: controlAdmTotal
      });
      data.series.push({
        name: this.filtro13[1].value,
        value: controlIngTotal
      })
      data.series.push({
        name: this.filtro13[2].value,
        value: controlEPPTotal
      })

      dataEventos14.push(data);

      Object.assign(this, {dataEventos14});
      localStorage.setItem('dataEventos14', JSON.stringify(dataEventos14));
      this.filtroGraf14()
    }
  }
  filtroGraf14(){
    let dataEventos14: any[] = JSON.parse(localStorage.getItem('dataEventos14')!)

    if(this.selectPais14 == 'Corona Total' && this.selecteDivision14 != 'Total'){
      if(this.selecteDivision14 && this.selecteDivision14.length > 0){
        dataEventos14 = dataEventos14.filter(data => this.selecteDivision14.includes(data.name));
      }
    }else if(this.selecteDivision14 == 'Total')
      if(this.selecteLocalidad14 && this.selecteLocalidad14.length > 0){
        dataEventos14 = dataEventos14.filter(data => this.selecteLocalidad14.includes(data.name));
      }

    if(this.selectPais14 != 'Corona Total' && this.selecteDivision14 != 'Total')
      if(this.selecteArea14 && this.selecteArea14.length > 0){
        dataEventos14 = dataEventos14.filter(data => this.selecteArea14.includes(data.name));
      }

      if(this.selectFiltro14 && this.selectFiltro14.length > 0){
        dataEventos14.forEach(de1 => {
          de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro14.includes(dataSeries.name));
        });
      }

   Object.assign(this, {dataEventos14}); 
  }
  grafData15(){
    let flagZero:boolean=false

    if(this.selectPais15){
      let dataAnalisisRiesgo15: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos15: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo15 = dataAnalisisRiesgo15.filter(at => at.fechaEdicion != null);

      if(this.desde1Graf15)dataAnalisisRiesgo15 = dataAnalisisRiesgo15.filter(at => new Date(at.fechaEdicion) >= new Date(this.desde1Graf15!));
      if(this.hasta1Graf15)dataAnalisisRiesgo15 = dataAnalisisRiesgo15.filter(at => new Date(at.fechaEdicion) <= new Date(this.hasta1Graf15!));

      //nuevo
        dataAnalisisRiesgo15= dataAnalisisRiesgo15.filter(at => at.pais != null);
        dataAnalisisRiesgo15= dataAnalisisRiesgo15.filter(at => at.division != null);
        dataAnalisisRiesgo15= dataAnalisisRiesgo15.filter(at => at.planta != null);
        dataAnalisisRiesgo15= dataAnalisisRiesgo15.filter(at => at.area != null);
        if(this.selectPais15)if(this.selectPais15!='Corona Total')dataAnalisisRiesgo15 = dataAnalisisRiesgo15.filter(at => at.pais == this.selectPais15);
        if(this.selecteDivision15)dataAnalisisRiesgo15= dataAnalisisRiesgo15.filter(at => at.division == this.selecteDivision15);
        if(this.selecteLocalidad15)dataAnalisisRiesgo15= dataAnalisisRiesgo15.filter(at => at.planta == this.selecteLocalidad15);
        if(this.selecteArea15)if(this.selecteArea15.length>0){
          dataMPCopyDiv=[]
          this.selecteArea15.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo15.filter(at => at.area == element));
          });
          dataAnalisisRiesgo15=[...dataMPCopyDiv]
        }
      //fin nuevo
      let controlAdmTotal:number=0
      let controlIngTotal:number=0
      let controlEPPTotal:number=0      

      if(this.tipoPeligroItemList)
      for(const tipoPeligro of this.tipoPeligroItemList){

        let data:any = {
          name: tipoPeligro.label,
          series: []
        }

        let controlAdm: number = dataAnalisisRiesgo15.filter(mp => mp.peligro === tipoPeligro.label && mp.administrativos !=null).reduce((count, adm) => {
          return (count + JSON.parse(adm.administrativos).length);
        }, 0);

        dataAnalisisRiesgo15.filter(mp => mp.peligro === tipoPeligro.label).forEach(mp=>{
          let planAccion = (<Array<any>>JSON.parse(mp.planAccion))
          if(planAccion && planAccion.length>0)controlAdm+= planAccion.filter(p => (p.jerarquia === 'Controles administrativos' && p.estado=='Ejecutado')).length
        }) 

        let controlIng: number = dataAnalisisRiesgo15.filter(mp => mp.peligro === tipoPeligro.label && mp.ingenieria !=null).reduce((count, adm) => {
          return (count + JSON.parse(adm.ingenieria).length);
        }, 0);

        dataAnalisisRiesgo15.filter(mp => mp.peligro === tipoPeligro.label).forEach(mp=>{
          let planAccion = (<Array<any>>JSON.parse(mp.planAccion))
          if(planAccion && planAccion.length>0)controlIng+= planAccion.filter(p => (p.jerarquia === 'Control de ingeniería' && p.estado=='Ejecutado')).length
        }) 

        let controlEPP: number = dataAnalisisRiesgo15.filter(mp => mp.peligro === tipoPeligro.label && mp.elementospro !=null).reduce((count, adm) => {
          return (count + JSON.parse(adm.elementospro).length);
        }, 0);

        dataAnalisisRiesgo15.filter(mp => mp.peligro === tipoPeligro.label).forEach(mp=>{
          let planAccion = (<Array<any>>JSON.parse(mp.planAccion))
          if(planAccion && planAccion.length>0)controlEPP+= planAccion.filter(p => (p.jerarquia === 'Elementos de protección personal' && p.estado=='Ejecutado')).length
        }) 

        controlAdmTotal+=controlAdm
        controlIngTotal+=controlIng
        controlEPPTotal+=controlEPP
        

        if(controlAdm==0 && controlIng==0 && controlEPP==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro13[0].value,
            value: controlAdm
          });
          data.series.push({
            name: this.filtro13[1].value,
            value: controlIng
          })
          data.series.push({
            name: this.filtro13[2].value,
            value: controlEPP
          })
          dataEventos15.push(data);
        }
      }


      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro13[0].value,
        value: controlAdmTotal
      });
      data.series.push({
        name: this.filtro13[1].value,
        value: controlIngTotal
      })
      data.series.push({
        name: this.filtro13[2].value,
        value: controlEPPTotal
      })

      dataEventos15.push(data);

      Object.assign(this, {dataEventos15});
      localStorage.setItem('dataEventos15', JSON.stringify(dataEventos15));
      this.filtroGraf15()
    }
  }
  filtroGraf15(){
    let dataEventos15: any[] = JSON.parse(localStorage.getItem('dataEventos15')!)

    if(this.selectePeligro15 && this.selectePeligro15.length > 0){
      let selectePeligro15=this.selectePeligro15.map((ele:any)=>ele.nombre)
      dataEventos15 = dataEventos15.filter(data => selectePeligro15.includes(data.name));
    }

    if(this.selectFiltro15 && this.selectFiltro15.length > 0){
      dataEventos15.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro15.includes(dataSeries.name));
      });
    }
    Object.assign(this, {dataEventos15}); 
  }
  grafData16(){
    let flagZero:boolean=false

    if(this.selectPais16){
      let dataAnalisisRiesgo16: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos16: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo16 = dataAnalisisRiesgo16.filter(at => at.fechaEdicion != null);

      //nuevo
        dataAnalisisRiesgo16= dataAnalisisRiesgo16.filter(at => at.pais != null);
        dataAnalisisRiesgo16= dataAnalisisRiesgo16.filter(at => at.division != null);
        dataAnalisisRiesgo16= dataAnalisisRiesgo16.filter(at => at.planta != null);
        dataAnalisisRiesgo16= dataAnalisisRiesgo16.filter(at => at.area != null);
        if(this.selectPais16)if(this.selectPais16!='Corona Total')dataAnalisisRiesgo16 = dataAnalisisRiesgo16.filter(at => at.pais == this.selectPais16);
        if(this.selecteDivision16)dataAnalisisRiesgo16= dataAnalisisRiesgo16.filter(at => at.division == this.selecteDivision16);
        if(this.selecteLocalidad16)dataAnalisisRiesgo16= dataAnalisisRiesgo16.filter(at => at.planta == this.selecteLocalidad16);
        if(this.selecteArea16)if(this.selecteArea16.length>0){
          dataMPCopyDiv=[]
          this.selecteArea16.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo16.filter(at => at.area == element));
          });
          dataAnalisisRiesgo16=[...dataMPCopyDiv]
        }
        if(this.selectePeligro16)if(this.selectePeligro16.length>0){
          dataMPCopyDiv=[]
          this.selectePeligro16.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo16.filter(at => at.peligro == element.nombre));
          });
          dataAnalisisRiesgo16=[...dataMPCopyDiv]
        }
      //fin nuevo
      let controlAdmTotal:number=0
      let controlIngTotal:number=0
      let controlEPPTotal:number=0      

      if(this.tipoPeligroItemList)
      for(const mes of this.meses){

        let data:any = {
          name: mes,
          series: []
        }

        let controlAdm: number = dataAnalisisRiesgo16.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp.administrativos !=null).reduce((count, adm) => {
          return (count + JSON.parse(adm.administrativos).length);
        }, 0);

        dataAnalisisRiesgo16.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes).forEach(mp=>{
          let planAccion = (<Array<any>>JSON.parse(mp.planAccion))
          if(planAccion && planAccion.length>0)controlAdm+= planAccion.filter(p => (p.jerarquia === 'Controles administrativos' && p.estado=='Ejecutado')).length
        }) 

        let controlIng: number = dataAnalisisRiesgo16.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp.ingenieria !=null).reduce((count, adm) => {
          return (count + JSON.parse(adm.ingenieria).length);
        }, 0);

        dataAnalisisRiesgo16.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes).forEach(mp=>{
          let planAccion = (<Array<any>>JSON.parse(mp.planAccion))
          if(planAccion && planAccion.length>0)controlIng+= planAccion.filter(p => (p.jerarquia === 'Control de ingeniería' && p.estado=='Ejecutado')).length
        }) 

        let controlEPP: number = dataAnalisisRiesgo16.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp.elementospro !=null).reduce((count, adm) => {
          return (count + JSON.parse(adm.elementospro).length);
        }, 0);

        dataAnalisisRiesgo16.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes).forEach(mp=>{
          let planAccion = (<Array<any>>JSON.parse(mp.planAccion))
          if(planAccion && planAccion.length>0)controlEPP+= planAccion.filter(p => (p.jerarquia === 'Elementos de protección personal' && p.estado=='Ejecutado')).length
        }) 

        controlAdmTotal+=controlAdm
        controlIngTotal+=controlIng
        controlEPPTotal+=controlEPP
        

        if(controlAdm==0 && controlIng==0 && controlEPP==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro13[0].value,
            value: controlAdm
          });
          data.series.push({
            name: this.filtro13[1].value,
            value: controlIng
          })
          data.series.push({
            name: this.filtro13[2].value,
            value: controlEPP
          })
          dataEventos16.push(data);
        }
      }


      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro13[0].value,
        value: controlAdmTotal
      });
      data.series.push({
        name: this.filtro13[1].value,
        value: controlIngTotal
      })
      data.series.push({
        name: this.filtro13[2].value,
        value: controlEPPTotal
      })

      dataEventos16.push(data);

      Object.assign(this, {dataEventos16});
      localStorage.setItem('dataEventos16', JSON.stringify(dataEventos16));
      this.filtroGraf16()
    }
  }
  filtroGraf16(){
    let dataEventos16: any[] = JSON.parse(localStorage.getItem('dataEventos16')!)

    if(this.selectMes16 && this.selectMes16.length > 0){
      dataEventos16 = dataEventos16.filter(data => this.selectMes16.includes(data.name));
    }

    if(this.selectFiltro16 && this.selectFiltro16.length > 0){
      dataEventos16.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro16.includes(dataSeries.name));
      });
    }
    Object.assign(this, {dataEventos16}); 
  }
  grafData17(){
    let flagZero:boolean=false

    if(this.selectPais17 == 'Corona Total' || this.selecteDivision17 == 'Total' || this.selecteLocalidad17){
      let dataAnalisisRiesgo17: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos17: any[] = [];

      let ejeY:any
      let variableText:any
      if(this.selectPais17 == 'Corona Total'){
        ejeY=[...this.divisionList17] 
        variableText='division'
      }
      if(this.selecteDivision17 == 'Total'){
        ejeY=[...this.localidadesList17]
        variableText='planta'
      }
      if(this.selecteLocalidad17){
        ejeY=[...this.areasList17]
        variableText='area'
      }

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo17 = dataAnalisisRiesgo17.filter(at => at.fechaEdicion != null);

      if(this.desde1Graf17)dataAnalisisRiesgo17 = dataAnalisisRiesgo17.filter(at => new Date(at.fechaEdicion) >= new Date(this.desde1Graf17!));
      if(this.hasta1Graf17)dataAnalisisRiesgo17 = dataAnalisisRiesgo17.filter(at => new Date(at.fechaEdicion) <= new Date(this.hasta1Graf17!));

      //nuevo
        dataAnalisisRiesgo17= dataAnalisisRiesgo17.filter(at => at.pais != null);
        dataAnalisisRiesgo17= dataAnalisisRiesgo17.filter(at => at.division != null);
        dataAnalisisRiesgo17= dataAnalisisRiesgo17.filter(at => at.planta != null);
        dataAnalisisRiesgo17= dataAnalisisRiesgo17.filter(at => at.area != null);
        dataAnalisisRiesgo17= dataAnalisisRiesgo17.filter(at => at.accmayor != null);
        if(this.selectPais17)if(this.selectPais17!='Corona Total')dataAnalisisRiesgo17 = dataAnalisisRiesgo17.filter(at => at.pais == this.selectPais17);
        if(this.selectePeligro17)if(this.selectePeligro17.length>0){
          dataMPCopyDiv=[]
          this.selectePeligro17.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo17.filter(at => at.peligro == element.nombre));
          });
          dataAnalisisRiesgo17=[...dataMPCopyDiv]
        }
      //fin nuevo
      let siTotal:number=0
      let noTotal:number=0

      for(const y of ejeY){

        let data:any = {
          name: y.label,
          series: []
        }

        let si: number = dataAnalisisRiesgo17.filter(mp => mp[variableText] === y.label && mp.accmayor=='Sí').length
        let no: number = dataAnalisisRiesgo17.filter(mp => mp[variableText] === y.label && mp.accmayor=='No').length
                
        siTotal +=si
        noTotal +=no

        if(si==0 && no==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro15[0].value,
            value: si
          });
          data.series.push({
            name: this.filtro15[1].value,
            value: no
          })
          dataEventos17.push(data);
        }
      }


      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro15[0].value,
        value: siTotal
      });
      data.series.push({
        name: this.filtro15[1].value,
        value: noTotal
      })

      dataEventos17.push(data);

      Object.assign(this, {dataEventos17});
      localStorage.setItem('dataEventos17', JSON.stringify(dataEventos17));
      this.filtroGraf17()
    }
  }
  filtroGraf17(){
    let dataEventos17: any[] = JSON.parse(localStorage.getItem('dataEventos17')!)

    if(this.selectPais17 == 'Corona Total' && this.selecteDivision17 != 'Total'){
      if(this.selecteDivision17 && this.selecteDivision17.length > 0){
        dataEventos17 = dataEventos17.filter(data => this.selecteDivision17.includes(data.name));
      }
    }else if(this.selecteDivision17 == 'Total')
      if(this.selecteLocalidad17 && this.selecteLocalidad17.length > 0){
        dataEventos17 = dataEventos17.filter(data => this.selecteLocalidad17.includes(data.name));
      }

    if(this.selectPais17 != 'Corona Total' && this.selecteDivision17 != 'Total')
      if(this.selecteArea17 && this.selecteArea17.length > 0){
        dataEventos17 = dataEventos17.filter(data => this.selecteArea17.includes(data.name));
      }

      if(this.selectFiltro17 && this.selectFiltro17.length > 0){
        dataEventos17.forEach(de1 => {
          de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro17.includes(dataSeries.name));
        });
      }

   Object.assign(this, {dataEventos17}); 
  }
  grafData18(){
    let flagZero:boolean=false

    if(this.selectPais18){
      let dataAnalisisRiesgo18: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos18: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo18 = dataAnalisisRiesgo18.filter(at => at.fechaEdicion != null);

      if(this.desde1Graf18)dataAnalisisRiesgo18 = dataAnalisisRiesgo18.filter(at => new Date(at.fechaEdicion) >= new Date(this.desde1Graf18!));
      if(this.hasta1Graf18)dataAnalisisRiesgo18 = dataAnalisisRiesgo18.filter(at => new Date(at.fechaEdicion) <= new Date(this.hasta1Graf18!));

      //nuevo
        dataAnalisisRiesgo18= dataAnalisisRiesgo18.filter(at => at.pais != null);
        dataAnalisisRiesgo18= dataAnalisisRiesgo18.filter(at => at.division != null);
        dataAnalisisRiesgo18= dataAnalisisRiesgo18.filter(at => at.planta != null);
        dataAnalisisRiesgo18= dataAnalisisRiesgo18.filter(at => at.area != null);
        dataAnalisisRiesgo18= dataAnalisisRiesgo18.filter(at => at.accmayor != null);
        if(this.selectPais18)if(this.selectPais18!='Corona Total')dataAnalisisRiesgo18 = dataAnalisisRiesgo18.filter(at => at.pais == this.selectPais18);
        if(this.selecteDivision18)dataAnalisisRiesgo18= dataAnalisisRiesgo18.filter(at => at.division == this.selecteDivision18);
        if(this.selecteLocalidad18)dataAnalisisRiesgo18= dataAnalisisRiesgo18.filter(at => at.planta == this.selecteLocalidad18);
        if(this.selecteArea18)if(this.selecteArea18.length>0){
          dataMPCopyDiv=[]
          this.selecteArea18.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo18.filter(at => at.area == element));
          });
          dataAnalisisRiesgo18=[...dataMPCopyDiv]
        }
      //fin nuevo
      let siTotal:number=0
      let noTotal:number=0
      
      if(this.tipoPeligroItemList)
      for(const tipoPeligro of this.tipoPeligroItemList){

        let data:any = {
          name: tipoPeligro.label,
          series: []
        }

        let si: number = dataAnalisisRiesgo18.filter(mp => mp.peligro === tipoPeligro.label && mp.accmayor=='Sí').length
        let no: number = dataAnalisisRiesgo18.filter(mp => mp.peligro === tipoPeligro.label && mp.accmayor=='No').length
                
        siTotal +=si
        noTotal +=no

        if(si==0 && no==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro15[0].value,
            value: si
          });
          data.series.push({
            name: this.filtro15[1].value,
            value: no
          })
          dataEventos18.push(data);
        }
      }


      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro15[0].value,
        value: siTotal
      });
      data.series.push({
        name: this.filtro15[1].value,
        value: noTotal
      })

      dataEventos18.push(data);

      Object.assign(this, {dataEventos18});
      localStorage.setItem('dataEventos18', JSON.stringify(dataEventos18));
      this.filtroGraf18()
    }
  }
  filtroGraf18(){
    let dataEventos18: any[] = JSON.parse(localStorage.getItem('dataEventos18')!)

    if(this.selectePeligro18 && this.selectePeligro18.length > 0){
      let selectePeligro18=this.selectePeligro18.map((ele:any)=>ele.nombre)
      dataEventos18 = dataEventos18.filter(data => selectePeligro18.includes(data.name));
    }

    if(this.selectFiltro18 && this.selectFiltro18.length > 0){
      dataEventos18.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro18.includes(dataSeries.name));
      });
    }
    Object.assign(this, {dataEventos18}); 
  }
  grafData19(){
    let flagZero:boolean=false

    if(this.selectPais19){
      let dataAnalisisRiesgo19: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos19: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo19 = dataAnalisisRiesgo19.filter(at => at.fechaEdicion != null);


      //nuevo
        dataAnalisisRiesgo19= dataAnalisisRiesgo19.filter(at => at.pais != null);
        dataAnalisisRiesgo19= dataAnalisisRiesgo19.filter(at => at.division != null);
        dataAnalisisRiesgo19= dataAnalisisRiesgo19.filter(at => at.planta != null);
        dataAnalisisRiesgo19= dataAnalisisRiesgo19.filter(at => at.area != null);
        dataAnalisisRiesgo19= dataAnalisisRiesgo19.filter(at => at.accmayor != null);
        dataAnalisisRiesgo19 = dataAnalisisRiesgo19.filter(at => new Date(at.fechaEdicion).getFullYear() == this.selectAnio19);
        if(this.selectPais19)if(this.selectPais19!='Corona Total')dataAnalisisRiesgo19 = dataAnalisisRiesgo19.filter(at => at.pais == this.selectPais19);
        if(this.selecteDivision19)dataAnalisisRiesgo19= dataAnalisisRiesgo19.filter(at => at.division == this.selecteDivision19);
        if(this.selecteLocalidad19)dataAnalisisRiesgo19= dataAnalisisRiesgo19.filter(at => at.planta == this.selecteLocalidad19);
        if(this.selecteArea19)if(this.selecteArea19.length>0){
          dataMPCopyDiv=[]
          this.selecteArea19.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo19.filter(at => at.area == element));
          });
          dataAnalisisRiesgo19=[...dataMPCopyDiv]
        }
        if(this.selectePeligro19)if(this.selectePeligro19.length>0){
          dataMPCopyDiv=[]
          this.selectePeligro19.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo19.filter(at => at.peligro == element.nombre));
          });
          dataAnalisisRiesgo19=[...dataMPCopyDiv]
        }
      //fin nuevo
      let siTotal:number=0
      let noTotal:number=0
      
      if(this.tipoPeligroItemList)
      for(const mes of this.meses){

        let data:any = {
          name: mes,
          series: []
        }

        let si: number = dataAnalisisRiesgo19.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp.accmayor=='Sí').length
        let no: number = dataAnalisisRiesgo19.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp.accmayor=='No').length
                
        siTotal +=si
        noTotal +=no

        if(si==0 && no==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro15[0].value,
            value: si
          });
          data.series.push({
            name: this.filtro15[1].value,
            value: no
          })
          dataEventos19.push(data);
        }
      }


      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro15[0].value,
        value: siTotal
      });
      data.series.push({
        name: this.filtro15[1].value,
        value: noTotal
      })

      dataEventos19.push(data);

      Object.assign(this, {dataEventos19});
      localStorage.setItem('dataEventos19', JSON.stringify(dataEventos19));
      this.filtroGraf19()
    }
  }
  filtroGraf19(){
    let dataEventos19: any[] = JSON.parse(localStorage.getItem('dataEventos19')!)

    if(this.selectMes19 && this.selectMes19.length > 0){
      dataEventos19 = dataEventos19.filter(data => this.selectMes19.includes(data.name));
    }

    if(this.selectFiltro19 && this.selectFiltro19.length > 0){
      dataEventos19.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro19.includes(dataSeries.name));
      });
    }

    Object.assign(this, {dataEventos19}); 
  }
  grafData20(){
    let flagZero:boolean=false

    if(this.selectPais20 == 'Corona Total' || this.selecteDivision20 == 'Total' || this.selecteLocalidad20){
      let dataAnalisisRiesgo20: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos20: any[] = [];

      let ejeY:any
      let variableText:any
      if(this.selectPais20 == 'Corona Total'){
        ejeY=[...this.divisionList20] 
        variableText='division'
      }
      if(this.selecteDivision20 == 'Total'){
        ejeY=[...this.localidadesList20]
        variableText='planta'
      }
      if(this.selecteLocalidad20){
        ejeY=[...this.areasList20]
        variableText='area'
      }

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo20 = dataAnalisisRiesgo20.filter(at => at.fechaEdicion != null);

      if(this.desde1Graf20)dataAnalisisRiesgo20 = dataAnalisisRiesgo20.filter(at => new Date(at.fechaEdicion) >= new Date(this.desde1Graf20!));
      if(this.hasta1Graf20)dataAnalisisRiesgo20 = dataAnalisisRiesgo20.filter(at => new Date(at.fechaEdicion) <= new Date(this.hasta1Graf20!));

      //nuevo
        dataAnalisisRiesgo20= dataAnalisisRiesgo20.filter(at => at.pais != null);
        dataAnalisisRiesgo20= dataAnalisisRiesgo20.filter(at => at.division != null);
        dataAnalisisRiesgo20= dataAnalisisRiesgo20.filter(at => at.planta != null);
        dataAnalisisRiesgo20= dataAnalisisRiesgo20.filter(at => at.area != null);
        if(this.selectPais20)if(this.selectPais20!='Corona Total')dataAnalisisRiesgo20 = dataAnalisisRiesgo20.filter(at => at.pais == this.selectPais20);
        if(this.selectePeligro20)if(this.selectePeligro20.length>0){
          dataMPCopyDiv=[]
          this.selectePeligro20.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo20.filter(at => at.peligro == element.nombre));
          });
          dataAnalisisRiesgo20=[...dataMPCopyDiv]
        }
      //fin nuevo
      let gpiTotal:number=0
      let gpfTotal:number=0

      for(const y of ejeY){

        let data:any = {
          name: y.label,
          series: []
        }

        let gpi: number = dataAnalisisRiesgo20.filter(mp => mp[variableText] === y.label && mp.nrInicial != null).reduce((count, ini) => {
          return (count + Number(ini.nrInicial));
        }, 0);
        let gpf: number = dataAnalisisRiesgo20.filter(mp => mp[variableText] === y.label && mp.nrInicial != null).reduce((count, fin) => {
          return (count + (fin.estado == 'Riesgo eliminado')?0:((fin.nrResidual)?Number(fin.nrResidual):Number(fin.nrInicial)));
        }, 0);
                
        gpiTotal +=gpi
        gpfTotal +=gpf

        if(gpi==0 && gpf==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro16[0].value,
            value: gpi
          });
          data.series.push({
            name: this.filtro16[1].value,
            value: gpf
          })
          dataEventos20.push(data);
        }
      }


      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro16[0].value,
        value: gpiTotal
      });
      data.series.push({
        name: this.filtro16[1].value,
        value: gpfTotal
      })

      dataEventos20.push(data);

      Object.assign(this, {dataEventos20});
      localStorage.setItem('dataEventos20', JSON.stringify(dataEventos20));
      this.filtroGraf20()
    }
  }
  filtroGraf20(){
    let dataEventos20: any[] = JSON.parse(localStorage.getItem('dataEventos20')!)

    if(this.selectPais20 == 'Corona Total' && this.selecteDivision20 != 'Total'){
      if(this.selecteDivision20 && this.selecteDivision20.length > 0){
        dataEventos20 = dataEventos20.filter(data => this.selecteDivision20.includes(data.name));
      }
    }else if(this.selecteDivision20 == 'Total')
      if(this.selecteLocalidad20 && this.selecteLocalidad20.length > 0){
        dataEventos20 = dataEventos20.filter(data => this.selecteLocalidad20.includes(data.name));
      }

    if(this.selectPais20 != 'Corona Total' && this.selecteDivision20 != 'Total')
      if(this.selecteArea20 && this.selecteArea20.length > 0){
        dataEventos20 = dataEventos20.filter(data => this.selecteArea20.includes(data.name));
      }

      if(this.selectFiltro20 && this.selectFiltro20.length > 0){
        dataEventos20.forEach(de1 => {
          de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro20.includes(dataSeries.name));
        });
      }

   Object.assign(this, {dataEventos20}); 
  }
  grafData21(){
    let flagZero:boolean=false

    if(this.selectPais21){
      let dataAnalisisRiesgo21: any[] = JSON.parse(localStorage.getItem('dataMP')!);

      let dataEventos21: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo21 = dataAnalisisRiesgo21.filter(at => at.fechaEdicion != null);

      if(this.desde1Graf21)dataAnalisisRiesgo21 = dataAnalisisRiesgo21.filter(at => new Date(at.fechaEdicion) >= new Date(this.desde1Graf21!));
      if(this.hasta1Graf21)dataAnalisisRiesgo21 = dataAnalisisRiesgo21.filter(at => new Date(at.fechaEdicion) <= new Date(this.hasta1Graf21!));

      //nuevo
        dataAnalisisRiesgo21= dataAnalisisRiesgo21.filter(at => at.pais != null);
        dataAnalisisRiesgo21= dataAnalisisRiesgo21.filter(at => at.division != null);
        dataAnalisisRiesgo21= dataAnalisisRiesgo21.filter(at => at.planta != null);
        dataAnalisisRiesgo21= dataAnalisisRiesgo21.filter(at => at.area != null);
        if(this.selectPais21)if(this.selectPais21!='Corona Total')dataAnalisisRiesgo21 = dataAnalisisRiesgo21.filter(at => at.pais == this.selectPais21);
        if(this.selecteDivision21)dataAnalisisRiesgo21= dataAnalisisRiesgo21.filter(at => at.division == this.selecteDivision21);
        if(this.selecteLocalidad21)dataAnalisisRiesgo21= dataAnalisisRiesgo21.filter(at => at.planta == this.selecteLocalidad21);
        if(this.selecteArea21)if(this.selecteArea21.length>0){
          dataMPCopyDiv=[]
          this.selecteArea21.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo21.filter(at => at.area == element));
          });
          dataAnalisisRiesgo21=[...dataMPCopyDiv]
        }
      //fin nuevo
      let gpiTotal:number=0
      let gpfTotal:number=0
      
      if(this.tipoPeligroItemList)
      for(const tipoPeligro of this.tipoPeligroItemList){

        let data:any = {
          name: tipoPeligro.label,
          series: []
        }

        let gpi: number = dataAnalisisRiesgo21.filter(mp => mp.peligro === tipoPeligro.label && mp.nrInicial != null).reduce((count, ini) => {
          return (count + Number(ini.nrInicial));
        }, 0);
        let gpf: number = dataAnalisisRiesgo21.filter(mp => mp.peligro === tipoPeligro.label && mp.nrInicial != null).reduce((count, fin) => {
          return (count + (fin.estado == 'Riesgo eliminado')?0:((fin.nrResidual)?Number(fin.nrResidual):Number(fin.nrInicial)));
        }, 0);

        gpiTotal +=gpi
        gpfTotal +=gpf

        if(gpi==0 && gpf==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro16[0].value,
            value: gpi
          });
          data.series.push({
            name: this.filtro16[1].value,
            value: gpf
          })
          dataEventos21.push(data);
        }
      }


      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro16[0].value,
        value: gpiTotal
      });
      data.series.push({
        name: this.filtro16[1].value,
        value: gpfTotal
      })

      dataEventos21.push(data);

      Object.assign(this, {dataEventos21});
      localStorage.setItem('dataEventos21', JSON.stringify(dataEventos21));
      this.filtroGraf21()
    }
  }
  filtroGraf21(){
    let dataEventos21: any[] = JSON.parse(localStorage.getItem('dataEventos21')!)

    if(this.selectePeligro21 && this.selectePeligro21.length > 0){
      let selectePeligro21=this.selectePeligro21.map((ele:any)=>ele.nombre)
      dataEventos21 = dataEventos21.filter(data => selectePeligro21.includes(data.name));
    }

    if(this.selectFiltro21 && this.selectFiltro21.length > 0){
      dataEventos21.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro21.includes(dataSeries.name));
      });
    }
    Object.assign(this, {dataEventos21}); 
  }
  grafData22(){
    let flagZero:boolean=false

    if(this.selectPais22){
      let dataAnalisisRiesgo22: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos22: any[] = [];

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo22 = dataAnalisisRiesgo22.filter(at => at.fechaEdicion != null);


      //nuevo
        dataAnalisisRiesgo22= dataAnalisisRiesgo22.filter(at => at.pais != null);
        dataAnalisisRiesgo22= dataAnalisisRiesgo22.filter(at => at.division != null);
        dataAnalisisRiesgo22= dataAnalisisRiesgo22.filter(at => at.planta != null);
        dataAnalisisRiesgo22= dataAnalisisRiesgo22.filter(at => at.area != null);
        dataAnalisisRiesgo22 = dataAnalisisRiesgo22.filter(at => new Date(at.fechaEdicion).getFullYear() == this.selectAnio22);
        if(this.selectPais22)if(this.selectPais22!='Corona Total')dataAnalisisRiesgo22 = dataAnalisisRiesgo22.filter(at => at.pais == this.selectPais22);
        if(this.selecteDivision22)dataAnalisisRiesgo22= dataAnalisisRiesgo22.filter(at => at.division == this.selecteDivision22);
        if(this.selecteLocalidad22)dataAnalisisRiesgo22= dataAnalisisRiesgo22.filter(at => at.planta == this.selecteLocalidad22);
        if(this.selecteArea22)if(this.selecteArea22.length>0){
          dataMPCopyDiv=[]
          this.selecteArea22.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo22.filter(at => at.area == element));
          });
          dataAnalisisRiesgo22=[...dataMPCopyDiv]
        }
        if(this.selectePeligro22)if(this.selectePeligro22.length>0){
          dataMPCopyDiv=[]
          this.selectePeligro22.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo22.filter(at => at.peligro == element.nombre));
          });
          dataAnalisisRiesgo22=[...dataMPCopyDiv]
        }
      //fin nuevo
      let gpiTotal:number=0
      let gpfTotal:number=0
      
      if(this.tipoPeligroItemList)
      for(const mes of this.meses){

        let data:any = {
          name: mes,
          series: []
        }

        let gpi: number = dataAnalisisRiesgo22.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp.nrInicial != null).reduce((count, ini) => {
          return (count + Number(ini.nrInicial));
        }, 0);
        let gpf: number = dataAnalisisRiesgo22.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp.nrInicial != null).reduce((count, fin) => {
          return (count + (fin.estado == 'Riesgo eliminado')?0:((fin.nrResidual)?Number(fin.nrResidual):Number(fin.nrInicial)));
        }, 0);   

        gpiTotal +=gpi
        gpfTotal +=gpf

        if(gpi==0 && gpf==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          data.series.push({
            name: this.filtro16[0].value,
            value: gpi
          });
          data.series.push({
            name: this.filtro16[1].value,
            value: gpf
          })
          dataEventos22.push(data);
        }
      }


      let data:any = {
        name: 'Total',
        series: []
      }

      data.series.push({
        name: this.filtro16[0].value,
        value: gpiTotal
      });
      data.series.push({
        name: this.filtro16[1].value,
        value: gpfTotal
      })

      dataEventos22.push(data);

      Object.assign(this, {dataEventos22});
      localStorage.setItem('dataEventos22', JSON.stringify(dataEventos22));
      this.filtroGraf22()
    }
  }
  filtroGraf22(){
    let dataEventos22: any[] = JSON.parse(localStorage.getItem('dataEventos22')!)

    if(this.selectMes22 && this.selectMes22.length > 0){
      dataEventos22 = dataEventos22.filter(data => this.selectMes22.includes(data.name));
    }

    if(this.selectFiltro22 && this.selectFiltro22.length > 0){
      dataEventos22.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro22.includes(dataSeries.name));
      });
    }

    Object.assign(this, {dataEventos22}); 
  }

  grafData23(){
    this.meta23=[]
    
    let flagZero:boolean=false

    if(this.selectPais23 == 'Corona Total' || this.selecteDivision23 == 'Total' || this.selecteLocalidad23){
      let dataAnalisisRiesgo23: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let metaMP: any[] = JSON.parse(localStorage.getItem('metaMP')!);

      let ejeY:any
      let variableText:any
      if(this.selectPais23 == 'Corona Total'){
        ejeY=[...this.divisionList23] 
        variableText='division'
      }
      if(this.selecteDivision23 == 'Total'){
        ejeY=[...this.localidadesList23]
        variableText='planta'
      }
      if(this.selecteLocalidad23){
        ejeY=[...this.areasList23]
        variableText='area'
      }
      ejeY.sort((obj1:any, obj2:any) => {
        let label1 = obj1.label.toUpperCase(); // Convertir a mayúsculas para ordenar sin distinción entre mayúsculas y minúsculas
        let label2 = obj2.label.toUpperCase();
    
        if (label1 < label2) {
            return -1;
        }
        if (label1 > label2) {
            return 1;
        }
        return 0;
      });
      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo23 = dataAnalisisRiesgo23.filter(at => at.fechaEdicion != null);
      dataAnalisisRiesgo23 = dataAnalisisRiesgo23.filter(at => new Date(at.fechaEdicion).getFullYear() == this.selectAnio23);
      metaMP = metaMP.filter(at => at.anio == this.selectAnio23);
      if(this.selectPais23!='Corona Total')metaMP = metaMP.filter(at => at.pais == this.selectPais23);
      if(this.selectPais23!='Corona Total')if(this.selecteDivision23)if(this.selecteDivision23!='Total')metaMP=metaMP.filter(m=>m.nombreDivision==this.selecteDivision23)

      
      //nuevo
      dataAnalisisRiesgo23= dataAnalisisRiesgo23.filter(at => at.pais != null && at.division != null && at.planta != null && at.area != null);
      if(this.selectPais23)if(this.selectPais23!='Corona Total')dataAnalisisRiesgo23 = dataAnalisisRiesgo23.filter(at => at.pais == this.selectPais23);
      if(this.selectePeligro23)if(this.selectePeligro23.length>0){
        dataMPCopyDiv=[]
        this.selectePeligro23.forEach((element:any) => {
          dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo23.filter(at => at.peligro == element.nombre));
        });
        dataAnalisisRiesgo23=[...dataMPCopyDiv]
      }
      //fin nuevo

      let labels =[]
      let dataEventos23: {
        labels: any;
        datasets: any[];
        options?: any;
      } = {
        labels: [],
        datasets: [
          {
            label: 'ICR',
            backgroundColor: 'rgb(0, 176, 240,0.5)',
            borderColor: 'rgb(0, 176, 240)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta ICR',
            backgroundColor: 'rgb(10, 53, 255)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(10, 53, 255)',
            data: [],
            type: 'line'
          }
        ]
      };

      let gpiTotal:number=0
      let gpfTotal:number=0

      let icr:any=[]
      let metaIcr:any=[]
      for(const y of ejeY){
        let metaF=0
        if(variableText=='division'){
          let m =metaMP.find(f=>{return f.nombreDivision == y.label})
          if(m)metaF=m.icrDivision
        }
        if(variableText=='planta'){
          let l=this.localidadesList.find((l:any)=>l.localidad==y.label)
          if(l && l.plantas_nombre){
            let m =metaMP.find(f=>{return f.nombrePlanta == l.plantas_nombre})
            if(m)metaF=m.icrPlanta
          }
        }
        if(variableText=='area'){
          let a=this.areasList.find((a:any)=>a.nombre==y.label)
          if(a && a.localidad_plantas_nombre){
            let m =metaMP.find(f=>{return f.nombrePlanta == a.localidad_plantas_nombre})
            if(m)metaF=m.icrPlanta
          }
        }
        let data:any = {
          name: y.label,
          series: []
        }

        let gpi: number = dataAnalisisRiesgo23.filter(mp => mp[variableText] === y.label && mp.nrInicial != null).reduce((count, ini) => {
          return (count + Number(ini.nrInicial));
        }, 0);
        let gpf: number = dataAnalisisRiesgo23.filter(mp => mp[variableText] === y.label && mp.nrInicial != null).reduce((count, fin) => {
          return (count + (fin.estado == 'Riesgo eliminado')?0:((fin.nrResidual)?Number(fin.nrResidual):Number(fin.nrInicial)));
        }, 0);
                
        gpiTotal +=gpi
        gpfTotal +=gpf

        if(gpi==0 && gpf==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          this.meta23.push(y.label)
          labels.push(y.label)
          icr.push(((gpi-gpf)/gpi)*100)
          metaIcr.push(metaF)
        }
      }
      labels.push('Total')
      icr.push(((gpiTotal-gpfTotal)/gpiTotal)*100)
      let metaTotal=0
      if(variableText=='division')metaTotal=(metaMP.length>0)?((metaMP[0].icrAnual)?metaMP[0].icrAnual:0):0
      if(variableText=='planta')metaTotal=(metaMP.length>0)?((metaMP[0].icrAnual)?metaMP[0].icrAnual:0):0
      if(variableText=='area'){
        let l=this.localidadesList.find((l:any)=>l.localidad==this.selecteLocalidad23)
        if(l && l.plantas_nombre){
          let m =metaMP.find(f=>{return f.nombrePlanta == l.plantas_nombre})
          metaTotal=(m)?((m.icrPlanta)??m.icrPlanta):0
        }
      }
      metaIcr.push(metaTotal)
      dataEventos23.labels=labels
      dataEventos23.datasets[0].data=icr
      dataEventos23.datasets[1].data=metaIcr

      Object.assign(this, {dataEventos23});
      localStorage.setItem('dataEventos23', JSON.stringify(dataEventos23));
      this.filtroGraf23()
    }
  }
  meta23:any
  meta24:any
  meta25:any
  filtroGraf23(){
    let dataEventos23: any = JSON.parse(localStorage.getItem('dataEventos23')!)

    
    if(this.selectPais23 == 'Corona Total' && this.selecteDivision23 != 'Total'){
      if(this.selecteDivision23 && this.selecteDivision23.length > 0){
        let divisionList23 = [...this.meta23]
        let selecteDivision = this.selecteDivision23.map((div:any) => div).sort();
        dataEventos23.labels = selecteDivision;
        dataEventos23.datasets[1].data = dataEventos23.datasets[1].data.filter((data:any, index:any) => selecteDivision.includes(divisionList23[index]));
        dataEventos23.datasets[0].data = dataEventos23.datasets[0].data.filter((data:any, index:any) => selecteDivision.includes(divisionList23[index]));
      }
    }else if(this.selecteDivision23 == 'Total')
      if(this.selecteLocalidad23 && this.selecteLocalidad23.length > 0){
        let localidadesList23 = [...this.meta23]
        let selecteLocalidad = this.selecteLocalidad23.map((loc:any) => loc).sort();
        dataEventos23.labels = selecteLocalidad;
        dataEventos23.datasets[1].data = dataEventos23.datasets[1].data.filter((data:any, index:any) => selecteLocalidad.includes(localidadesList23[index]));
        dataEventos23.datasets[0].data = dataEventos23.datasets[0].data.filter((data:any, index:any) => selecteLocalidad.includes(localidadesList23[index]));
        }
        
        if(this.selectPais23 != 'Corona Total' && this.selecteDivision23 != 'Total')
          if(this.selecteArea23 && this.selecteArea23.length > 0){
            let areaList23 = [...this.meta23]
            let selecteArea = this.selecteArea23.map((loc:any) => loc).sort();
            dataEventos23.labels = selecteArea;
            dataEventos23.datasets[1].data = dataEventos23.datasets[1].data.filter((data:any, index:any) => selecteArea.includes(areaList23[index]));
            dataEventos23.datasets[0].data = dataEventos23.datasets[0].data.filter((data:any, index:any) => selecteArea.includes(areaList23[index]));
      }

      if(this.selectFiltro23 && this.selectFiltro23.length > 0){
        let selectFiltro23Meta = this.filtro17.map((div:any) => div.label);
        let selectFiltro23 = this.selectFiltro23.map((div:any) => div);
        dataEventos23.datasets = dataEventos23.datasets.filter((data:any, index:any) => selectFiltro23.includes(selectFiltro23Meta[index]));
      }

   Object.assign(this, {dataEventos23}); 
  }
  grafData24(){
    this.meta24=[]
    let flagZero:boolean=false

    if(this.selectPais24){
      let dataAnalisisRiesgo24: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let metaMP: any[] = JSON.parse(localStorage.getItem('metaMP')!);

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo24 = dataAnalisisRiesgo24.filter(at => at.fechaEdicion != null);
      dataAnalisisRiesgo24 = dataAnalisisRiesgo24.filter(at => new Date(at.fechaEdicion).getFullYear() == this.selectAnio24);
      metaMP = metaMP.filter(at => at.anio == this.selectAnio24);


      //nuevo
        dataAnalisisRiesgo24= dataAnalisisRiesgo24.filter(at => at.pais != null);
        dataAnalisisRiesgo24= dataAnalisisRiesgo24.filter(at => at.division != null);
        dataAnalisisRiesgo24= dataAnalisisRiesgo24.filter(at => at.planta != null);
        dataAnalisisRiesgo24= dataAnalisisRiesgo24.filter(at => at.area != null);
        if(this.selectPais24)if(this.selectPais24!='Corona Total')dataAnalisisRiesgo24 = dataAnalisisRiesgo24.filter(at => at.pais == this.selectPais24);
        if(this.selectPais24!='Corona Total')metaMP = metaMP.filter(at => at.pais == this.selectPais24);
        if(this.selectPais24!='Corona Total')if(this.selecteDivision24)if(this.selecteDivision24!='Total')metaMP=metaMP.filter(m=>m.nombreDivision==this.selecteDivision24)
        if(this.selecteDivision24)dataAnalisisRiesgo24= dataAnalisisRiesgo24.filter(at => at.division == this.selecteDivision24);
        if(this.selecteLocalidad24)dataAnalisisRiesgo24= dataAnalisisRiesgo24.filter(at => at.planta == this.selecteLocalidad24);
        if(this.selecteArea24)if(this.selecteArea24.length>0){
          dataMPCopyDiv=[]
          this.selecteArea24.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo24.filter(at => at.area == element));
          });
          dataAnalisisRiesgo24=[...dataMPCopyDiv]
        }
        if(this.selectMes24)if(this.selectMes24.length>0){
          dataMPCopyDiv=[]
          this.selectMes24.forEach((element:any) => {
            dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo24.filter(at => this.meses[new Date(at.fechaEdicion).getMonth()] == element));
          });
          dataAnalisisRiesgo24=[...dataMPCopyDiv]
        }
      //fin nuevo

      let labels =[]
      let dataEventos24: {
        labels: any;
        datasets: any[];
        options?: any;
      } = {
        labels: [],
        datasets: [
          {
            label: 'ICR',
            backgroundColor: 'rgb(0, 176, 240,0.5)',
            borderColor: 'rgb(0, 176, 240)',
            borderWidth: 1,
            data: [],
            type: 'bar'
          },
          {
            label: 'Meta ICR',
            backgroundColor: 'rgb(10, 53, 255)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderColor: 'rgb(10, 53, 255)',
            data: [],
            type: 'line'
          }
        ]
      };

      let gpiTotal:number=0
      let gpfTotal:number=0
      let icr:any=[]
      let metaIcr:any=[]
      if(this.tipoPeligroItemList)
      for(const tipoPeligro of this.tipoPeligroItemList){
        let metaF=0
        if(this.selecteDivision24 && this.selecteLocalidad24==null){
          let m =metaMP.find(f=>{return f.nombreDivision == this.selecteDivision24})
          if(m)metaF=m.icrDivision
        }
        if(this.selecteLocalidad24){
          let l=this.localidadesList.find((l:any)=>l.localidad==this.selecteLocalidad24)
          if(l && l.plantas_nombre){
            let m =metaMP.find(f=>{return f.nombrePlanta == l.plantas_nombre})
            if(m)metaF=m.icrPlanta
          }
        }

        let data:any = {
          name: tipoPeligro.label,
          series: []
        }

        let gpi: number = dataAnalisisRiesgo24.filter(mp => mp.peligro === tipoPeligro.label && mp.nrInicial != null).reduce((count, ini) => {
          return (count + Number(ini.nrInicial));
        }, 0);
        let gpf: number = dataAnalisisRiesgo24.filter(mp => mp.peligro === tipoPeligro.label && mp.nrInicial != null).reduce((count, fin) => {
          return (count + (fin.estado == 'Riesgo eliminado')?0:((fin.nrResidual)?Number(fin.nrResidual):Number(fin.nrInicial)));
        }, 0);

        gpiTotal +=gpi
        gpfTotal +=gpf

        if(gpi==0 && gpf==0)flagZero=true
        else flagZero=false

        if(!flagZero){
          this.meta24.push(tipoPeligro.label)
          labels.push(tipoPeligro.label)
          icr.push(((gpi-gpf)/gpi)*100)
          metaIcr.push(metaF)
        }
      }
      labels.push('Total')
      icr.push(((gpiTotal-gpfTotal)/gpiTotal)*100)
      let metaTotal=0
      if(this.selecteDivision24 && this.selecteLocalidad24==null){
        let m =metaMP.find(f=>{return f.nombreDivision == this.selecteDivision24})
        if(m)metaTotal=m.icrDivision
      }
      if(this.selecteLocalidad24){
        let l=this.localidadesList.find((l:any)=>l.localidad==this.selecteLocalidad24)
        if(l && l.plantas_nombre){
          let m =metaMP.find(f=>{return f.nombrePlanta == l.plantas_nombre})
          if(m)metaTotal=m.icrPlanta
        }
      }

      metaIcr.push(metaTotal)
      dataEventos24.labels=labels
      dataEventos24.datasets[0].data=icr
      dataEventos24.datasets[1].data=metaIcr

      Object.assign(this, {dataEventos24});
      localStorage.setItem('dataEventos24', JSON.stringify(dataEventos24));
      this.filtroGraf24()
    }
  }
  filtroGraf24(){
    let dataEventos24: any = JSON.parse(localStorage.getItem('dataEventos24')!)

    if(this.selectePeligro24 && this.selectePeligro24.length > 0){
      let peligroList24 = [...this.meta24]
      console.log(this.selectePeligro24)
      let selectePeligro24 = this.selectePeligro24.map((p:any) => p.nombre).sort();
      dataEventos24.labels = selectePeligro24;
      dataEventos24.datasets[1].data = dataEventos24.datasets[1].data.filter((data:any, index:any) => selectePeligro24.includes(peligroList24[index]));
      dataEventos24.datasets[0].data = dataEventos24.datasets[0].data.filter((data:any, index:any) => selectePeligro24.includes(peligroList24[index]));
    }

    if(this.selectFiltro24 && this.selectFiltro24.length > 0){
      let selectFiltro24Meta = this.filtro17.map((div:any) => div.label);
      let selectFiltro24 = this.selectFiltro24.map((div:any) => div);
      dataEventos24.datasets = dataEventos24.datasets.filter((data:any, index:any) => selectFiltro24.includes(selectFiltro24Meta[index]));
    }
    Object.assign(this, {dataEventos24}); 
    }
    grafData25(){
      this.meta25=[]
      let flagZero:boolean=false
  
      if(this.selectPais25){
        let dataAnalisisRiesgo25: any[] = JSON.parse(localStorage.getItem('dataMP')!);
        let metaMP: any[] = JSON.parse(localStorage.getItem('metaMP')!);
  
        let dataMPCopyDiv: any[]=[]
        dataAnalisisRiesgo25 = dataAnalisisRiesgo25.filter(at => at.fechaEdicion != null);
        dataAnalisisRiesgo25 = dataAnalisisRiesgo25.filter(at => new Date(at.fechaEdicion).getFullYear() == this.selectAnio25);
        metaMP = metaMP.filter(at => at.anio == this.selectAnio25);

        //nuevo
          dataAnalisisRiesgo25 = dataAnalisisRiesgo25.filter(at => at.pais != null);
          dataAnalisisRiesgo25 = dataAnalisisRiesgo25.filter(at => at.division != null);
          dataAnalisisRiesgo25 = dataAnalisisRiesgo25.filter(at => at.planta != null);
          dataAnalisisRiesgo25 = dataAnalisisRiesgo25.filter(at => at.area != null);
          if(this.selectPais25)if(this.selectPais25!='Corona Total')dataAnalisisRiesgo25 = dataAnalisisRiesgo25.filter(at => at.pais == this.selectPais25);
          if(this.selectPais25!='Corona Total')metaMP = metaMP.filter(at => at.pais == this.selectPais25);
          if(this.selectPais25!='Corona Total')if(this.selecteDivision25)if(this.selecteDivision25!='Total')metaMP=metaMP.filter(m=>m.nombreDivision==this.selecteDivision25)
          if(this.selecteDivision25)dataAnalisisRiesgo25= dataAnalisisRiesgo25.filter(at => at.division == this.selecteDivision25);
          if(this.selecteLocalidad25)dataAnalisisRiesgo25= dataAnalisisRiesgo25.filter(at => at.planta == this.selecteLocalidad25);
          if(this.selecteArea25)if(this.selecteArea25.length>0){
            dataMPCopyDiv=[]
            this.selecteArea25.forEach((element:any) => {
              dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo25.filter(at => at.area == element));
            });
            dataAnalisisRiesgo25=[...dataMPCopyDiv]
          }
        //fin nuevo
  
        let labels =[]
        let dataEventos25: {
          labels: any;
          datasets: any[];
          options?: any;
        } = {
          labels: [],
          datasets: [
            {
              label: 'ICR',
              backgroundColor: 'rgb(0, 176, 240,0.5)',
              borderColor: 'rgb(0, 176, 240)',
              borderWidth: 1,
              data: [],
              type: 'bar'
            },
            {
              label: 'Meta ICR',
              backgroundColor: 'rgb(10, 53, 255)',
              fill: false,
              tension: 0.4,
              borderWidth: 2,
              borderColor: 'rgb(10, 53, 255)',
              data: [],
              type: 'line'
            }
          ]
        };
  
        let gpiTotal:number=0
        let gpfTotal:number=0
        let icr:any=[]
        let metaIcr:any=[]
        if(this.tipoPeligroItemList)
        for(const mes of this.meses){
          let metaF=0
          if(this.selecteDivision25 && this.selecteLocalidad25==null){
            let m =metaMP.find(f=>{return f.nombreDivision == this.selecteDivision25})
            if(m)metaF=m.icrDivision
          }
          if(this.selecteLocalidad25){
            let l=this.localidadesList.find((l:any)=>l.localidad==this.selecteLocalidad25)
            if(l && l.plantas_nombre){
              let m =metaMP.find(f=>{return f.nombrePlanta == l.plantas_nombre})
              if(m)metaF=m.icrPlanta
            }
          }
  
          let data:any = {
            name: mes,
            series: []
          }
  
          let gpi: number = dataAnalisisRiesgo25.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp.nrInicial != null).reduce((count, ini) => {
            return (count + Number(ini.nrInicial));
          }, 0);
          let gpf: number = dataAnalisisRiesgo25.filter(mp => this.meses[new Date(mp.fechaEdicion).getMonth()] === mes && mp.nrInicial != null).reduce((count, fin) => {
            return (count + (fin.estado == 'Riesgo eliminado')?0:((fin.nrResidual)?Number(fin.nrResidual):Number(fin.nrInicial)));
          }, 0);
  
          gpiTotal +=gpi
          gpfTotal +=gpf
  
          if(gpi==0 && gpf==0)flagZero=true
          else flagZero=false
  
          if(!flagZero){
            this.meta25.push(mes)
            labels.push(mes)
            icr.push(((gpi-gpf)/gpi)*100)
            metaIcr.push(metaF)
          }
        }
        labels.push('Total')
        icr.push(((gpiTotal-gpfTotal)/gpiTotal)*100)
        let metaTotal=0  
        if(this.selecteDivision25 && this.selecteLocalidad25==null){
          let m =metaMP.find(f=>{return f.nombreDivision == this.selecteDivision25})
          if(m)metaTotal=m.icrDivision
        }
        if(this.selecteLocalidad25){
          let l=this.localidadesList.find((l:any)=>l.localidad==this.selecteLocalidad25)
          if(l && l.plantas_nombre){
            let m =metaMP.find(f=>{return f.nombrePlanta == l.plantas_nombre})
            if(m)metaTotal=m.icrPlanta
          }
        }

  
        metaIcr.push(metaTotal)
        dataEventos25.labels=labels
        dataEventos25.datasets[0].data=icr
        dataEventos25.datasets[1].data=metaIcr
  
        Object.assign(this, {dataEventos25});
        localStorage.setItem('dataEventos25', JSON.stringify(dataEventos25));
        // this.filtroGraf25()
      }
    }
    filtroGraf25(){
      let dataEventos25: any = JSON.parse(localStorage.getItem('dataEventos25')!)
  
      if(this.selectMes25 && this.selectMes25.length > 0){
        let mesList25 = [...this.meta25]
        let selectMes25 = this.selectMes25.map((m:any) => m).sort();
        dataEventos25.labels = selectMes25;
        dataEventos25.datasets[1].data = dataEventos25.datasets[1].data.filter((data:any, index:any) => selectMes25.includes(mesList25[index]));
        dataEventos25.datasets[0].data = dataEventos25.datasets[0].data.filter((data:any, index:any) => selectMes25.includes(mesList25[index]));
      }
  
      if(this.selectFiltro25 && this.selectFiltro25.length > 0){
        let selectFiltro25Meta = this.filtro17.map((div:any) => div.label);
        let selectFiltro25 = this.selectFiltro25.map((div:any) => div);
        dataEventos25.datasets = dataEventos25.datasets.filter((data:any, index:any) => selectFiltro25.includes(selectFiltro25Meta[index]));
      }
      Object.assign(this, {dataEventos25}); 
    }
  imgFlag:boolean=false

}

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
  dataEventos1:any[]=[]
  dataEventos1Porcentaje:any[]=[]
  dataEventos2:any[]=[]
  dataEventos3:any[]=[]
  dataEventos4:any[]=[]
  dataEventos5:any[]=[]
  dataEventos6:any[]=[]
  dataEventos7:any[]=[]
  dataEventos8:any[]=[]
  dataEventos9:any[]=[]
  dataEventos10:any[]=[]
  dataEventos11:any[]=[]
  dataEventos12:any[]=[]
  dataEventos13:any[]=[]
  dataEventos14:any[]=[]

  filtro1: any[] = [{label: 'Numero AT', value: 'Numero AT'},{label: 'Numero EL', value: 'Numero EL'}];
  filtro1Porcentaje: any[] = [{label: 'Porcentaje AT', value: 'Porcentaje AT'},{label: 'Porcentaje EL', value: 'Porcentaje EL'}];
  // filtro2: any[] = [{label: 'Numero AT', value: 'Numero AT'}, {label: 'Porcentaje AT', value: 'Porcentaje AT'},{label: 'Numero EL', value: 'Numero EL'},{label: 'Porcentaje EL', value: 'Porcentaje EL'}];
  filtro2: any[] = [{label: 'Numero AT', value: 'Numero AT'},{label: 'Numero EL', value: 'Numero EL'}];
  filtro2Porcentaje: any[] = [{label: 'Porcentaje AT', value: 'Porcentaje AT'},{label: 'Porcentaje EL', value: 'Porcentaje EL'}];
  filtro4: any[] = [{label: 'Sin eliminados y sustituidos', value: 0}, {label: 'Eliminados y sustituidos', value: 1}];
  filtro5: any[] = [{label: 'Sustituidos', value: 'Sustituidos'}, {label: 'Eliminados', value: 'Eliminados'}];
  filtro6: any[] = [{label: 'Pendiente', value: 'Pendiente'}, {label: 'Ejecutado', value: 'Ejecutado'}];
  filtro7: any[] = [{label: 'Propios', value: 'Propios'}, {label: 'Temporales', value: 'Temporales'}, {label: 'Contratistas', value: 'Contratistas'}, {label: 'Total', value: 'Total'}];
  filtro8: any[] = [{label: 'Propios', value: 'Propios'}, {label: 'Temporales', value: 'Temporales'}, {label: 'Contratistas', value: 'Contratistas'}, {label: 'Total', value: 'Total'}];
  filtro9: any[] = [{label: 'ICR', value: 'ICR'}, {label: 'Meta ICR', value: 'Meta ICR'}];
  filtro10: any[] = [{label: 'ICR', value: 'ICR'}, {label: 'Meta ICR', value: 'Meta ICR'}];
  filtro11: any[] = [{label: 'GPI', value: 'GPI'}, {label: 'GPF', value: 'GPF'}];
  filtro12: any[] = [{label: 'GPI', value: 'GPI'}, {label: 'GPF', value: 'GPF'}];
  filtro13: any[] = [{label: 'Control adm.', value: 'GPI'}, {label: 'Control Ing.', value: 'GPF'}, {label: 'EPP', value: 'EPP'}];
  filtro14: any[] = [{label: 'Control adm.', value: 'GPI'}, {label: 'Control Ing.', value: 'GPF'}, {label: 'EPP', value: 'EPP'}];
  filtro15: any[] = [{label: 'Sí', value: 'Sí'}, {label: 'No', value: 'No'}];
  filtro16: any[] = [{label: 'Sí', value: 'Sí'}, {label: 'No', value: 'No'}];

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
  selectePeligro13:any
  selectePeligro14:any

  selectFiltro1: any=[]
  selectFiltro1p: any=[]
  selectFiltro2: any=[]
  selectFiltro2p: any=[]
  selectFiltro2Segundo: any=[]
  selectFiltro3: any=[]
  selectFiltro3p: any=[]
  selectFiltro4: any=0
  selectFiltro4Segundo: any=[]
  selectFiltro5: any=[]
  selectFiltro5Segundo: any=[]
  selectFiltro6: any=[]
  selectFiltro7: any=[]
  selectFiltro8: any=[]
  selectFiltro9: any=[]
  selectFiltro10: any=[]
  selectFiltro11: any=[]
  selectFiltro12: any=[]
  selectFiltro13: any=[]
  selectFiltro14: any=[]

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

  hasta1Graf1?:Date
  hasta2Graf1?:Date

  hasta1Graf2?:Date
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

  localeES = locale_es;

  constructor(
    private sessionService: SesionService,
    private empresaService: EmpresaService,
    private areaService: AreaService,
    private tipoPeligroService: TipoPeligroService,
    private viewMatrizPeligrosService: ViewMatrizPeligrosService,
    private areaMatrizService: AreaMatrizService,
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
      default:
        break;
    }
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
        value: ((d.series[0].value*100)/numAtTotal).toFixed(1)
      });
      data.series.push({
        name: this.filtro1Porcentaje[1].label,
        value: ((d.series[1].value*100)/numElTotal).toFixed(1)
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
        value: ((d.series[0].value*100)/numAtTotal).toFixed(1)
      });
      data.series.push({
        name: this.filtro2Porcentaje[1].label,
        value: ((d.series[1].value*100)/numElTotal).toFixed(1)
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
    // if(this.selectPais2 == 'Corona Total' || this.selecteDivision2 == 'Total' || this.selecteLocalidad2){
    if(this.selectPais3){
      let dataAnalisisRiesgo3: any[] = JSON.parse(localStorage.getItem('dataMP')!);
      let dataEventos3: any[] = [];
      
      let ejeY:any
      let variableText:any

      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo3 = dataAnalisisRiesgo3.filter(at => at.fechaEdicion != null);

      dataAnalisisRiesgo3 = dataAnalisisRiesgo3.filter(at => new Date(at.fechaEdicion).getFullYear() == this.selectAnio3);
      // if(this.selectMes3)if(this.selectMes3.length>0){
      //   dataMPCopyDiv=[]
      //   this.selectMes3.forEach((mes:any) => {
      //     dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo3.filter(at => this.meses[new Date(at.fechaEdicion).getMonth()] == mes));
      //   });
      //   dataAnalisisRiesgo3=[...dataMPCopyDiv]
      // }
      if(this.selectePeligro3)if(this.selectePeligro3.length>0){
        dataMPCopyDiv=[]
        this.selectePeligro3.forEach((element:any) => {
          dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo3.filter(at => at.peligro == element.nombre));
        });
        dataAnalisisRiesgo3=[...dataMPCopyDiv]
      }
      if(this.selectePeligro3)if(this.selectePeligro3.length>0){
        dataMPCopyDiv=[]
        this.selectePeligro3.forEach((element:any) => {
          dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo3.filter(at => at.peligro == element.nombre));
        });
        dataAnalisisRiesgo3=[...dataMPCopyDiv]
      }
      //nuevo
        // let dataMPCopyDiv: any[]=[]
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
        value: ((d.series[0].value*100)/numAtTotal).toFixed(1)
      });
      data.series.push({
        name: this.filtro2Porcentaje[1].label,
        value: ((d.series[1].value*100)/numElTotal).toFixed(1)
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
        if(this.selectPais5)if(this.selectPais5!='Corona Total')dataAnalisisRiesgo5 = dataAnalisisRiesgo5.filter(at => at.pais == this.selectPais5);
        if(this.selecteDivision5)dataAnalisisRiesgo5= dataAnalisisRiesgo5.filter(at => at.division == this.selecteDivision5);
        if(this.selecteLocalidad5)dataAnalisisRiesgo5= dataAnalisisRiesgo5.filter(at => at.planta == this.selecteLocalidad5);
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

      let riesgo:string=(this.radioGra4==0)?'cualitativoInicial':'cualitativoResidual'
        
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

      dataEventos5=this.order(dataEventos5)
      dataEventos5=this.top(dataEventos5,10)

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

    if(this.selectePeligro5 && this.selectePeligro5.length > 0){
      let selectePeligro5=this.selectePeligro5.map((ele:any)=>ele.nombre)
      dataEventos5 = dataEventos5.filter(data => selectePeligro5.includes(data.name));
    }

    if(this.selectFiltro5Segundo && this.selectFiltro5Segundo.length > 0){
      dataEventos5.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro5Segundo.includes(dataSeries.name));
      });
    }

    Object.assign(this, {dataEventos5}); 
  }
  imgFlag:boolean=false

}

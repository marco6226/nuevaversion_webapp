import { Component, OnDestroy, OnInit } from '@angular/core';
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
  filtro2: any[] = [{label: 'Numero AT', value: 'Numero AT'}, {label: 'Porcentaje AT', value: 'Porcentaje AT'},{label: 'Numero EL', value: 'Numero EL'},{label: 'Porcentaje EL', value: 'Porcentaje EL'}];
  filtro3: any[] = [{label: 'Riesgo incial sin eliminados y sustituidos', value: 'Riesgo incial sin eliminados y sustituidos'}, {label: 'Riesgo final sin eliminados y sustituidos', value: 'Riesgo final sin eliminados y sustituidos'},{label: 'Riesgo incial con eliminados y sustituidos', value: 'Riesgo incial con eliminados y sustituidos'}, {label: 'Riesgo final con eliminados y sustituidos', value: 'Riesgo final con eliminados y sustituidos'}];
  filtro4: any[] = [{label: 'Sustituidos', value: 'Sustituidos'}, {label: 'Eliminados', value: 'Eliminados'}];
  filtro5: any[] = [{label: 'Pendiente', value: 'Pendiente'}, {label: 'Ejecutado', value: 'Ejecutado'}];
  filtro6: any[] = [{label: 'Propios', value: 'Propios'}, {label: 'Temporales', value: 'Temporales'}, {label: 'Contratistas', value: 'Contratistas'}, {label: 'Total', value: 'Total'}];
  filtro7: any[] = [{label: 'Propios', value: 'Propios'}, {label: 'Temporales', value: 'Temporales'}, {label: 'Contratistas', value: 'Contratistas'}, {label: 'Total', value: 'Total'}];
  filtro8: any[] = [{label: 'ICR', value: 'ICR'}, {label: 'Meta ICR', value: 'Meta ICR'}];
  filtro9: any[] = [{label: 'ICR', value: 'ICR'}, {label: 'Meta ICR', value: 'Meta ICR'}];
  filtro10: any[] = [{label: 'GPI', value: 'GPI'}, {label: 'GPF', value: 'GPF'}];
  filtro11: any[] = [{label: 'GPI', value: 'GPI'}, {label: 'GPF', value: 'GPF'}];
  filtro12: any[] = [{label: 'Control adm.', value: 'GPI'}, {label: 'Control Ing.', value: 'GPF'}, {label: 'EPP', value: 'EPP'}];
  filtro13: any[] = [{label: 'Control adm.', value: 'GPI'}, {label: 'Control Ing.', value: 'GPF'}, {label: 'EPP', value: 'EPP'}];
  filtro14: any[] = [{label: 'Sí', value: 'Sí'}, {label: 'No', value: 'No'}];
  filtro15: any[] = [{label: 'Sí', value: 'Sí'}, {label: 'No', value: 'No'}];

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
  selectFiltro2Segundo: any=[]
  selectFiltro3: any=[]
  selectFiltro3Segundo: any=[]
  selectFiltro4: any=[]
  selectFiltro5: any=[]
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

  radioGra1:number=0
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
        this.selecteLocalidad2=[]
        this.selecteDivision2=null
        this.divisionList2=await this.getDivisiones(pais.value)
        this.grafData2()
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

  tableroRiesgoIncial(){
    let dataRiesgoInicial: any[] = JSON.parse(localStorage.getItem('dataMP')!);
  }

  tableroRiesgofinal(){
    let dataRiesgoFinal: any[] = JSON.parse(localStorage.getItem('dataMP')!);
  }

  // Grafica Analisis riesgo 1
  grafData1(){

    console.log(this.selectAnio1)
    console.log(this.selectMes1)
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

      console.log(dataAnalisisRiesgo1)

      new Date().getFullYear();
      let dataMPCopyDiv: any[]=[]
      dataAnalisisRiesgo1 = dataAnalisisRiesgo1.filter(at => at.fechaEdicion != null);
      dataAnalisisRiesgo1 = dataAnalisisRiesgo1.filter(at => new Date(at.fechaEdicion).getFullYear() == this.selectAnio1);
      if(this.selectMes1)if(this.selectMes1.length>0){
        dataMPCopyDiv=[]
        this.selectMes1.forEach((mes:any) => {
          dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo1.filter(at => this.meses[new Date(at.fechaEdicion).getMonth()] == mes));
        });
        dataAnalisisRiesgo1=[...dataMPCopyDiv]
      }
      if(this.selectePeligro1)if(this.selectePeligro1.length>0){
        dataMPCopyDiv=[]
        this.selectePeligro1.forEach((element:any) => {
          dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo1.filter(at => at.peligro == element.nombre));
        });
        dataAnalisisRiesgo1=[...dataMPCopyDiv]
      }

      console.log(dataAnalisisRiesgo1)

      // nuevo
      // if(this.selectPais1)if(this.selectPais1!='Corona Total')dataAnalisisRiesgo1 = dataAnalisisRiesgo1.filter(at => at.pais == this.selectPais1);
      // if(this.selecteDivision1)dataAnalisisRiesgo1= dataAnalisisRiesgo1.filter(at => at.division == this.selecteDivision1);
      // if(this.selecteLocalidad1)dataAnalisisRiesgo1= dataAnalisisRiesgo1.filter(at => at.planta == this.selecteLocalidad1);
      // if(this.selecteArea1)if(this.selecteArea1.length>0){
      //   dataMPCopyDiv=[]
      //   this.selecteArea1.forEach((element:any) => {
      //     dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo1.filter(at => at.area == element));
      //   });
      //   dataAnalisisRiesgo1=[...dataMPCopyDiv]
      // }
    // fin nuevo

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
    console.log(dataGraf)
    let dataEventos1Porcentaje: any[] = [];

    for(const d of dataGraf){
      let data:any = {
        name: d.name,
        series: []
      }

      data.series.push({
        name: this.filtro1Porcentaje[0].label,
        value: (d.series[0].value*100)/numAtTotal
      });
      data.series.push({
        name: this.filtro1Porcentaje[1].label,
        value: (d.series[1].value*100)/numElTotal
      })

      dataEventos1Porcentaje.push(data)
    }
    dataEventos1Porcentaje.pop()
    Object.assign(this, {dataEventos1Porcentaje});
    localStorage.setItem('dataEventos1Porcentaje', JSON.stringify(dataEventos1Porcentaje));
  }
  filtroGraf1(){

    let dataEventos1: any[] = JSON.parse(localStorage.getItem('dataEventos1')!);

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

    if(this.selectFiltro1 && this.selectFiltro1.length > 0){
      dataEventos1.forEach(de1 => {
        de1.series = de1.series.filter((dataSeries:any) => this.selectFiltro1.includes(dataSeries.name));
      });
    }
    
    Object.assign(this, {dataEventos1});
  }
  // Grafica Analisis riesgo 2
  grafData2(){
    let dataAnalisisRiesgo2: any[] = JSON.parse(localStorage.getItem('dataMP')!);
    let dataEventos2: any[] = [];


      //nuevo
      // let dataMPCopyDiv: any[]=[]
      // if(this.selectPais1)if(this.selectPais1!='Corona Total')dataAnalisisRiesgo1 = dataAnalisisRiesgo1.filter(at => at.pais == this.selectPais1);
      // if(this.selecteDivision1)dataAnalisisRiesgo1= dataAnalisisRiesgo1.filter(at => at.padreNombre == this.selecteDivision1);
      // if(this.selecteLocalidad1)if(this.selecteLocalidad1.length>0){
      //   dataMPCopyDiv=[]
      //   this.selecteLocalidad1.forEach((element:any) => {
      //     dataMPCopyDiv=dataMPCopyDiv.concat(dataAnalisisRiesgo1.filter(at => at.nombrePlanta == element));
      //   });
      //   dataAnalisisRiesgo1=[...dataMPCopyDiv]
      // }
    //fin nuevo
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
      

      data.series.push({
        name: this.filtro2[0].label,
        value: numeroAt
      });
      data.series.push({
        name: this.filtro2[2].label,
        value: numeroEl
      })
      dataEventos2.push(data);
    }

    Object.assign(this, {dataEventos2});
    localStorage.setItem('dataEventos2', JSON.stringify(dataEventos2));
    // console.log(dataAnalisisRiesgo1)

  }
  // Grafica Analisis riesgo 3
  grafData3(){
    let dataAnalisisRiesgo3: any[] = JSON.parse(localStorage.getItem('dataMP')!);

  }
}

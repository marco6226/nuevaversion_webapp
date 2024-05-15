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

@Component({
  selector: 'app-ind-matriz-peligros',
  templateUrl: './ind-matriz-peligros.component.html',
  styleUrl: './ind-matriz-peligros.component.scss'
})
export class IndMatrizPeligrosComponent implements OnInit,OnDestroy{
  filtro1: any[] = [{label: 'Numero AT', value: 'Numero AT'}, {label: 'Porcentaje AT', value: 'Porcentaje AT'},{label: 'Numero EL', value: 'Numero EL'},{label: 'Porcentaje EL', value: 'Porcentaje EL'}];
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

  selectMes1: number = new Date().getFullYear();
  selectMes2: number = new Date().getFullYear();
  selectMes3: number = new Date().getFullYear();
  selectMes4: number = new Date().getFullYear();
  selectMes5: number = new Date().getFullYear();
  selectMes6: number = new Date().getFullYear();
  selectMes7: number = new Date().getFullYear();
  selectMes8: number = new Date().getFullYear();
  selectMes9: number = new Date().getFullYear();
  selectMes10: number = new Date().getFullYear();
  selectMes11: number = new Date().getFullYear();
  selectMes12: number = new Date().getFullYear();
  selectMes13: number = new Date().getFullYear();
  selectMes14: number = new Date().getFullYear();

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
    localStorage.removeItem('dataMp');
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
      localStorage.setItem('dataMP', JSON.stringify(dataMP.map((mp:any) => mp)))
    })

  }

  peligro:any=[]
  tipoPeligroItemList?: SelectItem[];


  async cargarTiposPeligro() {
    this.peligro=[]
    await this.tipoPeligroService.findAll().then(
      (resp:any) => {
        console.log(resp)
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
        this.selecteLocalidad1=[]
        this.selecteDivision1=null
        this.divisionList1=await this.getDivisiones(pais.value)
        this.grafData1()
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
          console.log(res)

          this.localidadesList = (<Localidades[]>res.data).map(localidad => localidad);
          console.log(this.localidadesList)

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
    dv = this.divisionList.filter((dv1:any) => dv1.nombre == div.value);
    localidadesList=this.localidadesList.filter((loc:any) => loc.plantas_area_id == dv[0].id);


    switch (filter) {
      case 'graf1':
        this.localidadesList1=[]
        this.selecteLocalidad1=[]
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList1.push({label:loc.localidad,value:loc.localidad})
        }
        break;
      default:
        break;
    }
  }

  funcSelectLocalidad(loc:any,filter:any){

    switch (filter) {
      case 'graf1':
        console.log(loc)
        // this.localidadesList1=[]
        // this.selecteLocalidad1=[]
        // if(localidadesList)
        // for(const loc of localidadesList){
        //   this.localidadesList1.push({label:loc.localidad,value:loc.localidad})
        // }
        break;
      default:
        break;
    }
  }
  
  tableroRiesgoIncial(){
    let dataRiesgoInicial: any[] = JSON.parse(localStorage.getItem('dataMp')!);
  }
  tableroRiesgofinal(){
    let dataRiesgoFinal: any[] = JSON.parse(localStorage.getItem('dataMp')!);
  }

  // Grafica Analisis riesgo 1
  grafData1(){
    let dataAnalisisRiesgo1: any[] = JSON.parse(localStorage.getItem('dataMp')!);

  }
  // Grafica Analisis riesgo 2
  grafData2(){
    let dataAnalisisRiesgo3: any[] = JSON.parse(localStorage.getItem('dataMp')!);

  }
  // Grafica Analisis riesgo 3
  grafData3(){
    let dataAnalisisRiesgo3: any[] = JSON.parse(localStorage.getItem('dataMp')!);

  }
}

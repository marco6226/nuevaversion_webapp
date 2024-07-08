import { Component, OnInit, AfterViewInit, OnDestroy} from "@angular/core";
import { ReporteAtService } from "src/app/website/pages/ind/service/reporte-at.service";
import { FilterQuery } from "../../../core/entities/filter-query";
import { SortOrder } from "src/app/website/pages/core/entities/filter";
import { Filter, Criteria } from 'src/app/website/pages/core/entities/filter';
import { Area } from 'src/app/website/pages/empresa/entities/area';
import { AreaService } from "src/app/website/pages/empresa/services/area.service";
import { locale_es } from 'src/app/website/pages/rai/entities/reporte-enumeraciones';
import { DatePipe } from '@angular/common';
import { HhtService } from "src/app/website/pages/empresa/services/hht.service";
import { SesionService } from "src/app/website/pages/core/services/session.service";
import { DataArea, DataHht } from "src/app/website/pages/empresa/entities/hht";
import { ParametroNavegacionService } from 'src/app/website/pages/core/services/parametro-navegacion.service';
import {CaracterizacionViewService} from "src/app/website/pages/core/services/caracterizacion-view.service"
import {ViewscmcoService} from "src/app/website/pages/core/services/indicador-scmco.service"
import { PrimeNGConfig } from 'primeng/api';
import { ViewHHtMetasService } from "../../services/viewhhtmetas.service";
import { PlantasService } from "../../services/Plantas.service";
import { Plantas } from "../../../comun/entities/Plantas";
import {Hht} from "../../../comun/entities/hht"
import { Localidades } from "../../../ctr/entities/aliados";
import { EmpresaService } from "../../../empresa/services/empresa.service";


@Component({
  selector: 'app-dashboard-corona',
  templateUrl: './dashboard-corona.component.html',
  styleUrls: ['./dashboard-corona.component.scss'],
  providers: [HhtService, SesionService,CaracterizacionViewService,ReporteAtService], 
})
export class DashboardCoronaComponent implements OnInit {

  ili: number | any = 0;
  mensajeILI: string | null = null;
  metaIli?:number | any=0;
  colorIli?:string;

  localeES = locale_es;
  desde?: Date | null;
  hasta?: Date | null;
  NoEventos?:number;
  diasPerdidos?:number;
  incapacidades?:any;

  filtroFechaAt: Date[] | any = [];
  filtroFechaDiasPerdidos: Date[] | any = [];

  areaList: Area[] = [];
  divisiones= new Array();

  title: string = 'Accidentalidad';
  data?:any [];
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
  selectedDivisionResumen: string |null = null;
  Indicadores: any[] = [{label: 'Tasa de Frecuencia', value: 0}, {label: 'Tasa de Severidad', value: 1}, {label: 'Proporción AT mortal', value: 2}];
  Eventos: any[] = [{label: 'Numero AT', value: 0}, {label: 'Numero días perdidos', value: 1}, {label: 'Numero AT mortales', value: 2}, {label: 'Numero AT con cero días', value: 3}];
  divisionesCorona: string[] = ['Almacenes Corona', 'Bathrooms and Kitchen', 'Comercial Corona Colombia', 'Funciones Transversales', 'Insumos Industriales y Energias', 'Mesa Servida', 'Superficies, materiales y pinturas','Corona total'];
  divisionesCoronaConId: any[] = [];
  reporteTabla?:any;
  reporteTabla2?:any;
  totalDiasPerdidosDv?: any[];
  totalEventosDv?: any[];
  totalEventosDv2?: any[];
  totalDiasEventos?: any[];
  random?: any[];
  flag:boolean=false
  flagdiv:boolean=false
  flagevent:boolean=false
  yearRange = new Array();
  añoPrimero:number=2015;
  dateValue= new Date();
  añoActual:number=this.dateValue.getFullYear();
  anioActualResumen: number = new Date().getFullYear();
  fechaInicioResumen?: Date | any;
  fechaFinalResumen?: Date | any;
  yearRangeNumber= Array.from({length: this.añoActual - this.añoPrimero+1}, (f, g) => g + this.añoPrimero);

  //segunda grafica
  CaracterizacionView?:any;
  ContLeve:number=0
  ContGrave:number=0
  ContSevero:number=0;
  ContMortal:number=0;
  CaracterizacionView1:any

  date1?: Date;
  date2?: Date;

  radioGra0:number=0
  radioGra0_1:number=0

  selectArea: any[] = [];

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
  ngAfterViewInit(){
    this.cargarEventosAt().then(() => {
      this.loadResumen();
    })
  }
  ngOnDestroy(): void {
    localStorage.removeItem('reportesAt');
  }

  async ngOnInit() {
    debugger
    this.config.setTranslation(this.localeES);
    //Primera grafica
    this.dataPrimeraGrafica()

    //segunda grafica
    this.dataSegundaGrafica()

    //Tercera grafica
    this.dataTerceraGrafica()
  }

  constructor(
    private paramNav: ParametroNavegacionService,
    private reporteAtService: ReporteAtService, 
    private areaService: AreaService,
    private hhtService: HhtService,
    private sessionService: SesionService,
    private caracterizacionViewService: CaracterizacionViewService,
    private viewscmcoService: ViewscmcoService,
    private viewHHtMetasService: ViewHHtMetasService,
    private plantasService: PlantasService,
    private empresaService: EmpresaService,
    private config: PrimeNGConfig
  ){}

  dataPrimeraGrafica(){
    localStorage.removeItem('reportesAt');

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

    this.filtroFechaAt[0]=this.fechaInicioResumen
    this.filtroFechaAt[1]=(this.fechaFinalResumen)
    this.filtroFechaDiasPerdidos[0]=this.fechaInicioResumen
    this.filtroFechaDiasPerdidos[1]=(this.fechaFinalResumen)
    let areafiltQuery = new FilterQuery();
      areafiltQuery.sortOrder = SortOrder.ASC;
      areafiltQuery.sortField = "nombre";
      areafiltQuery.fieldList = ["nombre", "id"];
      areafiltQuery.filterList = [
        { criteria: Criteria.EQUALS, field: "nivel", value1: "0" },
    ];
    this.divisiones=[]
    await this.areaService.findByFilter(areafiltQuery)
    .then(
      (resp:any) => {
        this.areaList = <Area[]>resp['data'];
        let cont=0
        this.areaList.forEach(element => {
          this.divisionesCoronaConId.push({nombre: element.nombre, id: element.id});
          this.divisiones.push({label:element['nombre'],value:element['nombre']})
          cont+=1
        });
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
  selectPais1:any=null
  selectedDivisionResumen1?: any | null = null;
  PlantaSelect1:any=null
  plantasList:any=[]
  plantasList1:any=[]
  divisionList:any=[]
  divisionList1:any=[]
  empresaId:any  = this.sessionService.getEmpresa()?.id;
  metaPais:number=0;
  metaDivision:number=0;

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



  async funcSelectPais(pais:any,filter:any){ 

    switch (filter) {
      case 'resumen':
        this.selectedDivisionResumen1=null
        this.PlantaSelect1=null
        this.plantasList1=[]
        this.divisionList1=await this.getPlantas(pais.value)
        this.loadResumen()
        break;
      case 'resumen2':
        this.localidadesList1=[]
        this.LocalidadSelect1=[]
        this.selectedDivisionResumen2=null
        this.divisionList2=await this.getLocalidades(pais.value)
        this.CardsClasificacion()
        break;
      default:
        break;
      }
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
          console.log(res)
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
    this.PlantaSelect1=null
    let dv:any
    let plantasList:any
    // if(filter!='resumen'){
      dv = this.divisionList.filter((dv1:any) => dv1.nombre == div.value);
      plantasList=this.plantasList.filter((pl1:any) => pl1.area_id == dv[0].id);


    switch (filter) {
      case 'resumen':
        this.PlantaSelect1=null
        this.plantasList1=[]
        if(plantasList)
        for(const pl of plantasList){
          this.plantasList1.push({label:pl.nombre,value:pl.nombre})
        }
        this.loadResumen()
        break;
      default:
        break;
    }
  }

  async loadResumen(){
    let filterQueryCoronameta = new FilterQuery();
    let filterQueryCorona = new FilterQuery();
    let filterQueryTemp = new FilterQuery();
    let empresaId = this.sessionService.getEmpresa()?.id;
    let hhtEmpresa: Hht[] = [];
    let hhtTemp: Hht[] = [];
    let reportesAt: any[] = JSON.parse(localStorage.getItem('reportesAt')!).map((at:any) => at);
    
    filterQueryCoronameta.sortOrder = SortOrder.ASC;
    filterQueryCoronameta.sortField = "id";
    filterQueryCoronameta.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.anioActualResumen.toString()},
      {criteria: Criteria.EQUALS, field: "empresaId", value1: empresaId}
    ];
    if(this.selectPais1)if(this.selectPais1 != 'Corona Total')filterQueryCoronameta.filterList.push({criteria: Criteria.EQUALS, field: "pais", value1: this.selectPais1.toString()})
    if(this.selectedDivisionResumen1)filterQueryCoronameta.filterList.push({criteria: Criteria.EQUALS, field: "nombreDivision", value1: this.selectedDivisionResumen1.toString()})
    if(this.PlantaSelect1)filterQueryCoronameta.filterList.push({criteria: Criteria.EQUALS, field: "nombrePlanta", value1: this.PlantaSelect1.toString()})

    filterQueryCorona.sortOrder = SortOrder.ASC;
    filterQueryCorona.sortField = "id";
    filterQueryCorona.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.anioActualResumen.toString()},
      {criteria: Criteria.EQUALS, field: "empresa.id", value1: empresaId},
      {criteria: Criteria.EQUALS, field: "empresaSelect", value1: empresaId}
    ];
    filterQueryCorona.fieldList=this.fieldHht;

    if(this.selectPais1)if(this.selectPais1 != 'Corona Total')filterQueryCorona.filterList.push({criteria: Criteria.EQUALS, field: "planta.pais", value1: this.selectPais1.toString()})
    if(this.selectedDivisionResumen1)filterQueryCorona.filterList.push({criteria: Criteria.EQUALS, field: "planta.area.id", value1: this.divisionesCoronaConId.find((div:any) => div.nombre === this.selectedDivisionResumen1).id.toString()})
    if(this.PlantaSelect1)filterQueryCorona.filterList.push({criteria: Criteria.EQUALS, field: "planta.nombre", value1: this.PlantaSelect1.toString()})

    filterQueryTemp.sortOrder = SortOrder.ASC;
    filterQueryTemp.sortField = "id";
    filterQueryTemp.filterList = [
      {criteria: Criteria.EQUALS, field: "anio", value1: this.anioActualResumen.toString()},
      {criteria: Criteria.EQUALS, field: "empresa.id", value1: empresaId},
      {criteria: Criteria.NOT_EQUALS, field: "empresaSelect", value1: empresaId}
    ];
    filterQueryTemp.fieldList=this.fieldHht;

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
      console.log(res.data)
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
        console.error('No se obtuvieron registros meta de la empresa.');
        this.metaIli=0
      }
    }).catch(err => {
      console.error('Error al obtener metas de la empresa');
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

    accidentesConDiasPerdidos = reportesAt.map(ele=>ele)
    .filter(at => at.incapacidades !== null && at.incapacidades !== 'null').filter(at => {
      let diasTotales = (<Array<any>>JSON.parse(at.incapacidades))
      .reduce((count, incapacidad) => {
        return count + incapacidad.diasAusencia;
      }, 0);
      return diasTotales > 0 ? true : false;
    }).length;

    let totalDiasSeveridad = 0;

    totalDiasSeveridad = reportesAt
    .filter(at => at.incapacidades !== null && at.incapacidades !== 'null')
    .reduce((count, at) => {
      return count + JSON.parse(at.incapacidades).reduce((count2:any, incapacidad:any) => {
        return count2 + incapacidad.diasAusencia;
      }, 0);
    }, 0);



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


  IndicadoresAccidentalidad(){
    this.paramNav.redirect('app/ind/accidentalidad');
  }

  //segunda grafica
  localidadesList:any=[]
  localidadesList1:any=[]
  LocalidadSelect1:any=[]

  selectPais2:any
  selectedDivisionResumen2?: any | null = null;
  PlantaSelect2:any=null
  // plantasList:any=[]
  // plantasList2:any=[]
  // divisionList:any=[]
  divisionList2:any=[]


  async dataSegundaGrafica(){
    this.date1 = new Date(new Date().getFullYear(), 0, 1);
    this.date2 = new Date();
    await this.caracterizacionViewService.findAllCAR().then(async (resp: any)=>{
      debugger
      console.log(resp);
      
      this.CaracterizacionView=resp
      this.CaracterizacionView.map((res1:any)=>{
        res1.hora=Number(res1.hora.substr(0,2))
        res1.fechaaccidente=new Date(res1.fechaaccidente)
        res1.fechanacimientoempleado=new Date(res1.fechanacimientoempleado)
        res1.fechaingresoempleado=new Date(res1.fechaingresoempleado)
      });

      this.CardsClasificacion();
    })
  }

  async getLocalidades(pais:string | null){
    if(pais){
      let filterLocalidadQuery = new FilterQuery();
      filterLocalidadQuery.sortField = "id";
      filterLocalidadQuery.sortOrder = -1;
      filterLocalidadQuery.fieldList = this.fieldsLoc;
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

  async CardsClasificacion(){

    this.CaracterizacionView1 = await this.CaracterizacionView

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
    if(this.selectPais1)if(this.selectPais1!='Corona Total')this.CaracterizacionView1 = this.CaracterizacionView1.filter((at:any) => at.pais == this.selectPais2);
    if(this.selectedDivisionResumen2)if(this.selectedDivisionResumen2.length>0){
      reportesAtCopyDiv=[]
      this.selectedDivisionResumen2.forEach((element:any) => {
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
  funcSelectDivision2(div:any,filter:any){
    let dv:any
    let localidadesList:any
    if(filter!='resumen2'){
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
      case 'resumen2':
        this.localidadesList1=[]
        this.LocalidadSelect1=[]
        if(localidadesList)
        for(const loc of localidadesList){
          this.localidadesList1.push({label:loc.localidad,value:loc.localidad})
        }
        this.CardsClasificacion()
        break;
      default:
        break;
    }
      
  }
  IndicadoresCaracterizacion(){
    this.paramNav.redirect('app/ind/indcaracterizacion');
  }

//Tercera grafica
  async dataTerceraGrafica(){
    this.fechaDesde0 = new Date(new Date().getFullYear(), 0, 1);
    this.fechaHasta0 = new Date();
    await this.cargarDatos()
    this.numeroCasos()
  }

  async cargarDatos(){
    // this.divisiones.forEach(resp=>{
    //   this.divisiones0.push({label:resp,value:resp})
    //   this.divisiones1.push({label:resp,value:resp})
    //   this.divisiones2.push(resp)
    //   this.divisiones3.push({label:resp,value:resp})
    // })
    // this.divisiones0.push({label:'Corona total',value:'Corona total'})
    // this.divisiones2.push('Corona total')
    await this.viewscmcoService.findByEmpresaId().then((resp:any)=>{
      this.datos=resp
    })

  }
  //Grafica cards
  datos?:any[];
  numCasos:number=0;
  casosAbiertos:number=0;
  casosCerrados:number=0;
  datosNumeroCasos?:any[];
  selecDiv0=null

  fechaDesde0?:Date | any;
  fechaHasta0?:Date |any;
  numeroCasos(){
    this.numCasos=0
    this.casosAbiertos=0
    this.datosNumeroCasos=this.datos
    this.datosNumeroCasos=this.filtroDivisionMono(this.selecDiv0,this.datosNumeroCasos)
    this.datosNumeroCasos=this.filtroFecha(this.fechaDesde0,this.fechaHasta0,this.datosNumeroCasos)

    this.numCasos=this.datosNumeroCasos!.length
    this.datosNumeroCasos!.forEach(resp=>{
      if(resp['estadoDelCaso']=='1')this.casosAbiertos=this.casosAbiertos+1
    })
    this.casosCerrados=this.numCasos-this.casosAbiertos
  }

  filtroDivisionMono(selecDiv:any,datos:any){
    let datos0=[]
    if(selecDiv){
      if(selecDiv=='Corona total'){
        datos0=datos
      }else{
        datos0=datos.filter((resp1:any)=>{
          return resp1['divisionUnidad']==selecDiv
        })
      }
    }else{
      datos0=datos
    }
    return datos0
  }
  filtroFecha(fechaDesde:Date,fechaHasta:Date,datos:any){
    let datos0
    if(fechaHasta)fechaHasta=new Date(new Date(fechaHasta).setMonth(new Date(fechaHasta).getMonth()+1))

    if(fechaDesde && fechaHasta){
      datos0=datos.filter((resp:any)=>{return new Date(resp.fechaCreacion)>=fechaDesde && new Date(resp.fechaCreacion)<fechaHasta})
    }
    else if(fechaDesde){
      datos0=datos.filter((resp:any)=>{return new Date(resp.fechaCreacion)>=fechaDesde})
    }
    else if(fechaHasta){
      datos0=datos.filter((resp:any)=>{return new Date(resp.fechaCreacion)<fechaHasta})
    }
    else{
      datos0=datos
    }
    return datos0
  }
  IndicadoresCasosMedicos(){
    this.paramNav.redirect('app/ind/indcasosmedicos');
  }

}

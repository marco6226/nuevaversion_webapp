import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Area } from 'src/app/website/pages/empresa/entities/area';
import { AreaService } from 'src/app/website/pages/empresa/services/area.service';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { SortOrder } from "src/app/website/pages/core/entities/filter";
import { Criteria } from "../../../core/entities/filter";
import { HhtService } from 'src/app/website/pages/core/services/hht.service'
import { DataArea, DataHht, DataPlanta, Hht } from "src/app/website/pages/comun/entities/hht";
import { PlantasService } from 'src/app/website/pages/core/services/Plantas.service';
import { Plantas } from 'src/app/website/pages/comun/entities/Plantas';
import { MessageService } from 'primeng/api';
import { Observable, Observer } from 'rxjs';
import { EmpresaService } from 'src/app/website/pages/empresa/services/empresa.service';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { Empresa } from 'src/app/website/pages/empresa/entities/empresa';

@Component({
  selector: 'app-horahombrestrabajada',
  templateUrl: './hora-hombres-trabajada.component.html',
  styleUrls: ['./hora-hombres-trabajada.component.scss'],
  providers: [HhtService, PlantasService, MessageService]
})
export class HoraHombresTrabajadaComponent implements OnInit, AfterViewInit {
  fechaActual = new Date();
  areaList: Area[] = [];
  plantasList: Plantas[] = [];
  dateValue= new Date();
  añoPrimero:number=2015;
  añoActual:number=this.dateValue.getFullYear();
  yearRangeNumber= Array.from({length: this.añoActual - this.añoPrimero+1}, (f, g) => g + this.añoPrimero);
  yearRange = new Array();
  paisSelect:any;
  pais: Array<any> = [
    {label: 'Colombia', value: 'Colombia'},
    {label: 'Costa Rica', value: 'Costa Rica'},
    {label: 'EEUU', value: 'EEUU'},
    {label: 'Guatemala', value: 'Guatemala'},
    {label: 'Honduras', value: 'Honduras'},
    {label: 'Mexico', value: 'Mexico'},
    {label: 'Nicaragua', value: 'Nicaragua'}
  ];
  anioSelected?: any;
  empresaSelected?: any;
  mostrarForm: boolean = false;
  guardarFlag:boolean=true;
  dataHHT:DataHht[] = [];
  listaHHT: Hht[] = [];
  metaAnualILI?: number | null;
  metaMensualILI?: number | null;
  mostrarBotones: boolean = false;
  esNuevoRegistro: boolean = true;
  meses: Array<any> = [
    {label: 'Enero', value: 'Enero'},
    {label: 'Febrero', value: 'Febrero'},
    {label: 'Marzo', value: 'Marzo'},
    {label: 'Abril', value: 'Abril'},
    {label: 'Mayo', value: 'Mayo'},
    {label: 'Junio', value: 'Junio'},
    {label: 'Julio', value: 'Julio'},
    {label: 'Agosto', value: 'Agosto'},
    {label: 'Septiembre', value: 'Septiembre'},
    {label: 'Octubre', value: 'Octubre'},
    {label: 'Noviembre', value: 'Noviembre'},
    {label: 'Diciembre', value: 'Diciembre'}
  ];
  selectedMes?: any;
  Empresas: Array<any> = [
    // {label: 'Corona', value: '22'},
    // {label: 'Temporal uno', value: '12341'},
    // {label: 'Temporal dos', value: '12342'},
    // {label: 'Temporal tres', value: '12343'},
  ];
  // @ViewChildren('acordionTab') childListaMeses: QueryList <any>;
  cargando: boolean = false;

  constructor(
    private areaService: AreaService,
    private hhtService: HhtService,
    private plantasService: PlantasService,
    private messageService: MessageService,
    private empresaService: EmpresaService,
    private sessionService: SesionService,
  ) { }

  async ngOnInit() {
  }

  ngAfterViewInit(): void {
  }
  flagHHT:boolean=false
  async onSelectPais(){
    this.selectedMes=null
    this.anioSelected=null
    this.empresaSelected=null
    this.cargando = false;
    this.mostrarBotones = false;
    this.esNuevoRegistro = true;
    this.metaAnualILI=0;
    this.metaMensualILI=0;
    this.flagHHT=false
    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }

    let empresa: Empresa = this.sessionService.getEmpresa()!;
    if(empresa.idEmpresaAliada == null){
      this.Empresas = [];
      this.Empresas.push({label: empresa.razonSocial, value: empresa.id})
      this.empresaService.getTemporalesByEmpresa(empresa.idEmpresaAliada == null ? Number(empresa.id) : empresa.idEmpresaAliada)
      .then((res: Empresa[] | any) => {
        res.forEach((emp:any) => {
          this.Empresas.push({label: emp.razonSocial, value: emp.id});
        });
      })
    }else{
      this.Empresas = [];
      this.Empresas.push({label: empresa.razonSocial, value: empresa.id});
    }
    await this.getAreas().then();
    await this.getPlantas(empresa.idEmpresaAliada == null ? Number(empresa.id) : Number(empresa.idEmpresaAliada)).then();
    setTimeout(() => {
      this.flagHHT=true
    }, 500);
  }

  async getAreas(){
    let areafiltQuery = new FilterQuery();
    areafiltQuery.sortOrder = SortOrder.ASC;
    areafiltQuery.sortField = "nombre";
    areafiltQuery.fieldList = ["id", "nombre","nivel"];
    areafiltQuery.filterList = [
      { criteria: Criteria.EQUALS, field: "nivel", value1: "0" },
    ];
    this.areaService.findByFilter(areafiltQuery).then(
      (resp:any) => {
        this.areaList = (<Area[]>resp['data']).map(area => area);
      }
    );
    console.info('Areas cargadas');
  }

  async getPlantas(empresaId: number){
    // this.plantasService.getPlantasByEmpresaId(empresaId)
    let filterPlantaQuery = new FilterQuery();
    filterPlantaQuery.sortField = "id";
    filterPlantaQuery.sortOrder = -1;
    filterPlantaQuery.filterList = [
      { field: 'id_empresa', criteria: Criteria.EQUALS, value1: empresaId.toString() },
      // { field: 'tipo', criteria: Criteria.EQUALS, value1: 'HHT' },
      { field: 'pais', criteria: Criteria.EQUALS, value1: this.paisSelect },
    ];
    this.plantasService.getPlantaWithFilter(filterPlantaQuery)
      .then((res:any) => {
        this.plantasList = (<Plantas[]>res.data).map(planta => planta);
      }).catch(err => {
        this.plantasList = [];
        console.error('Sin plantas: ',err);
      });
      console.info('Plantas cargadas');
  }

  onSelectAnio(event: number){
    this.anioSelected = event;
    if(this.empresaSelected && this.anioSelected) this.loadForm();
  }

  onSelectEmpresa(event: any){
    this.empresaSelected = event.value;
    if(this.empresaSelected && this.anioSelected) this.loadForm();
  }

  async loadForm(){
    this.mostrarForm = false;
    this.mostrarBotones = false;
    this.cargando = true;
    await this.initFormHHT().then();
    await this.loadDataHHT().then();
    this.mostrarForm = true;
    this.mostrarBotones = true;
    setTimeout(() => {
      this.cargando = false
    }, 2000);
  }

  async loadDataHHT(){
    let idhttquery = new FilterQuery();
    idhttquery.sortOrder = SortOrder.DESC;
    idhttquery.sortField = "id";
    idhttquery.filterList = [
      {criteria: Criteria.EQUALS, field: 'anio', value1: this.anioSelected?.value},
      {criteria: Criteria.EQUALS, field: 'empresaSelect', value1: this.empresaSelected}
    ];
    
    this.hhtService.findByFilter(idhttquery)
    .then((res:any) => {
      if(res['data'].length == 0){
        this.metaAnualILI = null;
        this.metaMensualILI = null;
        this.esNuevoRegistro = true;
      } else {  
        this.listaHHT = res['data'].map((hht:any) => hht);
        this.loadDataOnForm();
        this.esNuevoRegistro = false;
      }
    });
  }

  async loadDataOnForm(){
    this.meses.forEach((mes, index) => {
      let hht = this.listaHHT.find(hht => hht.mes === mes.value);
      let data = <DataHht>JSON.parse(hht?.valor!).Data;
      this.metaAnualILI = JSON.parse(hht?.valor!).ILI_Anual;
      this.metaMensualILI = JSON.parse(hht!.valor!).ILI_Mensual;
      
      this.dataHHT[index].id = data.id;
      this.dataHHT[index].HhtMes = data.HhtMes;
      this.dataHHT[index].NumPersonasMes = data.NumPersonasMes;
      this.dataHHT[index].Areas!.forEach((area:any) => {
        let dataArea = data.Areas!.find(ar => ar.id === area.id);
        area.NumPersonasArea = dataArea?.NumPersonasArea;
        area.ILIArea = dataArea?.ILIArea ? dataArea.ILIArea : 0;
        area.HhtArea = dataArea?.HhtArea ? dataArea.HhtArea : 0;
        area.Plantas.forEach((pl:any) => {
          let dataPlanta = dataArea?.Plantas!.find(pl2 => pl2.id === pl.id);
          pl.HhtPlanta = dataPlanta ? dataPlanta.HhtPlanta : 0;
          pl.NumPersonasPlanta = dataPlanta ? dataPlanta.NumPersonasPlanta : 0;
        });
      });
      
      data.Areas!.forEach((area, indexAr) => {
        if(area.Plantas!.length > 0){
          this.calcularTotalesPorArea(index, indexAr);
        }
      });
      this.calcularTotalesMes(index);
    });
  }

  async initFormHHT(){
    this.dataHHT = [];
    let tempDataHHT: DataHht[] = []; 
    this.meses.forEach((mes, index) => {
      tempDataHHT.push({
        id: index,
        mes: mes.value,
        NumPersonasMes: null,
        HhtMes: null,
        Areas: this.areaList.map((area):DataArea => {
          return {
            id: Number(area.id),
            NumPersonasArea: null,
            HhtArea: null,
            ILIArea: null,
            Plantas: this.plantasList.filter(pl => pl.id_division == area.id).map((planta):DataPlanta => {
              return {
                id: planta.id,
                NumPersonasPlanta: null,
                HhtPlanta: null,
              }
            })
          }
        })
      });
      // console.timeLog('areas');
    });
    
    this.dataHHT = Array.from(tempDataHHT);
  }

  getPlantasByArea(id: any): Plantas[] | null{
    if(!this.plantasList){
      return null;
    }
    let plantas = this.plantasList.filter(pl => pl.id_division == id);
    return plantas.length > 0 ? plantas: null;
  }

  tienePlantas(areaId: any){
    return this.plantasList.find(planta => planta.id_division == areaId) == undefined ? false : true;
  }

  async guardarHht(){
    let flagListHHT = false;
    if(this.listaHHT.length === 0) flagListHHT = true;
    await this.meses.forEach((mes, index) => {
      
      let hht = new Hht();
      hht.id = null;
      hht.anio = Number(this.anioSelected?.value);
      hht.empresaSelect = this.empresaSelected;
      hht.mes = mes.value; 
      hht.valor = JSON.stringify({
        ILI_Anual: this.metaAnualILI,
        ILI_Mensual: this.metaMensualILI,
        Data: this.dataHHT[index]
      });

      if(flagListHHT){
        this.listaHHT.push(hht);
      }
      
      this.hhtService.create(hht).then(() => {
        // console.info('HHT creado para el mes de: ', `${mes.value} de ${this.anioSelected.value}`);
      }).catch((err) => {
        console.error(`Error al guardar HHT del mes de ${mes.value} de ${hht.anio}`, err);
      });
    });
    setTimeout(() => {
      this.loadDataHHT();
    }, 2000);
    this.messageService.add({key: 'hht', severity: 'success', detail: 'Registro HHT guardado', summary: 'Guardado', life: 6000});
    this.esNuevoRegistro = false;
  }

  async actualizarHht(){
    await this.meses.forEach(async (mes, index) => {
      let HHT = new Hht();
      let localHHT = this.listaHHT.filter(hht => hht.mes == mes.value)[0];
      HHT.id = localHHT.id;
      HHT.mes = localHHT.mes;
      HHT.anio = localHHT.anio;
      HHT.empresaSelect = localHHT.empresaSelect;
      HHT.valor = JSON.stringify({
        ILI_Anual: this.metaAnualILI,
        ILI_Mensual: this.metaMensualILI,
        Data: this.dataHHT.filter(hht => hht.mes == mes.value)[0]
      })

      if(HHT){
        await this.hhtService.update(HHT).then(() => {
          // console.info(`HHT actualizado para el mes de : ${mes.value} de ${HHT.anio}`);
        }).catch((err) => {
          console.error(`Error al actualizar HHT del mes de ${mes.value} de ${HHT.anio}`, err);
        });
      }
    });
    setTimeout(() => {
      this.loadDataHHT().then();
    }, 2000);
    this.messageService.add({key: 'hht', severity: 'success', summary: 'Actualizado', detail: 'Registro HHT actualizado', life: 6000});
  }

  calcularTotalesMes(mesIndex: number){
    let totalPersonas = 0;
    let totalHHT = 0;
    
    this.dataHHT[mesIndex].Areas!
    .forEach((area, index) => {
      totalPersonas += area.NumPersonasArea == null ? 0 : area.NumPersonasArea;
      totalHHT += area.HhtArea == null ? 0 : area.HhtArea;
    });

    this.dataHHT[mesIndex].NumPersonasMes = totalPersonas;
    this.dataHHT[mesIndex].HhtMes = totalHHT;
  }

  calcularTotalesPorArea(mesIndex:number, areaIndex: number){
    let totalPersonas = 0;
    let totalHHT = 0;
    this.dataHHT[mesIndex].Areas![areaIndex].Plantas!
    .forEach((planta, index) => {
      totalPersonas += planta.NumPersonasPlanta == null ? 0 : planta.NumPersonasPlanta;
      totalHHT += planta.HhtPlanta == null ? 0 : planta.HhtPlanta;
    });
    this.dataHHT[mesIndex].Areas![areaIndex].NumPersonasArea = totalPersonas;
    this.dataHHT[mesIndex].Areas![areaIndex].HhtArea = totalHHT;
    this.calcularTotalesMes(mesIndex);
  }

  findEmpresaById(id: string){
    return this.Empresas.find(emp => emp.value == id).label;
  }

  setMetaPorArea(indiceArea: number, meta: number){
    this.meses.forEach((mes, index) => {
      this.dataHHT![index].Areas![indiceArea].ILIArea = meta;
    });
  }

}

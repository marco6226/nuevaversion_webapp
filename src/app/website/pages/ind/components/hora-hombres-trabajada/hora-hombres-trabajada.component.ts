import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Area } from 'src/app/website/pages/empresa/entities/area';
import { AreaService } from 'src/app/website/pages/empresa/services/area.service';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { SortOrder } from "src/app/website/pages/core/entities/filter";
import { Criteria } from "../../../core/entities/filter";
import { HhtService } from 'src/app/website/pages/core/services/hht.service'
import { DataArea, DataHht, DataPlanta, Hht, HhtIli } from "src/app/website/pages/comun/entities/hht";
import { PlantasService } from 'src/app/website/pages/core/services/Plantas.service';
import { Plantas } from 'src/app/website/pages/comun/entities/Plantas';
import { MessageService } from 'primeng/api';
import { Observable, Observer } from 'rxjs';
import { EmpresaService } from 'src/app/website/pages/empresa/services/empresa.service';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { Empresa } from 'src/app/website/pages/empresa/entities/empresa';
import { HhtIliService } from '../../../core/services/hht-ili.service';

@Component({
  selector: 'app-horahombrestrabajada',
  templateUrl: './hora-hombres-trabajada.component.html',
  styleUrls: ['./hora-hombres-trabajada.component.scss'],
  providers: [HhtService, PlantasService, MessageService, HhtIliService]
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
    {label: `Total ${this.sessionService.getEmpresa()?.razonSocial}`, value: 'Total'},
    {label: 'Colombia', value: 'Colombia'},
    {label: 'Costa Rica', value: 'Costa Rica'},
    {label: 'EEUU', value: 'EEUU'},
    {label: 'Guatemala', value: 'Guatemala'},
    {label: 'Honduras', value: 'Honduras'},
    {label: 'Mexico', value: 'Mexico'},
    {label: 'Nicaragua', value: 'Nicaragua'}
  ];
  anioSelected?: any;
  empresaSelected?: number[]|number;
  mostrarForm: boolean = false;
  guardarFlag:boolean=true;
  dataHHT:DataHht[] = [];
  listaHHT: Hht[] = [];
  listaHhtIli: HhtIli[] = [];
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
  flagHHT:boolean=false;
  totalesAnio: {hombres: number, hht: number} = {hombres: 0, hht: 0};

  constructor(
    private areaService: AreaService,
    private hhtService: HhtService,
    private plantasService: PlantasService,
    private messageService: MessageService,
    private empresaService: EmpresaService,
    private sessionService: SesionService,
    private hhtIliService: HhtIliService,
  ) { }

  async ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  async onSelectPais(){
    this.selectedMes=null
    this.anioSelected=null
    this.empresaSelected=[]
    this.cargando = false;
    this.mostrarBotones = false;
    this.esNuevoRegistro = true;
    this.metaAnualILI=0;
    this.metaMensualILI=0;
    this.listaHHT = [];
    this.flagHHT=false;
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
    if(this.anioSelected && this.empresaSelected && this.paisSelect) this.loadForm();
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
    ];

    if(this.paisSelect !== 'Total') filterPlantaQuery.filterList.push({ field: 'pais', criteria: Criteria.EQUALS, value1: this.paisSelect });

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
    if(
        (typeof this.empresaSelected == 'number' && this.empresaSelected || (typeof this.empresaSelected == 'object' && this.empresaSelected.length > 0))
        && this.anioSelected && this.paisSelect
      ) {
        this.loadForm();
      }
  }

  onSelectEmpresa(event: any){
    this.empresaSelected = event.value;
    if(
        (typeof this.empresaSelected == 'number' && this.empresaSelected || (typeof this.empresaSelected == 'object' && this.empresaSelected.length > 0))
        && this.anioSelected && this.paisSelect
      ) {
        this.loadForm();
      }
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
    ];

    if(typeof this.empresaSelected == 'number' && this.empresaSelected){
      idhttquery.filterList.push({criteria: Criteria.EQUALS, field: 'empresaSelect', value1: this.empresaSelected?.toString()});
    } else if(typeof this.empresaSelected == 'object') {
      idhttquery.filterList.push({criteria: Criteria.CONTAINS, field: 'empresaSelect', value1: `{${this.empresaSelected.join(',')}}`});
    }

    if(this.paisSelect !== 'Total'){
      idhttquery.filterList.push({criteria: Criteria.EQUALS, field: 'planta.pais', value1: this.paisSelect});
    }
    
    await this.hhtService.findByFilter(idhttquery)
    .then(async (res:any) => {
      if(res['data'].length == 0){
        this.listaHHT = [];
        this.listaHhtIli = [];
        this.metaAnualILI = null;
        this.metaMensualILI = null;
        this.esNuevoRegistro = true;
      } else {  
        this.listaHHT = res['data'].map((hht:Hht) => hht);
        // Promise y flatMap permiten que las operaciones se hagan asincronas, así evitamos usar forEach anidados 
        Promise.all(
          this.meses.flatMap(async (mes, indexMes) => {
            // console.log(`Mes ${indexMes}`);
            await Promise.all(
              (this.dataHHT[indexMes].Areas ?? []).flatMap(async (area, indexArea) => {
                await Promise.all(
                  (area.Plantas ?? []).flatMap(async (planta, indexPlanta) => {
                    let hhtPlanta: Hht | undefined = this.listaHHT.find(hht => hht.planta && hht.planta.id == planta.id && mes.value == hht.mes);
                    // console.log(planta, mes, hhtPlanta);
                    if(!hhtPlanta) return;
                    planta.NumPersonasPlanta = hhtPlanta.numeroPersonas;
                    planta.HhtPlanta = hhtPlanta.hht;
                    // console.log(`Planta ${hhtPlanta.planta?.nombre} cargada, mes ${hhtPlanta.mes}`);
                  })
                );
              })
            );
          })
        );

        if(this.paisSelect !== 'Total') {
          let hhtIliQuery: FilterQuery = new FilterQuery();
          hhtIliQuery.sortOrder = SortOrder.ASC;
          hhtIliQuery.sortField = "id";
          hhtIliQuery.filterList = [
            {criteria: Criteria.EQUALS, field: 'anio', value1: this.anioSelected?.value},
            {criteria: Criteria.EQUALS, field: 'idEmpresa', value1: this.empresaSelected},
            {criteria: Criteria.EQUALS, field: 'pais', value1: this.paisSelect}
          ]
          
          this.hhtIliService.findByFilter(hhtIliQuery)
          .then((res: any) => {
            this.listaHhtIli = res['data'].map((item: HhtIli) => item);
            this.metaAnualILI = res['data'][0].iliEmpresa;
            this.dataHHT.forEach((hht => {
              hht.Areas?.forEach((area) => {
                area.ILIArea = ((<HhtIli[]>res['data']).find(hhtIli => hhtIli.idDivision == area.id)?.iliDivision) ?? null;
              });
            }))
          });
        }
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
      Promise.all(
        this.dataHHT.flatMap((hht => {
          hht.Areas?.forEach((area, indexAr) => {
            if(area.Plantas && area.Plantas.length > 0) this.calcularTotalesPorArea(index, indexAr);
          });
          this.calcularTotalesMes(index);
        }))
      );

    });
    this.getTotalesAnio();
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
    this.cargando = true;
    await Promise.all(
      this.meses.flatMap(async (mes, index) => {
        Promise.all(
          (this.dataHHT[index].Areas ?? []).flatMap(async (area, indexArea) => {
            Promise.all(
              (area.Plantas ?? []).flatMap(async (planta, indexPlanta) => {
                let hht = new Hht();
                hht.id = null;
                hht.anio = Number(this.anioSelected.value);
                hht.empresaSelect = this.empresaSelected?.toString();
                hht.mes = mes.value;
                hht.planta = new Plantas();
                hht.planta.id = planta.id!;
                hht.numeroPersonas = planta.NumPersonasPlanta ?? 0;
                hht.hht = planta.HhtPlanta ?? 0;

                this.listaHHT.push(hht);
                await Promise.resolve();
              })
            );
          })
        );
      })
    );

    let listaHhtIliAux: HhtIli[] = [];
    await Promise.all(
      (this.dataHHT[0].Areas ?? []).flatMap(async (area, indexArea) => {
        listaHhtIliAux.push({
          id: null,
          anio: Number(this.anioSelected.value),
          idDivision: area.id!,
          iliDivision: area.ILIArea!,
          idEmpresa: Number(this.sessionService.getParamEmp()),
          iliEmpresa: this.metaAnualILI!,
          pais: this.paisSelect,
          empresaSelected: Number(this.empresaSelected)
        });
      })
    );
    
    this.hhtService.createHht(this.listaHHT).then((res: any) => {
      // console.info('HHT creado para el mes de: ', `${mes.value} de ${this.anioSelected.value}`);
      this.listaHHT = res;
      if(!this.sessionService.getEmpresa()?.idEmpresaAliada && this.sessionService.getParamEmp() == this.empresaSelected?.toString()){
        this.hhtIliService.createHhtIli(listaHhtIliAux).then((res: any) => {
          this.listaHhtIli = res;
          this.loadDataHHT();
          this.messageService.add({key: 'hht', severity: 'success', detail: 'Registro HHT guardado', summary: 'Guardado', life: 6000});
          this.esNuevoRegistro = false;
        }).catch(() => {
          console.error('Error al guardar ILI');
        });
      } else {
        this.loadDataHHT();
        this.messageService.add({key: 'hht', severity: 'success', detail: 'Registro HHT guardado', summary: 'Guardado', life: 6000});
        this.esNuevoRegistro = false;
      }
    }).catch((err) => {
      console.error(`Error al guardar HHT`);
    }).finally(() => this.cargando = false);
  }

  async actualizarHht(){
    this.cargando = true;
    await Promise.all(
      this.meses.flatMap(async (mes, index) => {
        Promise.all(
          (this.dataHHT[index].Areas ?? []).flatMap(async (area, indexArea) => {
            Promise.all(
              (area.Plantas ?? []).flatMap(async (planta, indexPlanta) => {
                this.listaHHT.map(hht => {
                  if(hht.planta?.id == planta.id && hht.mes == mes.value){
                    hht.numeroPersonas = planta.NumPersonasPlanta ?? 0;
                    hht.hht = planta.HhtPlanta ?? 0;
                  }
                  return hht;
                });
                // this.listaHHT.push(hht);
                await Promise.resolve();
              })
            );
          })
        );
      })
    );

    //let hhtIli: HhtIli[] = [];
    this.listaHhtIli.forEach(hhtIli => {
      hhtIli.iliDivision = this.dataHHT[0].Areas?.find(area => area.id == hhtIli.idDivision)?.ILIArea ?? undefined;
      hhtIli.iliEmpresa = this.metaAnualILI ?? undefined;
    });
    // await Promise.all(
    //   (this.dataHHT[0].Areas ?? []).flatMap(async (area, indexArea) => {
    //     hhtIli.push({
    //       anio: Number(this.anioSelected),
    //       idDivision: area.id!,
    //       iliDivision: area.ILIArea!,
    //       idEmpresa: Number(this.sessionService.getParamEmp()),
    //       iliEmpresa: this.metaAnualILI!,
    //       pais: this.paisSelect,
    //       empresaSelected: this.empresaSelected
    //     });
    //   })
    // );

    //console.log(this.listaHHT, this.listaHhtIli);
    await this.hhtService.updateHht(this.listaHHT).then((res: any) => {
      // console.info(`HHT actualizado para el mes de : ${mes.value} de ${HHT.anio}`);
      this.listaHHT = res;
      if(!this.sessionService.getEmpresa()?.idEmpresaAliada && this.sessionService.getParamEmp() == this.empresaSelected?.toString()){
        this.hhtIliService.updateHhtIli(this.listaHhtIli).then(() => {
          this.loadDataHHT();
          this.messageService.add({key: 'hht', severity: 'success', summary: 'Actualizado', detail: 'Registro HHT actualizado', life: 6000});
        }).catch(err => console.error('Error al actualizar ILI'));
      } else {
        this.loadDataHHT();
        this.messageService.add({key: 'hht', severity: 'success', summary: 'Actualizado', detail: 'Registro HHT actualizado', life: 6000});
      }
    }).catch((err) => {
      console.error(`Error al actualizar HHT`);
    }).finally(() => this.cargando = false);
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

    this.dataHHT[mesIndex].Areas![areaIndex].Plantas
    ?.forEach(planta => {
      let plantasDB = this.listaHHT.filter(hht => hht.planta?.id == planta.id && hht.mes == this.meses[mesIndex].value);
      
      let numTrabajadoresDB = plantasDB.reduce((accumulator, current) => {
        accumulator += current.numeroPersonas ?? 0;
        return accumulator;
      }, 0);
      
      let hhtDB = plantasDB.reduce((accumulator, current) => {
        accumulator += current.hht ?? 0;
        return accumulator;
      }, 0);
      
      totalPersonas += planta.NumPersonasPlanta == null ?
        0 : this.paisSelect == 'Total' ?
        numTrabajadoresDB : planta.NumPersonasPlanta;
      
      totalHHT += planta.HhtPlanta == null ? 
        0 : this.paisSelect == 'Total' ?
        hhtDB : planta.HhtPlanta;
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

  getTotalesAnio(){
    this.totalesAnio = {hombres: 0, hht: 0};
    let contMeses = 0;
    let totalHombres = 0;
    this.dataHHT.forEach((data) => {
      contMeses += data.NumPersonasMes && data.NumPersonasMes > 0 ? 1 : 0;
      totalHombres += data.NumPersonasMes ?? 0;
      this.totalesAnio.hht += data.HhtMes ?? 0;
    });
    if(contMeses == 0) contMeses += 1;
    this.totalesAnio.hombres = totalHombres/contMeses
  }

}

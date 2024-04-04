import { Component, OnInit } from '@angular/core';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Criteria, SortOrder } from '../../../core/entities/filter';
import { AreaService } from '../../../empresa/services/area.service';
import { Area } from '../../../empresa/entities/area';
import { SesionService } from '../../../core/services/session.service';
import { PlantasService } from '../../../core/services/Plantas.service';
import { Meta, Modulos, ValorMeta } from '../../entities/meta';
import { MetaService } from '../../service/meta.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-metas',
  templateUrl: './metas.component.html',
  styleUrls: ['./metas.component.css'],
  providers: [PlantasService, MetaService]
})
export class MetasComponent implements OnInit {

  // Filtrado y carga de formulario
  anio: Date | undefined;
  modulo: string | undefined;
  paisSelected: string | undefined;
  mesSelected: string | undefined;

  // Variables
  metasData: Meta[] = [];
  metaAnual: number[] = [];
  
  // Listados y variables para funcionalidades
  moduloList: {label: string, value: string}[] | undefined;
  areaList: {label: string, value: string|undefined}[] | undefined;
  empresaList: {label: string, value: string}[] | undefined = [
    {label: 'EEUU y Camex', value: 'eeuu_camex'}
  ];
  meses: Array<any> = [
    {label: 'Enero', value: 0},
    {label: 'Febrero', value: 1},
    {label: 'Marzo', value: 2},
    {label: 'Abril', value: 3},
    {label: 'Mayo', value: 4},
    {label: 'Junio', value: 5},
    {label: 'Julio', value: 6},
    {label: 'Agosto', value: 7},
    {label: 'Septiembre', value: 8},
    {label: 'Octubre', value: 9},
    {label: 'Noviembre', value: 10},
    {label: 'Diciembre', value: 11}
  ];
  pais: Array<any> = [
    {label: 'Colombia', value: 'Colombia'},
    {label: 'Costa Rica', value: 'Costa Rica'},
    {label: 'EEUU', value: 'EEUU'},
    {label: 'Guatemala', value: 'Guatemala'},
    {label: 'Honduras', value: 'Honduras'},
    {label: 'Mexico', value: 'Mexico'},
    {label: 'Nicaragua', value: 'Nicaragua'},
    {label: 'Corona Total', value: 'Corona Total'}
  ];
  localidadesList: {label: string, value: {id: number, division: string}}[] | undefined;
  cargando: boolean = false;

  esNuevo: boolean = true;
  formularioCargado: boolean = false;

  constructor(
    private areasService: AreaService,
    private sessionService: SesionService,
    private plantasService: PlantasService,
    private metaService: MetaService,
    private messageService: MessageService,
  ) { 
    
    this.moduloList = Object.keys(Modulos).map((key: string) => {
      return {label: key, value: key};
    });

  }

  ngOnInit() {

    this.empresaList?.unshift({label: this.sessionService.getEmpresa()?.razonSocial!, value: this.sessionService.getEmpresa()?.nit!});
  }

  onSelectFiltro() {
    if(this.modulo && this.anio && this.paisSelected){
      this.cargando = true;
      Promise.all([this.getAreas().then(), this.getPlantas().then()]).then(() => {
        this.generarFormulario().finally(async () => {
          this.esNuevo = true;
          await this.cargarDatos();
        });
      }).finally(() => {
        this.cargando = false
        setTimeout(() => {
          this.ordermeta()
        }, 1000);
      });
    }
  }

  async generarFormulario(){
    console.log('Creando formulario');
    this.metasData = [];
    try {
      this.metasData = this.areaList?.map((area) => {
        
        let meta = {} as Meta;
        meta.anio = this.anio?.getFullYear()!;
        meta.empresaId = Number(this.sessionService.getParamEmp());
        meta.pais = this.paisSelected!;
        meta.modulo = this.modulo!;
        meta.referencia = Number(area.value);

        //Dependiendo del modulo seleccionado se crea el listados de metas para esa localidad
        meta.valorMeta = Modulos[this.modulo!].map((metaModulo: string) => {
          
          let valor = {} as ValorMeta;
          valor.referencia = metaModulo;
          valor.value = 0;
          return valor;
        });
        meta.metas = this.localidadesList?.filter(localidad => localidad.value.division == String(meta.referencia).toString()).map((localidad) => {
          
          let metaPlanta = {} as Meta;
          metaPlanta.referencia = localidad.value.id;
          // Para cada localidad se crea el listado de metas a partir del modulo seleccionado
          metaPlanta.valorMeta = Modulos[this.modulo!].map((metaModulo: string) => {
            
            let valor = {} as ValorMeta;
            valor.referencia = metaModulo;
            valor.value = 0;
            return valor;
          });
          return metaPlanta;
        })!;
        return meta;
      })!;

      // Aquí se agrega la meta para toda la empresa
      this.metasData.push({
        anio: this.anio?.getFullYear()!,
        empresaId: Number(this.sessionService.getParamEmp()),
        pais: this.paisSelected,
        modulo: this.modulo,
        referencia: 0,
        valorMeta: Modulos[this.modulo!].map((metaModulo: string) => {
          let valor = {} as ValorMeta;
          valor.referencia = metaModulo;
          valor.value = 0;
          return valor;
        }),
      } as Meta);

      this.formularioCargado = true;
    } catch (error) {
      console.error('Error al generar formulario', error);
    }
  }

  async cargarDatos() {
    let filterQuery: FilterQuery = new FilterQuery();
    filterQuery.filterList = [
      {criteria: Criteria.EQUALS, field: 'modulo', value1: this.modulo},
      {criteria: Criteria.EQUALS, field: 'empresaId', value1: this.sessionService.getParamEmp()},
      {criteria: Criteria.EQUALS, field: 'pais', value1: this.paisSelected},
      {criteria: Criteria.EQUALS, field: 'anio', value1: this.anio?.getFullYear().toString()}
    ]
    filterQuery.sortField = 'id';
    filterQuery.sortOrder = SortOrder.ASC;

    await this.metaService.findByFilter(filterQuery).then((res:any) => {
      if(res['data'].length > 0) {
        this.metasData = <Meta[]>res['data'];

        this.esNuevo = false;
      }
    })
  }

  async getAreas(){
    let filterQuery = new FilterQuery();
    filterQuery.sortOrder = SortOrder.ASC;
    filterQuery.sortField = 'nombre';
    filterQuery.fieldList = ['id', 'nombre', 'nivel'];
    filterQuery.filterList = [
      { criteria: Criteria.EQUALS, field: 'nivel', value1: '0'}
    ];

    // Comportamiento especial para CAMEX
    if(this.paisSelected == 'eeuu_camex') filterQuery.filterList.push({criteria: Criteria.EQUALS, field: 'nombre', value1: 'Bathrooms and Kitchen'});

    return new Promise((resolve, reject) => {
      this.areasService.findByFilter(filterQuery).then((res: any) => {
        this.areaList = (<Area[]>res['data']).map(area => {
          return {label: area.nombre, value: area.id};
        });
        resolve(1);
      }).catch(err => {
        console.error('Error al obtener areas: ', err);
        reject();
      });
    });
  }

  async getPlantas(){
    let filterQuery = new FilterQuery();
    filterQuery.sortOrder = SortOrder.ASC;
    filterQuery.sortField = 'nombre';
    // filterQuery.fieldList = ['id', 'nombre', 'id_division'];
    filterQuery.filterList = [
      { criteria: Criteria.EQUALS, field: 'id_empresa', value1: this.sessionService.getParamEmp()}
    ];

    filterQuery.filterList.push({
      criteria: Criteria.EQUALS,
      field: 'pais',
      value1: this.paisSelected 
    });

    return new Promise((resolve, reject) => {
      this.plantasService.getPlantaWithFilter(filterQuery).then((res: any) => {
        this.localidadesList = (<any[]>res['data']).map(localidad => {
          return {label: localidad.nombre, value: {id: localidad.id, division: localidad.area.id}};
        });
        resolve(1);
      }).catch(() => {
        console.error('Error al cargar plantas');
        reject();
      });
    })
  }

  onSubmit() {
    // console.log(this.metaAnual, this.metasData);
    if(this.esNuevo){
      this.metaService.createMetas(this.metasData)
      .then((res: any) => {
        this.esNuevo = false;
        this.metasData = res;
        this.formularioCargado = true;
        this.messageService.add({key: 'metaToast', severity: 'success', summary: 'Metas guardadas'});
        console.log('Metas guardadas');
      }).catch(err => {
        console.error('Error al guardar metas', err);
      });
    } else {
      this.metaService.updateMetas(this.metasData)
      .then((res: any) => {
        this.esNuevo = false;
        this.metasData = res;
        this.formularioCargado = true;
        this.messageService.add({key: 'metaToast', severity: 'success', summary: 'Metas actualizadas'});
        console.log('Metas actualizadas');
      }).catch(err => {
        console.error('Error al actualizar metas', err);
      });
    }
  }

  getAreaNombre(id: string): string {
    return this.areaList?.filter(area => area.value == id)[0].label!;
  }

  getLocalidadNombre(id: number): string {
    return this.localidadesList?.filter(localidad => localidad.value.id == id)[0].label!;
  }

  updateMetaValue(id:any,referencia:any,valueMetaLoc:number){
    const indice=this.metasData.findIndex(el => el.referencia == id )
    const indice2=this.metasData[indice].valorMeta!.findIndex(el => el.referencia == referencia )
    this.metasData[indice].valorMeta[indice2].value=valueMetaLoc
  }

  ordermeta(){
    let order=Modulos[this.modulo!]
    let valorMeta:any=[]
    let valorMetaSon:any=[]

    if(this.metasData.length>0)
    for(const [i, meta] of this.metasData.entries()){
      valorMeta=[]
      let metaCopy=meta.valorMeta
      if(metaCopy.length>0)
      for(const ref of order){
        let a:any = metaCopy.find((resp:any)=>resp.referencia==ref)
        valorMeta.push(a)
      }
      this.metasData[i].valorMeta=valorMeta

      if(meta.metas.length>0)
      for(const [j, meta2] of meta.metas.entries()){
        valorMetaSon=[]
        let metaCopySon=meta2.valorMeta
        if(metaCopySon.length>0)
        for(const ref of order){
          let b:any = metaCopySon.find((resp:any)=>resp.referencia==ref)
          valorMetaSon.push(b)
        }
        this.metasData[i].metas[j].valorMeta=valorMetaSon
      }
    }
  }
}

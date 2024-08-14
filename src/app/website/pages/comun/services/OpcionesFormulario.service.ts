import { Injectable } from '@angular/core';
import { Criteria } from '../../core/entities/filter';
import { FilterQuery } from '../../core/entities/filter-query';
import { SesionService } from '../../core/services/session.service';
import { Localidades } from '../../ctr/entities/aliados';
import { Area } from '../../empresa/entities/area';
import { AreaMatriz } from '../../comun/entities/Area-matriz';
import { EmpresaService } from '../../empresa/services/empresa.service';
import { Campo } from '../entities/campo';
import { nitCorona, procesosCorona } from '../entities/inspeccion-utils';
import { AreaMatrizService } from '../../core/services/area-matriz.service';
import { ProcesoMatrizService } from '../../core/services/proceso-matriz.service';
import { ProcesoMatriz } from '../entities/Proceso-matriz';


@Injectable({
  providedIn: 'root'
})
export class OpcionesFormularioService {

  private servicios: {
    servicioId: string;
    getData: (param?: string) => Promise<any[]>;
  }[] | null;

  private divisionId?: string;
  private localidadId?: string;
  private areaId?: string;

  constructor(
    private empresaService: EmpresaService,
    private sesionService: SesionService,
    private areaMatrizService: AreaMatrizService,
    private procesoMatrizService : ProcesoMatrizService
  ) {
    this.servicios = [
      {
        servicioId: 'DIVISION',
        getData: async function(){
          let divisionesTemp: any[] = [];
          await empresaService.getArea()
          .then(
            (res: Area[]) => {
              divisionesTemp = res.map(area => ({
                label: area.nombre,
                value: area.id  
              }));
            }
          ).catch((err: any) => {
            console.error('Error al obtener las divisiones', err);
          });
          return divisionesTemp;
        }
      }, 

      {
        servicioId: 'DIVISIÓN DE NEGOCIO',
        getData: async function(){
          let divisionesTemp: any[] = [];
          await empresaService.getArea()
          .then(
            (res: Area[]) => {
              let nombreDivision: string[] = res.map(area => area.nombre);
              divisionesTemp = nombreDivision.map(are => {
                return {label: are, value: are}
              })
            }
          ).catch((err: any) => {
            console.error('Error al obtener divisiones', err);
          });
          return divisionesTemp;
        }
      }, 
      
      {
        servicioId: 'LOCALIDAD',
        getData: async function(param?: string){
          let localidadesTemp: any[] = [];
          if(param){
            await empresaService.getLocalidadesByDivisiones(param)
            .then(
              (res: Localidades[]) => {
                localidadesTemp = res.map(localidad => ({
                  label: localidad.localidad,
                  value: localidad.id  
                }));
              }
            ).catch((err: any) => {
              console.error('Error al obtener localidades', err);
            });
          }else{
            await empresaService.getLocalidades()
            .then(
              (res: Localidades[]) => {
                let nombreLocalidades: string[] = res.map(localidad => localidad.localidad);
                localidadesTemp = nombreLocalidades.map(loc => {
                  return {label: loc, value: loc}
                })
              }
            ).catch((err: any) => {
              console.error('Error al obtener localidades', err);
            });
          }
          return localidadesTemp;
        }
      },

      
      {
        servicioId: 'AREA',
        getData: async function(param?: string){
          let areasTemp: any[] = [];
          if(param){
            await areaMatrizService.getAreaMByLocalidad(param)
            .then(
              (res: AreaMatriz[]) => {
                areasTemp = res.map(areaMatriz => ({
                  label: areaMatriz.nombre,
                  value: areaMatriz.id  
                }));
              }
            ).catch((err: any) => {
              console.error('Error al obtener localidades', err);
            });
          }
          return areasTemp;
        }
      }, 
      
      {
        servicioId: 'ALIADO',
        getData: async function(){
          let aliadosTemp: any[] = [];
          let filterQuery = new FilterQuery();
          filterQuery.filterList = [
            {criteria: Criteria.EQUALS, field: 'idEmpresaAliada', value1: sesionService.getParamEmp()}
          ];
          await empresaService.findByFilter(filterQuery)
          .then(
            (res: any) => {
              let razonSocialList: string[] = aliadosTemp = res?.data?.map((emp: any) => emp.razonSocial);
              aliadosTemp = razonSocialList.map(rs => {
                return {label: rs, value: rs};
              });
            }
          ).catch((err: any) => {
            console.error('Error al obtener Aliados', err);
          })
          return aliadosTemp;
        }
      },
      {
        servicioId: 'NIT',
        getData: async function(){
          let nitList: any[] = [];
          nitList = nitCorona.map(nit => {
            return {label: nit.nit, value: nit.nit};
          });
          nitList = nitList.filter((obj, index) => {
            return index === nitList.findIndex(o => obj.label === o.label);
          });
          return nitList
        }
      },
      {
        servicioId: 'PROCESO',
        getData: async function(param?: string){
          let procesosTemp: any[] = [];
          if(param){
            await procesoMatrizService.getProcesoMByArea(param)
            .then(
              (res: ProcesoMatriz[]) => {
                let nombreProceso: string[] = res.map(procesoM => procesoM.nombre)
                .filter((nombreProceso): nombreProceso is string => nombreProceso !== undefined);

                procesosTemp = nombreProceso.map(pro => ({
                  label: pro, 
                  value: pro,     
                }));
              }
            ).catch((err: any) => {
              console.error('Error al obtener los procesos', err);
            });
          }
          return procesosTemp;
        }
      }, 
    ]
  }

  private getServicio(servicioId: string){
    return this.servicios
      ?.find(servicio => servicioId === servicio.servicioId)?.getData
      ?? function() {throw 'error al obtener datos'};
  }

 
  async getOpciones(campo: Campo, padre?: string) {
    if (campo.nombre === 'DIVISION' ) {
      this.divisionId = padre;
    }
    if(campo.nombre === 'DIVISIÓN DE NEGOCIO'){
      let campos = await this.getServicio(campo.nombre);
    if(padre) return await campos(padre);
    }

    const campos = await this.getServicio(campo.nombre);

    if (campo.nombre === 'LOCALIDAD' && this.divisionId) {
      const localidades = await campos(this.divisionId);
      if (padre) {
        this.localidadId = padre;
      }
      return localidades;
    }

    if (campo.nombre === 'AREA' && this.localidadId) {
      const areas = await campos(this.localidadId);
      if(padre){
        this.areaId = padre;
      }
      return areas;
    }

    if (campo.nombre === 'PROCESO' && this.areaId) {
      return await campos(this.areaId);
    }


    if (padre) {
      return await campos(padre);
    }

    return await campos();
  }
}
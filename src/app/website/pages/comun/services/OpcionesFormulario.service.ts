import { Injectable } from '@angular/core';
import { Criteria } from '../../core/entities/filter';
import { FilterQuery } from '../../core/entities/filter-query';
import { SesionService } from '../../core/services/session.service';
import { Localidades } from '../../ctr/entities/aliados';
import { EmpresaService } from '../../empresa/services/empresa.service';
import { Campo } from '../entities/campo';
import { nitCorona, procesosCorona } from '../entities/inspeccion-utils';

@Injectable({
  providedIn: 'root'
})
export class OpcionesFormularioService {

  private servicios: {
    servicioId: string;
    getData: (param?: string) => Promise<any[]>;
  }[] | null;

  constructor(
    private empresaService: EmpresaService,
    private sesionService: SesionService
  ) {
    this.servicios = [
      {
        servicioId: 'LOCALIDAD',
        getData: async function(){
          let localidadesTemp: any[] = [];
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
          return localidadesTemp;
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
        getData: async function(){
          let procesos: any[] = [];
          try {
            procesos = procesosCorona?.map(proc => {
              return { label: proc, value: proc };
            });
            return procesos;
          } catch (error) {
            console.error('Error al obtener procesos');
            return procesos;
          }
        }
      }
    ]
  }

  private getServicio(servicioId: string){
    return this.servicios
      ?.find(servicio => servicioId === servicio.servicioId)?.getData
      ?? function() {throw 'error al obtener datos'};
  }

  async getOpciones(campo: Campo, padre?: string){
    let campos = await this.getServicio(campo.nombre);
    if(padre) return await campos(padre);
    return await campos();
  }

}
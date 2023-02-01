import { Injectable } from '@angular/core';
import { endPoints } from 'src/environments/environment';
import { CRUDService } from '../../core/services/crud.service';
import { ActividadesContratadas, AliadoInformacion, Localidades, SST, Subcontratista } from '../../ctr/entities/aliados';
import { Empresa } from '../entities/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService extends CRUDService<Empresa>{

  findByUsuario(usuarioId: string | null | undefined) {
    return new Promise(resolve => {
        this.httpInt.get(endPoints.EmpresaService + "usuario/" + usuarioId)
            // .map(res => res)
            .subscribe(
                res => {
                    resolve(res);
                }
                ,
                err => this.manageError(err)
            )
    });
  }

  findSelected() {
    return new Promise(resolve => {
        this.httpInt.get(endPoints.EmpresaService + "selected")
            
            .subscribe(
                res => {
                    resolve(res);
                }
                ,
                err => this.manageError(err)
            )
    });
}
  async getActividadesContratadas(aliadoId: number =1): Promise<ActividadesContratadas[]>{
    return new Promise( (resolve, reject) =>
      this.httpInt.get(endPoints.EmpresaService + "getActividadesContratadas/"+aliadoId)
        .subscribe(
          (res: any) => {
            let actividadesContratadasList: ActividadesContratadas[] = res;
            resolve(actividadesContratadasList);
          },
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    );
  }

  obtenerContratistas(empresaId: string): Promise<Empresa> {
    return new Promise((resolve, reject) => {
        this.httpInt.get(this.end_point + "contratistas/" + empresaId)
            .subscribe(
              res => {
                resolve(res);
              },
              err => {
                this.manageError(err);
                reject(err);
              }
            )
    });
  }

  vincularContratista(contratista: Empresa): Promise<boolean> {
    let entity = new Empresa();
    entity.id = contratista.id;
    let body = JSON.stringify(entity);
    return new Promise((resolve, reject) => {
      this.httpInt.put(this.end_point + "contratistas", body)
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  createEmpresaAliada(empresaAliada: Empresa): Promise<Empresa>{
    let body = JSON.stringify(empresaAliada);
    return new Promise((resolve, reject) => {
      this.httpInt.post(endPoints.EmpresaService+"createEmpresaAliada", body)
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            this.manageError(err);
            reject(err);
          }
      );
    });
  }

  saveAliadoInformacion(aliadoInformacion: AliadoInformacion): Promise<AliadoInformacion>{
    let body = JSON.stringify(aliadoInformacion);
    return new Promise((resolve, reject) =>{
      this.httpInt.put(endPoints.EmpresaService + "saveAliadoInformacion",body)
        .subscribe(
            (res: any) => {
                resolve(res);
            }
            ,
            err => {
              this.manageError(err);
              reject(err);
            }
        )
    })
  }

  getLocalidades(): Promise<Localidades[]>{       
    return new Promise((resolve, reject) =>{
      this.httpInt.get(endPoints.EmpresaService + "getActividadesContratadas")
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          err => {
            this.manageError(err);
            reject(err);
          }
        );
    });
  }

  getAliadoInformacion(aliadoId: number): Promise<AliadoInformacion[]>{
    return new Promise((resolve, reject) =>{
      this.httpInt.get(endPoints.EmpresaService + "getAliadoInformacion/"+aliadoId)
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    })
  }

  obtenerDivisionesDeAliados(empresaId: number){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + "getAliadoDivision/" + empresaId)
        .subscribe(
          res => {
            resolve(res);
          },
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    }); 
  }

  createEquipoSST(equipoSST: SST){
    let body = JSON.stringify(equipoSST);
    return new Promise((resolve, reject) =>{
      this.httpInt.post(endPoints.EmpresaService + "createEquipoSST",body)
        .subscribe(
            (res: any) => {
                resolve(res);
            }
            ,
            err => {
              this.manageError(err);
              reject(err);
            }
        )
    })
  }

  updateEquipoSST(sst: SST): Promise<SST>{
    return new Promise((resolve, reject) => {
      this.httpInt.put(endPoints.EmpresaService + "updateEquipoSST", sst)
        .subscribe(
            (res: any) => resolve(res),
            err => {
              this.manageError(err);
              reject(err);
            }
        );
    });
  }


  deleteMiembroSST(miembroId: number): Promise<boolean>{
    return new Promise((resolve, reject) =>{
        this.httpInt.delete(endPoints.EmpresaService + "deleteMiembroSst/" + miembroId)
        .subscribe(
            (res: any) => {
                resolve(res);
            },
            err => {
              this.manageError(err);
              reject(err);
            }
        );
    });
  }

  getEquipoSST(aliadoId: number): Promise<SST[]>{
    return new Promise((resolve, reject) =>{
        this.httpInt.get(endPoints.EmpresaService + "getEquipoSST/"+aliadoId)
        .subscribe(
            (res: any) => {
                resolve(res);
            }
            ,
            err => {
              this.manageError(err);
              reject(err);
            }
        )
    })
  }

  saveSubcontratista(subcontratista: Subcontratista): Promise<Subcontratista>{
    let body = JSON.stringify(subcontratista);
    return new Promise((resolve, reject) =>{
      this.httpInt.post(endPoints.EmpresaService + "saveSubcontratista", body)
        .subscribe(
            (res: any) => {
                resolve(res);
            },
            err => {
              this.manageError(err);
              reject(err);
            }
        );
    });
  }

  updateSubcontratista(subcontratista: Subcontratista): Promise<Subcontratista>{
    let body = JSON.stringify(subcontratista);
    return new Promise((resolve, reject) =>{
        this.httpInt.put(endPoints.EmpresaService + "updateSubcontratista", body)
        .subscribe(
            (res: any) => {
                resolve(res);
            },
            err => {
              this.manageError(err);
              reject(err);
            }
        );
    });
  }

  getSubcontratistas(aliadoId: number): Promise<Subcontratista[]>{
    return new Promise((resolve, reject) => {
      this.httpInt.get(endPoints.EmpresaService + `getSubcontratistas/${aliadoId}`)
        .subscribe(
            (res: any) => {
                resolve(res);
            },
            err => {
              this.manageError(err);
              reject(err);
            }
        );
    });
  }

  getClassName(): string {
      return "EmpresaService";
  }
}

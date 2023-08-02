import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Reporte } from '../../../comun/entities/reporte';
import { Criteria, Filter } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { ConsuModReporteService } from '../../../core/services/consu-mod-reporte.service';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';
import { ReporteService } from '../../../core/services/reporte.service';
import { Empleado } from '../../../empresa/entities/empleado';
import { EmpleadoService } from '../../../empresa/services/empleado.service';

@Component({
  selector: 'app-registro-reporte-temporal',
  templateUrl: './registro-reporte-temporal.component.html',
  styleUrls: ['./registro-reporte-temporal.component.scss']
})
export class RegistroReporteTemporalComponent implements OnInit {

  tipoReporte: string | null = null;
  empleadosList: Empleado[] | null = null;
  empleadoSelect: Empleado | null = null;
  reporteSelect: Reporte | null = null;
  consultar: boolean | null = null;
  modificar: boolean | null = null;
  adicionar: boolean | null = null;
  flagR: boolean = false;

  constructor(
    private empleadoService: EmpleadoService,
    private reporteService: ReporteService,
    private paramNav: ParametroNavegacionService,
    private ConsuModReporteService: ConsuModReporteService,
    private messgaService: MessageService
  ) { }

  async  ngOnInit() {
    this.flagR=this.ConsuModReporteService.getflagR();
    
    let repParam;
    repParam = (this.flagR) ? this.paramNav.getParametro<Reporte>() : null;

    if (repParam != null) {
      this.consultar = this.paramNav.getAccion<string>() == 'GET';
      this.modificar = this.paramNav.getAccion<string>() == 'PUT';
      await  this.reporteService.getReporteAliado(repParam.id!).then((resp: Reporte[]) => {
        this.reporteSelect = <Reporte>(resp[0]);
        this.buscarEmpleado(this.reporteSelect.numeroIdentificacionEmpleado!);
        this.tipoReporte = this.reporteSelect.tipo ?? null;
      })
    } else {
      this.adicionar = true;
    }
    this.paramNav.reset();
    this.ConsuModReporteService.setflagR(false);
  }

  buscarEmpleado(empleadoIdentificacion: string) {
    let fq = new FilterQuery();
    fq.fieldList = [
      'id',
      'numeroIdentificacion', 
      'primerApellido', 
      'primerNombre', 
      'segundoApellido', 
      'segundoNombre', 
      'cargo_id', 
      'cargo_nombre',
      'tipoIdentificacion',
      'usuario_id',
      'usuario_avatar'
    ];
    fq.filterList = [{ field: 'numeroIdentificacion', criteria: Criteria.EQUALS, value1: empleadoIdentificacion }];
    this.empleadoService.findByFilter(fq).then(
      (resp: any) => {
        let empleado = <Empleado>FilterQuery.dtoToObject((resp['data'])[0]);
        this.empleadoSelect = empleado;       
      }
    );
  }
  
  volver() {
    if (this.consultar || this.modificar) {
      this.paramNav.redirect('app/rai/consultaReportestemporal')
    } else {
      this.reporteSelect = null;
    }
  }

  limpiarCampos() {
    this.reporteSelect = null;
    this.tipoReporte = null;
    this.empleadoSelect = null;
  } 

  onSave(reporte: Reporte) {
   
    this.reporteSelect = reporte
    if (this.adicionar) {
      this.messgaService.add({
        severity: 'success',
        summary: 'Reporte realizado',
        detail: `Se ha registrado el reporte RAI-${reporte.id}`
      });
    } else if (this.modificar) {
      this.messgaService.add({
        severity: 'success',
        summary: 'Reporte actualizado',
        detail: `Se ha actualizado correctamente el reporte de  ${this.reporteSelect.tipo} RAI-${reporte.id}`
        
      });
    }
    // this.limpiarCampos();
  }
  
  /**
   * Función que implementa la congruencia de los zellers y devuelve según el resultado el día de la semana.
   * 
   * @param D {Int} Numero del dia (0-31)
   * @param M {Int} Número del mes (1-12)
   * @param Y {Year} Año completo e.g 2001
   */
  Zeller(D: number, M: number, Y: number){    
    let Day = "";

    if (M < 3){
      M = M + 12;
      Y = Y - 1;
    }
    
    let C = Math.floor(Y / 100);
    let K = Y - (100 * C);

    let S = Math.floor(2.6 * M - 5.39) + Math.floor(K / 4) + Math.floor(C / 4) + D + K - (2 * C);

    let ans = S - (7 * Math.floor(S / 7));
  
    if (ans == 0){
      Day = "Domingo";
    }else if (ans == 1){
      Day = "Lunes";
    }else if (ans == 2){
      Day = "Martes";
    }else if (ans == 3){
      Day = "Miercoles";
    }else if (ans == 4){
      Day = "Jueves";
    }
    else if (ans == 5){
      Day = "Viernes";
    }
    else{
      Day = "Sabado";
    }
    
    return Day;
  }
}

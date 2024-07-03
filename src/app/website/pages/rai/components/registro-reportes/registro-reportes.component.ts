import { Component, OnInit } from '@angular/core';

import { EmpleadoService } from 'src/app/website/pages/empresa/services/empleado.service'
import { Empleado } from 'src/app/website/pages/empresa/entities/empleado'
import { ReporteService } from 'src/app/website/pages/core/services/reporte.service'
import { Reporte } from 'src/app/website/pages/comun/entities/reporte'
import { Message, MessageService } from 'primeng/api'
import { ParametroNavegacionService } from 'src/app/website/pages/core/services/parametro-navegacion.service';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query'
import { Criteria, Filter } from 'src/app/website/pages/core/entities/filter';
import { ConsuModReporteService } from 'src/app/website/pages/core/services/consu-mod-reporte.service'
@Component({
  selector: 'app-registro-reportes',
  templateUrl: './registro-reportes.component.html',
  styleUrls: ['./registro-reportes.component.scss'],
  providers: [MessageService]
})
export class RegistroReportesComponent implements OnInit {

  tipoReporte?: string |null;
  empleadosList?: Empleado[];
  empleadoSelect?: Empleado | null;
  reporteSelect?: Reporte | null;
  msgs?: Message[];
  consultar?: boolean;
  modificar?: boolean;
  adicionar?: boolean;
  flagR:boolean=false;

  constructor(
    private empleadoService: EmpleadoService,
    private reporteService: ReporteService,
    private paramNav: ParametroNavegacionService,
    private messageService: MessageService,
    private ConsuModReporteService:ConsuModReporteService,
  ) { }

  async ngOnInit() {
    this.flagR=this.ConsuModReporteService.getflagR();
    
    let repParam;
    repParam = (this.flagR)?this.paramNav.getParametro<Reporte>():null;
    
    if (repParam != null) {
      this.consultar = this.paramNav.getAccion<string>() == 'GET';
      this.modificar = this.paramNav.getAccion<string>() == 'PUT';

      let filterQuery = new FilterQuery();
      if (repParam.id != null) {
      filterQuery.filterList = [{ field: 'id', criteria: Criteria.EQUALS, value1:  repParam.id.toString(), value2: null }];
      }
      // debugger
    await  this.reporteService.findByFilter(filterQuery).then(
      (resp:any) => {
          this.reporteSelect = <Reporte>(resp['data'][0]);
          this.buscarEmpleado(this.reporteSelect?.numeroIdentificacionEmpleado!)
    
          this.tipoReporte = this.reporteSelect.tipo;
        }
      );
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
      (resp:any) => {
        let empleado = <Empleado>FilterQuery.dtoToObject((resp['data'])[0]);
        this.empleadoSelect = empleado;      
      }
    );
  }

  inicializarReporte() {
    this.reporteService.inicializarReporte(this.empleadoSelect?.id).then(
      (data:any) => {
        this.reporteSelect = <Reporte>data;
        if(this.tipoReporte)
        this.reporteSelect.tipo = this.tipoReporte;
        this.reporteSelect.emailEmpleado=this.empleadoSelect?.usuario.email;
      }
    );
  }
  onSave(reporte: Reporte) {
   this.msgs=[]
    
    if (this.adicionar) {
      this.msgs.push({
            severity: 'success',
            summary: 'Reporte realizado',
            detail: `Se ha registrado el reporte de  ${this.reporteSelect?.tipo} RAI-${reporte}`
          }
      )
      // this.messageService.add({
      //   severity: 'success',
      //   summary: 'Reporte realizado',
      //   detail: `Se ha registrado el reporte de  ${this.reporteSelect?.tipo} RAI-${reporte}`
      // });
    } else if (this.modificar) {
      this.msgs.push({
        severity: 'success',
        summary: 'Reporte actualizado',
        detail: `Se ha actualizado correctamente el reporte de  ${this.reporteSelect?.tipo} RAI-${reporte.id}`
      }
    )
      // this.messageService.add({
      //   severity: 'success',
      //   summary: 'Reporte actualizado',
      //   detail: `Se ha actualizado correctamente el reporte de  ${this.reporteSelect?.tipo} RAI-${reporte.id}`
        
      // });
    }
    this.limpiarCampos();
  }

  limpiarCampos() {
    this.reporteSelect = null;
    this.tipoReporte = null;
    this.empleadoSelect = null;
  } 

  volver() {
    if (this.consultar || this.modificar) {
      this.paramNav.redirect('app/rai/consultaReportes')
    } else {
      this.reporteSelect = null;
    }
  }

      /**
 * Función que implementa la congruencia de los zellers y devuelve según el resultado el día de la semana.
 * 
 * @param D {Int} Numero del dia (0-31)
 * @param M {Int} Número del mes (1-12)
 * @param Y {Year} Año completo e.g 2001
 */
Zeller(D:any, M:any, Y:any){    
  let Day = "";

  if (M < 3)
  {
      M = M + 12;
      Y = Y - 1;
  }
  
  let C = Math.floor(Y / 100);
let K = Y - (100 * C);

let S = Math.floor(2.6 * M - 5.39) + Math.floor(K / 4) + Math.floor(C / 4) + D + K - (2 * C);

  let ans = S - (7 * Math.floor(S / 7));
  
  if (ans == 0)
  {
      Day = "Domingo";
  }
  else if (ans == 1)
  {
      Day = "Lunes";
  }
  else if (ans == 2)
  {
      Day = "Martes";
  }
  else if (ans == 3)
  {
      Day = "Miercoles";
  }
  else if (ans == 4)
  {
      Day = "Jueves";
  }
  else if (ans == 5)
  {
      Day = "Viernes";
  }
  else
  {
      Day = "Sabado";
  }
  
  return Day;
}
}

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { TareaService } from 'src/app/website/pages/core/services/tarea.service'
import { ParametroNavegacionService } from 'src/app/website/pages/core/services/parametro-navegacion.service';
import { Tarea } from 'src/app/website/pages/comun/entities/tarea'
import { FilterService, Message } from 'primeng/api';
// import {FilterUtils} from 'primeng/utils';
import * as moment from "moment";
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import * as XLSX from 'xlsx'; 
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { locale_es } from 'src/app/website/pages/comun/entities/reporte-enumeraciones';
import {formatDate} from '@angular/common';
import { columnasPorModulo } from '../utils/entities/modulos';
import { Calendar } from 'primeng/calendar';

@Component({
  selector: 'app-asignacion-tareas',
  templateUrl: './asignacion-tareas.component.html',
  styleUrls: ['./asignacion-tareas.component.scss'],
  providers: [FilterService]
})
export class AsignacionTareasComponent implements OnInit, AfterViewInit {
  @ViewChild("dt") dataTableComponent: Table | null = null;
  @ViewChild("calendarExcel") calendarExcel: Calendar | null = null;
  loading: boolean = true;
  yearRange?:any;
  tareasList: any[] = [];
  tareaListFilter: any;
  tareaSelect?: Tarea | null;
  msgs: Message[] = [];
  observacionesRealizacion?: string;
  arrayIdsareas:any  = [];
  idEmpresa: string = '';
   
  modalExcel = false;
  fileName= 'ListadoSeguimiento.xlsx';

  esAliado: boolean = false;
  opcionesModulos = [
    { label: 'Reporte A/I', value: 'Reporte A/I' },
    { label: 'Observaciones', value: 'Observaciones' },
    { label: 'Inspecciones', value: 'Inspecciones' },
    { label: 'Inspecciones CC', value: 'Inspecciones CC'}
  ];
  moduloSelected: string = 'Reporte A/I';

  localeES=locale_es
  constructor(
    private tareaService: TareaService,
    private paramNav: ParametroNavegacionService,
    private sesionService: SesionService,
    private config: PrimeNGConfig,
    private cdr: ChangeDetectorRef,
    private filterService: FilterService,
  ) { 
    // this.cdr.detectChanges();
  }

  async ngOnInit() {

    this.esAliado = this.sesionService.getEmpresa()?.idEmpresaAliada ? true : false;
    this.idEmpresa = this.esAliado ? new String(this.sesionService.getEmpresa()?.idEmpresaAliada).toString() : new String(this.sesionService.getEmpresa()?.id).toString();

    let date = new Date().getFullYear().toString();

    this.yearRange = ((parseInt(date) - 20) + ':' + (parseInt(date) + 20)).toString();
    this.config.setTranslation({
      firstDayOfWeek: 1,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["Enero ", "Febrero ", "Marzo ", "Abril ", "Mayo ", "Junio ", "Julio ", "Agosto ", "Septiembre ", "Octubre ", "Noviembre ", "Diciembre "],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: 'Hoy',
      clear: 'Borrar'
    });

    this.loading = true;

    await this.getTareas();

    // FilterUtils['dateFilter'] = (value, filter):boolean => {
    //     if (filter === undefined || filter === null) return true;

    //     if (value === undefined || value === null) return false;

    //     let val = moment(value.split('T')[0]),
    //     filt = moment(filter);

    //     return filt.isSame(val);
    // }

    this.filterService.register('btDate', (value: any, filter: any) => {
      if (filter === undefined || filter === null) {
        return true;
      }
    
      if (value === undefined || value === null) {
        return false;
      }
      
      let value1: Date = filter[0];
      let value2: Date = filter[1];
      if(filter[0] && !filter[1]) return filter[0] <= new Date(value);
      if(!filter[0] && filter[1]) return new Date(value) <= filter[1];
      if(!filter[0] && !filter[1]) return true;
      return (value1 <= new Date(value) && value2 >= new Date(value)) ? value : false;
    });

    this.loading = true;
    if(this.esAliado) {
      this.opcionesModulos = [
        {label: 'Inspecciones CC', value: 'Inspecciones CC'}
      ];
      this.moduloSelected = 'Inspecciones CC';
      this.dataTableComponent?.filter(this.moduloSelected, 'module', 'equals');
    } else {
      this.dataTableComponent?.filter(this.moduloSelected, 'module', 'equals');
    }
    this.loading = false;
  }

  ngAfterViewInit(): void {
    
  }

  async getTareas() {
    let statuses:any = {
        0: 'N/A',
        1: 'En seguimiento',
        2: 'Abierta',
        3: 'Cerrada en el tiempo',
        4: 'Cerrada fuera de tiempo',
        5: 'Vencida',
    }
    let areas: string = this.sesionService.getPermisosMap()['SEC_GET_TAR'].areas;
    let areasPermiso =areas.replace('{','');
    areasPermiso =areasPermiso.replace('}','');
    let areasPermiso2=areasPermiso.split(',')

    const filteredArea = areasPermiso2.filter(function(ele , pos){
      return areasPermiso2.indexOf(ele) == pos;
    }) 
    areas='{'+filteredArea.toString()+'}';

    areas = areas.replace('{', '');
    areas = areas.replace('}', '');     
    this.arrayIdsareas.push (areas.valueOf());
   
    await this.tareaService.findByDetails(this.arrayIdsareas).then(
        async (resp: any) => { 
            this.tareasList = resp;

            if(this.esAliado){
              let nit_aliado = this.sesionService.getEmpresa()?.nit;

              this.tareasList = this.tareasList.filter((tarea: any) => tarea.module === 'Inspecciones CC')
              .filter(tar => {
                let aliado: string = tar.aliado;
                aliado = aliado.split('-').slice(-1)[0];
                return aliado.trim() == nit_aliado ? tar : false;
              });
            }
            this.tareasList.sort(function(a:any,b:any){
                  if(a.id < b.id){
                    return 1
                  }else if(a.id > b.id){
                    return -1;
                  }
                    return 0;
                  });

            this.tareasList = await Promise.all(this.tareasList.map(async (tarea:any) => {
                let status = await this.verifyStatus(tarea);
                tarea.estado = statuses[status];
                tarea.fecha_reporte = new Date(tarea.fecha_reporte).toISOString();
                tarea.fecha_proyectada = new Date(tarea.fecha_proyectada).toISOString();
                return tarea;
            }));
            this.loading = false;       
        }

    );
  }
  async verifyStatus(tarea:any) {

    let trackings = tarea.trackings;
    let isFollow = (trackings > 0) ? true : false;

    /* Vars */
    let now = moment({});
    let fecha_cierre = moment(tarea.fecha_cierre);
    let fecha_proyectada = moment(tarea.fecha_proyectada);

    if (!fecha_cierre.isValid() &&  isFollow) return 1;        
    if (!fecha_cierre.isValid() && fecha_proyectada.isSameOrAfter(now,'day') && !isFollow) return 2;
    if (fecha_cierre.isValid() && fecha_proyectada.isSameOrAfter(fecha_cierre,'day')) return 3;
    if (fecha_cierre.isValid() && fecha_proyectada.isBefore(fecha_cierre,'day')) return 4;        
    if (!fecha_cierre.isValid() && fecha_proyectada.isBefore(now,'day') && !isFollow) return 5;
    return 0;
  }

  navegar() {
    this.paramNav.redirect('/app/sec/consultaAnalisisDesviaciones');
  }

  onClick() {
    window.open('/app/sec/tarea/' + this.tareaSelect?.id)
    // this.paramNav.redirect('/app/sec/tarea/' + this.tareaSelect?.id);
  }

  reportarCumplimiento() {
    if (this.tareaSelect != null) {
        let tareaReq = new Tarea();
        tareaReq.id = this.tareaSelect.id;
        tareaReq.observacionesRealizacion = this.tareaSelect.observacionesRealizacion;
        this.tareaService.reportarCumplimiento(tareaReq).then(
            data => {
                this.tareaSelect = <Tarea>data;
                for (let i = 0; i < this.tareasList.length; i++) {
                    if (this.tareasList[i].id === this.tareaSelect.id) {
                        this.tareasList[i] = this.tareaSelect;
                        break;
                    }
                }
                this.tareasList = this.tareasList.slice();
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'Reporte de tarea realizado', detail: 'Se ha reportado correctamente la realización de la tarea ' + this.tareaSelect.nombre });
                this.tareaSelect = null;
            }
        );
    } else {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'No ha seleccionado una tarea', detail: 'Debe seleccionar una tarea para reportar' });
    }
}

  reportarVerificacion(tarea: Tarea) {
      if (this.tareaSelect != null) {
          let tareaReq = new Tarea();
          tareaReq.id = this.tareaSelect.id;
          tareaReq.observacionesVerificacion = this.tareaSelect.observacionesVerificacion;
          this.tareaService.reportarVerificacion(tareaReq).then(
              data => {
                  this.tareaSelect = <Tarea>data;
                  for (let i = 0; i < this.tareasList.length; i++) {
                      if (this.tareasList[i].id === this.tareaSelect.id) {
                          this.tareasList[i] = this.tareaSelect;
                          break;
                      }
                  }
                  this.tareasList = this.tareasList.slice();
                  this.msgs = [];
                  this.msgs.push({ severity: 'success', summary: 'Verificación de tarea realizada', detail: 'Se ha reportado correctamente la verificación de la tarea ' + this.tareaSelect.nombre });
                  this.tareaSelect = null;
              }
          );
      } else {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: 'No ha seleccionado una tarea', detail: 'Debe seleccionar una tarea para reportar' });
      }
  }

  visibleDlgInforme:boolean=false
    flagInforme:boolean=true
    excel:any=[]
    rangeDatesInforme: any;

    abrirDialogo(){
        this.visibleDlgInforme=true
    }

    cerrarDialogo(){
        this.visibleDlgInforme=false
    }

    async datosExcel(){
        let excel:any=[]
        this.tareaListFilter.forEach((tarea:any)=>{excel.push({
            Módulo:tarea.module,
            Fecha_de_Reporte:formatDate(new Date(tarea.fecha_reporte), 'yyyy/MM/dd', 'en'),
            División_Unidad:tarea.regional,
            Ubicación:tarea.division,
            Tipo_de_lista: tarea.tipo_lista,
            Código:tarea.area,
            Actividad:tarea.hash_id,
            Responsable:(tarea.empResponsable)? tarea.empResponsable.primer_nombre + ' ' + tarea.empResponsable.primer_apellido : 'No posee responsable',
            Fecha_proyectada_de_cierre:formatDate(new Date(tarea.fecha_proyectada), 'yyyy/MM/dd', 'en'),
            Estado:tarea.estado})})

        this.excel=[]
        this.excel=excel.filter((resp:any)=>{ return new Date(resp.Fecha_de_Reporte)>=new Date(this.rangeDatesInforme[0]) && new Date(resp.Fecha_de_Reporte)<=new Date(this.rangeDatesInforme[1])})
        console.log(this.excel)
    }

    async exportexcel2(){
        await this.datosExcel()

        const readyToExport = this.excel;
  
        const workBook = XLSX.utils.book_new(); // create a new blank book
  
        const workSheet = XLSX.utils.json_to_sheet(readyToExport);
  
        XLSX.utils.book_append_sheet(workBook, workSheet, 'Informe'); // add the worksheet to the book
  
        XLSX.writeFile(workBook, 'Informe tareas.xlsx'); // initiate a file download in browser
    }

    habilitarindSCM(){
        if(this.rangeDatesInforme[0] && this.rangeDatesInforme[1]){this.flagInforme=false}
        else{this.flagInforme=true}
    }
    onResetDate(){
        this.flagInforme=true
    }

    exportexcel(): void 
    {
  
       let element = document.getElementById('excel-table');
       element?.getElementsByClassName
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
  
       /* save to file */
       XLSX.writeFile(wb, this.fileName);
    }

    onFilter(event:any){
        this.tareaListFilter=event.filteredValue
    }

    // Esta función valida en el objeto json columnasPorModulo, en ese objeto están detalladas las columnas que quiere ver cada empresa 
    mostrarColumna(nombreColumna: string){
      let moduloInfo = columnasPorModulo[this.moduloSelected];
      if(Object.keys(moduloInfo).includes(this.idEmpresa)){
        return moduloInfo[this.idEmpresa!].includes(nombreColumna);
      }
      
      if(Object.keys(columnasPorModulo['default']).includes(this.moduloSelected)){
        return (columnasPorModulo['default'])[this.moduloSelected].includes(nombreColumna);
      }

      return columnasPorModulo['default']['values'].includes(nombreColumna)
    }

    cerrarCalendarDialog(){
      this.calendarExcel?.toggle();
    }

    test(event: any){
      console.log(event);
    }
}

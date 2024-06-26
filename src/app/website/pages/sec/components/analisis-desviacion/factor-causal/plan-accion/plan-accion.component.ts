import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { AfterViewInit, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { planCausaRaiz, PlanEspecifico } from 'src/app/website/pages/comun/entities/factor-causal';
import { EmpleadoBasic } from 'src/app/website/pages/empresa/entities/empleado-basic';
import { Reporte } from 'src/app/website/pages/comun/entities/reporte';
import { locale_es } from 'src/app/website/pages/comun/entities/reporte-enumeraciones';
import { TareaService } from 'src/app/website/pages/core/services/tarea.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-plan-accion',
  templateUrl: './plan-accion.component.html',
  styleUrls: ['./plan-accion.component.scss'],
  providers: [MessageService]
})
export class PlanAccionComponent implements OnInit, AfterViewInit {
  @Input() planAcciones!: planCausaRaiz;
  @Input() process!: string;
  @Output() dataTest = new EventEmitter<any>()

  selectedValue: any;

  datatest!: PlanEspecifico;

  formEspecifico: FormGroup;
  formMedible!: FormGroup;
  formEfizaz!: FormGroup;
  formRevisado!: FormGroup;
  empleadoSelect!: EmpleadoBasic;
  reporteSelect!: Reporte;
  statuses: any = {
    0: 'N/A',
    1: 'En seguimiento',
    2: 'Abierta',
    3: 'Cerrada en el tiempo',
    4: 'Cerrada fuera de tiempo',
    5: 'Vencida',
  }
  estado: string | null = null;

  steps = [
    {label: 'ESPECIFICO'},
    {label: 'RAZONABLE'},
    {label: 'MEDIBLE'},
    {label: 'EFICAZ'},
    {label: 'REVISADO'},
  ];
  pasoSelect=0;
  localeES: any = locale_es;

  causasListSelect: any;
  display: boolean = false;
  fechaActual = new Date();
  idTarea: string | null = null;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tareaService: TareaService,
    private router: Router,
    private config: PrimeNGConfig
  ) { 
    this.formEspecifico = fb.group({
      nombreAccionCorrectiva: [null, Validators.required],
      accionCorrectiva: [null, Validators.required],
      fechaVencimiento: [null, Validators.required],
      responsableEmpresa: [null],
      responsableExterno: [null],
    })
  }

  ngOnInit() {
    this.config.setTranslation(this.localeES);
    this.planAcciones.eficaz!.fechaVencimiento = (this.planAcciones.eficaz?.fechaVencimiento)? new Date(this.planAcciones.eficaz?.fechaVencimiento):null;
    this.planAcciones.medible!.fechaVencimiento = (this.planAcciones.medible?.fechaVencimiento)? new Date(this.planAcciones.medible?.fechaVencimiento):null;
    this.planAcciones.especifico.fechaVencimiento = (this.planAcciones.especifico.fechaVencimiento)? new Date(this.planAcciones.especifico.fechaVencimiento):null;
    this.validarEstado();
  }

  ngAfterViewInit(): void {

  }

  
  selectProduct(event: any) {
    this.display = true
  }


  confirmCheck(){
    this.display = false
  }

  next(){
    if (this.formEspecifico.valid) {
      this.pasoSelect++;      
    } else {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Falta diligenciar campos'});
    }
  }

  back(){
    this.pasoSelect--;
  }

  submit(){
    this.dataTest.emit()
  }

  async validarEstado(){
    let status: number;
    switch(this.process){
      case 'ESPECIFICO':
        this.idTarea = this.planAcciones.especifico.id;
        status = await this.calcularEstado(this.idTarea!);
        this.estado = this.statuses[status];
        break;
      case 'EFICAZ':
        this.idTarea = this.planAcciones.eficaz?.id ?? null;
        status = await this.calcularEstado(this.idTarea!);
        this.estado = this.statuses[status];
        break;
      case 'MEDIBLE':
        this.idTarea = this.planAcciones.medible?.id ?? null;
        status = await this.calcularEstado(this.idTarea!);
        this.estado = this.statuses[status];
        break;
      default:
        this.estado = null;
        break;
    }

  }

  async calcularEstado(id: string){
    
    let seguimientoTarea: any;
    let keys=['id', 'fecha_cierre', 'fecha_proyectada', 'tracking'];

    if(!id) return Object.keys(this.statuses).length;
     
    await this.tareaService.getSeguimientoTarea(id).then((res: any[]) => {
      seguimientoTarea = res.reduce((item, value, index) => {
        item[keys[index]] = value;
        return item
      }, {});
    }).catch(err => {
    });

    let isFollow = (seguimientoTarea.tracking > 0) ? true : false;

    let now = moment({});
    let fechaCierre = moment(seguimientoTarea.fecha_cierre);
    let fechaProyectada = moment(seguimientoTarea.fecha_proyectada);

    if (!fechaCierre.isValid() &&  isFollow) return 1;        
    if (!fechaCierre.isValid() && fechaProyectada.isSameOrAfter(now,'day') && !isFollow) return 2;
    if (fechaCierre.isValid() && fechaProyectada.isSameOrAfter(fechaCierre,'day')) return 3;
    if (fechaCierre.isValid() && fechaProyectada.isBefore(fechaCierre,'day')) return 4;        
    if (!fechaCierre.isValid() && fechaProyectada.isBefore(now,'day') && !isFollow) return 5;
    return 0;
  }

  onVerSeguimiento(idTarea: number | null){
    if (idTarea) {
      this.confirmationService.confirm({
        icon: "pi pi-exclamation-triangle",
        message: "¿Esta acción lo dirigirá al modulo de tareas asignadas, desea continuar?",
        header: "Advertencia",
        accept: () => {
          this.router.navigate(['/app/sec/tarea/' + idTarea]);
        },
        reject: () => {},
        acceptLabel: "Si",
        rejectLabel: "No",
      });
    }else{
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo realizar la operación', life: 6000});
    }
  }
}

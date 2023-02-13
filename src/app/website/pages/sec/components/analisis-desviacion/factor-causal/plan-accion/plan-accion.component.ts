import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { listPlanAccion, planCausaRaiz, PlanEspecifico } from 'src/app/website/pages/comun/entities/factor-causal';
import { AfterViewInit, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { locale_es } from 'src/app/website/pages/comun/entities/reporte-enumeraciones';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmpleadoBasic } from 'src/app/website/pages/empresa/entities/empleado-basic';
import { Reporte } from 'src/app/website/pages/comun/entities/reporte';

@Component({
  selector: 'app-plan-accion',
  templateUrl: './plan-accion.component.html',
  styleUrls: ['./plan-accion.component.scss'],
  providers: [MessageService]
})
export class PlanAccionComponent implements OnInit, AfterViewInit {
  @Input() planAcciones?: planCausaRaiz
  @Input() process?: string;
  @Output() dataTest = new EventEmitter<any>()

  selectedValue?:any

  datatest?: PlanEspecifico

  formEspecifico?: FormGroup
  formMedible?: FormGroup
  formEfizaz?: FormGroup
  formRevisado?: FormGroup
  empleadoSelect?: EmpleadoBasic;
  reporteSelect?: Reporte;

  steps = [
    {label: 'ESPECIFICO'},
    {label: 'RAZONABLE'},
    {label: 'MEDIBLE'},
    {label: 'EFICAZ'},
    {label: 'REVISADO'},
  ];
  pasoSelect=0;
  localeES: any = locale_es;

  causasListSelect?:any
  display: boolean = false;
  fechaActual = new Date();

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
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
    this.planAcciones!.eficaz!.fechaVencimiento = (this.planAcciones!.eficaz!.fechaVencimiento)? new Date(this.planAcciones!.eficaz!.fechaVencimiento):null;
    this.planAcciones!.medible!.fechaVencimiento = (this.planAcciones!.medible!.fechaVencimiento)? new Date(this.planAcciones!.medible!.fechaVencimiento):null;
    this.planAcciones!.especifico.fechaVencimiento = (this.planAcciones!.especifico.fechaVencimiento)? new Date(this.planAcciones!.especifico.fechaVencimiento):null;
  }
  ngAfterViewInit(): void {
    if(this.planAcciones){
    }
    if(!this.planAcciones){     
    }
  }
  submit(){
    this.dataTest.emit()
  }

}

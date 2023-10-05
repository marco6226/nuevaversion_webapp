import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Empleado } from 'src/app/website/pages/empresa/entities/empleado';
import { EmpleadoService } from 'src/app/website/pages/empresa/services/empleado.service';
import { Message } from "primeng/api";
import { SeguimientosService } from "src/app/website/pages/core/services/seguimientos.service";
import { locale_es } from 'src/app/website/pages/comun/entities/reporte-enumeraciones';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-seguimientos-tareas',
  templateUrl: './seguimientos-tareas.component.html',
  styleUrls: ['./seguimientos-tareas.component.scss']
})
export class SeguimientosTareasComponent implements OnInit {


    /* Variables */
    @Input() status?:any;
    @Input() tarea?:any;
    @Input() tareaClose: boolean = false;
    @Input() tareaId?:any;
    @Input() esInspeccionCC: boolean = false;
    @Output() isFollowExist: EventEmitter<boolean> = new EventEmitter();

    loading: boolean = false;
    differ: any;
    msgs: Message[] = [];
    cargando = false;
    clearEvidences: boolean = false;
    trackings?:any;
    displayModal?: boolean;
    displayEvidences?: boolean;
    trackingForm: FormGroup;
    submitted = false;
    evidences?:any;
    fullName:any = '';
    empleado?: Empleado | null;
    empleadosList?: Empleado[];
    fechaActual = new Date();
    localeES: any = locale_es;

    constructor(
        fb: FormBuilder,
        private empleadoService: EmpleadoService,
        private route: ActivatedRoute,
        private seguimientoService: SeguimientosService,
        private differs: KeyValueDiffers,
        private cd: ChangeDetectorRef,
        private config: PrimeNGConfig
    ) {
        this.differ = differs.find({}).create();
        this.trackingForm = fb.group({
            tareaId: ["", Validators.required],
            email: [""],
            pkUser: [null],
            nombreCompleto: [null],
            followDate: ["", Validators.required],
            description: ["", Validators.required],
            evidences: [[]],
        });
    }

  ngOnInit(): void {
    this.config.setTranslation(this.localeES)
    this.trackingForm.patchValue({ tareaId: this.tareaId })
  }

  ngDoCheck() {
    if (this.tarea !== undefined) {
        let changes = this.differ.diff(this.tarea);

        if (changes) {
            setTimeout(() => {
                this.getSeg();
            }, 1500);
            
            changes.forEachChangedItem((r:any) => {
                this.cd.markForCheck();
            });
            changes.forEachAddedItem((r:any) => {
                this.cd.markForCheck();
            });
            changes.forEachRemovedItem((r:any) => {
                this.cd.markForCheck();
            });
        }
    }
  }

  async getSeg() {
    try {
        this.trackings = await this.seguimientoService.getSegByTareaID(this.tareaId);

        if (this.trackings.length > 0) {
            this.cd.markForCheck();
            this.isFollowExist.emit(true);
        }
    } catch (e) {
        this.msgs.push({
            severity: "error",
            summary: "Mensaje del sistema",
            detail: "Ocurrió un inconveniente al obtener el listado de seguimientos",
        });
    }
  }

  get f() {
    return this.trackingForm.controls;
  }

  showModalDialog(type:any, data?:any) {
    switch (type) {
        case 'create':
            this.displayModal = true;
            break;
        case 'evidence':
            this.displayEvidences = true;
            this.getEvidences(data);
            break;
    }
  }

  async getEvidences(id:any) {

    this.loading = true;
    try {

        this.evidences = await this.seguimientoService.getEvidences(id, "fkSegId");
        if (this.evidences) {
            this.loading = false;
        }
        this.cd.markForCheck();

    } catch (e) {
        this.msgs.push({
            severity: "error",
            summary: "Mensaje del sistema",
            detail: "Ha ocurrido un error al obtener las evidencias de esta tarea",
        });
    }
  }

  async onSelection(event:any) {
    this.fullName = null;
    this.empleado = null;
    let emp = <Empleado>event;
    this.empleado = emp;
    this.fullName = (this.empleado.primerNombre || '') + ' ' + (this.empleado.primerApellido || '');
    this.trackingForm.patchValue({ pkUser: this.empleado.id });
  }

  buscarEmpleado(event:any) {
    this.empleadoService
        .buscar(event.query)
        .then((data) => {

            (this.empleadosList = <Empleado[]>data)
            this.cd.markForCheck();
        });
  }

  addImage(file:any) {
    let evidences = this.trackingForm!.get('evidences')!.value;
    let obj = {
        ruta: file,

    }
    evidences.push(obj);
    this.trackingForm.patchValue({ evidences: evidences });
  }

  async onSubmit() {
    this.submitted = true;
    this.cargando = true;
    this.msgs = [];

    if (!this.trackingForm.valid) {
        this.cargando = false;
        console.log(this.trackingForm.controls);
        this.msgs.push({
            severity: "error",
            summary: "Mensaje del sistema",
            detail: "Por favor revise todos los campos obligatorios",
        });
        return;
    }

    try {

        let follow = {
            tareaId: this.trackingForm.get('tareaId')!.value,
            pkUser: this.trackingForm.get('pkUser')!.value,
            followDate: this.trackingForm.get('followDate')!.value,
            description: this.trackingForm.get('description')!.value,
            evidences: this.trackingForm.get('evidences')!.value,
            nombreCompleto: this.trackingForm.get('nombreCompleto')?.value,
        }
        
        let res = await this.seguimientoService.createSeg(follow);

        if (res) {
            this.cargando = false;
            this.msgs.push({
                severity: "success",
                summary: "Mensaje del sistema",
                detail: "¡Se ha creado exitosamente el seguimiento!",
            });
            this.submitted = false;
            this.closeCreate();
            this.getSeg();
            this.cd.markForCheck();
            setTimeout(() => {
                this.msgs = [];
                this.cd.markForCheck();
            }, 3500);
        }
    } catch (e) {
        this.cargando = false;
        this.msgs.push({
            severity: "error",
            summary: "Mensaje del sistema",
            detail: "Ha ocurrido un error al crear el seguimiento",
        });
    }
  }
  closeCreate() {
    this.empleado = null;
    this.fullName = null;
    this.displayModal = false;
    this.trackingForm.reset();
    this.trackingForm.patchValue({
        tareaId: this.tareaId,
        evidences: []
    });
    this.evidences = [];
    this.clearEvidences = true;
    this.cd.markForCheck();
  } 
  closeEvidences() {
    this.evidences = [];
    this.displayEvidences = false;
  }
}

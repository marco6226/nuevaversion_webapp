import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService, SelectItem } from "primeng/api";
import { Pipe, PipeTransform } from '@angular/core';
import { epsorarl } from "../../entities/eps-or-arl";
import { Empleado } from "../../../empresa/entities/empleado";
import { locale_es } from "../../../comun/entities/reporte-enumeraciones";
import { CasosMedicosService } from "../../../core/services/casos-medicos.service";
import { EmpleadoService } from "../../../empresa/services/empleado.service";
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: "app-seguimientosform",
    templateUrl: "./seguimientosform.component.html",
    styleUrls: ["./seguimientosform.component.scss"],
})
export class SeguimientosformComponent implements OnInit, OnChanges {

    epsList!: SelectItem[];
    afpList!: SelectItem[];
    responsableEmpresaNombre = "";
    empleado!: Empleado;
    @Output() eventClose = new EventEmitter<any>()
    @Input() id: any;
    @Input() entity!: epsorarl;
    @Input() recoSelect: any;
    @Input() seguiSelect: any;
    @Input('prioridad') 
    set prioridadIn(prioridad: any){
        console.log('entre')
        switch (prioridad) {
            case 'Baja':
                this.fechaProximaDate=new Date(this.fechaActual!.getTime() + (1000 * 60 * 60 * 24*365))//un año
                break;
            case 'Media':
                this.fechaProximaDate=new Date(this.fechaActual!.getTime() + (1000 * 60 * 60 * 24*183))// un semestre
                break;
            case 'Alta':
                this.fechaProximaDate=new Date(this.fechaActual!.getTime() + (1000 * 60 * 60 * 24*60))// un bimestre
                break;
            default:
                break;
        }
    }

    empleadosList: Empleado[] = [];
    fechaActual = new Date();
    recomendation!: FormGroup;
    seguimiento: FormGroup;
    tipoIdentificacionList: any;
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    accions: any = [];

    fechaProximaDate?:Date

    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
        private empleadoService: EmpleadoService,
        private messageService: MessageService,
        private config: PrimeNGConfig
    ) {
        this.seguimiento = fb.group({

            seguimiento: [null],
            tarea: [""],
            resultado: [null],
            fechaSeg: [null],
            responsable: [null],            
            responsableExterno: [null],
            proxfechaSeg: [null]
           

        });

    }

    ngOnChanges(changes: SimpleChanges) {
        this.patchFormValues();
        // You can also use categoryId.previousValue and 
        // categoryId.firstChange for comparing old and new values
    }

    //Aqui estan los get para las validaciones
    get resultado() { return this.seguimiento.get('resultado'); }

    async ngOnInit() {
        this.config.setTranslation(this.localeES);
        if (this.seguiSelect) {
            this.patchFormValues()
        } else {
            this.clearInputs();
        }

    }

    clearInputs() {
        this.seguimiento.reset();
    }

    async onSubmit() {
        if (this.seguimiento.value.responsable)
            this.seguimiento.value.responsable = this.seguimiento.value.responsable.id;
        
        let {

            tarea,
            seguimiento,
            fechaSeg,
            resultado,            
            responsable,
            responsableExterno,
            proxfechaSeg
            
        } = this.seguimiento.value;
console.log(this.seguimiento.value)
        if (this.accions.length > 0) {
            this.accions.forEach((act: any) => {
                if (typeof act.responsable != 'number') {
                    act.responsable = null;
                }
            })
        }

        let body = {            
            fechaSeg,            
            seguimiento,
            tarea,
            resultado,
            responsable,
            responsableExterno,
            proxfechaSeg,
            pkCase: this.id,
        }

        try {
            let res: any;
            if (this.seguiSelect) {
                res = await this.scmService.updateSeguimiento(body);
            } else {
                console.log(body)
                res = await this.scmService.createSeguimiento(body);
            }

            if (res) {
                this.messageService.add({
                    key: 'segForm',
                    severity: "success",
                    summary: 'Mensaje del sistema',
                    detail: this.seguiSelect ? "El seguimiento fue actualizado exitosamente" : "El seguimiento fue creado exitosamente",
                });
                setTimeout(() => {
                    this.accions = [];
                    this.seguimiento.reset();
                    this.eventClose.emit()
                }, 1000);
            }
        } catch (error) {

            this.messageService.add({
                severity: "error",
                summary: "Error",
            });

        }
    }

    patchFormValues() {
         if (this.seguiSelect) {
             this.accions.map((act: any) => act.responsable = this.onSelectionResponsable(act.responsableEmpresa))
             this.seguimiento.patchValue({
                 fechaSeg: this.seguiSelect.fechaSeg == null ? null : new Date(this.seguiSelect.fechaSeg),
                 responsableExterno: this.seguiSelect.responsableExterno,
                 responsable: this.seguiSelect.responsable.id,
                 resultado: this.seguiSelect.resultado,
                 tarea: this.seguiSelect.tarea,
                 seguimiento: this.seguiSelect.seguimiento
             })
         } else {
            this.clearInputs();
        }
    }

    onSelectionResponsable(event: any) {
        if (!event) return;
        let empleado = <Empleado>event;
        this.responsableEmpresaNombre = (empleado.primerApellido || "") + " " + (empleado.primerNombre || "");
        return empleado;
    }

    buscarEmpleado(event: any) {
        this.empleadoService
            .buscar(event.query)
            .then((data: any) => (this.empleadosList = <Empleado[]>data));
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();
            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    async onRowCloneInit(pseg: any, type?: any) {
        let { id, tarea, responsable, resultado, responsableExterno, ...product } = pseg;
        try {
            let resp = await this.scmService.createSeguimiento(product);
            this.messageService.add({
                severity: "success",
                summary: "Mensaje del sistema",
                detail: `Se ha clonado exitosamente`,
            });
            //  this.fechaSeg();
        } catch (error) {
            this.messageService.add({
                severity: "danger",
                summary: "Mensaje del sistema",
                detail: `Ocurrió un inconveniente al clonar`,
            });
        }

    }

    async onRowEditSave(product: any, index: any) {
        this.accions[index] = product;
    }

    onRowDelete(index: any) {
        this.accions.splice(index, 1);
    }
    nuevaActividad() {
        let actv = { actividad: "", descripcionAct: "", responsableExterno: null, responsableEmpresa: null, fechaProyectada: new Date() }
        this.accions.push(actv)
    }
}


/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({ name: 'seguimientostatus' })
export class SeguimientoStatusPipe implements PipeTransform {
    transform(value: string, exponent?: string): string {
        let status = new Date(value) > new Date() ? 'Vigente' : 'Expirado';
        return status;
    }
}
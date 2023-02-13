import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService, SelectItem } from "primeng/api";
import { Pipe, PipeTransform } from '@angular/core';
import { epsorarl } from "../../entities/eps-or-arl";
import { Empleado } from "../../../empresa/entities/empleado";
import { locale_es } from "../../../comun/entities/reporte-enumeraciones";
import { CasosMedicosService } from "../../../core/services/casos-medicos.service";
import { EmpleadoService } from "../../../empresa/services/empleado.service";

@Component({
    selector: "app-recomendationsform",
    templateUrl: "./recomendationsform.component.html",
    styleUrls: ["./recomendationsform.component.scss"],
    providers: [CasosMedicosService, EmpleadoService]
})
export class RecomendationsformComponent implements OnInit, OnChanges {

    epsList!: SelectItem[];
    afpList!: SelectItem[];
    responsableEmpresaNombre = "";
    empleado!: Empleado;
    @Output() eventClose = new EventEmitter<any>()
    @Input() id: any;
    @Input() entity!: epsorarl;
    @Input() recoSelect: any;
    entit = [
        { label: 'Entidad  que emite', value: null },
        { label: 'EPS', value: 'EPS' },
        { label: 'ARL', value: 'ARL' },
        { label: 'Proveedor de salud', value: 'Proveedor_de_salud' },
        { label: 'Medicina prepagada', value: 'Medicina_Prepagada' },

    ];
    fields: string[] = [
        'documento',
    ];
    typeList = [
        { label: 'Seleccione', value: null },
        { label: 'Vigente', value: 'Vigente' },
        { label: 'Cerrada', value: 'Cerrada' },
        { label: 'Suspendida', value: 'Suspendida' },
        { label: 'Modificada', value: 'Modificada' },

    ];
    statusList = [
        { name: 'Seleccione', code: '' },

        { name: 'Vigente', code: '1' },
        { name: 'Expirado', code: '0' },

    ];
    empleadosList: Empleado[] = [];
    fechaActual = new Date();
    recomendation: FormGroup;
    tipoIdentificacionList: any;
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    accions: any[] = [];
    esConsulta: boolean = false;

    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
        private empleadoService: EmpleadoService,
        private messageService: MessageService

    ) {
        this.recomendation = fb.group({

            entidadEmitRecomendaciones: [null, Validators.required],
            responsableEmpresaNombre: [""],
            tipo: [null, Validators.required],
            actionPlanList: [null],
            fechaInicio: [null, Validators.required],
            responsableExterno: [null],
            fechaExpiracion: [null, Validators.required],
            entidadEmitida: [null],
            status: [null],
            actividad: [null],
            descripcionAct: [null],
            fechaProyectada: [null],
            responsableEmpresa: [null],
            recomendaciones: [null, Validators.required],

        });

    }
test(){
    console.log(this.accions)
}
    ngOnChanges(changes: SimpleChanges) {
        this.patchFormValues();
        // You can also use categoryId.previousValue and 
        // categoryId.firstChange for comparing old and new values
    }

    //Aqui estan los get para las validaciones
    get tipo() { return this.recomendation.get('tipo'); }
    get fechaInicio() { return this.recomendation.get('fechaInicio'); }
    get entidadEmitRecomendaciones() { return this.recomendation.get('entidadEmitRecomendaciones'); }
    get status() { return this.recomendation.get('status'); }
    get responsableExterno() { return this.recomendation.get('responsableExterno'); }
    get actividad() { return this.recomendation.get('actividad'); }
    get descripcionAct() { return this.recomendation.get('descripcionAct'); }
    get fechaProyectada() { return this.recomendation.get('fechaProyectada'); }
    get recomendaciones() { return this.recomendation.get('recomendaciones'); }
    get fechaExpiracion() { return this.recomendation.get('fechaExpiracion'); }
    get responsableEmpresa() { return this.recomendation.get('responsableEmpresa'); }
    get actionPlanList() { return this.recomendation.get('actionPlanList'); }

    async ngOnInit() {
        if (this.recoSelect) {
            this.patchFormValues()
        } else {
            this.clearInputs();
        }
        this.esConsulta = JSON.parse(localStorage.getItem('scmShowCase')!) == true ? true : false;
    }

    clearInputs() {
        this.recomendation.reset()
        this.accions = [];
    }

    async onSubmit() {
        if (!this.recomendation.valid) {
            return this.markFormGroupTouched(this.recomendation);
        }
        this.accions.map((act: any) => {
            if (act.responsableEmpresa)
                act.responsableEmpresa = act.responsableEmpresa.id;
        })
        let {
            entidadEmitRecomendaciones,
            tipo,
            fechaInicio,
            fechaExpiracion,
            recomendaciones,
            responsableEmpresa,
            actividad,
            descripcionAct,
            fechaProyectada,
            responsableExterno,
            entidadEmitida
        } = this.recomendation.value;

        if (this.accions.length > 0) {
            this.accions.forEach((act: any) => {
                if (typeof act.responsableEmpresa != 'number') {
                    console.log("Aqui entro");
                    act.responsableEmpresa = null;
                }
            })
        }

        let body = {
            id: this.recoSelect.id || "",
            entidadEmitRecomendaciones: entidadEmitRecomendaciones,
            tipo: tipo,
            entidadEmitida,
            fechaInicio,
            actionPlanList: this.accions,
            fechaExpiracion,
            recomendaciones,
            pkUser: this.id,
            pkCase: this.id,
            responsableEmpresa,
            responsableExterno,
            actividad,
            descripcionAct,
            fechaProyectada,
        }

        try {
            let res: any;
            if (this.recoSelect) {
                res = await this.scmService.updateRecomendation(body);
            } else {
                res = await this.scmService.createRecomendation(body);
            }

            if (res) {
                this.messageService.add({
                    key: 'recomendationsForm',
                    severity: "success",
                    summary: 'Mensaje del sistema',
                    detail: this.recoSelect ? "La recomendación fue actualizada exitosamente" : "La recomendación fue creada exitosamente",
                });
                setTimeout(() => {
                    this.accions = [];
                    this.recomendation.reset();
                    this.eventClose.emit()
                }, 1000);
            }
        } catch (error) {
            this.messageService.add({
                severity: "error",
                summary: "Error",
                // detail: `de el usuario ${emp.numeroIdentificacion}`,
            });
        }
    }

    patchFormValues() {
        if (this.recoSelect) {
            this.accions = this.recoSelect.actionPlanList;
            this.accions.map((act: any) => {
                act.responsableEmpresa = this.onSelectionResponsable(act.responsableEmpresa)
                act.fechaProyectada=new Date(act.fechaProyectada)
            });
            this.recomendation.patchValue({
                entidadEmitRecomendaciones: this.recoSelect.entidadEmitRecomendaciones,
                tipo: this.recoSelect.tipo,
                fechaInicio: this.recoSelect.fechaInicio == null ? null : new Date(this.recoSelect.fechaInicio),
                responsableExterno: this.recoSelect.responsableExterno,
                fechaExpiracion: this.recoSelect.fechaExpiracion == null ? null : new Date(this.recoSelect.fechaExpiracion),
                actionPlanList: this.recoSelect.actionPlanList,
                actividad: this.recoSelect.actividad,
                descripcionAct: this.recoSelect.descripcionAct,
                entidadEmitida: this.recoSelect.entidadEmitida,
                fechaProyectada: this.recoSelect.fechaProyectada == null ? null : new Date(this.recoSelect.fecha_proyectada),
                recomendaciones: this.recoSelect.recomendaciones,
            });
        } else {
            this.clearInputs();
        }
    }

    onSelectionResponsable(event: any) {
        console.log(event)
        if (!event) return;
        let empleado = <Empleado>event;
        this.responsableEmpresaNombre = (empleado.primerApellido || "") + " " + (empleado.primerNombre || "");
        return empleado;
    }

    buscarEmpleado(event: any) {
        this.empleadoService
            .buscar(event.query)
            .then((data) => (this.empleadosList = <Empleado[]>data));
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
                key: 'recomendationsForm',
                severity: "success",
                summary: "Mensaje del sistema",
                detail: `Se ha clonado exitosamente`,
            });
            //  this.fechaSeg();
        } catch (error) {
            this.messageService.add({
                key: 'recomendationsForm',
                severity: "danger",
                summary: "Mensaje del sistema",
                detail: `Ocurrió un inconveniente al clonar`,
            });
        }

    }

    async onRowEditSave(product: any, index: any) {
        this.accions[index] = product;
    }

    onRowDelete(index: number) {
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
@Pipe({ name: 'recomendationstatus' })
export class RecomendationStatusPipe implements PipeTransform {
    transform(value: string, exponent?: string): string {
        let status = new Date(value) > new Date() ? 'Vigente' : 'Expirado';
        return status;
    }
}
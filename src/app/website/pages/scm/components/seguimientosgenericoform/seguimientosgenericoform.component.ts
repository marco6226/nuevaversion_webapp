import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem, Message, MessageService } from "primeng/api";
import { Pipe, PipeTransform } from '@angular/core';
import { epsorarl } from "../../entities/eps-or-arl";
import { Empleado } from "../../../empresa/entities/empleado";
import { locale_es } from "../../../comun/entities/reporte-enumeraciones";
import { CasosMedicosService } from "../../../core/services/casos-medicos.service";
import { EmpleadoService } from "../../../empresa/services/empleado.service";
import { FilterQuery } from "../../../core/entities/filter-query";
import { Criteria } from "../../../core/entities/filter";
import { EmpleadoBasic } from "../../../empresa/entities/empleado-basic";

@Component({
    selector: "app-seguimientosgenericoform",
    templateUrl: "./seguimientosgenericoform.component.html",
    styleUrls: ["./seguimientosgenericoform.component.scss"],
    providers: [MessageService]
})
export class SeguimientosgenericoformComponent implements OnInit, OnChanges {

    epsList?: SelectItem[];
    afpList?: SelectItem[];
    responsableEmpresaNombre: string = "";
    empleado?: Empleado;
    @Output() eventClose = new EventEmitter<any>()
    @Input() id: any;
    @Input() entity?: epsorarl;
    @Input() recoSelect: any;
    @Input() seguigenericoSelect: any;
    empleadosList: EmpleadoBasic[] = [];
    fechaActual = new Date();
    recomendation?: FormGroup;
    seguimientogenerico: FormGroup;
    // tipoIdentificacionList;
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    accions: any[] = [];

    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
        private empleadoService: EmpleadoService,
        private messageService: MessageService
    ) {
        this.seguimientogenerico = fb.group({
            seguimiento: [null, Validators.required],
            tarea: [""],
            resultado: [null, Validators.required],
            fechaSeg: [null, Validators.required],
            responsable: [null],
            responsableExterno: [null],
            generico: [true]
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        this.patchFormValues();
        // You can also use categoryId.previousValue and 
        // categoryId.firstChange for comparing old and new values
    }

    //Aqui estan los get para las validaciones
    get resultado() { return this.seguimientogenerico.get('resultado'); }

    async ngOnInit() {
        if (this.seguigenericoSelect) {
            this.patchFormValues()
        } else {
            this.clearInputs();
        }
    }

    clearInputs() {
        this.seguimientogenerico.reset();
    }

    async onSubmit() {
        if (this.seguimientogenerico.value.responsable)
            this.seguimientogenerico.value.responsable = this.seguimientogenerico.value.responsable.id;

        let {
            tarea,
            seguimiento,
            fechaSeg,
            resultado,
            responsable,
            responsableExterno,
            generico,
        } = this.seguimientogenerico.value;

        if (this.accions.length > 0) {
            this.accions.forEach(act => {
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
            generico: true,
            pkCase: this.id,
        }
        
        try {
            let res: any;
            if (this.seguigenericoSelect) {
                await this.scmService.updateSeguimientogenerico(body)
                .then(response => {
                    this.messageService.add({
                        severity: "success",
                        summary: 'Mensaje del sistema',
                        detail: "El seguimiento fue actualizado exitosamente",
                        key: "scmGenerico"
                    });
                }).catch(() => {
                    throw 'Error';
                });
            } else {
                await this.scmService.createSeguimientogenerico(body)
                .then((response) => {
                    this.messageService.add({
                        severity: "success",
                        summary: 'Mensaje del sistema',
                        detail: "El seguimiento fue creado exitosamente",
                        key: "scmGenerico"
                    });
                }).catch((err) => {
                    throw 'Error';
                });
            }
            setTimeout(() => {
                this.seguimientogenerico.reset();
                this.eventClose.emit();
            }, 1000);
        } catch (error) {
            this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "No se pudo completar la acción.",
                key: "scmGenerico"
            });
        }
    }

    patchFormValues() {
        if (this.seguigenericoSelect) {

            this.accions.map(act => act.responsable = this.onSelectionResponsable(act.responsableEmpresa))
            this.seguimientogenerico.patchValue({
                fechaSeg: this.seguigenericoSelect.fechaSeg == null ? null : new Date(this.seguigenericoSelect.fechaSeg),
                responsableExterno: this.seguigenericoSelect.responsableExterno,
                responsable: this.seguigenericoSelect.responsable.id,
                resultado: this.seguigenericoSelect.resultado,
                tarea: this.seguigenericoSelect.tarea,
                seguimientogenerico: this.seguigenericoSelect.seguimiento,
                //generico: this.seguigenericoSelect.generico
            })
        } else {
            this.clearInputs();
        }
    }

    onSelectionResponsable(event: Empleado) {
        if (!event) return;
        let empleado = <Empleado>event;
        this.responsableEmpresaNombre = (empleado.primerApellido || "") + " " + (empleado.primerNombre || "");
        return empleado;
    }
    fields: string[] = [
        'id',
        'primerNombre',
        'primerApellido',
        'numeroIdentificacion', 
        'usuarioBasic'
      ];
    async buscarEmpleado(event:any) {

    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;

    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

    for (let i = 1; i < this.fields.length; i++) {
        filterQuery.filterList.pop();
        if(this.fields[i] != 'usuarioBasic'){
        filterQuery.filterList.push({ criteria: Criteria.LIKE, field: this.fields[i], value1: '%'+event.query+'%'});
        }else{
        filterQuery.filterList.push({ criteria: Criteria.LIKE, field: 'usuarioBasic.email', value1: '%'+event.query+'%'});
        }

        let terminarBusqueda = false;
        await this.empleadoService.findByFilter(filterQuery).then(
        (data: any) => {
            let datos: EmpleadoBasic[] = data.data;
            if(datos.length > 0){
            this.empleadosList = datos;
            terminarBusqueda = true;
            }
        }
        );
        if(terminarBusqueda) break;
    }

    }
    // buscarEmpleado2(event: any) {
    //     this.empleadoService
    //         .buscar(event.query)
    //         .then((data) => (this.empleadosList = <Empleado[]>data));
    // }


    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();
            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    onRowEditInit(product: any, type?: any) {
    }

    async onRowCloneInit(pseg: any, type?: any) {
        let { id, tarea, responsable, resultado, responsableExterno, ...product } = pseg;
        try {
            let resp = await this.scmService.createSeguimientogenerico(product);
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
@Pipe({ name: 'seguimientogenericostatus' })
export class SeguimientogenericoStatusPipe implements PipeTransform {
    transform(value: string, exponent?: string): string {
        let status = new Date(value) > new Date() ? 'Vigente' : 'Expirado';
        return status;
    }
}
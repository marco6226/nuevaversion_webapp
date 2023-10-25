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
import { firmaservice } from 'src/app/website/pages/core/services/firmas.service';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import{firma} from 'src/app/website/pages/comun/entities/firma'
import { FilterQuery } from "../../../core/entities/filter-query";
import { Criteria } from "../../../core/entities/filter";
import { EmpleadoBasic } from "../../../empresa/entities/empleado-basic";

@Component({
    selector: "app-seguimientosform",
    templateUrl: "./seguimientosform.component.html",
    styleUrls: ["./seguimientosform.component.scss"],
    providers: [MessageService]
})
export class SeguimientosformComponent implements OnInit, OnChanges {

    epsList!: SelectItem[];
    afpList!: SelectItem[];
    responsableEmpresaNombre = "";
    empleado!: Empleado;
    idEmpresa?:number=Number(this.sesionService.getEmpresa()?.id!)
    @Output() eventClose = new EventEmitter<any>()
    @Input() id: any;
    @Input() entity!: epsorarl;
    @Input() recoSelect: any;
    @Input() seguiSelect: any;
    @Input('prioridad') 
    set prioridadIn(prioridad: any){
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

    // empleadosList: Empleado[] = [];
    empleadosList: EmpleadoBasic[] = [];
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
        private config: PrimeNGConfig,
        private firmaservice:firmaservice,
        private sesionService: SesionService,
    ) {
        this.seguimiento = fb.group({

            seguimiento: [null],
            tarea: [""],
            resultado: [null],
            fechaSeg: [null],
            responsable: [null],            
            responsableExterno: [null],
            generico: [false],
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
            generico,
            proxfechaSeg
            
        } = this.seguimiento.value;
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
            generico:false,
            proxfechaSeg,
            pkCase: this.id,
        }

        try {
            let res: any;
            if (this.seguiSelect) {
                res = await this.scmService.updateSeguimiento(body)
                .then(resU => {
                    res = resU;
                })
                .catch(err => {
                    throw new Error(err);
                });
            } else {
                let firm= new firma();
                firm.idempresa=this.idEmpresa
                firm.fechacreacion=new Date()
                await this.scmService.createSeguimiento(body).then(async (ele:any)=>{
                    firm.idrelacionado=ele.id
                    await this.firmaservice.create(firm)
                    await this.firmaservice.create(firm)
                    res=ele
                })
                .catch(err => {
                    throw new Error(err);
                });
            }

            if (res) {
                this.messageService.add({
                    severity: "success",
                    summary: 'Mensaje del sistema',
                    detail: this.seguiSelect ? "El seguimiento fue actualizado exitosamente" : "El seguimiento fue creado exitosamente",
                    key: "segForm"
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
                detail: 'No se pudo completar la acción.',
                key: 'segForm'
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

    // buscarEmpleado(event: any) {
    //     this.empleadoService
    //         .buscar(event.query)
    //         .then((data: any) => {
    //             console.log(<Empleado[]>data)
    //             this.empleadosList=<Empleado[]>data
    //             });
    // }

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
            let resp
            let firm= new firma();
            firm.idempresa=this.idEmpresa
            firm.fechacreacion=new Date()
            await this.scmService.createSeguimiento(product).then(async (ele:any)=>{
                firm.idrelacionado=ele.id
                await this.firmaservice.create(firm)
                await this.firmaservice.create(firm)
                resp=ele
            })
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
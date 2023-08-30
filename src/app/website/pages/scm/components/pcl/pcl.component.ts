import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
    Input, KeyValueDiffers, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { locale_es } from '../../../comun/entities/reporte-enumeraciones';
import { CasosMedicosService } from '../../../core/services/casos-medicos.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { SesionService } from '../../../core/services/session.service';
import { epsorarl } from '../../entities/eps-or-arl';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-pcl',
    templateUrl: './pcl.component.html',
    styleUrls: ['./pcl.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CasosMedicosService, ConfirmService, SesionService, MessageService]
})
export class PclComponent implements OnInit {

    @Input() diagnosticos!: any[];
    @Input() pclOptionList!: any[];
    @Input() pkCase!: string | number;
    @Input() emitPclentity!: any[];
    @Input() entity!: epsorarl;
    @Output() eventClose: EventEmitter<any> = new EventEmitter<any>()
    @Output() dlistaPCL: EventEmitter<any> = new EventEmitter();
    action: boolean = false;
    loadingForm: boolean = false;
    loading: boolean = false;
    pclSelect: any;
    esConsulta: boolean = false;
    pclCalificacionList: SelectItem[] = [
        { label: "--Seleccione--", value: null },
        { label: "En proceso", value: "1" },
        { label: "En firme", value: "2" },
        { label: "En apelación", value: "0" }
    ]
    origenList: any;
    idEmpresa!: string;
    differ: any;
    diagList: SelectItem[] = [{ label: "--Seleccione--", value: null }];
    localeES: any = locale_es;
    tipoTratamientos: SelectItem[] = [];
    pclList: any[] = [];
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    modalDianostico: boolean = false;
    pclForm: FormGroup;
    estado!: string;

    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
        private differs: KeyValueDiffers,
        private cd: ChangeDetectorRef,
        private confirmService: ConfirmService,
        private sesionService: SesionService,
        private messageService: MessageService,
        private config: PrimeNGConfig
    ) {
        this.differ = differs.find({}).create();

        this.pclForm = fb.group({
            id: '',
            diag: [null, /*Validators.required*/],
            porcentajePcl: [null, /*Validators.required*/],
            pcl: [null, /*Validators.required*/],
            emisionPclFecha: [null, /*Validators.required*/],
            entidadEmitePcl: [null, /*Validators.required*/],
            entidadEmiteCalificacion: [null, /*Validators.required*/],
            statusDeCalificacion: [null, /*Validators.required*/],
            entidadEmitidaCalificacion: [null, /*Validators.required*/],
            fechaCalificacion: [null, /*Validators.required*/],
            entidadEmitida: [null, /*Validators.required*/],
            origen: [null, /*Validators.required*/],
            observaciones: [null, /*Validators.required*/],

        });

    }

    async ngOnInit() {
        this.config.setTranslation(this.localeES);
        this.idEmpresa =this.sesionService.getEmpresa()?.id!;
        this.createOrigenList()
        this.loadDiagnostics();
        await this.iniciarPcl();
        this.dlistaPCL.emit(this.pclList);
        this.esConsulta = JSON.parse(localStorage.getItem('scmShowCase')!) == true ? true: false;
    }
    createOrigenList(){
        if(this.idEmpresa=='22'){
            this.origenList = [
                { label: 'Seleccione', value: null },
                { label: 'Común', value: 'Común' },
                { label: 'Enfermedad Laboral', value: 'Enfermedad Laboral' },
            ];
        }else{
            this.origenList = [
                { label: 'Seleccione', value: null },
                { label: 'Común', value: 'Común' },
                { label: 'Accidente De Trabajo', value: 'Accidente De Trabajo' },
                { label: 'Accidente De Transito', value: 'Accidente De Transito' },
                { label: 'Mixto', value: 'Mixto' },
                { label: 'Enfermedad Laboral', value: 'Enfermedad Laboral' },
            ];
        }

    }
    loadDiagnostics(val?: any) {
        if (val) {
            this.diagList = this.diagList.filter(diagnostic => this.diagnosticos.some((diagOr) => diagnostic.value === null || diagnostic.value === diagOr.id.toString()));
        } else {
            this.diagnosticos.map(diag => {
                const i = this.diagList.findIndex(diagnostic => diagnostic['value'] === diag.id.toString());
                if (i > -1) {
                    this.diagList[i]['value'] = diag.id.toString();
                    this.diagList[i]['label'] = diag.diagnostico;
                } else this.diagList.push({ value: diag.id.toString(), label: diag.diagnostico });
            });
        }
    }

    ngDoCheck() {
        if (this.diagnosticos !== undefined) {
            let changes = this.differ.diff(this.diagnosticos);

            if (changes) {
                changes.forEachChangedItem((r: any) => {
                    this.cd.markForCheck();
                    this.loadDiagnostics();
                });
                changes.forEachAddedItem((r: any) => {
                    this.cd.markForCheck();
                    this.loadDiagnostics();
                });
                changes.forEachRemovedItem((r: any) => {
                    this.cd.markForCheck();
                    this.loadDiagnostics(true);
                });
            }
        }
    }

    onRowEditSave(pcl: any) {
        this.onSubmit(pcl);
    }

    onRowEditCancel() { }

    async iniciarPcl() {
        this.loading = true;
        try {
            this.pclList = await this.scmService.getListPcl(this.pkCase);

            if (this.pclList) {
                this.pclList.map(pcl => {
                    pcl.diagnostic = this.diagList.filter(diag => diag.value === pcl.diag.toString())[0];
                    pcl.pcl_o = (pcl.pcl !== null) ? this.pclOptionList.filter(pclF => pclF.value === pcl.pcl.toString())[0] : null;
                    pcl.entidadEmitePcl_o = (pcl.entidadEmitePcl !== null) ? this.emitPclentity.filter(ent => ent.value === pcl.entidadEmitePcl.toString())[0] : null;
                    pcl.origen_o = (pcl.origen !== null) ? this.origenList.filter((org: any) => org.value === pcl.origen.toString())[0] : null;
                    pcl.statusDeCalificacion_o = (pcl.statusDeCalificacion !== null) ? this.pclCalificacionList.filter(cal => cal.value === pcl.statusDeCalificacion.toString())[0] : null;
                    pcl.emisionPclFecha = pcl.emisionPclFecha == null ? null : new Date(pcl.emisionPclFecha);
                    pcl.fechaCalificacion = pcl.fechaCalificacion == null ? null : new Date(pcl.fechaCalificacion);
                    pcl.entidadEmitida = parseInt(pcl.entidadEmitida);
                });
            }
            this.loading = false;
            this.cd.markForCheck();
        } catch (e) {
            this.messageService.add({
                key: 'pcl',
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Ocurrió un error al cargar el listado de PCL"
            });
            this.loading = false;
            this.cd.markForCheck();
        }

    }

    async deletePcl() {
        this.action = true;
        this.pclSelect.entidadEmitida = this.pclSelect.entidadEmitida.toString();
        this.pclForm.patchValue(this.pclSelect);
        try {

            if (await this.confirmService.confirmPCL()){
                let res = await this.scmService.deletePcl(this.pclForm.value);

                if (res) {
                    this.messageService.add({
                        key: 'pcl',
                        severity: "success",
                        summary: "Mensaje del sistema",
                        detail: "La PCL ha sido eliminada exitosamente"
                    });
                    this.action = false;
                    this.eventClose.emit();
                    this.resetDiags();
                    this.cd.markForCheck();
                    await this.iniciarPcl();
                    this.dlistaPCL.emit(this.pclList);
                }
               
            }
        else {
            this.messageService.add({
                key: 'pcl',
                severity: "info",
                summary: "Cancelado",
                detail: "usted cancelo la eliminación"
            });
        }

            
        } catch (error) {
            this.messageService.add({
                key: 'pcl',
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Ocurrió un error al eliminar la PCL"
            });
            this.action = false;
            this.cd.markForCheck();
        }
    }

    editPcl() {
        this.estado='edit'
        this.modalDianostico = true;
        this.pclForm.patchValue(this.pclSelect);
    }

    async nuevoTratamiento() {
        this.estado='crear'
        this.modalDianostico = true;
        await this.iniciarPcl();
        this.dlistaPCL.emit(this.pclList);
    }

    showPcl() {
        this.estado='consulta'
        this.action = true;
        this.modalDianostico = true;
        this.pclForm.patchValue(this.pclSelect);
    }

    async resetDiags() {
        setTimeout(() => {
            this.cd.markForCheck();
        }, 5000);

        this.iniciarPcl();
    }

    async onSubmit(upd?: any) {
        console.log('aquí')
        this.loadingForm = true;
        if (!this.pclForm.valid && !upd) {
            return this.markFormGroupTouched(this.pclForm);
        }
        try {
            let res: any;
            if (upd) {
                res = await this.scmService.updatePcl(this.pclForm.value);
            } else {
                res = await this.scmService.createPcl(this.pclForm.value);
            }
            if (res) {
                this.messageService.add({
                    key: 'pcl',
                    severity: "success",
                    summary: "Mensaje del sistema",
                    detail: upd ? "La PCL ha sido actualizada exitosamente" : 'La PCL fue creada exitosamente',
                });
                this.pclSelect = null;
                this.loadingForm = false;
                this.reset();
                this.modalDianostico = false;
                this.eventClose.emit();
                this.resetDiags();
                this.cd.markForCheck();
            }
        } catch (error) {
            this.messageService.add({
                key: 'pcl',
                severity: "error",
                summary: "Mensaje del sistema",
                detail: upd ? "Ocurrió un problema al actualizar la PCL" : 'Ocurrió un problema al crear la PCL',
            });
            this.loadingForm = false;
            this.cd.markForCheck();
        }
    }

    onCancel() {
        this.modalDianostico = false;
        this.pclSelect = null;
        this.action = false;
        this.reset();
    }

    reset() {
        this.pclForm.reset();
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }
}

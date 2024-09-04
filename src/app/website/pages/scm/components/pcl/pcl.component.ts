import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
    Input, KeyValueDiffers, OnInit, Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { locale_es } from '../../../comun/entities/reporte-enumeraciones';
import { CasosMedicosService } from '../../../core/services/casos-medicos.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { SesionService } from '../../../core/services/session.service';
import { epsorarl } from '../../entities/eps-or-arl';
import { PrimeNGConfig } from 'primeng/api';
import { pclDiagnostico } from '../../../empresa/entities/pcl-diagnostico';

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
    @Input() saludLaboralFlag: boolean = false;
    action: boolean = false;
    loadingForm: boolean = false;
    modalDialog: boolean = false;
    loading: boolean = false;
    editing: boolean = false;
    pclSelect: any={};
    pclSelect2: any={};

    esConsulta: boolean = false;
    pclCalificacionList: SelectItem[] = [
        { label: "--Seleccione--", value: null },
        { label: "En estudio", value: "1" },
        { label: "En firme", value: "2" },
        { label: "En apelación", value: "0" }
    ]
    origenList: any;
    origenPclList: any;
    idEmpresa!: string;
    differ: any;
    diagList: SelectItem[] = [];
    localeES: any = locale_es;
    tipoTratamientos: SelectItem[] = [];
    pclList: any[] = [];
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    modalDianostico: boolean = false;
    pclForm: FormGroup;
    estado!: string;
    respuestaDelServidor: any[] | undefined;
    modalVisible: boolean = false;
    pclSeleccionada: any={};
    pclListDiag: any[]=[];
    listOneDiag:any[]=[];



    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
        private differs: KeyValueDiffers,
        private cd: ChangeDetectorRef,
        private confirmService: ConfirmService,
        private sesionService: SesionService,
        private messageService: MessageService,
        private config: PrimeNGConfig,
        private confirmationService: ConfirmationService,


    ) {
        this.differ = differs.find({}).create();

        this.pclForm = fb.group({
            id: '',
            diag: [[], /*Validators.required*/],
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
            origenPcl : [null, /*Validators.required*/],
            observacionesPcl: [null, /*Validators.required*/],
            tiempoCalificacion: [{ value: '', disabled: true }]

        });

    }
    clearSelection() {
        this.pclSelect = null;
        this.pclSelect2 = null;
    }
    get isButtonDisabled(): boolean {
        const status = this.pclForm.get('statusDeCalificacion')?.value;
        const origen = this.pclForm.get('origen')?.value;
        return status !== '2' || origen !== 'Enfermedad Laboral';
      }
   
      
    calculateTimeDifference(fechaInicio: number, fechaFin: Date): string {
        const startDate = new Date(fechaInicio);
        const endDate = new Date(fechaFin);
    
        let totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        totalMonths -= startDate.getMonth();
        totalMonths += endDate.getMonth();
        totalMonths = totalMonths <= 0 ? 0 : totalMonths;
    
        let totalDays = endDate.getDate() - startDate.getDate();
        if (totalDays < 0) {
            totalMonths--;
            totalDays += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
        }
    
        return `${totalMonths} meses y ${totalDays} días`;
    }
      
      

    async ngOnInit() {
        this.config.setTranslation(this.localeES);
        this.idEmpresa = this.sesionService.getEmpresa()?.id!;
        this.createOrigenList();
        this.loadDiagnostics();
        await this.iniciarPcl();
        this.dlistaPCL.emit(this.pclList);
        this.esConsulta = JSON.parse(localStorage.getItem('scmShowCase')!) == true ? true : false;
        this.clearSelection();
    
        // Agrupar las PCL por id en un objeto auxiliar
        let pclUniqueMap = new Map<string, any>();
        this.pclList.forEach(pcl => {
            if (!pclUniqueMap.has(pcl.id)) {
                pclUniqueMap.set(pcl.id, { ...pcl, diag: new Set(pcl.diag), totalDiag: pcl.diag.length });
            } else {
                const existingPcl = pclUniqueMap.get(pcl.id);
                pcl.diag.forEach((d: any) => existingPcl.diag.add(d));
                existingPcl.totalDiag += pcl.diag.length;
            }
        });
        this.pclList = Array.from(pclUniqueMap.values()).map(pcl => ({ ...pcl, diag: Array.from(pcl.diag) }));
        
        await this.iniciarPcl();

        const saludL = localStorage.getItem('saludL');
        let fechaRecepcionDocs: Date | null = null;
        if (saludL) {
            const parsedSaludL = JSON.parse(saludL);
            if (parsedSaludL.fechaRecepcionDocs) {
                fechaRecepcionDocs = new Date(parsedSaludL.fechaRecepcionDocs);
            }
        }
    
        this.pclForm.get('fechaCalificacion')?.valueChanges.subscribe(fechaCalificacion => {
            if (fechaRecepcionDocs && fechaCalificacion) {
                const tiempoCalificacion = this.calculateTimeDifference(fechaRecepcionDocs.getTime(), fechaCalificacion);
                this.pclForm.get('tiempoCalificacion')?.setValue(tiempoCalificacion);
            }
        });
    }
    

    createOrigenList() {
        if (this.idEmpresa == '22') {
            this.origenList = [
                { label: 'Seleccione', value: null },
                { label: 'Común', value: 'Común' },
                { label: 'Enfermedad Laboral', value: 'Enfermedad Laboral' },
            ];
            this.origenPclList = [
                { label: 'Seleccione', value: null },
                { label: 'Común', value: 'Común' },
                { label: 'Laboral', value: 'Laboral' },
            ];
        } else {
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
            if (this.saludLaboralFlag) {
                this.pclList = await this.scmService.listPclSL(this.pkCase);
            } else {
                this.pclList = await this.scmService.getListPcl(this.pkCase);
            }
            
            
    
            if (this.pclList) {
                let pclMap = new Map<number, any>();
                this.pclList.forEach(pcl => {
                    if (!pclMap.has(pcl.id)) {
                        pclMap.set(pcl.id, { ...pcl, totalDiag: 1 }); // Inicialmente, se cuenta el primer diagnóstico
                    } else {
                        const existingPcl = pclMap.get(pcl.id);
                        existingPcl.totalDiag++; // Se incrementa el contador de diagnósticos
                    }
                });
                // Convertir el Map a un array de objetos
                this.pclList = Array.from(pclMap.values());
            }
    
            // Configurar los demás campos necesarios
            this.pclList.forEach(pcl => {
                pcl.diagnostic = this.diagList.find(diag => diag.value === pcl.diag.toString());
                pcl.pcl_o = (pcl.pcl !== null) ? this.pclOptionList.find(pclF => pclF.value === pcl.pcl.toString()) : null;
                pcl.entidadEmitePcl_o = (pcl.entidadEmitePcl !== null) ? this.emitPclentity.find(ent => ent.value === pcl.entidadEmitePcl.toString()) : null;
                pcl.origen_o = (pcl.origen !== null) ? this.origenList.find((org: any) => org.value === pcl.origen.toString()) : null;
                pcl.statusDeCalificacion_o = (pcl.statusDeCalificacion !== null) ? this.pclCalificacionList.find(cal => cal.value === pcl.statusDeCalificacion.toString()) : null;
                pcl.emisionPclFecha = pcl.emisionPclFecha == null ? null : new Date(pcl.emisionPclFecha);
                pcl.fechaCalificacion = pcl.fechaCalificacion == null ? null : new Date(pcl.fechaCalificacion);
                pcl.entidadEmitida = parseInt(pcl.entidadEmitida);
                // Asegúrate de asignar los campos origenPcl y observacionesPcl
            });
            
    
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
    
    

    async consultarPcl() {

        this.loading = true;
        try {
            const response: pclDiagnostico[] = await this.scmService.listPclAllDiags(this.pkCase, this.pclSelect.id);
            this.pclListDiag = response;
            
            this.listOneDiag=[this.pclListDiag[0]]
            this.pclSeleccionada=response[0]
            
            
            this.modalVisible = true;
            
            this.loading = false;
            this.cd.markForCheck();
        } catch (error) {
            
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



    getStatusLabel(status: string): string {
        switch (status) {
            case "1":
                return 'En estudio';
            case "2":
                return 'En firme';
            case "3":
                return 'En apelación';
            default:
                return '';
        }
    }

    getStatusLabelPCL(status: string): string {
        switch (status) {
            case "1":
                return 'En Calificación';
            case "2":
                return 'En firme';
            case "3":
                return 'En apelación';
            default:
                return '';
        }
    }
    
    





    async deletePcl() {
        this.action = true;
        this.pclSelect.entidadEmitida = this.pclSelect.entidadEmitida.toString();
        this.pclForm.patchValue(this.pclSelect);
        try {
    
            if (await this.confirmService.confirmPCL()) {
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
                    this.pclForm.reset(); // Restablecer el formulario después de eliminar
                    this.cd.markForCheck();
                    await this.iniciarPcl();
                    this.dlistaPCL.emit(this.pclList);
                    this.clearSelection();
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
        this.estado = 'edit';
        this.modalDianostico = !this.editing; // Solo abre el modal si no estás editando
        if (!this.editing) {
            this.pclForm.patchValue(this.pclSelect);
        }
    }
    cambiarEstado(iddt: number): void {
        const saludL = JSON.parse(localStorage.getItem('saludL') || '{}');
        const idSl = saludL.idSl;
        this.confirmationService.confirm({
        message: '¿Estás seguro de que quieres enviar el caso ' + idSl+' a investigación ?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.scmService.changeEstadoSL(idSl).then(
                response => {
                  this.messageService.add({
                    key: 'pcl',
                    severity: "success",
                    summary: "Documento aprobado",
                    detail: `El caso ha sido enviado a investigación`,
                  });
                },
                error => {
                  console.error('Error al enviar datos:', error);
                }
              );

        }
        })
        
      }

    async nuevoTratamiento() {
        this.editing = false;
        this.estado = 'crear';
        this.modalDianostico = true;
        await this.iniciarPcl();
        this.dlistaPCL.emit(this.pclList);
    }


    showPcl() {
        this.estado = 'consulta'
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

        this.loadingForm = true;
        if (!this.pclForm.valid && !upd) {
            return this.markFormGroupTouched(this.pclForm);
        }
        try {
            let res: any;
            if (upd) {
                let pcl = this.pclForm.value;
                
                if (this.saludLaboralFlag) {
                    pcl.saludLaboral = true;
                }
                res = await this.scmService.updatePcl(this.pclForm.value);

            } else {
                let pcl = this.pclForm.value;
                let diags: any[] = pcl.diag.slice(); // Haciendo una copia de pcl.diag
                delete pcl.diag;
                diags = diags.map<number>(element => Number.parseInt(element))
                if (this.saludLaboralFlag) {
                    pcl.saludLaboral = true;
                }
                res = await this.scmService.createPcl(this.pclForm.value, diags);
                
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

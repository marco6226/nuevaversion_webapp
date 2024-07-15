import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { locale_es } from '../../../comun/entities/reporte-enumeraciones';
import { ComunService } from '../../../comun/services/comun.service';
import { CasosMedicosService } from '../../../core/services/casos-medicos.service';
import { SesionService } from '../../../core/services/session.service';
import { Usuario } from '../../../empresa/entities/usuario';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-diagnostico-form',
    templateUrl: './diagnostico-form.component.html',
    styleUrls: ['./diagnostico-form.component.scss'],
    providers: [CasosMedicosService, SesionService, ComunService, MessageService]
})
export class DiagnosticoFormComponent implements OnInit, OnChanges {

    diagnosticoForm: FormGroup;
    sistemaAfectado: any[] = [];
    @Input() caseId!: string;
    @Input() id!: string;
    @Output() eventClose = new EventEmitter<any>()
    @Output() closeModal = new EventEmitter<any>()
    @Input() diagSelect: any;
    @Input() saludLaboralFlag: boolean = false;

    origenList: any;
    idEmpresa!: string | null;
    esConsulta: boolean = false;
    localeES: any = locale_es;
    es: any;
    fechaActual = new Date();
    yearRange: string = "1900:" + this.fechaActual.getFullYear();
    usuario: Usuario | null = new Usuario();
    cieTipo: String = "";

    parteAfectadaList: any[] = [


    ];

    createOrigenList(){
        if(this.idEmpresa=='22'){
            this.origenList = [
                { label: 'Seleccione', value: null },
                { label: 'Común', value: 'Común' },
                { label: 'Accidente de trabajo', value: 'Accidente Laboral' },
                { label: 'Enfermedad laboral', value: 'Enfermedad Laboral' },

            ];
        }else{
            this.origenList = [
                { label: 'Seleccione', value: null },
                { label: 'Común', value: 'Común' },
                { label: 'Accidente de trabajo', value: 'Accidente Laboral' },
                { label: 'Mixto', value: 'Mixto' },
                { label: 'Enfermedad laboral', value: 'Enfermedad Laboral' },

            ];
        }

    }

    constructor(fb: FormBuilder,
        private scmService: CasosMedicosService,
        private sesionService: SesionService,
        private comunService: ComunService,
        private messageServices: MessageService,
        private config: PrimeNGConfig
    ) {
        this.usuario = this.sesionService.getUsuario();
        this.diagnosticoForm = fb.group({
            codigoCie10: [null, Validators.required],
            parteAfectada: [null],
            diagnostico: [null, Validators.required],
            fechaDiagnostico: [null, Validators.required],
            sistemaAfectado: [null],
            origen: [null],
            detalle: [null, Validators.required],

        });
    }

    get codigo() { return this.diagnosticoForm.get('codigoCie10'); }
    get diagnostico() { return this.diagnosticoForm.get('diagnostico'); }
    get detalle() { return this.diagnosticoForm.get('detalle'); }
    get fechaDiagnostico() { return this.diagnosticoForm.get('fechaDiagnostico'); }

    get sistemaAfec() { return this.diagnosticoForm.get('sistemaAfectado'); }
    get origen() { return this.diagnosticoForm.get('origen'); }

    async ngOnInit() {


        this.config.setTranslation(this.localeES);
        this.idEmpresa = this.sesionService.getEmpresa()?.id!;
        this.scmService.getpartesCuerpo().then(value => {
            const valuepivot: any = value
            this.parteAfectadaList = valuepivot

        })
         this.createOrigenList()
        let resp: any = await this.scmService.getSistemasAFectados();
        this.esConsulta = JSON.parse(localStorage.getItem('scmShowCase')!) == true ? true : false;

        this.sistemaAfectado.push({ label: '--Seleccione--', value: null });
        resp.forEach((sistema: any, index: any) => {
            this.sistemaAfectado.push({ label: sistema.name, value: sistema.id })
        });


    }
    idPivotbase: any[] = []

    async ngOnChanges(changes: SimpleChanges) {
        this.patchFormValues();
        console.log(this.diagnosticoForm);
        console.log('shi sheñolll', this.diagSelect);
    
        if (this.diagSelect && this.diagSelect['id'] != undefined && this.diagSelect['id'].toString().length > 0) {
            try {
                const value = await this.scmService.findAllByIdDiagPartes(this.diagSelect['id']);
                console.log('son las partes bebe', value);
                const response: any = value;
                const listNewPivot: any[] = response;
                let valueFor: any[] = [];
                listNewPivot.forEach(element => {
                    const foundElement = this.parteAfectadaList.find(value => {
                        return value['id'] == element['idPartes'];
                    });
                    if (foundElement) {
                        valueFor.push(foundElement);
                    }
                });
                this.idPivotbase = valueFor;
                this.diagnosticoForm.controls['parteAfectada'].setValue(valueFor);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        }
        // You can also use categoryId.previousValue and
        // categoryId.firstChange for comparing old and new values
    }
    

    async patchFormValues() {
        if (this.diagSelect) {
            this.diagnosticoForm.patchValue({
                codigoCie10: this.diagSelect.codigoCie10,
                diagnostico: this.diagSelect.diagnostico,
                fechaDiagnostico: this.diagSelect.fechaDiagnostico == null ? null : new Date(this.diagSelect.fechaDiagnostico),
                sistemaAfectado: this.diagSelect.sistemaAfectado,
                origen: this.diagSelect.origen,
                detalle: this.diagSelect.detalle

            })
            this.comunService.buscarCie(this.diagSelect.codigoCie10).then(
                (data: any) => this.cieTipo = data[0].tipo
            );
        } else {
            this.clearInputs();
        }

    }

    async onSubmit() {

        if (!this.diagnosticoForm.valid) {
            return this.markFormGroupTouched(this.diagnosticoForm);
        }

        let { codigoCie10, diagnostico, fechaDiagnostico, detalle, origen } = this.diagnosticoForm.value;

        let body: any = {
            id: "",
            codigoCie10,
            fechaDiagnostico,
            origen,
            diagnostico,
            detalle,
            sistemaAfectado: this.cieTipo,
            pkCase: this.caseId,
            pkUser: this.id,
            creadoPor: this.usuario?.email,
        }

        try {
            let res: any;
            if (this.diagSelect) {

                body.id = this.diagSelect.id;
                body['saludLaboral'] = this.saludLaboralFlag;
                res = await this.scmService.updateDiagnosticos(body);
                console.log(this.saludLaboralFlag, 'esta es la flag mi so');
                console.log(this.idPivotbase, 'esta es la la base mi so');
                console.log((this.diagnosticoForm.controls['parteAfectada'].value) as any[], 'esta es el cambio mi so');
                if (this.saludLaboralFlag) {
                    let idSelected = ((this.diagnosticoForm.controls['parteAfectada'].value) as any[]);
                    let deleteItems = this.idPivotbase.filter(value => {
                        return !idSelected.includes(value)
                    })
                    console.log('deleteame esta ', deleteItems);
                    
                    let createItems = idSelected.filter(value => {
                        return !this.idPivotbase.includes(value)
                    })
                    console.log('creame esta ', createItems);
                    await this.scmService.createDiagnosticosSL({
                        idDiagnostico: res.id,
                        idPartes: createItems.map(value => value['id'])

                    })
                    await deleteItems.forEach(async value => {
                        await this.scmService.deleteIdDiagPartes(this.diagSelect.id, value['id'])
                    })
                }

            } else {
                body['saludLaboral'] = this.saludLaboralFlag;
                res = await this.scmService.createDiagnosticos(body);
                if (this.saludLaboralFlag) {
                    await this.scmService.createDiagnosticosSL({
                        idDiagnostico: res.id,
                        idPartes: ((this.diagnosticoForm.controls['parteAfectada'].value) as any[]).map(value => {
                            return value['id']
                        })

                    })
                }



            }

            if (res) {

                this.clearInputs();
                this.messageServices.add({
                    severity: "success",
                    summary: "Mensaje del sistema",
                    detail: this.diagSelect ? "El diagnóstico fue actualizado exitosamente" : 'El diagnóstico fue creado exitosamente',
                });

                setTimeout(() => {
                    this.eventClose.emit();
                }, 1500);
            }
        } catch (error) {
            this.messageServices.add({
                severity: "error",
                summary: "Mensaje del sistema",
                detail: "Ocurrió un problema con el diagnóstico"
            });
        }
    }

    close() {
        this.closeModal.emit();
    }

    clearInputs() {
        this.diagnosticoForm.reset()
        this.cieTipo = "";
    }

    test(event: any) {
        this.diagnosticoForm.patchValue({ diagnostico: event.nombre, codigoCie10: event.codigo })
        this.cieTipo = event.tipo;
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

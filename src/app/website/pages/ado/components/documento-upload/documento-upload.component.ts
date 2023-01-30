import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Directorio } from '../../entities/directorio';
import { DirectorioService } from '../../services/directorio.service';


@Component({
    selector: 's-documentoUpload',
    templateUrl: './documento-upload.component.html',
    styleUrls: ['./documento-upload.component.scss'],
    providers: [MessageService]

})
export class DocumentoUploadComponent implements OnInit {
    @Input('modParam') modParam!: string;
    @Input('modulo') modulo!: string;
    @Input('caseId') caseId: any;
    @Input('tipoEvidencia') tipoEvidencia!: string;
    @Input('directorio') directorio!: Directorio;
    @Input('visible') visibleDlg!: boolean;
    @Input('contratistasFlag') contratistasFlag: boolean=false;
    @Output('visibleChange') visibleChange = new EventEmitter();
    @Output('onUpload') onUpload = new EventEmitter();
    esPrivado!: boolean;
    myGroup: any;
    form: any;
    doContratista= [
        { label: "--Seleccione--", value: null },
        { label: "Carta autorización", value: "Carta autorización" },
        { label: "Certificado ARL", value: "Certificado ARL" },
        { label: "Otros", value: "Otros" }
    ]

    constructor(
        private directorioService: DirectorioService,
        private messageService: MessageService
        
        ) {}

    ngOnInit() {
        this.myGroup = new FormGroup({
            cbxNivelAcceso: new FormControl(),
        });

        this.form = new  FormGroup({
            descripcion: new FormControl("",Validators.required)
        })
    }

    onVisibleChange(event: boolean) {
        this.visibleChange.emit(event);
    }

    myfiles: any = [];
    upload(event: any) {
        if(!this.form.invalid){
            event.files[0].descripcion=this.form.value.descripcion;
            if (this.caseId) {
                // this.directorio.caseId = this.caseId
            }
    
            let directorioPadre: string | null;
            if (this.directorio != null) {
                directorioPadre = this.directorio.toString();
            } else {
                directorioPadre = null;
            }
    
            let nivelAcceso: string = this.esPrivado ? 'PRIVADO' : 'PUBLICO';

            if(this.tipoEvidencia != null){
                this.directorioService.uploadv6(event.files[0], directorioPadre!, this.modulo, this.modParam, this.caseId,this.tipoEvidencia, nivelAcceso).then((resp) => {
                    let dir = <Directorio>resp;
                    this.onVisibleChange(false);
                    this.onUpload.emit(dir);
                });

            }
            else{
    
            this.directorioService.uploadv5(event.files[0], directorioPadre, this.modulo, this.modParam, this.caseId, nivelAcceso).then((resp) => {
                let dir = <Directorio>resp;
                this.onVisibleChange(false);
                this.onUpload.emit(dir);
            });
            }
            this.myfiles = [];
            this.form.reset();
        }
        else{
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Falta ingresar la descripción'});
            
        }
        
    }


    setNivelAcceso(checked: boolean) {
        this.esPrivado = checked;
    }

    myUploader(event: any) {
        //event.files == files to upload
    }

}
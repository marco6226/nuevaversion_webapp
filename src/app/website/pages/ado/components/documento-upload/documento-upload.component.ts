import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Directorio } from '../../entities/directorio';
import { DirectorioService } from '../../services/directorio.service';
import { Message, SelectItem } from 'primeng/api';
import { PerfilService } from 'src/app/website/pages/admin/services/perfil.service';
import { Perfil } from 'src/app/website/pages/empresa/entities/perfil';


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
    @Input('temporalesFlag') temporalesFlag: boolean=false;
    @Output('visibleChange') visibleChange = new EventEmitter();
    @Output('onUpload') onUpload = new EventEmitter();
    @Input() scmDoc: boolean = false;
    @Input('privadoCheck') privadoCheck: boolean = true;
    @Input() flagPrivado: boolean = true;

    esPrivado: boolean=false;
    myGroup: any;
    form: any;
    perfiles: any =[];
    perfilList: SelectItem[] = [];
    doContratista= [
        { label: "--Seleccione--", value: null },
        { label: "Carta autorización", value: "Carta autorización" },
        { label: "Certificado ARL", value: "Certificado ARL" },
        { label: "Otros", value: "Otros" }
    ]

    doTemporales= [
        { label: "--Seleccione--", value: null },
        { label: "FURAT", value: "FURAT" },
        { label: "Investigación de AT", value: "Investigación de AT" },
        { label: "Reportes a EPS y/o entes territoriales", value: "Reportes a EPS y/o entes territoriales" },
        { label: "Otros", value: "Otros" }
    ]

    constructor(
        private directorioService: DirectorioService,
        private messageService: MessageService,
        private perfilService: PerfilService,
        
        ) {}

    ngOnInit() {
        this.perfilService.findAll().then((resp:any) => {
            (<Perfil[]>resp['data']).forEach((perfil) => {
                this.perfilList.push({ label: perfil.nombre, value: perfil.id });
            });
        });
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
        let perfil
        this.perfiles.length==0?null:perfil=this.perfiles.toString()
        if((!this.form.invalid && !this.flagSCMPPrivado) ||(!this.form.invalid && this.flagSCMPPrivado && this.perfiles.length!=0)){
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

            let fkPerfilId: string = JSON.stringify(this.form.value.perfilesId);

            if(this.tipoEvidencia != null){
                this.directorioService.uploadv6(event.files[0], directorioPadre!, this.modulo, this.modParam, this.caseId,this.tipoEvidencia, nivelAcceso,fkPerfilId).then((resp) => {
                    let dir = <Directorio>resp;
                    this.onVisibleChange(false);
                    this.onUpload.emit(dir);
                });

            }
            else{
    
            this.directorioService.uploadv5(event.files[0], directorioPadre, this.modulo, this.modParam, this.caseId, nivelAcceso,perfil).then((resp) => {
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
        this.esPrivado = !(checked && this.esPrivado);
    }

    flagSCMPPrivado:boolean=false;
    setNivelAccesoScm(checked: boolean) {
        this.flagSCMPPrivado= !(checked && this.flagSCMPPrivado)
    }

    myUploader(event: any) {
        //event.files == files to upload
    }

}

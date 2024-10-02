import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { UsuarioService } from 'src/app/website/pages/admin/services/usuario.service';
import { Empleado } from '../../../entities/empleado';
import { locale_es, tipo_identificacion, tipo_vinculacion } from 'src/app/website/pages/rai/entities/reporte-enumeraciones';
import { EmpleadoService } from '../../../services/empleado.service';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { ComunService } from 'src/app/website/pages/comun/services/comun.service';
import { CargoService } from '../../../services/cargo.service';
import { PerfilService } from 'src/app/website/pages/admin/services/perfil.service';
import { DirectorioService } from 'src/app/website/pages/ado/services/directorio.service';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { Criteria, SortOrder } from 'src/app/website/pages/core/entities/filter';
import { Afp } from 'src/app/website/pages/comun/entities/afp';
import { Cargo } from '../../../entities/cargo';
import { Perfil } from '../../../entities/perfil';
import { Eps } from 'src/app/website/pages/comun/entities/eps';
import { Area } from '../../../entities/area';
import { Usuario, UsuarioEmpresa } from '../../../entities/usuario';
import { MessageService, SelectItem } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 's-empleadoForm',
    templateUrl: './empleado-form.component.html',
    styleUrls: ['./empleado-form.component.scss'],
    providers: [UsuarioService, ComunService, CargoService, PerfilService, DirectorioService, MessageService],
})
export class EmpleadoFormComponent implements OnInit {
    @Output() onEmpleadoCreate = new EventEmitter();
    @Output() onEmpleadoUpdate = new EventEmitter();
    @Output() onCancel = new EventEmitter();
    empleadoSelect?: Empleado;
    dropdownStyleClass: string = 'custom-dropdown';
    @Input('empleadoSelect') 
    set empleadoSelectInput(empleadoInput: Empleado){
        this.empresaForm.reset()
        if(empleadoInput){
            this.empleadoSelect = empleadoInput
            setTimeout(() => {
            this.empresaForm.value.nit = this.empleadoSelect!.nit
            this.empresaSelect2 = this.empresaForm.value.empresa = { label:this.empleadoSelect!.empresa, empresa:this.empleadoSelect!.empresa,nit:this.empleadoSelect!.nit}
            }, 1000);
        }
    }
    @Input() isUpdate!: boolean;
    @Input() show!: boolean;
    @Input() editable!: boolean;
    form: FormGroup;
    jefeForm!: FormGroup;
    businessForm: FormGroup;
    empleadosList: any[] = [];
    empresaId = this.sesionService.getEmpresa()?.id;
    fechaActual = new Date();
    jefeInmediatoForm: FormGroup;
    empresaForm: FormGroup;
    yearRange: string = '1900:' + this.fechaActual.getFullYear();
    localeES: any = locale_es;
    tipoIdentificacionList: SelectItem[];
    tipoVinculacionList: SelectItem[];
    epsList!: SelectItem[];
    afpList!: SelectItem[];
    cargoList!: SelectItem[];
    perfilList: SelectItem[] = [];
    loaded!: boolean;
    empleado!: any;
    solicitando: boolean = false;

    imagenesList!: any[];
    imagenesPath: any;
    numMaxImg = 1;
    avatar: any;
    listaEvidence: any = [];
    empresaList2: empresaNit[] = [
        { label: "--Seleccione--", empresa: null, nit: null },
        { label: "Agromil S.A.S", empresa: "Agromil S.A.S", nit:"830511745" },
        { label: "Almacenes Corona", empresa: "Almacenes Corona", nit:"860500480-8" },
        { label: "Compañía Colombiana de Ceramica S.A.S", empresa: "Compañía Colombiana de Ceramica S.A.S",nit:"860002536-5" },
        { label: "Corlanc S.A.S", empresa: "Corlanc S.A.S",nit:"900481586-1" },
        { label: "Corona Industrial", empresa: "Corona Industrial",nit:"900696296-4" },
        { label: "Despachadora internacional de Colombia S.A.S", empresa: "Despachadora internacional de Colombia S.A.S",nit:"860068121-6" },
        { label: "Electroporcelana Gamma", empresa: "Electroporcelana Gamma",nit:"890900121-4" },
        { label: "Locería Colombiana S.A.S", empresa: "Locería Colombiana S.A.S",nit:"890900085-7" },
        { label: "Minerales Industriales S.A", empresa: "Minerales Industriales S.A",nit:"890917398-1" },
        { label: "Nexentia S.A.S", empresa: "Nexentia S.A.S",nit:"900596618-3" },
        { label: "Suministros de Colombia S.A.S", empresa: "Suministros de Colombia S.A.S",nit:"890900120-7" },
        { label: "Organización corona", empresa: "Organización corona",nit:"860002688-6" },
        { label: "Industria Ceramica Costarricense", empresa: "Industria Ceramica Costarricense",nit:"1-811-0957" },//honduras - costarica
        { label: "Industria Centroamericana de Sanitarios", empresa: "Industria Centroamericana de Sanitarios",nit:"1078" },//honduras - costarica
        { label: "Sociedad Anonima", empresa: "Sociedad Anonima",nit:"7568991" },// Guatemala
        { label: "Porcelana Corona de México, S.A. de C.V.", empresa: "Porcelana Corona de México, S.A. de C.V.",nit:"SLA630306CF7" }, //Moterrey - Ramos Arispe
        { label: "Industria Cerámica Centroamericana, S.A.", empresa: "Industria Cerámica Centroamericana, S.A.",nit:"J0310000003211" } //Nicaragua
	]
    
    empresaSelect2!: empresaNit;

    constructor(
        private empleadoService: EmpleadoService,
        private sesionService: SesionService,
        private fb: FormBuilder,
        private comunService: ComunService,
        private cargoService: CargoService,
        private usuarioService: UsuarioService,
        private perfilService: PerfilService,
        private domSanitizer: DomSanitizer,
        private directorioService: DirectorioService,
        private _sanitizer: DomSanitizer,
        private messageService: MessageService,
        private config: PrimeNGConfig
    ) {
        let defaultItem = <SelectItem[]>[{ label: '--seleccione--', value: null }];
        this.tipoIdentificacionList = defaultItem.concat(<SelectItem[]>tipo_identificacion);
        this.tipoVinculacionList = defaultItem.concat(<SelectItem[]>tipo_vinculacion);

        this.businessForm = fb.group({
            id: ['', Validators.required],
            numeroIdentificacion: ['', Validators.required],
            primerNombre: [{ value: '', disabled: true }, Validators.required],
            primerApellido: { value: '', disabled: true },
            email: { value: '', disabled: true },
            direccionGerencia: { value: '', disabled: true },
            correoPersonal: { value: '', disabled: true },
            cargoId: [{ value: '', disabled: true }, Validators.required],
        });

        this.jefeInmediatoForm = fb.group({
            id: ['', Validators.required],
            numeroIdentificacion: ['', Validators.required],
            primerNombre: [{ value: '', disabled: true }, Validators.required],
            primerApellido: { value: '', disabled: true },
            email: { value: '', disabled: true },
            direccionGerencia: { value: '', disabled: true },
            correoPersonal: { value: '', disabled: true },
            cargoId: [{ value: '', disabled: true }, Validators.required],
        });
        this.empresaForm = fb.group({            
            empresa:[null, Validators.required],
            nit:[null, Validators.required],
        });
        this.form = fb.group({
            id: [null],
            primerNombre: [null, Validators.required],
            segundoNombre: null,
            primerApellido: [null, Validators.required],
            segundoApellido: null,
            codigo: [null],
            direccion: [null],
            fechaIngreso: [null, Validators.required],
            fechaNacimiento: [null],
            genero: [null],
            numeroIdentificacion: [null, Validators.required],
            telefono1: [null],
            telefono2: [null],
            afp: [null],
            emergencyContact: [null],
            corporativePhone: [null],
            phoneEmergencyContact: [null],
            emailEmergencyContact: [null],
            ccf: [null],
            ciudad: [null],
            eps: [null],
            tipoIdentificacion: [null, Validators.required],
            tipoVinculacion: [null],
            zonaResidencia: [null],
            area: [null, Validators.required],
            cargoId: [null, Validators.required],
            perfilesId: [null, Validators.required],
            ipPermitida: [],
            email: [null, { disabled: true }, Validators.required],
            direccionGerencia: [null],
            empresa: [null],
            nit: [null],
            regional: [null],
            businessPartner: [''],
            jefeInmediato: [''],
            correoPersonal: [null],
            ciudadGerencia: [null],
            enviacorreo:[null],
        });
    }
    usuarioP:any;
    async usuarioPermisos() {
        this.usuarioP=[];
        // this.usuarioEmpresaList.usuario.id;
        let filterQuery = new FilterQuery();
        filterQuery.filterList = [
            {
                field: "usuarioEmpresaList.usuario.id",
                criteria: Criteria.EQUALS,
                value1: this.empleadoSelect?.usuario.id,
            },
        ];
        //this.perfilService.update;
        await this.perfilService.findByFilter(filterQuery).then((resp:any) => {
                resp["data"].forEach((ident:any) => {
                    this.usuarioP.push(ident.id);
                });
        });
    }

    ngOnInit() {
        this.config.setTranslation(this.localeES);
        this.isUpdate ? this.form.controls['email'].disable() : ''; //this for disabled email in case of update
        if (this.empleadoSelect != null) {
            let fq = new FilterQuery();
            fq.filterList = [{ criteria: Criteria.EQUALS, field: 'id', value1: this.empleadoSelect.id, value2: null }];
            this.empleadoService.findByFilter(fq).then(async (resp:any) => {
                this.empleadoSelect = <Empleado>resp['data'][0];
                this.loaded = true;
                if (this.empleadoSelect.businessPartner) {
                    this.onSelectionBP(this.empleadoSelect.businessPartner);
                }
                if (this.empleadoSelect.jefeInmediato) {
                    this.onSelectionJefeInmediato(this.empleadoSelect.jefeInmediato);
                }
                await this.usuarioPermisos()
                
                this.form.patchValue({
                    id: this.empleadoSelect.id,
                    primerNombre: this.empleadoSelect.primerNombre,
                    segundoNombre: this.empleadoSelect.segundoNombre,
                    primerApellido: this.empleadoSelect.primerApellido,
                    segundoApellido: this.empleadoSelect.segundoApellido,
                    codigo: this.empleadoSelect.codigo,
                    direccion: this.empleadoSelect.direccion,
                    fechaIngreso: this.empleadoSelect.fechaIngreso == null ? null : new Date(this.empleadoSelect.fechaIngreso),
                    fechaNacimiento: this.empleadoSelect.fechaNacimiento == null ? null : new Date(this.empleadoSelect.fechaNacimiento),
                    genero: this.empleadoSelect.genero,
                    numeroIdentificacion: this.empleadoSelect.numeroIdentificacion,
                    telefono1: this.empleadoSelect.telefono1,
                    telefono2: this.empleadoSelect.telefono2,
                    afp: this.empleadoSelect.afp == null ? null : this.empleadoSelect.afp.id,
                    ciudad: this.empleadoSelect.ciudad,
                    eps: this.empleadoSelect.eps == null ? null : this.empleadoSelect.eps.id,
                    tipoIdentificacion: this.empleadoSelect.tipoIdentificacion == null ? null : this.empleadoSelect.tipoIdentificacion.id,
                    tipoVinculacion: this.empleadoSelect.tipoVinculacion,
                    zonaResidencia: this.empleadoSelect.zonaResidencia,
                    area: this.empleadoSelect.area,
                    cargoId: this.empleadoSelect.cargo.id,
                    perfilesId: this.usuarioP,
                    corporativePhone: this.empleadoSelect.corporativePhone,
                    empresa: this.empleadoSelect.empresa,
                    nit: this.empleadoSelect.nit,
                    emergencyContact: this.empleadoSelect.emergencyContact,
                    phoneEmergencyContact: this.empleadoSelect.phoneEmergencyContact,
                    emailEmergencyContact: this.empleadoSelect.emailEmergencyContact,
                    direccionGerencia: this.empleadoSelect.direccionGerencia,
                    regional: this.empleadoSelect.regional,
                    correoPersonal: this.empleadoSelect.correoPersonal,
                    ciudadGerencia: this.empleadoSelect.ciudadGerencia,
                    jefeInmediato: this.empleadoSelect.jefeInmediato,
                    'ipPermitida': this.empleadoSelect.usuario.ipPermitida,
                    businessPartner: this.empleadoSelect.businessPartner,
                    email: [this.empleadoSelect.usuario.email?.trim()],
                });
                setTimeout(() => {
                    this.form.patchValue({
                        'ciudad': this.empleadoSelect!.ciudad,
                        'departamento': this.empleadoSelect!.ciudad.departamento,
                    })
                }, 2100);
            });
        } 
        else {
            this.loaded = true;
            let area: any;
            this.form.patchValue({ area: area });
            this.editable = true;
        }
        this.comunService.findAllAfp().then((data) => {
            this.afpList = [];
            this.afpList.push({ label: '--Seleccione--', value: null });
            (<Afp[]>data).forEach((afp) => {
                this.afpList.push({ label: afp.nombre, value: afp.id });
            });
        });
        this.comunService.findAllEps().then((data) => {
            this.epsList = [];
            this.epsList.push({ label: '--Seleccione--', value: null });
            (<Afp[]>data).forEach((eps) => {
                this.epsList.push({ label: eps.nombre, value: eps.id });
            });
        });

        let cargofiltQuery = new FilterQuery();
        cargofiltQuery.sortOrder = SortOrder.ASC;
        cargofiltQuery.sortField = "nombre";
        cargofiltQuery.fieldList = ["id", "nombre"];
        this.cargoService.findByFilter(cargofiltQuery).then((resp:any) => {
            this.cargoList = [];
            this.cargoList.push({ label: '--Seleccione--', value: null });
            (<Cargo[]>resp['data']).forEach((cargo) => {
                this.cargoList.push({ label: cargo.nombre, value: cargo.id });
            });
        });

        this.perfilService.findAll().then((resp:any) => {
            (<Perfil[]>resp['data']).forEach((perfil) => {
                this.perfilList.push({ label: perfil.nombre, value: perfil.id });
            });
            if (this.isUpdate === true || this.show === true)
                setTimeout(() => {
                    this.buildPerfilesIdList();
                }, 3000);
        });
        
        this.getTareaEvidences();
    }

    async buildPerfilesIdList() {
        let filterQuery = new FilterQuery();

        filterQuery.filterList = [
            {
                field: 'usuarioEmpresaList.usuario.id',
                criteria: Criteria.EQUALS,              
                value1: this.empleadoSelect?.usuario.id,
                value2: null,
            },

        ];

        this.perfilService.update;
        await this.perfilService.findByFilter(filterQuery).then((resp:any) => {
            let perfilesId: any[] = [];
            resp['data'].forEach((ident:any) => perfilesId.push(ident.id));

            this.form.patchValue({ perfilesId: perfilesId });
        });
    }

    onSubmit() {
        let empleado: Empleado = new Empleado();
        empleado.id = this.form.value.id;
        empleado.primerNombre = this.form.value.primerNombre;
        empleado.segundoNombre = this.form.value.segundoNombre;
        empleado.primerApellido = this.form.value.primerApellido;
        empleado.segundoApellido = this.form.value.segundoApellido;
        empleado.codigo = this.form.value.codigo;
        empleado.direccion = this.form.value.direccion;
        empleado.fechaIngreso = this.form.value.fechaIngreso;
        empleado.emergencyContact = this.form.value.emergencyContact;
        empleado.corporativePhone = this.form.value.corporativePhone;
        empleado.phoneEmergencyContact = this.form.value.phoneEmergencyContact;
        empleado.emailEmergencyContact = this.form.value.emailEmergencyContact;
        empleado.fechaNacimiento = this.form.value.fechaNacimiento;
        empleado.genero = this.form.value.genero;
        empleado.numeroIdentificacion = this.form.value.numeroIdentificacion;
        empleado.telefono1 = this.form.value.telefono1;
        empleado.telefono2 = this.form.value.telefono2;
        empleado.empresa = this.empresaForm.value.empresa == null ? null : this.empresaForm.value.empresa.label;
        empleado.nit = this.empresaForm.value.empresa == null ? 0 : this.empresaForm.value.empresa.nit;
        empleado.ciudad = this.form.value.ciudad == null ? null : this.form.value.ciudad.id;
        if (this.form.value.afp != null) {
            empleado!.afp = new Afp();
            empleado!.afp.id = this.form.value.afp;
        }
        if (this.form.value.eps != null) {
            empleado!.eps = new Eps();
            empleado!.eps.id = this.form.value.eps;
        }
        empleado.tipoIdentificacion = this.form.value.tipoIdentificacion;
        empleado.tipoVinculacion = this.form.value.tipoVinculacion;
        empleado.zonaResidencia = this.form.value.zonaResidencia;
        empleado.area = new Area();
        empleado.cargo = new Cargo();
        empleado.usuario = new Usuario();
        empleado.area.id = this.form.value.area.id;
        empleado.cargo.id = this.form.value.cargoId;
        if(this.form.value.email){
            empleado.usuario.email = this.form.value.email.trim();
        }else{
            empleado.usuario.email = this.form.value.email
        }
        
        empleado.ciudadGerencia = this.form.value.ciudadGerencia;
        empleado.enviacorreo = this.form.value.enviacorreo;
        (empleado.regional = this.form.value.regional), (empleado.correoPersonal = this.form.value.correoPersonal);

        if (this.form.value.businessPartner) {
            empleado.businessPartner = this.form.value.businessPartner.id;
        }
        if (this.form.value.jefeInmediato) {
            empleado.jefeInmediato = this.form.value.jefeInmediato.id;
        }
        empleado!.direccionGerencia = this.form.value.direccionGerencia;

        empleado!.usuario.ipPermitida = [];
        empleado!.usuario.usuarioEmpresaList = [];

        this.form.value.perfilesId.forEach((perfilId:any) => {
            let ue = new UsuarioEmpresa();
            ue.perfil = new Perfil();
            ue.perfil.id = perfilId;
            empleado?.usuario.usuarioEmpresaList?.push(ue);
        });
        this.solicitando = true;
        if (this.isUpdate) {
            empleado!.usuario.id = this.empleadoSelect?.usuario.id;
            this.usuarioService
                .update(empleado!.usuario)
                .then((resp) => {
                    this.solicitando = false;
                })
                .catch((err) => {
                    this.solicitando = false;
                });
            this.empleadoService
                .update(empleado!)
                .then((data) => {
                    this.manageUpdateResponse(<Empleado>data);
                    this.solicitando = false;
                    //agregar firma
                    if (this.imagenesList != null) {
                        this.imagenesList.forEach(async (imgObj) => {
                            let resp: any = await this.directorioService.uploadv5(imgObj.file, null, 'EMP', this.empleadoSelect!.id!, null, 'PUBLICO',null);
                            let respid: any[] = Object.values(resp);

                            this.directorioService.uploadv3(respid[0], this.empleadoSelect!.id!, 'EMP');
                        });
                    }
                })
                .catch((err) => {
                    this.solicitando = false;
                });
        } else {
            this.empleadoService
                .create(empleado!)
                .then((data) => {
                    this.manageCreateResponse(<Empleado>data);
                    this.solicitando = false;
                    //agregar firma
                    if (this.imagenesList != null) {
                        this.imagenesList.forEach(async (imgObj) => {
                            let resp: any = await this.directorioService.uploadv5(imgObj.file, null, 'EMP', this.empleadoSelect!.id!, null, 'PUBLICO',null);
                            let respid: any[] = Object.values(resp);

                            this.directorioService.uploadv3(respid[0], this.empleadoSelect!.id!, 'EMP');
                        });
                    }
                })
                .catch((err) => {
                    this.solicitando = false;
                });
        }
    }

    manageUpdateResponse(empleado: Empleado) {
        this.onEmpleadoUpdate.emit({ empleado });
    }

    manageCreateResponse(empleado: Empleado) {
        this.onEmpleadoCreate.emit({ empleado });
    }

    closeForm() {
        this.onCancel.emit();
    }

    // Component methods
    buscarEmpleado(event: any) {
        this.empleadoService.buscar(event.query).then((data) => (this.empleadosList = <Empleado[]>data));
    }

    onSelectionBP(event: any) {
        let empleado = <Empleado>event;
        this.form.patchValue({ businessPartner: empleado });
        this.businessForm.patchValue({
            id: empleado.id,
            primerNombre: empleado.primerNombre,
            primerApellido: empleado.primerApellido,
            numeroIdentificacion: empleado.numeroIdentificacion,
            corporativePhone: empleado.corporativePhone,
            area: empleado.area,
            correoPersonal: empleado.correoPersonal,
            cargoId: empleado.cargo.id,
            ipPermitida: empleado.usuario.ipPermitida,
            direccionGerencia: empleado.direccionGerencia,

            email: [empleado.usuario.email],
        });
    }

    /** MÉTODOS JORNADA */
    onSelectionJefeInmediato(event: any) {
        let empleado = <Empleado>event;
        this.form.patchValue({ jefeInmediato: empleado });
        this.jefeInmediatoForm.patchValue({
            id: empleado.id,
            primerNombre: empleado.primerNombre,
            direccionGerencia: empleado.direccionGerencia,

            primerApellido: empleado.primerApellido,
            numeroIdentificacion: empleado.numeroIdentificacion,
            corporativePhone: empleado.corporativePhone,
            area: empleado.area,
            correoPersonal: empleado.correoPersonal,
            cargoId: empleado.cargo.id,
            ipPermitida: empleado.usuario.ipPermitida,
            email: [empleado.usuario.email],
        });
    }

    onArchivoSelect(event: any) {
        let file = event.target.files[0];
        if (file.type != 'image/jpeg' && file.type != 'image/png') {
            this.messageService.add({severity: 'error', summary: 'Tipo de archivo no permitido', detail: 'El tipo de archivo permitido debe ser png o jpg', key:'empleadoForm' });
            return;
        }
        if (file.size > 30_500_000) {
            this.messageService.add({severity: 'error', summary: 'Tamaño máximo superado 30.5 MB', detail: 'La imágen supera el tamaño máximo permitido' , key:'empleadoForm'});
            return;
        }
        if (this.imagenesList == null) this.imagenesList = [];

        if (this.imagenesList.length >= this.numMaxImg) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Número maximo de fotografias alcanzado',
                detail: 'Ha alcanzado el número máximo de fotografias (' + this.numMaxImg + ') que puede adjuntar',
                key:'empleadoForm'
            });
            return;
        }
        let urlData = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        this.imagenesList.push({ source: urlData, file: file });
        this.imagenesList = this.imagenesList.slice();
    }

    async getTareaEvidences() {
        try {
            let res: any = await this.empleadoService.getFirma(this.empleadoSelect?.id);
            if (res) {
                res.files.forEach(async (evidence: any) => {
                    let ev: any = await this.directorioService.download(evidence);
                    let blob = new Blob([ev]);
                    let reader = new FileReader();
                    reader.readAsDataURL(blob);
                   
                    reader.onloadend = () => {
                        if (ev) {
                            this.avatar=reader.result;
                            this.listaEvidence.push(reader.result);


                            if (this.imagenesList == null) this.imagenesList = [];
                            this.imagenesList = this.imagenesList.slice();
                            this.imagenesPath = this._sanitizer.bypassSecurityTrustResourceUrl(this.avatar);
                        } else {
                            throw new Error('Ocurrió un problema al consultar la firma del empleado');
                        }
                    };
                });
            }
        } catch (e) {
        }
    }

    

}

interface empresaNit{
 label: string;
 empresa: string | null;
 nit: string | null;
}
  
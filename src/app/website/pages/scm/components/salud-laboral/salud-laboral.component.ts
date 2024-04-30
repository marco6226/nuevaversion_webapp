import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { EmpleadoService } from '../../../empresa/services/empleado.service';
import { Empleado } from '../../../empresa/entities/empleado';
import * as moment from "moment";
import { Empresa } from '../../../empresa/entities/empresa';
import { FilterQuery } from "../../../core/entities/filter-query";
import { Criteria, SortOrder } from "../../../core/entities/filter";
import { SesionService } from '../../../core/services/session.service';
import { PerfilService } from '../../../admin/services/perfil.service';
import { PrimeNGConfig, SelectItem,MessageService, Message } from 'primeng/api';
import { locale_es, tipo_identificacion } from '../../../comun/entities/reporte-enumeraciones';
import { Perfil } from '../../../empresa/entities/perfil';
import { ComunService } from '../../../comun/services/comun.service';
import { CargoService } from '../../../empresa/services/cargo.service';
import { Eps } from '../../../comun/entities/eps';
import { Afp } from '../../../comun/entities/afp';
import { Arl } from '../../../comun/entities/arl';
import { Proveedor } from '../../../comun/entities/proveedor';
import { Cargo } from '../../../empresa/entities/cargo';
import { epsorarl } from '../../entities/eps-or-arl';
import { Prepagadas } from '../../../comun/entities/prepagadas';
import { ConfirmService } from '../../../core/services/confirm.service';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { AreaService } from '../../../empresa/services/area.service';
import { AreaMatrizService } from '../../../core/services/area-matriz.service';
import { ProcesoMatrizService } from '../../../core/services/proceso-matriz.service';
import { CargoActual } from '../../../empresa/entities/cargo-actual';
import { CargoActualService } from '../../../empresa/services/cargoActual.service';




@Component({
  selector: 'app-salud-laboral',
  templateUrl: './salud-laboral.component.html',
  styleUrl: './salud-laboral.component.scss',
  providers:[EmpleadoService, SesionService,PerfilService,CargoService,ComunService,MessageService,ConfirmService]
})
export class SaludLaboralComponent implements OnInit{
  
  @Input() isUpdate!: boolean;
  @Input() show!: boolean;

  msgs?: Message[];

  empleadoForm: FormGroup;
  empleadosList!: Empleado[];
  value: any;
  empleadoSelect?: Empleado | null;

  empresaForm?: FormGroup;
  empresaSelect2!: empresaNit;
  loaded!: boolean;

  nameAndLastName = "";
  antiguedad: any;

  rangoAntiguedad = [
    { label: "Entre 1 y 5 años", range: "1,2,3,4,5" },
    { label: "Entre 6 y 10 años", range: "6,7,8,9,10" },
    { label: "Entre 11 y 15 años", range: "11,12,13,14,15" },
    { label: "Entre 16 y 20 años", range: "16,17,18,19,20" },
    { label: "Mayor a 20", range: "21,22,23,24,25,26,27,28,29" },
]

edad: any;
arl: any;
range: any;
departamento: any;
empresa: Empresa | null;

businessNames = "";
bussinessParner: FormGroup;
jefeNames = " ";
jefeInmediato: FormGroup;
jefeInmediatoName0?:string;
jefeInmediatoName?:string;
nombreSesion?:string
localeES: any = locale_es;

colsActionList!: any[];
epsList!: SelectItem[];
arlList!: SelectItem[];
afpList!: SelectItem[];
prepagadasList!: SelectItem[];
provsaludList!: SelectItem[];
sveOptionList: SelectItem[] = [];
cargoList!: SelectItem[];
cargoActualList!: SelectItem[];
perfilList: SelectItem[] = [];

empleado!: Empleado;




entity: epsorarl = { EPS: [], ARL: [], AFP: [], Medicina_Prepagada: [], Proveedor_de_salud: [] };
tipoIdentificacionList: SelectItem[];
fechaActual: Date = new Date();
yearRange: string = "1900:" + this.fechaActual.getFullYear();
division: string | null = null;

saludLaboralList:any[] = [];
saludLaboralSelect:any

documentacionList:any[] = [{
  fechaSolicitud:new Date(),
  asignacionTarea:'Salud',
  listadoDocSolicitados:'Reportes de enfermedades laborales que el trabajador haya tenido o reportado.',
  responsable:'juanbernal@lerprevencion.com',
  fechaLimiteTarea:new Date(),
  fechaLimiteEnvioDoc:new Date(),
  fechaRealEntregaTareas:new Date(),
  fechaEnvioDoc:new Date(),
  estado:'Enviado'
},
{
  id:1,
  fechaSolicitud:new Date(),
  asignacionTarea:'Salud',
  listadoDocSolicitados:'Información si hay otros trabajadores que realizan la misma labor y hayan tenido notificación de estudio o diagnóstico de enfermedades similares a las estudiadas en el caso de la referencia.',
  responsable:'juanbernal@lerprevencion.com',
  fechaLimiteTarea:new Date(),
  fechaLimiteEnvioDoc:new Date(),
  fechaRealEntregaTareas:new Date(),
  fechaEnvioDoc:new Date(),
  estado:'Enviado'
}
];
documentacionSelect:any

documentacionSubirList:any[] = [{
  id:1,
  fechaSolicitud:new Date(),
  asignacionTarea:'Salud',
  listadoDocSolicitados:'Reportes de enfermedades laborales que el trabajador haya tenido o reportado.',
  solicitante:'harrysongil@lerprevencion.com',
  fechaLimiteTarea:new Date(),
  fechaLimiteEnvioDoc:new Date(),
  fechaRealEntregaTareas:new Date(),
  fechaEnvioDoc:new Date(),
  estado:'Enviado'
},
{
  id:2,
  fechaSolicitud:new Date(),
  asignacionTarea:'Salud',
  listadoDocSolicitados:'Información si hay otros trabajadores que realizan la misma labor y hayan tenido notificación de estudio o diagnóstico de enfermedades similares a las estudiadas en el caso de la referencia.',
  solicitante:'harrysongil@lerprevencion.com',
  fechaLimiteTarea:new Date(),
  fechaLimiteEnvioDoc:new Date(),
  fechaRealEntregaTareas:null,
  fechaEnvioDoc:null,
  estado:'En proceso'
}
];
documentacionSubirSelect:any

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
  { label: "Organización corona", empresa: "Organización corona",nit:"860002688-6" }
]

diagnosticoList: any[] = [];
diagSelect:any;

trazabilidadList: any[] = [{
  id:1,
  accion:'Responsable',
  fecha:new Date(),
  observacion:'marcoacero@lerprevencion.com',
  usuario:'harrysongil@lerprevencion.com',
},
{
  id:2,
  accion:'Rechazado',
  fecha:new Date(),
  observacion:'No corresponde a esta área',
  usuario:'marcoacero@lerprevencion.com',
},
{
  id:3,
  accion:'Responsable',
  fecha:new Date(),
  observacion:'juanbernal@lerprevencion.com',
  usuario:'harrysongil@lerprevencion.com',
},
{
  id:4,
  accion:'Subido',
  fecha:new Date(),
  observacion:'Documento adjuntado',
  usuario:'juanbernal@lerprevencion.com',
}
];
trazabilidadSelect:any;

flag1:boolean=true
flag2:boolean=true
flag3:boolean=true
flag4:boolean=true
flag5:boolean=true
flag6:boolean=true
flag7:boolean=true
flag8:boolean=true
flag9:boolean=true
flag10:boolean=true
flag11:boolean=true
flag12:boolean=true
flag13:boolean=true
flag14:boolean=true
flag15:boolean=true
flag16:boolean=true

responsable1:string=''
responsable2:string=''
responsable3:string=''
responsable4:string=''
responsable5:string=''
responsable6:string=''
responsable7:string=''
responsable8:string=''
responsable9:string=''
responsable10:string=''
responsable11:string=''
responsable12:string=''
responsable13:string=''
responsable14:string=''
responsable15:string=''
responsable16:string=''

dialogRechazoFlag:boolean=false
dialogTrazabilidadFlag:boolean=false
flagDoc:boolean=false
flagDialogCargoActual:boolean=false
cargoActual:string=''




  async ngOnInit() {
    let primerNombre=(this.sesionService.getEmpleado())?(this.sesionService.getEmpleado()!.primerNombre?this.sesionService.getEmpleado()!.primerNombre:''):''
        let segundoNombre=(this.sesionService.getEmpleado())?(this.sesionService.getEmpleado()!.segundoNombre?this.sesionService.getEmpleado()!.segundoNombre:''):''
        let primerApellido=(this.sesionService.getEmpleado())?(this.sesionService.getEmpleado()!.primerApellido?this.sesionService.getEmpleado()!.primerApellido:''):''
        let segundoApellido=(this.sesionService.getEmpleado())?(this.sesionService.getEmpleado()!.segundoApellido?this.sesionService.getEmpleado()!.segundoApellido:''):''
        this.nombreSesion=primerNombre+' '+segundoNombre+' '+primerApellido+' '+segundoApellido

        this.config.setTranslation(this.localeES);
        this.colsActionList = [
            { field: 'status', header: 'Estado' },
            { field: 'recomendaciones', header: 'Nombre de la recomendacion' },
            { field: 'fechaExpiracion', header: 'Fecha Finalizacion' }
        ];


        await this.comunService.findAllAfp().then((data) => {
            this.afpList = [];
            this.afpList.push({ label: "--Seleccione--", value: null });
            (<Afp[]>data).forEach((afp) => {
                this.afpList.push({ label: afp.nombre, value: afp.id });
            });
            this.entity.AFP = this.afpList;

        });

        await this.comunService.findAllEps().then((data) => {
            this.epsList = [];
            this.epsList.push({ label: "--Seleccione--", value: null });
            (<Eps[]>data).forEach((eps) => {
                this.epsList.push({ label: eps.nombre, value: eps.id });

            });
            this.entity.EPS = this.epsList;
        });

        await this.comunService.findAllArl().then((data) => {
            this.arlList = [];
            this.arlList.push({ label: "--Seleccione--", value: null });
            (<Arl[]>data).forEach((arl) => {
                this.arlList.push({ label: arl.nombre, value: arl.id });
            });
            this.entity.ARL = this.arlList;
        });

        await this.comunService.findAllPrepagadas().then((data) => {
            this.prepagadasList = [];
            this.prepagadasList.push({ label: "--Seleccione--", value: null });
            (<Prepagadas[]>data).forEach((prepagadas) => {
                this.prepagadasList.push({ label: prepagadas.nombre, value: prepagadas.id });
            });
            this.entity.Medicina_Prepagada = this.prepagadasList;
        });

        await this.comunService.findAllProvSalud().then((data) => {
            this.provsaludList = [];
            this.provsaludList.push({ label: "--Seleccione--", value: null });
            (<Proveedor[]>data).forEach((prov) => {
                this.provsaludList.push({ label: prov.nombre, value: prov.id });
            });
            this.entity.Proveedor_de_salud = this.provsaludList;
        });

        let cargofiltQuery = new FilterQuery();
        cargofiltQuery.sortOrder = SortOrder.ASC;
        cargofiltQuery.sortField = "nombre";
        cargofiltQuery.fieldList = ["id", "nombre"];
        this.cargoService.findByFilter(cargofiltQuery).then((resp: any) => {
            this.cargoList = [];
            this.cargoList.push({ label: '--Seleccione--', value: null });
            (<Cargo[]>resp['data']).forEach((cargo) => {
                this.cargoList.push({ label: cargo.nombre, value: cargo.id });
            });
        });

        await this.perfilService.findAll().then((resp: any) => {
            (<Perfil[]>resp["data"]).forEach((perfil) => {
                this.perfilList.push({ label: perfil.nombre, value: perfil.id });
            });
            if (this.isUpdate === true || this.show === true)
                setTimeout(() => {
                    this.buildPerfilesIdList();
                }, 500);
        });
        this.getArea()
        this.getCargoActual()
  }
  constructor(
    private empleadoService: EmpleadoService,
    private empresaService: EmpresaService,
    private sesionService: SesionService,
    private perfilService: PerfilService,
    private comunService: ComunService,
    private cargoService: CargoService,
    private cargoActualService: CargoActualService,
    private config: PrimeNGConfig,
    private areaService: AreaService,
    private areaMatrizService: AreaMatrizService,
    private procesoMatrizService: ProcesoMatrizService,
    private messageService: MessageService,
    private confirmService: ConfirmService,

    fb: FormBuilder,
  ){
    this.empresa = this.sesionService.getEmpresa();
    let defaultItem = <SelectItem[]>[{ label: "--seleccione--", value: null }];
    this.tipoIdentificacionList = defaultItem.concat(<SelectItem[]>tipo_identificacion);

    this.empleadoForm = fb.group({
      'id': [null],
      'primerNombre': [null, Validators.required],
      'segundoNombre': null,
      'primerApellido': [null, Validators.required],
      'segundoApellido': null,
      'codigo': [null],
      'direccion': [null],
      'fechaIngreso': [null, Validators.required],
      'fechaNacimiento': [null],
      'genero': [null],
      'numeroIdentificacion': [null, Validators.required],
      'telefono1': [null],
      'telefono2': [null],
      'afp': [null],
      'emergencyContact': [null],
      "corporativePhone": [null],
      'phoneEmergencyContact': [null],
      'emailEmergencyContact': [null],
      'ccf': [null],
      'ciudad': [null],
      'eps': [null],
      'arl': [null],
      'tipoIdentificacion': [null, Validators.required],
      'tipoVinculacion': [null],
      'zonaResidencia': [null],
      'area': [null, Validators.required],
      'localidad': [null, Validators.required],
      'cargoId': [null, Validators.required],
      'perfilesId': [null, Validators.required],
      'email': [{ value: "", disabled: true }, Validators.required],
      direccionGerencia: [null],
      regional: [null],
      businessPartner: [null],
      jefeInmediato: [null],
      correoPersonal: [null],
      ciudadGerencia: [null],
      division: [null],
    });
    this.empresaForm = fb.group({            
      empresa:[null, Validators.required],
      nit:[null, Validators.required],
    }); 
    this.bussinessParner = fb.group({
      id: ["", Validators.required],
      numeroIdentificacion: ["", Validators.required],
      primerNombre: [{ value: "", disabled: true }, Validators.required],
      segundoNombre: { value: "", disabled: true },
      email: { value: "", disabled: true },
      corporativePhone: [{ value: "", disabled: true }],
      cargoId: [{ value: "", disabled: true }, Validators.required],
      direccionGerencia: [{ value: " ", disabled: true }]
  
    });
    this.jefeInmediato = fb.group({
      id: ["", Validators.required],
      numeroIdentificacion: ["", Validators.required],
      primerNombre: [null],
      segundoNombre: [null],
      primerApellido: [null],
      segundoApellido: [null],
      email: { value: "", disabled: true },
      corporativePhone: [{ value: "", disabled: true }],
      cargoId: [{ value: "", disabled: true }, Validators.required],
      direccionGerencia: [{ value: "", disabled: true }]

    });
  }
  listDivision:any=[]
  async getArea(){
    let filterAreaQuery = new FilterQuery();
    filterAreaQuery.sortField = "id";
    filterAreaQuery.sortOrder = -1;
    filterAreaQuery.fieldList = ["id","nombre"];
    filterAreaQuery.filterList = [
      { field: 'nivel', criteria: Criteria.EQUALS, value1: '0' },
    ];

    await this.areaService.findByFilter(filterAreaQuery).then((resp:any)=>{
      resp.data.forEach((resp2:any) => {
        this.listDivision.push({label:resp2.nombre,value:resp2.id})
      });
    })
  }

  localidadesList:any=[]
  localidadesListActual:any=[]
  async cargarPlantaLocalidad(eve:any,tipo:string){
    let filterPlantaQuery = new FilterQuery();
    filterPlantaQuery.sortField = "id";
    filterPlantaQuery.sortOrder = -1;
    filterPlantaQuery.fieldList = ["id","localidad"];
    filterPlantaQuery.filterList = [
      { field: 'plantas.area.id', criteria: Criteria.EQUALS, value1: eve.toString() },
    ];
    let localidadesList:any=[]
    await this.empresaService.getLocalidadesRWithFilter(filterPlantaQuery).then((resp:any)=>{
      resp.data.forEach((element:any) => {
        localidadesList.push({label:element.localidad,value:element.id})
      });
    })
    if(tipo=='Origen')this.localidadesList=[...localidadesList]
    else this.localidadesListActual=[...localidadesList]
  }
  areaList:any
  areaListActual:any
  async cargarArea(eve:any,tipo:string){
    let filterArea = new FilterQuery();
    filterArea.fieldList= [
      'id',
      'nombre'
    ];
    filterArea.filterList = [{ field: 'localidad.id', criteria: Criteria.EQUALS, value1: eve},
      { field: 'eliminado', criteria: Criteria.EQUALS, value1: false}];
    let areaList:any=[]
    await this.areaMatrizService.findByFilter(filterArea).then(async (resp:any)=>{
      resp.data.forEach((element:any) => {
        areaList.push({label:element.nombre,id:element.ID})
      });
    })
    if(tipo=='Origen')this.areaList=[...areaList]
    else this.areaListActual=[...areaList]
  }

  procesoList:any
  procesoListActual:any
  async cargarProceso(eve:any,tipo:string){
    let filterProceso = new FilterQuery();
    filterProceso.fieldList= [
        'id',
        'nombre'
      ];
    filterProceso.filterList = [{ field: 'areaMatriz.id', criteria: Criteria.EQUALS, value1:eve},
    { field: 'eliminado', criteria: Criteria.EQUALS, value1: false}];
    let procesoList:any=[]
    await this.procesoMatrizService.findByFilter().then(async (resp:any)=>{
      resp.data.forEach((element:any) => {
        procesoList.push({label:element.nombre,id:element.id})
      });
    })
    if(tipo=='Origen')this.procesoList=[...procesoList]
    else this.procesoListActual=[...procesoList]
  }

  buscarEmpleado(event: any) {
    this.empleadoService
        .buscar(event.query)
        .then((data) => (this.empleadosList = <Empleado[]>data));
}

async onSelection(event: any) {
  this.value = event;
  this.empleadoSelect = null;
  let emp = <Empleado>this.value;
  this.empleadoSelect = emp;
  this.empresaForm!.reset()
  if(this.empleadoSelect){
      this.empresaForm!.value.nit = this.empleadoSelect.nit
      this.empresaForm!.value.empresa = {label:this.empleadoSelect.empresa, empresa:this.empleadoSelect.empresa, nit:this.empleadoSelect.nit}
      this.empresaSelect2 = this.empresaForm!.value.empresa
  }
  this.loaded = true;
  this.nameAndLastName = (this.empleadoSelect.primerApellido || "") + " " + (this.empleadoSelect.segundoApellido || "") + " " + (this.empleadoSelect.primerNombre || "") + " " + (this.empleadoSelect.segundoNombre || " ");
  let fecha = moment(this.empleadoSelect.fechaIngreso);
  let fechaNacimiento = moment(this.empleadoSelect.fechaNacimiento);
  let antigueMoment = fecha.diff(moment.now(), "years") * -1;
  this.antiguedad = ` ${antigueMoment} Años`;
  if (antigueMoment === 0) {
      this.range = 'Menor a 1 año'
  }

  for (let j = 0; j < this.rangoAntiguedad.length; j++) {
      let subArray = this.rangoAntiguedad[j].range.split(',')
      let a = subArray.find(range => range === antigueMoment.toString())

      if(a) {
          this.range = this.rangoAntiguedad[j].label;
      }
  }

  this.edad = `${fechaNacimiento.diff(moment.now(), "year") * -1} Años`;
  this.arl = this.empresa?.arl == null ? null : this.empresa.arl.nombre;

  this.departamento = this.empleadoSelect.area.id;

  if (this.empleadoSelect.businessPartner) {
      this.onSelectionBP(this.empleadoSelect.businessPartner)
  }

  if (this.empleadoSelect.jefeInmediato) {
      this.onSelectionJefeInmediato(this.empleadoSelect.jefeInmediato);
      this.jefeInmediatoName=this.jefeInmediatoName0
  }

  await this.usuarioPermisos()
  this.empleadoForm.patchValue({
      'id': this.empleadoSelect.id,
      'primerNombre': this.empleadoSelect.primerNombre,
      'segundoNombre': this.empleadoSelect.segundoNombre,
      'primerApellido': this.empleadoSelect.primerApellido,
      'segundoApellido': this.empleadoSelect.segundoApellido,
      'codigo': this.empleadoSelect.codigo,
      'direccion': this.empleadoSelect.direccion,
      'fechaIngreso': this.empleadoSelect.fechaIngreso == null ? null : new Date(this.empleadoSelect.fechaIngreso),
      'fechaNacimiento': this.empleadoSelect.fechaNacimiento == null ? null : new Date(this.empleadoSelect.fechaNacimiento),
      'genero': this.empleadoSelect.genero,
      'numeroIdentificacion': this.empleadoSelect.numeroIdentificacion,
      'telefono1': this.empleadoSelect.telefono1,
      'telefono2': this.empleadoSelect.telefono2,
      'afp': this.empleadoSelect.afp == null ? null : this.empleadoSelect.afp.id,
      'ciudad': this.empleadoSelect.ciudad,
      'eps': this.empleadoSelect.eps == null ? null : this.empleadoSelect.eps.id,
      'tipoIdentificacion': this.empleadoSelect.tipoIdentificacion == null ? null : this.empleadoSelect.tipoIdentificacion.id,
      'tipoVinculacion': this.empleadoSelect.tipoVinculacion,
      'zonaResidencia': this.empleadoSelect.zonaResidencia,
      'area': this.empleadoSelect.area,
      'cargoId': this.empleadoSelect.cargo.id,
      'perfilesId': this.usuarioP,
      "corporativePhone": this.empleadoSelect.corporativePhone,
      "emergencyContact": this.empleadoSelect.emergencyContact,
      "phoneEmergencyContact": this.empleadoSelect.phoneEmergencyContact,
      "emailEmergencyContact": this.empleadoSelect.emailEmergencyContact,
      direccionGerencia: this.empleadoSelect.direccionGerencia,
      regional: this.empleadoSelect.regional,
      correoPersonal: this.empleadoSelect.correoPersonal,
      ciudadGerencia: this.empleadoSelect.ciudadGerencia,
      // division: this.empleadoSelect.area['padreNombre'],
      division: this.empleadoSelect.area.areaPadre?.nombre,
      'email': [this.empleadoSelect.usuario.email],
  });
  setTimeout(() => {
      this.empleadoForm.patchValue({
          'ciudad': this.empleadoSelect!.ciudad,
      })
  }, 2000);

  this.empresaForm?.patchValue({
      'nit':this.empleadoSelect.nit,
      'empresa':{label:this.empleadoSelect.empresa, empresa:this.empleadoSelect.empresa, nit:this.empleadoSelect.nit}
  });

}

onSelectionBP(event: any) {
  let empleado = <Empleado>event;
  this.businessNames = (empleado.primerApellido || "") + " " + (empleado.segundoApellido || "") + " " + (empleado.primerNombre || "") + " " + (empleado.segundoNombre || " ");
  this.empleadoForm.patchValue({ businessPartner: empleado.id })
  this.bussinessParner.patchValue({
      id: empleado.id,
      primerNombre: empleado.primerNombre,
      primerApellido: empleado.primerApellido,
      numeroIdentificacion: empleado.numeroIdentificacion,
      corporativePhone: empleado.corporativePhone,
      area: empleado.area,
      correoPersonal: empleado.correoPersonal,
      cargoId: empleado.cargo.id,
      direccionGerencia: empleado.direccionGerencia,
      email: [empleado.usuario.email],
  });
}

onSelectionJefeInmediato(event: any) {
  let empleado = <Empleado>event;
  this.jefeNames = (empleado.primerApellido || "") + " " + (empleado.segundoApellido || "") + " " + (empleado.primerNombre || "") + " " + (empleado.segundoNombre || " ");
  this.empleadoForm.patchValue({ jefeInmediato: empleado.id })
  this.jefeInmediato.patchValue({
      id: empleado.id,
      primerNombre: empleado.primerNombre,
      segundoNombre: empleado.segundoNombre,
      primerApellido: empleado.primerNombre,
      segundoApellido: empleado.segundoApellido,
      numeroIdentificacion: empleado.numeroIdentificacion,
      corporativePhone: empleado.corporativePhone,
      area: empleado.area,
      direccionGerencia: empleado.direccionGerencia,
      correoPersonal: empleado.correoPersonal,
      cargoId: empleado.cargo.id,
      email: [empleado.usuario.email],
  });
  this.jefeInmediatoName0=(empleado.primerNombre || "") + " " + (empleado.segundoNombre || "") + " " + (empleado.primerApellido || "") + " " + (empleado.segundoApellido || " ")
}
  usuarioP: any;
  async usuarioPermisos() {
      this.usuarioP = [];
      let filterQuery = new FilterQuery();
      filterQuery.filterList = [
          {
              field: "usuarioEmpresaList.usuario.id",
              criteria: Criteria.EQUALS,
              value1: this.empleadoSelect?.usuario.id,
          },
      ];
      await this.perfilService.findByFilter(filterQuery).then((resp: any) => {
          resp["data"].forEach((ident: any) => {
              this.usuarioP.push(ident.id);
          });
      });
  }
  async buildPerfilesIdList() {

    let filterQuery = new FilterQuery();
    filterQuery.filterList = [
        {
            field: "usuarioEmpresaList.usuario.id",
            criteria: Criteria.EQUALS,
            value1: this.empleadoSelect?.usuario.id,
            value2: null,
        },
    ];
    this.perfilService.update;
    await this.perfilService.findByFilter(filterQuery).then((resp: any) => {
        let perfilesId: any = [];
        resp["data"].forEach((ident: any) => perfilesId.push(ident.id));
        this.empleadoForm.patchValue({ perfilesId: perfilesId });
    });
  }
  areaChange(event: any) {
    this.division = event;
    this.empleadoForm.patchValue({ division: this.division })
  }

  // async listadoLocalidades(event:any){
  //   let filterLocalidad = new FilterQuery();
  //   filterLocalidad.fieldList = [
  //       'id',
  //       'localidad'
  //   ];
  //   filterLocalidad.filterList = [{ field: 'plantas.area.padreNombre', criteria: Criteria.EQUALS, value1: event}];
  //   this.localidadesList=[]
  //   await this.empresaService.getLocalidadesRWithFilter(filterLocalidad).then((ele:any)=>{
  //       for(let loc of ele.data){
  //         this.localidadesList.push({label:loc.localidad,value:loc.id})
  //     }
  //   }).catch((er:any)=>console.error(er))
  // }

  flagSaludLaboralRegistro:boolean=false
  modalDianostico = false;
  modifyDiag: boolean = false;
  itemInPCL: boolean = false;
  listaPCL: any;



  createCaso(){
    this.flagSaludLaboralRegistro=true
  }

  showModalDiagnostico() {
    this.modalDianostico = true;
    this.modifyDiag = true;
  }

  

async onCloseModalDianostico() {
  this.modalDianostico = false;
  this.diagSelect = null;
}
closeModalDiagnostico() {
  this.modalDianostico = false;
  this.diagSelect = null;
  this.modifyDiag = false;
}
tipoResponsable:any[]= [
  {label:'GH Admon personal',value:0},
  {label:'Seguridad',value:1},
  {label:'Salud',value:2},
];

selectResponsable:any=[]
flagUpload1:boolean=false
flagUpload2:boolean=false
flagUpload3:boolean=false
flagUpload4:boolean=false
flagUpload5:boolean=false
flagUpload6:boolean=false
flagUpload7:boolean=false
flagUpload8:boolean=false
flagUpload9:boolean=false
flagUpload10:boolean=false
flagUpload11:boolean=false
flagUpload12:boolean=false
flagUpload13:boolean=false
flagUpload14:boolean=false
flagUpload15:boolean=false
flagUpload16:boolean=false

  selectResonsable(eve:any,key:string){
    switch (key) {
      case 'res1':
        this.responsable1=eve.numeroIdentificacion
        break;
      case 'res2':
        this.responsable2=eve.numeroIdentificacion
        break;
      case 'res3':
        this.responsable3=eve.numeroIdentificacion
        break;
      case 'res4':
        this.responsable4=eve.numeroIdentificacion
        break;
      case 'res5':
        this.responsable5=eve.numeroIdentificacion
        break;
      case 'res6':
        this.responsable6=eve.numeroIdentificacion
        break;
      case 'res7':
        this.responsable7=eve.numeroIdentificacion
        break;
      case 'res8':
        this.responsable8=eve.numeroIdentificacion
        break;
      case 'res9':
        this.responsable9=eve.numeroIdentificacion
        break;
      case 'res10':
        this.responsable10=eve.numeroIdentificacion
        break;
      case 'res11':
        this.responsable11=eve.numeroIdentificacion
        break;
      case 'res12':
        this.responsable12=eve.numeroIdentificacion
        break;
      case 'res13':
        this.responsable13=eve.numeroIdentificacion
        break;
      case 'res14':
        this.responsable14=eve.numeroIdentificacion
        break;
      case 'res15':
        this.responsable15=eve.numeroIdentificacion
        break;
      case 'res16':
        this.responsable16=eve.numeroIdentificacion
        break;
      default:
        break;
    }
  }
  crearCargoActual(){
    let cargo = new CargoActual()
    cargo.nombre=this.cargoActual.toUpperCase();
    this.cargoActualService.create(cargo).then((resp:any)=>{
      console.log(resp)
      this.cargoActualList.push({label:resp.nombre,value:resp.id})
    }).catch(er=>console.log(er))
    this.flagDialogCargoActual=false
    this.cargoActual='' 
  }

  getCargoActual(){
    let cargoActualfiltQuery = new FilterQuery();
    cargoActualfiltQuery.sortOrder = SortOrder.ASC;
    cargoActualfiltQuery.sortField = "nombre";
    cargoActualfiltQuery.fieldList = ["id", "nombre"];
    cargoActualfiltQuery.filterList=[]
    cargoActualfiltQuery.filterList.push({ field: 'empresa.id', criteria: Criteria.EQUALS, value1: this.empresa?.id?.toString()});
    this.cargoActualService.getcargoRWithFilter(cargoActualfiltQuery).then((resp:any)=>{
      this.cargoActualList=[]
      resp.data.forEach((ele:any) => {
        this.cargoActualList.push({label:ele.nombre,value:ele.id})
      });
    })
  }
}
interface empresaNit{
  label: string;
  empresa: string | null;
  nit: string | null;
 }
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Reporte } from 'src/app/website/pages/comun/entities/reporte'
import { ReporteService } from 'src/app/website/pages/core/services/reporte.service'
import { TestigoReporte } from 'src/app/website/pages/comun/entities/testigo-reporte'
import { SelectItem } from 'primeng/api'
import { Area } from 'src/app/website/pages/empresa/entities/area'
import {
    tipo_vinculacion,
    jornada_trabajo,
    tipo_identificacion,
    tipo_identificacion_empresa,
    sitio,
    tipo_lesion,
    parte_cuerpo,
    agente,
    mecanismo,
    lugar,
    tipoAccidente,
    locale_es,
    severidad,
} from 'src/app/website/pages/comun/entities/reporte-enumeraciones';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { EmpresaService } from 'src/app/website/pages/empresa/services/empresa.service';
import { Empresa } from 'src/app/website/pages/empresa/entities/empresa';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query'
import { Criteria, Filter } from 'src/app/website/pages/core/entities/filter';
import { EmpleadoService } from 'src/app/website/pages/empresa/services/empleado.service'
import { Empleado } from 'src/app/website/pages/empresa/entities/empleado'
import { PrimeNGConfig } from 'primeng/api';
import { Localidades } from 'src/app/website/pages/ctr/entities/aliados';
import { RadioButtonClickEvent } from 'primeng/radiobutton';
import { AreaService } from 'src/app/website/pages/empresa/services/area.service';
import { Session } from '../../../../core/entities/session';
import { Ciudad } from 'src/app/website/pages/comun/entities/ciudad';

@Component({
  selector: 's-form-accidente',
  templateUrl: './formulario-accidente.component.html',
  styleUrls: ['./formulario-accidente.component.scss']
})
export class FormularioAccidenteComponent implements OnInit, AfterViewInit {
    reporte?: Reporte;
  @Input('reporte') 
  set inreporte(reporte: Reporte){
    this.reporte=reporte
    this.cargarDatos()
  };
  @Input('consultar') consultar?: boolean;
  @Input('modificar') modificar?: boolean;
  @Input('adicionar') adicionar?: boolean;
  @Output('onSave') onSave = new EventEmitter<Reporte>();
  fechaActual = new Date();
  yearRange: string = '1900:' + this.fechaActual.getFullYear();
  tipoVinculacionList?: SelectItem[];
  jornadaTrabajoList?: SelectItem[];
  tipoIdentificacion?: SelectItem[];
  tipoIdentificacionEmpresa?: SelectItem[];
  sitioList?: SelectItem[];
  tipoLesionList?: SelectItem[];
  severidadList?: SelectItem[];
  parteCuerpoList?: SelectItem[];
  agenteList?: SelectItem[];
  mecanismoList?: SelectItem[];
  lugarList?: SelectItem[];
  tipoAccidenteList?: SelectItem[];
  localeES = locale_es;
  form?: FormGroup;
  testigoReporteList?: TestigoReporte[];
  visibleCamposAccidente?: boolean;
  idEmpresa?: string | null;
  fechaIngreso?:Date;
  fechaAccidente?:Date;
  deltaFecha?:Date;
  deltaDia?:number;
  deltaMes?:number;
  empleadoSelect?: Empleado;
  localidadList?: any[];
  mostrarDialogLocalidades: boolean = false;
  filtroLocalidades: string|null = null;
  tienePermisocamex: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private reporteService: ReporteService,
    private empresaService: EmpresaService,
    private areaService: AreaService,
    private sesionService: SesionService,
    private empleadoService: EmpleadoService,
    private config: PrimeNGConfig
  ) { 
    let defaultItem = <SelectItem[]>[{ label: '--seleccione--', value: null }];
    this.tipoVinculacionList = defaultItem.concat(<SelectItem[]>tipo_vinculacion);
    this.jornadaTrabajoList = defaultItem.concat(<SelectItem[]>jornada_trabajo);
    this.tipoIdentificacion = defaultItem.concat(<SelectItem[]>tipo_identificacion);
    this.tipoIdentificacionEmpresa = defaultItem.concat(<SelectItem[]>tipo_identificacion_empresa);
    this.severidadList = defaultItem.concat(<SelectItem[]>severidad);
    this.sitioList = defaultItem.concat(<SelectItem[]>sitio);
    this.tipoLesionList = defaultItem.concat(<SelectItem[]>tipo_lesion);
    this.parteCuerpoList = defaultItem.concat(<SelectItem[]>parte_cuerpo);
    this.agenteList = defaultItem.concat(<SelectItem[]>agente);
    this.mecanismoList = defaultItem.concat(<SelectItem[]>mecanismo);
    this.lugarList = defaultItem.concat(<SelectItem[]>lugar);
    this.tipoAccidenteList = defaultItem.concat(<SelectItem[]>tipoAccidente);

    this.tienePermisocamex = this.sesionService.getPermisosMap()['ADM_GET_CAMEX'];
      
  }
    ngAfterViewInit(): void {
        this.idEmpresa = this.sesionService.getEmpresa()?.id;
        this.form?.patchValue({
            ciudadEmpleado: this.reporte?.ciudadEmpleado,
            ciudadAccidente: this.reporte?.ciudadAccidente,
        })
    }

  ngOnInit(): void {
    this.config.setTranslation(this.localeES);
    this.idEmpresa = this.sesionService.getEmpresa()?.id;
        

    this.visibleCamposAccidente = this.reporte?.tipo?.includes('ACCIDENTE');
    this.cdRef.detectChanges();
    // this.cargarLocalidades();
  }

  flagLocalidades:boolean=false
  cargarDatos(){
    this.flagLocalidades=false
    if(this.reporte)
        if(this.reporte.fechaIngresoEmpleado != null && this.reporte.fechaAccidente != null){
            this.fechaIngreso=new Date(this.reporte.fechaIngresoEmpleado)
            this.fechaAccidente=new Date(this.reporte.fechaAccidente)
            this.deltaFecha=new Date(this.fechaAccidente.getTime()-this.fechaIngreso.getTime())
            this.reporte.mesesLaborHabitual=(this.deltaFecha.getMonth())+12*(this.deltaFecha.getFullYear()-1970);
            this.reporte.diasLaborHabitual=(this.deltaFecha.getDate()==31)?0:this.deltaFecha.getDate();
            if(this.reporte.mesesLaborHabitual<0){
                this.reporte.mesesLaborHabitual=0;
                this.reporte.diasLaborHabitual=0;
            }
        }else{
            this.reporte.diasLaborHabitual=null
            this.reporte.mesesLaborHabitual=null
        }

        this.infoEmpresa()
        this.form = this.fb.group({
            id: this.reporte?.id,
            tipo: this.reporte?.tipo,
            nombreEps: this.reporte?.nombreEps,
            codigoEps: this.reporte?.codigoEps,
            nombreAfp: this.reporte?.nombreAfp,
            codigoAfp: this.reporte?.codigoAfp,
            nombreArl: this.reporte?.nombreArl,
            codigoArl: this.reporte?.codigoArl,
            tipoVinculador: this.reporte?.tipoVinculador,
            nombreCiiu: this.reporte?.nombreCiiu,
            codigoCiiu: this.reporte?.codigoCiiu,
            razonSocial: this.reporte?.razonSocial,
            tipoIdentificacionEmpresa: this.reporte?.tipoIdentificacionEmpresa,
            identificacionEmpresa: this.reporte?.identificacionEmpresa,
            direccionEmpresa: this.reporte?.direccionEmpresa,
            telefonoEmpresa: this.reporte?.telefonoEmpresa,
            telefono2Empresa: this.reporte?.telefono2Empresa,
            emailEmpresa: this.reporte?.emailEmpresa,
            zonaEmpresa: this.reporte?.zonaEmpresa,
            centrTrabIgualSedePrinc: this.reporte?.centrTrabIgualSedePrinc,
            nombreCentroTrabajo: this.reporte?.nombreCentroTrabajo,
            codigoCentroTrabajo: this.reporte?.codigoCentroTrabajo,
            nombreCiiuCentroTrabajo: this.reporte?.nombreCiiuCentroTrabajo,
            ciiuCentroTrabajo: this.reporte?.ciiuCentroTrabajo,
            codCiiuCentroTrabajo: this.reporte?.codCiiuCentroTrabajo,
            direccionCentroTrabajo: this.reporte?.direccionCentroTrabajo,
            telefonoCentroTrabajo: this.reporte?.telefonoCentroTrabajo,
            zonaCentroTrabajo: this.reporte?.zonaCentroTrabajo,
            tipoVinculacion: this.reporte?.tipoVinculacion,
            codigoTipoVinculacion: this.reporte?.codigoTipoVinculacion,
            primerApellidoEmpleado: this.reporte?.primerApellidoEmpleado,
            segundoApellidoEmpleado: this.reporte?.segundoApellidoEmpleado,
            primerNombreEmpleado: this.reporte?.primerNombreEmpleado,
            segundoNombreEmpleado: this.reporte?.segundoNombreEmpleado,
            tipoIdentificacionEmpleado: this.reporte?.tipoIdentificacionEmpleado,
            numeroIdentificacionEmpleado: this.reporte?.numeroIdentificacionEmpleado,
            fechaNacimientoEmpleado: this.reporte?.fechaNacimientoEmpleado == null ? null : new Date(this.reporte.fechaNacimientoEmpleado),
            generoEmpleado: this.reporte?.generoEmpleado,
            direccionEmpleado: this.reporte?.direccionEmpleado,
            emailEmpleado: this.reporte?.emailEmpleado,//usuario.email
            telefonoEmpleado: this.reporte?.telefonoEmpleado,
            telefono2Empleado: this.reporte?.telefono2Empleado,
            fechaIngresoEmpleado: this.reporte?.fechaIngresoEmpleado == null ? null : new Date(this.reporte.fechaIngresoEmpleado),
            zonaEmpleado: this.reporte?.zonaEmpleado,
            cargoEmpleado: this.reporte?.cargoEmpleado,
            ocupacionHabitual: this.reporte?.ocupacionHabitual,
            codigoOcupacionHabitual: this.reporte?.codigoOcupacionHabitual,
            // diasLaborHabitual: this.deltaDia,
            // mesesLaborHabitual: this.deltaMes,
            diasLaborHabitual:this.reporte?.diasLaborHabitual,
            mesesLaborHabitual:this.reporte?.mesesLaborHabitual,
            salario: this.reporte?.salario,
            jornadaHabitual: this.reporte?.jornadaHabitual,
            fechaAccidente: this.reporte?.fechaAccidente == null ? null : new Date(this.reporte.fechaAccidente),
            horaAccidente: this.reporte?.horaAccidente == null ? null : new Date(this.reporte.horaAccidente),
            numerofurat: this.reporte?.numerofurat,
            jornadaAccidente: this.reporte?.jornadaAccidente,
            realizandoLaborHabitual: this.reporte?.realizandoLaborHabitual,
            nombreLaborHabitual: this.reporte?.nombreLaborHabitual,
            codigoLaborHabitual: this.reporte?.codigoLaborHabitual,
            horaInicioLabor:  this.reporte?.horaInicioLabor == null ? null : new Date(this.reporte.horaInicioLabor),
            tipoAccidente: this.reporte?.tipoAccidente,
            causoMuerte: this.reporte?.causoMuerte,
            zonaAccidente: this.reporte?.zonaAccidente,
            lugarAccidente: this.reporte?.lugarAccidente,
            huboTestigos: this.reporte?.huboTestigos,
            descripcion: this.reporte?.descripcion,
            sitio: this.reporte?.sitio,
            cualSitio: this.reporte?.cualSitio,
            tipoLesion: this.reporte?.tipoLesion,
            cualTipoLesion: this.reporte?.cualTipoLesion,
            parteCuerpo: this.reporte?.parteCuerpo,
            agente: this.reporte?.agente,
            cualAgente: this.reporte?.cualAgente,
            mecanismo: this.reporte?.mecanismo,
            cualMecanismo: this.reporte?.cualMecanismo,
            ciudadEmpresa: this.reporte?.ciudadEmpresa,
            ciudadCentroTrabajo: this.reporte?.ciudadCentroTrabajo,
            ciudadEmpleado: this.reporte?.ciudadEmpleado,
            ciudadAccidente: this.reporte?.ciudadAccidente,
            severidad:this.reporte?.severidad,
            areaAccidente: this.reporte?.areaAccidente,
            usuarioReporta: this.reporte?.usuarioReporta,
            empresa: this.reporte?.empresa,
            nombresResponsable: this.reporte?.nombresResponsable,
            apellidosResponsable: this.reporte?.apellidosResponsable,
            tipoIdentificacionResponsable: this.reporte?.tipoIdentificacionResponsable,
            numeroIdentificacionResponsable: this.reporte?.numeroIdentificacionResponsable,
            cargoResponsable: this.reporte?.cargoResponsable,
            fechaReporte: this.reporte?.fechaReporte == null ? null : new Date(this.reporte.fechaReporte),
            // ciudadEmpleado2: this.reporte?.ciudadEmpleado
            localidad:(this.reporte?.localidad)?this.reporte?.localidad?.id:null
           
        });


        setTimeout(async () => {
            this.form?.patchValue({
                ciudadEmpleado: this.reporte?.ciudadEmpleado,
                ciudadAccidente: this.reporte?.ciudadAccidente,
            })

            if(this.idEmpresa=='22' || this.idEmpresa == '508')await this.listadoLocalidades(this.form?.value.areaAccidente.padreNombre)

        }, 2000);
        

        if(this.reporte)
        if (this.reporte.testigoReporteList != null) {
            this.testigoReporteList = [];
            for (let i = 0; i < this.reporte.testigoReporteList.length; i++) {
                let reporte = this.reporte.testigoReporteList[i];
                reporte.codigo = i;
                this.testigoReporteList.push(reporte);
            }
            this.testigoReporteList = this.testigoReporteList.slice();
        }
  }

  async infoEmpresa() {

    let empresa = await this.empresaService.findSelected() as Empresa;
    
    this.form?.patchValue({
        tipoIdentificacionEmpresa: "NI",
        direccionEmpresa: empresa.direccion,
        telefonoEmpresa: empresa.telefono,
        emailEmpresa: empresa.email
    })

  }

  onSubmit() {
    let reporte = <Reporte>this.form?.value;
    reporte.testigoReporteList = this.testigoReporteList;
    let localidades: Localidades = {} as Localidades;
    localidades.id=this.form?.value.localidad
    reporte.localidad=localidades
    
    if (this.adicionar) {
        this.reporteService.create(reporte).then(
            data => {
                this.onSave.emit(<Reporte>data)
            }

        );
    } else if (this.modificar) {
        this.reporteService.update(reporte).then(
            data => this.onSave.emit(<Reporte>data)
        );
    }
  }

  changeCalendar(){
    if(this.form && this.reporte)
    if((this.form.value.fechaIngresoEmpleado != null && this.form.value.fechaAccidente != null)){
            this.fechaIngreso=new Date(this.form.value.fechaIngresoEmpleado)
            this.fechaAccidente=new Date(this.form.value.fechaAccidente)
            this.deltaFecha=new Date(this.fechaAccidente.getTime()-this.fechaIngreso.getTime())
            this.reporte.mesesLaborHabitual=(this.deltaFecha.getMonth())+12*(this.deltaFecha.getFullYear()-1970);
            this.reporte.diasLaborHabitual=(this.deltaFecha.getDate()==31)?0:this.deltaFecha.getDate();
            if(this.reporte.mesesLaborHabitual<0){
                this.reporte.mesesLaborHabitual=0;
                this.reporte.diasLaborHabitual=0;
            }
            this.form.patchValue({
                diasLaborHabitual: this.reporte.diasLaborHabitual,
                mesesLaborHabitual: this.reporte.mesesLaborHabitual,
            });
        }
    }

    adicionarTestigo() {
        if (this.testigoReporteList == null) {
            this.testigoReporteList = [];
        }
        let testigo = new TestigoReporte();
        testigo.codigo = this.testigoReporteList.length;
        this.testigoReporteList.push(testigo);
        this.testigoReporteList = this.testigoReporteList.slice();
    }

    removerTestigo(testigo: TestigoReporte) {
        if (this.testigoReporteList)
            for (let i = 0; i < this.testigoReporteList.length; i++) {
                if (this.testigoReporteList[i].codigo === testigo.codigo) {
                    this.testigoReporteList.splice(i, 1);
                    this.testigoReporteList = this.testigoReporteList.slice();
                    break;
                }
            }
    }
    async listadoLocalidades(event:any){
        let filterArea = new FilterQuery();
        filterArea.fieldList = [
            'id',
        ];
        filterArea.filterList = [{ field: 'nombre', criteria: Criteria.EQUALS, value1: event}];
        filterArea.filterList.push({ field: 'tipoArea.id', criteria: Criteria.EQUALS, value1: '59'})
        let idDivision:any
        await this.areaService.getAreaRWithFilter(filterArea).then((resp:any)=>{
            idDivision=resp.data[0].id
        })

        let filterLocalidad = new FilterQuery();
        filterLocalidad.fieldList = [
            'id',
            'localidad'
        ];
        filterLocalidad.filterList = [{ field: 'plantas.area.id', criteria: Criteria.EQUALS, value1: idDivision}];
        this.localidadesList=[]
        await this.empresaService.getLocalidadesRWithFilter(filterLocalidad).then((ele:any)=>{
            for(let loc of ele.data){
                this.localidadesList.push({label:loc.localidad,value:loc.id})
            }
        }).catch((er:any)=>console.log(er)).finally(()=>this.flagLocalidades=true)
    }
    localidadesList:any
   
}

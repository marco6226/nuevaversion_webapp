import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MessageService, SelectItem, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup} from '@angular/forms'
import { Criteria, Filter } from '../../../../core/entities/filter';
import { Modulo } from '../../../../core/enums/enumeraciones';
import { TipoPeligroService } from 'src/app/website/pages/core/services/tipo-peligro.service';
import { PeligroService } from 'src/app/website/pages/core/services/peligro.service';
import { Reporte } from 'src/app/website/pages/comun/entities/reporte';
import { Documento } from 'src/app/website/pages/ado/entities/documento';
import {
  agente, jornada_trabajo, locale_es, lugar, mecanismo, parte_cuerpo,
  severidad, sitio, tipoAccidente, tipo_identificacion,
  tipo_identificacion_empresa, tipo_lesion, tipo_vinculacion 
} from '../../../entities/reporte-enumeraciones';
import { TestigoReporte } from 'src/app/website/pages/comun/entities/testigo-reporte';
import { Empleado } from 'src/app/website/pages/empresa/entities/empleado';
import { InformacionComplementaria } from 'src/app/website/pages/comun/entities/informacion_complementaria';
import { Desviacion } from 'src/app/website/pages/comun/entities/desviacion';
import { FactorCausal, Incapacidad, listFactores, listPlanAccion } from 'src/app/website/pages/comun/entities/factor-causal';
import { ReporteService } from 'src/app/website/pages/core/services/reporte.service';
import { EmpresaService } from 'src/app/website/pages/empresa/services/empresa.service';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { EmpleadoService } from 'src/app/website/pages/empresa/services/empleado.service';
import { AnalisisDesviacionService } from 'src/app/website/pages/core/services/analisis-desviacion.service';
import { ParametroNavegacionService } from 'src/app/website/pages/core/services/parametro-navegacion.service';
import { DesviacionService } from 'src/app/website/pages/core/services/desviacion.service';
import { DirectorioService } from 'src/app/website/pages/ado/services/directorio.service';
import { CargoService } from 'src/app/website/pages/empresa/services/cargo.service';
import { Cargo } from 'src/app/website/pages/empresa/entities/cargo';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { Peligro } from 'src/app/website/pages/comun/entities/peligro';
import { Empresa } from 'src/app/website/pages/empresa/entities/empresa';
import { AnalisisDesviacion } from 'src/app/website/pages/comun/entities/analisis-desviacion';
import { Directorio } from 'src/app/website/pages/ado/entities/directorio';

@Component({
  selector: 'app-formulario-accidente-temporal',
  templateUrl: './formulario-accidente-temporal.component.html',
  styleUrls: ['./formulario-accidente-temporal.component.scss'],
  providers: [

    TipoPeligroService, PeligroService
],
})
export class FormularioAccidenteTemporalComponent implements OnInit {

  reporte: Reporte | null = null;
  @Input('reporte') 
  set reporteget(reporte: Reporte){
    this.reporte=reporte
    this.cargarReporte()
  }
  @Input('consultar') consultar: boolean = false;
  @Input('modificar') modificar: boolean = false;
  @Input('adicionar') adicionar: boolean = false;
  @Output('onSave') onSave = new EventEmitter<Reporte>();
  @Output('onUpdate') onUpdate = new EventEmitter<Documento>();

  documentos: Documento[] = [];
  fechaActual = new Date();
  yearRange: string = '1900:' + this.fechaActual.getFullYear();
  tipoVinculacionList: SelectItem[];
  jornadaTrabajoList: SelectItem[];
  tipoIdentificacion: SelectItem[];
  tipoIdentificacionEmpresa: SelectItem[];
  sitioList: SelectItem[];
  tipoLesionList: SelectItem[];
  severidadList: SelectItem[];
  parteCuerpoList: SelectItem[];
  agenteList: SelectItem[];
  mecanismoList: SelectItem[];
  lugarList: SelectItem[];
  tipoAccidenteList: SelectItem[];
  localeES = locale_es;
  form: FormGroup | null = null;
  formplanaccion: FormGroup | null = null;
  testigoReporteList: TestigoReporte[] = [];
  visibleCamposAccidente: boolean=true;
  idEmpresa: string| null = null;
  fechaIngreso: Date | null = null;
  fechaAccidente: Date | null = null;
  deltaFecha: Date | null = null;
  deltaDia: number | null = null;
  deltaMes: number | null = null;
  empleadoSelect: Empleado | null = null;
  tipoPeligroItemList: SelectItem[] = [];
  peligroItemList: SelectItem[] = [];
  analisisPeligros: FormGroup;
  informacionComplementaria: InformacionComplementaria | null = null;
  analisisId: string | null = null;
  incapacidadesList: Incapacidad[] = [];
  desviacionesList: Desviacion[] = [];
  fields: string[] = [
    'modulo',
    'hashId',
    'area_nombre',
    'concepto',
    'fechaReporte',
    'aspectoCausante',
    'analisisId',
    'criticidad',
    'nombre'
  ];
  temporales=[
    {label:'Temporal 1', value:'123'},
    {label:'Temporal 2', value:'234'},
    {label:'Temporal 3', value:'345'}
  ];
  ARLfirme= [
    { label: "--Seleccione--", value: null },
    { label: "Objetado", value: "Objetado" },
    { label: "En firme", value: "En firme" },
  ]
  temporalesFlag: boolean=true
  cargoList: SelectItem[] = [];
  flagIncapacidades: boolean = false
  areasPermiso: string | null = null;
  tempData: listFactores[] = [];
  dataListFactor: listFactores[]=[];
  factorCausal: FactorCausal[] = [];
  planAccion:any;
  validators:boolean = true;
  modulo = Modulo.SEC.value;
  visibleDlgExcel: boolean = false;

  constructor(
      private fb: FormBuilder,
      private cdRef: ChangeDetectorRef,
      private reporteService: ReporteService,
      private empresaService: EmpresaService,
      private sesionService: SesionService,
      private tipoPeligroService: TipoPeligroService,
      private peligroService: PeligroService,
      private analisisDesviacionService: AnalisisDesviacionService,
      private desviacionService: DesviacionService,
      private confirmationService: ConfirmationService,
      private directorioService: DirectorioService,
      private cargoService: CargoService,
      private messageService: MessageService
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

      this.analisisPeligros = fb.group({
        Peligro: [null, /*Validators.required*/],
        DescripcionPeligro: [null, /*Validators.required*/],
        EnventoARL: [null, /*Validators.required*/],
        ReporteControl: [null, /*Validators.required*/],
        FechaControl: [null, /*Validators.required*/],
        CopiaTrabajador: [null, /*Validators.required*/],
        FechaCopia: [null, /*Validators.required*/],
    });
  }
  
  async ngOnInit() {
    this.cargoService.findByEmpresa().then((resp) => {
      this.cargoList = [];
      this.cargoList.push({ label: '--Seleccione--', value: null });
      (<Cargo[]>resp).forEach((cargo:any) => {
          this.cargoList.push({ label: cargo, value: cargo });
      });})

    this.areasPermiso = this.sesionService.getPermisosMap()['SEC_GET_DESV'].areas;
    let areasPermiso = this.areasPermiso?.replace('{','');
    areasPermiso = areasPermiso?.replace('}','');
    let areasPermiso2=areasPermiso?.split(',');

    const filteredArea = areasPermiso2?.filter(function(ele , pos){
      return areasPermiso2?.indexOf(ele) == pos;
    }) 
    this.areasPermiso='{'+filteredArea?.toString()+'}';
    
    this.idEmpresa = this.sesionService.getEmpresa()?.id ?? null;
    if(!this.modificar && !this.consultar){
    this.infoEmpresa()}
      this.formplanaccion=this.fb.group({
        avance:null,
        fechaCierre:null,
        descripcion:null
      })
      this.form = this.fb.group({
          id: null,
          tipo: 'ACCIDENTE',
          nombreEps: null,
          codigoEps: null,
          nombreAfp: null,
          codigoAfp: null,
          nombreArl: null,
          codigoArl: null,
          tipoVinculador: null,
          nombreCiiu: null,
          codigoCiiu: null,
          razonSocial: null,
          tipoIdentificacionEmpresa: null,
          identificacionEmpresa: null,
          direccionEmpresa: null,
          telefonoEmpresa: null,
          telefono2Empresa: null,
          emailEmpresa: null,
          zonaEmpresa: null,
          centrTrabIgualSedePrinc: null,
          nombreCentroTrabajo: null,
          codigoCentroTrabajo: null,
          nombreCiiuCentroTrabajo: null,
          ciiuCentroTrabajo: null,
          codCiiuCentroTrabajo: null,
          direccionCentroTrabajo: null,
          telefonoCentroTrabajo: null,
          zonaCentroTrabajo: null,
          tipoVinculacion: null,
          codigoTipoVinculacion: null,
          primerApellidoEmpleado: null,
          segundoApellidoEmpleado: null,
          primerNombreEmpleado: null,
          segundoNombreEmpleado: null,
          tipoIdentificacionEmpleado: null,
          numeroIdentificacionEmpleado: null,
          fechaNacimientoEmpleado: null,
          generoEmpleado: null,
          direccionEmpleado: null,
          emailEmpleado: null,//usuario.email
          telefonoEmpleado: null,
          telefono2Empleado: null,
          fechaIngresoEmpleado: null,
          zonaEmpleado: null,
          cargoEmpleado: null,
          ocupacionHabitual: null,
          codigoOcupacionHabitual: null,
          diasLaborHabitual:null,
          mesesLaborHabitual:null,
          salario: null,
          jornadaHabitual: null,
          fechaAccidente: null,
          horaAccidente: null,
          numerofurat:null,
          jornadaAccidente: null,
          realizandoLaborHabitual: null,
          nombreLaborHabitual: null,
          codigoLaborHabitual: null,
          horaInicioLabor: null,
          tipoAccidente: null,
          causoMuerte: null,
          zonaAccidente: null,
          lugarAccidente:null,
          huboTestigos: null,
          descripcion: null,
          sitio: null,
          cualSitio: null,
          tipoLesion: null,
          cualTipoLesion: null,
          parteCuerpo: null,
          agente: null,
          cualAgente: null,
          mecanismo: null,
          cualMecanismo: null,
          ciudadEmpresa: null,
          ciudadCentroTrabajo:null,
          ciudadEmpleado: null,
          ciudadAccidente: null,
          severidad:null,
          areaAccidente: null,
          usuarioReporta: null,
          empresa:null,
          nombresResponsable: null,
          apellidosResponsable: null,
          tipoIdentificacionResponsable: null,
          numeroIdentificacionResponsable: null,
          cargoResponsable:null,
          fechaReporte: null,
          temporal:null,
      });
      setTimeout(async () => {
        if(!this.modificar && !this.consultar){
          this.setFactorCausal();
        }
      }, 2000);
      
      this.cdRef.detectChanges();
      await this.cargarTiposPeligro();
  }

  async cargarReporte(){
    if(this.modificar || this.consultar){
        this.form?.patchValue({
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
            temporal:this.reporte?.temporal
        });

        let filterQuery = new FilterQuery();
        filterQuery.fieldList = this.fields;
        filterQuery.filterList = []
        
        filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "area.id", value1: this.areasPermiso });
        filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "hashId", value1: 'RAI-'+this.reporte?.id?.toString() });
        await this.desviacionService.getDesviacionTemporal(this.reporte?.id).then(async (resp:any) => {
          this.desviacionesList = resp;
          this.analisisId = this.desviacionesList[0].analisisId!;
          await this.consultarAnalisis(this.analisisId)});
    }

  }
  SelectPeligro(a: string){
    this.cargarPeligro(a)
}
  async cargarTiposPeligro() {
    await this.tipoPeligroService.getForEmpresa().then((resp:any)=>{
      let tipoPeligroItemList: any[] = []
      this.tipoPeligroItemList = [{ label: '--Seleccione--', value: null }];
      resp.forEach(
        (data: any) => tipoPeligroItemList.push({ label: data[2], value: data[0] })
      )
      tipoPeligroItemList=this.order(tipoPeligroItemList)
      tipoPeligroItemList.forEach(resp=>{
        this.tipoPeligroItemList.push(resp)
      })
    })
  }
  async cargarPeligro(idtp: string) {
    let peligroItemList: any[] = [];
    if(idtp != null){
    let filter = new FilterQuery();
    filter.filterList = [{ field: 'tipoPeligro.id', criteria: Criteria.EQUALS, value1: idtp }];
    await this.peligroService.findByFilter(filter).then(
      resp => {
        this.peligroItemList = [];
        (<Peligro[]>resp).forEach(
          data => 
            {
                peligroItemList.push({ label: data.nombre, value: {id:data.id,nombre: data.nombre} })
            }
        )
        peligroItemList=this.order(peligroItemList)
        peligroItemList.forEach(resp=>{
          this.peligroItemList.push(resp)
        })
      }
    );
     }else{
        this.peligroItemList = [{ label: '--Seleccione Peligro--', value: [null, null]}];
     }
  }
  async infoEmpresa() {

      let empresa = await this.empresaService.findSelected() as Empresa;
      this.form?.patchValue({
          razonSocial:empresa.nombreComercial,
          identificacionEmpresa: empresa.nit,
          tipoIdentificacionEmpresa: "NI",
          direccionEmpresa: empresa.direccion,
          telefonoEmpresa: empresa.telefono,
          emailEmpresa: empresa.email
      })

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
      for (let i = 0; i < this.testigoReporteList.length; i++) {
          if (this.testigoReporteList[i].codigo === testigo.codigo) {
              this.testigoReporteList.splice(i, 1);
              this.testigoReporteList = this.testigoReporteList.slice();
              break;
          }
      }
  }

  async consultarAnalisis(analisisId: string){
    let fq = new FilterQuery();
    fq.filterList = [
        { criteria: Criteria.EQUALS, field: "id", value1: analisisId },
    ];
    await this.analisisDesviacionService.getAnalisisTemporal(parseInt(analisisId)).then(async (resp: any[]) => {
      let analisis: AnalisisDesviacion = <AnalisisDesviacion>resp[0];
      this.informacionComplementaria = JSON.parse(resp[0].complementaria);
      this.incapacidadesList = JSON.parse(resp[0].incapacidades)
      this.factorCausal = JSON.parse(resp[0].factor_causal);
      
      this.documentos = analisis.documentosList ?? [];
      this.planAccion = JSON.parse(resp[0].plan_accion);
      this.formplanaccion?.patchValue({
        avance: this.planAccion['avance'],
        fechaCierre: this.planAccion['fechaCierre']?new Date(this.planAccion['fechaCierre']):null,
        descripcion: this.planAccion['descripcion']
      })
      this.setFactorCausal();
      if(this.incapacidadesList){
        if(this.incapacidadesList.length>0){
            this.flagIncapacidades=true
        }
      }
    })
    if(this.informacionComplementaria!=null){
      this.analisisPeligros.patchValue({
          'Peligro': this.informacionComplementaria.Peligro,
          'DescripcionPeligro': this.informacionComplementaria.DescripcionPeligro,
          'EnventoARL': this.informacionComplementaria.EnventoARL,
          'ReporteControl': this.informacionComplementaria.ReporteControl,
          'FechaControl': this.informacionComplementaria.FechaControl == null ? null : new Date(this.informacionComplementaria.FechaControl),
          'CopiaTrabajador': this.informacionComplementaria.CopiaTrabajador,
          'FechaCopia':this.informacionComplementaria.FechaCopia == null ? null : new Date(this.informacionComplementaria.FechaCopia)
        });
      this.cargarPeligro(this.analisisPeligros.value['Peligro'])
    }
    this.setListDataFactor()
  }
  //botón guardar y modificar
  listPlanAccion: listPlanAccion[] =[]
  async submit1() {
    this.informacionComplementaria=this.analisisPeligros.value;
    let ad = new AnalisisDesviacion();
    ad.complementaria=JSON.stringify(this.informacionComplementaria);
    ad.incapacidades= JSON.stringify(this.incapacidadesList);
    ad.factor_causal= JSON.stringify(this.factorCausal);
    ad.plan_accion=JSON.stringify(this.formplanaccion?.value);
    ad.documentosList=this.documentos
    
    if (this.adicionar) {
        let reporte = <Reporte>this.form?.value;
        reporte.testigoReporteList = this.testigoReporteList;
        // reporte.identificacionEmpresa = this.selectedTemporal;
        // let selectedTemporal=this.temporales.find((data)=>{
        //   return data.value==this.selectedTemporal
        // })
        reporte.temporal = this.form?.value.razonSocial;
        reporte.identificacionEmpresa = this.form?.value.identificacionEmpresa;
        reporte.istemporal = true;
        await this.reporteService.create(reporte).then(
            async (data: any) => {
                this.onSave.emit(<Reporte>data)

                let filterQuery = new FilterQuery();
                filterQuery.fieldList = this.fields;
                filterQuery.filterList = []
                
                filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "area.id", value1: this.areasPermiso });
                filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "hashId", value1: 'RAI-'+data.toString() });
                await this.desviacionService.findByFilter(filterQuery).then(
                  (resp: any) => {
                    this.desviacionesList = resp['data'];
                    ad.desviacionesList=this.desviacionesList;
                    this.analisisDesviacionService.create(ad)
                    .then((data) => {
                      let analisisDesviacion = <AnalisisDesviacion>data;
                      this.analisisId = analisisDesviacion.id ?? null;
                    })
                  })

                this.adicionar=false
                this.modificar=true
            }

        );
        this.reporte=reporte
    } else if (this.modificar) {

      ad.id = this.analisisId!;
      ad.desviacionesList=this.desviacionesList;
      this.analisisDesviacionService.update(ad)

      let reporte = <Reporte>this.form?.value;
      reporte.testigoReporteList = this.testigoReporteList;
      this.reporteService.update(reporte).then(
          data => this.onSave.emit(<Reporte>data)
      );
      this.reporte=reporte
    }
    this.setListDataFactor()
  }

  getListIncapacidades(event: any){
    this.incapacidadesList = event;
    if(this.incapacidadesList){
      if(this.incapacidadesList.length>0){
          this.flagIncapacidades=true
      }else{this.flagIncapacidades=false}
    }
  }

  setListDataFactor(){
    this.tempData = []
    this.dataListFactor = []
    try {          
      this.tempData = []
      this.factorCausal.forEach(data => {           
        data.seccion?.forEach(data1 => {
          data1.desempeno.forEach(data2 => {   
            if (data2.selected) {
              data2.areas?.forEach(data3 => {
                data3.subProd.forEach(data4 => {
                  data4.causa.forEach(element => {    
                    if (element.esCausa) {   
                      if (!this.dataListFactor.find(ele=> {
                        return ele.pregunta == data2.pregunta && ele.metodologia == element.ProcedimientoFC && ele.nombre == data.nombre
                      })) {
                        this.tempData.push({nombre:data.nombre, pregunta:data2.pregunta,metodologia: element.ProcedimientoFC, accion:'Sin Plan de Accion'})
                      }else{
                        this.dataListFactor.forEach(ele =>{
                          if(ele.pregunta == data2.pregunta && ele.metodologia == element.ProcedimientoFC && ele.nombre == data.nombre){
                            this.tempData.push(ele)                                            
                          }
                        });
                      }
                    }                                
                  });
                });
              });    
            }                        
          });
        });

        data.causa_Raiz?.forEach(data1 => {
            this.selectCausaRaiz(data.nombre, data1.label, data1)
        });
      });
      this.dataListFactor = this.tempData; 
    } catch (error) {}
  }

  selectCausaRaiz(nombre: any, pregunta: any, datos: any){
    if (datos.data.name=='Si') {
      if (!this.dataListFactor.find(ele=> {return ele.pregunta == pregunta && ele.metodologia == datos.label})) {
        this.tempData.push({nombre:nombre, pregunta: pregunta,metodologia: datos.label, accion:'Sin Plan de Accion'})
      }else{
        this.dataListFactor.forEach(ele =>{
          if(ele.pregunta == pregunta && ele.metodologia == datos.label){
            this.tempData.push(ele)                                              
          }
        });
      }           
    }else if(datos.children){
      datos.children.forEach((element: any) => {
        this.selectCausaRaiz(nombre, pregunta ,element)
      });
    } 
  }

  getValidator(event: boolean){
    this.validators = event;
  }

  setFactorCausal(){
    if (!this.factorCausal) {
      this.factorCausal=[];  
      this.factorCausal.push({id:1, nombre:'contratista'});
      this.setListDataFactor();}
  }

  showDialog(){
    this.visibleDlgExcel = true;
  }

  onUpload(event: Directorio) {
    if (this.documentos == null)
      this.documentos = [];
    this.documentos.push(event.documento!);
    // this.adicionarAGaleria(event.documento);
    this.documentos = this.documentos.slice();
  }

  eliminarDocument(doc: Documento) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + doc.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.onUpdate.emit(doc);
          this.directorioService.eliminarDocumento(doc.id).then(
            data => {
              this.documentos = this.documentos.filter(val => val.id !== doc.id);
            }
          );
      }
    });
  }

  descargarDocumento(doc: Documento) {
    let msg = { severity: 'info', summary: 'Descargando documento...', detail: 'Archivo \"' + doc.nombre + "\" en proceso de descarga" };
    this.messageService.add(msg);
    this.directorioService.download(doc.id).then(
      resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp]);
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink?.setAttribute("href", url);
          dwldLink?.setAttribute("download", doc.nombre);
          dwldLink?.click();
          this.messageService.add({ severity: 'success', summary: 'Archivo descargado', detail: 'Se ha descargado correctamente el archivo ' + doc.nombre });
        }
      }
    );
  }
  
  actualizarDesc(doc: Documento) {
    this.directorioService.actualizarDocumento(doc).then(
      data => {
        this.onUpdate.emit(doc);
      }
    );
  }

  order(ele: any){
    ele.sort(function (a: any, b: any) {
      if (a.label > b.label) {
        return 1;
      }
      if (a.label < b.label) {
        return -1;
      }
      return 0;
    });
    return ele
  }

  test(){
    console.log(this.analisisPeligros.valid)
    console.log(this.form?.valid)
  }
}

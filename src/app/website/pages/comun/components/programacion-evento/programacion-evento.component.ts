import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Criteria } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';
import { SerieService } from '../../../core/services/serie.service';
import { Localidades } from '../../../ctr/entities/aliados';
import { EmpleadoBasic } from '../../../empresa/entities/empleado-basic';
import { Empresa } from '../../../empresa/entities/empresa';
import { ListaInspeccion } from '../../../inspecciones/entities/lista-inspeccion';
import { Programacion } from '../../../inspecciones/entities/programacion';
import { ProgramacionService } from '../../../inspecciones/services/programacion.service';
import { locale_es } from '../../entities/reporte-enumeraciones';
import { Serie } from '../../entities/serie';
import { SesionService } from '../../../core/services/session.service';

@Component({
  selector: 's-programacion-evento',
  templateUrl: './programacion-evento.component.html',
  styleUrls: ['./programacion-evento.component.scss'],
  providers: [SerieService, SesionService]
})
export class ProgramacionEventoComponent implements OnInit, OnChanges {

  form: FormGroup | undefined = undefined;
  diasList: SelectItem[] = [
    {label: 'D', value: 0, title: 'Domingo'},
    {label: 'L', value: 1, title: 'Lunes'},
    {label: 'M', value: 2, title: 'Martes'},
    {label: 'M', value: 3, title: 'Miércoles'},
    {label: 'J', value: 4, title: 'Jueves'},
    {label: 'V', value: 5, title: 'Viernes'},
    {label: 'S', value: 6, title: 'Sábado'}
  ]
  diasSemanaSelected: number[] | null = null;
  numerosOrdinales: SelectItem[] = [
    {label:'Primer', value: 1},
    {label:'Segundo', value: 2},
    {label:'Tercero', value: 3},
    {label:'Cuarto', value: 4},
    {label:'Último', value: 5},
  ];
  programacionSwitch: boolean = false;
  periodicidadList: SelectItem[] = [
    { label: 'Dia(s)', value: 'diario' },
    { label: 'Semana(s)', value: 'semana' },
    { label: 'Mes(es)', value: 'mes' },
  ];
  numeroOrdinalSelected: number | null = null;
  diaSelected: number | null = null;
  radioBSelected: string | null = null;
  inputDia: number | null = null;
  esListaInactiva: boolean = false;

  @Input('visible') visible: boolean = false;
  @Input('modulo') modulo: string = 'INP';
  @Input('listasInspeccion') listasInspeccionList: SelectItem[] = [];
  @Input('empresasAliadas') empresasAliadasOption: {label: string, value: Empresa}[] = [];
  @Input('localidades') localidadesOption: {label: string, value: Localidades}[] = [];
  @Input('esNueva') esNueva: boolean = true;
  @Input() loading: boolean = false;
  programacion: Programacion | null = null;
  @Input('programacion') set setProgramacion(prog: Programacion){
    this.programacion = prog;
  }
  idProgramacion: string | null = null;
  @Input('value') set setValue(value: string | null){
    this.idProgramacion = value;
    if(this.idProgramacion === null) return;
    try{
      this.loading = true;
      this.loadDataEvento()
      .then(() => {
        this.loading = false;;
      }).catch((e) => {
        throw new Error(e);
      });
    }catch(e) {
      this.loading = false;
      this.messageService.add({key: 'progEvento', severity: 'error', summary: 'Error', detail: 'Error al buscar inspección'});
    }
  }
  @Input('fechaSelected') set fechaSelected(fecha: Date | null){
    if(fecha === null) return;
    this.form?.get('fechaInicio')?.setValue(fecha);
  }
  @Input('deshabilitar') deshabilitar: boolean = false;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() valueChange: EventEmitter<string | null> = new EventEmitter();
  @Output() onChange: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private programacionService: ProgramacionService,
    private messageService: MessageService,
    private serieService: SerieService,
    private paramNav: ParametroNavegacionService,
    private config: PrimeNGConfig,
    private sessionService: SesionService
  ) {
    this.form = this.fb.group({
      id: null,
      numeroInspecciones: null,
      numeroRealizadas: null,
      listaInspeccionPK: null,
      area: null,
      empresaAliada: null,
      localidad: null,
      empleadoBasic: null,
      unidadFrecuencia: null,
      valorFrecuencia: null,
      fechaInicio: null,
      fechaFin: null,
      semana: null,
      serie: null
    });
  }

  ngOnInit() {
    this.config.setTranslation(locale_es);

    if(this.modulo === 'INPCC'){
      this.form?.get('empleadoBasic')?.setValidators([Validators.required]);
    }else {
      this.form?.get('empleadoBasic')?.clearValidators();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if(changes['visible']){
    // console.log(changes);
    // }
  }

  onChangeListaInspeccion(event: DropdownChangeEvent) {
    // console.log(event);
    this.deshabilitar = false;
    this.esListaInactiva = false;
    if(this.form?.get('numeroRealizadas')?.value && this.form?.get('numeroRealizadas')?.value > 0) this.deshabilitar = true;
  }

  async loadDataEvento() {
    let filterQuery: FilterQuery = new FilterQuery();
    filterQuery.filterList = [{criteria: Criteria.EQUALS, field: 'id', value1: this.idProgramacion}]

    if(this.modulo === 'INP') {
      let areas = this.sessionService.getPermisosMap()['INP_GET_PROG'].areas;
      filterQuery.filterList.push({criteria: Criteria.CONTAINS, field: 'area.id', value1: areas});
    }

    let findProgramacion = this.modulo === 'INP' ? this.programacionService.findByFilter.bind(this.programacionService) : this.programacionService.findAuditoriasWithFilter.bind(this.programacionService);

    findProgramacion(filterQuery)
    .then((res: any) => {
      let programacion: Programacion =  res?.data && res?.data?.length > 0 ? res.data[0] : {} as Programacion;
      // console.log(this.listasInspeccionList);
      // console.log(programacion);
      if(programacion.listaInspeccion.estado === 'inactivo'){
        if(!programacion.numeroRealizadas || programacion.numeroRealizadas < programacion.numeroInspecciones) this.esListaInactiva = true;
        this.deshabilitar = true;
        // if(programacion.numeroRealizadas && programacion.numeroRealizadas > 0) 
        let listaInp = {
          label: `${programacion.listaInspeccion.codigo} - ${programacion.listaInspeccion.nombre} v${programacion.listaInspeccion.listaInspeccionPK.version}`,
          value: {id: programacion.listaInspeccion.listaInspeccionPK.id, version: programacion.listaInspeccion.listaInspeccionPK.version},
          disabled: true
        } as SelectItem;
        this.listasInspeccionList.push(listaInp);
      }
      this.form?.get('id')?.setValue(programacion.id);
      this.form?.get('numeroInspecciones')?.setValue(programacion.numeroInspecciones);
      this.form?.get('numeroRealizadas')?.setValue(programacion.numeroRealizadas);
      this.form?.get('listaInspeccionPK')?.setValue(programacion.listaInspeccion.listaInspeccionPK);
      this.form?.get('area')?.setValue(programacion.area);
      this.form?.get('empresaAliada')?.setValue(programacion.empresaAliada);
      this.form?.get('localidad')?.setValue(programacion.localidad);
      this.form?.get('empleadoBasic')?.setValue(JSON.parse(programacion.empleadoBasic));
      this.form?.get('fechaInicio')?.setValue(new Date(programacion.fecha));
    }).catch((e) => {
      throw new Error(e);
    });
  }

  onReceiveEmpleadoBasic(event?: EmpleadoBasic) {
    this.form?.get('empleadoBasic')?.setValue(event);
  }

  async onSubmit(){
    this.loading = true;
    if(this.programacionSwitch){
      let programacionList : Programacion[] = [];
      try {
        programacionList = this.getProgramacionList();
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error as string,
          key: 'progEvento'
        });
      }
      // console.log(programacionList);
      if(this.modulo === 'INP') {
        // console.log('INP');
        if(this.esNueva){
          programacionList.forEach(async (prog: Programacion) => {
            await this.createOrUpdate(this.programacionService.create.bind(this.programacionService), prog);
          });
        }else {
          console.info('Actualizar not found');
        }
      } else if(this.modulo === 'INPCC') {
        // console.log('INPCC');
        // console.log(programacionList);
        if(this.esNueva){
          programacionList.forEach(async (prog: Programacion) => {
            await this.createOrUpdate(this.programacionService.createAuditoria.bind(this.programacionService), prog);
          });
        }else {
          console.info('Actualizar not found');
        }
      }
    } else {
      let programacion: Programacion = this.getProgrammacionUnica();
      if(this.modulo === 'INP'){
        if(this.esNueva){
          await this.createOrUpdate(this.programacionService.create.bind(this.programacionService), programacion);
        } else {
          await this.createOrUpdate(this.programacionService.update.bind(this.programacionService), programacion);
        }
      } else if(this.modulo === 'INPCC') {
        if(this.esNueva){
          await this.createOrUpdate(this.programacionService.createAuditoria.bind(this.programacionService), programacion);
        } else {
          await this.createOrUpdate(this.programacionService.updateAuditoria.bind(this.programacionService), programacion);
        }
      }
      this.hideDialog();
    }
    this.loading = false;
  }

  private async createOrUpdate(method: Function, programacion: Programacion){
    try {
      await method(programacion);
      this.procesarRespuesta(true, this.esNueva ? 'guardar' : 'actualizar');
    } catch(error) {
      this.procesarRespuesta(false, this.esNueva ? 'guardar' : 'actualizar');
    }
  }

  getProgrammacionUnica(): Programacion {
    let programacion: Programacion = {} as Programacion;
    
    if(!this.form?.valid) {
      this.messageService.add({severity: 'warn', summary: 'Datos incompletos', detail: 'Debe llenar los campos requeridos en el formulario'});
      throw 'Error datos incompletos en el formulario'
    }

    programacion.numeroInspecciones = this.form?.get('numeroInspecciones')?.value;
    programacion.listaInspeccion = {} as ListaInspeccion;
    programacion.listaInspeccion.listaInspeccionPK = this.form?.get('listaInspeccionPK')?.value;
    programacion.fecha = this.form?.get('fechaInicio')?.value;
    programacion.numeroRealizadas = this.form?.get('numeroRealizadas')?.value;
    programacion.id = this.form?.get('id')?.value;
    programacion.area = this.form?.get('area')?.value;
    programacion.empresaAliada = this.form?.get('empresaAliada')?.value;
    programacion.localidad = this.form?.get('localidad')?.value;
    programacion.empleadoBasic = JSON.stringify(this.form?.get('empleadoBasic')?.value);

    if(!programacion.listaInspeccion.listaInspeccionPK) throw 'Error al procesar programación única'

    return programacion
  }

  getProgramacionList(): Programacion[] {
    let programaciones: Programacion[] = [];
    let dates: Date[] = [];
    let currentDate: Date;

    if(this.form?.get('fechaInicio')?.value == null || this.form?.get('fechaFin')?.value == null) throw new Error('Debe proporcionar una fecha inicial y una fecha final.');
    if(this.form?.get('valorFrecuencia')?.value == null) throw new Error('Debe proporcionar el valor de la frecuencia del evento.');
    if(this.getUnidadFrecuencia() === null) throw new Error('Debe elegir la unidad de frecuencia del evento.');

    switch(this.getUnidadFrecuencia()){
      case 'diario':
        currentDate = new Date(this.form?.get('fechaInicio')?.value);
        // Recorre todos los días hasta la fecha final
        while(currentDate <= this.form?.get('fechaFin')?.value){
          dates.push(new Date(currentDate));

          // Si existe un valor de frecuencia mayor que 1 saltamos hasta el día que corresponde el siguiente evento
          if(this.form?.get('valorFrecuencia')?.value > 1){
            currentDate.setDate(currentDate.getDate() + this.form?.get('valorFrecuencia')?.value);
          } else {
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
        break;
      case 'semana':
        if(this.diasSemanaSelected == null || this.diasSemanaSelected?.length == 0) throw new Error('Debe elegir los días de la semana en que se realizará el evento.')

        this.diasSemanaSelected?.sort((a, b) => a - b);
        currentDate = new Date(this.form?.get('fechaInicio')?.value);
        // Recorre todos los días hasta la fecha final
        while(currentDate <= this.form?.get('fechaFin')?.value){
          // Revisa si a la fecha de inicio corresponde un evento y lo agrega
          if(this.diasSemanaSelected?.includes(currentDate.getDay())) {
            dates.push(new Date(currentDate));
          }

          // // Pasamos al siguiente día
          currentDate.setDate(currentDate.getDate() + 1);

          // // Si ya recorrimos los días seleccionados y el valor de frecuencia es mayor a 1 viajamos a la siguiente semana
          if(this.diasSemanaSelected && currentDate.getDay() === this.diasSemanaSelected[0] && this.form?.get('valorFrecuencia')?.value > 1){
            currentDate.setDate(currentDate.getDate() + 7 * (this.form?.get('valorFrecuencia')?.value - 1));
          }
        }
        break;
      case 'mes':
        if(this.radioBSelected === 'diaSemana'){
          if(this.diaSelected == null || this.numeroOrdinalSelected == null) throw new Error('Debe elegir el día y la semana en que se programará el evento');

          currentDate = new Date(this.form?.get('fechaInicio')?.value);
          // Recorre los meses hasta la fecha final
          currentDate.setDate(1);
          while(currentDate <= this.form?.get('fechaFin')?.value) {
            // Se revisa si el día actual corresponde al día de la semana seleccionado;
            if(currentDate.getDay() === this.diaSelected) {
              // Obtenemos el día y la semana seleccionada requerido
              const newDate = this.getDiaEspecificoDelMes(this.diaSelected, this.numeroOrdinalSelected, currentDate.getFullYear(), currentDate.getMonth());
              // Revisa si la fecha se encuentra entre la fecha inicial y la fecha final
              if(newDate >= this.form?.get('fechaInicio')?.value && newDate <= this.form?.get('fechaFin')?.value) {
                dates.push(new Date(newDate));
              }
              // Vamos al primero del siguiente mes
              currentDate.setMonth(currentDate.getMonth() + (this.form?.get('valorFrecuencia')?.value ?? 1));
              currentDate.setDate(1);
            } else {
              currentDate.setDate(currentDate.getDate() + 1);
            }
          }
        } else {
          if(!this.inputDia || (this.inputDia > 31 || this.inputDia < 1)) {
            // this.messageService.add({severity: 'error', detail: 'Error', summary: 'Debe diligenciar un día valido'});
            throw new Error('Debe digitar un día del mes válido');
          }
          currentDate = new Date(this.form?.get('fechaInicio')?.value);
          // currentDate.setDate(this.inputDia);
          while(currentDate <= this.form?.get('fechaFin')?.value){
            let diasDelMes: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            if (diasDelMes <= this.inputDia) {
              dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), diasDelMes));
            } else {
              dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), this.inputDia));
            }
            currentDate.setDate(1);
            currentDate.setMonth(currentDate.getMonth() + this.form?.get('valorFrecuencia')?.value);
          }
        }
        break;
      default:
        throw 'Unidad de frecuencia no válida';
    }
    // console.log(dates);
    programaciones = dates.map<Programacion>(date => {
      return {
        id: this.form?.get('id')?.value,
        area: this.form?.get('area')?.value,
        empleadoBasic: JSON.stringify(this.form?.get('empleadoBasic')?.value),
        empresaAliada: this.form?.get('empresaAliada')?.value,
        fecha: date,
        listaInspeccion: {
          listaInspeccionPK: this.form?.get('listaInspeccionPK')?.value
        } as ListaInspeccion,
        localidad: this.form?.get('localidad')?.value,
        numeroInspecciones: this.form?.get('numeroInspecciones')?.value,
        numeroRealizadas: this.form?.get('numeroRealizadas')?.value,
        // serie: this.form?.get('serie')?.value
      }
    })
    return programaciones;
  }

  getDiaEspecificoDelMes(diaSemana: number, numeroSemana: number, anio: number, mes: number) {
    const fecha = new Date(anio, mes, 1);
    
    // Recorre los días de la semana hasta el requerido en la semana 1
    while (fecha.getDay() !== diaSemana) {
      fecha.setDate(fecha.getDate() + 1);
    }

    // Se teniendo en cuenta si es la 1r, 2a, 3r, etc. Semana se busca la fecha que le corresponde
    fecha.setDate(fecha.getDate() + 7 * (numeroSemana - 1));

    // Si el mes al que corresponde la fecha encontrada corresponde al mes siguiente se devuelve a la última semana del mes anterior
    if(fecha.getMonth() !== mes) {
      fecha.setDate(fecha.getDate() - 7);
    }

    return fecha;
  }

  irInspeccion(){
    
    let programacion: Programacion = {
      id: this.form?.get('id')?.value,
      area: this.form?.get('area')?.value,
      empleadoBasic: JSON.stringify(this.form?.get('empleadoBasic')?.value),
      empresaAliada: this.form?.get('empresaAliada')?.value,
      fecha: this.form?.get('fechaInicio')?.value,
      listaInspeccion: {
        listaInspeccionPK: this.form?.get('listaInspeccionPK')?.value
      } as ListaInspeccion,
      localidad: this.form?.get('localidad')?.value,
      numeroInspecciones: this.form?.get('numeroInspecciones')?.value,
      numeroRealizadas: this.form?.get('numeroRealizadas')?.value,
      // serie: this.form?.get('serie')?.value
    }

    this.paramNav.setParametro<Programacion>(programacion);
    this.paramNav.setAccion<string>('POST');
    switch(this.modulo){
      case 'INP':
        this.paramNav.redirect('/app/inspecciones/elaboracionInspecciones/' + this.form?.value?.listaInspeccionPK?.id + "/" + this.form?.value?.listaInspeccionPK?.version);
        break;
      case 'INPCC':
        this.paramNav.redirect('/app/ctr/elaboracionAuditoriaCicloCorto/' + this.form?.value?.listaInspeccionPK?.id + "/" + this.form?.value?.listaInspeccionPK?.version);
        break;
      default: 

    }
  }

  eliminarProgramacion() {
    this.loading = true;
    let programacionId = this.form?.get('id')?.value;
    this.programacionService.delete(programacionId)
      .then(data => {
        // let matrizValue = this.findMatrizValue(this.fechaSelect);
        this.messageService.add({
          severity: 'success',
          summary: 'Programación eliminada',
          detail: 'Se ha eliminado correctamente la programacion'
        });
        this.loading = false;
        this.onChange.emit(true);
        this.hideDialog();
      })
      .catch(err => {
        this.loading = false;
      })
      .finally(() => {
        this.hideDialog();
      });
  }

  hideDialog(){
    this.form?.reset();
    this.listasInspeccionList = this.listasInspeccionList.filter(lista => !lista.disabled);
    this.visible = false;
    this.diaSelected = null;
    this.numeroOrdinalSelected = null;
    this.radioBSelected = null;
    this.inputDia = null;
    this.diasSemanaSelected = null;
    this.programacionSwitch = false;
    this.idProgramacion = null;
    this.esListaInactiva = false;
    this.deshabilitar = false;
    this.valueChange.emit(null);
    this.visibleChange.emit(false);
  }
  
  getUnidadFrecuencia(): string | null {
    return this.form?.get('unidadFrecuencia')?.value;
  }

  procesarRespuesta(esSatisfactoria: boolean, accion: string, error?: any){
    if (esSatisfactoria) {
      this.messageService.add({severity: 'success', summary: 'Guardado'});
      this.form?.reset();
      this.onChange.emit(true);
      this.hideDialog();
    } else {
      console.log(error);
      this.messageService.add({severity: 'error', summary: 'Error', detail: `No se pudo ${accion} el evento`});
    }
  }

  onChangeUnidadDeFrecuencia(event: DropdownChangeEvent) {
    if(event.value === 'mes') {
      this.radioBSelected = 'dia';
      let date = new Date(this.form?.get('fechaInicio')?.value);
      // console.log( date, this.form?.get('fechaInicio')?.value, date.getDate());
      this.inputDia = date.getDate();
    } else {
      this.radioBSelected = null;
      this.diaSelected = null;
    }
  }

  getSerie(): Serie {
    return this.esNueva ? {
      id: null,
      fechaDesde: new Date(this.form?.get('fechaInicio')?.value),
      fechaHasta: new Date(this.form?.get('fechaFin')?.value),
      periodicidad: this.form?.get('valorFrecuencia')?.value,
      unidadPeriodo: this.form?.get('unidadFrecuencia')?.value
    } : this.form?.get('serie')?.value;
  }

}

import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { PrimeNGConfig } from 'primeng/api';
import { CalendarOptions, EventInput, EventSourceFuncArg } from '@fullcalendar/core';
import { locale_es } from 'src/app/website/pages/comun/entities/reporte-enumeraciones';
import { ListaInspeccion } from 'src/app/website/pages/inspecciones/entities/lista-inspeccion';
import { Programacion } from 'src/app/website/pages/inspecciones/entities/programacion';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { PerfilService } from 'src/app/website/pages/admin/services/perfil.service';
import { ParametroNavegacionService } from 'src/app/website/pages/core/services/parametro-navegacion.service';
import { ProgramacionService } from 'src/app/website/pages/inspecciones/services/programacion.service';
import { ListaInspeccionService } from 'src/app/website/pages/inspecciones/services/lista-inspeccion.service';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { Criteria, Filter } from 'src/app/website/pages/core/entities/filter';
import { Localidades } from '../../../entities/aliados';
import { EmpresaService } from 'src/app/website/pages/empresa/services/empresa.service';
import { Empresa } from 'src/app/website/pages/empresa/entities/empresa';
import { EmpleadoBasic } from 'src/app/website/pages/empresa/entities/empleado-basic';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-programacion-ctr',
  templateUrl: './programacion-ctr.component.html',
  styleUrls: ['./programacion-ctr.component.scss'],
  providers: [EmpresaService]
})
export class ProgramacionCtrComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  localeES: any = locale_es;
  anioSelect!: number;
  mesSelect!: number;
  matriz?: MatrizList[] = [];
  aniosList!: SelectItem[];
  listasInspeccionList: SelectItem[] = [];
  visibleDlg!: boolean;
  visibleDlgFiltros: boolean = false;
  fechaSelect!: Date;
  form!: FormGroup;
  formFilters!: FormGroup;
  actualizar!: boolean;
  adicionar!: boolean;
  btnInspDisable!: boolean;
  visibleProgMasiva!: boolean;
  fechaMaxima!: Date;
  semanaLaboral = ['1', '2', '3', '4', '5',];
  listaInspeccionList!: ListaInspeccion[];
  loading: boolean = false;
  progLoading: boolean = false;
  permiso: boolean = false;
  totalRecords!: number;
  localidades: Localidades[] = [];
  localidadesOption: {label: string; value: Localidades}[] = [];
  empresasAliadas: Empresa[] = [];
  empresasAliadasOption: {label: string; value: Empresa}[] = [];

  calendarOptions!: CalendarOptions;
  // events!: any[];
  events: EventInput[] = [];
  event!: EventInput;

  programacionList: Programacion[] = [];

  periodicidadList: SelectItem[] = [
    { label: 'Dia(s)', value: 'diario' },
    { label: 'Semana(s)', value: 'semana' },
    { label: 'Mes(es)', value: 'mes' },
  ];

  diasSemanaSelected: number[] | null = null;
  radioBSelected: string | null = null;
  inputDia: number | null = null;
  numeroOrdinalSelected: number | null = null;
  diaSelected: number | null = null;
  value: string | null = null;
  deshabilitarEvento: boolean = false;
  fechaSelected: Date | null = null;

  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent | undefined;
  calendarChangeDetector: any | null = null;

  constructor(
    private sesionService: SesionService,
    private userService: PerfilService,
    private paramNav: ParametroNavegacionService,
    private programacionService: ProgramacionService,
    private listaInspeccionService: ListaInspeccionService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private config: PrimeNGConfig,
    private empresaService: EmpresaService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      id: null,
      numeroInspecciones: ['', Validators.required],
      listaInspeccionPK: ['', Validators.required],
      area: null,
      empresaAliada: [null, Validators.required],
      localidad: [null, Validators.required],
      empleadoBasic: [null, Validators.required],
      unidadFrecuencia: null,
      valorFrecuencia: null,
      fechaInicio: null,
      fechaFin: null,
      semana: null
    });

    this.formFilters = this.fb.group({
      localidades: [null],
      empresasAliadas: [null],
      empleado: [null]
    });
  }

  async ngOnInit() {
    this.config.setTranslation(this.localeES);
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialDate: new Date(),
      locale: esLocale,
      dateClick: this.openDlg.bind(this),
      headerToolbar: {
        left: 'prev today',
        center: 'title',
        right: 'next'
      },
      eventClick: this.eventListener.bind(this),
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      displayEventTime: false,
      firstDay: 0
    };

    //Revisar si se puede editar programaciones
    let permiso = this.sesionService.getPermisosMap()['INP_PUT_PROG'];
    // // let empresa = this.sesionService.getEmpresa();
    if (permiso != null && permiso.valido == true) {
      this.permiso = true;
    }

    // lISTAS DE INSPECCIONES DISPONIBLES AQUÍ
    await this.loadListaDeInspecciones();

    this.form.controls['area'].disabled;
    await this.loadLocalidades();
    this.loadEmpresasAliadas()
    .finally(() => { 
      try {
        this.actualizarEventos();
      } catch(e) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al actualizar eventos.'})
      }
    });

    this.calendarComponent?.getApi().on('datesSet', () => {
      // console.log('calendarComponent');
      // this.actualizarEventos();
      this.applyFilter();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('userP');
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async loadListaDeInspecciones(){
    let filterQuery = new FilterQuery();
    filterQuery.filterList = [
      // {field: 'estado', criteria: Criteria.NOT_EQUALS, value1: 'inactivo', value2: null}
      {field: 'estado', criteria: Criteria.EQUALS, value1: 'activo'}
    ];
    let filterAuditoria: Filter = new Filter();
    filterAuditoria = {criteria: Criteria.LIKE, field: 'tipoLista', value1: 'Ciclo %'};
    filterQuery.filterList.push(filterAuditoria);

    await this.listaInspeccionService.findByFilter(filterQuery)
    .then(
      async (res: any) => {
        this.listaInspeccionList = [];
        res.data.forEach(async (dto: any) => {
          let obj = FilterQuery.dtoToObject(dto);
          obj['hash'] = obj.listaInspeccionPK.id + '.' + obj.listaInspeccionPK.version;

          try {
            let userFilterQuery = new FilterQuery();
            let user: any = JSON.parse(localStorage.getItem('session')!);
            userFilterQuery.filterList = [
              {field: 'usuarioEmpresaList.usuario.id', criteria: Criteria.EQUALS, value1: user.usuario.id, value2: null}
            ]
            let userP: any = await this.userService.findByFilter(userFilterQuery);
            sessionStorage.setItem('userP', JSON.stringify(userP.data));

            userP.data.forEach((profile: any) => {
              let perfilArray = JSON.parse(obj.fkPerfilId);
              // console.log('161:', perfilArray, profile);
              
              if(perfilArray.find((x: any) => x === profile.id) !== undefined) {
                // console.log('164', perfilArray.find((x:any) => x === profile.id))
                if(!this.listaInspeccionList.find(element => element === obj)) {
                  // console.log('166', this.listaInspeccionList.);
                  this.listaInspeccionList.push(obj);
                  this.listasInspeccionList.push({label: obj.codigo + ' - ' + obj.nombre + ' V' + obj.listaInspeccionPK.version, value: obj.listaInspeccionPK });
                }
              }
            });
          } catch (error) {
            console.error(error);
          }
        });
      }
    ).catch(err => console.error(err));
  }

  async loadEmpresasAliadas(){
    let idEmpresa: string = this.sesionService.getParamEmp(); 
    let filterQuery = new FilterQuery();
    filterQuery.sortField = "id";
    filterQuery.sortOrder = 1;
    filterQuery.filterList = [
      {criteria: Criteria.EQUALS, field: 'idEmpresaAliada', value1: idEmpresa},
      {criteria: Criteria.IS_NOT_NULL, field: 'tipoPersona'}
    ]

    await this.empresaService.findByFilter(filterQuery).then(
      (res: any) => {
        // console.log(res);
        this.empresasAliadas = Array.from(res.data);
        this.empresasAliadasOption = [];
        this.empresasAliadas.forEach(emp => {
          this.empresasAliadasOption.push({label: emp.razonSocial + ' - ' + emp.nit, value: emp})
        })
      },
      (reason: any) => {
        console.error('Error al obtener lista de aliados: ', reason);
      }
    );
  }

  async loadLocalidades(){
    this.empresaService.getLocalidades().then(
      (res: Localidades[]) => {
        this.localidades = Array.from(res);
        this.localidadesOption = [];
        this.localidades.forEach(localidad => {
          this.localidadesOption.push({label: localidad.localidad, value: localidad});
        })
      },
      (reason: any) => {
        console.error('Error al obtener localidades', reason);
      }
    )
  }

  actualizarEventos(filters?: Filter[]): Promise<EventInput[]> {

    return new Promise((resolve, reject) => {let filterQuery = new FilterQuery();

      filterQuery.filterList = [
        { criteria: Criteria.IS_NOT_NULL, field: 'empresaAliada'}
      ];
  
      filterQuery.fieldList = [
        'id',
        'fecha',
        'listaInspeccion_listaInspeccionPK',
        'listaInspeccion_fkPerfilId',
        'numeroInspecciones',
        'numeroRealizadas',
        'localidad',
        // 'empresaAliada',
        // 'empleadoBasic',
        // 'serie'
      ];
      if(filters) filterQuery.filterList.push(...filters);
  
      if(this.calendarComponent && this.calendarComponent.getApi().getCurrentData()) {
        let calendarData = this.calendarComponent.getApi().getCurrentData();
        let filters: Filter[] = [];
        filters.push({
          criteria: Criteria.BETWEEN,
          field: 'fecha',
          value1: calendarData.getCurrentData().dateProfile.renderRange.start.toISOString(),
          value2: calendarData.getCurrentData().dateProfile.renderRange.end.toISOString()
        });
        filterQuery.filterList.push(...filters);
      }

      this.progLoading = true;
      this.events = [];
      this.event = {} as EventInput;
      let userP: any[] = JSON.parse(sessionStorage.getItem('userP') ?? '[]');
      try {
        this.programacionService.findAuditoriasWithFilter(filterQuery)
          .then((data: any) => {
  
            let array = <any[]>data['data'];
            let objArray: any[] = [];
  
            array.forEach(dto => {
              objArray.push(FilterQuery.dtoToObject(dto));
            });
  
            this.matriz = [];
            this.events = [];
  
            this.programacionList = objArray;
  
            objArray.forEach(element => {
              let matrizData: MatrizList = {
                dia: new Date,
                programacionList: []
              }
              // debugger
              let perfilesLista: number[] = JSON.parse(element?.listaInspeccion?.fkPerfilId ?? '[]') ?? [];
              let tienePermiso: boolean = false;
              for(let pr of userP){
                if(perfilesLista.includes(pr.id)){
                  tienePermiso = true;
                  break;
                }
              }
              if(!tienePermiso) return;

              this.matriz?.push(matrizData);
  
              var _color = '#007AD9';
              if (element.numeroRealizadas == element.numeroInspecciones) {
                _color = 'green';
              }
  
              this.event = {
                id: element.id,
                title: element.numeroRealizadas + '/' + element.numeroInspecciones + ' Insp. en ' + element.localidad.localidad,
                start: new Date(element.fecha),
                end: new Date(element.fecha + 3600000),
                color: _color,
              }
              this.events.push(this.event)
            });

            this.progLoading = false;
            resolve(this.events);
          })
          .catch(err => {
            this.progLoading = false;
            reject(err);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  empresasAliadasIds(): string{
    let idList: string[] = this.empresasAliadas.map(emp => {
      return emp.id!;
    });
    return '{' + idList.join(',') + '}';
  }


  esBisiesto(year: number) {
    return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? true : false;
  }

  openProg(prog: Programacion) {
    this.actualizar = true;
    this.adicionar = false;
    this.value = prog.id.toString().toLowerCase();
    let programacion: Programacion = this.programacionList.filter(pg => pg.id == prog.id)[0] ?? null;
    this.deshabilitarEvento = programacion.numeroInspecciones == programacion.numeroRealizadas;
    this.visibleDlg = true;
  }

  openProg2(prog: Programacion) {
    this.visibleDlg = true;
    this.actualizar = true;
    this.adicionar = false;
    this.fechaSelect = prog.fecha;
    this.form.patchValue({
      id: prog.id,
      numeroInspecciones: prog.numeroInspecciones,
      listaInspeccionPK: prog.listaInspeccion.listaInspeccionPK,
      area: prog.area
    });
    this.btnInspDisable = prog.numeroRealizadas == prog.numeroInspecciones;
    if (prog.numeroRealizadas && prog.numeroRealizadas > 0) {
      this.form.disable();
    } else {
      this.form.enable();
    }

    if (!this.permiso) this.form.disable();
  }

  openDlg(event: any) {
    this.visibleDlg = true;
    this.actualizar = false;
    this.adicionar = true;
    this.deshabilitarEvento = false;
    this.fechaSelect = event.date;
  }

  onSubmit() {
    // console.log('obsbm');
    
    this.loading = true;
    if (this.adicionar) {
      if (this.form.value.unidadFrecuencia == null || this.form.value.valorFrecuencia == null || this.form.value.fechaHasta == null) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Campos incompletos',
          detail: 'Debe establecer la frecuencia de las inspecciones'
        });
        return;
      }
      let programacionList: Array<Programacion> = [];
      this.generarProgramaciones(
        programacionList,
        this.form.value.unidadFrecuencia,
        this.form.value.valorFrecuencia,
        this.fechaSelect,
        this.form.value.fechaHasta,

      );
      if (programacionList.length == 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Programacion no generada',
          detail: 'La programacion no ha sido generada, por favor revise la configuracion establecida'
        });
        this.loading = false;
        return;
      }
      let count = 1;
      programacionList.forEach(programacion => {
        // console.log(programacion);
        this.programacionService.createAuditoria(programacion)
          .then(data => {
            let ultimo = (programacionList.length <= count);
            this.manageResponse(<Programacion>data, ultimo);
            count++;
            if (ultimo) {
              this.loading = false;
            }
          })
          .catch(err => {
            this.loading = false;
          })
          .finally(() => {
            this.actualizarEventos();
          });
      });
    } else {
      let programacion = this.crearProgramacion(this.fechaSelect);
      programacion.id = this.form.value.id;
      this.programacionService.updateAuditoria(programacion)
        .then(data => {
          this.loading = false;
          this.manageResponse(<Programacion>data, true);
        })
        .catch(err => {
          this.loading = false;
        }).finally(() => {
          this.actualizarEventos();
        });
    }

  }

  generarProgramaciones(list: Array<Programacion>, unidadFrecuencia: string, valorFrecuencia: number, fechaDesde: Date, fechaHasta: Date) {
    for (let fechaSiguiente = new Date(fechaDesde); fechaSiguiente.getTime() <= fechaHasta.getTime();) {

      let semana = this.form.value.semana == null ? [] : this.form.value.semana;

      let incluirDia = semana.indexOf(fechaSiguiente.getDay().toString()) >= 0;
      if (!incluirDia) {
        fechaSiguiente.setDate(fechaSiguiente.getDate() + 1);
        continue;
      }

      let programacion = this.crearProgramacion(new Date(fechaSiguiente));
      list.push(programacion);

      switch (unidadFrecuencia) {
        case 'diario':
          fechaSiguiente.setDate(fechaSiguiente.getDate() + valorFrecuencia);
          break;
        case 'semana':
          fechaSiguiente.setDate(fechaSiguiente.getDate() + (valorFrecuencia * 7));
          break;
        case 'mes':
          fechaSiguiente.setMonth(fechaSiguiente.getMonth() + valorFrecuencia);
          break;
      }
    }
  }

  crearProgramacion(fecha: Date) {
    let programacion = {} as Programacion;
    programacion.fecha = fecha;
    // programacion.area = this.form.value.area;
    programacion.localidad = this.form.value.localidad;
    programacion.empresaAliada = this.form.value.empresaAliada;
    programacion.empleadoBasic = JSON.stringify(this.form.value.empleadoBasic);
    if (this.form.value.listaInspeccionPK != null) {
      programacion.listaInspeccion = {} as ListaInspeccion;
      programacion.listaInspeccion.listaInspeccionPK = this.form.value.listaInspeccionPK;
    }
    programacion.numeroInspecciones = this.form.value.numeroInspecciones;
    return programacion;
  }


  findMatrizValue(fecha: Date) {

    for (let i = 0; i < this.matriz!.length; i++) {
      // for (let j = 0; j < this.matriz![i].length; j++) {
      //   // if (this.matriz![i][j] != null && this.matriz![i][j].dia.valueOf() === fecha.valueOf()) {
      //   //   return this.matriz![i][j];
      //   // }
      // }
    }
  }

  manageResponse(prog: Programacion, mostrarMsg: boolean) {
    let matrizValue = this.findMatrizValue(prog.fecha);

    if (this.actualizar) {
      // for (let i = 0; i < matrizValue.programacionList.length; i++) {
      //   if (matrizValue.programacionList[i].id = prog.id) {
      //     matrizValue.programacionList[i] = prog;
      //     break;
      //   }
      // }
    } else if (matrizValue != null) {
      // matrizValue.programacionList = matrizValue.programacionList == null ? [] : matrizValue.programacionList;
      // matrizValue.programacionList.push(prog);
    }
    if (mostrarMsg) {
      this.messageService.add({
        severity: 'success',
        summary: 'Programación ' + (this.actualizar ? 'actualizada' : 'creada'),
        detail: 'Se ha ' + (this.actualizar ? 'actualizado' : 'creado') + ' correctamente la programacion'
      });
      this.visibleDlg = false;
    }

  }

  eliminarProgramacion() {
    this.loading = true;
    let programacionId = this.form.value.id;
    this.programacionService.delete(programacionId)
      .then(data => {
        let matrizValue = this.findMatrizValue(this.fechaSelect);
        this.visibleDlg = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Programación eliminada',
          detail: 'Se ha eliminado correctamente la programacion'
        });
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      })
      .finally(() => {
        this.actualizarEventos();
      });
  }

  irInspeccion() {
    let programacionId = this.form.value.id;
    let matrizValue = this.findMatrizValue(this.fechaSelect);
    let programacion: Programacion;
    this.paramNav.setParametro<Programacion>(programacion!);
    this.paramNav.setAccion<string>('POST');
    this.paramNav.redirect('/app/ctr/elaboracionAuditoriaCicloCorto');
  }

  irInspeccion2() {
    let programacionId = this.form.value.id;
    let matrizValue = this.findMatrizValue(this.fechaSelect);

    this.paramNav.setParametro<Programacion>(this.programacionList.find(prog => prog.id === this.form.value.id)!);
    this.paramNav.setAccion<string>('POST'); 
    this.paramNav.redirect('/app/ctr/elaboracionAuditoriaCicloCorto/' + this.form.value.listaInspeccionPK.id + "/" + this.form.value.listaInspeccionPK.version);
    let fecha: Date;
    fecha = new Date;
  }

  eventListener(event: any) {
    this.openProg(this.programacionList.find((x) => x.id == event.event.id)!);
  }

  openDlgFiltros(){
    this.visibleDlgFiltros = true;
  }

  onReceiveEmpleadoBasic(event?: EmpleadoBasic) {
    this.form.get('empleadoBasic')?.setValue(event);
  }

  async applyFilter(){
    let localidades: any[] = this.formFilters.value.localidades;
    let empresas: any[] = this.formFilters.value.empresasAliadas;
    let empleado: any = this.formFilters.value.empleado;

    let filterList: Filter[] = [];
    if(localidades && localidades.length > 0) filterList.push({criteria: Criteria.CONTAINS, field: 'localidad.id', value1: this.getIdsForFilter(localidades)});
    if(empresas && empresas.length > 0) filterList.push({criteria: Criteria.CONTAINS, field: 'empresaAliada.id', value1: this.getIdsForFilter(empresas)});
    if(empleado) filterList.push({criteria: Criteria.LIKE, field: 'empleadoBasic', value1: '%' + empleado.usuarioBasic.email + '%'});

    this.actualizarEventos(filterList);
    this.visibleDlgFiltros = false;
  }

  getIdsForFilter(event: any[]): string{
    let ids = <number[]>event.map(item => {
      return item.id;
    });
    return '{' + ids.join(',') + '}';
  }

  cleanFilters(){
    this.formFilters.reset();
  }

  onChangeProgramacionEvento(event: boolean) {
    if(event) {
      // this.actualizarEventos()
      this.applyFilter()
      .then(() => {
        console.info('Eventos actualizados');
      }).catch(() => {
        console.error('Error al actualizar eventos');
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al cargar eventos'});
      });
    }
  }
}


export interface EventList {
  id: number,
  title: string,
  start: Date,
  end?: Date | null,
  description?: string | null,
  textColor?: string | null,
  color?: string | null
}

export interface MatrizList {
  dia: Date,
  programacionList: Programacion[]
}
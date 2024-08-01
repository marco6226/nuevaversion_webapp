import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { PerfilService } from '../../../admin/services/perfil.service';
import { Criteria, Filter } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';
import { SesionService } from '../../../core/services/session.service';
import { locale_es } from '../../../rai/entities/reporte-enumeraciones';
import { ListaInspeccion } from '../../entities/lista-inspeccion';
import { Programacion } from '../../entities/programacion';
import { ListaInspeccionService } from '../../services/lista-inspeccion.service';
import { ProgramacionService } from '../../services/programacion.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { PrimeNGConfig } from 'primeng/api';
import { CalendarOptions, EventSourceInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.scss']
})
export class ProgramacionComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  localeES: any = locale_es;
  anioSelect!: number;
  mesSelect!: number;
  matriz?: MatrizList[] = [];
  aniosList!: SelectItem[];
  listasInspeccionList: SelectItem[] = [{ label: '--Seleccione--', value: null }];
  visibleDlg!: boolean;
  fechaSelect!: Date;
  form!: FormGroup;
  actualizar!: boolean;
  adicionar!: boolean;
  btnInspDisable!: boolean;
  visibleProgMasiva!: boolean;
  fechaMaxima!: Date;
  semanaLaboral = ['1', '2', '3', '4', '5',];
  listaInspeccionList!: ListaInspeccion[];
  areasPerm!: string;
  loading: boolean = false;
  progLoading: boolean = false;
  permiso: boolean = false;;
  totalRecords!: number;

  calendarOptions!: CalendarOptions;
  // events!: any[];
  events: EventList[] = [];
  event!: EventList;

  programacionList: Programacion[] = []

  periodicidadList: SelectItem[] = [
    { label: 'Dia(s)', value: 'diario' },
    { label: 'Semana(s)', value: 'semana' },
    { label: 'Mes(es)', value: 'mes' },
  ];

  fechaSelected: Date | null = null;
  value: string | null = null;
  deshabilitarEvento: boolean = false;
  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent | undefined;

  constructor(
    private sesionService: SesionService,
    private userService: PerfilService,
    private paramNav: ParametroNavegacionService,
    private programacionService: ProgramacionService,
    private listaInspeccionService: ListaInspeccionService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private config: PrimeNGConfig,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      id: null,
      numeroInspecciones: ['', Validators.required],
      listaInspeccionPK: ['', Validators.required],
      area: ['', Validators.required],
      unidadFrecuencia: null,
      valorFrecuencia: null,
      fechaHasta: null,
      semana: null
    });
  }

  async ngOnInit() {
    this.config.setTranslation(this.localeES);
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, ],
      initialDate: new Date(),
      locale: esLocale,
      dateClick: this.openDlg.bind(this),
      headerToolbar: {
        left: 'prev today',
        center: 'title',
        right: 'next'
        // right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      eventClick: this.eventListener.bind(this),
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      displayEventTime: false,
      firstDay: 0
    };

    this.areasPerm = this.sesionService.getPermisosMap()['INP_GET_PROG'].areas;
    
    try {
      this.loadListasInspeccion().then(() => {
        try {
          this.actualizarEventos();
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar eventos.'
          });
        }
      }).catch((e) => {
        throw new Error(e)
      });
    } catch (e) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al cargar listas de inspección.'});
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    
    // console.log(this.calendarComponent);
    this.calendarComponent?.getApi().on('datesSet', () => {
      // console.log('upev');
      this.actualizarEventos();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    sessionStorage.removeItem('userP');
  }

  async loadListasInspeccion(){
    let user: any = JSON.parse(localStorage.getItem('session')!);
    let filterQuery = new FilterQuery();


    filterQuery.filterList = [{
      field: 'usuarioEmpresaList.usuario.id',
      criteria: Criteria.EQUALS,
      value1: user.usuario.id,
      value2: null
    }];

    const userP = await this.userService.findByFilter(filterQuery);

    let userParray: any = userP;
    sessionStorage.setItem('userP', JSON.stringify(userParray.data));
    filterQuery = new FilterQuery();
    filterQuery.filterList = [{
      field: 'estado',
      criteria: Criteria.EQUALS,
      value1: 'activo',
      value2: null
    }];

    this.listaInspeccionService.findByFilter(filterQuery).then((resp: any) => {
      this.listaInspeccionList = [];
      resp.data.forEach((dto: any) => {
        let obj = FilterQuery.dtoToObject(dto)
        obj['hash'] = obj.listaInspeccionPK.id + '.' + obj.listaInspeccionPK.version;
        try {
          userParray.data.forEach((profile: any) => {
            let perfilArray = JSON.parse(obj.fkPerfilId)
            if (perfilArray.find((x: any) => x == profile.id) != undefined) {
              if (!this.listaInspeccionList.find(element => element == obj)) {
                this.listaInspeccionList.push(obj);
                this.listasInspeccionList.push({ label: obj.codigo + ' - ' + obj.nombre + ' v' + obj.listaInspeccionPK.version, value: obj.listaInspeccionPK });
              }
            }
          });
        }
        catch (error) {
        }
      });
    });
  }

  actualizarEventos() {
    return new Promise((resolve, reject) => {
      let filterQuery = new FilterQuery();

      filterQuery.filterList = [
        { criteria: Criteria.CONTAINS, field: 'area.id', value1: this.areasPerm },
        {criteria: Criteria.NOT_EQUALS, field: 'listaInspeccion.tipoLista', value1: 'Signos Vitales'}

      ];

      filterQuery.fieldList = [
        'id',
        'fecha',
        'listaInspeccion_listaInspeccionPK',
        'listaInspeccion_fkPerfilId',
        'area_id',
        'area_nombre',
        'numeroInspecciones',
        'numeroRealizadas'
      ];

      if(this.calendarComponent) {
        let calendarData =  this.calendarComponent.getApi().getCurrentData();
        filterQuery.filterList.push({
          criteria: Criteria.BETWEEN,
          field: 'fecha',
          value1: calendarData.getCurrentData().dateProfile.renderRange.start.toISOString(),
          value2: calendarData.getCurrentData().dateProfile.renderRange.end.toISOString()
        });
      }

      this.progLoading = true;
      try {
        this.programacionService.findByFilter(filterQuery)
        .then((data: any) => {

          let array = <any[]>data['data'];
          let objArray: any[] = [];

          array.forEach(dto => {
            objArray.push(FilterQuery.dtoToObject(dto));
          });

          this.matriz = [];
          this.events = [];

          this.programacionList = objArray;
          // console.log(this.programacionList);

          let userP: any[] = JSON.parse(sessionStorage.getItem('userP') ?? '[]');
          objArray.forEach(element => {
            let matrizData: MatrizList = {
              dia: new Date,
              programacionList: []
            }

            let perfilLista: number[] = JSON.parse(element?.listaInspeccion?.fkPerfilId ?? '[]') ?? [];
            // console.log(userP);
            let tienePermiso: boolean = false;
            for(let pr of userP){
              if(perfilLista.includes(pr.id)){
                tienePermiso = true;
                break;
              }
            }
            if(!tienePermiso) return;
            // debugger
            this.matriz?.push(matrizData);

            var _color = '#007AD9';
            if (element.numeroRealizadas == element.numeroInspecciones) {
              _color = 'green';
            }

            this.event = {
              id: element.id,
              title: element.numeroRealizadas + '/' + element.numeroInspecciones + 'Insp. en ' + element.area.nombre,
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
    })
  }


  esBisiesto(year: number) {
    return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? true : false;
  }

  openProg(prog: any) {
    this.actualizar = true;
    this.adicionar = false;
    this.value = prog.id.toString().toLowerCase();
    this.deshabilitarEvento = prog.numeroInspecciones == prog.numeroRealizadas;
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
    this.fechaSelected = event.date;
    // this.actualizarEventos();
  }

  onSubmit() {

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
        this.form.value.fechaHasta
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
        this.programacionService.create(programacion)
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
      this.programacionService.update(programacion)
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
    programacion.area = this.form.value.area;
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
    this.paramNav.redirect('/app/inspecciones/elaboracionInspecciones');
  }

  irInspeccion2() {
    let programacionId = this.form.value.id;
    let matrizValue = this.findMatrizValue(this.fechaSelect);

    this.paramNav.setParametro<Programacion>(this.programacionList.find(prog => prog.id === this.form.value.id)!);
    this.paramNav.setAccion<string>('POST');
    this.paramNav.redirect('/app/inspecciones/elaboracionInspecciones/' + this.form.value.listaInspeccionPK.id + "/" + this.form.value.listaInspeccionPK.version);
    let fecha: Date;
    fecha = new Date;
  }

  eventListener(event: any) {
    this.openProg(this.programacionList.find((x) => x.id == event.event.id)!);
  }

  onChangeProgramacionEvento(event: boolean) {
    if(event) {
      this.actualizarEventos()
      .then(() => {})
      .catch(() => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'No fue posible cargar los eventos.'});
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
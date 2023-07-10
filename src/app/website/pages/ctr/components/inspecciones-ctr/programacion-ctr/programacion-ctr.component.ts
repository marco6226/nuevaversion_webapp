import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { PrimeNGConfig } from 'primeng/api';
import { CalendarOptions } from '@fullcalendar/core';
import { locale_es } from 'src/app/website/pages/comun/entities/reporte-enumeraciones';
import { ListaInspeccion } from 'src/app/website/pages/inspecciones/entities/lista-inspeccion';
import { Programacion } from 'src/app/website/pages/inspecciones/entities/programacion';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { PerfilService } from 'src/app/website/pages/admin/services/perfil.service';
import { ParametroNavegacionService } from 'src/app/website/pages/core/services/parametro-navegacion.service';
import { ProgramacionService } from 'src/app/website/pages/inspecciones/services/programacion.service';
import { ListaInspeccionService } from 'src/app/website/pages/inspecciones/services/lista-inspeccion.service';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { Criteria } from 'src/app/website/pages/core/entities/filter';
import { Localidades } from '../../../entities/aliados';
import { EmpresaService } from 'src/app/website/pages/empresa/services/empresa.service';
import { Empresa } from 'src/app/website/pages/empresa/entities/empresa';

@Component({
  selector: 'app-programacion-ctr',
  templateUrl: './programacion-ctr.component.html',
  styleUrls: ['./programacion-ctr.component.scss'],
  providers: [EmpresaService]
})
export class ProgramacionCtrComponent implements OnInit {

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
  empresas: Empresa[] = [];
  empresasOption: {label: string; value: Empresa}[] = [];

  calendarOptions!: CalendarOptions;
  // events!: any[];
  events: EventList[] = [];
  event!: EventList;

  programacionList: Programacion[] = [];

  periodicidadList: SelectItem[] = [
    { label: 'Dia(s)', value: 'diario' },
    { label: 'Semana(s)', value: 'semana' },
    { label: 'Mes(es)', value: 'mes' },
  ];

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
  ) {
    this.form = this.fb.group({
      id: null,
      numeroInspecciones: ['', Validators.required],
      listaInspeccionPK: ['', Validators.required],
      area: null,
      empresa: [null, Validators.required],
      localidad: [null, Validators.required],
      unidadFrecuencia: null,
      valorFrecuencia: null,
      fechaHasta: null,
      semana: null
    });

    this.formFilters = this.fb.group({
      localidades: [null],
      empresas: [null]
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
      dayMaxEvents: true
    };

    //Revisar si se puede editar programaciones
    let permiso = this.sesionService.getPermisosMap()['INP_PUT_PROG'];
    // // let empresa = this.sesionService.getEmpresa();
    if (permiso != null && permiso.valido == true) {
      this.permiso = true;
    }

    // lISTAS DE INSPECCIONES DISPONIBLES AQUÍ
    this.loadListaDeInspecciones();

    this.form.controls['area'].disabled;
    this.loadLocalidades();
    await this.loadEmpresasAliadas()
    .finally(() => {  
      this.actualizarEventos();
    });

  }

  async loadListaDeInspecciones(){
    let filterQuery = new FilterQuery();
    filterQuery.filterList = [{
      field: 'estado',
      criteria: Criteria.NOT_EQUALS,
      value1: 'inactivo',
      value2: null
    }];

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
        this.empresas = Array.from(res.data);
        this.empresasOption = [];
        this.empresas.forEach(emp => {
          this.empresasOption.push({label: emp.razonSocial ?? '', value: emp})
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

  async actualizarEventos() {

    let filterQuery = new FilterQuery();

    filterQuery.filterList = [
      { criteria: Criteria.CONTAINS, field: 'empresa.id', value1: this.empresasAliadasIds()}
    ];

    filterQuery.fieldList = [
      'id',
      'fecha',
      'listaInspeccion_listaInspeccionPK',
      'area_id',
      'area_nombre',
      'numeroInspecciones',
      'numeroRealizadas',
      'localidad',
      'empresa'
    ];

    this.progLoading = true;
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
        })
        .catch(err => {
          this.progLoading = false;
        });
    } catch (error) {
    }

    this.event = {
      id: 0,
      title: '',
      start: new Date('1/1/1990'),
      description: ''
    }

    this.events = []
    this.events.push(this.event)
  }

  empresasAliadasIds(): string{
    let idList: string[] = this.empresas.map(emp => {
      return emp.id!;
    });
    return '{' + idList.join(',') + '}';
  }


  esBisiesto(year: number) {
    return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? true : false;
  }

  openProg(prog: any) {
    this.visibleDlg = true;
    this.actualizar = true;
    this.adicionar = false;
    this.fechaSelect = prog.fecha;
    console.log(prog);
    this.form.patchValue({
      id: prog.id,
      numeroInspecciones: prog.numeroInspecciones,
      listaInspeccionPK: prog.listaInspeccion.listaInspeccionPK,
      area: null,
      localidad: prog.localidad,
      empresa: prog.empresa
    });
    this.btnInspDisable = prog.numeroRealizadas == prog.numeroInspecciones;
    if (prog.numeroRealizadas > 0) {
      this.form.disable();
    } else {
      this.form.enable();
    }

    if (!this.permiso) this.form.disable();
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
    if (prog.numeroRealizadas > 0) {
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
    this.fechaSelect = event.date;
    this.form.reset();
    this.form.enable();
    this.form.patchValue({
      fechaHasta: this.fechaSelect,
      unidadFrecuencia: 'diario',
      valorFrecuencia: 1,
      semana: this.semanaLaboral
    });
    // this.actualizarEventos();
  }

  onSubmit() {
    console.log('obsbm');
    
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
        console.log(programacion);
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
    programacion.empresa = this.form.value.empresa;
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
    this.openProg(this.programacionList.find((x) => x.id == event.event.id))
  }

  openDlgFiltros(){
    this.visibleDlgFiltros = true;
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
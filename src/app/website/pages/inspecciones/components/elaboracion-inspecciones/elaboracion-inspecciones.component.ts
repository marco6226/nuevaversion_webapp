import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { Criteria, Filter } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { SistemaNivelRiesgo } from '../../../core/entities/sistema-nivel-riesgo';
import { AuthService } from '../../../core/services/auth.service';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';
import { SesionService } from '../../../core/services/session.service';
import { SistemaNivelRiesgoService } from '../../../core/services/sistema-nivel-riesgo.service';
import { Area } from '../../../empresa/entities/area';
import { Empleado } from '../../../empresa/entities/empleado';
import { Empresa } from '../../../empresa/entities/empresa';
import { Usuario } from '../../../empresa/entities/usuario';
import { EmpleadoService } from '../../../empresa/services/empleado.service';
import { locale_es } from '../../../rai/entities/reporte-enumeraciones';
import { Calificacion } from '../../entities/calificacion';
import { ElementoInspeccion } from '../../entities/elemento-inspeccion';
import { Inspeccion } from '../../entities/inspeccion';
import { ListaInspeccion } from '../../entities/lista-inspeccion';
import { Programacion } from '../../entities/programacion';
import { InspeccionService } from '../../services/inspeccion.service';
import { ListaInspeccionService } from '../../services/lista-inspeccion.service';
import { ListaInspeccionFormComponent } from '../lista-inspeccion-form/lista-inspeccion-form.component';
import { Formulario } from 'src/app/website/pages/comun/entities/formulario';
import { Campo } from 'src/app/website/pages/comun/entities/campo';
import { RespuestaCampo } from 'src/app/website/pages/comun/entities/respuesta-campo';


@Component({
    selector: 'app-elaboracion-inspecciones',
    templateUrl: './elaboracion-inspecciones.component.html',
    styleUrls: ['./elaboracion-inspecciones.component.scss'],
    providers: [DirectorioService, DatePipe]

})
export class ElaboracionInspeccionesComponent implements OnInit {

    @ViewChild('listaInspeccionForm', { static: false }) listaInspeccionForm!: ListaInspeccionFormComponent;

    editable: boolean = false;
    pdfGenerado!: boolean;
    elementoSelect!: ElementoInspeccion;
    listaInspeccion!: ListaInspeccion;
    ElementoInspeccionList!: ElementoInspeccion;
    inspeccion!: Inspeccion;
    inspeccionId!: number;
    programacion!: Programacion;
    nivelRiesgoList: SelectItem[] = [{ label: '--seleccione--', value: null }];
    inspTitlte!: string;
    finalizado!: boolean;
    consultar!: boolean;
    modificar!: boolean;
    adicionar!: boolean;
    formValid!: boolean;
    redireccion!: string;
    empleado!: Empleado;
    empleadoelabora!: Empleado;
    Form!: FormGroup;
    empresa!: Empresa;
    area!: Area;
    initLoading = false;
    solicitando = false;
    listaEvidence: any[] = [];
    firma = [];
    id: any;
    version: any;
    matriz!: any[][];
    accion: any;
    evidencias!: string;
    idDoc: any
    localeES: any = locale_es;
    FormHseq!: FormGroup;
    FormIng!: FormGroup;
    maxDateHse: string = new Date().toISOString();
    minDateHse!: string;
    selectDateHse: any;
    maxDateIngenieria: string = new Date().toISOString();
    minDateIngenieria!: string;
    selectDateIngenieria: any;
    permisoHse: boolean = false;
    permisoIngenieria: boolean = false;
    mostarHseGet: boolean = true;
    mostarIngGet: boolean = true;
    existeEnArray: boolean = false;
    imagenesList: any[] = [];
    imgMap: any = {};
    imgMap2: any = {};
    isEmpleadoValid!: boolean;
    equipo!: string;
    observacion!: string;
    observacion1!: string;
    observacion2!: string;
    flagImprimir!: boolean;
    x: ElementoInspeccion[] = [];
    y = new Array();

    EstadoOptionList = [
        { label: "Disponible", value: "Disponible" },
        { label: "Parado por lluvia", value: "Parado por lluvia" },
        { label: "Reparación", value: "Reparación" },
        { label: "Varado", value: "Varado" },
        { label: "Operativo", value: "Operativo" },
    ];

    CapacidadOptionList = [
        { label: "10Lbs", value: "10Lbs" },
        { label: "15Lbs", value: "15Lbs" },
        { label: "20Lbs", value: "20Lbs" },
        { label: "150Lbs", value: "150Lbs" },
        { label: "3700Grs", value: "3700Grs" },
        { label: "9000Grs", value: "9000Grs" },
        { label: "2,5Gls", value: "2,5Gls" },
    ];

    TipoOptionList = [
        { label: "Multipropósito (ABC)Lbs", value: "Multipropósito (ABC)Lbs" },
        { label: "Agente limpio 123 (ABC)Lbs", value: "Agente limpio 123 (ABC)Lbs" },
        { label: "20Lbs", value: "20Lbs" },
        { label: "150Lbs", value: "150Lbs" },
        { label: "3700Grs", value: "3700Grs" },
        { label: "9000Grs", value: "9000Grs" },
        { label: "2,5Gls", value: "2,5Gls" },
    ];

    listasConPeso: Set<string> = new Set([
        'Ciclo corto'
    ]);
    respuestaCampos: RespuestaCampo[] | null = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private directorioService: DirectorioService,
        private listaInspeccionService: ListaInspeccionService,
        private empleadoService: EmpleadoService,
        private paramNav: ParametroNavegacionService,
        private inspeccionService: InspeccionService,
        private sistemaNivelRiesgoService: SistemaNivelRiesgoService,
        private sesionService: SesionService,
        private datePipe: DatePipe,
        private authService: AuthService,
        private fb: FormBuilder,
        private domSanitizer: DomSanitizer,
        private messageService: MessageService,

    ) { }

    ngOnInit() {
        this.empleado = this.sesionService.getEmpleado()!;
        let filterQuery = new FilterQuery();
        let filter = new Filter();
        filter.criteria = Criteria.EQUALS;
        filter.field = 'seleccionado';
        filter.value1 = 'true';
        filterQuery.filterList = [filter];
        try {
            this.sistemaNivelRiesgoService.findByFilter(filterQuery).then(
                (resp: any) => (<SistemaNivelRiesgo>resp['data'][0])?.nivelRiesgoList.forEach((element: any) => {
                    this.nivelRiesgoList.push({ label: element.nombre, value: element.id });
                })
            );
        } catch (error) {
            console.error('Error en sistema nivel de riesgo service: ', error);
        }

        this.accion = this.paramNav.getAccion<string>();
        if (this.accion == 'POST') {
            this.redireccion = '/app/inspecciones/programacion';
            this.adicionar = true;
            this.programacion = this.paramNav.getParametro<Programacion>();
            this.listaInspeccion = this.programacion == null ? this.inspeccion.listaInspeccion : this.programacion.listaInspeccion;
            this.area = this.programacion == null ? this.inspeccion.area : this.programacion.area;

            let filterQuery = new FilterQuery();

            let filterId = new Filter();
            filterId.criteria = Criteria.EQUALS;
            filterId.field = "listaInspeccionPK.id";
            filterId.value1 = this.listaInspeccion.listaInspeccionPK.id;

            let filterVersion = new Filter();
            filterVersion.criteria = Criteria.EQUALS;
            filterVersion.field = "listaInspeccionPK.version";
            filterVersion.value1 = this.listaInspeccion.listaInspeccionPK.version.toString();

            filterQuery.filterList = [filterId, filterVersion];

            this.initLoading = true;
            this.listaInspeccionService.findByFilter(filterQuery)
                .then((data: any) => {
                    this.initLoading = false;
                    this.listaInspeccion = (<ListaInspeccion[]>data['data'])[0]
                })
                .catch(err => {
                    this.initLoading = false;
                });
            this.getTareaEvidences(parseInt(this.listaInspeccion.listaInspeccionPK.id), this.listaInspeccion.listaInspeccionPK.version);


        } else if (this.accion == 'GET' || this.accion == 'PUT') {
            this.redireccion = '/app/inspecciones/consultaInspecciones';
            this.consultar = this.accion == 'GET';
            this.modificar = this.accion == 'PUT';
            this.inspeccion = this.paramNav.getParametro<Inspeccion>();

            let filterQuery = new FilterQuery();
            let filterId = new Filter();
            filterId.criteria = Criteria.EQUALS;
            filterId.field = "id";
            filterId.value1 = this.inspeccion.id.toString();
            this.inspeccionId = this.inspeccion.id;

            filterQuery.filterList = [filterId];
            this.initLoading = true;
            this.inspeccionService.findByFilter(filterQuery)
                .then((data: any) => {
                    this.inspeccion = (<Inspeccion[]>data['data'])[0];

                    this.equipo = this.inspeccion.equipo;
                    this.programacion = this.inspeccion.programacion;
                    this.listaInspeccion = this.programacion == null ? this.inspeccion.listaInspeccion : this.inspeccion.programacion.listaInspeccion;
                    if(this.listaInspeccion?.tipoLista!='Ergonomía'){
                        this.observacion = this.inspeccion.observacion;
                    } else {
                        this.observacion1=JSON.parse(this.inspeccion?.observacion ?? '[null, null]')[0]
                        this.observacion2=JSON.parse(this.inspeccion?.observacion ?? '[null, null]')[1]
                    }
                    this.area = this.programacion == null ? this.inspeccion.area : this.inspeccion.programacion.area;
                    this.getTareaEvidences(parseInt(this.listaInspeccion.listaInspeccionPK.id), this.listaInspeccion.listaInspeccionPK.version);
                    setTimeout(() => {
                        this.empleadoService.findempleadoByUsuario(this.inspeccion.usuarioRegistra?.id!).then(
                            resp => {
                                this.empleadoelabora = <Empleado>(resp);
                            }
                        );
                        this.vistoPermisos();
                    }, 2000);

                    this.listaInspeccion.formulario.campoList.forEach(campo => {
                        for (let i = 0; i < this.inspeccion.respuestasCampoList.length; i++) {
                            let rc = this.inspeccion.respuestasCampoList[i];
                            if (rc.campoId == campo.id) {
                                campo.respuestaCampo = rc;
                                break;
                            }
                        }
                    });
                    this.cargarCalificaciones(this.listaInspeccion.elementoInspeccionList, this.inspeccion.calificacionList);
                    this.initLoading = false;
                })
                .catch(err => {
                    this.initLoading = false;
                });;
        }
        else {
            this.consultar = true;
            let filterQuery = new FilterQuery();
            let filterId = new Filter();
            filterId.criteria = Criteria.EQUALS;
            filterId.field = "id";
            filterId.value1 = this.route.snapshot.paramMap.get('id');
            this.inspeccionId = Number.parseInt(this.route.snapshot.paramMap.get('id')!);

            filterQuery.filterList = [filterId];
            this.initLoading = true;
            this.inspeccionService.findByFilter(filterQuery)
                .then((data: any) => {
                    this.inspeccion = (<Inspeccion[]>data['data'])[0];
                    this.programacion = this.inspeccion.programacion;
                    this.listaInspeccion = this.programacion == null ? this.inspeccion.listaInspeccion : this.inspeccion.programacion.listaInspeccion;
                    this.area = this.programacion == null ? this.inspeccion.area : this.inspeccion.programacion.area;
                    this.getTareaEvidences(parseInt(this.listaInspeccion.listaInspeccionPK.id), this.listaInspeccion.listaInspeccionPK.version);
                    setTimeout(() => {
                        this.empleadoService.findempleadoByUsuario(this.inspeccion.usuarioRegistra?.id!).then(
                            resp => {
                                this.empleadoelabora = <Empleado>(resp);
                            }
                        );
                        this.vistoPermisos();
                    }, 2000);

                    this.listaInspeccion.formulario.campoList.forEach(campo => {
                        for (let i = 0; i < this.inspeccion.respuestasCampoList.length; i++) {
                            let rc = this.inspeccion.respuestasCampoList[i];
                            if (rc.campoId == campo.id) {
                                campo.respuestaCampo = rc;
                                break;
                            }
                        }
                    });
                    this.cargarCalificaciones(this.listaInspeccion.elementoInspeccionList, this.inspeccion.calificacionList);
                    this.initLoading = false;
                })
                .catch(err => {
                    this.initLoading = false;
                });;
        }
        this.precargarDatos(this.listaInspeccion.formulario, this.programacion);
        this.paramNav.reset();
    }

    async precargarDatos(formulario: Formulario, programacion: Programacion) {
        formulario.campoList.forEach((campo:Campo, index: number) => {
            switch(campo.nombre.trim().toLowerCase()) {
                case 'fecha':
                    if(!this.respuestaCampos) this.respuestaCampos = [];
                    let fecha = new Date(); // Obtiene la fecha y hora actuales
                    let dia = fecha.getDate(); // Obtiene el día del mes (1-31)
                    let mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
                    let año = fecha.getFullYear(); // Obtiene el año (cuatro dígitos)
                    let fechaFormateada = `${dia}/${mes}/${año}`;
                    let respuesta3: RespuestaCampo = {} as RespuestaCampo;
                    respuesta3.valor = fechaFormateada;
                    respuesta3.campoId = campo.id;
                    this.respuestaCampos.push(respuesta3);
                    break;
                default:
                    break;
            }
        })
    }

    findMatrizValue(fecha: Date) {
        for (let i = 0; i < this.matriz.length; i++) {
            for (let j = 0; j < this.matriz[i].length; j++) {
                if (this.matriz[i][j] != null && this.matriz[i][j].dia.valueOf() === fecha.valueOf()) {
                    return this.matriz[i][j];
                }
            }
        }
    }

    private cargarCalificaciones(elemList: ElementoInspeccion[], calificacionList: Calificacion[]) {
        for (let i = 0; i < elemList.length; i++) {
            if (elemList[i].elementoInspeccionList != null && elemList[i].elementoInspeccionList.length > 0) {
                let calif = this.buscarCalificacion(elemList[i], calificacionList);
                if(calif !== null) elemList[i].calificacion = calif;
                this.cargarCalificaciones(elemList[i].elementoInspeccionList, calificacionList);
            } else {
                let calif = this.buscarCalificacion(elemList[i], calificacionList)!;
                elemList[i].calificacion = calif;
            }
        }
    }

    private buscarCalificacion(elem: ElementoInspeccion, calificacionList: Calificacion[]): Calificacion | null {
        for (let i = 0; i < calificacionList.length; i++) {
            if (calificacionList[i].elementoInspeccion.id === elem.id) {                
                return calificacionList[i];
            }
        }
        return null;
    }

    async onSubmit() {
        let calificacionList: Calificacion[] = [];
        try {
            this.extraerCalificaciones(this.listaInspeccion.elementoInspeccionList, calificacionList);

            let inspeccion: Inspeccion = new Inspeccion();
            inspeccion.area = this.area;
            inspeccion.listaInspeccion = this.listaInspeccion;
            inspeccion.programacion = this.programacion;
            inspeccion.calificacionList = calificacionList;
            inspeccion.calificacionList[0].opcionCalificacion = calificacionList[0].opcionCalificacion;
            inspeccion.respuestasCampoList = [];
            inspeccion.equipo = this.equipo;
            if(this.listaInspeccion?.tipoLista=='Ergonomía'){inspeccion.observacion =  JSON.stringify([this.observacion1,this.observacion2])}
            else {inspeccion.observacion = this.observacion;}
            this.listaInspeccion.formulario.campoList.forEach(campo => {
                if (campo.tipo == 'multiple_select' && campo.respuestaCampo.valor != null) {
                    let arraySelection = (<string[]>campo.respuestaCampo.valor);
                    if (arraySelection.length > 0) {
                        let valorArray: string = "";
                        arraySelection.forEach(element => {
                            valorArray += element + ';';
                        });
                        valorArray = valorArray.substring(0, valorArray.length - 1);
                        campo.respuestaCampo.valor = valorArray;
                    } else {
                        campo.respuestaCampo.valor = null;
                    }
                }
                campo.respuestaCampo.campoId = campo.id;
                inspeccion.respuestasCampoList.push(campo.respuestaCampo);
            });

            this.solicitando = true;
            if (this.adicionar) {
                this.inspeccionService.create(inspeccion)
                    .then(data => {
                        this.manageResponse(<Inspeccion>data);
                        this.solicitando = false;
                    })
                    .catch(err => {
                        this.solicitando = false;
                    });
            } else {

                if ((this.FormHseq.value.concepto == 'Aceptado' || this.FormHseq.value.concepto == 'Denegado') && this.inspeccion.empleadohse != null) {
                    inspeccion.fechavistohse = this.FormHseq.value.fecha;
                    inspeccion.empleadohse = this.inspeccion.empleadohse;
                    inspeccion.conceptohse = this.FormHseq.value.concepto;
                }
                else if (this.FormIng.value.concepto == 'Aceptado' || this.FormIng.value.concepto == 'Denegado') {
                    inspeccion.fechavistohse = this.FormHseq.value.fecha;
                    inspeccion.empleadohse = this.empleado;
                    inspeccion.conceptohse = this.FormHseq.value.concepto;
                }
                else {
                    inspeccion.fechavistohse = this.inspeccion.fechavistohse
                    inspeccion.empleadohse = this.inspeccion.empleadohse;
                    inspeccion.conceptohse = this.inspeccion.conceptohse;
                }

                if ((this.FormIng.value.concepto == 'Aceptado' || this.FormIng.value.concepto == 'Denegado') && this.inspeccion.empleadoing != null) {
                    inspeccion.fechavistoing = this.FormIng.value.fecha;
                    inspeccion.empleadoing = this.inspeccion.empleadoing;
                    inspeccion.conceptoing = this.FormIng.value.concepto;
                }
                else if (this.FormIng.value.concepto == 'Aceptado' || this.FormIng.value.concepto == 'Denegado') {
                    inspeccion.fechavistoing = this.FormIng.value.fecha;
                    inspeccion.empleadoing = this.empleado;
                    inspeccion.conceptoing = this.FormIng.value.concepto;
                }
                else {
                    inspeccion.fechavistoing = this.inspeccion.fechavistoing
                    inspeccion.empleadoing = this.inspeccion.empleadoing;
                    inspeccion.conceptoing = this.inspeccion.conceptoing;
                }
                inspeccion.id = this.inspeccionId
                this.inspeccionService.update(inspeccion)
                    .then(data => {
                        this.manageResponse(<Inspeccion>data);
                        this.solicitando = false;
                    })
                    .catch(err => {
                        this.solicitando = false;
                    });
            }
            if (this.accion === 'POST') {

                this.inspeccion = inspeccion;
            }
        } catch (error: any) {
            this.messageService.add({ severity: 'warn', detail: error });
        }



        let nocumple = <Calificacion[]><unknown>this.inspeccion.calificacionList;


        nocumple = nocumple.filter(function (element) {
            return element.opcionCalificacion.valor === 0;
        });

        let arrraynocumple: any = [];

        let var2 = nocumple.map(item => {
            arrraynocumple.push(item.elementoInspeccion.id)
            return arrraynocumple;
        })


        let criticos = <ElementoInspeccion[]><unknown>this.listaInspeccion.elementoInspeccionList;
        let var1 = []

        for (let idx = 0; idx < criticos.length; idx++) {

            let criticosInterno = <ElementoInspeccion[]><unknown>this.listaInspeccion.elementoInspeccionList[idx].elementoInspeccionList;



            var1.push(criticosInterno.filter(function (element) {
                return element.criticidad === 'Alto' || element.criticidad === 'Medio' || element.criticidad === 'Muy Alto';

            }));

        }
        let obj2 = JSON.parse(JSON.stringify(var1));


        const newArray: any[] = []
        for (let idx = 0; idx < var1.length; idx++) {
            let var2 = var1[idx].map(item => {

                newArray.push(item.id, item.criticidad, item.codigo, item.nombre)

                return newArray
            })
        }
        let arrayResultadoVar1: ElementoInspeccion[] = []
        for (let idx = 0; idx < var1.length; idx++) {
            var1[idx].map(item => {

                newArray.push(item.id)
                arrraynocumple.forEach((element: any) => {
                    if (item.id == element) {
                        arrayResultadoVar1.push(item)
                    }
                });

                return newArray
            })
        }




        let dato = this.inspeccion.listaInspeccion.formulario.campoList.filter(item => {
            return item.nombre.includes('Numero económico')
        });

        let numeroeconomico: string;
        let ubicacion: string;

        if (dato.length > 0) {
            let idnumeroeconomico = dato[0].id;



            let dato2 = this.inspeccion.respuestasCampoList.filter(item => {
                return item.campoId.toString().includes(idnumeroeconomico.toString())
            })
            numeroeconomico = dato2[0].valor;

        }

        let dato3 = this.inspeccion.listaInspeccion.formulario.campoList.filter(item => {
            return item.nombre.includes('Ubicación');
        });



        if (dato3.length > 0) {
            const idubicacion = dato3[0].id;



            let dato4 = this.inspeccion.respuestasCampoList.filter(item => {
                return item.campoId.toString().includes(idubicacion.toString());
            })
            ubicacion = dato4[0].valor;

        } else {
            numeroeconomico = "NA"
            ubicacion = "NA"
        }


        await setTimeout(() => {
            if (arrayResultadoVar1.length > 0 && this.finalizado === true) {
                this.authService.sendNotificationhallazgosCriticos(
                    this.inspeccion.id,
                    arrayResultadoVar1, numeroeconomico, ubicacion);
            }
        }, 10000);


    }

    private manageResponse(insp: Inspeccion) {
        this.inspeccion.id = insp.id;
        insp.calificacionList.
            forEach(calificacion => {
                let keyMap = calificacion.elementoInspeccion.id;
                let arrayFile = this.listaInspeccionForm.imgMap[keyMap];
                if (arrayFile != null) {
                    arrayFile.forEach((objFile: any) => {
                        if (objFile != null && objFile.change == true)
                            this.directorioService.uploadv5(objFile.file, null, 'INP', calificacion.id, null, "PUBLICO",null);
                    });
                }
            });

        this.messageService.add({
            severity: 'success',
            summary: 'Inspección ' + (this.adicionar ? 'creada' : 'modificada'),
            detail: 'Se ha ' + (this.adicionar ? 'creado' : 'modificado') + ' correctamente la inspección' + ' INP-' + insp.id
        });
        this.finalizado = true;

    }

    validarRequerirFoto(elementoSelect: ElementoInspeccion) {
        for (let i = 0; i < this.listaInspeccionForm.opciones.length; i++) {
            if (elementoSelect.calificacion.opcionCalificacion.id === this.listaInspeccionForm.opciones[i].id) {
                elementoSelect.calificacion.opcionCalificacion.requerirDoc = this.listaInspeccionForm.opciones[i].requerirDoc;
                elementoSelect.calificacion.opcionCalificacion.valor = this.listaInspeccionForm.opciones[i].valor;
            }
        }

        if (this.accion == 'POST') {
            if (
                elementoSelect != null &&
                elementoSelect.calificacion != null &&
                elementoSelect.calificacion.opcionCalificacion != null &&
                elementoSelect.calificacion.opcionCalificacion.requerirDoc == true &&
                (this.listaInspeccionForm.imgMap[elementoSelect.id] == null || this.listaInspeccionForm.imgMap[elementoSelect.id].length === 0)
            ) {
                throw new Error("Debe especificar al menos una fotografía para la calificación " + elementoSelect.codigo + " " + elementoSelect.nombre + "\" ");
            }
            return true;
        }
        else {
            if (
                elementoSelect != null &&
                elementoSelect.calificacion != null &&
                elementoSelect.calificacion.opcionCalificacion != null &&
                elementoSelect.calificacion.opcionCalificacion.requerirDoc == true &&
                elementoSelect.calificacion.documentosList.length < 1 &&
                (this.listaInspeccionForm.imgMap[elementoSelect.id] == null || this.listaInspeccionForm.imgMap[elementoSelect.id].length === 0)
            ) {
                throw new Error("Debe especificar al menos una fotografía para la calificación " + elementoSelect.codigo + " " + elementoSelect.nombre + "\" ");
            }
            return true;
        }
    }

    validarDescripcion(elementoSelect: ElementoInspeccion) {

        for (let i = 0; i < this.listaInspeccionForm.opciones.length; i++) {
            if (elementoSelect.calificacion.opcionCalificacion.id === this.listaInspeccionForm.opciones[i].id) {
                elementoSelect.calificacion.opcionCalificacion.requerirDesc = this.listaInspeccionForm.opciones[i].requerirDesc;
            }
        }
        elementoSelect.calificacion.recomendacion = elementoSelect.calificacion.recomendacion === undefined ? '' : elementoSelect.calificacion.recomendacion;
        if (
            elementoSelect != null &&
            elementoSelect.calificacion != null &&
            elementoSelect.calificacion.recomendacion != null &&
            elementoSelect.calificacion.opcionCalificacion.requerirDesc === true &&
            (elementoSelect.calificacion.recomendacion == null || elementoSelect.calificacion.recomendacion === '')
        ) {
            throw new Error("Debe agregar una descripción al adjuntar evidencia de la calificación " + elementoSelect.codigo + " " + elementoSelect.nombre + "\" ");
        }
        return true;
    }


    imprimirImagen() {
        let cont1 = 0;
        let cont2 = 0;
        this.inspeccion.calificacionList.forEach(async element => {

            if (element.documentosList.length > 0) { cont1++; }
        })
        if (cont1 == 0) {
            this.flagImprimir = false;
            this.imprimir();
        } else { this.flagImprimir = true; }

        this.x = []
        this.y = []
        this.inspeccion.calificacionList.forEach(async element => {
            if (element.documentosList.length > 0) {
                this.imagenesList = []
                let url = []
                element.elementoInspeccion.data2 = []
                this.x.push(element.elementoInspeccion)
                this.y.push(element.recomendacion)
                // this.x.push(element.opcionCalificacion)
                await element.documentosList.forEach(async element2 => {

                    await this.directorioService.download(element2.id).then(async (data?: any) => {
                        let urlData = await this.domSanitizer.bypassSecurityTrustUrl(await URL.createObjectURL(data));
                        let y = this.x.find((data: any) => {
                            return data.id == element.elementoInspeccion.id
                        })
                        y!.data2!.push({ source: urlData })
                        const img = new Image();
                        cont2++;
                        if (cont1 == cont2) {
                            this.imprimir();
                        }
                    })
                        .catch(err => {
                            this.imagenesList.push({});
                        });
                })
            }
        });


    }

    // 
    private extraerCalificaciones(elemList: ElementoInspeccion[], calificacionList: Calificacion[]) {
        for (let i = 0; i < elemList.length; i++) {
            if (elemList[i].elementoInspeccionList != null && elemList[i].elementoInspeccionList.length > 0) {
                this.extraerCalificaciones(elemList[i].elementoInspeccionList, calificacionList);
                let calif = elemList[i].calificacion;
                if(calif.opcionCalificacion.id && calif.calcularCumplimiento !== null){
                    calif.elementoInspeccion = {} as ElementoInspeccion;
                    calif.elementoInspeccion.id = elemList[i].id;
                    calif.opcionCalificacion = elemList[i].calificacion.opcionCalificacion;
                    calif.tipoHallazgo = null;
                    calificacionList.push(calif);
                }
            } else {

                if (elemList[i].calificacion.opcionCalificacion.id == null) {
                    throw new Error("El elemento \"" + elemList[i].codigo + " " + elemList[i].nombre + "\" aún no ha sido calificado.");
                } else {
                    let calif = elemList[i].calificacion;
                    if (calif.nivelRiesgo != null && calif.nivelRiesgo.id != null && (calif.recomendacion == null || calif.recomendacion == '')) {
                        throw new Error("Se ha establecido un nivel de riesgo para el elemento " + elemList[i].codigo + ". Debe especificar una recomendación");
                    } else {
                        calif.elementoInspeccion = {} as ElementoInspeccion;
                        calif.elementoInspeccion.id = elemList[i].id;
                        calif.opcionCalificacion = elemList[i].calificacion.opcionCalificacion;
                        calificacionList.push(calif);
                        if (this.validarRequerirFoto(elemList[i]) && this.validarDescripcion(elemList[i])) { }
                    }
                }
            }
        }
    }


    actualizarValidacion(valido: boolean) {
        this.formValid = valido;
    }

    volver() {
        this.router.navigate(
            [this.redireccion]
        );
    }
    onElementoClick(event: any) {

    }

    agregarElementos(nodoPlant: HTMLElement, elemInspList: ElementoInspeccion[]) {
        elemInspList.forEach(el => {
            let tr = nodoPlant.cloneNode(true);
            tr.childNodes[0].textContent = el.codigo;
            tr.childNodes[1].textContent = el.nombre;

            tr.childNodes[3].textContent = el.calificable ? "" : "Descripción del hallazgo";
            let count = 3;
            this.listaInspeccion.opcionCalificacionList.forEach(opc => {
                let tdCalf = tr.childNodes[2].cloneNode();
                if (el.calificable) {
                    this.inspeccion.calificacionList.forEach(cal => {
                        if (el.id == cal.elementoInspeccion.id && cal.opcionCalificacion.id === opc.id) {
                            tdCalf.textContent = 'X';
                            tr.childNodes[count].textContent = cal.recomendacion;
                        }
                    });
                } else {
                    tdCalf.textContent = opc.nombre;
                }
                tr.insertBefore(tdCalf, tr.childNodes[count++]);
            });
            nodoPlant!.parentElement!.appendChild(tr);
            if (el.elementoInspeccionList != null && el.elementoInspeccionList.length > 0) {
                this.agregarElementos(nodoPlant, el.elementoInspeccionList);
            }
            tr.childNodes[2].remove();
        });
    }
    test() {
    }
    async imprimir() {

        // this.imprimirImagen()
        let template = document.getElementById('plantilla');
        if (!this.pdfGenerado) {
            const date = new Date(this.inspeccion.fechaRealizada);
            const fechahora = this.datePipe.transform(date, 'dd/MM/yyyy HH:mm');
            template!.querySelector('#P_lista_nombre')!.textContent = await this.listaInspeccion.nombre;
            template!.querySelector('#P_codigo')!.textContent = this.listaInspeccion.codigo;
            template!.querySelector('#P_numero')!.textContent = this.inspeccion.id.toString();
            template!.querySelector('#P_version')!.textContent = '' + this.listaInspeccion.listaInspeccionPK.version;
            template!.querySelector('#P_formulario_nombre')!.textContent = this.listaInspeccion.formulario.nombre;
            template!.querySelector('#P_empresa_logo')!.setAttribute('src', this.sesionService.getEmpresa()!.logo!);
            if (this.empleadoelabora != null) {
                template!.querySelector('#P_firma')!.textContent = this.empleadoelabora.primerNombre + " " + this.empleadoelabora.primerApellido + " ";
                template!.querySelector('#P_cargo')!.textContent = " Cargo: " + this.empleadoelabora.cargo.nombre;
            } else {
                template!.querySelector('#P_firma')!.textContent = this.inspeccion.usuarioRegistra ? this.inspeccion.usuarioRegistra.email! : "";

            }
            let a: string | ArrayBuffer = this.listaInspeccion.listaInspeccionPK.id.toString();
            let b: string | ArrayBuffer = this.listaInspeccion.listaInspeccionPK.version.toString();




            let camposForm = template!.querySelector('#L_campos_formulario');
            const tr = camposForm!.cloneNode(true);
            tr.childNodes[0].textContent = "Ubicación"
            tr.childNodes[1].textContent = this.programacion ? this.programacion.area.nombre : this.inspeccion.area.nombre;
            camposForm!.parentElement!.appendChild(tr);
            const tfecha = camposForm!.cloneNode(true);
            tfecha.childNodes[0].textContent = 'Fecha y Hora de realización'
            tfecha.childNodes[1].textContent = fechahora;
            camposForm!.parentElement!.appendChild(tfecha);
            this.listaInspeccion.formulario.campoList.forEach(campo => {
                let tr = camposForm!.cloneNode(true);
                tr.childNodes[0].textContent = campo.nombre;
                for (let i = 0; i < this.inspeccion.respuestasCampoList.length; i++) {
                    let rc = this.inspeccion.respuestasCampoList[i];
                    if (rc.campoId == campo.id) {
                        tr.childNodes[1].textContent = campo.respuestaCampo.valor;
                        break;
                    }
                }
                camposForm!.parentElement!.appendChild(tr);

            });


            let elemList = template!.querySelector('#L_elementos_lista');
            this.agregarElementos(<HTMLElement>elemList, this.listaInspeccion.elementoInspeccionList);
            elemList!.remove();
            this.pdfGenerado = true;
        }

        setTimeout(() => {
            var WinPrint = window.open('', '_blank');

            WinPrint?.document.write('<style>@media print {th{ background-color: #ccc; font-weight: normal;}}</style>');
            WinPrint!.document.write(template!.innerHTML);
            WinPrint!.document.close();
            WinPrint!.focus();
            WinPrint!.print();
        }, 2000);
    }

    async getTareaEvidences(lista_id: number, version_id: number) {
        try {
            let res: any = await this.listaInspeccionService.getInspeccionImagen(lista_id, version_id);
            if (res) {
                res.files.forEach(async (evidence: string) => {
                    let ev: any = await this.directorioService.download(evidence);
                    this.evidencias = ev;
                    let blob = new Blob([ev]);
                    let reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = (res: any) => {
                        if (ev) {
                            this.listaEvidence.push(reader.result);
                        } else {
                            throw new Error("Ocurrió un problema al consultar las evidencias de la tarea");
                        }
                    }
                });
            }

        } catch (e) {

        }
    }

    async vistoPermisos() {

        this.isEmpleadoValid = this.sesionService.getEmpleado() == null;

        if (this.consultar && this.inspeccion.conceptohse == null) {
            this.mostarHseGet = false;
        }

        if (this.consultar && this.inspeccion.conceptoing == null) {
            this.mostarIngGet = false;
        }


        this.permisoHse = this.sesionService.getPermisosMap()["HSE"];
        this.permisoIngenieria = this.sesionService.getPermisosMap()["INGENIERIA"];

        if (this.permisoHse) {
            this.selectDateHse = this.maxDateHse;
            if (this.inspeccion.conceptohse != null) {
                this.FormHseq = this.fb.group({
                    concepto: [this.inspeccion.conceptohse, Validators.required],
                    usuarioGestiona: [this.inspeccion.empleadohse.primerNombre + " " + this.inspeccion.empleadohse.primerApellido, Validators.required],
                    cargo: [this.inspeccion.empleadohse.cargo.nombre, Validators.required],
                    fecha: [this.inspeccion.fechavistohse, Validators.required]
                });
                this.selectDateHse = this.inspeccion.fechavistohse
            }
            else if (this.sesionService.getEmpleado() != null) {
                this.FormHseq = this.fb.group({
                    concepto: [null, Validators.required],
                    usuarioGestiona: [this.sesionService.getEmpleado()!.primerNombre + " " + this.sesionService.getEmpleado()!.primerApellido, Validators.required],
                    cargo: [this.sesionService.getEmpleado()!.cargo.nombre, Validators.required],
                    fecha: ['', Validators.required]
                });
            }
            else {
                this.FormHseq = this.fb.group({
                    concepto: [null, Validators.required],
                    usuarioGestiona: [null, Validators.required],
                    cargo: [null, Validators.required],
                    fecha: [null, Validators.required]
                });
            }
        }
        else {
            this.FormHseq = this.fb.group({
                concepto: [null, Validators.required],
                usuarioGestiona: [null, Validators.required],
                cargo: [null, Validators.required],
                fecha: [null, Validators.required]
            });
        }

        if (this.permisoIngenieria) {
            this.selectDateIngenieria = this.maxDateIngenieria;
            if (this.inspeccion.conceptoing != null) {
                this.FormIng = this.fb.group({
                    concepto: [this.inspeccion.conceptoing, Validators.required],
                    usuarioGestiona: [this.inspeccion.empleadoing.primerNombre + " " + this.inspeccion.empleadoing.primerApellido, Validators.required],
                    cargo: [this.inspeccion.empleadoing.cargo.nombre, Validators.required],
                    fecha: [this.inspeccion.fechavistoing, Validators.required]
                });
                this.selectDateIngenieria = this.inspeccion.fechavistoing
            }
            else if (this.sesionService.getEmpleado() != null) {
                this.FormIng = this.fb.group({
                    concepto: [null, Validators.required],
                    usuarioGestiona: [this.sesionService.getEmpleado()!.primerNombre + " " + this.sesionService.getEmpleado()!.primerApellido, Validators.required],
                    cargo: [this.sesionService.getEmpleado()!.cargo.nombre, Validators.required],
                    fecha: ['', Validators.required]
                });
            }
            else {
                this.FormIng = this.fb.group({
                    concepto: [null, Validators.required],
                    usuarioGestiona: [null, Validators.required],
                    cargo: [null, Validators.required],
                    fecha: [null, Validators.required]
                });
            }
        }
        else {
            this.FormIng = this.fb.group({
                concepto: [null, Validators.required],
                usuarioGestiona: [null, Validators.required],
                cargo: [null, Validators.required],
                fecha: [null, Validators.required]
            });
        }
    }

    get esListaConPeso(): boolean{
        return this.listasConPeso.has(this.listaInspeccion.tipoLista);
    }

    calcularCalificacion(elementoInspeccionList: ElementoInspeccion[]): number | string{
        let cumplimiento: number | string = 0;
        let obtenido = 0;
        let esperado = 0;
        elementoInspeccionList.forEach(elem => {
            this.listaInspeccion.opcionCalificacionList
            if(elem.calificacion?.opcionCalificacion.id){
                let valorSeleccion = this.listaInspeccion.opcionCalificacionList
                .find(item => item.id === elem.calificacion.opcionCalificacion.id && !item.despreciable)?.valor;
                if(typeof valorSeleccion !== 'undefined'){
                    obtenido += (valorSeleccion * (elem.peso ?? 0));
                    esperado += elem.peso ?? 0;
                }
            }
        });
        cumplimiento = (obtenido / esperado) * 100;
        return !isNaN(cumplimiento) && cumplimiento !== Infinity ? cumplimiento.toFixed(2) : 'NA';
    }

    calcularTotalCumplimiento(listaInspeccion: ListaInspeccion): string | number {
        let total: number = 0;
        let porcAcum = 0;
        let contElementos = 0;
        for(let elemento of listaInspeccion?.elementoInspeccionList){
            let calificacion: string | number = this.calcularCalificacion(elemento.elementoInspeccionList);
            if(calificacion !== 'NA'){
                porcAcum += Number(calificacion);
                contElementos++;
            }
        }
        total = porcAcum / contElementos;
        return !isNaN(total) && total !== Infinity ? total.toFixed(2) : 'NA';
    }
}

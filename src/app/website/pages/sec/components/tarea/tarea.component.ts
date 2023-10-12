import { Component, Inject, OnInit, LOCALE_ID } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TareaService } from "src/app/website/pages/core/services/tarea.service";
import { EmpleadoService } from "src/app/website/pages/empresa/services/empleado.service";
import { Empleado } from "src/app/website/pages/empresa/entities/empleado";
import * as moment from "moment";
import { SeguimientosService } from "src/app/website/pages/core/services/seguimientos.service";
import { Message } from "primeng/api";
import { FilterQuery } from "src/app/website/pages/core/entities/filter-query";
import { Criteria } from "src/app/website/pages/core/entities/filter";
import { formatDate } from "@angular/common";
import { CapitalizePipe } from "src/app/website/pages/sec/components/utils/pipes/capitalize.pipe";
import { DirectorioService } from "src/app/website/pages/ado/services/directorio.service";
import { SesionService } from "src/app/website/pages/core/services/session.service";
import { Empresa } from 'src/app/website/pages/empresa/entities/empresa'
import { locale_es } from 'src/app/website/pages/comun/entities/reporte-enumeraciones';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.scss']
})
export class TareaComponent implements OnInit {

  /* Variables */
  estadoList:any = [];
  evidences: any = [];
  msgs: Message[] = [];
  tareaClose: boolean = false;
  tareaVerify: boolean = false;
  tareaId?:any;
  cargando = false;
  tareaForm?: FormGroup;
  routeSub?:any;
  tarea: any;
  fechaActual = new Date();
  yearRange: string = "1900:" + this.fechaActual.getFullYear();
  submitted = false;
  loading?: boolean;
  fullName?:any = "";
  empleado?: Empleado | null;
  empresaSelect?: Empresa;
  empleadosList?: Empleado[];
  status = 0;
  statuses?:any;
  tareaEvidences:any = [];
  fechavisible = false;
  idEmpresa?: string | null;
  flagEvidencias: boolean=false;
  permisoFlag:boolean=false
  localeES=locale_es;
  esInspeccionCC: boolean = false;

  constructor(
    fb: FormBuilder,
    private route: ActivatedRoute,
    private tareaService: TareaService,
    private empleadoService: EmpleadoService,
    private seguimientoService: SeguimientosService,
    private directorioService: DirectorioService,
    private sesionService: SesionService,
    @Inject(LOCALE_ID) private locale: string,
    private capitalizePipe: CapitalizePipe,
    private config: PrimeNGConfig
  ) {
    this.tareaForm = fb.group({
      id: ["", Validators.required],
      usuarioCierre: [null],
      nombreCompleto:[null],
      email: [null],
      responsableAliado: [null],
      fechaCierre: [null, Validators.required],
      descripcionCierre: [null, Validators.required],
      evidences: [[]],
  });
   }

  ngOnInit(): void {
    this.config.setTranslation(this.localeES)
    this.idEmpresa = this.sesionService.getEmpresa()?.idEmpresaAliada ? this.sesionService.getEmpresa()?.idEmpresaAliada?.toString() : this.sesionService.getEmpresa()!.id;
    this.tareaId = this.route.snapshot.paramMap.get("id");
    this.getTarea().then(() => {
        this.esInspeccionCC = this.tarea?.hash_id?.includes('INPCC') ?? false;
        // console.log(this.esInspeccionCC);
    });


    /* Preload data */
    this.estadoList = [
        { label: "Abierto", value: "abierto" },
        { label: "Cerrado en el tiempo", value: "ct" },
        { label: "Cerrado fuera de tiempo", value: "cft" },
        { label: "Vencido", value: "vencido" },
    ];

    this.statuses = {
        0: "N/A",
        1: "En seguimiento",
        2: "Abierta",
        3: "Cerrada en el tiempo",
        4: "Cerrada fuera de tiempo",
        5: "Vencida",
    };
  }

  async getTarea(event?:any) {
    this.tareaForm!.patchValue({ id: parseInt(this.tareaId) });
    this.tarea = await this.tareaService.findByDetailId(this.tareaId);

    if (this.tarea) {
        this.status = this.verifyStatus();
        let fecha_cierre = moment(this.tarea.fecha_cierre);

        let permiso =
            await this.sesionService.getPermisosMap()["SEC_CHANGE_FECHACIERRE"];
        if (permiso != null && permiso.valido == true) {
            this.fechavisible = true;
        } else {
            fecha_cierre = moment(this.fechaActual);
        }

        let fecha_verificacion = moment(this.tarea.fecha_verificacion);

        this.tarea.fecha_reporte = formatDate(
            this.tarea.fecha_reporte,
            "yyyy-MM-dd",
            this.locale
        );

        this.tareaVerify =
            fecha_cierre.isValid() && fecha_verificacion.isValid()
                ? true
                : false;

        await this.getTareaEvidences();

        if (this.tarea.empResponsable) {
            let fq = new FilterQuery();
            fq.filterList = [
                {
                    criteria: Criteria.EQUALS,
                    field: "id",
                    value1: this.tarea.empResponsable.id,
                    value2: null,
                },
            ];
            await this.empleadoService.findByFilter(fq).then(async (resp:any) => {
                if (resp["data"].length > 0) {
                    let empleado = resp["data"][0];
                    this.tarea.email = empleado.usuario.email || "";
                    let nombre = this.capitalizePipe.transform(
                        empleado.primerNombre
                    );
                    let apellido = this.capitalizePipe.transform(
                        empleado.primerApellido
                    );
                    this.tarea.responsable =
                        (nombre || "") + " " + (apellido || "");
                }
            });
            // this.tarea.responsable=this.tarea.empResponsable.primer_nombre+" "+this.tarea.empResponsable.primer_apellido
        }
        setTimeout(() => {
            
       
        if (this.status === 3 || this.status === 4) {
            this.tareaClose = true;
            let fq = new FilterQuery();
            if(this.tarea.fk_usuario_cierre){
                fq.filterList = [
                    {
                        criteria: Criteria.EQUALS,
                        field: "id",
                        value1: this.tarea.fk_usuario_cierre,
                        value2: null,
                    },
                ];
            }

            if(fq.filterList && fq.filterList?.length > 0){
                this.empleadoService.findByFilter(fq).then(async (resp:any) => {
                    let empleado = resp["data"][0];
                    this.onSelection(empleado);
                }).finally(() => {
                    this.getEvidences(this.tarea.id);
                    this.tareaForm!.patchValue({
                        usuarioCierre: this.tarea.fk_usuario_cierre,
                        fechaCierre: new Date(this.tarea.fecha_cierre),
                        descripcionCierre: this.tarea.descripcion_cierre,
                        responsableAliado: this.tarea.responsableAliado,
                    });
                });
            } else {
                this.getEvidences(this.tarea.id);
                this.tareaForm!.patchValue({
                    usuarioCierre: this.tarea.fk_usuario_cierre,
                    fechaCierre: new Date(this.tarea.fecha_cierre),
                    descripcionCierre: this.tarea.descripcion_cierre,
                    responsableAliado: this.tarea.responsableAliado,
                });
            }
        }else{
            this.flagEvidencias=true}
        }, 600);
    }
  }
  cont :number=0;
  verifyStatus(isFollowsExist = false) {
    this.cont++;

    /* Vars */
    let now = moment({});
    let fecha_cierre = moment(this.tarea.fecha_cierre);
    let fecha_proyectada = moment(this.tarea.fecha_proyectada);

    if (!fecha_cierre.isValid() && isFollowsExist) return 1;
    if (!fecha_cierre.isValid() && fecha_proyectada.isSameOrAfter(now,'day')){ return 2;}
    if (fecha_cierre.isValid() && fecha_proyectada.isSameOrAfter(now,'day')) { return 3;}
    if (fecha_cierre.isValid() && fecha_proyectada.isBefore(now,'day')) {return 4;}
    if (!fecha_cierre.isValid() && fecha_proyectada.isBefore(now,'day')) {return 5;}
    // this.getTarea()
    return 0;
  }

  async getTareaEvidences() {
    try {
        this.tareaForm!.patchValue({ id: parseInt(this.tareaId) });

        this.tarea = await this.tareaService.findByDetailId(this.tareaId);
        let res: any = await this.tareaService.getTareaEvidencesModulos(
            this.tareaId,
            this.tarea.hash_id.slice(0, 3)
        );

        if (res) {
            res.files.forEach(async (evidence:any) => {
                let ev: any = await this.directorioService.download(
                    evidence
                );
                let blob = new Blob([ev]);
                let reader:any = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    if (ev) {
                        this.tareaEvidences.push(reader.result);
                    } else {
                        throw new Error(
                            "Ocurrió un problema al consultar las evidencias de la tarea"
                        );
                    }
                };
            });
        }
    } catch (e) {
    }
  }

  async onSelection(event:any) {
    this.fullName = null;
    this.empleado = null;
    let emp = <Empleado>event;

    this.empleado = emp;
    this.fullName =
        (this.empleado.primerNombre || "") +
        " " +
        (this.empleado.primerApellido || "");
    this.tareaForm!.patchValue({
        usuarioCierre: { id: this.empleado.id },
        email: this.empleado.usuario.email,
    });
  }

  async getEvidences(id:any) {
    try {
        this.evidences =
            ((await this.seguimientoService.getEvidences(
                id,
                "fkTareaCierre"
            )) as any) || [];
            this.flagEvidencias=true
    } catch (e) {
        this.msgs.push({
            severity: "error",
            summary: "Mensaje del sistema",
            detail: "Ha ocurrido un error al obtener las evidencias de esta tarea",
        });
    }
  }

  isFollows(data:any) {
    setTimeout(() => {
        this.status = this.verifyStatus(data);
    }, 100);
}
async onSubmit() {
    this.submitted = true;
    this.cargando = true;
    this.msgs = [];
    console.log(this.tareaForm);
    
    if(!this.permisoFlag){
        if (!this.tareaForm!.valid || this.evidences.length==0) {
            this.cargando = false;
            this.msgs.push({
                severity: "info",
                summary: "Mensaje del sistema",
                detail: "Debe completar todos los campos.",
            });
            return;
        }
    }else{
        if (!this.tareaForm!.valid) {
            this.cargando = false;
            this.msgs.push({
                severity: "info",
                summary: "Mensaje del sistema",
                detail: "Debe completar todos los campos",
            });
            return;
        }
    }

    try {
        let res = await this.seguimientoService.closeTarea(
            this.tareaForm!.value
        );

        if (res) {
            this.tareaForm!.reset();
            this.submitted = false;
            this.cargando = false;
            this.getTarea();
            this.msgs.push({
                severity: "success",
                summary: "Mensaje del sistema",
                detail: "¡Se ha cerrado exitosamente esta tarea!",
            });
        }
    } catch (e) {
        this.submitted = false;
        this.cargando = false;
        this.msgs.push({
            severity: "error",
            summary: "Mensaje del sistema",
            detail: "Ocurrió un inconveniente al cerrar la tarea",
        });
    }
    this.cargando = false;
  }

  buscarEmpleado(event:any) {
    this.empleadoService
        .buscar(event.query)
        .then((data) => (this.empleadosList = <Empleado[]>data));
  }

  addImage(file:any) {
    let evidences = this.tareaForm!.get("evidences")!.value;
    let obj = {
        ruta: file,
    };
    this.evidences.push(obj);
    evidences.push(obj);
    this.tareaForm!.patchValue({ evidences: evidences });
  }

  removeImage(index:any) {
    console.log(index);
    let evidences:any = this.tareaForm!.get("evidences")!.value;
    if (index > -1) evidences.splice(index, 1);
    console.log(evidences);
  }

  TienePermiso(e:any){
    this.permisoFlag=e
}
get f() {
  return this.tareaForm!.controls;
}
}

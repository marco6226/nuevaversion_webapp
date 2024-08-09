import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService, SelectItem } from 'primeng/api';
import { PerfilService } from '../../../admin/services/perfil.service';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { FormularioConstructorComponent } from '../../../comun/components/formulario-constructor/formulario-constructor.component';
import { Criteria, Filter } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';
import { Perfil } from '../../../empresa/entities/perfil';
import { ElementoInspeccion } from '../../entities/elemento-inspeccion';
import { ListaInspeccion } from '../../entities/lista-inspeccion';
import { ListaInspeccionPK } from '../../entities/lista-inspeccion-pk';
import { OpcionCalificacion } from '../../entities/opcion-calificacion';
import { ListaInspeccionService } from '../../services/lista-inspeccion.service';
import { AreaService } from '../../../empresa/services/area.service';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { ProcesoMatrizService } from '../../../core/services/proceso-matriz.service';
import { AreaMatrizService } from '../../../core/services/area-matriz.service';

@Component({
  selector: 'app-elaboracion-lista-signos-vitales',
  templateUrl: './elaboracion-lista-signos-vitales.component.html',
  styleUrl: './elaboracion-lista-signos-vitales.component.scss'
})
export class ElaboracionListaSignosVitalesComponent implements OnInit {

  @ViewChild(FormularioConstructorComponent) formularioConstructor!: FormularioConstructorComponent;
  
  form!: FormGroup;
  opcionesCalifList: OpcionCalificacion[] = [];
  elementoInspeccionList: ElementoInspeccion[] = [];
  consultar: boolean = false;
  adicionar: boolean = false;
  modificar: boolean = false;
  finalizado: boolean = false;
  perfilList: SelectItem[] = [];
  canvas: any;
  imagenesList!: any[];
  numMaxImg = 2;
  listDivision: any = []

  cambiarImagenAnterior: boolean = true;

  listaEvidence: any[] = [];

  tipoListaOpts: SelectItem[] = [
      {label: 'Signos Vitales', value: 'Signos Vitales'},
  ];


  constructor(
    private fb: FormBuilder,
    private listaInspeccionService: ListaInspeccionService,
    private paramNav: ParametroNavegacionService,
    private perfilService: PerfilService,
    private directorioService: DirectorioService,
    private messageService: MessageService,
    private domSanitizer: DomSanitizer,
    private areaService: AreaService,
    private empresaService: EmpresaService,
    private areaMatrizService: AreaMatrizService,
    private procesoMatrizService: ProcesoMatrizService,
  ) { 
    this.canvas = document.createElement('canvas');
    this.canvas.width = 256;
    this.canvas.height = 256;
  }

  ngOnInit(): void {
    this.perfilService.findAll().then((resp: any) => {
        (<Perfil[]>resp['data']).forEach((perfil) => {
            this.perfilList.push({ label: perfil.nombre, value: perfil.id });
        });
    });
    this.form = this.fb.group({
        id: null,
        version: [null, Validators.required],
        codigo: [null, Validators.required],
        nombre: [null, Validators.required],
        tipoLista: [null, Validators.required],
        divisionSv: [null, Validators.required],
        localidadSv: [null, Validators.required],
        areaSv: [null, Validators.required],
        procesoSv: [null, Validators.required],
        descripcion: [null],
        perfilesId: [null, Validators.required],
        estado: [null],
    });

    switch (this.paramNav.getAccion<string>()) {
        case 'GET':
            this.consultar = true;
            this.consultarLista(this.paramNav.getParametro<ListaInspeccion>());
            break;
        case 'PUT':
            this.consultarLista(this.paramNav.getParametro<ListaInspeccion>());
            this.modificar = true;
            break;
        default:
            this.adicionar = true;
            break;
    }
    this.paramNav.reset();
    this.getArea()
  }

  buildPerfilesIdList(ids: Array<any>) {
    let perfilesIdList: { id: any; }[] = [];
    ids.forEach((ue) => {
        perfilesIdList.push({ id: ue });
    });
    return perfilesIdList;
}
consultarLista(listaInsp: ListaInspeccion) {
    let filterQuery = new FilterQuery();
    let filterId = new Filter();
    filterId.criteria = Criteria.EQUALS;
    filterId.field = 'listaInspeccionPK.id';
    filterId.value1 = listaInsp.listaInspeccionPK.id;

    let filterVersion = new Filter();
    filterVersion.criteria = Criteria.EQUALS;
    filterVersion.field = 'listaInspeccionPK.version';
    filterVersion.value1 = listaInsp.listaInspeccionPK.version.toString();

    filterQuery.filterList = [filterId, filterVersion];

    this.listaInspeccionService.findByFilter(filterQuery).then((data: any) => {
        listaInsp = (<ListaInspeccion[]>data['data'])[0];
        this.opcionesCalifList = listaInsp.opcionCalificacionList;
        this.elementoInspeccionList = listaInsp.elementoInspeccionList;
        this.formularioConstructor.formulario = listaInsp.formulario;
        this.form?.get('divisionSv')?.setValue(listaInsp.divisionSv ? listaInsp.divisionSv : null);
        this.form?.get('localidadSv')?.setValue(listaInsp.localidadSv);
        this.form?.get('areaSv')?.setValue(listaInsp.areaSv);
        this.form?.get('procesoSv')?.setValue(listaInsp.procesoSv);
        this.cargarPlantaLocalidad(this.form?.controls['divisionSv'].value, 'Origen');         
        this.cargarArea(this.form?.controls['localidadSv'].value, 'Origen');
        this.cargarProceso(this.form?.controls['areaSv'].value, 'Origen')
        this.form.patchValue({ perfilesId: JSON.parse(listaInsp.fkPerfilId) });
    });
    this.form.patchValue({
        id: listaInsp.listaInspeccionPK,
        codigo: listaInsp.codigo,
        nombre: listaInsp.nombre,
        version: listaInsp.listaInspeccionPK.version,
        tipoLista: listaInsp.tipoLista,
        divisionSv: listaInsp.divisionSv,
        localidadSv: listaInsp.localidadSv,
        areaSv: listaInsp.areaSv,
        procesoSv: listaInsp.procesoSv,
        descripcion: listaInsp.descripcion,
    });
    if (this.consultar) {
        this.form.disable();
    }
    this.getTareaEvidences(parseInt(listaInsp.listaInspeccionPK.id), listaInsp.listaInspeccionPK.version);
}

addOpcionRespuesta() {
    let opc = {} as OpcionCalificacion;
    opc.despreciable = false;
    opc.requerirDoc = true;
    opc.numeral = this.opcionesCalifList.length == 0 ? 1 : this.opcionesCalifList[this.opcionesCalifList.length - 1].numeral + 1;
    this.opcionesCalifList.push(opc);
    this.opcionesCalifList = this.opcionesCalifList.slice();
}

removeOpcionCalificacion(opc: OpcionCalificacion) {
    for (let i = 0; i < this.opcionesCalifList.length; i++) {
        if (this.opcionesCalifList[i].numeral == opc.numeral) {
            this.opcionesCalifList.splice(i, 1);
            this.opcionesCalifList = this.opcionesCalifList.slice();
            break;
        }
    }
}

async getArea() {
    let filterAreaQuery = new FilterQuery();
    filterAreaQuery.sortField = "id";
    filterAreaQuery.sortOrder = -1;
    filterAreaQuery.fieldList = ["id", "nombre"];
    filterAreaQuery.filterList = [
      { field: 'nivel', criteria: Criteria.EQUALS, value1: '0' },
      { field: 'tipoArea.id', criteria: Criteria.EQUALS, value1: '59' }
    ];

    await this.areaService.findByFilter(filterAreaQuery).then((resp: any) => {
      resp.data.forEach((resp2: any) => {
        this.listDivision.push({ label: resp2.nombre, value: resp2.id })
      });
    })

  }

  localidadesList: any[] = [];
  localidadesListActual: any = [];

  async cargarPlantaLocalidad(eve: any, tipo: string) {
    let filterPlantaQuery = new FilterQuery();
    filterPlantaQuery.sortField = "id";
    filterPlantaQuery.sortOrder = -1;
    filterPlantaQuery.fieldList = ["id", "localidad"];
    filterPlantaQuery.filterList = [
      { field: 'plantas.area.id', criteria: Criteria.EQUALS, value1: eve.toString() },
    ];
  
    try {
      const resp: any = await this.empresaService.getLocalidadesRWithFilter(filterPlantaQuery);
      const localidadesList = resp.data.map((element: any) => ({ label: element.localidad, value: element.id }));
      if (tipo === 'Origen') {
        this.localidadesList = localidadesList;
      } else {
        this.localidadesListActual = localidadesList;
      }
    } catch (error) {
      console.error("Error al cargar las localidades:", error);
    }
  }

  areaList: any[] = []
  areaListActual: any[] = []

  async cargarArea(eve: any, tipo: string) {
    let filterArea = new FilterQuery();
    filterArea.sortField = "id";
    filterArea.sortOrder = -1;
    filterArea.fieldList = [
      'id',
      'nombre'
    ];
    filterArea.filterList = [
      { field: 'localidad.id', criteria: Criteria.EQUALS, value1: eve.toString() },
      { field: 'eliminado', criteria: Criteria.EQUALS, value1: false }
    ];

    const resp: any = await this.areaMatrizService.findByFilter(filterArea);
    const areaList = resp.data.map((element: any) => ({ label: element.nombre, value: element.id }));
    if (tipo === 'Origen') {
      this.areaList = [...areaList];
    } else {
      this.areaListActual = [...areaList];
    }
  }

  procesoList: any[] = []
  procesoListActual: any[] = []
  async cargarProceso(eve: any, tipo: string) {
    try {
      let filterProceso = new FilterQuery();
      filterProceso.sortField = "id";
      filterProceso.sortOrder = -1;
      filterProceso.fieldList = ['id', 'nombre'];
      filterProceso.filterList = [
        { field: 'areaMatriz.id', criteria: Criteria.EQUALS, value1: eve },
        { field: 'eliminado', criteria: Criteria.EQUALS, value1: false }
      ];
  
      const resp: any = await this.procesoMatrizService.findByFilter(filterProceso);
      const procesoList = resp.data.map((element: any) => ({ label: element.nombre, value: element.id }))
      if (tipo === 'Origen') {
        this.procesoList = [...procesoList];
      } else {
        this.procesoListActual = [...procesoList];
      }
    } catch (error) {
      console.error("Error en cargarProceso:", error);
    }
  }
async guardar() {
    if (this.opcionesCalifList.length < 2) {
        this.messageService.add({ key: 'elaboracionLista', severity: 'warn', summary: 'Cuidado', detail: 'Necesitas minimo dos opciones de respuesta'});
        return false;
    } else {
        let err = false;
        for (const element of this.opcionesCalifList) {
            if (!element.nombre || !element.descripcion) return this.messageService.add({key: 'elaboracionLista', severity: 'warn', summary: 'Cuidado', detail: 'Necesitas Nombre y descripcion en opciones de respuesta  '});
        }
    }
    if (Object.keys(this.formularioConstructor.formulario).length < 1) {
        return this.messageService.add({ key: 'elaboracionLista', severity: 'warn', summary: 'Cuidado', detail: 'Minimo 1 formulario en Datos generales'});
    } else {
        let err = false;
        for (const element of this.formularioConstructor.formulario.campoList) {
            if (!element.nombre || !element.descripcion || !element.tipo)
                return this.messageService.add({ key: 'elaboracionLista', severity: 'warn', summary: 'Cuidado', detail: 'Necesitas Nombre y descripcion y tipo en datos generales '});
        }
    }
    if (this.elementoInspeccionList.length < 1) {
        return this.messageService.add({ key: 'elaboracionLista', severity: 'warn', summary: 'Cuidado', detail: 'Minimo 1 Elemento de inspeccion'});
    }

    let listInp = {} as ListaInspeccion;
    listInp.nombre = this.form.value.nombre;
    listInp.codigo = this.form.value.codigo;
    listInp.listaInspeccionPK = {} as ListaInspeccionPK;
    listInp.listaInspeccionPK.version = this.form.value.version;
    listInp.tipoLista = this.form.value.tipoLista;
    listInp.fkPerfilId = JSON.stringify(this.form.value.perfilesId);
    listInp.descripcion = this.form.value.descripcion;
    listInp.tipoLista = this.form.value.tipoLista;
    listInp.divisionSv = this.form?.get('divisionSv')?.value;
    listInp.localidadSv = this.form.value.localidadSv;
    listInp.areaSv = this.form?.get('areaSv')?.value;
    listInp.procesoSv = this.form?.get('procesoSv')?.value;
    listInp.opcionCalificacionList = this.opcionesCalifList;
    listInp.estado = 'activo';
    listInp.elementoInspeccionList = this.elementoInspeccionList;
    listInp.formulario = this.formularioConstructor.formulario;
    await this.verifyIntegrity(listInp);
    this.listaInspeccionService.create(listInp).then((data) => {
        if (this.imagenesList != null) {
            this.imagenesList.forEach(async (imgObj) => {
                let resp: any = await this.directorioService.uploadv5(imgObj.file, null, 'INP', listInp.listaInspeccionPK.id.toString(), null, 'PUBLICO',null);
                let respid: any = Object.values(resp);
                this.directorioService.uploadv4(respid[0], listInp.listaInspeccionPK.id.toString(), listInp.listaInspeccionPK.version.toString());
            });
        }
        this.messageService.add({severity: 'success', summary: 'Lista de inspección creada', detail: 'Se ha creado correctamente la lista de inspección  ' + listInp.nombre, key:'elaboracionLista' });
        this.finalizado = true;
        this.adicionar = false;
    });
}

actualizarProfile(actualizarVersion: boolean) {
    let listInp = {} as ListaInspeccion;
    listInp.listaInspeccionPK = this.form.value.id;
    listInp.fkPerfilId = JSON.stringify(this.form.value.perfilesId);

    let param = (actualizarVersion == false ? null : 'actualizarVersion=true') + '&putProfile=true';
    this.listaInspeccionService.update(listInp, param).then((data) => {
        let detalle = actualizarVersion ? 'Se ha generado correctamente una nueva versión de la lista de inspección ' : 'Se ha actualizado correctamente la lista de inspección ';
        this.messageService.add({ key: 'elaboracionLista', severity: 'success', summary: 'Perfiles de inspección actualizados'});
    });
}

actualizar(actualizarVersion: boolean) {
    let listInp = {} as ListaInspeccion;
    listInp.listaInspeccionPK = {} as ListaInspeccionPK;
    listInp.listaInspeccionPK = this.form.value.id;
    let versiondato = listInp.listaInspeccionPK.version;
    listInp.nombre = this.form.value.nombre;
    listInp.codigo = this.form.value.codigo;
    listInp.fkPerfilId = JSON.stringify(this.form.value.perfilesId);
    listInp.descripcion = this.form.value.descripcion;
    listInp.tipoLista = this.form.value.tipoLista;
    listInp.divisionSv = this.form.value.divisionSv;
    listInp.localidadSv = this.form.value.localidadSv;
    listInp.areaSv = this.form.value.areaSv;
    listInp.procesoSv = this.form.value.procesoSv;
    listInp.opcionCalificacionList = this.opcionesCalifList;
    listInp.elementoInspeccionList = this.elementoInspeccionList;
    listInp.formulario = this.formularioConstructor.formulario;
    let param = actualizarVersion == false ? '' : 'actualizarVersion=true';
    if (actualizarVersion == true) {
        listInp.estado = 'inactivo';
        listInp.numeroPreguntas = listInp.numeroPreguntas;

        versiondato = listInp.listaInspeccionPK.version + 1;
        this.listaInspeccionService.update(listInp, 'actualizarVersion=false');
    }
    listInp.estado = 'activo';

    this.listaInspeccionService.update(listInp, param).then((data) => {
        if (this.imagenesList != null) {
            this.imagenesList.forEach(async (imgObj) => {
                let resp: any = await this.directorioService.uploadv5(imgObj.file, null, 'INP', listInp.listaInspeccionPK.id.toString(), null, 'PUBLICO',null);
                let respid: any = Object.values(resp);
                if (this.cambiarImagenAnterior) {
                    this.directorioService.uploadv4(respid[0], listInp.listaInspeccionPK.id.toString(), versiondato.toString());
                } else {
                    this.directorioService.Update(respid[0], listInp.listaInspeccionPK.id.toString(), listInp.listaInspeccionPK.version.toString());
                }
            });
        } else if (this.listaEvidence.length > 0) {
        }
        let detalle = actualizarVersion ? 'Se ha generado correctamente una nueva versión de la lista de inspección ' : 'Se ha actualizado correctamente la lista de inspección ';
        this.messageService.add({ key: 'elaboracionLista', severity: 'success', summary: 'Lista de inspección actualizada', detail: detalle + listInp.nombre});
    });
}

verifyIntegrity(listInp: any) {}

resetAll() {
    this.adicionar = true;
    this.finalizado = false;
    this.opcionesCalifList = [];
    this.elementoInspeccionList = [];
    this.form.reset();
}

onArchivoSelect(event: any, imagenAnterior: boolean) {
    this.cambiarImagenAnterior = imagenAnterior;
    let ctx = this.canvas.getContext('2d');
    let reader = new FileReader();
    let file = event.target.files[0];
    let img = new Image();
    img.onload = function () {
        ctx.canvas.width = '200';
        ctx.canvas.height = '200';
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    };
    reader.onloadend = async function () {
        img.src = (await reader.result) as string;
    };
    // this is to read the file
    reader.readAsDataURL(file);

    if (file.type != 'image/jpeg' && file.type != 'image/png') {
        this.messageService.add({ key: 'elaboracionLista', severity: 'error', summary: 'Tipo de archivo no permitido', detail: 'El tipo de archivo permitido debe ser png o jpg'});
        return;
    }
    if (file.size > 30_500_000) {
        this.messageService.add({ key: 'elaboracionLista', severity: 'error', summary: 'Tamaño máximo superado 30.5 MB', detail: 'La imágen supera el tamaño máximo permitido'});
        return;
    }
    if (this.imagenesList == null) this.imagenesList = [];
    let urlData = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    this.imagenesList.push({ source: urlData, file: file });
    this.imagenesList = this.imagenesList.slice();
}

async getTareaEvidences(lista_id: number, version_id: number) {
    try {
        let res: any = await this.listaInspeccionService.getInspeccionImagen(lista_id, version_id);
        let ctx = this.canvas.getContext('2d');

        if (res) {
            res.files.forEach(async (evidence: string) => {
                let ev: any = await this.directorioService.download(evidence);

                let blob = new Blob([ev]);

                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    if (ev) {
                        this.listaEvidence.push(reader.result);
                    } else {
                        throw new Error('Ocurrió un problema al consultar las evidencias de la tarea');
                    }
                };
            });
        }
    } catch (e) {}
}
validarDefault(eve:any,id:any){
    if(eve.checked){
        this.opcionesCalifList.forEach((ele:any)=>{
            if(ele.id != id){
                let index=this.opcionesCalifList.findIndex(i=>i.id==ele.id)
                this.opcionesCalifList[index].defecto=false
            }
        })
    }
}
}


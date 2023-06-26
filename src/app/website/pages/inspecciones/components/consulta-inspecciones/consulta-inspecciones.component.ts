import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { PerfilService } from '../../../admin/services/perfil.service';
import { Criteria } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';
import { SesionService } from '../../../core/services/session.service';
import { Inspeccion } from '../../entities/inspeccion';
import { ListaInspeccion } from '../../entities/lista-inspeccion';
import { InspeccionService } from '../../services/inspeccion.service';
import { ListaInspeccionService } from '../../services/lista-inspeccion.service';

@Component({
  selector: 'app-consulta-inspecciones',
  templateUrl: './consulta-inspecciones.component.html',
  styleUrls: ['./consulta-inspecciones.component.scss']
})
export class ConsultaInspeccionesComponent implements OnInit {

  inspeccionesList!: any[];
  inspeccionSelect!: Inspeccion;
  totalRecords!: number;
  loading: boolean = true;
  fields: string[] = [
    'id',
    'programacion_fecha',
    'fechaRealizada',
    'usuarioRegistra_email',
    'programacion_listaInspeccion_nombre',
    'programacion_area_id',
    'programacion_area_nombre',
    'fechaModificacion',
    'usuarioModifica_email',
    'listaInspeccion'
  ];
  areasPermiso!: string;
  userParray: any;
  listaInspeccion!: ListaInspeccion;
  inspeccionNoProgList!: any[];
  inspeccionNoProgSelect!: Inspeccion;
  totalRecordsNoProg!: number;
  loadingNoProg: boolean = true;
  fieldsNoProg: string[] = [
    'id',
    'fechaRealizada',
    'usuarioRegistra_email',
    'listaInspeccion_nombre',
    'area_id',
    'area_nombre',
    'fechaModificacion',
    'usuarioModifica_email',
    'listaInspeccion'
  ];

  constructor(
    private paramNav: ParametroNavegacionService,
    private inspeccionService: InspeccionService,
    private sesionService: SesionService,
    private userService: PerfilService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.areasPermiso = this.sesionService.getPermisosMap()['INP_GET_INP'].areas;
    let areasPermiso = this.areasPermiso.replace('{', '');
    areasPermiso = areasPermiso.replace('}', '');
    let areasPermiso2 = areasPermiso.split(',')

    const filteredArea = areasPermiso2.filter(function (ele, pos) {
      return areasPermiso2.indexOf(ele) == pos;
    })
    this.areasPermiso = '{' + filteredArea.toString() + '}';
  }

  async lazyLoadNoProg(event: any) {
    let user: any = JSON.parse(localStorage.getItem('session')!);
    let filterQuery = new FilterQuery();

    filterQuery.filterList = [{
      field: 'usuarioEmpresaList.usuario.id',
      criteria: Criteria.EQUALS,
      value1: user.usuario.id,
      value2: null
    }];
    const userP = await this.userService.findByFilter(filterQuery);
    this.userParray = userP;
    this.loadingNoProg = true;

    filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;

    filterQuery.fieldList = this.fieldsNoProg;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    filterQuery.filterList.push({ criteria: Criteria.IS_NULL, field: 'programacion' });
    filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: 'area.id', value1: this.areasPermiso });

    var x: any[] = [];

    this.userParray.data.forEach((element: any) => {
      x.push(element.id)
    });

    var y: string = "[" + x + "]";
    let z: string = "{" + x + "}"

    //    filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: 'listaInspeccion.fkPerfilId', value1: z });

    this.inspeccionService.findByFilter(filterQuery).then(
      (resp: any) => {
        this.totalRecordsNoProg = resp['count'];

        this.loadingNoProg = false;
        this.inspeccionNoProgList = [];
        (<any[]>resp['data']).forEach(dto => {
          let obj = FilterQuery.dtoToObject(dto)
          obj['hash'] = obj.listaInspeccion.listaInspeccionPK.id + '.' + obj.listaInspeccion.listaInspeccionPK.version;
          try {
            for (const profile of this.userParray.data) {

              let perfilArray = JSON.parse(obj.listaInspeccion.fkPerfilId)

              perfilArray.forEach((perfil: any) => {
                if (perfil === profile.id) {
                  if (!this.inspeccionNoProgList.find(element => element == obj)) {
                    this.inspeccionNoProgList.push(obj);
                  }
                }
              });
            }

          } catch (error) {

          }
        });
      }
    );
  }

  async lazyLoad(event: LazyLoadEvent | null) {
    
    let user: any = JSON.parse(localStorage.getItem('session')!);
    let filterQueryu = new FilterQuery();
    filterQueryu.filterList = [{
      field: 'usuarioEmpresaList.usuario.id',
      criteria: Criteria.EQUALS,
      value1: user.usuario.id,
      value2: null
    }];
    const userP = await this.userService.findByFilter(filterQueryu);
    this.userParray = userP;

    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event?.sortField;
    filterQuery.sortOrder = event?.sortOrder;
    filterQuery.offset = event?.first;
    filterQuery.rows = event?.rows;
    filterQuery.count = true;
    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event?.filters);
    filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "programacion.area.id", value1: this.areasPermiso });

    await this.inspeccionService.findByFilter(filterQuery).then(
      (resp: any) => {
        this.totalRecords = resp['count'];
        this.inspeccionesList = [];
        // console.log(resp);
        (<any[]>resp['data']).forEach(dto => {
          let obj = FilterQuery.dtoToObject(dto)
          obj['hash'] = obj.listaInspeccion.listaInspeccionPK.id + '.' + obj.listaInspeccion.listaInspeccionPK.version;
          try {
            for (const profile of this.userParray.data) {
              let perfilArray = JSON.parse(obj.listaInspeccion.fkPerfilId)
              perfilArray.forEach((perfil: any) => {
                if (perfil === profile.id) {
                  if (!this.inspeccionesList.find(element => element == obj)) {
                    // console.log(obj);
                    this.inspeccionesList.push(obj);
                  }
                }
              });
            }
          } catch (error) { }
          this.loading = false;
          // console.log(this.inspeccionesList);
        });
      }
    );
  }



  redirect(consultar: boolean) {
    if (this.inspeccionSelect == null) {
      this.messageService.add({ severity: 'warn', detail: 'Debe seleccionar una inspección para ' + (consultar ? 'consultar' : 'modificarla') });
    } else {
      this.paramNav.setAccion<string>(+ consultar ? 'GET' : 'PUT');
      this.paramNav.setParametro<Inspeccion>(this.inspeccionSelect);
      this.paramNav.redirect('/app/inspecciones/elaboracionInspecciones');
    }
  }

  redirectNoProg(consultar: boolean) {
    if (this.inspeccionNoProgSelect == null) {
      this.messageService.add({ severity: 'warn', detail: 'Debe seleccionar una inspección para ' + (consultar ? 'consultar' : 'modificarla') });
    } else {
      this.paramNav.setAccion<string>(+ consultar ? 'GET' : 'PUT');
      this.paramNav.setParametro<Inspeccion>(this.inspeccionNoProgSelect);
      this.paramNav.redirect('/app/inspecciones/elaboracionInspecciones');
    }
  }

  navegar() {
    this.paramNav.redirect('/app/inspecciones/programacion');
  }


}

import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { PerfilService } from '../../../admin/services/perfil.service';
import { PermisoService } from '../../../admin/services/permiso.service';
import { RecursoService } from '../../../admin/services/recurso.service';
import { Criteria } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Area } from '../../../empresa/entities/area';
import { Perfil } from '../../../empresa/entities/perfil';
import { Permiso } from '../../../empresa/entities/permiso';
import { Recurso } from '../../../empresa/entities/recurso';
import { AreaService } from '../../../empresa/services/area.service';

@Component({
    selector: 'app-scmpermisos',
    templateUrl: './scmpermisos.component.html',
    styleUrls: ['./scmpermisos.component.scss'],
    providers: [AreaService, RecursoService, PermisoService, PerfilService,MessageService]
})
export class ScmpermisosComponent implements OnInit {

    perfilesList: SelectItem[] = [];
    recursosList!: Recurso[];
    perfilSelect!: Perfil;
    permisosList!: Permiso[] | null;
    rowGroupMetadata: any;
    areaList: SelectItem[] = [];
    isOnEdit: boolean = false;
    constructor(
        private areaService: AreaService,
        private recursoService: RecursoService,
        private permisoService: PermisoService,
        private perfilService: PerfilService,
        private messageServices: MessageService
    ) { }

    ngOnInit() {
        let filterQuery = new FilterQuery();

        this.areaService.findAll().then(
            (resp: any) => (<Area[]>resp['data']).forEach(area => this.areaList.push({ label: area.nombre, value: area.id,title: area.areaPadre?.nombre}))
        );

        this.perfilesList.push({ label: '--Seleccione--', value: null });
        filterQuery.filterList = [
            {
                field: "descripcion",
                criteria: Criteria.EQUALS,
                value1: "medic",
                value2: null
            }
        ];
        this.perfilService.findByFilter(filterQuery).then(
            (data: any) => (<Perfil[]>data['data']).forEach(element => this.perfilesList.push({ label: element.nombre, value: element }))
        );

        filterQuery.filterList = [
            {
                field: "modulo",
                criteria: Criteria.EQUALS,
                value1: "Seguimiento de casos medicos",
                value2: null
            }
        ];
        filterQuery.sortField = "modulo";
        filterQuery.sortOrder = -1;

        this.recursoService.findByFilter(filterQuery).then(
            (data: any) => {
                this.recursosList = <Recurso[]>data['data'];
                this.updateRowGroupMetaData();
            }
        );
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};
        if (this.recursosList) {
            for (let i = 0; i < this.recursosList.length; i++) {
                let rowData = this.recursosList[i];
                let modulo: string = rowData.modulo!;
                if (i == 0) {
                    this.rowGroupMetadata[modulo] = { index: 0, size: 1 };
                } else {
                    let previousRowData = this.recursosList[i - 1];
                    let previousRowGroup = previousRowData.modulo;
                    if (modulo === previousRowGroup)
                        this.rowGroupMetadata[modulo].size++;
                    else
                        this.rowGroupMetadata[modulo] = { index: i, size: 1 };
                }
            }
        }
    }

    cargarPermisos(perfil: Perfil) {
        if (perfil == null) {
            this.permisosList = null;
            return;
        }
        this.permisoService.findAllByPerfil(perfil.id!).then(
            data => {
                this.permisosList = <Permiso[]>data;
                this.cruzarDatos();
            }
        );
    }

    cruzarDatos() {
        this.recursosList.forEach((recurso: any) => {
            recurso.selected = false;
            recurso['areas'] = null;
            this.permisosList?.forEach(permiso => {
                if (permiso.recurso?.id == recurso.id) {
                    recurso.selected = permiso.valido;
                    if (recurso['validacionArea']) {
                        recurso['areas'] = permiso.areas == null ? null : permiso.areas.replace('{', '').replace('}', '').replace(' ', '').split(',');
                        if (recurso['areas']) {
                            recurso['areas'].forEach((value: any, index: any) => {

                                recurso["areas"][index] = parseInt(value);
                            });;
                        }

                    }
                }
            });

        });

    }

    actualizarListado(event: any) {
        this.perfilSelect = event.value;
        this.cargarPermisos(this.perfilSelect);
    }

    actualizarPermiso(recurso: any) {
        setTimeout(() => {
            
        }, 1000);
        this.isOnEdit=true;
        let permiso = new Permiso();
        permiso.valido = recurso.selected? false : true;
        recurso.selected = recurso.selected ? false : true;
        permiso.recurso = new Recurso();
        permiso.recurso.id = recurso.id;
        permiso.perfil = new Perfil();
        permiso.perfil.id = this.perfilSelect.id;
        if (recurso['validacionArea']) {
            permiso.areas = '{' + recurso['areas'].toString() + '}';
        }
        this.permisoService.update(permiso).then(
            resp => {
                this.messageServices.add({summary: 'PERMISO ACTUALIZADO', detail: 'El permiso se ha actualizado correctamente', severity: 'success', key: 'scmPermisos' });
                if(resp){
                    this.isOnEdit=false;
                }
            }
        );
    }


}
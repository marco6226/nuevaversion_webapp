import { Criteria } from './../../../core/entities/filter';
import { Component, OnInit } from '@angular/core';
import { AreaService } from '../../../empresa/services/area.service';
import { Area, Estructura } from '../../../empresa/entities/area';
import { RecursoService } from '../../services/recurso.service';
import { PermisoService } from '../../services/permiso.service';
import { MessageService, SelectItem } from 'primeng/api';
import { PerfilService } from '../../services/perfil.service';
import { Recurso } from '../../../empresa/entities/recurso';
import { Permiso } from '../../../empresa/entities/permiso';
import { Perfil } from '../../../empresa/entities/perfil';
import { FilterQuery } from '../../../core/entities/filter-query';
import { HelperService } from '../../../core/services/helper.service';

@Component({
    selector: 's-permisos',
    templateUrl: './permisos.component.html',
    styleUrls: ['./permisos.component.scss'],
    providers: [RecursoService],
})
export class PermisosComponent implements OnInit {

    perfilesList: SelectItem[] = [];
    recursosList!: Recurso[];
    perfilSelect!: Perfil;
    permisosList!: Permiso[];
    rowGroupMetadata: any;
    areaList: SelectItem[] = [];
    isOnEdit: boolean = false;

    constructor(
        private areaService: AreaService,
        private recursoService: RecursoService,
        private permisoService: PermisoService,
        private perfilService: PerfilService,
        private helperService: HelperService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        
        // this.areaService.findAll().then(
        //     resp => (<Area[]>resp['data']).forEach(area => this.areaList.push({ label: area.nombre, value: area.id }))
        //     // resp => (<Area[]>resp['data']).forEach(area=>{
        //     //     if(area.areaPadre.nombre == undefined || area.areaPadre.nombre == null){
        //     //         this.areaList.push({label: area.nombre +" - "+ area.areaPadre.toString(),value : area.id})
        //     //     }else{
        //     //         this.areaList.push({label: area.nombre  +" - "+ area.areaPadre.nombre,value: area.id})
        //     //     }
        //     // })
        // );
        console.log(this.areaList);
        this.selectArea_areaPadre();

        this.perfilesList.push({ label: '--Seleccione--', value: null });
        this.perfilService.findAll().then(
            (data: any) => (<Perfil[]>data['data']).forEach(element => this.perfilesList.push({ label: element.nombre, value: element }))
        );

        let filterQuery = new FilterQuery();
        filterQuery.sortField = "modulo";
        filterQuery.sortOrder = -1;
        this.recursoService.findByFilter(filterQuery).then(
            (data: any) => {

                let scm = [];
                let tmpArray = <Recurso[]>data['data'];
                for (let idx = 0; idx < tmpArray.length; idx++) {
                    if (tmpArray[idx].modulo == "Seguimiento de casos medicos" && tmpArray[idx].codigo == "SCM_PERF_SCM") {
                        scm.push(tmpArray[idx]);
                    }
                }
                tmpArray = tmpArray.filter(rcs => rcs.modulo != "Seguimiento de casos medicos");
                this.recursosList = [...tmpArray, ...scm];
                this.updateRowGroupMetaData();
            }
        );
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};
        if (this.recursosList) {
            for (let i = 0; i < this.recursosList.length; i++) {
                let rowData = this.recursosList[i];
                let modulo = rowData.modulo || '';
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
            this.permisosList = [];
            return;
        }else{
            this.permisoService.findAllByPerfil(perfil.id || '').then(
                data => {
                    this.permisosList = <Permiso[]>data;
                    this.cruzarDatos();
                }
            );
        }
    }

    cruzarDatos() {
        this.recursosList.forEach((recurso: any) => {
            recurso.selected = false;
            recurso['areas'] = null;
            this.permisosList.forEach((permiso:any) => {
                if (permiso.recurso.id == recurso.id) {
                    recurso.selected = permiso.valido;
                    if (recurso['validacionArea']) {
                        recurso['areas'] = permiso.areas == null ? null : permiso.areas.replace('{', '').replace('}', '').replace(' ', '').split(',');
                        if (recurso['areas']) {
                            recurso['areas'].forEach((value:any, index:any) => {

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

    actualizarPermiso(recurso: Recurso) {
        // console.log('recurso: '+recurso.selected);
        this.isOnEdit=true;
        let permiso = new Permiso();
        permiso.valido = recurso.selected ? false : true;
        recurso.selected = recurso.selected ? false : true;
        permiso.recurso = new Recurso();
        permiso.recurso.id = recurso.id;
        permiso.perfil = new Perfil();
        permiso.perfil.id = this.perfilSelect.id;
        // if (recurso['validacionArea']) {
        //     permiso.areas = '{' + recurso['areas'].toString() + '}';
        // }
        this.permisoService.update(permiso).then(
            resp => {
                this.messageService.add({ summary: 'PERMISO ACTUALIZADO', detail: 'El permiso se ha actualizado correctamente', severity: 'success', key:'permisos' });
                if(resp){
                    this.isOnEdit=false;
                }
            }
        ).catch(
            err => {
                this.messageService.add({ summary: 'ERROR', detail: 'No se pudo actualizar el permiso.', severity: 'error', key:'permisos' });
            }
        );
    }

    selectArea_areaPadre(){
        let filterAreaQuery = new FilterQuery();
    filterAreaQuery.filterList = [
      { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
      { field: 'estructura', criteria: Criteria.EQUALS, value1: Estructura.ORGANIZACIONAL.toString(), value2: null }
    ];
    this.areaService.findByFilter(filterAreaQuery)
      .then(element => {
        this.createArbol(element);
      })
    }

    createArbol(data: any){        
        console.log(data)
        data.data.forEach((element: any) => {
            // console.log(element)
            this.areaList.push({label: element.nombre, value : element.id})
            if(element.areaList.length > 0){
                this.createArbolHijo(element.nombre,element.areaList)
            }
        });
        console.log('lista',this.areaList)
    }

    createArbolHijo(nombrePadre:any, dataHijo:any){
        // console.log(dataHijo)
        dataHijo.forEach((element:any) => {
            // console.log(element)
            this.areaList.push({label: element.nombre + " - " +  nombrePadre, value : element.id})
            if(element.areaList.length > 0){
                this.createArbolHijo(element.nombre,element.areaList)
            }
        });
    }

    actualizarPermisosLocales(event: any){
        // console.info(event);
        if(event.isTrusted){
            // console.info('Actualizar permisos presionado: ' + event.isTrusted);
            // this.isTrustedActualizarPermisos = event.isTrusted;
            this.helperService.changeMessage('actualizarPermisos');
        }
    }
}

import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Criteria } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { HelperService } from '../../../core/services/helper.service';
import { Estructura } from '../../../empresa/entities/area';
import { Perfil } from '../../../empresa/entities/perfil';
import { Permiso } from '../../../empresa/entities/permiso';
import { Recurso } from '../../../empresa/entities/recurso';
import { AreaService } from '../../../empresa/services/area.service';
import { PermisoService } from '../../services/permiso.service';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss']
})
export class PermisosComponent implements OnInit {

  perfilesList: SelectItem[] = [];
  areaList: SelectItem[] = [];
  perfilSelect!: Perfil;
  permisosList!: Permiso[] | null;
  recursosList!: Recurso[];

  constructor(
    private areaService: AreaService,
    private permisoService: PermisoService,
    private helperService: HelperService

  ) { }

  ngOnInit(): void {
    this.selectArea_areaPadre();
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

  createArbolHijo(nombrePadre: any, dataHijo: any){
    console.log(dataHijo)
    dataHijo.forEach((element: any) => {
        this.areaList.push({label: element.nombre + " - " +  nombrePadre, value : element.id})
        if(element.areaList.length > 0){
            this.createArbolHijo(element.nombre,element.areaList)
        }
    });
  }

  actualizarListado(event: any) {
    this.perfilSelect = event.value;
    this.cargarPermisos(this.perfilSelect);
  }

  cargarPermisos(perfil: Perfil) {
    if (perfil == null) {
        this.permisosList = null;
        return;
    }
    this.permisoService.findAllByPerfil(perfil.id).then(
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
        this.permisosList!.forEach(permiso => {
            if (permiso.recurso.id == recurso.id) {
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

  actualizarPermisosLocales(event: any){
    if(event.isTrusted){
        this.helperService.changeMessage(event.isTrusted);
    }
  }
}

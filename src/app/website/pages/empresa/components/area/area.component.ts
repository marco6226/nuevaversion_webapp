import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import { Criteria } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { SesionService } from '../../../core/services/session.service';
import { Area, Estructura } from '../../entities/area';
import { TipoArea } from '../../entities/tipo-area';
import { TreeNodeExpand } from '../../entities/tree-node-expand';
import { AreaService } from '../../services/area.service';
import { TipoAreaService } from '../../services/tipo-area.service';



@ViewChild('diagram')

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  visibleTree: boolean = false;
  areasNodes: TreeNode[] = [];
  sedesNodes: TreeNode[] = [];
  tiposAreaList: SelectItem[] = [{ label: '--Seleccione--', value: null }];
  
  constructor(
    private messageService: MessageService,
    private tipoAreaService: TipoAreaService,
    private areaService: AreaService,
    private sesionService: SesionService,

  ) { }

  ngOnInit(): void {
    this.loadAreas();
  }

  async loadAreas() {
    this.tipoAreaService.findAll().then(
      (data: any) => (<TipoArea[]>data['data']).forEach(ta => this.tiposAreaList.push({ label: ta.nombre, value: ta.id }))
    );
    let filterAreaQuery = new FilterQuery();
    filterAreaQuery.filterList = [
      { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
      { field: 'estructura', criteria: Criteria.EQUALS, value1: Estructura.ORGANIZACIONAL.toString(), value2: null }
    ];
    this.areaService.findByFilter(filterAreaQuery).then(
      (data: any) => {
        let root: TreeNode = {
          label: this.sesionService.getEmpresa()!.razonSocial,
          selectable: false,
          expanded: true,
        };

        let nodos = this.createTreeNode(<Area[]>data['data'], null);
        root.children = nodos;
        this.areasNodes.push(root);
        this.visibleTree = true;
      }
    );
    let filterSedesQuery = new FilterQuery();
    filterSedesQuery.filterList = [
      { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
      { field: 'estructura', criteria: Criteria.EQUALS, value1: Estructura.FISICA.toString(), value2: null }
    ];
    this.areaService.findByFilter(filterSedesQuery).then(
      (data: any) => {
        let root: TreeNode = {
          label: this.sesionService.getEmpresa()!.razonSocial,
          selectable: false,
          expanded: true,
        };

        let nodos = this.createTreeNode(<Area[]>data['data'], null);
        root.children = nodos;
        this.sedesNodes.push(root);
        this.visibleTree = true;
      }
    );
  }

  createTreeNode(areas: Area[], nodoPadre: TreeNode | null): TreeNode[] {
    let nodes: TreeNode[] = [];
    for (let i = 0; i < areas.length; i++) {
      let area = areas[i];
      let n: TreeNodeExpand = {
        id: area.id,
        label: area.nombre,
        descripcion: area.descripcion,
        tipoAreaId: area.tipoArea.id,
        estructura: area.estructura,
        expanded: false,
        nodoPadre: nodoPadre,
        children: [],
        selected: true
      };
      n.children = (area.areaList != null ? this.createTreeNode(area.areaList, n) : []);
      nodes.push(n);
    }
    return nodes;
  }

  showAddForm(estructSelected: string) {
    console.log(estructSelected);
    
    // this.estructuraSelected = estructSelected;
    // // Dependiendo de la estructura trabajada, se establecen las variables 
    // // de este objeto que representan el nodo arbol y el nodo seleccionado
    // switch (estructSelected) {
    //   case Estructura.ORGANIZACIONAL.toString():
    //     this.varSelected = 'areaSelected';
    //     this.varNodes = 'areasNodes';
    //     break;
    //   case Estructura.FISICA.toString():
    //     this.varSelected = 'sedeSelected';
    //     this.varNodes = 'sedesNodes';
    //     break;
    // }
    // //-------

    // this.visibleForm = true;
    // this.adicionar = true;
    // this.modificar = false;
    // this.form.reset();
  }
}

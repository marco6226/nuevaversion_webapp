import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  estructuraSelected!: string;
  varSelected: string = '';
  varNodes!: string;
  adicionar!: boolean;
  modificar!: boolean;
  visibleForm!: boolean;
  form!: FormGroup;
  areaSelected: any;
  estruct: any;

  constructor(
    private messageService: MessageService,
    private tipoAreaService: TipoAreaService,
    private areaService: AreaService,
    private sesionService: SesionService,
    private fb: FormBuilder,
  ) { 
    this.form = fb.group({
      'id': [null],
      'nombre': ['', Validators.required],
      'descripcion': [null],
      'tipoAreaId': [null, Validators.required]
    });
  }

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
    this.estructuraSelected = estructSelected;
    switch (estructSelected) {
      case Estructura.ORGANIZACIONAL.toString():
        this.varSelected = 'areaSelected';
        this.varNodes = 'areasNodes';
        break;
      case Estructura.FISICA.toString():
        this.varSelected = 'sedeSelected';
        this.varNodes = 'sedesNodes';
        break;
    }
    this.visibleForm = true;
    this.adicionar = true;
    this.modificar = false;
    this.form.reset();
  }

  async showUpdateForm(estructSelected: string) {
    this.estructuraSelected = estructSelected;
    switch (estructSelected) {
      case Estructura.ORGANIZACIONAL.toString():
        this.estruct = this['areaSelected']
        this.varNodes = 'areasNodes';
        break;
      case Estructura.FISICA.toString():
        // this.varSelected = 'sedeSelected';
        this.estruct = this['sedesNodes'];
        this.varNodes = 'sedesNodes';
        break;
    }
    if (this.estruct != null) {
      this.visibleForm = true;
      this.adicionar = false;
      this.modificar = true;
      this.form.patchValue({
        'id': this.estruct.id,
        'nombre': this.estruct.label,
        'descripcion': this.estruct.descripcion,
        'tipoAreaId': this.estruct.tipoAreaId
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Debe seleccionar un nodo',
        detail: 'para realizar la actualización del mismo'
      });
    }
  }

  onAreaDelete(estructura: string) {
    var estruct;
    switch (estructura) {
      case Estructura.ORGANIZACIONAL.toString():
        estruct = this['areaSelected']
        this.varNodes = 'areasNodes';
        break;
      case Estructura.FISICA.toString():
        estruct = this['sedesNodes'];
        this.varNodes = 'sedesNodes';
        break;
    }
    //-------

    if (estruct != null) {
      this.areaService.delete(estruct.id).then(
        data => this.manageDelete()
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Debe seleccionar un nodo',
        detail: 'para realizar la eliminación del mismo'
      });
    }
  }

  manageDelete() {
    let nodoPadre = this.estruct.nodoPadre;
    for (let i = 0; i < nodoPadre.children.length; i++) {
      if (nodoPadre.children[i].id == this.estruct.id) {
        nodoPadre.children.splice(i, 1);
        break;
      }
    }
    if (this.estruct.children != null) {
      this.estruct.children.forEach((ar: any) => {
        ar.nodoPadre = nodoPadre;
        nodoPadre.children.push(ar);
      });
    }
    nodoPadre.children = nodoPadre.children.slice();
    this.messageService.add({ severity: 'success', summary: 'Nodo eliminado', detail: 'se ha realizado la eliminación del nodo ' + this.estruct.label });
    this.estruct = null;

    // this.varNodes = null;
    // this.varSelected = null;
  }
  
  onSubmit() {
    if (this.form.valid && this.estructuraSelected != null) {
      let area: Area = new Area();
      area.nombre = this.form.value.nombre;
      area.descripcion = this.form.value.descripcion;
      area.tipoArea = new TipoArea();
      area.tipoArea.id = this.form.value.tipoAreaId;
      area.estructura = this.estructuraSelected;

      if (this.modificar) {
        area.id = this.estruct.id;
        this.areaService.update(area).then(
          resp => this.manageCreateResponse(<Area>resp)
        );
      } else if (this.adicionar) {
        if (this.estruct != null) {
          area.areaPadre = new Area();
          area.areaPadre.id = this.estruct.id;
        }
        this.areaService.create(area).then(
          resp => this.manageCreateResponse(<Area>resp)
        );
      }
    }
  }

  manageCreateResponse(area: Area) {

    if (this.adicionar) {
      if (this.estruct != null && this.estruct.children == null) {
        this.estruct.children = [];
      }
      let node = {
        id: area.id,
        label: area.nombre,
        descripcion: area.descripcion,
        tipoAreaId: area.tipoArea.id,
        expanded: true,
        nodoPadre: null,
      };
      if (this.estruct != null) {
        node.nodoPadre = this.estruct;
        this.estruct.children.push(node);
        this.estruct.children = this.estruct.children.slice();
      } else {
        node.nodoPadre = this.estruct[0];
        this.estruct[0].children.push(node);
        this.estruct[0].children = this.estruct[0].children.slice();
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Adición realizada!',
        detail: 'Se ha creado correctamente el nodo ' + area.nombre
      });
    } else if (this.modificar) {
      this.estruct.label = area.nombre;
      this.messageService.add({
        severity: 'success',
        summary: 'Actualización realizada!',
        detail: 'Se ha actualizado correctamente el nodo ' + area.nombre
      });
    }
    // this.varNodes = null;
    // this.varSelected = null;
    this.closeForm();
  }
  
  closeForm() {
    this.visibleForm = false;
    this.adicionar = false;
    this.modificar = false;
  }
}

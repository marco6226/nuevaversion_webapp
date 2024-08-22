import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MessageService,
  SelectItem,
  TreeNode,
  Message,
  ConfirmationService,
} from 'primeng/api';
import { Criteria } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { SesionService } from '../../../core/services/session.service';
import { Area, Estructura } from '../../entities/area';
import { TipoArea } from '../../entities/tipo-area';
import { TreeNodeExpand } from '../../entities/tree-node-expand';
import { AreaService } from '../../services/area.service';
import { TipoAreaService } from '../../services/tipo-area.service';
// import { SelectItem, Message, ConfirmationService, TreeNode } from 'primeng/primeng';

@ViewChild('diagram')
@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
})
export class AreaComponent implements OnInit {
  @ViewChild('btnStorageArea') btnStorageArea!: ElementRef;

  visibleTree: boolean = false;
  areasNodes: TreeNode[] = [];
  areasNodesDialog: TreeNode[] = [];
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
  areaSelectedDialog: any;
  estruct: any;
  visibleFilterArea: boolean = false;
  msgs: Message[] = [];

  constructor(
    public messageService: MessageService,
    private tipoAreaService: TipoAreaService,
    private areaService: AreaService,
    private sesionService: SesionService,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: [null],
      tipoAreaId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAreas();
  }

  async loadAreas() {
    this.tipoAreaService
      .findAll()
      .then((data: any) =>
        (<TipoArea[]>data['data']).forEach((ta) =>
          this.tiposAreaList.push({ label: ta.nombre, value: ta.id })
        )
      );
    let filterAreaQuery = new FilterQuery();
    filterAreaQuery.filterList = [
      {
        field: 'areaPadre',
        criteria: Criteria.IS_NULL,
        value1: null,
        value2: null,
      },
      {
        field: 'estructura',
        criteria: Criteria.EQUALS,
        value1: Estructura.ORGANIZACIONAL.toString(),
        value2: null,
      },
    ];
    this.areaService.findByFilter(filterAreaQuery).then((data: any) => {
      let root: TreeNode = {
        label: this.sesionService.getEmpresa()!.razonSocial,
        selectable: true,
        expanded: true,
        key: this.sesionService.getEmpresa()!.razonSocial,
      };

      let nodos = this.createTreeNode(<Area[]>data['data'], null);
      root.children = nodos;
      this.areasNodes.push(root);
      this.visibleTree = true;
    });
    let filterSedesQuery = new FilterQuery();
    filterSedesQuery.filterList = [
      {
        field: 'areaPadre',
        criteria: Criteria.IS_NULL,
        value1: null,
        value2: null,
      },
      {
        field: 'estructura',
        criteria: Criteria.EQUALS,
        value1: Estructura.FISICA.toString(),
        value2: null,
      },
    ];
    this.areaService.findByFilter(filterSedesQuery).then((data: any) => {
      let root: TreeNode = {
        label: this.sesionService.getEmpresa()!.razonSocial,
        selectable: false,
        expanded: true,
      };

      let nodos = this.createTreeNode(<Area[]>data['data'], null);
      root.children = nodos;
      this.sedesNodes.push(root);
      this.visibleTree = true;
    });
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
        selected: true,
        key: area.nombre,
      };
      n.children =
        area.areaList != null ? this.createTreeNode(area.areaList, n) : [];
      nodes.push(n);
    }
    return nodes;
  }

  showAddForm(estructSelected: string) {
    this.estructuraSelected = estructSelected;
    switch (estructSelected) {
      case Estructura.ORGANIZACIONAL.toString():
        this.varSelected = 'areaSelected';
        this.estruct = this['areaSelected'];
        this.varNodes = 'areasNodes';
        break;
      case Estructura.FISICA.toString():
        this.varSelected = 'sedeSelected';
        this.estruct = this['sedesNodes'];
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
    this.msgs = [];
    switch (estructSelected) {
      case Estructura.ORGANIZACIONAL.toString():
        this.estruct = this['areaSelected'];
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
        id: this.estruct.id,
        nombre: this.estruct.label,
        descripcion: this.estruct.descripcion,
        tipoAreaId: this.estruct.tipoAreaId,
      });
    } else {
      this.msgs.push({
        severity: 'warn',
        summary: '¡¡Advertencia!!.',
        detail: 'Se Debe Seleccionar un Nodo Para realizar la Actualización.',
      });
    }
  }

  onAreaDelete(estructura: string) {
    var estruct: any;
    this.msgs = [];
    switch (estructura) {
      case Estructura.ORGANIZACIONAL.toString():
        estruct = this['areaSelected'];
        this.varNodes = 'areasNodes';
        break;
      case Estructura.FISICA.toString():
        estruct = this['sedesNodes'];
        this.varNodes = 'sedesNodes';
        break;
    }
    //-------
    if (estruct.children) {
      if (estruct.children.length === 0) {
        this.invokeDeleteService(estruct);
      } else {
        this.msgs.push({
          severity: 'warn',
          summary: '¡¡Advertencia!!.',
          detail:
            'Se Tiene Información Asociada, por lo Tanto, no es Posible eliminar el Nodo.',
        });
      }
    } else {
      this.invokeDeleteService(estruct);
    }
  }

  invokeDeleteService(estruct: any) {
    if (estruct != null || estruct != undefined) {
      this.areaService
        .delete(estruct.id)
        .then(
          (data) => {
            console.log("Data eliminar: ", data);
            this.manageDelete(estruct);
          }
        );
    } else {
      this.msgs.push({
        severity: 'warn',
        summary: '¡¡Advertencia!!.',
        detail: 'Se Debe Seleccionar un Nodo Para realizar la Eliminación.',
      });
    }
  }

  manageDelete(estruct: any) {
    let nodoPadre = estruct.nodoPadre;
    this.msgs = [];
    if (nodoPadre != null) {
      for (let i = 0; i < nodoPadre.children.length; i++) {
        if (nodoPadre.children[i].id == estruct.id) {
          nodoPadre.children.splice(i, 1);
          break;
        }
      }
    }
    if (estruct.children != null) {
      estruct.children.forEach((ar: any) => {
        ar.nodoPadre = nodoPadre;
        nodoPadre.children.push(ar);
      });
    }
    if (nodoPadre.children) {
      nodoPadre.children = nodoPadre.children.slice();
    }

    this.msgs.push({
      severity: 'success',
      summary: '¡¡Exitoso!!.',
      detail: 'Se ha Realizado la Eliminación del Nodo ' + estruct.label,
    });
    estruct = null;
    this.estruct = null;
  }

  onSubmit() {
    if (this.form.valid && this.estructuraSelected != null) {
      this.btnStorageArea.nativeElement.disabled = true;
      let area: Area = new Area();
      area.nombre = this.form.value.nombre;
      area.descripcion = this.form.value.descripcion;
      area.tipoArea = new TipoArea();
      area.tipoArea.id = this.form.value.tipoAreaId;
      area.estructura = this.estructuraSelected;

      if (this.modificar) {
        area.id = this.estruct.id;
        this.areaService.update(area).then((resp) => {
          this.manageCreateResponse(<Area>resp);
        });
      } else if (this.adicionar) {
        if (this.estruct != null) {
          if (this.estruct.id != undefined) {
            area.areaPadre = new Area();
            area.areaPadre.id = this.estruct.id;
          }
        }
        this.areaService
          .create(area)
          .then((resp) => this.manageCreateResponse(<Area>resp));
      }
    }
  }

  manageCreateResponse(area: Area) {
    this.msgs = [];
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
      if (this.estruct != null || this.estruct != undefined) {
        node.nodoPadre = this.estruct;
        this.estruct.children.push(node);
        this.estruct.children = this.estruct.children.slice();
      }
      this.msgs.push({
        severity: 'success',
        summary: 'Exitoso!!.',
        detail: 'Se ha creado correctamente el nodo ' + area.nombre,
      });
    } else if (this.modificar) {
      this.estruct.label = area.nombre;
      // this.messageService.add({
      this.msgs.push({
        severity: 'success',
        summary: '¡¡Exitoso!!.',
        detail: 'Se ha Actualizado Correctamente el Nodo ' + area.nombre,
      });
    }
    // this.varNodes = null;
    // this.varSelected = null;
    this.closeForm();
    this.btnStorageArea.nativeElement.disabled = false;
  }

  closeForm() {
    this.visibleForm = false;
    this.adicionar = false;
    this.modificar = false;
  }

  showDialog() {
    this.visibleFilterArea = true;
  }

  nodeSelect(event: any) {
    if (event.node.children && event.node.children.length > 0) {
      event.node.expanded = true;
    }
  }
}

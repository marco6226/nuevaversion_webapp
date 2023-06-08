import { Component, EventEmitter, Input, OnInit, Output,forwardRef } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { Criteria } from 'src/app/website/pages/core/entities/filter';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { SesionService } from 'src/app/website/pages/core/services/session.service';
import { Area, Estructura } from '../../../entities/area';
import { AreaService } from '../../../services/area.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms'
import { TreeNodeExpand } from '../../../entities/tree-node-expand';

@Component({
  selector: 'area-selector',
  templateUrl: './area-selector.component.html',
  styleUrls: ['./area-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AreaSelectorComponent),
      multi: true
    }
  ]
  
})
// , ControlValueAccessor
export class AreaSelectorComponent implements OnInit, ControlValueAccessor{

  @Input() name!: string;
  @Input() _value!: Area;
  @Input() disabled!: boolean;
  @Output() onAreaSelect = new EventEmitter();
  @Output() onDivision = new EventEmitter();

  areaSelected: any;

  niveles: number = 1;
  areasNodes: TreeNode[] = [];
  sedesNodes: TreeNode[] = [];
  displayDialog: boolean = false;
  lblBtn!: string;
  sugerenciasList!: TreeNode[];
  loading: boolean = false;
  division?: string | null =null;
  empresaId = this.sesionService.getEmpresa()!.id;
  visibleFilterArea: boolean = false;

  constructor(
    private sesionService: SesionService,
    private messageService: MessageService,
    private areaService: AreaService,
  ) { }

  ngOnInit(): void {
    this.loadAreas();
    this.areaSelected = this.name;
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.lblBtn = this._value == null ? "--Seleccionar--" : this._value.nombre;
    this.updateUI();
    this.propagateChange(this._value);
  }

  async loadAreas() {
    let allComplete = {
      organi: false,
      fisica: false
    };
    this.loading = true;
    let filterAreaQuery = new FilterQuery();
    filterAreaQuery.filterList = [
      { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
      { field: 'estructura', criteria: Criteria.EQUALS, value1: Estructura.ORGANIZACIONAL.toString(), value2: null }
    ];
    this.areaService.findByFilter(filterAreaQuery)
      .then((data: any) => {
        let root: TreeNode = {
          label: this.sesionService.getEmpresa()!.razonSocial,
          selectable: true,
          expanded: false,
          key: this.sesionService.getEmpresa()!.razonSocial
        };
        let nodos = this.createTreeNode(<Area[]>data['data'], null);
        root.children = nodos;
        this.areasNodes.push(root);
        allComplete.organi = true;
        if (allComplete.organi == true && allComplete.fisica == true) {
          this.loading = false
        }
      })
      .catch(err => {
        this.loading = false
      });

    let filterSedesQuery = new FilterQuery();
    filterSedesQuery.filterList = [
      { field: 'areaPadre', criteria: Criteria.IS_NULL, value1: null, value2: null },
      { field: 'estructura', criteria: Criteria.EQUALS, value1: Estructura.FISICA.toString(), value2: null }
    ];
    await this.areaService.findByFilter(filterSedesQuery)
      .then((data: any) => {
        let root: TreeNode = {
          label: '',
          selectable: false,
          expanded: false,
        };

        let nodos = this.createTreeNode(<Area[]>data['data'], null);
        root.children = nodos;
        this.sedesNodes.push(root);
        allComplete.fisica = true;
        if (allComplete.organi == true && allComplete.fisica == true) {
          this.loading = false
        }
      }
      )
      .catch(err => {
        this.loading = false
      });
      setTimeout(async () => {
        this.collapseAll();
        this.collapseAllhijos();
    }, 3000);
      
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
        key: area.nombre
      };
      n.children = (area.areaList != null ? this.createTreeNode(area.areaList, n) : []);
      n.expanded = area.areaList != null && area.areaList.length > 0;
      nodes.push(n);
    }
    return nodes;
  }
  
  propagateChange = (_: any) => { };

  async onAreaChange() {

    if (this.areaSelected == null) {
      this.messageService.add({ detail: 'Debe seleccionar un área', severity: 'warn' });
    } else {
      let area = new Area();
      area.id = this.areaSelected.id;
      area.nombre = this.areaSelected.label;
      area.descripcion = this.areaSelected.descripcion;
      this.value = area;
      this.onAreaSelect.emit(area);
      this.closeDialog();

      if(this.empresaId=='22'){
      await this.padreArea(area.id)
      this.onDivision.emit(this.division)
    }}
  }

  showDialog() {
    this.displayDialog = true;
  }

  closeDialog() {
    this.displayDialog = false;
  }

  updateUI() {
    if (this.value != null) {
      let areaNode = this.searchNode(this.sedesNodes, this.value.id!);
      if (areaNode == null) {
        areaNode = this.searchNode(this.areasNodes, this.value.id!);
      }
      this.areaSelected = areaNode;
    } else {
      this.areaSelected = null;
    }
  }

  searchNode(nodes: any, nodeId: string) {
    let nodeFound: any = null;
    for (let i = 0; i < nodes.length; i++) {
      let areaNode = nodes[i];
      if (areaNode.id == nodeId) {
        nodeFound = areaNode;
      } else {
        nodeFound = this.searchNode(areaNode.children, nodeId);
      }
      if (nodeFound != null) {
        return nodeFound;
      }
    }
    return nodeFound;
  }

  async padreArea(idarea:any){
    let filterAreaQuery = new FilterQuery();
    filterAreaQuery.fieldList = ["padreNombre"];
    filterAreaQuery.filterList = [
      { field: 'id', criteria: Criteria.EQUALS, value1: idarea, value2: null }
    ];
    await this.areaService.findByFilter(filterAreaQuery).then((data:any) => 
    {
      this.division=data['data'][0]['padreNombre'].toString()
    })

  }

  collapseAll(){
    this.areasNodes.forEach( node => {
        this.expandRecursive(node, false);
    } );
  }

  collapseAllhijos(){
    this.areasNodes[0].children!.forEach( node => {
        this.expandRecursive(node, false);
    } );
  }

  private expandRecursive(node:TreeNode, isExpand:boolean){
    node.expanded = isExpand;
    if (node.children){
        node.children.forEach( childNode => {
            this.expandRecursive(childNode, isExpand);
        } );
    }
  }
  writeValue(value: Area) {
    this.value = value;
  }
  registerOnChange(fn : any) {
    this.propagateChange = fn;
  }
  registerOnTouched() { }

  showDialogFilter(){
    this.visibleFilterArea = true;

  }

  nodeSelect(event: any){
    if(event.node.children.length>0){
      event.node.expanded = true;
    }
  }
}


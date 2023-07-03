import { Component, OnInit } from '@angular/core';
import { CargoService } from 'src/app/website/pages/empresa/services/cargo.service'
import { CompetenciaService } from 'src/app/website/pages/empresa/services/competencia.service'
import { Cargo } from 'src/app/website/pages/empresa/entities/cargo'
import { Empresa } from 'src/app/website/pages/empresa/entities/empresa'

import { Message,SelectItem, TreeNode,ConfirmationService} from 'primeng/api';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SesionService } from 'src/app/website/pages/core/services/session.service'
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query'
import { competencias, perfil_educativo } from 'src/app/website/pages/rai/entities/reporte-enumeraciones'
import { Competencia } from '../../entities/competencia';
import { Criteria } from '../../../core/entities/filter';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.scss'],
  providers: [EmpresaService]
})
export class CargoComponent implements OnInit {
  msgs?: Message[] = [];
  cargosList?: Cargo[];
  cargoSelect?: Cargo;
  visibleForm?: boolean;
  visibleFormComp?: boolean;
  form?: FormGroup;
  empresaId = this.sesionService.getEmpresa()!.id;
  isUpdate?: boolean;
  modeloCompt?: TreeNode[];

  loading?: boolean;
  totalRecords?: number;

  fields?: string[];

  funciones?: any[];
  formacionList?: any[];
  competenciasList?: any[];
  perfilEducativoList?: any[];

  competenciasOpts?: Competencia[];
  perfilEducativoOpts: SelectItem[] = [{ label: '--Seleccione--', value: ''}].concat(perfil_educativo);

  constructor(
    private competenciaService: CompetenciaService,
    private cargoService: CargoService,
    private sesionService: SesionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    fb: FormBuilder
  ) { 
    this.form= fb.group({
      id: [null, /*Validators.required*/],
      nombre: [null, /*Validators.required*/],
      descripcion: [null, /*Validators.required*/],
      valorMinimo: [null, /*Validators.required*/],
      unidadMinima: [null, /*Validators.required*/],
      valorDeseable: [null, /*Validators.required*/],
      unidadDeseable: [null, /*Validators.required*/],
  });
  }

  ngOnInit(): void {
    let fq = new FilterQuery();
    fq.filterList = [{ field: 'competencia', criteria: Criteria.IS_NULL }];
    this.competenciaService.findByFilter(fq).then(
      (resp : any) => {
        this.competenciasOpts = resp['data'];
        this.construirArbolCompt(this.competenciasOpts || []);
      }
    );
    this.loading = true;
  }

  showAddForm() {
    this.visibleForm = true;
    this.isUpdate = false;

    this.form?.reset();
    this.funciones = [];
    this.perfilEducativoList = [];
    this.formacionList = [];
  }

  lazyLoad(event: any) {
    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;

    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

    this.cargoService.findByFilter(filterQuery).then(
      (resp: any) => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.cargosList = [];
        (<any[]>resp['data']).forEach(dto => this.cargosList?.push(FilterQuery.dtoToObject(dto)));
      }
    );
  }

  showUpdateForm() {
    if (this.cargoSelect != null) {

      this.form?.reset();
      this.funciones = [];
      this.perfilEducativoList = [];
      this.formacionList = [];

      this.visibleForm = true;
      this.isUpdate = true;

      let ficha = JSON.parse(this.cargoSelect.ficha!);
      if (ficha != null) {
        this.formacionList = ficha.formacion;
        this.perfilEducativoList = ficha.perfilEducativo;
        this.funciones = ficha.funciones;
      }
      this.form?.patchValue({
        id: this.cargoSelect.id,
        nombre: this.cargoSelect.nombre,
        descripcion: this.cargoSelect.descripcion,
        valorMinimo: ficha == null ? null : ficha.experienciaLaboral.valorMinimo,
        unidadMinima: ficha == null ? null : ficha.experienciaLaboral.unidadMinima,
        valorDeseable: ficha == null ? null : ficha.experienciaLaboral.valorDeseable,
        unidadDeseable: ficha == null ? null : ficha.experienciaLaboral.unidadDeseable,
      });

      this.competenciasList = [];
      this.cargoSelect.competenciasList!.forEach(comp => {
        this.competenciasList?.push({ data: comp });
      });



    } else {
      this.messageService.clear;
      // this.msgs?.push({ severity: 'warn', summary: "Debe seleccionar un cargo", detail: "Debe seleccionar un cargo para modificar" });
      this.messageService.add({ severity: 'warn', summary: "Debe seleccionar un cargo", detail: "Debe seleccionar un cargo para modificar" });
    }
  }

  onCargoDelete() {
    if (this.cargoSelect != null) {
      this.confirmationService.confirm({
        header: 'Eliminar cargo "' + this.cargoSelect.nombre + '"',
        message: '¿Esta seguro de borrar este cargo?',
        accept: () => this.deleteCargo()
      });
    } else {
      this.messageService.clear;
      // this.messageService.add({ key:'myKey1', severity: 'warn', summary: "Debe seleccionar un cargo", detail: "Debe seleccionar un cargo para modificar" });
      this.messageService.add({ severity: 'warn', summary: "Debe seleccionar un cargo", detail: "Debe seleccionar un cargo para eliminarlo" });
    }
  }

  deleteCargo() {
    this.cargoService.delete(this.cargoSelect?.id || '').then(
      data => {
        this.cargoSelect = undefined;
        let cargoEliminado = <Cargo>data;
        // this.msgs = [];
        this.messageService.clear;
        
        this.messageService.add({severity: 'success', summary: "Cargo eliminado", detail: "Ha sido eliminado el cargo " + cargoEliminado.nombre });
        for (let i = 0; i < this.cargosList!.length; i++) {
          if (this.cargosList![i].id == cargoEliminado.id) {
            this.cargosList?.splice(i, 1);
            this.cargosList = this.cargosList?.slice();
            break;
          }
        }
      }
    );
  }

  onSubmit() {
    let cargo = new Cargo();
    cargo.id = this.form?.value.id;
    cargo.nombre = this.form?.value.nombre;
    cargo.descripcion = this.form?.value.descripcion;
    cargo.empresa = new Empresa();
    cargo.empresa.id = this.empresaId;
    cargo.ficha = JSON.stringify({
      funciones: this.funciones,
      perfilEducativo: this.perfilEducativoList,
      formacion: this.formacionList,
      experienciaLaboral: {
        valorMinimo: this.form?.value.valorMinimo,
        unidadMinima: this.form?.value.unidadMinima,
        valorDeseable: this.form?.value.valorDeseable,
        unidadDeseable: this.form?.value.unidadDeseable,
      }
    });

    if (this.competenciasList != null) {
      cargo.competenciasList = [];
      this.competenciasList.forEach(comp => {
        cargo.competenciasList?.push(comp.data);
      });
    }

    if (this.isUpdate) {
      this.cargoService.update(cargo).then(
        data => this.manageUpdateResponse(<Cargo>data)
      );
    } else {
      this.cargoService.create(cargo).then(
        data => this.manageCreateResponse(<Cargo>data)
      );
    }
  }

  manageUpdateResponse(cargo: Cargo) {
    for (let i = 0; i < this.cargosList!.length; i++) {
      if (this.cargosList![i].id == cargo.id) {
        this.cargosList![i] = cargo;
        break;
      }
    }
    this.messageService.clear;
    this.messageService.add({ severity: 'success', summary: "Cargo actualizado", detail: "Se ha actualizado el cargo " + cargo.nombre });
    this.closeForm();
  }

  manageCreateResponse(cargo: Cargo) {
    if (this.cargosList == null) {
      this.cargosList = [];
    }
    this.cargosList.push(cargo);
    this.cargosList = this.cargosList.slice();
    // this.msgs = [];
    this.messageService.clear;
    this.messageService.add({  key:'myKey1',severity: 'success', summary: "Nuevo cargo creado", detail: "Se ha creado el cargo " + cargo.nombre });
    this.closeForm();
  }

  closeForm() {
    this.visibleForm = false;
  }

  addFuncion() {
    if (this.funciones == null) {
      this.funciones = [{ value: '' }];
    } else {
      this.funciones.push({ value: '' });
    }
  }
  removerFuncion(index: number) {
    this.funciones?.splice(index, 1);
  }
  addPerfilEdu() {
    if (this.perfilEducativoList == null) {
      this.perfilEducativoList = [{ minima: '', deseable: '' }];
    } else {
      this.perfilEducativoList.push({ minima: '', deseable: '' });
    }
  }
  removerPerfilEdu(index: number) {
    this.perfilEducativoList?.splice(index, 1);
  }

  addFormacion() {
    if (this.formacionList == null) {
      this.formacionList = [{ minima: '', deseable: '' }];
    } else {
      this.formacionList.push({ minima: '', deseable: '' });
    }
  }
  removerFormacion(index: number) {
    this.formacionList?.splice(index, 1);
  }

  addCompetencia() {
    if (this.competenciasList == null) {
      this.competenciasList = [{ value: '' }];
    } else {
      this.competenciasList.push({ value: '' });
    }
  }

  construirArbolCompt(list: Competencia[]) {
    this.modeloCompt = [];
    this.recursiveBuildCompt(list, this.modeloCompt);
    this.modeloCompt = this.modeloCompt.slice();
  }

  recursiveBuildCompt(list: Competencia[], nodes: TreeNode[]) {
    list.forEach(comp => {
      let node: TreeNode = { data: comp };
      if (comp.competenciaList != null && comp.competenciaList.length > 0) {
        node.children = [];
        this.recursiveBuildCompt(comp.competenciaList, node.children);
      }
      nodes.push(node);
    });
  }

}

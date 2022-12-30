import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Message } from 'primeng/api/message';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Perfil } from '../../../empresa/entities/perfil';
import { PerfilService } from '../../services/perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  providers: [PerfilService],
})
export class PerfilComponent implements OnInit {
  

  empresaId!: string;
  perfilList!: Perfil[];
  visibleDlg!: boolean;
  perfil!: Perfil | null;
  msgs!: Message[];
  visibleBtnSave!: boolean;
  loading!: boolean;
  totalRecords!: number;
  fields: string[] = [
    'id',
    'nombre',
    'descripcion'
  ];

  constructor(
    private perfilService: PerfilService
  ) { }

  ngOnInit(): void {
  }

  lazyLoad(event: any) {
    this.loading = false;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;

    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

    this.perfilService.findByFilter(filterQuery).then(
      (resp:any) => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.perfilList = [];
        (<any[]>resp['data']).forEach(dto => this.perfilList.push(FilterQuery.dtoToObject(dto)));
      }
    );
  }

  abrirDlgNuevo() {
    this.visibleDlg = true;
    this.perfil = {
      id: "",
      nombre: "", 
      descripcion: "", 
      permisoList: []
    };
    this.visibleBtnSave = true;
  }

  abrirDlgModificar() {
    this.visibleDlg = true;
    this.visibleBtnSave = false;
  }

  hideDlg() {
    this.perfil = null;
  }

  adicionar() {
    this.perfilService.create(this.perfil!).then(
      resp => this.manageResponse(<Perfil>resp, false)
    );
  }

  modificar() {
    this.perfilService.update(this.perfil!).then(
      resp => this.manageResponse(<Perfil>resp, true)
    );
  }

  manageResponse(perfil: Perfil, isUpdate: boolean) {
    if (!isUpdate) {
      this.perfilList.push(perfil);
      this.perfilList = this.perfilList.slice();
    }
    this.msgs = [];
    this.msgs.push({
      severity: 'success',
      summary: 'Perfil creado',
      detail: 'Se ha ' + (isUpdate ? 'actualizado' : 'creado') + ' correctamente el perfil ' + perfil.nombre
    });
    this.visibleDlg = false;
    this.perfil = null;
  }
}

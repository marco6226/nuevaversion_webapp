import { Component, OnInit } from '@angular/core';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Perfil } from '../../../empresa/entities/perfil';
import { MessageService } from 'primeng/api';
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
  perfil!: Perfil;
  visibleBtnSave!: boolean;
  loading!: boolean;
  totalRecords!: number;
  fields: string[] = [
    'id',
    'nombre',
    'descripcion'
  ];


  constructor(
    private perfilService: PerfilService,
    private msgs: MessageService
  ) {
  }

  ngOnInit() {
    this.loading = true;
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

    this.perfilService.findByFilter(filterQuery).then(
      (resp: any) => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.perfilList = [];
        (<any[]>resp['data']).forEach(dto => this.perfilList.push(FilterQuery.dtoToObject(dto)));
      }
    );
  }

  abrirDlgNuevo() {
    this.visibleDlg = true;
    this.perfil = new Perfil();
    this.visibleBtnSave = true;
  }

  abrirDlgModificar() {
    this.visibleDlg = true;
    this.visibleBtnSave = false;
  }

  hideDlg() {
    this.perfil = new Perfil();
  }

  adicionar() {
    this.perfilService.create(this.perfil).then(
      resp => this.manageResponse(<Perfil>resp, false)
    );
  }

  modificar() {
    this.perfilService.update(this.perfil).then(
      resp => this.manageResponse(<Perfil>resp, true)
    );
  }

  manageResponse(perfil: Perfil, isUpdate: boolean) {
    if (!isUpdate) {
      this.perfilList.push(perfil);
      this.perfilList = this.perfilList.slice();
    }
    this.msgs.add({
      severity: 'success',
      summary: 'Perfil creado',
      detail: 'Se ha ' + (isUpdate ? 'actualizado' : 'creado') + ' correctamente el perfil ' + perfil.nombre
    });
    this.visibleDlg = false;
    this.perfil = new Perfil();
  }
}

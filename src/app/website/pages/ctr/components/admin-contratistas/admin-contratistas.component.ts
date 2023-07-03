import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Criteria, Filter } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { SesionService } from '../../../core/services/session.service';
import { Empresa } from '../../../empresa/entities/empresa';
import { EmpresaService } from '../../../empresa/services/empresa.service';

@Component({
  selector: 's-adminContratistas',
  templateUrl: './admin-contratistas.component.html',
  styleUrls: ['./admin-contratistas.component.scss'],
  providers: [EmpresaService, SesionService]
})
export class AdminContratistasComponent implements OnInit {

  empresasList!: Empresa[];
  dlgVisible!: boolean;
  empresa: Empresa;
  styleMap: { [key: string]: string } = {};
  @Input() flagConsult: boolean=false;

  constructor(
    private sesionService: SesionService,
    private empresaService: EmpresaService,
    private messageService: MessageService
  ) {
    this.empresa = this.sesionService.getEmpresa()!;
    let filterQuery = new FilterQuery();
    let filter = new Filter();
    filter.criteria = Criteria.NOT_EQUALS;
    filter.field = "id";
    filter.value1 = this.empresa.id;;
    filterQuery.filterList = [filter];
    this.empresaService.findByFilter(filterQuery).then(
      (resp: any) => this.cargarEmpresas(<any[]>resp['data'])
    );
  }

  cargarEmpresas(data: Empresa[]) {
    this.empresasList = data;
    this.empresaService.obtenerContratistas(this.empresa.id!).then(
      resp => {
        let empresasContratistasList = <Empresa[]>resp;
        this.empresasList.forEach((emp) =>
          empresasContratistasList.forEach(
            empCont => {
              if (emp.id == empCont.id) {
                emp = {
                  ...emp,
                  vinculado: true
                }
              }
            }
          )
        );
        this.styleMap['true'] = 'active-no-hover';
      }
    );
  }

  ngOnInit() {

  }

  actualizarVinculacion(empresa: any) {
    this.empresaService.vincularContratista(empresa).then(
      data => {
        let vinculado = data;
        let resultado = (vinculado ? 'vinculado' : 'desvinculado');
        this.messageService.add({
          severity: 'success',
          summary: 'Contratista ' + resultado,
          detail: 'Se ha ' + resultado + ' correctamente la empresa ' + empresa.razonSocial + ' como contratista'
        });
      }
    );
  }

}

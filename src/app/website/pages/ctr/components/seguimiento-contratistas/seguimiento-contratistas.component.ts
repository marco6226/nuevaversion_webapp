import { Component, OnInit,Input } from '@angular/core';
import { SesionService } from '../../../core/services/session.service';
import { Empresa } from '../../../empresa/entities/empresa';
import { EmpresaService } from '../../../empresa/services/empresa.service';

@Component({
  selector: 's-seguimientoContratistas',
  templateUrl: './seguimiento-contratistas.component.html',
  styleUrls: ['./seguimiento-contratistas.component.scss'],
  providers: [EmpresaService, SesionService]
})
export class SeguimientoContratistasComponent implements OnInit {

  empresasList!: Empresa[];
  empresa: Empresa | null;
  visibleDash!: boolean;
  @Input() flagConsult: boolean = false;

  constructor(
    private sesionService: SesionService,
    private empresaService: EmpresaService,
  ) {
    this.empresa = this.sesionService.getEmpresa();
    this.empresaService.obtenerContratistas(this.empresa!.id!).then(
      data => this.empresasList = <Empresa[]>data
    );
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ConfiguracionGeneral } from '../../pages/comun/entities/configuracion-general';
import { ConfiguracionGeneralService } from '../../pages/comun/services/configuracion-general.service';
import { HelperService } from '../../pages/core/services/helper.service';
import { SesionService } from '../../pages/core/services/session.service';
import { Empleado } from '../../pages/empresa/entities/empleado';
import { Empresa } from '../../pages/empresa/entities/empresa';
import { Permiso } from '../../pages/empresa/entities/permiso';
import { Usuario } from '../../pages/empresa/entities/usuario';
import { EmpresaService } from '../../pages/empresa/services/empresa.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

	actualizarPermisos: any;
	usuario!: Usuario | null;
	empresasItems: SelectItem[] = [];
  empresaSelect?: Empresa | null;
	empresaSelectOld?: Empresa | null;

  constructor(
		private helperService: HelperService,
		private empresaService: EmpresaService,
		private sesionService: SesionService,
		private confGenService: ConfiguracionGeneralService,
    
  ) { }

  async ngOnInit(): Promise<void> {
		await this.helperService.customMessage.subscribe(msg => this.actualizarPermisos = msg);
		this.usuario = await this.sesionService.getUsuario();

    this.empresaService.findByUsuario(this.usuario!.id).then(
			resp => this.loadItems(<Empresa[]>resp)
		);

  }

  async loadItems(empresas: Empresa[]) {
		empresas.forEach(emp => {
			this.empresasItems.push({ label: emp.nombreComercial, value: emp });
		});
		if (this.sesionService.getEmpresa() == null) {
			await this.sesionService.setEmpresa(empresas[0]);
		}
		this.empresaSelect = await this.sesionService.getEmpresa();
		this.empresaSelectOld = this.empresaSelect;

		this.confGenService.obtenerPorEmpresa()
			.then((resp: ConfiguracionGeneral[] | any) => {
				let mapaConfig: string | any = {};
				resp.forEach((conf: { codigo: string | number; valor: any; nombre: any; }) => mapaConfig[conf.codigo] = { 'valor': conf.valor, 'nombre': conf.nombre });
				this.sesionService.setConfiguracionMap(mapaConfig);
				this.menuComp.recargarMenu();
			});

			await this.permisoService.findAll()
			.then((data: Permiso[]) => {
				this.mapaPermisos = {};
				data.forEach(element => this.mapaPermisos[element.recurso.codigo] = { 'valido': element.valido, 'areas': element.areas });
				this.sesionService.setPermisosMap(this.mapaPermisos);
				console.log(this.mapaPermisos);
				this.menuComp.recargarMenu();
			});

			         
				await this.empleadoService.findempleadoByUsuario(this.usuario.id).then(
          (					resp: Empleado) => {
					  this.empleado = <Empleado>(resp);	
					  console.log(this.empleado);				  
					  this.sesionService.setEmpleado(this.empleado);
					}
				  );
	}

}

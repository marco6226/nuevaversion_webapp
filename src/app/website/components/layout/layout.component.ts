import { Component, ContentChild, OnInit, ViewChild } from '@angular/core';
//import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { PermisoService } from '../../pages/admin/services/permiso.service';
import { ConfiguracionGeneral } from '../../pages/comun/entities/configuracion-general';
import { ConfiguracionGeneralService } from '../../pages/comun/services/configuracion-general.service';
import { AuthService } from '../../pages/core/services/auth.service';
import { HelperService } from '../../pages/core/services/helper.service';
import { SesionService } from '../../pages/core/services/session.service';
import { Empleado } from '../../pages/empresa/entities/empleado';
import { Empresa } from '../../pages/empresa/entities/empresa';
import { Permiso } from '../../pages/empresa/entities/permiso';
import { Usuario } from '../../pages/empresa/entities/usuario';
import { EmpleadoService } from '../../pages/empresa/services/empleado.service';
import { EmpresaService } from '../../pages/empresa/services/empresa.service';
import { LayoutMenuComponent } from '../layout-menu/layout-menu.component';


@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

	@ViewChild(LayoutMenuComponent) layoutMenuComp!: LayoutMenuComponent;

	usuario!: Usuario | null;
	empresasItems: SelectItem[] = [];
	empresaSelect?: Empresa | null;
	empresaSelectOld?: Empresa | null;
	mapaPermisos: any;
	empleado!: Empleado;

	constructor(
		private helperService: HelperService,
		private empresaService: EmpresaService,
		private sesionService: SesionService,
		private confGenService: ConfiguracionGeneralService,
		private permisoService: PermisoService,
		private empleadoService: EmpleadoService,
		//private router: Router,
		private authService: AuthService
	) { }

	public async ngOnInit(): Promise<void> {
		await this.helperService.customMessage.subscribe(
			msg => {
				if(msg === 'actualizarPermisos'){
					this.reloadEmpresa();
					this.helperService.changeMessage('En espera...');
				}
			}
		);
		this.usuario = await this.sesionService.getUsuario();

		await this.empresaService.findByUsuario(this.usuario!.id).then(
			resp => {
				this.loadItems(<Empresa[]>resp)
			}
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

		await this.confGenService.obtenerPorEmpresa()
			.then(async (resp: ConfiguracionGeneral[] | any) => {
				let mapaConfig: string | any = {};
				resp.forEach((conf: { codigo: string | number; valor: any; nombre: any; }) => mapaConfig[conf.codigo] = { 'valor': conf.valor, 'nombre': conf.nombre });
				await this.sesionService.setConfiguracionMap(mapaConfig);
				await this.layoutMenuComp.loadMenu();
			});
		
		await this.permisoService.findAll()
			.then(async (data: Permiso[] | any) => {
				this.mapaPermisos = {};
				data.forEach((element: any) => this.mapaPermisos[element.recurso.codigo] = {
					'valido': element.valido, 'areas': element.areas
				});
				this.sesionService.setPermisosMap(this.mapaPermisos);
				// console.table(this.mapaPermisos);
				await this.layoutMenuComp.loadMenu();
			});


		await this.empleadoService.findempleadoByUsuario(this.usuario!.id!).then(
			(resp: Empleado | any) => {
				this.empleado = <Empleado>(resp);
				// console.log(this.empleado);
				this.sesionService.setEmpleado(this.empleado);
			}
		);
	}

	async reloadEmpresa()
	{
		this.usuario = await this.sesionService.getUsuario();

		this.empresaService.findByUsuario(this.usuario!.id).then(
			resp => this.loadItems(<Empresa[]>resp)
		);
	}
}

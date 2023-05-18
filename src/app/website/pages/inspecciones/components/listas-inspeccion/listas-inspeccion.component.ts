import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnotationTypes } from '@syncfusion/ej2/drawings';
import { ConfirmationService } from 'primeng/api';
import { PerfilService } from '../../../admin/services/perfil.service';
import { Criteria } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';
import { ListaInspeccion } from '../../entities/lista-inspeccion';
import { InspeccionService } from '../../services/inspeccion.service';
import { ListaInspeccionService } from '../../services/lista-inspeccion.service';
import { locale_es, tipo_identificacion, tipo_vinculacion } from 'src/app/website/pages/rai/entities/reporte-enumeraciones';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-listas-inspeccion',
  templateUrl: './listas-inspeccion.component.html',
  styleUrls: ['./listas-inspeccion.component.scss']
})
export class ListasInspeccionComponent implements OnInit {

  localeES: any = locale_es;
  listaInspeccionList!: ListaInspeccion[];
  listaInpSelect!: ListaInspeccion;
  loading!: boolean;
  totalRecords!: number;
  fields: string[] = [
    'listaInspeccionPK_id',
    'listaInspeccionPK_version',
    'codigo',
    'nombre',
    'tipoLista',
    'descripcion',
    'estado',
    'fkPerfilId'
  ];
  
  visibleDlg!: boolean;
  desde!: Date;
  hasta!: Date;
  downloading!: boolean;

  constructor(
    private listaInspeccionService: ListaInspeccionService,
    private userService: PerfilService,
    private paramNav: ParametroNavegacionService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private inspeccionService: InspeccionService,
    private config: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.config.setTranslation(this.localeES);
    this.loading = true;
  }

  async lazyLoad(event: any) {
    let user:any = JSON.parse(localStorage.getItem('session')!);
    let filterQuery = new FilterQuery();

    filterQuery.filterList = [{
      field: 'usuarioEmpresaList.usuario.id',
      criteria: Criteria.EQUALS,
      value1: user.usuario.id,
      value2: null
    }];
    const userP = await this.userService.findByFilter(filterQuery);
    let userParray:any = userP;    

    this.loading = true;

    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    
    filterQuery.count = true;
    filterQuery.fieldList = this.fields;
    
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    
    this.listaInspeccionService.findByFilter(filterQuery).then(
      (resp: any) => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.listaInspeccionList = [];
        (<any[]>resp['data']).forEach(dto => {
          let obj = FilterQuery.dtoToObject(dto)
          obj['hash'] = obj.listaInspeccionPK.id + '.' + obj.listaInspeccionPK.version;
         try {
           for (const profile of userParray.data) {
            console.log(profile.id)

            let perfilArray = JSON.parse(obj.fkPerfilId)

            perfilArray.forEach((perfil: any) => {
              console.log(perfil);
              if (perfil===profile.id) {
                if(!this.listaInspeccionList.find(element=>element==obj)){
                  this.listaInspeccionList.push(obj);
                }              
            }
            });
          }
         } catch (error) {
           
         } 
        });
      }
    );
  }

  modificar() {
    this.paramNav.setParametro<ListaInspeccion>(this.listaInpSelect);
    this.paramNav.setAccion<string>('PUT');
    this.router.navigate(
      ['/app/inspecciones/elaboracionLista']
    );
  }


  consultar() {
    this.paramNav.setParametro<ListaInspeccion>(this.listaInpSelect);
    this.paramNav.setAccion<string>('GET');
    this.router.navigate(
      ['/app/inspecciones/elaboracionLista']
    );
  }

  eliminar() {
    this.confirmationService.confirm({
      header: 'Confirmar acción',
      message: 'La lista de inspección ' + this.listaInpSelect.nombre + ' será eliminada, no podrá deshacer esta acción, ¿Desea continuar?',
      accept: () =>
        this.listaInspeccionService.delete(this.listaInpSelect.codigo)
    });
  }

  navegar() {
    this.paramNav.redirect('/app/inspecciones/elaboracionLista');
  }

  abrirDlg() {
    this.visibleDlg = true;
  }

  descargarInspecciones() {
    this.downloading = true;
    this.inspeccionService.consultarConsolidado(this.desde, this.hasta, this.listaInpSelect.listaInspeccionPK.id, this.listaInpSelect.listaInspeccionPK.version)
      .then(resp => {
        if (resp != null) {
          var blob = new Blob([<any>resp], { type: 'text/csv;charset=utf-8;' });
          let url = URL.createObjectURL(blob);
          let dwldLink = document.getElementById("dwldLink");
          dwldLink!.setAttribute("href", url);
          dwldLink!.setAttribute("download", "Consolidado inspecciones_" + new Date().getTime() + ".csv");
          dwldLink!.click();
          this.downloading = false;
        }
      })
      .catch(err => {
        this.downloading = false;
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { locale_es} from 'src/app/website/pages/rai/entities/reporte-enumeraciones';
import { PrimeNGConfig } from 'primeng/api';
import { ListaInspeccion } from 'src/app/website/pages/inspecciones/entities/lista-inspeccion';
import { ListaInspeccionService } from 'src/app/website/pages/inspecciones/services/lista-inspeccion.service';
import { PerfilService } from 'src/app/website/pages/admin/services/perfil.service';
import { ParametroNavegacionService } from 'src/app/website/pages/core/services/parametro-navegacion.service';
import { InspeccionService } from 'src/app/website/pages/inspecciones/services/inspeccion.service';
import { FilterQuery } from 'src/app/website/pages/core/entities/filter-query';
import { Criteria, Filter } from 'src/app/website/pages/core/entities/filter';

@Component({
  selector: 'app-listas-inspeccion-ctr',
  templateUrl: './listas-inspeccion-ctr.component.html',
  styleUrls: ['./listas-inspeccion-ctr.component.scss']
})
export class ListasInspeccionCtrComponent implements OnInit {

  localeES: any = locale_es;
  listaInspeccionList!: ListaInspeccion[];
  listaInpSelect!: ListaInspeccion;
  loading!: boolean;
  testing!: boolean;
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
    this.testing = true;
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

    this.testing = true;
    this.loading = true;

    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    
    filterQuery.count = true;
    filterQuery.fieldList = this.fields;
    
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
    let filterAuditoria: Filter = new Filter();
    filterAuditoria = {criteria: Criteria.LIKE, field: 'tipoLista', value1: 'Ciclo %'};
    filterQuery.filterList.push(filterAuditoria);
    
    this.listaInspeccionService.findByFilter(filterQuery).then(
      (resp: any) => {
        this.totalRecords = resp['count'];
        this.loading = false;
        this.testing = false;
        this.listaInspeccionList = [];
        (<any[]>resp['data']).forEach(dto => {
          let obj = FilterQuery.dtoToObject(dto)
          obj['hash'] = obj.listaInspeccionPK.id + '.' + obj.listaInspeccionPK.version;
           for (const profile of userParray.data) {

            let perfilArray = JSON.parse(obj.fkPerfilId)

            perfilArray.forEach((perfil: any) => {
              if (perfil===profile.id) {
                if(!this.listaInspeccionList.find(element=>element==obj)){
                  this.listaInspeccionList.push(obj);
                }              
            }
            });
          } 
        });
      }
    );
  }

  modificar() {
    this.paramNav.setParametro<ListaInspeccion>(this.listaInpSelect);
    this.paramNav.setAccion<string>('PUT');
    this.router.navigate(
      ['/app/ctr/elaborarListaCicloCorto']
    );
  }


  consultar() {
    this.paramNav.setParametro<ListaInspeccion>(this.listaInpSelect);
    this.paramNav.setAccion<string>('GET');
    this.router.navigate(
      ['/app/ctr/elaborarListaCicloCorto']
    );
  }

  eliminar() {
    this.confirmationService.confirm({
      header: 'Confirmar acción',
      message: 'La lista de inspección ' + this.listaInpSelect.nombre + ' será eliminada, no podrá deshacer esta acción, ¿Desea continuar?',
      accept: () =>
        this.listaInspeccionService.eliminarLista(this.listaInpSelect.listaInspeccionPK)
        .then(() => {
          const url = this.router.url; 
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`/${url}`]);
          });
        }).catch((err) => {
          console.log('Error al eliminar lista de inspección', err);
        })
    });
  }

  navegar() {
    this.paramNav.redirect('/app/ctr/elaborarListaCicloCorto');
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

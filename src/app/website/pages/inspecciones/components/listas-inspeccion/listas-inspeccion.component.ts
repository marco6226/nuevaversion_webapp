import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { ViewListaInspeccionService } from '../../services/viewlista-inspeccion.service';
import * as xlsx from 'xlsx';
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
    private viewListaInspeccionService: ViewListaInspeccionService,
    private userService: PerfilService,
    private paramNav: ParametroNavegacionService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private inspeccionService: InspeccionService,
    private config: PrimeNGConfig,
  ) { }

  ngOnInit(): void {
    this.config.setTranslation(this.localeES);
    this.loading = true;
  }

  async lazyLoad(event?: any) {
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

    filterQuery.sortField = event?.sortField;
    filterQuery.sortOrder = event?.sortOrder;
    filterQuery.offset = event?.first;
    filterQuery.rows = event?.rows;
    
    filterQuery.count = true;
    filterQuery.fieldList = this.fields;
    
    filterQuery.filterList = FilterQuery.filtersToArray(event?.filters);
    filterQuery.filterList.push({criteria: Criteria.NOT_EQUALS, field: 'tipoLista', value1: 'Ciclo corto'});

    // await this.listaInspeccionService.findByFilter(filterQuery).then(
    //   (resp: any) => {
    //     console.log(resp)
    //     this.totalRecords = resp['count'];
    //     this.loading = false;
    //     this.listaInspeccionList = [];
    //     (<any[]>resp['data']).forEach(dto => {
    //       let obj = FilterQuery.dtoToObject(dto)
    //       obj['hash'] = obj.listaInspeccionPK.id + '.' + obj.listaInspeccionPK.version;
    //        for (const profile of userParray.data) {

    //         let perfilArray = JSON.parse(obj.fkPerfilId)

    //         if(perfilArray)
    //         perfilArray.forEach((perfil: any) => {
    //           if (perfil===profile.id) {
    //             if(!this.listaInspeccionList.find(element=>element==obj)){
    //               this.listaInspeccionList.push(obj);
    //             }              
    //         }
    //         });
    //       }
    //     });
    //   }
    // );

    filterQuery.filterList.push({criteria: Criteria.EQUALS, field: 'pkUsuarioId', value1: user.usuario.id.toString()});
    filterQuery.filterList.push({criteria: Criteria.EQUALS, field: 'empresa.id', value1: user.empresa.id.toString()});

    await this.viewListaInspeccionService.getFilterListInspeccionToPerfilToUsuario(filterQuery).then((resp:any)=>{
        this.totalRecords = resp['count'];
        this.loading = false;
        this.listaInspeccionList = [];
  
        if((<any[]>resp['data']).length > 0)
          (<any[]>resp['data']).forEach(dto => {
            let obj = FilterQuery.dtoToObject(dto)
            obj['hash'] = obj.listaInspeccionPK.id + '.' + obj.listaInspeccionPK.version;
            this.listaInspeccionList.push(obj);
          });
    }).catch(er=>console.log(er))
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
        this.listaInspeccionService.eliminarLista(this.listaInpSelect.listaInspeccionPK)
        .then((res: any) => {
          // this.lazyLoad({} as any);
          const url = this.router.url; 
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`/${url}`]);
          });
        }).catch((err: any) => {
          console.log('Error al aliminar lista de inspección', err);
        })
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
        if (resp instanceof Blob) {
          var reader = new FileReader();
          reader.onload = () => {
            var csvString = reader.result as string;
            console.log("aqui goku",csvString);
            
            var xlsxBlob = this.convertCsvToXlsx(csvString);
            var url = URL.createObjectURL(xlsxBlob);
            var dwldLink = document.createElement("a");
            dwldLink.setAttribute("href", url);
            dwldLink.setAttribute("download", "Consolidado inspecciones_" + new Date().getTime() + ".xlsx");
            dwldLink.click();
            URL.revokeObjectURL(url);
            this.downloading = false;
          };
          reader.readAsText(resp);
        } else {
          console.error("La respuesta no es un Blob");
          this.downloading = false;
        }
      })
      .catch(err => {
        console.error(err);
        this.downloading = false;
      });
  }


  convertCsvToXlsx(csvString: string): Blob {
    // Parse CSV string to workbook
    var workbook = xlsx.read(csvString, { type: 'string' });
  
    // Write workbook to XLSX buffer
    var xlsxBuffer = xlsx.write(workbook, { type: 'array', bookType: 'xlsx' });
  
    // Crear Blob a partir del buffer XLSX
    var blob = new Blob([new Uint8Array(xlsxBuffer)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8' });
  
    return blob;
  }
  
  
  
}

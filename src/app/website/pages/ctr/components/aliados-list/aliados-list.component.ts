import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Empresa } from '../../../empresa/entities/empresa';
import { EmpresaService } from '../../../empresa/services/empresa.service';
import { SesionService } from '../../../core/services/session.service';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Criteria, Filter } from '../../../core/entities/filter';
import { ConfirmationService, FilterService } from 'primeng/api';

@Component({
  selector: 'app-aliados-list',
  templateUrl: './aliados-list.component.html',
  styleUrls: ['./aliados-list.component.scss'],
  providers: [UsuarioService, SesionService, EmpresaService]
})
export class AliadosListComponent implements OnInit {

  aliadosList: Empresa[] = [];
  
  caseSelect: boolean=false;
  loading: boolean = false;
  selectedList: any[]=[];
  fileName = 'ListadoAliados.xlsx';
  excel!: any[];
  rangeDatesCreacion: any;
  rangeDatesActualizacion: any;
  es = {
    firstDayOfWeek: 1,
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    dayNamesShort: ["Dom", "Lun", "Mar", "Miér", "Juev", "Vier", "Sáb"],
    dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    today: 'Hoy',
    clear: 'Limpiar'
  };
  
  constructor(
    private empresaService: EmpresaService,
    private sesionService: SesionService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private usuarioService: UsuarioService,
    private filterService: FilterService
  ) { }

  ngOnInit() {
    this.loadData();

    this.filterUtils();
  }
  
 
  async loadData(){
 
    this.aliadosList=[]
    let filterQuery = new FilterQuery();
    filterQuery.filterList = [];


    let filtPadre = new Filter();
    filtPadre.criteria = Criteria.IS_NOT_NULL;
    filtPadre.field = 'tipoPersona';

    let filterAliadoID = new Filter();
    filterAliadoID.criteria = Criteria.EQUALS;
    filterAliadoID.field = 'idEmpresaAliada';
    let idAux = await this.sesionService.getEmpresa()?.idEmpresaAliada != null
                ? await this.sesionService.getEmpresa()?.idEmpresaAliada
                : await this.sesionService.getEmpresa()?.id;
    filterAliadoID.value1 = String(idAux);

    let filterAliadoEstado = new Filter();
    filterAliadoEstado.criteria = Criteria.EQUALS;
    filterAliadoEstado.field = 'activo';
    filterAliadoEstado.value1 = 'true';

    filterQuery.filterList.push(filtPadre);
    filterQuery.filterList.push(filterAliadoID);
    filterQuery.filterList.push(filterAliadoEstado);
    filterQuery.sortField = "id";
    filterQuery.sortOrder = 1;
    
    this.empresaService.findByFilter(filterQuery).then(
        (resp: any) => {
          this.empresaService.obtenerDivisionesDeAliados(Number(idAux)).then(
            (respDiv: any) => {
              resp['data'].forEach((element: any) => {
                try{
                  element.division = respDiv.filter((el: any) => el.id == element.id)[0].division;
                }catch(e){}
                this.aliadosList.push(element) 
              });
          });
        }
    );
  }

  onEdit(event: any){
    // localStorage.setItem('actualizarAliado',JSON.stringify([event.id, 'edit']));
    this.router.navigate([`/app/ctr/actualizarAliado/${event.id}/${'edit'}`]);
  }

  onConsult(event: any){
    // localStorage.setItem('actualizarAliado', JSON.stringify([event.id, 'consultar']));
    this.router.navigate([`/app/ctr/actualizarAliado/${event.id}/${'consultar'}`]);
  }

  async onSendMail(event: any){
    await this.usuarioService.sendMailAliadoActualizar(event.email,event.id);
  }

  onChangeStatusAliado(row: any, tipo: any){
    
    if (tipo=='Activar') {
      this.confirmationService.confirm({
        header: 'Confirmar acción',
        key: 'aliadoList',
        message: 'Esta seguro que desea Activar este Aliado:',
        accept: () =>{
          row.activo = true
          this.empresaService.update(row)
        },})
        
    } else {
      this.confirmationService.confirm({
        header: 'Confirmar acción',
        key: 'aliadoList',
        message: 'Esta seguro que desea Desactivar este Aliado:',
        accept: () =>{
          row.activo = false
          this.empresaService.update(row)
        },})
    }
  }

  onRowSelect(event: any){
    if (this.selectedList.length>0) {
      this.caseSelect=true;      
    } else {
      this.caseSelect=false;      
    }
  }

  sendMultiplesEmails(){
    this.selectedList.forEach(element => {
      this.onSendMail(element)
    });
  }
  
  async exportexcel(): Promise<void> 
    {
       /* table id is passed over here */   
      await this.datosExcel()
      const readyToExport = this.excel;
      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(readyToExport);
      XLSX.utils.book_append_sheet(workBook, workSheet, 'data');
      XLSX.writeFile(workBook, this.fileName);
			
    }

    async datosExcel(): Promise<void>{
      this.excel=[]
      this.aliadosList.forEach((resp)=>{
        let fecha_creacion = new Date(resp['fechaCreacion']!);
        fecha_creacion.setMinutes(fecha_creacion.getMinutes()+fecha_creacion.getTimezoneOffset());
        let fecha_actualizacion = (resp['fechaActualizacion']!=null)?new Date(resp['fechaActualizacion']):null;
          try {
            fecha_actualizacion?.setMinutes(fecha_actualizacion.getMinutes()+fecha_actualizacion.getTimezoneOffset());
          } catch (error) {
            fecha_actualizacion = null;
          }
        this.excel.push({
          nit: resp['nit'],
          Nombre_o_razón_social: resp['razonSocial'],
          Tipo_de_Persona: resp['tipo_persona'],
          Division: this.getDivision(resp['division']!),
          Estado: resp['estado'],
          Impacto: resp['calificacion'],
          Fecha_Creación: fecha_creacion,
          Fecha_Modificación: fecha_actualizacion
        })
      })
    }

    filterUtils(){
      this.filterService.register('fechaCreacionFilter', (value: any, filter: any): boolean => {
        if (filter === undefined || filter === null) {
          return true;
        }
      
        if (value === undefined || value === null) {
          return false;
        }
        
        if (this.rangeDatesCreacion[0] <= value && this.rangeDatesCreacion[1] >= value) {
          return true;
        }

        return value.toString() === filter.toString();
      });

      this.filterService.register('FechaActualizacionFilter', (value: any, filter: any): boolean => {
        if (filter === undefined || filter === null) {
          return true;
        }
      
        if (value === undefined || value === null) {
          return false;
        }

        if (this.rangeDatesActualizacion[0] <= value && this.rangeDatesActualizacion[1] >= value) {
          return true;
        }

        return value.toString() === filter.toString();
      });
    }

    getDivision(data: string){
      if(data == null) return '';
      let arreglo = JSON.parse(data);
      return arreglo.join(", ");
    }

    onResetDate(dt:any, opt: string){
      switch (opt) {
        case 'fechaCreacion':
          dt.reset();
          if(this.rangeDatesActualizacion){
            dt.filter(this.rangeDatesActualizacion, 'fechaActualizacion', 'FechaActualizacionFilter');
          }
          break;
        case 'fechaActualizacion':
          dt.reset();
          if(this.rangeDatesCreacion){
            dt.filter(this.rangeDatesCreacion, 'fechaCreacion', 'fechaCreacionFilter');
          }
          break;
        default:
          break;
      }
    }
};

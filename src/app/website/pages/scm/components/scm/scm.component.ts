import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { Reintegro } from '../../entities/reintegro.interface';
import { Usuario } from '../../../empresa/entities/usuario';
import { CasosMedicosService } from '../../../core/services/casos-medicos.service';
import { CargoService } from '../../../empresa/services/cargo.service';
import { SesionService } from '../../../core/services/session.service';
import { FilterQuery } from '../../../core/entities/filter-query';
import { Criteria, Filter, SortOrder } from '../../../core/entities/filter';
import { Cargo } from '../../../empresa/entities/cargo';
import * as XLSX from 'xlsx';
import { ViewscmInformeService } from 'src/app/website/pages/core/services/view-informescm.service';
import { PrimeNGConfig } from 'primeng/api';
import { locale_es } from "../../../comun/entities/reporte-enumeraciones";
import { Calendar } from 'primeng/calendar';

@Component({
    selector: 'app-scm',
    templateUrl: './scm.component.html',
    styleUrls: ['./scm.component.scss'],
    providers: [CasosMedicosService, CargoService, SesionService, MessageService]
})

export class ScmComponent implements OnInit {
    @ViewChild('myCalendar') myCalendar!: Calendar;
    localeES:any = locale_es;
    reintegroList: Reintegro[] =[]
    idEmpresa!: string | null;
    valor2!: string;
    valor3!: string;
    empresaId!: string;
    casosList: any
    casosListFilter: any;
    usuarioSelect!: Usuario;
    perfilList: SelectItem[] = [];
    visibleDlg!: boolean;
    caseSelect: any;
    cargoList: SelectItem[] = [];
    consultar: boolean = false;
    isUpdate!: boolean;
    form!: FormGroup;
    visibleForm!: boolean;
    solicitando: boolean = false;
    loading: boolean = false;
    testing: boolean = false;
    totalRecords!: number;
    excel:any=[]
    fields: string[] = [
        'id',
        'fechaCreacion',
        'region',
        'ciudad',
        'names',
        'documento',
        'cargo',
        'statusCaso',
        'casoMedicoLaboral',
        'razon',
        'pkUser_area_padreNombre',
        'pkUser_primerApellido',
        'pkUser_primerNombre',
        'sve',
        'eliminado',
        'prioridadCaso',
        'tipoCaso',
        'tipoReporte',
        'diagnostico',
        'proximoseguimiento'
    ];
    estadosList: SelectItem[] = [
        { value: 'ACTIVO', label: 'ACTIVO' },
        { value: 'INACTIVO', label: 'INACTIVO' },
    ];

    rangeDatesInforme: any;
    visibleDlgInforme:boolean=false
    flagInforme:boolean=true
    empresaIdLoggin: any = this.sesionService.getEmpresa()?.id;

    constructor(
        private scmService: CasosMedicosService,
        private cargoService: CargoService,
        private router: Router,
        private sesionService: SesionService,
        private messageService: MessageService,
        private viewscmInformeService: ViewscmInformeService,
        private config: PrimeNGConfig
    ) { }
    
    async ngOnInit() {
        this.testing = true;
        this.config.setTranslation(this.localeES);
        let cargofiltQuery = new FilterQuery();
        cargofiltQuery.sortOrder = SortOrder.ASC;
        cargofiltQuery.sortField = "nombre";
        cargofiltQuery.fieldList = ["id", "nombre"];
        this.cargoService.findByFilter(cargofiltQuery).then((resp: any) => {
            this.cargoList = [];
            this.cargoList.push({ label: '--Seleccione--', value: null });
            (<Cargo[]>resp['data']).forEach((cargo) => {
                this.cargoList.push({ label: cargo.nombre, value: cargo.id });
            });
            console.log('eNTRO POR ACA EN CARGOS');
        });
        this.idEmpresa = this.sesionService.getEmpresa()?.id!;
    }

    openCase() {
        if(this.caseSelect.statusCaso=='1'){
            localStorage.setItem('scmShowCase', 'false');
            this.router.navigate(['/app/scm/case/', this.caseSelect.id])
        }else{
            this.messageService.add({key: 'msgScm', severity: "warn", summary:"Opción no disponible.", detail:"Este caso se encuentra cerrado y no se puede editar.\nPuede intentar la opción de consulta.", life: 6000});
        }
    }

    openCaseConsultar() {
        localStorage.setItem('scmShowCase', 'true');
        this.router.navigate(['/app/scm/case/', this.caseSelect.id])
    }

    DecodificacionSiNo(valor: any){
        this.valor2=valor.toLowerCase() ;
        if(this.valor2.length==0){return null}else if(-1!='si'.search(this.valor2)){return '1'}else if(-1!='no'.search(this.valor2)){return'0'}else if(-1!='en seguimiento'.search(this.valor2)){return '2'}else if(-1!='no aplica'.search(this.valor2)){return '3'}else{return '4'}
    }
    DecodificacionEstado(valor: any){
        this.valor3=valor.toLowerCase() ;
        if(this.valor3.length==0){return null}else if(-1!='abierto'.search(this.valor3)){return '1'}else if(-1!='cerrado'.search(this.valor3)){return '0'}else{return '2'}
    }
    filtrosExcel:any;
    async lazyLoad(event: any) {
        this.filtrosExcel=event
        let filterQuery = new FilterQuery();
        filterQuery.sortField = event.sortField;
        filterQuery.sortOrder = event.sortOrder;
        filterQuery.offset = event.first;
        filterQuery.rows = event.rows;
        filterQuery.count = true;
        let filterEliminado = new Filter();
        filterEliminado.criteria = Criteria.EQUALS;
        filterEliminado.field = 'eliminado';
        filterEliminado.value1 = 'false';

        filterQuery.fieldList = this.fields;
        filterQuery.filterList = FilterQuery.filtersToArray(event.filters);
        filterQuery.filterList.push(filterEliminado);      
        try {
            let res: any = await this.scmService.findByFilter(filterQuery);
            this.casosList = [];
            console.log(this.casosList)
            res?.data?.forEach((dto: any) => {
                this.casosList.push(FilterQuery.dtoToObject(dto));
                this.testing = false;
               
            });
            console.log(res)
            this.totalRecords = res.count;
            
        } catch (error) {
            
        }
       
    } 

    async exportexcel(): Promise<void> 
    {
        //debugger
        await this.datosExcel()
        this.excel.forEach((el:any) => delete el.empresaId)
        
        let excel= this.empresaIdLoggin == 22? 
                    this.excel.filter((resp:any)=>{ return new Date(resp.fechaCreacion)>=new Date(this.rangeDatesInforme[0]) && new Date(resp.fechaCreacion)<=new Date(this.rangeDatesInforme[1])}) : 
                    this.excel.filter((resp:any)=>{ return new Date(resp.Fecha_apertura)>=new Date(this.rangeDatesInforme[0]) && new Date(resp.Fecha_apertura)<=new Date(this.rangeDatesInforme[1])})
                
        excel.map((resp:any)=>{
            if(resp.estadoCaso==1){resp.estadoCaso='Abierto'}
            if(resp.estadoCaso==0){resp.estadoCaso='Cerrado'}
            if(resp.recomendaciones){resp.recomendaciones='Sí tiene'}
            else{resp.recomendaciones='No tiene'}
            if(resp.planAccion){resp.planAccion='Sí tiene'}
            else{resp.planAccion='No tiene'}
        })
        const readyToExport = excel;
 
       const workBook = XLSX.utils.book_new(); // create a new blank book
 
       const workSheet = XLSX.utils.json_to_sheet(readyToExport);
 
       XLSX.utils.book_append_sheet(workBook, workSheet, 'Informe'); // add the worksheet to the book
 
       XLSX.writeFile(workBook, 'Informe casos medicos.xlsx'); // initiate a file download in browser
        
       this.cerrarDialogo();
    }


    async datosExcel(): Promise<void>{
        let dataExcel:any[] = []

        // let filterQuery = new FilterQuery();
        // filterQuery.sortField = this.filtrosExcel.sortField;
        // filterQuery.sortOrder = this.filtrosExcel.sortOrder;
        // // filterQuery.offset = this.filtrosExcel.first;
        // filterQuery.count = true;
        // let filterEliminado = new Filter();
        // filterEliminado.criteria = Criteria.EQUALS;
        // filterEliminado.field = 'eliminado';
        // filterEliminado.value1 = 'false';

        // filterQuery.fieldList = this.fields;
        // filterQuery.filterList = FilterQuery.filtersToArray(this.filtrosExcel.filters);
        // filterQuery.filterList.push(filterEliminado);      
        // try {
        //     let res: any = await this.scmService.findByFilter(filterQuery);
        //     dataExcel = res.data;

        // } catch (error) {
        //     console.error(error)
        // }


        // console.log(this.casosListFilter)
        // this.casosListFilter
        // this.excel=[]
        // console.log(dataExcel)
        if (this.empresaIdLoggin == 22) {
            await this.viewscmInformeService.findByEmpresaId().then((resp:any)=>{
                dataExcel = resp;
            })
            this.excel=[...dataExcel]
        
            this.excel.map((resp1:any)=>{return resp1.fechaCreacion=new Date(resp1.fechaCreacion)})
            this.excel.map((resp1:any)=>{return resp1.proximoSeguimiento=(resp1.proximoSeguimiento)?new Date(resp1.proximoSeguimiento):''})

        } else {
            let filterQuery = new FilterQuery();
            let filterEliminado = new Filter();
            filterEliminado.criteria = Criteria.EQUALS;
            filterEliminado.field = 'eliminado';
            filterEliminado.value1 = 'false';

            filterQuery.fieldList = this.fields;
            filterQuery.filterList = [filterEliminado]
            
            await this.scmService.findByFilter(filterQuery).then((resp:any)=>{
                let casosList:any = [];
                resp?.data?.forEach((dto: any) => {
                    casosList.push(FilterQuery.dtoToObject(dto));
                });

                casosList.forEach((element: any) => {
                    const item = { 
                        CASO: element.id,
                        Fecha_apertura: element.fechaCreacion,
                        Apellido: element.pkUser?.primerApellido,
                        Nombre: element.pkUser?.primerNombre,
                        Documento: element.documento,
                        Estado_caso: element.statusCaso == 1 ? 'Abierto' : 'Cerrado',
                        Proximo_seguimiento: element.proximoseguimiento ? new Date(element.proximoseguimiento).toLocaleDateString() : '',
                        Prioridad: element.prioridadCaso,
                        Tipo_caso: element.tipoCaso,
                    };
                    dataExcel.push(item);
                });
        
                this.excel=[...dataExcel]
                console.log(this.excel)

                this.excel.map((resp1:any)=>{return resp1.Fecha_apertura=new Date(resp1.Fecha_apertura)})
            })
        }
       
        // await this.viewscmInformeService.getscminformeFilter(filterQuery).then((resp:any)=>{
        //     console.log(resp)
        // })
        
        
        // })
    }
    cerrarDialogo(){
    this.visibleDlgInforme = false;
    }

    habilitarindSCM(){
        if(this.rangeDatesInforme[0] && this.rangeDatesInforme[1]){this.flagInforme=false}
        else{this.flagInforme=true}
    }
    onResetDate(){
        this.flagInforme=true
    }

    onFilter(event:any){
        this.casosListFilter=event.filteredValue
    }
    closeCalendar(){
        this.myCalendar.hideOverlay();
    }
}
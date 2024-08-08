import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, Message } from 'primeng/api';
import { FilterQuery } from '../../../core/entities/filter-query';
import { SesionService } from '../../../core/services/session.service';
import { Empleado } from '../../entities/empleado';
import { EmpleadoService } from '../../services/empleado.service';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-empleado',
    templateUrl: './empleado.component.html',
    styleUrls: ['./empleado.component.scss'],
    providers: [SesionService, MessageService, EmpleadoService]
})
export class EmpleadoComponent implements OnInit, AfterViewInit {

    @ViewChild('dt', { static: false }) table!: Table;

    empleadosList!: Empleado[];
    empleadoSelect!: Empleado | null;
    empresaId = this.sesionService.getEmpresa()?.id;
    visibleForm!: boolean;
    show!: boolean;
    tableScroll!:any;
    isScrollRigth: boolean = true;
    isScrollLeft: boolean = false;

    isUpdate!: boolean;
    isEditable!: boolean;
    loading!: boolean;
    totalRecords!: number;
    fields: string[] = [
        'id',
        'primerNombre',
        'segundoNombre',
        'primerApellido',
        'segundoApellido',
        'numeroIdentificacion',
        'cargo_nombre',
        'usuario_email',
        'usuario_icon',
        'area_nombre',
        'estado',
        'empresa',
        'nit',
    ];

    constructor(
        private empleadoService: EmpleadoService,
        private sesionService: SesionService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
    }

    ngAfterViewInit() {
        this.tableWrapper();
        this.addScrollEventListener();
      }
    
      private tableWrapper() {
        this.tableScroll = this.table.el.nativeElement.querySelector(".p-datatable-wrapper");
      }
    
      private addScrollEventListener() {
        if (this.tableScroll) {
          this.tableScroll.addEventListener('scroll', this.onManualScroll.bind(this));
        }
      }
    
      private onManualScroll() {
    
        if(this.tableScroll.scrollLeft === 0){
          this.isScrollLeft = false;
          this.isScrollRigth = true;
        }else{
          this.isScrollLeft = true;
          this.isScrollRigth = false;
        }
    
      }
    
      @HostListener('window:scroll', ['$event'])
      onWindowScroll(event: Event) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const buttons = document.querySelector('.floating-buttons-scroll') as HTMLElement;
        if (buttons) {
          buttons.style.top = `${scrollTop + 60}px`;
        }
      }
      
    msgs?:Message[]=[]
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

        this.empleadoService.findByFilter(filterQuery).then(
            (resp:any) => {
                this.totalRecords = resp['count'];
                this.loading = false;
                this.empleadosList = [];
                (<any[]>resp['data']).forEach(dto => this.empleadosList.push(FilterQuery.dtoToObject(dto)));
            }
        );
    }

    showAddForm() {
        this.visibleForm = true;
        this.isUpdate = false;
        this.empleadoSelect = null;
    }

    showUpdateForm() {
        if (this.empleadoSelect != null) {
            this.isUpdate = true;
            this.visibleForm = true;
        } else {
            this.msgs=[]
            // this.msgs.push({severity: 'warn', summary: "Debe seleccionar un empleado", detail: "Debe seleccionar un empleado para modificar" });

            this.messageService.add({severity: 'warn', summary: "Debe seleccionar un empleado", detail: "Debe seleccionar un empleado para modificar", key:'empleado' });
        }
    }

    showForm() {
        if (this.empleadoSelect != null) {
            this.isUpdate = false;
            this.isEditable = false;
            this.show = true;
            this.visibleForm = true;
        } else {
            this.msgs=[]
            // this.msgs.push({severity: 'warn', summary: "Debe seleccionar un empleado", detail: "Debe seleccionar un empleado para modificar" });
            this.messageService.add({severity: 'warn', summary: "Debe seleccionar un empleado", detail: "Debe seleccionar un empleado para modificar", key:'empleado' });
        }
    }


    onEmpleadoCreate(event: any) {
        this.manageCreateResponse(event.empleado);
        this.visibleForm = false;
    }

    onEmpleadoUpdate(event: any) {
        this.manageUpdateResponse(event.empleado);
        this.visibleForm = false;
    }

    onEmpleadoDelete() {
        if (this.empleadoSelect != null) {
            this.confirmationService.confirm({
                header: 'Eliminar empleado "' + this.empleadoSelect.numeroIdentificacion + '"',
                message: '¿Esta seguro de borrar este empleado?',
                accept: () => this.deleteEmpleado()
            });
        } else {
            this.msgs=[]
            // this.msgs.push({severity: 'warn', summary: "Debe seleccionar un empleado", detail: "Debe seleccionar un empleado para eliminarlo" });

            this.messageService.add({severity: 'warn', summary: "Debe seleccionar un empleado", detail: "Debe seleccionar un empleado para eliminarlo", key:'empleado' });
        }
    }

    deleteEmpleado() {
        this.empleadoService.delete(this.empleadoSelect!.id!)
            .then(data => {
                this.msgs=[]
                this.messageService.add({
                // this.msgs.push({
                    key: 'empleado',
                    severity: 'success',
                    summary: "Empleado eliminado",
                    detail: "Ha sido eliminado el empleado " + this.empleadoSelect?.numeroIdentificacion
                });
                this.empleadoSelect!.estado = 'ELIMINADO';
            });
    }

    onCancel() {
        this.visibleForm = false;
    }

    manageUpdateResponse(empleado: Empleado) {
        for (let i = 0; i < this.empleadosList.length; i++) {
            if (this.empleadosList[i].id = empleado.id) {
                this.empleadosList[i] = empleado;
                break;
            }
        }
        this.msgs=[]
        // this.msgs.push({severity: 'success', summary: 'Empleado actualizado', detail: 'Se ha actualizado el empleado ' + empleado.numeroIdentificacion });
        this.messageService.add({severity: 'success', summary: 'Empleado actualizado', detail: 'Se ha actualizado el empleado ' + empleado.numeroIdentificacion, key:'empleado' });
    }

    manageCreateResponse(empleado: Empleado) {
        this.empleadosList.push(empleado);
        this.msgs=[]
        // this.msgs.push({severity: 'success', summary: 'Nuevo empleado creado', detail: "Se ha creado el empleado " + empleado.numeroIdentificacion, key:'empleado' });
        this.messageService.add({severity: 'success', summary: 'Nuevo empleado creado', detail: "Se ha creado el empleado " + empleado.numeroIdentificacion, key:'empleado' });
    }

    scrollLeft() {
        if (this.tableScroll) {
          this.tableScroll.scrollLeft -= 10000;
          this.isScrollLeft = false;
          this.isScrollRigth = true;
          this.tableScroll.removeEventListener('scroll', this.onManualScroll.bind(this));
          setTimeout(() => {
            this.tableScroll.addEventListener('scroll', this.onManualScroll.bind(this));
          }, 50);
        }
      }
      
      scrollRight() {
        if (this.tableScroll) {
          this.tableScroll.scrollLeft += 10000;
          this.isScrollRigth = false;
          this.isScrollLeft = true;
          this.tableScroll.removeEventListener('scroll', this.onManualScroll.bind(this));
          setTimeout(() => {
            this.tableScroll.addEventListener('scroll', this.onManualScroll.bind(this));
          }, 50);
        }
      }

}

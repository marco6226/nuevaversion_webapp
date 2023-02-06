import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {interventorgestor} from '../../entities/gestorinterventor';
import { FilterQuery } from "../../../core/entities/filter-query";
import { Criteria } from "../../../core/entities/filter";
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmpleadoBasic } from '../../../empresa/entities/empleado-basic';
import { Empleado } from '../../../empresa/entities/empleado';
import { EmpleadoService } from '../../../empresa/services/empleado.service';
@Component({
  selector: 'app-asignacion-colider',
  templateUrl: './asignacion-colider.component.html',
  styles: [`
    :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }`],
  styleUrls: ['./asignacion-colider.component.scss'],
  providers: [EmpleadoService]
})
export class AsignacionColiderComponent implements OnInit {

  @Input('dataIn')
  set dataIn(data: string){
    if (data != null) {
      this.gestorInters = JSON.parse(data);
    }else{this.gestorInters=[]}
  }
  @Output() coliderData = new EventEmitter<string>();
  gestorInter:interventorgestor={}
  gestorInters:interventorgestor[]=[]
  gestorInters2:interventorgestor[]=[]
  telefono!: string;
  empleadoSelect2!: EmpleadoBasic;
  empleadoSelect!: Empleado;
  onEdit: string | null = null;
  cargo!: string;
  @Input() flagConsult: boolean=false;
  productDialog!: boolean;
  selectedInterventor!: interventorgestor[];
  submitted!: boolean;
  intervetorDelete: interventorgestor[] = [];
  edit:boolean=false;
  fields: string[] = [
    'id',
    'cargo'
  ];
  constructor(
    private rutaActiva: ActivatedRoute,
    private empleadoService: EmpleadoService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.onEdit = this.rutaActiva.snapshot.params['onEdit'];
  }

  async onData(){
    let filter = new FilterQuery();
    filter.fieldList = this.fields;
    filter.filterList = [{ field: 'id', criteria: Criteria.EQUALS, value1: this.gestorInter.gestor?.id }];
    await this.empleadoService.findByFilter(filter).then((resp: any)=>{
      this.cargo = resp['data'][0].cargo.nombre;
    })
  }

openNew() {
  this.gestorInter.cargo=null;
  this.gestorInter.gestor=null;
  this.gestorInter.telefono=null;

  this.edit=false;
  this.submitted = false;
  this.productDialog = true;
}

editProduct(inter: interventorgestor) {
  this.edit=true;
  this.gestorInters2 = this.gestorInters.filter(val => val!=inter);
  this.gestorInter = {...inter};
  this.productDialog = true;
}

deleteProduct(inter: interventorgestor) {

  this.confirmationService.confirm({
    message: '¿Desea eliminar el interventor '+inter.gestor?.primerNombre+' '+inter.gestor?.primerApellido+'?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.gestorInters = this.gestorInters.filter(val => val!=inter);
      this.messageService.add({key: 'colider', severity:'success', summary: 'Successful', detail: 'Interventor '+inter.gestor?.primerNombre+' '+inter.gestor?.primerApellido+'eliminado', life: 3000});
    },
    acceptLabel: 'Si',
    rejectLabel: 'No'
});
}

hideDialog() {
  this.productDialog = false;
  this.submitted = false;
}

saveProduct() {
  this.submitted = true;
  if(this.gestorInter.gestor){
    this.gestorInter.cargo=this.cargo;

    if(!this.edit){
    this.gestorInters.push(this.gestorInter);
    }else{
      this.gestorInters2.unshift(this.gestorInter);
      this.gestorInters=this.gestorInters2
    }
    this.coliderData.emit(JSON.stringify(this.gestorInters))
    this.productDialog = false;}
}

}

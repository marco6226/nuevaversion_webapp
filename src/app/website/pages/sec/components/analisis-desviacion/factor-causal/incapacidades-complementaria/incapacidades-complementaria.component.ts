import { locale_es } from 'src/app/website/pages/rai/entities/reporte-enumeraciones';
import { ConfirmationService } from 'primeng/api';
import { Incapacidad } from 'src/app/website/pages/comun/entities/factor-causal';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-incapacidades-complementaria',
  templateUrl: './incapacidades-complementaria.component.html',
  styleUrls: ['./incapacidades-complementaria.component.scss']
})
export class IncapacidadesComplementariaComponent implements OnInit {

  @Input() incapacidades: Incapacidad[] = [];
  @Output() listIncapacidades = new EventEmitter<Incapacidad[]>()
  productDialog?: boolean;
  submitted?: boolean;
  selectedProducts?:any;
  GuardadoEdicion:boolean=false;

  incapacidadess?: Incapacidad[];
  incapacidad?: Incapacidad;
  tipo?: string | null;
  cie10: any;
  diagnostico?: string;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
  diasAusencia?: number | null;
  localeES: any = locale_es;
  id: number=0;

  
  tipoList = [
    { label: 'Inicial', value: 'Inicial' },
    { label: 'Prorroga', value: 'Prorroga' },
  ]

  get daysCount() {

   
    let fecha1 = moment(this.fechaInicio);

    let fecha2 = moment(this.fechaFin);

    this.diasAusencia =  Math.abs(fecha1.diff(fecha2, "days"))+1;

    return this.diasAusencia;
  }

  constructor(
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    if (this.incapacidades==null) {
      this.incapacidades = [];
    }
  }

  openNew(){
    this.GuardadoEdicion=true;
    this.incapacidad = {};    
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts(){
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar los productos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.incapacidades = this.incapacidades.filter(val => !this.selectedProducts.includes(val));
          this.selectedProducts = null;
      }
  });
  }

  editProduct(product: Incapacidad) {

    
    this.GuardadoEdicion=false;   
    this.tipo = product.tipo;
    this.cie10 = product.cie10;
    this.diagnostico = product.diagnostico;
    this.fechaInicio = new Date(product.fechaInicio!);
    this.fechaFin = new Date(product.fechaFin!);
    this.diasAusencia = product.diasAusencia;
    this.id = product.id! 

    this.incapacidad = {...product};
    this.productDialog = true;
}
deleteProduct(product: Incapacidad) {
  this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + product.cie10 + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.incapacidades.splice((product.id!-1),1)
          console.log(this.incapacidades);
          let tempid=0;
          this.incapacidades.forEach(element => {
              console.log(element);
              tempid++
              element.id = tempid;
          });
          console.log(this.incapacidades);
          this.incapacidad = {};
          }
  });
}

hideDialog(){
  this.productDialog = false;
  this.submitted = false;
}

saveProduct(){
  this.submitted = true;
  
  if(this.incapacidad){
  this.incapacidad.tipo = this.tipo
  this.incapacidad.cie10 = (this.cie10)?this.cie10:null;
  this.incapacidad.diagnostico = this.cie10.nombre
  this.incapacidad.fechaInicio = this.fechaInicio
  this.incapacidad.fechaFin = this.fechaFin
  this.incapacidad.diasAusencia = this.diasAusencia;}

  if(this.id){
    let x = this.incapacidades.find(ele=>{
        return ele.id == this.id
    })
    if(x){
    x.tipo = this.tipo;
    x.cie10=this.cie10;
    x.diagnostico=this.cie10.nombre;
    x.fechaInicio=this.fechaInicio;
    x.fechaFin=this.fechaFin;
    x.diasAusencia=this.diasAusencia;}

    }else{
      if (this.incapacidades == null) {
        this.incapacidades=[]
      }
    this.id = this.incapacidades.length;
    this.id++;

    if(this.incapacidad){
    this.incapacidad.id = this.id; 
    this.incapacidades.push(this.incapacidad)}

}

  this.listIncapacidades.emit(this.incapacidades);
  this.productDialog = false;
  this.incapacidad = {};
  this.id = 0;
  this.borrarIncapcidad(); 
}

private borrarIncapcidad(){
  this.tipo = null;
  this.cie10 = '';
  this.diagnostico = '';
  this.fechaInicio = null;
  this.fechaFin = null;
  this.diasAusencia = null;
  }
}

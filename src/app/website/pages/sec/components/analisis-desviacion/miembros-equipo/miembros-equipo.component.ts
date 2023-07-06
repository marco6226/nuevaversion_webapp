import { MessageService,Message } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { MiembroEquipo } from './miembro-equipo';

@Component({
  selector: 'app-miembros-equipo',
  templateUrl: './miembros-equipo.component.html',
  styleUrls: ['./miembros-equipo.component.scss'],
  providers: [MessageService]
})
export class MiembrosEquipoComponent implements OnInit {

  @Output()miembrosOut=new EventEmitter<MiembroEquipo[]>();
  @Output()selectedProductsOUT= new EventEmitter<any[]>();
  @Input()miembrosList: MiembroEquipo[] = []
  @Output() disable = new EventEmitter<boolean>();

  productDialog?: boolean;
  submitted?: boolean;

  selectedProducts?:any;
  miembros?: MiembroEquipo[]
  miembro?: MiembroEquipo;
  cedula?: number | null;
  nombre?: string | null;
  cargo?: string | null;
  division?: string | null;
  localidad?: string | null;
  id: null | number=0;

  DivisionList= [
    { label: "--Seleccione--", value: null },
    { label: "Almacenes Corona", value: "Almacenes Corona" },
    { label: "Bathrooms and Kitchen", value: "Bathrooms and Kitchen" },
    { label: "Comercial Corona Colombia", value: "Comercial Corona Colombia" },
    { label: "Funciones Transversales", value: "Funciones Transversales" },
    { label: "Insumos Industriales y Energias", value: "Insumos Industriales y Energias" },
    { label: "Mesa Servida", value: "Mesa Servida" },
    { label: "Superficies, materiales y pinturas", value: "Superficies, materiales y pinturas" },

]
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.disable.emit(false)
  }
  openNew() {
    this.miembro = {};    
    this.submitted = false;
    this.productDialog = true;
    this.cedula = this.cargo = this.division = this.nombre = this.localidad = null
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
        message: '¿Está seguro de que desea eliminar los productos seleccionados?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.miembrosList = this.miembrosList.filter(val => !this.selectedProducts.includes(val));
            this.selectedProducts = null;
        }
    });
}

editProduct(product: MiembroEquipo) {
  this.cedula = product.cedula;
  this.nombre = product.nombre;
  this.cargo = product.cargo;
  this.division = product.division;
  this.localidad = product.localidad;
  this.id = product.id!
  
  this.miembro = {...product};
  
  this.productDialog = true;
}

deleteProduct(product: MiembroEquipo) {
  this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + product.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          // this.miembrosList = this.miembrosList.filter(val => val.id !== product.id);
          this.miembrosList.splice((product.id!-1),1)
          let tempid=0;
          this.miembrosList.forEach(element => {
              tempid++
              element.id = tempid;
          });
          this.miembro = {};
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'miembro Deleted', life: 3000});
      }
  });
}

hideDialog() {
  this.productDialog = false;
  this.submitted = false;
}

saveProduct() {
  this.submitted = true;
  console.log("save");

  if (!this.cedula || !this.nombre || !this.cargo || !this.division || !this.localidad) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Falta diligenciar todos los campos'});
  }
  else{

  this.miembro!.cedula=this.cedula;
  this.miembro!.nombre = this.nombre;
  this.miembro!.cargo = this.cargo;
  this.miembro!.division = this.division;
  this.miembro!.localidad = this.localidad;

  if(this.id){
      let x:any = this.miembrosList.find(ele=>{
          return ele.id == this.id
      })
      x.nombre = this.nombre;
      x.cargo=this.cargo;
      x.cedula=this.cedula;
      x.localidad=this.localidad;
      x.division=this.division;
      }else{
      this.id = this.miembrosList.length;
      this.id++;
      this.miembro!.id = this.id; 
      this.miembrosList.push(this.miembro!)

  }

      this.productDialog = false;
      this.miembro = {};
      this.id = null;
      this.borrarMiembro();
      if(this.miembrosList.length%2==0){
          this.disable.emit(true)

          this.showError();
      }else{
          this.disable.emit(false)

      }

  }
}
salida(){
  this.miembrosOut.emit(this.miembros);
  this.selectedProductsOUT.emit(this.selectedProducts);
}
private borrarMiembro(){
  this.cedula=null;
  this.nombre = '';
  this.cargo = '';
  this.division = '';
  this.localidad = '';
  }
  msgs?: Message[];
  showError() {
    this.msgs=[]
    this.msgs.push({severity:'error', summary: 'Error', detail: 'La cantidad de los miembros del equipo deben ser impares'});

      // this.messageService.add({severity:'error', summary: 'Error', detail: 'La cantidad de los miembros del equipo deben ser impares'});
  }
}

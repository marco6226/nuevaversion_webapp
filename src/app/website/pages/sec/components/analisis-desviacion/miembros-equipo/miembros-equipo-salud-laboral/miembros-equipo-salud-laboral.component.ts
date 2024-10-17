import { MessageService,Message } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { MiembroEquipoSaludLaboral } from '../miembro-equipo-saludlaboral';
@Component({
  selector: 'app-miembros-equipo-salud-laboral',
  templateUrl: './miembros-equipo-salud-laboral.component.html',
  styleUrl: './miembros-equipo-salud-laboral.component.scss'
})
export class MiembrosEquipoSaludLaboralComponent implements OnInit {

  @Output()miembrosOut=new EventEmitter<MiembroEquipoSaludLaboral[]>();
  @Output()selectedProductsOUT= new EventEmitter<any[]>();
  @Input()miembrosList: MiembroEquipoSaludLaboral[] = []
  @Output() disable = new EventEmitter<boolean>();

  productDialog?: boolean;
  submitted?: boolean;

  selectedProducts?:any;
  miembros?: MiembroEquipoSaludLaboral[]
  miembro?: MiembroEquipoSaludLaboral;
  cedula?: number | null;
  nombre?: string | null;
  cargo?: string | null;
  division?: string | null;
  localidad?: string | null;
  peligro?:string | null;
  profesionalEncargado?:string | null;
  id: null | number=0;
  dropdownDisabled: boolean = false;

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
patologiasList= [
  { label: "--Seleccione--", value: null },
  { label: "Desordenes musculo esqueleticos", value: "Desordenes musculo esqueleticos" },
  { label: "Psicosocial", value: "Psicosocial" },
  { label: "Silicosis y patologias respiratorias", value: "Silicosis y patologias respiratorias" },
  { label: "Patologias ORL", value: "Patologias ORL" },
  { label: "Patologias dermatológicas", value: "Patologias dermatológicas" },
  { label: "Otras patologias", value: "Otras patologias" },
  { label: "Efectos por exposicion a quimicos", value: "Efectos por exposicion a quimicos" },

]

cargosInvestigacionPatologiasList: any[] = [];
onPeligroChange(event: any) {
  const selectedValue = event.value;
  
  if (selectedValue === "Desordenes musculo esqueleticos") {
    this.cargosInvestigacionPatologiasList = [
      { label: "Medico(a) SST", value: "Medico(a) SST" },
      { label: "Jefe inmediado", value: "Jefe inmediado" },
      { label: "Jefe SST / delegado", value: "Jefe SST / delegado" },
      { label: "Fisio. SST / Ergonomía", value: "Fisio. SST / Ergonomía" },
      { label: "Terapia Ocupacional SST", value: "Terapia Ocupacional SST" },
    ];
  } else if (selectedValue === "Psicosocial") {
    this.cargosInvestigacionPatologiasList = [
      { label: "Medico(a) SST", value: "Medico(a) SST" },
      { label: "Jefe inmediado", value: "Jefe inmediado" },
      { label: "Jefe SST / delegado", value: "Jefe SST / delegado" },
      { label: "Psicologia SST", value: "Psicologia SST" },
      { label: "Gestión Humana", value: "Gestión Humana" },
      { label: "Terapia Ocupacional SST", value: "Terapia Ocupacional SST" },

    ];
  } else if (selectedValue === "Silicosis y patologias respiratorias") {
    this.cargosInvestigacionPatologiasList = [
      { label: "Medico(a) SST", value: "Medico(a) SST" },
      { label: "Jefe inmediado", value: "Jefe inmediado" },
      { label: "Jefe SST / delegado", value: "Jefe SST / delegado" },
      { label: "Higienista SST", value: "Higienista SST" },
      { label: "Terapia Ocupacional SST", value: "Terapia Ocupacional SST" },

    ];
  } else if (selectedValue === "Patologias ORL") {
    this.cargosInvestigacionPatologiasList = [
      { label: "Medico(a) SST", value: "Medico(a) SST" },
      { label: "Jefe inmediado", value: "Jefe inmediado" },
      { label: "Jefe SST / delegado", value: "Jefe SST / delegado" },
      { label: "Higienista SST", value: "Higienista SST" },
    ];
  }else if (selectedValue === "Patologias dermatologicas") {
    this.cargosInvestigacionPatologiasList = [
      { label: "Medico(a) SST", value: "Medico(a) SST" },
      { label: "Jefe inmediado", value: "Jefe inmediado" },
      { label: "Jefe SST / delegado", value: "Jefe SST / delegado" },
      { label: "Higienista SST", value: "Higienista SST" },
    ];
  } else if (selectedValue === "Otras Patologias") {
    this.cargosInvestigacionPatologiasList = [
      { label: "Medico(a) SST", value: "Medico(a) SST" },
      { label: "Jefe inmediado", value: "Jefe inmediado" },
      { label: "Jefe SST / delegado", value: "Jefe SST / delegado" },
    ];
  } else if (selectedValue === "Efectos por exposicion a quimicos") {
    this.cargosInvestigacionPatologiasList = [
      { label: "Medico(a) SST", value: "Medico(a) SST" },
      { label: "Jefe inmediado", value: "Jefe inmediado" },
      { label: "Jefe SST / delegado", value: "Jefe SST / delegado" },
      { label: "Higienista SST", value: "Higienista SST" },
    ];
  } 
  else {
    // Si no hay un valor que coincida o se selecciona "--Seleccione--"
    this.cargosInvestigacionPatologiasList = [];
  }
}


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.disable.emit(false)
    if (this.miembrosList && this.miembrosList.length > 0) {
      this.peligro = this.miembrosList[0].peligro; // O ajusta según la lógica que necesites
      this.onPeligroChange({ value: this.peligro }); // Para actualizar la lista relacionada con el peligro seleccionado
    }
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

editProduct(product: MiembroEquipoSaludLaboral) {
  this.cedula = product.cedula;
  this.nombre = product.nombre;
  this.cargo = product.cargo;
  this.division = product.division;
  this.localidad = product.localidad;
  this.profesionalEncargado = product.profesionalEncargado;
  this.id = product.id!
  
  this.miembro = {...product};
  
  this.productDialog = true;
}

deleteProduct(product: MiembroEquipoSaludLaboral) {
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

  if (!this.cedula || !this.nombre || !this.cargo || !this.division || !this.localidad || !this.peligro || !this.profesionalEncargado) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Falta diligenciar todos los campos'});
  }
  else{

  this.miembro!.cedula=this.cedula;
  this.miembro!.nombre = this.nombre;
  this.miembro!.cargo = this.cargo;
  this.miembro!.division = this.division;
  this.miembro!.localidad = this.localidad;
  this.miembro!.peligro = this.peligro;
  this.miembro!.profesionalEncargado = this.profesionalEncargado;

  if(this.id){
      let x:any = this.miembrosList.find(ele=>{
          return ele.id == this.id
      })
      x.nombre = this.nombre;
      x.cargo=this.cargo;
      x.cedula=this.cedula;
      x.localidad=this.localidad;
      x.division=this.division;
      x.peligro = this.peligro;
      x.profesionalEncargado = this.profesionalEncargado;
      }else{
      this.id = this.miembrosList.length;
      this.id++;
      this.miembro!.id = this.id; 
      this.miembrosList.push(this.miembro!)
      this.dropdownDisabled = true;

  }
  console.log(this.miembrosList, "lista");
  

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
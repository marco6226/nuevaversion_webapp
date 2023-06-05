import { Localidades, SST, _divisionList } from './../../entities/aliados';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EquipoSST, ResponsableSST } from '../../entities/aliados';
import { EmpresaService } from '../../../empresa/services/empresa.service';

@Component({
  selector: 'app-equipo-sst',
  templateUrl: './equipo-sst.component.html',
  styleUrls: ['./equipo-sst.component.scss'],
  providers: [EmpresaService]
})
export class EquipoSstComponent implements OnInit {

  miembroToUpdate: SST | null = null;
  isEdtMiembro: string | null = null;
  @Output() closeDialog = new EventEmitter();
  @Output() createMiembroSST = new EventEmitter<EquipoSST>();
  @Output() createResponsableSST = new EventEmitter<ResponsableSST>();
  @Output() actualizarMiembro = new EventEmitter<SST>();
  @Input() isResponsable: boolean = false;
  @Input() flagConsult: boolean=false;
  @Input('miembroToUpdate')
  set receiveMiembroToUpdate(sst: SST){
    if(sst != null){
      if(sst.encargado){
        this.formResponsable.controls['nombre'].setValue(sst.nombre);
        this.formResponsable.controls['correo'].setValue(sst.correo);
        this.formResponsable.controls['telefono'].setValue(sst.telefono);
        this.formResponsable.controls['licenciaSST'].setValue(sst.licenciasst);
        this.isEdtMiembro = 'encargado';
      }else{
        this.formEquipo.controls['nombre'].setValue(sst.nombre);
        this.formEquipo.controls['documento'].setValue(sst.documento);
        this.formEquipo.controls['correo'].setValue(sst.correo);
        this.formEquipo.controls['telefono'].setValue(sst.telefono);
        this.formEquipo.controls['division'].setValue(JSON.parse(sst.division!));
        this.formEquipo.controls['localidad'].setValue(JSON.parse(sst.localidad!));
        this.formEquipo.controls['cargo'].setValue(sst.cargo);
        this.formEquipo.controls['licenciaSST'].setValue(sst.licenciasst);
        this.isEdtMiembro = 'equipo';
      }
      this.miembroToUpdate = sst;
    }else{
      this.formResponsable.reset();
      this.formEquipo.reset();
      this.isEdtMiembro = null;
      this.miembroToUpdate = null;
    }
  }

  responsableSST: ResponsableSST={
    nombre: '',
    correo: '',
    telefono: '',
    licenciaSST: ''
  }

  equipoSST: EquipoSST={
    nombre: '',
    documento: '',
    correo: '',
    telefono: '',
    division: '',
    localidad: '',
    cargo: '',
    licenciaSST: ''
  }

  divisionList= _divisionList
  localidadesList: any[] = [];
  selectedLocalidad: any[] = [];

  formResponsable: FormGroup;
  formEquipo: FormGroup;

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService
  ) { 
    this.formResponsable = fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      telefono: ['', Validators.required],
      licenciaSST: ['', Validators.required],
    })

    this.formEquipo = fb.group({
      nombre: ['', Validators.required],
      documento: ['', Validators.required],
      correo: ['', Validators.required],
      telefono: ['', Validators.required],
      division: ['', Validators.required],
      localidad: ['', Validators.required],
      cargo: ['', Validators.required],
      licenciaSST: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadLocalidades().then(result => {});
  }

  CloseDialog(){
    this.formResponsable.reset();
    this.formEquipo.reset();
    this.closeDialog.emit();
  }

  async loadLocalidades(){
    await this.empresaService.getLocalidades().then((items: Localidades[]) => {
      items.forEach(item => {
        this.localidadesList.push({label: item.localidad, value: item.localidad});
      });
    });
  }

  agregar(){
    if (this.isResponsable) {
      this.responsableSST = {
        nombre: this.formResponsable.value.nombre,
        correo: this.formResponsable.value.correo.toLowerCase(),
        telefono:this.formResponsable.value.telefono,
        licenciaSST: this.formResponsable.value.licenciaSST
      }
      
      this.createResponsableSST.emit(this.responsableSST)  
    } else {

      this.equipoSST = {
        nombre: this.formEquipo.value.nombre,
        documento: this.formEquipo.value.documento,
        correo: this.formEquipo.value.correo.toLowerCase(),
        telefono: this.formEquipo.value.telefono,
        division:this.formEquipo.value.division,
        localidad: JSON.stringify(this.selectedLocalidad),
        cargo:this.formEquipo.value.cargo,
        licenciaSST: this.formEquipo.value.licenciaSST
      }
      
      this.createMiembroSST.emit(this.equipoSST)     
    }
    
    this.CloseDialog();
  }

  actualizar(){
    
    if(this.isEdtMiembro == 'encargado'){
      this.miembroToUpdate!.nombre = this.formResponsable.value.nombre;
      this.miembroToUpdate!.correo = this.formResponsable.value.correo;
      this.miembroToUpdate!.telefono = this.formResponsable.value.telefono;
      this.miembroToUpdate!.licenciasst = this.formResponsable.value.licenciaSST;
      
      this.actualizarMiembro.emit(this.miembroToUpdate!);
    }else if(this.isEdtMiembro == 'equipo'){
      this.miembroToUpdate!.nombre = this.formEquipo.value.nombre;
      this.miembroToUpdate!.documento = this.formEquipo.value.documento;
      this.miembroToUpdate!.correo = this.formEquipo.value.correo;
      this.miembroToUpdate!.telefono = this.formEquipo.value.telefono;
      this.miembroToUpdate!.division = JSON.stringify(this.formEquipo.value.division);
      this.miembroToUpdate!.localidad = JSON.stringify(JSON.stringify(this.selectedLocalidad));
      this.miembroToUpdate!.cargo = this.formEquipo.value.cargo;
      this.miembroToUpdate!.licenciasst = this.formEquipo.value.licenciaSST;
      
      this.actualizarMiembro.emit(this.miembroToUpdate!);
    }
    this.CloseDialog();
  }


}

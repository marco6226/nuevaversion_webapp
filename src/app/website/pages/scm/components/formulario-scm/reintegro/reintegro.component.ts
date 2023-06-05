import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Reintegro, ReintegroCreate } from './../../../entities/reintegro.interface';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { locale_es } from 'src/app/website/pages/comun/entities/reporte-enumeraciones';
import { SelectItem } from 'primeng/api';
import { CasosMedicosService } from 'src/app/website/pages/core/services/casos-medicos.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-reintegro',
  templateUrl: './reintegro.component.html',
  styleUrls: ['./reintegro.component.scss'],
  providers: [CasosMedicosService]
})
export class ReintegroComponent implements OnInit {

  idCase=null;
  @Input('idCase')
  set reintegroIdSet(idCasoMed: any){
    this.idCase=idCasoMed
  }
  @Input() onEdit: boolean=false;
  isEdit: Reintegro = {
    id: 0,
    tipo_retorno: '',
    descripcion: '',
    permanencia: '',
    periodo_seguimiento: '',
    reintegro_exitoso: '',
    fecha_cierre: null,
    observacion: '',
    pk_case: ''
  };
  @Input('isEdit')
  set onEditRetorno(isEdit: Reintegro){
    if(isEdit.id!=0){
      this.form.value.descripcion = this.isEdit.descripcion = isEdit.descripcion
      this.form.value.fecha_cierre = this.isEdit.fecha_cierre = (isEdit.fecha_cierre==null)?null:new Date(isEdit.fecha_cierre);
      this.isEdit.id = isEdit.id
      this.form.value.observacion = this.isEdit.observacion = isEdit.observacion
      this.form.value.periodo_seguimiento = this.isEdit.periodo_seguimiento = isEdit.periodo_seguimiento
      this.form.value.permanencia = this.isEdit.permanencia = isEdit.permanencia
      this.isEdit.pk_case = isEdit.pk_case
      this.form.value.reintegro_exitoso = this.isEdit.reintegro_exitoso = isEdit.reintegro_exitoso
      this.form.value.tipo_retorno = this.isEdit.tipo_retorno = isEdit.tipo_retorno
    }else{
      this.form.reset()
    }
  }
  @Output() isCreate = new EventEmitter<any>()
  localeES: any = locale_es;
  form: FormGroup;
  reintegroTipos: SelectItem[] = [
    {label: 'Reintegro', value:'Reintegro'},
    {label: 'Reubicación', value:'Reubicación'},
    {label: 'Reconversión', value:'Reconversión'},
  ]
  reintegroTipo:string=''
  temporals: SelectItem[] = [
    {label: 'Temporal', value:'Temporal'},
    {label: 'Permanente', value:'Permanente'},
  ]
  temporal: any;
  periocidadesTemp: SelectItem[] =[
    {label: 'Mensual', value:'Mensual'},
    {label: 'Bimestral', value:'Bimestral'},
    {label: 'Trimestral', value:'Trimestral'},
    {label: 'Semestral', value:'Semestral'},
    {label: 'Anual', value:'Anual'},

  ]
  periocidadesPerm: SelectItem[] = [
    {label: 'Semestral', value:'Semestral'},
    {label: 'Anual', value:'Anual'},

  ]

  constructor(
    private casosMedicosService: CasosMedicosService,
    public fb: FormBuilder,
    private config: PrimeNGConfig
  ) {    
    this.form = fb.group({
      tipo_retorno: [null, /*Validators.required*/],
      descripcion: [null, /*Validators.required*/],
      permanencia: [null],
      periodo_seguimiento: [null, /*Validators.required*/],
      reintegro_exitoso: [null],
      fecha_cierre: [new Date(), /*Validators.required*/],
      observacion: [null, /*Validators.required*/ ],
      pk_case: [null]
    })
   }

  ngOnInit() {
    this.config.setTranslation(this.localeES);
  }

  async saveReintegro(){
    this.form.value.pk_case=this.idCase
    if(!this.form.value.permanencia){
      this.form.value.permanencia='Permanente'
    }

    let reintegro: ReintegroCreate={
      pk_case: this.form.value.pk_case,
      tipo_retorno: this.form.value.tipo_retorno,
      descripcion: this.form.value.descripcion,
      permanencia: this.form.value.permanencia,
      periodo_seguimiento: this.form.value.periodo_seguimiento,
      reintegro_exitoso: this.form.value.reintegro_exitoso,
      fecha_cierre: this.form.value.fecha_cierre,
      observacion: this.form.value.observacion
    }
    await this.casosMedicosService.createReintegro(reintegro)
    this.LimpiarDatos()
  }

  async editReintegro(){    
    await this.casosMedicosService.editReintegro(this.isEdit).subscribe(element=>{
      this.LimpiarDatos()
    })
  }

  LimpiarDatos(){

    this.isEdit={
      id: 0,
      tipo_retorno: '',
      descripcion: '',
      permanencia: '',
      periodo_seguimiento: '',
      reintegro_exitoso: '',
      fecha_cierre: null,
      observacion: '',
      pk_case: ''
    }
    this.form.reset();
    this.isCreate.emit()
    
  }
  
  clear() {
    if (this.form.value.tipo_retorno=='Reconversión') {
        this.form.patchValue({
          periodo_seguimiento: [null, /*Validators.required*/],
        })
      }
  }
}

export interface drop{
  label: string,
  value: number
}
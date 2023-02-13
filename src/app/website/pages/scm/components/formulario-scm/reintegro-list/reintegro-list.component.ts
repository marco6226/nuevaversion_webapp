import { Component, Input, OnInit } from '@angular/core';
import { CasosMedicosService } from 'src/app/website/pages/core/services/casos-medicos.service';
import { Reintegro } from '../../../entities/reintegro.interface';

@Component({
  selector: 'app-reintegro-list',
  templateUrl: './reintegro-list.component.html',
  styleUrls: ['./reintegro-list.component.scss'],
  providers: [CasosMedicosService]
})
export class ReintegroListComponent implements OnInit {
  
  idCase: string | null = null;
  @Input('idCase') 
  set reintegroSet(idCasoMed: any){
    this.idCase = idCasoMed;
    this.casosMedicosService.getReintegroByCaseId(this.idCase!).subscribe((data: any)=>{
      this.reintegroList = data;
    });
  }
  reintegroList: Reintegro[] =[];
  modalRetorno: boolean = false;
  editRetorno: Reintegro = {
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
  onEdit: boolean = false;

  constructor(
    private casosMedicosService: CasosMedicosService
  ) { }

  ngOnInit() {}

  createRetorno(){
    this.onEdit = false;
    this.modalRetorno = true;
  }

  onRowEditInit(reintegro: any){
    this.onEdit=true;
    this.editRetorno = reintegro
    this.modalRetorno=true;    
  }

  reload(){    
    this.casosMedicosService.getReintegroByCaseId(this.idCase!).subscribe((data: any) => {
      this.reintegroList = data;
    })
    this.modalRetorno=false;
  }

  onHideDialog(){
    this.editRetorno= {
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
    this.onEdit=false;    
  }
}

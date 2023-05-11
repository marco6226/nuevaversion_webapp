import { Localidades, _actividadesContratadasList, _divisionList } from './../../entities/aliados';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpresaService } from '../../../empresa/services/empresa.service';

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.scss'],
  providers: [EmpresaService]
})
export class LocalidadesComponent implements OnInit {

  visibleDlg: boolean =false;
  visibleDlgLocalidades: boolean =false;
  @Input('selectDivision') 
  set actividadesIn(actividades: string){
    if(actividades != null){
      this.selectActividad = JSON.parse(actividades)
      this.agregarActividad()
    }
  }
  @Input('selectLocalidad') 
  set localidadesIn(localidades: string){
    // this.loadLocalidades()
    if(localidades != null){
      this.selectLocalidades = JSON.parse(localidades)
      this.agregarLocalidad()
    }
  }
  @Output() data =new EventEmitter();
  @Output() dataLocalidad = new EventEmitter<string>();
  divisionList= _divisionList;
  selectActividad: string[] = [];
  selectLocalidades: string[] = [];
  actividadesList: string[] = [];
  locadidadList: any[] = [];
  locadidadesList: string[] = [];
  edit: string | null = null;
  @Input() flagConsult: boolean=false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private empresaService: EmpresaService,
  ) { }

  ngOnInit(): void {
    this.edit = this.activatedRoute.snapshot.params['onEdit'];
    this.loadLocalidades()
  }
  
  agregarActividad(){
    this.actividadesList = this.selectActividad;
    this.cerrarDialogo();
    this.data.emit(JSON.stringify(this.actividadesList));

  }

  abrirDialogo(param: string | null = null){
    if (param) {
      this.selectActividad = []
    }
    this.visibleDlg = true;
  }

  cerrarDialogo(){
    this.visibleDlg = false;
  }

  onAddLocalidad(){
    this.dataLocalidad.emit(JSON.stringify(this.locadidadesList))
    
  }

  async loadLocalidades(){
    await this.empresaService.getLocalidades().then((element: Localidades[]) =>{
      element.forEach(elemen => {
        this.locadidadList.push({label: elemen.localidad, value: elemen.localidad})
    });
   });

   this.locadidadList.sort(function(a,b){
    if(a.label > b.label){
      return 1
    }else if(a.label < b.label){
      return -1;
    }
      return 0;
    });
  }

  SortArray(x: any, y: any){
    if (x.LastName < y.LastName) {return -1;}
    if (x.LastName > y.LastName) {return 1;}
    return 0;
  }

  abrirDialogoLocalidades(param: string | null = null){
    if (param) {
      this.selectLocalidades = []
    }
    this.visibleDlgLocalidades = true;
  }

  agregarLocalidad(){
    this.locadidadesList = this.selectLocalidades;
    this.onAddLocalidad()
    this.cerrarLocalidad()
  }

  cerrarLocalidad(){
    this.visibleDlgLocalidades = false;
  }
}

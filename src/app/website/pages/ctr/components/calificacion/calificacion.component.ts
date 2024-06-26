import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.scss']
})
export class CalificacionComponent implements OnInit{
  @Output()valoracionOUT= new EventEmitter<String>();
  @Output()flagValid2= new EventEmitter<boolean>();
  
  @Input('selectCalificacion') 
  set actividadesIn(actividades: string){
    
    if (actividades != null) {
      let dataIn = JSON.parse(actividades)
      this.riesgo = dataIn[0]; 
      this.permanencia = dataIn[1];
      this.impacto = dataIn[2]
      this.tamano = dataIn[3];
      this.claseRiesgo = dataIn[4];
      this.transversalidad = dataIn[5];
      this.selectedPermanencia = dataIn[6];
      this.selectedTamano = dataIn[7];
      this.selectedClaseRiesgo = dataIn[8];
      this.valoracionActual = Number(this.riesgo) + Number(this.selectedPermanencia.value) + Number(this.impacto)
                          + Number(this.selectedTamano.value) + Number(this.selectedClaseRiesgo.value) + Number(this.transversalidad);
      this.valoracionActual = Number(this.valoracionActual.toFixed(2));

      
    }    
    this.flagValid=(this.riesgo!=null && this.selectedPermanencia!=null && this.impacto!=null && this.selectedTamano!=null && this.selectedClaseRiesgo!=null && this.transversalidad!=null)?true:false
    this.flagValid2.emit(this.flagValid)
  }

  @Output() data = new EventEmitter<String>();
  values: any[]=[];
  riesgo!: string;
  permanencia: object[];
  impacto!: string;
  tamano: object[];
  claseRiesgo: object[];
  transversalidad!: string;
  selectedPermanencia: any;
  selectedTamano: any;
  selectedClaseRiesgo: any;
  valoracionActual!: number;
  valoracionToString!: string;
  @Input() onEdit!: string;
  @Input() flagConsult: boolean = false;
  flagValid:boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    this.permanencia = [
      {name: 'Continua', value: 1.25}, 
      {name: 'Frecuente', value: 0.75}, 
      {name: 'Esporádica', value: 0.25}
    ];

    this.tamano = [
      {name: 'Gran empresa: >250 trabajadores', value: 0.25},
      {name: 'Mediana: Entre 51 y 250 trabajadores', value: 0.2},
      {name: 'PYME: Entre 11 y 50 trabajadores', value: 0.1},
      {name: 'Micro: < 10 trabajadores', value: 0.05}
    ];

    this.claseRiesgo = [
      {name: 'Clase 5', value: 1}, 
      {name: 'Clase 4', value: 0.8}, 
      {name: 'Clase 3', value: 0.6}, 
      {name: 'Clase 2', value: 0.4}, 
      {name: 'Clase 1', value: 0.2}
    ];
  }

  ngOnInit(): void {
    this.onEdit = this.activatedRoute.snapshot.params['onEdit'];
  }
  
  onSaveData(){
    this.flagValid=(this.riesgo!=null && this.selectedPermanencia!=null && this.impacto!=null && this.selectedTamano!=null && this.selectedClaseRiesgo!=null && this.transversalidad!=null)?true:false
    this.flagValid2.emit(this.flagValid)
    this.values = []
    this.values.push(this.riesgo);
    this.values.push(this.permanencia);
    this.values.push(this.impacto);
    this.values.push(this.tamano);
    this.values.push(this.claseRiesgo);
    this.values.push(this.transversalidad);
    this.values.push(this.selectedPermanencia);
    this.values.push(this.selectedTamano);
    this.values.push(this.selectedClaseRiesgo);
    this.valoracionActual = Number(this.riesgo) + Number(this.selectedPermanencia.value) + Number(this.impacto)
                        + Number(this.selectedTamano.value) + Number(this.selectedClaseRiesgo.value) + Number(this.transversalidad);
    this.valoracionActual = Number(this.valoracionActual.toFixed(2));

    this.data.emit(JSON.stringify(this.values))
  }

  validCalificacion(){

  }

  salidaValoracion(){
    let valString= this.valoracionActual >= 1 && this.valoracionActual <= 2 ? 'Bajo'
    : this.valoracionActual > 2 && this.valoracionActual <= 4 ? 'Medio'
    : this.valoracionActual > 4 ? 'Alto'
    : ' '
    this.valoracionOUT.emit(valString);
}
  getColor(){
    return this.valoracionActual >= 1 && this.valoracionActual <= 2 ? 'bg-c-green'
    : this.valoracionActual > 2 && this.valoracionActual <= 4 ? 'bg-c-yellow'
    : this.valoracionActual > 4 ? 'bg-c-pink'
    : 'bg-c-blue'
  }

  getValoracionToString(): string{
    this.salidaValoracion()
    return this.valoracionActual >= 1 && this.valoracionActual <= 2 ? 'Impacto Bajo'
    : this.valoracionActual > 2 && this.valoracionActual <= 4 ? 'Impacto Medio'
    : this.valoracionActual > 4 ? 'Impacto Alto'
    : '0'
  }

}

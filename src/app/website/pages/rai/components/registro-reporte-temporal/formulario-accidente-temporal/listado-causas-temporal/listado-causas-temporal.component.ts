import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { listFactores, listPlanAccion } from 'src/app/website/pages/comun/entities/factor-causal';

@Component({
  selector: 'app-listado-causas-temporal',
  templateUrl: './listado-causas-temporal.component.html',
  styleUrls: ['./listado-causas-temporal.component.scss'],
  providers: []
})
export class ListadoCausasTemporalComponent implements OnInit {

  @Output() validacionPA = new EventEmitter<any>()
  @Output() tabIndex = new EventEmitter<number>()

  factores: listFactores[] | null = null;
  @Input("factores")
  set factores2(factores: listFactores[]){
    this.factores = factores
  }
  @Input() planAccionList: listPlanAccion[]=[];
  causasListSelect: listFactores[] | null = null;

  constructor() {}

  ngOnInit() {
  }

  test(){
    console.log(this.factores);
    this.causasListSelect=[]
  }
}

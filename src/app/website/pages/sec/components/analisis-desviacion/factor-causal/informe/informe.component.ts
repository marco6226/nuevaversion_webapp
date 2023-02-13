import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import {
  locale_es,
  tipo_identificacion,
  tipo_vinculacion,
} from "src/app/website/pages/comun/entities/reporte-enumeraciones";
import { listFactores, ValorCausas } from 'src/app/website/pages/comun/entities/factor-causal';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css','./informe.component.scss']
})
export class InformeComponent implements OnInit {

@Input() desviacionesList?:any;
@Input() consultar?:any;
@Input() observacion?:any;
@Input() miembros?:any;
@Input() selectedProducts?:any;
@Input() infoIn?:any;
@Input() factores?: listFactores[];
@Input() planAccionList?:any;
@Input() contFotografia?:any;
@Input() contDocumental?:any;
@Input() contPoliticas?:any;
@Input() contProcedimientos?:any;
@Input() contMultimedias?:any;

prueba:ValorCausas[]=[]
localeES: any = locale_es;
canvas = document.createElement('canvas');

  constructor() { }

  ngOnInit(): void {
    this.numerarCausal()
    this.evidencias()
  }
  numerarCausal(){
    this.prueba=[]
    let variab:number=0;
    this.planAccionList.forEach((element:any) => {
      element.causaRaiz.forEach((element2:any) =>{
        variab++;
        let variab2:ValorCausas={
          id:variab,
          NcausaRaiz:element.nombreFC,
          causaRaiz:element2.causaRaiz,
          accionCorrectiva:element2.especifico.accionCorrectiva,
          fechaVencimiento:element2.especifico.fechaVencimiento,
          responsableEmpresa : element2.especifico.responsableEmpresa == null ? null : element2.especifico.responsableEmpresa.primerNombre+" "+element2.especifico.responsableEmpresa.primerApellido,
          responsableExterno:element2.especifico.responsableExterno,
        }
        this.prueba.push(variab2)
      })
    });
    }

  evidencias(){
  }
}

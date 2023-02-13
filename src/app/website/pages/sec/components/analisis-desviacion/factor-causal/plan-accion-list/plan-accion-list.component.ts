import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { listPlanAccion } from 'src/app/website/pages/comun/entities/factor-causal';
import { Message, SelectItem, ConfirmationService } from 'primeng/api';
import {TreeNode} from 'primeng/api';
import { Console } from 'console';

@Component({
  selector: 'app-plan-accion-list',
  templateUrl: './plan-accion-list.component.html',
  styleUrls: ['./plan-accion-list.component.scss']
})
export class PlanAccionListComponent implements OnInit {

  @Input() planAccionList: listPlanAccion[] = []
  @Output() validacionPA = new EventEmitter<any>()
  @Output() flagPlanAccionlist =new EventEmitter<any>()
  @Output() actualizar =new EventEmitter<any>()
  planAccionListSelected?: listPlanAccion;
  causasListSelect?:any
  display: boolean = false;
  constructor(
    private confirmationService: ConfirmationService,
  ) {}
  cols?: any[];
  files?: TreeNode[]
  validate?: string;
  
  isRazonable: boolean = true
  isMedible: boolean = true
  isEficaz: boolean = true
  isRevisado: boolean = true

  classSelect ={'height':'2px !important'}

  ngOnInit(): void {
  }
  habilitar(){
    this.display = false
    this.planAccionList.forEach(element => {
      element.causaRaiz.forEach((elementIn:any) => {
        if(elementIn.especifico.accionCorrectiva!=null && elementIn.especifico.accionCorrectiva != ""){
          elementIn.especifico.isComplete = true;
        }
        else{
          elementIn.especifico.isComplete = false;
        }

        if(elementIn.razonable.justificacion!=null && elementIn.razonable.justificacion != ""){
          elementIn.razonable.isComplete = true
        }
        else{
          elementIn.razonable.isComplete = false;
        }

        if(elementIn.medible.planVerificacion!=null && elementIn.medible.planVerificacion != ""){
          elementIn.medible.isComplete = true
        }
        else{
          elementIn.medible.isComplete = false;
        }

        if(elementIn.eficaz.planValidacion!=null && elementIn.eficaz.planValidacion != ""){
          elementIn.eficaz.isComplete = true
        }
        else{
          elementIn.eficaz.isComplete = false;
        }

        if(elementIn.revisado.revisado!=null && elementIn.revisado.revisado != ""){
          elementIn.revisado.isComplete = true
        }
        else{
          elementIn.revisado.isComplete = false;
        }
      });
      
      
    });
    this.validacionPA.emit()
  }
  selectProduct2(event:any, selection:any) {
    this.validate = selection
    this.planAccionListSelected = event;
    this.display = true
  }
  eliminar(data:any,causa:any,i:any,j:any){
    this.confirmationService.confirm({
      header: 'Confirmar acción',
      message: 'La causa raíz:' + this.planAccionList[i].causaRaiz[j].causaRaiz + ', del factor causal :'+this.planAccionList[i].nombreFC+'), será eliminado y no podrá deshacer esta acción, ¿Desea continuar?',
      // message: 'La causa raíz seleccionada será eliminada, no podrá deshacer esta acción, ¿Desea continuar?',
      accept: () =>{
        this.planAccionList[i].causaRaiz=this.planAccionList[i].causaRaiz.filter((item:any) => item!==causa);
        if(this.planAccionList[i].causaRaiz.length==0){
          this.planAccionList=this.planAccionList.filter((item) => item!==data);}
        let eliminar=[data,i]
        this.flagPlanAccionlist.emit(eliminar)
        this.habilitar()
      },
			reject: () => {
				console.log(this.planAccionList[i].causaRaiz)
			},
    });
    this.actualizar.emit()
  }
}

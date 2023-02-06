import { ConfirmationService, MessageService } from 'primeng/api';
import { FactorCausal, listFactores, listPlanAccion } from 'src/app/website/pages/comun/entities/factor-causal';
import { Component, Injectable, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-listado-causas',
  templateUrl: './listado-causas.component.html',
  styleUrls: ['./listado-causas.component.scss'],
  providers: [MessageService]
})
export class ListadoCausasComponent implements OnInit {

  @Output() validacionPA = new EventEmitter<any>()
  @Output() tabIndex = new EventEmitter<number>()

  factores?: listFactores[];
  @Input("factores")
  set factores2(factores: listFactores[]){
    this.factores=factores
}

  @Input() planAccionList: listPlanAccion[]=[];

  causasListSelect?: listFactores[];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }
  crearPlanAccion(){
    this.confirmationService.confirm({
      header:'Confirmar',
      message: '¿Desea realizar este plan de acción?',
      accept: () => {
        let tempnombreFC :any;
        let tempnombreFC2:any;
        let tempcausaRaiz:any;
        let preguntas:any;

        tempnombreFC=""
        tempnombreFC2=""
        tempcausaRaiz=""
        preguntas=""

        this.causasListSelect?.sort((obj1:any, obj2:any) => {
          if (obj1.nombre > obj2.nombre) {
              return 1;
          }
      
          if (obj1.nombre < obj2.nombre) {
              return -1;
          }
      
          return 0;
        });

        this.causasListSelect?.forEach((element:any) => {
 
          var re = element.nombre; 
          var str = tempnombreFC
          if (str.search(re) == -1 ) { 
            if (tempnombreFC) {
              tempnombreFC = tempnombreFC + '**' + element.nombre            
            } else {
              tempnombreFC = element.nombre            
            }
          }
          if (tempnombreFC2) {
            tempnombreFC2 = tempnombreFC2 + '**' + element.nombre           
          } else {
            tempnombreFC2 = element.nombre        
          }
          
          if (tempcausaRaiz) {
            tempcausaRaiz = tempcausaRaiz + '**' + element.metodologia            
          } else {
            tempcausaRaiz = element.metodologia            
          }

          if (preguntas) {
            preguntas = preguntas + '**' + element.pregunta            
          } else {
            preguntas = element.pregunta
          }
        });
        
        let isExist = this.planAccionList.find(ele=>{
          return ele.nombreFC == tempnombreFC || ele.causaRaiz == tempcausaRaiz
        })
        let tempCausa=[]
        let x =this.planAccionList.find(ele=>{ return ele.nombreFC == tempnombreFC})

        if (x) {
          this.planAccionList.forEach(ele=>{
            if (tempnombreFC == ele.nombreFC) {
              ele.causaRaiz?.push({ 
                nombreFC2:tempnombreFC2,
                preguntas: preguntas,
                causaRaiz: tempcausaRaiz, 
                especifico:{
                  id: null,
                  nombreAccionCorrectiva: null,
                  accionCorrectiva: null,
                  fechaVencimiento: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  isComplete: false,
                  email: false
                }, 
                razonable:{
                  justificacion: null,
                  isComplete: false
                }, 
                eficaz:{
                  id: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  fechaVencimiento: null,
                  planValidacion: null,
                  isComplete: false,
                  email: false
                }, 
                medible:{
                  id: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  fechaVencimiento: null,
                  planVerificacion: null,
                  isComplete: false,
                  email: false
                }, 
                revisado:{
                  revisado: null,
                  isComplete: false
                }})              
            }
          })
        }else{
          tempCausa.push({
            nombreFC2:tempnombreFC2,
            preguntas:preguntas,
            causaRaiz: tempcausaRaiz, 
                especifico:{
                  id: null,
                  nombreAccionCorrectiva: null,
                  accionCorrectiva: null,
                  fechaVencimiento: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  isComplete: false,
                  email: false
                }, 
                razonable:{
                  justificacion: null
                }, 
                eficaz:{
                  id: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  fechaVencimiento: null,
                  planValidacion: null,
                  isComplete: false,
                  email: false
                }, 
                medible:{
                  id: null,
                  responsableEmpresa: null,
                  responsableExterno: null,
                  fechaVencimiento: null,
                  planVerificacion: null,
                  isComplete: false,
                  email: false
                }, 
                revisado:{
                  revisado: null,
                  isComplete: false
                }})
          this.planAccionList.push({nombreFC: tempnombreFC, causaRaiz:tempCausa})
        }
        this.validacionPA.emit();
        this.tabIndex.emit();
        this.causasListSelect=[]
      }
      
    });
  }
}

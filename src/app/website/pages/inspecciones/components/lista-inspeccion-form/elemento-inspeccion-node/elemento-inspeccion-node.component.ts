import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode, SelectItem } from 'primeng/api';
import { ElementoInspeccion } from '../../../entities/elemento-inspeccion';
import { OpcionCalificacion } from '../../../entities/opcion-calificacion';
import { TipoHallazgo } from '../../../entities/tipo-hallazgo';
import { Calificacion } from '../../../entities/calificacion';
import { NivelRiesgo } from 'src/app/website/pages/core/entities/nivel-riesgo';

@Component({
  selector: 'app-elemento-inspeccion-node',
  templateUrl: './elemento-inspeccion-node.component.html',
  styleUrls: ['./elemento-inspeccion-node.component.scss']
})
export class ElementoInspeccionNodeComponent implements OnInit {

  files!: TreeNode[]; 

  @Output() onElementoClick = new EventEmitter<any>();
  @Input("value") value!: ElementoInspeccion[];
  @Input("opciones") opciones?: OpcionCalificacion[];
  @Input() editable?: boolean;
  @Input("disabled") disabled?: boolean;
  @Input("nivelRiesgoList") nivelRiesgoList: any;
  @Input("diligenciable") diligenciable?: boolean;
  @Input("tiposHallazgo") tiposHallazgo?:TipoHallazgo[];
  @Input('tipoLista') tipoLista?: string;
  nivel?: any;
  contadorElem: number = 0;

  listasConPeso: string[] = [
    'Ciclo corto'
  ]

  @Input() nodeOpts: any = {
    0: { color: 'transparent', contraste: '' },
    1: { color: '#00BFFF', contraste: '' },
    2: { color: '#7B68EE', contraste: '' },
    3: { color: '#20B2AA', contraste: '' },
    4: { color: '#9370DB', contraste: '' },
    5: { color: '#87CEEB', contraste: '' },
    6: { color: '#265C5C', contraste: '' },
    7: { color: '#4169E1', contraste: '' },
    8: { color: '#7B68EE', contraste: '' },
  };

  criticidadList: SelectItem[] = [ 
    { label: "----",value : null },  
    { label: "Bajo",value: "Bajo"},
    { label: "Medio", value: "Medio" },
    { label: "Alto", value: "Alto" },
    { label: "Muy Alto", value: "Muy Alto" }];
  constructor(public router: Router) {

   }


  ngOnInit(): void {
    if(this.nivel == null){
      this.nivel = 0;
    }
    this.nivel += 1;
    if (this.value != null) {
      this.inicializarCalificacion(this.value);
    }
  }

  inicializarCalificacion(elemList: ElementoInspeccion[]) {

    elemList.forEach(element => {
      if (element.calificacion == null) {
        element.calificacion = {} as Calificacion;
        element.calificacion.opcionCalificacion = {} as OpcionCalificacion;
        element.calificacion.tipoHallazgo = {} as TipoHallazgo;
        element.calificacion.nivelRiesgo = {} as NivelRiesgo;
      } else if (element.calificacion.nivelRiesgo == null) {
        element.calificacion.nivelRiesgo = {} as NivelRiesgo;
      }
    });
  }

  addElemento(elemPadre: ElementoInspeccion) {
    if (elemPadre.elementoInspeccionList == null) {
      elemPadre.elementoInspeccionList = [];
    }
    
    let elemento = {} as ElementoInspeccion;
    elemento.numero = ++this.contadorElem;
    elemento.codigo = elemPadre.codigo + "." + (elemPadre.elementoInspeccionList.length + 1);
    console.log(elemPadre);
    elemPadre.elementoInspeccionList.push(elemento);
    console.log(this.value);
  }

  removeElemento(elementoList: ElementoInspeccion[], elemento: ElementoInspeccion) {
  
    for (let i = 0; i < elementoList.length; i++) {
      if (elementoList[i].codigo == elemento.codigo) {
        elementoList.splice(i, 1);
        break;
      }
    }
  }

  emitirEventoSelecElemento(elem: ElementoInspeccion) {
    this.onElementoClick.emit(elem);
  }

  get conPeso(): boolean{
    // console.log(this.tipoLista);
    // console.log(this.tipoLista && this.tipoLista === 'Ciclo corto' ? true : false);
    return this.tipoLista && this.listasConPeso.includes(this.tipoLista) ? true : false;
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode, SelectItem } from 'primeng/api';
import { NivelRiesgo } from 'src/app/website/pages/core/entities/nivel-riesgo';
import { InputSwitchOnChangeEvent } from 'primeng/inputswitch';
import { ElementoInspeccion } from 'src/app/website/pages/inspecciones/entities/elemento-inspeccion';
import { OpcionCalificacion } from 'src/app/website/pages/inspecciones/entities/opcion-calificacion';
import { TipoHallazgo } from 'src/app/website/pages/inspecciones/entities/tipo-hallazgo';
import { Calificacion } from 'src/app/website/pages/inspecciones/entities/calificacion';

@Component({
  selector: 'app-elemento-inspeccion-node-ctr',
  templateUrl: './elemento-inspeccion-node-ctr.component.html',
  styleUrls: ['./elemento-inspeccion-node-ctr.component.scss']
})
export class ElementoInspeccionNodeCtrComponent implements OnInit {

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
  elemConEtiqueta: number[] = [];

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
    elemPadre.elementoInspeccionList.push(elemento);
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
    return this.tipoLista && this.listasConPeso.includes(this.tipoLista) ? true : false;
  }

  porcentajeCumplimiento(elementoInspeccionList: ElementoInspeccion[]): string{
    let cumplimiento: number = 0;
    let obtenido = 0;
    let esperado = 0;

    elementoInspeccionList.forEach(elem => {
      if(elem.calificacion.opcionCalificacion.id){
        let valorSeleccion = this.opciones?.find(item => item.id === elem.calificacion.opcionCalificacion.id && !item.despreciable)?.valor;
        if(typeof valorSeleccion !== 'undefined'){
          obtenido += (valorSeleccion * elem.peso!);
          esperado += elem.peso!;
        }
      }
    });

    // console.log(obtenido, esperado);
    cumplimiento = (obtenido / esperado) * 100;

    return !isNaN(cumplimiento) && cumplimiento !== Infinity ? cumplimiento.toFixed(2) : 'NA';
  }

  onChangeCalcularCumplimiento(changeEvent: InputSwitchOnChangeEvent, elem: ElementoInspeccion){
    let optDespreciable = this.opciones?.find(opt => opt.despreciable);
    elem.calificacion.opcionCalificacion = optDespreciable!;
    elem?.elementoInspeccionList.forEach(item => {
      item.calificacion.opcionCalificacion.id = optDespreciable?.id!;
    });
    console.log(changeEvent.checked, elem);
  }

  getValueCalcularCumplimiento(elem: ElementoInspeccion): boolean{
    // console.log(elem);
    return elem.calificacion.calcularCumplimiento === null
          || typeof elem.calificacion.calcularCumplimiento === 'undefined'
          || elem.calificacion.calcularCumplimiento === true ? false : true;
  }

}

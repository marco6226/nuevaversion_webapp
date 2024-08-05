import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode, SelectItem } from 'primeng/api';
import { ElementoInspeccion } from '../../../entities/elemento-inspeccion';
import { OpcionCalificacion } from '../../../entities/opcion-calificacion';
import { TipoHallazgo } from '../../../entities/tipo-hallazgo';
import { Calificacion } from '../../../entities/calificacion';
import { NivelRiesgo } from 'src/app/website/pages/core/entities/nivel-riesgo';
import { InputSwitchOnChangeEvent } from 'primeng/inputswitch';

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
  // @Input('opciones')
  // set funOpciones(opciones: OpcionCalificacion[]) {
  //   this.opciones = opciones;
  //   let def=opciones.find(ele=>ele.defecto==true)

  //   if(def)this.default=def.id

  // }
  default?:any

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
    'Signos Vitales',
    'Ciclo Corto'
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
    let ele=[...elementoList]
    let num:number
    for (let i = 0; i < ele.length; i++) {
      if (ele[i].codigo == elemento.codigo) {
        elementoList.splice(i, 1);
        num=i
      }
    }

    // for (let i = 0; i < elementoList.length; i++) {
    //   if (i>=num!) {
    //     let codigo:string=ele[i].codigo
    //     elementoList[i] = {...elementoList[i], codigo: codigo}
    //   }
    // }
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

    cumplimiento = (obtenido / esperado) * 100;

    return !isNaN(cumplimiento) && cumplimiento !== Infinity ? cumplimiento.toFixed(2) : 'NA';
  }

  onChangeCalcularCumplimiento(changeEvent: InputSwitchOnChangeEvent, elem: ElementoInspeccion){
    let optDespreciable = this.opciones?.find(opt => opt.despreciable);
    elem.calificacion.opcionCalificacion = optDespreciable!;
    elem?.elementoInspeccionList.forEach(item => {
      item.calificacion.opcionCalificacion.id = optDespreciable?.id!;
    });
  }

  getValueCalcularCumplimiento(elem: ElementoInspeccion): boolean{
    return elem.calificacion.calcularCumplimiento === null
          || typeof elem.calificacion.calcularCumplimiento === 'undefined'
          || elem.calificacion.calcularCumplimiento === true ? false : true;
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ind-matriz-peligros',
  templateUrl: './ind-matriz-peligros.component.html',
  styleUrl: './ind-matriz-peligros.component.scss'
})
export class IndMatrizPeligrosComponent implements OnInit{
  filtro1: any[] = [{label: 'Riesgo incial', value: 0}, {label: 'Riesgo final', value: 1}];
  filtro2: any[] = [{label: 'Riesgo incial', value: 0}, {label: 'Riesgo final', value: 1}];
  filtro3: any[] = [{label: 'Riesgo incial sin eliminados y sustituidos', value: 0}, {label: 'Riesgo final sin eliminados y sustituidos', value: 1},{label: 'Riesgo incial con eliminados y sustituidos', value: 2}, {label: 'Riesgo final con eliminados y sustituidos', value: 3}];
  filtro4: any[] = [{label: 'Pendiente', value: 0}, {label: 'Ejecutado', value: 1}];
  filtro5: any[] = [{label: 'Riesgo incial', value: 0}, {label: 'Riesgo final', value: 1}];
  filtro6: any[] = [{label: 'Riesgo incial', value: 0}, {label: 'Riesgo final', value: 1}];
  filtro7: any[] = [{label: 'Riesgo incial', value: 0}, {label: 'Riesgo final', value: 1}];
  filtro8: any[] = [{label: 'Riesgo incial', value: 0}, {label: 'Riesgo final', value: 1}];
  filtro9: any[] = [{label: 'Riesgo incial', value: 0}, {label: 'Riesgo final', value: 1}];

  selectFiltro1: any=0
  selectFiltro2: any=0
  selectFiltro2Segundo: any=0
  selectFiltro3: any=0
  selectFiltro3Segundo: any=0
  selectFiltro4: any=0
  selectFiltro5: any=0
  selectFiltro6: any=0
  selectFiltro7: any=0
  selectFiltro8: any=0

  selectAnio1: number = new Date().getFullYear();
  selectAnio2: number = new Date().getFullYear();
  selectAnio3: number = new Date().getFullYear();
  selectAnio4: number = new Date().getFullYear();
  selectAnio5: number = new Date().getFullYear();
  selectAnio6: number = new Date().getFullYear();
  selectAnio7: number = new Date().getFullYear();
  selectAnio8: number = new Date().getFullYear();

  selectMes1: number = new Date().getFullYear();
  selectMes2: number = new Date().getFullYear();
  selectMes3: number = new Date().getFullYear();
  selectMes4: number = new Date().getFullYear();
  selectMes5: number = new Date().getFullYear();
  selectMes6: number = new Date().getFullYear();
  selectMes7: number = new Date().getFullYear();
  selectMes8: number = new Date().getFullYear();

  radioGra1:number=0
  radioGra2:number=0
  radioGra3:number=0
  radioGra4:number=0
  radioGra5:number=0
  radioGra6:number=0
  radioGra7:number=0
  radioGra8:number=0
  
  añoPrimero:number=2015;
  yearRange = new Array();
  dateValue= new Date();
  añoActual:number=this.dateValue.getFullYear();
  yearRangeNumber= Array.from({length: this.añoActual - this.añoPrimero+1}, (f, g) => g + this.añoPrimero);

  paisesListtotal: Array<any> = [
    {label: 'Colombia', value: 'Colombia'},
    {label: 'Costa Rica', value: 'Costa Rica'},
    {label: 'EEUU', value: 'EEUU'},
    {label: 'Guatemala', value: 'Guatemala'},
    {label: 'Honduras', value: 'Honduras'},
    {label: 'Mexico', value: 'Mexico'},
    {label: 'Nicaragua', value: 'Nicaragua'},
    {label: 'Corona Total', value: 'Corona Total'}
  ];
  
  Meses= [
    {label:'Enero',value:'Enero'},
    {label:'Febrero',value:'Febrero'},
    {label:'Marzo',value:'Marzo'},
    {label:'Abril',value:'Abril'},
    {label:'Mayo',value:'Mayo'},
    {label:'Junio',value:'Junio'},
    {label:'Julio',value:'Julio'},
    {label:'Agosto',value:'Agosto'},
    {label:'Septiembre',value:'Septiembre'},
    {label:'Octubre',value:'Octubre'},
    {label:'Noviembre',value:'Noviembre'},
    {label:'Diciembre',value:'Diciembre'}
  ];

  nivelRiesgo:any=[
    {label:'Muy Alto',value:'Muy Alto'},
    {label:'Alto',value:'Alto'},
    {label:'Medio',value:'Medio'},
    {label:'Bajo',value:'Bajo'}
  ];

  selectPais1:any
  selectPais2:any
  selectPais3:any
  selectPais4:any
  selectPais5:any
  selectPais6:any
  selectPais7:any
  selectPais8:any

  divisionList1:any[]=[]
  divisionList2:any[]=[]
  divisionList3:any[]=[]
  divisionList4:any[]=[]
  divisionList5:any[]=[]
  divisionList6:any[]=[]
  divisionList7:any[]=[]
  divisionList8:any[]=[]

  selecteDivision1:any
  selecteDivision2:any
  selecteDivision3:any
  selecteDivision4:any
  selecteDivision5:any
  selecteDivision6:any
  selecteDivision7:any
  selecteDivision8:any

  localidadesList1:any[]=[]
  localidadesList2:any[]=[]
  localidadesList3:any[]=[]
  localidadesList4:any[]=[]
  localidadesList5:any[]=[]
  localidadesList6:any[]=[]
  localidadesList7:any[]=[]
  localidadesList8:any[]=[]

  selecteLocalidad1:any
  selecteLocalidad2:any
  selecteLocalidad3:any
  selecteLocalidad4:any
  selecteLocalidad5:any
  selecteLocalidad6:any
  selecteLocalidad7:any
  selecteLocalidad8:any

  constructor(
 
  ) {
 

  }
  async ngOnInit(): Promise<void> {
    this.yearRange=[]
    for (let i = 0; i < this.yearRangeNumber.length; i++) {
      this.yearRange.push({label:this.yearRangeNumber[i],value:this.yearRangeNumber[i]});
    }
  }
}

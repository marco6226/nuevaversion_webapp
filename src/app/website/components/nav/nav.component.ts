import { Component, Input, OnInit } from '@angular/core';
import { Empresa } from '../../pages/empresa/entities/empresa';
import { Usuario } from '../../pages/empresa/entities/usuario';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  
  @Input() usuario!: Usuario
  @Input() empresasItems: SelectItem[] = [];
	@Input() empresaSelect!: Empresa;
	@Input() empresaSelectOld!: Empresa;

  selectedItem!: SelectItem;
  listItems!: SelectItem[]
  cities!: City[];

  selectedCity!: City;

  constructor() { 
    this.cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
  ];
  this.listItems = [{label: 'pi pi-align-justify', value: 'v1'}, {label: 'pi pi-angle-right', value: 'v2'}];
  }

  ngOnInit(): void {

  }

  test(){
    console.log(this.empresasItems, this.empresaSelect, this.empresaSelectOld);
    
  }
}

interface City {
  name: string,
  code: string
}

interface SelectItem{
  label: string,
  value: string
}
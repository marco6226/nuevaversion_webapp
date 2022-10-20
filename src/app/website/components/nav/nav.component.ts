import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  
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

}

interface City {
  name: string,
  code: string
}

interface SelectItem{
  label: string,
  value: string
}
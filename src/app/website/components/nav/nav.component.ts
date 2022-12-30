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
  display: boolean = false;

  constructor() { 
    }

  ngOnInit(): void {

  }

  test(){
    console.log(this.empresasItems, this.empresaSelect, this.empresaSelectOld);
    
  }


    showDialog() {
      if (this.empresasItems.length > 1) {
        this.display = true;        
      }
    }

    confirmEmpresa(event: Event){
      console.log(event);
      
    }
}

interface SelectItem{
  label: string,
  value: string
}
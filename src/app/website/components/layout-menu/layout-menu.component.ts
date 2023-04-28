import { Component, ContentChild, Input, Output, OnInit, ViewChild ,EventEmitter} from '@angular/core';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-layout-menu',
  templateUrl: './layout-menu.component.html',
  styleUrls: ['./layout-menu.component.scss']
})
export class LayoutMenuComponent implements OnInit {

	@ViewChild(MenuComponent) menuComp!: MenuComponent;
  @Output() openMenu = new EventEmitter<boolean>();


  container = document.getElementById('container');

  constructor() { }

  ngOnInit(): void {
    const cont = document.getElementById('container');
    cont?.classList.add('hiddenMenu')
    cont?.classList.remove('showMenu')
  }

  onHiddenMenu(event: any){
    this.openMenu.emit(event);
    const cont = document.getElementById('container');    

    if (event) {
      cont?.classList.add('showMenu')
      cont?.classList.remove('hiddenMenu')      
    } else {
      cont?.classList.add('hiddenMenu')
      cont?.classList.remove('showMenu')
    }
  }

  loadMenu(){
    this.menuComp.recargarMenu();
  }

}

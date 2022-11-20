import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout-menu',
  templateUrl: './layout-menu.component.html',
  styleUrls: ['./layout-menu.component.scss']
})
export class LayoutMenuComponent implements OnInit {

  container = document.getElementById('container');

  constructor() { }

  ngOnInit(): void {
    const cont = document.getElementById('container');
    cont?.classList.add('hiddenMenu')
    cont?.classList.remove('showMenu')
  }

  onHiddenMenu(event: any){
    const cont = document.getElementById('container');    

    if (event) {
      cont?.classList.add('showMenu')
      cont?.classList.remove('hiddenMenu')      
    } else {
      cont?.classList.add('hiddenMenu')
      cont?.classList.remove('showMenu')
    }
  }

}

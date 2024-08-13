import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HideAndShowMenuService {

  private menuToggleSubject = new BehaviorSubject<boolean>(false);
  menuToggle$ = this.menuToggleSubject.asObservable();

  constructor() {

  }

  setMenuToggle(value: boolean) {
    this.menuToggleSubject.next(value);
  }

  getMenuToggle(): boolean {
    return this.menuToggleSubject.value;
  }

  showMenu() {
    const childLabels = document.querySelectorAll("[id='text-toggle']");
    const arrow = document.getElementById('arrow');
    const container = document.getElementById('container');
    const data = document.querySelectorAll("[id='data']"); 

    arrow?.classList.add('bi-caret-left-fill')
    arrow?.classList.remove('bi-caret-right-fill')

    container?.classList.add('container-show')
    container?.classList.remove('container-hide')

    data.forEach(element => {
        element.classList.add('data-show');
        element.classList.remove('data-hide'); 
    });

    setTimeout(() => {
        childLabels.forEach(element => {
            element.classList.add('text-show');
            element.classList.remove('text-hide') 
        });

    }, 100);
    
  }

  hideMenu() {
    const childLabels = document.querySelectorAll("[id='text-toggle']");
    const arrow = document.getElementById('arrow');
    const container = document.getElementById('container');
    const data = document.querySelectorAll("[id='data']");

    childLabels.forEach((element) => {
      element.classList.add('text-hide');
      element.classList.remove('text-show');
    });

    setTimeout(() => {
      arrow?.classList.add('bi-caret-right-fill');
      arrow?.classList.remove('bi-caret-left-fill');
      container?.classList.remove('container-show');
      container?.classList.add('container-hide');
      data.forEach((element) => {
        element.classList.remove('data-show');
        element.classList.add('data-hide');
      });
    }, 80);
  }
}

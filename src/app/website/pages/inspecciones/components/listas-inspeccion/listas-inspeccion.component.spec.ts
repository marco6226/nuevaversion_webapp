import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasInspeccionComponent } from './listas-inspeccion.component';

describe('ListasInspeccionComponent', () => {
  let component: ListasInspeccionComponent;
  let fixture: ComponentFixture<ListasInspeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListasInspeccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListasInspeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

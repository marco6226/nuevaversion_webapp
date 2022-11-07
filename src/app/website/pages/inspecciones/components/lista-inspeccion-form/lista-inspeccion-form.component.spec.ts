import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInspeccionFormComponent } from './lista-inspeccion-form.component';

describe('ListaInspeccionFormComponent', () => {
  let component: ListaInspeccionFormComponent;
  let fixture: ComponentFixture<ListaInspeccionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaInspeccionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaInspeccionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

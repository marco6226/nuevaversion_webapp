import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaInspeccionesComponent } from './consulta-inspecciones.component';

describe('ConsultaInspeccionesComponent', () => {
  let component: ConsultaInspeccionesComponent;
  let fixture: ComponentFixture<ConsultaInspeccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaInspeccionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaInspeccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

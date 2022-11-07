import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaObservacionesComponent } from './consulta-observaciones.component';

describe('ConsultaObservacionesComponent', () => {
  let component: ConsultaObservacionesComponent;
  let fixture: ComponentFixture<ConsultaObservacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaObservacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaObservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

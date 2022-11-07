import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaAnalisisDesviacionComponent } from './consulta-analisis-desviacion.component';

describe('ConsultaAnalisisDesviacionComponent', () => {
  let component: ConsultaAnalisisDesviacionComponent;
  let fixture: ComponentFixture<ConsultaAnalisisDesviacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaAnalisisDesviacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaAnalisisDesviacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

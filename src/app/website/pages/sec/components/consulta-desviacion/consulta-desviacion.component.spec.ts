import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaDesviacionComponent } from './consulta-desviacion.component';

describe('ConsultaDesviacionComponent', () => {
  let component: ConsultaDesviacionComponent;
  let fixture: ComponentFixture<ConsultaDesviacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaDesviacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaDesviacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

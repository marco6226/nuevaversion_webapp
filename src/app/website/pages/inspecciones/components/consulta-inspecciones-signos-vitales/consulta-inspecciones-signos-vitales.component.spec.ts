import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaInspeccionesSignosVitalesComponent } from './consulta-inspecciones-signos-vitales.component';

describe('ConsultaInspeccionesSignosVitalesComponent', () => {
  let component: ConsultaInspeccionesSignosVitalesComponent;
  let fixture: ComponentFixture<ConsultaInspeccionesSignosVitalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaInspeccionesSignosVitalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultaInspeccionesSignosVitalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

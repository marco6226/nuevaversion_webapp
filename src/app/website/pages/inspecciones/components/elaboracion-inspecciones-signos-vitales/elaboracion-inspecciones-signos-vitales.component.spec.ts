import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElaboracionInspeccionesSignosVitalesComponent } from './elaboracion-inspecciones-signos-vitales.component';

describe('ElaboracionInspeccionesSignosVitalesComponent', () => {
  let component: ElaboracionInspeccionesSignosVitalesComponent;
  let fixture: ComponentFixture<ElaboracionInspeccionesSignosVitalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElaboracionInspeccionesSignosVitalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElaboracionInspeccionesSignosVitalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

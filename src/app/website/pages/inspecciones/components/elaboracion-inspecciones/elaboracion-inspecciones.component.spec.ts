import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElaboracionInspeccionesComponent } from './elaboracion-inspecciones.component';

describe('ElaboracionInspeccionesComponent', () => {
  let component: ElaboracionInspeccionesComponent;
  let fixture: ComponentFixture<ElaboracionInspeccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElaboracionInspeccionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElaboracionInspeccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

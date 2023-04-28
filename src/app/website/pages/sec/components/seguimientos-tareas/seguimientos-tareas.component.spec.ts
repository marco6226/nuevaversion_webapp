import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSeguimientosTareasComponent } from './seguimientos-tareas.component';

describe('AppSeguimientosTareasComponent', () => {
  let component: AppSeguimientosTareasComponent;
  let fixture: ComponentFixture<AppSeguimientosTareasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppSeguimientosTareasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSeguimientosTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

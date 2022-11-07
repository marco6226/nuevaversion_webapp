import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionTareasComponent } from './asignacion-tareas.component';

describe('AsignacionTareasComponent', () => {
  let component: AsignacionTareasComponent;
  let fixture: ComponentFixture<AsignacionTareasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignacionTareasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

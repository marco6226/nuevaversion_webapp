import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTareasComponent } from './gestion-tareas.component';

describe('GestionTareasComponent', () => {
  let component: GestionTareasComponent;
  let fixture: ComponentFixture<GestionTareasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionTareasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

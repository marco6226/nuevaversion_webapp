import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioIncidenteComponent } from './formulario-incidente.component';

describe('FormularioIncidenteComponent', () => {
  let component: FormularioIncidenteComponent;
  let fixture: ComponentFixture<FormularioIncidenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioIncidenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioIncidenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

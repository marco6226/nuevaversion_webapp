import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPeligroComponent } from './formulario-peligro.component';

describe('FormularioPeligroComponent', () => {
  let component: FormularioPeligroComponent;
  let fixture: ComponentFixture<FormularioPeligroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioPeligroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioPeligroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

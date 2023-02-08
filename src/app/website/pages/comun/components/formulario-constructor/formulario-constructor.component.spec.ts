import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioConstructorComponent } from './formulario-constructor.component';

describe('FormularioConstructorComponent', () => {
  let component: FormularioConstructorComponent;
  let fixture: ComponentFixture<FormularioConstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioConstructorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

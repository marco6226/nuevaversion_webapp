import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioScmComponent } from './formulario-scm.component';

describe('FormularioScmComponent', () => {
  let component: FormularioScmComponent;
  let fixture: ComponentFixture<FormularioScmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioScmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioScmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

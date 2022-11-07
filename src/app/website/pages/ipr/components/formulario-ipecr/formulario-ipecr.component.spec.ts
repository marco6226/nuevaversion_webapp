import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioIpecrComponent } from './formulario-ipecr.component';

describe('FormularioIpecrComponent', () => {
  let component: FormularioIpecrComponent;
  let fixture: ComponentFixture<FormularioIpecrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioIpecrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioIpecrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

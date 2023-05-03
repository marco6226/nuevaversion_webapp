import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionTareaComponent } from './verificacion-tarea.component';

describe('VerificacionTareaComponent', () => {
  let component: VerificacionTareaComponent;
  let fixture: ComponentFixture<VerificacionTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificacionTareaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificacionTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
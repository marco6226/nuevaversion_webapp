import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionDesempenoFormComponent } from './evaluacion-desempeno-form.component';

describe('EvaluacionDesempenoFormComponent', () => {
  let component: EvaluacionDesempenoFormComponent;
  let fixture: ComponentFixture<EvaluacionDesempenoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionDesempenoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionDesempenoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

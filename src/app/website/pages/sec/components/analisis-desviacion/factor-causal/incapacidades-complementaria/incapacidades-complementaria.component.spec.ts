import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapacidadesComplementariaComponent } from './incapacidades-complementaria.component';

describe('IncapacidadesComplementariaComponent', () => {
  let component: IncapacidadesComplementariaComponent;
  let fixture: ComponentFixture<IncapacidadesComplementariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncapacidadesComplementariaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncapacidadesComplementariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

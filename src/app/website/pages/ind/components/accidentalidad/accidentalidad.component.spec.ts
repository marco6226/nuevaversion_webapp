import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentalidadComponent } from './accidentalidad.component';

describe('AccidentalidadComponent', () => {
  let component: AccidentalidadComponent;
  let fixture: ComponentFixture<AccidentalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccidentalidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccidentalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

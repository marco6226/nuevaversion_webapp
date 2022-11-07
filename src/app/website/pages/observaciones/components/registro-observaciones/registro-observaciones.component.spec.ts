import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroObservacionesComponent } from './registro-observaciones.component';

describe('RegistroObservacionesComponent', () => {
  let component: RegistroObservacionesComponent;
  let fixture: ComponentFixture<RegistroObservacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroObservacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroObservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

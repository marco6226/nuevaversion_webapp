import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionObservacionesComponent } from './gestion-observaciones.component';

describe('GestionObservacionesComponent', () => {
  let component: GestionObservacionesComponent;
  let fixture: ComponentFixture<GestionObservacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionObservacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionObservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiembrosEquipoSaludLaboralComponent } from './miembros-equipo-salud-laboral.component';

describe('MiembrosEquipoSaludLaboralComponent', () => {
  let component: MiembrosEquipoSaludLaboralComponent;
  let fixture: ComponentFixture<MiembrosEquipoSaludLaboralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiembrosEquipoSaludLaboralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiembrosEquipoSaludLaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

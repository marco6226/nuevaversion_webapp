import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoContratistasComponent } from './seguimiento-contratistas.component';

describe('SeguimientoContratistasComponent', () => {
  let component: SeguimientoContratistasComponent;
  let fixture: ComponentFixture<SeguimientoContratistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoContratistasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoContratistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

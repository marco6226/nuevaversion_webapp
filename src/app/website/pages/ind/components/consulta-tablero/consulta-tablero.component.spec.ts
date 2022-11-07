import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaTableroComponent } from './consulta-tablero.component';

describe('ConsultaTableroComponent', () => {
  let component: ConsultaTableroComponent;
  let fixture: ComponentFixture<ConsultaTableroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaTableroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaTableroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

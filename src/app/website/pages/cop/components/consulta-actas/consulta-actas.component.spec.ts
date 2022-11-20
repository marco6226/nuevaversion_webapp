import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaActasComponent } from './consulta-actas.component';

describe('ConsultaActasComponent', () => {
  let component: ConsultaActasComponent;
  let fixture: ComponentFixture<ConsultaActasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaActasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

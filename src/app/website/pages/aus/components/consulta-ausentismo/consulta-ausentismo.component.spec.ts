import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaAusentismoComponent } from './consulta-ausentismo.component';

describe('ConsultaAusentismoComponent', () => {
  let component: ConsultaAusentismoComponent;
  let fixture: ComponentFixture<ConsultaAusentismoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaAusentismoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaAusentismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

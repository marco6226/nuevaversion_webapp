import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAusentismoComponent } from './reporte-ausentismo.component';

describe('ReporteAusentismoComponent', () => {
  let component: ReporteAusentismoComponent;
  let fixture: ComponentFixture<ReporteAusentismoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteAusentismoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteAusentismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresAusentismoComponent } from './indicadores-ausentismo.component';

describe('IndicadoresAusentismoComponent', () => {
  let component: IndicadoresAusentismoComponent;
  let fixture: ComponentFixture<IndicadoresAusentismoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicadoresAusentismoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicadoresAusentismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

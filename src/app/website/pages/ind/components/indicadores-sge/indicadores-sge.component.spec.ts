import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresSgeComponent } from './indicadores-sge.component';

describe('IndicadoresSgeComponent', () => {
  let component: IndicadoresSgeComponent;
  let fixture: ComponentFixture<IndicadoresSgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicadoresSgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicadoresSgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

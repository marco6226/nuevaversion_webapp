import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresInpComponent } from './indicadores-inp.component';

describe('IndicadoresInpComponent', () => {
  let component: IndicadoresInpComponent;
  let fixture: ComponentFixture<IndicadoresInpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicadoresInpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicadoresInpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

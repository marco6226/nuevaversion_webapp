import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresEmpComponent } from './indicadores-emp.component';

describe('IndicadoresEmpComponent', () => {
  let component: IndicadoresEmpComponent;
  let fixture: ComponentFixture<IndicadoresEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicadoresEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicadoresEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

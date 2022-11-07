import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresRaiComponent } from './indicadores-rai.component';

describe('IndicadoresRaiComponent', () => {
  let component: IndicadoresRaiComponent;
  let fixture: ComponentFixture<IndicadoresRaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicadoresRaiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicadoresRaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

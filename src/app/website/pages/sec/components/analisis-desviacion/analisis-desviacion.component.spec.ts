import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisDesviacionComponent } from './analisis-desviacion.component';

describe('AnalisisDesviacionComponent', () => {
  let component: AnalisisDesviacionComponent;
  let fixture: ComponentFixture<AnalisisDesviacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalisisDesviacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalisisDesviacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

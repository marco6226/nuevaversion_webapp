import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisCostosComponent } from './analisis-costos.component';

describe('AnalisisCostosComponent', () => {
  let component: AnalisisCostosComponent;
  let fixture: ComponentFixture<AnalisisCostosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalisisCostosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalisisCostosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

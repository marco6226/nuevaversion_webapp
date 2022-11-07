import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultactasComponent } from './consultactas.component';

describe('ConsultactasComponent', () => {
  let component: ConsultactasComponent;
  let fixture: ComponentFixture<ConsultactasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultactasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultactasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

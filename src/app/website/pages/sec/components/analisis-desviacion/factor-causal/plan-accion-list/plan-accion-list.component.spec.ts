import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAccionListComponent } from './plan-accion-list.component';

describe('PlanAccionListComponent', () => {
  let component: PlanAccionListComponent;
  let fixture: ComponentFixture<PlanAccionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanAccionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanAccionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

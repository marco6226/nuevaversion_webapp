import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCoronaComponent } from './dashboard-corona.component';

describe('DashboardCoronaComponent', () => {
  let component: DashboardCoronaComponent;
  let fixture: ComponentFixture<DashboardCoronaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCoronaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCoronaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

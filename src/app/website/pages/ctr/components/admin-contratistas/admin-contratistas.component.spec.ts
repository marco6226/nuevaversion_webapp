import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContratistasComponent } from './admin-contratistas.component';

describe('AdminContratistasComponent', () => {
  let component: AdminContratistasComponent;
  let fixture: ComponentFixture<AdminContratistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminContratistasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminContratistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

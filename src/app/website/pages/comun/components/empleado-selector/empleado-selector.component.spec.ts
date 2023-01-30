import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoSelectorComponent } from './empleado-selector.component';

describe('EmpleadoSelectorComponent', () => {
  let component: EmpleadoSelectorComponent;
  let fixture: ComponentFixture<EmpleadoSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleadoSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpleadoSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgeFormComponent } from './sge-form.component';

describe('SgeFormComponent', () => {
  let component: SgeFormComponent;
  let fixture: ComponentFixture<SgeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogmodalComponent } from './logmodal.component';

describe('LogmodalComponent', () => {
  let component: LogmodalComponent;
  let fixture: ComponentFixture<LogmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogmodalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

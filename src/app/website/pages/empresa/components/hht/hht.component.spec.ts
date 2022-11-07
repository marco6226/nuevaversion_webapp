import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HhtComponent } from './hht.component';

describe('HhtComponent', () => {
  let component: HhtComponent;
  let fixture: ComponentFixture<HhtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HhtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HhtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CieSelectorComponent } from './cie-selector.component';

describe('CieSelectorComponent', () => {
  let component: CieSelectorComponent;
  let fixture: ComponentFixture<CieSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CieSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CieSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

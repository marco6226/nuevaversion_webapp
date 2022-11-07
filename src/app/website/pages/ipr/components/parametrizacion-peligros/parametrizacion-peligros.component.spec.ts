import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrizacionPeligrosComponent } from './parametrizacion-peligros.component';

describe('ParametrizacionPeligrosComponent', () => {
  let component: ParametrizacionPeligrosComponent;
  let fixture: ComponentFixture<ParametrizacionPeligrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametrizacionPeligrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametrizacionPeligrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

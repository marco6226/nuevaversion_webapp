import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndCaracterizacionComponent } from './ind-caracterizacion.component';

describe('IndCaracterizacionComponent', () => {
  let component: IndCaracterizacionComponent;
  let fixture: ComponentFixture<IndCaracterizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndCaracterizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndCaracterizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

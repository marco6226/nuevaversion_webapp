import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueDatosComponent } from './cargue-datos.component';

describe('CargueDatosComponent', () => {
  let component: CargueDatosComponent;
  let fixture: ComponentFixture<CargueDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargueDatosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargueDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

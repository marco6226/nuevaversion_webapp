import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliadosActualizarComponent } from './aliados-actualizar.component';

describe('AliadosActualizarComponent', () => {
  let component: AliadosActualizarComponent;
  let fixture: ComponentFixture<AliadosActualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AliadosActualizarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AliadosActualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

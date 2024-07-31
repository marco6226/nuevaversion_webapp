import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosTrabajadorInvolucradoComponent } from './datos-trabajador-involucrado.component';

describe('DatosTrabajadorInvolucradoComponent', () => {
  let component: DatosTrabajadorInvolucradoComponent;
  let fixture: ComponentFixture<DatosTrabajadorInvolucradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosTrabajadorInvolucradoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosTrabajadorInvolucradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

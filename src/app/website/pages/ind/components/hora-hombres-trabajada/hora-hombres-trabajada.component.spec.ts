import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoraHombresTrabajadaComponent } from './hora-hombres-trabajada.component';

describe('HoraHombresTrabajadaComponent', () => {
  let component: HoraHombresTrabajadaComponent;
  let fixture: ComponentFixture<HoraHombresTrabajadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoraHombresTrabajadaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoraHombresTrabajadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

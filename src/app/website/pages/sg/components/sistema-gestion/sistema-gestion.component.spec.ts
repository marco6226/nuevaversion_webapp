import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SistemaGestionComponent } from './sistema-gestion.component';

describe('SistemaGestionComponent', () => {
  let component: SistemaGestionComponent;
  let fixture: ComponentFixture<SistemaGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SistemaGestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SistemaGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

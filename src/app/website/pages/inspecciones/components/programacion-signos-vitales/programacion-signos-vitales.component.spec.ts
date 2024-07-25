import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionSignosVitalesComponent } from './programacion-signos-vitales.component';

describe('ProgramacionSignosVitalesComponent', () => {
  let component: ProgramacionSignosVitalesComponent;
  let fixture: ComponentFixture<ProgramacionSignosVitalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramacionSignosVitalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramacionSignosVitalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

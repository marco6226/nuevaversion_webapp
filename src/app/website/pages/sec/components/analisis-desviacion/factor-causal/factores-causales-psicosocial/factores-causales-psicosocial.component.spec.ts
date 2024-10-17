import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoresCausalesPsicosocialComponent } from './factores-causales-psicosocial.component';

describe('FactoresCausalesPsicosocialComponent', () => {
  let component: FactoresCausalesPsicosocialComponent;
  let fixture: ComponentFixture<FactoresCausalesPsicosocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoresCausalesPsicosocialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactoresCausalesPsicosocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

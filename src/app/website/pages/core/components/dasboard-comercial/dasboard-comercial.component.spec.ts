import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardComercialComponent } from './dasboard-comercial.component';

describe('DasboardComercialComponent', () => {
  let component: DasboardComercialComponent;
  let fixture: ComponentFixture<DasboardComercialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasboardComercialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DasboardComercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizEppComponent } from './matriz-epp.component';

describe('MatrizEppComponent', () => {
  let component: MatrizEppComponent;
  let fixture: ComponentFixture<MatrizEppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrizEppComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatrizEppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

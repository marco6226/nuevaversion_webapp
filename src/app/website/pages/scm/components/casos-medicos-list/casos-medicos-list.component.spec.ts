import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosMedicosListComponent } from './casos-medicos-list.component';

describe('CasosMedicosListComponent', () => {
  let component: CasosMedicosListComponent;
  let fixture: ComponentFixture<CasosMedicosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasosMedicosListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CasosMedicosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentacionSaludLaboralComponent } from './documentacion-salud-laboral.component';

describe('DocumentacionSaludLaboralComponent', () => {
  let component: DocumentacionSaludLaboralComponent;
  let fixture: ComponentFixture<DocumentacionSaludLaboralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentacionSaludLaboralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentacionSaludLaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

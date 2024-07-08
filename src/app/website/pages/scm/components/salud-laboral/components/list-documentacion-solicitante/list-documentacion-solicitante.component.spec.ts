import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDocumentacionSolicitanteComponent } from './list-documentacion-solicitante.component';

describe('ListDocumentacionSolicitanteComponent', () => {
  let component: ListDocumentacionSolicitanteComponent;
  let fixture: ComponentFixture<ListDocumentacionSolicitanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDocumentacionSolicitanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListDocumentacionSolicitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

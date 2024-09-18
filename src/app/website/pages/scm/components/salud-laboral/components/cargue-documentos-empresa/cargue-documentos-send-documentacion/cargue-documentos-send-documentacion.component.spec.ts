import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueDocumentosSendDocumentacionComponent } from './cargue-documentos-send-documentacion.component';

describe('CargueDocumentosSendDocumentacionComponent', () => {
  let component: CargueDocumentosSendDocumentacionComponent;
  let fixture: ComponentFixture<CargueDocumentosSendDocumentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargueDocumentosSendDocumentacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargueDocumentosSendDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

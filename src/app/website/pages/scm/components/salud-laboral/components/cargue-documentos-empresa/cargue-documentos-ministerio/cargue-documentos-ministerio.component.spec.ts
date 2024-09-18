import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueDocumentosMinisterioComponent } from './cargue-documentos-ministerio.component';

describe('CargueDocumentosMinisterioComponent', () => {
  let component: CargueDocumentosMinisterioComponent;
  let fixture: ComponentFixture<CargueDocumentosMinisterioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargueDocumentosMinisterioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargueDocumentosMinisterioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

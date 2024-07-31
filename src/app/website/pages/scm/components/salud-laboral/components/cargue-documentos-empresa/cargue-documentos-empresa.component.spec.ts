import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueDocumentosEmpresaComponent } from './cargue-documentos-empresa.component';

describe('CargueDocumentosEmpresaComponent', () => {
  let component: CargueDocumentosEmpresaComponent;
  let fixture: ComponentFixture<CargueDocumentosEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargueDocumentosEmpresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargueDocumentosEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

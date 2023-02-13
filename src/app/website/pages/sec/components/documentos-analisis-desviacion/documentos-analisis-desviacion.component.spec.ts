import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosAnalisisDesviacionComponent } from './documentos-analisis-desviacion.component';

describe('DocumentosAnalisisDesviacionComponent', () => {
  let component: DocumentosAnalisisDesviacionComponent;
  let fixture: ComponentFixture<DocumentosAnalisisDesviacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentosAnalisisDesviacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosAnalisisDesviacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElaboracionListaSignosVitalesComponent } from './elaboracion-lista-signos-vitales.component';

describe('ElaboracionListaSignosVitalesComponent', () => {
  let component: ElaboracionListaSignosVitalesComponent;
  let fixture: ComponentFixture<ElaboracionListaSignosVitalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElaboracionListaSignosVitalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElaboracionListaSignosVitalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

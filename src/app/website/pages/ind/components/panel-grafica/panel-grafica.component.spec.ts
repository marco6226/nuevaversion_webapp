import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelGraficaComponent } from './panel-grafica.component';

describe('PanelGraficaComponent', () => {
  let component: PanelGraficaComponent;
  let fixture: ComponentFixture<PanelGraficaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelGraficaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelGraficaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

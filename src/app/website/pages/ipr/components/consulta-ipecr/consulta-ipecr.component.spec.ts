import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaIpecrComponent } from './consulta-ipecr.component';

describe('ConsultaIpecrComponent', () => {
  let component: ConsultaIpecrComponent;
  let fixture: ComponentFixture<ConsultaIpecrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaIpecrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaIpecrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

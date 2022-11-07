import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioPreferenciasComponent } from './usuario-preferencias.component';

describe('UsuarioPreferenciasComponent', () => {
  let component: UsuarioPreferenciasComponent;
  let fixture: ComponentFixture<UsuarioPreferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuarioPreferenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioPreferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

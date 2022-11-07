import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioPasswdComponent } from './cambio-passwd.component';

describe('CambioPasswdComponent', () => {
  let component: CambioPasswdComponent;
  let fixture: ComponentFixture<CambioPasswdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioPasswdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambioPasswdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

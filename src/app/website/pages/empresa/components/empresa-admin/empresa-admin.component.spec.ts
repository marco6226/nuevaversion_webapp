import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaAdminComponent } from './empresa-admin.component';

describe('EmpresaAdminComponent', () => {
  let component: EmpresaAdminComponent;
  let fixture: ComponentFixture<EmpresaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresaAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

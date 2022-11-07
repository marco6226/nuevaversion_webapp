import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScmPermisosComponent } from './scm-permisos.component';

describe('ScmPermisosComponent', () => {
  let component: ScmPermisosComponent;
  let fixture: ComponentFixture<ScmPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScmPermisosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScmPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

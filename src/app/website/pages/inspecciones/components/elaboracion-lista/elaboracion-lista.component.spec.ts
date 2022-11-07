import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElaboracionListaComponent } from './elaboracion-lista.component';

describe('ElaboracionListaComponent', () => {
  let component: ElaboracionListaComponent;
  let fixture: ComponentFixture<ElaboracionListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElaboracionListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElaboracionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

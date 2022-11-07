import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElaboracionTableroComponent } from './elaboracion-tablero.component';

describe('ElaboracionTableroComponent', () => {
  let component: ElaboracionTableroComponent;
  let fixture: ComponentFixture<ElaboracionTableroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElaboracionTableroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElaboracionTableroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

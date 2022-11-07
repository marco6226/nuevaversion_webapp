import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoAreaComponent } from './tipo-area.component';

describe('TipoAreaComponent', () => {
  let component: TipoAreaComponent;
  let fixture: ComponentFixture<TipoAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutMenuComponent } from './layout-menu.component';

describe('LayoutMenuComponent', () => {
  let component: LayoutMenuComponent;
  let fixture: ComponentFixture<LayoutMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

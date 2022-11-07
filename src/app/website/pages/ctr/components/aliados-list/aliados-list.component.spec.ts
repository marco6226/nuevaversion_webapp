import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliadosListComponent } from './aliados-list.component';

describe('AliadosListComponent', () => {
  let component: AliadosListComponent;
  let fixture: ComponentFixture<AliadosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AliadosListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AliadosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoCausasComponent } from './listado-causas.component';

describe('ListadoCausasComponent', () => {
  let component: ListadoCausasComponent;
  let fixture: ComponentFixture<ListadoCausasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoCausasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoCausasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
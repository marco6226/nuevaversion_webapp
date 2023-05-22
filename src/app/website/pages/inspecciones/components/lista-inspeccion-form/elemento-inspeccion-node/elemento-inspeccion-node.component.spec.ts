import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementoInspeccionNodeComponent } from './elemento-inspeccion-node.component';

describe('ElementoInspeccionNodeComponent', () => {
  let component: ElementoInspeccionNodeComponent;
  let fixture: ComponentFixture<ElementoInspeccionNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementoInspeccionNodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementoInspeccionNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

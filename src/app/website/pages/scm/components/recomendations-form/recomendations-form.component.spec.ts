import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendationsFormComponent } from './recomendations-form.component';

describe('RecomendationsFormComponent', () => {
  let component: RecomendationsFormComponent;
  let fixture: ComponentFixture<RecomendationsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecomendationsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomendationsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

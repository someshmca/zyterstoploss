import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanFactorComponent } from './plan-factor.component';

describe('PlanFactorComponent', () => {
  let component: PlanFactorComponent;
  let fixture: ComponentFixture<PlanFactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanFactorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

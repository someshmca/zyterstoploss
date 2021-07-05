import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaseringComponent } from './lasering.component';

describe('LaseringComponent', () => {
  let component: LaseringComponent;
  let fixture: ComponentFixture<LaseringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaseringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaseringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

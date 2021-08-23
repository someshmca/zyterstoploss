import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaseringSearchComponent } from './lasering-search.component';

describe('LaseringSearchComponent', () => {
  let component: LaseringSearchComponent;
  let fixture: ComponentFixture<LaseringSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaseringSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaseringSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

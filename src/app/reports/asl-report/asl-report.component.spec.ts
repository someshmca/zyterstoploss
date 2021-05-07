import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ASLReportComponent } from './asl-report.component';

describe('ASLReportComponent', () => {
  let component: ASLReportComponent;
  let fixture: ComponentFixture<ASLReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ASLReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ASLReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

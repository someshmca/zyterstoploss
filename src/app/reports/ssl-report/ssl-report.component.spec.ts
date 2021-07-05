import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SSLReportComponent } from './ssl-report.component';

describe('SSLReportComponent', () => {
  let component: SSLReportComponent;
  let fixture: ComponentFixture<SSLReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SSLReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SSLReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MAXLiabilityReportComponent } from './max-liability-report.component';

describe('MAXLiabilityReportComponent', () => {
  let component: MAXLiabilityReportComponent;
  let fixture: ComponentFixture<MAXLiabilityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MAXLiabilityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MAXLiabilityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

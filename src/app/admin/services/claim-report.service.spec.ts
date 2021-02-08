import { TestBed } from '@angular/core/testing';

import { ClaimReportService } from './claim-report.service';

describe('ClaimReportService', () => {
  let service: ClaimReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

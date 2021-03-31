import { TestBed } from '@angular/core/testing';

import { HealthPlanService } from './health-plan.service';

describe('HealthPlanService', () => {
  let service: HealthPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

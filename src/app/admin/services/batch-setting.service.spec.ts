import { TestBed } from '@angular/core/testing';

import { BatchSettingService } from './batch-setting.service';

describe('BatchSettingService', () => {
  let service: BatchSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

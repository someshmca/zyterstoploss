import { TestBed } from '@angular/core/testing';

import { LaseringService } from './lasering.service';

describe('LaseringService', () => {
  let service: LaseringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaseringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

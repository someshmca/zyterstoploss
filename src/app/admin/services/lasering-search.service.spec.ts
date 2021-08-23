import { TestBed } from '@angular/core/testing';

import { LaseringSearchService } from './lasering-search.service';

describe('LaseringSearchService', () => {
  let service: LaseringSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaseringSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

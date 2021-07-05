import { TestBed } from '@angular/core/testing';

import { ClaimSearchService } from './claim-search.service';

describe('ClaimSearchService', () => {
  let service: ClaimSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

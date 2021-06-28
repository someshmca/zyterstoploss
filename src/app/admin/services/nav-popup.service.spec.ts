import { TestBed } from '@angular/core/testing';

import { NavPopupService } from './nav-popup.service';

describe('NavPopupService', () => {
  let service: NavPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

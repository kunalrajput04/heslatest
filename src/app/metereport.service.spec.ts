import { TestBed } from '@angular/core/testing';

import { MetereportService } from './metereport.service';

describe('MetereportService', () => {
  let service: MetereportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetereportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MeterreportService } from './meterreport.service';

describe('MeterreportService', () => {
  let service: MeterreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeterreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

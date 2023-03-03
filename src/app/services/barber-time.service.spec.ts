import { TestBed } from '@angular/core/testing';

import { BarberTimeService } from './barber-time.service';

describe('BarberTimeService', () => {
  let service: BarberTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarberTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

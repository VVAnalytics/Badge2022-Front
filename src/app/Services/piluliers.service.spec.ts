import { TestBed } from '@angular/core/testing';

import { PiluliersService } from './piluliers.service';

describe('PharmaciesService', () => {
  let service: PiluliersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PiluliersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

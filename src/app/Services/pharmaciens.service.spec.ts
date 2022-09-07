import { TestBed } from '@angular/core/testing';

import { PharmaciensService } from './pharmaciens.service';

describe('PharmaciensService', () => {
  let service: PharmaciensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PharmaciensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

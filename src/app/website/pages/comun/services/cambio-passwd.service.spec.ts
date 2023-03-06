import { TestBed } from '@angular/core/testing';

import { CambioPasswdService } from './cambio-passwd.service';

describe('CambioPasswdService', () => {
  let service: CambioPasswdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CambioPasswdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

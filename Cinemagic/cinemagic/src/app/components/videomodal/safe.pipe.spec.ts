import {SafePipe} from './safe.pipe';
import {DomSanitizer} from '@angular/platform-browser';
import {TestBed} from '@angular/core/testing';

describe('SafePipe', () => {
  let pipe: SafePipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DomSanitizer]
    });
    sanitizer = TestBed.inject(DomSanitizer);
    pipe = new SafePipe(sanitizer);
  });

  it('Create an Instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Should transform URL to SafeResourceUrl', () => {
    const url = 'https://example.com';
    const safeUrl = pipe.transform(url);
    expect(safeUrl).toEqual(sanitizer.bypassSecurityTrustResourceUrl(url));
  });
});

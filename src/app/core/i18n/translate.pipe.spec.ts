import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate.pipe';
import { TranslateService } from './translate.service';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let translateService: TranslateService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [TranslatePipe, TranslateService]
    });

    pipe = TestBed.inject(TranslatePipe);
    translateService = TestBed.inject(TranslateService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('sollte erstellt werden', () => {
    expect(pipe).toBeTruthy();
  });

  it('sollte deutsche Übersetzung transformieren', () => {
    translateService.use('de');
    const result = pipe.transform('app.title');
    expect(result).toBe('Gottfried Schultz');
  });

  it('sollte englische Übersetzung transformieren', () => {
    translateService.use('en');
    const result = pipe.transform('app.title');
    expect(result).toBe('Gottfried Schultz');
  });

  it('sollte Accessibility-Button korrekt übersetzen (DE)', () => {
    translateService.use('de');
    const result = pipe.transform('header.accessibility.button');
    expect(result).toBe('Barrierefreiheit');
  });

  it('sollte Accessibility-Button korrekt übersetzen (EN)', () => {
    translateService.use('en');
    const result = pipe.transform('header.accessibility.button');
    expect(result).toBe('Accessibility');
  });

  it('sollte Font-Size Labels korrekt übersetzen', () => {
    translateService.use('de');
    expect(pipe.transform('header.accessibility.fontSize.small')).toBe('Klein');
    expect(pipe.transform('header.accessibility.fontSize.normal')).toBe('Normal');
    expect(pipe.transform('header.accessibility.fontSize.large')).toBe('Groß');
    expect(pipe.transform('header.accessibility.fontSize.xLarge')).toBe('Sehr groß');

    translateService.use('en');
    expect(pipe.transform('header.accessibility.fontSize.small')).toBe('Small');
    expect(pipe.transform('header.accessibility.fontSize.normal')).toBe('Normal');
    expect(pipe.transform('header.accessibility.fontSize.large')).toBe('Large');
    expect(pipe.transform('header.accessibility.fontSize.xLarge')).toBe('Extra Large');
  });
});

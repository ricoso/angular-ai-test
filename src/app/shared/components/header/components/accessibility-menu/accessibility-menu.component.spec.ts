import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AccessibilityMenuComponent } from './accessibility-menu.component';
import { FontSize } from '@shared/models/accessibility.model';

describe('AccessibilityMenuComponent', () => {
  let component: AccessibilityMenuComponent;
  let fixture: ComponentFixture<AccessibilityMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessibilityMenuComponent],
      providers: [provideAnimationsAsync('noop')]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessibilityMenuComponent);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('fontSize', 'normal');
    fixture.componentRef.setInput('highContrast', false);
    fixture.componentRef.setInput('reducedMotion', false);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should accept fontSize input', () => {
      fixture.componentRef.setInput('fontSize', 'large');
      fixture.detectChanges();
      expect(component.fontSize()).toBe('large');
    });

    it('should accept highContrast input', () => {
      fixture.componentRef.setInput('highContrast', true);
      fixture.detectChanges();
      expect(component.highContrast()).toBe(true);
    });

    it('should accept reducedMotion input', () => {
      fixture.componentRef.setInput('reducedMotion', true);
      fixture.detectChanges();
      expect(component.reducedMotion()).toBe(true);
    });
  });

  describe('Outputs', () => {
    it('should emit fontSizeChanged', () => {
      const emitSpy = jest.fn();
      component.fontSizeChanged.subscribe(emitSpy);

      component['onFontSizeChange']('x-large');

      expect(emitSpy).toHaveBeenCalledWith('x-large');
    });

    it('should emit highContrastChanged', () => {
      const emitSpy = jest.fn();
      component.highContrastChanged.subscribe(emitSpy);

      component['onHighContrastChange'](true);

      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('should emit reducedMotionChanged', () => {
      const emitSpy = jest.fn();
      component.reducedMotionChanged.subscribe(emitSpy);

      component['onReducedMotionChange'](true);

      expect(emitSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('UI Elements', () => {
    it('should render all font size options', () => {
      const radioButtons = fixture.nativeElement.querySelectorAll('mat-radio-button');
      expect(radioButtons.length).toBe(4);
    });

    it('should render toggles for high contrast and reduced motion', () => {
      const toggles = fixture.nativeElement.querySelectorAll('mat-slide-toggle');
      expect(toggles.length).toBe(2);
    });

    it('should have section heading for font size', () => {
      const heading = fixture.nativeElement.querySelector('#font-size-label');
      expect(heading).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-labelledby on radio group', () => {
      const radioGroup = fixture.nativeElement.querySelector('mat-radio-group');
      expect(radioGroup.getAttribute('aria-labelledby')).toBe('font-size-label');
    });
  });

  describe('Font size options', () => {
    it('should offer all available font sizes', () => {
      const expectedSizes: FontSize[] = ['small', 'normal', 'large', 'x-large'];
      expect(component['fontSizes']).toEqual(expectedSizes);
    });
  });
});

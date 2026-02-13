import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { ACCESSIBILITY_DEFAULTS } from '@shared/models/accessibility.model';
import { AccessibilityService } from '@shared/services/accessibility.service';
import { AccessibilityStore } from '@shared/stores/accessibility.store';
import { CartStore } from '@shared/stores/cart.store';

import { HeaderContainerComponent } from './header-container.component';

describe('HeaderContainerComponent', () => {
  let component: HeaderContainerComponent;
  let fixture: ComponentFixture<HeaderContainerComponent>;
  let accessibilityStore: InstanceType<typeof AccessibilityStore>;
  let serviceMock: jest.Mocked<AccessibilityService>;

  beforeEach(async () => {
    serviceMock = {
      getSettings: jest.fn().mockReturnValue({ ...ACCESSIBILITY_DEFAULTS }),
      saveSettings: jest.fn(),
      applyToDocument: jest.fn()
    } as unknown as jest.Mocked<AccessibilityService>;

    await TestBed.configureTestingModule({
      imports: [HeaderContainerComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync('noop'),
        AccessibilityStore,
        CartStore,
        { provide: AccessibilityService, useValue: serviceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderContainerComponent);
    component = fixture.componentInstance;
    accessibilityStore = TestBed.inject(AccessibilityStore);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should render logo link', () => {
    const logoLink = fixture.nativeElement.querySelector('.header__logo-link');
    expect(logoLink).toBeTruthy();
    expect(logoLink.getAttribute('href')).toBe('/');
  });

  it('should render accessibility button', () => {
    const a11yButton = fixture.nativeElement.querySelector('.header__a11y-button');
    expect(a11yButton).toBeTruthy();
  });

  it('should display accessibility icon', () => {
    const icon = fixture.nativeElement.querySelector('.header__a11y-button mat-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent).toContain('accessibility_new');
  });

  it('should render cart icon', () => {
    const cartIcon = fixture.nativeElement.querySelector('app-cart-icon');
    expect(cartIcon).toBeTruthy();
  });

  describe('Event Handler', () => {
    it('should delegate onFontSizeChange to store', () => {
      const setFontSizeSpy = jest.spyOn(accessibilityStore, 'setFontSize');

      component.onFontSizeChange('large');

      expect(setFontSizeSpy).toHaveBeenCalledWith('large');
    });

    it('should delegate onHighContrastChange to store', () => {
      const setHighContrastSpy = jest.spyOn(accessibilityStore, 'setHighContrast');

      component.onHighContrastChange(true);

      expect(setHighContrastSpy).toHaveBeenCalledWith(true);
    });

    it('should delegate onReducedMotionChange to store', () => {
      const setReducedMotionSpy = jest.spyOn(accessibilityStore, 'setReducedMotion');

      component.onReducedMotionChange(true);

      expect(setReducedMotionSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on accessibility button', () => {
      const a11yButton = fixture.nativeElement.querySelector('.header__a11y-button');
      expect(a11yButton.getAttribute('aria-label')).toBeTruthy();
    });

    it('should have role="banner" on header', () => {
      const header = fixture.nativeElement.querySelector('.header');
      expect(header.getAttribute('role')).toBe('banner');
    });
  });
});

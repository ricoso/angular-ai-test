import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ACCESSIBILITY_DEFAULTS } from '@shared/models/accessibility.model';
import { AccessibilityService } from '@shared/services/accessibility.service';
import { AccessibilityStore } from '@shared/stores/accessibility.store';
import { CartStore } from '@shared/stores/cart.store';

import { HeaderContainerComponent } from './header-container.component';

// UI rendering is verified via E2E (Playwright) — unit tests focus on logic only
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
        AccessibilityStore,
        CartStore,
        { provide: AccessibilityService, useValue: serviceMock }
      ]
    })
      .overrideComponent(HeaderContainerComponent, {
        set: { template: '<div class="mocked">Mocked Header</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderContainerComponent);
    component = fixture.componentInstance;
    accessibilityStore = TestBed.inject(AccessibilityStore);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should inject AccessibilityStore', () => {
    expect(accessibilityStore).toBeTruthy();
  });

  it('should inject CartStore', () => {
    const cartStore = TestBed.inject(CartStore);
    expect(cartStore).toBeTruthy();
  });

  describe('Event Handler', () => {
    it('should delegate onFontSizeChange to store', () => {
      const setFontSizeSpy = jest.spyOn(accessibilityStore, 'setFontSize');
      const exposed = component as unknown as { onFontSizeChange: (size: string) => void };

      exposed.onFontSizeChange('large');

      expect(setFontSizeSpy).toHaveBeenCalledWith('large');
    });

    it('should delegate onHighContrastChange to store', () => {
      const setHighContrastSpy = jest.spyOn(accessibilityStore, 'setHighContrast');
      const exposed = component as unknown as { onHighContrastChange: (value: boolean) => void };

      exposed.onHighContrastChange(true);

      expect(setHighContrastSpy).toHaveBeenCalledWith(true);
    });

    it('should delegate onReducedMotionChange to store', () => {
      const setReducedMotionSpy = jest.spyOn(accessibilityStore, 'setReducedMotion');
      const exposed = component as unknown as { onReducedMotionChange: (value: boolean) => void };

      exposed.onReducedMotionChange(true);

      expect(setReducedMotionSpy).toHaveBeenCalledWith(true);
    });
  });
});

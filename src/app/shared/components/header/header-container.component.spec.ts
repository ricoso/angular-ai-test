import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LOCATIONS_BY_BRAND } from '@app/features/booking/models/location.model';
import { BookingApiService } from '@app/features/booking/services/booking-api.service';
import { BookingStore } from '@app/features/booking/stores/booking.store';
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
  let bookingStore: InstanceType<typeof BookingStore>;
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
        BookingStore,
        { provide: AccessibilityService, useValue: serviceMock },
        {
          provide: BookingApiService,
          useValue: {
            getBrands: jest.fn().mockResolvedValue([]),
            getLocations: jest.fn().mockResolvedValue([]),
            getServices: jest.fn().mockResolvedValue([])
          }
        }
      ]
    })
      .overrideComponent(HeaderContainerComponent, {
        set: { template: '<div class="mocked">Mocked Header</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderContainerComponent);
    component = fixture.componentInstance;
    accessibilityStore = TestBed.inject(AccessibilityStore);
    bookingStore = TestBed.inject(BookingStore);
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

  describe('Cart computed signals', () => {
    it('should return null for selectedBrandName when no brand selected', () => {
      const exposed = component as unknown as { selectedBrandName: () => string | null };
      expect(exposed.selectedBrandName()).toBeNull();
    });

    it('should return capitalized brand name when brand is selected', () => {
      bookingStore.setBrand('audi');
      const exposed = component as unknown as { selectedBrandName: () => string | null };
      expect(exposed.selectedBrandName()).toBe('Audi');
    });

    it('should return null for selectedLocationName when no location selected', () => {
      const exposed = component as unknown as { selectedLocationName: () => string | null };
      expect(exposed.selectedLocationName()).toBeNull();
    });

    it('should return location name when location is selected', () => {
      bookingStore.setBrand('audi');
      bookingStore.setLocation(LOCATIONS_BY_BRAND.audi[0]);
      const exposed = component as unknown as { selectedLocationName: () => string | null };
      expect(exposed.selectedLocationName()).toBe(LOCATIONS_BY_BRAND.audi[0].name);
    });

    it('should return empty array for cartServiceChips when no services selected', () => {
      const exposed = component as unknown as { cartServiceChips: () => unknown[] };
      expect(exposed.cartServiceChips()).toEqual([]);
    });

    it('should return service chips with title and icon when services selected', () => {
      bookingStore.toggleService('huau');
      const exposed = component as unknown as { cartServiceChips: () => { title: string; icon: string; variantLabel: string | null }[] };
      const chips = exposed.cartServiceChips();
      expect(chips).toHaveLength(1);
      expect(chips[0].title).toBeTruthy();
      expect(chips[0].icon).toBe('verified');
      expect(chips[0].variantLabel).toBeNull();
    });

    it('should return variant label for tire change with variant', () => {
      bookingStore.confirmTireChange('with-storage');
      const exposed = component as unknown as { cartServiceChips: () => { title: string; icon: string; variantLabel: string | null }[] };
      const chips = exposed.cartServiceChips();
      expect(chips).toHaveLength(1);
      expect(chips[0].icon).toBe('tire_repair');
      expect(chips[0].variantLabel).toBeTruthy();
    });

    it('should return summary text with count', () => {
      bookingStore.toggleService('huau');
      bookingStore.toggleService('inspection');
      const exposed = component as unknown as { cartSummaryText: () => string };
      const text = exposed.cartSummaryText();
      expect(text).toContain('2');
    });
  });
});

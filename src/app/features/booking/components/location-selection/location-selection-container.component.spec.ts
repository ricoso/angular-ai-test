import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AVAILABLE_BRANDS } from '../../models/brand.model';
import { LOCATIONS_BY_BRAND } from '../../models/location.model';
import { BookingApiService } from '../../services/booking-api.service';
import { BookingStore } from '../../stores/booking.store';

import { LocationSelectionContainerComponent } from './location-selection-container.component';

// UI rendering is verified via E2E (Playwright) — unit tests focus on logic only
describe('LocationSelectionContainerComponent', () => {
  let component: LocationSelectionContainerComponent;
  let fixture: ComponentFixture<LocationSelectionContainerComponent>;
  let router: jest.Mocked<Router>;
  let store: InstanceType<typeof BookingStore>;

  beforeEach(async () => {
    router = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [LocationSelectionContainerComponent],
      providers: [
        BookingStore,
        {
          provide: BookingApiService,
          useValue: {
            getBrands: jest.fn().mockResolvedValue(AVAILABLE_BRANDS),
            getLocations: jest.fn().mockResolvedValue(LOCATIONS_BY_BRAND.audi)
          }
        },
        { provide: Router, useValue: router }
      ]
    })
      .overrideComponent(LocationSelectionContainerComponent, {
        set: { template: '<div class="mocked">Mocked Location Selection</div>' }
      })
      .compileComponents();

    store = TestBed.inject(BookingStore);
    fixture = TestBed.createComponent(LocationSelectionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject BookingStore', () => {
    expect(store).toBeTruthy();
  });

  describe('Location Selection', () => {
    it('should set location in store and navigate on selection', () => {
      const testLocation = LOCATIONS_BY_BRAND.audi[0];
      const exposed = component as unknown as {
        onLocationSelect: (location: { id: string; name: string; city: string }) => void;
      };
      exposed.onLocationSelect(testLocation);

      expect(store.selectedLocation()).toEqual(testLocation);
      expect(router.navigate).toHaveBeenCalledWith(['/home/services']);
    });

    it('should navigate to services route after selection', () => {
      const testLocation = LOCATIONS_BY_BRAND.audi[2];
      const exposed = component as unknown as {
        onLocationSelect: (location: { id: string; name: string; city: string }) => void;
      };
      exposed.onLocationSelect(testLocation);

      expect(store.selectedLocation()).toEqual(testLocation);
      expect(router.navigate).toHaveBeenCalledWith(['/home/services']);
    });
  });

  describe('Back Navigation', () => {
    it('should navigate to brand selection on back', () => {
      const exposed = component as unknown as { onBack: () => void };
      exposed.onBack();

      expect(router.navigate).toHaveBeenCalledWith(['/home/brand']);
    });
  });
});

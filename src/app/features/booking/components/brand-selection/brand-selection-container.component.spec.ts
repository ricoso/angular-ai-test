import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AVAILABLE_BRANDS } from '../../models/brand.model';
import { BookingApiService } from '../../services/booking-api.service';
import { BookingStore } from '../../stores/booking.store';

import { BrandSelectionContainerComponent } from './brand-selection-container.component';

// UI rendering is verified via E2E (Playwright) — unit tests focus on logic only
describe('BrandSelectionContainerComponent', () => {
  let component: BrandSelectionContainerComponent;
  let fixture: ComponentFixture<BrandSelectionContainerComponent>;
  let router: jest.Mocked<Router>;
  let store: InstanceType<typeof BookingStore>;

  beforeEach(async () => {
    router = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [BrandSelectionContainerComponent],
      providers: [
        BookingStore,
        { provide: BookingApiService, useValue: { getBrands: jest.fn().mockResolvedValue(AVAILABLE_BRANDS) } },
        { provide: Router, useValue: router }
      ]
    })
      .overrideComponent(BrandSelectionContainerComponent, {
        set: { template: '<div class="mocked">Mocked Brand Selection</div>' }
      })
      .compileComponents();

    store = TestBed.inject(BookingStore);
    fixture = TestBed.createComponent(BrandSelectionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject BookingStore', () => {
    expect(store).toBeTruthy();
  });

  describe('Brand Selection', () => {
    it('should set brand in store and navigate on selection', () => {
      const exposed = component as unknown as { onBrandSelect: (b: string) => void };
      exposed.onBrandSelect('audi');

      expect(store.selectedBrand()).toBe('audi');
      expect(router.navigate).toHaveBeenCalledWith(['/home/location']);
    });

    it('should navigate to location route', () => {
      const exposed = component as unknown as { onBrandSelect: (b: string) => void };
      exposed.onBrandSelect('bmw');

      expect(store.selectedBrand()).toBe('bmw');
      expect(router.navigate).toHaveBeenCalledWith(['/home/location']);
    });
  });

  describe('Back Navigation', () => {
    it('should navigate to home on back', () => {
      const exposed = component as unknown as { onBack: () => void };
      exposed.onBack();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});

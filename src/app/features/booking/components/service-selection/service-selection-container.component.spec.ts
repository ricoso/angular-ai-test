import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AVAILABLE_BRANDS } from '../../models/brand.model';
import { LOCATIONS_BY_BRAND } from '../../models/location.model';
import { AVAILABLE_SERVICES } from '../../models/service.model';
import { BookingApiService } from '../../services/booking-api.service';
import { BookingStore } from '../../stores/booking.store';

import { ServiceSelectionContainerComponent } from './service-selection-container.component';

describe('ServiceSelectionContainerComponent', () => {
  let component: ServiceSelectionContainerComponent;
  let fixture: ComponentFixture<ServiceSelectionContainerComponent>;
  let router: jest.Mocked<Router>;
  let store: InstanceType<typeof BookingStore>;

  beforeEach(async () => {
    router = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ServiceSelectionContainerComponent],
      providers: [
        BookingStore,
        {
          provide: BookingApiService,
          useValue: {
            getBrands: jest.fn().mockResolvedValue(AVAILABLE_BRANDS),
            getLocations: jest.fn().mockResolvedValue(LOCATIONS_BY_BRAND.audi),
            getServices: jest.fn().mockResolvedValue(AVAILABLE_SERVICES)
          }
        },
        { provide: Router, useValue: router }
      ]
    })
      .overrideComponent(ServiceSelectionContainerComponent, {
        set: { template: '<div class="mocked">Mocked Service Selection</div>' }
      })
      .compileComponents();

    store = TestBed.inject(BookingStore);
    fixture = TestBed.createComponent(ServiceSelectionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject BookingStore', () => {
    expect(store).toBeTruthy();
  });

  describe('Computed Signals', () => {
    it('should compute empty selectedServiceIds initially', () => {
      const exposed = component as unknown as { selectedServiceIds: () => string[] };
      expect(exposed.selectedServiceIds()).toEqual([]);
    });

    it('should compute selectedServiceIds after selecting services', () => {
      store.toggleService('huau');
      store.toggleService('inspection');
      const exposed = component as unknown as { selectedServiceIds: () => string[] };
      expect(exposed.selectedServiceIds()).toEqual(['huau', 'inspection']);
    });

    it('should compute tireChangeVariantId as null initially', () => {
      const exposed = component as unknown as { tireChangeVariantId: () => string | null };
      expect(exposed.tireChangeVariantId()).toBeNull();
    });

    it('should compute tireChangeVariantId after confirming tire change', () => {
      store.confirmTireChange('with-storage');
      const exposed = component as unknown as { tireChangeVariantId: () => string | null };
      expect(exposed.tireChangeVariantId()).toBe('with-storage');
    });

    it('should return null tireChangeVariantId when tire change not selected', () => {
      store.toggleService('huau');
      const exposed = component as unknown as { tireChangeVariantId: () => string | null };
      expect(exposed.tireChangeVariantId()).toBeNull();
    });
  });

  describe('Service Click', () => {
    it('should toggle service in store on click', () => {
      const exposed = component as unknown as {
        onServiceClick: (serviceId: 'huau' | 'inspection' | 'tire-change') => void;
      };
      exposed.onServiceClick('huau');
      expect(store.selectedServices()).toEqual([{ serviceId: 'huau', selectedVariantId: null }]);
    });

    it('should deselect service on second click', () => {
      const exposed = component as unknown as {
        onServiceClick: (serviceId: 'huau' | 'inspection' | 'tire-change') => void;
      };
      exposed.onServiceClick('huau');
      exposed.onServiceClick('huau');
      expect(store.selectedServices()).toEqual([]);
    });

    it('should support multi-select', () => {
      const exposed = component as unknown as {
        onServiceClick: (serviceId: 'huau' | 'inspection' | 'tire-change') => void;
      };
      exposed.onServiceClick('huau');
      exposed.onServiceClick('inspection');
      expect(store.selectedServices()).toHaveLength(2);
    });
  });

  describe('Tire Change', () => {
    it('should confirm tire change with variant', () => {
      const exposed = component as unknown as {
        onTireChangeConfirm: (variantId: string) => void;
      };
      exposed.onTireChangeConfirm('without-storage');
      expect(store.selectedServices()).toEqual([
        { serviceId: 'tire-change', selectedVariantId: 'without-storage' }
      ]);
    });

    it('should deselect tire change', () => {
      const exposed = component as unknown as {
        onTireChangeConfirm: (variantId: string) => void;
        onTireChangeDeselect: () => void;
      };
      exposed.onTireChangeConfirm('without-storage');
      exposed.onTireChangeDeselect();
      expect(store.selectedServices()).toEqual([]);
    });

    it('should switch variant on re-confirm', () => {
      const exposed = component as unknown as {
        onTireChangeConfirm: (variantId: string) => void;
      };
      exposed.onTireChangeConfirm('without-storage');
      exposed.onTireChangeConfirm('with-storage');
      expect(store.selectedServices()).toEqual([
        { serviceId: 'tire-change', selectedVariantId: 'with-storage' }
      ]);
    });
  });

  describe('Navigation', () => {
    it('should navigate forward on continue', () => {
      const exposed = component as unknown as { onContinue: () => void };
      exposed.onContinue();
      expect(router.navigate).toHaveBeenCalledWith(['/home/services']);
    });

    it('should navigate back and clear services on back', () => {
      const exposed = component as unknown as {
        onServiceClick: (serviceId: 'huau' | 'inspection' | 'tire-change') => void;
        onBack: () => void;
      };
      exposed.onServiceClick('huau');
      exposed.onBack();
      expect(store.selectedServices()).toEqual([]);
      expect(router.navigate).toHaveBeenCalledWith(['/home/location']);
    });
  });
});

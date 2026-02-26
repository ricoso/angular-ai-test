import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AVAILABLE_BRANDS } from '../../models/brand.model';
import { LOCATIONS_BY_BRAND } from '../../models/location.model';
import { AVAILABLE_SERVICES } from '../../models/service.model';
import { BookingApiService } from '../../services/booking-api.service';
import { BookingStore } from '../../stores/booking.store';

import { NotesContainerComponent } from './notes-container.component';

describe('NotesContainerComponent', () => {
  let component: NotesContainerComponent;
  let fixture: ComponentFixture<NotesContainerComponent>;
  let router: jest.Mocked<Router>;
  let store: InstanceType<typeof BookingStore>;

  beforeEach(async () => {
    router = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [NotesContainerComponent],
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
      .overrideComponent(NotesContainerComponent, {
        set: { template: '<div class="mocked">Mocked Notes Container</div>' }
      })
      .compileComponents();

    store = TestBed.inject(BookingStore);
    fixture = TestBed.createComponent(NotesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject BookingStore', () => {
    expect(store).toBeTruthy();
  });

  describe('Store Signals', () => {
    it('should expose selectedServices from store', () => {
      const exposed = component as unknown as { selectedServices: () => unknown[] };
      expect(exposed.selectedServices()).toEqual([]);
    });

    it('should expose initialNote from store', () => {
      const exposed = component as unknown as { initialNote: () => string | null };
      expect(exposed.initialNote()).toBeNull();
    });

    it('should expose currentNote as null initially', () => {
      const exposed = component as unknown as { currentNote: () => string | null };
      expect(exposed.currentNote()).toBeNull();
    });
  });

  describe('onNoteChanged', () => {
    it('should update currentNote when note changes', () => {
      const exposed = component as unknown as {
        onNoteChanged: (note: string | null) => void;
        currentNote: () => string | null;
      };
      exposed.onNoteChanged('Test note');
      expect(exposed.currentNote()).toBe('Test note');
    });

    it('should handle null note', () => {
      const exposed = component as unknown as {
        onNoteChanged: (note: string | null) => void;
        currentNote: () => string | null;
      };
      exposed.onNoteChanged(null);
      expect(exposed.currentNote()).toBeNull();
    });
  });

  describe('onContinue', () => {
    it('should save note to store and navigate', () => {
      const exposed = component as unknown as {
        onNoteChanged: (note: string | null) => void;
        onContinue: () => void;
      };
      exposed.onNoteChanged('Bitte Öl prüfen.');
      exposed.onContinue();
      expect(store.bookingNote()).toBe('Bitte Öl prüfen.');
      expect(router.navigate).toHaveBeenCalledWith(['/home/appointment']);
    });

    it('should save null when note is empty', () => {
      const exposed = component as unknown as {
        onNoteChanged: (note: string | null) => void;
        onContinue: () => void;
      };
      exposed.onNoteChanged('');
      exposed.onContinue();
      expect(store.bookingNote()).toBeNull();
    });

    it('should save null when note is whitespace only', () => {
      const exposed = component as unknown as {
        onNoteChanged: (note: string | null) => void;
        onContinue: () => void;
      };
      exposed.onNoteChanged('   ');
      exposed.onContinue();
      expect(store.bookingNote()).toBeNull();
    });

    it('should trim note before saving', () => {
      const exposed = component as unknown as {
        onNoteChanged: (note: string | null) => void;
        onContinue: () => void;
      };
      exposed.onNoteChanged('  Test note  ');
      exposed.onContinue();
      expect(store.bookingNote()).toBe('Test note');
    });

    it('should save null when no note provided', () => {
      const exposed = component as unknown as { onContinue: () => void };
      exposed.onContinue();
      expect(store.bookingNote()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/home/appointment']);
    });
  });

  describe('onBack', () => {
    it('should navigate to services page', () => {
      const exposed = component as unknown as { onBack: () => void };
      exposed.onBack();
      expect(router.navigate).toHaveBeenCalledWith(['/home/services']);
    });

    it('should clear booking note in store before navigating back', () => {
      store.setBookingNote('Test note');
      expect(store.bookingNote()).toBe('Test note');

      const exposed = component as unknown as { onBack: () => void };
      exposed.onBack();

      expect(store.bookingNote()).toBeNull();
      expect(store.hasBookingNote()).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/home/services']);
    });

    it('should handle back when booking note is already null', () => {
      expect(store.bookingNote()).toBeNull();

      const exposed = component as unknown as { onBack: () => void };
      exposed.onBack();

      expect(store.bookingNote()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/home/services']);
    });
  });

  describe('Store Integration', () => {
    it('should reflect selectedServices after store changes', () => {
      const exposed = component as unknown as { selectedServices: () => unknown[] };
      store.toggleService('huau');
      expect(exposed.selectedServices()).toHaveLength(1);
    });

    it('should reflect bookingNote from store', () => {
      const exposed = component as unknown as { initialNote: () => string | null };
      store.setBookingNote('Previous note');
      expect(exposed.initialNote()).toBe('Previous note');
    });
  });
});

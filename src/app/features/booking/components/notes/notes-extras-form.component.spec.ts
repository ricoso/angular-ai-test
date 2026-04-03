import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { NotesExtras } from '../../models/notes-extras.model';

import { NotesExtrasFormComponent } from './notes-extras-form.component';

describe('NotesExtrasFormComponent', () => {
  let component: NotesExtrasFormComponent;
  let fixture: ComponentFixture<NotesExtrasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesExtrasFormComponent]
    })
      .overrideComponent(NotesExtrasFormComponent, {
        set: { template: '<div class="mocked">Mocked Extras Form</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(NotesExtrasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default State', () => {
    it('should have default mobility option', () => {
      const exposed = component as unknown as { mobilityOption: () => string };
      expect(exposed.mobilityOption()).toBe('none');
    });

    it('should have default appointment preference', () => {
      const exposed = component as unknown as { appointmentPreference: () => string };
      expect(exposed.appointmentPreference()).toBe('anytime');
    });

    it('should have default callback option', () => {
      const exposed = component as unknown as { callbackOption: () => string };
      expect(exposed.callbackOption()).toBe('none');
    });
  });

  describe('Initial Extras Input', () => {
    it('should apply initial extras when provided', () => {
      const extras: NotesExtras = {
        mobilityOption: 'mid-range',
        appointmentPreference: 'morning',
        callbackOption: 'yes'
      };
      fixture.componentRef.setInput('initialExtras', extras);
      fixture.detectChanges();

      const exposed = component as unknown as {
        mobilityOption: () => string;
        appointmentPreference: () => string;
        callbackOption: () => string;
      };
      expect(exposed.mobilityOption()).toBe('mid-range');
      expect(exposed.appointmentPreference()).toBe('morning');
      expect(exposed.callbackOption()).toBe('yes');
    });

    it('should keep defaults when initialExtras is null', () => {
      fixture.componentRef.setInput('initialExtras', null);
      fixture.detectChanges();

      const exposed = component as unknown as {
        mobilityOption: () => string;
        appointmentPreference: () => string;
        callbackOption: () => string;
      };
      expect(exposed.mobilityOption()).toBe('none');
      expect(exposed.appointmentPreference()).toBe('anytime');
      expect(exposed.callbackOption()).toBe('none');
    });
  });

  describe('onMobilityOptionChange', () => {
    it('should update mobility option and emit extras', () => {
      const spy = jest.fn();
      component.extrasChanged.subscribe(spy);

      const exposed = component as unknown as {
        onMobilityOptionChange: (value: string) => void;
        mobilityOption: () => string;
      };
      exposed.onMobilityOptionChange('luxury');

      expect(exposed.mobilityOption()).toBe('luxury');
      expect(spy).toHaveBeenCalledWith({
        mobilityOption: 'luxury',
        appointmentPreference: 'anytime',
        callbackOption: 'none'
      });
    });
  });

  describe('onAppointmentPreferenceChange', () => {
    it('should update appointment preference and emit extras', () => {
      const spy = jest.fn();
      component.extrasChanged.subscribe(spy);

      const exposed = component as unknown as {
        onAppointmentPreferenceChange: (value: string) => void;
        appointmentPreference: () => string;
      };
      exposed.onAppointmentPreferenceChange('afternoon');

      expect(exposed.appointmentPreference()).toBe('afternoon');
      expect(spy).toHaveBeenCalledWith({
        mobilityOption: 'none',
        appointmentPreference: 'afternoon',
        callbackOption: 'none'
      });
    });
  });

  describe('onCallbackOptionChange', () => {
    it('should update callback option and emit extras', () => {
      const spy = jest.fn();
      component.extrasChanged.subscribe(spy);

      const exposed = component as unknown as {
        onCallbackOptionChange: (value: string) => void;
        callbackOption: () => string;
      };
      exposed.onCallbackOptionChange('yes');

      expect(exposed.callbackOption()).toBe('yes');
      expect(spy).toHaveBeenCalledWith({
        mobilityOption: 'none',
        appointmentPreference: 'anytime',
        callbackOption: 'yes'
      });
    });
  });

  describe('Combined Changes', () => {
    it('should emit correct extras after multiple changes', () => {
      const spy = jest.fn();
      component.extrasChanged.subscribe(spy);

      const exposed = component as unknown as {
        onMobilityOptionChange: (value: string) => void;
        onAppointmentPreferenceChange: (value: string) => void;
        onCallbackOptionChange: (value: string) => void;
      };

      exposed.onMobilityOptionChange('compact-car');
      exposed.onAppointmentPreferenceChange('morning');
      exposed.onCallbackOptionChange('yes');

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenLastCalledWith({
        mobilityOption: 'compact-car',
        appointmentPreference: 'morning',
        callbackOption: 'yes'
      });
    });
  });

  describe('Option Items', () => {
    it('should have 4 mobility option items', () => {
      const exposed = component as unknown as { mobilityOptionItems: () => { value: string; label: string }[] };
      expect(exposed.mobilityOptionItems()).toHaveLength(4);
      expect(exposed.mobilityOptionItems().map(i => i.value)).toEqual(['none', 'compact-car', 'mid-range', 'luxury']);
    });

    it('should have 3 appointment option items', () => {
      const exposed = component as unknown as { appointmentOptionItems: () => { value: string; label: string }[] };
      expect(exposed.appointmentOptionItems()).toHaveLength(3);
      expect(exposed.appointmentOptionItems().map(i => i.value)).toEqual(['anytime', 'morning', 'afternoon']);
    });

    it('should have 2 callback option items', () => {
      const exposed = component as unknown as { callbackOptionItems: () => { value: string; label: string }[] };
      expect(exposed.callbackOptionItems()).toHaveLength(2);
      expect(exposed.callbackOptionItems().map(i => i.value)).toEqual(['none', 'yes']);
    });
  });
});

import type { AppointmentPreference, CallbackOption, MobilityOption, NotesExtras } from './notes-extras.model';
import { DEFAULT_NOTES_EXTRAS } from './notes-extras.model';

describe('NotesExtras Model', () => {
  describe('DEFAULT_NOTES_EXTRAS', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_NOTES_EXTRAS).toEqual({
        mobilityOption: 'none',
        appointmentPreference: 'anytime',
        callbackOption: 'none'
      });
    });
  });

  describe('Type Safety', () => {
    it('should allow valid MobilityOption values', () => {
      const values: MobilityOption[] = ['none', 'compact-car', 'mid-range', 'luxury'];
      expect(values).toHaveLength(4);
    });

    it('should allow valid AppointmentPreference values', () => {
      const values: AppointmentPreference[] = ['anytime', 'morning', 'afternoon'];
      expect(values).toHaveLength(3);
    });

    it('should allow valid CallbackOption values', () => {
      const values: CallbackOption[] = ['none', 'yes'];
      expect(values).toHaveLength(2);
    });

    it('should create a valid NotesExtras object', () => {
      const extras: NotesExtras = {
        mobilityOption: 'mid-range',
        appointmentPreference: 'morning',
        callbackOption: 'yes'
      };
      expect(extras.mobilityOption).toBe('mid-range');
      expect(extras.appointmentPreference).toBe('morning');
      expect(extras.callbackOption).toBe('yes');
    });
  });
});

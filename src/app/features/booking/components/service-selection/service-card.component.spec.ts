import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { AVAILABLE_SERVICES } from '../../models/service.model';

import { ServiceCardComponent } from './service-card.component';

describe('ServiceCardComponent', () => {
  let component: ServiceCardComponent;
  let fixture: ComponentFixture<ServiceCardComponent>;

  const huauService = AVAILABLE_SERVICES[0];
  const tireChangeService = AVAILABLE_SERVICES[2];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCardComponent]
    })
      .overrideComponent(ServiceCardComponent, {
        set: { template: '<div class="mocked">Mocked Service Card</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ServiceCardComponent);
    component = fixture.componentInstance;
  });

  describe('Simple service (HU/AU)', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('service', huauService);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should emit serviceClicked on card click', () => {
      const spy = jest.fn();
      component.serviceClicked.subscribe(spy);
      const exposed = component as unknown as { onCardClick: () => void };
      exposed.onCardClick();
      expect(spy).toHaveBeenCalledWith('huau');
    });

    it('should not have tire change variants', () => {
      const exposed = component as unknown as { hasTireChangeVariants: () => boolean };
      expect(exposed.hasTireChangeVariants()).toBe(false);
    });

    it('should not show confirm button for non-variant service', () => {
      const exposed = component as unknown as { showConfirmButton: () => boolean };
      expect(exposed.showConfirmButton()).toBe(false);
    });

    it('should not show deselect button for non-variant service', () => {
      const exposed = component as unknown as { showDeselectButton: () => boolean };
      expect(exposed.showDeselectButton()).toBe(false);
    });

    it('should have isTireChangeSelected as false', () => {
      const exposed = component as unknown as { isTireChangeSelected: () => boolean };
      expect(exposed.isTireChangeSelected()).toBe(false);
    });

    it('should have confirmedVariantId as null', () => {
      const exposed = component as unknown as { confirmedVariantId: () => string | null };
      expect(exposed.confirmedVariantId()).toBeNull();
    });

    it('should have hasVariantChanged as false when no confirmed or selected', () => {
      const exposed = component as unknown as { hasVariantChanged: () => boolean };
      expect(exposed.hasVariantChanged()).toBe(false);
    });
  });

  describe('Tire change service — not selected', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('service', tireChangeService);
      fixture.componentRef.setInput('isSelected', false);
      fixture.detectChanges();
    });

    it('should have tire change variants', () => {
      const exposed = component as unknown as { hasTireChangeVariants: () => boolean };
      expect(exposed.hasTireChangeVariants()).toBe(true);
    });

    it('should not emit serviceClicked on card click for tire change', () => {
      const spy = jest.fn();
      component.serviceClicked.subscribe(spy);
      const exposed = component as unknown as { onCardClick: () => void };
      exposed.onCardClick();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should show confirm button when not selected', () => {
      const exposed = component as unknown as { showConfirmButton: () => boolean };
      expect(exposed.showConfirmButton()).toBe(true);
    });

    it('should not show deselect button when not selected', () => {
      const exposed = component as unknown as { showDeselectButton: () => boolean };
      expect(exposed.showDeselectButton()).toBe(false);
    });

    it('should track radio variant selection', () => {
      const exposed = component as unknown as {
        onRadioChange: (variantId: string) => void;
        selectedRadioVariant: () => string | null;
      };
      exposed.onRadioChange('without-storage');
      expect(exposed.selectedRadioVariant()).toBe('without-storage');
    });

    it('should emit tireChangeConfirmed on confirm', () => {
      const spy = jest.fn();
      component.tireChangeConfirmed.subscribe(spy);
      const exposed = component as unknown as {
        onRadioChange: (variantId: string) => void;
        onConfirm: () => void;
      };
      exposed.onRadioChange('with-storage');
      exposed.onConfirm();
      expect(spy).toHaveBeenCalledWith('with-storage');
    });

    it('should not emit tireChangeConfirmed if no variant selected', () => {
      const spy = jest.fn();
      component.tireChangeConfirmed.subscribe(spy);
      const exposed = component as unknown as { onConfirm: () => void };
      exposed.onConfirm();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Tire change service — selected with variant', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('service', tireChangeService);
      fixture.componentRef.setInput('isSelected', true);
      fixture.componentRef.setInput('tireChangeVariantId', 'without-storage');
      fixture.detectChanges();
    });

    it('should have isTireChangeSelected as true', () => {
      const exposed = component as unknown as { isTireChangeSelected: () => boolean };
      expect(exposed.isTireChangeSelected()).toBe(true);
    });

    it('should have confirmedVariantId matching input', () => {
      const exposed = component as unknown as { confirmedVariantId: () => string | null };
      expect(exposed.confirmedVariantId()).toBe('without-storage');
    });

    it('should show deselect button when selected and no variant change', () => {
      const exposed = component as unknown as { showDeselectButton: () => boolean };
      expect(exposed.showDeselectButton()).toBe(true);
    });

    it('should not show confirm button when selected and no variant change', () => {
      const exposed = component as unknown as { showConfirmButton: () => boolean };
      expect(exposed.showConfirmButton()).toBe(false);
    });

    it('should detect variant change when radio differs from confirmed', () => {
      const exposed = component as unknown as {
        onRadioChange: (variantId: string) => void;
        hasVariantChanged: () => boolean;
        showConfirmButton: () => boolean;
        showDeselectButton: () => boolean;
      };
      exposed.onRadioChange('with-storage');
      expect(exposed.hasVariantChanged()).toBe(true);
      expect(exposed.showConfirmButton()).toBe(true);
      expect(exposed.showDeselectButton()).toBe(false);
    });

    it('should not detect variant change when radio matches confirmed', () => {
      const exposed = component as unknown as {
        onRadioChange: (variantId: string) => void;
        hasVariantChanged: () => boolean;
      };
      exposed.onRadioChange('without-storage');
      expect(exposed.hasVariantChanged()).toBe(false);
    });

    it('should emit tireChangeDeselected and reset radio on deselect', () => {
      const spy = jest.fn();
      component.tireChangeDeselected.subscribe(spy);
      const exposed = component as unknown as {
        onRadioChange: (variantId: string) => void;
        onDeselect: () => void;
        selectedRadioVariant: () => string | null;
      };
      exposed.onRadioChange('without-storage');
      exposed.onDeselect();
      expect(spy).toHaveBeenCalled();
      expect(exposed.selectedRadioVariant()).toBeNull();
    });
  });
});

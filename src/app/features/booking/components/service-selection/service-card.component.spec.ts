import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { AVAILABLE_SERVICES } from '../../models/service.model';

import { ServiceCardComponent } from './service-card.component';

describe('ServiceCardComponent', () => {
  let component: ServiceCardComponent;
  let fixture: ComponentFixture<ServiceCardComponent>;

  const brakeFluidService = AVAILABLE_SERVICES[2]; // brake-fluid — no options
  const tireChangeService = AVAILABLE_SERVICES[3]; // tire-change — has options

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

  describe('Simple service (brake-fluid, no options)', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('service', brakeFluidService);
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
      expect(spy).toHaveBeenCalledWith('brake-fluid');
    });

    it('should not have options', () => {
      const exposed = component as unknown as { hasOptions: () => boolean };
      expect(exposed.hasOptions()).toBe(false);
    });

    it('should not show confirm button for non-option service', () => {
      const exposed = component as unknown as { showConfirmButton: () => boolean };
      expect(exposed.showConfirmButton()).toBe(false);
    });

    it('should not show deselect button for non-option service', () => {
      const exposed = component as unknown as { showDeselectButton: () => boolean };
      expect(exposed.showDeselectButton()).toBe(false);
    });

    it('should have hasOptionsChanged as false when no confirmed or selected', () => {
      const exposed = component as unknown as { hasOptionsChanged: () => boolean };
      expect(exposed.hasOptionsChanged()).toBe(false);
    });
  });

  describe('Service with options — not selected', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('service', tireChangeService);
      fixture.componentRef.setInput('isSelected', false);
      fixture.detectChanges();
    });

    it('should have options', () => {
      const exposed = component as unknown as { hasOptions: () => boolean };
      expect(exposed.hasOptions()).toBe(true);
    });

    it('should toggle isExpanded on card click for service with options', () => {
      const exposed = component as unknown as {
        onCardClick: () => void;
        isExpanded: () => boolean;
      };
      expect(exposed.isExpanded()).toBe(false);
      exposed.onCardClick();
      expect(exposed.isExpanded()).toBe(true);
      exposed.onCardClick();
      expect(exposed.isExpanded()).toBe(false);
    });

    it('should not emit serviceClicked on card click for service with options', () => {
      const spy = jest.fn();
      component.serviceClicked.subscribe(spy);
      const exposed = component as unknown as { onCardClick: () => void };
      exposed.onCardClick();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should show confirm button when expanded and not selected', () => {
      const exposed = component as unknown as {
        onCardClick: () => void;
        showConfirmButton: () => boolean;
      };
      exposed.onCardClick(); // expand
      expect(exposed.showConfirmButton()).toBe(true);
    });

    it('should not show confirm button when collapsed', () => {
      const exposed = component as unknown as { showConfirmButton: () => boolean };
      expect(exposed.showConfirmButton()).toBe(false);
    });

    it('should not show deselect button when not selected', () => {
      const exposed = component as unknown as { showDeselectButton: () => boolean };
      expect(exposed.showDeselectButton()).toBe(false);
    });

    it('should track checkbox option selection', () => {
      const exposed = component as unknown as {
        onCheckboxChange: (optionId: string, checked: boolean) => void;
        selectedCheckboxOptions: () => Set<string>;
      };
      exposed.onCheckboxChange('bring-own-tires', true);
      expect(exposed.selectedCheckboxOptions().has('bring-own-tires')).toBe(true);
    });

    it('should untrack checkbox option on deselection', () => {
      const exposed = component as unknown as {
        onCheckboxChange: (optionId: string, checked: boolean) => void;
        selectedCheckboxOptions: () => Set<string>;
      };
      exposed.onCheckboxChange('bring-own-tires', true);
      exposed.onCheckboxChange('bring-own-tires', false);
      expect(exposed.selectedCheckboxOptions().has('bring-own-tires')).toBe(false);
    });

    it('should emit serviceConfirmed on confirm', () => {
      const spy = jest.fn();
      component.serviceConfirmed.subscribe(spy);
      const exposed = component as unknown as {
        onCheckboxChange: (optionId: string, checked: boolean) => void;
        onConfirm: () => void;
      };
      exposed.onCheckboxChange('stored-tires', true);
      exposed.onConfirm();
      expect(spy).toHaveBeenCalledWith({ serviceId: 'tire-change', optionIds: ['stored-tires'] });
    });

    it('should not emit serviceConfirmed if no option selected', () => {
      const spy = jest.fn();
      component.serviceConfirmed.subscribe(spy);
      const exposed = component as unknown as { onConfirm: () => void };
      exposed.onConfirm();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Service with options — selected with options', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('service', tireChangeService);
      fixture.componentRef.setInput('isSelected', true);
      fixture.componentRef.setInput('selectedOptionIds', ['bring-own-tires']);
      fixture.detectChanges();
    });

    it('should show deselect button when selected, expanded, and no option change', () => {
      const exposed = component as unknown as {
        onCardClick: () => void;
        showDeselectButton: () => boolean;
      };
      exposed.onCardClick(); // expand
      expect(exposed.showDeselectButton()).toBe(true);
    });

    it('should not show confirm button when selected, expanded, and no option change', () => {
      const exposed = component as unknown as {
        onCardClick: () => void;
        showConfirmButton: () => boolean;
      };
      exposed.onCardClick(); // expand
      expect(exposed.showConfirmButton()).toBe(false);
    });

    it('should detect options change when checkbox differs from confirmed', () => {
      const exposed = component as unknown as {
        onCardClick: () => void;
        onCheckboxChange: (optionId: string, checked: boolean) => void;
        hasOptionsChanged: () => boolean;
        showConfirmButton: () => boolean;
        showDeselectButton: () => boolean;
      };
      exposed.onCardClick(); // expand
      exposed.onCheckboxChange('stored-tires', true);
      expect(exposed.hasOptionsChanged()).toBe(true);
      expect(exposed.showConfirmButton()).toBe(true);
      expect(exposed.showDeselectButton()).toBe(false);
    });

    it('should emit serviceDeselected and reset checkboxes on deselect', () => {
      const spy = jest.fn();
      component.serviceDeselected.subscribe(spy);
      const exposed = component as unknown as {
        onCheckboxChange: (optionId: string, checked: boolean) => void;
        onDeselect: () => void;
        selectedCheckboxOptions: () => Set<string>;
        isExpanded: () => boolean;
      };
      exposed.onCheckboxChange('bring-own-tires', true);
      exposed.onDeselect();
      expect(spy).toHaveBeenCalledWith('tire-change');
      expect(exposed.selectedCheckboxOptions().size).toBe(0);
      expect(exposed.isExpanded()).toBe(false);
    });
  });
});

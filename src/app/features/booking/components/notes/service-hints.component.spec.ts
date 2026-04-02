import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { SelectedService } from '../../models/service.model';

import { ServiceHintsComponent } from './service-hints.component';

describe('ServiceHintsComponent', () => {
  let component: ServiceHintsComponent;
  let fixture: ComponentFixture<ServiceHintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceHintsComponent]
    })
      .overrideComponent(ServiceHintsComponent, {
        set: { template: '<div class="mocked">Mocked Service Hints</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ServiceHintsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedServices', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('visibleHints', () => {
    it('should return empty array when no services selected', () => {
      const exposed = component as unknown as {
        visibleHints: () => unknown[];
      };
      expect(exposed.visibleHints()).toEqual([]);
    });

    it('should return hints for selected tuv service', () => {
      const services: SelectedService[] = [
        { serviceId: 'tuv', selectedOptionIds: [] }
      ];
      fixture.componentRef.setInput('selectedServices', services);
      fixture.detectChanges();

      const exposed = component as unknown as {
        visibleHints: () => { serviceId: string; svgIcon: string; hintKey: string }[];
      };
      const hints = exposed.visibleHints();
      expect(hints).toHaveLength(1);
      expect(hints[0].serviceId).toBe('tuv');
      expect(hints[0].svgIcon).toBe('assets/icons/services/tuv.svg');
    });

    it('should return hints for selected inspection service', () => {
      const services: SelectedService[] = [
        { serviceId: 'inspection', selectedOptionIds: [] }
      ];
      fixture.componentRef.setInput('selectedServices', services);
      fixture.detectChanges();

      const exposed = component as unknown as {
        visibleHints: () => { serviceId: string; svgIcon: string }[];
      };
      const hints = exposed.visibleHints();
      expect(hints).toHaveLength(1);
      expect(hints[0].serviceId).toBe('inspection');
      expect(hints[0].svgIcon).toBe('assets/icons/services/inspection.svg');
    });

    it('should return hints for selected tire-change service', () => {
      const services: SelectedService[] = [
        { serviceId: 'tire-change', selectedOptionIds: ['stored-tires'] }
      ];
      fixture.componentRef.setInput('selectedServices', services);
      fixture.detectChanges();

      const exposed = component as unknown as {
        visibleHints: () => { serviceId: string; svgIcon: string }[];
      };
      const hints = exposed.visibleHints();
      expect(hints).toHaveLength(1);
      expect(hints[0].serviceId).toBe('tire-change');
      expect(hints[0].svgIcon).toBe('assets/icons/services/tire-change.svg');
    });

    it('should return hints for all selected services', () => {
      const services: SelectedService[] = [
        { serviceId: 'tuv', selectedOptionIds: [] },
        { serviceId: 'inspection', selectedOptionIds: [] },
        { serviceId: 'tire-change', selectedOptionIds: ['bring-own-tires'] }
      ];
      fixture.componentRef.setInput('selectedServices', services);
      fixture.detectChanges();

      const exposed = component as unknown as {
        visibleHints: () => { serviceId: string }[];
      };
      expect(exposed.visibleHints()).toHaveLength(3);
    });

    it('should only show hints for selected services', () => {
      const services: SelectedService[] = [
        { serviceId: 'tuv', selectedOptionIds: [] }
      ];
      fixture.componentRef.setInput('selectedServices', services);
      fixture.detectChanges();

      const exposed = component as unknown as {
        visibleHints: () => { serviceId: string }[];
      };
      const hints = exposed.visibleHints();
      expect(hints).toHaveLength(1);
      expect(hints[0].serviceId).toBe('tuv');
    });
  });
});

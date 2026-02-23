import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { LocationDisplay } from '../../models/location.model';
import { LOCATIONS_BY_BRAND } from '../../models/location.model';

import { LocationButtonsComponent } from './location-buttons.component';

// UI rendering is verified via E2E (Playwright) — unit tests focus on logic only
describe('LocationButtonsComponent', () => {
  let component: LocationButtonsComponent;
  let fixture: ComponentFixture<LocationButtonsComponent>;
  const testLocations = LOCATIONS_BY_BRAND.audi;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationButtonsComponent]
    })
      .overrideComponent(LocationButtonsComponent, {
        set: { template: '<div class="mocked">Mocked Location Buttons</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(LocationButtonsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('locations', testLocations);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should accept locations input', () => {
      expect(component.locations()).toEqual(testLocations);
    });

    it('should accept selectedLocation input', () => {
      fixture.componentRef.setInput('selectedLocation', testLocations[0]);
      fixture.detectChanges();
      expect(component.selectedLocation()).toEqual(testLocations[0]);
    });

    it('should default selectedLocation to null', () => {
      expect(component.selectedLocation()).toBeNull();
    });
  });

  describe('Outputs', () => {
    it('should emit locationSelected with full location object', () => {
      const spy = jest.fn();
      component.locationSelected.subscribe(spy);

      const exposed = component as unknown as { onClick: (location: LocationDisplay) => void };
      exposed.onClick(testLocations[0]);

      expect(spy).toHaveBeenCalledWith(testLocations[0]);
    });

    it('should emit correct location for each click', () => {
      const spy = jest.fn();
      component.locationSelected.subscribe(spy);

      const exposed = component as unknown as { onClick: (location: LocationDisplay) => void };
      exposed.onClick(testLocations[2]);

      expect(spy).toHaveBeenCalledWith(testLocations[2]);
    });
  });
});

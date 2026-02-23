import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { BrandDisplay } from '../../models/brand.model';
import { AVAILABLE_BRANDS } from '../../models/brand.model';

import { BrandButtonsComponent } from './brand-buttons.component';

// UI rendering is verified via E2E (Playwright) — unit tests focus on logic only
describe('BrandButtonsComponent', () => {
  let component: BrandButtonsComponent;
  let fixture: ComponentFixture<BrandButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandButtonsComponent]
    })
      .overrideComponent(BrandButtonsComponent, {
        set: { template: '<div class="mocked">Mocked Brand Buttons</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(BrandButtonsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('brands', AVAILABLE_BRANDS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should accept brands input', () => {
      expect(component.brands()).toEqual(AVAILABLE_BRANDS);
    });

    it('should accept selectedBrand input', () => {
      fixture.componentRef.setInput('selectedBrand', 'bmw');
      fixture.detectChanges();
      expect(component.selectedBrand()).toBe('bmw');
    });

    it('should default selectedBrand to null', () => {
      expect(component.selectedBrand()).toBeNull();
    });
  });

  describe('Outputs', () => {
    it('should emit brandSelected with brand id', () => {
      const spy = jest.fn();
      component.brandSelected.subscribe(spy);

      const exposed = component as unknown as { onClick: (brand: BrandDisplay) => void };
      exposed.onClick(AVAILABLE_BRANDS[0]);

      expect(spy).toHaveBeenCalledWith(AVAILABLE_BRANDS[0].id);
    });

    it('should emit correct brand id for each brand', () => {
      const spy = jest.fn();
      component.brandSelected.subscribe(spy);

      const exposed = component as unknown as { onClick: (brand: BrandDisplay) => void };
      exposed.onClick(AVAILABLE_BRANDS[2]);

      expect(spy).toHaveBeenCalledWith('mercedes');
    });
  });
});

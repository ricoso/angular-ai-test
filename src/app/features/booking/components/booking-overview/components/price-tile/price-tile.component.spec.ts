import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { PriceTileComponent } from './price-tile.component';

describe('PriceTileComponent', () => {
  let component: PriceTileComponent;
  let fixture: ComponentFixture<PriceTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceTileComponent]
    })
      .overrideComponent(PriceTileComponent, {
        set: { template: '<div class="mocked">Mocked PriceTile</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(PriceTileComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('totalPriceGross', '129,00 €');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have total price gross input', () => {
    expect(component.totalPriceGross()).toBe('129,00 €');
  });

  it('should expose i18n keys', () => {
    const exposed = component as unknown as { bookingOverview: Record<string, unknown> };
    expect(exposed.bookingOverview).toBeDefined();
  });
});

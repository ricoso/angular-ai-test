import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ServicesTileComponent } from './services-tile.component';

describe('ServicesTileComponent', () => {
  let component: ServicesTileComponent;
  let fixture: ComponentFixture<ServicesTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesTileComponent]
    })
      .overrideComponent(ServicesTileComponent, {
        set: { template: '<div class="mocked">Mocked ServicesTile</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ServicesTileComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('services', [
      { serviceId: 'huau', selectedVariantId: null },
      { serviceId: 'tire-change', selectedVariantId: 'with-storage' }
    ]);
    fixture.componentRef.setInput('serviceLabels', {
      'huau': 'HU/AU',
      'tireChange': 'Reifenwechsel — Einlagern'
    });
    fixture.componentRef.setInput('locationName', 'Autohaus München');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have services input', () => {
    expect(component.services()).toHaveLength(2);
  });

  it('should have service labels input', () => {
    const labels = component.serviceLabels();
    expect(labels.huau).toBe('HU/AU');
    expect(labels.tireChange).toBe('Reifenwechsel — Einlagern');
  });

  it('should have location name input', () => {
    expect(component.locationName()).toBe('Autohaus München');
  });

  it('should expose i18n keys', () => {
    const exposed = component as unknown as { bookingOverview: Record<string, unknown> };
    expect(exposed.bookingOverview).toBeDefined();
  });
});

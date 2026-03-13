import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { AppointmentTileComponent } from './appointment-tile.component';

describe('AppointmentTileComponent', () => {
  let component: AppointmentTileComponent;
  let fixture: ComponentFixture<AppointmentTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentTileComponent]
    })
      .overrideComponent(AppointmentTileComponent, {
        set: { template: '<div class="mocked">Mocked AppointmentTile</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(AppointmentTileComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('appointment', {
      id: '2026-03-15-10-00',
      date: '2026-03-15',
      displayDate: '15.03.2026',
      dayAbbreviation: 'Mo',
      time: '10:00',
      displayTime: '10:00 Uhr'
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have appointment input', () => {
    expect(component.appointment()).toEqual(
      expect.objectContaining({
        id: '2026-03-15-10-00',
        displayDate: '15.03.2026',
        displayTime: '10:00 Uhr'
      })
    );
  });

  it('should expose i18n keys', () => {
    const exposed = component as unknown as { bookingOverview: Record<string, unknown> };
    expect(exposed.bookingOverview).toBeDefined();
  });
});

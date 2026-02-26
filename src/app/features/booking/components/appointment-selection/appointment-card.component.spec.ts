import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { AppointmentSlot } from '../../models/appointment.model';

import { AppointmentCardComponent } from './appointment-card.component';

const MOCK_APPOINTMENT: AppointmentSlot = {
  id: '2026-02-25-09-00',
  date: '2026-02-25',
  displayDate: '25.02.2026',
  dayAbbreviation: 'Mi',
  time: '09:00',
  displayTime: '09:00 Uhr'
};

describe('AppointmentCardComponent', () => {
  let component: AppointmentCardComponent;
  let fixture: ComponentFixture<AppointmentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentCardComponent]
    })
      .overrideComponent(AppointmentCardComponent, {
        set: { template: '<div class="mocked">Mocked AppointmentCard</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(AppointmentCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('appointment', MOCK_APPOINTMENT);
    fixture.componentRef.setInput('isSelected', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have appointment input', () => {
    expect(component.appointment()).toEqual(MOCK_APPOINTMENT);
  });

  it('should have isSelected input defaulting to false', () => {
    expect(component.isSelected()).toBe(false);
  });

  it('should emit appointmentSelected on select', () => {
    const spy = jest.fn();
    component.appointmentSelected.subscribe(spy);

    const exposed = component as unknown as { onSelect: () => void };
    exposed.onSelect();

    expect(spy).toHaveBeenCalledWith(MOCK_APPOINTMENT);
  });

  it('should emit on Enter keydown', () => {
    const spy = jest.fn();
    component.appointmentSelected.subscribe(spy);

    const exposed = component as unknown as { onKeydown: (event: KeyboardEvent) => void };
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    jest.spyOn(event, 'preventDefault');

    exposed.onKeydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(MOCK_APPOINTMENT);
  });

  it('should emit on Space keydown', () => {
    const spy = jest.fn();
    component.appointmentSelected.subscribe(spy);

    const exposed = component as unknown as { onKeydown: (event: KeyboardEvent) => void };
    const event = new KeyboardEvent('keydown', { key: ' ' });
    jest.spyOn(event, 'preventDefault');

    exposed.onKeydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(MOCK_APPOINTMENT);
  });

  it('should not emit on other keys', () => {
    const spy = jest.fn();
    component.appointmentSelected.subscribe(spy);

    const exposed = component as unknown as { onKeydown: (event: KeyboardEvent) => void };
    const event = new KeyboardEvent('keydown', { key: 'Tab' });

    exposed.onKeydown(event);

    expect(spy).not.toHaveBeenCalled();
  });
});

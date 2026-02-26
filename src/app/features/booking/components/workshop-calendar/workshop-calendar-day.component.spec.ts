import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { WorkshopCalendarDay, WorkshopTimeSlot } from '../../models/workshop-calendar.model';

import { WorkshopCalendarDayComponent } from './workshop-calendar-day.component';

const MOCK_SLOT: WorkshopTimeSlot = {
  id: '2026-03-02-09-00',
  time: '09:00',
  displayTime: '09:00 Uhr'
};

const MOCK_SLOT_2: WorkshopTimeSlot = {
  id: '2026-03-02-10-00',
  time: '10:00',
  displayTime: '10:00 Uhr'
};

const MOCK_DAY: WorkshopCalendarDay = {
  date: '2026-03-02',
  displayDate: '02.03.2026',
  dayAbbreviation: 'Mo',
  displayHeading: 'Mo, 02.03.2026',
  slots: [MOCK_SLOT, MOCK_SLOT_2]
};

describe('WorkshopCalendarDayComponent', () => {
  let component: WorkshopCalendarDayComponent;
  let fixture: ComponentFixture<WorkshopCalendarDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopCalendarDayComponent]
    })
      .overrideComponent(WorkshopCalendarDayComponent, {
        set: { template: '<div class="mocked">Mocked Day</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(WorkshopCalendarDayComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('day', MOCK_DAY);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have day input', () => {
    expect(component.day()).toEqual(MOCK_DAY);
  });

  it('should have selectedSlotId defaulting to null', () => {
    expect(component.selectedSlotId()).toBeNull();
  });

  it('should accept selectedSlotId input', () => {
    fixture.componentRef.setInput('selectedSlotId', MOCK_SLOT.id);
    fixture.detectChanges();

    expect(component.selectedSlotId()).toBe(MOCK_SLOT.id);
  });

  it('should emit slotSelected on slot click', () => {
    const spy = jest.fn();
    component.slotSelected.subscribe(spy);

    const exposed = component as unknown as { onSlotClick: (s: WorkshopTimeSlot) => void };
    exposed.onSlotClick(MOCK_SLOT);

    expect(spy).toHaveBeenCalledWith(MOCK_SLOT);
  });

  it('should emit slotSelected on Enter keydown', () => {
    const spy = jest.fn();
    component.slotSelected.subscribe(spy);

    const exposed = component as unknown as { onSlotKeydown: (e: KeyboardEvent, s: WorkshopTimeSlot) => void };
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    jest.spyOn(event, 'preventDefault');

    exposed.onSlotKeydown(event, MOCK_SLOT);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(MOCK_SLOT);
  });

  it('should emit slotSelected on Space keydown', () => {
    const spy = jest.fn();
    component.slotSelected.subscribe(spy);

    const exposed = component as unknown as { onSlotKeydown: (e: KeyboardEvent, s: WorkshopTimeSlot) => void };
    const event = new KeyboardEvent('keydown', { key: ' ' });
    jest.spyOn(event, 'preventDefault');

    exposed.onSlotKeydown(event, MOCK_SLOT);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(MOCK_SLOT);
  });

  it('should not emit slotSelected on other keys', () => {
    const spy = jest.fn();
    component.slotSelected.subscribe(spy);

    const exposed = component as unknown as { onSlotKeydown: (e: KeyboardEvent, s: WorkshopTimeSlot) => void };
    const event = new KeyboardEvent('keydown', { key: 'Tab' });

    exposed.onSlotKeydown(event, MOCK_SLOT);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should track selected slot via selectedSlotId input', () => {
    fixture.componentRef.setInput('selectedSlotId', MOCK_SLOT.id);
    fixture.detectChanges();

    expect(component.selectedSlotId()).toBe(MOCK_SLOT.id);
  });

  it('should have null selectedSlotId when no slot selected', () => {
    expect(component.selectedSlotId()).toBeNull();
  });
});

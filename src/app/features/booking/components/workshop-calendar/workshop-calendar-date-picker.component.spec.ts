import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { WorkshopCalendarDatePickerComponent } from './workshop-calendar-date-picker.component';

describe('WorkshopCalendarDatePickerComponent', () => {
  let component: WorkshopCalendarDatePickerComponent;
  let fixture: ComponentFixture<WorkshopCalendarDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopCalendarDatePickerComponent]
    })
      .overrideComponent(WorkshopCalendarDatePickerComponent, {
        set: { template: '<div class="mocked">Mocked DatePicker</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(WorkshopCalendarDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have selectedDate input defaulting to null', () => {
    expect(component.selectedDate()).toBeNull();
  });

  it('should accept selectedDate input', () => {
    fixture.componentRef.setInput('selectedDate', '2026-03-02');
    fixture.detectChanges();

    expect(component.selectedDate()).toBe('2026-03-02');
  });

  it('should emit dateSelected on valid date change', () => {
    const spy = jest.fn();
    component.dateSelected.subscribe(spy);

    const testDate = new Date(2026, 2, 2);
    const exposed = component as unknown as { onDateChange: (d: Date | null) => void };
    exposed.onDateChange(testDate);

    expect(spy).toHaveBeenCalledWith(testDate);
  });

  it('should not emit dateSelected on null date change', () => {
    const spy = jest.fn();
    component.dateSelected.subscribe(spy);

    const exposed = component as unknown as { onDateChange: (d: Date | null) => void };
    exposed.onDateChange(null);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should have today property set to current date', () => {
    const exposed = component as unknown as { today: Date };
    const today = new Date();

    expect(exposed.today.getFullYear()).toBe(today.getFullYear());
    expect(exposed.today.getMonth()).toBe(today.getMonth());
    expect(exposed.today.getDate()).toBe(today.getDate());
  });
});

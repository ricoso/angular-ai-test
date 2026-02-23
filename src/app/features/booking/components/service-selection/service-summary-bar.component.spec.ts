import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ServiceSummaryBarComponent } from './service-summary-bar.component';

describe('ServiceSummaryBarComponent', () => {
  let component: ServiceSummaryBarComponent;
  let fixture: ComponentFixture<ServiceSummaryBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceSummaryBarComponent]
    })
      .overrideComponent(ServiceSummaryBarComponent, {
        set: { template: '<div class="mocked">Mocked Summary Bar</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ServiceSummaryBarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedServiceCount', 0);
    fixture.componentRef.setInput('hasServicesSelected', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit continueClicked on continue', () => {
    const spy = jest.fn();
    component.continueClicked.subscribe(spy);
    const exposed = component as unknown as { onContinue: () => void };
    exposed.onContinue();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit backClicked on back', () => {
    const spy = jest.fn();
    component.backClicked.subscribe(spy);
    const exposed = component as unknown as { onBack: () => void };
    exposed.onBack();
    expect(spy).toHaveBeenCalled();
  });

  it('should receive selectedServiceCount input', () => {
    fixture.componentRef.setInput('selectedServiceCount', 3);
    fixture.detectChanges();
    expect(component.selectedServiceCount()).toBe(3);
  });

  it('should receive hasServicesSelected input', () => {
    fixture.componentRef.setInput('hasServicesSelected', true);
    fixture.detectChanges();
    expect(component.hasServicesSelected()).toBe(true);
  });
});

import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AVAILABLE_BRANDS } from '../../models/brand.model';
import { BookingApiService } from '../../services/booking-api.service';
import { BookingStore } from '../../stores/booking.store';

import { BrandSelectionContainerComponent } from './brand-selection-container.component';

describe('BrandSelectionContainerComponent', () => {
  let component: BrandSelectionContainerComponent;
  let fixture: ComponentFixture<BrandSelectionContainerComponent>;
  let router: jest.Mocked<Router>;
  let store: InstanceType<typeof BookingStore>;

  beforeEach(async () => {
    router = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [BrandSelectionContainerComponent],
      providers: [
        BookingStore,
        { provide: BookingApiService, useValue: { getBrands: jest.fn().mockResolvedValue(AVAILABLE_BRANDS) } },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    store = TestBed.inject(BookingStore);
    fixture = TestBed.createComponent(BrandSelectionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const el: HTMLElement = fixture.nativeElement;
    const title = el.querySelector('.brand-selection__title');
    expect(title?.textContent).toBeTruthy();
  });

  it('should render subtitle', () => {
    const el: HTMLElement = fixture.nativeElement;
    const subtitle = el.querySelector('.brand-selection__subtitle');
    expect(subtitle?.textContent).toBeTruthy();
  });

  it('should contain brand-buttons component', () => {
    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelector('app-brand-buttons');
    expect(buttons).toBeTruthy();
  });

  it('should set brand in store and navigate on selection', () => {
    (component as unknown as { onBrandSelect: (b: string) => void }).onBrandSelect('audi');
    expect(store.selectedBrand()).toBe('audi');
    expect(router.navigate).toHaveBeenCalledWith(['/home/location']);
  });

  it('should navigate to location route', () => {
    (component as unknown as { onBrandSelect: (b: string) => void }).onBrandSelect('bmw');
    expect(router.navigate).toHaveBeenCalledWith(['/home/location']);
  });
});

import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { VERFUEGBARE_MARKEN } from '../../models/marke.model';
import { BuchungApiService } from '../../services/buchung-api.service';
import { BuchungStore } from '../../stores/buchung.store';

import { MarkenauswahlContainerComponent } from './markenauswahl-container.component';

describe('MarkenauswahlContainerComponent', () => {
  let component: MarkenauswahlContainerComponent;
  let fixture: ComponentFixture<MarkenauswahlContainerComponent>;
  let router: jest.Mocked<Router>;
  let store: InstanceType<typeof BuchungStore>;

  beforeEach(async () => {
    router = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [MarkenauswahlContainerComponent],
      providers: [
        BuchungStore,
        { provide: BuchungApiService, useValue: { holeMarken: jest.fn().mockResolvedValue(VERFUEGBARE_MARKEN) } },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    store = TestBed.inject(BuchungStore);
    fixture = TestBed.createComponent(MarkenauswahlContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const el: HTMLElement = fixture.nativeElement;
    const title = el.querySelector('.markenauswahl__titel');
    expect(title?.textContent).toBeTruthy();
  });

  it('should render subtitle', () => {
    const el: HTMLElement = fixture.nativeElement;
    const subtitle = el.querySelector('.markenauswahl__untertitel');
    expect(subtitle?.textContent).toBeTruthy();
  });

  it('should contain marken-buttons component', () => {
    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelector('app-marken-buttons');
    expect(buttons).toBeTruthy();
  });

  it('should set marke in store and navigate on selection', () => {
    // Access protected method via type assertion
    (component as unknown as { beimMarkeWaehlen: (m: string) => void }).beimMarkeWaehlen('audi');
    expect(store.gewaehlteMarke()).toBe('audi');
    expect(router.navigate).toHaveBeenCalledWith(['/buchung/standort']);
  });

  it('should navigate to standort route', () => {
    (component as unknown as { beimMarkeWaehlen: (m: string) => void }).beimMarkeWaehlen('bmw');
    expect(router.navigate).toHaveBeenCalledWith(['/buchung/standort']);
  });
});

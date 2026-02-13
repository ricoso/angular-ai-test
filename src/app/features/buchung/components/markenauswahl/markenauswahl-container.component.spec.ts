import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

import { TranslatePipe } from '@core/i18n';
import { VERFUEGBARE_MARKEN } from '../../models/marke.model';
import { BuchungStore } from '../../stores/buchung.store';
import { MarkenauswahlContainerComponent } from './markenauswahl-container.component';
import { MarkenButtonsComponent } from './marken-buttons.component';

describe('MarkenauswahlContainerComponent', () => {
  let component: MarkenauswahlContainerComponent;
  let fixture: ComponentFixture<MarkenauswahlContainerComponent>;
  let routerMock: jest.Mocked<Router>;
  let storeMock: Partial<InstanceType<typeof BuchungStore>>;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    storeMock = {
      marken: signal(VERFUEGBARE_MARKEN),
      gewaehlteMarke: signal(null),
      setzeMarke: jest.fn()
    } as unknown as Partial<InstanceType<typeof BuchungStore>>;

    await TestBed.configureTestingModule({
      imports: [MarkenauswahlContainerComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: BuchungStore, useValue: storeMock }
      ]
    })
    .overrideComponent(MarkenauswahlContainerComponent, {
      set: { imports: [TranslatePipe, MarkenButtonsComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkenauswahlContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    const el: HTMLElement = fixture.nativeElement;
    const title = el.querySelector('.markenauswahl__titel');
    expect(title).toBeTruthy();
  });

  it('should display the subtitle', () => {
    const el: HTMLElement = fixture.nativeElement;
    const subtitle = el.querySelector('.markenauswahl__untertitel');
    expect(subtitle).toBeTruthy();
  });

  it('should call store.setzeMarke and navigate on brand selection', () => {
    (component as unknown as { beimMarkeWaehlen: (m: string) => void }).beimMarkeWaehlen('audi');

    expect(storeMock.setzeMarke).toHaveBeenCalledWith('audi');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/buchung/standort']);
  });
});

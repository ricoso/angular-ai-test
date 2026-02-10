import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { HeaderContainerComponent } from './header-container.component';
import { BarrierefreiheitStore } from '@shared/stores/accessibility.store';
import { BarrierefreiheitService } from '@shared/services/accessibility.service';
import { BARRIEREFREIHEIT_STANDARDS } from '@shared/models/accessibility.model';

describe('HeaderContainerComponent', () => {
  let component: HeaderContainerComponent;
  let fixture: ComponentFixture<HeaderContainerComponent>;
  let store: InstanceType<typeof BarrierefreiheitStore>;
  let serviceMock: jest.Mocked<BarrierefreiheitService>;

  beforeEach(async () => {
    serviceMock = {
      getEinstellungen: jest.fn().mockReturnValue({ ...BARRIEREFREIHEIT_STANDARDS }),
      speichereEinstellungen: jest.fn(),
      aufDokumentAnwenden: jest.fn()
    } as unknown as jest.Mocked<BarrierefreiheitService>;

    await TestBed.configureTestingModule({
      imports: [HeaderContainerComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync('noop'),
        BarrierefreiheitStore,
        { provide: BarrierefreiheitService, useValue: serviceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderContainerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(BarrierefreiheitStore);
    fixture.detectChanges();
  });

  it('sollte erstellt werden', () => {
    expect(component).toBeTruthy();
  });

  it('sollte Logo-Link rendern', () => {
    const logoLink = fixture.nativeElement.querySelector('.header__logo-link');
    expect(logoLink).toBeTruthy();
    expect(logoLink.getAttribute('href')).toBe('/');
  });

  it('sollte Accessibility-Button rendern', () => {
    const a11yButton = fixture.nativeElement.querySelector('.header__a11y-button');
    expect(a11yButton).toBeTruthy();
  });

  it('sollte Accessibility-Icon anzeigen', () => {
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent).toContain('accessibility_new');
  });

  describe('Event Handler', () => {
    it('sollte beimSchriftgroesseAendern an Store delegieren', () => {
      const setzeSchriftgroesseSpy = jest.spyOn(store, 'setzeSchriftgroesse');

      component['beimSchriftgroesseAendern']('large');

      expect(setzeSchriftgroesseSpy).toHaveBeenCalledWith('large');
    });

    it('sollte beimHohenKontrastAendern an Store delegieren', () => {
      const setzeHohenKontrastSpy = jest.spyOn(store, 'setzeHohenKontrast');

      component['beimHohenKontrastAendern'](true);

      expect(setzeHohenKontrastSpy).toHaveBeenCalledWith(true);
    });

    it('sollte beimReduzierteBewegungAendern an Store delegieren', () => {
      const setzeReduzierteBewegungSpy = jest.spyOn(store, 'setzeReduzierteBewegung');

      component['beimReduzierteBewegungAendern'](true);

      expect(setzeReduzierteBewegungSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('Accessibility', () => {
    it('sollte aria-label auf Accessibility-Button haben', () => {
      const a11yButton = fixture.nativeElement.querySelector('.header__a11y-button');
      expect(a11yButton.getAttribute('aria-label')).toBeTruthy();
    });

    it('sollte role="banner" auf header haben', () => {
      const header = fixture.nativeElement.querySelector('.header');
      expect(header.getAttribute('role')).toBe('banner');
    });
  });
});

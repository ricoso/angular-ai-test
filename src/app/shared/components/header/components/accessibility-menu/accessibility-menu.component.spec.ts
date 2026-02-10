import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AccessibilityMenuComponent } from './accessibility-menu.component';
import { Schriftgroesse } from '@shared/models/accessibility.model';

describe('AccessibilityMenuComponent', () => {
  let component: AccessibilityMenuComponent;
  let fixture: ComponentFixture<AccessibilityMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessibilityMenuComponent],
      providers: [provideAnimationsAsync('noop')]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessibilityMenuComponent);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('schriftgroesse', 'normal');
    fixture.componentRef.setInput('hoherKontrast', false);
    fixture.componentRef.setInput('reduzierteBewegung', false);

    fixture.detectChanges();
  });

  it('sollte erstellt werden', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('sollte Schriftgröße Input akzeptieren', () => {
      fixture.componentRef.setInput('schriftgroesse', 'large');
      fixture.detectChanges();
      expect(component.schriftgroesse()).toBe('large');
    });

    it('sollte hoherKontrast Input akzeptieren', () => {
      fixture.componentRef.setInput('hoherKontrast', true);
      fixture.detectChanges();
      expect(component.hoherKontrast()).toBe(true);
    });

    it('sollte reduzierteBewegung Input akzeptieren', () => {
      fixture.componentRef.setInput('reduzierteBewegung', true);
      fixture.detectChanges();
      expect(component.reduzierteBewegung()).toBe(true);
    });
  });

  describe('Outputs', () => {
    it('sollte schriftgroesseGeaendert emittieren', () => {
      const emitSpy = jest.fn();
      component.schriftgroesseGeaendert.subscribe(emitSpy);

      component['beimSchriftgroesseAendern']('x-large');

      expect(emitSpy).toHaveBeenCalledWith('x-large');
    });

    it('sollte hoherKontrastGeaendert emittieren', () => {
      const emitSpy = jest.fn();
      component.hoherKontrastGeaendert.subscribe(emitSpy);

      component['beimHohenKontrastAendern'](true);

      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('sollte reduzierteBewegungGeaendert emittieren', () => {
      const emitSpy = jest.fn();
      component.reduzierteBewegungGeaendert.subscribe(emitSpy);

      component['beimReduzierteBewegungAendern'](true);

      expect(emitSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('UI Elements', () => {
    it('sollte alle Schriftgröße-Optionen rendern', () => {
      const radioButtons = fixture.nativeElement.querySelectorAll('mat-radio-button');
      expect(radioButtons.length).toBe(4);
    });

    it('sollte High Contrast Toggle rendern', () => {
      const toggles = fixture.nativeElement.querySelectorAll('mat-slide-toggle');
      expect(toggles.length).toBe(2); // High Contrast + Reduced Motion
    });

    it('sollte Section-Überschrift für Schriftgröße haben', () => {
      const heading = fixture.nativeElement.querySelector('#font-size-label');
      expect(heading).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('sollte aria-labelledby auf Radio-Group haben', () => {
      const radioGroup = fixture.nativeElement.querySelector('mat-radio-group');
      expect(radioGroup.getAttribute('aria-labelledby')).toBe('font-size-label');
    });
  });

  describe('Schriftgröße-Optionen', () => {
    it('sollte alle verfügbaren Schriftgrößen anbieten', () => {
      const erwarteteGroessen: Schriftgroesse[] = ['small', 'normal', 'large', 'x-large'];
      expect(component['schriftgroessen']).toEqual(erwarteteGroessen);
    });
  });
});

import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { VERFUEGBARE_MARKEN } from '../../models/marke.model';

import { MarkenButtonsComponent } from './marken-buttons.component';

describe('MarkenButtonsComponent', () => {
  let component: MarkenButtonsComponent;
  let fixture: ComponentFixture<MarkenButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkenButtonsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MarkenButtonsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('marken', VERFUEGBARE_MARKEN);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 5 buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.marken-grid__button');
    expect(buttons.length).toBe(5);
  });

  it('should display brand names', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.marken-grid__button');
    expect(buttons[0].textContent.trim()).toBe('Audi');
    expect(buttons[1].textContent.trim()).toBe('BMW');
    expect(buttons[2].textContent.trim()).toBe('Mercedes-Benz');
    expect(buttons[3].textContent.trim()).toBe('MINI');
    expect(buttons[4].textContent.trim()).toBe('Volkswagen');
  });

  it('should emit markeGewaehlt on click', () => {
    const spy = jest.fn();
    component.markeGewaehlt.subscribe(spy);

    const button = fixture.nativeElement.querySelector('.marken-grid__button');
    button.click();

    expect(spy).toHaveBeenCalledWith('audi');
  });

  it('should emit correct brand id for each button', () => {
    const spy = jest.fn();
    component.markeGewaehlt.subscribe(spy);

    const buttons = fixture.nativeElement.querySelectorAll('.marken-grid__button');
    buttons[2].click();

    expect(spy).toHaveBeenCalledWith('mercedes');
  });

  it('should mark active brand with aktiv class', () => {
    fixture.componentRef.setInput('gewaehlteMarke', 'bmw');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.marken-grid__button');
    expect(buttons[1].classList.contains('marken-grid__button--aktiv')).toBe(true);
    expect(buttons[0].classList.contains('marken-grid__button--aktiv')).toBe(false);
  });

  it('should set aria-pressed on active brand', () => {
    fixture.componentRef.setInput('gewaehlteMarke', 'audi');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.marken-grid__button');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('should have role="group" on container', () => {
    const grid = fixture.nativeElement.querySelector('.marken-grid');
    expect(grid.getAttribute('role')).toBe('group');
  });

  it('should have aria-label on container', () => {
    const grid = fixture.nativeElement.querySelector('.marken-grid');
    expect(grid.getAttribute('aria-label')).toBe('Fahrzeugmarken');
  });

  it('should have no aktiv class when no brand selected', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.marken-grid__button');
    buttons.forEach((button: HTMLElement) => {
      expect(button.classList.contains('marken-grid__button--aktiv')).toBe(false);
    });
  });

  it('should use type="button" on all buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.marken-grid__button');
    buttons.forEach((button: HTMLButtonElement) => {
      expect(button.type).toBe('button');
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';

import { VERFUEGBARE_MARKEN } from '../../models/marke.model';
import { MarkenButtonsComponent } from './marken-buttons.component';

describe('MarkenButtonsComponent', () => {
  let component: MarkenButtonsComponent;
  let componentRef: ComponentRef<MarkenButtonsComponent>;
  let fixture: ComponentFixture<MarkenButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkenButtonsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MarkenButtonsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('marken', VERFUEGBARE_MARKEN);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 5 brand buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.marken-grid__button');
    expect(buttons.length).toBe(5);
  });

  it('should display brand names', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.marken-grid__button');
    const names = Array.from(buttons).map((b) => (b as Element).textContent?.trim());
    expect(names).toEqual(['Audi', 'BMW', 'Mercedes-Benz', 'MINI', 'Volkswagen']);
  });

  it('should emit markeGewaehlt on click', () => {
    const spy = jest.fn();
    component.markeGewaehlt.subscribe(spy);

    const buttons = fixture.nativeElement.querySelectorAll('.marken-grid__button');
    buttons[0].click();

    expect(spy).toHaveBeenCalledWith('audi');
  });

  it('should mark active brand with --aktiv class', () => {
    componentRef.setInput('gewaehlteMarke', 'bmw');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.marken-grid__button');
    expect(buttons[1].classList.contains('marken-grid__button--aktiv')).toBe(true);
    expect(buttons[0].classList.contains('marken-grid__button--aktiv')).toBe(false);
  });

  it('should set aria-pressed for active brand', () => {
    componentRef.setInput('gewaehlteMarke', 'mercedes');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.marken-grid__button');
    expect(buttons[2].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('should have role="group" with aria-label', () => {
    const grid = fixture.nativeElement.querySelector('.marken-grid');
    expect(grid.getAttribute('role')).toBe('group');
    expect(grid.getAttribute('aria-label')).toBeTruthy();
  });
});

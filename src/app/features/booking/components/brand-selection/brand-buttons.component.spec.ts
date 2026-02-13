import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { AVAILABLE_BRANDS } from '../../models/brand.model';

import { BrandButtonsComponent } from './brand-buttons.component';

describe('BrandButtonsComponent', () => {
  let component: BrandButtonsComponent;
  let fixture: ComponentFixture<BrandButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandButtonsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandButtonsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('brands', AVAILABLE_BRANDS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 5 buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.brand-grid__button');
    expect(buttons.length).toBe(5);
  });

  it('should display brand names', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.brand-grid__button');
    expect(buttons[0].textContent.trim()).toBe('Audi');
    expect(buttons[1].textContent.trim()).toBe('BMW');
    expect(buttons[2].textContent.trim()).toBe('Mercedes-Benz');
    expect(buttons[3].textContent.trim()).toBe('MINI');
    expect(buttons[4].textContent.trim()).toBe('Volkswagen');
  });

  it('should emit brandSelected on click', () => {
    const spy = jest.fn();
    component.brandSelected.subscribe(spy);

    const button = fixture.nativeElement.querySelector('.brand-grid__button');
    button.click();

    expect(spy).toHaveBeenCalledWith('audi');
  });

  it('should emit correct brand id for each button', () => {
    const spy = jest.fn();
    component.brandSelected.subscribe(spy);

    const buttons = fixture.nativeElement.querySelectorAll('.brand-grid__button');
    buttons[2].click();

    expect(spy).toHaveBeenCalledWith('mercedes');
  });

  it('should mark active brand with active class', () => {
    fixture.componentRef.setInput('selectedBrand', 'bmw');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.brand-grid__button');
    expect(buttons[1].classList.contains('brand-grid__button--active')).toBe(true);
    expect(buttons[0].classList.contains('brand-grid__button--active')).toBe(false);
  });

  it('should set aria-pressed on active brand', () => {
    fixture.componentRef.setInput('selectedBrand', 'audi');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.brand-grid__button');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('should have role="group" on container', () => {
    const grid = fixture.nativeElement.querySelector('.brand-grid');
    expect(grid.getAttribute('role')).toBe('group');
  });

  it('should have aria-label on container', () => {
    const grid = fixture.nativeElement.querySelector('.brand-grid');
    expect(grid.getAttribute('aria-label')).toBe('Vehicle brands');
  });

  it('should have no active class when no brand selected', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.brand-grid__button');
    buttons.forEach((button: HTMLElement) => {
      expect(button.classList.contains('brand-grid__button--active')).toBe(false);
    });
  });

  it('should use type="button" on all buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.brand-grid__button');
    buttons.forEach((button: HTMLButtonElement) => {
      expect(button.type).toBe('button');
    });
  });
});

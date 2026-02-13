import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CartIconComponent } from './cart-icon.component';
import { TranslateService } from '@app/core/i18n';

describe('CartIconComponent', () => {
  let component: CartIconComponent;
  let fixture: ComponentFixture<CartIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartIconComponent],
      providers: [
        provideAnimationsAsync('noop'),
        TranslateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartIconComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('itemCount', 0);
    fixture.componentRef.setInput('badgeText', '');
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should render shopping_cart icon', () => {
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent).toContain('shopping_cart');
  });

  it('should render button with aria-label', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.getAttribute('aria-label')).toBeTruthy();
  });

  describe('Badge Visibility', () => {
    it('should hide badge when no items', () => {
      expect(component['badgeVisible']()).toBe(false);
    });

    it('should show badge when items exist', () => {
      fixture.componentRef.setInput('itemCount', 3);
      fixture.detectChanges();

      expect(component['badgeVisible']()).toBe(true);
    });
  });

  describe('Aria Label', () => {
    it('should show only button label when no items', () => {
      fixture.componentRef.setInput('itemCount', 0);
      fixture.detectChanges();

      const label = component['ariaLabel']();
      expect(label).toBeTruthy();
      expect(label).not.toContain(',');
    });

    it('should show count in aria label when items exist', () => {
      fixture.componentRef.setInput('itemCount', 5);
      fixture.detectChanges();

      const label = component['ariaLabel']();
      expect(label).toContain('5');
    });
  });

  describe('Events', () => {
    it('should emit cartClicked on click', () => {
      const emitSpy = jest.spyOn(component.cartClicked, 'emit');

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(emitSpy).toHaveBeenCalled();
    });
  });
});

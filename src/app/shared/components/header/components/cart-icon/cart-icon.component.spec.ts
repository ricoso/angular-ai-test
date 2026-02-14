import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { TranslateService } from '@app/core/i18n';

import { CartIconComponent } from './cart-icon.component';

interface CartIconExposed {
  badgeVisible: () => boolean;
  ariaLabel: () => string;
  onClick: () => void;
}

// UI rendering is verified via E2E (Playwright) — unit tests focus on logic only
describe('CartIconComponent', () => {
  let component: CartIconComponent;
  let fixture: ComponentFixture<CartIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartIconComponent],
      providers: [TranslateService]
    })
      .overrideComponent(CartIconComponent, {
        set: { template: '<div class="mocked">Mocked Cart Icon</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(CartIconComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('itemCount', 0);
    fixture.componentRef.setInput('badgeText', '');
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Badge Visibility', () => {
    it('should hide badge when no items', () => {
      const exposed = component as unknown as CartIconExposed;
      expect(exposed.badgeVisible()).toBe(false);
    });

    it('should show badge when items exist', () => {
      fixture.componentRef.setInput('itemCount', 3);
      fixture.detectChanges();

      const exposed = component as unknown as CartIconExposed;
      expect(exposed.badgeVisible()).toBe(true);
    });
  });

  describe('Aria Label', () => {
    it('should show only button label when no items', () => {
      fixture.componentRef.setInput('itemCount', 0);
      fixture.detectChanges();

      const exposed = component as unknown as CartIconExposed;
      const label = exposed.ariaLabel();
      expect(label).toBeTruthy();
      expect(label).not.toContain(',');
    });

    it('should show count in aria label when items exist', () => {
      fixture.componentRef.setInput('itemCount', 5);
      fixture.detectChanges();

      const exposed = component as unknown as CartIconExposed;
      const label = exposed.ariaLabel();
      expect(label).toContain('5');
    });
  });

  describe('Events', () => {
    it('should emit cartClicked on onClick', () => {
      const emitSpy = jest.spyOn(component.cartClicked, 'emit');
      const exposed = component as unknown as CartIconExposed;

      exposed.onClick();

      expect(emitSpy).toHaveBeenCalled();
    });
  });
});

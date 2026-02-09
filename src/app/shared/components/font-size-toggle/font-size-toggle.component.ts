import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type FontSize = 'small' | 'normal' | 'large' | 'x-large';

@Component({
  selector: 'app-font-size-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="font-size-toggle" role="group" aria-label="Schriftgröße anpassen">
      <button
        class="font-size-toggle__btn"
        (click)="decrease()"
        [disabled]="currentIndex() <= 0"
        aria-label="Schrift verkleinern"
        type="button">
        A-
      </button>
      <span
        class="font-size-toggle__label"
        aria-live="polite"
        [attr.aria-label]="'Aktuelle Schriftgröße: ' + sizeLabels[currentIndex()]">
        {{ sizeLabels[currentIndex()] }}
      </span>
      <button
        class="font-size-toggle__btn"
        (click)="increase()"
        [disabled]="currentIndex() >= sizes.length - 1"
        aria-label="Schrift vergrößern"
        type="button">
        A+
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FontSizeToggleComponent implements OnInit {
  protected readonly sizes: FontSize[] = ['small', 'normal', 'large', 'x-large'];
  protected readonly sizeLabels = ['Klein', 'Normal', 'Groß', 'Sehr groß'];
  protected readonly currentIndex = signal(1);  // Default: normal

  ngOnInit(): void {
    this.restoreFromStorage();
  }

  increase(): void {
    if (this.currentIndex() < this.sizes.length - 1) {
      this.currentIndex.update(i => i + 1);
      this.applySize();
    }
  }

  decrease(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
      this.applySize();
    }
  }

  private applySize(): void {
    const size = this.sizes[this.currentIndex()];
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('app-font-size', size);
  }

  private restoreFromStorage(): void {
    const saved = localStorage.getItem('app-font-size') as FontSize | null;
    if (saved) {
      const index = this.sizes.indexOf(saved);
      if (index >= 0) {
        this.currentIndex.set(index);
        document.documentElement.setAttribute('data-font-size', saved);
      }
    }
  }
}

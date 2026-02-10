import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@app/core/i18n';
import { Schriftgroesse } from '@app/shared/models/accessibility.model';

/**
 * Presentational Component für Accessibility-Menu
 * Zeigt Font-Size Radio-Buttons und Toggles für High Contrast / Reduced Motion
 */
@Component({
  selector: 'app-accessibility-menu',
  standalone: true,
  imports: [
    MatRadioModule,
    MatSlideToggleModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './accessibility-menu.component.html',
  styleUrl: './accessibility-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessibilityMenuComponent {
  // Inputs (Presentational: nur input/output, KEIN Store!)
  readonly schriftgroesse = input.required<Schriftgroesse>();
  readonly hoherKontrast = input.required<boolean>();
  readonly reduzierteBewegung = input.required<boolean>();

  // Outputs
  readonly schriftgroesseGeaendert = output<Schriftgroesse>();
  readonly hoherKontrastGeaendert = output<boolean>();
  readonly reduzierteBewegungGeaendert = output<boolean>();

  // Verfügbare Schriftgrößen
  protected readonly schriftgroessen: Schriftgroesse[] = ['small', 'normal', 'large', 'x-large'];

  /**
   * Handler für Schriftgröße-Änderung
   */
  protected beimSchriftgroesseAendern(groesse: Schriftgroesse): void {
    this.schriftgroesseGeaendert.emit(groesse);
  }

  /**
   * Handler für High Contrast Toggle
   */
  protected beimHohenKontrastAendern(wert: boolean): void {
    this.hoherKontrastGeaendert.emit(wert);
  }

  /**
   * Handler für Reduced Motion Toggle
   */
  protected beimReduzierteBewegungAendern(wert: boolean): void {
    this.reduzierteBewegungGeaendert.emit(wert);
  }
}

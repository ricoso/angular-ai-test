import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateService } from '@app/core/i18n';
import { BarrierefreiheitStore } from '@app/shared/stores/accessibility.store';
import { Schriftgroesse } from '@app/shared/models/accessibility.model';
import { AccessibilityMenuComponent } from './components/accessibility-menu/accessibility-menu.component';

/**
 * Container Component für den Application Header
 * Bindet den AccessibilityStore ein und delegiert an Presentational Components
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    AccessibilityMenuComponent
  ],
  templateUrl: './header-container.component.html',
  styleUrl: './header-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderContainerComponent {
  // i18n - Objektorientierter Zugriff auf Übersetzungen
  protected readonly t = inject(TranslateService).t;

  // Store injection (Container darf Store injecten!)
  protected readonly barrierefreiheitStore = inject(BarrierefreiheitStore);

  /**
   * Handler für Schriftgröße-Änderung
   */
  protected beimSchriftgroesseAendern(groesse: Schriftgroesse): void {
    this.barrierefreiheitStore.setzeSchriftgroesse(groesse);
  }

  /**
   * Handler für High Contrast-Änderung
   */
  protected beimHohenKontrastAendern(wert: boolean): void {
    this.barrierefreiheitStore.setzeHohenKontrast(wert);
  }

  /**
   * Handler für Reduced Motion-Änderung
   */
  protected beimReduzierteBewegungAendern(wert: boolean): void {
    this.barrierefreiheitStore.setzeReduzierteBewegung(wert);
  }
}

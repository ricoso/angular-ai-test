import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderContainerComponent } from '@shared/components/header/header-container.component';
import { TranslatePipe, i18nKeys } from '@core/i18n';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderContainerComponent, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  protected readonly app = i18nKeys.app;
}

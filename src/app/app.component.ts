import { ChangeDetectionStrategy,Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { i18nKeys,TranslatePipe } from '@core/i18n';
import { HeaderContainerComponent } from '@shared/components/header/header-container.component';

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

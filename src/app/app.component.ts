import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderContainerComponent } from '@shared/components/header/header-container.component';
import { TranslateService } from '@core/i18n';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  protected readonly t = inject(TranslateService).t;
}

import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  templateUrl: './welcome-card.component.html',
  styleUrl: './welcome-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeCardComponent {
  // Presentational: Input only, no store access
  userName = input.required<string>();
}

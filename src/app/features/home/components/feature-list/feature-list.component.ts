import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-feature-list',
  standalone: true,
  templateUrl: './feature-list.component.html',
  styleUrl: './feature-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureListComponent {
  // Presentational: Input/Output only, no store access
  features = input.required<Feature[]>();
  featureClick = output<Feature>();
  
  onFeatureClick(feature: Feature) {
    this.featureClick.emit(feature);
  }
}

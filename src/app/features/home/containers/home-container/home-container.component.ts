import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { WelcomeCardComponent } from '../../components/welcome-card/welcome-card.component';
import { FeatureListComponent } from '../../components/feature-list/feature-list.component';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-home-container',
  standalone: true,
  imports: [WelcomeCardComponent, FeatureListComponent],
  templateUrl: './home-container.component.html',
  styleUrl: './home-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeContainerComponent {
  // Container: Manages state with signals
  features = signal<Feature[]>([
    {
      title: 'Container/Presentational Pattern',
      description: 'One Container per route with Presentational children. Clean separation of concerns.',
      icon: '🎯'
    },
    {
      title: 'Signal Store',
      description: 'NgRx Signal Store for state management. No BehaviorSubject!',
      icon: '📦'
    },
    {
      title: 'Service Layers',
      description: 'API Services for HTTP, Business Services for logic. Clear responsibilities.',
      icon: '⚙️'
    },
    {
      title: 'OnPush Everywhere',
      description: 'Optimal change detection with OnPush strategy on all components.',
      icon: '⚡'
    },
    {
      title: 'Jest Testing',
      description: 'Fast unit tests with Jest. Coverage target: >80%.',
      icon: '✅'
    },
    {
      title: 'TypeScript Strict',
      description: 'Full type safety with TypeScript strict mode enabled.',
      icon: '🔒'
    }
  ]);
  
  userName = signal('Developer');
  
  // Container: Handles events from children
  onFeatureClick(feature: Feature) {
    console.log('Feature clicked:', feature.title);
    // In real app: navigate, update store, etc.
  }
}

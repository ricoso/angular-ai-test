import type { PipeTransform} from '@angular/core';
import { inject,Pipe } from '@angular/core';

import { TranslateService } from './translate.service';
import type { TranslationKey } from './translations';

/**
 * Translate Pipe für Templates
 * Usage: {{ 'app.title' | translate }}
 */
@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Muss impure sein für Language-Switching
})
export class TranslatePipe implements PipeTransform {
  private readonly translateService = inject(TranslateService);

  public transform(key: TranslationKey): string {
    return this.translateService.instant(key);
  }
}

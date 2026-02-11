import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from './translate.service';
import { TranslationKey } from './translations';

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

  transform(key: TranslationKey): string {
    return this.translateService.instant(key);
  }
}

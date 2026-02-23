import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { i18nKeys, TranslatePipe } from '@core/i18n';

import { BookingStore } from '../../stores/booking.store';

import { NotesFormComponent } from './notes-form.component';
import { ServiceHintsComponent } from './service-hints.component';

@Component({
  selector: 'app-notes-container',
  standalone: true,
  imports: [TranslatePipe, MatButtonModule, MatIconModule, NotesFormComponent, ServiceHintsComponent],
  templateUrl: './notes-container.component.html',
  styleUrl: './notes-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesContainerComponent {
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  protected readonly booking = i18nKeys.booking;
  protected readonly selectedServices = this.store.selectedServices;
  protected readonly initialNote = this.store.bookingNote;
  protected readonly currentNote = signal<string | null>(this.store.bookingNote());

  protected onNoteChanged(note: string | null): void {
    this.currentNote.set(note);
  }

  protected onContinue(): void {
    const note = this.currentNote();
    const sanitizedNote = note && note.trim().length > 0 ? note.trim() : null;
    this.store.setBookingNote(sanitizedNote);
    console.debug('[NotesContainer] Continue clicked, note:', sanitizedNote);
    void this.router.navigate(['/home/appointment']);
  }

  protected onBack(): void {
    void this.router.navigate(['/home/services']);
  }
}

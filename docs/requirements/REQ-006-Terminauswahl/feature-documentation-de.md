# Feature-Dokumentation: Terminauswahl

**Erstellt:** 2026-02-23
**Requirement:** REQ-006-Terminauswahl
**Sprache:** DE
**Status:** Implementiert

---

## Übersicht

Die Terminauswahl ist der fünfte Schritt im Buchungswizard. Der Benutzer wählt aus vier automatisch generierten Terminvorschlägen den für ihn passenden Tag und die passende Uhrzeit aus. Alle Termine liegen in der Zukunft (ab morgen), fallen auf Werktage (Montag bis Samstag, kein Sonntag) und bieten Uhrzeiten zwischen 07:00 und 18:00 Uhr an. Der aktuell gewählte Termin wird zusätzlich im Warenkorb (Header-Cart-Dropdown) als Chip mit Datum und Uhrzeit angezeigt (AC-14).

Das Feature folgt dem Container/Presentational Pattern: Der `AppointmentSelectionContainerComponent` verwaltet die Daten über den `BookingStore`, während der `AppointmentCardComponent` die einzelnen Termin-Cards als reine Darstellungskomponente rendert.

---

## Benutzerführung

### Schritt 1: Seite aufrufen

**Beschreibung:** Der Benutzer gelangt nach Abschluss der Notizen-Seite (`/home/notes`) zur Terminauswahl (`/home/appointment`). Die Seite zeigt eine Überschrift ("Wählen Sie den für Sie passenden Tag und Uhrzeit aus") sowie vier Termin-Cards. Jede Card zeigt einen Wochentag-Kreis (z.B. "Mi"), das Datum im Format DD.MM.YYYY und die Uhrzeit (z.B. "09:00 Uhr"). Der Weiter-Button ist zunächst deaktiviert.

### Schritt 2: Termin auswählen

**Beschreibung:** Der Benutzer klickt auf eine der vier Termin-Cards. Die gewählte Card erhält ein visuelles Highlighting (farbiger Akzentrand). Andere zuvor gewählte Cards werden automatisch deselektiert (Single-Select). Der Weiter-Button wird aktiviert. Die Auswahl ist auch per Tastatur möglich (Tab + Enter/Space).

### Schritt 3: Weiter zum nächsten Schritt

**Beschreibung:** Nach der Terminauswahl klickt der Benutzer auf "Weiter". Der gewählte Termin wird im BookingStore gespeichert und die Navigation zum nächsten Wizard-Schritt erfolgt.

### Alternative: Zurück zur Notizen-Seite

**Beschreibung:** Über den "Zurück"-Button navigiert der Benutzer zurück zur Notizen-Seite (`/home/notes`). Alle bisherigen Eingaben (Marke, Standort, Services, Notizen) bleiben im Store erhalten.

### Alternative: Werkstattkalender-Link

**Beschreibung:** Der Link "Hier sehen Sie weitere freie Termine in unserem Werkstattkalender" ist unterstrichen und klickbar, löst im Click-Dummy jedoch keine Navigation aus (`event.preventDefault()`).

### Warenkorb-Integration (AC-14)

**Beschreibung:** Sobald ein Termin ausgewählt wird, erscheint dieser im Warenkorb-Dropdown des Headers als Chip mit Datum und Uhrzeit (z.B. "25.02.2026 - 09:00 Uhr"). Bei einem Terminwechsel wird der Chip automatisch aktualisiert und zeigt immer den aktuell selektierten Termin an. Die Anzeige erfolgt unterhalb der gewählten Services im Cart-Dropdown.

---

## Akzeptanzkriterien

| AC | Beschreibung | Status |
|----|-------------|--------|
| AC-1 | Seite zeigt Überschrift "Wählen Sie den für Sie passenden Tag und Uhrzeit aus" | Implementiert |
| AC-2 | Vier Terminvorschlag-Cards werden angezeigt | Implementiert |
| AC-3 | Jede Card zeigt: Wochentag-Kürzel (im Kreis), Datum (DD.MM.YYYY) und Uhrzeit (HH:MM Uhr) | Implementiert |
| AC-4 | Alle Termine liegen in der Zukunft (ab morgen) | Implementiert |
| AC-5 | Kein Termin fällt auf einen Sonntag | Implementiert |
| AC-6 | Uhrzeiten liegen zwischen 07:00 und 18:00 Uhr | Implementiert |
| AC-7 | Ein Klick auf eine Card selektiert den Termin (Single-Select) | Implementiert |
| AC-8 | Selektierte Card zeigt visuelles Highlighting | Implementiert |
| AC-9 | Kalender-Link ist unterstrichen und klickbar (keine Navigation) | Implementiert |
| AC-10 | Zurück-Button navigiert zu `/home/notes` | Implementiert |
| AC-11 | Weiter-Button speichert Termin im BookingStore und navigiert weiter | Implementiert |
| AC-12 | Weiter-Button ist disabled ohne Terminauswahl | Implementiert |
| AC-13 | Von `/home/notes` navigiert Weiter zu `/home/appointment` | Implementiert |
| AC-14 | Gewählter Termin wird im Warenkorb (Header-Cart-Dropdown) als Chip angezeigt | Implementiert |

---

## Responsive Ansichten

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

Die vier Termin-Cards werden nebeneinander in einer Reihe dargestellt (4-Spalten-Layout). Der Zurück- und Weiter-Button sind am unteren Rand links und rechts positioniert.

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

Die Termin-Cards werden in einem 2x2-Grid angeordnet. Alle Bedienelemente bleiben vollständig sichtbar und touch-freundlich.

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

Die Termin-Cards werden in einer einzelnen Spalte vertikal gestapelt. Die Buttons sind vollflächig und mit mindestens 2.75em Touch-Target-Größe ausgestattet.

---

## Barrierefreiheit

- **Tastaturnavigation:** Alle Termin-Cards sind per Tab erreichbar und per Enter oder Space auswählbar. Das Grid verwendet `role="radiogroup"`, die einzelnen Cards `role="radio"` mit `aria-checked`-Attribut.
- **Screen Reader:** Jede Card besitzt ein beschreibendes `aria-label` im Format "Mo, 25.02.2026, 09:00 Uhr". Der Wochentag-Kreis ist mit `aria-hidden="true"` ausgeblendet, da die Information bereits im `aria-label` der Card enthalten ist. Das Grid hat ein eigenes `aria-label` ("Terminvorschläge").
- **Farbkontrast:** WCAG 2.1 AA konform mit mindestens 4.5:1 Kontrastverhältnis.
- **Focus-Styles:** `:focus-visible` Ring mit `var(--color-primary)` Outline auf Cards und Buttons.

---

## Technische Details

| Eigenschaft | Wert |
|-------------|------|
| Route | `/#/home/appointment` |
| Container Component | `AppointmentSelectionContainerComponent` |
| Presentational Component | `AppointmentCardComponent` |
| Store | `BookingStore` (providedIn: 'root') |
| API Service | `AppointmentApiService` |
| Guard | `servicesSelectedGuard` |
| Resolver | `appointmentsResolver` |
| Change Detection | OnPush |
| i18n Keys | `booking.appointment.*` |

---

## i18n Keys

| Key | DE | EN |
|-----|----|----|
| `booking.appointment.title` | Wählen Sie den für Sie passenden Tag und Uhrzeit aus | Select your preferred day and time |
| `booking.appointment.calendarLink` | Hier sehen Sie weitere freie Termine in unserem Werkstattkalender | Here you can see more available appointments in our workshop calendar |
| `booking.appointment.backButton` | Zurück | Back |
| `booking.appointment.continueButton` | Weiter | Continue |
| `booking.appointment.ariaGroupLabel` | Terminvorschläge | Appointment suggestions |
| `booking.appointment.card.ariaLabel` | {{dayAbbr}}, {{date}}, {{time}} | {{dayAbbr}}, {{date}}, {{time}} |
| `header.cart.appointmentLabel` | Termin | Appointment |

---

## Komponentenarchitektur

```
AppointmentSelectionContainerComponent (Container)
  ├── inject(BookingStore)
  ├── OnPush Change Detection
  ├── Methoden: onAppointmentSelect(), onContinue(), onBack(), onCalendarLinkClick()
  └── Template:
      └── AppointmentCardComponent (Presentational) x4
          ├── input(appointment: AppointmentSlot)
          ├── input(isSelected: boolean)
          └── output(appointmentSelected: EventEmitter)
```

**Store-Erweiterung:**
- `appointments: AppointmentSlot[]` -- Verfügbare Terminvorschläge
- `selectedAppointment: AppointmentSlot | null` -- Aktuell gewählter Termin
- `hasAppointmentSelected: boolean` -- Computed Signal
- `loadAppointments()` -- rxMethod zum Laden
- `selectAppointment(appointment)` -- Termin setzen
- `clearSelectedAppointment()` -- Auswahl zurücksetzen

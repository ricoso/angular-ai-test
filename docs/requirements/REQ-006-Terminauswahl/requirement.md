# REQ-006: Terminauswahl

**Status:** In Progress
**Priority:** High
**Type:** Functional
**Created:** 2026-02-23
**Author:** Claude Code
**Wizard-Schritt:** 5 von 8+

---

## 1. Overview

### 1.1 Purpose
Der Benutzer wählt aus vier vorgeschlagenen Terminen den für ihn passenden Tag und Uhrzeit aus. Alle Terminvorschläge liegen in der Zukunft und berücksichtigen Werktage (Mo–Sa, kein Sonntag). Uhrzeiten liegen im Bereich 07:00–18:00 Uhr.

### 1.2 Scope
**Included:**
- Überschrift "Wählen Sie den für Sie passenden Tag und Uhrzeit aus"
- 4 Terminvorschlag-Cards mit Wochentag-Kürzel, Datum und Uhrzeit
- Single-Select: Auswahl eines Termins
- Link "Hier sehen Sie weitere freie Termine in unserem Werkstattkalender" (unterstrichen, nirgendwohin)
- Navigation: Zurück-Button (→ `/home/notes`) + Weiter-Button (→ nächster Schritt)
- Speichern des gewählten Termins im BookingStore

**Excluded:**
- Echter Werkstattkalender (Click-Dummy: statische Daten)
- Terminbestätigung per E-Mail
- Notizfeld (→ REQ-005)

### 1.3 Related Requirements
- REQ-001: Header (aktiv auf dieser Seite)
- REQ-004-Serviceauswahl (vorheriger Wizard-Schritt, liefert `selectedServices`)
- REQ-005-Notizen (direkt vorheriger Schritt, Zurück navigiert hierhin)
- REQ-007+ (nächster Wizard-Schritt)

---

## 2. User Story

**Als** Kunde
**möchte ich** aus vorgeschlagenen Terminen den passenden Tag und die passende Uhrzeit auswählen
**damit** ich meinen Werkstattbesuch gezielt planen kann.

**Acceptance Criteria:**
- [ ] AC-1: Seite zeigt Überschrift "Wählen Sie den für Sie passenden Tag und Uhrzeit aus"
- [ ] AC-2: Vier Terminvorschlag-Cards werden angezeigt
- [ ] AC-3: Jede Card zeigt: Wochentag-Kürzel (links, im Kreis), Datum (DD.MM.YYYY) und Uhrzeit (HH:MM Uhr)
- [ ] AC-4: Alle Termine liegen in der Zukunft (ab morgen)
- [ ] AC-5: Kein Termin fällt auf einen Sonntag
- [ ] AC-6: Uhrzeiten liegen zwischen 07:00 und 18:00 Uhr
- [ ] AC-7: Ein Klick auf eine Card selektiert den Termin (Single-Select, andere werden deselektiert)
- [ ] AC-8: Selektierte Card zeigt visuelles Highlighting
- [ ] AC-9: Text "Hier sehen Sie weitere freie Termine in unserem Werkstattkalender" ist unterstrichen und klickbar (keine Navigation)
- [ ] AC-10: Zurück-Button navigiert zu `/home/notes`
- [ ] AC-11: Weiter-Button speichert den gewählten Termin im BookingStore und navigiert zum nächsten Schritt
- [ ] AC-12: Weiter-Button ist disabled, wenn kein Termin gewählt ist
- [ ] AC-13: Von `/home/notes` (REQ-005) navigiert der Weiter-Button zu `/home/appointment`

---

## 3. Preconditions

### 3.1 System
- BookingStore verfügbar
- Header-Component (REQ-001) aktiv

### 3.2 User
- Benutzer hat `/home/appointment` aufgerufen

### 3.3 Data
- Terminvorschläge sind statisch generiert (Click-Dummy)
- Termine werden zur Laufzeit berechnet: 4 nächste Werktage (Mo–Sa) ab heute+1

### 3.4 Übergabe (Input von REQ-005-Notizen)
| Feld | Typ | Quelle | Pflicht |
|------|-----|--------|---------|
| `BookingStore.selectedBrand` | `Brand` | REQ-002 | **Ja** — Guard prüft |
| `BookingStore.selectedLocation` | `LocationDisplay` | REQ-003 | **Ja** — Guard prüft |
| `BookingStore.selectedServices` | `SelectedService[]` | REQ-004 | **Ja** — Guard prüft |

---

## 4. Main Flow

**Step 1:** Seite wird geladen
- **System:** Generiert 4 Terminvorschläge (nächste Werktage, Mo–Sa, 07:00–18:00)
- **System:** Zeigt Überschrift + 4 Termin-Cards

**Step 2:** Benutzer wählt einen Termin
- **User:** Klickt auf eine Termin-Card
- **System:** Card wird selektiert (Highlighting), zuvor gewählte Card wird deselektiert
- **System:** Weiter-Button wird aktiviert

**Step 3:** Benutzer klickt "Weiter"
- **User:** Klickt Weiter-Button
- **System:** Speichert `selectedAppointment` im BookingStore
- **System:** Navigiert zum nächsten Wizard-Schritt

**Mockup:**
![Terminauswahl](./mockup.png)

---

## 5. Alternative Flows

### 5.1 Zurück zur Notizseite

**Trigger:** Benutzer klickt Zurück-Button

**Flow:**
1. System navigiert zu `/home/notes`
2. Gewählte Services und Notizen bleiben im Store

### 5.2 Weiterer Kalender-Link

**Trigger:** Benutzer klickt "Hier sehen Sie weitere freie Termine..."

**Flow:**
1. Link ist klickbar (cursor: pointer, unterstrichen)
2. Keine Navigation (Click-Dummy: `event.preventDefault()`)

### 5.3 Termin-Wechsel

**Trigger:** Benutzer klickt auf anderen Termin (anderer bereits gewählt)

**Flow:**
1. Neue Card wird selektiert
2. Vorherige Card wird deselektiert
3. BookingStore beim Weiter-Klick aktualisiert

---

## 6. Exception Flows

### 6.1 Kein Service gewählt

**Trigger:** Direktaufruf von `/home/appointment` ohne gewählte Services

**Flow:**
1. Guard prüft `BookingStore.selectedServices`
2. Redirect zu `/home/services`

### 6.2 Kein Standort gewählt

**Trigger:** Direktaufruf ohne Standort

**Flow:**
1. Guard prüft `BookingStore.selectedLocation`
2. Redirect zu `/home/location`

### 6.3 Keine Marke gewählt

**Trigger:** Direktaufruf ohne Marke

**Flow:**
1. Guard prüft `BookingStore.selectedBrand`
2. Redirect zu `/home/brand`

---

## 7. Postconditions

### 7.1 Success — Übergabe an REQ-007+
| Feld | Typ | Wert | Beschreibung |
|------|-----|------|--------------|
| `BookingStore.selectedBrand` | `Brand` | z.B. `'audi'` | Von REQ-002 (unverändert) |
| `BookingStore.selectedLocation` | `LocationDisplay` | z.B. `{ id: 'muc', name: 'München' }` | Von REQ-003 (unverändert) |
| `BookingStore.selectedServices` | `SelectedService[]` | z.B. `[{ serviceId: 'huau', ... }]` | Von REQ-004 (unverändert) |
| `BookingStore.selectedAppointment` | `AppointmentSlot` | z.B. `{ date: '2026-02-25', displayDate: '25.02.2026', dayAbbreviation: 'Mi', time: '09:00', displayTime: '09:00 Uhr' }` | **Neu gewählt** |

### 7.2 Failure
- Keine Änderungen am Store
- Error wird geloggt

---

## 8. Business Rules

- **BR-1:** Genau 4 Terminvorschläge werden angezeigt
- **BR-2:** Alle Termine liegen in der Zukunft (mindestens morgen)
- **BR-3:** Kein Termin fällt auf einen Sonntag (JS `getDay() === 0`)
- **BR-4:** Uhrzeiten: 07:00–18:00 Uhr
- **BR-5:** Wochentag-Abkürzungen: Mo, Di, Mi, Do, Fr, Sa (kein So)
- **BR-6:** Single-Select: Nur ein Termin kann gleichzeitig gewählt sein
- **BR-7:** Weiter-Button erst aktiv nach Terminauswahl
- **BR-8:** Termine sind statisch generiert (Click-Dummy, kein API-Call)

---

## 9. Non-Functional Requirements

### Performance
- Seitenaufbau < 300ms (statische Daten, keine API-Calls)

### Security
- HTTPS only
- Keine Benutzerdaten in URL-Parametern

### Usability
- Mobile-First: Cards stacken vertikal (1 Spalte)
- Touch-friendly: Min 2.75em Touch-Targets
- WCAG 2.1 AA: Kontrast, Focus-Styles, Keyboard-Navigation
- Tastatur: Cards per Tab + Enter/Space auswählbar

---

## 10. Data Model

```typescript
/**
 * Day abbreviation type for German weekdays (Monday–Saturday, no Sunday)
 * DE: Wochentag-Abkürzung / EN: Day abbreviation
 */
type DayAbbreviation = 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa';

/**
 * Single appointment slot proposal
 * DE: Terminvorschlag / EN: Appointment slot
 */
interface AppointmentSlot {
  id: string;                        // unique, e.g. '2026-02-25-09-00'
  date: string;                      // ISO date string, e.g. '2026-02-25'
  displayDate: string;               // formatted DE, e.g. '25.02.2026'
  dayAbbreviation: DayAbbreviation;  // e.g. 'Mi'
  time: string;                      // e.g. '09:00'
  displayTime: string;               // e.g. '09:00 Uhr'
}
```

**BookingStore-Erweiterung (bestehenden Store erweitern):**
```typescript
interface BookingState {
  // ... existing fields (brands, selectedBrand, locations, selectedLocation, services, selectedServices, isLoading, error) ...
  appointments: AppointmentSlot[];
  selectedAppointment: AppointmentSlot | null;
}
```

---

## 11. UI/UX

### Layout

| Element | Typ | Beschreibung |
|---------|-----|--------------|
| Überschrift | `h1` | "Wählen Sie den für Sie passenden Tag und Uhrzeit aus" |
| Termin-Grid | Grid/Flexbox | 4 Cards nebeneinander (Desktop), 2x2 (Tablet), 1 Spalte (Mobile) |
| Termin-Card | Card (auswählbar) | Wochentag-Kreis + Datum + Uhrzeit |
| Wochentag-Kreis | `.appointment-card__day` | Runder Kreis, `var(--color-primary)` Hintergrund, weißer Text |
| Datum | `.appointment-card__date` | z.B. "25.02.2026" |
| Uhrzeit | `.appointment-card__time` | z.B. "09:00 Uhr" |
| Kalender-Link | `a` | "Hier sehen Sie weitere freie Termine in unserem Werkstattkalender" (underline) |
| Zurück-Button | `button[mat-flat-button]` | `arrow_back` Icon (`.icon-framed`) + "Zurück" |
| Weiter-Button | `button[mat-flat-button]` | "Weiter" + `arrow_forward` Icon (`.icon-framed`) |

### Material Components
- `mat-flat-button` — Zurück/Weiter Buttons (IMMER filled, kein stroked)
- `mat-icon` — `arrow_back`, `arrow_forward` mit `.icon-framed`

### Responsive Verhalten
- **Mobile (< 48em):** 1 Spalte, Cards gestapelt
- **Tablet (>= 48em):** 2x2 Grid
- **Desktop (>= 64em):** 4 Cards in einer Reihe

### Card-States
| State | Visuell |
|-------|---------|
| Default | `var(--color-background-surface)`, Rand neutral |
| Hover | leichte Elevation, Hintergrundfarbe-Änderung |
| Selected | `var(--color-primary)` Akzentrand, Wochentag-Kreis highlighted |
| Focus | `:focus-visible` Ring `var(--color-primary)` |

### Design-Hinweis
- Helles Theme aus `_variables.scss` (NICHT dunkel wie im Referenz-Screenshot!)
- Cards: `var(--color-background-surface)` (weiß)
- Icons: IMMER mit `.icon-framed` Rahmen

---

## 12. API Specification

```http
GET /api/appointments
```

> Click-Dummy: Termine werden client-seitig generiert (kein echter API-Call).

**AppointmentApiService:**
```typescript
// Generates 4 future weekday slots (no Sunday), times between 07:00–18:00
async getAppointments(): Promise<AppointmentSlot[]>
```

---

## 13. Test Cases

### TC-1: Seite laden (AC-1, AC-2, AC-3)
- **Given:** Marke + Standort + Services gewählt
- **When:** Seite `/home/appointment` wird geladen
- **Then:** 4 Termin-Cards mit Wochentag, Datum und Uhrzeit sichtbar; Überschrift korrekt

### TC-2: Termin wählen (AC-7, AC-8)
- **Given:** 4 Cards angezeigt, kein Termin gewählt
- **When:** Klick auf erste Card
- **Then:** Card selektiert (Highlighting), Weiter-Button aktiv

### TC-3: Termin wechseln (5.3)
- **Given:** Erster Termin gewählt
- **When:** Klick auf zweite Card
- **Then:** Zweite Card selektiert, erste deselektiert

### TC-4: Keine Sonntage (AC-5, BR-3)
- **Given:** Seite geladen
- **When:** Wochentage der Cards geprüft
- **Then:** Kein "So" im Wochentag-Kürzel

### TC-5: Zukunftsdaten (AC-4, BR-2)
- **Given:** Aktuelles Datum bekannt
- **When:** Termine generiert
- **Then:** Alle Termine nach heutigem Datum

### TC-6: Uhrzeiten (AC-6, BR-4)
- **Given:** Termine generiert
- **When:** Zeiten geprüft
- **Then:** Alle Zeiten zwischen 07:00 und 18:00 Uhr

### TC-7: Weiter disabled ohne Auswahl (AC-12, BR-7)
- **Given:** Keine Terminauswahl
- **When:** Weiter-Button angezeigt
- **Then:** Button disabled

### TC-8: Weiter-Navigation (AC-11)
- **Given:** Termin gewählt
- **When:** Klick auf Weiter
- **Then:** `selectedAppointment` im Store, Navigation zum nächsten Schritt

### TC-9: Zurück-Navigation (AC-10, 5.1)
- **Given:** Seite geladen
- **When:** Klick auf Zurück
- **Then:** Navigation zu `/home/notes`

### TC-10: Kalender-Link (AC-9, 5.2)
- **Given:** Link sichtbar
- **When:** Klick
- **Then:** Keine Seitennavigation; Link unterstrichen

### TC-11: Guard — keine Services (6.1)
- **Given:** Keine Services im Store
- **When:** Direktaufruf `/home/appointment`
- **Then:** Redirect zu `/home/services`

### TC-12: Keyboard-Navigation
- **Given:** Seite geladen
- **When:** Tab + Enter/Space
- **Then:** Focus-Ring sichtbar, Card auswählbar per Tastatur

---

## 14. Implementation

### Components
- [ ] `AppointmentSelectionContainerComponent` — Container (`inject(BookingStore)`, OnPush, 3 Dateien)
- [ ] `AppointmentCardComponent` — Presentational, `input(appointment)`, `input(isSelected)`, `output(appointmentSelected)` (3 Dateien)

### Services
- [ ] `AppointmentApiService` — Generiert statische Terminvorschläge (Click-Dummy)

### Store Extension
- [ ] BookingStore um `appointments`, `selectedAppointment`, `loadAppointments()`, `selectAppointment()`, `clearSelectedAppointment()`, `hasAppointmentSelected` erweitern

### Guard
- [ ] `servicesSelectedGuard` — Prüft `BookingStore.selectedServices.length > 0`

### Resolver
- [ ] `appointmentsResolver` — Lädt Termine via `BookingStore.loadAppointments()`

### Route
```typescript
{
  path: 'appointment',
  loadComponent: () => import('./components/appointment-selection/appointment-selection-container.component')
    .then(m => m.AppointmentSelectionContainerComponent),
  canActivate: [servicesSelectedGuard],
  resolve: { _: appointmentsResolver }
}
```

### Folder
```
src/app/features/booking/
├── components/appointment-selection/
│   ├── appointment-selection-container.component.ts
│   ├── appointment-selection-container.component.html
│   ├── appointment-selection-container.component.scss
│   ├── appointment-card.component.ts
│   ├── appointment-card.component.html
│   └── appointment-card.component.scss
├── models/
│   └── appointment.model.ts
├── services/
│   └── appointment-api.service.ts
├── guards/
│   └── services-selected.guard.ts
└── resolvers/
    └── appointments.resolver.ts
```

---

## 15. Dependencies

**Requires:**
- REQ-001: Header
- REQ-002-Markenauswahl (liefert `selectedBrand`)
- REQ-003-Standortwahl (liefert `selectedLocation`)
- REQ-004-Serviceauswahl (liefert `selectedServices`)
- REQ-005-Notizen (direkt vorheriger Schritt, Zurück-Navigation)

**Blocks:**
- REQ-007+ (nächster Wizard-Schritt, benötigt `selectedAppointment`)

---

## 16. Naming Glossary

### Container Methods
| Methode | Beschreibung |
|---------|--------------|
| `onAppointmentSelect(appointment)` | Termin-Card geklickt → Termin selektieren |
| `onContinue()` | Weiter-Button → Store + Navigation |
| `onBack()` | Zurück-Button → Navigation zu `/home/notes` |
| `onCalendarLinkClick(event)` | Kalender-Link → `event.preventDefault()` |

### API Service
| Methode | Beschreibung |
|---------|--------------|
| `getAppointments()` | Generiert 4 statische Terminvorschläge (Werktage Mo–Sa, kein So) |

### Signal Store Methods
| Methode | Beschreibung |
|---------|--------------|
| `loadAppointments()` | Termine laden via rxMethod |
| `selectAppointment(appointment)` | Ausgewählten Termin setzen |
| `clearSelectedAppointment()` | Terminauswahl zurücksetzen |

### Computed Signals
| Signal | Beschreibung |
|--------|--------------|
| `appointments` | Verfügbare Terminvorschläge |
| `selectedAppointment` | Aktuell gewählter Termin |
| `hasAppointmentSelected` | Boolean — Termin gewählt |

### Types
| Typ | Beschreibung |
|-----|--------------|
| `AppointmentSlot` | Einzelner Terminvorschlag |
| `DayAbbreviation` | `'Mo' \| 'Di' \| 'Mi' \| 'Do' \| 'Fr' \| 'Sa'` |

---

## 17. i18n Keys

```typescript
// DE
booking: {
  appointment: {
    title: 'Wählen Sie den für Sie passenden Tag und Uhrzeit aus',
    calendarLink: 'Hier sehen Sie weitere freie Termine in unserem Werkstattkalender',
    backButton: 'Zurück',
    continueButton: 'Weiter',
    ariaGroupLabel: 'Terminvorschläge',
    card: {
      ariaLabel: '{{dayAbbr}}, {{date}}, {{time}}'
    }
  }
}

// EN
booking: {
  appointment: {
    title: 'Select your preferred day and time',
    calendarLink: 'Here you can see more available appointments in our workshop calendar',
    backButton: 'Back',
    continueButton: 'Continue',
    ariaGroupLabel: 'Appointment suggestions',
    card: {
      ariaLabel: '{{dayAbbr}}, {{date}}, {{time}}'
    }
  }
}
```

---

## 18. Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Tech Lead | | |

---

## 19. Implementation Notes

**WICHTIG: Code muss BILINGUAL sein!**

- Kommentare DE + EN
- Error Messages Englisch
- i18n Keys für beide Sprachen
- JSDoc bilingual

**Design-System:**
- KEINE Farben aus Screenshots!
- IMMER `_variables.scss` verwenden
- Helles Theme (nicht dunkel wie in Screenshots)
- Cards: `var(--color-background-surface)` (weiß)
- Icons: IMMER mit `.icon-framed` Rahmen
- Wochentag-Kreis: `var(--color-primary)` als Hintergrundfarbe

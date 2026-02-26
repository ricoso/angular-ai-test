# REQ-008: Werkstattkalender

**Status:** In Progress
**Priority:** High
**Type:** Functional
**Created:** 2026-02-25
**Author:** Claude Code
**Wizard-Schritt:** 5b (Erweiterung von REQ-006-Terminauswahl)

---

## 1. Overview

### 1.1 Purpose
Der Benutzer gelangt auf diese Seite, indem er auf der Terminauswahl-Seite (REQ-006) auf den Link "Hier sehen Sie weitere freie Termine in unserem Werkstattkalender" klickt. Hier kann er über einen DatePicker einen Wunschtermin wählen und erhält daraufhin alle verfügbaren Uhrzeiten der nächsten 3 Werktage ab dem gewählten Datum angezeigt. Er kann anschließend eine gewünschte Uhrzeit auswählen.

### 1.2 Scope
**Included:**
- Überschrift "Hier sehen Sie weitere freie Termine in unserem Werkstattkalender"
- Linke Karte: Beschreibungstext + Label "Ihr Wunschtermin:" + DatePicker-Eingabefeld (DD.MM.YYYY)
- Rechte Seite vor Datumsauswahl: Hinweistext "Wählen Sie im Kalender einen gewünschten Termin aus..."
- Rechte Seite nach Datumsauswahl: Wechseltext + 3 Tage mit Uhrzeitslots (07:00–17:00 Uhr, stündlich)
- Single-Select für Uhrzeitslot
- Navigation: Zurück-Button (→ `/home/appointment`) + Weiter-Button (→ noch kein Ziel)
- Speichern des gewählten Termins im BookingStore (`selectedAppointment`)
- Kalenderlink auf der Terminauswahl-Seite (`/home/appointment`) navigiert zu `/home/workshop-calendar`

**Excluded:**
- Echter API-Call (Click-Dummy: Termine client-seitig generiert)
- Terminbestätigung per E-Mail
- Mehrtages-Ansicht mit blockierten Slots
- Kalenderwochen-Ansicht

### 1.3 Related Requirements
- REQ-001: Header (aktiv auf dieser Seite)
- REQ-006-Terminauswahl: Vorherige Seite — Link "Werkstattkalender" navigiert hierhin; Zurück navigiert zurück
- REQ-007+ (nächster Wizard-Schritt, noch nicht definiert)

---

## 2. User Story

**Als** Kunde
**möchte ich** einen Wunschtermin in einem Kalender auswählen und alle verfügbaren Uhrzeiten der nächsten 3 Werktage sehen
**damit** ich flexibel einen Werkstatttermin außerhalb der vier vorgeschlagenen Termine buchen kann.

**Acceptance Criteria:**
- [ ] AC-1: Überschrift "Hier sehen Sie weitere freie Termine in unserem Werkstattkalender" wird angezeigt
- [ ] AC-2: Linke Karte zeigt Beschreibungstext "Wählen Sie Ihren Wunschtermin. Wir zeigen Ihnen alle freien Termine ab diesem Tag an."
- [ ] AC-3: Label "Ihr Wunschtermin:" in Fett wird angezeigt
- [ ] AC-4: Kalender-Icon (mit `.icon-framed` Rahmen) und Eingabefeld mit Placeholder "Wunschtermin wählen" werden angezeigt
- [ ] AC-5: Eingabefeld akzeptiert nur Datumsangaben im Format DD.MM.YYYY
- [ ] AC-6: Klick auf das Eingabefeld öffnet einen MatDatepicker, der auf dem aktuellen Tag vorausgewählt ist
- [ ] AC-7: Das ausgewählte Datum kann manuell bearbeitet werden
- [ ] AC-8: Vor Datumsauswahl zeigt die rechte Seite: "Wählen Sie im Kalender einen gewünschten Termin aus und wir zeigen Ihnen die nächsten verfügbaren Termine"
- [ ] AC-9: Nach Datumsauswahl ändert sich der rechte Text zu: "Wir haben folgende ab dem von Ihnen ausgewählten Datum verfügbaren Termine für Sie gefunden. Klicken Sie auf eine Uhrzeit, um den Termin auszuwählen."
- [ ] AC-10: Nach Datumsauswahl werden 3 Tage mit Uhrzeitslots von 07:00 bis 17:00 Uhr (stündlich) angezeigt
- [ ] AC-11: Jeder Tag wird als Tageskopf angezeigt (Format: "Mo, 02.03.2026")
- [ ] AC-12: Die 3 angezeigten Tage sind Werktage (Mo–Sa, kein Sonntag) ab dem gewählten Datum
- [ ] AC-13: Klick auf eine Uhrzeit selektiert den Termin (Single-Select)
- [ ] AC-14: Zurück-Button navigiert zu `/home/appointment`
- [ ] AC-15: Weiter-Button ist disabled, solange kein Uhrzeitslot gewählt ist; erst nach Slot-Auswahl klickbar (Ziel noch nicht definiert)
- [ ] AC-16: Kalenderlink auf `/home/appointment` ("Hier sehen Sie weitere freie Termine...") navigiert zu `/home/workshop-calendar`

---

## 3. Preconditions

### 3.1 System
- BookingStore verfügbar
- Header-Component (REQ-001) aktiv
- `MatDatepickerModule`, `MatInputModule` importiert

### 3.2 User
- Benutzer hat `/home/workshop-calendar` aufgerufen (via Link auf REQ-006)

### 3.3 Data
- Termine werden client-seitig generiert (Click-Dummy, kein API-Call)
- Uhrzeitslots: 07:00, 08:00, 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00 (11 Slots/Tag)
- 3 Tage werden berechnet: nächste 3 Werktage (Mo–Sa, kein Sonntag) ab gewähltem Datum

### 3.4 Übergabe (Input von REQ-006-Terminauswahl)
| Feld | Typ | Quelle | Pflicht |
|------|-----|--------|---------|
| `BookingStore.selectedBrand` | `Brand` | REQ-002 | **Ja** — Guard prüft |
| `BookingStore.selectedLocation` | `LocationDisplay` | REQ-003 | **Ja** — Guard prüft |
| `BookingStore.selectedServices` | `SelectedService[]` | REQ-004 | **Ja** — Guard prüft |

---

## 4. Main Flow

**Step 1:** Seite wird geladen
- **System:** Rendert linke Karte mit Beschreibungstext + leerem DatePicker-Feld
- **System:** Zeigt rechts den Hinweistext (Vor-Auswahl)

**Step 2:** Benutzer klickt auf das Eingabefeld
- **User:** Klickt auf Feld "Wunschtermin wählen"
- **System:** MatDatepicker öffnet sich, aktuelles Datum ist vorausgewählt

**Step 3:** Benutzer wählt ein Datum
- **User:** Wählt ein Datum im DatePicker oder gibt DD.MM.YYYY manuell ein
- **System:** Datum erscheint im Eingabefeld
- **System:** Rechte Seite wechselt den Text zu "Wir haben folgende..."
- **System:** Berechnet 3 nächste Werktage ab gewähltem Datum
- **System:** Zeigt für jeden Tag Uhrzeitslots von 07:00 bis 17:00 Uhr

**Step 4:** Benutzer wählt eine Uhrzeit
- **User:** Klickt auf einen Uhrzeitslot
- **System:** Slot wird selektiert (visuelles Highlighting)
- **System:** `selectedAppointment` im BookingStore wird aktualisiert
- **System:** Weiter-Button wird aktiviert

**Step 5:** Benutzer klickt "Weiter"
- **User:** Klickt Weiter-Button
- **System:** Navigiert zum nächsten Wizard-Schritt (noch nicht definiert)

**Mockup:**
![Werkstattkalender](./mockup.png)

---

## 5. Alternative Flows

### 5.1 Manuelles Datum eingeben

**Trigger:** Benutzer tippt Datum direkt ins Textfeld

**Flow:**
1. Benutzer tippt im Format DD.MM.YYYY
2. Bei gültigem Datum: System zeigt Uhrzeitslots
3. Bei ungültigem Format: Fehlermeldung unter dem Feld

### 5.2 Zurück zur Terminauswahl

**Trigger:** Benutzer klickt Zurück-Button

**Flow:**
1. System navigiert zu `/home/appointment`
2. `selectedAppointment` bleibt im Store (falls bereits gesetzt)

### 5.3 Datum wechseln (nach erster Auswahl)

**Trigger:** Benutzer öffnet DatePicker erneut oder bearbeitet Textfeld

**Flow:**
1. Benutzer wählt neues Datum
2. System berechnet 3 neue Werktage ab neuem Datum
3. Zuvor selektierter Uhrzeitslot wird deselektiert

### 5.4 Gewähltes Datum liegt auf Sonntag

**Trigger:** Benutzer wählt Datum, das auf Sonntag fällt

**Flow:**
1. Erster angezeigter Tag ist der darauffolgende Montag
2. Slots werden ab Montag angezeigt

---

## 6. Exception Flows

### 6.1 Ungültiges Datumsformat

**Trigger:** Benutzer gibt Text ein, der nicht DD.MM.YYYY entspricht

**Flow:**
1. Reactive Form Validator prüft Format (Pattern: `^\d{2}\.\d{2}\.\d{4}$`)
2. Fehlermeldung anzeigen: "Bitte geben Sie ein Datum im Format TT.MM.JJJJ ein"
3. Uhrzeitslots werden nicht angezeigt

### 6.2 Datum in der Vergangenheit

**Trigger:** Benutzer gibt vergangenes Datum ein

**Flow:**
1. MatDatepicker: `[min]="today"` verhindert Auswahl vergangener Tage
2. Bei manueller Eingabe: Validator prüft `date >= today`
3. Fehlermeldung: "Bitte wählen Sie ein Datum ab heute"

### 6.3 Keine Services gewählt (Guard)

**Trigger:** Direktaufruf von `/home/workshop-calendar` ohne Services

**Flow:**
1. `servicesSelectedGuard` prüft `BookingStore.selectedServices`
2. Redirect zu `/home/services`

---

## 7. Postconditions

### 7.1 Success — Übergabe an nächsten Schritt
| Feld | Typ | Wert | Beschreibung |
|------|-----|------|--------------|
| `BookingStore.selectedBrand` | `Brand` | z.B. `'audi'` | Von REQ-002 (unverändert) |
| `BookingStore.selectedLocation` | `LocationDisplay` | z.B. `{ id: 'muc', name: 'München' }` | Von REQ-003 (unverändert) |
| `BookingStore.selectedServices` | `SelectedService[]` | z.B. `[{ serviceId: 'huau', ... }]` | Von REQ-004 (unverändert) |
| `BookingStore.selectedAppointment` | `AppointmentSlot` | z.B. `{ date: '2026-03-02', displayDate: '02.03.2026', dayAbbreviation: 'Mo', time: '09:00', displayTime: '09:00 Uhr' }` | **Neu gewählt** |

### 7.2 Failure
- Keine Änderungen am Store
- Error wird geloggt

---

## 8. Business Rules

- **BR-1:** Eingabefeld akzeptiert nur Format DD.MM.YYYY
- **BR-2:** Datum muss heute oder in der Zukunft liegen (`[min]="today"` im DatePicker)
- **BR-3:** Kein Termin fällt auf einen Sonntag (`getDay() === 0` wird übersprungen)
- **BR-4:** Uhrzeiten: 07:00, 08:00, ..., 17:00 (11 Slots stündlich)
- **BR-5:** Es werden genau 3 Werktage angezeigt
- **BR-6:** Single-Select: Nur ein Uhrzeitslot kann gleichzeitig gewählt sein (tagesübergreifend)
- **BR-7:** Weiter-Button erst aktiv nach Auswahl einer Uhrzeit
- **BR-8:** Termine sind client-seitig generiert (Click-Dummy, kein echter API-Call)
- **BR-9:** DatePicker ist auf aktuellem Tag standardmäßig ausgewählt beim Öffnen

---

## 9. Non-Functional Requirements

### Performance
- Seitenaufbau < 300ms (statische Daten, keine API-Calls)
- Slot-Generierung < 5ms (reine JavaScript-Berechnung)

### Security
- HTTPS only
- Keine Benutzerdaten in URL-Parametern
- Datumseingabe durch Reactive Forms Validator abgesichert

### Usability
- Mobile-First: Einspaltig (< 48em), zweispaltig (≥ 48em)
- Touch-friendly: Min 2.75em Touch-Targets für Uhrzeitslots
- WCAG 2.1 AA: Kontrast ≥ 4.5:1, Focus-Styles (`:focus-visible`), Keyboard-Navigation
- Uhrzeitslots per Tab + Enter/Space auswählbar
- `aria-live="polite"` auf rechtem Panel für Screenreader (Statuswechsel)

---

## 10. Data Model

```typescript
/**
 * A single time slot within a workshop calendar day
 * DE: Einzelner Uhrzeitslot im Werkstattkalender / EN: Workshop time slot
 */
interface WorkshopTimeSlot {
  id: string;             // unique, e.g. '2026-03-02-09-00'
  time: string;           // e.g. '09:00'
  displayTime: string;    // e.g. '09:00 Uhr'
}

/**
 * A single day with its available time slots
 * DE: Einzelner Tag mit Uhrzeitslots / EN: Workshop calendar day
 */
interface WorkshopCalendarDay {
  date: string;                     // ISO, e.g. '2026-03-02'
  displayDate: string;              // e.g. '02.03.2026'
  dayAbbreviation: DayAbbreviation; // e.g. 'Mo'
  displayHeading: string;           // e.g. 'Mo, 02.03.2026'
  slots: WorkshopTimeSlot[];
}

/**
 * View state for the workshop calendar page
 * DE: View-State für die Werkstattkalender-Seite / EN: Workshop calendar view state
 */
type WorkshopCalendarViewState = 'empty' | 'loading' | 'slots-visible';
```

**BookingStore-Erweiterung (bestehenden Store erweitern — KEIN neuer Store!):**
```typescript
interface BookingState {
  // ... existing fields (brands, selectedBrand, locations, selectedLocation,
  //     services, selectedServices, bookingNote, appointments,
  //     selectedAppointment, isLoading, error) ...
  workshopCalendarDate: string | null;         // ISO date, e.g. '2026-03-02'
  workshopCalendarDays: WorkshopCalendarDay[]; // 3 generated weekdays
}
```

**Bestehende Typen (aus `appointment.model.ts`) — unverändert verwenden:**
```typescript
type DayAbbreviation = 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa';
interface AppointmentSlot { /* ... bestehend ... */ }
```

---

## 11. UI/UX

### Mockup
![Werkstattkalender](./mockup.png)

### Layout

| Element | Typ | Beschreibung |
|---------|-----|--------------|
| Überschrift | `h1` | "Hier sehen Sie weitere freie Termine in unserem Werkstattkalender" |
| Seiten-Layout | CSS Grid | Zweispaltig (Desktop): linke Karte + rechter Bereich |
| Linke Karte | `mat-card` | Beschreibungstext + Label + DatePicker-Feld |
| Beschreibungstext | `p` | "Wählen Sie Ihren Wunschtermin. Wir zeigen Ihnen alle freien Termine ab diesem Tag an." |
| Label | `label` | **"Ihr Wunschtermin:"** (fett) |
| Kalender-Icon | `mat-icon` mit `.icon-framed` | `calendar_today` Icon links im Feld |
| DatePicker-Feld | `matInput` + `[matDatepicker]` | Placeholder "Wunschtermin wählen", Format DD.MM.YYYY |
| Rechter Bereich (leer) | `p` | "Wählen Sie im Kalender einen gewünschten Termin aus..." |
| Rechter Bereich (befüllt) | `div` | Intro-Text + 3 Tagesblöcke |
| Intro-Text | `p` | "Wir haben folgende ab dem von Ihnen ausgewählten Datum verfügbaren Termine..." |
| Tageskopf | `h2` | z.B. "Mo, 02.03.2026" (fett, zentriert) |
| Uhrzeitslot-Grid | CSS Grid (4 Spalten Desktop, 2 Spalten Mobile) | Uhrzeitslot-Buttons |
| Uhrzeitslot-Button | `button[mat-flat-button]` | z.B. "07:00 Uhr" (rounded corners) |
| Zurück-Button | `button[mat-flat-button]` | `arrow_back` + "Zurück" |
| Weiter-Button | `button[mat-flat-button color="primary"]` | "Weiter" + `arrow_forward` |

### Material Components
- `MatDatepickerModule` + `MatInputModule` — DatePicker-Feld
- `MatNativeDateModule` oder `MatMomentDateModule` — Datum-Adapter
- `mat-flat-button` — alle Buttons (IMMER filled, KEIN stroked)
- `mat-icon` mit `.icon-framed` — alle Icons

### Responsive Verhalten
- **Mobile (< 48em):** Einspaltig gestapelt; Uhrzeitslot-Grid: 2 Spalten
- **Tablet (≥ 48em):** Zweispaltig (linke Karte ca. 18em breit); Uhrzeitslot-Grid: 4 Spalten
- **Desktop (≥ 64em):** Zweispaltig verbreitert; Uhrzeitslot-Grid: 4 Spalten

### Slot-States
| State | Visuell |
|-------|---------|
| Default | `var(--color-background-surface)`, Rand `var(--color-border)` |
| Hover | leichte Elevation, `var(--color-primary)` Rand |
| Selected | `var(--color-primary)` Rand + Farbfill + Schrift primär |
| Focus | `:focus-visible` Ring `var(--color-focus-ring)` |

### Design-Hinweis
- Helles Theme aus `_variables.scss` (NICHT dunkel wie in Referenz-Screenshots!)
- Linke Karte: `var(--color-background-surface)` (weiß), `var(--shadow-medium)`
- Icons: IMMER mit `.icon-framed` Rahmen
- Buttons: IMMER `mat-flat-button` (filled), NIE `mat-stroked-button`

---

## 12. API Specification

```http
GET /api/workshop-calendar/slots?from=2026-03-02&days=3
```

> **Click-Dummy:** Slots werden vollständig client-seitig generiert. Kein echter API-Call.

**WorkshopCalendarApiService (statisch):**
```typescript
// Generates 3 weekday slots (no Sunday) starting from given ISO date
// Each day has 11 hourly slots from 07:00 to 17:00
async getWorkshopCalendarDays(fromDate: string): Promise<WorkshopCalendarDay[]>
```

---

## 13. Test Cases

### TC-1: Seite laden (AC-1, AC-2, AC-3, AC-4)
- **Given:** Services + Standort + Marke gewählt, User navigiert von REQ-006
- **When:** Seite `/home/workshop-calendar` geladen
- **Then:** Überschrift, Beschreibungstext, Label "Ihr Wunschtermin:", leeres DatePicker-Feld sichtbar

### TC-2: Vor Datumsauswahl (AC-8)
- **Given:** Seite geladen, kein Datum gewählt
- **When:** Rechte Seite betrachtet
- **Then:** Hinweistext sichtbar; keine Uhrzeitslots

### TC-3: DatePicker öffnen (AC-6)
- **Given:** Seite geladen
- **When:** Klick auf Eingabefeld
- **Then:** MatDatepicker öffnet sich, heute vorausgewählt

### TC-4: Datum auswählen (AC-9, AC-10, AC-11, AC-12)
- **Given:** DatePicker offen
- **When:** Benutzer wählt Datum (z.B. 26.02.2026)
- **Then:** Datum im Feld; rechter Text wechselt; 3 Werktage mit je 11 Uhrzeitslots angezeigt

### TC-5: Keine Sonntage (BR-3)
- **Given:** Benutzer wählt Datum
- **When:** Tagesköpfe geprüft
- **Then:** Kein "So" in Tagesköpfen

### TC-6: Uhrzeiten korrekt (BR-4)
- **Given:** Datum ausgewählt
- **When:** Uhrzeitslots geprüft
- **Then:** Slots von 07:00 bis 17:00 Uhr (11 Slots)

### TC-7: Uhrzeit wählen (AC-13)
- **Given:** Uhrzeitslots sichtbar
- **When:** Klick auf "09:00 Uhr"
- **Then:** Slot selektiert (Highlighting), andere Slots deselektiert; Weiter aktiv

### TC-7b: Weiter disabled ohne Slot-Auswahl (AC-15, BR-7)
- **Given:** Datum gewählt, Uhrzeitslots sichtbar, kein Slot selektiert
- **When:** Weiter-Button betrachtet
- **Then:** Button disabled

### TC-8: Datum manuell eingeben (5.1)
- **Given:** Eingabefeld leer
- **When:** Benutzer tippt "02.03.2026"
- **Then:** Gültiges Datum: Slots erscheinen; `workshopCalendarDate` gesetzt

### TC-9: Ungültiges Format (6.1)
- **Given:** Eingabefeld aktiv
- **When:** Benutzer tippt "abc"
- **Then:** Fehlermeldung "Bitte geben Sie ein Datum im Format TT.MM.JJJJ ein"; keine Slots

### TC-10: Vergangenheitsdatum (6.2)
- **Given:** Eingabefeld aktiv
- **When:** Benutzer wählt Datum in der Vergangenheit
- **Then:** DatePicker blockiert; bei manueller Eingabe Fehlermeldung

### TC-11: Zurück-Navigation (AC-14)
- **Given:** Seite geladen
- **When:** Klick auf Zurück
- **Then:** Navigation zu `/home/appointment`

### TC-12: Guard — keine Services (6.3)
- **Given:** Keine Services im Store
- **When:** Direktaufruf `/home/workshop-calendar`
- **Then:** Redirect zu `/home/services`

### TC-13: Keyboard-Navigation
- **Given:** Uhrzeitslots sichtbar
- **When:** Tab + Enter/Space
- **Then:** Focus-Ring sichtbar, Slot per Tastatur wählbar

### TC-14: Kalenderlink navigiert zum Werkstattkalender (AC-16)
- **Given:** Benutzer ist auf `/home/appointment`
- **When:** Klick auf "Hier sehen Sie weitere freie Termine in unserem Werkstattkalender"
- **Then:** Navigation zu `/home/workshop-calendar`

### TC-15: Datum wechseln (5.3)
- **Given:** Datum und Slot gewählt
- **When:** Benutzer wählt neues Datum
- **Then:** Neue 3 Tage angezeigt; vorheriger Slot deselektiert; `workshopCalendarDate` aktualisiert

---

## 14. Implementation

### Components
- [ ] `WorkshopCalendarContainerComponent` — Container (`inject(BookingStore)`, OnPush, 3 Dateien: `.ts`, `.html`, `.scss`)
- [ ] `WorkshopCalendarDatePickerComponent` — Presentational: `input(selectedDate)`, `output(dateSelected)` (3 Dateien)
- [ ] `WorkshopCalendarDayComponent` — Presentational: `input(day: WorkshopCalendarDay)`, `input(selectedSlotId)`, `output(slotSelected)` (3 Dateien)

### Services
- [ ] `WorkshopCalendarApiService` — Generiert statische Termine: `getWorkshopCalendarDays(fromDate: string): Promise<WorkshopCalendarDay[]>`

### Store Extension (BookingStore erweitern)
- [ ] `workshopCalendarDate: string | null` — State-Feld hinzufügen
- [ ] `workshopCalendarDays: WorkshopCalendarDay[]` — State-Feld hinzufügen
- [ ] `setWorkshopCalendarDate(date: string)` — Datum setzen
- [ ] `loadWorkshopCalendarDays(fromDate: string)` — Slots laden via `rxMethod`
- [ ] `hasWorkshopSlotSelected` — Computed Signal

### Models
- [ ] `src/app/features/booking/models/workshop-calendar.model.ts` — `WorkshopTimeSlot`, `WorkshopCalendarDay`, `WorkshopCalendarViewState`

### Guard
- [ ] `servicesSelectedGuard` — bestehend, unverändert wiederverwenden

### Route
```typescript
{
  path: 'workshop-calendar',
  loadComponent: () => import('./components/workshop-calendar/workshop-calendar-container.component')
    .then(m => m.WorkshopCalendarContainerComponent),
  canActivate: [servicesSelectedGuard]
}
```

### Folder
```
src/app/features/booking/
├── components/workshop-calendar/
│   ├── workshop-calendar-container.component.ts
│   ├── workshop-calendar-container.component.html
│   ├── workshop-calendar-container.component.scss
│   ├── workshop-calendar-date-picker.component.ts
│   ├── workshop-calendar-date-picker.component.html
│   ├── workshop-calendar-date-picker.component.scss
│   ├── workshop-calendar-day.component.ts
│   ├── workshop-calendar-day.component.html
│   └── workshop-calendar-day.component.scss
├── models/
│   └── workshop-calendar.model.ts
└── services/
    └── workshop-calendar-api.service.ts
```

---

## 15. Dependencies

**Requires:**
- REQ-001: Header
- REQ-002-Markenauswahl (liefert `selectedBrand`)
- REQ-003-Standortwahl (liefert `selectedLocation`)
- REQ-004-Serviceauswahl (liefert `selectedServices`)
- REQ-006-Terminauswahl (Vorherige Seite, Zurück-Navigation)

**Blocks:**
- REQ-007+ (nächster Wizard-Schritt, benötigt `selectedAppointment`)

---

## 16. Naming Glossary

### Container Methods
| Methode | Beschreibung |
|---------|--------------|
| `onDateSelected(date: Date)` | DatePicker-Auswahl → Store + Slots laden |
| `onSlotSelected(slot: WorkshopTimeSlot, day: WorkshopCalendarDay)` | Uhrzeitslot geklickt → `selectAppointment()` |
| `onContinue()` | Weiter-Button → Navigation zum nächsten Schritt |
| `onBack()` | Zurück-Button → Navigation zu `/home/appointment` |

### API Service
| Methode | Beschreibung |
|---------|--------------|
| `getWorkshopCalendarDays(fromDate: string)` | Gibt 3 Werktage (Mo–Sa) ab `fromDate` zurück, je 11 Uhrzeitslots |
| `generateDaySlots(date: Date)` | Generiert 11 Uhrzeitslots (07:00–17:00) für einen Tag |
| `getNextWorkdays(fromDate: Date, count: number)` | Berechnet nächste n Werktage (kein Sonntag) |

### Signal Store Methods (Erweiterung)
| Methode | Beschreibung |
|---------|--------------|
| `setWorkshopCalendarDate(date)` | Wunschdatum setzen (ISO-String) |
| `loadWorkshopCalendarDays(fromDate)` | Slots via rxMethod laden |
| `clearWorkshopCalendar()` | Datum + Slots zurücksetzen |

### Computed Signals (Erweiterung)
| Signal | Beschreibung |
|--------|--------------|
| `workshopCalendarDate` | Aktuell gewähltes Wunschdatum |
| `workshopCalendarDays` | Berechnete 3 Werktage mit Slots |
| `hasWorkshopSlotSelected` | Boolean — Slot gewählt (aus `selectedAppointment`) |

### Types
| Typ | Beschreibung |
|-----|--------------|
| `WorkshopTimeSlot` | Einzelner Uhrzeitslot |
| `WorkshopCalendarDay` | Ein Werktag mit Slots |
| `WorkshopCalendarViewState` | `'empty' \| 'loading' \| 'slots-visible'` |

---

## 17. i18n Keys

```typescript
// DE
booking: {
  workshopCalendar: {
    title: 'Hier sehen Sie weitere freie Termine in unserem Werkstattkalender',
    description: 'Wählen Sie Ihren Wunschtermin. Wir zeigen Ihnen alle freien Termine ab diesem Tag an.',
    desiredDateLabel: 'Ihr Wunschtermin:',
    datePlaceholder: 'Wunschtermin wählen',
    hintBefore: 'Wählen Sie im Kalender einen gewünschten Termin aus und wir zeigen Ihnen die nächsten verfügbaren Termine',
    hintAfter: 'Wir haben folgende ab dem von Ihnen ausgewählten Datum verfügbaren Termine für Sie gefunden. Klicken Sie auf eine Uhrzeit, um den Termin auszuwählen.',
    dateInputAriaLabel: 'Wunschtermin eingeben im Format TT.MM.JJJJ',
    slotsAriaLabel: 'Verfügbare Uhrzeiten für {day}',
    backButton: 'Zurück',
    continueButton: 'Weiter',
    navAriaLabel: 'Seitennavigation',
    validation: {
      invalidFormat: 'Bitte geben Sie ein Datum im Format TT.MM.JJJJ ein',
      pastDate: 'Bitte wählen Sie ein Datum ab heute'
    }
  }
}

// EN
booking: {
  workshopCalendar: {
    title: 'Here you can see further available appointments in our workshop calendar',
    description: 'Select your desired date. We will show you all available appointments from that day onwards.',
    desiredDateLabel: 'Your desired date:',
    datePlaceholder: 'Select desired date',
    hintBefore: 'Select a desired date in the calendar and we will show you the next available appointments',
    hintAfter: 'We found the following available appointments from your selected date. Click on a time to select the appointment.',
    dateInputAriaLabel: 'Enter desired date in format DD.MM.YYYY',
    slotsAriaLabel: 'Available times for {day}',
    backButton: 'Back',
    continueButton: 'Continue',
    navAriaLabel: 'Page navigation',
    validation: {
      invalidFormat: 'Please enter a date in the format DD.MM.YYYY',
      pastDate: 'Please select a date from today onwards'
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
- KEINE Farben aus Screenshots (Screenshots zeigen dunkles Theme — das ist FALSCH für dieses Projekt!)
- IMMER `_variables.scss` verwenden
- Helles Theme: `var(--color-background-page)` für Hintergrund
- Linke Karte: `var(--color-background-surface)` (weiß), `var(--shadow-medium)`
- Uhrzeitslots: `var(--color-background-surface)`, Rand `var(--color-border)`, bei Hover/Selected `var(--color-primary)`
- Icons: IMMER mit `.icon-framed` Rahmen
- Buttons: IMMER `mat-flat-button` (filled), NIE `mat-stroked-button`
- DatePicker: `[min]="today"` für Vergangenheitssperre

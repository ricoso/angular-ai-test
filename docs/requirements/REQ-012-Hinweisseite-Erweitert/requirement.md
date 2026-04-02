# REQ-012: Hinweisseite Erweitert

**Status:** Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-04-02
**Author:** Claude Code
**Wizard-Schritt:** 4 von 8 (Erweiterung von REQ-005)

---

## 1. Overview

### 1.1 Purpose
Die bestehende Hinweisseite (REQ-005, Wizard-Schritt 4) wird um drei neue Dropdown-Sektionen erweitert: Mobilitaetsoptionen, Terminpraeferenz und Rueckruf. Die Auswahlen werden als `notesExtras` im BookingStore gespeichert und stehen dem nachfolgenden Wizard-Schritt sowie der Buchungsuebersicht (REQ-010) zur Verfuegung. Das bestehende Datenmodell (`BookingState`) wird um ein neues Feld `notesExtras: NotesExtras | null` erweitert.

### 1.2 Scope
**Included:**
- Neues Dropdown "Mobilitaetsoptionen (kostenpflichtig)" mit 4 Optionen (Keine Auswahl, Kleinwagen, Mittelklasse, Oberklasse)
- Neues Dropdown "Terminpraeferenz" mit 3 Optionen (Jederzeit, Vormittags, Nachmittags)
- Neues Dropdown "Rueckruf" mit 2 Optionen (Keine Auswahl, Ja)
- Alle 3 Dropdowns werden VOR dem bestehenden Anmerkungen-Textarea und den Service-Hints platziert
- Erweiterung des BookingStore um `notesExtras: NotesExtras | null`
- Neue Union Types: `MobilityOption`, `AppointmentPreference`, `CallbackOption`
- Neues Interface: `NotesExtras`
- Neue Store-Methoden: `setNotesExtras()`, `clearNotesExtras()`
- Neue Computed Signals: `hasNotesExtras`, `selectedMobilityOption`, `selectedAppointmentPreference`, `selectedCallbackOption`
- Erweiterung der i18n-Keys unter `booking.notes.*`
- Integration in Buchungsuebersicht (REQ-010)

**Excluded:**
- Aenderung der bestehenden Textarea-Logik (bookingNote bleibt wie in REQ-005)
- Aenderung der bestehenden Service-Hints-Logik
- Backend-Persistierung (Click-Dummy)
- Preisberechnung fuer Mobilitaetsoptionen (nur Label "kostenpflichtig")

### 1.3 Related Requirements
- REQ-005: Hinweisfenster (direkter Vorgaenger, wird erweitert)
- REQ-004-Serviceauswahl (vorheriger Wizard-Schritt, liefert `selectedServices`)
- REQ-011-Serviceauswahl-Erweitert (erweiterte Serviceauswahl, optional)
- REQ-010-Buchungsuebersicht (zeigt Zusammenfassung inkl. notesExtras)
- REQ-001: Header (aktiv auf allen Pages)

---

## 2. User Story

**As a** customer
**I want** to select mobility options, appointment preferences and callback preferences on the notes page
**So that** the workshop can prepare a replacement vehicle, schedule my appointment at the preferred time, and call me back if needed.

**Acceptance Criteria:**
- [ ] AC-1: Dropdown "Mobilitaetsoptionen (kostenpflichtig)" ist sichtbar mit 4 Optionen: Keine Auswahl, Kleinwagen, Mittelklasse, Oberklasse
- [ ] AC-2: Dropdown "Terminpraeferenz" ist sichtbar mit 3 Optionen: Jederzeit (Default), Vormittags, Nachmittags
- [ ] AC-3: Dropdown "Rueckruf" ist sichtbar mit 2 Optionen: Keine Auswahl (Default), Ja
- [ ] AC-4: Alle 3 Dropdowns erscheinen VOR dem bestehenden Anmerkungen-Textarea
- [ ] AC-5: Mobilitaetsoptionen hat "Keine Auswahl" als Default (null-Equivalent)
- [ ] AC-6: Terminpraeferenz hat "Jederzeit" als Default
- [ ] AC-7: Rueckruf hat "Keine Auswahl" als Default (null-Equivalent)
- [ ] AC-8: Beim Klick auf "Weiter" werden alle Dropdown-Werte als `notesExtras` im BookingStore gespeichert
- [ ] AC-9: Beim Zuruecknavigieren und erneutem Oeffnen werden die gespeicherten Werte in den Dropdowns vorausgewaehlt
- [ ] AC-10: Alle Dropdowns sind WCAG 2.1 AA konform (ARIA-Labels, Focus-Styles, Kontrast 4.5:1)
- [ ] AC-11: Responsive Darstellung: Mobile full-width gestapelt, Tablet/Desktop nebeneinander oder gestapelt
- [ ] AC-12: Alle Labels und Optionen sind ueber i18n-Keys uebersetzt (DE + EN)
- [ ] AC-13: Die Buchungsuebersicht (REQ-010) zeigt die gewaehlten Extras an
- [ ] AC-14: Bestehende Funktionalitaet (Textarea, Service-Hints, Buttons) bleibt unveraendert

---

## 3. Preconditions

### 3.1 System
- Angular App laeuft
- BookingStore verfuegbar (`providedIn: 'root'`)
- Header-Component (REQ-001) aktiv
- Routing fuer `/home/notes` konfiguriert
- REQ-005 vollstaendig implementiert

### 3.2 User
- Benutzer hat `/home/notes` aufgerufen
- Benutzer kam via "Weiter"-Button von der Serviceauswahl-Seite (REQ-004/REQ-011)

### 3.3 Data
- Dropdown-Optionen sind statisch konfiguriert (Click-Dummy)
- Optionen werden via i18n-Keys uebersetzt

### 3.4 Uebergabe (Input von REQ-004/REQ-011)
| Feld | Typ | Quelle | Pflicht |
|------|-----|--------|---------|
| `BookingStore.selectedBrand` | `Brand` | REQ-002 | **Ja** -- Guard prueft, redirect zu `/home/brand` wenn leer |
| `BookingStore.selectedLocation` | `LocationDisplay` | REQ-003 | **Ja** -- Guard prueft, redirect zu `/home/location` wenn leer |
| `BookingStore.selectedServices` | `SelectedService[]` | REQ-004 | **Ja** -- Guard prueft, redirect zu `/home/services` wenn leer |
| `BookingStore.bookingNote` | `string \| null` | REQ-005 | Nein -- optional, vorausgefuellt wenn vorhanden |
| `BookingStore.notesExtras` | `NotesExtras \| null` | REQ-012 | Nein -- optional, vorausgefuellt wenn vorhanden |

---

## 4. Main Flow

**Step 1:** Seite wird geladen
- **System:** Liest bestehende Store-Werte (`selectedServices`, `bookingNote`, `notesExtras`)
- **System:** Rendert die 3 neuen Dropdown-Sektionen (Mobilitaetsoptionen, Terminpraeferenz, Rueckruf)
- **System:** Setzt Default-Werte: Mobilitaetsoptionen = "Keine Auswahl", Terminpraeferenz = "Jederzeit", Rueckruf = "Keine Auswahl"
- **System:** Falls `notesExtras` im Store vorhanden: Dropdowns mit gespeicherten Werten vorausfuellen
- **System:** Rendert bestehende Elemente (Textarea, Service-Hints, Buttons) wie in REQ-005
- **Expected:** Seite vollstaendig gerendert mit 3 Dropdowns VOR dem Textarea

**Step 2:** Benutzer waehlt Mobilitaetsoption
- **User:** Oeffnet das Dropdown "Mobilitaetsoptionen (kostenpflichtig)"
- **User:** Waehlt z.B. "Mittelklasse"
- **System:** Dropdown zeigt ausgewaehlte Option an
- **Expected:** Auswahl sichtbar, noch nicht im Store gespeichert (erst bei "Weiter")

**Step 3:** Benutzer waehlt Terminpraeferenz
- **User:** Oeffnet das Dropdown "Terminpraeferenz"
- **User:** Waehlt z.B. "Vormittags"
- **System:** Dropdown zeigt ausgewaehlte Option an
- **Expected:** Auswahl sichtbar

**Step 4:** Benutzer waehlt Rueckruf-Option
- **User:** Oeffnet das Dropdown "Rueckruf"
- **User:** Waehlt z.B. "Ja"
- **System:** Dropdown zeigt ausgewaehlte Option an
- **Expected:** Auswahl sichtbar

**Step 5:** Benutzer gibt optionale Anmerkungen ein (bestehend, REQ-005)
- **User:** Tippt Text in das Freitextfeld
- **System:** Zeichenzaehler aktualisiert sich in Echtzeit
- **Expected:** Wie in REQ-005 definiert

**Step 6:** Benutzer klickt auf "Weiter"
- **User:** Klickt den Weiter-Button
- **System:** Speichert Dropdown-Auswahlen als `notesExtras` im BookingStore (`setNotesExtras(extras)`)
- **System:** Speichert Textarea-Text als `bookingNote` im BookingStore (`setBookingNote(text)`)
- **System:** Navigiert zum naechsten Wizard-Schritt (`/home/appointment`)
- **Expected:** `notesExtras` und `bookingNote` im Store gespeichert, Navigation erfolgt

---

## 5. Alternative Flows

### 5.1 Benutzer aendert keine Defaults

**Trigger:** Benutzer klickt auf "Weiter" ohne Dropdown-Aenderungen

**Flow:**
1. System speichert `notesExtras: { mobilityOption: 'none', appointmentPreference: 'anytime', callbackOption: 'none' }` im BookingStore
2. System speichert `bookingNote` wie in REQ-005
3. Navigation zum naechsten Schritt

### 5.2 Zurueck zur Serviceauswahl

**Trigger:** Benutzer klickt den Zurueck-Button

**Flow:**
1. System navigiert zu `/home/services` (REQ-004)
2. Bereits gesetzte Dropdown-Werte werden NICHT gespeichert (analog zu REQ-005: Store wird bei Zurueck-Navigation gecleared)
3. `clearNotesExtras()` und `clearBookingNote()` werden aufgerufen

### 5.3 Ruecknavigation und erneutes Oeffnen

**Trigger:** Benutzer navigiert zurueck zum Hinweisfenster nachdem er weitergegangen war

**Flow:**
1. System laedt die Seite erneut
2. Guard prueft Bedingungen (selectedServices nicht leer)
3. System fuellt Dropdowns mit gespeicherten `notesExtras`-Werten aus dem BookingStore vor
4. System fuellt Textarea mit gespeichertem `bookingNote` vor
5. Benutzer kann Auswahlen aendern

### 5.4 Nur Teilauswahl bei Dropdowns

**Trigger:** Benutzer aendert nur ein Dropdown und laesst die anderen auf Default

**Flow:**
1. System speichert alle 3 Werte als `notesExtras`-Objekt (auch Default-Werte)
2. Beispiel: `{ mobilityOption: 'mid-range', appointmentPreference: 'anytime', callbackOption: 'none' }`

---

## 6. Exception Flows

### 6.1 Keine Services gewaehlt (Guard-Fail)

**Trigger:** Direktaufruf von `/home/notes` ohne Services im BookingStore

**Flow:**
1. Guard `servicesSelectedGuard` prueft `BookingStore.selectedServices`
2. Bei leerem Array: Redirect zu `/home/services`
3. Kein Fehler fuer Benutzer sichtbar

### 6.2 Kein Standort gewaehlt (Guard-Fail)

**Trigger:** Direktaufruf ohne Standort

**Flow:**
1. Guard prueft `BookingStore.selectedLocation`
2. Redirect zu `/home/location`

### 6.3 Keine Marke gewaehlt (Guard-Fail)

**Trigger:** Direktaufruf ohne Marke

**Flow:**
1. Guard prueft `BookingStore.selectedBrand`
2. Redirect zu `/home/brand`

---

## 7. Postconditions

### 7.1 Success -- Uebergabe an naechsten Wizard-Schritt
| Feld | Typ | Wert | Beschreibung |
|------|-----|------|--------------|
| `BookingStore.selectedBrand` | `Brand` | z.B. `'audi'` | Von REQ-002 (unveraendert) |
| `BookingStore.selectedLocation` | `LocationDisplay` | z.B. `{ id: 'muc', name: 'Muenchen', city: 'Muenchen' }` | Von REQ-003 (unveraendert) |
| `BookingStore.selectedServices` | `SelectedService[]` | z.B. `[{ serviceId: 'huau', selectedVariantId: null }]` | Von REQ-004 (unveraendert) |
| `BookingStore.bookingNote` | `string \| null` | z.B. `'Bitte Oel pruefen.'` oder `null` | Von REQ-005 (unveraendert oder aktualisiert) |
| `BookingStore.notesExtras` | `NotesExtras \| null` | z.B. `{ mobilityOption: 'mid-range', appointmentPreference: 'morning', callbackOption: 'yes' }` | **Neu gesetzt** -- Dropdown-Auswahlen |

### 7.2 Failure
- Keine Aenderungen am BookingStore
- Guard leitet zu entsprechendem vorherigen Schritt weiter

---

## 8. Business Rules

- **BR-1:** Alle 3 Dropdowns sind optional -- der Weiter-Button ist immer aktiv (keine Pflichtvalidierung)
- **BR-2:** Default-Werte: `mobilityOption: 'none'`, `appointmentPreference: 'anytime'`, `callbackOption: 'none'`
- **BR-3:** Beim Speichern wird immer das vollstaendige `NotesExtras`-Objekt gespeichert (auch wenn alles auf Default steht)
- **BR-4:** Mobilitaetsoptionen sind als "kostenpflichtig" gekennzeichnet (nur im Label, keine Preisberechnung im Click-Dummy)
- **BR-5:** Die 3 Dropdowns erscheinen in fester Reihenfolge: 1. Mobilitaetsoptionen, 2. Terminpraeferenz, 3. Rueckruf
- **BR-6:** Die bestehenden REQ-005-Business-Rules (BR-1 bis BR-8) bleiben unveraendert gueltig
- **BR-7:** Beim Zurueck-Navigieren werden `notesExtras` und `bookingNote` gecleared (WizardStateSync-Konvention, REQ-007)
- **BR-8:** Dropdown-Werte werden als Union Types gespeichert, nicht als Strings -- Typsicherheit durch TypeScript
- **BR-9:** Alle Dropdown-Felder verwenden `mat-select` (Angular Material) -- kein natives `<select>`

---

## 9. Non-Functional Requirements

### Performance
- Seitenaufbau < 300ms (keine API-Calls, rein statische Daten)
- Dropdown-Oeffnung < 16ms (Angular Material Standard)

### Security
- Kein `[innerHTML]` -- alle Texte via Angular Template Escaping
- Input-Werte durch Union Types eingeschraenkt (keine Freitext-Eingabe in Dropdowns)
- Keine sensiblen Daten im BookingStore

### Usability
- Mobile-First: Dropdowns full-width auf allen Viewports
- Touch-friendly: Mindest-Touch-Target 2.75em (44px) fuer Dropdowns und Buttons
- WCAG 2.1 AA: ARIA-Labels fuer alle Dropdowns, Focus-Styles (`:focus-visible`), Kontrast 4.5:1
- Keyboard-Navigation: Tab-Reihenfolge logisch (Dropdown 1 -> Dropdown 2 -> Dropdown 3 -> Textarea -> Zurueck -> Weiter)
- Screen Reader: Dropdown-Labels korrekt via `aria-label` oder `<mat-label>` verknuepft

---

## 10. Data Model

```typescript
// NEUE Union Types (in notes-extras.model.ts)

/**
 * Mobility option for replacement vehicle
 * Mobilitaetsoption fuer Ersatzfahrzeug
 */
export type MobilityOption = 'none' | 'compact-car' | 'mid-range' | 'luxury';

/**
 * Appointment preference for scheduling
 * Terminpraeferenz fuer Terminplanung
 */
export type AppointmentPreference = 'anytime' | 'morning' | 'afternoon';

/**
 * Callback option
 * Rueckruf-Option
 */
export type CallbackOption = 'none' | 'yes';

/**
 * Extended notes extras — dropdown selections on notes page
 * Erweiterte Hinweis-Extras — Dropdown-Auswahlen auf der Hinweisseite
 */
export interface NotesExtras {
  mobilityOption: MobilityOption;
  appointmentPreference: AppointmentPreference;
  callbackOption: CallbackOption;
}

// ──────────────────────────────────────────────────────────────
// BookingState ERWEITERN (booking.store.ts) — NICHT duplizieren!
// ──────────────────────────────────────────────────────────────

// Bestehendes Interface erweitern um:
interface BookingState {
  // ... alle bestehenden Felder bleiben unveraendert ...
  brands: BrandDisplay[];
  selectedBrand: Brand | null;
  locations: LocationDisplay[];
  selectedLocation: LocationDisplay | null;
  services: ServiceDisplay[];
  selectedServices: SelectedService[];
  bookingNote: string | null;
  appointments: AppointmentSlot[];
  selectedAppointment: AppointmentSlot | null;
  workshopCalendarDate: string | null;
  workshopCalendarDays: WorkshopCalendarDay[];
  customerInfo: CustomerInfo | null;
  vehicleInfo: VehicleInfo | null;
  privacyConsent: boolean;
  bookingSubmitted: boolean;
  isLoading: boolean;
  error: string | null;
  notesExtras: NotesExtras | null;  // NEU — Dropdown-Auswahlen
}

// INITIAL_STATE erweitern:
const INITIAL_STATE: BookingState = {
  // ... bestehende Felder ...
  notesExtras: null  // NEU
};

// NEUE Store-Methoden in withMethods:
setNotesExtras(extras: NotesExtras): void {
  patchState(store, { notesExtras: extras });
}

clearNotesExtras(): void {
  patchState(store, { notesExtras: null });
}

// NEUE Computed Signals in withComputed:
hasNotesExtras: computed(() => notesExtras() !== null),
selectedMobilityOption: computed(() => notesExtras()?.mobilityOption ?? 'none'),
selectedAppointmentPreference: computed(() => notesExtras()?.appointmentPreference ?? 'anytime'),
selectedCallbackOption: computed(() => notesExtras()?.callbackOption ?? 'none'),

// Bestehende Interfaces (unveraendert, nur referenziert):
// - Brand (brand.model.ts)
// - LocationDisplay (location.model.ts)
// - SelectedService (service.model.ts)
// - ServiceType (service.model.ts)
// - AppointmentSlot (appointment.model.ts)
// - WorkshopCalendarDay (workshop-calendar.model.ts)
// - CustomerInfo, VehicleInfo (customer.model.ts)
```

---

## 11. UI/UX

### Layout-Struktur

```
+------------------------------------------------------------------+
|  [Header -- REQ-001]                                              |
+------------------------------------------------------------------+
|                                                                    |
|  Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung             |
|  (h1 -- Seitenueberschrift, bestehend aus REQ-005)                |
|                                                                    |
|  Moechten Sie uns noch etwas zu Ihrer Buchung mitteilen?           |
|  (p -- Unterueberschrift, bestehend aus REQ-005)                   |
|                                                                    |
|  +--------------------------------------------------------------+  |
|  | Mobilitaetsoptionen (kostenpflichtig)              [Waehlen v]|  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  +--------------------------------------------------------------+  |
|  | Terminpraeferenz                                  [Waehlen v]|  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  +--------------------------------------------------------------+  |
|  | Weitere Optionen: Rueckruf                        [Waehlen v]|  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  +--------------------------------------------------------------+  |
|  | Bitte tragen Sie hier Ihre Nachricht an uns ein              |  |
|  | (Hinweise, Buchung weiterer Leistungen, etc.)                |  |
|  |                                                              |  |
|  +--------------------------------------------------------------+  |
|                                                    0 / 1000        |
|                                                                    |
|  ----------------------------------------------------------------  |
|                                                                    |
|  Wichtige Hinweise zu Ihren ausgewaehlten Services                 |
|  (bestehende Service-Hints aus REQ-005)                            |
|                                                                    |
|  +--------------+                       +------------------+       |
|  | <- Zurueck   |                       |     Weiter ->    |       |
|  +--------------+                       +------------------+       |
|                                                                    |
+------------------------------------------------------------------+
```

### UI Elements

| Element | Typ | Material Component | ARIA |
|---------|-----|-------------------|------|
| Dropdown Mobilitaetsoptionen | Select | `mat-form-field` + `mat-select` | `aria-label` via `<mat-label>` |
| Dropdown Terminpraeferenz | Select | `mat-form-field` + `mat-select` | `aria-label` via `<mat-label>` |
| Dropdown Rueckruf | Select | `mat-form-field` + `mat-select` | `aria-label` via `<mat-label>` |
| Dropdown-Optionen | Options | `mat-option` | Automatisch via Material |
| Bestehende Elemente | - | Wie in REQ-005 | Wie in REQ-005 |

### Dropdown-Optionen im Detail

**Mobilitaetsoptionen (kostenpflichtig):**
| Wert | Label (DE) | Label (EN) |
|------|-----------|-----------|
| `'none'` | Keine Auswahl | No selection |
| `'compact-car'` | Kleinwagen | Compact car |
| `'mid-range'` | Mittelklasse | Mid-range |
| `'luxury'` | Oberklasse | Luxury |

**Terminpraeferenz:**
| Wert | Label (DE) | Label (EN) |
|------|-----------|-----------|
| `'anytime'` | Jederzeit | Anytime |
| `'morning'` | Vormittags | Morning |
| `'afternoon'` | Nachmittags | Afternoon |

**Rueckruf:**
| Wert | Label (DE) | Label (EN) |
|------|-----------|-----------|
| `'none'` | Keine Auswahl | No selection |
| `'yes'` | Ja | Yes |

### Responsive Verhalten

| Viewport | Dropdowns | Textarea | Buttons |
|----------|-----------|----------|---------|
| Mobile (< 48em) | Full-width, gestapelt | Full-width, 6 Zeilen | Full-width, gestapelt |
| Tablet (>= 48em) | Full-width, gestapelt | Full-width, 6 Zeilen | Nebeneinander |
| Desktop (>= 64em) | Full-width, gestapelt | Full-width, 6 Zeilen | Nebeneinander |

### Design-Hinweise
- Dropdowns verwenden `mat-form-field` mit `appearance="outline"` (konsistent mit Projekt)
- Hintergrund: `var(--color-background-page)` (hell)
- Karten/Container: `var(--color-background-surface)` (weiss)
- Text: `var(--color-text-primary)` / `var(--color-text-secondary)`
- Buttons IMMER: `mat-flat-button` (filled, KEIN `mat-stroked-button`)
- Icons: IMMER mit `.icon-framed` Rahmen
- Keine Inline-Styles, keine hardcodierten Farben oder px-Werte
- Dropdown-Overlay: `var(--color-background-surface)` (weiss)

---

## 12. API Specification

Keine Backend-API erforderlich. Click-Dummy: alle Daten sind statisch.

Die Dropdown-Optionen sind als Union Types und statische Konfiguration definiert.
i18n-Keys liefern die Labels.

---

## 13. Test Cases

### TC-1: Seite laden mit Default-Werten
- **Given:** `selectedServices` nicht leer, `notesExtras` ist `null`
- **When:** Seite `/home/notes` wird geladen
- **Then:** Mobilitaetsoptionen = "Keine Auswahl", Terminpraeferenz = "Jederzeit", Rueckruf = "Keine Auswahl"

### TC-2: Mobilitaetsoption auswaehlen
- **Given:** Seite geladen
- **When:** Benutzer waehlt "Mittelklasse" im Mobilitaetsoptionen-Dropdown
- **Then:** Dropdown zeigt "Mittelklasse" an

### TC-3: Terminpraeferenz aendern
- **Given:** Seite geladen
- **When:** Benutzer waehlt "Vormittags"
- **Then:** Dropdown zeigt "Vormittags" an

### TC-4: Rueckruf aktivieren
- **Given:** Seite geladen
- **When:** Benutzer waehlt "Ja" im Rueckruf-Dropdown
- **Then:** Dropdown zeigt "Ja" an

### TC-5: Weiter mit allen Dropdowns geaendert
- **Given:** Mobilitaetsoptionen = "Oberklasse", Terminpraeferenz = "Nachmittags", Rueckruf = "Ja"
- **When:** Benutzer klickt "Weiter"
- **Then:** `BookingStore.notesExtras === { mobilityOption: 'luxury', appointmentPreference: 'afternoon', callbackOption: 'yes' }`, Navigation zum naechsten Schritt

### TC-6: Weiter mit Default-Werten
- **Given:** Keine Dropdown-Aenderungen
- **When:** Benutzer klickt "Weiter"
- **Then:** `BookingStore.notesExtras === { mobilityOption: 'none', appointmentPreference: 'anytime', callbackOption: 'none' }`

### TC-7: Vorausgefuellte Dropdowns bei Ruecknavigation
- **Given:** Benutzer hat Extras gespeichert, "Weiter" geklickt, dann zuruecknavigiert
- **When:** Seite `/home/notes` wird erneut geladen
- **Then:** Dropdowns zeigen die gespeicherten Werte an

### TC-8: Zurueck-Navigation cleared notesExtras
- **Given:** Seite geladen, Dropdowns geaendert
- **When:** Benutzer klickt "Zurueck"
- **Then:** `BookingStore.notesExtras === null`, Navigation zu `/home/services`

### TC-9: Bestehende Textarea-Funktionalitaet unveraendert
- **Given:** Seite geladen
- **When:** Benutzer tippt "Test" ins Textfeld
- **Then:** Zeichenzaehler zeigt "4 / 1000", Textfeld funktioniert wie in REQ-005

### TC-10: Bestehende Service-Hints unveraendert
- **Given:** `selectedServices` enthaelt `huau` und `inspection`
- **When:** Seite geladen
- **Then:** Hinweise fuer HU/AU und Inspektion sichtbar, kein Raederwechsel-Hinweis

### TC-11: Keyboard-Navigation mit Dropdowns
- **Given:** Seite geladen
- **When:** Tab-Taste gedrueckt (mehrfach)
- **Then:** Fokus-Reihenfolge: Mobilitaetsoptionen -> Terminpraeferenz -> Rueckruf -> Textarea -> Zurueck -> Weiter

### TC-12: Dropdown ARIA-Labels
- **Given:** Screen Reader aktiv
- **When:** Fokus auf Mobilitaetsoptionen-Dropdown
- **Then:** Screen Reader liest Label "Mobilitaetsoptionen (kostenpflichtig)" vor

### TC-13: Guard -- keine Services
- **Given:** `BookingStore.selectedServices` ist leer
- **When:** Direktaufruf `/home/notes`
- **Then:** Redirect zu `/home/services`

### TC-14: NotesExtras in Buchungsuebersicht
- **Given:** `notesExtras` gespeichert mit `mobilityOption: 'compact-car'`
- **When:** Buchungsuebersicht (REQ-010) wird geladen
- **Then:** Mobilitaetsoption "Kleinwagen" wird in der Uebersicht angezeigt

---

## 14. Implementation

### Components (bestehende erweitern)
- [ ] `NotesContainerComponent` -- Bestehenden Container erweitern: 3 Dropdown-Bindings + `setNotesExtras()` in `onContinue()`
- [ ] `NotesExtrasFormComponent` -- **NEU** Presentational Component fuer die 3 Dropdowns (`input(initialExtras)`, `output(extrasChanged)`)

### Store Extension (BookingStore erweitern, KEIN neuer Store!)
- [ ] `BookingState` erweitern um `notesExtras: NotesExtras | null`
- [ ] `INITIAL_STATE` erweitern um `notesExtras: null`
- [ ] Neue Methode `setNotesExtras(extras: NotesExtras): void` in `withMethods`
- [ ] Neue Methode `clearNotesExtras(): void` in `withMethods`
- [ ] Neues Computed `hasNotesExtras` in `withComputed`
- [ ] Neues Computed `selectedMobilityOption` in `withComputed`
- [ ] Neues Computed `selectedAppointmentPreference` in `withComputed`
- [ ] Neues Computed `selectedCallbackOption` in `withComputed`

### Model
- [ ] `NotesExtras` Interface in `src/app/features/booking/models/notes-extras.model.ts`
- [ ] `MobilityOption` Union Type in `notes-extras.model.ts`
- [ ] `AppointmentPreference` Union Type in `notes-extras.model.ts`
- [ ] `CallbackOption` Union Type in `notes-extras.model.ts`

### Guards
- Bestehende Guards (servicesSelectedGuard) bleiben unveraendert

### i18n
- [ ] DE-Keys unter `booking.notes.mobilityOptions.*` ergaenzen
- [ ] DE-Keys unter `booking.notes.appointmentPreference.*` ergaenzen
- [ ] DE-Keys unter `booking.notes.callback.*` ergaenzen
- [ ] EN-Keys analog ergaenzen

### Route
Keine Routing-Aenderung noetig -- bestehende `/home/notes` Route bleibt.

### Folder Structure (Erweiterung)
```
src/app/features/booking/
├── models/
│   ├── notes-extras.model.ts              # NEU
│   └── service.model.ts                   # bestehend
├── components/notes/
│   ├── notes-container.component.ts       # ERWEITERN
│   ├── notes-container.component.html     # ERWEITERN
│   ├── notes-container.component.scss     # ERWEITERN
│   ├── notes-extras-form.component.ts     # NEU
│   ├── notes-extras-form.component.html   # NEU
│   ├── notes-extras-form.component.scss   # NEU
│   ├── notes-form.component.ts            # bestehend (unveraendert)
│   ├── notes-form.component.html          # bestehend (unveraendert)
│   ├── notes-form.component.scss          # bestehend (unveraendert)
│   ├── service-hints.component.ts         # bestehend (unveraendert)
│   ├── service-hints.component.html       # bestehend (unveraendert)
│   ├── service-hints.component.scss       # bestehend (unveraendert)
│   └── notes-hints.constants.ts           # bestehend (unveraendert)
└── stores/
    └── booking.store.ts                   # ERWEITERN
```

### Effort
- Development: 4 Stunden
- Testing: 2 Stunden

---

## 15. Dependencies

**Requires:**
- REQ-001: Header (Warenkorb-Icon, Accessibility Controls)
- REQ-002-Markenauswahl (liefert `selectedBrand`)
- REQ-003-Standortwahl (liefert `selectedLocation`)
- REQ-004-Serviceauswahl (liefert `selectedServices`)
- REQ-005-Hinweisfenster (Basis-Implementierung, wird erweitert)

**Blocks:**
- REQ-010-Buchungsuebersicht (muss `notesExtras` in der Zusammenfassung anzeigen)

---

## 16. Naming Glossary

### Container Methods (NotesContainerComponent -- erweitert)
| Method | Description |
|--------|-------------|
| `onNoteChanged(note: string \| null)` | Bestehend -- Reactive Form valueChanges handler |
| `onExtrasChanged(extras: NotesExtras)` | **NEU** -- Dropdown-Aenderungen vom NotesExtrasFormComponent |
| `onContinue()` | Erweitert -- `setBookingNote()` + `setNotesExtras()` + Navigation |
| `onBack()` | Erweitert -- `clearBookingNote()` + `clearNotesExtras()` + Navigation zu `/home/services` |

### Presentational: NotesExtrasFormComponent (NEU)
| Member | Type | Description |
|--------|------|-------------|
| `initialExtras` | `input<NotesExtras \| null>()` | Vorausgefuellte Werte aus BookingStore |
| `extrasChanged` | `output<NotesExtras>()` | Emittiert bei Aenderung eines Dropdowns |
| `onMobilityOptionChange(value: MobilityOption)` | Method | Mobilitaetsoption geaendert |
| `onAppointmentPreferenceChange(value: AppointmentPreference)` | Method | Terminpraeferenz geaendert |
| `onCallbackOptionChange(value: CallbackOption)` | Method | Rueckruf-Option geaendert |

### Presentational: NotesFormComponent (bestehend, unveraendert)
| Member | Type | Description |
|--------|------|-------------|
| `initialNote` | `input<string \| null>()` | Vorausgefuellter Wert aus BookingStore |
| `noteChanged` | `output<string \| null>()` | Emittiert bei Aenderung des Textfeldes |

### Presentational: ServiceHintsComponent (bestehend, unveraendert)
| Member | Type | Description |
|--------|------|-------------|
| `selectedServices` | `input<SelectedService[]>()` | Liste der gewaehlten Services |

### Signal Store Extension (BookingStore)
| Method / Field | Description |
|---------------|-------------|
| `notesExtras` | State-Feld -- Dropdown-Auswahlen (`NotesExtras \| null`) |
| `setNotesExtras(extras: NotesExtras)` | Setzt `notesExtras` im State |
| `clearNotesExtras()` | Setzt `notesExtras` auf `null` |
| `hasNotesExtras` | Computed Signal -- Boolean, ob Extras vorhanden sind |
| `selectedMobilityOption` | Computed Signal -- aktuelle Mobilitaetsoption (`MobilityOption`) |
| `selectedAppointmentPreference` | Computed Signal -- aktuelle Terminpraeferenz (`AppointmentPreference`) |
| `selectedCallbackOption` | Computed Signal -- aktuelle Rueckruf-Option (`CallbackOption`) |

### Model Types (notes-extras.model.ts)
| Type | Values | Description |
|------|--------|-------------|
| `MobilityOption` | `'none' \| 'compact-car' \| 'mid-range' \| 'luxury'` | Mobilitaetsoption Union Type |
| `AppointmentPreference` | `'anytime' \| 'morning' \| 'afternoon'` | Terminpraeferenz Union Type |
| `CallbackOption` | `'none' \| 'yes'` | Rueckruf Union Type |
| `NotesExtras` | `{ mobilityOption, appointmentPreference, callbackOption }` | Zusammenfassung der Dropdown-Auswahlen |

---

## 17. i18n Keys

```typescript
// DE -- in translations.ts unter booking.notes ERGAENZEN (bestehende Keys bleiben!)
booking: {
  notes: {
    // BESTEHEND (REQ-005):
    pageTitle: 'Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung',
    sectionTitle: 'Moechten Sie uns noch etwas zu Ihrer Buchung mitteilen?',
    textareaPlaceholder: 'Bitte tragen Sie hier Ihre Nachricht an uns ein (Hinweise, Buchung weiterer Leistungen, etc.)',
    charCountAriaLabel: '{current} von {max} Zeichen verwendet',
    hintsTitle: 'Wichtige Hinweise zu Ihren ausgewaehlten Services',
    backButton: 'Zurueck',
    continueButton: 'Weiter',
    hints: {
      huau: '...',       // bestehend
      inspection: '...', // bestehend
      tireChange: '...'  // bestehend
    },

    // NEU (REQ-012):
    mobilityOptions: {
      title: 'Mobilitaetsoptionen (kostenpflichtig)',
      label: 'Waehlen',
      none: 'Keine Auswahl',
      compactCar: 'Kleinwagen',
      midRange: 'Mittelklasse',
      luxury: 'Oberklasse'
    },
    appointmentPreference: {
      title: 'Terminpraeferenz',
      label: 'Waehlen',
      anytime: 'Jederzeit',
      morning: 'Vormittags',
      afternoon: 'Nachmittags'
    },
    callback: {
      title: 'Weitere Optionen: Rueckruf',
      label: 'Rueckruf',
      none: 'Keine Auswahl',
      yes: 'Ja'
    }
  }
}

// EN -- in translations.ts unter booking.notes ERGAENZEN
booking: {
  notes: {
    // BESTEHEND (REQ-005):
    pageTitle: 'Please provide further notes for your booking',
    sectionTitle: 'Would you like to tell us anything else about your booking?',
    textareaPlaceholder: 'Please enter your message here (notes, booking of additional services, etc.)',
    charCountAriaLabel: '{current} of {max} characters used',
    hintsTitle: 'Important notes about your selected services',
    backButton: 'Back',
    continueButton: 'Continue',
    hints: {
      huau: '...',       // bestehend
      inspection: '...', // bestehend
      tireChange: '...'  // bestehend
    },

    // NEU (REQ-012):
    mobilityOptions: {
      title: 'Mobility options (chargeable)',
      label: 'Select',
      none: 'No selection',
      compactCar: 'Compact car',
      midRange: 'Mid-range',
      luxury: 'Luxury'
    },
    appointmentPreference: {
      title: 'Appointment preference',
      label: 'Select',
      anytime: 'Anytime',
      morning: 'Morning',
      afternoon: 'Afternoon'
    },
    callback: {
      title: 'Further options: Callback',
      label: 'Callback',
      none: 'No selection',
      yes: 'Yes'
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

- Kommentare: DE + EN
- Error Messages: Englisch
- i18n Keys: DE + EN (beide Sprachen vollstaendig befuellen)
- JSDoc: bilingual

**Design-System:**
- KEINE Farben aus Screenshots!
- IMMER `_variables.scss` verwenden
- Helles Theme (`var(--color-background-surface)` fuer Karten/Container)
- Icons: IMMER mit `.icon-framed` Rahmen
- Buttons: IMMER `mat-flat-button` (filled)
- Button-Sizing: Konsistent mit vorherigen Wizard-Schritten
- Dropdown-Overlay: `var(--color-background-surface)` (weiss)

**Store-Erweiterung:**
- Neues Feld `notesExtras: NotesExtras | null` in `BookingState` in `booking.store.ts`
- `INITIAL_STATE` um `notesExtras: null` erweitern
- Neue Methoden `setNotesExtras(extras: NotesExtras): void` und `clearNotesExtras(): void` in `withMethods`
- Neue Computed Signals `hasNotesExtras`, `selectedMobilityOption`, `selectedAppointmentPreference`, `selectedCallbackOption` in `withComputed`
- KEIN neuer Store -- bestehenden `BookingStore` erweitern!
- Import fuer `NotesExtras` und Union Types aus `notes-extras.model.ts`

**Bestehende Logik bewahren:**
- `NotesFormComponent` bleibt unveraendert (Textarea + Zeichenzaehler)
- `ServiceHintsComponent` bleibt unveraendert (servicespezifische Hinweise)
- `notes-hints.constants.ts` bleibt unveraendert
- Guards bleiben unveraendert
- Route bleibt unveraendert

**Reactive Forms in NotesExtrasFormComponent:**
- 3 `FormControl`s fuer die Dropdowns (KEIN ngModel)
- `valueChanges` Observable fuer Echtzeit-Updates an den Container
- KEIN separater Submit -- Werte werden via `output()` an Container propagiert

**WizardStateSync (REQ-007):**
- `onBack()` im Container muss `clearNotesExtras()` aufrufen (zusaetzlich zu `clearBookingNote()`)

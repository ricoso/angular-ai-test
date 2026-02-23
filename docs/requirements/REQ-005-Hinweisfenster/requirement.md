# REQ-005: Hinweisfenster

**Status:** Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-02-19
**Author:** Claude Code
**Wizard-Schritt:** 4 von 8

---

## 1. Overview

### 1.1 Purpose
Der Benutzer kann nach der Serviceauswahl (REQ-004) optionale Hinweise zu seiner Buchung eingeben. Die Seite zeigt darüber hinaus wichtige, servicespezifische Hinweise an — jeweils nur für die vom Benutzer zuvor gewählten Services. Die eingegebene Nachricht wird im BookingStore gespeichert und an den nächsten Wizard-Schritt übergeben.

### 1.2 Scope
**Included:**
- Seitenüberschrift "Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung"
- Unterüberschrift "Möchten Sie uns noch etwas zu Ihrer Buchung mitteilen?"
- Optionales Freitextfeld (max. 1000 Zeichen) mit Placeholder-Text
- Zeichenzähler (aktuell / max.) unterhalb des Textfeldes
- Abschnitt "Wichtige Hinweise zu Ihren ausgewählten Services" mit servicespezifischen Hinweistexten
- Hinweistexte werden nur für aktiv gewählte Services (aus REQ-004) angezeigt
- Zurück-Button (navigiert zu `/home/services`)
- Weiter-Button (navigiert zum nächsten Wizard-Schritt)
- Speicherung der Buchungsnotiz im BookingStore

**Excluded:**
- Terminbuchung (späterer Wizard-Schritt)
- Pflichtvalidierung des Textfeldes (Feld ist optional)
- Backend-Persistierung (Click-Dummy)

### 1.3 Related Requirements
- REQ-001: Header (aktiv auf allen Pages)
- REQ-004-Serviceauswahl (vorheriger Schritt, liefert `selectedServices`)
- REQ-006 (nächster Wizard-Schritt, empfängt `bookingNote`)

---

## 2. User Story

**As a** customer
**I want** to add optional notes to my booking and review important service-specific hints
**So that** the workshop is informed about my special requirements and I am aware of relevant conditions for the chosen services.

**Acceptance Criteria:**
- [ ] AC-1: Seitenüberschrift lautet "Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung"
- [ ] AC-2: Unterüberschrift lautet "Möchten Sie uns noch etwas zu Ihrer Buchung mitteilen?"
- [ ] AC-3: Freitextfeld ist sichtbar und auf max. 1000 Zeichen begrenzt
- [ ] AC-4: Placeholder-Text "Bitte tragen Sie hier Ihre Nachricht an uns ein (Hinweise, Buchung weiterer Leistungen, etc.)" ist vor Eingabe sichtbar und verschwindet beim Fokussieren des Feldes
- [ ] AC-5: Zeichenzähler zeigt aktuell eingegebene Zeichen und Maximum an (z.B. "42 / 1000")
- [ ] AC-6: Abschnitt "Wichtige Hinweise zu Ihren ausgewählten Services" wird angezeigt, wenn mindestens ein Service gewählt wurde
- [ ] AC-7: Servicespezifische Hinweistexte werden nur angezeigt, wenn der jeweilige Service in `BookingStore.selectedServices` enthalten ist
- [ ] AC-8: Zurück-Button navigiert zu `/home/services`
- [ ] AC-9: Weiter-Button navigiert zum nächsten Schritt und speichert die Buchungsnotiz im BookingStore
- [ ] AC-10: Das Textfeld und alle Hinweise sind WCAG 2.1 AA konform
- [ ] AC-11: Der Weiter-Button ist immer aktiv (Feld ist optional — keine Pflichtvalidierung)

---

## 3. Preconditions

### 3.1 System
- Angular App läuft
- BookingStore verfügbar (`providedIn: 'root'`)
- Header-Component (REQ-001) aktiv
- Routing für `/home/notes` konfiguriert

### 3.2 User
- Benutzer hat `/home/notes` aufgerufen
- Benutzer kam via "Weiter"-Button von der Serviceauswahl-Seite (REQ-004)

### 3.3 Data
- Servicespezifische Hinweistexte sind statisch konfiguriert (Click-Dummy)
- Hinweistexte werden pro Service im Component definiert und via i18n-Keys übersetzt

### 3.4 Übergabe (Input von REQ-004-Serviceauswahl)
| Feld | Typ | Quelle | Pflicht |
|------|-----|--------|---------|
| `BookingStore.selectedBrand` | `Brand` | REQ-002 | **Ja** — Guard prüft, redirect zu `/home/brand` wenn leer |
| `BookingStore.selectedLocation` | `LocationDisplay` | REQ-003 | **Ja** — Guard prüft, redirect zu `/home/location` wenn leer |
| `BookingStore.selectedServices` | `SelectedService[]` | REQ-004 | **Ja** — Guard prüft, redirect zu `/home/services` wenn leer |

---

## 4. Main Flow

![Hinweisfenster](./mockup.png)

**Step 1:** Seite wird geladen
- **System:** Liest `selectedBrand`, `selectedLocation`, `selectedServices` aus BookingStore
- **System:** Zeigt Seitenüberschrift und Unterüberschrift
- **System:** Rendert Freitextfeld mit Placeholder-Text und Zeichenzähler "0 / 1000"
- **System:** Rendert Abschnitt "Wichtige Hinweise zu Ihren ausgewählten Services"
- **System:** Zeigt nur Hinweise für Services die in `selectedServices` enthalten sind
- **Expected:** Seite vollständig gerendert, Placeholder sichtbar, Zeichenzähler bei 0 / 1000

**Step 2:** Benutzer klickt auf das Textfeld
- **User:** Klickt auf das Freitextfeld
- **System:** Placeholder-Text verschwindet (Standard-HTML-Verhalten via `placeholder` Attribut)
- **Expected:** Cursor im Textfeld, Placeholder nicht mehr sichtbar

**Step 3:** Benutzer gibt eine Nachricht ein
- **User:** Tippt Text in das Freitextfeld
- **System:** Aktualisiert den Zeichenzähler in Echtzeit (z.B. "87 / 1000")
- **System:** Verhindert Eingabe über 1000 Zeichen
- **Expected:** Zeichenzähler aktuell, Text sichtbar

**Step 4:** Benutzer klickt auf "Weiter"
- **User:** Klickt den Weiter-Button
- **System:** Speichert den eingegebenen Text als `bookingNote` im BookingStore (`setBookingNote(text)`)
- **System:** Navigiert zum nächsten Wizard-Schritt
- **Expected:** Buchungsnotiz im Store gespeichert, Navigation erfolgt

---

## 5. Alternative Flows

### 5.1 Benutzer lässt das Textfeld leer

**Trigger:** Benutzer klickt auf "Weiter" ohne Texteingabe

**Flow:**
1. System speichert `bookingNote: null` im BookingStore (leeres Feld = keine Notiz)
2. System navigiert zum nächsten Wizard-Schritt
3. Continue without note

### 5.2 Zurück zur Serviceauswahl

**Trigger:** Benutzer klickt den Zurück-Button

**Flow:**
1. System navigiert zu `/home/services` (REQ-004)
2. Bereits eingegebener Text bleibt im BookingStore erhalten (wenn zuvor gespeichert)
3. Gewählte Services bleiben im Store unverändert

### 5.3 Benutzer navigiert via Browser-Zurück und kommt wieder auf die Seite

**Trigger:** Benutzer navigiert zurück zum Hinweisfenster nachdem er weitergegangen war

**Flow:**
1. System lädt die Seite erneut
2. Guard prüft Bedingungen (selectedServices nicht leer)
3. System füllt das Textfeld mit dem gespeicherten `bookingNote` aus dem BookingStore vor
4. Zeichenzähler wird entsprechend der vorausgefüllten Zeichenanzahl aktualisiert

### 5.4 Nur ein Teil der Services hat Hinweistexte

**Trigger:** Benutzer hat nur Services gewählt, für die keine Hinweistexte definiert sind

**Flow:**
1. Abschnitt "Wichtige Hinweise" wird angezeigt, aber ohne Inhalt (oder wird ausgeblendet)
2. Nur Hinweise für tatsächlich gewählte Services mit vorhandenen Hinweistexten erscheinen

---

## 6. Exception Flows

### 6.1 Keine Services gewählt (Guard-Fail)

**Trigger:** Direktaufruf von `/home/notes` ohne Services im BookingStore

**Flow:**
1. Guard `servicesSelectedGuard` prüft `BookingStore.selectedServices`
2. Bei leerem Array: Redirect zu `/home/services`
3. Kein Fehler für Benutzer sichtbar

### 6.2 Kein Standort gewählt (Guard-Fail)

**Trigger:** Direktaufruf ohne Standort

**Flow:**
1. Guard prüft `BookingStore.selectedLocation`
2. Redirect zu `/home/location`

### 6.3 Keine Marke gewählt (Guard-Fail)

**Trigger:** Direktaufruf ohne Marke

**Flow:**
1. Guard prüft `BookingStore.selectedBrand`
2. Redirect zu `/home/brand`

---

## 7. Postconditions

### 7.1 Success — Übergabe an REQ-006
| Feld | Typ | Wert | Beschreibung |
|------|-----|------|--------------|
| `BookingStore.selectedBrand` | `Brand` | z.B. `'audi'` | Von REQ-002 (unverändert) |
| `BookingStore.selectedLocation` | `LocationDisplay` | z.B. `{ id: 'muc', name: 'München', city: 'München' }` | Von REQ-003 (unverändert) |
| `BookingStore.selectedServices` | `SelectedService[]` | z.B. `[{ serviceId: 'huau', selectedVariantId: null }]` | Von REQ-004 (unverändert) |
| `BookingStore.bookingNote` | `string \| null` | z.B. `'Bitte Öl prüfen.'` oder `null` | **Neu gesetzt** — optionale Buchungsnotiz |

### 7.2 Failure
- Keine Änderungen am BookingStore
- Guard leitet zu entsprechendem vorherigen Schritt weiter

---

## 8. Business Rules

- **BR-1:** Das Textfeld ist optional — kein Weiter-Button-Disable, keine Pflichtvalidierung
- **BR-2:** Maximale Zeichenanzahl: 1000 Zeichen (HTML `maxlength` + Reactive Forms `Validators.maxLength(1000)`)
- **BR-3:** Placeholder-Text verschwindet beim Fokussieren des Feldes (Standard `placeholder`-Attribut)
- **BR-4:** Servicespezifische Hinweise werden ausschließlich für Services aus `BookingStore.selectedServices` angezeigt
- **BR-5:** Hinweistexte sind statisch konfiguriert (Click-Dummy) und via i18n-Keys übersetzt
- **BR-6:** Leeres Textfeld wird als `null` (nicht als leerer String) im BookingStore gespeichert
- **BR-7:** Wenn der Benutzer zurücknavigiert und dann wieder vorwärts geht, wird das Feld mit dem gespeicherten Wert vorausgefüllt
- **BR-8:** Der Zeichenzähler aktualisiert sich bei jeder Eingabe in Echtzeit via `valueChanges` Observable des Reactive Forms Controls

---

## 9. Non-Functional Requirements

### Performance
- Seitenaufbau < 300ms (keine API-Calls, rein statische Daten)
- Zeichenzähler-Update < 16ms (synchrones Computed Signal / OnPush)

### Security
- Kein `[innerHTML]` — alle Texte via Angular Template Escaping
- Input-Länge durch `maxlength` und `Validators.maxLength(1000)` gesichert
- Keine sensiblen Daten im BookingStore

### Usability
- Mobile-First: Textfeld full-width auf allen Viewports
- Touch-friendly: Mindest-Touch-Target 2.75em (44px) für Buttons
- WCAG 2.1 AA: ARIA-Labels, Focus-Styles (`:focus-visible`), Kontrast 4.5:1
- Keyboard-Navigation: Tab-Reihenfolge logisch (Textfeld → Zurück → Weiter)
- Screen Reader: Zeichenzähler als `aria-live="polite"` Region

---

## 10. Data Model

```typescript
// Erweiterung von BookingState in booking.store.ts
// Neues Feld: bookingNote

// booking.store.ts — BookingState erweitern:
interface BookingState {
  brands: BrandDisplay[];
  selectedBrand: Brand | null;
  locations: LocationDisplay[];
  selectedLocation: LocationDisplay | null;
  services: ServiceDisplay[];
  selectedServices: SelectedService[];
  bookingNote: string | null;  // NEU — optionale Buchungsnotiz (max. 1000 Zeichen)
  isLoading: boolean;
  error: string | null;
}

// INITIAL_STATE erweitern:
const INITIAL_STATE: BookingState = {
  // ... bestehende Felder ...
  bookingNote: null  // NEU
};

// Neue Store-Methode in withMethods:
setBookingNote(note: string | null): void {
  patchState(store, { bookingNote: note ?? null });
}

// Servicespezifische Hinweis-Konfiguration (statisch, im Component oder Service):
interface ServiceHint {
  serviceId: ServiceType;
  hintKey: string;  // i18n-Key
}

// Bestehende Interfaces (unverändert, nur referenziert):
// - Brand (brand.model.ts)
// - LocationDisplay (location.model.ts)
// - SelectedService (service.model.ts)
// - ServiceType (service.model.ts)
```

---

## 11. UI/UX

### Mockup
![Hinweisfenster](./mockup.png)

### Layout-Struktur

```
┌──────────────────────────────────────────────────────────────────┐
│  [Header — REQ-001]                                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung           │
│  (h1 — Seitenüberschrift)                                        │
│                                                                  │
│  Möchten Sie uns noch etwas zu Ihrer Buchung mitteilen?          │
│  (h2 — Unterüberschrift)                                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Bitte tragen Sie hier Ihre Nachricht an uns ein            │  │
│  │ (Hinweise, Buchung weiterer Leistungen, etc.)              │  │
│  │                                                            │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                              0 / 1000             │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Wichtige Hinweise zu Ihren ausgewählten Services                │
│  (h2)                                                            │
│                                                                  │
│  [HU/AU — nur wenn gewählt]                                      │
│  Hinweistext für HU/AU ...                                       │
│                                                                  │
│  [Inspektion — nur wenn gewählt]                                 │
│  Hinweistext für Inspektion ...                                  │
│                                                                  │
│  [Räderwechsel — nur wenn gewählt]                               │
│  Hinweistext für Räderwechsel ...                                │
│                                                                  │
│  ┌────────────┐                         ┌────────────────────┐  │
│  │  Zurück    │                         │      Weiter        │  │
│  └────────────┘                         └────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### UI Elements

| Element | Typ | Material Component | ARIA |
|---------|-----|-------------------|------|
| Seitenüberschrift | Überschrift | `<h1>` | - |
| Unterüberschrift | Überschrift | `<h2>` | - |
| Textfeld | Textarea | `mat-form-field` + `textarea matInput` | `aria-label`, `aria-describedby` (Zeichenzähler) |
| Placeholder | Text im Textfeld | `placeholder` Attribut | - |
| Zeichenzähler | Text | `<mat-hint align="end">` | `aria-live="polite"` |
| Hinweis-Abschnitt | Section | `<section>` | `aria-label` |
| Hinweis-Überschrift | Überschrift | `<h2>` | - |
| Hinweis-Item | Text | `<p>` mit Icon | `role="note"` |
| Hinweis-Icon | Icon | `<mat-icon>` | `aria-hidden="true"` |
| Zurück-Button | Button | `mat-flat-button` | `aria-label` |
| Weiter-Button | Button | `mat-flat-button` (primary) | `aria-label` |

### Responsive Verhalten

| Viewport | Textfeld | Hinweis-Abschnitt | Buttons |
|----------|----------|-------------------|---------|
| Mobile (< 48em) | Full-width, 6 Zeilen hoch | Full-width, gestapelt | Full-width, gestapelt (Zurück oben, Weiter unten) |
| Tablet (>= 48em) | Full-width, 6 Zeilen hoch | Full-width | Nebeneinander (Zurück links, Weiter rechts) |
| Desktop (>= 64em) | Full-width, 6 Zeilen hoch | Full-width | Nebeneinander (Zurück links, Weiter rechts) |

### Design-Hinweise
- Hintergrund: `var(--color-background-page)` (hell)
- Karten/Container: `var(--color-background-surface)` (weiß)
- Text: `var(--color-text-primary)` / `var(--color-text-secondary)`
- Buttons IMMER: `mat-flat-button` (filled, KEIN `mat-stroked-button`)
- Icons: IMMER mit `.icon-framed` Rahmen
- Keine Inline-Styles, keine hardcodierten Farben oder px-Werte

---

## 12. API Specification

Keine Backend-API erforderlich. Click-Dummy: alle Daten sind statisch.

Die servicespezifischen Hinweise sind als statische Konfiguration im Component oder
in einer separaten Konstantendatei (`notes-hints.constants.ts`) hinterlegt und
werden direkt über i18n-Keys im Template gerendert.

---

## 13. Test Cases

### TC-1: Seite laden mit allen gewählten Services
- **Given:** `selectedBrand = 'audi'`, `selectedLocation = { id: 'muc', ... }`, `selectedServices = [huau, inspection, tire-change]`
- **When:** Seite `/home/notes` wird geladen
- **Then:** Überschrift sichtbar, Textfeld mit Placeholder, alle 3 Hinweistexte sichtbar, Zeichenzähler "0 / 1000"

### TC-2: Placeholder verschwindet bei Fokus
- **Given:** Seite geladen, Textfeld leer
- **When:** Benutzer klickt auf das Textfeld
- **Then:** Placeholder-Text ist nicht mehr sichtbar, Cursor im Feld

### TC-3: Zeichenzähler aktualisiert sich
- **Given:** Benutzer hat Fokus auf dem Textfeld
- **When:** Benutzer tippt "Hallo" (5 Zeichen)
- **Then:** Zeichenzähler zeigt "5 / 1000"

### TC-4: Maximale Zeichenanzahl
- **Given:** Benutzer hat 1000 Zeichen eingegeben
- **When:** Benutzer versucht weiterzutippen
- **Then:** Keine weiteren Zeichen werden akzeptiert, Zeichenzähler bleibt bei "1000 / 1000"

### TC-5: Weiter ohne Texteingabe (optional)
- **Given:** Textfeld ist leer
- **When:** Benutzer klickt "Weiter"
- **Then:** `BookingStore.bookingNote === null`, Navigation zum nächsten Schritt

### TC-6: Weiter mit Texteingabe
- **Given:** Benutzer hat "Bitte Öl prüfen." eingegeben
- **When:** Benutzer klickt "Weiter"
- **Then:** `BookingStore.bookingNote === 'Bitte Öl prüfen.'`, Navigation zum nächsten Schritt

### TC-7: Zurück-Navigation
- **Given:** Seite geladen, Benutzer hat Text eingegeben
- **When:** Benutzer klickt "Zurück"
- **Then:** Navigation zu `/home/services`, Services im Store unverändert

### TC-8: Servicespezifische Hinweise — nur für gewählte Services
- **Given:** Nur `huau` ist in `selectedServices`
- **When:** Seite wird geladen
- **Then:** Nur HU/AU-Hinweis sichtbar, kein Inspektion- oder Räderwechsel-Hinweis

### TC-9: Hinweis-Abschnitt ausgeblendet bei keinen Services
- **Given:** `selectedServices` ist leer (Guard sollte eigentlich redirecten)
- **When:** Seite wird trotzdem gerendert (Edge Case)
- **Then:** Hinweis-Abschnitt wird nicht angezeigt

### TC-10: Vorausgefülltes Textfeld bei Rücknavigation
- **Given:** Benutzer hat "Test-Notiz" eingegeben, "Weiter" geklickt, dann zurücknavigiert
- **When:** Seite `/home/notes` wird erneut geladen
- **Then:** Textfeld ist mit "Test-Notiz" vorausgefüllt, Zeichenzähler korrekt

### TC-11: Guard — keine Services
- **Given:** `BookingStore.selectedServices` ist leer
- **When:** Direktaufruf `/home/notes`
- **Then:** Redirect zu `/home/services`

### TC-12: Guard — kein Standort
- **Given:** `BookingStore.selectedLocation` ist null
- **When:** Direktaufruf `/home/notes`
- **Then:** Redirect zu `/home/location`

### TC-13: Guard — keine Marke
- **Given:** `BookingStore.selectedBrand` ist null
- **When:** Direktaufruf `/home/notes`
- **Then:** Redirect zu `/home/brand`

### TC-14: Keyboard-Navigation
- **Given:** Seite geladen
- **When:** Tab-Taste gedrückt (mehrfach)
- **Then:** Fokus-Reihenfolge: Textfeld → Zurück-Button → Weiter-Button

### TC-15: Screen Reader — Zeichenzähler
- **Given:** Screen Reader aktiv
- **When:** Benutzer tippt Text
- **Then:** Zeichenzähler-Änderung wird via `aria-live="polite"` angesagt

---

## 14. Implementation

### Components
- [ ] `NotesContainerComponent` — Container, `inject(BookingStore)`, OnPush
- [ ] `NotesFormComponent` — Presentational, `input(initialNote)`, `output(noteChanged)`, enthält `mat-form-field` + `textarea`
- [ ] `ServiceHintsComponent` — Presentational, `input(selectedServices)`, rendert statische Hinweistexte konditionell

### Store Extension
- [ ] `BookingStore` erweitern um Feld `bookingNote: string | null` in `BookingState`
- [ ] `BookingStore` erweitern um Methode `setBookingNote(note: string | null): void`
- [ ] `BookingStore` erweitern um Computed Signal `hasBookingNote`
- [ ] `INITIAL_STATE` erweitern um `bookingNote: null`

### Guards
- [ ] `servicesSelectedGuard` — prüft `BookingStore.selectedServices.length > 0`, redirect zu `/home/services`

### Route
```typescript
{
  path: 'notes',
  loadComponent: () => import('./components/notes/notes-container.component')
    .then(m => m.NotesContainerComponent),
  canActivate: [servicesSelectedGuard]
}
```

### Folder Structure
```
src/app/features/booking/components/notes/
├── notes-container.component.ts
├── notes-container.component.html
├── notes-container.component.scss
├── notes-form.component.ts
├── notes-form.component.html
├── notes-form.component.scss
├── service-hints.component.ts
├── service-hints.component.html
└── service-hints.component.scss
```

---

## 15. Dependencies

**Requires:**
- REQ-001: Header (Warenkorb-Icon, Accessibility Controls)
- REQ-002-Markenauswahl (liefert `selectedBrand`)
- REQ-003-Standortwahl (liefert `selectedLocation`)
- REQ-004-Serviceauswahl (liefert `selectedServices`)

**Blocks:**
- REQ-006 (nächster Wizard-Schritt, benötigt `bookingNote`)

---

## 16. Naming Glossary

### Container Methods
| Method | Description |
|--------|-------------|
| `onNoteChanged(note: string)` | Reactive Form valueChanges handler — aktualisiert lokalen Zeichenzähler |
| `onContinue()` | Weiter-Button geklickt — `BookingStore.setBookingNote()` + Navigation |
| `onBack()` | Zurück-Button geklickt — Navigation zu `/home/services` |

### Presentational: NotesFormComponent Inputs/Outputs
| Member | Type | Description |
|--------|------|-------------|
| `initialNote` | `input<string \| null>()` | Vorausgefüllter Wert aus BookingStore |
| `noteChanged` | `output<string \| null>()` | Emittiert bei Änderung des Textfeldes |

### Presentational: ServiceHintsComponent Inputs
| Member | Type | Description |
|--------|------|-------------|
| `selectedServices` | `input<SelectedService[]>()` | Liste der gewählten Services für konditionelles Rendering |

### Signal Store Extension (BookingStore)
| Method / Field | Description |
|---------------|-------------|
| `bookingNote` | State-Feld — gespeicherte Buchungsnotiz (`string \| null`) |
| `setBookingNote(note: string \| null)` | Setzt `bookingNote` im State |
| `hasBookingNote` | Computed Signal — Boolean, ob eine Notiz vorhanden ist |

### Guards
| Guard | Description |
|-------|-------------|
| `servicesSelectedGuard` | Prüft `selectedServices.length > 0`, redirect zu `/home/services` wenn leer |

---

## 17. i18n Keys

```typescript
// DE — in translations.ts unter booking.notes ergänzen
booking: {
  notes: {
    pageTitle: 'Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung',
    sectionTitle: 'Möchten Sie uns noch etwas zu Ihrer Buchung mitteilen?',
    textareaPlaceholder: 'Bitte tragen Sie hier Ihre Nachricht an uns ein (Hinweise, Buchung weiterer Leistungen, etc.)',
    charCount: '{{current}} / {{max}}',
    charCountAriaLabel: '{{current}} von {{max}} Zeichen verwendet',
    hintsTitle: 'Wichtige Hinweise zu Ihren ausgewählten Services',
    backButton: 'Zurück',
    continueButton: 'Weiter',
    hints: {
      huau: 'Bitte beachten Sie: Für die HU/AU benötigen Sie alle Fahrzeugpapiere. Stellen Sie sicher, dass Ihr Fahrzeug fahrtüchtig und verkehrssicher ist.',
      inspection: 'Bitte beachten Sie: Bringen Sie Ihr Serviceheft mit. Bei umfangreichen Arbeiten kann ein Ersatzfahrzeug bereitgestellt werden — bitte im Voraus anfragen.',
      tireChange: 'Bitte beachten Sie: Für die Einlagerung Ihrer Reifen bitten wir um Vorabinformation über Reifenanzahl und -größe. Die Einlagerung ist kostenpflichtig.'
    }
  }
}

// EN — in translations.ts unter booking.notes ergänzen
booking: {
  notes: {
    pageTitle: 'Please provide further notes for your booking',
    sectionTitle: 'Would you like to tell us anything else about your booking?',
    textareaPlaceholder: 'Please enter your message here (notes, booking of additional services, etc.)',
    charCount: '{{current}} / {{max}}',
    charCountAriaLabel: '{{current}} of {{max}} characters used',
    hintsTitle: 'Important notes about your selected services',
    backButton: 'Back',
    continueButton: 'Continue',
    hints: {
      huau: 'Please note: For the HU/AU you will need all vehicle documents. Make sure your vehicle is roadworthy and safe to drive.',
      inspection: 'Please note: Please bring your service booklet. For extensive work, a replacement vehicle may be provided — please enquire in advance.',
      tireChange: 'Please note: For tire storage, please inform us in advance about the number and size of tires. Storage is subject to a fee.'
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
- i18n Keys: DE + EN (beide Sprachen vollständig befüllen)
- JSDoc: bilingual

**Design-System:**
- KEINE Farben aus Screenshots!
- IMMER `_variables.scss` verwenden
- Helles Theme (`var(--color-background-surface)` für Karten/Container)
- Icons: IMMER mit `.icon-framed` Rahmen
- Buttons: IMMER `mat-flat-button` (filled)

**Store-Erweiterung:**
- Neues Feld `bookingNote: string | null` in `BookingState` in `booking.store.ts`
- `INITIAL_STATE` um `bookingNote: null` erweitern
- Neue Methode `setBookingNote(note: string | null): void` in `withMethods`
- Neues Computed Signal `hasBookingNote` in `withComputed`
- KEIN neuer Store — bestehenden `BookingStore` erweitern!

**Reactive Forms:**
- Textfeld als `FormControl<string>` mit `Validators.maxLength(1000)`
- `valueChanges` observable für Echtzeit-Zeichenzähler
- KEIN `ngModel`

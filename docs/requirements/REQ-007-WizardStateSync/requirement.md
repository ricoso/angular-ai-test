# REQ-007: Wizard State Sync (Rückwärtsnavigation)

**Status:** In Review
**Priority:** High
**Type:** Functional
**Created:** 2026-02-24
**Author:** Claude Code
**Wizard-Schritt:** N/A (Cross-Cutting, betrifft alle Schritte 2–5)

---

## 1. Overview

### 1.1 Purpose
Bei Rückwärtsnavigation im Buchungswizard werden die jeweiligen Store-Properties genullt, um UI-Flow und Store-State synchron zu halten. Dadurch wird unbeabsichtigte URL-Navigation verhindert, weil die bestehenden Guards (z.B. `brandSelectedGuard`, `locationSelectedGuard`, `servicesSelectedGuard`) den Store-State prüfen und bei fehlenden Properties zu früheren Wizard-Schritten redirecten. Dieses Requirement stellt sicher, dass alle `onBack()`-Methoden die korrekten Store-Properties zurücksetzen, damit die Guards konsistent greifen.

### 1.2 Scope
**Included:**
- Anpassung aller `onBack()`-Methoden in den Container-Components der Wizard-Schritte 2–5
- Nullung der vom jeweiligen Schritt gesetzten Store-Properties bei Rückwärtsnavigation
- Kaskadierender Reset: Wenn ein früherer Schritt erneut durchlaufen wird, sind nachfolgende Properties bereits null
- Sicherstellung, dass Direktaufrufe späterer URLs (z.B. `/home/notes`) korrekt zu `/home/brand` redirecten, wenn vorherige Properties fehlen

**Excluded:**
- Neue Guards (Guards existieren bereits und funktionieren korrekt)
- Neue UI-Elemente oder Seiten
- Neue Routes oder Route-Konfiguration
- Änderungen an der Vorwärtsnavigation (`onContinue()`)

### 1.3 Related Requirements
- REQ-002-Markenauswahl: Brand-Selection (Wizard-Schritt 1, kein Zurück-Button)
- REQ-003-Standortwahl: Location-Selection (Wizard-Schritt 2, `onBack()` betroffen)
- REQ-004-Serviceauswahl: Service-Selection (Wizard-Schritt 3, `onBack()` bereits korrekt)
- REQ-005-Hinweisfenster: Notes (Wizard-Schritt 4, `onBack()` betroffen)
- REQ-006-Terminauswahl: Appointment-Selection (Wizard-Schritt 5, `onBack()` betroffen)

---

## 2. User Story

**Als** Kunde
**möchte ich** dass bei Rückwärtsnavigation im Wizard der Store-State korrekt zurückgesetzt wird
**damit** ich nicht versehentlich auf spätere Wizard-Schritte zugreifen kann und der angezeigte Zustand immer konsistent ist.

**Acceptance Criteria:**
- [ ] AC-1: Klick auf "Zurück" in der Terminauswahl (Schritt 5) nullt `selectedAppointment` und navigiert zu `/home/notes`
- [ ] AC-2: Klick auf "Zurück" im Hinweisfenster (Schritt 4) nullt `bookingNote` und navigiert zu `/home/services`
- [ ] AC-3: Klick auf "Zurück" in der Serviceauswahl (Schritt 3) nullt `selectedServices` und navigiert zu `/home/location` (bereits implementiert)
- [ ] AC-4: Klick auf "Zurück" in der Standortwahl (Schritt 2) nullt `selectedLocation` und navigiert zu `/home/brand`
- [ ] AC-5: Nach Rückwärts-Navigation von Schritt 5 zu Schritt 4: Direktaufruf von `/home/appointment` wird von `servicesSelectedGuard` zu `/home/services` redirectet (da `selectedAppointment` null — allerdings kein eigener Appointment-Guard nötig, denn der Guard prüft Services)
- [ ] AC-6: Nach vollständiger Rückwärts-Navigation von Schritt 5 bis Schritt 1: Direktaufruf von `/home/notes` wird zu `/home/brand` redirectet (weil `selectedBrand`, `selectedLocation`, `selectedServices` alle null sind)
- [ ] AC-7: Die Vorwärtsnavigation (`onContinue()`) bleibt unverändert — kein Reset bei Weiter-Klick
- [ ] AC-8: Der Warenkorb im Header aktualisiert sich sofort nach Reset (Badge und Dropdown-Inhalt)

---

## 3. Preconditions

### 3.1 System
- Angular App läuft
- BookingStore verfügbar (`providedIn: 'root'`)
- Alle Guards existieren und sind funktional:
  - `brandSelectedGuard` prüft `hasBrandSelected()`
  - `locationSelectedGuard` prüft `hasBrandSelected()` + `hasLocationSelected()`
  - `servicesSelectedGuard` prüft `hasBrandSelected()` + `hasLocationSelected()` + `hasServicesSelected()`

### 3.2 User
- Benutzer befindet sich auf einem Wizard-Schritt (2–5)
- Benutzer hat die vorherigen Schritte durchlaufen

### 3.3 Data
- Keine zusätzlichen Daten erforderlich
- Alle Store-Properties sind aus vorherigen Schritten befüllt

---

## 4. Main Flow

Dieser Main Flow beschreibt den vollständigen Rückwärts-Navigations-Zyklus über alle Wizard-Schritte hinweg.

**Step 1:** Benutzer ist auf der Terminauswahl (Schritt 5) und klickt "Zurück"
- **User:** Klickt Zurück-Button auf `/home/appointment`
- **System:** Nullt `selectedAppointment` im BookingStore (`clearSelectedAppointment()`)
- **System:** Navigiert zu `/home/notes`
- **Expected:** `BookingStore.selectedAppointment === null`, Seite `/home/notes` wird angezeigt

**Step 2:** Benutzer ist auf dem Hinweisfenster (Schritt 4) und klickt "Zurück"
- **User:** Klickt Zurück-Button auf `/home/notes`
- **System:** Nullt `bookingNote` im BookingStore (`clearBookingNote()`)
- **System:** Navigiert zu `/home/services`
- **Expected:** `BookingStore.bookingNote === null`, Seite `/home/services` wird angezeigt

**Step 3:** Benutzer ist auf der Serviceauswahl (Schritt 3) und klickt "Zurück"
- **User:** Klickt Zurück-Button auf `/home/services`
- **System:** Nullt `selectedServices` im BookingStore (`clearSelectedServices()`) — bereits implementiert
- **System:** Navigiert zu `/home/location`
- **Expected:** `BookingStore.selectedServices === null`, Seite `/home/location` wird angezeigt

**Step 4:** Benutzer ist auf der Standortwahl (Schritt 2) und klickt "Zurück"
- **User:** Klickt Zurück-Button auf `/home/location`
- **System:** Nullt `selectedLocation` im BookingStore (`setLocation(null)` oder neue Methode `clearSelectedLocation()`)
- **System:** Navigiert zu `/home/brand`
- **Expected:** `BookingStore.selectedLocation === null`, Seite `/home/brand` wird angezeigt

**Step 5:** Benutzer versucht nach vollständiger Rückwärts-Navigation, direkt `/home/notes` aufzurufen
- **User:** Gibt `/home/notes` in die Adressleiste ein
- **System:** `servicesSelectedGuard` prüft `hasBrandSelected()` → `false` (da `selectedBrand` noch gesetzt ist — Marke wurde im Schritt 1 nicht gelöscht)
- **System:** `servicesSelectedGuard` prüft `hasLocationSelected()` → `false` (da `selectedLocation === null` nach Step 4)
- **System:** Redirect zu `/home/location`
- **System:** `brandSelectedGuard` (in locationSelectedGuard integriert) prüft `hasBrandSelected()` → wenn Marke noch gesetzt, zeigt Location-Seite
- **Expected:** Guard-Kaskade leitet den Benutzer zum frühesten unvollständigen Schritt

**Step 6:** Vollständig zurücknavigierter Benutzer versucht direkt `/home/appointment` aufzurufen
- **User:** Gibt `/home/appointment` in die Adressleiste ein (nach vollständiger Rücknavigation ab Schritt 2)
- **System:** `servicesSelectedGuard` prüft Store-Properties kaskadierend
- **System:** Redirect zu `/home/location` (oder `/home/brand` falls auch Marke fehlt)
- **Expected:** Benutzer wird zum frühesten Schritt mit fehlenden Daten geleitet

---

## 5. Alternative Flows

### 5.1 Benutzer navigiert nicht vollständig zurück

**Trigger:** Benutzer navigiert von Schritt 5 zu Schritt 4 zurück, wählt aber dort "Weiter" statt erneut "Zurück"

**Flow:**
1. `selectedAppointment` ist bereits null (durch Step 1)
2. Benutzer klickt "Weiter" auf Schritt 4 (Notes)
3. System speichert `bookingNote` und navigiert zu `/home/appointment`
4. Benutzer muss Termin erneut wählen (da `selectedAppointment === null`)

### 5.2 Browser-Zurück-Button statt Wizard-Zurück

**Trigger:** Benutzer nutzt den Browser-Zurück-Button statt den Wizard-Zurück-Button

**Flow:**
1. Browser navigiert zur vorherigen URL
2. Store-Properties werden NICHT genullt (Browser-Zurück löst kein `onBack()` aus)
3. Guard prüft Store-State — da Properties noch gesetzt sind, wird die Seite normal angezeigt
4. Dieses Verhalten ist akzeptabel (Browser-Zurück ist kein expliziter "Schritt zurück" im Wizard)

### 5.3 Markenauswahl — kein Zurück-Button

**Trigger:** Benutzer ist auf Schritt 1 (Markenauswahl)

**Flow:**
1. Schritt 1 hat keinen Zurück-Button (Einstiegsseite)
2. Kein Store-Reset nötig
3. Markenwechsel (neue Marke wählen) wird über das bestehende `setBrand()` abgedeckt — REQ-002 beschreibt, dass bei Markenwechsel Standort und Services zurückgesetzt werden

---

## 6. Exception Flows

### 6.1 Store bereits leer bei Zurück-Navigation

**Trigger:** Property ist bereits `null` / leer, wenn `onBack()` aufgerufen wird

**Flow:**
1. System ruft trotzdem die Reset-Methode auf (`clearSelectedAppointment()`, `clearBookingNote()` etc.)
2. `patchState` mit gleichem Wert ist idempotent — kein Fehler
3. Navigation erfolgt normal

### 6.2 Guard-Kaskade bei mehrfach fehlenden Properties

**Trigger:** Benutzer hat mehrere Schritte zurücknavigiert und versucht einen späten Schritt direkt aufzurufen

**Flow:**
1. Guard prüft Properties in Reihenfolge: Brand → Location → Services
2. Redirect zum frühesten fehlenden Schritt
3. Benutzer durchläuft den Wizard ab dem fehlenden Schritt erneut

---

## 7. Postconditions

### 7.1 Success
- Alle `onBack()`-Methoden nullen die korrekten Store-Properties vor der Navigation
- Guards greifen korrekt bei fehlenden Properties und redirecten zum frühesten unvollständigen Schritt
- Warenkorb im Header aktualisiert sich sofort (Badges und Dropdown-Inhalt)
- Kein inkonsistenter Store-State möglich durch Rückwärtsnavigation

### 7.2 Failure
- Keine Änderungen am Store (falls `onBack()` nicht aufgerufen wird)
- Bei Fehler in Navigation: Benutzer bleibt auf aktueller Seite

---

## 8. Business Rules

- **BR-1:** Jede `onBack()`-Methode MUSS die Store-Properties nullen, die der aktuelle Schritt gesetzt hat, BEVOR die Navigation erfolgt
- **BR-2:** Nur die Properties des aktuellen Schritts werden genullt — Properties vorheriger Schritte bleiben erhalten (z.B. bei Zurück von Schritt 4 bleibt `selectedBrand` und `selectedLocation` erhalten)
- **BR-3:** Die bestehende `clearSelectedServices()` in ServiceSelection `onBack()` ist bereits korrekt implementiert und darf nicht verändert werden
- **BR-4:** Die Vorwärtsnavigation (`onContinue()`) wird NICHT modifiziert — kein Reset bei Weiter-Klick
- **BR-5:** Browser-Zurück-Button (History Back) löst keinen Store-Reset aus — nur der explizite Wizard-Zurück-Button
- **BR-6:** Store-Reset-Methoden sind idempotent — mehrfacher Aufruf mit demselben Wert hat keine Nebeneffekte
- **BR-7:** Die Reihenfolge in `onBack()` ist: 1. Store-Reset, 2. Navigation (damit der Guard auf der Zielseite den korrekten State vorfindet)

---

## 9. Non-Functional Requirements

### Performance
- Store-Reset < 1ms (synchroner `patchState`-Call)
- Navigation nach Reset < 50ms (Angular Router)

### Security
- Keine zusätzlichen Security-Anforderungen
- Guards sind bereits implementiert und prüfen den Store-State

### Usability
- Rückwärtsnavigation verhält sich erwartungskonform (genullte Daten müssen erneut eingegeben werden)
- Warenkorb-Badge im Header aktualisiert sich sofort
- Keine visuellen Artefakte oder Flicker bei Navigation

---

## 10. Data Model

```typescript
// Bestehender BookingState (KEINE Erweiterung nötig):
interface BookingState {
  brands: BrandDisplay[];
  selectedBrand: Brand | null;
  locations: LocationDisplay[];
  selectedLocation: LocationDisplay | null;
  services: ServiceDisplay[];
  selectedServices: SelectedService[] | null;
  bookingNote: string | null;
  appointments: AppointmentSlot[];
  selectedAppointment: AppointmentSlot | null;
  isLoading: boolean;
  error: string | null;
}

// Bestehende Reset-Methoden im BookingStore:
// clearSelectedServices(): void — setzt selectedServices auf null
// clearSelectedAppointment(): void — setzt selectedAppointment auf null
// clearBookingNote(): void — setzt bookingNote auf null
// resetBooking(): void — setzt gesamten State auf INITIAL_STATE

// Eventuell NEUE Methode (falls nicht über setLocation(null) abbildbar):
// clearSelectedLocation(): void — setzt selectedLocation auf null
```

**Reset-Matrix (welche Property wird bei welchem onBack() genullt):**

| Schritt | onBack() in Component | Nullt Property | Store-Methode |
|---------|----------------------|----------------|---------------|
| Schritt 2 (Location) | `LocationSelectionContainerComponent.onBack()` | `selectedLocation` | `clearSelectedLocation()` (NEU) oder `patchState` |
| Schritt 3 (Services) | `ServiceSelectionContainerComponent.onBack()` | `selectedServices` | `clearSelectedServices()` (EXISTIERT) |
| Schritt 4 (Notes) | `NotesContainerComponent.onBack()` | `bookingNote` | `clearBookingNote()` (EXISTIERT) |
| Schritt 5 (Appointment) | `AppointmentSelectionContainerComponent.onBack()` | `selectedAppointment` | `clearSelectedAppointment()` (EXISTIERT) |

---

## 11. UI/UX

### Kein neues UI-Element

Dieses Requirement erzeugt keine neuen UI-Elemente, Seiten oder Komponenten. Es modifiziert ausschließlich das Verhalten der bestehenden **Zurück-Buttons** in den Wizard-Schritten 2–5.

### Betroffene Zurück-Buttons

| Wizard-Schritt | Route | Zurück-Button | Navigiert zu |
|----------------|-------|---------------|-------------|
| Standortwahl (Schritt 2) | `/home/location` | `mat-flat-button` mit `arrow_back` Icon | `/home/brand` |
| Serviceauswahl (Schritt 3) | `/home/services` | `mat-flat-button` mit `arrow_back` Icon | `/home/location` |
| Hinweisfenster (Schritt 4) | `/home/notes` | `mat-flat-button` mit `arrow_back` Icon | `/home/services` |
| Terminauswahl (Schritt 5) | `/home/appointment` | `mat-flat-button` mit `arrow_back` Icon | `/home/notes` |

### Visuelles Verhalten nach Reset

- Warenkorb-Badge im Header aktualisiert sich sofort (genullte Services → Badge-Zähler sinkt oder verschwindet)
- Warenkorb-Dropdown zeigt nur noch die verbleibenden, nicht-genullten Properties
- Zurück-Button selbst ändert sich visuell nicht (gleicher Stil wie bisher)

### Kein Mockup nötig

Da keine neuen UI-Elemente erstellt werden, ist kein Mockup erforderlich.

---

## 12. API Specification

Keine Backend-API erforderlich. Rein Frontend-basierte Änderung am Store-State und Container-Component-Logik.

---

## 13. Test Cases

### TC-1: Appointment onBack() nullt selectedAppointment (AC-1)
- **Given:** Benutzer ist auf `/home/appointment`, `selectedAppointment` ist gesetzt
- **When:** Klick auf "Zurück"-Button
- **Then:** `BookingStore.selectedAppointment === null`, Navigation zu `/home/notes`

### TC-2: Notes onBack() nullt bookingNote (AC-2)
- **Given:** Benutzer ist auf `/home/notes`, `bookingNote` ist gesetzt (z.B. "Bitte Öl prüfen.")
- **When:** Klick auf "Zurück"-Button
- **Then:** `BookingStore.bookingNote === null`, Navigation zu `/home/services`

### TC-3: Services onBack() nullt selectedServices (AC-3, bereits implementiert)
- **Given:** Benutzer ist auf `/home/services`, `selectedServices` enthält 2 Services
- **When:** Klick auf "Zurück"-Button
- **Then:** `BookingStore.selectedServices === null`, Navigation zu `/home/location`

### TC-4: Location onBack() nullt selectedLocation (AC-4)
- **Given:** Benutzer ist auf `/home/location`, `selectedLocation` ist gesetzt (z.B. München)
- **When:** Klick auf "Zurück"-Button
- **Then:** `BookingStore.selectedLocation === null`, Navigation zu `/home/brand`

### TC-5: Guard-Redirect nach Rückwärts-Navigation von Notes (AC-6)
- **Given:** Benutzer hat von Schritt 5 bis Schritt 2 zurücknavigiert, `selectedLocation === null`, `selectedServices === null`
- **When:** Direktaufruf von `/home/notes` via Adressleiste
- **Then:** `servicesSelectedGuard` prüft `hasLocationSelected()` → `false`, Redirect zu `/home/location`

### TC-6: Guard-Redirect nach vollständiger Rückwärts-Navigation (AC-6)
- **Given:** Benutzer hat von Schritt 5 bis Schritt 2 zurücknavigiert, `selectedLocation === null`
- **When:** Direktaufruf von `/home/appointment` via Adressleiste
- **Then:** Guard-Kaskade redirected zu `/home/location` (oder `/home/brand` falls Marke fehlt)

### TC-7: Weiter-Navigation bleibt unverändert (AC-7)
- **Given:** Benutzer ist auf `/home/services`, hat Services gewählt
- **When:** Klick auf "Weiter"-Button
- **Then:** `selectedServices` bleibt im Store (kein Reset), Navigation zu `/home/notes`

### TC-8: Warenkorb aktualisiert sich nach onBack() (AC-8)
- **Given:** Benutzer hat Marke, Standort, 2 Services und Notiz gewählt (Badge zeigt "2")
- **When:** Klick auf "Zurück" auf Notes-Seite (nullt bookingNote), dann "Zurück" auf Services-Seite (nullt selectedServices)
- **Then:** Warenkorb-Badge verschwindet (0 Services), Dropdown zeigt nur noch Marke + Standort

### TC-9: E2E — Komplette Rückwärts-Navigation und anschließende URL-Navigation
- **Given:** Benutzer durchläuft Wizard bis Schritt 5 (Appointment): Marke = Audi, Standort = München, Services = [HU/AU], Notiz = "Test", Termin gewählt
- **When:** Benutzer klickt 4x "Zurück" (Appointment → Notes → Services → Location → Brand)
- **Then:** Nach jeder Rückwärts-Navigation ist die jeweilige Property null; Direktaufruf von `/home/appointment` redirected zu `/home/location`

### TC-10: E2E — Partielles Zurück und erneut Vorwärts
- **Given:** Benutzer ist auf Schritt 5, navigiert zurück zu Schritt 4
- **When:** Benutzer klickt "Weiter" auf Notes-Seite (setzt bookingNote erneut)
- **Then:** Benutzer landet auf `/home/appointment`, `selectedAppointment === null` (muss neu gewählt werden), `bookingNote` ist wieder gesetzt

### TC-11: Idempotenter Reset (6.1)
- **Given:** `selectedAppointment` ist bereits `null`
- **When:** `onBack()` wird in AppointmentContainer aufgerufen
- **Then:** Kein Fehler, Navigation erfolgt normal

### TC-12: Browser-Zurück nullt Store NICHT (5.2)
- **Given:** Benutzer ist auf Schritt 5, `selectedAppointment` ist gesetzt
- **When:** Benutzer drückt Browser-Zurück-Button
- **Then:** `selectedAppointment` bleibt im Store (kein Reset), Seite `/home/notes` wird normal angezeigt

---

## 14. Implementation

### Bestehende Dateien — Änderungen (KEINE neuen Dateien!)

**Container-Components — `onBack()` anpassen:**
- [ ] `src/app/features/booking/components/location-selection/location-selection-container.component.ts` — `onBack()`: `selectedLocation` nullen vor Navigation
- [ ] `src/app/features/booking/components/notes/notes-container.component.ts` — `onBack()`: `bookingNote` nullen vor Navigation
- [ ] `src/app/features/booking/components/appointment-selection/appointment-selection-container.component.ts` — `onBack()`: `selectedAppointment` nullen vor Navigation

**Bereits korrekt implementiert (KEINE Änderung nötig):**
- [x] `src/app/features/booking/components/service-selection/service-selection-container.component.ts` — `onBack()` ruft bereits `clearSelectedServices()` auf

**Store — optionale Erweiterung:**
- [ ] `src/app/features/booking/stores/booking.store.ts` — Neue Methode `clearSelectedLocation(): void` (setzt `selectedLocation: null`) hinzufügen, FALLS nicht über bestehende Methode abbildbar

**Guards — KEINE Änderung nötig:**
- [x] `src/app/features/booking/guards/brand-selected.guard.ts` — funktioniert bereits korrekt
- [x] `src/app/features/booking/guards/location-selected.guard.ts` — funktioniert bereits korrekt
- [x] `src/app/features/booking/guards/services-selected.guard.ts` — funktioniert bereits korrekt

### Konkrete Code-Änderungen

**1. `location-selection-container.component.ts` — `onBack()` erweitern:**
```typescript
// VORHER:
protected onBack(): void {
  void this.router.navigate(['/home/brand']);
}

// NACHHER:
protected onBack(): void {
  this.store.clearSelectedLocation();
  void this.router.navigate(['/home/brand']);
}
```

**2. `notes-container.component.ts` — `onBack()` erweitern:**
```typescript
// VORHER:
protected onBack(): void {
  void this.router.navigate(['/home/services']);
}

// NACHHER:
protected onBack(): void {
  this.store.clearBookingNote();
  void this.router.navigate(['/home/services']);
}
```

**3. `appointment-selection-container.component.ts` — `onBack()` erweitern:**
```typescript
// VORHER:
protected onBack(): void {
  void this.router.navigate(['/home/notes']);
}

// NACHHER:
protected onBack(): void {
  this.store.clearSelectedAppointment();
  void this.router.navigate(['/home/notes']);
}
```

**4. `booking.store.ts` — neue Methode (optional):**
```typescript
clearSelectedLocation(): void {
  patchState(store, { selectedLocation: null });
}
```

### Effort
- Development: 1-2 Stunden
- Testing: 1-2 Stunden

---

## 15. Dependencies

**Requires:**
- REQ-002-Markenauswahl (Brand-Selection Container)
- REQ-003-Standortwahl (Location-Selection Container + `brandSelectedGuard`)
- REQ-004-Serviceauswahl (Service-Selection Container + `locationSelectedGuard`)
- REQ-005-Hinweisfenster (Notes Container + `servicesSelectedGuard`)
- REQ-006-Terminauswahl (Appointment-Selection Container + `servicesSelectedGuard`)

**Blocks:**
- Keine — dieses REQ verbessert die Konsistenz des bestehenden Wizards

---

## 16. Naming Glossary

### Container Methods — Geänderte `onBack()`

| Component | Methode | Beschreibung |
|-----------|---------|--------------|
| `LocationSelectionContainerComponent` | `onBack()` | Nullt `selectedLocation`, navigiert zu `/home/brand` |
| `ServiceSelectionContainerComponent` | `onBack()` | Nullt `selectedServices` (BEREITS IMPLEMENTIERT), navigiert zu `/home/location` |
| `NotesContainerComponent` | `onBack()` | Nullt `bookingNote`, navigiert zu `/home/services` |
| `AppointmentSelectionContainerComponent` | `onBack()` | Nullt `selectedAppointment`, navigiert zu `/home/notes` |

### Signal Store Methods — Bestehend + Neu

| Methode | Status | Beschreibung |
|---------|--------|--------------|
| `clearSelectedServices()` | EXISTIERT | Setzt `selectedServices` auf `null` |
| `clearSelectedAppointment()` | EXISTIERT | Setzt `selectedAppointment` auf `null` |
| `clearBookingNote()` | EXISTIERT | Setzt `bookingNote` auf `null` |
| `clearSelectedLocation()` | **NEU** | Setzt `selectedLocation` auf `null` |

### Computed Signals — Bestehend (von Guards genutzt)

| Signal | Beschreibung | Genutzt von Guard |
|--------|--------------|-------------------|
| `hasBrandSelected` | `selectedBrand !== null` | `brandSelectedGuard`, `locationSelectedGuard`, `servicesSelectedGuard` |
| `hasLocationSelected` | `selectedLocation !== null` | `locationSelectedGuard`, `servicesSelectedGuard` |
| `hasServicesSelected` | `selectedServices !== null` | `servicesSelectedGuard` |
| `hasAppointmentSelected` | `selectedAppointment !== null` | (kein eigener Guard) |

---

## 17. Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Tech Lead | | |

---

## 18. Implementation Notes

**WICHTIG: Code muss BILINGUAL sein!**

- Kommentare DE + EN
- JSDoc bilingual

**Kein neues UI, kein neues Styling:**
- Dieses REQ ändert ausschließlich TypeScript-Logik in bestehenden Container-Components und dem BookingStore
- Keine HTML-, SCSS- oder i18n-Änderungen nötig

**IST-Analyse der bestehenden `onBack()`-Methoden:**

| Component | Datei | IST-Zustand | SOLL-Zustand |
|-----------|-------|-------------|--------------|
| `LocationSelectionContainerComponent` | `location-selection-container.component.ts` | Navigiert NUR zu `/home/brand` — **kein Reset** | `clearSelectedLocation()` + Navigation |
| `ServiceSelectionContainerComponent` | `service-selection-container.component.ts` | Ruft `clearSelectedServices()` auf + Navigation — **korrekt** | Keine Änderung nötig |
| `NotesContainerComponent` | `notes-container.component.ts` | Navigiert NUR zu `/home/services` — **kein Reset** | `clearBookingNote()` + Navigation |
| `AppointmentSelectionContainerComponent` | `appointment-selection-container.component.ts` | Navigiert NUR zu `/home/notes` — **kein Reset** | `clearSelectedAppointment()` + Navigation |

**Store-Methoden — Verfügbarkeit:**

| Methode | Vorhanden | Hinweis |
|---------|-----------|---------|
| `clearSelectedServices()` | Ja (Zeile 187–189) | Setzt `selectedServices` auf `null`, wird bereits in `ServiceSelectionContainerComponent.onBack()` genutzt |
| `clearSelectedAppointment()` | Ja (Zeile 183–185) | Vorhanden, aber wird in `onBack()` noch NICHT aufgerufen |
| `clearBookingNote()` | Ja | Vorhanden, setzt `bookingNote` auf `null`, aber wird in `onBack()` noch NICHT aufgerufen |
| `clearSelectedLocation()` | **Nein** | MUSS NEU erstellt werden (analog zu `clearSelectedAppointment()`) |

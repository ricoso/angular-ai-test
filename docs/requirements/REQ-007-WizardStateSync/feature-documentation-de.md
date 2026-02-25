# Feature-Dokumentation: Wizard State Sync (Rueckwaertsnavigation)

**Erstellt:** 2026-02-25
**Requirement:** REQ-007-WizardStateSync
**Sprache:** DE
**Status:** Implementiert

---

## Uebersicht

Wizard State Sync ist ein Cross-Cutting Requirement, das die Rueckwaertsnavigation im Buchungswizard verbessert. Bei Klick auf den "Zurueck"-Button in den Wizard-Schritten 2 bis 5 werden die jeweiligen Store-Properties zurueckgesetzt (genullt), bevor die Navigation zum vorherigen Schritt erfolgt. Dadurch bleiben UI-Flow und Store-State konsistent synchron. Die bestehenden Route Guards (`brandSelectedGuard`, `locationSelectedGuard`, `servicesSelectedGuard`) pruefen den Store-State und verhindern so, dass Benutzer per Direkt-URL auf spaetere Wizard-Schritte zugreifen koennen, wenn die erforderlichen Daten fehlen.

Dieses Feature erzeugt keine neuen UI-Elemente, Seiten oder Komponenten. Es modifiziert ausschliesslich die `onBack()`-Methoden in bestehenden Container-Components und ergaenzt den BookingStore um zwei neue Clear-Methoden.

---

## Benutzerführung

### Schritt 1: Zurueck von der Terminauswahl (Schritt 5)

**Beschreibung:** Der Benutzer befindet sich auf der Terminauswahl (`/home/appointment`) und klickt auf den "Zurueck"-Button. Das System setzt `selectedAppointment` im BookingStore auf `null` (via `clearSelectedAppointment()`) und navigiert anschliessend zur Notizen-Seite (`/home/notes`). Der gewaehlte Termin wird aus dem Warenkorb-Dropdown entfernt.

### Schritt 2: Zurueck vom Hinweisfenster (Schritt 4)

**Beschreibung:** Der Benutzer befindet sich auf der Notizen-Seite (`/home/notes`) und klickt auf den "Zurueck"-Button. Das System setzt `bookingNote` im BookingStore auf `null` (via `clearBookingNote()`) und navigiert zur Serviceauswahl (`/home/services`). Die eingegebene Notiz wird verworfen.

### Schritt 3: Zurueck von der Serviceauswahl (Schritt 3)

**Beschreibung:** Der Benutzer befindet sich auf der Serviceauswahl (`/home/services`) und klickt auf den "Zurueck"-Button. Das System setzt `selectedServices` im BookingStore auf leer (via `clearSelectedServices()` -- bereits vor REQ-007 implementiert) und navigiert zur Standortwahl (`/home/location`). Die gewaehlten Services werden aus dem Warenkorb entfernt, der Badge-Zaehler im Header sinkt oder verschwindet.

### Schritt 4: Zurueck von der Standortwahl (Schritt 2)

**Beschreibung:** Der Benutzer befindet sich auf der Standortwahl (`/home/location`) und klickt auf den "Zurueck"-Button. Das System setzt `selectedLocation` im BookingStore auf `null` (via `clearSelectedLocation()`) und navigiert zur Markenauswahl (`/home/brand`). Der gewaehlte Standort wird verworfen.

### Schritt 5: Guard-Schutz bei Direkt-URL nach Rueckwaertsnavigation

**Beschreibung:** Nachdem der Benutzer mehrere Schritte zuruecknavigiert hat (z.B. von Schritt 5 bis Schritt 2), sind die entsprechenden Store-Properties `null`. Versucht der Benutzer nun, eine spaetere Wizard-URL direkt aufzurufen (z.B. `/home/notes` oder `/home/appointment`), pruefen die bestehenden Guards den Store-State kaskadierend. Da die erforderlichen Properties fehlen, wird der Benutzer automatisch zum fruehesten unvollstaendigen Schritt weitergeleitet.

### Schritt 6: Warenkorb-Aktualisierung

**Beschreibung:** Nach jedem Store-Reset aktualisiert sich der Warenkorb im Header sofort. Genullte Properties (Services, Termin, Notiz) verschwinden aus dem Dropdown und der Badge-Zaehler passt sich entsprechend an. Verbleibende, nicht-genullte Properties (z.B. Marke und Standort bei Ruecknavigation von Schritt 4) bleiben weiterhin im Warenkorb sichtbar.

---

## Akzeptanzkriterien

| AC | Beschreibung | Status |
|----|-------------|--------|
| AC-1 | Klick auf "Zurueck" in der Terminauswahl nullt `selectedAppointment` und navigiert zu `/home/notes` | Implementiert |
| AC-2 | Klick auf "Zurueck" im Hinweisfenster nullt `bookingNote` und navigiert zu `/home/services` | Implementiert |
| AC-3 | Klick auf "Zurueck" in der Serviceauswahl nullt `selectedServices` und navigiert zu `/home/location` (bereits implementiert) | Implementiert |
| AC-4 | Klick auf "Zurueck" in der Standortwahl nullt `selectedLocation` und navigiert zu `/home/brand` | Implementiert |
| AC-5 | Nach Rueckwaerts-Navigation: Direktaufruf spaeterer URLs wird von Guards korrekt redirected | Implementiert |
| AC-6 | Nach vollstaendiger Rueckwaerts-Navigation: Direktaufruf von `/home/notes` wird zum fruehesten fehlenden Schritt redirected | Implementiert |
| AC-7 | Die Vorwaertsnavigation (`onContinue()`) bleibt unveraendert -- kein Reset bei Weiter-Klick | Implementiert |
| AC-8 | Der Warenkorb im Header aktualisiert sich sofort nach Reset (Badge und Dropdown-Inhalt) | Implementiert |

---

## Responsive Ansichten

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

Der Wizard zeigt nach der Rueckwaertsnavigation den vorherigen Schritt korrekt an. Alle Store-Properties sind synchron, der Warenkorb im Header spiegelt den aktuellen State wider.

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

Auf dem Tablet bleibt das Layout der Wizard-Schritte konsistent. Die Zurueck-Buttons sind touch-freundlich dimensioniert und der State-Reset funktioniert identisch zur Desktop-Ansicht.

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

In der mobilen Ansicht sind die Zurueck-Buttons vollflaechig dargestellt mit mindestens 2.75em Touch-Target-Groesse. Der Warenkorb-Badge im Header aktualisiert sich sofort nach dem Store-Reset.

---

## Barrierefreiheit

- **Tastaturnavigation:** Die bestehenden Zurueck-Buttons sind per Tab erreichbar und per Enter oder Space auslösbar. Das Store-Reset-Verhalten ist transparent fuer die Tastaturnavigation.
- **Screen Reader:** Keine Aenderungen an ARIA-Attributen erforderlich. Die Zurueck-Buttons behalten ihre bestehenden `aria-label`-Attribute bei.
- **Farbkontrast:** WCAG 2.1 AA konform -- keine visuellen Aenderungen an den Buttons.
- **Focus-Styles:** Bestehende `:focus-visible` Styles bleiben erhalten.

---

## Technische Details

| Eigenschaft | Wert |
|-------------|------|
| Route | N/A (Cross-Cutting, betrifft alle Wizard-Routen) |
| Container Components | `LocationSelectionContainerComponent`, `NotesContainerComponent`, `AppointmentSelectionContainerComponent` |
| Store | `BookingStore` (providedIn: 'root') |
| Neue Store-Methoden | `clearSelectedLocation()`, `clearBookingNote()` |
| Guards (unveraendert) | `brandSelectedGuard`, `locationSelectedGuard`, `servicesSelectedGuard` |
| Change Detection | OnPush |

---

## Geaenderte Dateien

| Datei | Aenderung |
|-------|-----------|
| `booking.store.ts` | Neue Methoden `clearSelectedLocation()` und `clearBookingNote()` |
| `location-selection-container.component.ts` | `onBack()`: Ruft `clearSelectedLocation()` vor Navigation auf |
| `notes-container.component.ts` | `onBack()`: Ruft `clearBookingNote()` vor Navigation auf |
| `appointment-selection-container.component.ts` | `onBack()`: Ruft `clearSelectedAppointment()` vor Navigation auf |

---

## Reset-Matrix

| Wizard-Schritt | onBack() in Component | Genullte Property | Store-Methode |
|----------------|-----------------------|-------------------|---------------|
| Schritt 2 (Standortwahl) | `LocationSelectionContainerComponent.onBack()` | `selectedLocation` | `clearSelectedLocation()` |
| Schritt 3 (Serviceauswahl) | `ServiceSelectionContainerComponent.onBack()` | `selectedServices` | `clearSelectedServices()` |
| Schritt 4 (Hinweisfenster) | `NotesContainerComponent.onBack()` | `bookingNote` | `clearBookingNote()` |
| Schritt 5 (Terminauswahl) | `AppointmentSelectionContainerComponent.onBack()` | `selectedAppointment` | `clearSelectedAppointment()` |

---

## Geschaeftsregeln

- **BR-1:** Jede `onBack()`-Methode nullt die Store-Properties des aktuellen Schritts BEVOR die Navigation erfolgt.
- **BR-2:** Nur die Properties des aktuellen Schritts werden genullt -- Properties vorheriger Schritte bleiben erhalten.
- **BR-3:** Die Vorwaertsnavigation (`onContinue()`) wird NICHT modifiziert.
- **BR-4:** Browser-Zurueck-Button loest keinen Store-Reset aus -- nur der explizite Wizard-Zurueck-Button.
- **BR-5:** Store-Reset-Methoden sind idempotent -- mehrfacher Aufruf hat keine Nebeneffekte.
- **BR-6:** Reihenfolge in `onBack()`: 1. Store-Reset, 2. Navigation.

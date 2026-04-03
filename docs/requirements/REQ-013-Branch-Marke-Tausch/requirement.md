# REQ-013: Branch-Marke-Tausch

**Status:** Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-04-02
**Author:** Claude Code

---

## 1. Overview

### 1.1 Purpose
Refactoring des Wizard-Flows: Die Reihenfolge der Schritte "Markenauswahl" (REQ-002) und "Standortwahl" (REQ-003) wird getauscht. Bisher wählt der Nutzer zuerst eine Fahrzeugmarke und dann einen Standort. NEU: Die Branch-ID (Standort/Filiale) ist zuerst bekannt (z.B. via URL-Parameter oder wird als erster Wizard-Schritt ausgewählt), danach werden die am Standort verfügbaren Marken geladen und angezeigt.

### 1.2 Scope
**Included:**
- Tausch der Wizard-Schritte: Schritt 1 = Standort (Branch), Schritt 2 = Marke (gefiltert nach Standort)
- Anpassung des BookingStore: `selectedLocation` wird vor `selectedBrand` gesetzt
- Neue Datenstruktur: `BRANDS_BY_LOCATION` (Marken pro Standort) statt nur `LOCATIONS_BY_BRAND`
- **Branch-Config-Datei** (`branch-config.json`): Hält Branch-ID, Name und Adresse der Werkstatt. Einfach erweiterbar ohne Code-Änderungen — neue Filialen werden nur in der JSON-Datei hinzugefügt.
- **Wizard-Breadcrumb**: Horizontale Schritt-Anzeige (Stepper) auf ALLEN Wizard-Seiten (Standort → Marke → Service → Hinweise → Termin → Fahrzeugdaten → Übersicht). Zeigt aktuellen Schritt hervorgehoben, erledigte Schritte als abgehakt, zukünftige ausgegraut.
- Anpassung aller Guards, Resolver und Routes
- Anpassung der Zurück-Button-Logik (Markenauswahl zurück zu Standortwahl)
- Anpassung des `loadBrands`-Aufrufs: benötigt jetzt eine Location-ID als Parameter
- Anpassung der `loadLocations`-Methode: lädt jetzt ALLE Standorte (ohne Brand-Filter)
- API-Service-Anpassung: `getBrandsByLocation(locationId)` statt `getBrands()`
- **Marken-SVG-Logos durchgängig im gesamten UI**: Echte SVG-Logos der Marken (aus `assets/brands/`) werden überall angezeigt wo Marken vorkommen — Standortwahl-Cards (Orientierung), Markenauswahl (Schritt 2, groß), Warenkorb/Header (klein neben Auswahl), Buchungsübersicht, Service-Auswahl-Header, etc. Konsistentes visuelles Branding über alle Wizard-Schritte.
- **Bugfix Warenkorb-Dropdown** (bestehender Bug):
  - **Service-Optionen abgeschnitten:** Die `optionLabels` im Warenkorb-Chip werden mit `join(', ')` als einzeiliger Text dargestellt und bei langen Texten abgeschnitten (z.B. "TÜV, UVV-Prüfung (für Di..."). Fix: Alle Optionen vollständig anzeigen — entweder mehrzeilig oder als separate Unter-Chips.
  - **Selection-Icon abgeschnitten:** Der Checkmark/Badge auf den Service-Cards (`service-card.component`) wird am Rand abgeschnitten (`overflow: hidden` Problem). Fix: `overflow: visible` setzen oder Icon-Positionierung korrigieren.
  - **Alle gewählten Service-Details anzeigen:** Warenkorb soll pro Service ALLE gewählten Optionen/Varianten vollständig auflisten, nicht nur den Titel.

- **VIN/FIN entfernt** (betrifft REQ-009): Das Fahrzeugformular enthält nur noch Kfz-Kennzeichen + Kilometerstand. Die VIN/FIN wurde entfernt — es wird nur mit Nummernschild gearbeitet. Betrifft: `VehicleInfo` Interface, `vehicle-form.component`, `carinformation-container.component`.
- **Preis-Kachel ersetzt durch Hinweise & Optionen** (betrifft REQ-010): In der Buchungsübersicht wird statt der Preis-Kachel die Hinweisseite-Daten angezeigt: Mobilitätsoption, Terminpräferenz, Rückruf, Nachricht. Betrifft: `price-tile.component` (umgebaut).
- **Wizard-Breadcrumb Reset:** Klick auf erledigten Schritt im Breadcrumb löscht alle nachfolgenden Schritte bis zum aktuellen aus dem Store (cascading reset). Betrifft: `wizard-breadcrumb.component`, `BookingStore.resetFromStep()`.

**Excluded:**
- Serviceauswahl (REQ-004) — nur Guard-Anpassung (prüft weiterhin `selectedLocation`)
- Wizard-Schritte ab REQ-005 bleiben inhaltlich unverändert (bekommen aber den Breadcrumb)

### 1.3 Related Requirements
- REQ-002: Markenauswahl (wird zu Wizard-Schritt 2, bekommt Zurück-Button)
- REQ-003: Standortwahl (wird zu Wizard-Schritt 1, verliert Zurück-Button zu Marke)
- REQ-004: Serviceauswahl (Guard-Prüfreihenfolge anpassen)
- REQ-007: WizardStateSync (Reset-Logik umkehren: Location-Wechsel resetet Brand)

---

## 2. User Story

**Als** Kunde
**möchte ich** zuerst meinen Standort (Filiale/Branch) sehen oder auswählen
**damit** ich danach nur die Marken sehe, die an diesem Standort verfügbar sind.

**Acceptance Criteria:**
- [ ] AC-1: Wizard-Einstieg ist `/home/location` (Standortwahl), nicht mehr `/home/brand`
- [ ] AC-2: Standortwahl zeigt ALLE verfügbaren Standorte (nicht mehr nach Marke gefiltert)
- [ ] AC-3: Nach Standortwahl navigiert das System zu `/home/brand`
- [ ] AC-4: Markenauswahl zeigt nur die am gewählten Standort verfügbaren Marken
- [ ] AC-5: Markenauswahl hat einen Zurück-Button der zu `/home/location` navigiert
- [ ] AC-6: Standortwahl hat KEINEN Zurück-Button mehr (ist jetzt Schritt 1)
- [ ] AC-7: Store-State spiegelt die neue Reihenfolge wider: `selectedLocation` wird vor `selectedBrand` gesetzt
- [ ] AC-8: Guard auf `/home/brand` prüft `hasLocationSelected` statt umgekehrt
- [ ] AC-9: Guard auf `/home/services` prüft weiterhin `hasLocationSelected` UND `hasBrandSelected`
- [ ] AC-10: Location-Wechsel (bei Rücknavigation) setzt `selectedBrand` und nachfolgende Felder zurück
- [ ] AC-11: Default-Redirect von `/home` geht zu `/home/location`
- [ ] AC-12: Wizard-Breadcrumb (7 Schritte) wird auf ALLEN Wizard-Seiten angezeigt mit korrektem Status (erledigt/aktiv/zukünftig)
- [ ] AC-13: Marken-SVG-Logos werden durchgängig angezeigt: Standort-Cards, Markenauswahl, Warenkorb, Buchungsübersicht
- [ ] AC-14: Warenkorb-Dropdown zeigt pro Service ALLE gewählten Optionen/Varianten vollständig an (kein Abschneiden)
- [ ] AC-15: Selection-Icon (Checkmark) auf Service-Cards wird nicht am Rand abgeschnitten
- [ ] AC-16: Branch-Info-Banner zeigt aktiven Standort (Name + Adresse aus `branch-config.json`) auf allen Wizard-Seiten
- [ ] AC-17: Warenkorb zeigt Marke als SVG-Logo (nicht nur Text) — `brand-logo--sm` neben dem Markennamen
- [x] AC-18: Standortwahl hat KEINEN "Weiter"-Button — Klick auf Standort-Card navigiert AUTOMATISCH zur Markenauswahl. Kein "Zurück" (Einstieg). **IMPLEMENTIERT:** `location-selection-container.component.ts` — `onBranchSelect()` ruft `selectBranch()` + `router.navigate(['/home/brand'])`, "Weiter"-Button aus Template entfernt.
- [x] AC-19: Markenauswahl hat KEINEN "Weiter"-Button — Klick auf Marken-Card navigiert AUTOMATISCH zur Serviceauswahl. Nur "Zurück"-Button zu Standortwahl. **IMPLEMENTIERT:** `brand-selection-container.component.ts` — `onBrandSelect()` ruft `setBrand()` + `router.navigate(['/home/services'])`, "Weiter"-Button aus Template entfernt.
- [ ] AC-20: Serviceauswahl behält "Weiter"-Button (weil Multi-Select mit Optionen). Nur ab Serviceauswahl gibt es "Weiter".
- [ ] AC-21: Standort-Cards zeigen Marken als echte SVG-Logos (nicht als Text-Abkürzungen/Chips). Die SVGs aus `assets/brands/` müssen als `<img>` eingebunden werden, nicht als Text-Fallback.
- [x] AC-22: VIN/FIN-Feld ist aus dem Fahrzeugformular entfernt — nur Kfz-Kennzeichen + Kilometerstand. **IMPLEMENTIERT:** `VehicleInfo` Interface, `vehicle-form.component`, `carinformation-container.component`.
- [x] AC-23: Preis-Kachel in der Buchungsübersicht ist durch "Hinweise & Optionen" ersetzt — zeigt Mobilität, Terminpräferenz, Rückruf, Nachricht. **IMPLEMENTIERT:** `price-tile.component` umgebaut.
- [ ] AC-24: Wenn der User im Wizard-Breadcrumb auf einen erledigten Schritt zurückspringt, werden alle übersprungenen Schritte im Store gelöscht und in der UI unselectiert. Beispiel: Von Termin (Step 5) zurück zu Marke (Step 2) → Service, Hinweise, Termin werden gelöscht.

---

## 3. Preconditions

### 3.1 System
- Angular App läuft
- Routing konfiguriert
- BookingStore verfügbar
- Header-Component (REQ-001) aktiv

### 3.2 User
- Keine Authentifizierung erforderlich
- Benutzer hat `/home` aufgerufen

### 3.3 Data
- Standorte sind statisch konfiguriert (alle Standorte, nicht mehr pro Marke)
- Marken pro Standort sind statisch konfiguriert als `BRANDS_BY_LOCATION`
- Click-Dummy: Store-Methode liefert console.debug und statische Werte zurück

### 3.4 Übergabe (Input)
| Feld | Quelle | Pflicht |
|------|--------|---------|
| — | — | **Keine Vorbedingung** (Standort ist neuer Einstieg) |

---

## 4. Main Flow

**Step 1:** Wizard-Einstieg — Standortwahl (NEU: Schritt 1)
- **System:** Redirect von `/home` zu `/home/location`
- **System:** Lädt ALLE verfügbaren Standorte via `loadLocations()` (ohne Brand-Parameter)
- **System:** Zeigt Überschrift und Standort-Buttons
- **User:** Wählt einen Standort
- **System:** Speichert `selectedLocation` im BookingStore
- **System:** Navigiert zu `/home/brand`

**Step 2:** Markenauswahl (NEU: Schritt 2)
- **System:** Guard prüft `hasLocationSelected`, Redirect zu `/home/location` falls leer
- **System:** Resolver ruft `loadBrands(locationId)` auf — lädt Marken für den gewählten Standort
- **System:** Zeigt nur die am Standort verfügbaren Marken als Buttons
- **User:** Wählt eine Marke
- **System:** Speichert `selectedBrand` im BookingStore
- **System:** Navigiert zu `/home/services`

**Step 3:** Serviceauswahl (unverändert, Schritt 3)
- **System:** Guard prüft `hasBrandSelected` und `hasLocationSelected`
- **System:** Weiter wie in REQ-004

---

## 5. Alternative Flows

### 5.1 Branch-ID via URL-Parameter

**Trigger:** Benutzer ruft `/home/location?branchId=muc` auf

**Flow:**
1. System liest `branchId` aus Query-Parameter
2. System setzt `selectedLocation` im BookingStore automatisch
3. System überspringt Standortwahl, navigiert direkt zu `/home/brand`
4. Marken werden für den Branch geladen

### 5.2 Zurück von Markenauswahl zu Standortwahl

**Trigger:** Benutzer klickt Zurück-Button auf der Markenauswahl-Seite

**Flow:**
1. System navigiert zu `/home/location`
2. Gewählter Standort bleibt im Store (visuell hervorgehoben)
3. `selectedBrand` bleibt erhalten (für den Fall, dass Nutzer gleichen Standort erneut wählt)

### 5.3 Standort ändern (Rücknavigation)

**Trigger:** Benutzer navigiert von Schritt 3+ zurück zu Standortwahl

**Flow:**
1. System zeigt Standorte, vorherige Auswahl hervorgehoben
2. Benutzer wählt anderen Standort
3. System setzt `selectedBrand` zurück (null) — Marken sind standortabhängig
4. System setzt `selectedServices` zurück (leer)
5. System setzt alle nachfolgenden Store-Felder zurück
6. Navigation zu Markenauswahl

### 5.4 Marke ändern (Rücknavigation)

**Trigger:** Benutzer navigiert von Schritt 3+ zurück zu Markenauswahl

**Flow:**
1. System zeigt Marken für den gewählten Standort
2. Benutzer wählt andere Marke
3. System setzt `selectedServices` zurück (leer)
4. System setzt nachfolgende Store-Felder zurück
5. Navigation zu Serviceauswahl

---

## 6. Exception Flows

### 6.1 Ungültige Branch-ID via URL-Parameter

**Trigger:** Query-Parameter `branchId` enthält eine unbekannte ID

**Flow:**
1. System prüft `branchId` gegen bekannte Standort-IDs
2. Kein Match gefunden
3. System ignoriert den Parameter und zeigt die normale Standortauswahl
4. console.debug Warnung wird ausgegeben

### 6.2 Keine Marken am Standort

**Trigger:** Gewählter Standort hat keine konfigurierten Marken (Dateninkonsistenz)

**Flow:**
1. Resolver lädt Marken für Standort, Ergebnis ist leeres Array
2. System zeigt Hinweistext: "Für diesen Standort sind derzeit keine Marken verfügbar."
3. Benutzer kann über Zurück-Button anderen Standort wählen

### 6.3 Direktaufruf /home/brand ohne Standort

**Trigger:** Benutzer ruft `/home/brand` ohne vorherige Standortwahl auf

**Flow:**
1. Guard `locationSelectedGuard` prüft `hasLocationSelected`
2. Redirect zu `/home/location`

### 6.4 Direktaufruf /home/services ohne Marke

**Trigger:** Benutzer ruft `/home/services` ohne vorherige Markenwahl auf

**Flow:**
1. Guard `brandSelectedGuard` prüft `hasBrandSelected`
2. Redirect zu `/home/brand`

---

## 7. Postconditions

### 7.1 Success — Nach Standort + Markenwahl (Übergabe an REQ-004)
| Feld | Typ | Wert | Beschreibung |
|------|-----|------|--------------|
| `BookingStore.selectedLocation` | `LocationDisplay` | z.B. `{ id: 'muc', name: 'München', city: 'München' }` | **Zuerst gewählt** (Schritt 1) |
| `BookingStore.selectedBrand` | `Brand` | z.B. `'audi'` | **Danach gewählt** (Schritt 2, gefiltert nach Standort) |

### 7.2 Failure
- Keine Änderungen am Store (Benutzer hat nichts gewählt)

---

## 8. Business Rules

- **BR-1:** Standort wird ZUERST gewählt, Marke DANACH (umgekehrte Reihenfolge zu vorher)
- **BR-2:** Verfügbare Marken werden durch den gewählten Standort bestimmt (nicht umgekehrt)
- **BR-3:** Standort-Wechsel setzt Marke und alle nachfolgenden Wizard-Felder zurück
- **BR-4:** Marken-Wechsel setzt Services und nachfolgende Wizard-Felder zurück (wie bisher)
- **BR-5:** Standorte werden vollständig angezeigt (kein Filtern nach Marke mehr)
- **BR-6:** Nur ein Standort und nur eine Marke wählbar (Single-Select, wie bisher)
- **BR-7:** Branch-ID kann optional via URL-Parameter übergeben werden (Click-Dummy: Query-Param `branchId`)

---

## 9. Non-Functional Requirements

### Performance
- Keine Performance-Regression durch die Umstrukturierung
- Seitenaufbau weiterhin < 300ms (statische Daten)
- Brands-Laden nach Standort-Auswahl < 100ms (lokales Filtern)

### Security
- HTTPS only
- Input-Validierung für Branch-ID URL-Parameter (nur bekannte IDs akzeptieren)

### Usability
- Mobile-First: Buttons stacken vertikal
- Touch-friendly: Min 2.75em (44px)
- WCAG 2.1 AA
- Wizard-Stepper zeigt korrekte Reihenfolge: Standort > Marke > Services > ...

---

## 10. Data Model

### Branch-Config-Datei (`assets/branch-config.json`)

Die Werkstatt-Konfiguration wird in einer JSON-Datei gehalten, die OHNE Code-Änderungen erweiterbar ist. Neue Filialen werden einfach als weiterer Eintrag hinzugefügt.

```json
{
  "branches": [
    { "branchId": "vw-essen", "name": "Volkswagen Zentrum Essen", "address": { "street": "ThyssenKrupp Allee 20", "zip": "45143", "city": "Essen" }, "brands": ["VW", "VW Nutzfahrzeuge", "SEAT", "CUPRA"] },
    { "branchId": "skoda-essen", "name": "ŠKODA Zentrum Essen", "address": { "street": "ThyssenKrupp Allee 20", "zip": "45143", "city": "Essen" }, "brands": ["ŠKODA"] },
    { "branchId": "audi-essen", "name": "Audi Zentrum Essen", "address": { "street": "Altendorfer Str. 50", "zip": "45143", "city": "Essen" }, "brands": ["Audi"] },
    { "branchId": "hyundai-essen", "name": "Hyundai Essen", "address": { "street": "ThyssenKrupp Allee 20", "zip": "45143", "city": "Essen" }, "brands": ["Hyundai"] },
    { "branchId": "porsche-essen", "name": "Porsche Zentrum Essen", "address": { "street": "Altendorfer Str. 52", "zip": "45143", "city": "Essen" }, "brands": ["Porsche"] },
    { "branchId": "vw-essen-kray", "name": "Volkswagen Essen-Kray", "address": { "street": "Kleine Schönscheidtstr. 1", "zip": "45307", "city": "Essen" }, "brands": ["VW", "VW Nutzfahrzeuge"] },
    { "branchId": "seat-essen-kray", "name": "SEAT Essen-Kray", "address": { "street": "Kleine Schönscheidtstr. 1", "zip": "45307", "city": "Essen" }, "brands": ["SEAT"] },
    { "branchId": "cupra-essen-kray", "name": "CUPRA Essen-Kray", "address": { "street": "Kleine Schönscheidtstr. 1", "zip": "45307", "city": "Essen" }, "brands": ["CUPRA"] },
    { "branchId": "vw-skoda-wickenburg", "name": "Volkswagen & Skoda Service Wickenburg", "address": { "street": "An der Wickenburg 1", "zip": "45147", "city": "Essen" }, "brands": ["VW", "ŠKODA"] },
    { "branchId": "audi-muelheim", "name": "Audi Zentrum Mülheim", "address": { "street": "Düsseldorfer Straße 261", "zip": "45481", "city": "Mülheim" }, "brands": ["Audi"] },
    { "branchId": "vw-muelheim", "name": "Volkswagen Mülheim", "address": { "street": "Ruhrorter Str. 13", "zip": "45478", "city": "Mülheim" }, "brands": ["VW"] },
    { "branchId": "vw-muelheim-saarn", "name": "Volkswagen Mülheim Saarn", "address": { "street": "Kölner Straße 8", "zip": "45481", "city": "Mülheim" }, "brands": ["VW", "VW Nutzfahrzeuge"] },
    { "branchId": "hyundai-muelheim", "name": "Hyundai Mülheim", "address": { "street": "Ruhrorter Str. 15", "zip": "45478", "city": "Mülheim" }, "brands": ["Hyundai"] },
    { "branchId": "audi-muelheim-2", "name": "Audi Mülheim", "address": { "street": "Ruhrorter Str. 15", "zip": "45478", "city": "Mülheim" }, "brands": ["Audi"] },
    { "branchId": "seat-muelheim", "name": "SEAT Mülheim", "address": { "street": "Ruhrorter Str. 13", "zip": "45478", "city": "Mülheim" }, "brands": ["SEAT"] },
    { "branchId": "cupra-muelheim", "name": "CUPRA Mülheim", "address": { "street": "Ruhrorter Str. 13", "zip": "45478", "city": "Mülheim" }, "brands": ["CUPRA"] },
    { "branchId": "skoda-muelheim", "name": "ŠKODA Mülheim", "address": { "street": "Ruhrorter Str. 13-15", "zip": "45478", "city": "Mülheim" }, "brands": ["ŠKODA"] },
    { "branchId": "audi-duisburg", "name": "Audi Zentrum Duisburg", "address": { "street": "Düsseldorfer Landstraße 37", "zip": "47249", "city": "Duisburg" }, "brands": ["Audi"] },
    { "branchId": "vw-velbert", "name": "Volkswagen Velbert", "address": { "street": "Nevigeser Str. 151, 161, 163", "zip": "42553", "city": "Velbert" }, "brands": ["VW", "VW Nutzfahrzeuge"] },
    { "branchId": "audi-velbert", "name": "Audi Velbert", "address": { "street": "Nevigeser Str. 151, 161, 163", "zip": "42553", "city": "Velbert" }, "brands": ["Audi"] },
    { "branchId": "skoda-velbert", "name": "ŠKODA Velbert", "address": { "street": "Nevigeser Str. 151, 161, 163", "zip": "42553", "city": "Velbert" }, "brands": ["ŠKODA"] },
    { "branchId": "seat-velbert", "name": "SEAT Velbert", "address": { "street": "Nevigeser Str. 151, 161, 163", "zip": "42553", "city": "Velbert" }, "brands": ["SEAT"] },
    { "branchId": "cupra-velbert", "name": "CUPRA Velbert", "address": { "street": "Nevigeser Str. 151, 161, 163", "zip": "42553", "city": "Velbert" }, "brands": ["CUPRA"] },
    { "branchId": "hyundai-velbert", "name": "Hyundai Velbert", "address": { "street": "Nevigeser Str. 151, 161, 163", "zip": "42553", "city": "Velbert" }, "brands": ["Hyundai"] },
    { "branchId": "vw-duesseldorf", "name": "Volkswagen Zentrum Düsseldorf", "address": { "street": "Höherweg 85", "zip": "40233", "city": "Düsseldorf" }, "brands": ["VW", "VW Nutzfahrzeuge"] },
    { "branchId": "audi-duesseldorf", "name": "Audi Zentrum Düsseldorf", "address": { "street": "Höherweg 210", "zip": "40233", "city": "Düsseldorf" }, "brands": ["Audi"] },
    { "branchId": "skoda-duesseldorf", "name": "ŠKODA Centrum Düsseldorf", "address": { "street": "Höherweg 119", "zip": "40233", "city": "Düsseldorf" }, "brands": ["ŠKODA"] },
    { "branchId": "porsche-duesseldorf", "name": "Porsche Zentrum Düsseldorf", "address": { "street": "Klaus-Bungert-Str. 2", "zip": "40468", "city": "Düsseldorf" }, "brands": ["Porsche"] },
    { "branchId": "seat-duesseldorf-benrath", "name": "SEAT Düsseldorf-Benrath", "address": { "street": "Professor-Oehler-Str. 13", "zip": "40589", "city": "Düsseldorf" }, "brands": ["SEAT"] },
    { "branchId": "cupra-duesseldorf-benrath", "name": "CUPRA Düsseldorf-Benrath", "address": { "street": "Professor-Oehler-Str. 13", "zip": "40589", "city": "Düsseldorf" }, "brands": ["CUPRA"] },
    { "branchId": "seat-duesseldorf-automeile", "name": "SEAT Düsseldorf-Automeile", "address": { "street": "Höherweg 85", "zip": "40233", "city": "Düsseldorf" }, "brands": ["SEAT"] },
    { "branchId": "cupra-duesseldorf-automeile", "name": "CUPRA Düsseldorf-Automeile", "address": { "street": "Höherweg 85", "zip": "40233", "city": "Düsseldorf" }, "brands": ["CUPRA"] },
    { "branchId": "bentley-duesseldorf", "name": "Bentley Düsseldorf", "address": { "street": "Höherweg 95", "zip": "40233", "city": "Düsseldorf" }, "brands": ["Bentley"] },
    { "branchId": "bugatti-duesseldorf", "name": "Bugatti Düsseldorf", "address": { "street": "Höherweg 95", "zip": "40233", "city": "Düsseldorf" }, "brands": ["Bugatti"] },
    { "branchId": "rimac-duesseldorf", "name": "Rimac Düsseldorf", "address": { "street": "Höherweg 95", "zip": "40233", "city": "Düsseldorf" }, "brands": ["Rimac"] },
    { "branchId": "vw-mettmann", "name": "Volkswagen Mettmann", "address": { "street": "Johannes-Flintrop-Str. 127", "zip": "40822", "city": "Mettmann" }, "brands": ["VW", "VW Nutzfahrzeuge"] },
    { "branchId": "audi-mettmann", "name": "Audi Mettmann", "address": { "street": "Düsseldorfer Str. 189-191", "zip": "40822", "city": "Mettmann" }, "brands": ["Audi"] },
    { "branchId": "skoda-mettmann", "name": "ŠKODA Mettmann", "address": { "street": "Johannes Flintrop Str. 127", "zip": "40822", "city": "Mettmann" }, "brands": ["ŠKODA"] },
    { "branchId": "seat-erkrath", "name": "SEAT Erkrath", "address": { "street": "Schimmelbuschstr. 1", "zip": "40699", "city": "Erkrath" }, "brands": ["SEAT"] },
    { "branchId": "cupra-erkrath", "name": "CUPRA Erkrath", "address": { "street": "Schimmelbuschstr. 1", "zip": "40699", "city": "Erkrath" }, "brands": ["CUPRA"] },
    { "branchId": "vw-neuss", "name": "Volkswagen Neuss", "address": { "street": "Hammer Landstr. 99", "zip": "41460", "city": "Neuss" }, "brands": ["VW", "VW Nutzfahrzeuge"] },
    { "branchId": "audi-neuss", "name": "Audi Zentrum Neuss", "address": { "street": "Jülicher Landstr. 41-43", "zip": "41464", "city": "Neuss" }, "brands": ["Audi"] },
    { "branchId": "skoda-neuss", "name": "ŠKODA Neuss", "address": { "street": "Hammer Landstr. 99", "zip": "41460", "city": "Neuss" }, "brands": ["ŠKODA"] },
    { "branchId": "seat-neuss", "name": "SEAT Neuss", "address": { "street": "Hammer Landstr. 99", "zip": "41460", "city": "Neuss" }, "brands": ["SEAT"] },
    { "branchId": "cupra-neuss", "name": "CUPRA Neuss", "address": { "street": "Hammer Landstr. 99", "zip": "41460", "city": "Neuss" }, "brands": ["CUPRA"] },
    { "branchId": "seat-dormagen", "name": "SEAT Dormagen", "address": { "street": "Lübecker Str. 17", "zip": "41540", "city": "Dormagen" }, "brands": ["SEAT"] },
    { "branchId": "cupra-dormagen", "name": "CUPRA Dormagen", "address": { "street": "Lübecker Str. 17", "zip": "41540", "city": "Dormagen" }, "brands": ["CUPRA"] },
    { "branchId": "skoda-dormagen", "name": "ŠKODA Dormagen", "address": { "street": "Lübecker Str. 17", "zip": "41540", "city": "Dormagen" }, "brands": ["ŠKODA"] },
    { "branchId": "vw-grevenbroich", "name": "Volkswagen Grevenbroich", "address": { "street": "Lilienthalstr. 6", "zip": "41515", "city": "Grevenbroich" }, "brands": ["VW"] },
    { "branchId": "vw-wuppertal", "name": "Volkswagen Zentrum Wuppertal", "address": { "street": "Uellendahler Str. 245-251", "zip": "42109", "city": "Wuppertal" }, "brands": ["VW"] },
    { "branchId": "gw-wuppertal", "name": "Gebrauchtwagen Zentrum Wuppertal", "address": { "street": "Uellendahler Str. 540-560", "zip": "42109", "city": "Wuppertal" }, "brands": ["VW"] },
    { "branchId": "audi-wuppertal", "name": "Audi Zentrum Wuppertal", "address": { "street": "Uellendahler Str. 306", "zip": "42109", "city": "Wuppertal" }, "brands": ["Audi"] },
    { "branchId": "skoda-wuppertal", "name": "ŠKODA Wuppertal", "address": { "street": "Uellendahler Str. 245-251", "zip": "42109", "city": "Wuppertal" }, "brands": ["ŠKODA"] },
    { "branchId": "hyundai-wuppertal", "name": "Hyundai Wuppertal", "address": { "street": "Uellendahler Str. 245-251", "zip": "42109", "city": "Wuppertal" }, "brands": ["Hyundai"] },
    { "branchId": "porsche-wuppertal", "name": "Porsche Zentrum Wuppertal", "address": { "street": "Porschestraße 1", "zip": "42279", "city": "Wuppertal" }, "brands": ["Porsche"] },
    { "branchId": "audi-solingen", "name": "Audi Solingen", "address": { "street": "Schlagbaumer Str. 118", "zip": "42653", "city": "Solingen" }, "brands": ["Audi"] },
    { "branchId": "vw-solingen", "name": "Volkswagen Solingen", "address": { "street": "Kuller Str. 16", "zip": "42651", "city": "Solingen" }, "brands": ["VW", "VW Nutzfahrzeuge"] },
    { "branchId": "skoda-solingen", "name": "ŠKODA Solingen", "address": { "street": "Kuller Str. 16", "zip": "42651", "city": "Solingen" }, "brands": ["ŠKODA"] },
    { "branchId": "porsche-solingen", "name": "Porsche Zentrum Solingen", "address": { "street": "Schlagbaumer Str. 10", "zip": "42653", "city": "Solingen" }, "brands": ["Porsche"] },
    { "branchId": "vw-hagen", "name": "Volkswagen Hagen", "address": { "street": "Weststraße 1", "zip": "58089", "city": "Hagen" }, "brands": ["VW", "VW Nutzfahrzeuge"] },
    { "branchId": "audi-hagen", "name": "Audi Hagen", "address": { "street": "Weststraße 1", "zip": "58089", "city": "Hagen" }, "brands": ["Audi"] },
    { "branchId": "skoda-hagen", "name": "ŠKODA Hagen", "address": { "street": "Weststraße 1", "zip": "58089", "city": "Hagen" }, "brands": ["ŠKODA"] },
    { "branchId": "hyundai-hagen", "name": "Hyundai Hagen", "address": { "street": "Weststraße 1", "zip": "58089", "city": "Hagen" }, "brands": ["Hyundai"] },
    { "branchId": "vw-leverkusen", "name": "Volkswagen Zentrum Leverkusen", "address": { "street": "Robert-Blum-Str. 71", "zip": "51379", "city": "Leverkusen" }, "brands": ["VW", "VW Nutzfahrzeuge"] },
    { "branchId": "audi-leverkusen", "name": "Audi Zentrum Leverkusen", "address": { "street": "Willy-Brandt-Ring 10", "zip": "51373", "city": "Leverkusen" }, "brands": ["Audi"] },
    { "branchId": "skoda-leverkusen", "name": "ŠKODA Leverkusen", "address": { "street": "Robert-Blum-Str. 71", "zip": "51379", "city": "Leverkusen" }, "brands": ["ŠKODA"] },
    { "branchId": "seat-leverkusen", "name": "SEAT Leverkusen", "address": { "street": "Willy-Brandt-Ring 10", "zip": "51373", "city": "Leverkusen" }, "brands": ["SEAT"] },
    { "branchId": "cupra-leverkusen", "name": "CUPRA Leverkusen", "address": { "street": "Willy-Brandt-Ring 10", "zip": "51373", "city": "Leverkusen" }, "brands": ["CUPRA"] }
  ],
  "defaultBranchId": "vw-essen"
}
```

> **Erweiterung:** Neue Filiale hinzufügen = neuen JSON-Eintrag ergänzen. Kein Code, kein Rebuild nötig.

```typescript
// branch-config.model.ts — NEU
export interface BranchAddress {
  street: string;
  zip: string;
  city: string;
}

export interface BranchConfig {
  branchId: string;
  name: string;
  address: BranchAddress;
  brands: string[];
}

export interface BranchConfigFile {
  branches: BranchConfig[];
  defaultBranchId: string;
}
```

Die Config wird beim App-Start via `APP_INITIALIZER` geladen und im Store bereitgestellt. Keine Neukompilierung nötig — nur JSON-Datei anpassen und deployen.

### Bestehende Interfaces (unverändert)
```typescript
// brand.model.ts — bleibt gleich
type Brand = 'audi' | 'bmw' | 'mercedes' | 'mini' | 'volkswagen';

interface BrandDisplay {
  id: Brand;
  name: string;
}

// location.model.ts — bleibt gleich
interface LocationDisplay {
  id: string;
  name: string;
  city: string;
}
```

### Neue statische Datenstruktur (location.model.ts)
```typescript
/**
 * All available locations (no brand filter)
 * DE: Alle verfügbaren Standorte / EN: All available locations
 */
export const ALL_LOCATIONS: LocationDisplay[] = [
  { id: 'muc', name: 'München', city: 'München' },
  { id: 'ham', name: 'Hamburg', city: 'Hamburg' },
  { id: 'ber', name: 'Berlin', city: 'Berlin' },
  { id: 'fra', name: 'Frankfurt', city: 'Frankfurt' },
  { id: 'dus', name: 'Düsseldorf', city: 'Düsseldorf' },
  { id: 'stu', name: 'Stuttgart', city: 'Stuttgart' },
  { id: 'kol', name: 'Köln', city: 'Köln' },
  { id: 'gar', name: 'Garbsen', city: 'Garbsen' },
  { id: 'han-sued', name: 'Hannover Südstadt', city: 'Hannover' },
  { id: 'ste', name: 'Steinhude', city: 'Steinhude' },
  { id: 'wob', name: 'Wolfsburg', city: 'Wolfsburg' },
  { id: 'han', name: 'Hannover', city: 'Hannover' }
];
```

### Neue statische Datenstruktur (brand.model.ts)
```typescript
/**
 * Brands available per location (reverse mapping)
 * DE: Marken pro Standort / EN: Brands per location
 */
export const BRANDS_BY_LOCATION: Record<string, BrandDisplay[]> = {
  muc: [
    { id: 'audi', name: 'Audi' },
    { id: 'bmw', name: 'BMW' },
    { id: 'mercedes', name: 'Mercedes-Benz' },
    { id: 'volkswagen', name: 'Volkswagen' }
  ],
  ham: [
    { id: 'audi', name: 'Audi' },
    { id: 'bmw', name: 'BMW' },
    { id: 'volkswagen', name: 'Volkswagen' }
  ],
  ber: [
    { id: 'audi', name: 'Audi' },
    { id: 'bmw', name: 'BMW' },
    { id: 'mercedes', name: 'Mercedes-Benz' },
    { id: 'volkswagen', name: 'Volkswagen' }
  ],
  fra: [
    { id: 'audi', name: 'Audi' },
    { id: 'mercedes', name: 'Mercedes-Benz' }
  ],
  dus: [
    { id: 'audi', name: 'Audi' },
    { id: 'mercedes', name: 'Mercedes-Benz' }
  ],
  stu: [
    { id: 'bmw', name: 'BMW' },
    { id: 'mercedes', name: 'Mercedes-Benz' }
  ],
  kol: [
    { id: 'bmw', name: 'BMW' }
  ],
  gar: [
    { id: 'mini', name: 'MINI' }
  ],
  'han-sued': [
    { id: 'mini', name: 'MINI' }
  ],
  ste: [
    { id: 'mini', name: 'MINI' }
  ],
  wob: [
    { id: 'volkswagen', name: 'Volkswagen' }
  ],
  han: [
    { id: 'volkswagen', name: 'Volkswagen' }
  ]
};
```

### BookingStore State-Änderungen
```typescript
// BookingState Interface — Felder bleiben gleich, aber semantische Reihenfolge ändert sich:
interface BookingState {
  // Schritt 1: Standort (NEU: zuerst)
  locations: LocationDisplay[];          // VORHER: gefiltert nach Brand → NEU: ALLE Standorte
  selectedLocation: LocationDisplay | null;

  // Schritt 2: Marke (NEU: danach, gefiltert nach Location)
  brands: BrandDisplay[];               // VORHER: alle Brands → NEU: gefiltert nach Location
  selectedBrand: Brand | null;

  // Rest bleibt gleich
  services: ServiceDisplay[];
  selectedServices: SelectedService[];
  // ...
}
```

---

## 11. UI/UX

### Wizard-Breadcrumb (NEU — auf ALLEN Wizard-Seiten)

Ein horizontaler Stepper/Breadcrumb wird als **Shared Component** (`wizard-breadcrumb.component`) auf ALLEN Wizard-Seiten eingebunden:

| Schritt | Label | Route | Icon |
|---------|-------|-------|------|
| 1 | Standort | `/home/location` | `location_on` |
| 2 | Marke | `/home/brand` | `directions_car` |
| 3 | Service | `/home/services` | `build` |
| 4 | Hinweise | `/home/notes` | `info` |
| 5 | Termin | `/home/appointment` | `calendar_today` |
| 6 | Fahrzeug | `/home/carinformation` | `person` |
| 7 | Übersicht | `/home/summary` | `check_circle` |

**Darstellung:**
- **Erledigt:** Grüner Haken + Label klickbar (navigiert zurück)
- **Aktuell:** Primärfarbe hervorgehoben, fetter Text
- **Zukünftig:** Ausgegraut, nicht klickbar
- **Responsive:** Ab Mobile nur Icons, ab Tablet Icons + Labels
- **Accessibility:** `aria-current="step"` auf aktivem Schritt, `role="navigation"` + `aria-label="Buchungsfortschritt"`

**Branch-Info-Banner** (auf ALLEN Wizard-Seiten oberhalb des Breadcrumbs):
- Zeigt den aktiven Standort: Name + Adresse aus `branch-config.json`
- Icon: `location_on`, Info-Hintergrund (`var(--color-background-info)`)
- Kompakt: eine Zeile auf Desktop, zwei Zeilen auf Mobile

### Wizard-Stepper (neue Reihenfolge)
| Schritt | Seite | Route | Beschreibung |
|---------|-------|-------|--------------|
| 1 | Standortwahl | `/home/location` | Standort aus Config oder ALLE Standorte anzeigen |
| 2 | Markenauswahl | `/home/brand` | Marken gefiltert nach gewähltem Standort |
| 3 | Serviceauswahl | `/home/services` | Wie bisher |
| 4 | Hinweise | `/home/notes` | Wie bisher |
| 5 | Terminauswahl | `/home/appointment` | Wie bisher |
| 6 | Fahrzeugdaten | `/home/carinformation` | Wie bisher |
| 7 | Übersicht | `/home/summary` | Wie bisher |

### Standortwahl (Schritt 1 — angepasst)

**UX-Rationale:** Bei 68+ Werkstätten an vielen Standorten braucht der Kunde eine schnelle Orientierung. Die Marken-Logos auf den Standort-Cards helfen ihm, "seinen" Standort sofort zu erkennen (z.B. "Ich fahre Audi → ah, Audi Zentrum Essen"). Nach Standortwahl kann er in Schritt 2 gezielt die Marke aus den am Standort verfügbaren auswählen.

- Überschrift: "An welchem Standort dürfen wir Sie begrüßen?"
- ALLE Standorte aus `branch-config.json` als Cards
- **Jede Card zeigt:**
  - Werkstatt-Name (z.B. "Volkswagen Zentrum Essen")
  - Adresse (Straße, PLZ, Stadt) — klein unter dem Namen
  - Marken-Logos als SVG-Icons nebeneinander (aus `brands`-Array der Config) — dienen als **visuelle Orientierungshilfe**, nicht als Filter
  - Mehrere Marken an derselben Adresse werden alle angezeigt (z.B. VW + SEAT + CUPRA)
- Optional: Suchfeld/Filter oben zum schnellen Finden (Stadt, Marke, Name)
- KEIN Zurück-Button (ist jetzt Wizard-Einstieg)
- Desktop: 3-Spalten Grid, Tablet: 2 Spalten, Mobile: 1 Spalte full-width
- Marken-SVGs liegen in `assets/brands/` (audi.svg, volkswagen.svg, etc.)

### Markenauswahl (Schritt 2 — angepasst)
- Überschrift: "Welche Fahrzeugmarke fahren Sie?" (unverändert)
- Nur Marken des gewählten Standorts als große SVG-Logo-Cards (statt immer alle 5)
- **KEIN "Weiter"-Button** — Klick auf Marken-Card navigiert AUTOMATISCH zur Serviceauswahl
- Nur Zurück-Button: navigiert zu `/home/location`
- Hinweistext bei 0 Marken: "Für diesen Standort sind derzeit keine Marken verfügbar."

### Auto-Navigation (NEU — Standort + Marke)

Standort- und Markenauswahl haben **KEINEN "Weiter"-Button**. Die Auswahl eines Elements löst sofort die Navigation zur nächsten Seite aus:

| Seite | Bei Klick auf... | Navigation zu | "Weiter"-Button | "Zurück"-Button |
|-------|-----------------|---------------|-----------------|-----------------|
| Standortwahl | Standort-Card | `/home/brand` | NEIN | NEIN (Einstieg) |
| Markenauswahl | Marken-Card | `/home/services` | NEIN | JA → `/home/location` |
| Serviceauswahl | — | — | JA (wie bisher) | JA → `/home/brand` |

**Implementierung:** `selectLocation()`/`selectBrand()` im Store setzt den Wert UND ruft `router.navigate()` auf. Analog zum bestehenden Verhalten auf der Original-Website (gottfried-schultz.de).

### Wizard-Breadcrumb Reset (NEU — Cascading Store Reset)

Wenn der User über den Breadcrumb zu einem früheren Schritt zurückspringt, werden alle Daten der übersprungenen Schritte aus dem Store gelöscht:

| Von → Nach | Was wird gelöscht |
|-----------|-------------------|
| Beliebig → Standort (0) | Marke, Services, Hinweise, Termin, Fahrzeugdaten |
| Beliebig → Marke (1) | Services, Hinweise, Termin, Fahrzeugdaten |
| Beliebig → Service (2) | Hinweise, Termin, Fahrzeugdaten |
| Beliebig → Hinweise (3) | Termin, Fahrzeugdaten |
| Beliebig → Termin (4) | Fahrzeugdaten |

**Implementierung:** `BookingStore.resetFromStep(targetIndex)` ruft pro übersprungenen Schritt die passende clear-Methode auf. Der `WizardBreadcrumbComponent` injectet den Store und Router — bei Klick auf Done-Step: `store.resetFromStep(targetIndex)` + `router.navigate([step.route])`.

### Zurück-Button-Logik (NEU)
| Seite | Zurück-Ziel | Was wird zurückgesetzt |
|-------|-------------|----------------------|
| Standortwahl | — (kein Zurück, Einstieg) | — |
| Markenauswahl | `/home/location` | `selectedBrand` wird genullt |
| Serviceauswahl | `/home/brand` | `selectedServices` wird geleert (wie bisher) |

### Marken-SVG-Logos — Durchgängiger Einsatz

Die echten Marken-SVGs (`assets/brands/*.svg`) werden **überall** im UI eingesetzt wo eine Marke angezeigt wird:

| Stelle | Logo-Größe | Beschreibung |
|--------|-----------|--------------|
| Standortwahl-Cards | `height: 1.5em` | Kleine Logos als Orientierungshilfe neben Adresse |
| Markenauswahl (Schritt 2) | `height: 4–5em` | Große Logos als Hauptauswahl-Element |
| Warenkorb/Header | `height: 1.25em` | SVG-Logo ERSETZT den Text-Chip — `<img>` statt `<mat-icon>directions_car` + Textname |
| Buchungsübersicht | `height: 2em` | Medium-Logo in der Zusammenfassung |
| Service-Auswahl-Header | `height: 1.5em` | Logo neben "Services für [Marke]" |
| Wizard-Breadcrumb (optional) | `height: 1em` | Marken-Icon im erledigten Schritt "Marke" |

**Verfügbare Logos** (in `assets/brands/`):
`audi.svg`, `volkswagen.svg`, `vw_nutzfahrzeuge.svg`, `seat.svg`, `cupra.svg`, `skoda.svg`, `hyundai.svg`, `porsche.svg`, `bentley.svg`, `bugatti.svg`, `rimac.svg`

**CSS-Klassen:**
- `.brand-logo` — Basis (object-fit: contain)
- `.brand-logo--sm` — 1.25em (Header/Warenkorb)
- `.brand-logo--md` — 2em (Übersicht)
- `.brand-logo--lg` — 4–5em (Markenauswahl)

### Material Components
- Bestehende Components werden wiederverwendet
- Keine neuen Material Components nötig

### Design-Hinweis
Implementierung mit **hellem Theme** aus `_variables.scss` (wie bisher).

---

## 12. API Specification

### VORHER: Brands laden (ohne Parameter)
```http
GET /api/brands
→ Response: BrandDisplay[] (alle 5 Marken)
```

### NEU: Brands laden (mit Location-ID)
```http
GET /api/brands?locationId=muc
→ Response: BrandDisplay[] (nur Marken am Standort "München")
```

### VORHER: Locations laden (mit Brand-Parameter)
```http
GET /api/locations/:brandId
→ Response: LocationDisplay[] (Standorte für Marke)
```

### NEU: Locations laden (ohne Parameter — alle Standorte)
```http
GET /api/locations
→ Response: LocationDisplay[] (ALLE Standorte)
```

> Click-Dummy: Statische Daten, kein echtes Backend. `BookingApiService` wird angepasst.

---

## 13. Test Cases

### TC-1: Wizard-Einstieg ist Standortwahl (AC-1, AC-11)
- **Given:** Benutzer öffnet `/home`
- **When:** Seite wird geladen
- **Then:** Redirect zu `/home/location`, ALLE Standorte werden angezeigt

### TC-2: Standort auswählen und zu Marken navigieren (AC-2, AC-3)
- **Given:** Benutzer ist auf `/home/location`, alle Standorte sichtbar
- **When:** Klickt auf "München"
- **Then:** `BookingStore.selectedLocation` === `{ id: 'muc', ... }`, Navigation zu `/home/brand`

### TC-3: Marken nach Standort gefiltert (AC-4)
- **Given:** Standort "München" gewählt
- **When:** Seite `/home/brand` wird geladen
- **Then:** 4 Marken sichtbar (Audi, BMW, Mercedes-Benz, Volkswagen), MINI nicht sichtbar

### TC-4: Marken nach Standort gefiltert — wenige Marken (AC-4)
- **Given:** Standort "Garbsen" gewählt
- **When:** Seite `/home/brand` wird geladen
- **Then:** Nur 1 Marke sichtbar (MINI)

### TC-5: Zurück-Button auf Markenauswahl (AC-5)
- **Given:** Benutzer ist auf `/home/brand`
- **When:** Klickt Zurück-Button
- **Then:** Navigation zu `/home/location`, `selectedBrand` wird null gesetzt

### TC-6: Kein Zurück-Button auf Standortwahl (AC-6)
- **Given:** Benutzer ist auf `/home/location`
- **When:** Seite wird angezeigt
- **Then:** Kein Zurück-Button sichtbar

### TC-7: Guard — /home/brand ohne Standort (AC-8, 6.3)
- **Given:** Kein Standort im Store
- **When:** Direktaufruf `/home/brand`
- **Then:** Redirect zu `/home/location`

### TC-8: Guard — /home/services prüft beides (AC-9, 6.4)
- **Given:** Standort gewählt, KEINE Marke
- **When:** Direktaufruf `/home/services`
- **Then:** Redirect zu `/home/brand`

### TC-9: Store-Reihenfolge (AC-7)
- **Given:** Frischer Store
- **When:** Standort "Hamburg" wählen, dann Marke "Audi" wählen
- **Then:** `selectedLocation` ist `{ id: 'ham', ... }`, `selectedBrand` ist `'audi'`

### TC-10: Standort-Wechsel resetet Marke (AC-10)
- **Given:** Standort "München" + Marke "Audi" + Services gewählt
- **When:** Benutzer navigiert zurück zu Standortwahl und wählt "Hamburg"
- **Then:** `selectedBrand` === null, `selectedServices` === [], nachfolgende Felder zurückgesetzt

### TC-11: Branch-ID via URL-Parameter (5.1)
- **Given:** Kein State im Store
- **When:** Aufruf von `/home/location?branchId=muc`
- **Then:** `selectedLocation` wird auf München gesetzt, Navigation direkt zu `/home/brand`

### TC-12: Ungültige Branch-ID (6.1)
- **Given:** Kein State im Store
- **When:** Aufruf von `/home/location?branchId=xyz`
- **Then:** Parameter ignoriert, normale Standortauswahl wird angezeigt

### TC-13: Keine Marken am Standort (6.2)
- **Given:** Standort ohne konfigurierte Marken (theoretischer Dateninkonsistenz-Fall)
- **When:** Seite `/home/brand` wird geladen
- **Then:** Hinweistext wird angezeigt, Zurück-Button funktioniert

---

## 14. Implementation

### Store-Änderungen (BookingStore)

**1. `loadLocations` — Signatur ändern:**
```typescript
// VORHER: Liest selectedBrand() und filtert Standorte danach
loadLocations: rxMethod<void>(pipe(
  switchMap(() => {
    const brand = store.selectedBrand();  // ← Abhängigkeit von Brand
    return from(api.getLocations(brand));
  })
))

// NEU: Lädt ALLE Standorte, kein Brand-Parameter nötig
loadLocations: rxMethod<void>(pipe(
  switchMap(() => from(api.getAllLocations()))  // ← Kein Filter
))
```

**2. `loadBrands` — Parameter hinzufügen:**
```typescript
// VORHER: Lädt alle 5 Marken
loadBrands: rxMethod<void>(pipe(
  switchMap(() => from(api.getBrands()))
))

// NEU: Lädt Marken gefiltert nach Location
loadBrands: rxMethod<string>(pipe(  // ← string = locationId
  switchMap((locationId) => from(api.getBrandsByLocation(locationId)))
))
```

**3. `setBrand` — Reset-Logik anpassen:**
```typescript
// Unverändert — setzt nur selectedBrand
setBrand(brand: Brand): void {
  patchState(store, { selectedBrand: brand });
}
```

**4. `setLocation` — Reset nachfolgender Felder:**
```typescript
// NEU: Location-Wechsel setzt Brand und alles danach zurück
setLocation(location: LocationDisplay): void {
  const currentLocation = store.selectedLocation();
  const locationChanged = currentLocation?.id !== location.id;
  patchState(store, { selectedLocation: location });
  if (locationChanged) {
    patchState(store, {
      selectedBrand: null,
      selectedServices: [],
      bookingNote: null,
      selectedAppointment: null,
      notesExtras: null,
      customerInfo: null,
      vehicleInfo: null,
      privacyConsent: false,
      bookingSubmitted: false
    });
  }
}
```

**5. Neue Methode `clearSelectedBrand`:**
```typescript
clearSelectedBrand(): void {
  patchState(store, { selectedBrand: null });
}
```

### API-Service-Änderungen (BookingApiService)

```typescript
// VORHER
public getBrands(): Promise<BrandDisplay[]> { ... }
public getLocations(brand: Brand): Promise<LocationDisplay[]> { ... }

// NEU
public getBrandsByLocation(locationId: string): Promise<BrandDisplay[]> {
  console.debug('[BookingApiService] getBrandsByLocation() called for location:', locationId);
  return Promise.resolve(BRANDS_BY_LOCATION[locationId] ?? []);
}

public getAllLocations(): Promise<LocationDisplay[]> {
  console.debug('[BookingApiService] getAllLocations() called');
  return Promise.resolve(ALL_LOCATIONS);
}
```

### Route-Änderungen (booking.routes.ts)

```typescript
// VORHER
{ path: '', redirectTo: 'brand', pathMatch: 'full' },
{ path: 'brand', ..., resolve: { _: brandsResolver } },
{ path: 'location', ..., canActivate: [brandSelectedGuard], resolve: { _: locationsResolver } },

// NEU
{ path: '', redirectTo: 'location', pathMatch: 'full' },
{ path: 'location', ..., resolve: { _: locationsResolver } },  // KEIN Guard — ist Einstieg
{ path: 'brand', ..., canActivate: [locationSelectedGuard], resolve: { _: brandsResolver } },
```

### Guard-Änderungen

**`brandSelectedGuard` (vorher Schritt 2 Guard, jetzt für `/home/services`):**
```typescript
// ANPASSUNG: Prüft jetzt BEIDE Vorbedingungen (Location + Brand)
export const brandSelectedGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);

  if (!store.hasLocationSelected()) {
    return router.createUrlTree(['/home/location']);
  }
  if (!store.hasBrandSelected()) {
    return router.createUrlTree(['/home/brand']);
  }
  return true;
};
```

**`locationSelectedGuard` (NEU: für `/home/brand` Route):**
```typescript
// ANPASSUNG: Nur Location-Check, kein Brand-Check
export const locationSelectedGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);

  if (store.hasLocationSelected()) {
    return true;
  }
  return router.createUrlTree(['/home/location']);
};
```

### Resolver-Änderungen

**`locationsResolver` — lädt ALLE Standorte:**
```typescript
// VORHER: store.loadLocations() nutzt intern selectedBrand
// NEU: store.loadLocations() lädt alle Standorte
export const locationsResolver: ResolveFn<void> = () => {
  inject(BookingStore).loadLocations();
  return;
};
```

**`brandsResolver` — braucht Location-ID:**
```typescript
// VORHER: store.loadBrands() ohne Parameter
// NEU: store.loadBrands(locationId) mit Location-ID
export const brandsResolver: ResolveFn<void> = () => {
  const store = inject(BookingStore);
  const locationId = store.selectedLocation()?.id;
  if (locationId) {
    store.loadBrands(locationId);
  }
  return;
};
```

### Component-Änderungen

**1. `LocationSelectionContainerComponent`:**
- Entfernt Zurück-Button (ist jetzt Schritt 1)
- Optional: Liest `branchId` aus Query-Params und setzt automatisch Location
- `onLocationSelect()` navigiert zu `/home/brand` statt `/home/services`

**2. `BrandSelectionContainerComponent`:**
- Bekommt Zurück-Button (navigiert zu `/home/location`)
- Zeigt nur standortspezifische Marken (aus `store.brands()`, gefiltert durch Resolver)
- `onBack()` setzt `selectedBrand` auf null und navigiert zu `/home/location`
- Zeigt Hinweistext wenn `store.brands()` leer ist

**3. `ServiceSelectionContainerComponent`:**
- Zurück-Button navigiert weiterhin zu `/home/brand` (unverändert)

### Folder-Struktur
```
src/app/features/booking/
├── stores/booking.store.ts              ← State-Reihenfolge + Methoden anpassen
├── services/booking-api.service.ts      ← getBrandsByLocation() + getAllLocations()
├── models/brand.model.ts               ← BRANDS_BY_LOCATION hinzufügen
├── models/location.model.ts            ← ALL_LOCATIONS hinzufügen
├── guards/brand-selected.guard.ts      ← Prüft Location + Brand
├── guards/location-selected.guard.ts   ← Nur Location-Check
├── resolvers/brands.resolver.ts        ← Braucht locationId
├── resolvers/locations.resolver.ts     ← Ohne Brand-Filter
├── booking.routes.ts                   ← Reihenfolge tauschen
├── components/brand-selection/         ← Zurück-Button + gefilterte Marken
└── components/location-selection/      ← Ohne Zurück-Button, alle Standorte
```

### Effort
- Development: 4-6 Stunden
- Testing: 2-3 Stunden

---

## 15. Dependencies

**Requires:**
- REQ-001: Header (Warenkorb-Icon)
- REQ-002: Markenauswahl (wird angepasst: Schritt 2, Zurück-Button, gefilterte Marken)
- REQ-003: Standortwahl (wird angepasst: Schritt 1, alle Standorte, kein Zurück-Button)

**Beeinflusst (muss konsistent sein):**
- REQ-002: Markenauswahl — neue Reihenfolge, Zurück-Button, gefilterte Marken
- REQ-003: Standortwahl — neue Reihenfolge, kein Brand-Filter, kein Zurück
- REQ-004: Serviceauswahl — Guard-Prüfreihenfolge (Location vor Brand)
- REQ-007: WizardStateSync — Reset-Logik: Location-Wechsel resetet Brand+Services

**Blocks:**
- Keine neuen Blockierungen

---

## 16. Naming Glossary

### Container Methods (Englisch)
| Methode | Component | Beschreibung |
|---------|-----------|--------------|
| `onLocationSelect(location)` | LocationSelectionContainer | Standort gewählt, Navigation zu `/home/brand` |
| `onBrandSelect(brand)` | BrandSelectionContainer | Marke gewählt, Navigation zu `/home/services` |
| `onBack()` | BrandSelectionContainer | Zurück zu `/home/location`, `selectedBrand` nullen |

### API Service Methods (Englisch)
| Methode | Beschreibung |
|---------|--------------|
| `getAllLocations()` | GET alle Standorte (kein Filter) |
| `getBrandsByLocation(locationId: string)` | GET Marken am Standort |

### Signal Store Methods (Englisch)
| Methode | Beschreibung |
|---------|--------------|
| `loadLocations()` | Alle Standorte laden (rxMethod, kein Parameter) |
| `loadBrands(locationId: string)` | Marken nach Standort laden (rxMethod, mit locationId) |
| `setLocation(location)` | Standort setzen, bei Wechsel Brand+Services resetten |
| `setBrand(brand)` | Marke setzen (wie bisher) |
| `clearSelectedBrand()` | `selectedBrand` auf null setzen |

### Computed Signals (Englisch)
| Signal | Beschreibung |
|--------|--------------|
| `hasBrandSelected` | Boolean — Marke gewählt (wie bisher) |
| `hasLocationSelected` | Boolean — Standort gewählt (wie bisher) |
| `filteredLocations` | Alle Standorte (kein Filter mehr nötig, Renamed von computed) |

### Guards (Englisch)
| Guard | Route | Prüft |
|-------|-------|-------|
| `locationSelectedGuard` | `/home/brand` | `hasLocationSelected` |
| `brandSelectedGuard` | `/home/services` | `hasLocationSelected` + `hasBrandSelected` |

### Resolver (Englisch)
| Resolver | Route | Lädt |
|----------|-------|------|
| `locationsResolver` | `/home/location` | `store.loadLocations()` (alle Standorte) |
| `brandsResolver` | `/home/brand` | `store.loadBrands(locationId)` (Marken am Standort) |

---

## 17. i18n Keys

```typescript
// DE — Bestehende Keys bleiben, neue Keys hinzugefügt
booking: {
  location: {
    title: 'An welchem Standort dürfen wir Sie begrüßen?',          // unverändert
    subtitle: 'Bitte wählen Sie den gewünschten Standort aus.',      // unverändert
    ariaGroupLabel: 'Standorte',                                     // unverändert
    // ENTFERNT: backButton — Standortwahl hat keinen Zurück-Button mehr
  },
  brand: {
    title: 'Welche Fahrzeugmarke fahren Sie?',                       // unverändert
    subtitle: 'Bitte wählen Sie die gewünschte Marke aus.',          // unverändert
    backButton: 'Zurück',                                            // NEU: Zurück-Button auf Markenauswahl
    noBrandsAvailable: 'Für diesen Standort sind derzeit keine Marken verfügbar.'  // NEU: Fehlerfall
  }
}

// EN — Bestehende Keys bleiben, neue Keys hinzugefügt
booking: {
  location: {
    title: 'At which location may we welcome you?',                  // unverändert
    subtitle: 'Please select your desired location.',                // unverändert
    ariaGroupLabel: 'Locations',                                     // unverändert
    // ENTFERNT: backButton — Location selection has no back button anymore
  },
  brand: {
    title: 'What vehicle brand do you drive?',                       // unverändert
    subtitle: 'Please select your desired brand.',                   // unverändert
    backButton: 'Back',                                              // NEU: Back button on brand selection
    noBrandsAvailable: 'No brands are currently available for this location.'  // NEU: Error case
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

**WICHTIG: Dies ist ein Refactoring-REQ!**

Bestehender Code wird angepasst, keine vollständig neuen Seiten. Die Hauptänderungen konzentrieren sich auf:

1. **Daten-Mapping umkehren:** `LOCATIONS_BY_BRAND` bleibt bestehen (Rückwärtskompatibilität), neues `BRANDS_BY_LOCATION` und `ALL_LOCATIONS` werden ergänzt
2. **Store-Methoden:** `loadLocations()` und `loadBrands()` bekommen geänderte Signaturen
3. **Routing-Reihenfolge:** Default-Redirect und Guard-Zuordnung tauschen
4. **UI-Minimal-Änderungen:** Nur Zurück-Button verschieben (von Location zu Brand)

**Code muss BILINGUAL sein!**
Siehe `.claude/skills/bilingual-code.md` für Details:
- Kommentare DE + EN
- Error Messages Englisch
- i18n Keys für beide Sprachen
- JSDoc bilingual

**Design-System:**
- KEINE Farben aus Screenshots
- IMMER `_variables.scss` verwenden
- Helles Theme (nicht dunkel)
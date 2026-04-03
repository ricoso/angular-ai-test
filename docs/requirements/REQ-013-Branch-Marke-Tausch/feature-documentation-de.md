# Feature-Dokumentation: Branch-Marke-Tausch

**Erstellt:** 2026-04-02
**Requirement:** REQ-013-Branch-Marke-Tausch
**Sprache:** DE
**Status:** Implementiert

---

## Übersicht

Das Feature **Branch-Marke-Tausch** kehrt die Reihenfolge der ersten beiden Wizard-Schritte im Buchungsprozess um. Bisher wählte der Kunde zuerst eine Fahrzeugmarke und dann einen Standort. **Neu:** Der Standort (Filiale/Branch) wird als erster Schritt ausgewählt — danach werden nur die am Standort verfügbaren Marken angezeigt.

Zusätzlich wird ein **Wizard-Breadcrumb** (7-Schritt-Stepper) auf allen Wizard-Seiten eingeführt, der den Fortschritt visuell darstellt. Die Standort-Cards zeigen neben Name und Adresse auch **Marken-SVG-Logos** als Orientierungshilfe. Ein **Info-Banner** oberhalb des Breadcrumbs zeigt den aktiven Standort mit Name und Adresse.

**Neuer Wizard-Ablauf:**
Standort → Marke → Service → Hinweise → Termin → Fahrzeug → Übersicht

---

## Benutzerführung

### Schritt 1: Standortwahl (Wizard-Einstieg)
![Standortwahl](screenshots/01-location-selection.png)

**Beschreibung:** Der Benutzer sieht alle verfügbaren Werkstatt-Standorte als Karten. Jede Karte zeigt:
- **Werkstatt-Name** (z.B. „Volkswagen Zentrum Essen")
- **Adresse** (Straße, PLZ, Stadt)
- **Marken-Logos** als kleine SVG-Icons — zur schnellen visuellen Orientierung

Die Standorte stammen aus der `branch-config.json` und umfassen über 60 Filialen an verschiedenen Standorten (Essen, Mülheim, Düsseldorf, Wuppertal, etc.).

**Hinweis:** Es gibt keinen Zurück-Button, da die Standortwahl der Einstiegspunkt des Wizards ist. Das Layout passt sich responsiv an: 3 Spalten auf Desktop, 2 auf Tablet, 1 auf Mobile.

### Schritt 2: Markenauswahl (gefiltert nach Standort)
![Markenauswahl](screenshots/02-brand-selection.png)

**Beschreibung:** Nach der Standortwahl werden nur die Marken angezeigt, die am gewählten Standort verfügbar sind. Die Marken werden als große Karten mit SVG-Logos dargestellt.

**Mehrere Marken am Standort:**
![Mehrere Marken](screenshots/03-brands-multi.png)

Standorte wie „Volkswagen Zentrum Essen" bieten mehrere Marken an (VW, VW Nutzfahrzeuge, SEAT, CUPRA). Alle verfügbaren Marken werden als separate Karten angezeigt.

**Einzelne Marke am Standort:**
![Einzelne Marke](screenshots/04-brands-single.png)

Manche Standorte (z.B. „ŠKODA Zentrum Essen") bieten nur eine einzelne Marke an. In diesem Fall wird nur eine Karte angezeigt.

**Navigation:**
- Ein **Zurück-Button** navigiert zurück zur Standortwahl (`/home/location`)
- Bei 0 verfügbaren Marken erscheint der Hinweis: „Für diesen Standort sind derzeit keine Marken verfügbar."
- Ein **Info-Banner** zeigt den gewählten Standort (Name + Adresse) oberhalb des Breadcrumbs

### Wizard-Breadcrumb (7 Schritte)
![Breadcrumb](screenshots/05-breadcrumb-brand.png)

**Beschreibung:** Auf allen Wizard-Seiten wird ein horizontaler Stepper angezeigt, der den aktuellen Fortschritt visualisiert:

| Schritt | Label | Icon | Route |
|---------|-------|------|-------|
| 1 | Standort | `location_on` | `/home/location` |
| 2 | Marke | `directions_car` | `/home/brand` |
| 3 | Service | `build` | `/home/services` |
| 4 | Hinweise | `info` | `/home/notes` |
| 5 | Termin | `calendar_today` | `/home/appointment` |
| 6 | Fahrzeug | `person` | `/home/carinformation` |
| 7 | Übersicht | `check_circle` | `/home/summary` |

**Status-Darstellung:**
- ✅ **Erledigt:** Grüner Haken, Label klickbar (navigiert zurück zum Schritt)
- 🔵 **Aktuell:** Primärfarbe hervorgehoben, fetter Text
- ⬜ **Zukünftig:** Ausgegraut, nicht klickbar

**Responsiv:** Auf Mobile werden nur Icons angezeigt, ab Tablet zusätzlich die Labels.

### Info-Banner (Standort-Anzeige)

**Beschreibung:** Oberhalb des Wizard-Breadcrumbs zeigt ein Info-Banner den aktiven Standort:
- **Icon:** `location_on`
- **Inhalt:** Werkstatt-Name + vollständige Adresse (aus `branch-config.json`)
- **Darstellung:** Kompakt — eine Zeile auf Desktop, zwei Zeilen auf Mobile
- **Hintergrund:** `var(--color-background-info)`

### Schritt 3: Serviceauswahl (nach dem neuen Flow)
![Services nach Flow](screenshots/06-services-after-flow.png)

**Beschreibung:** Nach Standort- und Markenwahl gelangt der Benutzer zur Serviceauswahl. Der Guard prüft, ob sowohl ein Standort als auch eine Marke gewählt wurden. Die Service-Seite zeigt die verfügbaren Services für die gewählte Marke am gewählten Standort.

---

## Standort-Karten (Branch Cards)

Jede Standort-Karte enthält:

| Element | Beschreibung |
|---------|-------------|
| **Name** | Werkstatt-Name aus `branch-config.json` (z.B. „Audi Zentrum Essen") |
| **Adresse** | Straße, PLZ und Stadt — kleiner dargestellt unterhalb des Namens |
| **Marken-Logos** | SVG-Logos der am Standort verfügbaren Marken (`height: 1.5em`), nebeneinander angeordnet |

Die Logos dienen als **visuelle Orientierungshilfe** — der Kunde erkennt auf einen Blick, welche Marken am Standort betreut werden.

---

## Marken-Karten (Brand Cards)

Jede Marken-Karte zeigt:

| Element | Beschreibung |
|---------|-------------|
| **SVG-Logo** | Großes Marken-Logo aus `assets/brands/` (`height: 4–5em`) |
| **Markenname** | Text unterhalb des Logos (z.B. „Audi", „ŠKODA") |

**Verfügbare Marken-Logos:** Audi, Volkswagen, VW Nutzfahrzeuge, SEAT, CUPRA, ŠKODA, Hyundai, Porsche, Bentley, Bugatti, Rimac

**Logo-Größen im gesamten UI:**
- `.brand-logo--sm` (1.25em) — Header/Warenkorb
- `.brand-logo--md` (2em) — Buchungsübersicht
- `.brand-logo--lg` (4–5em) — Markenauswahl

---

## Rücknavigation & State-Reset

| Von | Zurück zu | Was wird zurückgesetzt |
|-----|-----------|----------------------|
| Markenauswahl | Standortwahl | `selectedBrand` wird genullt |
| Serviceauswahl | Markenauswahl | `selectedServices` wird geleert |
| Standort ändern (von Schritt 3+) | Standortwahl | `selectedBrand`, `selectedServices` und alle Folgefelder |

Bei einem **Standort-Wechsel** werden alle nachfolgenden Auswahlen zurückgesetzt, da die verfügbaren Marken standortabhängig sind.

---

## Responsive Ansichten

### Desktop (≥ 64em)
- Standort-Karten: 3-Spalten Grid
- Breadcrumb: Icons + Labels
- Info-Banner: Eine Zeile

### Tablet (≥ 48em)
- Standort-Karten: 2-Spalten Grid
- Breadcrumb: Icons + Labels

### Mobile (< 48em)
- Standort-Karten: 1 Spalte, volle Breite
- Breadcrumb: Nur Icons
- Info-Banner: Zwei Zeilen

---

## Barrierefreiheit

- **Tastaturnavigation:** Alle Karten und Buttons sind per Tab-Taste erreichbar
- **Screen Reader:** `role="navigation"` + `aria-label="Buchungsfortschritt"` auf dem Breadcrumb, `aria-current="step"` auf dem aktiven Schritt
- **Farbkontrast:** WCAG 2.1 AA konform (Kontrast ≥ 4.5:1)
- **Focus-Styles:** `:focus-visible` auf allen interaktiven Elementen
- **Touch-Targets:** Mindestens 2.75em (44px) für alle klickbaren Elemente

---

## Technische Details

| Eigenschaft | Wert |
|-------------|------|
| Route (Standort) | `/#/home/location` |
| Route (Marke) | `/#/home/brand` |
| Container Component (Standort) | `LocationSelectionContainerComponent` |
| Container Component (Marke) | `BrandSelectionContainerComponent` |
| Store | `BookingStore` |
| API Service | `BookingApiService` |
| Config-Datei | `assets/branch-config.json` |
| Guard (Marke) | `locationSelectedGuard` |
| Guard (Service) | `brandSelectedGuard` |
| Resolver (Standorte) | `locationsResolver` — lädt alle Standorte |
| Resolver (Marken) | `brandsResolver` — lädt Marken nach Standort |

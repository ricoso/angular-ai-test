# Feature-Dokumentation: Markenauswahl

**Erstellt:** 2026-02-14
**Requirement:** REQ-002-Markenauswahl
**Sprache:** DE
**Status:** Implementiert

---

## Übersicht

Die Markenauswahl ist der erste Schritt im Buchungs-Wizard. Der Benutzer wählt seine Fahrzeugmarke aus fünf verfügbaren Marken (Audi, BMW, Mercedes-Benz, MINI, Volkswagen). Nach der Auswahl wird automatisch zum nächsten Schritt (Standortwahl) navigiert.

---

## Benutzerführung

### Schritt 1: Markenauswahl anzeigen
![Markenauswahl DE](./screenshots/doc-brand-selection-de.png)

**Beschreibung:** Nach dem Laden der Seite sieht der Benutzer eine Überschrift ("Welche Fahrzeugmarke fahren Sie?") sowie einen Untertitel ("Bitte wählen Sie die gewünschte Marke aus."). Darunter werden fünf große Buttons mit den Markennamen angezeigt.

- Desktop: 5 Buttons nebeneinander in einer Reihe
- Tablet: 3 + 2 Buttons in zwei Reihen
- Mobile: 1 Button pro Reihe (vertikal gestapelt)

### Schritt 2: Marke auswählen

**Beschreibung:** Der Benutzer klickt auf einen der Marken-Buttons. Die gewählte Marke wird im BookingStore gespeichert und der Benutzer wird automatisch zur Standortwahl (`/home/location`) weitergeleitet.

### Alternativ: Marke ändern

**Beschreibung:** Navigiert der Benutzer von einem späteren Schritt zurück zur Markenauswahl, wird die zuvor gewählte Marke visuell hervorgehoben (aktiver Button-Zustand). Bei Auswahl einer anderen Marke werden Standort und Services zurückgesetzt.

---

## Responsive Ansichten

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

- 5 Marken-Buttons in einer Reihe (CSS Grid: `repeat(5, 1fr)`)
- Zentrierte Überschrift und Untertitel
- Maximale Breite: 70em

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

- 3 Buttons in der ersten Reihe, 2 in der zweiten (CSS Grid: `repeat(3, 1fr)`)
- Gleiche Abstände und Schriftgrößen

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

- 1 Button pro Reihe (CSS Grid: `1fr`)
- Volle Breite für jeden Button
- Touch-freundlich: Mindesthöhe 2.75em (44px)

---

## Barrierefreiheit

- **Tastaturnavigation:** Alle Buttons sind per Tab erreichbar und mit Enter/Space auslösbar
- **Screen Reader:** Button-Gruppe hat `role="group"` mit `aria-label="Vehicle brands"`. Aktive Marke wird über `aria-pressed="true"` kommuniziert
- **Farbkontrast:** WCAG 2.1 AA konform (CSS-Variablen aus dem Design System)
- **Focus-Styles:** Sichtbarer Fokusring mit `:focus-visible` (3px Outline)
- **Reduced Motion:** Transitionen werden bei `prefers-reduced-motion: reduce` deaktiviert

---

## Technische Details

| Eigenschaft | Wert |
|-------------|------|
| Route | `/#/home/brand` |
| Container Component | `BrandSelectionContainerComponent` |
| Presentational Component | `BrandButtonsComponent` |
| Store | `BookingStore` |
| API Service | `BookingApiService` |
| Resolver | `brandsResolver` |
| Datenquelle | Statisch (Click-Dummy) |

### Datenfluss

1. Benutzer navigiert zu `/home/brand`
2. `brandsResolver` wird ausgelöst → ruft `store.loadBrands()` auf
3. Store lädt Marken über `BookingApiService.getBrands()` (statische Daten)
4. Container-Component zeigt Titel/Untertitel (i18n) und übergibt `brands()` an `BrandButtonsComponent`
5. Benutzer klickt Button → `brandSelected` Event → `store.setBrand()` → Navigation zu `/home/location`

### Verfügbare Marken

| ID | Anzeigename |
|----|-------------|
| `audi` | Audi |
| `bmw` | BMW |
| `mercedes` | Mercedes-Benz |
| `mini` | MINI |
| `volkswagen` | Volkswagen |

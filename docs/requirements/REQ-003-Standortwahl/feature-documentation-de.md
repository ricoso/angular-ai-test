# Feature-Dokumentation: Standortwahl

**Erstellt:** 2026-02-14
**Requirement:** REQ-003-Standortwahl
**Sprache:** DE
**Status:** Implementiert

---

## Uebersicht

Die Standortwahl ist der zweite Schritt im Buchungs-Wizard. Nachdem der Benutzer im vorherigen Schritt (REQ-002) eine Fahrzeugmarke gewaehlt hat, werden hier die markenspezifischen Standorte (Autohaeuser) angezeigt. Der Benutzer waehlt einen Standort aus, der im BookingStore gespeichert wird. Anschliessend erfolgt die automatische Weiterleitung zum naechsten Schritt (Serviceauswahl, REQ-004).

---

## Benutzerfuehrung

### Schritt 1: Standorte anzeigen
![Standortwahl DE](./screenshots/doc-location-selection-de.png)

**Beschreibung:** Nach dem Laden der Seite `/home/location` liest das System die zuvor gewaehlte Marke aus dem BookingStore. Basierend auf dieser Marke werden die passenden Standorte gefiltert und als Buttons dargestellt. Der Benutzer sieht eine Ueberschrift ("An welchem Standort duerfen wir Sie begruessen?") sowie einen Untertitel ("Bitte waehlen Sie den gewuenschten Standort aus."). Darunter erscheinen 3-5 Standort-Buttons je nach gewaehlter Marke.

- Desktop: bis zu 5 Buttons nebeneinander in einer Reihe
- Tablet: 3 Buttons in der ersten Reihe, Rest in der zweiten
- Mobile: 1 Button pro Reihe (vertikal gestapelt, volle Breite)

### Schritt 2: Standort auswaehlen

**Beschreibung:** Der Benutzer klickt auf einen der Standort-Buttons. Die Auswahl wird im BookingStore unter `selectedLocation` gespeichert und der Benutzer wird automatisch zur Serviceauswahl (`/home/services`, REQ-004) weitergeleitet.

### Alternativ: Zurueck zur Markenauswahl

**Beschreibung:** Der Benutzer kann ueber den Zurueck-Pfeil zur Markenauswahl (`/home/brand`) navigieren. Die zuvor gewaehlte Marke bleibt im Store erhalten und wird dort visuell hervorgehoben.

### Alternativ: Standort aendern

**Beschreibung:** Navigiert der Benutzer von einem spaeteren Schritt zurueck zur Standortwahl, wird der zuvor gewaehlte Standort visuell hervorgehoben (aktiver Button-Zustand mit `aria-pressed="true"`). Bei Auswahl eines anderen Standorts werden bereits gewaehlte Services zurueckgesetzt.

---

## Responsive Ansichten

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

- Bis zu 5 Standort-Buttons in einer Reihe (CSS Grid: `repeat(5, 1fr)`)
- Zentrierte Ueberschrift und Untertitel
- Maximale Breite: 70em

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

- 3 Buttons in der ersten Reihe, restliche in der zweiten (CSS Grid: `repeat(3, 1fr)`)
- Gleiche Abstaende und Schriftgroessen wie Desktop

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

- 1 Button pro Reihe (CSS Grid: `1fr`)
- Volle Breite fuer jeden Button
- Touch-freundlich: Mindesthoehe `var(--touch-target-min)` (2.75em / 44px)

---

## Barrierefreiheit

- **Tastaturnavigation:** Alle Standort-Buttons sind per Tab erreichbar und mit Enter/Space ausloesbar
- **Screen Reader:** Button-Gruppe hat `role="group"` mit `aria-label` (uebersetzt). Aktiver Standort wird ueber `aria-pressed="true"` kommuniziert
- **Farbkontrast:** WCAG 2.1 AA konform (CSS-Variablen aus dem Design System, keine hardcoded Farben)
- **Focus-Styles:** Sichtbarer Fokusring mit `:focus-visible` (0.1875em Outline mit `--color-focus-ring`)
- **Reduced Motion:** Transitionen werden bei `prefers-reduced-motion: reduce` deaktiviert (`transition: none`)

---

## Technische Details

| Eigenschaft | Wert |
|-------------|------|
| Route | `/#/home/location` |
| Container Component | `LocationSelectionContainerComponent` |
| Presentational Component | `LocationButtonsComponent` |
| Store | `BookingStore` |
| API Service | `BookingApiService` |
| Resolver | `locationsResolver` |
| Guard | `brandSelectedGuard` |
| Datenquelle | Statisch (Click-Dummy) |

### Datenfluss

1. Benutzer navigiert zu `/home/location`
2. `brandSelectedGuard` prueft, ob eine Marke im Store gewaehlt ist. Falls nicht, erfolgt ein Redirect zu `/home/brand`
3. `locationsResolver` wird ausgeloest und ruft `store.loadLocations()` auf
4. Store laedt Standorte ueber `BookingApiService.getLocations(brand)` (statische Daten, gefiltert nach gewaehlter Marke)
5. Container-Component zeigt Titel/Untertitel (i18n) und uebergibt `filteredLocations()` sowie `selectedLocation()` an `LocationButtonsComponent`
6. Benutzer klickt Button -> `locationSelected` Event -> `store.setLocation()` -> Navigation zu `/home/services`

### Standorte pro Marke

| Marke | Standorte | Anzahl |
|-------|-----------|--------|
| Audi | Muenchen, Hamburg, Berlin, Frankfurt, Duesseldorf | 5 |
| BMW | Stuttgart, Koeln, Muenchen, Berlin, Hamburg | 5 |
| Mercedes-Benz | Stuttgart, Muenchen, Frankfurt, Duesseldorf, Berlin | 5 |
| MINI | Garbsen, Hannover Suedstadt, Steinhude | 3 |
| Volkswagen | Wolfsburg, Hannover, Berlin, Muenchen, Hamburg | 5 |

### Datenmodell

```typescript
interface LocationDisplay {
  id: string;
  name: string;
  city: string;
}
```

### Ordnerstruktur

```
src/app/features/booking/components/location-selection/
├── location-selection-container.component.ts
├── location-selection-container.component.html
├── location-selection-container.component.scss
├── location-selection-container.component.spec.ts
├── location-buttons.component.ts
├── location-buttons.component.html
├── location-buttons.component.scss
└── location-buttons.component.spec.ts
```

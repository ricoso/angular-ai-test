# Feature-Dokumentation: Header

**Erstellt:** 2026-02-14
**Requirement:** REQ-001-Header
**Sprache:** DE
**Status:** Implementiert

---

## Übersicht

Der Application Header ist eine wiederverwendbare Komponente, die auf allen Seiten der Anwendung angezeigt wird. Er enthält das Firmenlogo mit Namen, ein Warenkorb-Icon mit Badge und Dropdown sowie ein Accessibility-Menü zur Anpassung von Schriftgröße, Kontrast und Animationen.

---

## Benutzerführung

### Schritt 1: Header anzeigen
![Header DE](./screenshots/doc-header-de.png)

**Beschreibung:** Der Header wird beim Laden jeder Seite automatisch angezeigt. Links befindet sich das Firmenlogo mit dem Namen "Gottfried Schultz Automobilhandels SE". Rechts sind das Warenkorb-Icon und der Accessibility-Button platziert.

### Schritt 2: Warenkorb-Icon

**Beschreibung:** Das Warenkorb-Icon zeigt ein Badge mit der Anzahl der Artikel im Warenkorb. Bei 0 Artikeln wird kein Badge angezeigt, bei mehr als 99 Artikeln wird "99+" dargestellt. Ein Klick öffnet das Warenkorb-Dropdown mit einer Vorschau des Warenkorb-Inhalts.

### Schritt 3: Accessibility-Menü öffnen

**Beschreibung:** Der Benutzer klickt auf den Accessibility-Button (Barrierefreiheit-Icon). Es öffnet sich ein Dropdown-Menü mit folgenden Einstellungen:

- **Schriftgröße:** Klein, Normal, Groß, Sehr groß
- **Hoher Kontrast:** Ein/Aus Toggle
- **Reduzierte Bewegung:** Ein/Aus Toggle

### Schritt 4: Einstellungen ändern

**Beschreibung:** Änderungen werden sofort angewendet und im LocalStorage gespeichert. Beim nächsten Besuch werden die Einstellungen automatisch wiederhergestellt. Die System-Präferenz für reduzierte Bewegung wird initial respektiert.

---

## Responsive Ansichten

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

- Logo + Firmenname (2 Zeilen: Name + Untertitel)
- Warenkorb-Icon und Accessibility-Button rechts

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

- Logo + Firmenname (1 Zeile, ohne Untertitel)
- Gleiche Button-Anordnung

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

- Nur Logo (Firmenname versteckt)
- Kompakte Button-Anordnung

---

## Barrierefreiheit

- **Tastaturnavigation:** Alle Buttons sind per Tab erreichbar, Menüs öffnen mit Enter/Space
- **Screen Reader:** ARIA-Labels auf allen interaktiven Elementen ("Barrierefreiheit Einstellungen", "Warenkorb, X Artikel")
- **Farbkontrast:** WCAG 2.1 AA konform, unterstützt High-Contrast-Modus
- **Focus-Styles:** Sichtbarer Fokusring mit `:focus-visible`
- **Reduced Motion:** Transitionen werden bei `prefers-reduced-motion: reduce` deaktiviert
- **Semantisches HTML:** `<header role="banner">` als Landmark

---

## Technische Details

| Eigenschaft | Wert |
|-------------|------|
| Container Component | `HeaderContainerComponent` |
| Cart Icon Component | `CartIconComponent` |
| Accessibility Menu Component | `AccessibilityMenuComponent` |
| Accessibility Store | `AccessibilityStore` |
| Cart Store | `CartStore` |
| LocalStorage Key | `accessibility-settings` |

### Datenfluss

1. App startet → `AccessibilityStore.loadFromStorage()` lädt Einstellungen aus LocalStorage
2. Store wendet `data-font-size`, `data-high-contrast`, `data-reduced-motion` auf `<html>` an
3. CSS-Variablen reagieren auf die Data-Attribute
4. Benutzer ändert Einstellung → Store aktualisiert → LocalStorage wird gespeichert → DOM wird aktualisiert

### Schriftgrößen

| Stufe | Wert | Label DE | Label EN |
|-------|------|----------|----------|
| `small` | 14px | Klein | Small |
| `normal` | 16px | Normal | Normal |
| `large` | 18px | Groß | Large |
| `x-large` | 20px | Sehr groß | Extra Large |

# Feature-Dokumentation: Hinweisseite Erweitert

**Erstellt:** 2026-04-02
**Requirement:** REQ-012-Hinweisseite-Erweitert
**Sprache:** DE
**Status:** Implementiert

---

## Übersicht

Die Hinweisseite (Wizard-Schritt 4) wurde um drei zusätzliche Auswahlfelder erweitert:
- **Mobilitätsoptionen (kostenpflichtig):** Auswahl eines Ersatzfahrzeugs (Kleinwagen, Mittelklasse, Oberklasse)
- **Terminpräferenz:** Bevorzugte Tageszeit für den Werkstatttermin
- **Rückruf:** Wunsch nach telefonischem Rückruf

Diese Optionen erscheinen oberhalb des bestehenden Anmerkungen-Textfelds.

---

## Benutzerführung

### Schritt 1: Hinweisseite aufrufen
![Desktop](./screenshots/e2e-responsive-desktop.png)

**Beschreibung:** Nach Auswahl von Marke, Standort und Services gelangt der Benutzer zur Hinweisseite. Die drei neuen Dropdown-Felder sind sofort sichtbar.

### Schritt 2: Mobilitätsoptionen wählen
**Beschreibung:** Im ersten Dropdown kann der Benutzer ein Ersatzfahrzeug auswählen:
- Keine Auswahl (Standard)
- Kleinwagen
- Mittelklasse
- Oberklasse

### Schritt 3: Terminpräferenz wählen
**Beschreibung:** Im zweiten Dropdown legt der Benutzer seine bevorzugte Tageszeit fest:
- Jederzeit (Standard)
- Vormittags
- Nachmittags

### Schritt 4: Rückruf-Option wählen
**Beschreibung:** Im dritten Dropdown kann der Benutzer einen Rückruf anfordern:
- Keine Auswahl (Standard)
- Ja

### Schritt 5: Anmerkungen eingeben (optional)
**Beschreibung:** Das bestehende Textfeld für freie Anmerkungen steht weiterhin zur Verfügung.

### Schritt 6: Weiter klicken
**Beschreibung:** Alle Dropdown-Werte werden gespeichert. Der Benutzer gelangt zum nächsten Wizard-Schritt.

---

## Responsive Ansichten

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

---

## Barrierefreiheit

- **Tastaturnavigation:** Alle Dropdowns sind per Tab erreichbar und per Enter/Space bedienbar
- **Screen Reader:** ARIA-Labels und Rollen korrekt gesetzt (`role="group"`, `role="region"`)
- **Farbkontrast:** WCAG 2.1 AA konform (≥ 4.5:1)
- **Focus-Styles:** Sichtbare Fokusringe via `:focus-visible`
- **Touch-Targets:** Mindestgröße 2.75em für mobile Bedienung

---

## Technische Details

| Eigenschaft | Wert |
|-------------|------|
| Route | `/#/home/notes` |
| Container Component | `NotesContainerComponent` |
| Presentational Component | `NotesExtrasFormComponent` |
| Store | `BookingStore` |
| Model | `NotesExtras` (notes-extras.model.ts) |
| i18n Keys | `booking.notes.mobilityOptions.*`, `booking.notes.appointmentPreference.*`, `booking.notes.callback.*` |

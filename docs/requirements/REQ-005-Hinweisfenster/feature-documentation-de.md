# Feature-Dokumentation: Hinweisfenster

**Erstellt:** 2026-02-23
**Requirement:** REQ-005-Hinweisfenster
**Sprache:** DE
**Status:** Implementiert

---

## Übersicht

Das Hinweisfenster ist der **4. Schritt im Buchungs-Wizard** (Marke -> Standort -> Services -> **Hinweise** -> ...). Der Benutzer kann nach der Serviceauswahl (REQ-004) optionale Hinweise zu seiner Buchung eingeben. Die Seite zeigt ein Freitextfeld (max. 1000 Zeichen) mit Echtzeit-Zeichenzaehler sowie servicespezifische Hinweistexte an, die nur fuer die zuvor gewaehlten Services angezeigt werden. Die eingegebene Buchungsnotiz wird im BookingStore gespeichert und an den naechsten Wizard-Schritt uebergeben.

---

## Benutzerfuehrung

### Schritt 1: Seite laden

**Beschreibung:** Beim Aufruf der Route `/#/home/notes` prueft der `servicesSelectedGuard`, ob Marke, Standort und mindestens ein Service im BookingStore vorhanden sind. Ist dies der Fall, wird die Seite mit der Ueberschrift "Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung" und der Unterueberschrift "Moechten Sie uns noch etwas zu Ihrer Buchung mitteilen?" angezeigt. Ein Freitextfeld mit Placeholder-Text und dem Zeichenzaehler "0 / 1000" wird gerendert. Darunter erscheint der Abschnitt "Wichtige Hinweise zu Ihren ausgewaehlten Services" mit servicespezifischen Hinweistexten, die nur fuer die tatsaechlich gewaehlten Services sichtbar sind. Zurueck- und Weiter-Buttons befinden sich am unteren Seitenrand.

### Schritt 2: Textfeld fokussieren

**Beschreibung:** Der Benutzer klickt auf das Freitextfeld. Der Placeholder-Text "Bitte tragen Sie hier Ihre Nachricht an uns ein (Hinweise, Buchung weiterer Leistungen, etc.)" verschwindet (Standard-HTML-Verhalten). Der Cursor ist im Textfeld sichtbar und der Benutzer kann mit der Eingabe beginnen.

### Schritt 3: Nachricht eingeben

**Beschreibung:** Der Benutzer tippt seinen Text in das Freitextfeld. Der Zeichenzaehler aktualisiert sich in Echtzeit bei jeder Eingabe (z.B. "87 / 1000"). Die maximale Zeichenanzahl von 1000 wird durch `maxlength` und Reactive Forms Validierung durchgesetzt. Bei Erreichen des Limits werden keine weiteren Zeichen akzeptiert.

### Schritt 4: Weiter klicken

**Beschreibung:** Der Benutzer klickt den "Weiter"-Button. Das System speichert den eingegebenen Text als `bookingNote` im BookingStore und navigiert zum naechsten Wizard-Schritt. Das Textfeld ist optional: Der Weiter-Button ist immer aktiv, auch ohne Texteingabe. In diesem Fall wird `bookingNote: null` gespeichert. Ueber den "Zurueck"-Button kann der Benutzer zur Serviceauswahl (`/home/services`) zurueckkehren.

---

## Responsive Ansichten

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

Das Freitextfeld erstreckt sich ueber die volle Breite des Content-Bereichs mit 6 Zeilen Hoehe. Die servicespezifischen Hinweise werden untereinander angezeigt. Die Buttons "Zurueck" und "Weiter" stehen nebeneinander (Zurueck links, Weiter rechts).

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

Das Layout entspricht weitgehend der Desktop-Ansicht: Textfeld in voller Breite, Hinweise gestapelt, Buttons nebeneinander.

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

Das Textfeld nimmt die volle Bildschirmbreite ein. Die Hinweistexte stacken vertikal. Die Buttons werden uebereinander angeordnet (Zurueck oben, Weiter unten) und erstrecken sich jeweils ueber die volle Breite.

---

## Barrierefreiheit

- **Tastaturnavigation:** Die Tab-Reihenfolge folgt der logischen Seitenstruktur: Textfeld, Zurueck-Button, Weiter-Button. Alle interaktiven Elemente sind per Tab-Taste erreichbar und per Enter oder Space bedienbar.
- **Screen Reader:** Das Textfeld ist mit einem `aria-label` und `aria-describedby` (Verweis auf den Zeichenzaehler) ausgestattet. Der Zeichenzaehler ist als `aria-live="polite"` Region markiert, sodass Aenderungen automatisch vorgelesen werden. Hinweis-Items verwenden `role="note"`.
- **Farbkontrast:** WCAG 2.1 AA konform mit mindestens 4.5:1 Kontrastverhaeltnis fuer Text und interaktive Elemente.
- **Focus-Styles:** Sichtbare Fokus-Indikatoren (`:focus-visible`) auf allen interaktiven Elementen. Touch-Targets haben eine Mindestgroesse von 2.75em (44px).

---

## Technische Details

| Eigenschaft | Wert |
|-------------|------|
| Route | `/#/home/notes` |
| Container Component | `NotesContainerComponent` |
| Store | `BookingStore` (erweitert um `bookingNote`) |
| Guard | `servicesSelectedGuard` |
| Presentational Components | `NotesFormComponent`, `ServiceHintsComponent` |
| Store-Methode | `setBookingNote(note: string \| null)` |
| Computed Signal | `hasBookingNote` |
| Formular | Reactive Forms (`FormControl<string>`, `Validators.maxLength(1000)`) |
| i18n Keys | `booking.notes.*` (DE + EN) |

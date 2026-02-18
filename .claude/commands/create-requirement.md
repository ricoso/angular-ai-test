# Create Requirement Command

Erstellt ein neues Requirement mit Mockup-Generierung und Pull Request.

## Usage

```
/create-requirement $ARGUMENTS
```

**$ARGUMENTS** = `<REQ-ID-Name>` (z.B. `REQ-005-Terminauswahl`)

## Workflow

### Step 1: Git Setup

1. Aktuellen Branch prüfen
2. Neuen Branch erstellen: `req/<REQ-ID-Name>`
3. Branch auschecken

```bash
git checkout -b req/$ARGUMENTS
```

### Step 2: Ordner & Template erstellen

1. Ordner erstellen: `docs/requirements/<REQ-ID-Name>/`
2. `requirement.md` aus `REQ-TEMPLATE.md` kopieren (falls nicht vorhanden)

```bash
mkdir -p docs/requirements/$ARGUMENTS
cp docs/requirements/REQ-TEMPLATE.md docs/requirements/$ARGUMENTS/requirement.md
```

### Step 3: Screenshot analysieren (falls vorhanden)

Suche nach Bildern im Ordner (`*.png`, `*.jpg`, `*.jpeg`).

**UI-Analyse-Regeln:**
- Identifiziere alle UI-Elemente (Buttons, Inputs, Labels, Cards, etc.)
- Erkenne Hierarchie (Header, Content, Footer, Sidebar)
- Extrahiere Texte und Labels
- Identifiziere interaktive Elemente und deren Funktion
- **WICHTIG:** Der hochgeladene Screenshot ist nur ein GROBER Anhaltspunkt!
- **WICHTIG:** NUR Struktur extrahieren, KEINE Farben/Styling aus Screenshot!

### Step 4: Bestehende Features konsultieren (PFLICHT!)

> ⛔ **VOR dem Mockup-Erstellen MÜSSEN bestehende Features analysiert werden!**

1. **Lese `src/styles/_variables.scss`** — alle CSS-Variablen (Farben, Spacing, Fonts, Radii)
2. **Lese bestehende Screenshots** — konsultiere vorhandene E2E-Screenshots für Design-Konsistenz:
   ```
   docs/requirements/REQ-*/screenshots/e2e-responsive-desktop.png
   ```
3. **Lese bestehende Templates** — analysiere 1-2 implementierte Feature-Templates für Patterns:
   ```
   src/app/features/booking/components/*/
   ```

**Daraus extrahieren:**

| Element | Projekt-Standard |
|---------|-----------------|
| Header | Logo links + Firmenname, Warenkorb-Icon + A11y-Icon rechts, `icon-framed` Rahmen |
| Layout | Zentriert (`max-width: 70em`), `padding: var(--spacing-xl) var(--spacing-md)` |
| Überschrift | `h1` zentriert + `p` Subtitle darunter |
| Karten | `mat-card` mit `icon-framed` Icon, Titel, Beschreibung, abgerundete Ecken |
| Buttons | **IMMER `mat-flat-button`** (filled), Primary mit `color="primary"` |
| Navigation | Zurück-Button links (`arrow_back` Icon), Weiter-Button rechts (`arrow_forward` Icon) |
| Icons | Material Icons, IMMER mit `.icon-framed` Rahmen |
| Farben | NUR CSS-Variablen aus `_variables.scss` |
| Spacing | `var(--spacing-*)` Tokens |
| Fonts | `var(--font-size-*)` Tokens |
| Responsive | 3 Viewports: Mobile (<48em), Tablet (>=48em), Desktop (>=64em) |

### Step 5: Mockup generieren (PFLICHT!)

> ⛔ **Jedes Requirement MUSS ein Mockup haben!**

Erstelle eine **HTML-Mockup-Datei** im Requirement-Ordner:

```
docs/requirements/$ARGUMENTS/mockup.html
```

**Mockup-Regeln:**

1. **Standalone HTML** — muss ohne Server im Browser öffenbar sein
2. **Google Material Icons** via CDN einbinden
3. **CSS-Variablen aus `_variables.scss` übernehmen** — im `<style>` Block als `:root` definieren
4. **Projekt-Design-System exakt nachbilden:**
   - Header: Logo-Platzhalter + Firmenname links, Cart-Icon + A11y-Icon rechts
   - Content: Zentriert, Überschrift + Subtitle + Feature-spezifische UI
   - Footer: Firmenname zentriert
   - Navigation: Zurück/Weiter-Buttons (wo relevant)
5. **Responsive** — Media Queries für Mobile/Tablet/Desktop
6. **Interaktiv** — Hover-States, Selected-States, Klick-Feedback via CSS
7. **Deutsche Texte** — UI-Sprache DE im Mockup (wie im Requirement)
8. **Accessibility** — `role`, `aria-*` Attribute, Focus-Styles, Kontrast

**Mockup-Template-Struktur:**

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>REQ-XXX — [Feature-Name] Mockup</title>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <style>
    /* CSS-Variablen aus _variables.scss */
    :root {
      --color-primary: #4f46e5;
      --color-accent: #ed8936;
      --color-background-page: #f8f9fa;
      --color-background-surface: #ffffff;
      --color-text-primary: #1a202c;
      --color-text-secondary: #718096;
      --color-border: #e2e8f0;
      /* ... alle relevanten Variablen */
    }

    /* Projekt-Layout nachbilden */
    /* Header, Content, Cards, Buttons, etc. */
  </style>
</head>
<body>
  <!-- Header (wie REQ-001) -->
  <!-- Content (Feature-spezifisch) -->
  <!-- Navigation (Zurück/Weiter falls relevant) -->
  <!-- Footer -->
</body>
</html>
```

6. **Screenshot erstellen** — Öffne das Mockup und erstelle einen Screenshot:
   ```bash
   # Via Playwright CLI
   npx playwright screenshot --viewport-size="1280,720" docs/requirements/$ARGUMENTS/mockup.html docs/requirements/$ARGUMENTS/mockup.png
   ```
   Falls Playwright nicht verfügbar: HTML-Mockup reicht als Referenz.

### Step 6: Styling-Vorgaben anwenden

**IMMER aus `src/styles/_variables.scss`** (sprechende Namen!):
- `--color-background-page` - Page Hintergrund
- `--color-background-surface` - Cards, Modals
- `--color-primary` - Buttons, Links
- `--color-text-primary` - Haupttext
- `--color-text-secondary` - Sekundärtext

**IMMER hinzufügen:**
- Accessibility-Header mit Icon `accessibility_new`
- WCAG 2.1 AA Konformität
- Mobile-First Responsive Design

### Step 7: Template ausfüllen

Fülle folgende Sections aus:

| Section | Inhalt |
|---------|--------|
| 1. Overview | Purpose, Scope, Related Requirements |
| 2. User Story | As a... I want... So that... + Acceptance Criteria |
| 3. Preconditions | System, User, Data Voraussetzungen |
| 4. Main Flow | Schritt-für-Schritt Ablauf, **Verweis auf Mockup** |
| 5. Alternative Flows | Alternative Szenarien |
| 6. Exception Flows | Fehlerbehandlung |
| 10. Data Model | TypeScript Interfaces/Types |
| 11. UI/UX | UI-Elemente Tabelle + Material Components |
| 14. Implementation | Angular Components, Services, Stores |
| 16. Naming Glossary | Deutsche/Englische Methodennamen |

**In Section 4 (Main Flow):** Mockup referenzieren:
```markdown
![Feature-Name](./mockup.png)
```

### Step 8: REQUIREMENTS.md aktualisieren

Neues REQ zur Liste in `docs/requirements/REQUIREMENTS.md` hinzufügen:

```markdown
| REQ-XXX | Name | Draft | Priority | Dependencies |
```

### Step 9: Requirement prüfen

```
/check-requirement $ARGUMENTS
```

Prüft:
- [ ] Alle Pflicht-Sections ausgefüllt
- [ ] Keine Platzhalter `[...]` mehr
- [ ] Keine hardcoded Farben
- [ ] i18n Keys DE + EN
- [ ] Dependencies in REQUIREMENTS.md
- [ ] **Mockup vorhanden** (`mockup.html` + optional `mockup.png`)


## Beispiel

```
/create-requirement REQ-005-Terminauswahl
```

**Ergebnis:**
1. Branch: `req/REQ-005-Terminauswahl`
2. Ordner: `docs/requirements/REQ-005-Terminauswahl/`
3. Datei: `requirement.md` ausgefüllt
4. **Datei: `mockup.html` generiert (Standalone-Mockup)**
5. **Datei: `mockup.png` Screenshot (falls Playwright verfügbar)**
6. REQUIREMENTS.md aktualisiert
7. Commit erstellt
8. PR erstellt und Link ausgegeben

## Wichtige Regeln

1. **Mockup ist PFLICHT** — Jedes Requirement braucht ein `mockup.html`
2. **Bestehende Features konsultieren** — Screenshots + Templates analysieren vor Mockup-Erstellung
3. **Hochgeladene Bilder = nur Anhaltspunkt** — Struktur ja, Styling NEIN
4. **Keine Farben aus Screenshots** — IMMER `_variables.scss` CSS-Variablen verwenden
5. **Buttons IMMER filled** — `mat-flat-button`, KEIN `mat-stroked-button`
6. **Icons IMMER mit Rahmen** — `.icon-framed` Klasse
7. **Accessibility-Header PFLICHT** — Bei jeder Page hinzufügen
8. **Mobile-First** — Responsive Design von Anfang an
9. **WCAG 2.1 AA** — Accessibility-Standards einhalten
10. **Bilingual** — Code-Sprache Englisch, UI immer DE + EN

## Referenzen

- Template: `docs/requirements/REQ-TEMPLATE.md`
- Design System: `.claude/skills/ui-design-system.md`
- Farben: `src/styles/_variables.scss`
- Architektur: `.claude/skills/angular-architecture.md`
- **Bestehende Screenshots:** `docs/requirements/REQ-*/screenshots/e2e-responsive-desktop.png`
- **Bestehende Templates:** `src/app/features/booking/components/*/`

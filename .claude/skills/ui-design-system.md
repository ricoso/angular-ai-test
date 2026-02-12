# UI Design System

**Single Source of Truth:** `src/styles/_variables.scss`

---

## Regeln

### 1. Farben IMMER aus `_variables.scss`

```scss
// RICHTIG
background: var(--color-background-page);
color: var(--color-text-primary);

// FALSCH - Niemals Hardcoded!
background: #f8f9fa;
color: #1a1a1a;
```

### 2. Screenshot-Analyse

**Extrahieren:**
- Struktur (Header, Content, Footer)
- UI-Elemente (Buttons, Cards, Inputs)
- Texte und Labels
- Interaktive Elemente

**NICHT übernehmen:**
- ❌ Farben → `_variables.scss`
- ❌ Abstände → `--spacing-*`
- ❌ Schatten → `--shadow-*`
- ❌ Schriftgrößen → `--font-size-*`

### 3. Accessibility Header (PFLICHT)

Jede Page nutzt `<app-header>` aus REQ-001 mit:
- Logo + Firmenname
- Accessibility-Button mit Icon: `<mat-icon>accessibility_new</mat-icon>`
- Dropdown: Font-Size, High-Contrast, Reduced-Motion

### 4. Layout

**Mobile-First Breakpoints:**
- Mobile: < 48em (Default)
- Tablet: ≥ 48em
- Desktop: ≥ 64em

**Touch-Targets:** `min-height: var(--touch-target-min)` (44px)

### 5. Icons IMMER mit Rahmen

**Standard:** Abgerundetes Quadrat mit leichtem Schatten

```html
<!-- RICHTIG -->
<span class="icon-framed">
  <mat-icon>settings</mat-icon>
</span>

<!-- Mit Varianten -->
<span class="icon-framed icon-framed--primary">
  <mat-icon>check_circle</mat-icon>
</span>

<span class="icon-framed icon-framed--lg">
  <mat-icon>home</mat-icon>
</span>

<!-- FALSCH - Kein nacktes Icon -->
<mat-icon>settings</mat-icon>
```

**Varianten:**
- `.icon-framed` - Standard (neutral)
- `.icon-framed--primary` - Primary Color Akzent
- `.icon-framed--secondary` - Secondary Color Akzent
- `.icon-framed--lg` - Größere Version (3em)
- `.icon-framed--sm` - Kleinere Version (2em)

**Styling:** `src/styles/_utilities.scss`

---

## Material Component Mapping

| UI-Element | Material Component |
|------------|-------------------|
| Primary Button | `mat-raised-button color="primary"` |
| Secondary Button | `mat-stroked-button` |
| Icon Button | `mat-icon-button` |
| Card | `mat-card` |
| Menu | `mat-menu` |
| Toggle | `mat-slide-toggle` |
| Radio | `mat-radio-group` |

### Standard Icons (Material Icons)

| Zweck | Icon Name |
|-------|-----------|
| Accessibility | `accessibility_new` |
| Settings | `settings` |
| Close | `close` |
| Menu | `menu` |
| Home | `home` |
| Error | `error` |
| Success | `check_circle` |
| Warning | `warning` |
| Info | `info` |

---

## Referenz

Alle Variablen: `src/styles/_variables.scss`

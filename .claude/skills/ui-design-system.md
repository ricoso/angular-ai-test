# UI Design System

**Single Source of Truth:** `src/styles/_variables.scss`

---

## Regeln

### 1. Farben IMMER aus `_variables.scss`

```scss
background: var(--color-background-page);   // ✅
color: var(--color-text-primary);           // ✅
background: #f8f9fa;                        // ❌ Niemals Hardcoded!
```

### 2. Screenshot-Analyse

**Extrahieren:** Struktur, UI-Elemente, Texte, Interaktive Elemente
**NICHT übernehmen:** Farben/Abstände/Schatten/Schriftgrößen → immer `_variables.scss`

### 3. Accessibility Header (PFLICHT)

Jede Page nutzt `<app-header>` aus REQ-001 mit:
- Logo + Firmenname
- Accessibility-Button: `<mat-icon>accessibility_new</mat-icon>`
- Dropdown: Font-Size, High-Contrast, Reduced-Motion

### 4. Layout

**Mobile-First Breakpoints:** Mobile < 48em (Default), Tablet ≥ 48em, Desktop ≥ 64em
**Touch-Targets:** `min-height: var(--touch-target-min)` (44px)

### 5. Modals & Dropdowns IMMER heller Hintergrund

```scss
.modal, .dropdown, .menu {
  background: var(--color-background-surface); // #ffffff
  color: var(--color-text-primary);
  box-shadow: var(--shadow-medium);
}
```

**Gilt für:** `mat-dialog`, `mat-bottom-sheet`, `mat-menu`, `mat-select` Panel, Custom Dropdowns, Accessibility-Menu, Tooltips

**Material Override (falls nötig):**
```scss
// src/styles/_material-overrides.scss
.mat-mdc-dialog-container { background: var(--color-background-surface) !important; }
.mat-mdc-menu-panel { background: var(--color-background-surface) !important; }
.mat-mdc-select-panel { background: var(--color-background-surface) !important; }
```

### 6. Icons IMMER mit Rahmen

```html
<span class="icon-framed"><mat-icon>settings</mat-icon></span>
<span class="icon-framed icon-framed--primary"><mat-icon>check_circle</mat-icon></span>
<!-- ❌ FALSCH: <mat-icon>settings</mat-icon> (kein Rahmen) -->
```

Varianten: `icon-framed`, `--primary`, `--secondary`, `--lg` (3em), `--sm` (2em) — Styling in `_utilities.scss`

---

## Referenz

Alle Variablen: `src/styles/_variables.scss`

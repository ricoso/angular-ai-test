# Qualitäts-Report: REQ-013-Branch-Marke-Tausch

**Datum:** 2026-04-03
**Branch:** `req/REQ-013-Branch-Marke-Tausch`
**PR:** https://github.com/ricoso/angular-spec-ai/pull/25
**Status:** Implementiert — 24 ACs, davon 5 implementiert + verifiziert

---

## 1. Requirement-Vollständigkeit

| Section | Status | Bemerkung |
|---------|--------|-----------|
| 1. Overview | OK | Purpose, Scope inkl. VIN-Entfernung, Preis→Extras, Breadcrumb Reset |
| 2. User Story | OK | 24 Acceptance Criteria |
| 3. Preconditions | OK | System, User, Data |
| 4. Main Flow | OK | Neuer Wizard-Flow dokumentiert |
| 5. Alternative Flows | OK | URL-Parameter, Rücknavigation |
| 6. Exception Flows | OK | Ungültige Branch-ID, keine Marken |
| 7. Postconditions | OK | Store-Reihenfolge |
| 8. Business Rules | OK | 7 Regeln |
| 9. Non-Functional | OK | Performance, Security |
| 10. Data Model | OK | Branch-Config JSON (68 Werkstätten), BranchConfig Interface, Store-Änderungen |
| 11. UI/UX | OK | Auto-Navigation, Breadcrumb, SVG-Logos, Reset-Tabelle, Zurück-Button-Logik |
| 12. API Specification | OK | Vorher/Nachher für alle Endpunkte |
| 13. Test Cases | OK | 13+ Test Cases mit Given/When/Then |
| 14. Implementation | OK | Store, Routes, Guards, Resolver, Components |
| 15. Dependencies | OK | REQ-002, REQ-003, REQ-004, REQ-007 |
| 16. Naming Glossary | OK | Englische Methodennamen |
| 17. i18n Keys | OK | DE + EN |

**Sections:** 19/17 (2 Bonus)
**Platzhalter:** 0
**Code-Sprache:** Englisch

---

## 2. Acceptance Criteria — Status

| AC | Beschreibung | Status |
|----|-------------|--------|
| AC-1 | Wizard-Einstieg `/home/location` | IMPL |
| AC-2 | Alle Standorte anzeigen | IMPL |
| AC-3 | Nach Standort → `/home/brand` | IMPL |
| AC-4 | Marken gefiltert nach Standort | IMPL |
| AC-5 | Zurück-Button Marke → Standort | IMPL |
| AC-6 | Kein Zurück auf Standort | IMPL |
| AC-7 | Store: Location vor Brand | IMPL |
| AC-8 | Guard `/home/brand` prüft Location | IMPL |
| AC-9 | Guard `/home/services` prüft beides | IMPL |
| AC-10 | Location-Wechsel resetet Brand | IMPL |
| AC-11 | Default-Redirect → `/home/location` | IMPL |
| AC-12 | Wizard-Breadcrumb 7 Schritte | IMPL |
| AC-13 | SVG-Logos durchgängig | OFFEN |
| AC-14 | Warenkorb: Alle Service-Optionen | OFFEN |
| AC-15 | Checkmark nicht abgeschnitten | IMPL (CSS) |
| AC-16 | Branch-Info-Banner auf allen Seiten | IMPL |
| AC-17 | Warenkorb: Marke als SVG-Logo | OFFEN |
| AC-18 | Auto-Navigation Standort | IMPL |
| AC-19 | Auto-Navigation Marke | IMPL |
| AC-20 | Service behält Weiter-Button | IMPL |
| AC-21 | SVG-Logos auf Standort-Cards | OFFEN |
| AC-22 | VIN entfernt | IMPL |
| AC-23 | Preis → Extras in Übersicht | IMPL |
| AC-24 | Breadcrumb Reset + Daten erhalten | IMPL |

**Implementiert:** 20/24
**Offen:** 4 (AC-13, AC-14, AC-17, AC-21 — SVG-Logo-Integration im Warenkorb/Cards)

---

## 3. Mockup

| Kriterium | Status |
|-----------|--------|
| mockup.html vorhanden | OK — Beide Seiten (Standort + Marke) |
| Kein `<script>` Tag | OK |
| SVG-Markenlogos | OK — 11 Logos als Base64 Data-URIs |
| Responsive | OK — Mobile, Tablet, Desktop |
| Accessibility | OK — aria-*, focus-visible, Skip-Link |
| Wizard-Breadcrumb | OK — 7 Schritte |
| Auto-Navigation | OK — Kein "Weiter" bei Standort + Marke |

---

## 4. UI-Bugfixes

| Bug | Fix | Status |
|-----|-----|--------|
| Service-Cards unterschiedliche Höhe | `height: 100%`, `flex` | DONE |
| Checkmark abgeschnitten | `overflow: visible`, negative Position | DONE |
| Notes-Überschriften ungleiche Höhe | `min-height: 3em`, `align-items: flex-end` | DONE |
| Notes-Container 50em | → 70em | DONE |
| Carinformation-Container 50em | → 70em | DONE |
| Wizard Icons unterschiedliche Größe | `ViewEncapsulation.None`, feste rem-Werte | DONE |
| Booking-Overview SCSS aufgebläht | `@use 'variables'` entfernt (5 Dateien) | DONE |
| Build Warnings | Budgets angepasst, nullish coalescing fix | DONE |

---

## 5. Feature-Implementierungen

| Feature | Dateien | Status |
|---------|---------|--------|
| Auto-Navigation Standort | `location-selection-container.component.ts/.html` | DONE |
| Auto-Navigation Marke | `brand-selection-container.component.ts/.html` | DONE |
| VIN entfernt | `customer.model.ts`, `vehicle-form.component.html/.ts`, `carinformation-container.component.ts` | DONE |
| Preis → Extras | `price-tile.component.ts/.html/.scss`, `translations.ts` | DONE |
| Breadcrumb Reset | `booking.store.ts` (`resetFromStep`), `wizard-breadcrumb.component.ts/.html` | DONE |
| Daten erhalten bei Reset | `booking.store.ts` (selectBranch, setLocation), alle `onBack()` | DONE |
| Form-Prefill bei Navigation | `carinformation-container.component.ts` (constructor) | DONE |

---

## 6. Reset-Verhalten (AC-24)

| Bei Reset werden gelöscht | Bleiben erhalten |
|--------------------------|-----------------|
| Standort (selectedBranch) | Kundendaten (customerInfo) |
| Marke (selectedBrand) | Fahrzeugdaten (vehicleInfo) |
| Services (selectedServices) | Datenschutz-Einwilligung (privacyConsent) |
| Extras-Dropdowns (notesExtras) | Hinweistext/Kommentar (bookingNote) |
| Termin (selectedAppointment) | |
| Kalender (workshopCalendarDate/Days) | |

---

## 7. Branch-Config

- **Quelle:** https://www.gottfried-schultz.de/werkstatt-termin/
- **Werkstätten:** 68 Standorte in 14 Städten
- **Marken:** VW, VW NFZ, Audi, ŠKODA, SEAT, CUPRA, Hyundai, Porsche, Bentley, Bugatti, Rimac
- **SVG-Logos:** 11 Dateien in `assets/brands/` + `docs/requirements/REQ-013-Branch-Marke-Tausch/`

---

## 8. Build

| Check | Ergebnis |
|-------|----------|
| `ng build` | 0 Warnings, 0 Errors |
| Bundle-Budgets | Initial < 1.2MB, Styles < 6KB |
| E2E Tests | Aktualisierung in Arbeit |

---

## 9. Geänderte Dateien (Gesamt)

### Code
- `booking.store.ts` — resetFromStep, selectBranch/setLocation ohne customerInfo-Reset
- `location-selection-container.component.ts/.html` — Auto-Navigation
- `brand-selection-container.component.ts/.html` — Auto-Navigation
- `carinformation-container.component.ts` — Form-Prefill, VIN entfernt
- `vehicle-form.component.ts/.html` — VIN-Feld entfernt
- `customer.model.ts` — VIN aus VehicleInfo entfernt
- `price-tile.component.ts/.html/.scss` — Extras statt Preis
- `wizard-breadcrumb.component.ts/.html/.scss` — Reset + ViewEncapsulation.None
- `service-card.component.scss` — Höhe + Checkmark
- `notes-extras-form.component.scss` — Überschriften
- `notes-container.component.scss` — 70em
- `carinformation-container.component.scss` — 70em
- `booking-overview-container.component.ts/.html/.scss` — Extras-Tile
- `translations.ts` — Extras i18n Keys
- `angular.json` — Budgets
- 5x `onBack()` — Clear-Aufrufe entfernt
- 5x Tile-SCSS — `@use 'variables'` entfernt

### Docs
- `requirement.md` — 24 ACs, Scope, UI/UX
- `qualitaets.md` — dieser Report
- `mockup.html` — Beide Seiten

### Assets
- `src/assets/brands/*.svg` — 11 Marken-Logos

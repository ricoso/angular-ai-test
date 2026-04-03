# Qualitäts-Report: REQ-013-Branch-Marke-Tausch

**Datum:** 2026-04-03
**Branch:** `req/REQ-013-Branch-Marke-Tausch`
**Status:** Draft — Requirement + Mockup erstellt, UI-Bugfixes durchgeführt

---

## 1. Requirement-Vollständigkeit

| Section | Status | Bemerkung |
|---------|--------|-----------|
| 1. Overview | OK | Purpose, Scope, Related Requirements |
| 2. User Story | OK | 21 Acceptance Criteria |
| 3. Preconditions | OK | System, User, Data |
| 4. Main Flow | OK | Neuer Wizard-Flow dokumentiert |
| 5. Alternative Flows | OK | URL-Parameter, Rücknavigation |
| 6. Exception Flows | OK | Ungültige Branch-ID, keine Marken |
| 7. Postconditions | OK | Store-Reihenfolge |
| 8. Business Rules | OK | 7 Regeln |
| 9. Non-Functional | OK | Performance, Security |
| 10. Data Model | OK | Branch-Config JSON (68 Werkstätten), BranchConfig Interface, Store-Änderungen |
| 11. UI/UX | OK | Auto-Navigation, Breadcrumb, SVG-Logos durchgängig, Zurück-Button-Logik |
| 12. API Specification | OK | Vorher/Nachher für alle Endpunkte |
| 13. Test Cases | OK | 13+ Test Cases mit Given/When/Then |
| 14. Implementation | OK | Store, Routes, Guards, Resolver, Components |
| 15. Dependencies | OK | REQ-002, REQ-003, REQ-004, REQ-007 |
| 16. Naming Glossary | OK | Englische Methodennamen |
| 17. i18n Keys | OK | DE + EN |
| 18. Approval | OK | |
| 19. Implementation Notes | OK | |

**Sections:** 19/17 (2 Bonus)
**Platzhalter:** 0
**Code-Sprache:** Englisch

---

## 2. Mockup

| Kriterium | Status | Detail |
|-----------|--------|--------|
| mockup.html vorhanden | OK | Beide Seiten (Standort + Marke) |
| Kein `<script>` Tag | OK | CSS-only Interaktivität |
| SVG-Markenlogos | OK | 11 Logos als Base64 Data-URIs eingebettet |
| Design-System | OK | CSS-Variablen aus `_variables.scss` |
| Responsive | OK | Mobile (<48em), Tablet (>=48em), Desktop (>=64em) |
| Accessibility | OK | `role`, `aria-*`, `focus-visible`, Skip-Link |
| Header/Footer | OK | Konsistent mit bestehenden Mockups |
| Wizard-Breadcrumb | OK | 7 Schritte, aktiv/erledigt/zukünftig |
| Auto-Navigation | OK | Kein "Weiter" bei Standort + Marke, Hinweis-Text statt Button |
| Branch-Info-Banner | OK | Standort-Name + Adresse auf Seite 2 |

---

## 3. UI-Bugfixes (im Rahmen von REQ-013 durchgeführt)

| Bug | Datei | Fix | Status |
|-----|-------|-----|--------|
| Service-Cards unterschiedliche Höhe | `service-card.component.scss` | `height: 100%`, `display: flex`, `flex: 1` auf Content | DONE |
| Checkmark-Icon abgeschnitten | `service-card.component.scss` | `overflow: visible`, Icon `top: -0.5em`, `border-radius: 50%` + weißer BG | DONE |
| Notes-Überschriften ungleiche Höhe | `notes-extras-form.component.scss` | `min-height: 3em`, `align-items: flex-end` | DONE |
| Notes-Container zu schmal (50em) | `notes-container.component.scss` | `max-width: 50em` → `70em` | DONE |
| Carinformation-Container zu schmal | `carinformation-container.component.scss` | `max-width: 50em` → `70em` | DONE |
| Alle Seiten einheitlich 70em | Alle Container-SCSS | Verifiziert: 8/8 Seiten auf `70em` | DONE |

---

## 4. Branch-Config (68 Werkstätten)

- **Quelle:** https://www.gottfried-schultz.de/werkstatt-termin/
- **Standorte:** Essen (9), Mülheim (8), Duisburg (1), Velbert (6), Düsseldorf (11), Mettmann (3), Erkrath (2), Neuss (5), Dormagen (3), Grevenbroich (1), Wuppertal (6), Solingen (4), Hagen (4), Leverkusen (5)
- **Marken:** VW, VW Nutzfahrzeuge, Audi, ŠKODA, SEAT, CUPRA, Hyundai, Porsche, Bentley, Bugatti, Rimac
- **SVG-Logos:** 11 Dateien von GS-Website heruntergeladen (ŠKODA als SVG mit eingebettetem PNG)

---

## 5. Acceptance Criteria Übersicht

| AC | Beschreibung | Typ |
|----|-------------|-----|
| AC-1 — AC-11 | Wizard-Flow Umstrukturierung (Standort → Marke) | Kern-Feature |
| AC-12 | Wizard-Breadcrumb auf allen Seiten | UI-Enhancement |
| AC-13 | SVG-Logos durchgängig | UI-Enhancement |
| AC-14 | Warenkorb: Alle Service-Optionen vollständig | Bugfix |
| AC-15 | Selection-Icon nicht abgeschnitten | Bugfix |
| AC-16 | Branch-Info-Banner | UI-Enhancement |
| AC-17 | Warenkorb: Marke als SVG-Logo | UI-Enhancement |
| AC-18 | Standortwahl: Auto-Navigation (kein Weiter) | UX-Improvement |
| AC-19 | Markenauswahl: Auto-Navigation (kein Weiter) | UX-Improvement |
| AC-20 | Serviceauswahl behält Weiter-Button | Klarstellung |
| AC-21 | Standort-Cards: Echte SVG-Logos | UI-Enhancement |

**Gesamt: 21 Acceptance Criteria**

---

## 6. Geänderte Dateien

### Requirement + Mockup (neu)
- `docs/requirements/REQ-013-Branch-Marke-Tausch/requirement.md`
- `docs/requirements/REQ-013-Branch-Marke-Tausch/mockup.html`
- `docs/requirements/REQ-013-Branch-Marke-Tausch/qualitaets.md`
- `docs/requirements/REQ-013-Branch-Marke-Tausch/*.svg` (11 Marken-Logos)

### UI-Bugfixes (bestehende Dateien)
- `src/app/features/booking/components/service-selection/service-card.component.scss`
- `src/app/features/booking/components/notes/notes-extras-form.component.scss`
- `src/app/features/booking/components/notes/notes-container.component.scss`
- `src/app/features/booking/components/carinformation/carinformation-container.component.scss`

### REQ-014 (aktualisiert)
- `docs/requirements/REQ-014-NestJS-Backend/requirement.md` — Section 22 (API-Test-Erkenntnisse) + .env ACs

---

## 7. Offene Punkte

- [ ] Implementierung steht noch aus (Requirement ist Draft)
- [ ] SoftNet API: Wuppertal + Essen Group-IDs müssen bei SoftNRG freigeschaltet werden
- [ ] `/check-all` Score noch nicht ermittelt (erst nach Implementierung)

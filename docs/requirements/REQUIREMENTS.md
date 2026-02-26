# Requirements Overview

**Project:** Gottfried Schultz Fahrzeugauswahl
**Version:** 1.0
**Last Updated:** 2026-02-10

---

## Status Legend

| Symbol | Status |
|--------|--------|
| 📝 | Draft |
| 🔍 | In Review |
| ✅ | Approved |
| 🚧 | In Progress |
| ✔️ | Implemented |
| ❌ | Rejected |

---

## Requirements List

| REQ-ID | Name | Status | Priority | Dependencies | Description |
|--------|------|--------|----------|--------------|-------------|
| REQ-001 | Header | ✔️ Implemented | High | - | Wiederverwendbarer Header mit Logo und Accessibility-Einstellungen (Font-Size, High-Contrast, Reduced-Motion) |
| REQ-002 | Markenauswahl | ✔️ Implemented | High | REQ-001 | Einstiegsseite Buchungswizard: Fahrzeugmarken-Auswahl (Audi, BMW, Mercedes-Benz, MINI, Volkswagen) |
| REQ-003 | Standortwahl | ✔️ Implemented | High | REQ-002 | Standortwahl basierend auf gewählter Fahrzeugmarke (Wizard-Schritt 2) |
| REQ-004 | Serviceauswahl | 🔍 In Review | High | REQ-003 | Serviceauswahl mit Multi-Select, Radio-Varianten und Zusammenfassungsleiste (Wizard-Schritt 3) |
| REQ-005 | Hinweisfenster | 📝 Draft | High | REQ-004 | Optionale Hinweiseingabe nach Serviceauswahl, servicespezifische Hinweistexte werden angezeigt (Wizard-Schritt 4) |
| REQ-006 | Terminauswahl | 🚧 In Progress | High | REQ-005 | Auswahl eines Termins aus 4 vorgeschlagenen Zeitfenstern (Werktage Mo–Sa, 07:00–18:00 Uhr) (Wizard-Schritt 5) |
| REQ-007 | WizardStateSync | 📝 Draft | High | REQ-002 | Rückwärtsnavigation synchronisiert BookingStore — Guards greifen korrekt bei Direktaufruf (Cross-Cutting alle Schritte 2–5) |
| REQ-008 | Werkstattkalender | 📝 Draft | High | REQ-006 | Erweiterter Kalender mit DatePicker zur Auswahl eines Wunschtermins + Uhrzeiten der nächsten 3 Werktage (Wizard-Schritt 5b) |
| REQ-009 | carinformation | 📝 Draft | High | REQ-006 | Formular für Kunden- und Fahrzeuginformationen: E-Mail, Anrede, Name, Adresse, Mobilnummer, Kennzeichen, Kilometerstand, FIN, DSGVO-Einwilligung (Wizard letzter Datenschritt) |

---

## Dependency Graph

```
REQ-001-Header
    │
    └──► REQ-002-Markenauswahl ◄── REQ-007-WizardStateSync (Cross-Cutting)
              │
              └──► REQ-003-Standortwahl
                        │
                        └──► REQ-004-Serviceauswahl
                                  │
                                  └──► REQ-005-Hinweisfenster
                                            │
                                            └──► REQ-006-Terminauswahl
                                                      │
                                                      ├──► REQ-008-Werkstattkalender (5b)
                                                      │
                                                      └──► REQ-009-carinformation
```

---

## Quick Links

| REQ-ID | Requirement Document |
|--------|---------------------|
| REQ-001 | [REQ-001-Header](./REQ-001-Header/requirement.md) |
| REQ-002 | [REQ-002-Markenauswahl](./REQ-002-Markenauswahl/requirement.md) |
| REQ-003 | [REQ-003-Standortwahl](./REQ-003-Standortwahl/requirement.md) |
| REQ-004 | [REQ-004-Serviceauswahl](./REQ-004-Serviceauswahl/requirement.md) |
| REQ-005 | [REQ-005-Hinweisfenster](./REQ-005-Hinweisfenster/requirement.md) |
| REQ-006 | [REQ-006-Terminauswahl](./REQ-006-Terminauswahl/requirement.md) |
| REQ-007 | [REQ-007-WizardStateSync](./REQ-007-WizardStateSync/requirement.md) |
| REQ-008 | [REQ-008-Werkstattkalender](./REQ-008-Werkstattkalender/requirement.md) |
| REQ-009 | [REQ-009-carinformation](./REQ-009-carinformation/requirement.md) |

---

## Statistics

| Status | Count |
|--------|-------|
| 📝 Draft | 4 |
| 🔍 In Review | 1 |
| ✅ Approved | 0 |
| 🚧 In Progress | 1 |
| ✔️ Implemented | 3 |
| **Total** | **9** |

---

## Notes

### Design System
- Alle Pages verwenden helles Theme aus `src/styles/_variables.scss`
- Background: #f8f9fa (hell, freundlich)
- NICHT die dunklen Farben aus Screenshots übernehmen!

### Accessibility (PFLICHT)
- Jede Page bekommt den Header aus REQ-001
- Header enthält Accessibility-Controls (Font-Size, Contrast, Motion)
- WCAG 2.1 AA Konformität

### Bilingual
- UI immer DE + EN (i18n)
- Code-Sprache = Requirement-Sprache (hier: Deutsch)

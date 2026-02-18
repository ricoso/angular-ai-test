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

---

## Dependency Graph

```
REQ-001-Header
    │
    └──► REQ-002-Markenauswahl
              │
              └──► REQ-003-Standortwahl
                        │
                        └──► REQ-004-Serviceauswahl
```

---

## Quick Links

| REQ-ID | Requirement Document |
|--------|---------------------|
| REQ-001 | [REQ-001-Header](./REQ-001-Header/requirement.md) |
| REQ-002 | [REQ-002-Markenauswahl](./REQ-002-Markenauswahl/requirement.md) |
| REQ-003 | [REQ-003-Standortwahl](./REQ-003-Standortwahl/requirement.md) |
| REQ-004 | [REQ-004-Serviceauswahl](./REQ-004-Serviceauswahl/requirement.md) |

---

## Statistics

| Status | Count |
|--------|-------|
| 📝 Draft | 0 |
| 🔍 In Review | 1 |
| ✅ Approved | 0 |
| 🚧 In Progress | 0 |
| ✔️ Implemented | 3 |
| **Total** | **4** |

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

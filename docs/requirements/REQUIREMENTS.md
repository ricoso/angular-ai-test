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
| REQ-001 | Header | 🔍 In Review | High | - | Wiederverwendbarer Header mit Logo und Accessibility-Einstellungen (Font-Size, High-Contrast, Reduced-Motion) |
| REQ-002 | Homescreen | 📝 Draft | High | REQ-001 | Startseite mit Fahrzeugmarken-Auswahl (Audi, BMW, Mercedes-Benz, MINI, Volkswagen) |
| REQ-0815 | Test Homescreen | 📝 Draft | High | REQ-001 | Test: Homescreen mit Fahrzeugmarken-Auswahl (Audi, BMW, Mercedes-Benz, MINI, Volkswagen) |

---

## Dependency Graph

```
REQ-001-Header
    │
    └──► REQ-002-Homescreen
              │
              └──► (Future: Marken-Pages)
```

---

## Quick Links

| REQ-ID | Requirement Document |
|--------|---------------------|
| REQ-001 | [REQ-001-Header](./REQ-001-Header/requirement.md) |
| REQ-002 | [REQ-002-Homescreen](./REQ-002-Homescreen/requirement.md) |
| REQ-0815 | [REQ-0815-test](./REQ-0815-test/requirement.md) |

---

## Statistics

| Status | Count |
|--------|-------|
| 📝 Draft | 3 |
| 🔍 In Review | 0 |
| ✅ Approved | 0 |
| 🚧 In Progress | 0 |
| ✔️ Implemented | 0 |
| **Total** | **3** |

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

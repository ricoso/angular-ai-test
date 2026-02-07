# Code Language Rules (ULTRA-COMPACT)

---

## Rules

1. **UI:** ALWAYS bilingual i18n (DE + EN keys)
2. **Code:** Language = Requirement language
3. **Naming:** From glossary (REQ-TEMPLATE Section 16)

---

## German Requirement → German Code

**Naming:**
- Methods: beimAbsenden(), ladeBenutzer(), erstelle(), loesche()
- Variables: benutzer[], istLaden, gefilterteBenutzer
- Types: Benutzer, BenutzerErstellenDTO
- Computed: gefilterteBenutzer, istLaden, hatBenutzer

**Glossary:**
- onSubmit → beimAbsenden
- onCreate → beimErstellen
- onDelete → beimLoeschen
- getAll → holeAlle
- create → erstelle
- update → aktualisiere
- delete → loesche
- loadUsers → ladeBenutzer
- addUser → fuegeBenutzerHinzu
- filteredUsers → gefilterteBenutzer
- isLoading → istLaden
- hasUsers → hatBenutzer

---

## English Requirement → English Code

**Use standard glossary names from REQ-TEMPLATE Section 16**

---

## UI i18n (ALWAYS bilingual!)

```typescript
translations = {
  de: { 'key': 'Deutscher Text' },
  en: { 'key': 'English Text' }
}
```

Template: `{{ 'key' | translate }}`

---

## Checklist

**German Requirement:**
- [ ] Methods: beimAbsenden, ladeBenutzer
- [ ] Variables: benutzer, istLaden
- [ ] i18n: DE + EN keys

**English Requirement:**
- [ ] Methods: onSubmit, loadUsers
- [ ] Variables: users, isLoading
- [ ] i18n: EN + DE keys

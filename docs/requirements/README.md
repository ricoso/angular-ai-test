# Requirements Documentation

---

## Struktur

```
docs/requirements/
├── REQUIREMENTS.md          # Central list
├── REQ-TEMPLATE.md          # Requirement Template
├── QUALITAETS-TEMPLATE.md   # Quality Report Template
└── REQ-XXX-FeatureName/     # One folder per requirement
    ├── requirement.md       # Main doc (German OR English)
    ├── mockup.png           # Optional mockup
    └── qualitaets.md        # Quality Report (nach /check-all)
```

**Regel:** Requirements in EINER Sprache (Projekt-Wahl: DE oder EN)

---

## Workflow

### 1. Create Requirement

```bash
./scripts/create-requirement.sh "UserNotifications" 42
```

Creates: `REQ-042-UserNotifications/requirement.md`

### 2. Fill Out (chosen language)

Edit `requirement.md`:
- Overview, User Story, Preconditions
- Main Flow, Alternative Flows, Exception Flows
- Postconditions, Business Rules, NFRs
- Data Model, UI/UX, API Spec, Test Cases

### 3. Add Mockups (optional)

```bash
cp mockup.png REQ-042-UserNotifications/
```

Reference in requirement.md:
```markdown
## 11. UI/UX
![Mockup](./mockup.png)
```

### 4. Register

Add to `REQUIREMENTS.md`:
```markdown
| FR_042_UserNotifications | ... | 📝 Draft | Medium | ... | Team X |
```

---

## CODE Rules

**UI:** IMMER bilingual (i18n DE + EN)  
**Code:** Sprache = Requirement-Sprache  
**Naming:** From glossary (REQ-TEMPLATE Section 16)

### German Requirement → German Code

```typescript
// Methods
async beimAbsenden() { }
ladeBenutzer() { }

// Variables
benutzer: Benutzer[]
istLaden: boolean

// UI (still bilingual!)
de: { 'user.save': 'Speichern' }
en: { 'user.save': 'Save' }
```

### English Requirement → English Code

```typescript
// Methods
async onSubmit() { }
loadUsers() { }

// Variables
users: User[]
isLoading: boolean

// UI (still bilingual!)
de: { 'user.save': 'Speichern' }
en: { 'user.save': 'Save' }
```

---

## Naming Convention

**Requirement ID:**
```
REQ-{Number}-{FeatureName}
```

**Feature ID (in REQUIREMENTS.md):**
```
FR_{Number}_{FeatureName}
```

**Examples:**
- `REQ-001-UserLogin`
- `FR_001_UserLogin`

---

## Status Types

- 📝 Draft
- 🔍 In Review
- ✅ Approved
- 🚧 In Progress
- ✔️ Implemented
- ❌ Rejected

---

## Checklist

### Before Implementation
- [ ] Folder created: `REQ-XXX-FeatureName/`
- [ ] requirement.md filled out
- [ ] Mockups added (if any)
- [ ] Registered in REQUIREMENTS.md
- [ ] Status set
- [ ] Owner assigned

### After Implementation
- [ ] Code language matches requirement language
- [ ] UI i18n keys defined (both languages)
- [ ] `/check-all` executed
- [ ] qualitaets.md generated (Score >= 90)
- [ ] All ❌ Issues resolved
- [ ] PR created

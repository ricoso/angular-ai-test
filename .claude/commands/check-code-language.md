# Check Code Language Command

Prüft ob Code-Sprache mit Requirement-Sprache übereinstimmt.

## Usage

```
<feature-name>
```

Beispiel: `user-notifications`

## Checks

### 1. Requirement Sprache erkennen
- Lese `docs/requirements/REQ-XXX/requirement.md`
- Prüfe ob Deutsch oder Englisch

### 2. Code Sprache prüfen

**Deutsche Requirement → Deutscher Code:**
```typescript
// ✅ GOOD
benutzer: Benutzer[];
istLaden: boolean;
ladeBenutzer(): void;
beimAbsenden(): void;

// ❌ BAD - English in German requirement
users: User[];
isLoading: boolean;
loadUsers(): void;
```

**Englische Requirement → Englischer Code:**
```typescript
// ✅ GOOD
users: User[];
isLoading: boolean;
loadUsers(): void;
onSubmit(): void;

// ❌ BAD - German in English requirement
benutzer: Benutzer[];
ladeBenutzer(): void;
```

### 3. Naming Glossary Check
Prüft gegen REQ-TEMPLATE Section 16:

| English | German |
|---------|--------|
| onSubmit | beimAbsenden |
| loadUsers | ladeBenutzer |
| isLoading | istLaden |
| filteredUsers | gefilterteBenutzer |
| getAll | holeAlle |
| create | erstelle |
| update | aktualisiere |
| delete | loesche |

### 4. UI immer bilingual (i18n)
```typescript
// ✅ GOOD - Beide Sprachen
translations = {
  de: { 'user.title': 'Benutzer' },
  en: { 'user.title': 'Users' }
}
```

## Output

```
🌍 Checking code language for: user-notifications

📋 Requirement Language: Deutsch (DE)

⚠️ Code Language Mismatch
   ❌ notification.store.ts:12
      loadNotifications → ladeNotifications

   ❌ notification.store.ts:15
      isLoading → istLaden

   ❌ notification-api.service.ts:8
      getAll → holeAlle

✅ UI i18n
   ✅ Both DE + EN translations present

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Score: 70/100
❌ 3 naming issues found

📖 See: .claude/skills/code-language.md
```

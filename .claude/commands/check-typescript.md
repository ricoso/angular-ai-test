# Check TypeScript Command

Prüft TypeScript Best Practices und Strict Mode.

## Usage

```
<feature-name>
```

Beispiel: `user-notifications`

## Checks

### 1. Keine `any` Types
```typescript
// ✅ GOOD
users: User[] = [];
data: unknown;

// ❌ BAD
users: any[] = [];
data: any;
```

### 2. Interfaces für Models
```typescript
// ✅ GOOD - Interface
export interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ BAD - Inline type
const user: { id: string; name: string } = ...
```

### 3. DTOs für API Requests/Responses
```typescript
// ✅ GOOD
export interface UserCreateDTO {
  name: string;
  email: string;
}

export interface UserResponseDTO {
  id: string;
  name: string;
  createdAt: string;
}
```

### 4. Strict Null Checks
```typescript
// ✅ GOOD - Explicit null handling
user: User | null = null;
if (user) { console.log(user.name); }

// ❌ BAD - Undefined access
console.log(user.name); // might be null
```

### 5. Readonly für Immutable Data
```typescript
// ✅ GOOD
readonly users = signal<readonly User[]>([]);

// ❌ BAD - Mutable
users = signal<User[]>([]);
```

### 6. Explicit Return Types
```typescript
// ✅ GOOD
async getUsers(): Promise<User[]> { }

// ❌ BAD - Implicit return type
async getUsers() { }
```

### 7. No Magic Numbers/Strings
```typescript
// ✅ GOOD
const MAX_ITEMS = 100;
const STATUS_ACTIVE = 'active';

// ❌ BAD
if (items.length > 100) { }
if (status === 'active') { }
```

### 8. Keine ungenutzten Methoden / Properties (Dead Code)
```typescript
// ❌ BAD — Methode existiert, wird aber nirgends aufgerufen
export class UserFormComponent {
  protected isInvalid(): boolean { ... }  // Nicht im Template, nicht in Tests → LÖSCHEN!
  protected hasError(): boolean { ... }   // Durch computed ersetzt → LÖSCHEN!
}

// ✅ GOOD — Nur Methoden die tatsächlich genutzt werden
export class UserFormComponent {
  protected readonly errors = computed(() => { ... }); // Im Template genutzt
}
```

**Prüfung:**
- Für jede `protected`/`public` Methode in Components: Wird sie im `.html` Template aufgerufen?
- Für jede `private` Methode: Wird sie intern in der Klasse aufgerufen?
- Für jede exportierte Funktion/Klasse: Wird sie in anderen Dateien importiert?
- **Nicht genutzt = LÖSCHEN!** Kein auskommentieren, kein `// deprecated`

## Output

```
📘 Checking TypeScript for: user-notifications

⚠️ Any Types
   ❌ notification.service.ts:23
      data: any → define proper type

✅ Interfaces
   ✅ All models have interfaces

✅ DTOs
   ✅ API types defined

⚠️ Null Checks
   ❌ notification-container.component.ts:15
      Possible null access: user.name

✅ Return Types
   ✅ All methods have explicit return types

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Score: 85/100
❌ 2 issues found
```

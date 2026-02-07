# SKILL: Angular Architecture

**WICHTIG VORHER LESEN:**
- `.claude/skills/code-language.md` → Code-Sprache = Requirement-Sprache!
- UI IMMER bilingual (i18n für DE + EN)
- Naming aus Glossar (REQ-TEMPLATE Section 16) in Requirement-Sprache

## Wann nutzen
JEDER Component/Service Erstellung

## Core Principle: Container/Presentational Pattern

**Jede Route = 1 Container Component + Child Presentational Components**

```
Route /users
  └── UserContainerComponent (Smart)
       ├── UserListComponent (Presentational)
       ├── UserFilterComponent (Presentational)
       └── UserCardComponent (Presentational)
```

## Folder Structure
```
src/app/
├── core/
│   ├── services/
│   │   ├── api/           # API Services (HTTP calls)
│   │   │   ├── user-api.service.ts
│   │   │   └── auth-api.service.ts
│   │   └── business/      # Business Logic Services
│   │       ├── user-business.service.ts
│   │       └── validation.service.ts
│   ├── guards/
│   ├── interceptors/
│   └── stores/            # Global Signal Stores
├── shared/
│   └── components/        # Reusable Presentational Components
│       ├── button/
│       ├── modal/
│       └── table/
├── features/
│   └── user/
│       ├── containers/    # Container Components (Smart)
│       │   └── user-container/
│       │       ├── user-container.component.ts
│       │       ├── user-container.component.html
│       │       ├── user-container.component.scss
│       │       └── user-container.component.spec.ts
│       ├── components/    # Feature Presentational Components
│       │   ├── user-list/
│       │   ├── user-card/
│       │   └── user-filter/
│       ├── services/
│       │   ├── user-api.service.ts       # API Calls
│       │   └── user-business.service.ts  # Business Logic
│       ├── stores/
│       │   └── user.store.ts
│       ├── models/
│       │   ├── user.model.ts
│       │   └── user-dto.model.ts
│       └── user.routes.ts
└── layouts/
```

## 1. Container Component (Smart - Route Level)

**Responsibility:**
- Owns route (one container per route)
- Manages Signal Store
- Orchestrates Child Components
- Handles Business Logic via Services
- NO direct API calls (use Services!)
- NO UI logic (use Presentational Components!)

```typescript
// features/user/containers/user-container/user-container.component.ts
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../stores/user.store';
import { UserBusinessService } from '../../services/user-business.service';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { UserFilterComponent } from '../../components/user-filter/user-filter.component';

@Component({
  selector: 'app-user-container',
  standalone: true,
  imports: [
    CommonModule,
    UserListComponent,
    UserFilterComponent
  ],
  templateUrl: './user-container.component.html',
  styleUrl: './user-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent implements OnInit {
  // Inject Store & Business Logic Service
  private userStore = inject(UserStore);
  private userBusiness = inject(UserBusinessService);
  
  // Expose store signals to template
  users = this.userStore.filteredUsers;
  loading = this.userStore.loading;
  error = this.userStore.error;
  
  ngOnInit() {
    // Load data on init
    this.userStore.loadUsers();
  }
  
  // Business Logic delegated to Service
  async onCreateUser(userData: CreateUserData) {
    const validated = await this.userBusiness.validateAndCreate(userData);
    this.userStore.addUser(validated);
  }
  
  async onDeleteUser(id: string) {
    const confirmed = await this.userBusiness.confirmDelete(id);
    if (confirmed) {
      this.userStore.deleteUser(id);
    }
  }
  
  onFilterChange(filter: UserFilter) {
    this.userStore.setFilter(filter);
  }
}
```

```html
<!-- user-container.component.html -->
<div class="user-container">
  <h1>Users</h1>
  
  <!-- Presentational Child: Filter -->
  <app-user-filter 
    (filterChange)="onFilterChange($event)" />
  
  <!-- Presentational Child: List -->
  @if (loading()) {
    <div class="loading">Loading...</div>
  } @else if (error()) {
    <div class="error">{{ error() }}</div>
  } @else {
    <app-user-list 
      [users]="users()"
      (delete)="onDeleteUser($event)"
      (edit)="onEditUser($event)" />
  }
</div>
```

## 2. Presentational Components (Dumb - Child Level)

**Responsibility:**
- Pure UI rendering
- Input/Output only
- NO Services
- NO Business Logic
- NO Store access

```typescript
// features/user/components/user-list/user-list.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserCardComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  // Inputs
  users = input.required<User[]>();
  
  // Outputs
  delete = output<string>();
  edit = output<string>();
}
```

## 3. API Service Layer

**Responsibility:**
- HTTP Calls ONLY
- DTOs transformation
- Error handling
- NO Business Logic

```typescript
// features/user/services/user-api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users';
  
  async getAll(): Promise<User[]> {
    return firstValueFrom(
      this.http.get<UserDTO[]>(this.apiUrl).pipe(
        map(dtos => dtos.map(UserMapper.fromDTO))
      )
    );
  }
  
  async create(data: CreateUserDTO): Promise<User> {
    return firstValueFrom(
      this.http.post<UserDTO>(this.apiUrl, data).pipe(
        map(UserMapper.fromDTO)
      )
    );
  }
  
  async delete(id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${this.apiUrl}/${id}`)
    );
  }
}
```

## 4. Business Logic Service Layer

**Responsibility:**
- Business Rules
- Validation
- Complex Logic
- Uses API Services

```typescript
// features/user/services/user-business.service.ts
import { Injectable, inject } from '@angular/core';
import { UserApiService } from './user-api.service';

@Injectable({ providedIn: 'root' })
export class UserBusinessService {
  private userApi = inject(UserApiService);
  
  async validateAndCreate(data: CreateUserData): Promise<User> {
    // Business Rule: Email must be unique
    const existingUsers = await this.userApi.getAll();
    if (existingUsers.some(u => u.email === data.email)) {
      throw new Error('Email already exists');
    }
    
    if (data.age < 18) {
      throw new Error('User must be at least 18 years old');
    }
    
    return this.userApi.create(data);
  }
  
  async confirmDelete(id: string): Promise<boolean> {
    const user = await this.userApi.getById(id);
    return confirm(`Delete user ${user.name}?`);
  }
}
```

## 5. Signal Store

**Uses API Service for data, NO direct HTTP!**

```typescript
// features/user/stores/user.store.ts
import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { UserApiService } from '../services/user-api.service';

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState({ users: [], filter: {}, loading: false, error: null }),
  withComputed(({ users, filter }) => ({
    filteredUsers: computed(() => /* filter logic */)
  })),
  withMethods((store, userApi = inject(UserApiService)) => ({
    async loadUsers() {
      patchState(store, { loading: true });
      try {
        const users = await userApi.getAll();
        patchState(store, { users, loading: false });
      } catch (error) {
        patchState(store, { error: error.message, loading: false });
      }
    }
  }))
);
```

## File Structure (IMMER separate HTML + SCSS)

```
user-container/
├── user-container.component.ts
├── user-container.component.html     # ✅ Separate
├── user-container.component.scss     # ✅ Separate
└── user-container.component.spec.ts  # ✅ Jest test
```

## Change Detection: OnPush Everywhere

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ IMMER!
})
```

## Architecture Flow

```
Route
  ↓
Container Component (Smart)
  ├─→ Signal Store ←→ API Service
  ├─→ Business Service
  └─→ Child Components (Presentational)
       ├─→ Component A
       ├─→ Component B
       └─→ Component C
```

## Best Practices

### ✅ DO
- One Container per Route
- Business Logic in Business Services
- API Calls in API Services
- OnPush for ALL components
- Separate HTML + SCSS always
- Signal Store for state
- Jest for unit tests

### ❌ DON'T
- Multiple Containers per Route
- Business Logic in Components
- Business Logic in API Services
- Direct HTTP in Containers
- Direct HTTP in Stores
- BehaviorSubject for state

## Summary

**Container (Smart):**
- One per route
- Orchestrates children
- Uses Store + Services
- OnPush ✅

**Presentational (Dumb):**
- Input/Output only
- Pure UI
- No Services/Store
- OnPush ✅

**API Service:**
- HTTP calls only
- DTO mapping

**Business Service:**
- Business rules
- Uses API Service

**Signal Store:**
- State only
- Uses Services
- No direct HTTP

---

## Template Performance Best Practices

### ❌ NIEMALS Methoden-Aufrufe beim Rendern

**FALSCH:**
```typescript
// Component
export class UserListComponent {
  users = signal<User[]>([]);
  
  // ❌ BAD - wird bei jedem Change Detection Cycle aufgerufen!
  getActiveUsers() {
    return this.users().filter(u => u.active);
  }
  
  calculateTotal() {
    return this.users().reduce((sum, u) => sum + u.value, 0);
  }
}
```

```html
<!-- ❌ BAD - Methoden werden ständig aufgerufen! -->
<div>Active: {{ getActiveUsers().length }}</div>
<div>Total: {{ calculateTotal() }}</div>
```

**RICHTIG - Computed Signals oder Pipes:**
```typescript
// Component
export class UserListComponent {
  users = signal<User[]>([]);
  
  // ✅ GOOD - computed wird nur neu berechnet wenn users sich ändert
  activeUsers = computed(() => 
    this.users().filter(u => u.active)
  );
  
  total = computed(() => 
    this.users().reduce((sum, u) => sum + u.value, 0)
  );
}
```

```html
<!-- ✅ GOOD - Signals, keine Methoden-Aufrufe -->
<div>Active: {{ activeUsers().length }}</div>
<div>Total: {{ total() }}</div>
```

### Event Handler sind OK

```html
<!-- ✅ GOOD - Event Handler sind erlaubt -->
<button (click)="onDelete(user.id)">Delete</button>
<input (change)="onFilterChange($event)">
<form (submit)="onSubmit()">Submit</form>
```

### Template Regeln

**✅ ERLAUBT im Template:**
- Signals: `{{ userName() }}`
- Properties: `{{ user.name }}`
- Pipes: `{{ date | date:'short' }}`
- Event Handler: `(click)="onSave()"`
- Computed Signals: `{{ filteredUsers() }}`

**❌ VERBOTEN im Template:**
- Methoden-Aufrufe: `{{ getUsers() }}`
- Berechnungen: `{{ price * quantity }}`
- Filter/Map/Reduce: `{{ users.filter(...) }}`

**Warum?**
- Performance: Methoden werden bei jedem Change Detection Cycle aufgerufen
- OnPush wird umgangen
- Schwer zu debuggen

---

## Reactive Forms Pattern

### Form Setup (Container Component)

```typescript
// user-edit-container.component.ts
import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserBusinessService } from '../../services/user-business.service';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-user-edit-container',
  standalone: true,
  imports: [UserFormComponent],
  templateUrl: './user-edit-container.component.html',
  styleUrl: './user-edit-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditContainerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userBusiness = inject(UserBusinessService);
  
  // Form as Signal
  form = signal<FormGroup>(this.createForm());
  
  // Form state
  loading = signal(false);
  error = signal<string | null>(null);
  
  ngOnInit() {
    // Subscribe to form changes
    this.form().valueChanges.subscribe(values => {
      console.log('Form changed:', values);
      // Auto-save, validation, etc.
    });
    
    // Subscribe to specific field
    this.form().get('email')?.valueChanges.subscribe(email => {
      console.log('Email changed:', email);
    });
  }
  
  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],

---

## Template Performance

**NIEMALS Methoden-Aufrufe beim Rendern!**

```typescript
// ❌ BAD
getActiveUsers() {
  return this.users().filter(u => u.active);
}

// ✅ GOOD  
activeUsers = computed(() => this.users().filter(u => u.active));
```

**Details:** Siehe `performance.md` Skill

---

## Reactive Forms

**Pattern:** Form in Container, Display in Presentational

**Details:** Siehe `forms.md` Skill

---

## Best Practices Summary

### ✅ DO
- Container per Route
- Presentational Children (Input/Output)
- API Services (HTTP only)
- Business Services (Logic)
- Signal Store (State)
- OnPush everywhere
- trackBy bei @for
- Computed statt Methoden
- Separate HTML + SCSS
- Jest Tests (>80%)

### ❌ DON'T
- Store in Presentational
- Business Logic in Components
- HTTP in Stores
- Methoden im Template
- BehaviorSubject für State
- Inline Templates

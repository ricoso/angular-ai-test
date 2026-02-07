# Code Language & UI Bilingual Skill

**Regel:** UI bilingual, Code folgt Requirement-Sprache

---

## 1. Grundregel

**UI:** IMMER Bilingual (DE + EN i18n)  
**Code:** Sprache = Requirement-Sprache  
**Naming:** Aus Glossar (REQ-TEMPLATE Section 16)

---

## 2. Naming nach Requirement

### Deutsches Requirement → Deutsche Namen

```typescript
// Container Methods
async beimAbsenden() { }           // onSubmit
async beimLoeschen(id: string) { } // onDelete

// API Service
async holeAlle(): Promise<Benutzer[]> { }     // getAll
async erstelle(daten: DTO): Promise<Benutzer> { }  // create

// Store Methods
ladeBenutzer() { }                 // loadUsers
fuegeHinzu(benutzer: Benutzer) { } // addUser

// Computed Signals
gefilterteBenutzer = computed(...)  // filteredUsers
istLaden = computed(...)            // isLoading
```

### Englisches Requirement → Englische Namen

```typescript
// Use standard glossary names from REQ-TEMPLATE Section 16
async onSubmit() { }
async getAll(): Promise<User[]> { }
loadUsers() { }
filteredUsers = computed(...)
```

---

## 3. UI IMMER Bilingual (i18n)

```typescript
// translations.ts - BEIDE Sprachen IMMER!
export const translations = {
  de: {
    'user.form.name': 'Name',
    'user.buttons.save': 'Speichern',
    'user.errors.notFound': 'Nicht gefunden'
  },
  en: {
    'user.form.name': 'Name',
    'user.buttons.save': 'Save',
    'user.errors.notFound': 'Not found'
  }
};
```

**Template:**
```html
<label>{{ 'user.form.name' | translate }}</label>
<button>{{ 'user.buttons.save' | translate }}</button>
```

---

## 4. Beispiel: Deutsches Requirement

```typescript
/**
 * Container Component für Benutzerverwaltung
 */
@Component({
  selector: 'app-benutzer-container',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BenutzerContainerComponent {
  
  private benutzerStore = inject(BenutzerStore);
  
  // Lädt Benutzer beim Start
  ngOnInit() {
    this.benutzerStore.ladeBenutzer();
  }
  
  // Behandelt Absenden
  async beimAbsenden() {
    await this.benutzerStore.erstelle(this.formular().value);
  }
}

// API Service
@Injectable({ providedIn: 'root' })
export class BenutzerApiService {
  
  async holeAlle(): Promise<Benutzer[]> {
    return firstValueFrom(this.http.get<Benutzer[]>(this.apiUrl));
  }
  
  async erstelle(daten: BenutzerErstellenDTO): Promise<Benutzer> {
    return firstValueFrom(this.http.post<Benutzer>(this.apiUrl, daten));
  }
}

// Store
export const BenutzerStore = signalStore(
  withState({ benutzer: [], istLaden: false }),
  
  withComputed(({ benutzer }) => ({
    gefilterteBenutzer: computed(() => benutzer().filter(...)),
    benutzerAnzahl: computed(() => benutzer().length)
  })),
  
  withMethods((store, api = inject(BenutzerApiService)) => ({
    async ladeBenutzer() {
      const benutzer = await api.holeAlle();
      patchState(store, { benutzer });
    }
  }))
);

// Models
interface Benutzer {
  id: string;
  name: string;
}

interface BenutzerErstellenDTO {
  name: string;
}
```

---

## 5. Checkliste

**Bei Deutschem Requirement:**
- [ ] Methoden: beimAbsenden, ladeBenutzer, erstelle
- [ ] Variablen: benutzer, istLaden, gefilterteBenutzer
- [ ] Types: Benutzer, BenutzerErstellenDTO
- [ ] Kommentare auf Deutsch
- [ ] i18n: DE + EN Keys!

**Bei Englischem Requirement:**
- [ ] Methods: onSubmit, loadUsers, create
- [ ] Variables: users, isLoading, filteredUsers
- [ ] Types: User, CreateUserDTO
- [ ] Comments in English
- [ ] i18n: EN + DE Keys!

**IMMER:**
- [ ] UI Messages über i18n (beide Sprachen)
- [ ] Glossar-Namen verwenden
- [ ] Konsistente Sprache im Feature

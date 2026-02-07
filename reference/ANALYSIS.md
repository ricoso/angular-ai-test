# Skill Analysis: Was braucht Claude wirklich?

## Test: Code generieren OHNE Beispiele

### Vorher (mit Beispielen):
```typescript
/**
 * Container Component
 */
@Component({
  selector: 'app-user-container',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent {
  private store = inject(UserStore);
  ngOnInit() { this.store.loadUsers(); }
}
```

### Nachher (nur Anweisung):
```
Container Component:
- @Component decorator
- OnPush change detection
- inject Store
- ngOnInit: call store.load()
```

**Frage:** Reicht die Anweisung oder braucht Claude Beispiele?

## Test mit MCP vs. pure MD

**Mit MCP Server:**
- Claude kann MCP tool aufrufen
- Bekommt Pattern zurück
- Token-Cost pro Call

**Ohne MCP (nur MD):**
- Claude liest MD direkt
- Kennt Pattern sofort
- Kein extra Tool Call

**Frage:** Ist MCP schneller/besser oder reicht MD?

## Essentials vs. Nice-to-have

### ESSENTIALS (IMMER lesen):
1. angular-architecture.md - Pattern rules
2. code-language.md - Naming rules
3. performance.md - OnPush, trackBy

### OPTIONAL (nur wenn relevant):
4. forms.md - Bei Forms
5. eslint.md - Bei Fehlern
6. i18n-typings.md - Bei i18n
7. routing-patterns.md - Bei Routes
8. typescript-config.md - Selten

**Frage:** Können 1-3 ultra-kompakt sein (nur Rules, keine Beispiele)?

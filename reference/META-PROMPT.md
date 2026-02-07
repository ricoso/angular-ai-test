# Meta-Prompt: Project Best Practices Template

Abstract template to replicate this project structure for ANY tech stack (Spring, Python, React, etc.)

---

## Core Principles

1. **Architecture:** Layered separation (Presentation → Business → Data)
2. **Code Language:** Follows requirement language (DE req → DE code, EN req → EN code)
3. **UI i18n:** ALWAYS bilingual (DE + EN keys)
4. **Naming:** From glossary in requirement language
5. **Testing:** >80% coverage, layer-specific tests
6. **Performance:** Defined per tech stack
7. **Quality:** Linter + pre-commit checks
8. **Automation:** Scripts for common tasks
9. **Documentation:** Skills + Commands + Workflow

---

## Directory Structure

```
project/
├── .claude/
│   ├── mcp-config.json
│   ├── skills/              # Architecture, code-language, testing, performance
│   └── commands/            # create-feature, create-component, etc.
├── docs/
│   └── requirements/
│       ├── REQUIREMENTS.md  # Central list (ID_NB_FeatureName)
│       ├── REQ-TEMPLATE.md
│       └── REQ-XXX-Name/
│           ├── requirement.md  # ONE language (project choice)
│           └── mockup.png      # Optional
├── scripts/                 # Shell scripts (generators)
├── src/                     # Source code
├── README.md
├── COMMANDS.md              # CLI reference
└── claude.md                # Workflow guide
```

---

## Adaptation Guide

### 1. Choose Requirement Language
- [ ] German for DE teams
- [ ] English for international

### 2. Define Architecture Pattern

**Angular:**
```
Containers → Presentational → Services (API + Business) → Store
```

**Spring Boot:**
```
Controllers → Services → Repositories → Entities
```

**Python/Django:**
```
Views → Services → Repositories → Models
```

**React:**
```
Pages → Containers → Components → API Services
```

### 3. Create Naming Glossary

**Common Operations (adapt to domain):**

| Operation | German | English |
|-----------|--------|---------|
| Create | erstelle | create |
| Read | hole/lade | get/load |
| Update | aktualisiere | update |
| Delete | loesche | delete |
| Validate | validiere | validate |

**Apply to:**
- Method names
- Variable names
- Class/Interface names
- File names (follow tech convention)

### 4. Define Layer Responsibilities

**Presentation:**
- UI rendering only
- NO business logic
- Calls Business layer

**Business:**
- Validation
- Business rules
- Orchestration
- Calls Data layer

**Data:**
- API/DB access only
- NO business logic
- Returns data

### 5. Setup i18n (ALWAYS Bilingual)

```typescript
// Even if code is German!
translations = {
  de: { 'key': 'Text' },
  en: { 'key': 'Text' }
}
```

### 6. Define Testing Strategy

**Coverage:**
- Statements: >80%
- Branches: >75%
- Functions: >75%

**Test Types:**
- Unit (fast, mocked)
- Integration (medium, partial mocks)
- E2E (slow, real system)

### 7. Create Skills (.claude/skills/)

**Required Skills:**
1. **architecture.md** - Pattern, layers, responsibilities
2. **code-language.md** - Language rules, naming glossary
3. **testing.md** - Test patterns, coverage
4. **performance.md** - Optimization techniques
5. **linting.md** - Code style, quality rules

**Optional Skills (per tech):**
- forms.md (frontend)
- database.md (backend)
- security.md
- deployment.md

### 8. Create Commands (.claude/commands/)

**Minimum Set:**
```json
{
  "name": "create-feature",
  "command": "./scripts/create-feature.sh ${name}"
}
```

**Common:**
- create-feature
- create-component
- create-requirement
- run-tests
- quality-check

### 9. Create Scripts (scripts/)

**Generators:**
```bash
./scripts/create-feature.sh <name>
./scripts/create-component.sh <name>
./scripts/create-requirement.sh "<name>" <num>
```

### 10. Setup Workflow (claude.md)

```markdown
1. Read requirement (docs/requirements/REQ-XXX/)
2. Check requirement language
3. Read skills (architecture, code-language, ...)
4. Generate structure (scripts)
5. Implement (follow naming glossary)
6. Add i18n keys (both languages)
7. Test (>80% coverage)
8. Update requirement
```

---

## Tech Stack Examples

### Spring Boot

**Architecture:**
```java
// German Requirement
@RestController
public class BenutzerController {
    @PostMapping("/benutzer")
    public Benutzer erstelleBenutzer(@RequestBody BenutzerErstellenDTO daten) {
        return benutzerService.erstelle(daten);
    }
}

@Service
public class BenutzerService {
    public Benutzer erstelle(BenutzerErstellenDTO daten) {
        // Validation
        return benutzerRepository.save(new Benutzer(daten));
    }
}
```

**Skills:**
- spring-architecture.md
- jpa-patterns.md
- rest-api.md

### Python/Django

**Architecture:**
```python
# English Requirement
class UserView(APIView):
    def post(self, request):
        return user_service.create_user(request.data)

class UserService:
    def create_user(self, data: UserCreateDTO) -> User:
        # Validation
        return user_repository.save(User(**data))
```

**Skills:**
- django-architecture.md
- orm-patterns.md
- drf-api.md

### React

**Architecture:**
```typescript
// English Requirement
function UserPage() {
  return (
    <UserContainer>
      <UserList users={users} onSelect={handleSelect} />
      <UserForm onSubmit={handleSubmit} />
    </UserContainer>
  );
}
```

**Skills:**
- react-architecture.md
- hooks-patterns.md
- state-management.md

---

## Checklist

**Project Setup:**
- [ ] Directory structure created
- [ ] Requirement language chosen
- [ ] Architecture pattern defined
- [ ] Naming glossary created
- [ ] i18n strategy set (always bilingual)

**Skills:**
- [ ] architecture.md
- [ ] code-language.md
- [ ] testing.md
- [ ] performance.md
- [ ] linting.md

**Automation:**
- [ ] Scripts created
- [ ] Commands defined
- [ ] MCP servers configured

**Documentation:**
- [ ] README.md
- [ ] COMMANDS.md
- [ ] claude.md
- [ ] REQ-TEMPLATE.md

**Workflow:**
- [ ] Tested end-to-end
- [ ] Team trained
- [ ] CI/CD configured

---

## Result

Consistent, maintainable codebase with:
- Clear architecture
- Language consistency
- Bilingual UI
- High test coverage
- Quality automation
- Complete documentation

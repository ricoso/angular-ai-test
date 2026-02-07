# REQ-XXX: [Requirement Name]

**Status:** Draft | In Review | Approved | Implemented  
**Priority:** Critical | High | Medium | Low  
**Type:** Functional | Non-Functional  
**Created:** YYYY-MM-DD  
**Author:** [Name]

---

## 1. Overview

### 1.1 Purpose
[Brief description of what this requirement addresses]

### 1.2 Scope
[What is included and excluded]

### 1.3 Related Requirements
- REQ-XXX: [Related]

---

## 2. User Story

**As a** [user type]  
**I want** [goal]  
**So that** [benefit]

**Acceptance Criteria:**
- [ ] AC-1: System shall...
- [ ] AC-2: User can...

---

## 3. Preconditions

### 3.1 System
- System is running
- Database available

### 3.2 User
- User authenticated
- User has permission

### 3.3 Data
- Required data exists

---

## 4. Main Flow

**Step 1:** [Action]
- **User:** [Does what]
- **System:** [Responds how]
- **Expected:** [Result]

**Step 2:** [Next action]
- **User:** [Does what]
- **System:** [Responds how]

**Step 3:** [Final action]
- **Expected:** [Final result]

---

## 5. Alternative Flows

### 5.1 Alt Flow A: [Scenario]

**Trigger:** [When this happens]

**Flow:**
1. System detects [condition]
2. System shows [message]
3. User [corrects/retries]
4. Continue with Step X

---

## 6. Exception Flows

### 6.1 Exception E1: [Error Type]

**Trigger:** [What causes this]

**Flow:**
1. System logs error
2. System displays message
3. User can retry

---

## 7. Postconditions

### 7.1 Success
- Data saved
- User notified
- Log created

### 7.2 Failure
- No changes
- Error logged

---

## 8. Business Rules

- **BR-1:** [Validation rule]
- **BR-2:** [Processing rule]
- **BR-3:** [Authorization rule]

---

## 9. Non-Functional Requirements

### Performance
- Response time < 500ms
- Page load < 2s

### Security
- HTTPS only
- Input validation
- CSRF protection

### Usability
- Mobile responsive
- WCAG 2.1 AA
- Browser support: Latest 2 versions

---

## 10. Data Model

```typescript
interface Entity {
  id: string;
  name: string;
}

interface CreateDTO {
  name: string;
}
```

---

## 11. UI/UX

### Mockup
![Screen](./mockup.png)

### Form Fields
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | text | Yes | Min 2 chars |
| Email | email | Yes | Valid email |

---

## 12. API Specification

```http
POST /api/resource
Content-Type: application/json

{
  "name": "Example"
}
```

**Success (201):**
```json
{
  "id": "uuid",
  "name": "Example"
}
```

**Error (400):**
```json
{
  "error": "ValidationError",
  "message": "Invalid input"
}
```

---

## 13. Test Cases

### TC-1: Happy Path
- **Given:** Valid data
- **When:** Submit form
- **Then:** Success

### TC-2: Invalid Input
- **Given:** Invalid email
- **When:** Submit
- **Then:** Error shown

---

## 14. Implementation

### Components
- [ ] `EntityContainerComponent`
- [ ] `EntityFormComponent`
- [ ] `EntityApiService`
- [ ] `EntityBusinessService`
- [ ] `EntityStore`

### Effort
- Development: X hours
- Testing: Y hours

---

## 15. Dependencies

**Requires:**
- REQ-XXX: [Dependency]

**Blocks:**
- REQ-YYY: [Blocked requirement]

---

## 16. Naming Glossary

### Container Methods
- `onSubmit()` - Form submission
- `onCreate()` - Create action
- `onDelete(id)` - Delete action

### API Service
- `getAll()` - GET all
- `create(data)` - POST
- `update(id, data)` - PUT

### Signal Store
- `loadEntities()` - Load from API
- `addEntity(e)` - Add to state
- `selectEntity(id)` - Set selected

### Computed Signals
- `filteredEntities` - Filtered list
- `entityCount` - Count
- `hasEntities` - Boolean check

---

## 17. Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Tech Lead | | |

---

## 18. Implementation Notes

**WICHTIG: Code muss BILINGUAL sein!**

Siehe `.claude/skills/bilingual-code.md` für Details:
- Kommentare DE + EN
- Error Messages Englisch
- i18n Keys für beide Sprachen
- JSDoc bilingual


# Security (COMPACT)

## Projekt-Vorgabe
<!-- SETUP:VORGABE -->

**Wann:** Bei ALLEN Features - PFLICHT vor jedem Commit!

---

## XSS Prevention

```typescript
// ❌ NIEMALS
this.sanitizer.bypassSecurityTrustHtml(userInput);
element.innerHTML = userInput;
eval(userCode);

// ✅ Angular escaped automatisch
template: `<div>{{ userInput() }}</div>`

// ✅ Wenn HTML nötig (nur TRUSTED sources!)
sanitizedHtml = computed(() =>
  this.sanitizer.sanitize(SecurityContext.HTML, this.trustedHtml()) || ''
);
```

---

## Authentication

### JWT in HttpOnly Cookie (NICHT localStorage!)
```typescript
// ❌ FALSCH - XSS vulnerable
localStorage.setItem('token', jwt);

// ✅ RICHTIG - Backend setzt HttpOnly Cookie
// Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict
```

### Route Guards
```typescript
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() || router.createUrlTree(['/login']);
};

export const roleGuard = (role: string): CanActivateFn => () => {
  const auth = inject(AuthService);
  return auth.hasRole(role);
};

// Routes
{ path: 'admin', canActivate: [authGuard, roleGuard('admin')], ... }
```

---

## CSRF Protection

```typescript
// app.config.ts
provideHttpClient(
  withXsrfConfiguration({
    cookieName: 'XSRF-TOKEN',
    headerName: 'X-XSRF-TOKEN'
  })
)
```

---

## Sensitive Data

```typescript
// ❌ NIEMALS
console.log('Password:', password);
const apiKey = 'sk-xxx-hardcoded';
const url = `/api/user?password=${password}`;

// ✅ RICHTIG
console.log('Login attempt for user:', email);  // Keine sensiblen Daten
const apiKey = environment.apiKey;              // Environment Variable
const url = `/api/user`;                        // POST Body für sensible Daten
```

---

## Input Validation

```typescript
// Client-Side (UX only!)
this.form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8),
    Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).*$/)]],
});

// Custom Validator
export function noScriptValidator(): ValidatorFn {
  return (control) => {
    const forbidden = /<script/i.test(control.value);
    return forbidden ? { noScript: true } : null;
  };
}
```

---

## Error Handling

```typescript
// ❌ FALSCH - Stack Trace an User
catchError((error) => throwError(() => error))

// ✅ RICHTIG - Generische Fehlermeldung
catchError((error) => {
  console.error('Internal:', error);  // Nur intern
  return throwError(() => new Error('Ein Fehler ist aufgetreten.'));
})
```

---

## HTTP Security Headers (Backend/nginx)

```
Content-Security-Policy: default-src 'self'; script-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Dependency Audit

```bash
npm audit                 # Vulnerabilities prüfen
npm audit fix             # Auto-Fix
npm outdated              # Veraltete Packages
npx snyk test             # Tiefere Analyse
```

---

## Checklist

### Vor jedem Commit:
- [ ] Keine `console.log` mit sensiblen Daten
- [ ] Keine hardcoded Credentials
- [ ] Keine `bypassSecurityTrust*` mit User-Input
- [ ] Route Guards für geschützte Routes
- [ ] Input Validation vorhanden

### Vor jedem Release:
- [ ] `npm audit` ohne HIGH/CRITICAL
- [ ] HTTPS für alle API Calls
- [ ] Security Headers konfiguriert
- [ ] Error Messages enthalten keine Details
- [ ] Source Maps deaktiviert in Production

### OWASP Top 10 Quick Check:
- [ ] Injection: Parametrisierte Queries
- [ ] Broken Auth: JWT in HttpOnly Cookie
- [ ] Sensitive Data: Verschlüsselt, nicht geloggt
- [ ] XSS: Angular Escaping, DomSanitizer
- [ ] Broken Access: Route Guards + Backend Check
- [ ] Misconfiguration: Security Headers
- [ ] Components: npm audit clean

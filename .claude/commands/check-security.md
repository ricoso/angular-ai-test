# Check Security Command

**PFLICHT!** Prüft Security-Anforderungen basierend auf OWASP Top 10 und Angular Best Practices.

## Usage

```
<feature-name>
```

Example: `user-login`

## Checks Performed

### 1. XSS (Cross-Site Scripting) Prevention

✅ **Template Security:**
- KEIN `[innerHTML]` ohne Sanitization
- KEIN `bypassSecurityTrustHtml()` ohne Validierung
- KEINE dynamischen Script-Tags
- KEINE `eval()` oder `Function()` Aufrufe

✅ **Safe:**
```html
<!-- ✅ Angular escaped automatisch -->
<div>{{ userInput() }}</div>

<!-- ✅ Mit DomSanitizer wenn nötig -->
<div [innerHTML]="sanitizedHtml()"></div>
```

❌ **Unsafe:**
```html
<!-- ❌ Potenzielle XSS -->
<div [innerHTML]="userInput()"></div>
```

```typescript
// ❌ NIEMALS
this.sanitizer.bypassSecurityTrustHtml(untrustedInput);
```

### 2. Injection Prevention

✅ **SQL/NoSQL Injection:**
- Parametrisierte Queries (Backend)
- KEINE String-Konkatenation für Queries
- Input-Validierung auf Client UND Server

✅ **Command Injection:**
- KEINE Shell-Befehle mit User-Input
- KEINE dynamische Code-Ausführung

### 3. Authentication & Authorization

✅ **Auth Tokens:**
- JWT in HttpOnly Cookies (NICHT localStorage für sensible Tokens!)
- Refresh Token Rotation
- Token-Expiration prüfen
- Logout löscht alle Tokens

✅ **Route Guards:**
```typescript
// ✅ PFLICHT für geschützte Routes
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
```

✅ **Role-Based Access:**
```typescript
// ✅ Rollen-Check
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.hasRole('admin');
};
```

### 4. CSRF Protection

✅ **Angular HttpClient:**
- CSRF Token im Header (`X-XSRF-TOKEN`)
- `withCredentials: true` für Cookies
- SameSite Cookie-Attribute

```typescript
// ✅ HttpClient mit CSRF
provideHttpClient(
  withXsrfConfiguration({
    cookieName: 'XSRF-TOKEN',
    headerName: 'X-XSRF-TOKEN'
  })
)
```

### 5. Sensitive Data Exposure

✅ **KEINE sensiblen Daten in:**
- URL-Parametern (`?password=xxx`)
- localStorage/sessionStorage (für Tokens)
- Console.log() in Production
- Error Messages an User
- HTML Comments
- Source Maps in Production

✅ **Sensible Daten:**
```typescript
// ❌ FALSCH
localStorage.setItem('authToken', token);
console.log('User password:', password);

// ✅ RICHTIG
// HttpOnly Cookie (vom Backend gesetzt)
// Keine Logs für sensible Daten
```

### 6. Input Validation

✅ **Client-Side (UX, nicht Security!):**
```typescript
// ✅ Validators für Forms
this.form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
});
```

✅ **Sanitization:**
```typescript
// ✅ Für HTML-Content
constructor(private sanitizer: DomSanitizer) {}

sanitizeHtml(html: string): SafeHtml {
  // Nur wenn WIRKLICH nötig und Input ist TRUSTED
  return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
}
```

### 7. HTTP Security Headers

✅ **Erforderliche Headers (Backend/nginx):**
```
Content-Security-Policy: default-src 'self'; script-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=()
```

### 8. Dependency Security

✅ **NPM Audit:**
```bash
npm audit                    # Prüfen
npm audit fix                # Auto-Fix
npm audit fix --force        # Breaking Changes erlauben
```

✅ **Keine veralteten Dependencies:**
- Regelmäßig `npm outdated` prüfen
- Security-Patches sofort einspielen

### 9. Error Handling

✅ **Keine Stack Traces an User:**
```typescript
// ✅ RICHTIG
catchError((error) => {
  console.error('Internal error:', error); // Nur intern loggen
  return throwError(() => new Error('Ein Fehler ist aufgetreten.'));
})

// ❌ FALSCH
catchError((error) => {
  return throwError(() => error); // Stack Trace an User
})
```

### 10. Secure Communication

✅ **HTTPS Only:**
- Alle API-Calls über HTTPS
- KEINE Mixed Content (HTTP auf HTTPS-Seite)
- Certificate Pinning für Mobile Apps

✅ **API Endpoints:**
```typescript
// ✅ RICHTIG
private readonly apiUrl = environment.apiUrl; // https://api.example.com

// ❌ FALSCH
private readonly apiUrl = 'http://api.example.com';
```

## Output Format

```
🔒 Security Check for: user-login

✅ XSS Prevention
   ✅ No unsafe innerHTML bindings
   ✅ No bypassSecurityTrust* calls

✅ Authentication
   ✅ Route Guards implemented
   ✅ Token handling secure

⚠️  Sensitive Data
   ❌ auth.service.ts:45
      - Token in localStorage gefunden
      - Fix: HttpOnly Cookie verwenden

✅ Input Validation
   ✅ All forms have validators
   ✅ Server-side validation present

⚠️  Dependencies
   ❌ 2 vulnerabilities found
      - lodash: Prototype Pollution (HIGH)
      - Fix: npm audit fix

✅ Error Handling
   ✅ No stack traces exposed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 Security Score: 75/100

❌ 2 issues found
🚨 HIGH: 1 | MEDIUM: 1 | LOW: 0

⚠️  Required Actions:
   1. Move tokens to HttpOnly cookies
   2. Run npm audit fix
```

## Severity Levels

| Level | Beschreibung | Beispiele |
|-------|--------------|-----------|
| 🚨 **HIGH** | Sofort beheben | XSS, SQL Injection, Auth Bypass |
| ⚠️ **MEDIUM** | Vor Release beheben | CSRF, Info Disclosure |
| ℹ️ **LOW** | Bei Gelegenheit | Missing Headers, Weak Validation |

## Automatische Prüfungen

```bash
# NPM Audit
npm audit

# ESLint Security Rules
npm run lint

# Dependency Check
npx snyk test
```

## Best Practices

### Pflicht vor jedem Commit:
- ✅ `/check-security <feature>`
- ✅ `npm audit`
- ✅ Keine `console.log` mit sensiblen Daten
- ✅ Keine hardcoded Credentials

### Pflicht vor jedem Release:
- ✅ Full Security Audit
- ✅ Penetration Testing
- ✅ Dependency Update
- ✅ Security Headers prüfen

## Quick Reference

| Risiko | Lösung |
|--------|--------|
| XSS | Angular Template Escaping, DomSanitizer |
| CSRF | HttpClient XSRF, SameSite Cookies |
| Auth | HttpOnly Cookies, Route Guards, JWT |
| Injection | Parametrisierte Queries, Input Validation |
| Data Exposure | HTTPS, keine Logs, Environment Variables |

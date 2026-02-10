# REQ-001: Benutzer-Anmeldung

**Status:** ✅ Approved  
**Priorität:** Critical  
**Typ:** Functional  
**Erstellt:** 2024-02-01  
**Letzte Änderung:** 2024-02-06  
**Autor:** Product Team  
**Stakeholder:** Alle Benutzer

---

## 1. Übersicht

### 1.1 Zweck
Benutzer können sich mit Email und Passwort am System anmelden und erhalten einen JWT Token für authentifizierte Anfragen.

### 1.2 Umfang
- Login-Formular mit Email und Passwort
- Validierung der Eingaben
- API-Aufruf zum Backend
- JWT Token Speicherung
- Weiterleitung nach erfolgreicher Anmeldung

### 1.3 Verwandte Requirements
- REQ-002: Benutzer-Registrierung
- REQ-003: Passwort-Zurücksetzen
- REQ-004: Zwei-Faktor-Authentifizierung

---

## 2. Funktionale Anforderungen

### 2.1 User Story
**Als** Benutzer  
**möchte ich** mich mit Email und Passwort anmelden  
**damit** ich Zugriff auf mein Konto und geschützte Bereiche erhalte

### 2.2 Akzeptanzkriterien
- [ ] AC-1: Benutzer kann Email-Adresse eingeben
- [ ] AC-2: Benutzer kann Passwort eingeben (maskiert)
- [ ] AC-3: System validiert Email-Format
- [ ] AC-4: System prüft Passwort-Mindestlänge (8 Zeichen)
- [ ] AC-5: Bei korrekten Daten: Anmeldung erfolgreich
- [ ] AC-6: Bei falschen Daten: Fehlermeldung anzeigen
- [ ] AC-7: JWT Token wird sicher gespeichert
- [ ] AC-8: Benutzer wird zur Dashboard-Seite weitergeleitet

---

## 3. Vorbedingungen

### 3.1 System-Vorbedingungen
- System ist erreichbar (HTTP 200)
- Backend-API ist verfügbar
- Datenbank ist online
- HTTPS ist aktiviert

### 3.2 Benutzer-Vorbedingungen
- Benutzer hat ein registriertes Konto
- Benutzer kennt Email und Passwort
- Benutzer ist NICHT angemeldet
- Browser akzeptiert Cookies (für Token-Speicherung)

### 3.3 Daten-Vorbedingungen
- Benutzer-Account existiert in Datenbank
- Account ist aktiviert (nicht gesperrt)
- Email ist verifiziert

---

## 4. Hauptablauf (Happy Path)

**Schritt 1:** Benutzer navigiert zur Login-Seite
- **Aktion:** URL `/login` aufrufen oder "Anmelden" Button klicken
- **Erwartet:** Login-Seite wird angezeigt mit Email und Passwort Feldern

**Schritt 2:** Benutzer gibt Zugangsdaten ein
- **Aktion:** 
  - Email eingeben: `user@example.com`
  - Passwort eingeben: `********`
- **Validierung:** 
  - Email-Format prüfen (client-side)
  - Passwort min. 8 Zeichen prüfen
- **Erwartet:** Keine Validierungsfehler

**Schritt 3:** Benutzer sendet Formular ab
- **Aktion:** "Anmelden" Button klicken
- **Erwartet:** 
  - Button zeigt "Laden..." an
  - Button ist deaktiviert während Anfrage läuft

**Schritt 4:** System sendet Anfrage an Backend
- **Aktion:** POST `/api/auth/login`
- **Payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "secret123"
  }
  ```
- **Erwartet:** HTTP 200 Response

**Schritt 5:** Backend validiert und antwortet
- **Aktion:** 
  - Email/Passwort gegen Datenbank prüfen
  - JWT Token generieren
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Max Mustermann"
    }
  }
  ```

**Schritt 6:** System speichert Token
- **Aktion:** Token in localStorage speichern
- **Key:** `auth_token`
- **Erwartet:** Token ist gespeichert

**Schritt 7:** Benutzer wird weitergeleitet
- **Aktion:** Navigation zu `/dashboard`
- **Erwartet:** 
  - Dashboard-Seite wird geladen
  - Benutzer ist angemeldet
  - Header zeigt "Abmelden" statt "Anmelden"

---

## 5. Alternative Abläufe

### 5.1 Alternativ-Ablauf A: Ungültiges Email-Format

**Trigger:** Benutzer gibt ungültige Email ein in Schritt 2

**Ablauf:**
1. System erkennt ungültiges Email-Format (kein `@`)
2. Fehler wird unter Email-Feld angezeigt: "Gültige Email-Adresse erforderlich"
3. Email-Feld wird rot markiert
4. Submit-Button bleibt deaktiviert
5. Benutzer korrigiert Email
6. Weiter mit Schritt 3 des Hauptablaufs

**Ergebnis:** Benutzer kann mit korrekter Email erneut versuchen

---

### 5.2 Alternativ-Ablauf B: Passwort zu kurz

**Trigger:** Benutzer gibt Passwort < 8 Zeichen ein

**Ablauf:**
1. System erkennt zu kurzes Passwort
2. Fehler wird angezeigt: "Passwort muss mindestens 8 Zeichen lang sein"
3. Passwort-Feld wird rot markiert
4. Submit-Button bleibt deaktiviert
5. Benutzer korrigiert Passwort
6. Weiter mit Schritt 3

**Ergebnis:** Validierung verhindert ungültige Anfrage

---

### 5.3 Alternativ-Ablauf C: Falsche Zugangsdaten

**Trigger:** Backend kann Benutzer nicht authentifizieren (Schritt 5)

**Ablauf:**
1. Backend prüft Email/Passwort
2. Keine Übereinstimmung gefunden
3. Backend antwortet mit HTTP 401:
   ```json
   {
     "error": "InvalidCredentials",
     "message": "Email oder Passwort falsch"
   }
   ```
4. System zeigt Fehlermeldung an (oben im Formular)
5. Email + Passwort Felder werden zurückgesetzt
6. Benutzer kann erneut versuchen

**Ergebnis:** Benutzer bleibt auf Login-Seite

---

### 5.4 Alternativ-Ablauf D: Account gesperrt

**Trigger:** Benutzer-Account ist gesperrt

**Ablauf:**
1. Backend erkennt gesperrten Account
2. Backend antwortet mit HTTP 403:
   ```json
   {
     "error": "AccountLocked",
     "message": "Ihr Account wurde gesperrt. Bitte kontaktieren Sie den Support."
   }
   ```
3. System zeigt Fehlermeldung mit Support-Link
4. Login ist nicht möglich

**Ergebnis:** Benutzer muss Support kontaktieren

---

## 6. Ausnahme-Abläufe

### 6.1 Ausnahme E1: Backend nicht erreichbar

**Trigger:** API-Aufruf schlägt fehl (Timeout, Network Error) in Schritt 4

**Ablauf:**
1. System erkennt Netzwerkfehler
2. Fehler wird geloggt mit Details
3. Benutzer-freundliche Meldung: "Verbindung fehlgeschlagen. Bitte prüfen Sie Ihre Internetverbindung."
4. "Erneut versuchen" Button wird angezeigt
5. Benutzer kann Anfrage wiederholen

**Ergebnis:** Graceful Error Handling, kein Datenverlust

---

### 6.2 Ausnahme E2: Token-Speicherung fehlgeschlagen

**Trigger:** localStorage nicht verfügbar (Private Mode, voll, etc.)

**Ablauf:**
1. System versucht Token zu speichern
2. localStorage.setItem() wirft Exception
3. Fehler wird geloggt
4. Fallback: Token in sessionStorage speichern
5. Warnung an Benutzer: "Token wird nur für diese Sitzung gespeichert"

**Ergebnis:** Anmeldung erfolgreich, aber Session-only

---

## 7. Nachbedingungen

### 7.1 Erfolg-Nachbedingungen
- JWT Token ist in localStorage gespeichert
- Benutzer ist authentifiziert
- Benutzer ist auf `/dashboard` Seite
- AuthStore enthält Benutzer-Daten
- Session ist aktiv (15 Minuten Gültigkeit)
- Audit-Log Eintrag: "User logged in"

### 7.2 Fehler-Nachbedingungen
- Kein Token gespeichert
- Benutzer bleibt auf Login-Seite
- Fehlermeldung wird angezeigt
- Login-Versuch wird geloggt (bei falschen Credentials)
- Rate Limit Counter wird erhöht
- Nach 5 Fehlversuchen: Temporäre Sperre (15 Min)

---

## 8. Business Rules

### 8.1 Validierungsregeln
- **BR-1:** Email muss gültiges Format haben (RFC 5322)
- **BR-2:** Passwort muss mindestens 8 Zeichen haben
- **BR-3:** Email ist case-insensitive (`User@Example.com` = `user@example.com`)
- **BR-4:** Leerzeichen am Anfang/Ende werden getrimmt

### 8.2 Sicherheitsregeln
- **BR-5:** Max. 5 Fehlversuche pro IP in 15 Minuten
- **BR-6:** Nach 5 Fehlversuchen: Account temporär gesperrt (15 Min)
- **BR-7:** Passwort wird NIEMALS in Logs gespeichert
- **BR-8:** HTTPS ist Pflicht (kein HTTP)
- **BR-9:** JWT Token Gültigkeit: 15 Minuten
- **BR-10:** Refresh Token Gültigkeit: 7 Tage

### 8.3 Session-Regeln
- **BR-11:** Nur eine aktive Session pro Benutzer (neuer Login invalidiert alten Token)
- **BR-12:** Token wird bei Logout invalidiert
- **BR-13:** Inaktivität > 15 Min = automatischer Logout

---

## 9. Nicht-funktionale Anforderungen

### 9.1 Performance
- **NFR-1:** Login-Request < 500ms (95th Percentile)
- **NFR-2:** Seite lädt in < 2 Sekunden
- **NFR-3:** Formular-Validierung: Real-time (< 100ms)

### 9.2 Usability
- **NFR-4:** Mobile responsive (iOS, Android)
- **NFR-5:** Tastatur-Navigation möglich (Tab-Order)
- **NFR-6:** Screen-Reader kompatibel (ARIA Labels)
- **NFR-7:** Autofill supported (email + password)
- **NFR-8:** "Passwort anzeigen" Toggle

### 9.3 Security
- **NFR-9:** HTTPS only
- **NFR-10:** CSRF Protection (Token)
- **NFR-11:** XSS Prevention (Input Sanitization)
- **NFR-12:** Rate Limiting (100 req/min/IP)
- **NFR-13:** Password hashed with bcrypt (Backend)

---

## 10. Datenmodell

### 10.1 Request Daten
```typescript
interface LoginRequest {
  email: string;     // required, valid email
  password: string;  // required, min 8 chars
}
```

### 10.2 Response Daten
```typescript
interface LoginResponse {
  token: string;     // JWT token
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
  expiresIn: number; // seconds (900 = 15min)
}
```

---

## 11. UI/UX Spezifikation

### 11.1 Mockup
![Login Mockup](./mockup-desktop.png)

### 11.2 Mobile Ansicht
![Mobile Login](./mockup-mobile.png)

### 11.3 Formular-Felder

| Feld | Typ | Pflicht | Validierung | Placeholder |
|------|-----|---------|-------------|-------------|
| Email | email | Ja | Email-Format | "ihre.email@beispiel.de" |
| Passwort | password | Ja | Min 8 Zeichen | "Passwort" |

### 11.4 Buttons

| Button | Typ | Zustand | Aktion |
|--------|-----|---------|--------|
| Anmelden | Primary | Enabled wenn valid | Formular absenden |
| Passwort anzeigen | Icon | Toggle | Passwort ein/ausblenden |
| Passwort vergessen? | Link | - | Zu `/password-reset` |

### 11.5 Fehlermeldungen

| Fehler | Nachricht | Position |
|--------|-----------|----------|
| Ungültige Email | "Gültige Email-Adresse erforderlich" | Unter Email-Feld |
| Passwort zu kurz | "Passwort muss mindestens 8 Zeichen lang sein" | Unter Passwort-Feld |
| Falsche Credentials | "Email oder Passwort falsch" | Oben im Formular (rot) |
| Account gesperrt | "Account gesperrt. Support kontaktieren." | Oben im Formular |
| Netzwerkfehler | "Verbindung fehlgeschlagen" | Oben im Formular |

---

## 12. API Spezifikation

### 12.1 Endpoint
```
POST /api/auth/login
```

### 12.2 Request
```http
POST /api/auth/login HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret123"
}
```

### 12.3 Response (Erfolg)
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "Max Mustermann",
    "role": "user"
  },
  "expiresIn": 900
}
```

### 12.4 Response (Fehler - Falsche Credentials)
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "InvalidCredentials",
  "message": "Email oder Passwort falsch"
}
```

---

## Siehe auch

**Englische Version:** [requirement.en.md](./requirement.en.md)

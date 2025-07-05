# PERN Stack (PostgreSQL, Express, React, Node.js) mit Docker & nginx

Dieses Projekt ist ein vollständiger **PERN-Stack** (PostgreSQL, Express, React, Node.js), containerisiert mit Docker Compose und produktionsreif mit nginx als Reverse Proxy und Static File Server.

---

## **Projektstruktur**

```
.
├── backend/         # Express/Prisma Backend (TypeScript)
├── frontend/        # React Frontend (Vite + nginx)
├── docker-compose.yml
└── README.md
```

---

## **Backend: TypeScript, Prisma & Jest**

- **TypeScript**: Quellcode liegt in `backend/src/`, Build nach `backend/dist/`
- **Prisma**: Datenbankzugriff
- **Jest**: Testing-Framework für Unit- und Integrationstests
- **Supertest**: HTTP-Tests für Express-Routen

### **Wichtige Skripte (`backend/package.json`)**

```json
"scripts": {
  "dev": "ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "test": "jest"
}
```

## **Features: Authentifizierung & Benutzerverwaltung**

Dieses Projekt enthält eine vollständige Authentifizierungs-Logik:

- **Registrierung:**  
  Nutzer können sich mit E-Mail und Passwort registrieren. Nach der Registrierung wird eine Bestätigungs-E-Mail mit Verifizierungslink verschickt.

- **E-Mail-Verifizierung:**  
  Nutzer müssen ihre E-Mail-Adresse über einen Link bestätigen, bevor sie sich einloggen können.

- **Login:**  
  Nach erfolgreicher Verifizierung können sich Nutzer mit E-Mail und Passwort anmelden. Nach dem Login erhalten sie ein JWT-Token für geschützte Routen.

- **Passwort zurücksetzen:**  
  Nutzer können einen Link zum Zurücksetzen des Passworts anfordern. Nach Klick auf den Link kann ein neues Passwort gesetzt werden.

- **Geschützte Routen:**  
  Bestimmte Endpunkte (z.B. /api/profile) sind nur mit gültigem JWT-Token zugänglich.

**Technische Hinweise:**
- Die gesamte Logik ist modular in TypeScript umgesetzt.
- E-Mail-Versand erfolgt über einen konfigurierbaren SMTP-Dienst (z.B. Gmail, Mailgun, Brevo, testmail.app).
- Die Authentifizierung basiert auf JWT (JSON Web Token).
- Alle Auth-Routen sind als Express-Router gekapselt.

---

## **Beispiel-Endpunkte**

- `POST /api/register` – Registrierung
- `POST /api/login` – Login
- `GET  /api/verify-email?token=...` – E-Mail-Verifizierung
- `POST /api/request-password-reset` – Passwort-Reset anfordern
- `POST /api/reset-password` – Passwort zurücksetzen
- `GET  /api/profile` – Geschütztes Nutzerprofil (nur mit Token)

---

## **Jest-Tests im Docker-Container ausführen**

Um die Tests im Container laufen zu lassen:

```bash
docker-compose run --rm backend npm test
```

- Baut ein temporäres Backend-Image und führt die Tests aus.
- Perfekt für CI/CD oder lokale Testläufe in einer konsistenten Umgebung.

---

## **Frontend: Production Build mit nginx**

- React wird mit Vite gebaut und im Container von nginx ausgeliefert.
- Die nginx-Konfiguration (`frontend/nginx.conf`) sorgt für SPA-Fallback (`try_files $uri /index.html;`).

---

## **Reverse Proxy (Host nginx) Setup**

Dein Host-nginx (außerhalb von Docker) leitet weiter:

- `/api` → Backend (localhost:3000)
- `/`    → Frontend (localhost:3001)

---

## **Build & Start**

```bash
docker-compose down
docker-compose up --build
```

- Frontend läuft auf Port 3001 (nginx im Container)
- Backend läuft auf Port 3000
- Host-nginx übernimmt SSL und Routing

---

## **Testing & Entwicklung**

- **Backend-Tests:**  
  ```bash
  docker-compose run --rm backend npm test
  ```
- **Lokale Entwicklung:**  
  - Backend: `npm run dev` im Backend-Ordner
  - Frontend: `npm run dev` im Frontend-Ordner

---
---

## CSRF-Schutz: Double Submit Cookie Pattern

Dieses Projekt verwendet das Double Submit Cookie Pattern zum Schutz vor CSRF-Angriffen:

1. **CSRF-Token-Generierung (Backend)**
   - Bei jedem sicheren HTTP-Request (GET, HEAD, OPTIONS) prüft das Express-Middleware, ob der Client bereits ein `csrfToken`-Cookie besitzt.
   - Falls nicht, wird ein zufälliges Token generiert und als Cookie gesetzt (nicht httpOnly, damit JS es lesen kann).

2. **Senden des CSRF-Tokens (Frontend)**
   - Bei jedem zustandsverändernden Request (POST, PUT, DELETE) liest das Frontend das `csrfToken`-Cookie in JavaScript aus und sendet es als `x-csrf-token`-Header, mit `credentials: "include"`.

3. **CSRF-Token-Validierung (Backend)**
   - Für zustandsverändernde Requests prüft das Backend, ob das `csrfToken`-Cookie mit dem `x-csrf-token`-Header übereinstimmt. Nur dann wird die Anfrage akzeptiert, sonst gibt es einen 403-Fehler.

4. **Warum ist das sicher?**
   - SameSite-Cookies verhindern, dass die meisten Cross-Site-Requests das CSRF-Cookie mitsenden.
   - Angreifer können deine Cookies nicht von einer anderen Seite auslesen und somit keinen gültigen Header setzen.
   - Es ist keine serverseitige Session nötig; der Server prüft nur, ob Cookie und Header übereinstimmen.

5. **Wovor schützt das?**
   - CSRF-Angriffe: Bösartige Seiten können keine gültigen zustandsverändernden Requests an deine API senden.
   - Hinweis: Gegen XSS musst du dich trotzdem schützen, da ein Angreifer mit XSS das CSRF-Token auslesen könnte.

---

## XSS-Schutz in diesem Projekt

- **Warum ist XSS gefährlich?** Wenn ein Angreifer JavaScript in deine Seite einschleusen kann, kann er Cookies, Tokens stehlen oder Aktionen im Namen des Nutzers ausführen.
- **Wie schützt du dich:**
  - Niemals unsanitized User-Input als HTML rendern (nutze Reacts Standard-Escaping, vermeide `dangerouslySetInnerHTML`).
  - Verwende HTTP-only Cookies für sensible Tokens (wie in diesem Projekt für JWTs).
  - Setze einen starken Content Security Policy (CSP) Header in nginx oder Express.
  - Halte alle Abhängigkeiten aktuell und prüfe auf Schwachstellen.
  - Validiere und sanitiziere alle Nutzereingaben im Backend.

**Zusammenfassung:**
- Dieses Projekt ist durch das Double Submit Cookie Pattern gegen CSRF geschützt.
- XSS-Schutz basiert auf React-Escaping, Backend-Validierung und empfohlenen CSP-Headern.

---

## Content Security Policy (CSP) & Security Headers

Dieses Projekt verwendet eine starke Content Security Policy (CSP) und zusätzliche HTTP-Sicherheits-Header, um gegen gängige Web-Schwachstellen wie XSS, Clickjacking und Daten-Injection zu schützen.

### Empfohlene CSP-Regeln

Füge Folgendes zu deiner nginx-Konfiguration (oder Express für Entwicklung) hinzu:

```
add_header Content-Security-Policy "
  default-src 'none';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
" always;
```

**Erklärung:**
- `default-src 'none';` — Alles standardmäßig verbieten, nur explizit erlaubte Quellen zulassen.
- `script-src 'self';` — Nur Skripte von der eigenen Domain erlauben.
- `style-src 'self' 'unsafe-inline';` — Styles nur von der eigenen Domain und Inline-Styles erlauben (für Tailwind nötig, ggf. anpassen).
- `img-src 'self' data:;` — Bilder nur von der eigenen Domain und als Data-URL erlauben.
- `font-src 'self';` — Nur Fonts von der eigenen Domain erlauben.
- `connect-src 'self';` — Nur XHR/fetch/WebSocket-Verbindungen zur eigenen Domain (API).
- `frame-ancestors 'none';` — Verhindert, dass die Seite in iframes eingebettet wird (Clickjacking-Schutz).
- `base-uri 'self';` — Beschränkt das <base>-Tag auf die eigene Domain.
- `form-action 'self';` — Formulare dürfen nur zur eigenen Domain abgeschickt werden.

Passe die Regeln an, falls du externe Ressourcen (z.B. Google Fonts, Analytics) nutzt.

### Zusätzliche Security-Header

Füge diese Header hinzu, um deine Deployment weiter abzusichern:

```
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

- `X-Content-Type-Options: nosniff` — Verhindert, dass Browser den Content-Type raten und so Angriffe ermöglichen.
- `X-Frame-Options: DENY` — Verhindert das Einbetten der Seite in iframes (legacy Clickjacking-Schutz; nutze zusätzlich frame-ancestors in CSP).
- `Strict-Transport-Security` — Erzwingt HTTPS für deine Domain und Subdomains.

### Wo setzt man diese Header?
- **Produktion:** In deiner nginx-Konfiguration (siehe `frontend/nginx.conf`).
- **Entwicklung:** Ähnliche Header können in Express mit `res.setHeader()` gesetzt werden.

### Beispiel nginx-Konfiguration

```
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header Content-Security-Policy "..." always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    location / {
        try_files $uri /index.html;
    }
}
```

**Hinweis:**
- Setze `Strict-Transport-Security` nur auf HTTPS-Servern.
- Passe die CSP an, falls du externe Ressourcen nutzt.
- Mehr Infos: [MDN CSP Dokumentation](https://developer.mozilla.org/docs/Web/HTTP/CSP).

---

## Warum gibt es zwei nginx-Server (Proxy & Frontend)?

In diesem Setup gibt es zwei nginx-Instanzen:

- **Proxy-nginx (Host):**
  - Läuft außerhalb der Container (z.B. auf dem Server oder als separater Container).
  - Übernimmt das SSL/TLS-Terminating (HTTPS), Routing und setzt alle wichtigen Security-Header.
  - Leitet Anfragen an das Backend (`/api`) und das Frontend (React-App) weiter.

- **Frontend-nginx (im Container):**
  - Lädt und serviert die statischen Dateien des React-Frontends (z.B. `index.html`, JS, CSS).
  - Sorgt für SPA-Fallback (alle unbekannten Routen gehen auf `index.html`).
  - Ist von außen nicht direkt erreichbar, sondern nur über den Proxy-nginx.

**Vorteile dieses Aufbaus:**
- Trennung von statischer Auslieferung (Frontend) und Routing/Sicherheit (Proxy).
- Der Proxy-nginx kann zentral SSL, Security-Header und Routing für alle Dienste übernehmen.
- Die Container bleiben einfach und portabel, der Proxy regelt alles, was deployment-spezifisch ist.

**Kurz:**
Der zweite nginx im Frontend-Container ist nötig, damit die React-App als statische Website performant und sicher ausgeliefert werden kann – der Proxy-nginx übernimmt alles, was mit Routing, SSL und Sicherheit zu tun hat.

---

## **Hinweise**

- Alle Umgebungsvariablen (z.B. `.env`) müssen im Container verfügbar sein.
- `dist/` ist im Backend `.gitignore` eingetragen und wird nur im Build erzeugt.
- Für produktiven E-Mail-Versand empfiehlt sich ein externer SMTP-Dienst.

---

## **Fragen?**

Öffne ein Issue oder schau in die jeweiligen Dokumentationen.


## **Lizenz**

Dieses Projekt steht unter der [MIT License](./LICENSE).

---
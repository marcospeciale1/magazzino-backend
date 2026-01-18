# Magazzino App

Applicazione full‑stack per la gestione di un magazzino (prodotti) con backend GraphQL (Node/Express + MySQL) e frontend Angular.

## Caratteristiche

- Autenticazione Basic (header Authorization) gestita da interceptor Angular
- Prodotti: elenco, ricerca in tempo reale, creazione, modifica, eliminazione
- Campi prodotto: codice, nome, descrizione, prezzo, quantità
- UI moderna con Angular 21 (standalone, Reactive Forms, @if/@for)

## Stack Tecnologico

- Backend: Node.js, Express, express-graphql, MySQL (mysql2), TypeScript, dotenv, bcrypt
- Frontend: Angular 21, Reactive Forms, RxJS, Bootstrap 5
- DB: MySQL (script iniziale in `backend/scripts/schema.sql`)

## Requisiti

- Node.js LTS (consigliato v20 o v22)
- MySQL 5.7+ / 8+

## Avvio rapido

1. Backend

```bash
cd backend
npm install

# Configura DB via .env (vedi sotto) e crea schema
# Esegui lo script SQL con il tuo client (Workbench, CLI, ecc.)
mysql -u root -p < scripts/schema.sql

# Avvio in sviluppo
npm run dev
# Endpoint: http://localhost:3000/graphql
```

Variabili `.env` supportate (default tra parentesi):

- DB_HOST (localhost)
- DB_USER (root)
- DB_PASSWORD (password)
- DB_DATABASE (magazzino_db)
- DB_CONNECTION_LIMIT (10)

2. Frontend

```bash
cd frontend-magazzino
npm install
npm start
# App: http://localhost:4200
```

Accesso (sviluppo): usa Basic Auth con credenziali seed dal DB, ad es. `marco:1234`.

## Funzionalità implementate

- Login (salvataggio credenziali in locale e invio automatico dell’header Authorization)
- Dashboard prodotti con ricerca live (per nome/codice)
- Aggiunta prodotto (con descrizione opzionale)
- Modifica prodotto (tutti i campi, inclusa descrizione)
- Eliminazione prodotto

## Troubleshooting

- 400 Bad Request su /graphql: spesso è dovuto a parametri undefined nella mutation oppure assenza dell’Authorization header. Verifica Network → Request Payload e headers.
- 401 Unauthorized: assicurati che l’interceptor aggiunga l’header e che le credenziali esistano nel DB.

## Struttura

```
backend/
  src/
    database/db.ts
    middleware/auth.ts
    resolvers/index.ts
    schema/index.ts
    server.ts
  scripts/schema.sql

frontend-magazzino/
  src/app/
    components/login/  # login
    components/register/  # registrazione
    components/dashboard/ # gestione prodotti
    services/            # api + auth + interceptor
```

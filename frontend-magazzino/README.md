# Frontend Magazzino (Angular 21)

Interfaccia web per la gestione prodotti del Magazzino.

## Funzionalità

- Login/Logout con salvataggio credenziali e invio automatico dell'Authorization header
- Dashboard prodotti con:
  - Ricerca in tempo reale (per nome/codice)
  - Aggiunta nuovo prodotto (codice, nome, descrizione, prezzo, quantità)
  - Modifica prodotto (tutti i campi)
  - Eliminazione prodotto
- Angular moderno: componenti standalone, Reactive Forms, direttive di controllo `@if`/`@for`, interceptor funzionale

## Avvio

Prerequisiti: backend attivo su `http://localhost:3000`.

```bash
npm install
npm start
# http://localhost:4200
```

Credenziali di esempio (seed DB): `marco / 1234`.

## Configurazione

L'interceptor `auth-interceptor` inserisce l'header `Authorization: Basic ...` in tutte le chiamate HTTP se sono presenti credenziali in storage.

Endpoint GraphQL usato dal frontend: `http://localhost:3000/graphql`.

## Struttura

```
src/app/
	components/
		login/       # autenticazione
		register/    # registrazione utente
		dashboard/   # CRUD prodotti + ricerca
	services/
		api.ts       # chiamate GraphQL
		auth.ts      # gestione credenziali
		interceptors/auth-interceptor.ts
```

## Build

```bash
npm run build
```

Output in `dist/`.

## Troubleshooting

- Vedi 401/400: apri DevTools → Network → graphql e controlla headers (Authorization) e payload.
- Pagina vuota dopo login: assicurati che il backend sia avviato e che le credenziali siano corrette.

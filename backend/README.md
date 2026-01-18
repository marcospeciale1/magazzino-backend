# Backend GraphQL - Magazzino App

Backend GraphQL per la gestione di prodotti e utenti.

## Requisiti

- **Node.js** >= 16
- **TypeScript** >= 5.0
- **MySQL** >= 5.7

## Setup

### 1. Installazione dipendenze

```bash
npm install
```

### 2. Configurazione ambiente (.env)

Crea un file `.env` nella cartella `backend` con eventuali override delle variabili (tutte hanno un default in `src/database/db.ts`):

- `DB_HOST`: Host del server MySQL (default: `localhost`)
- `DB_USER`: Username MySQL (default: `root`)
- `DB_PASSWORD`: Password MySQL (default: `password`)
- `DB_DATABASE`: Nome database (default: `magazzino_db`)
  Nota: la porta del server è `3000` (configurata in `src/server.ts`).

### 3. Creazione database

Importa lo schema SQL:

```bash
# Linux/Mac
mysql -u root -p < scripts/schema.sql

# Oppure via MySQL Workbench o phpMyAdmin
# Apri scripts/schema.sql e esegui il codice nel tuo client MySQL
```

Questo creerà:

- Database `magazzino_db`
- Tabelle: `products`, `users`
- Utente seed: `marco:1234`

## Avvio

### Modalità sviluppo

```bash
npm run dev
```

Accedi a: `http://localhost:3000/graphql`

### Modalità produzione

```bash
npm run build
npm start
```

## API GraphQL

### Endpoint

- **URL**: `http://localhost:3000/graphql`
- **Autenticazione**: Basic Auth (header `Authorization: Basic <base64(username:password)>`)

### Esempio di Query

```graphql
query {
  getProducts {
    id
    codice
    nome
    prezzo
    quantita
  }
}
```

### Esempio di Mutation (createProduct)

```graphql
mutation {
  createProduct(
    codice: "P003"
    nome: "Nuovo Prodotto"
    descrizione: "Descrizione"
    prezzo: 29.99
    quantita: 15
  ) {
    id
    codice
    nome
    descrizione
    prezzo
    quantita
  }
}
```

### Autenticazione

Tutte le operazioni non pubbliche richiedono Basic Auth:

```
Authorization: Basic base64(username:password)
```

In sviluppo, puoi usare `marco:1234`.

## Schema GraphQL

### Tipi principali

#### Product

```graphql
type Product {
  id: ID!
  codice: String!
  nome: String!
  descrizione: String
  prezzo: Float!
  quantita: Int!
}
```

#### User

```graphql
type User {
  id: ID!
  username: String!
  email: String
}
```

_(Sezioni relative a carrelli/ordini rimosse: non utilizzate in questa versione)_

### Query disponibili

- `getProducts: [Product]` - Lista tutti i prodotti
- `getProductById(id: ID!): Product` - Ottieni prodotto per ID
- `getUserById(id: ID!): User` - Ottieni utente per ID

### Mutation disponibili

**Prodotti:**

- `createProduct(...)` - Crea nuovo prodotto
- `updateProduct(...)` - Aggiorna prodotto
- `deleteProduct(id: ID!)` - Elimina prodotto

**Utenti:**

- `createUser(username, password, email)` - Registra nuovo utente

_(Mutations carrello/ordini rimosse: non utilizzate in questa versione)_

## Architettura

```
src/
├── database/
│   └── db.ts              # Pool di connessione MySQL
├── middleware/
│   └── auth.ts            # Middleware Basic Auth
├── models/
│   └── types.ts           # Interfacce TypeScript
├── resolvers/
│   └── index.ts           # Resolver per Query/Mutation
├── schema/
│   └── index.ts           # Definizione schema GraphQL
└── server.ts              # Setup Express + GraphQL

scripts/
└── schema.sql             # DDL database + seed
```

## Sicurezza

- **Autenticazione**: Basic Auth su header `Authorization`
- **Password**: HashateToken con bcrypt (non in chiaro nel database)
- **SQL Injection**: Query parametrizzate con `mysql2`
- **GraphiQL**: Disabilitato in produzione (`NODE_ENV=production`)

## Testing

Per testare manualmente le query GraphQL:

1. Avvia il server: `npm run dev`
2. Vai a `http://localhost:3000/graphql`
3. GraphiQL è disponibile in dev mode

Per autenticarsi in GraphiQL:

- Clicca su "HTTP HEADERS" in basso a sinistra
- Aggiungi:
  ```json
  {
    "Authorization": "Basic dGVzdHVzZXI6dGVzdHBhc3M="
  }
  ```

## Note su versione Node

Usa una versione LTS (es. Node 20/22). Le versioni dispari non entrano in LTS e non sono consigliate per ambienti reali.

## Troubleshooting

**Errore "Connection refused":**

- Verifica che MySQL sia in esecuzione
- Controlla credenziali in `.env`

**Errore "Access denied":**

- Verifica username/password nel `.env`
- Verifica utente MySQL esista e abbia permessi su `magazzino_db`

**GraphQL: "Unauthorized":**

- Verifica header `Authorization` con credenziali valide
- Usa Base64 per encoded `username:password`

## Contatti

Per domande o bug report, contatta il team di sviluppo.

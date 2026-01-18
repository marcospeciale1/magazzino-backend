/**
 * GraphQL Schema
 * Tipi e operazioni per prodotti, utenti e (opzionale) carrelli/ordini.
 * `updateProduct` accetta campi opzionali per aggiornamenti parziali.
 */
import { buildSchema } from "graphql";

export const schema = buildSchema(`
    type Product {
        id: ID!
        codice: String!
        nome: String!
        descrizione: String
        prezzo: Float!
        quantita: Int!
    }

    type User {
        id: ID!
        username: String!
        email: String
    }

    type Query {
        getProducts: [Product]
        getProductById(id: ID!): Product
        getUserById(id: ID!): User
    }

    type Mutation {
        createProduct(codice: String!, nome: String!, descrizione: String, prezzo: Float!, quantita: Int!): Product
        updateProduct(id: ID!, codice: String, nome: String, descrizione: String, prezzo: Float, quantita: Int): Product
        deleteProduct(id: ID!): String

        createUser(username: String!, password: String!, email: String): User
    }
`);

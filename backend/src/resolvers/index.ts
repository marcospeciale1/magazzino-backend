/**
 * Root GraphQL Resolvers
 * Implementa Query/Mutation per prodotti e utenti.
 * Nota: `updateProduct` aggiorna solo i campi forniti (parziali).
 */
import db from "../database/db";
import { Product, User } from "../models/types";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

const root: any = {
  // --- QUERY ---
  getProducts: async () => {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM products");
    return rows;
  },

  getProductById: async (args: { id: string }) => {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM products WHERE id = ?",
      [args.id],
    );
    return rows[0];
  },

  getUserById: async (args: { id: string }) => {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, username, email FROM users WHERE id = ?",
      [args.id],
    );
    return rows[0];
  },

  // --- MUTATION ---
  createProduct: async (args: Product) => {
    const { codice, nome, descrizione, prezzo, quantita } = args;

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO products (codice, nome, descrizione, prezzo, quantita) VALUES (?, ?, ?, ?, ?)",
      [codice, nome, descrizione, prezzo, quantita],
    );

    return { id: result.insertId, codice, nome, descrizione, prezzo, quantita };
  },

  /**
   * Aggiorna un prodotto in modo parziale.
   * Costruisce dinamicamente l'SQL usando solo i campi presenti in `args`.
   */
  updateProduct: async (args: {
    id: string;
    codice?: string;
    nome?: string;
    descrizione?: string;
    prezzo?: number;
    quantita?: number;
  }) => {
    const fields: string[] = [];
    const values: any[] = [];
    if (args.codice !== undefined) {
      fields.push("codice = ?");
      values.push(args.codice);
    }
    if (args.nome !== undefined) {
      fields.push("nome = ?");
      values.push(args.nome);
    }
    if (args.descrizione !== undefined) {
      fields.push("descrizione = ?");
      values.push(args.descrizione);
    }
    if (args.prezzo !== undefined) {
      fields.push("prezzo = ?");
      values.push(args.prezzo);
    }
    if (args.quantita !== undefined) {
      fields.push("quantita = ?");
      values.push(args.quantita);
    }
    if (fields.length > 0) {
      values.push(args.id);
      await db.query(
        "UPDATE products SET " + fields.join(", ") + " WHERE id = ?",
        values,
      );
    }
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM products WHERE id = ?",
      [args.id],
    );
    return rows[0];
  },

  deleteProduct: async (args: { id: string }) => {
    await db.query("DELETE FROM products WHERE id = ?", [args.id]);
    return `Prodotto con ID ${args.id} eliminato.`;
  },

  createUser: async (args: {
    username: string;
    password: string;
    email?: string;
  }) => {
    const { username, password, email } = args;
    // Hash la password con bcrypt (salt rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
      [username, hashedPassword, email],
    );
    return { id: result.insertId, username, email };
  },
};

export default root;

/**
 * MySQL Pool (mysql2)
 * Inizializza un connection pool leggendo variabili d'ambiente.
 * Esporta la versione `promise()` per await/async.
 */
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "magazzino_db",
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
});

// Esportiamo la versione promise
export default pool.promise();

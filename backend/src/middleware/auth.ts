/**
 * Basic Auth Middleware
 * - Decodifica header Authorization: Basic <base64(username:password)>
 * - Recupera utente per username e verifica password:
 *   - Se hashata (bcrypt), usa compare
 *   - Altrimenti confronto diretto
 * - Su successo allega `req.user` e chiama next()
 */
import { Response, NextFunction } from "express";
import { AuthRequest, User } from "../models/types";
import db from "../database/db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn("❌ Auth header mancante");
    return res.status(401).json({ error: "Autorizzazione mancante" });
  }

  // Decodifica Basic Auth
  const auth = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const username = auth[0];
  const password = auth[1];

  console.log(`🔐 Tentativo login per: ${username}`);

  try {
    // Recupera l'utente dal DB per username
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?",
      [username],
    );

    if (rows.length > 0) {
      const user = rows[0];
      console.log(`✅ Utente trovato: ${username}`);

      // Verifica se la password è hashata (bcrypt hash inizia con $2b$ o $2a$)
      const isHashed =
        user.password.startsWith("$2b$") || user.password.startsWith("$2a$");

      console.log(`Password hashata: ${isHashed}`);

      let isPasswordValid = false;

      if (isHashed) {
        // Password hashata - usa bcrypt.compare
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else {
        // Password in chiaro - confronto diretto
        isPasswordValid = password === user.password;
      }

      if (isPasswordValid) {
        console.log(`✅ Password corretta per ${username}`);
        // Assegniamo l'utente alla richiesta
        req.user = user as User;
        next();
      } else {
        console.log(`❌ Password errata per ${username}`);
        return res.status(401).json({ error: "Credenziali non valide" });
      }
    } else {
      console.log(`❌ Utente ${username} non trovato`);
      return res.status(401).json({ error: "Credenziali non valide" });
    }
  } catch (error) {
    console.error("❌ Errore auth:", error);
    return res.status(500).json({ error: "Errore interno server" });
  }
};

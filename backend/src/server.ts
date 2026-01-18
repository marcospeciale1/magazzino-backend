/**
 * Express + GraphQL Server
 * - Configura /graphql con CORS e JSON
 * - Applica auth selettiva: consente `createUser`, richiede Basic Auth per il resto
 */
import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import { schema } from "./schema";
import rootResolver from "./resolvers";
import { authMiddleware } from "./middleware/auth";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/**
 * selectiveAuthMiddleware
 * Applica autenticazione Basic solo alle operazioni non pubbliche.
 * - Ignora preflight OPTIONS
 * - Legge la query GraphQL da body o querystring
 * - Permette mutazioni pubbliche (createUser)
 * - Altrimenti delega ad `authMiddleware`
 */
const selectiveAuthMiddleware = async (req: any, res: any, next: any) => {
  // Gestisci preflight CORS senza body
  if (req.method === "OPTIONS") return next();

  // Leggi query dal body (POST) o dai query params (GET GraphiQL)
  const body = req.body || {};
  const queryString = (body as any).query || (req as any).query?.query;

  // Se non c'è query, lascia passare e delega a graphqlHTTP che risponderà
  if (!queryString || typeof queryString !== "string") {
    return next();
  }

  // Operazioni pubbliche (non richiedono autenticazione)
  const publicMutations = ["createUser"];

  // Controlla se è un'operazione pubblica
  if (publicMutations.some((m) => queryString.includes(m))) {
    return next();
  }

  // Per tutte le altre operazioni, richiedi autenticazione
  authMiddleware(req, res, next);
};

// Auth Middleware applicato su /graphql
// @ts-ignore - fix rapido per compatibilità tipi express/middleware strict
app.use("/graphql", selectiveAuthMiddleware);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: rootResolver,
    graphiql: true,
  }),
);

app.listen(PORT, () => {
  console.log(
    `🚀 Server TypeScript avviato su http://localhost:${PORT}/graphql`,
  );
});

/**
 * ApiService
 * Servizio centralizzato per chiamate GraphQL (prodotti/utenti).
 * Incapsula la POST a /graphql e mappa le risposte tipizzate.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, GraphQLResponse } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/graphql';

  constructor(private http: HttpClient) {}

  /**
   * Esegue una richiesta GraphQL generica.
   * @param query stringa GraphQL (Query/Mutation)
   * @param variables oggetto variabili per la query
   * @returns Observable dei dati tipizzati
   */
  private queryGraphQL<T>(query: string, variables: any = {}): Observable<T> {
    return this.http.post<GraphQLResponse<T>>(this.apiUrl, { query, variables }).pipe(
      map((response) => {
        if (response.errors) {
          throw new Error(response.errors[0].message);
        }
        return response.data;
      }),
    );
  }

  /**
   * Restituisce l'elenco dei prodotti.
   */
  getProducts(): Observable<Product[]> {
    const query = `query { getProducts { id, codice, nome, descrizione, prezzo, quantita } }`;
    return this.queryGraphQL<{ getProducts: Product[] }>(query).pipe(map((res) => res.getProducts));
  }

  /**
   * Crea un nuovo prodotto.
   */
  createProduct(product: Product): Observable<Product> {
    const query = `
      mutation($codice: String!, $nome: String!, $descrizione: String, $prezzo: Float!, $quantita: Int!) {
        createProduct(codice: $codice, nome: $nome, descrizione: $descrizione, prezzo: $prezzo, quantita: $quantita) {
          id, codice, nome, descrizione, prezzo, quantita
        }
      }
    `;
    return this.queryGraphQL<{ createProduct: Product }>(query, product).pipe(
      map((res) => res.createProduct),
    );
  }

  /**
   * Elimina un prodotto per ID.
   */
  deleteProduct(id: string): Observable<string> {
    const query = `mutation($id: ID!) { deleteProduct(id: $id) }`;
    return this.queryGraphQL<{ deleteProduct: string }>(query, { id }).pipe(
      map((res) => res.deleteProduct),
    );
  }

  /**
   * Aggiorna un prodotto (campi opzionali).
   */
  updateProduct(id: string, product: Product): Observable<Product> {
    const query = `
      mutation($id: ID!, $codice: String, $nome: String, $descrizione: String, $prezzo: Float, $quantita: Int) {
        updateProduct(id: $id, codice: $codice, nome: $nome, descrizione: $descrizione, prezzo: $prezzo, quantita: $quantita) {
          id, codice, nome, descrizione, prezzo, quantita
        }
      }
    `;
    return this.queryGraphQL<{ updateProduct: Product }>(query, { id, ...product }).pipe(
      map((res) => res.updateProduct),
    );
  }

  /**
   * Registra un nuovo utente.
   */
  registerUser(username: string, password: string, email: string = ''): Observable<any> {
    const query = `
      mutation($username: String!, $password: String!, $email: String) {
        createUser(username: $username, password: $password, email: $email) {
          id, username, email
        }
      }
    `;
    return this.queryGraphQL<any>(query, { username, password, email: email || null }).pipe(
      map((res) => res.createUser),
    );
  }
}

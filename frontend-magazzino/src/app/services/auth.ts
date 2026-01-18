/**
 * AuthService
 * Gestione credenziali Basic Auth lato frontend.
 * - validateCredentials: prova le credenziali contro /graphql.
 * - login/logout: persiste/rimuove credenziali in localStorage.
 * - getCredentials: recupera credenziali per l'interceptor.
 */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private key = 'auth_credentials';
  private apiUrl = 'http://localhost:3000/graphql';

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  /**
   * Valida le credenziali facendo una richiesta al backend
   */
  validateCredentials(username: string, password: string): Observable<any> {
    const u = username.trim();
    const p = password.trim();
    const credentials = btoa(`${u}:${p}`);
    const query = `query { getProducts { id } }`;

    return this.http.post<any>(
      this.apiUrl,
      { query },
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      },
    );
  }

  login(username: string, pass: string) {
    const u = username.trim();
    const p = pass.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.key, `${u}:${p}`);
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.key);
    }
    this.router.navigate(['/login']);
  }

  getCredentials(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const creds = localStorage.getItem(this.key);
    return creds;
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(this.key);
  }
}

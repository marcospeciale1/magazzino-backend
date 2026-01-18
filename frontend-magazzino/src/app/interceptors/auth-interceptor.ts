import { Injectable } from '@angular/core';
/**
 * AuthInterceptor
 * Intercetta le richieste HTTP e aggiunge l'header Authorization (Basic) se assente.
 * Preserva l'header se già presente.
 */
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const credentials = auth.getCredentials();

  // Se la richiesta ha già un Authorization (es. login), non sovrascrivere
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  if (credentials) {
    // Codifica in Base64 per l'header Basic Auth
    const token = btoa(credentials);

    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Basic ${token}`),
    });
    return next(authReq);
  }

  console.warn('⚠️ Nessuna credenziale trovata! Richiesta senza auth:', req.url);
  return next(req);
};

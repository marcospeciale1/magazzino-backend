/**
 * DashboardComponent
 * Gestione prodotti:
 * - Carica elenco con filtro locale (searchControl)
 * - Crea, modifica (campi opzionali) ed elimina prodotti
 * - Usa ChangeDetectorRef per aggiornare la vista dopo filtri/patch
 */
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Product } from '../../models/product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchControl = new FormControl('');
  editingProductId: string | null = null;

  form = this.fb.group({
    codice: ['', Validators.required],
    nome: ['', Validators.required],
    descrizione: [''],
    prezzo: [0, Validators.required],
    quantita: [0, Validators.required],
  });

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Filtra localmente i prodotti; la subscription viene registrata una sola volta
    this.searchControl.valueChanges.subscribe((searchTerm) => {
      this.filteredProducts = this.products.filter(
        (p) =>
          !searchTerm ||
          p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.codice.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      this.cdr.detectChanges();
    });

    this.loadProducts();
  }

  loadProducts() {
    this.api.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.cdr.detectChanges(); // 🔄 Forza il refresh della vista
      },
      error: (err: any) => {
        console.error('❌ Errore caricamento prodotti:', err);
        if (err.status === 401) {
          console.error('❌ 401 Unauthorized - Logout');
          this.auth.logout();
          this.router.navigate(['/login']);
        } else {
          alert('Errore: ' + (err.error?.message || err.message));
        }
      },
    });
  }

  addProduct() {
    if (!this.form.valid) return;

    const product = this.form.getRawValue() as Product;

    this.api.createProduct(product).subscribe({
      next: () => {
        this.loadProducts();
        this.form.reset();
      },
      error: (err: any) => {
        if (err.status === 401) {
          this.auth.logout();
        }
      },
    });
  }

  deleteProduct(id: string) {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      this.api.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err: any) => alert('Errore eliminazione: ' + err.message),
      });
    }
  }

  startEdit(product: Product) {
    this.editingProductId = product.id || null;
    this.form.patchValue({
      codice: product.codice,
      nome: product.nome,
      descrizione: product.descrizione,
      prezzo: product.prezzo,
      quantita: product.quantita,
    });
  }

  cancelEdit() {
    this.editingProductId = null;
    this.form.reset();
  }

  saveEdit(id: string) {
    if (!this.form.valid) return;

    const product = this.form.getRawValue() as Product;
    product.id = id;

    // Filtra i valori undefined per evitare errori GraphQL
    const cleanProduct = Object.fromEntries(
      Object.entries(product).filter(([_, v]) => v !== undefined && v !== null),
    ) as Product;

    this.api.updateProduct(id, cleanProduct).subscribe({
      next: () => {
        this.loadProducts();
        this.editingProductId = null;
        this.form.reset();
      },
      error: (err: any) => alert('Errore modifica: ' + err.message),
    });
  }

  logout() {
    this.auth.logout();
  }
}

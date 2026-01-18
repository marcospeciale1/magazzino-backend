/**
 * LoginComponent
 * Gestisce autenticazione Basic:
 * - Form reactive con validazione
 * - validateCredentials e salvataggio credenziali
 * - Naviga alla dashboard su successo
 */
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  errorMessage = '';
  loading = false;

  login() {
    if (!this.form.valid) return;

    this.errorMessage = '';
    this.loading = true;

    const { username, password } = this.form.getRawValue();

    this.auth
      .validateCredentials(username!, password!)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          if (response.errors) {
            this.errorMessage = '❌ Username o password incorretti';
          } else {
            this.auth.login(username!, password!);
            this.router.navigate(['/dashboard']);
          }
        },
        error: () => {
          this.errorMessage = '❌ Username o password incorretti';
        },
      });
  }
}

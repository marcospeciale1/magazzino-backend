import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class RegisterComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group(
    {
      username: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', [Validators.required, Validators.minLength(4)]],
      passwordConfirm: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator },
  );

  errorMessage = '';
  loading = false;

  private passwordMatchValidator(group: any) {
    const password = group.get('password')?.value;
    const passwordConfirm = group.get('passwordConfirm')?.value;
    return password === passwordConfirm ? null : { mismatch: true };
  }

  register() {
    if (!this.form.valid) return;

    this.errorMessage = '';
    this.loading = true;

    const { username, password, email } = this.form.getRawValue();

    this.api.registerUser(username!, password!, email || '').subscribe({
      next: () => {
        alert('✅ Registrazione completata! Effettua il login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage =
          'Errore nella registrazione: ' + (err.message || 'Utente già esistente');
        this.loading = false;
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Navbar } from "../../../design/navbar/navbar";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, Navbar],
  template:  `

  <app-navbar></app-navbar>
  <div class="auth-page">
    <div class="auth-card animate-fade-in">
      <div class="auth-logo">
        <span class="logo-mark">S</span>
        <span class="logo-text">SkillSilo</span>
      </div>
      <h1>Welcome back</h1>
      <p class="auth-sub">Sign in to your account to continue</p>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-field">
          <label>Email</label>
          <input type="email" formControlName="email" placeholder="you@example.com" />
        </div>
        <div class="form-field">
          <label>Password</label>
          <input type="password" formControlName="password" placeholder="••••••••" />
        </div>

        <div class="auth-actions">
          <a routerLink="/auth/forgot-password" class="forgot-link">Forgot password?</a>
        </div>

        @if (error) {
          <div class="error-msg">{{ error }}</div>
        }

        <button type="submit" class="btn btn--primary btn--full" [disabled]="loading">
          @if (loading) { <span class="spinner"></span> }
          Sign In
        </button>
      </form>

      <p class="auth-footer">
        Don't have an account?
        <a routerLink="/auth/register">Create one</a>
      </p>
    </div>
  </div>
`,   // keep your template unchanged
  styles: [
    `
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-base);
      padding: 24px;
      background-image: radial-gradient(ellipse at 20% 50%, rgba(245,166,35,0.04) 0%, transparent 60%);
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: 40px;
    }
    .auth-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 32px;
    }
    .logo-mark {
      width: 36px; height: 36px;
      background: var(--accent);
      color: #0e0e0f;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 18px;
    }
    .logo-text {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 20px;
      color: var(--text-primary);
    }
    h1 { font-size: 24px; margin-bottom: 6px; }
    .auth-sub { color: var(--text-secondary); font-size: 14px; margin-bottom: 28px; }
    form { display: flex; flex-direction: column; gap: 16px; }
    .auth-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: -8px;
    }
    .forgot-link {
      font-size: 13px;
      color: var(--accent);
      transition: opacity var(--transition);
    }
    .forgot-link:hover { opacity: 0.8; }
    .btn--full { width: 100%; justify-content: center; padding: 13px; font-size: 15px; }
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: var(--text-secondary);
    }
    .auth-footer a {
      color: var(--accent);
      font-weight: 500;
      margin-left: 4px;
    }
    .spinner { width: 16px; height: 16px; }
  `
  ]    // keep your styles unchanged
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.toast.success('Welcome back!');
      },
      error: (e) => {
        this.error = e.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}





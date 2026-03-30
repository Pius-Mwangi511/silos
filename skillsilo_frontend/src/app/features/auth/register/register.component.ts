import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
  <div class="auth-page">
    <div class="auth-card animate-fade-in">
      <div class="auth-logo">
        <span class="logo-mark">S</span>
        <span class="logo-text">SkillSilo</span>
      </div>

      <h1>Create account</h1>
      <p class="auth-sub">Join SkillSilo and start learning</p>

      <form [formGroup]="form" (ngSubmit)="submit()">

        <!-- NAME + PHONE -->
        <div class="form-row">
          <div class="form-field">
            <label>Full Name</label>
            <input type="text" formControlName="name" placeholder="John Doe" />
            <small *ngIf="form.get('name')?.touched && form.get('name')?.invalid">
              Name is required
            </small>
          </div>

          <div class="form-field">
            <label>Phone</label>
            <input type="tel" formControlName="phone" placeholder="+254 712 345678" />
            <small *ngIf="form.get('phone')?.touched && form.get('phone')?.invalid">
              Phone is required
            </small>
          </div>
        </div>

        <!-- EMAIL -->
        <div class="form-field">
          <label>Email</label>
          <input type="email" formControlName="email" placeholder="you@example.com" />
          <small *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
            Enter a valid email
          </small>
        </div>

        <!-- PASSWORD -->
        <div class="form-field">
          <label>Password</label>
          <input type="password" formControlName="password" placeholder="Min. 6 characters" />
          <small *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
            Password must be at least 6 characters
          </small>
        </div>

        <!-- ERROR -->
        <div *ngIf="error" class="error-msg">{{ error }}</div>

        <!-- BUTTON -->
        <button 
          type="submit" 
          class="btn btn--primary btn--full"
          [disabled]="loading || form.invalid">

          <span *ngIf="loading" class="spinner"></span>
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <p class="auth-footer">
        Already have an account?
        <a routerLink="/auth/login">Sign in</a>
      </p>
    </div>
  </div>
  `,
  styles: [`
  .auth-page {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    background-image: radial-gradient(ellipse at 80% 20%, rgba(245,166,35,0.04) 0%, transparent 60%);
  }

  .auth-card {
    width: 100%; max-width: 460px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 40px;
  }

  .auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }

  .logo-mark {
    width: 36px; height: 36px;
    background: var(--accent);
    color: #0e0e0f;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800;
  }

  .logo-text { font-weight: 700; font-size: 20px; }

  h1 { font-size: 24px; margin-bottom: 6px; }

  .auth-sub {
    color: var(--text-secondary);
    font-size: 14px;
    margin-bottom: 24px;
  }

  form { display: flex; flex-direction: column; gap: 14px; }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .form-field { display: flex; flex-direction: column; }

  .form-field small {
    color: #ff6b6b;
    font-size: 12px;
    margin-top: 4px;
  }

  .error-msg {
    color: #ff6b6b;
    font-size: 13px;
    text-align: center;
  }

  .btn--full {
    width: 100%;
    justify-content: center;
    padding: 13px;
    font-size: 15px;
  }

  .auth-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: var(--text-secondary);
  }

  .auth-footer a {
    color: var(--accent);
    font-weight: 500;
    margin-left: 4px;
  }

  .spinner {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 480px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
  `]
})
export class RegisterComponent implements OnInit {

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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    this.auth.register(this.form.value).subscribe({
      next: (res) => {
        // ✅ Save token + user
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user));

        // ✅ UX improvement (email verification awareness)
        this.toast.success('Account created! Check your email to verify 📩');

        // 👉 redirect to verify email page (recommended)
        this.router.navigate(['/auth/verify-email']);
      },
      error: (e) => {
        this.error = e.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
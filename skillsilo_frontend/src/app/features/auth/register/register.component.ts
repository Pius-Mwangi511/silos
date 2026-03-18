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
        <div class="form-row">
          <div class="form-field">
            <label>Full Name</label>
            <input type="text" formControlName="name" placeholder="John Doe" />
          </div>
          <div class="form-field">
            <label>Phone</label>
            <input type="tel" formControlName="phone" placeholder="+1 555 0000" />
          </div>
        </div>
        <div class="form-field">
          <label>Email</label>
          <input type="email" formControlName="email" placeholder="you@example.com" />
        </div>
        <div class="form-field">
          <label>Password</label>
          <input type="password" formControlName="password" placeholder="Min. 6 characters" />
        </div>
        <div class="form-field">
          <label>Bio <span class="optional">(optional)</span></label>
          <textarea formControlName="bio" placeholder="Tell the community about yourself..."></textarea>
        </div>
  
        @if (error) { <div class="error-msg">{{ error }}</div> }
  
        <button type="submit" class="btn btn--primary btn--full" [disabled]="loading">
          @if (loading) { <span class="spinner"></span> }
          Create Account
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
    width: 36px; height: 36px; background: var(--accent); color: #0e0e0f;
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 800; font-size: 18px;
  }
  .logo-text { font-family: var(--font-display); font-weight: 700; font-size: 20px; }
  h1 { font-size: 24px; margin-bottom: 6px; }
  .auth-sub { color: var(--text-secondary); font-size: 14px; margin-bottom: 24px; }
  form { display: flex; flex-direction: column; gap: 14px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .optional { color: var(--text-muted); font-weight: 400; text-transform: none; letter-spacing: 0; }
  .btn--full { width: 100%; justify-content: center; padding: 13px; font-size: 15px; }
  .auth-footer { text-align: center; margin-top: 20px; font-size: 14px; color: var(--text-secondary); }
  .auth-footer a { color: var(--accent); font-weight: 500; margin-left: 4px; }
  .spinner { width: 16px; height: 16px; }
  @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
  `]   // keep your styles unchanged
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
      phone: ['', Validators.required],
      bio: ['']
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    this.auth.register(this.form.value as any).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.toast.success('Account created! Welcome to SkillSilo 🎉');
      },
      error: (e) => {
        this.error = e.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}






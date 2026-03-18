import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card animate-fade-in">
        <div class="auth-logo">
          <span class="logo-mark">S</span>
          <span class="logo-text">SkillSilo</span>
        </div>
        <h1>New password</h1>
        <p class="auth-sub">Enter your new password below.</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-field">
            <label>New Password</label>
            <input type="password" formControlName="newPassword" placeholder="Min. 6 characters" />
          </div>
          @if (error) { <div class="error-msg">{{ error }}</div> }
          <button type="submit" class="btn btn--primary btn--full" [disabled]="loading">
            @if (loading) { <span class="spinner"></span> }
            Reset Password
          </button>
        </form>
        <p class="auth-footer"><a routerLink="/auth/login">← Back to login</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .auth-card { width: 100%; max-width: 420px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 40px; }
    .auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
    .logo-mark { width: 36px; height: 36px; background: var(--accent); color: #0e0e0f; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 800; font-size: 18px; }
    .logo-text { font-family: var(--font-display); font-weight: 700; font-size: 20px; }
    h1 { font-size: 24px; margin-bottom: 6px; }
    .auth-sub { color: var(--text-secondary); font-size: 14px; margin-bottom: 24px; }
    form { display: flex; flex-direction: column; gap: 16px; }
    .btn--full { width: 100%; justify-content: center; padding: 13px; font-size: 15px; }
    .auth-footer { text-align: center; margin-top: 20px; font-size: 14px; }
    .auth-footer a { color: var(--accent); }
    .spinner { width: 16px; height: 16px; }
  `]
})
export class ResetPasswordComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  error = '';
  private token = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    if (this.form.invalid || !this.token) return;

    this.loading = true;
    this.error = '';

    this.auth.resetPassword({
      token: this.token,
      newPassword: this.form.value.newPassword!
    }).subscribe({
      next: () => {
        this.toast.success('Password reset! Please log in.');
        this.router.navigate(['/auth/login']);
      },
      error: (e) => {
        this.error = e.error?.message || 'Reset failed';
        this.loading = false;
      }
    });
  }
}
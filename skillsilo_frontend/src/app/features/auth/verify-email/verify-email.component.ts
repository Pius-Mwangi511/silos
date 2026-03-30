import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card animate-fade-in">
        <div class="auth-logo">
          <span class="logo-mark">S</span>
          <span class="logo-text">SkillSilo</span>
        </div>

        <div *ngIf="!success && !loading" class="state">
          <h2>Verify Your Email</h2>
          <p>Enter the token sent to your email after registration.</p>
          <input type="text" [(ngModel)]="token" placeholder="Verification token" class="input" />
          <button class="btn btn--primary" (click)="verifyEmail()" [disabled]="loading || !token">
  <span *ngIf="loading" class="spinner-small"></span>
  {{ loading ? 'Verifying…' : 'Verify Email' }}
</button>
          <p class="error" *ngIf="error">{{ error }}</p>
        </div>

        <div *ngIf="loading" class="state">
          <span class="spinner big"></span>
          <p>Verifying your email…</p>
        </div>

        <div *ngIf="success" class="state">
          <span class="icon">✅</span>
          <h2>Email Verified!</h2>
          <p>Your account is now active.</p>
          <a routerLink="/auth/login" class="btn btn--primary">Continue to Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .auth-card { width: 100%; max-width: 420px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 40px; }
    .auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
    .logo-mark { width: 36px; height: 36px; background: var(--accent); color: #0e0e0f; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 800; font-size: 18px; }
    .logo-text { font-family: var(--font-display); font-weight: 700; font-size: 20px; }
    .state { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; padding: 16px 0; }
    .icon { font-size: 48px; }
    h2 { font-size: 22px; }
    p { color: var(--text-secondary); }
    .input { width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 12px; }
    .btn { padding: 8px 16px; cursor: pointer; }
    .spinner { width: 32px; height: 32px; border: 4px solid var(--accent); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; }
    .spinner.big { width: 36px; height: 36px; border-width: 3px; }
    .error { color: red; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid var(--accent);
  border-top-color: transparent;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class VerifyEmailComponent {
  token = '';
  loading = false;
  success = false;
  error = '';

  constructor(private auth: AuthService) {}

  verifyEmail() {
    if (!this.token) return;
    this.loading = true;
    this.error = '';

    this.auth.verifyEmail({ token: this.token }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
      },
      error: (e) => {
        this.loading = false;
        this.error = e.error?.message || 'Invalid or expired token.';
      }
    });
  }
}
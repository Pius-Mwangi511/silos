import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card animate-fade-in">
        <div class="auth-logo">
          <span class="logo-mark">S</span>
          <span class="logo-text">SkillSilo</span>
        </div>
        @if (loading) {
          <div class="state"><span class="spinner big"></span><p>Verifying your email…</p></div>
        } @else if (success) {
          <div class="state">
            <span class="icon">✅</span>
            <h2>Email Verified!</h2>
            <p>Your account is now active.</p>
            <a routerLink="/auth/login" class="btn btn--primary">Continue to Login</a>
          </div>
        } @else {
          <div class="state">
            <span class="icon">❌</span>
            <h2>Verification Failed</h2>
            <p>{{ error }}</p>
            <a routerLink="/auth/login" class="btn btn--ghost">Back to Login</a>
          </div>
        }
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
    .spinner { width: 32px; height: 32px; }
    .spinner.big { width: 36px; height: 36px; border-width: 3px; }
  `]
})
export class VerifyEmailComponent implements OnInit {
  loading = true; success = false; error = '';

  constructor(private auth: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!token) { this.loading = false; this.error = 'No verification token provided.'; return; }
    this.auth.verifyEmail({ token }).subscribe({
      next: () => { this.loading = false; this.success = true; },
      error: (e) => { this.loading = false; this.error = e.error?.message || 'Invalid or expired token.'; }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <!-- TOP BAR -->
    <div class="top-bar">
      🌟 Welcome to <strong>SkillSilo</strong> — Where Skills Meet Community.
      <a routerLink="/manysilos">Join Free Today →</a>
    </div>

    <!-- NAVBAR -->
    <nav id="navbar" [class.scrolled]="scrolled">
      <a routerLink="/homepage" class="nav-logo">
        <div class="logo-icon">S</div>
        <span class="logo-text">Skill<span>Silo</span></span>
      </a>

      <ul class="nav-links">
        <li><a routerLink="/homepage"  routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a></li>
        <li><a routerLink="/manysilos" routerLinkActive="active">Silos</a></li>
        <li><a routerLink="/about"     routerLinkActive="active">About</a></li>
        <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
        <li><a routerLink="/contact"   routerLinkActive="active">Contact</a></li>
      </ul>

      <div class="nav-actions">

        <!-- ── Logged IN ── -->
        <ng-container *ngIf="isLoggedIn">
          <div class="user-chip">
            <div class="user-avatar">{{ initials }}</div>
            <span class="user-name">{{ firstName }}</span>
          </div>
          <button class="btn btn-ghost" (click)="logout()">Log Out</button>
        </ng-container>

        <!-- ── Logged OUT ── -->
        <ng-container *ngIf="!isLoggedIn">
          <button class="btn btn-ghost" routerLink="/auth/login">Log In</button>
          <button class="btn btn-primary" routerLink="/manysilos">Get Started →</button>
        </ng-container>

      </div>
    </nav>
  `,
  styles: `
    :root {
      --yellow: #F5C518; --yellow-light: #FFE066; --yellow-dark: #D4A800;
      --dark: #0D0D0D; --dark2: #141414; --dark3: #1E1E1E;
      --gray: #2A2A2A; --gray2: #3A3A3A; --text: #F0F0F0;
      --text-muted: #8A8A8A; --text-sub: #B0B0B0; --white: #FFFFFF;
      --card-bg: #181818; --border: rgba(255,255,255,0.07);
      --yellow-glow: 0 0 40px rgba(245,197,24,0.25);
      --radius: 16px; --radius-sm: 8px;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; background: var(--dark); color: var(--text); overflow-x: hidden; line-height: 1.6; }
    h1,h2,h3,h4,h5 { font-family: 'Syne', sans-serif; line-height: 1.15; }
    .display-font { font-family: 'Clash Display', sans-serif; }

    /* ── Top bar ── */
    .top-bar {
      background: var(--yellow); color: var(--dark);
      text-align: center; padding: 8px 20px;
      font-size: 13px; font-weight: 500; letter-spacing: 0.02em;
    }
    .top-bar a { color: var(--dark); font-weight: 700; text-decoration: underline; }

    /* ── Navbar ── */
    nav {
      position: sticky; top: 0; z-index: 1000;
      background: rgba(13,13,13,0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      padding: 0 48px;
      display: flex; align-items: center; justify-content: space-between;
      height: 72px; transition: box-shadow 0.3s;
    }
    nav.scrolled { box-shadow: 0 4px 40px rgba(0,0,0,0.5); }

    /* ── Logo ── */
    .nav-logo {
      display: flex; align-items: center; gap: 10px;
      cursor: pointer; text-decoration: none;
    }
    .logo-icon {
      width: 38px; height: 38px; background: var(--yellow);
      border-radius: 10px; display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-family: 'Syne', sans-serif; font-weight: 800; color: var(--dark);
    }
    .logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; color: var(--white); letter-spacing: -0.5px; }
    .logo-text span { color: var(--yellow); }

    /* ── Nav links ── */
    .nav-links { display: flex; align-items: center; gap: 4px; list-style: none; }
    .nav-links li a {
      padding: 8px 16px; border-radius: 8px;
      color: var(--text-sub); text-decoration: none;
      font-size: 15px; font-weight: 500;
      transition: all 0.2s; cursor: pointer; display: block;
    }
    .nav-links li a:hover { color: var(--white); background: var(--gray); }

    /* Active link — RouterLinkActive injects this class */
    .nav-links li a.active {
      color: var(--yellow) !important;
      background: rgba(245,197,24,0.1) !important;
    }

    /* ── Nav actions ── */
    .nav-actions { display: flex; align-items: center; gap: 12px; }

    /* ── Buttons ── */
    .btn {
      padding: 10px 24px; border-radius: 10px;
      font-weight: 600; font-size: 14px; cursor: pointer;
      transition: all 0.2s; border: none;
      font-family: 'DM Sans', sans-serif; text-decoration: none;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .btn-ghost {
      background: transparent; color: var(--text-sub);
      border: 1px solid var(--border);
    }
    .btn-ghost:hover { color: var(--white); border-color: var(--gray2); background: var(--gray); }
    .btn-primary { background: var(--yellow); color: var(--dark); }
    .btn-primary:hover { background: var(--yellow-light); box-shadow: var(--yellow-glow); transform: translateY(-1px); }
    .btn-outline { background: transparent; color: var(--yellow); border: 2px solid var(--yellow); }
    .btn-outline:hover { background: var(--yellow); color: var(--dark); }
    .btn-lg { padding: 14px 32px; font-size: 16px; border-radius: 12px; }
    .btn-dark { background: var(--gray); color: var(--text); border: 1px solid var(--border); }
    .btn-dark:hover { background: var(--gray2); }

    /* ── User chip shown when logged in ── */
    .user-chip {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 14px 6px 6px;
      background: rgba(245,197,24,0.08);
      border: 1px solid rgba(245,197,24,0.2);
      border-radius: 100px; cursor: default;
    }
    .user-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--yellow); color: var(--dark);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 800;
      font-family: 'Syne', sans-serif;
    }
    .user-name { font-size: 13px; font-weight: 600; color: var(--white); }

    /* ── Shared helpers (used by pages that consume this navbar) ── */
    .page { display: none; }
    .page.active { display: block; }
    .section { padding: 100px 0; }
    .section-sm { padding: 60px 0; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
    .container-wide { max-width: 1400px; margin: 0 auto; padding: 0 48px; }
    .tag { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; background: rgba(245,197,24,0.12); color: var(--yellow); border: 1px solid rgba(245,197,24,0.25); margin-bottom: 20px; }
    .section-title { font-size: clamp(32px, 4vw, 52px); font-weight: 700; margin-bottom: 16px; }
    .section-sub { font-size: 17px; color: var(--text-sub); max-width: 560px; line-height: 1.7; }
    .yellow { color: var(--yellow); }
    .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; transition: all 0.3s; }
    .card:hover { border-color: rgba(245,197,24,0.3); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4), var(--yellow-glow); }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

    /* ── Mobile ── */
    @media (max-width: 900px) {
      nav { padding: 0 20px; }
      .nav-links { display: none; }
      .user-name { display: none; }
    }
  `
})
export class Navbar implements OnInit {

  scrolled = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    window.addEventListener('scroll', () => {
      this.scrolled = window.scrollY > 10;
    });
  }

  get isLoggedIn(): boolean {
    // Read directly from localStorage — same key auth.service.ts uses
    return !!localStorage.getItem('ss_token');
  }

  get firstName(): string {
    return this.auth.currentUser?.name?.split(' ')[0] || 'You';
  }

  get initials(): string {
    return this.auth.currentUser?.name
      ?.split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  }

  logout() {
    this.auth.logout(); // clears ss_token, ss_user, navigates to /auth/login
  }
}
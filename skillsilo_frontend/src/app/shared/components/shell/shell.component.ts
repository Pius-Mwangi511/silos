import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { Notification } from '../../models';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="shell">

      <!-- ── Sidebar ── -->
      <aside class="sidebar">
        <div class="sidebar-top">

          <!-- Brand -->
          <a routerLink="/dashboard" class="brand">
            <span class="brand-mark">S</span>
            <span class="brand-name">SkillSilo</span>
          </a>

          <!-- App navigation -->
          <div class="nav-section">
            <div class="nav-label">App</div>
            <nav class="nav">
              <a routerLink="/dashboard"
                 routerLinkActive="active"
                 [routerLinkActiveOptions]="{exact:true}"
                 class="nav-item">
                <span class="nav-icon">📊</span> Dashboard
              </a>
              <a routerLink="/silos"
                 routerLinkActive="active"
                 class="nav-item">
                <span class="nav-icon">🏛️</span> Silos
              </a>
              <a routerLink="/cross-silo"
                 routerLinkActive="active"
                 class="nav-item">
                <span class="nav-icon">🌐</span> Cross-Silo
              </a>
              <a routerLink="/consultations"
                 routerLinkActive="active"
                 class="nav-item">
                <span class="nav-icon">💬</span> Consultations
              </a>
              <a routerLink="/notifications"
                 routerLinkActive="active"
                 class="nav-item">
                <span class="nav-icon">🔔</span> Notifications
                <span *ngIf="unreadCount > 0" class="badge-dot">
                  {{ unreadCount }}
                </span>
              </a>
            </nav>
          </div>

          <!-- Public page links -->
          <div class="nav-section">
            <div class="nav-label">Pages</div>
            <nav class="nav">
              <a routerLink="/homepage" class="nav-item nav-item--public">
                <span class="nav-icon">🏠</span> Home
              </a>
              <a routerLink="/manysilos" class="nav-item nav-item--public">
                <span class="nav-icon">🔍</span> Browse Silos
              </a>
              <a routerLink="/about" class="nav-item nav-item--public">
                <span class="nav-icon">ℹ️</span> About
              </a>
              <a routerLink="/contact" class="nav-item nav-item--public">
                <span class="nav-icon">✉️</span> Contact
              </a>
            </nav>
          </div>

        </div>

        <!-- Sidebar bottom — profile + logout -->
        <div class="sidebar-bottom">
          <a routerLink="/profile" routerLinkActive="active" class="profile-link">
            <div class="avatar">{{ initials }}</div>
            <div class="profile-info">
              <span class="profile-name">{{ user?.name }}</span>
              <span class="profile-role">{{ user?.role | titlecase }}</span>
            </div>
          </a>

          <button class="logout-btn" (click)="logout()" title="Sign out">
            ↩
          </button>
        </div>
      </aside>

      <!-- ── Main content ── -->
      <main class="main">
        <div class="main-inner">
          <router-outlet></router-outlet>
        </div>
      </main>

    </div>
  `,
  styles: [`
    .shell {
      display: flex;
      min-height: 100vh;
    }

    /* ── Sidebar ── */
    .sidebar {
      width: 240px;
      background: var(--bg-surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px 12px;
      height: 100vh;
      position: sticky;
      top: 0;
      overflow-y: auto;
      flex-shrink: 0;
    }

    .sidebar-top {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      padding: 4px 8px;
    }
    .brand-mark {
      width: 32px; height: 32px;
      background: var(--accent);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 16px;
      color: var(--bg-primary);
      flex-shrink: 0;
    }
    .brand-name {
      font-weight: 800;
      font-size: 16px;
      color: var(--text-primary);
    }

    /* Nav sections */
    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .nav-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      padding: 0 10px;
      margin-bottom: 2px;
    }

    /* Nav links */
    .nav {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      border-radius: 8px;
      text-decoration: none;
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 500;
      transition: all 0.15s;
    }
    .nav-item:hover {
      background: var(--bg-elevated);
      color: var(--text-primary);
    }
    .nav-item.active {
      background: var(--accent-dim);
      color: var(--accent);
      font-weight: 600;
    }

    /* Public page links — slightly muted to differentiate */
    .nav-item--public {
      font-size: 13px;
      color: var(--text-muted);
    }
    .nav-item--public:hover {
      color: var(--text-secondary);
      background: var(--bg-elevated);
    }

    .nav-icon { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; }

    .badge-dot {
      margin-left: auto;
      background: var(--accent);
      color: var(--bg-primary);
      padding: 2px 7px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
    }

    /* Divider between nav sections */
    .nav-divider {
      height: 1px;
      background: var(--border);
      margin: 4px 10px;
    }

    /* ── Sidebar bottom ── */
    .sidebar-bottom {
      border-top: 1px solid var(--border);
      padding-top: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .profile-link {
      display: flex;
      gap: 10px;
      align-items: center;
      flex: 1;
      text-decoration: none;
      padding: 6px 8px;
      border-radius: 8px;
      transition: background 0.15s;
    }
    .profile-link:hover { background: var(--bg-elevated); }
    .profile-link.active { background: var(--accent-dim); }

    .avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--accent-dim);
      color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px;
      flex-shrink: 0;
      border: 2px solid var(--accent);
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .profile-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .profile-role {
      font-size: 11px;
      color: var(--text-muted);
    }

    .logout-btn {
      border: 1px solid var(--border);
      background: transparent;
      cursor: pointer;
      padding: 7px 10px;
      color: var(--text-muted);
      border-radius: 8px;
      font-size: 16px;
      flex-shrink: 0;
      transition: all 0.15s;
    }
    .logout-btn:hover {
      background: rgba(248,113,113,0.1);
      color: #f87171;
      border-color: rgba(248,113,113,0.3);
    }

    /* ── Main content ── */
    .main {
      flex: 1;
      min-width: 0;       /* prevents flex child from overflowing */
      overflow-y: auto;
    }

    .main-inner {
      padding: 40px;
      max-width: 1200px;
    }

    /* ── Mobile ── */
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main-inner { padding: 20px; }
    }
  `]
})
export class ShellComponent implements OnInit {

  user: any = null;
  unreadCount = 0;

  constructor(
    private auth: AuthService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser;

    this.api.getNotifications().subscribe({
      next: (n: Notification[]) => {
        this.unreadCount = n.filter(x => !x.isRead).length;
      },
      error: () => {}
    });
  }

  get initials(): string {
    return this.user?.name
      ? this.user.name
          .split(' ')
          .map((w: string) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'U';
  }

  logout(): void {
    this.auth.logout();
  }
}
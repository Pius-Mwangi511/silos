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
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-top">
          <a routerLink="/dashboard" class="brand">
          
            <span class="brand-mark">S</span>
            <span class="brand-name" >SkillSilo</span>
            
          </a>

          <nav class="nav">
            <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-item">
              Dashboard
            </a>

            <a routerLink="/silos" routerLinkActive="active" class="nav-item">
              Silos
            </a>

            <a routerLink="/cross-silo" routerLinkActive="active" class="nav-item">
              Cross-Silo
            </a>

            <a routerLink="/consultations" routerLinkActive="active" class="nav-item">
              Consultations
            </a>

            <a routerLink="/notifications" routerLinkActive="active" class="nav-item">
              Notifications
              <span *ngIf="unreadCount > 0" class="badge-dot">
                {{ unreadCount }}
              </span>
            </a>
          </nav>
        </div>

        <div class="sidebar-bottom">
          <a routerLink="/profile" routerLinkActive="active" class="profile-link">
            <div class="avatar">{{ initials }}</div>

            <div class="profile-info">
              <span class="profile-name">{{ user?.name }}</span>
              <!-- <span class="profile-email">{{ user?.email }}</span> -->
            </div>
          </a>

          <button class="logout-btn" (click)="logout()" title="Sign out">
            Logout
          </button>
        </div>
      </aside>

      <!-- Main -->
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

    .sidebar {
      width: 240px;
      background: var(--bg-surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px 12px;
      height: 100vh;
    }

    .sidebar-top {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      padding: 10px;
      border-radius: 8px;
      text-decoration: none;
      color: var(--text-secondary);
    }

    .nav-item.active {
      background: var(--accent-dim);
      color: var(--accent);
    }

    .badge-dot {
      margin-left: auto;
      background: var(--accent);
      padding: 2px 6px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
    }

    .sidebar-bottom {
      border-top: 1px solid var(--border);
      padding-top: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .profile-link {
      display: flex;
      gap: 10px;
      align-items: center;
      flex: 1;
      text-decoration: none;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--accent-dim);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
    }

    .logout-btn {
      border: none;
      background: yellow;
      cursor: pointer;
      padding: 6px;
      color: black;
    }

    .main {
      flex: 1;
    }

    .main-inner {
      padding: 40px;
      max-width: 1200px;
    }

    @media (max-width: 768px) {
      .sidebar {
        display: none;
      }

      .main-inner {
        padding: 20px;
      }
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

    // FIX: assign user after auth service is initialized
    this.user = this.auth.currentUser;

    this.api.getNotifications().subscribe({
      next: (n: Notification[]) => {
        this.unreadCount = n.filter(x => !x.read).length;
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
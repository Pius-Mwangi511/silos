import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Silo, Notification } from '../../shared/models';
import { Navbar } from "../../design/navbar/navbar";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar],
  template: `
    <app-navbar></app-navbar>
    <div class="animate-fade-in">
      <div class="welcome">
        <div>
          <h1>Good {{ greeting }}, {{ firstName }} 👋</h1>
          <p>Here's what's happening in your silos today.</p>
        </div>
        <a routerLink="/silos" class="btn btn--primary">Browse Silos</a>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-icon">🏛️</span>
          <div>
            <div class="stat-num">{{ silos.length }}</div>
            <div class="stat-label">Total Silos</div>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🔔</span>
          <div>
            <div class="stat-num">{{ unreadNotifs }}</div>
            <div class="stat-label">Unread Alerts</div>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🌐</span>
          <div>
            <div class="stat-num">{{ crossSiloCount }}</div>
            <div class="stat-label">Open Requests</div>
          </div>
        </div>
      </div>

      <div class="two-col">
        <!-- Recent Silos -->
        <section>
          <div class="section-header">
            <h2>Recent Silos</h2>
            <a routerLink="/silos" class="see-all">See all →</a>
          </div>
          @if (loadingSilos) {
            <div class="loading-row">
              <span class="spinner"></span> Loading silos…
            </div>
          } @else if (silos.length === 0) {
            <div class="empty-state">
              <div class="icon">🏛️</div>
              <h3>No silos yet</h3>
              <a routerLink="/silos" class="btn btn--ghost" style="margin-top:8px">Explore Silos</a>
            </div>
          } @else {
            <div class="silo-list">
              @for (s of silos.slice(0,5); track s.id) {
                <a [routerLink]="['/silos', s.id]" class="silo-row">
                  <div class="silo-row-left">
                    <div class="silo-icon">{{ s.skill[0].toUpperCase() }}</div>
                    <div>
                      <div class="silo-name">{{ s.skill }}</div>
                      <div class="silo-meta">{{ s._count?.members ?? 0 }} members</div>
                    </div>
                  </div>
                  <span class="badge badge--muted">{{ s.level }}</span>
                </a>
              }
            </div>
          }
        </section>

        <!-- Recent Notifications -->
        <section>
          <div class="section-header">
            <h2>Notifications</h2>
            <a routerLink="/notifications" class="see-all">See all →</a>
          </div>
          @if (notifications.length === 0) {
            <div class="empty-state">
              <div class="icon">🔔</div>
              <h3>All caught up!</h3>
            </div>
          } @else {
            <div class="notif-list">
              @for (n of notifications.slice(0,5); track n.id) {
                <div class="notif-row" [class.unread]="!n.read">
                  <div class="notif-dot" [class.active]="!n.read"></div>
                  <p>{{ n.message }}</p>
                </div>
              }
            </div>
          }
        </section>
      </div>
    </div>
  `,
  styles: [`
    .welcome {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 32px; flex-wrap: wrap; gap: 16px;
    }
    .welcome h1 { font-size: 28px; margin-bottom: 4px; }
    .welcome p { color: var(--text-secondary); font-size: 14px; }
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-card {
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px 24px;
      display: flex; align-items: center; gap: 16px;
    }
    .stat-icon { font-size: 28px; }
    .stat-num { font-family: var(--font-display); font-size: 28px; font-weight: 800; line-height: 1; }
    .stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .section-header h2 { font-size: 16px; }
    .see-all { font-size: 13px; color: var(--accent); }
    .see-all:hover { opacity: 0.8; }
    .silo-list { display: flex; flex-direction: column; gap: 6px; }
    .silo-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 14px; border-radius: var(--radius);
      background: var(--bg-surface); border: 1px solid var(--border-subtle);
      transition: all var(--transition);
    }
    .silo-row:hover { border-color: var(--border); background: var(--bg-elevated); }
    .silo-row-left { display: flex; align-items: center; gap: 12px; }
    .silo-icon {
      width: 34px; height: 34px; border-radius: 8px;
      background: var(--accent-dim); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display); font-weight: 700; font-size: 15px;
    }
    .silo-name { font-size: 14px; font-weight: 600; }
    .silo-meta { font-size: 12px; color: var(--text-muted); }
    .notif-list { display: flex; flex-direction: column; gap: 8px; }
    .notif-row {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px 14px; border-radius: var(--radius);
      background: var(--bg-surface); border: 1px solid var(--border-subtle);
      font-size: 13px; color: var(--text-secondary);
    }
    .notif-row.unread { background: var(--bg-elevated); color: var(--text-primary); }
    .notif-dot {
      width: 7px; height: 7px; border-radius: 50%; margin-top: 4px;
      background: var(--border); flex-shrink: 0;
    }
    .notif-dot.active { background: var(--accent); }
    .loading-row {
      display: flex; align-items: center; gap: 10px;
      color: var(--text-secondary); font-size: 14px; padding: 20px 0;
    }
    @media (max-width: 900px) { .stats-row { grid-template-columns: 1fr 1fr; } .two-col { grid-template-columns: 1fr; } }
    @media (max-width: 500px) { .stats-row { grid-template-columns: 1fr; } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  silos: Silo[] = [];
  notifications: Notification[] = [];
  crossSiloCount = 0;
  loadingSilos = true;

  get greeting() {
    const h = new Date().getHours();
    return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  }
  get firstName() { return this.auth.currentUser?.name?.split(' ')[0] || 'there'; }
  get unreadNotifs() { return this.notifications.filter(n => !n.read).length; }

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    this.api.getSilos().subscribe({ next: s => { this.silos = s; this.loadingSilos = false; }, error: () => this.loadingSilos = false });
    this.api.getNotifications().subscribe({ next: n => this.notifications = n, error: () => {} });
    this.api.getAllCrossSiloRequests().subscribe({ next: r => this.crossSiloCount = r.length, error: () => {} });
  }
}

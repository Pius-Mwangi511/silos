import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Notification } from '../../shared/models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in">
      <div class="page-header">
        <div>
          <h1>Notifications</h1>
          <p>{{ unreadCount }} unread</p>
        </div>
        <button
          *ngIf="unreadCount > 0"
          class="btn btn--ghost"
          [disabled]="markingAll"
          (click)="markAllRead()">
          {{ markingAll ? 'Marking…' : 'Mark all as read' }}
        </button>
      </div>

      <div *ngIf="loading" class="loading-row">
        <span class="spinner"></span> Loading…
      </div>

      <div *ngIf="!loading && notifications.length === 0" class="empty-state">
        <div class="icon">🔔</div>
        <h3>All caught up!</h3>
        <p>No notifications yet.</p>
      </div>

      <div *ngIf="!loading && notifications.length > 0" class="notif-list">
        <div
          *ngFor="let n of notifications"
          class="notif-card"
          [class.unread]="!n.isRead">

          <div class="notif-left">
            <div class="notif-dot" [class.active]="!n.isRead"></div>
            <div>
              <p class="notif-msg">{{ n.message }}</p>
              <span class="notif-date">{{ n.createdAt | date:'medium' }}</span>
            </div>
          </div>

          <div class="notif-actions">
            <button
              *ngIf="!n.isRead"
              class="icon-btn"
              title="Mark as read"
              (click)="markRead(n)">✓</button>
            <button
              class="icon-btn danger"
              title="Delete"
              (click)="deleteNotif(n.id)">✕</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex; align-items: flex-start;
      justify-content: space-between; margin-bottom: 28px;
      flex-wrap: wrap; gap: 16px;
    }
    .page-header h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .page-header p { font-size: 14px; color: var(--text-secondary); }

    .loading-row {
      display: flex; align-items: center; gap: 10px;
      color: var(--text-secondary); padding: 32px 0;
    }

    .empty-state {
      text-align: center; padding: 48px 20px; color: var(--text-secondary);
    }
    .empty-state .icon { font-size: 40px; margin-bottom: 12px; }
    .empty-state h3 { font-size: 16px; color: var(--text-primary); margin-bottom: 4px; }
    .empty-state p { font-size: 13px; }

    .notif-list { display: flex; flex-direction: column; gap: 8px; }

    .notif-card {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; background: var(--bg-surface);
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      transition: all 0.2s;
    }
    .notif-card.unread {
      border-color: rgba(245,166,35,0.2);
      background: rgba(245,166,35,0.03);
    }
    .notif-card:hover { border-color: var(--accent-dim); }

    .notif-left { display: flex; align-items: flex-start; gap: 12px; flex: 1; }
    .notif-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--border); flex-shrink: 0; margin-top: 6px;
    }
    .notif-dot.active { background: var(--accent); }

    .notif-msg { font-size: 14px; color: var(--text-primary); margin-bottom: 3px; line-height: 1.5; }
    .notif-date { font-size: 11px; color: var(--text-muted); }

    .notif-actions { display: flex; gap: 4px; flex-shrink: 0; margin-left: 16px; }
    .icon-btn {
      background: none; border: none; padding: 6px 8px;
      border-radius: var(--radius); cursor: pointer; font-size: 13px;
      color: var(--text-muted); transition: all 0.2s;
    }
    .icon-btn:hover { background: var(--bg-elevated); color: var(--accent); }
    .icon-btn.danger:hover { color: #f87171; background: rgba(248,113,113,0.08); }

    .btn {
      padding: 8px 16px; border-radius: var(--radius);
      font-size: 13px; font-weight: 600; cursor: pointer;
      border: none; font-family: var(--font-body); transition: all 0.2s;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn--ghost {
      background: transparent; color: var(--text-secondary);
      border: 1px solid var(--border);
    }
    .btn--ghost:hover:not(:disabled) { color: var(--text-primary); border-color: var(--text-secondary); }
  `]
})
export class NotificationsComponent implements OnInit {

  notifications: Notification[] = [];
  loading = true;
  markingAll = false;

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length; // ← isRead
  }

  constructor(private api: ApiService, private toast: ToastService) {}

  ngOnInit() {
    this.api.getNotifications().subscribe({
      next: (n) => {
        this.notifications = n;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load notifications');
      }
    });
  }

  markRead(n: Notification) {
    this.api.markNotificationRead(n.id).subscribe({
      next: () => {
        n.isRead = true; // ← isRead
      },
      error: () => {
        this.toast.error('Failed to mark as read');
      }
    });
  }

  markAllRead() {
    const unread = this.notifications.filter(n => !n.isRead); // ← isRead
    if (unread.length === 0) return;

    this.markingAll = true;

    // Fire all requests in parallel
    let completed = 0;
    unread.forEach(n => {
      this.api.markNotificationRead(n.id).subscribe({
        next: () => {
          n.isRead = true; // ← isRead — update each locally as it completes
          completed++;
          if (completed === unread.length) {
            this.markingAll = false;
            this.toast.success('All notifications marked as read');
          }
        },
        error: () => {
          completed++;
          if (completed === unread.length) {
            this.markingAll = false;
          }
        }
      });
    });
  }

  deleteNotif(id: string) {
    this.api.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== id);
      },
      error: () => {
        this.toast.error('Failed to delete notification');
      }
    });
  }
}
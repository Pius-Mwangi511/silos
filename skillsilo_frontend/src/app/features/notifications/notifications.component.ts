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
        @if (unreadCount > 0) {
          <button class="btn btn--ghost" (click)="markAllRead()">Mark all as read</button>
        }
      </div>

      @if (loading) {
        <div class="loading-row"><span class="spinner"></span> Loading…</div>
      } @else if (notifications.length === 0) {
        <div class="empty-state"><div class="icon">🔔</div><h3>All caught up!</h3><p>No notifications yet.</p></div>
      } @else {
        <div class="notif-list">
          @for (n of notifications; track n.id) {
            <div class="notif-card" [class.unread]="!n.read">
              <div class="notif-left">
                <div class="notif-dot" [class.active]="!n.read"></div>
                <div>
                  <p class="notif-msg">{{ n.message }}</p>
                  <span class="notif-date">{{ n.createdAt | date:'medium' }}</span>
                </div>
              </div>
              <div class="notif-actions">
                @if (!n.read) {
                  <button class="icon-btn" title="Mark as read" (click)="markRead(n)">✓</button>
                }
                <button class="icon-btn danger" title="Delete" (click)="deleteNotif(n.id)">✕</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .loading-row { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); padding: 32px 0; }
    .notif-list { display: flex; flex-direction: column; gap: 8px; }
    .notif-card {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; background: var(--bg-surface);
      border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);
      transition: all var(--transition);
    }
    .notif-card.unread { border-color: rgba(245,166,35,0.15); background: rgba(245,166,35,0.03); }
    .notif-left { display: flex; align-items: flex-start; gap: 12px; }
    .notif-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--border); flex-shrink: 0; margin-top: 6px; }
    .notif-dot.active { background: var(--accent); }
    .notif-msg { font-size: 14px; color: var(--text-primary); margin-bottom: 3px; }
    .notif-date { font-size: 11px; color: var(--text-muted); }
    .notif-actions { display: flex; gap: 4px; flex-shrink: 0; }
    .icon-btn {
      background: none; border: none; padding: 6px 8px;
      border-radius: var(--radius); cursor: pointer; font-size: 13px;
      color: var(--text-muted); transition: all var(--transition);
    }
    .icon-btn:hover { background: var(--bg-elevated); color: var(--success); }
    .icon-btn.danger:hover { color: var(--danger); }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  get unreadCount() { return this.notifications.filter(n => !n.read).length; }

  constructor(private api: ApiService, private toast: ToastService) {}

  ngOnInit() {
    this.api.getNotifications().subscribe({ next: n => { this.notifications = n; this.loading = false; }, error: () => this.loading = false });
  }

  markRead(n: Notification) {
    this.api.markNotificationRead(n.id).subscribe({ next: () => { n.read = true; }, error: () => {} });
  }

  markAllRead() {
    const unread = this.notifications.filter(n => !n.read);
    unread.forEach(n => this.markRead(n));
    this.toast.info('All marked as read');
  }

  deleteNotif(id: string) {
    this.api.deleteNotification(id).subscribe({
      next: () => { this.notifications = this.notifications.filter(n => n.id !== id); },
      error: () => {}
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CrossSiloRequest } from '../../shared/models';

@Component({
  selector: 'app-cross-silo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
  <div class="animate-fade-in">
    <div class="page-header">
      <div>
        <h1>Cross-Silo Board</h1>
        <p>Post open questions and get help from the whole community.</p>
      </div>
      <button class="btn btn--primary" (click)="showModal = true">+ New Request</button>
    </div>

    <div *ngIf="loading" class="loading-row">
      <span class="spinner"></span> Loading requests…
    </div>

    <div *ngIf="!loading && requests.length === 0" class="empty-state">
      <div class="icon">🌐</div>
      <h3>No requests yet</h3>
      <p>Be the first to post a cross-silo request.</p>
    </div>

    <div *ngIf="!loading && requests.length > 0"
         style="display:flex;flex-direction:column;gap:16px">

      <div *ngFor="let req of requests" class="request-card">

        <div class="request-header">
          <div class="req-author">
            <div class="req-avatar">
              {{ (req.fromUser?.name ?? req.user?.name ?? 'U')[0].toUpperCase() }}
            </div>
            <div>
              <!-- fromUser is what backend returns -->
              <div class="req-name">
                {{ req.fromUser?.name ?? req.user?.name ?? 'Anonymous' }}
              </div>
              <div class="req-date">{{ req.createdAt | date:'mediumDate' }}</div>
            </div>
          </div>
          <span class="badge badge--muted">
            {{ req.replies?.length ?? 0 }} {{ req.replies?.length === 1 ? 'reply' : 'replies' }}
          </span>
        </div>

        <h3>{{ req.title }}</h3>
        <p>{{ req.content }}</p>

        <!-- Replies -->
        <div *ngIf="req.replies && req.replies.length > 0" class="replies">
          <div *ngFor="let reply of req.replies" class="reply">
            <div class="reply-author">
              {{ reply.user?.name ?? 'Anonymous' }}
              <span class="reply-time">{{ reply.createdAt | date:'shortTime' }}</span>
            </div>
            <p>{{ reply.message }}</p>
          </div>
        </div>

        <!-- Reply input -->
        <div class="reply-input-row">
          <input
            type="text"
            [(ngModel)]="replyMessages[req.id]"
            placeholder="Write a reply…"
            class="reply-input"
            [disabled]="sendingReply[req.id]"
            (keyup.enter)="sendReply(req.id)" />
          <button
            class="btn btn--ghost"
            style="font-size:13px;padding:7px 14px;white-space:nowrap"
            [disabled]="sendingReply[req.id] || !replyMessages[req.id]?.trim()"
            (click)="sendReply(req.id)">
            {{ sendingReply[req.id] ? 'Sending…' : 'Reply' }}
          </button>
        </div>

      </div>
    </div>

    <!-- Create Modal -->
    <div *ngIf="showModal" class="modal-overlay" (click)="showModal = false">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>New Cross-Silo Request</h2>
          <button class="modal-close" (click)="showModal = false">✕</button>
        </div>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="modal-body">
            <div class="form-field">
              <label>Title</label>
              <input type="text" formControlName="title"
                     placeholder="What do you need help with?" />
            </div>
            <div class="form-field">
              <label>Details</label>
              <textarea formControlName="content"
                        placeholder="Describe your problem in detail…"></textarea>
            </div>
            <div *ngIf="error" class="error-msg">{{ error }}</div>
            <div class="modal-actions">
              <button type="button" class="btn btn--ghost"
                      (click)="showModal = false">Cancel</button>
              <button type="submit" class="btn btn--primary"
                      [disabled]="loading2 || form.invalid">
                {{ loading2 ? 'Posting…' : 'Post Request' }}
              </button>
            </div>
          </div>
        </form>
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
      text-align: center; padding: 48px 20px;
      color: var(--text-secondary);
    }
    .empty-state .icon { font-size: 40px; margin-bottom: 12px; }
    .empty-state h3 { font-size: 16px; color: var(--text-primary); margin-bottom: 6px; }

    .request-card {
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px;
      transition: border-color 0.2s;
    }
    .request-card:hover { border-color: var(--accent-dim); }

    .request-header {
      display: flex; align-items: flex-start;
      justify-content: space-between; margin-bottom: 14px;
    }
    .req-author { display: flex; align-items: center; gap: 10px; }
    .req-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: var(--accent-dim); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px; flex-shrink: 0;
    }
    .req-name { font-size: 14px; font-weight: 600; }
    .req-date { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    .request-card h3 { font-size: 16px; margin-bottom: 8px; }
    .request-card > p {
      font-size: 14px; color: var(--text-secondary);
      line-height: 1.6; margin-bottom: 16px;
    }

    .replies {
      display: flex; flex-direction: column; gap: 10px;
      margin-bottom: 14px; padding: 14px;
      background: var(--bg-elevated); border-radius: var(--radius);
      border-left: 3px solid var(--accent-dim);
    }
    .reply { padding-left: 8px; }
    .reply-author {
      font-size: 12px; font-weight: 600;
      color: var(--accent); margin-bottom: 3px;
      display: flex; align-items: center; gap: 8px;
    }
    .reply-time { font-weight: 400; color: var(--text-muted); font-size: 11px; }
    .reply p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0; }

    .reply-input-row { display: flex; gap: 8px; margin-top: 4px; }
    .reply-input {
      flex: 1; background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 8px 12px; color: var(--text-primary);
      font-family: var(--font-body); font-size: 13px; outline: none;
      transition: border-color 0.2s;
    }
    .reply-input:focus { border-color: var(--accent); }
    .reply-input:disabled { opacity: 0.5; }
    .reply-input::placeholder { color: var(--text-muted); }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.75);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 20px;
    }
    .modal {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius-lg); width: 100%; max-width: 480px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.6);
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 20px; border-bottom: 1px solid var(--border);
    }
    .modal-header h2 { font-size: 16px; font-weight: 700; margin: 0; }
    .modal-close {
      background: none; border: none; color: var(--text-secondary);
      font-size: 18px; cursor: pointer; padding: 4px 8px;
      border-radius: 6px; transition: all 0.2s;
    }
    .modal-close:hover { background: var(--bg-surface); color: var(--text-primary); }
    .modal-body { display: flex; flex-direction: column; gap: 16px; padding: 20px; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

    .form-field { display: flex; flex-direction: column; gap: 6px; }
    .form-field label {
      font-size: 12px; font-weight: 600; color: var(--text-secondary);
      text-transform: uppercase; letter-spacing: 0.03em;
    }
    .form-field input, .form-field textarea {
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 10px 14px;
      color: var(--text-primary); font-family: var(--font-body);
      font-size: 14px; outline: none; transition: border-color 0.2s;
      width: 100%; box-sizing: border-box;
    }
    .form-field input:focus, .form-field textarea:focus { border-color: var(--accent); }
    .form-field textarea { resize: vertical; min-height: 110px; }

    .error-msg {
      font-size: 13px; color: #f87171;
      background: rgba(248,113,113,0.08);
      border: 1px solid rgba(248,113,113,0.2);
      border-radius: 8px; padding: 10px 14px;
    }

    .badge {
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .badge--muted {
      background: var(--bg-surface); color: var(--text-secondary);
      border: 1px solid var(--border);
    }

    .btn {
      padding: 9px 18px; border-radius: var(--radius);
      font-size: 14px; font-weight: 600; cursor: pointer;
      border: none; font-family: var(--font-body);
      transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn--primary { background: var(--accent); color: var(--bg-primary); }
    .btn--primary:not(:disabled):hover { opacity: 0.9; }
    .btn--ghost {
      background: transparent; color: var(--text-secondary);
      border: 1px solid var(--border);
    }
    .btn--ghost:not(:disabled):hover { color: var(--text-primary); border-color: var(--text-secondary); }
  `]
})
export class CrossSiloComponent implements OnInit {

  requests: CrossSiloRequest[] = [];
  loading = true;
  loading2 = false;
  showModal = false;
  error = '';

  replyMessages: Record<string, string> = {};
  sendingReply: Record<string, boolean> = {}; // per-request loading state

  form!: FormGroup;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title:   ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.api.getAllCrossSiloRequests().subscribe({
      next: (r) => {
        this.requests = r;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load requests');
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading2 = true;
    this.error = '';

    this.api.createCrossSiloRequest(this.form.value as any).subscribe({
      next: (r) => {
        // Add to top of list with empty replies array
        this.requests = [{ ...r, replies: [], fromUser: r.fromUser ?? r.user } as any, ...this.requests];
        this.showModal = false;
        this.loading2 = false;
        this.form.reset();
        this.toast.success('Request posted!');
      },
      error: (e) => {
        this.error = e.error?.message || 'Failed to post request.';
        this.loading2 = false;
      }
    });
  }

  sendReply(requestId: string) {
    const msg = this.replyMessages[requestId]?.trim();
    if (!msg || this.sendingReply[requestId]) return;

    this.sendingReply[requestId] = true;

    this.api.replyCrossSilo(requestId, msg).subscribe({
      next: (reply: any) => {
        // Find the request and append the reply locally — no full reload needed
        const req = this.requests.find(r => r.id === requestId);
        if (req) {
          req.replies = [...(req.replies ?? []), reply];
        }

        this.replyMessages[requestId] = '';
        this.sendingReply[requestId] = false;
        this.toast.success('Reply sent!');
      },
      error: (err) => {
        this.sendingReply[requestId] = false;
        const msg = err?.error?.message || 'Failed to send reply.';
        this.toast.error(msg);
      }
    });
  }
}
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

    @if (loading) {
      <div class="loading-row"><span class="spinner"></span> Loading requests…</div>
    } @else if (requests.length === 0) {
      <div class="empty-state"><div class="icon">🌐</div><h3>No requests yet</h3></div>
    } @else {
      <div style="display:flex;flex-direction:column;gap:16px">
        @for (req of requests; track req.id) {
          <div class="request-card">
            <div class="request-header">
              <div class="req-author">
                <div class="req-avatar">{{ (req.user?.name ?? 'U')[0] }}</div>
                <div>
                  <div class="req-name">{{ req.user?.name }}</div>
                  <div class="req-date">{{ req.createdAt | date:'mediumDate' }}</div>
                </div>
              </div>
              <span class="badge badge--muted">{{ req.replies?.length ?? 0 }} replies</span>
            </div>
            <h3>{{ req.title }}</h3>
            <p>{{ req.content }}</p>

            <!-- Replies -->
            @if (req.replies && req.replies.length > 0) {
              <div class="replies">
                @for (reply of req.replies; track reply.id) {
                  <div class="reply">
                    <div class="reply-author">{{ reply.user?.name }}</div>
                    <p>{{ reply.message }}</p>
                  </div>
                }
              </div>
            }

            <!-- Reply input -->
            <div class="reply-input-row">
              <input type="text" [(ngModel)]="replyMessages[req.id]" placeholder="Write a reply…" class="reply-input"
                (keyup.enter)="sendReply(req.id)" />
              <button class="btn btn--ghost" style="font-size:13px;padding:7px 14px" (click)="sendReply(req.id)">Reply</button>
            </div>
          </div>
        }
      </div>
    }

    <!-- Create Modal -->
    @if (showModal) {
      <div class="modal-overlay" (click)="showModal = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>New Cross-Silo Request</h2>
            <button class="modal-close" (click)="showModal = false">✕</button>
          </div>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div style="display:flex;flex-direction:column;gap:14px">
              <div class="form-field"><label>Title</label><input type="text" formControlName="title" placeholder="What do you need help with?" /></div>
              <div class="form-field"><label>Details</label><textarea formControlName="content" placeholder="Describe your problem in detail (min. 10 characters)…"></textarea></div>
              @if (error) { <div class="error-msg">{{ error }}</div> }
              <div style="display:flex;gap:10px;justify-content:flex-end">
                <button type="button" class="btn btn--ghost" (click)="showModal = false">Cancel</button>
                <button type="submit" class="btn btn--primary" [disabled]="loading2">
                  @if (loading2) { <span class="spinner" style="width:14px;height:14px"></span> }
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    }
  </div>
`,
styles: [`
  .loading-row { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); padding: 32px 0; }
  .request-card { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 22px; }
  .request-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
  .req-author { display: flex; align-items: center; gap: 10px; }
  .req-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--accent-dim); color: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 13px;
  }
  .req-name { font-size: 14px; font-weight: 600; }
  .req-date { font-size: 11px; color: var(--text-muted); }
  .request-card h3 { font-size: 16px; margin-bottom: 8px; }
  .request-card > p { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px; }
  .replies { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; padding: 12px; background: var(--bg-elevated); border-radius: var(--radius); }
  .reply { border-left: 2px solid var(--accent-dim); padding-left: 10px; }
  .reply-author { font-size: 12px; font-weight: 600; color: var(--accent); margin-bottom: 3px; }
  .reply p { font-size: 13px; color: var(--text-secondary); }
  .reply-input-row { display: flex; gap: 8px; }
  .reply-input {
    flex: 1; background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 8px 12px; color: var(--text-primary);
    font-family: var(--font-body); font-size: 13px; outline: none;
  }
  .reply-input:focus { border-color: var(--accent); }
  .reply-input::placeholder { color: var(--text-muted); }
`]
})
export class CrossSiloComponent implements OnInit {

  requests: CrossSiloRequest[] = [];
  loading = true;
  loading2 = false;
  showModal = false;
  error = '';
  replyMessages: Record<string, string> = {};

  form!: FormGroup;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

  ngOnInit() {

    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.api.getAllCrossSiloRequests().subscribe({
      next: r => {
        this.requests = r;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading2 = true;
    this.error = '';

    this.api.createCrossSiloRequest(this.form.value as any).subscribe({
      next: (r) => {
        this.requests = [r, ...this.requests];
        this.showModal = false;
        this.loading2 = false;
        this.form.reset();
        this.toast.success('Request posted!');
      },
      error: (e) => {
        this.error = e.error?.message || 'Failed';
        this.loading2 = false;
      }
    });
  }

  sendReply(requestId: string) {
    const msg = this.replyMessages[requestId]?.trim();
    if (!msg) return;

    this.api.replyCrossSilo(requestId, msg).subscribe({
      next: () => {
        this.replyMessages[requestId] = '';
        this.toast.success('Reply sent!');
        this.ngOnInit();
      },
      error: () => {}
    });
  }
}
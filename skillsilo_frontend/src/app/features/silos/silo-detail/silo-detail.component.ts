import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';
import { ToastService } from '../../../core/services/toast.service';

import {
  Silo,
  Challenge,
  Message,
  Resource,
  Feedback,
  Member
} from '../../../shared/models';

type Tab = 'challenges' | 'chat' | 'resources' | 'members' | 'feedback';

@Component({
  selector: 'app-silo-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="animate-fade-in">

      <!-- Loading -->
      <div *ngIf="loading" class="loading-row">
        <span class="spinner"></span> Loading silo…
      </div>

      <!-- Content -->
      <div *ngIf="!loading && silo">

        <!-- Header -->
        <div class="silo-header">
          <div class="silo-header-left">
            <div class="big-avatar">
              {{ silo.skill[0]?.toUpperCase() }}
            </div>
            <div>
              <h1>{{ silo.skill }}</h1>
              <div class="silo-meta">
                <span class="badge badge--accent">{{ silo.level }}</span>
                <span class="meta-item">👥 {{ members.length }} members</span>
              </div>
            </div>
          </div>

          <button class="btn btn--ghost" (click)="joinOrLeave()">
            {{ isMember ? 'Leave Silo' : 'Join Silo' }}
          </button>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <button
            *ngFor="let tab of tabs; trackBy: trackById"
            class="tab"
            [class.active]="activeTab === tab.key"
            (click)="loadTab(tab.key)">
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>

        <!-- TAB CONTENT -->
        <div class="tab-content">

          <!-- ══════════════════════════════════
               CHALLENGES
          ══════════════════════════════════ -->
          <div *ngIf="activeTab === 'challenges'" class="tab-panel">
            <div class="panel-header">
              <h2>Challenges</h2>
              <button class="btn btn--primary" (click)="showChallengeModal = true">+ Add Challenge</button>
            </div>

            <div *ngIf="challenges.length === 0" class="empty-state">
              <div class="icon">⚡</div>
              <h3>No challenges yet</h3>
            </div>

            <div *ngIf="challenges.length > 0" class="grid-2">
              <div
                *ngFor="let c of challenges; trackBy: trackById"
                class="challenge-card">
                <div class="challenge-card-header">
                  <span class="badge badge--muted">
                    {{ c._count?.submissions ?? 0 }} submissions
                  </span>
                  <span *ngIf="c.dueDate" class="due-date">
                    Due {{ c.dueDate | date:'mediumDate' }}
                  </span>
                </div>
                <h3>{{ c.title }}</h3>
                <p>{{ c.description }}</p>
              </div>
            </div>

            <!-- Challenge Modal -->
            <div *ngIf="showChallengeModal" class="modal-overlay" (click)="showChallengeModal = false">
              <div class="modal" (click)="$event.stopPropagation()">
                <div class="modal-header">
                  <h2>New Challenge</h2>
                  <button class="modal-close" (click)="showChallengeModal = false">✕</button>
                </div>
                <form [formGroup]="challengeForm" (ngSubmit)="createChallenge()">
                  <div class="modal-body">
                    <div class="form-field">
                      <label>Title</label>
                      <input type="text" formControlName="title" placeholder="Challenge title" />
                    </div>
                    <div class="form-field">
                      <label>Description</label>
                      <textarea formControlName="description" placeholder="What should members do?"></textarea>
                    </div>
                    <div class="form-field">
                      <label>Due Date (optional)</label>
                      <input type="date" formControlName="dueDate" />
                    </div>
                    <div *ngIf="challengeError" class="error-msg">{{ challengeError }}</div>
                    <div class="modal-actions">
                      <button type="button" class="btn btn--ghost" (click)="showChallengeModal = false">Cancel</button>
                      <button type="submit" class="btn btn--primary" [disabled]="challengeLoading || challengeForm.invalid">
                        {{ challengeLoading ? 'Creating...' : 'Create' }}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- ══════════════════════════════════
               CHAT
          ══════════════════════════════════ -->
          <div *ngIf="activeTab === 'chat'" class="chat-panel">

            <div class="messages">
              <div *ngIf="visibleMessages.length === 0" class="empty-state">
                <div class="icon">💬</div>
                <h3>Start the conversation!</h3>
              </div>

              <div
                *ngFor="let m of visibleMessages; trackBy: trackById"
                class="msg"
                [class.own]="m.userId === currentUserId">
                <div class="msg-avatar">
                  {{ (m.user?.name ?? 'U')[0] }}
                </div>
                <div class="msg-body">
                  <div class="msg-author">
                    {{ m.user?.name ?? 'Unknown' }}
                    <span class="msg-time">{{ m.createdAt | date:'shortTime' }}</span>
                  </div>
                  <div class="msg-text">{{ m.content }}</div>
                </div>
              </div>
            </div>

            <div class="chat-input-row">
              <input
                type="text"
                [(ngModel)]="chatMessage"
                (keyup.enter)="sendMessage()"
                placeholder="Message..."
                class="chat-input" />
              <button
                class="btn btn--primary"
                (click)="sendMessage()"
                [disabled]="!chatMessage.trim()">
                Send
              </button>
            </div>
          </div>

          <!-- ══════════════════════════════════
               RESOURCES
          ══════════════════════════════════ -->
          <div *ngIf="activeTab === 'resources'" class="tab-panel">
            <div class="panel-header">
              <h2>Resources</h2>
              <button class="btn btn--primary" (click)="showResourceModal = true">+ Upload</button>
            </div>

            <div *ngIf="resources.length === 0" class="empty-state">
              <div class="icon">📁</div>
              <h3>No resources yet</h3>
              <p style="font-size:13px;color:var(--text-secondary);margin-top:6px">Upload the first resource for this silo.</p>
            </div>

            <div *ngIf="resources.length > 0" class="resource-list">
              <a
                *ngFor="let r of resources; trackBy: trackById"
                [href]="r.fileUrl"
                target="_blank"
                class="resource-row">
                <span class="resource-icon">
                  {{ r.fileType === 'image' ? '🖼️' : '📄' }}
                </span>
                <div>
                  <div class="resource-title">{{ r.title }}</div>
                  <div class="resource-meta">{{ r.createdAt | date:'mediumDate' }}</div>
                </div>
                <span class="resource-link">↗</span>
              </a>
            </div>

            <!-- Resource Upload Modal -->
            <div *ngIf="showResourceModal" class="modal-overlay" (click)="showResourceModal = false">
              <div class="modal" (click)="$event.stopPropagation()">
                <div class="modal-header">
                  <h2>Upload Resource</h2>
                  <button class="modal-close" (click)="showResourceModal = false">✕</button>
                </div>
                <div class="modal-body">
                  <div class="form-field">
                    <label>Title</label>
                    <input
                      type="text"
                      [(ngModel)]="resourceTitle"
                      placeholder="Give this resource a title" />
                  </div>
                  <div class="form-field">
                    <label>File</label>
                    <div class="file-drop" (click)="fileInput.click()">
                      <input
                        #fileInput
                        type="file"
                        style="display:none"
                        (change)="onFileSelect($event)" />
                      <div *ngIf="!selectedFile" class="file-drop-inner">
                        <span style="font-size:28px">📁</span>
                        <span style="font-size:13px;color:var(--text-secondary)">Click to select a file</span>
                      </div>
                      <div *ngIf="selectedFile" class="file-drop-inner">
                        <span style="font-size:22px">✅</span>
                        <span style="font-size:13px;color:var(--text-primary)">{{ selectedFile.name }}</span>
                        <span style="font-size:11px;color:var(--text-secondary)">
                          {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB
                        </span>
                      </div>
                    </div>
                  </div>
                  <div *ngIf="resourceError" class="error-msg">{{ resourceError }}</div>
                  <div class="modal-actions">
                    <button class="btn btn--ghost" (click)="showResourceModal = false; resetResourceForm()">
                      Cancel
                    </button>
                    <button
                      class="btn btn--primary"
                      (click)="uploadResource()"
                      [disabled]="resourceLoading || !resourceTitle.trim() || !selectedFile">
                      {{ resourceLoading ? 'Uploading...' : 'Upload' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ══════════════════════════════════
               MEMBERS
          ══════════════════════════════════ -->
          <div *ngIf="activeTab === 'members'" class="tab-panel">
            <h2 style="margin-bottom:16px">Members ({{ members.length }})</h2>

            <div *ngIf="members.length === 0" class="empty-state">
              <div class="icon">👥</div>
              <h3>No members yet</h3>
            </div>

            <div *ngIf="members.length > 0" class="member-list">
              <div
                *ngFor="let m of members; trackBy: trackById"
                class="member-row">
                <div class="member-avatar">
                  {{ (m.user?.name ?? 'U')[0] }}
                </div>
                <div>
                  <div class="member-name">{{ m.user?.name }}</div>
                  <div class="member-since">{{ m.joinedAt | date:'mediumDate' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ══════════════════════════════════
               FEEDBACK
          ══════════════════════════════════ -->
          <div *ngIf="activeTab === 'feedback'" class="tab-panel">
            <div class="panel-header">
              <h2>Feedback</h2>
              <button class="btn btn--primary" (click)="showFeedbackModal = true">+ Give Feedback</button>
            </div>

            <div *ngIf="feedbacks.length === 0" class="empty-state">
              <div class="icon">⭐</div>
              <h3>No feedback yet</h3>
              <p style="font-size:13px;color:var(--text-secondary);margin-top:6px">Be the first to leave feedback.</p>
            </div>

            <div *ngIf="feedbacks.length > 0" class="feedback-list">
              <div
                *ngFor="let f of feedbacks; trackBy: trackById"
                class="feedback-card">
                <div class="feedback-header">
                  <span class="feedback-author">{{ f.user?.name ?? f.user?.email ?? 'Anonymous' }}</span>
                  <span *ngIf="f.rating" class="stars">
                    {{ '★'.repeat(f.rating) }}{{ '☆'.repeat(5 - f.rating) }}
                  </span>
                </div>
                <p>{{ f.message }}</p>
              </div>
            </div>

            <!-- Feedback Modal -->
            <div *ngIf="showFeedbackModal" class="modal-overlay" (click)="showFeedbackModal = false">
              <div class="modal" (click)="$event.stopPropagation()">
                <div class="modal-header">
                  <h2>Give Feedback</h2>
                  <button class="modal-close" (click)="showFeedbackModal = false">✕</button>
                </div>
                <form [formGroup]="feedbackForm" (ngSubmit)="submitFeedback()">
                  <div class="modal-body">
                    <div class="form-field">
                      <label>Message</label>
                      <textarea
                        formControlName="message"
                        placeholder="Share your thoughts about this silo…"></textarea>
                    </div>
                    <div class="form-field">
                      <label>Rating (optional)</label>
                      <div class="star-row">
                        <button
                          *ngFor="let star of [1,2,3,4,5]"
                          type="button"
                          class="star-btn"
                          [class.active]="selectedRating >= star"
                          (click)="setRating(star)">★</button>
                        <button
                          *ngIf="selectedRating > 0"
                          type="button"
                          class="clear-rating"
                          (click)="setRating(0)">✕ Clear</button>
                      </div>
                    </div>
                    <div *ngIf="feedbackError" class="error-msg">{{ feedbackError }}</div>
                    <div class="modal-actions">
                      <button type="button" class="btn btn--ghost" (click)="showFeedbackModal = false; resetFeedbackForm()">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="btn btn--primary"
                        [disabled]="feedbackLoading || feedbackForm.invalid">
                        {{ feedbackLoading ? 'Submitting...' : 'Submit Feedback' }}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Error -->
      <div *ngIf="!loading && !silo" class="empty-state">
        <div class="icon">❌</div>
        <h3>Failed to load silo</h3>
      </div>

    </div>
  `,
  styles: [`
    /* ── Loading ── */
    .loading-row {
      display: flex; align-items: center; gap: 10px;
      color: var(--text-secondary); font-size: 14px; padding: 48px 0;
    }

    /* ── Silo Header ── */
    .silo-header {
      display: flex; align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 28px; flex-wrap: wrap; gap: 16px;
    }
    .silo-header-left { display: flex; align-items: center; gap: 20px; }
    .big-avatar {
      width: 56px; height: 56px; border-radius: 14px;
      background: var(--accent-dim); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display); font-weight: 800; font-size: 26px;
    }
    h1 { font-size: 26px; margin-bottom: 6px; }
    .silo-meta { display: flex; align-items: center; gap: 12px; }
    .meta-item { font-size: 13px; color: var(--text-secondary); }

    /* ── Tabs ── */
    .tabs {
      display: flex; gap: 2px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 24px; overflow-x: auto;
    }
    .tab {
      background: none; border: none; padding: 10px 18px;
      color: var(--text-secondary); font-size: 14px; font-weight: 500;
      cursor: pointer; border-bottom: 2px solid transparent;
      transition: all var(--transition); white-space: nowrap;
    }
    .tab:hover { color: var(--text-primary); }
    .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

    /* ── Panel ── */
    .tab-panel { animation: fadeIn 0.2s ease; }
    .panel-header {
      display: flex; align-items: center;
      justify-content: space-between; margin-bottom: 20px;
    }
    .panel-header h2 { font-size: 17px; }

    /* ── Empty State ── */
    .empty-state {
      text-align: center; padding: 48px 20px;
      color: var(--text-secondary);
    }
    .empty-state .icon { font-size: 40px; margin-bottom: 12px; }
    .empty-state h3 { font-size: 16px; color: var(--text-primary); }

    /* ── Challenges ── */
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .challenge-card {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px;
      transition: all var(--transition);
    }
    .challenge-card:hover { border-color: var(--accent); transform: translateY(-1px); }
    .challenge-card-header {
      display: flex; align-items: center;
      justify-content: space-between; margin-bottom: 10px;
    }
    .challenge-card h3 { font-size: 15px; margin-bottom: 6px; }
    .challenge-card p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
    .due-date { font-size: 11px; color: var(--text-muted); }

    /* ── Chat ── */
    .chat-panel {
      display: flex; flex-direction: column; height: 500px;
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
    }
    .messages {
      flex: 1; overflow-y: auto; padding: 20px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .msg { display: flex; gap: 10px; }
    .msg.own { flex-direction: row-reverse; }
    .msg-avatar {
      width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
      background: var(--bg-elevated); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600; color: var(--accent);
    }
    .msg-body { max-width: 70%; }
    .msg-author { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
    .msg-time { margin-left: 6px; }
    .msg-text {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: 12px; padding: 8px 12px; font-size: 14px;
    }
    .own .msg-text {
      background: var(--accent-dim);
      border-color: rgba(245,166,35,0.2);
    }
    .chat-input-row {
      display: flex; gap: 10px; padding: 14px;
      border-top: 1px solid var(--border);
    }
    .chat-input {
      flex: 1; background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 9px 14px; color: var(--text-primary);
      font-family: var(--font-body); font-size: 14px; outline: none;
    }
    .chat-input:focus { border-color: var(--accent); }

    /* ── Resources ── */
    .resource-list { display: flex; flex-direction: column; gap: 8px; }
    .resource-row {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px; background: var(--bg-elevated);
      border: 1px solid var(--border); border-radius: var(--radius);
      text-decoration: none; color: inherit;
      transition: border-color var(--transition);
    }
    .resource-row:hover { border-color: var(--accent); }
    .resource-icon { font-size: 22px; }
    .resource-title { font-size: 14px; font-weight: 500; }
    .resource-meta { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .resource-link { margin-left: auto; color: var(--accent); font-size: 16px; }

    /* File drop zone */
    .file-drop {
      border: 2px dashed var(--border); border-radius: var(--radius);
      padding: 24px; cursor: pointer; transition: border-color var(--transition);
      text-align: center;
    }
    .file-drop:hover { border-color: var(--accent); }
    .file-drop-inner {
      display: flex; flex-direction: column;
      align-items: center; gap: 6px;
    }

    /* ── Members ── */
    .member-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
    .member-row {
      display: flex; align-items: center; gap: 12px; padding: 14px;
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius);
    }
    .member-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--accent-dim); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px; flex-shrink: 0;
    }
    .member-name { font-size: 14px; font-weight: 500; }
    .member-since { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    /* ── Feedback ── */
    .feedback-list { display: flex; flex-direction: column; gap: 12px; }
    .feedback-card {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 16px;
    }
    .feedback-header {
      display: flex; align-items: center;
      justify-content: space-between; margin-bottom: 8px;
    }
    .feedback-author { font-weight: 600; font-size: 14px; }
    .stars { color: var(--accent); letter-spacing: 2px; font-size: 14px; }
    .feedback-card p { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }

    /* Star rating */
    .star-row { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
    .star-btn {
      background: none; border: none; cursor: pointer;
      font-size: 28px; color: var(--border);
      transition: color var(--transition); padding: 0; line-height: 1;
    }
    .star-btn:hover { color: var(--accent); }
    .star-btn.active { color: var(--accent); }
    .clear-rating {
      background: none; border: none; cursor: pointer;
      font-size: 11px; color: var(--text-muted);
      margin-left: 8px; padding: 2px 6px;
      border-radius: 4px; border: 1px solid var(--border);
    }
    .clear-rating:hover { color: var(--text-primary); border-color: var(--text-primary); }

    /* ── Modal ── */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.75);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 20px;
      animation: fadeIn 0.15s ease;
    }
    .modal {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius-lg); width: 100%; max-width: 480px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.6);
      max-height: 90vh; overflow-y: auto;
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 20px; border-bottom: 1px solid var(--border);
      position: sticky; top: 0; background: var(--bg-elevated); z-index: 1;
    }
    .modal-header h2 { font-size: 16px; font-weight: 700; margin: 0; }
    .modal-close {
      background: none; border: none; color: var(--text-secondary);
      font-size: 18px; cursor: pointer; padding: 4px 8px; line-height: 1;
      border-radius: 6px; transition: all var(--transition);
    }
    .modal-close:hover { background: var(--bg-surface); color: var(--text-primary); }
    .modal-body { display: flex; flex-direction: column; gap: 16px; padding: 20px; }
    .modal-actions {
      display: flex; gap: 10px; justify-content: flex-end;
      padding-top: 4px;
    }

    /* ── Form Fields ── */
    .form-field { display: flex; flex-direction: column; gap: 6px; }
    .form-field label {
      font-size: 12px; font-weight: 600;
      color: var(--text-secondary); letter-spacing: 0.03em;
      text-transform: uppercase;
    }
    .form-field input,
    .form-field textarea {
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 10px 14px;
      color: var(--text-primary); font-family: var(--font-body);
      font-size: 14px; outline: none;
      transition: border-color var(--transition);
      width: 100%; box-sizing: border-box;
    }
    .form-field input:focus,
    .form-field textarea:focus { border-color: var(--accent); }
    .form-field textarea { resize: vertical; min-height: 100px; }

    /* ── Error message ── */
    .error-msg {
      font-size: 13px; color: #f87171;
      background: rgba(248,113,113,0.08);
      border: 1px solid rgba(248,113,113,0.2);
      border-radius: 8px; padding: 10px 14px;
    }

    /* ── Buttons ── */
    .btn {
      padding: 9px 18px; border-radius: var(--radius);
      font-size: 14px; font-weight: 600; cursor: pointer;
      border: none; font-family: var(--font-body);
      transition: all var(--transition); display: inline-flex;
      align-items: center; gap: 6px;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn--primary { background: var(--accent); color: var(--bg-primary); }
    .btn--primary:not(:disabled):hover { opacity: 0.9; transform: translateY(-1px); }
    .btn--ghost {
      background: transparent; color: var(--text-secondary);
      border: 1px solid var(--border);
    }
    .btn--ghost:hover { color: var(--text-primary); border-color: var(--text-secondary); }

    /* ── Badges ── */
    .badge {
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .badge--accent { background: var(--accent-dim); color: var(--accent); }
    .badge--muted { background: var(--bg-surface); color: var(--text-secondary); border: 1px solid var(--border); }

    /* ── Animation ── */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.3s ease; }
  `]
})
export class SiloDetailComponent implements OnInit, OnDestroy {

  silo: Silo | null = null;
  loading = true;
  activeTab: Tab = 'challenges';
  siloId = '';

  challenges: Challenge[] = [];
  messages: Message[] = [];
  visibleMessages: Message[] = [];
  resources: Resource[] = [];
  members: Member[] = [];
  feedbacks: Feedback[] = [];

  chatMessage = '';
  isMember = false;

  // ── Challenge modal ──────────────────────────────────────────
  challengeForm!: FormGroup;
  showChallengeModal = false;
  challengeLoading = false;
  challengeError = '';

  // ── Resource modal ───────────────────────────────────────────
  showResourceModal = false;
  resourceTitle = '';
  resourceLoading = false;
  resourceError = '';
  selectedFile: File | null = null;

  // ── Feedback modal ───────────────────────────────────────────
  feedbackForm!: FormGroup;
  showFeedbackModal = false;
  feedbackLoading = false;
  feedbackError = '';
  selectedRating = 0;

  private chatSub: any;

  readonly tabs = [
    { key: 'challenges' as Tab, label: 'Challenges', icon: '⚡' },
    { key: 'chat'       as Tab, label: 'Chat',       icon: '💬' },
    { key: 'resources'  as Tab, label: 'Resources',  icon: '📁' },
    { key: 'members'    as Tab, label: 'Members',    icon: '👥' },
    { key: 'feedback'   as Tab, label: 'Feedback',   icon: '⭐' },
  ];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private chat: ChatService,
    private fb: FormBuilder,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForms();

    this.siloId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.siloId) {
      this.loading = false;
      this.toast.error('Invalid silo ID');
      return;
    }

    this.loadSilo();
    this.initChat();
  }

  ngOnDestroy() {
    this.chat.disconnect();
    this.chatSub?.unsubscribe();
  }

  // ════════════════════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════════════════════

  private initForms() {
    this.challengeForm = this.fb.group({
      title:       ['', Validators.required],
      description: ['', Validators.required],
      dueDate:     ['']
    });

    this.feedbackForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(3)]],
      rating:  [null]
    });
  }

  private loadSilo() {
    this.loading = true;

    this.api.getSilo(this.siloId).subscribe({
      next: (s) => {
        this.silo = s;
        this.loading = false;
        this.loadTab(this.activeTab);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.toast.error('Failed to load silo');
        this.cdr.detectChanges();
      }
    });
  }

  private initChat() {
    this.chat.connect();
    this.chat.joinSilo(this.siloId);

    this.chatSub = this.chat.onMessage().subscribe((msg: Message) => {
      this.messages = [...this.messages, msg];
      this.updateVisibleMessages();
      this.cdr.detectChanges();
    });
  }

  get currentUserId() {
    return this.auth.currentUser?.id;
  }

  private updateVisibleMessages() {
    this.visibleMessages = this.messages.slice(-50);
  }

  // ════════════════════════════════════════════════════════════
  // TAB LOADING
  // ════════════════════════════════════════════════════════════

  loadTab(tab: Tab) {
    if (!this.siloId) return;
    this.activeTab = tab;

    switch (tab) {

      case 'challenges':
        this.api.getSiloChallenges(this.siloId).subscribe({
          next: (c) => { this.challenges = c ?? []; this.cdr.detectChanges(); },
          error: () => this.toast.error('Failed to load challenges')
        });
        break;

      case 'chat':
        this.api.getSiloMessages(this.siloId).subscribe({
          next: (m) => {
            this.messages = m ?? [];
            this.updateVisibleMessages();
            this.cdr.detectChanges();
          },
          error: () => this.toast.error('Failed to load messages')
        });
        break;

      case 'resources':
        this.api.getSiloResources(this.siloId).subscribe({
          next: (r) => { this.resources = r ?? []; this.cdr.detectChanges(); },
          error: () => this.toast.error('Failed to load resources')
        });
        break;

      case 'members':
        this.api.getSiloMembers(this.siloId).subscribe({
          next: (m) => {
            this.members = m ?? [];
            this.isMember = this.members.some(x => x.userId === this.currentUserId);
            this.cdr.detectChanges();
          },
          error: () => this.toast.error('Failed to load members')
        });
        break;

      case 'feedback':
        this.api.getSiloFeedback(this.siloId).subscribe({
          next: (f) => { this.feedbacks = f ?? []; this.cdr.detectChanges(); },
          error: () => this.toast.error('Failed to load feedback')
        });
        break;
    }
  }

  // ════════════════════════════════════════════════════════════
  // CHAT
  // ════════════════════════════════════════════════════════════

  sendMessage() {
    const content = this.chatMessage.trim();
    if (!content || !this.currentUserId) return;

    const msg: Message = {
      id: crypto.randomUUID(),
      siloId: this.siloId,
      content,
      userId: this.currentUserId,
      createdAt: new Date().toISOString(),
      user: this.auth.currentUser ?? undefined
    };

    this.messages = [...this.messages, msg];
    this.updateVisibleMessages();
    this.chat.sendMessage(this.siloId, content);
    this.chatMessage = '';
    this.cdr.detectChanges();
  }

  // ════════════════════════════════════════════════════════════
  // MEMBERSHIP
  // ════════════════════════════════════════════════════════════

  joinOrLeave() {
    const action = this.isMember
      ? this.api.leaveSilo(this.siloId)
      : this.api.joinSilo(this.siloId);

    action.subscribe({
      next: () => {
        this.isMember = !this.isMember;
        this.toast.success(this.isMember ? 'Joined silo!' : 'Left silo.');
        this.loadTab('members');
        this.cdr.detectChanges();
      },
      error: (err) => {
        const msg = err?.error?.message || 'Action failed';
        this.toast.error(msg);
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // CHALLENGES
  // ════════════════════════════════════════════════════════════

  createChallenge() {
    if (this.challengeForm.invalid) return;

    this.challengeLoading = true;
    this.challengeError = '';

    this.api.createChallenge(this.siloId, this.challengeForm.value).subscribe({
      next: (challenge) => {
        this.challenges = [challenge, ...this.challenges];
        this.challengeForm.reset();
        this.showChallengeModal = false;
        this.challengeLoading = false;
        this.toast.success('Challenge created!');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.challengeLoading = false;
        this.challengeError = err?.error?.message || 'Failed to create challenge.';
        this.cdr.detectChanges();
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // RESOURCES
  // ════════════════════════════════════════════════════════════

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.resourceError = '';
      this.cdr.detectChanges();
    }
  }

  uploadResource() {
    if (!this.resourceTitle.trim()) {
      this.resourceError = 'Please provide a title.';
      return;
    }
    if (!this.selectedFile) {
      this.resourceError = 'Please select a file.';
      return;
    }

    this.resourceLoading = true;
    this.resourceError = '';

    this.api.uploadResource(this.siloId, this.resourceTitle.trim(), this.selectedFile).subscribe({
      next: (resource) => {
        this.resources = [resource, ...this.resources];
        this.resetResourceForm();
        this.showResourceModal = false;
        this.resourceLoading = false;
        this.toast.success('Resource uploaded successfully!');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.resourceLoading = false;
        this.resourceError = err?.error?.message || 'Upload failed. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  resetResourceForm() {
    this.resourceTitle = '';
    this.selectedFile = null;
    this.resourceError = '';
    this.resourceLoading = false;
  }

  // ════════════════════════════════════════════════════════════
  // FEEDBACK
  // ════════════════════════════════════════════════════════════

  setRating(star: number) {
    this.selectedRating = star;
    this.feedbackForm.patchValue({ rating: star === 0 ? null : star });
  }

  submitFeedback() {
    if (this.feedbackForm.invalid) return;

    this.feedbackLoading = true;
    this.feedbackError = '';

    this.api.createFeedback(this.siloId, this.feedbackForm.value).subscribe({
      next: (feedback) => {
        this.feedbacks = [feedback, ...this.feedbacks];
        this.resetFeedbackForm();
        this.showFeedbackModal = false;
        this.feedbackLoading = false;
        this.toast.success('Feedback submitted!');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.feedbackLoading = false;
        this.feedbackError = err?.error?.message || 'Failed to submit feedback. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  resetFeedbackForm() {
    this.feedbackForm.reset();
    this.selectedRating = 0;
    this.feedbackError = '';
    this.feedbackLoading = false;
  }

  // ════════════════════════════════════════════════════════════
  // UTILS
  // ════════════════════════════════════════════════════════════

  trackById(index: number, item: any) {
    return item?.id ?? index;
  }
}
// ═══════════════════════════════════════════════════════════
// FILE 1: challenge-detail.component.ts
// Path: src/app/features/challenges/challenge-detail/challenge-detail.component.ts
// ═══════════════════════════════════════════════════════════

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Challenge, Submission, PeerReview } from '../../../shared/models';

@Component({
  selector: 'app-challenge-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  template: `
    <div class="animate-fade-in">

      <!-- Back link -->
      <a [routerLink]="['/silos', siloId]" class="back-link">← Back to Silo</a>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-row">
        <span class="spinner"></span> Loading challenge…
      </div>

      <!-- Main content -->
      <div *ngIf="!loading && challenge">

        <!-- ── Challenge Header ── -->
        <div class="challenge-header">
          <div class="challenge-header-left">
            <div class="challenge-icon">⚡</div>
            <div>
              <h1>{{ challenge.title }}</h1>
              <div class="challenge-meta">
                <span *ngIf="challenge.dueDate" class="badge badge--muted">
                  📅 Due {{ challenge.dueDate | date:'mediumDate' }}
                </span>
                <span class="badge badge--accent">
                  {{ submissions.length }} submission{{ submissions.length !== 1 ? 's' : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Challenge Description ── -->
        <div class="challenge-desc">
          <p>{{ challenge.description }}</p>
        </div>

        <!-- ══════════════════════════════════
             SUBMIT YOUR WORK
        ══════════════════════════════════ -->
        <section class="section-block">
          <div class="section-block-header">
            <h2>Submit Your Work</h2>
            <span class="section-hint">Share your solution for peer review</span>
          </div>

          <div class="submit-card">
            <form [formGroup]="submitForm" (ngSubmit)="submitWork()">
              <div class="form-stack">

                <div class="form-field">
                  <label>Your Solution</label>
                  <textarea
                    formControlName="content"
                    placeholder="Describe your approach, paste your code, or explain your solution…"
                    rows="5"></textarea>
                  <div *ngIf="submitForm.get('content')?.touched && submitForm.get('content')?.invalid"
                       class="field-error">Solution is required.</div>
                </div>

                <div class="form-field">
                  <label>
                    Resource URL
                    <span class="label-hint">(optional — GitHub, CodeSandbox, Figma, etc.)</span>
                  </label>
                  <input
                    type="url"
                    formControlName="resourceUrl"
                    placeholder="https://github.com/your/repo" />
                </div>

                <div *ngIf="submitError" class="error-msg">{{ submitError }}</div>

                <div class="form-actions">
                  <button
                    type="submit"
                    class="btn btn--primary"
                    [disabled]="submitLoading || submitForm.invalid">
                    {{ submitLoading ? 'Submitting…' : '🚀 Submit Solution' }}
                  </button>
                  <span *ngIf="alreadySubmitted" class="already-submitted">
                    ✅ You have already submitted
                  </span>
                </div>

              </div>
            </form>
          </div>
        </section>

        <!-- ══════════════════════════════════
             SUBMISSIONS + PEER REVIEWS
        ══════════════════════════════════ -->
        <section class="section-block">
          <div class="section-block-header">
            <h2>Submissions ({{ submissions.length }})</h2>
            <span class="section-hint">Review others' work and leave feedback</span>
          </div>

          <div *ngIf="loadingSubmissions" class="loading-row">
            <span class="spinner"></span> Loading submissions…
          </div>

          <div *ngIf="!loadingSubmissions && submissions.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>No submissions yet</h3>
            <p>Be the first to submit your solution above.</p>
          </div>

          <div *ngIf="!loadingSubmissions && submissions.length > 0"
               class="submissions-list">

            <div *ngFor="let sub of submissions; let i = index" class="submission-card">

              <!-- Submission header -->
              <div class="sub-header">
                <div class="sub-author">
                  <div class="sub-avatar">{{ (sub.user?.name ?? 'U')[0].toUpperCase() }}</div>
                  <div>
                    <div class="sub-name">
                      {{ sub.user?.name ?? 'Anonymous' }}
                      <span *ngIf="sub.userId === currentUserId" class="you-badge">You</span>
                    </div>
                    <div class="sub-date">{{ sub.createdAt | date:'mediumDate' }}</div>
                  </div>
                </div>
                <div class="sub-score" *ngIf="getAverageScore(sub) !== null">
                  <span class="score-num">{{ getAverageScore(sub) }}</span>
                  <span class="score-label">/ 10 avg</span>
                </div>
              </div>

              <!-- Submission content -->
              <div class="sub-content">{{ sub.content }}</div>

              <!-- Resource link -->
              <a
                *ngIf="sub.resourceUrl"
                [href]="sub.resourceUrl"
                target="_blank"
                rel="noopener"
                class="sub-link">
                View Resource ↗
              </a>

              <!-- ── Peer Reviews ── -->
              <div class="reviews-section">
                <div class="reviews-label">
                  Peer Reviews
                  <span class="reviews-count">({{ sub.reviews?.length ?? 0 }})</span>
                </div>

                <div *ngIf="sub.reviews && sub.reviews.length > 0" class="reviews-list">
                  <div *ngFor="let r of sub.reviews" class="review-row">
                    <div class="review-score-badge">{{ r.score }}/10</div>
                    <div class="review-body">
                      <span class="review-reviewer">{{ r.reviewer?.name ?? 'Anonymous' }}</span>
                      <span *ngIf="r.comment" class="review-comment">{{ r.comment }}</span>
                    </div>
                    <div class="review-stars">
                      <span *ngFor="let s of getStars(r.score)" class="star" [class.filled]="s">★</span>
                    </div>
                  </div>
                </div>

                <div *ngIf="!sub.reviews || sub.reviews.length === 0"
                     class="no-reviews">No reviews yet.</div>

                <!-- Add review button — can't review own submission -->
                <button
                  *ngIf="sub.userId !== currentUserId && !hasReviewed(sub)"
                  class="btn btn--ghost review-btn"
                  (click)="openReviewModal(sub.id)">
                  + Add Peer Review
                </button>

                <span *ngIf="hasReviewed(sub)" class="already-reviewed">
                  ✅ You reviewed this
                </span>
              </div>

            </div>
          </div>
        </section>

      </div>

      <!-- Error state -->
      <div *ngIf="!loading && !challenge" class="empty-state">
        <div class="empty-icon">❌</div>
        <h3>Challenge not found</h3>
        <a [routerLink]="['/silos', siloId]" class="btn btn--ghost" style="margin-top:12px">
          ← Back to Silo
        </a>
      </div>

      <!-- ══════════════════════════════════
           PEER REVIEW MODAL
      ══════════════════════════════════ -->
      <div *ngIf="reviewingId" class="modal-overlay" (click)="reviewingId = null">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Peer Review</h2>
            <button class="modal-close" (click)="reviewingId = null">✕</button>
          </div>
          <form [formGroup]="reviewForm" (ngSubmit)="submitReview()">
            <div class="modal-body">

              <!-- Score with visual slider + display -->
              <div class="form-field">
                <label>Score: <strong style="color:var(--accent)">{{ reviewForm.get('score')?.value }}/10</strong></label>
                <input
                  type="range"
                  formControlName="score"
                  min="1"
                  max="10"
                  step="1"
                  class="score-slider" />
                <div class="score-labels">
                  <span>1 — Needs work</span>
                  <span>10 — Excellent</span>
                </div>
                <!-- Star preview -->
                <div class="star-preview">
                  <span
                    *ngFor="let s of getStars(reviewForm.get('score')?.value)"
                    class="star"
                    [class.filled]="s">★</span>
                </div>
              </div>

              <div class="form-field">
                <label>Comment <span class="label-hint">(optional)</span></label>
                <textarea
                  formControlName="comment"
                  placeholder="What did you like? What could be improved?"
                  rows="3"></textarea>
              </div>

              <div *ngIf="reviewError" class="error-msg">{{ reviewError }}</div>

              <div class="modal-actions">
                <button type="button" class="btn btn--ghost" (click)="reviewingId = null">
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn--primary"
                  [disabled]="reviewLoading || reviewForm.invalid">
                  {{ reviewLoading ? 'Submitting…' : 'Submit Review' }}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

    /* ── Back link ── */
    .back-link {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 13px; color: var(--text-secondary);
      text-decoration: none; margin-bottom: 24px;
      padding: 6px 12px; border-radius: 8px;
      border: 1px solid var(--border);
      transition: all 0.2s;
    }
    .back-link:hover { color: var(--text-primary); background: var(--bg-elevated); }

    /* ── Loading ── */
    .loading-row {
      display: flex; align-items: center; gap: 10px;
      color: var(--text-secondary); font-size: 14px; padding: 32px 0;
    }

    /* ── Challenge header ── */
    .challenge-header {
      display: flex; align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 20px; flex-wrap: wrap; gap: 16px;
    }
    .challenge-header-left { display: flex; align-items: flex-start; gap: 16px; }
    .challenge-icon {
      width: 52px; height: 52px; border-radius: 14px;
      background: var(--accent-dim);
      display: flex; align-items: center; justify-content: center;
      font-size: 26px; flex-shrink: 0;
    }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
    .challenge-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

    /* ── Description ── */
    .challenge-desc {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px;
      margin-bottom: 32px;
    }
    .challenge-desc p { font-size: 15px; color: var(--text-secondary); line-height: 1.7; }

    /* ── Section blocks ── */
    .section-block { margin-bottom: 40px; }
    .section-block-header {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 16px; flex-wrap: wrap;
    }
    .section-block-header h2 { font-size: 18px; font-weight: 700; }
    .section-hint { font-size: 13px; color: var(--text-muted); }

    /* ── Submit card ── */
    .submit-card {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 24px;
    }
    .form-stack { display: flex; flex-direction: column; gap: 16px; }
    .form-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .already-submitted { font-size: 13px; color: #4ade80; }
    .already-reviewed { font-size: 12px; color: #4ade80; }

    /* ── Submissions list ── */
    .submissions-list { display: flex; flex-direction: column; gap: 16px; }
    .submission-card {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px;
      transition: border-color 0.2s;
    }
    .submission-card:hover { border-color: var(--accent-dim); }

    .sub-header {
      display: flex; align-items: flex-start;
      justify-content: space-between; margin-bottom: 14px; gap: 12px;
    }
    .sub-author { display: flex; align-items: center; gap: 10px; }
    .sub-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--accent-dim); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px; flex-shrink: 0;
    }
    .sub-name { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
    .sub-date { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
    .you-badge {
      font-size: 10px; font-weight: 700; padding: 2px 7px;
      background: var(--accent); color: var(--bg-primary);
      border-radius: 100px; text-transform: uppercase; letter-spacing: 0.05em;
    }

    .sub-score { text-align: right; flex-shrink: 0; }
    .score-num { font-family: var(--font-display); font-size: 24px; font-weight: 800; color: var(--accent); }
    .score-label { font-size: 11px; color: var(--text-muted); }

    .sub-content {
      font-size: 14px; color: var(--text-secondary);
      line-height: 1.65; margin-bottom: 12px;
      white-space: pre-wrap;
    }
    .sub-link {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 13px; color: var(--accent);
      text-decoration: none; margin-bottom: 16px;
    }
    .sub-link:hover { opacity: 0.8; }

    /* ── Reviews section ── */
    .reviews-section {
      border-top: 1px solid var(--border);
      padding-top: 14px; margin-top: 4px;
    }
    .reviews-label {
      font-size: 12px; font-weight: 700;
      color: var(--text-secondary); text-transform: uppercase;
      letter-spacing: 0.06em; margin-bottom: 10px;
    }
    .reviews-count { font-weight: 400; color: var(--text-muted); margin-left: 4px; }
    .reviews-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
    .review-row {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 10px 12px; background: var(--bg-surface);
      border-radius: var(--radius); border: 1px solid var(--border);
    }
    .review-score-badge {
      font-size: 12px; font-weight: 700; padding: 3px 8px;
      background: var(--accent-dim); color: var(--accent);
      border-radius: 6px; white-space: nowrap; flex-shrink: 0;
    }
    .review-body { flex: 1; min-width: 0; }
    .review-reviewer { font-size: 13px; font-weight: 600; display: block; margin-bottom: 2px; }
    .review-comment { font-size: 13px; color: var(--text-secondary); }
    .review-stars { display: flex; gap: 1px; flex-shrink: 0; }
    .star { font-size: 12px; color: var(--border); }
    .star.filled { color: var(--accent); }
    .no-reviews { font-size: 13px; color: var(--text-muted); margin-bottom: 10px; }
    .review-btn { font-size: 13px; padding: 6px 14px; margin-top: 4px; }

    /* ── Empty state ── */
    .empty-state { text-align: center; padding: 48px 20px; color: var(--text-secondary); }
    .empty-icon { font-size: 40px; margin-bottom: 12px; }
    .empty-state h3 { font-size: 16px; color: var(--text-primary); margin-bottom: 6px; }
    .empty-state p { font-size: 13px; }

    /* ── Form fields ── */
    .form-field { display: flex; flex-direction: column; gap: 6px; }
    .form-field label {
      font-size: 12px; font-weight: 600; color: var(--text-secondary);
      text-transform: uppercase; letter-spacing: 0.03em;
    }
    .label-hint { font-size: 11px; color: var(--text-muted); text-transform: none; font-weight: 400; margin-left: 4px; }
    .form-field input, .form-field textarea {
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 10px 14px;
      color: var(--text-primary); font-family: var(--font-body);
      font-size: 14px; outline: none; transition: border-color 0.2s;
      width: 100%; box-sizing: border-box;
    }
    .form-field input:focus, .form-field textarea:focus { border-color: var(--accent); }
    .form-field textarea { resize: vertical; min-height: 80px; }
    .field-error { font-size: 12px; color: #f87171; }

    /* ── Score slider ── */
    .score-slider {
      width: 100%; accent-color: var(--accent);
      height: 6px; cursor: pointer;
      background: var(--bg-surface) !important;
      border: none !important; padding: 0 !important;
    }
    .score-labels {
      display: flex; justify-content: space-between;
      font-size: 11px; color: var(--text-muted); margin-top: 4px;
    }
    .star-preview { display: flex; gap: 2px; margin-top: 8px; }
    .star-preview .star { font-size: 18px; }

    /* ── Error ── */
    .error-msg {
      font-size: 13px; color: #f87171;
      background: rgba(248,113,113,0.08);
      border: 1px solid rgba(248,113,113,0.2);
      border-radius: 8px; padding: 10px 14px;
    }

    /* ── Badges ── */
    .badge {
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .badge--accent { background: var(--accent-dim); color: var(--accent); }
    .badge--muted { background: var(--bg-surface); color: var(--text-secondary); border: 1px solid var(--border); }

    /* ── Modal ── */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.75);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 20px;
    }
    .modal {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius-lg); width: 100%; max-width: 480px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.6); max-height: 90vh; overflow-y: auto;
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 20px; border-bottom: 1px solid var(--border);
      position: sticky; top: 0; background: var(--bg-elevated); z-index: 1;
    }
    .modal-header h2 { font-size: 16px; font-weight: 700; margin: 0; }
    .modal-close {
      background: none; border: none; color: var(--text-secondary);
      font-size: 18px; cursor: pointer; padding: 4px 8px; border-radius: 6px;
    }
    .modal-close:hover { background: var(--bg-surface); color: var(--text-primary); }
    .modal-body { display: flex; flex-direction: column; gap: 16px; padding: 20px; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

    /* ── Buttons ── */
    .btn {
      padding: 9px 18px; border-radius: var(--radius);
      font-size: 14px; font-weight: 600; cursor: pointer;
      border: none; font-family: var(--font-body);
      transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
      text-decoration: none;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn--primary { background: var(--accent); color: var(--bg-primary); }
    .btn--primary:not(:disabled):hover { opacity: 0.9; transform: translateY(-1px); }
    .btn--ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); }
    .btn--ghost:hover { color: var(--text-primary); border-color: var(--text-secondary); }
  `]
})
export class ChallengeDetailComponent implements OnInit {

  challenge: Challenge | null = null;
  submissions: Submission[] = [];
  loading = true;
  loadingSubmissions = true;
  siloId = '';
  challengeId = '';

  reviewingId: string | null = null;
  submitLoading = false;
  submitError = '';
  reviewLoading = false;
  reviewError = '';

  submitForm: FormGroup;
  reviewForm: FormGroup;

  get currentUserId(): string | undefined {
    return this.auth.currentUser?.id;
  }

  // Check if user already submitted
  get alreadySubmitted(): boolean {
    return this.submissions.some(s => s.userId === this.currentUserId);
  }

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {
    this.submitForm = this.fb.group({
      content:     ['', [Validators.required, Validators.minLength(10)]],
      resourceUrl: ['']
    });

    this.reviewForm = this.fb.group({
      score:   [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      comment: ['']
    });
  }

  ngOnInit() {
    this.siloId      = this.route.snapshot.paramMap.get('siloId') ?? '';
    this.challengeId = this.route.snapshot.paramMap.get('id')     ?? '';

    // Load challenge details
    this.api.getChallenge(this.siloId, this.challengeId).subscribe({
      next:  (c) => { this.challenge = c; this.loading = false; },
      error: ()  => { this.loading = false; this.toast.error('Failed to load challenge'); }
    });

    // Load submissions with their reviews
    this.loadSubmissions();
  }

  loadSubmissions() {
    this.loadingSubmissions = true;
    this.api.getChallengeSubmissions(this.challengeId).subscribe({
      next:  (s) => { this.submissions = s ?? []; this.loadingSubmissions = false; },
      error: ()  => { this.loadingSubmissions = false; }
    });
  }

  // ── Submit work ─────────────────────────────────────────────

  submitWork() {
    if (this.submitForm.invalid) return;

    this.submitLoading = true;
    this.submitError   = '';

    const { content, resourceUrl } = this.submitForm.value;

    this.api.submitChallenge(this.challengeId, {
      content: content!,
      resourceUrl: resourceUrl || undefined
    }).subscribe({
      next: (s) => {
        this.submissions   = [s, ...this.submissions];
        this.submitLoading = false;
        this.submitForm.reset();
        this.toast.success('Solution submitted successfully!');
      },
      error: (e) => {
        this.submitLoading = false;
        this.submitError   = e?.error?.message || 'Submission failed. Please try again.';
      }
    });
  }

  // ── Peer review ─────────────────────────────────────────────

  openReviewModal(submissionId: string) {
    this.reviewingId = submissionId;
    this.reviewError = '';
    this.reviewForm.reset({ score: 5, comment: '' });
  }

  submitReview() {
    if (this.reviewForm.invalid || !this.reviewingId) return;

    this.reviewLoading = true;
    this.reviewError   = '';

    this.api.reviewSubmission(this.reviewingId, this.reviewForm.value).subscribe({
      next: () => {
        this.reviewingId  = null;
        this.reviewLoading = false;
        this.toast.success('Review submitted!');
        // Reload submissions so the new review appears inline
        this.loadSubmissions();
      },
      error: (e) => {
        this.reviewLoading = false;
        this.reviewError   = e?.error?.message || 'Failed to submit review.';
      }
    });
  }

  // ── Helpers ─────────────────────────────────────────────────

  /** Returns true if the current user already reviewed this submission */
  hasReviewed(sub: Submission): boolean {
    return sub.reviews?.some(r => r.reviewerId === this.currentUserId) ?? false;
  }

  /** Average score across all peer reviews for a submission */
  getAverageScore(sub: Submission): number | null {
    if (!sub.reviews || sub.reviews.length === 0) return null;
    const total = sub.reviews.reduce((sum, r) => sum + r.score, 0);
    return Math.round((total / sub.reviews.length) * 10) / 10;
  }

  /**
   * Returns an array of 10 booleans for star display
   * scaled from score/10 → 5 stars (every 2 points = 1 star)
   */
  getStars(score: number): boolean[] {
    const filled = Math.round(score / 2); // 10→5, 8→4, 6→3 etc.
    return Array.from({ length: 5 }, (_, i) => i < filled);
  }
}



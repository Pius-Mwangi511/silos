import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Challenge, Submission } from '../../../shared/models';

@Component({
  selector: 'app-challenge-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  template: `
    <div class="animate-fade-in">
      <a [routerLink]="['/silos', siloId]" class="back-link">← Back to Silo</a>

      <div *ngIf="loading" class="loading-row">
        <span class="spinner"></span> Loading…
      </div>

      <div *ngIf="!loading && challenge">
        <div class="challenge-header">
          <div>
            <h1>{{ challenge.title }}</h1>
            <span *ngIf="challenge.dueDate" class="badge badge--muted" style="margin-top:8px">
              Due {{ challenge.dueDate | date:'mediumDate' }}
            </span>
          </div>
        </div>

        <div class="challenge-desc card" style="margin-bottom:24px">
          <p>{{ challenge.description }}</p>
        </div>

        <!-- Submit Form -->
        <section class="section">
          <h2>Submit Your Work</h2>
          <form [formGroup]="submitForm" (ngSubmit)="submitWork()">
            <div style="display:flex;flex-direction:column;gap:14px">
              <div class="form-field">
                <label>Your Solution</label>
                <textarea formControlName="content" placeholder="Describe your approach or paste your solution…"></textarea>
              </div>
              <div class="form-field">
                <label>Resource URL <span style="color:var(--text-muted);font-weight:400;text-transform:none;letter-spacing:0">(optional)</span></label>
                <input type="url" formControlName="resourceUrl" placeholder="https://github.com/your/repo" />
              </div>
              <div *ngIf="submitError" class="error-msg">{{ submitError }}</div>
              <div>
                <button type="submit" class="btn btn--primary" [disabled]="submitLoading">
                  <span *ngIf="submitLoading" class="spinner" style="width:14px;height:14px"></span>
                  Submit
                </button>
              </div>
            </div>
          </form>
        </section>

        <!-- Submissions -->
        <section class="section">
          <h2>Submissions ({{ submissions.length }})</h2>
          <div *ngIf="submissions.length === 0" class="empty-state">
            <div class="icon">📝</div>
            <h3>No submissions yet</h3>
          </div>

          <div *ngIf="submissions.length > 0" style="display:flex;flex-direction:column;gap:14px">
            <div *ngFor="let sub of submissions" class="submission-card">
              <div class="submission-header">
                <div class="sub-author">
                  <div class="sub-avatar">{{ (sub.user?.name ?? 'U')[0] }}</div>
                  {{ sub.user?.name }}
                </div>
                <span class="sub-date">{{ sub.createdAt | date:'mediumDate' }}</span>
              </div>
              <p class="sub-content">{{ sub.content }}</p>
              <a *ngIf="sub.resourceUrl" [href]="sub.resourceUrl" target="_blank" class="sub-link">View Resource ↗</a>

              <!-- Peer Review -->
              <div class="review-section">
                <div class="review-header">Peer Reviews</div>
                <div *ngIf="sub.reviews && sub.reviews.length > 0">
                  <div *ngFor="let r of sub.reviews" class="review-row">
                    <span class="review-score">{{ r.score }}/10</span>
                    <span class="review-reviewer">{{ r.reviewer?.name }}</span>
                    <span *ngIf="r.comment" class="review-comment">— {{ r.comment }}</span>
                  </div>
                </div>
                <button *ngIf="sub.userId !== currentUserId" class="btn btn--ghost" style="margin-top:8px;font-size:13px;padding:6px 14px"
                  (click)="openReviewModal(sub.id)">+ Add Review</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Review Modal -->
      <div *ngIf="reviewingId" class="modal-overlay" (click)="reviewingId = null">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Peer Review</h2>
            <button class="modal-close" (click)="reviewingId = null">✕</button>
          </div>
          <form [formGroup]="reviewForm" (ngSubmit)="submitReview()">
            <div style="display:flex;flex-direction:column;gap:14px">
              <div class="form-field">
                <label>Score (1–10)</label>
                <input type="number" formControlName="score" min="1" max="10" />
              </div>
              <div class="form-field">
                <label>Comment (optional)</label>
                <textarea formControlName="comment" placeholder="Feedback…"></textarea>
              </div>
              <div style="display:flex;gap:10px;justify-content:flex-end">
                <button type="button" class="btn btn--ghost" (click)="reviewingId = null">Cancel</button>
                <button type="submit" class="btn btn--primary" [disabled]="reviewLoading">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [/* keep your styles as-is */]
})
export class ChallengeDetailComponent implements OnInit {
  challenge: Challenge | null = null;
  submissions: Submission[] = [];
  loading = true;
  siloId = '';
  challengeId = '';
  reviewingId: string | null = null;
  submitLoading = false;
  submitError = '';
  reviewLoading = false;

  submitForm: FormGroup;
  reviewForm: FormGroup;

  get currentUserId() { return this.auth.currentUser?.id; }

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {
    // Initialize forms inside constructor to fix TS2729
    this.submitForm = this.fb.group({
      content: ['', Validators.required],
      resourceUrl: ['']
    });
    this.reviewForm = this.fb.group({
      score: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      comment: ['']
    });
  }

  ngOnInit() {
    this.siloId = this.route.snapshot.paramMap.get('siloId')!;
    this.challengeId = this.route.snapshot.paramMap.get('id')!;
    this.api.getChallenge(this.siloId, this.challengeId).subscribe({
      next: c => { this.challenge = c; this.loading = false; },
      error: () => this.loading = false
    });
    this.api.getChallengeSubmissions(this.challengeId).subscribe({
      next: s => this.submissions = s,
      error: () => {}
    });
  }

  submitWork() {
    if (this.submitForm.invalid) return;
    this.submitLoading = true;
    this.submitError = '';
    const { content, resourceUrl } = this.submitForm.value;
    this.api.submitChallenge(this.challengeId, { content: content!, resourceUrl: resourceUrl || undefined }).subscribe({
      next: s => {
        this.submissions = [s, ...this.submissions];
        this.submitForm.reset();
        this.submitLoading = false;
        this.toast.success('Submitted!');
      },
      error: e => {
        this.submitError = e.error?.message || 'Failed';
        this.submitLoading = false;
      }
    });
  }

  openReviewModal(submissionId: string) {
    this.reviewingId = submissionId;
    this.reviewForm.reset({ score: 5, comment: '' });
  }

  submitReview() {
    if (this.reviewForm.invalid || !this.reviewingId) return;
    this.reviewLoading = true;
    this.api.reviewSubmission(this.reviewingId, this.reviewForm.value as any).subscribe({
      next: () => {
        this.reviewingId = null;
        this.reviewLoading = false;
        this.toast.success('Review submitted!');
        this.api.getChallengeSubmissions(this.challengeId).subscribe(s => this.submissions = s);
      },
      error: () => this.reviewLoading = false
    });
  }
}
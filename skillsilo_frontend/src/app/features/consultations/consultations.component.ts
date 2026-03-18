import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Consultation, Silo } from '../../shared/models';

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="animate-fade-in">
      <div class="page-header">
        <div>
          <h1>Consultations</h1>
          <p>Request help or expertise from another silo.</p>
        </div>
        <button class="btn btn--primary" (click)="showModal = true">+ Request Consultation</button>
      </div>

      <!-- Tabs -->
      <div class="tabs" style="margin-bottom:24px">
        @for (t of tabs; track t) {
          <button
            class="tab"
            [class.active]="tab === t"
            (click)="tab = t; loadConsultations()">
            {{ t === 'incoming' ? '📥 Incoming' : '📤 Outgoing' }}
          </button>
        }
      </div>

      @if (selectedSiloId) {
        @if (loading) {
          <div class="loading-row"><span class="spinner"></span> Loading…</div>
        } @else if (consultations.length === 0) {
          <div class="empty-state"><div class="icon">💬</div><h3>No {{ tab }} consultations</h3></div>
        } @else {
          <div style="display:flex;flex-direction:column;gap:14px">
            @for (c of consultations; track c.id) {
              <div class="consult-card">
                <div class="consult-header">
                  <div>
                    <span class="consult-silos">{{ c.fromSilo?.skill ?? c.fromSiloId }} → {{ c.toSilo?.skill ?? c.toSiloId }}</span>
                    <div class="consult-date">{{ c.createdAt | date:'mediumDate' }}</div>
                  </div>
                  <span class="badge" [class.badge--success]="c.status === 'RESPONDED'" [class.badge--accent]="c.status === 'PENDING'">
                    {{ c.status }}
                  </span>
                </div>
                <p class="consult-desc">{{ c.description }}</p>
                @if (c.responseMessage) {
                  <div class="response-box">
                    <div class="response-label">Response</div>
                    <p>{{ c.responseMessage }}</p>
                  </div>
                }
                @if (tab === 'incoming' && c.status === 'PENDING') {
                  <div class="respond-row">
                    <input type="text" [(ngModel)]="responseMessages[c.id]" placeholder="Write your response…" class="respond-input" />
                    <button class="btn btn--primary" style="font-size:13px;padding:8px 16px" (click)="respond(c.id)">Send</button>
                  </div>
                }
              </div>
            }
          </div>
        }
      } @else {
        <div class="silo-select-prompt">
          <p>Select one of your silos to view consultations:</p>
          <div class="silo-pills">
            @for (s of silos; track s.id) {
              <button class="silo-pill" (click)="selectSilo(s.id)">{{ s.skill }}</button>
            }
          </div>
        </div>
      }

      <!-- Create Modal -->
      @if (showModal) {
        <div class="modal-overlay" (click)="showModal = false">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Request Consultation</h2>
              <button class="modal-close" (click)="showModal = false">✕</button>
            </div>
            <form [formGroup]="form" (ngSubmit)="submit()">
              <div style="display:flex;flex-direction:column;gap:14px">
                <div class="form-field">
                  <label>From Silo</label>
                  <select formControlName="fromSiloId">
                    <option value="">Select silo…</option>
                    @for (s of silos; track s.id) { <option [value]="s.id">{{ s.skill }}</option> }
                  </select>
                </div>
                <div class="form-field">
                  <label>To Silo ID</label>
                  <input type="text" formControlName="toSiloId" placeholder="Paste target silo UUID" />
                </div>
                <div class="form-field"><label>Description</label><textarea formControlName="description" placeholder="What do you need help with?"></textarea></div>
                @if (error) { <div class="error-msg">{{ error }}</div> }
                <div style="display:flex;gap:10px;justify-content:flex-end">
                  <button type="button" class="btn btn--ghost" (click)="showModal = false">Cancel</button>
                  <button type="submit" class="btn btn--primary" [disabled]="submitting">Send Request</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--border); }
    .tab { background: none; border: none; padding: 10px 18px; color: var(--text-secondary); font-size: 14px; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; transition: all var(--transition); }
    .tab:hover { color: var(--text-primary); }
    .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
    .loading-row { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); padding: 32px 0; }
    .consult-card { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
    .consult-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
    .consult-silos { font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .consult-date { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
    .consult-desc { font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; }
    .response-box { background: var(--bg-elevated); border-radius: var(--radius); padding: 12px; margin-bottom: 12px; }
    .response-label { font-size: 11px; font-weight: 600; color: var(--success); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .response-box p { font-size: 13px; color: var(--text-secondary); }
    .respond-row { display: flex; gap: 8px; }
    .respond-input {
      flex: 1; background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 8px 12px; color: var(--text-primary);
      font-size: 13px; outline: none;
    }
    .respond-input:focus { border-color: var(--accent); }
    .silo-select-prompt { padding: 32px 0; }
    .silo-select-prompt p { color: var(--text-secondary); font-size: 14px; margin-bottom: 14px; }
    .silo-pills { display: flex; flex-wrap: wrap; gap: 8px; }
    .silo-pill {
      padding: 8px 16px; background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: 100px; font-size: 13px; cursor: pointer; color: var(--text-primary);
      font-family: var(--font-body); transition: all var(--transition);
    }
    .silo-pill:hover { border-color: var(--accent); color: var(--accent); }
  `]
})
export class ConsultationsComponent implements OnInit {

  consultations: Consultation[] = [];
  silos: Silo[] = [];
  loading = false;
  submitting = false;
  showModal = false;
  error = '';
  
  // Fixed the typing issue by declaring tab type correctly and tabs array
  tab: 'incoming' | 'outgoing' = 'incoming';
  tabs: Array<'incoming' | 'outgoing'> = ['incoming', 'outgoing'];

  selectedSiloId = '';
  responseMessages: Record<string, string> = {};
  form!: FormGroup;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

  ngOnInit() {

    this.form = this.fb.group({
      fromSiloId: ['', Validators.required],
      toSiloId: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.api.getSilos().subscribe({
      next: s => this.silos = s,
      error: () => {}
    });
  }

  selectSilo(id: string) {
    this.selectedSiloId = id;
    this.loadConsultations();
  }

  loadConsultations() {
    if (!this.selectedSiloId) return;

    this.loading = true;

    const req$ = this.tab === 'incoming'
      ? this.api.getIncomingConsultations(this.selectedSiloId)
      : this.api.getOutgoingConsultations(this.selectedSiloId);

    req$.subscribe({
      next: c => {
        this.consultations = c;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.submitting = true;
    this.error = '';

    this.api.createConsultation(this.form.value as any).subscribe({
      next: () => {
        this.showModal = false;
        this.submitting = false;
        this.form.reset();
        this.toast.success('Consultation request sent!');
        this.loadConsultations();
      },
      error: (e) => {
        this.error = e.error?.message || 'Failed';
        this.submitting = false;
      }
    });
  }

  respond(id: string) {
    const msg = this.responseMessages[id]?.trim();
    if (!msg) return;

    this.api.respondConsultation(id, msg).subscribe({
      next: () => {
        this.responseMessages[id] = '';
        this.toast.success('Response sent!');
        this.loadConsultations();
      },
      error: () => {}
    });
  }
}
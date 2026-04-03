import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Consultation, Silo } from '../../shared/models';

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="animate-fade-in">

      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>Consultations</h1>
          <p>Request help or expertise from another silo.</p>
        </div>
        <button class="btn btn--primary" (click)="openModal()">+ Request Consultation</button>
      </div>

      <!-- My Silos selector -->
      <div class="silo-selector-bar">
        <span class="selector-label">Viewing as:</span>
        <div class="silo-pills">
          <button
            *ngFor="let s of mySilos"
            class="silo-pill"
            [class.active]="selectedSiloId === s.id"
            (click)="selectSilo(s.id)">
            {{ s.skill }}
          </button>
        </div>
        <div *ngIf="mySilos.length === 0 && !loadingSilos" class="no-silos-msg">
          You haven't joined any silos yet.
          <a href="/silos" style="color:var(--accent);text-decoration:underline;margin-left:4px">Browse silos →</a>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          *ngFor="let t of tabs"
          class="tab"
          [class.active]="tab === t"
          (click)="switchTab(t)">
          {{ t === 'incoming' ? '📥 Incoming' : '📤 Outgoing' }}
          <span *ngIf="getCount(t) > 0" class="tab-badge">{{ getCount(t) }}</span>
        </button>
      </div>

      <!-- Content area -->
      <div *ngIf="!selectedSiloId && mySilos.length > 0" class="select-prompt">
        <div class="icon">👆</div>
        <p>Select one of your silos above to view consultations.</p>
      </div>

      <div *ngIf="selectedSiloId">

        <div *ngIf="loading" class="loading-row">
          <span class="spinner"></span> Loading consultations…
        </div>

        <div *ngIf="!loading && consultations.length === 0" class="empty-state">
          <div class="icon">{{ tab === 'incoming' ? '📥' : '📤' }}</div>
          <h3>No {{ tab }} consultations</h3>
          <p *ngIf="tab === 'outgoing'">
            <button class="btn btn--primary" style="margin-top:12px" (click)="openModal()">
              Request your first consultation
            </button>
          </p>
        </div>

        <div *ngIf="!loading && consultations.length > 0"
             style="display:flex;flex-direction:column;gap:14px">

          <div *ngFor="let c of consultations" class="consult-card">

            <div class="consult-header">
              <div class="consult-route">
                <span class="silo-tag from">{{ c.fromSilo?.skill ?? '—' }}</span>
                <span class="arrow">→</span>
                <span class="silo-tag to">{{ c.toSilo?.skill ?? '—' }}</span>
              </div>
              <span class="status-badge"
                    [class.status-open]="c.status === 'OPEN' || c.status === 'PENDING'"
                    [class.status-responded]="c.status === 'RESPONDED'">
                {{ c.status }}
              </span>
            </div>

            <p class="consult-desc">{{ c.description }}</p>

            <div class="consult-meta">
              <span>{{ c.createdAt | date:'mediumDate' }}</span>
              <span *ngIf="c.respondedAt">· Responded {{ c.respondedAt | date:'mediumDate' }}</span>
            </div>

            <!-- Response (if already responded) -->
            <div *ngIf="c.responseMessage" class="response-box">
              <div class="response-label">✅ Response</div>
              <p>{{ c.responseMessage }}</p>
            </div>

            <!-- Respond input (incoming + pending only) -->
            <div *ngIf="tab === 'incoming' && (c.status === 'OPEN' || c.status === 'PENDING')"
                 class="respond-row">
              <input
                type="text"
                [(ngModel)]="responseMessages[c.id]"
                placeholder="Write your response…"
                class="respond-input"
                [disabled]="responding[c.id]"
                (keyup.enter)="respond(c.id)" />
              <button
                class="btn btn--primary"
                style="font-size:13px;padding:8px 16px;white-space:nowrap"
                [disabled]="responding[c.id] || !responseMessages[c.id]?.trim()"
                (click)="respond(c.id)">
                {{ responding[c.id] ? 'Sending…' : 'Respond' }}
              </button>
            </div>

          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════
           CREATE CONSULTATION MODAL
      ══════════════════════════════════ -->
      <div *ngIf="showModal" class="modal-overlay" (click)="showModal = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Request Consultation</h2>
            <button class="modal-close" (click)="showModal = false">✕</button>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="modal-body">

              <!-- From Silo — dropdown of user's silos -->
              <div class="form-field">
                <label>From Silo <span class="label-hint">(one of your silos)</span></label>
                <select formControlName="fromSiloId">
                  <option value="">Select your silo…</option>
                  <option *ngFor="let s of mySilos" [value]="s.id">
                    {{ s.skill }} · {{ s.level }}
                  </option>
                </select>
                <div *ngIf="mySilos.length === 0" class="field-hint">
                  You need to join a silo before requesting consultations.
                </div>
              </div>

              <!-- To Silo — searchable dropdown of ALL silos -->
              <div class="form-field">
                <label>To Silo <span class="label-hint">(silo you need help from)</span></label>

                <!-- Search box -->
                <input
                  type="text"
                  [(ngModel)]="siloSearch"
                  [ngModelOptions]="{standalone: true}"
                  placeholder="Search silos by name…"
                  class="search-input"
                  (input)="filterSilos()" />

                <!-- Dropdown list -->
                <div class="silo-dropdown" *ngIf="filteredAllSilos.length > 0">
                  <div
                    *ngFor="let s of filteredAllSilos"
                    class="silo-option"
                    [class.selected]="form.get('toSiloId')?.value === s.id"
                    [class.disabled]="form.get('fromSiloId')?.value === s.id"
                    (click)="selectToSilo(s)">
                    <div class="silo-option-name">{{ s.skill }}</div>
                    <div class="silo-option-meta">
                      <span class="level-tag" [class]="'level-' + s.level?.toLowerCase()">
                        {{ s.level }}
                      </span>
                      <span *ngIf="form.get('fromSiloId')?.value === s.id"
                            style="font-size:11px;color:var(--text-muted)">
                        (your silo)
                      </span>
                    </div>
                    <span *ngIf="form.get('toSiloId')?.value === s.id" class="check">✓</span>
                  </div>
                </div>

                <!-- Selected silo display -->
                <div *ngIf="selectedToSilo" class="selected-silo-display">
                  <span>Selected: <strong>{{ selectedToSilo.skill }}</strong> · {{ selectedToSilo.level }}</span>
                  <button type="button" class="clear-btn" (click)="clearToSilo()">✕</button>
                </div>

                <div *ngIf="filteredAllSilos.length === 0 && siloSearch" class="field-hint">
                  No silos match "{{ siloSearch }}"
                </div>
              </div>

              <!-- Description -->
              <div class="form-field">
                <label>What do you need help with?</label>
                <textarea
                  formControlName="description"
                  placeholder="Describe what expertise or help you need from this silo…"></textarea>
              </div>

              <div *ngIf="error" class="error-msg">{{ error }}</div>

              <div class="modal-actions">
                <button type="button" class="btn btn--ghost" (click)="showModal = false">
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn--primary"
                  [disabled]="submitting || form.invalid">
                  {{ submitting ? 'Sending…' : 'Send Request' }}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* ── Page header ── */
    .page-header {
      display: flex; align-items: flex-start;
      justify-content: space-between; margin-bottom: 24px;
      flex-wrap: wrap; gap: 16px;
    }
    .page-header h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .page-header p { font-size: 14px; color: var(--text-secondary); }

    /* ── Silo selector bar ── */
    .silo-selector-bar {
      display: flex; align-items: center; gap: 12px;
      flex-wrap: wrap; margin-bottom: 20px;
      padding: 14px 16px;
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }
    .selector-label {
      font-size: 12px; font-weight: 600;
      color: var(--text-secondary); white-space: nowrap;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .silo-pills { display: flex; flex-wrap: wrap; gap: 8px; }
    .silo-pill {
      padding: 6px 14px; background: var(--bg-elevated);
      border: 1px solid var(--border); border-radius: 100px;
      font-size: 13px; cursor: pointer; color: var(--text-primary);
      font-family: var(--font-body); transition: all 0.2s;
    }
    .silo-pill:hover { border-color: var(--accent); color: var(--accent); }
    .silo-pill.active {
      background: var(--accent-dim); border-color: var(--accent);
      color: var(--accent); font-weight: 600;
    }
    .no-silos-msg { font-size: 13px; color: var(--text-secondary); }

    /* ── Tabs ── */
    .tabs {
      display: flex; gap: 2px;
      border-bottom: 1px solid var(--border); margin-bottom: 24px;
    }
    .tab {
      background: none; border: none; padding: 10px 18px;
      color: var(--text-secondary); font-size: 14px; font-weight: 500;
      cursor: pointer; border-bottom: 2px solid transparent;
      transition: all 0.2s; display: flex; align-items: center; gap: 6px;
    }
    .tab:hover { color: var(--text-primary); }
    .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
    .tab-badge {
      background: var(--accent); color: var(--bg-primary);
      font-size: 10px; font-weight: 800; padding: 1px 6px;
      border-radius: 100px; min-width: 18px; text-align: center;
    }

    /* ── States ── */
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
    .select-prompt {
      text-align: center; padding: 40px 20px;
      color: var(--text-secondary); font-size: 14px;
    }
    .select-prompt .icon { font-size: 32px; margin-bottom: 8px; }

    /* ── Consultation card ── */
    .consult-card {
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px;
      transition: border-color 0.2s;
    }
    .consult-card:hover { border-color: var(--accent-dim); }

    .consult-header {
      display: flex; align-items: center;
      justify-content: space-between; margin-bottom: 12px;
      flex-wrap: wrap; gap: 8px;
    }
    .consult-route { display: flex; align-items: center; gap: 8px; }
    .silo-tag {
      padding: 4px 12px; border-radius: 100px;
      font-size: 13px; font-weight: 600;
    }
    .silo-tag.from {
      background: rgba(167,139,250,0.12); color: #a78bfa;
      border: 1px solid rgba(167,139,250,0.25);
    }
    .silo-tag.to {
      background: var(--accent-dim); color: var(--accent);
      border: 1px solid rgba(245,166,35,0.25);
    }
    .arrow { color: var(--text-muted); font-size: 16px; }

    .status-badge {
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .status-open { background: rgba(245,197,24,0.12); color: #facc15; border: 1px solid rgba(245,197,24,0.3); }
    .status-responded { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.25); }

    .consult-desc {
      font-size: 14px; color: var(--text-secondary);
      line-height: 1.6; margin-bottom: 8px;
    }
    .consult-meta { font-size: 11px; color: var(--text-muted); margin-bottom: 12px; }

    .response-box {
      background: var(--bg-elevated); border-radius: var(--radius);
      padding: 12px; margin-bottom: 12px;
      border-left: 3px solid #4ade80;
    }
    .response-label {
      font-size: 11px; font-weight: 700; color: #4ade80;
      text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;
    }
    .response-box p { font-size: 13px; color: var(--text-secondary); margin: 0; }

    .respond-row { display: flex; gap: 8px; }
    .respond-input {
      flex: 1; background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 8px 12px; color: var(--text-primary);
      font-size: 13px; outline: none; font-family: var(--font-body);
      transition: border-color 0.2s;
    }
    .respond-input:focus { border-color: var(--accent); }
    .respond-input:disabled { opacity: 0.5; }

    /* ── Modal ── */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.75);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 20px;
    }
    .modal {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius-lg); width: 100%; max-width: 520px;
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
      font-size: 18px; cursor: pointer; padding: 4px 8px; border-radius: 6px;
    }
    .modal-close:hover { background: var(--bg-surface); color: var(--text-primary); }
    .modal-body { display: flex; flex-direction: column; gap: 16px; padding: 20px; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; padding-top: 4px; }

    /* ── Form fields ── */
    .form-field { display: flex; flex-direction: column; gap: 6px; }
    .form-field label {
      font-size: 12px; font-weight: 600; color: var(--text-secondary);
      text-transform: uppercase; letter-spacing: 0.03em;
    }
    .label-hint { font-size: 11px; color: var(--text-muted); text-transform: none; font-weight: 400; }
    .form-field select,
    .form-field textarea,
    .search-input {
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 10px 14px;
      color: var(--text-primary); font-family: var(--font-body);
      font-size: 14px; outline: none; transition: border-color 0.2s;
      width: 100%; box-sizing: border-box;
    }
    .form-field select:focus,
    .form-field textarea:focus,
    .search-input:focus { border-color: var(--accent); }
    .form-field textarea { resize: vertical; min-height: 100px; }
    .form-field select { appearance: none; cursor: pointer; }
    .field-hint { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

    /* ── Silo dropdown ── */
    .silo-dropdown {
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: var(--radius); overflow-y: auto;
      max-height: 200px; margin-top: 4px;
    }
    .silo-option {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; cursor: pointer;
      transition: background 0.15s; border-bottom: 1px solid var(--border);
    }
    .silo-option:last-child { border-bottom: none; }
    .silo-option:hover:not(.disabled) { background: var(--bg-elevated); }
    .silo-option.selected { background: var(--accent-dim); }
    .silo-option.disabled { opacity: 0.45; cursor: not-allowed; }
    .silo-option-name { font-size: 14px; font-weight: 500; flex: 1; }
    .silo-option-meta { display: flex; align-items: center; gap: 6px; }
    .level-tag {
      font-size: 10px; font-weight: 700; padding: 2px 7px;
      border-radius: 100px; text-transform: uppercase; letter-spacing: 0.06em;
    }
    .level-beginner { background: rgba(74,222,128,0.12); color: #4ade80; }
    .level-intermediate { background: rgba(245,197,24,0.12); color: #facc15; }
    .level-advanced { background: rgba(248,113,113,0.12); color: #f87171; }
    .check { margin-left: auto; color: var(--accent); font-weight: 700; }

    .selected-silo-display {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 12px; background: var(--accent-dim);
      border: 1px solid var(--accent); border-radius: var(--radius);
      font-size: 13px; color: var(--text-primary); margin-top: 6px;
    }
    .clear-btn {
      background: none; border: none; cursor: pointer;
      color: var(--text-muted); font-size: 14px; padding: 0 4px;
    }
    .clear-btn:hover { color: var(--text-primary); }

    /* ── Error ── */
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
      transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn--primary { background: var(--accent); color: var(--bg-primary); }
    .btn--primary:not(:disabled):hover { opacity: 0.9; transform: translateY(-1px); }
    .btn--ghost {
      background: transparent; color: var(--text-secondary);
      border: 1px solid var(--border);
    }
    .btn--ghost:hover { color: var(--text-primary); border-color: var(--text-secondary); }
  `]
})
export class ConsultationsComponent implements OnInit {

  consultations: Consultation[] = [];
  allSilos: Silo[] = [];          // every silo (for "To Silo" dropdown)
  mySilos: Silo[] = [];           // silos the user has joined (for "From Silo" + selector bar)
  filteredAllSilos: Silo[] = [];  // search-filtered version of allSilos

  loading = false;
  loadingSilos = true;
  submitting = false;
  showModal = false;
  error = '';

  tab: 'incoming' | 'outgoing' = 'incoming';
  tabs: Array<'incoming' | 'outgoing'> = ['incoming', 'outgoing'];

  selectedSiloId = '';
  selectedToSilo: Silo | null = null;
  siloSearch = '';

  responseMessages: Record<string, string> = {};
  responding: Record<string, boolean> = {};

  // Count cache so tab badges stay accurate
  incomingCount = 0;
  outgoingCount = 0;

  form!: FormGroup;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      fromSiloId:  ['', Validators.required],
      toSiloId:    ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.loadSilos();
  }

  // ════════════════════════════════════════════════════════════
  // SILO LOADING
  // ════════════════════════════════════════════════════════════

  private loadSilos() {
    this.loadingSilos = true;

    // Load ALL silos for the "To Silo" picker
    this.api.getSilos().subscribe({
      next: (all) => {
        this.allSilos = all;
        this.filteredAllSilos = all;
        this.loadingSilos = false;
      },
      error: () => { this.loadingSilos = false; }
    });

    // Load user's memberships to populate "From Silo" + selector bar
    if (typeof (this.api as any).getMyMemberships === 'function') {
      (this.api as any).getMyMemberships().subscribe({
        next: (memberships: { siloId: string }[]) => {
          const myIds = new Set(memberships.map(m => m.siloId));
          // We need full silo objects — wait for allSilos then filter
          this.waitForSilosAndFilterMine(myIds);
        },
        error: () => {
          // Fallback: use all silos as "my silos" so the UI still works
          this.mySilos = this.allSilos;
        }
      });
    } else {
      // No membership endpoint — use all silos as fallback
      this.api.getSilos().subscribe({ next: s => this.mySilos = s, error: () => {} });
    }
  }

  private waitForSilosAndFilterMine(myIds: Set<string>) {
    // allSilos may not be loaded yet — poll briefly
    if (this.allSilos.length > 0) {
      this.mySilos = this.allSilos.filter(s => myIds.has(s.id));
      if (this.mySilos.length > 0) {
        // Auto-select first silo for convenience
        this.selectSilo(this.mySilos[0].id);
      }
    } else {
      setTimeout(() => this.waitForSilosAndFilterMine(myIds), 200);
    }
  }

  // ════════════════════════════════════════════════════════════
  // SILO SELECTION
  // ════════════════════════════════════════════════════════════

  selectSilo(id: string) {
    this.selectedSiloId = id;
    this.loadConsultations();
  }

  switchTab(t: 'incoming' | 'outgoing') {
    this.tab = t;
    if (this.selectedSiloId) this.loadConsultations();
  }

  getCount(t: 'incoming' | 'outgoing'): number {
    return t === 'incoming' ? this.incomingCount : this.outgoingCount;
  }

  // ════════════════════════════════════════════════════════════
  // CONSULTATIONS
  // ════════════════════════════════════════════════════════════

  loadConsultations() {
    if (!this.selectedSiloId) return;
    this.loading = true;

    const req$ = this.tab === 'incoming'
      ? this.api.getIncomingConsultations(this.selectedSiloId)
      : this.api.getOutgoingConsultations(this.selectedSiloId);

    req$.subscribe({
      next: (c) => {
        this.consultations = c;
        // Update badge count for current tab
        if (this.tab === 'incoming') this.incomingCount = c.filter(x => x.status === 'OPEN' || x.status === 'PENDING').length;
        else this.outgoingCount = c.length;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  respond(id: string) {
    const msg = this.responseMessages[id]?.trim();
    if (!msg || this.responding[id]) return;

    this.responding[id] = true;

    this.api.respondConsultation(id, msg).subscribe({
      next: () => {
        // Update locally — no full reload needed
        const c = this.consultations.find(x => x.id === id);
        if (c) {
          c.status = 'RESPONDED' as any;
          c.responseMessage = msg;
        }
        this.responseMessages[id] = '';
        this.responding[id] = false;
        this.incomingCount = Math.max(0, this.incomingCount - 1);
        this.toast.success('Response sent!');
      },
      error: (err) => {
        this.responding[id] = false;
        this.toast.error(err?.error?.message || 'Failed to send response.');
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // MODAL — CREATE CONSULTATION
  // ════════════════════════════════════════════════════════════

  openModal() {
    this.error = '';
    this.siloSearch = '';
    this.selectedToSilo = null;
    this.filteredAllSilos = this.allSilos;
    this.form.reset();

    // Pre-fill fromSiloId with currently selected silo
    if (this.selectedSiloId) {
      this.form.patchValue({ fromSiloId: this.selectedSiloId });
    }

    this.showModal = true;
  }

  filterSilos() {
    const q = this.siloSearch.toLowerCase().trim();
    this.filteredAllSilos = q
      ? this.allSilos.filter(s => s.skill.toLowerCase().includes(q))
      : this.allSilos;
  }

  selectToSilo(silo: Silo) {
    // Prevent selecting own silo as target
    if (this.form.get('fromSiloId')?.value === silo.id) return;

    this.selectedToSilo = silo;
    this.form.patchValue({ toSiloId: silo.id });
    this.siloSearch = '';
    this.filteredAllSilos = this.allSilos; // reset filter
  }

  clearToSilo() {
    this.selectedToSilo = null;
    this.form.patchValue({ toSiloId: '' });
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
        this.selectedToSilo = null;
        this.toast.success('Consultation request sent!');
        // Reload outgoing tab to show the new request
        this.tab = 'outgoing';
        this.loadConsultations();
      },
      error: (e) => {
        this.error = e.error?.message || 'Failed to send request.';
        this.submitting = false;
      }
    });
  }
}
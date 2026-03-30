import { Component, OnInit } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Footer } from "../footer/footer";
import { Silo } from '../../shared/models';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-silos',
  standalone: true,
  imports: [Navbar, Footer, CommonModule, FormsModule],
  template: `
    <app-navbar></app-navbar>

    <!-- Toast notification -->
    <div class="toast" [class.show]="toastVisible" [class.toast-error]="toastType==='error'" [class.toast-success]="toastType==='success'">
      <span class="toast-icon">{{ toastType === 'error' ? '⚠️' : '✅' }}</span>
      <span class="toast-msg">{{ toastMessage }}</span>
    </div>

    <div id="page-silos" class="page active">
      <div class="page-hero">
        <div class="container">
          <div class="tag" style="margin: 0 auto 16px;">● {{ silos.length }}+ Skill Communities</div>
          <h1>Discover Your <span class="yellow">Silo</span></h1>
          <p>Find your tribe, tackle challenges, sync with other silos, and level up your skills with a focused community.</p>
          <div style="display: flex; gap: 12px; justify-content: center; margin-top: 28px; flex-wrap: wrap;">
            <button class="btn btn-primary btn-lg" (click)="createSilo()">Create New Silo</button>
            <button class="btn btn-dark btn-lg" (click)="scrollToSilos()">Browse All →</button>
          </div>
        </div>
      </div>

      <section class="section" id="silos-list">
        <div class="container">

          <!-- Filters row -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; flex-wrap: wrap; gap: 16px;">

            <!-- Skill category tabs -->
            <div class="skills-tabs">
              <button class="tab-btn" [class.active]="activeTab==='All'" (click)="filterTab('All')">All</button>
              <button class="tab-btn" [class.active]="activeTab==='Tech'" (click)="filterTab('Tech')">Tech</button>
              <button class="tab-btn" [class.active]="activeTab==='Design'" (click)="filterTab('Design')">Design</button>
              <button class="tab-btn" [class.active]="activeTab==='Business'" (click)="filterTab('Business')">Business</button>
              <button class="tab-btn" [class.active]="activeTab==='Data'" (click)="filterTab('Data')">Data</button>
              <button class="tab-btn" [class.active]="activeTab==='Marketing'" (click)="filterTab('Marketing')">Marketing</button>
            </div>

            <!-- Search + Level filter + Sort -->
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
              <input
                placeholder="🔍  Search silos..."
                [(ngModel)]="searchQuery"
                (input)="applyFilters()"
                style="background: var(--dark2); border: 1px solid var(--border); border-radius: 10px; padding: 10px 16px; font-size: 14px; color: var(--text); width: 220px; outline: none; font-family: 'DM Sans', sans-serif;">

              <!-- Level filter -->
              <div class="level-filter">
                <button
                  class="level-btn"
                  [class.active]="activeLevel==='ALL'"
                  (click)="filterLevel('ALL')">All Levels</button>
                <button
                  class="level-btn beginner"
                  [class.active]="activeLevel==='BEGINNER'"
                  (click)="filterLevel('BEGINNER')">Beginner</button>
                <button
                  class="level-btn intermediate"
                  [class.active]="activeLevel==='INTERMEDIATE'"
                  (click)="filterLevel('INTERMEDIATE')">Intermediate</button>
                <button
                  class="level-btn advanced"
                  [class.active]="activeLevel==='ADVANCED'"
                  (click)="filterLevel('ADVANCED')">Advanced</button>
              </div>

              <button class="btn btn-dark" (click)="sortSilos()">Sort A–Z ▾</button>
            </div>
          </div>

          <!-- Results summary -->
          <div style="margin-bottom: 20px; font-size: 14px; color: var(--text-muted);">
            Showing <strong style="color: var(--white);">{{ filteredSilos.length }}</strong> silo{{ filteredSilos.length !== 1 ? 's' : '' }}
            <span *ngIf="isLoggedIn" style="margin-left: 12px; color: var(--text-muted);">
              · <span style="color: #4ade80;">{{ joinedSiloIds.size }} joined</span>
            </span>
          </div>

          <!-- Silos grid -->
          <div class="grid-3">
            <div class="silo-card" *ngFor="let silo of filteredSilos">

              <div class="silo-card-header">
                <div class="silo-card-icon" [style.background]="getLevelIconBg(silo.level)">
                  {{ getLevelEmoji(silo.level) }}
                </div>
                <span class="silo-card-status" [ngClass]="getLevelStatusClass(silo.level)">
                  {{ silo.level || 'Active' }}
                </span>
              </div>

              <div class="silo-card-body">
                <h3>{{ silo.skill }}</h3>
                <p style="font-size:13px; color: var(--text-muted); margin-bottom: 8px;">
                  Level: <strong style="color: var(--text-sub);">{{ silo.level }}</strong>
                </p>
                <p>Created by: {{ silo.creator?.name || 'Community' }}</p>

                <div class="silo-card-stats">
                  <div class="silo-stat">
                    <div class="silo-stat-num">{{ silo._count?.members || 0 }}</div>
                    <div class="silo-stat-label">Members</div>
                  </div>
                  <div class="silo-stat">
                    <div class="silo-stat-num">{{ silo._count?.challenges || 0 }}</div>
                    <div class="silo-stat-label">Challenges</div>
                  </div>
                </div>
              </div>

              <div class="silo-card-footer">
                <!-- Already joined badge -->
                <button
                  *ngIf="isJoined(silo.id)"
                  class="btn btn-joined"
                  disabled>
                  ✓ Joined
                </button>

                <!-- Join button (for non-joined or guest) -->
                <button
                  *ngIf="!isJoined(silo.id)"
                  class="btn btn-primary"
                  [disabled]="joining[silo.id]"
                  (click)="joinSilo(silo)">
                  {{ joining[silo.id] ? 'Joining...' : 'Join Silo' }}
                </button>
              </div>

            </div>
          </div>

          <!-- Loading / empty states -->
          <div *ngIf="loading" class="empty-state">
            <div class="loader"></div>
            <p>Loading silos...</p>
          </div>

          <div *ngIf="!loading && filteredSilos.length === 0" class="empty-state">
            <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
            <h3>No silos found</h3>
            <p>Try adjusting your filters or search query.</p>
            <button class="btn btn-primary" style="margin-top: 16px;" (click)="resetFilters()">Reset Filters</button>
          </div>

          <!-- Cross-silo box -->
          <div class="cross-silo-box">
            <div class="cross-silo-icon">🔗</div>
            <div class="cross-silo-text">
              <h3>Cross-Silo Collaboration</h3>
              <p>Need help from a different skill domain? Post a Cross-Silo request and connect with experts from other silos.</p>
            </div>
            <div class="cross-silo-action">
              <button class="btn btn-primary btn-lg" (click)="postCrossSilo()">Post a Request</button>
            </div>
          </div>

        </div>
      </section>
    </div>

    <app-footer></app-footer>
  `,
  styles: `
  h1, h2, h3, h4, h5 {
    font-family: 'Syne', sans-serif;
    line-height: 1.15;
  }

  /* ─── TOAST ─── */
  .toast {
    position: fixed;
    top: 90px;
    right: 24px;
    z-index: 9999;
    background: var(--card-bg, #1a1a1a);
    border: 1px solid var(--border, #2a2a2a);
    border-radius: 12px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text, #fff);
    box-shadow: 0 16px 40px rgba(0,0,0,0.5);
    opacity: 0;
    transform: translateX(40px);
    pointer-events: none;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    max-width: 340px;
  }

  .toast.show {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
  }

  .toast.toast-error { border-color: rgba(248, 113, 113, 0.4); background: rgba(248,113,113,0.08); }
  .toast.toast-success { border-color: rgba(74,222,128,0.4); background: rgba(74,222,128,0.08); }
  .toast-icon { font-size: 18px; }
  .toast-msg { line-height: 1.4; }

  /* ─── LEVEL FILTER ─── */
  .level-filter {
    display: flex;
    gap: 4px;
    background: var(--dark2, #111);
    border: 1px solid var(--border, #2a2a2a);
    border-radius: 10px;
    padding: 4px;
  }

  .level-btn {
    padding: 7px 14px;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    color: var(--text-muted, #777);
    background: transparent;
    border: none;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .level-btn:hover { color: var(--white, #fff); background: rgba(255,255,255,0.06); }
  .level-btn.active { color: var(--dark, #000); font-weight: 700; }

  .level-btn.beginner.active { background: #4ade80; }
  .level-btn.intermediate.active { background: #facc15; }
  .level-btn.advanced.active { background: #f87171; }
  .level-btn:not(.beginner):not(.intermediate):not(.advanced).active {
    background: var(--yellow, #f5c518);
    color: var(--dark, #000);
  }

  /* ─── JOINED BUTTON ─── */
  .btn-joined {
    background: rgba(74,222,128,0.12);
    color: #4ade80;
    border: 1px solid rgba(74,222,128,0.3);
    cursor: default;
    font-weight: 600;
  }

  /* ─── LOADER ─── */
  .loader {
    width: 40px; height: 40px;
    border: 3px solid var(--border, #2a2a2a);
    border-top-color: var(--yellow, #f5c518);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-muted, #777);
  }

  .empty-state h3 { font-size: 20px; color: var(--text, #fff); margin-bottom: 8px; }

  /* ─── EXISTING STYLES (preserved from original) ─── */
  .display-font { font-family: 'Clash Display', sans-serif; }

  .btn {
    padding: 10px 24px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    font-family: 'DM Sans', sans-serif;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

  .btn-primary {
    background: var(--yellow, #f5c518);
    color: var(--dark, #000);
  }

  .btn-primary:not(:disabled):hover {
    background: var(--yellow-light, #ffd700);
    box-shadow: var(--yellow-glow, 0 0 20px rgba(245,197,24,0.3));
    transform: translateY(-1px);
  }

  .btn-outline {
    background: transparent;
    color: var(--yellow, #f5c518);
    border: 2px solid var(--yellow, #f5c518);
  }

  .btn-outline:hover { background: var(--yellow, #f5c518); color: var(--dark, #000); }

  .btn-lg { padding: 14px 32px; font-size: 16px; border-radius: 12px; }

  .btn-dark {
    background: var(--gray, #222);
    color: var(--text, #fff);
    border: 1px solid var(--border, #2a2a2a);
  }

  .btn-dark:hover { background: var(--gray2, #333); }

  .page { display: none; }
  .page.active { display: block; }

  .section { padding: 100px 0; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 48px; }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: rgba(245,197,24,0.12);
    color: var(--yellow, #f5c518);
    border: 1px solid rgba(245,197,24,0.25);
    margin-bottom: 20px;
  }

  .yellow { color: var(--yellow, #f5c518); }

  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }

  .page-hero {
    background: linear-gradient(180deg, var(--dark2, #111) 0%, var(--dark, #0d0d0d) 100%);
    border-bottom: 1px solid var(--border, #2a2a2a);
    padding: 80px 0 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .page-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 50% 80% at 50% 100%, rgba(245,197,24,0.08) 0%, transparent 70%);
  }

  .page-hero h1 { font-size: clamp(36px, 5vw, 64px); font-weight: 800; position: relative; }
  .page-hero p { font-size: 18px; color: var(--text-sub, #aaa); margin-top: 16px; max-width: 600px; margin-left: auto; margin-right: auto; position: relative; }

  .silo-card {
    background: var(--card-bg, #161616);
    border: 1px solid var(--border, #2a2a2a);
    border-radius: var(--radius, 16px);
    overflow: hidden;
    transition: all 0.3s;
    cursor: pointer;
  }

  .silo-card:hover { border-color: rgba(245,197,24,0.35); transform: translateY(-5px); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }

  .silo-card-header {
    padding: 28px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .silo-card-icon {
    width: 56px; height: 56px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
  }

  .silo-card-status {
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .status-beginner { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.25); }
  .status-intermediate { background: rgba(245,197,24,0.12); color: var(--yellow, #f5c518); border: 1px solid rgba(245,197,24,0.3); }
  .status-advanced { background: rgba(248,113,113,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
  .status-active { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.25); }

  .silo-card-body { padding: 0 28px 28px; }
  .silo-card-body h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
  .silo-card-body p { font-size: 14px; color: var(--text-muted, #777); line-height: 1.6; margin-bottom: 4px; }

  .silo-card-stats {
    display: flex;
    gap: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--border, #2a2a2a);
    margin-top: 16px;
  }

  .silo-stat { display: flex; flex-direction: column; gap: 2px; }
  .silo-stat-num { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: var(--yellow, #f5c518); }
  .silo-stat-label { font-size: 12px; color: var(--text-muted, #777); }

  .silo-card-footer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 16px 28px;
    background: rgba(255,255,255,0.02);
    border-top: 1px solid var(--border, #2a2a2a);
  }

  .skills-tabs {
    display: flex;
    gap: 4px;
    background: var(--dark2, #111);
    border: 1px solid var(--border, #2a2a2a);
    border-radius: 12px;
    padding: 6px;
    width: fit-content;
  }

  .tab-btn {
    padding: 9px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    color: var(--text-muted, #777);
    background: transparent;
    border: none;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }

  .tab-btn.active, .tab-btn:hover {
    background: var(--yellow, #f5c518);
    color: var(--dark, #000);
    font-weight: 600;
  }

  .cross-silo-box {
    background: linear-gradient(135deg, rgba(245,197,24,0.08) 0%, rgba(245,197,24,0.02) 100%);
    border: 1px solid rgba(245,197,24,0.2);
    border-radius: var(--radius, 16px);
    padding: 40px;
    margin-top: 60px;
    display: flex;
    align-items: center;
    gap: 40px;
  }

  .cross-silo-icon { font-size: 64px; }
  .cross-silo-text h3 { font-size: 26px; font-weight: 700; margin-bottom: 8px; }
  .cross-silo-text p { font-size: 15px; color: var(--text-sub, #aaa); line-height: 1.65; max-width: 480px; }
  .cross-silo-action { margin-left: auto; flex-shrink: 0; }

  @media (max-width: 900px) {
    .container { padding: 0 20px; }
    .grid-3 { grid-template-columns: 1fr; }
    .cross-silo-box { flex-direction: column; }
    .cross-silo-action { margin: 0; }
    .level-filter { flex-wrap: wrap; }
  }
  `,
})
export class Silos implements OnInit {
  silos: Silo[] = [];
  filteredSilos: Silo[] = [];
  joinedSiloIds = new Set<string>(); // tracks which silos the logged-in user has joined

  joining: { [key: string]: boolean } = {};

  searchQuery: string = '';
  activeTab: string = 'All';
  activeLevel: string = 'ALL';
  loading: boolean = false;

  // Toast state
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimer: any;

  constructor(private api: ApiService, private router: Router) {}

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('ss_token'); // ← direct read, no api service indirection
  }

  ngOnInit() {
    this.loadSilos();
  }

  loadSilos() {
    this.loading = true;

    const silos$ = this.isLoggedIn
      ? this.api.getSilos()
      : this.api.getSilosWithoutAuth();

    silos$.subscribe({
      next: (data: Silo[]) => {
        this.silos = data;
        this.loading = false;

        if (this.isLoggedIn) {
          this.loadMyMemberships();
        } else {
          this.applyFilters();
        }
      },
      error: (err) => {
        console.error('Failed to load silos', err);
        this.loading = false;
        this.silos = [];
        this.applyFilters();
      }
    });
  }

  /**
   * Loads the current user's silo memberships so we can mark silos as joined.
   * Calls GET /silos/my — add getMyMemberships() to your ApiService (see instructions below).
   * Falls back gracefully if the endpoint doesn't exist yet.
   */
  loadMyMemberships() {
    // Try to call getMyMemberships if it exists on the api service
    if (typeof (this.api as any).getMyMemberships === 'function') {
      (this.api as any).getMyMemberships().subscribe({
        next: (memberships: any[]) => {
          // memberships is expected to be an array of { siloId: string, ... }
          this.joinedSiloIds = new Set(memberships.map((m: any) => m.siloId));
          this.applyFilters();
        },
        error: () => {
          // If endpoint fails, just show silos without joined state
          this.applyFilters();
        }
      });
    } else {
      // No getMyMemberships method available — apply filters without membership info
      this.applyFilters();
    }
  }

  applyFilters() {
    let result = [...this.silos];

    // Tab (keyword) filter
    if (this.activeTab !== 'All') {
      result = result.filter(s =>
        s.skill?.toLowerCase().includes(this.activeTab.toLowerCase())
      );
    }

    // Level filter
    if (this.activeLevel !== 'ALL') {
      result = result.filter(s => s.level === this.activeLevel);
    }

    // Search filter
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(s => s.skill?.toLowerCase().includes(q));
    }

    this.filteredSilos = result;
  }

  filterTab(tab: string) {
    this.activeTab = tab;
    this.applyFilters();
  }

  filterLevel(level: string) {
    this.activeLevel = level;
    this.applyFilters();
  }

  sortSilos() {
    this.filteredSilos = [...this.filteredSilos].sort((a, b) =>
      (a.skill || '').localeCompare(b.skill || '')
    );
  }

  resetFilters() {
    this.searchQuery = '';
    this.activeTab = 'All';
    this.activeLevel = 'ALL';
    this.applyFilters();
  }

  isJoined(siloId: string): boolean {
    return this.joinedSiloIds.has(siloId);
  }

  joinSilo(silo: Silo) {
    // Read token directly every time — no caching, no getter
    const token = localStorage.getItem('ss_token');
  
    if (!token) {
      this.showToast('You are not logged in. Redirecting to login...', 'error');
      setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      return;
    }
  
    if (this.isJoined(silo.id)) return;
  
    this.joining[silo.id] = true;
  
    this.api.joinSilo(silo.id).subscribe({
      next: () => {
        this.joining[silo.id] = false;
        this.joinedSiloIds.add(silo.id);
  
        if (silo._count) {
          silo._count.members = (silo._count.members || 0) + 1;
        } else {
          (silo as any)._count = { members: 1, challenges: 0 };
        }
  
        this.showToast(`Successfully joined "${silo.skill}"!`, 'success');
      },
      error: (err) => {
        this.joining[silo.id] = false;
        const msg = err?.error?.message || 'Failed to join silo. Please try again.';
  
        if (msg.toLowerCase().includes('already')) {
          this.joinedSiloIds.add(silo.id);
          this.showToast('You are already a member of this silo.', 'error');
        } else if (err.status === 401) {
          localStorage.removeItem('access_token'); // kill stale token
          this.showToast('Session expired. Redirecting to login...', 'error');
          setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        } else {
          this.showToast(msg, 'error');
        }
      }
    });
  }
  showToast(message: string, type: 'success' | 'error' = 'success') {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
    }, 3500);
  }

  // ── Level helper methods ──────────────────────────────────────

  getLevelEmoji(level: string): string {
    switch (level) {
      case 'BEGINNER': return '🌱';
      case 'INTERMEDIATE': return '⚡';
      case 'ADVANCED': return '🔥';
      default: return '📦';
    }
  }

  getLevelIconBg(level: string): string {
    switch (level) {
      case 'BEGINNER': return 'rgba(74,222,128,0.12)';
      case 'INTERMEDIATE': return 'rgba(245,197,24,0.12)';
      case 'ADVANCED': return 'rgba(248,113,113,0.12)';
      default: return 'rgba(255,255,255,0.06)';
    }
  }

  getLevelStatusClass(level: string): string {
    switch (level) {
      case 'BEGINNER': return 'silo-card-status status-beginner';
      case 'INTERMEDIATE': return 'silo-card-status status-intermediate';
      case 'ADVANCED': return 'silo-card-status status-advanced';
      default: return 'silo-card-status status-active';
    }
  }

  // ── Navigation ────────────────────────────────────────────────

  scrollToSilos() {
    document.getElementById('silos-list')?.scrollIntoView({ behavior: 'smooth' });
  }

  createSilo() {
    if (!this.isLoggedIn) {
      this.showToast('Please log in to create a silo.', 'error');
      setTimeout(() => this.router.navigate(['/login']), 2000);
      return;
    }
    this.router.navigate(['/create-silo']);
  }

  postCrossSilo() {
    if (!this.isLoggedIn) {
      this.showToast('Please log in to post a cross-silo request.', 'error');
      setTimeout(() => this.router.navigate(['/login']), 2000);
      return;
    }
    this.router.navigate(['/cross-silo']);
  }
}